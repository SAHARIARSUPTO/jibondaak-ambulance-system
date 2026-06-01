"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo, Suspense } from "react";
import {
  MapPin,
  Phone,
  Ambulance,
  Clock,
  Star,
  Navigation,
} from "lucide-react";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query");

  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationPool, setLocationPool] = useState([]);
  const [divisionId, setDivisionId] = useState(null);
  const [locationName, setLocationName] = useState("");

  // Load location data
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const fetchJson = async (url) => {
          const res = await fetch(url);
          return res.json();
        };
        const [divisions, districts, upazilas] = await Promise.all([
          fetchJson("/json/bd-divisions.json"),
          fetchJson("/json/bd-districts.json"),
          fetchJson("/json/bd-upazilas.json"),
        ]);
        setLocationPool({ divisions, districts, upazilas });
      } catch (err) {
        console.error("Failed to load location data:", err);
      }
    };
    loadLocations();
  }, []);

  // Parse query and find matching division
  useEffect(() => {
    if (!query || Object.keys(locationPool).length === 0) return;

    const divisions = locationPool.divisions?.divisions || [];
    const districts = locationPool.districts?.districts || [];

    // Try to match query with division or district
    let matched = divisions.find(
      (d) =>
        d.name.toLowerCase() === query.toLowerCase() ||
        d.bn_name.toLowerCase() === query.toLowerCase(),
    );

    if (!matched) {
      // Try district
      const district = districts.find(
        (d) =>
          d.name.toLowerCase() === query.toLowerCase() ||
          d.bn_name.toLowerCase() === query.toLowerCase(),
      );
      if (district) {
        matched = divisions.find((d) => d.id === district.division_id);
      }
    }

    if (matched) {
      setDivisionId(matched.id);
      setLocationName(matched.bn_name || matched.name);
    } else {
      setLocationName(query);
    }
  }, [query, locationPool]);

  // Fetch ambulances matching division
  useEffect(() => {
    if (!divisionId) {
      setLoading(false);
      return;
    }

    const fetchAmbulances = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/ambulances?division_id=${divisionId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.ambulances)) {
          setAmbulances(data.ambulances);
        } else {
          setError(data.error || "No ambulances found in this area");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch ambulances");
      } finally {
        setLoading(false);
      }
    };

    fetchAmbulances();
  }, [divisionId]);

  const handleBook = (ambulance) => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }
    // Redirect to dashboard with booking context
    router.push("/dashboard");
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-900 mb-2">
              Ambulance Service
            </h1>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="h-5 w-5 text-red-600" />
              <p className="text-lg font-semibold">
                {locationName
                  ? `${locationName} - available here`
                  : "Searching..."}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 text-red-600 mb-4 mx-auto">
                  <Ambulance className="h-12 w-12" />
                </div>
                <p className="text-slate-600 font-semibold">
                  Searching for ambulances...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <p className="text-red-800 font-semibold">{error}</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
              >
                Search Again
              </button>
            </div>
          )}

          {/* Ambulance Cards Grid */}
          {!loading && ambulances.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ambulances.map((amb) => (
                <div
                  key={amb._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all hover:border-red-200"
                >
                  {/* Header with type badge */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 border-b border-red-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-black text-slate-900">
                          {amb.model || "No model listed"}
                        </h3>
                        <p className="text-sm font-bold text-slate-600 mt-1">
                          {amb.ambulanceNumber}
                        </p>
                      </div>
                      <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                        {amb.ambulanceType === "ac" ? "AC" : "Non-AC"}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-4">
                    {/* Provider */}
                    {amb.providerName && (
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <Ambulance className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase">
                            Provider
                          </p>
                          <p className="font-bold text-slate-900">
                            {amb.providerName}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Contact */}
                    {amb.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-slate-400" />
                        <a
                          href={`tel:${amb.phone}`}
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          {amb.phone}
                        </a>
                      </div>
                    )}

                    {/* Location */}
                    {amb.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                        <p className="text-sm text-slate-600 font-medium">
                          {amb.location}
                        </p>
                      </div>
                    )}

                    {/* Availability */}
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                      <Clock className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-bold">
                        <span className="text-green-600">Available</span>
                      </p>
                    </div>

                    {/* Rating if available */}
                    {amb.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-slate-900">
                          {amb.rating}/5
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer with booking button */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <button
                      onClick={() => handleBook(amb)}
                      className="w-full py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all shadow-sm hover:shadow-md active:translate-y-0.5"
                    >
                      Book Now
                    </button>
                    <p className="text-xs text-slate-500 text-center mt-2 font-medium">
                      You will be redirected automatically if login is required
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && ambulances.length === 0 && !error && (
            <div className="text-center py-16">
              <Ambulance className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-600 mb-2">
                No ambulances found in this area
              </h3>
              <p className="text-slate-500 mb-6">
                Try searching another area
              </p>
              <button
                onClick={() => router.push("/")}
                className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700"
              >
                Search Again
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Wrapper component with Suspense boundary for useSearchParams
function SearchResultsPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 text-red-600 mb-4 mx-auto">
                  <Ambulance className="h-12 w-12" />
                </div>
                <p className="text-slate-600 font-semibold">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SearchResultsPage />
    </Suspense>
  );
}

export default SearchResultsPageWrapper;
