import { NextResponse } from "next/server";
import { listPendingRequests } from "@/lib/bookingStore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("providerId");
  const requests = listPendingRequests(providerId || undefined);
  return NextResponse.json({ success: true, requests });
}

