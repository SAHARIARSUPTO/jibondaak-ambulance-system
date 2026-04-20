import { NextResponse } from "next/server";
import { updateHospital } from "@/lib/dbStore";

// POST /api/admin/hospital-user
// { hospitalId, username, password }
export async function POST(request) {
  try {
    const { hospitalId, username, password } = await request.json();

    // Update the existing hospital with a userId (username) and password
    const doc = await updateHospital(hospitalId, {
      userId: username, // Used for login lookup
      username: username,
      password: password, // WARNING: Store hashed in real app
    });

    return NextResponse.json({ success: true, hospital: doc });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 },
    );
  }
}
