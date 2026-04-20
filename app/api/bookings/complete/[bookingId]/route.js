import { NextResponse } from "next/server";
import { getBookingById, updateBookingStatus } from "@/lib/dbStore";

export async function POST(request, { params }) {
  try {
    const { bookingId } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = body?.userId ? String(body.userId) : "";

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Invalid booking id" },
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

    if (userId && String(booking.userId) !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "You are not allowed to approve this booking",
        },
        { status: 403 },
      );
    }

    if (booking.status !== "awaiting_seeker_approval") {
      return NextResponse.json(
        { success: false, error: "Booking is not ready for seeker approval" },
        { status: 409 },
      );
    }

    const updated = await updateBookingStatus(bookingId, "completed", {
      seekerApprovedAt: new Date(),
    });
    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to complete booking" },
      { status: 500 },
    );
  }
}
