import { NextResponse } from "next/server";
import { getDb, isMongoConnectivityError } from "@/lib/dbStore";

export async function GET() {
  try {
    const db = await getDb();
    // Fetch all users, ambulances, hospitals, providers, and search requests
    const [users, ambulances, hospitals, providers, searchRequests] =
      await Promise.all([
        db.collection("users").find({}).toArray(),
        db.collection("ambulances").find({}).toArray(),
        db.collection("hospitals").find({}).toArray(),
        db.collection("providers").find({}).toArray(),
        db
          .collection("bookings")
          .find({ status: "pending_driver_acceptance" })
          .toArray(),
      ]);
    // Metrics
    const metrics = {
      totalUsers: users.length,
      totalProviders: providers.length,
      providersOnline: providers.filter((p) => p.isOnline).length,
      searchingRequests: searchRequests.length,
      activeBookings: await db.collection("bookings").countDocuments({
        status: {
          $in: [
            "driver_assigned",
            "en_route",
            "arrived",
            "trip_started",
            "destination_reached",
            "awaiting_seeker_approval",
          ],
        },
      }),
    };
    return NextResponse.json({
      success: true,
      users,
      ambulances,
      hospitals,
      providers,
      searchRequests,
      metrics,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    const isConnError = isMongoConnectivityError(error);
    return NextResponse.json(
      {
        success: false,
        error: isConnError
          ? "Database connection failed. Check MONGODB_URI and Network Whitelist."
          : "Failed to load dashboard data",
      },
      { status: isConnError ? 503 : 500 },
    );
  }
}
