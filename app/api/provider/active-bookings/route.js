import { NextResponse } from "next/server";
import { listActiveBookings } from "@/lib/bookingStore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("providerId");
  const bookings = listActiveBookings(providerId || undefined);
  return NextResponse.json({ success: true, bookings });
}

