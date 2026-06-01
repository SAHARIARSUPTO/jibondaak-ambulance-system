import { NextResponse } from "next/server";
import {
  getHospitalByUserId,
  getHospitalById,
  listHospitalsByLocation,
} from "@/lib/dbStore";

const sanitizeHospital = (hospital) => {
  if (!hospital) return hospital;
  return {
    ...hospital,
    _id: String(hospital._id || ""),
    userId: hospital.userId ? String(hospital.userId) : "",
    username: hospital.username ? String(hospital.username) : "",
    division_id: hospital.division_id ? String(hospital.division_id) : "",
    district_id: hospital.district_id ? String(hospital.district_id) : "",
    upazila_id: hospital.upazila_id ? String(hospital.upazila_id) : "",
    assignedProviderIds: Array.isArray(hospital.assignedProviderIds)
      ? hospital.assignedProviderIds.map(String)
      : [],
  };
};

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
  const safeHospital = sanitizeHospital(hospital);
  delete safeHospital.password;

  return NextResponse.json({ success: true, hospital: safeHospital });
}
