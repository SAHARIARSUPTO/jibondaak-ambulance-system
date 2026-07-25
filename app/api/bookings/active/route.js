import { NextResponse } from "next/server";
import { getActiveBookingByUserId, listActiveBookings, getDb } from "@/lib/dbStore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const hospitalId = searchParams.get("hospitalId");

    if (!userId && !hospitalId) {
      return NextResponse.json(
        { success: false, error: "userId or hospitalId is required" },
        { status: 400 },
      );
    }

    let booking = null;

    if (userId) {
      // Get active booking for a specific user (seeker)
      booking = await getActiveBookingByUserId(userId);
    } else if (hospitalId) {
      // Get active booking for a hospital
      const db = await getDb();
      const ACTIVE_STATUSES = [
        "pending_driver_acceptance",
        "driver_assigned",
        "en_route",
        "arrived",
        "trip_started",
        "awaiting_seeker_approval",
        "destination_reached",
      ];
      
      booking = await db.collection("bookings").findOne(
        {
          targetHospitalId: String(hospitalId),
          status: { $in: ACTIVE_STATUSES },
        },
        { sort: { createdAt: -1 } }
      );
    }

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
