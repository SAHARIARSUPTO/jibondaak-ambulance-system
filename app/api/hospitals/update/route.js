import { NextResponse } from "next/server";
import { updateHospital } from "@/lib/dbStore";

export async function PATCH(request) {
  try {
    const { hospitalId, patch } = await request.json();

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

    return NextResponse.json({ success: true, hospital: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
