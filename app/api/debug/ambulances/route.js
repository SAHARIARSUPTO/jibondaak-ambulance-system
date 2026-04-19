import { NextResponse } from "next/server";
import { getDb } from "@/lib/dbStore";

// GET /api/debug/ambulances - Check ambulance data structure
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const divisionId = searchParams.get("division_id");
    const limit = parseInt(searchParams.get("limit") || "5");

    const db = await getDb();

    if (divisionId) {
      // Search for ambulances with specific division
      const ambulances = await db
        .collection("ambulances")
        .find({
          division_id: { $in: [String(divisionId), Number(divisionId)] },
        })
        .limit(limit)
        .toArray();

      return NextResponse.json({
        success: true,
        searchedDivisionId: divisionId,
        found: ambulances.length,
        ambulances,
      });
    } else {
      // Show sample of all ambulances
      const ambulances = await db
        .collection("ambulances")
        .find({})
        .limit(limit)
        .toArray();

      const withDivisionId = ambulances.filter((a) => a.division_id);
      const withoutDivisionId = ambulances.filter((a) => !a.division_id);

      return NextResponse.json({
        success: true,
        totalInDb: await db.collection("ambulances").countDocuments({}),
        sampleCount: ambulances.length,
        withDivisionId: withDivisionId.length,
        withoutDivisionId: withoutDivisionId.length,
        samples: ambulances.map((a) => ({
          _id: a._id,
          vehicleNumber: a.vehicleNumber,
          providerId: a.providerId,
          division_id: a.division_id,
          isAvailable: a.isAvailable,
        })),
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
