import { NextResponse } from "next/server";
import { loadDrivers, loadRoutes, resolveFare } from "@/lib/dispatchUtils";
import {
  createDriverAssignmentNotification,
  getDriverById,
  getProviderOnline,
  getActiveBookingByUserId,
  saveBooking,
} from "@/lib/dbStore";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      userName,
      userPhone,
      userLocation,
      ambulanceType,
      userDivision,
      userUpazila,
      routeId,
      routeName,
      offeredFare,
      selectedDriverId,
      targetHospitalId,
      estimatedArrival,
      patientInfo,
    } = body || {};

    if (
      !userId ||
      !userLocation ||
      !ambulanceType ||
      !patientInfo ||
      !selectedDriverId
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required booking fields" },
        { status: 400 },
      );
    }

    const existingBooking = await getActiveBookingByUserId(String(userId));
    if (existingBooking) {
      return NextResponse.json({ success: true, booking: existingBooking });
    }

    const [allDrivers, routes] = await Promise.all([
      loadDrivers(), // Load static JSON drivers
      loadRoutes(),
    ]);

    // 1. Try finding driver in DB using the provided ID
    let driver = await getDriverById(selectedDriverId);

    // 2. Fallback to static JSON drivers if not found in DB
    if (!driver) {
      driver = allDrivers.find(
        (d) => d.id === selectedDriverId || d._id === selectedDriverId,
      );
    }

    if (!driver) {
      console.error(
        `Booking Failed: Driver not found for ID: ${selectedDriverId}`,
      );
      return NextResponse.json(
        { success: false, error: "Selected driver not found" },
        { status: 404 },
      );
    }

    const providerOnline = driver.providerId
      ? await getProviderOnline(driver.providerId)
      : true;

    if (
      userDivision &&
      driver.division_id?.toString() !== userDivision?.toString() &&
      userUpazila &&
      driver.upazila_id?.toString() !== userUpazila?.toString()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Driver is outside the requested service area",
        },
        { status: 400 },
      );
    }

    const selectedRoute = routes.find((r) => r.id === routeId);
    const finalFare =
      typeof offeredFare === "number"
        ? offeredFare
        : resolveFare({
            driverId: driver.id,
            routeId,
            routeBaseFare: selectedRoute?.baseFare,
            distance: 0,
          });

    const now = new Date();
    const booking = await saveBooking({
      userId: String(userId),
      userName: userName || "",
      userPhone: userPhone || "",
      userLocation,
      ambulanceType,
      routeId: routeId || null,
      routeName: routeName || selectedRoute?.name || "Local route",
      offeredFare: finalFare,
      targetHospitalId: targetHospitalId || null,
      estimatedArrival: estimatedArrival || null,
      providerId: driver.providerId || null,
      driverId: String(driver.id),
      driverInfo: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        age: driver.age,
        tripsCovered: driver.tripsCovered,
        rating: driver.rating,
        driverPhoto: driver.driverPhoto,
        ambulanceType: driver.ambulanceType,
        ambulanceNumber: driver.ambulanceNumber,
        ambulanceModel: driver.ambulanceModel,
        division_id: driver.division_id,
        upazila_id: driver.upazila_id,
      },
      patientInfo,
      triageInfo: {
        age: patientInfo?.age || "",
        gender: patientInfo?.gender || "N/A",
        condition: patientInfo?.symptoms || "",
      },
      status: "pending_driver_acceptance",
      driverCurrentLocation: {
        latitude: Number(driver.lat) || 23.8103,
        longitude: Number(driver.lng) || 90.4125,
        updatedAt: now,
      },
      createdAt: now,
      updatedAt: now,
    });

    if (driver.providerId) {
      await createDriverAssignmentNotification({
        bookingId: booking._id,
        providerId: driver.providerId,
        driverId: driver.id,
        isOnline: providerOnline,
      });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
