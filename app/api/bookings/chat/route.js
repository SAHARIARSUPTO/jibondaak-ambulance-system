import { NextResponse } from "next/server";
import { getBookingById, getChatMessages, makeLocalEntityId, saveChatMessage } from "@/lib/bookingStore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("bookingId");
  if (!bookingId) {
    return NextResponse.json(
      { success: false, error: "bookingId is required" },
      { status: 400 },
    );
  }
  return NextResponse.json({
    success: true,
    messages: getChatMessages(bookingId),
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { bookingId, senderId, senderRole, text } = body || {};
    if (!bookingId || !senderId || !senderRole || !text) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }
    const booking = getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 },
      );
    }
    const message = {
      _id: makeLocalEntityId("chat"),
      bookingId,
      senderId: String(senderId),
      senderRole,
      text: String(text).trim(),
      createdAt: new Date(),
    };
    saveChatMessage(bookingId, message);
    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 },
    );
  }
}

