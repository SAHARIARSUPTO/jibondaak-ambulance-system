"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center rounded-3xl border border-white/10 bg-slate-900/80 text-sm text-slate-400">
      Loading map...
    </div>
  ),
});
import { MapPin } from "lucide-react";
import { getCurrentLocation } from "@/lib/mapUtils";

export default function AmbulanceFinder({
  className = "",
  sectionLabel = "Ambulances nearby",
  sectionTitleFallback = "Search area preview",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [searchLocationInfo, setSearchLocationInfo] = useState(null);
  const [searchRadius, setSearchRadius] = useState(12);

  const executeSearch = async ({ query, lat, lng }) => {
    setSearchError("");
    setSearchMessage("");
    setSearchLoading(true);
    setSearchResults([]);
    setSearchLocationInfo(null);

    try {
      const params = new URLSearchParams();
      params.set("radius", searchRadius.toString());
      params.set("limit", "12");

      if (typeof lat === "number" && typeof lng === "number") {
        params.set("lat", lat.toString());
        params.set("lng", lng.toString());
      } else if (query) {
        params.set("q", query);
      } else {
        throw new Error("Provide a search term or coordinates");
      }

      const response = await fetch(`/api/ambulances/search?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "No ambulances found nearby");
      }

      setSearchResults(data.ambulances || []);
      setSearchLocationInfo(data.location || null);

      const totalFound = Number.isFinite(Number(data.totalFound))
        ? Number(data.totalFound)
        : data.ambulances?.length || 0;
      const foundText = `${totalFound} ambulance${totalFound === 1 ? "" : "s"} located within ${
        Math.round(data.radiusKm || searchRadius)
      } km of ${data.location?.label || query || "this area"}`;
      setSearchMessage(foundText);
    } catch (error) {
      setSearchError(error.message || "Something went wrong while searching");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) {
      setSearchError("Enter a location to search nearby ambulances.");
      return;
    }
    await executeSearch({ query: searchTerm.trim() });
  };

  const handleUseCurrentLocation = async () => {
    setSearchError("");
    try {
      const coords = await getCurrentLocation();
      const formatted = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
      setSearchTerm(formatted);
      await executeSearch({
        lat: coords.latitude,
        lng: coords.longitude,
      });
    } catch (error) {
      setSearchError(error.message || "Unable to access your location.");
    }
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      <form onSubmit={handleSearch}>
        <div
          className={`relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 bg-white/10 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border transition-all duration-300 ${
            isFocused
              ? "border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]"
              : "border-white/10 shadow-2xl"
          }`}
        >
          <div className="absolute -inset-1 bg-linear-to-r from-red-600 to-orange-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-300"></div>

          <input
            type="text"
            placeholder="Enter your location or village name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="relative flex-1 px-5 sm:px-7 py-4 sm:py-5 rounded-xl sm:rounded-l-xl sm:rounded-r-none border-none outline-none text-white text-sm sm:text-base placeholder-gray-400 focus:placeholder-gray-500 transition-all duration-200 bg-white/5 backdrop-blur-sm"
            aria-label="Search for ambulances"
            required
          />
          <button
            type="submit"
            className="relative bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-95 text-white font-bold py-4 sm:py-5 px-7 sm:px-10 rounded-xl sm:rounded-r-xl sm:rounded-l-none shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2.5 whitespace-nowrap text-sm sm:text-base group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Find Ambulance</span>
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-xs uppercase tracking-[0.3em] text-slate-300">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[0.65rem]">
          <span>Radius</span>
          <span className="text-sm font-semibold text-white">{searchRadius} km</span>
        </div>
        <input
          type="range"
          min="5"
          max="45"
          step="1"
          value={searchRadius}
          onChange={(e) => setSearchRadius(Number(e.target.value))}
          className="w-full cursor-pointer accent-red-500"
          aria-label="Search radius in kilometers"
        />
        <div className="flex flex-wrap items-center justify-center gap-3 text-[0.7rem] text-slate-300 sm:justify-between">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={searchLoading}
            className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <MapPin className="h-4 w-4" />
            Use my current location
          </button>
          {searchLoading && (
            <p className="text-[0.65rem] text-slate-400">Updating results...</p>
          )}
        </div>
      </div>

      {(searchLocationInfo || searchLoading || searchResults.length > 0) && (
        <section className="mx-auto max-w-6xl space-y-6 rounded-3xl border border-white/15 bg-slate-900/60 p-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-slate-500">
                {sectionLabel}
              </p>
              <h3 className="text-2xl font-semibold text-white">
                {searchLocationInfo?.label || sectionTitleFallback}
              </h3>
            </div>
            {searchMessage && (
              <span className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-red-200">
                {searchMessage}
              </span>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-blue-500/30 bg-slate-900/80 p-4">
              {searchLocationInfo ? (
                <Map
                  userLocation={searchLocationInfo}
                  ambulanceLocation={searchResults[0]?.location}
                  showAmbulance={Boolean(searchResults[0]?.location)}
                  height="320px"
                />
              ) : (
                <div className="flex h-72 items-center justify-center text-sm text-slate-400">
                  {searchLoading
                    ? "Pinpointing area..."
                    : "Submit a search to preview the map"}
                </div>
              )}
              {searchLocationInfo && (
                <div className="mt-4 grid grid-cols-2 gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-slate-300">
                  <div>
                    <p className="text-slate-500">Latitude</p>
                    <p className="text-white">
                      {searchLocationInfo.latitude?.toFixed(4) || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Longitude</p>
                    <p className="text-white">
                      {searchLocationInfo.longitude?.toFixed(4) || "—"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {searchLoading && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-300">
                  Searching nearby ambulances...
                </div>
              )}

              {!searchLoading && searchResults.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-300">
                  {searchError ? (
                    <p className="text-red-300">{searchError}</p>
                  ) : (
                    <p>No ambulances matched the search area yet.</p>
                  )}
                </div>
              )}

              {searchResults.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/60 p-4 text-sm text-slate-100 shadow-inner shadow-black/40"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400">
                      {item.type || "Ambulance"}
                    </p>
                    <span
                      className={`text-[0.65rem] font-semibold uppercase tracking-[0.35em] ${
                        item.availability === "Available"
                          ? "text-emerald-300"
                          : "text-amber-300"
                      }`}
                    >
                      {item.availability}
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {item.providerName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.providerPhone || "Provider contact not available"}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-[0.65rem] text-slate-300">
                    <div>
                      <p className="text-slate-500">Driver</p>
                      <p className="text-white">{item.driverName}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Distance</p>
                      <p className="text-white">{item.distance} km</p>
                    </div>
                    <div>
                      <p className="text-slate-500">ETA</p>
                      <p className="text-white">{item.etaLabel}</p>
                    </div>
                  </div>
                  {item.location?.label && (
                    <p className="mt-2 text-[0.65rem] text-slate-400">
                      {item.location.label}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
