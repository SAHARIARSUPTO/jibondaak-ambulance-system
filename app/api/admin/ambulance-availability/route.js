import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const { ambulanceId, isAvailable } = body;

    if (!ambulanceId || typeof isAvailable !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Ambulance ID and availability flag are required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(ambulanceId)) {
      return NextResponse.json(
        { success: false, error: "Invalid ambulance ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("jibondaak");

    const result = await db.collection("ambulances").updateOne(
      { _id: new ObjectId(ambulanceId) },
      { $set: { isAvailable } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Ambulance not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ambulanceId,
      isAvailable,
    });
  } catch (error) {
    console.error("Admin ambulance availability error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Update failed" },
      { status: 500 }
    );
  }
}
