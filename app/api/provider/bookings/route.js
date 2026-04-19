import { NextResponse } from "next/server";
import { listBookingsByProvider } from "@/lib/dbStore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("providerId");
  if (!providerId) {
    return NextResponse.json(
      { success: false, error: "providerId is required" },
      { status: 400 },
    );
  }

  const bookings = await listBookingsByProvider(providerId);
  const earnings = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + Number(b.offeredFare || 0), 0);

  return NextResponse.json({
    success: true,
    bookings,
    earnings,
  });
}
