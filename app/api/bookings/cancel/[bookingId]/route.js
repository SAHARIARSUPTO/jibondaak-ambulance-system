import { NextResponse } from "next/server";
import { cancelBookingById } from "@/lib/bookingStore";

export async function POST(request, { params }) {
  try {
    const bookingId = params?.bookingId;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Invalid booking id" },
        { status: 400 },
      );
    }

    const booking = cancelBookingById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, booking, message: "Booking cancelled" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to cancel booking" },
      { status: 500 },
    );
  }
}
