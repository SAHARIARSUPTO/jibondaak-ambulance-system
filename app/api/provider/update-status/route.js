import { NextResponse } from "next/server";
import { updateBookingStatus, upsertDriverProfile } from "@/lib/dbStore";

const ALLOWED = new Set([
  "driver_assigned",
  "en_route",
  "arrived",
  "trip_started",
  "awaiting_seeker_approval",
  "destination_reached",
  "completed",
  "cancelled",
]);

export async function POST(request) {
  try {
    const body = await request.json();
    const { bookingId, status, latitude, longitude, providerId, reason } =
      body || {};
    if (!bookingId || !status || !ALLOWED.has(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid bookingId or status" },
        { status: 400 },
      );
    }
    const patch = {};
    if (typeof latitude === "number" && typeof longitude === "number") {
      patch.driverCurrentLocation = {
        latitude,
        longitude,
        updatedAt: new Date(),
      };
    }

    if (status === "cancelled" && reason) {
      patch.cancellationReason = reason;
      patch.cancelledAt = new Date();
    }

    // Logic: When driver marks completed, it goes to seeker for approval
    // When driver marks destination reached, it updates the state accordingly
    let resolvedStatus = status;
    if (status === "completed") resolvedStatus = "awaiting_seeker_approval";

    const booking = await updateBookingStatus(bookingId, resolvedStatus, patch);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 },
      );
    }
    if (
      providerId &&
      typeof latitude === "number" &&
      typeof longitude === "number"
    ) {
      await upsertDriverProfile(providerId, { lat: latitude, lng: longitude });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking status" },
      { status: 500 },
    );
  }
}
