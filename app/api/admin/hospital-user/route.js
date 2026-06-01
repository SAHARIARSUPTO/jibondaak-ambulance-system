import { NextResponse } from "next/server";
import { isMongoConnectivityError, updateHospital } from "@/lib/dbStore";

// POST /api/admin/hospital-user
// { hospitalId, username, password }
export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    const hospitalId = String(body?.hospitalId || "").trim();
    const username = String(body?.username || "").trim();
    const password = String(body?.password || "");

    if (!hospitalId || !username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Hospital ID, username, and password are required",
        },
        { status: 400 },
      );
    }

    // Update the existing hospital with a userId (username) and password
    const doc = await updateHospital(hospitalId, {
      userId: username, // Used for login lookup
      username: username,
      password: password, // WARNING: Store hashed in real app
    });

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Hospital not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, hospital: doc });
  } catch (e) {
    const isConnError =
      isMongoConnectivityError(e) ||
      String(e?.message || "").includes(
        "Please add your Mongo URI to .env.local",
      );

    return NextResponse.json(
      {
        success: false,
        error: isConnError
          ? "Database connection failed. Check MONGODB_URI and Network Whitelist."
          : e.message || "Failed to create hospital login",
      },
      { status: isConnError ? 503 : 500 },
    );
  }
}
