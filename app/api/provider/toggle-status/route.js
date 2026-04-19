import { NextResponse } from "next/server";
import { setProviderOnline } from "@/lib/dbStore";

export async function POST(request) {
  try {
    const body = await request.json();
    const { providerId, isOnline } = body || {};
    if (!providerId) {
      return NextResponse.json(
        { success: false, error: "providerId is required" },
        { status: 400 },
      );
    }
    const value = await setProviderOnline(providerId, isOnline);
    return NextResponse.json({ success: true, isOnline: value });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update provider status" },
      { status: 500 },
    );
  }
}
