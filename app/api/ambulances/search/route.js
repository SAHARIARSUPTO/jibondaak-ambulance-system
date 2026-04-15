import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { calculateDistance, calculateETA } from "@/lib/mapUtils";
import { ObjectId } from "mongodb";

async function geocodeLocation(query) {
  const encoded = encodeURIComponent(query);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&addressdetails=0&limit=1`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "JibonDaak/1.0 (https://jibondaak.com)",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to lookup location");
  }

  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const first = results[0];
  return {
    latitude: parseFloat(first.lat),
    longitude: parseFloat(first.lon),
    label: first.display_name || query,
  };
}

function sanitizeAmbulance(ambulance, providerMap, distance, eta) {
  const provider = providerMap.get(ambulance.providerId);

  return {
    providerId: ambulance.providerId,
    id: ambulance._id?.toString?.() || null,
    type: ambulance.type,
    vehicleNumber: ambulance.vehicleNumber,
    licenseNumber: ambulance.licenseNumber,
    driverName: ambulance.driverName,
    driverPhone: ambulance.driverPhone,
    availability: ambulance.isAvailable ? "Available" : "Busy",
    providerName: provider?.companyName || provider?.name || "Provider",
    providerPhone: provider?.phone,
    providerEmail: provider?.email,
    distance: distance.toFixed(2),
    etaMinutes: eta.minutes,
    etaLabel: eta.formattedTime,
    location: ambulance.currentLocation || null,
  };
}

function buildProviderIdMap(ambulances) {
  const ids = ambulances
    .map((item) => item.providerId)
    .filter(Boolean)
    .filter((id, index, arr) => arr.indexOf(id) === index);
  return ids;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = Math.min(parseInt(searchParams.get("limit")) || 12, 30);
    const radiusKm = parseFloat(searchParams.get("radius")) || 12;
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    if (!query && (!latParam || !lngParam)) {
      return NextResponse.json(
        {
          success: false,
          error: "Enter a searchable location or provide coordinates",
        },
        { status: 400 }
      );
    }

    let location;
    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return NextResponse.json(
          { success: false, error: "Invalid coordinates" },
          { status: 400 }
        );
      }

      location = {
        latitude: lat,
        longitude: lng,
        label: query || "Custom point",
      };
    } else {
      location = await geocodeLocation(query);
      if (!location) {
        return NextResponse.json(
          { success: false, error: "Could not resolve the location" },
          { status: 404 }
        );
      }
    }

    const client = await clientPromise;
    const db = client.db("jibondaak");

    const ambulances = await db
      .collection("ambulances")
      .find({ currentLocation: { $ne: null } })
      .toArray();

    if (ambulances.length === 0) {
      return NextResponse.json({
        success: true,
        location,
        radiusKm,
        totalFound: 0,
        ambulances: [],
      });
    }

    const providerIds = buildProviderIdMap(ambulances);
    let providerMap = new Map();

    if (providerIds.length > 0) {
      const validIds = providerIds
        .filter((id) => ObjectId.isValid(id))
        .map((id) => new ObjectId(id));

      const providers = await db
        .collection("users")
        .find({ _id: { $in: validIds } }, { projection: { password: 0 } })
        .toArray();

      providerMap = new Map(
        providers.map((provider) => [provider._id.toString(), provider])
      );
    }

    const nearby = ambulances
      .map((ambulance) => {
        if (
          !ambulance.currentLocation ||
          typeof ambulance.currentLocation.latitude !== "number" ||
          typeof ambulance.currentLocation.longitude !== "number"
        ) {
          return null;
        }

        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          ambulance.currentLocation.latitude,
          ambulance.currentLocation.longitude
        );

        if (distance > radiusKm) {
          return null;
        }

        const eta = calculateETA(distance);
        return sanitizeAmbulance(ambulance, providerMap, distance, eta);
      })
      .filter(Boolean)
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      location,
      radiusKm,
      totalFound: nearby.length,
      ambulances: nearby,
    });
  } catch (error) {
    console.error("Ambulance search failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Search failed" },
      { status: 500 }
    );
  }
}
