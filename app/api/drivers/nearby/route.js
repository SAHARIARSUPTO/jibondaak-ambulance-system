import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userDivision, userUpazila, ambulanceType } = await req.json();
    const client = await clientPromise;
    const db = client.db("jibondaak");

    // 1. Build the search query based on Seeker location
    let query = {
      division_id: userDivision?.toString(),
      // Only show drivers who are verified and not suspended
      isActive: { $ne: false }
    };

    // 2. Filter by Upazila if available for precise matching
    // We check if userUpazila is not 'undefined' or null
    if (userUpazila && userUpazila !== "undefined") {
      query.upazila_id = userUpazila.toString();
    }

    // 3. Filter by ambulance type if specified (and not 'all' or 'non-ac' default)
    if (ambulanceType && ambulanceType !== "non-ac") {
      query.ambulanceType = ambulanceType;
    }

    // 4. Fetch drivers from DB
    let drivers = await db.collection("drivers").find(query).toArray();

    // 5. Fallback logic: If no drivers found in the specific Upazila, 
    // show all drivers in the same Division so the user isn't left empty-handed.
    if (drivers.length === 0 && userUpazila) {
      drivers = await db.collection("drivers")
        .find({ division_id: userDivision.toString(), isActive: { $ne: false } })
        .limit(10)
        .toArray();
    }

    return NextResponse.json({ 
      success: true, 
      drivers: drivers.map(d => ({
        id: d._id.toString(),
        name: d.name,
        ambulanceModel: d.ambulanceModel || "Ambulance",
        ambulanceNumber: d.ambulanceNumber,
        ambulanceType: d.ambulanceType || "ac",
        distanceKm: (Math.random() * 4 + 1).toFixed(1), // Simulated distance for UI
        offeredFare: d.baseFare || 1200,
        rating: d.rating || 5
      }))
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}