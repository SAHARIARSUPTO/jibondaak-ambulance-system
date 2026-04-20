import { NextResponse } from "next/server";
import { getHospitalByUserId } from "@/lib/dbStore";

// POST /api/hospitals/login
export async function POST(request) {
  const { username, password } = await request.json();
  // In production, use hashed passwords and a real user table!
  const hospital = await getHospitalByUserId(username);
  if (!hospital || hospital.password !== password) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 },
    );
  }
  return NextResponse.json({ success: true, hospital });
}
