import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, division, district, upazila } = body || {};

    if (!userId || !division || !district || !upazila) {
      return NextResponse.json(
        { success: false, error: "userId, division, district and upazila are required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("jibondaak");
    const users = db.collection("users");
    const now = new Date();

    const query =
      ObjectId.isValid(String(userId))
        ? { _id: new ObjectId(String(userId)) }
        : { _id: String(userId) };

    const result = await users.findOneAndUpdate(
      query,
      {
        $set: {
          division: String(division),
          district: String(district),
          upazila: String(upazila),
          updatedAt: now,
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const { password: _pw, ...safeUser } = result;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update address" },
      { status: 500 },
    );
  }
}
