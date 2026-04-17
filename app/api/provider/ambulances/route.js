import { NextResponse } from "next/server";
import {
  addProviderAmbulance,
  hasProviderAmbulance,
  listProviderAmbulances,
  makeLocalEntityId,
  upsertProviderDriver,
} from "@/lib/bookingStore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("providerId");
  if (!providerId) {
    return NextResponse.json(
      { success: false, error: "providerId is required" },
      { status: 400 },
    );
  }
  return NextResponse.json({
    success: true,
    ambulances: listProviderAmbulances(providerId),
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      providerId,
      type,
      vehicleNumber,
      licenseNumber,
      driverName,
      driverPhone,
      locationLabel,
      divisionId,
      upazilaId,
      baseLatitude,
      baseLongitude,
    } = body || {};

    if (!providerId || !vehicleNumber || !driverName || !driverPhone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (hasProviderAmbulance(providerId)) {
      return NextResponse.json(
        { success: false, error: "Only one ambulance profile is allowed per driver account" },
        { status: 409 },
      );
    }

    const ambulance = {
      _id: makeLocalEntityId("amb"),
      providerId: String(providerId),
      type: type || "non-ac",
      vehicleNumber,
      licenseNumber: licenseNumber || "",
      driverName,
      driverPhone,
      locationLabel: locationLabel || "",
      isAvailable: true,
      createdAt: new Date(),
    };

    addProviderAmbulance(providerId, ambulance);

    const driver = upsertProviderDriver(providerId, {
      name: driverName,
      phone: driverPhone,
      ambulanceType: type || "non-ac",
      ambulanceNumber: vehicleNumber,
      ambulanceModel: "Driver Vehicle",
      driverPhoto: "",
      age: null,
      tripsCovered: 0,
      rating: 5,
      division_id: divisionId || null,
      upazila_id: upazilaId || null,
      lat: typeof baseLatitude === "number" ? baseLatitude : 23.8103,
      lng: typeof baseLongitude === "number" ? baseLongitude : 90.4125,
      locationLabel: locationLabel || "",
    });

    return NextResponse.json({ success: true, ambulance, driver });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to add ambulance" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      providerId,
      type,
      vehicleNumber,
      licenseNumber,
      driverName,
      driverPhone,
      locationLabel,
      divisionId,
      upazilaId,
      baseLatitude,
      baseLongitude,
    } = body || {};

    if (!providerId) {
      return NextResponse.json(
        { success: false, error: "providerId is required" },
        { status: 400 },
      );
    }

    const existing = listProviderAmbulances(providerId)[0];
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Driver profile not found" },
        { status: 404 },
      );
    }

    const ambulance = {
      ...existing,
      type: type || existing.type,
      vehicleNumber: vehicleNumber || existing.vehicleNumber,
      licenseNumber: licenseNumber || existing.licenseNumber,
      driverName: driverName || existing.driverName,
      driverPhone: driverPhone || existing.driverPhone,
      locationLabel: locationLabel ?? existing.locationLabel,
      updatedAt: new Date(),
    };

    addProviderAmbulance(providerId, ambulance);

    const driver = upsertProviderDriver(providerId, {
      name: ambulance.driverName,
      phone: ambulance.driverPhone,
      ambulanceType: ambulance.type,
      ambulanceNumber: ambulance.vehicleNumber,
      division_id: divisionId || null,
      upazila_id: upazilaId || null,
      lat: typeof baseLatitude === "number" ? baseLatitude : undefined,
      lng: typeof baseLongitude === "number" ? baseLongitude : undefined,
      locationLabel: ambulance.locationLabel || "",
    });

    return NextResponse.json({ success: true, ambulance, driver });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update driver profile" },
      { status: 500 },
    );
  }
}
