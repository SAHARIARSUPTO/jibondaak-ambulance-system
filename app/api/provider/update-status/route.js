import { NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/bookingStore";

const ALLOWED = new Set(["driver_assigned", "en_route", "arrived", "completed"]);

export async function POST(request) {
  try {
    const body = await request.json();
    const { bookingId, status, latitude, longitude } = body || {};
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
    const booking = updateBookingStatus(bookingId, status, patch);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update status" },
      { status: 500 },
    );
  }
}
