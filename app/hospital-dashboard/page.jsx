"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, Building2, Check, LogOut, Search, ShieldAlert } from "lucide-react";

export default function HospitalDashboard() {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState([]);
  const [savingProviders, setSavingProviders] = useState(false);
  const router = useRouter();

  // Editable fields moved up to comply with the Rules of Hooks
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editBeds, setEditBeds] = useState(0);
  const [editICU, setEditICU] = useState(0);
  const [editEmergency, setEditEmergency] = useState("");
  const [editProviderIds, setEditProviderIds] = useState([]);
  const [providerQuery, setProviderQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("hospitalUserId");
    if (!userId) {
      router.push("/hospital-login");
      return;
    }
    fetch(`/api/hospitals/dashboard?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHospital(data.hospital);
          // Initialize editable fields with fetched data
          setEditName(data.hospital.name || "");
          setEditAddress(data.hospital.address || "");
          setEditBeds(data.hospital.beds || 0);
          setEditICU(data.hospital.icu || 0);
          setEditEmergency(data.hospital.emergency_services || "");
          setEditProviderIds(
            Array.isArray(data.hospital.assignedProviderIds)
              ? data.hospital.assignedProviderIds.map(String)
              : Array.isArray(data.hospital.providerIds)
                ? data.hospital.providerIds.map(String)
                : [],
          );
        } else {
          setError(data.error || "Not found");
        }
      })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) {
          setProviders(Array.isArray(data.providers) ? data.providers : []);
        }
      } catch {
        setProviders([]);
      }
    };

    loadProviders();
  }, []);

  const filteredProviders = useMemo(() => {
    const query = providerQuery.trim().toLowerCase();
    const hospitalDivision = String(hospital?.division_id || "");
    const hospitalDistrict = String(hospital?.district_id || "");
    const hospitalUpazila = String(hospital?.upazila_id || "");

    const matchesArea = (provider) => {
      const providerDivision = String(provider.division_id || "");
      const providerDistrict = String(provider.district_id || "");
      const providerUpazila = String(provider.upazila_id || "");

      if (hospitalUpazila && providerUpazila) return hospitalUpazila === providerUpazila;
      if (hospitalDistrict && providerDistrict) return hospitalDistrict === providerDistrict;
      if (hospitalDivision && providerDivision) return hospitalDivision === providerDivision;
      return true;
    };

    return providers.filter((provider) => {
      if (!matchesArea(provider)) return false;
      if (!query) return true;

      const searchable = [
        provider.name,
        provider.phone,
        provider.companyName,
        provider.ambulanceNumber,
        provider.id,
        provider._id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [providers, providerQuery, hospital]);

  const toggleProviderSelection = (providerId) => {
    setEditProviderIds((current) =>
      current.includes(providerId)
        ? current.filter((id) => id !== providerId)
        : [...current, providerId],
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/hospitals/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId: hospital._id,
          patch: {
            name: editName,
            address: editAddress,
            beds: Number(editBeds),
            icu: Number(editICU),
            emergency_services: editEmergency,
            assignedProviderIds: editProviderIds,
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        setHospital(data.hospital);
        localStorage.setItem("hospitalName", data.hospital.name || "");
        setSaveMsg("Updated successfully!");
      } else {
        setSaveMsg(data.error || "Update failed");
      }
    } catch (e) {
      setSaveMsg("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("hospitalUserId");
    localStorage.removeItem("hospitalName");
    router.push("/hospital-login");
  };

  const handleSaveProviders = async () => {
    if (!hospital?._id) return;
    setSavingProviders(true);
    setSaveMsg("");

    try {
      const res = await fetch("/api/hospitals/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId: hospital._id,
          patch: {
            assignedProviderIds: editProviderIds,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setHospital(data.hospital);
        setEditProviderIds(
          Array.isArray(data.hospital.assignedProviderIds)
            ? data.hospital.assignedProviderIds.map(String)
            : [],
        );
        setSaveMsg("Assigned providers updated successfully!");
      } else {
        setSaveMsg(data.error || "Failed to update providers");
      }
    } catch {
      setSaveMsg("Failed to update providers");
    } finally {
      setSavingProviders(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-sm">
          <p className="font-semibold text-black">{error}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-black"
            >
              Back to login
            </button>
            <Link
              href="/hospital-register"
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-black"
            >
              Register hospital
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (!hospital) return null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.12),_transparent_30%),linear-gradient(180deg,#fff7f7_0%,#ffffff_45%,#fffafa_100%)] p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-red-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-black">
              Hospital Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-black">
              Welcome, {hospital.name}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-black">
              <Building2 className="h-4 w-4" />
              {hospital.address}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-bold text-white shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={BedDouble} label="Beds" value={hospital.beds || 0} />
          <StatCard icon={ShieldAlert} label="ICU Beds" value={hospital.icu || 0} />
          <StatCard
            icon={Building2}
            label="Emergency Services"
            value={hospital.emergency_services || "Not specified"}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-black">Update hospital profile</h2>
            <p className="mt-1 text-sm text-black">
              Keep bed counts and emergency services current for dispatch and seekers.
            </p>
            <form onSubmit={handleUpdate} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-black">Hospital Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-red-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-black">Address</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-red-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-black">Beds</label>
                <input
                  type="number"
                  min="0"
                  value={editBeds}
                  onChange={(e) => setEditBeds(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-red-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-black">ICU Beds</label>
                <input
                  type="number"
                  min="0"
                  value={editICU}
                  onChange={(e) => setEditICU(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-red-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-black">
                  Emergency Services
                </label>
                <input
                  type="text"
                  value={editEmergency}
                  onChange={(e) => setEditEmergency(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-red-500 focus:bg-white"
                  placeholder="e.g. 24/7 ambulance, trauma care"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Update Info"}
              </button>
              {saveMsg && (
                <div className="text-sm font-semibold text-black">{saveMsg}</div>
              )}
            </form>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-black">Assign providers</h2>
                <p className="mt-1 text-sm text-black">
                  Choose the exact ambulance providers that should appear for this hospital.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold text-black">
                Selected: {editProviderIds.length}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-red-500 focus-within:bg-white">
              <Search className="h-4 w-4 text-black" />
              <input
                value={providerQuery}
                onChange={(e) => setProviderQuery(e.target.value)}
                placeholder="Search provider name, phone, or ambulance number"
                className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
              />
            </div>

            <div className="mt-5 max-h-[26rem] space-y-3 overflow-auto pr-1">
              {filteredProviders.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-black">
                  No providers found for this area.
                </div>
              ) : (
                filteredProviders.map((provider) => {
                  const providerId = String(provider.id || provider._id || "");
                  const isSelected = editProviderIds.includes(providerId);

                  return (
                    <label
                      key={providerId}
                      className={`flex cursor-pointer items-start gap-3 rounded-[1.5rem] border p-4 transition ${isSelected ? "border-red-200 bg-red-50" : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white"}`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleProviderSelection(providerId)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-black focus:ring-red-500"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="truncate font-bold text-black">
                              {provider.name || provider.companyName || "Unnamed provider"}
                            </p>
                            <p className="text-xs text-black">
                              {provider.phone || "No phone"}
                            </p>
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-black" />}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-black">
                          <span className="rounded-full bg-white px-2 py-1">ID: {providerId.slice(-8)}</span>
                          <span className="rounded-full bg-white px-2 py-1">
                            {provider.isOnline ? "Online" : "Offline"}
                          </span>
                          {provider.ambulanceNumber && (
                            <span className="rounded-full bg-white px-2 py-1">
                              {provider.ambulanceNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSaveProviders}
                disabled={savingProviders}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingProviders ? "Saving..." : "Save provider mapping"}
              </button>
              <p className="text-xs text-black">
                Exact selections override the general area fallback on the seeker dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[1.75rem] border border-red-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black">{label}</p>
        <Icon className="h-5 w-5 text-red-500" />
      </div>
      <p className="mt-4 text-2xl font-black tracking-tight text-black">{value}</p>
    </div>
  );
}
