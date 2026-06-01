import { NextResponse } from "next/server";
import {
  getHospitalByUserId,
  isMongoConnectivityError,
} from "@/lib/dbStore";

// POST /api/hospitals/login
export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    const trimmedUsername = String(body?.username || "").trim();
    const password = String(body?.password || "");

    if (!trimmedUsername || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 },
      );
    }

    const hospital = await getHospitalByUserId(trimmedUsername);
    if (!hospital || hospital.password !== password) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const safeHospital = { ...hospital };
    delete safeHospital.password;

    return NextResponse.json({ success: true, hospital: safeHospital });
  } catch (error) {
    const isConnError =
      isMongoConnectivityError(error) ||
      String(error?.message || "").includes(
        "Please add your Mongo URI to .env.local",
      );

    return NextResponse.json(
      {
        success: false,
        error: isConnError
          ? "Database connection failed. Check MONGODB_URI and Network Whitelist."
          : error.message || "Hospital login failed",
      },
      { status: isConnError ? 503 : 500 },
    );
  }
}
