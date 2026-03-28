import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const sanitizeUser = (user) => ({
  id: user._id?.toString?.() || null,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive,
  companyName: user.companyName,
  licenseNumber: user.licenseNumber,
  createdAt: user.createdAt?.toISOString?.() || null,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, isActive } = body;

    if (!userId || typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, error: "User ID and valid status are required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("jibondaak");

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { isActive } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const updated = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } });

    return NextResponse.json({
      success: true,
      user: sanitizeUser(updated),
    });
  } catch (error) {
    console.error("Admin update user status error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Update failed" },
      { status: 500 }
    );
  }
}
