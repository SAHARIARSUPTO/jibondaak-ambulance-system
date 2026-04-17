import { NextResponse } from "next/server";
import { rejectRequest } from "@/lib/bookingStore";

export async function POST(request) {
  try {
    const body = await request.json();
    const { requestId, providerId } = body || {};
    if (!requestId) {
      return NextResponse.json(
        { success: false, error: "requestId is required" },
        { status: 400 },
      );
    }

    const booking = rejectRequest(requestId, providerId);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Request already handled or not found" },
        { status: 409 },
      );
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to reject request" },
      { status: 500 },
    );
  }
}

