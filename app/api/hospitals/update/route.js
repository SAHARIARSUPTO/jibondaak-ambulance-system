import { NextResponse } from "next/server";
import { isMongoConnectivityError, updateHospital } from "@/lib/dbStore";

export async function PATCH(request) {
  try {
    const body = await request.json().catch(() => null);
    const hospitalId = String(body?.hospitalId || "").trim();
    const patch = body?.patch || {};

    if (!hospitalId) {
      return NextResponse.json(
        { success: false, error: "Hospital ID is required" },
        { status: 400 },
      );
    }

    // Prevent accidental modification of sensitive fields or _id
    if (patch._id) delete patch._id;
    if (patch.createdAt) delete patch.createdAt;
    if (patch.userId) delete patch.userId;
    if (patch.password) delete patch.password;

    const updated = await updateHospital(hospitalId, patch);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Hospital record not found" },
        { status: 404 },
      );
    }

    const safeHospital = { ...updated };
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
          : error.message || "Failed to update hospital",
      },
      { status: isConnError ? 503 : 500 },
    );
  }
}
