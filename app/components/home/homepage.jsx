"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Search, Navigation, LocateFixed } from "lucide-react";
import ExpertiseSection from "./service";
import MedicalNetworkSection from "./medicalnotif";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  // Load JSONs from public folder
  const [locationPool, setLocationPool] = useState([]);
  useEffect(() => {
    async function loadLocations() {
      // Helper to fetch and parse JSON
      const fetchJson = async (url) => {
        const res = await fetch(url);
        return res.json();
      };
      // Fetch all JSONs in parallel
      const [divisions, districts, upazilas, postcodes, dhaka] =
        await Promise.all([
          fetchJson("/json/bd-divisions.json"),
          fetchJson("/json/bd-districts.json"),
          fetchJson("/json/bd-upazilas.json"),
          fetchJson("/json/bd-postcodes.json"),
          fetchJson("/json/dhaka-city.json"),
        ]);

      const pool = [];
      // Divisions
      if (divisions?.divisions) {
        divisions.divisions.forEach((d) => {
          pool.push({
            name: d.name,
            bnName: d.bn_name || d.name,
            type: "Division",
          });
        });
      }
      // Districts
      if (districts?.districts) {
        districts.districts.forEach((d) => {
          pool.push({
            name: d.name,
            bnName: d.bn_name || d.name,
            type: "District",
          });
        });
      }
      // Upazilas
      if (upazilas?.upazilas) {
        upazilas.upazilas.forEach((u) => {
          pool.push({
            name: u.name,
            bnName: u.bn_name || u.name,
            type: "Upazila",
          });
        });
      }
      // Post offices (as union/area)
      if (postcodes?.postcodes) {
        postcodes.postcodes.forEach((p) => {
          pool.push({
            name: p.postOffice,
            bnName: p.postOffice,
            upazila: p.upazila,
            type: "Post office / Union / Area",
          });
        });
      }
      // Dhaka city areas
      if (dhaka?.dhaka) {
        dhaka.dhaka.forEach((a) => {
          pool.push({
            name: a.name,
            bnName: a.bn_name || a.name,
            type: "Dhaka city area",
          });
        });
      }
      setLocationPool(pool);
    }
    loadLocations();
  }, []);

  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    const term = searchTerm.toLowerCase();
    return locationPool
      .filter(
        (loc) =>
          (loc.name && loc.name.toLowerCase().includes(term)) ||
          (loc.bnName && loc.bnName.includes(term)) ||
          (loc.upazila && loc.upazila.toLowerCase().includes(term)),
      )
      .slice(0, 8);
  }, [searchTerm, locationPool]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/search-results?query=${encodeURIComponent(searchTerm)}`);
  };

  const handleGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // Search by coordinates
        router.push(
          `/search-results?lat=${latitude}&lng=${longitude}&query=Current%20Location`,
        );
      });
    }
  };

  return (
    <>
      <main className="bg-white text-slate-900 font-sans selection:bg-red-100">
        {/* 1. HERO SECTION */}
        <section className="relative items-center justify-center border-b border-slate-100 pt-8 pb-20 md:pt-12 md:pb-32">
          <div className="absolute inset-0">
            <Image
              src="https://user-gen-media-assets.s3.amazonaws.com/seedream_images/2f58b4e4-da5f-43f2-8a90-0342697fe3b5.png"
              alt="Ambulance service Bangladesh"
              fill
              className="object-cover opacity-15"
              priority
            />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full text-red-600 text-sm font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              24-hour emergency ambulance service
            </div>

            <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
              We understand the value of time <br />
              <span className="text-red-600">when lives are on the line</span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              We are always by your side to help you find a fast and reliable
              ambulance for your loved ones in an emergency.
            </p>

            <div className="max-w-2xl mx-auto mb-8 relative">
              <form onSubmit={handleSearch} className="relative z-20">
                <div
                  className={`flex flex-col sm:flex-row shadow-2xl rounded-2xl overflow-hidden border-2 transition-all bg-white ${isFocused ? "border-red-600 ring-4 ring-red-50" : "border-slate-200"}`}
                >
                  <div className="flex-1 flex items-center px-6">
                    <MapPin className="text-slate-400 h-6 w-6 mr-3" />
                    <input
                      type="text"
                      placeholder="Enter your current location or village..."
                      className="flex-1 py-5 text-xl outline-none"
                      value={searchTerm}
                      onFocus={() => {
                        setIsFocused(true);
                        setShowSuggestions(true);
                      }}
                      onBlur={() => {
                        setIsFocused(false);
                        // Delay hiding so clicks on suggestions register
                        setTimeout(() => setShowSuggestions(false), 200);
                      }}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleGPS}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      title="Use your location"
                    >
                      <LocateFixed className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 text-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="h-6 w-6" /> Search
                  </button>
                </div>
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {suggestions.map((s) => (
                    <button
                      key={`${s.type}-${s.name}-${s.upazila || ""}`}
                      onClick={() => {
                        setSearchTerm(s.bnName || s.name);
                        router.push(
                          `/search-results?query=${encodeURIComponent(s.bnName || s.name)}`,
                        );
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Navigation className="h-4 w-4 text-red-500" />
                        <span className="font-bold text-slate-800 text-lg">
                          {s.bnName || s.name}
                        </span>
                        {s.upazila && (
                          <span className="ml-2 text-slate-400 text-sm">
                            ({s.upazila})
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-300">
                        {s.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              Nationwide coverage
            </div>
          </div>
        </section>

        {/* 2. WHAT WE DO & PROCESS */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                How We Work
              </h2>
              <div className="h-1.5 w-24 bg-red-600 mx-auto rounded-full"></div>
            </div>
            <MedicalNetworkSection></MedicalNetworkSection>
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4 p-6 hover:bg-slate-50 rounded-3xl transition-colors">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold">
                    1
                </div>
                <h3 className="text-2xl font-bold">Easy Search</h3>
                <p className="text-slate-600 leading-relaxed">
                  Enter your location and search to instantly see the nearest
                  ambulances.
                </p>
              </div>
              <div className="space-y-4 p-6 hover:bg-slate-50 rounded-3xl transition-colors">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold">
                    2
                </div>
                <h3 className="text-2xl font-bold">Direct Contact</h3>
                <p className="text-slate-600 leading-relaxed">
                  No middleman. Speak directly with the driver to confirm the
                  fare.
                </p>
              </div>
              <div className="space-y-4 p-6 hover:bg-slate-50 rounded-3xl transition-colors">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold">
                    3
                </div>
                <h3 className="text-2xl font-bold">Fast Service</h3>
                <p className="text-slate-600 leading-relaxed">
                  Track the ambulance on the map and it will reach your door in
                  minutes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PROVIDER / DRIVER JOIN SECTION */}
        <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 z-10">
              <span className="text-red-500 font-bold tracking-widest uppercase text-sm">
                For ambulance owners and drivers
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
                Join us and stand <br />
                beside people in need
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                If you own an ambulance, register as a provider today. We will
                connect you directly with patients.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "No monthly charges",
                  "Receive direct payments",
                  "Serve across the country",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="bg-green-500 rounded-full p-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-slate-200 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-500 hover:text-white transition-all transform hover:scale-105">
                Join as Driver
              </button>
            </div>
            <div className="flex-1 relative">
              <div className="bg-linear-to-tr from-red-600 to-orange-400 w-full aspect-square rounded-full opacity-20 blur-3xl absolute -right-20 -top-20"></div>
              <div className="border border-white/10 bg-white/5 p-6 rounded-3xl backdrop-blur-xl relative">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold">Live Tracking Dashboard</span>
                  <span className="bg-red-500 px-3 py-1 rounded-full text-xs">
                    LIVE
                  </span>
                </div>
                <iframe
                  title="OSM Live"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=90.320%2C23.690%2C90.470%2C23.800&amp;layer=mapnik"
                  className="w-full h-64 rounded-xl grayscale"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. FOOTER / CALL TO ACTION */}
        <footer className="py-12 border-t border-slate-100 bg-slate-50 text-center">
          <p className="text-slate-500 font-medium mb-4">Emergency Helpline</p>
          <a
            href="tel:999"
            className="text-5xl font-black text-red-600 hover:text-red-700 transition-colors"
          >
            999
          </a>
          <div className="mt-8 text-slate-400 text-sm">
            © 2024 Your lifeline ambulance service. All rights reserved.
          </div>
        </footer>
      </main>

      <ExpertiseSection></ExpertiseSection>
    </>
  );
};

export default HomePage;
