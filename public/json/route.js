import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true },
    );

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Booking cancellation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel booking" },
      { status: 500 },
    );
  }
}
