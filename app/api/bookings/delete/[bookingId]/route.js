import { NextResponse } from "next/server";
import { deleteBookingById } from "@/lib/dbStore";

export async function DELETE(request, context) {
  try {
    const bookingId = context.params?.bookingId;
    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Invalid booking id" },
        { status: 400 },
      );
    }
    const deleted = await deleteBookingById(bookingId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, message: "Booking deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete booking" },
      { status: 500 },
    );
  }
}
