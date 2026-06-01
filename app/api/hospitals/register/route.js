import { NextResponse } from "next/server";
import {
  createHospital,
  getHospitalByUserId,
  isMongoConnectivityError,
} from "@/lib/dbStore";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      address,
      username,
      password,
      beds = 0,
      icu = 0,
      emergency_services = "",
      division_id,
      district_id,
      upazila_id,
    } = body;

    const trimmedUsername = String(username || "").trim();

    if (!name || !phone || !address || !trimmedUsername || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, phone, address, username, and password are required",
        },
        { status: 400 },
      );
    }

    const existingHospital = await getHospitalByUserId(trimmedUsername);
    if (existingHospital) {
      return NextResponse.json(
        { success: false, error: "That username is already in use" },
        { status: 409 },
      );
    }

    const hospital = await createHospital({
      name: String(name).trim(),
      phone: String(phone).trim(),
      address: String(address).trim(),
      userId: trimmedUsername,
      username: trimmedUsername,
      password: String(password),
      beds: Number(beds) || 0,
      icu: Number(icu) || 0,
      emergency_services: String(emergency_services || "").trim(),
      division_id: division_id ? String(division_id) : "",
      district_id: district_id ? String(district_id) : "",
      upazila_id: upazila_id ? String(upazila_id) : "",
      assignedProviderIds: [],
    });

    const safeHospital = { ...hospital };
    delete safeHospital.password;

    return NextResponse.json(
      { success: true, hospital: safeHospital },
      { status: 201 },
    );
  } catch (error) {
    const isConnError =
      isMongoConnectivityError(error) ||
      String(error?.message || "").includes(
        "Please add your Mongo URI to .env.local",
      );

    return NextResponse.json(
      {
        success: false,
        error: isConnError
          ? "Database connection failed. Check MONGODB_URI and Network Whitelist."
          : error.message || "Registration failed",
      },
      { status: isConnError ? 503 : 500 },
    );
  }
}