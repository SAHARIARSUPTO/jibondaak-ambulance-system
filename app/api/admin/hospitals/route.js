import { NextResponse } from "next/server";
import {
  createHospital,
  updateHospital,
  deleteHospital,
  listHospitalsByLocation,
  getHospitalById,
  isMongoConnectivityError,
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

// GET: List hospitals by location
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const division_id = searchParams.get("division_id");
    const district_id = searchParams.get("district_id");
    const upazila_id = searchParams.get("upazila_id");
    const hospitals = await listHospitalsByLocation({
      division_id,
      district_id,
      upazila_id,
    });
    return NextResponse.json({
      success: true,
      hospitals: hospitals.map(sanitizeHospital),
    });
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
          : error.message || "Failed to load hospitals",
      },
      { status: isConnError ? 503 : 500 },
    );
  }
}

// POST: Create hospital
export async function POST(request) {
  try {
    const body = await request.json();
    const doc = await createHospital(body);
    return NextResponse.json({ success: true, hospital: sanitizeHospital(doc) });
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
          : e.message || "Failed to create hospital",
      },
      { status: isConnError ? 503 : 500 },
    );
  }
}

// PATCH: Update hospital
export async function PATCH(request) {
  try {
    const body = await request.json().catch(() => null);
    const hospitalId = String(body?.hospitalId || "").trim();
    const patch = { ...(body || {}) };
    delete patch.hospitalId;

    if (!hospitalId) {
      return NextResponse.json(
        { success: false, error: "Hospital ID is required" },
        { status: 400 },
      );
    }

    const doc = await updateHospital(hospitalId, patch);

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Hospital record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, hospital: sanitizeHospital(doc) });
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
          : e.message || "Failed to update hospital",
      },
      { status: isConnError ? 503 : 500 },
    );
  }
}

// DELETE: Delete hospital
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hospitalId = searchParams.get("hospitalId");
    if (!hospitalId) {
      return NextResponse.json(
        { success: false, error: "Hospital ID is required" },
        { status: 400 },
      );
    }

    await deleteHospital(hospitalId);
    return NextResponse.json({ success: true });
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
          : e.message || "Failed to delete hospital",
      },
      { status: isConnError ? 503 : 500 },
    );
  }
}
