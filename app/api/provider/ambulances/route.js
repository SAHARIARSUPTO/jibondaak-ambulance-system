import { NextResponse } from "next/server";
import {
  listProviderAmbulances,
  upsertDriverProfile,
  upsertProviderAmbulance,
  createProviderAmbulance,
} from "@/lib/dbStore";

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
    ambulances: await listProviderAmbulances(providerId),
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

    const ambulance = await createProviderAmbulance(providerId, {
      type: type || "non-ac",
      vehicleNumber,
      licenseNumber: licenseNumber || "",
      driverName,
      driverPhone,
      locationLabel: locationLabel || "",
      division_id: divisionId || null,
      upazila_id: upazilaId || null,
    });

    const driver = await upsertDriverProfile(providerId, {
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

    const existing = (await listProviderAmbulances(providerId))[0];
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Driver profile not found" },
        { status: 404 },
      );
    }

    const ambulance = await upsertProviderAmbulance(providerId, {
      type: type || existing.type,
      vehicleNumber: vehicleNumber || existing.vehicleNumber,
      licenseNumber: licenseNumber || existing.licenseNumber,
      driverName: driverName || existing.driverName,
      driverPhone: driverPhone || existing.driverPhone,
      locationLabel: locationLabel ?? existing.locationLabel,
      division_id: divisionId || null,
      upazila_id: upazilaId || null,
    });

    const driver = await upsertDriverProfile(providerId, {
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
