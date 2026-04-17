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

    // Invalid role check
    if (role && !allowedRoles.has(role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid role provided",
        },
        { status: 400 },
      );
    }

    // Basic validation
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 },
      );
    }

    // Provider validation
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

    const usersCollection = db.collection("users");

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existingUser = await usersCollection.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already exists",
        },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role: resolvedRole,
      createdAt: new Date(),
    };

    // Add provider-specific fields
    if (resolvedRole === "provider") {
      userData.companyName = companyName;
      userData.licenseNumber = licenseNumber;
    }

    const result = await usersCollection.insertOne(userData);

    // Safe response (no password)
    const newUser = {
      _id: result.insertedId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      companyName: userData.companyName || "",
      licenseNumber: userData.licenseNumber || "",
    };

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        user: newUser,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
