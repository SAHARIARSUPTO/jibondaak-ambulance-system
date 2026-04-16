import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("jibondaak");

    const body = await request.json();
    const { name, email, phone, password, role, companyName, licenseNumber } =
      body;
    const allowedRoles = new Set(["seeker", "provider"]);
    const resolvedRole = role && allowedRoles.has(role) ? role : "seeker";

    if (role && !allowedRoles.has(role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid role provided",
        },
        { status: 400 },
      );
    }

    // Validate input
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 },
      );
    }

    // Additional validation for providers
    if (resolvedRole === "provider") {
      if (!companyName || !licenseNumber) {
        return NextResponse.json(
          {
            success: false,
            error: "Company name and license number are required for providers",
          },
          { status: 400 },
        );
      }
    }

    // Hash password before storing
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed");

    // Create user
    const usersCollection = db.collection("users");
    const result = await usersCollection.insertOne({
      name,
      email: email.trim().toLowerCase(), // Normalize email
      phone,
      password: hashedPassword,
      role: resolvedRole,
      createdAt: new Date(),
    });

    console.log("✅ User created successfully:", email);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 },
    );
  }
}
