import { NextResponse } from "next/server";
import { getAllDriverRouteFares, setRouteFare } from "@/lib/dbStore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const driverId = searchParams.get("driverId");
  if (!driverId) {
    return NextResponse.json(
      { success: false, error: "driverId is required" },
      { status: 400 },
    );
  }
  return NextResponse.json({
    success: true,
    fares: await getAllDriverRouteFares(driverId),
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { driverId, routeId, amount } = body || {};
    if (!driverId || !routeId || typeof amount !== "number") {
      return NextResponse.json(
        { success: false, error: "driverId, routeId and numeric amount are required" },
        { status: 400 },
      );
    }
    const fare = await setRouteFare(driverId, routeId, amount);
    return NextResponse.json({ success: true, fare });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to set fare" },
      { status: 500 },
    );
  }
}
