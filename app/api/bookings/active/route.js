import { NextResponse } from "next/server";
import { getActiveBookingByUserId } from "@/lib/dbStore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 },
      );
    }

    const booking = await getActiveBookingByUserId(userId);
    return NextResponse.json({
      success: true,
      booking: booking || null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch active booking" },
      { status: 500 },
    );
  }
}
