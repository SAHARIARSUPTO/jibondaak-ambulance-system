import { NextResponse } from "next/server";
import { getProviderOnline } from "@/lib/dbStore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("providerId");
  if (!providerId) {
    return NextResponse.json(
      { success: false, error: "providerId is required" },
      { status: 400 },
    );
  }
  return NextResponse.json({
    success: true,
    isOnline: await getProviderOnline(providerId),
  });
}
