import { NextResponse } from "next/server";
import { loadRoutes } from "@/lib/dispatchUtils";

export async function GET() {
  try {
    const routes = await loadRoutes();
    return NextResponse.json({ success: true, routes });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load routes" },
      { status: 500 },
    );
  }
}

