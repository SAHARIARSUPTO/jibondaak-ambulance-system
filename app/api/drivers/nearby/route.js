import { NextResponse } from "next/server";
import { distanceKm, loadDrivers, loadRoutes, resolveFare } from "@/lib/dispatchUtils";
import { getProviderOnline, listProviderDrivers } from "@/lib/bookingStore";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userLocation,
      ambulanceType,
      userDivision,
      userUpazila,
      routeId,
      limit = 5,
    } = body || {};

    if (!userLocation?.latitude || !userLocation?.longitude) {
      return NextResponse.json(
        { success: false, error: "userLocation is required" },
        { status: 400 },
      );
    }

    const [drivers, routes] = await Promise.all([loadDrivers(), loadRoutes()]);
    const providerDrivers = listProviderDrivers().map((d) => ({
      ...d,
      status: getProviderOnline(d.providerId) ? "available" : "offline",
    }));
    // Driver dashboard flow: prioritize registered driver accounts.
    const mergedDrivers = providerDrivers.length > 0 ? providerDrivers : drivers;
    const selectedRoute = routes.find((r) => r.id === routeId);

    const available = mergedDrivers
      .filter((d) => d.status === "available")
      .filter((d) => (ambulanceType ? d.ambulanceType === ambulanceType : true));

    const upazilaMatches = available.filter((d) =>
      userUpazila ? d.upazila_id?.toString() === userUpazila?.toString() : true,
    );

    const divisionMatches = available.filter((d) =>
      userDivision ? d.division_id?.toString() === userDivision?.toString() : true,
    );

    // Fallback chain: upazila -> division -> all available, to avoid empty search results.
    const candidateDrivers =
      upazilaMatches.length > 0
        ? upazilaMatches
        : divisionMatches.length > 0
          ? divisionMatches
          : available;

    const matches = candidateDrivers
      .map((d) => {
        const distance = distanceKm(userLocation, {
          latitude: d.lat,
          longitude: d.lng,
        });
        const fare = resolveFare({
          driverId: d.id,
          routeId,
          routeBaseFare: selectedRoute?.baseFare,
          distance,
        });
        return {
          ...d,
          distanceKm: Number(distance.toFixed(2)),
          offeredFare: fare,
          routeId: routeId || null,
          routeName: selectedRoute?.name || "Dynamic local route",
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, Number(limit));

    return NextResponse.json({ success: true, drivers: matches });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load nearby drivers" },
      { status: 500 },
    );
  }
}
