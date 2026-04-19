import { NextResponse } from "next/server";
import {
  createHospital,
  updateHospital,
  deleteHospital,
  listHospitalsByLocation,
  getHospitalById,
} from "@/lib/dbStore";

// GET: List hospitals by location
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const division_id = searchParams.get("division_id");
  const district_id = searchParams.get("district_id");
  const upazila_id = searchParams.get("upazila_id");
  const hospitals = await listHospitalsByLocation({
    division_id,
    district_id,
    upazila_id,
  });
  return NextResponse.json({ success: true, hospitals });
}

// POST: Create hospital
export async function POST(request) {
  try {
    const body = await request.json();
    const doc = await createHospital(body);
    return NextResponse.json({ success: true, hospital: doc });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 },
    );
  }
}

// PATCH: Update hospital
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { hospitalId, ...patch } = body;
    const doc = await updateHospital(hospitalId, patch);
    return NextResponse.json({ success: true, hospital: doc });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 },
    );
  }
}

// DELETE: Delete hospital
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hospitalId = searchParams.get("hospitalId");
    await deleteHospital(hospitalId);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 },
    );
  }
}
