import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const sanitizeUser = (user) => ({
  id: user._id?.toString?.() || null,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive,
  isOnline: user.isOnline || false,
  companyName: user.companyName,
  licenseNumber: user.licenseNumber,
  createdAt: user.createdAt?.toISOString?.() || null,
});

const sanitizeAmbulance = (ambulance, provider) => ({
  id: ambulance._id?.toString?.() || null,
  providerId: ambulance.providerId,
  providerName: provider?.companyName || provider?.name || "Provider",
  type: ambulance.type,
  vehicleNumber: ambulance.vehicleNumber,
  driverName: ambulance.driverName,
  driverPhone: ambulance.driverPhone,
  isAvailable: ambulance.isAvailable,
  currentLocation: ambulance.currentLocation || null,
  createdAt: ambulance.createdAt?.toISOString?.() || null,
});

const sanitizeRequest = (request) => ({
  id: request._id?.toString?.() || null,
  status: request.status,
  ambulanceType: request.ambulanceType,
  userLocation: request.userLocation,
  createdAt: request.createdAt?.toISOString?.() || null,
});

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("jibondaak");
    const usersCollection = db.collection("users");
    const bookingsCollection = db.collection("bookings");
    const ambulancesCollection = db.collection("ambulances");

    const [
      totalUsers,
      totalProviders,
      providersOnline,
      totalAmbulances,
      availableAmbulances,
      searchingRequests,
      activeBookings,
    ] = await Promise.all([
      usersCollection.countDocuments({ role: "user" }),
      usersCollection.countDocuments({ role: "provider" }),
      usersCollection.countDocuments({ role: "provider", isOnline: true }),
      ambulancesCollection.countDocuments(),
      ambulancesCollection.countDocuments({ isAvailable: true }),
      bookingsCollection.countDocuments({ status: "searching" }),
      bookingsCollection.countDocuments({
        status: { $in: ["driver_assigned", "en_route", "arrived"] },
      }),
    ]);

    const [recentUsers, recentProviders, recentRequests, recentAmbulances] =
      await Promise.all([
        usersCollection
          .find({}, { projection: { password: 0 } })
          .sort({ createdAt: -1 })
          .limit(8)
          .toArray(),
        usersCollection
          .find({ role: "provider" }, { projection: { password: 0 } })
          .sort({ createdAt: -1 })
          .limit(8)
          .toArray(),
        bookingsCollection
          .find({ status: "searching" })
          .sort({ createdAt: -1 })
          .limit(6)
          .toArray(),
        ambulancesCollection
          .find({})
          .sort({ createdAt: -1 })
          .limit(12)
          .toArray(),
      ]);

    const providerLookup = new Map(
      recentProviders.map((provider) => [
        provider._id?.toString?.() || null,
        provider,
      ])
    );

    const metrics = {
      totalUsers,
      totalProviders,
      providersOnline,
      totalAmbulances,
      availableAmbulances,
      searchingRequests,
      activeBookings,
    };

    return NextResponse.json({
      success: true,
      metrics,
      users: recentUsers.map(sanitizeUser),
      providers: recentProviders.map(sanitizeUser),
      ambulances: recentAmbulances.map((ambulance) =>
        sanitizeAmbulance(
          ambulance,
          providerLookup.get(ambulance.providerId) || null
        )
      ),
      searchRequests: recentRequests.map(sanitizeRequest),
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Dashboard failed" },
      { status: 500 }
    );
  }
}
