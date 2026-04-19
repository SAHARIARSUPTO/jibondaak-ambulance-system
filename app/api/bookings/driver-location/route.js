import { NextResponse } from "next/server";
import { getBookingById } from "@/lib/dbStore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");
    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "bookingId is required" },
        { status: 400 },
      );
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      location: booking.driverCurrentLocation || null,
      status: booking.status,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch driver location" },
      { status: 500 },
    );
  }
}
