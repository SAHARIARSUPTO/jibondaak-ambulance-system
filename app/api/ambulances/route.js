import { NextResponse } from "next/server";
import { listAmbulancesByDivision } from "@/lib/dbStore";

// GET /api/ambulances?division_id=...
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const divisionId = searchParams.get("division_id");

    if (!divisionId) {
      return NextResponse.json(
        { success: false, error: "Division ID is required" },
        { status: 400 },
      );
    }

    // Find ambulances by division
    const ambulances = await listAmbulancesByDivision(divisionId);
    return NextResponse.json({ success: true, ambulances });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch ambulances" },
      { status: 500 },
    );
  }
}
