import { NextResponse } from "next/server";
import {
  getHospitalByUserId,
  getHospitalById,
  listHospitalsByLocation,
} from "@/lib/dbStore";

// GET /api/hospitals/dashboard?userId=...
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "userId required" },
      { status: 400 },
    );
  }
  // Try userId first
  let hospital = await getHospitalByUserId(userId);
  // Fallback: try _id
  if (!hospital) {
    hospital = await getHospitalById(userId);
  }
  if (!hospital) {
    return NextResponse.json(
      {
        success: false,
        error: `Hospital not found for userId or _id: ${userId}`,
      },
      { status: 404 },
    );
  }
  // Optionally, fetch live patient forwarding/bookings here
  // For now, just return hospital info
  return NextResponse.json({ success: true, hospital });
}
