"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, Building2, LogOut, ShieldAlert } from "lucide-react";

export default function HospitalDashboard() {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Editable fields moved up to comply with the Rules of Hooks
  const [editBeds, setEditBeds] = useState(0);
  const [editICU, setEditICU] = useState(0);
  const [editEmergency, setEditEmergency] = useState("");
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
          setEditBeds(data.hospital.beds || 0);
          setEditICU(data.hospital.icu || 0);
          setEditEmergency(data.hospital.emergency_services || "");
        } else {
          setError(data.error || "Not found");
        }
      })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, [router]);

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
            beds: Number(editBeds),
            icu: Number(editICU),
            emergency_services: editEmergency,
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        setHospital(data.hospital);
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

  if (loading) return <div className="p-10">Loading...</div>;
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-sm">
          <p className="font-semibold text-red-600">{error}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Back to login
            </button>
            <Link
              href="/hospital-register"
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
              Hospital Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Welcome, {hospital.name}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Building2 className="h-4 w-4" />
              {hospital.address}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition-transform hover:-translate-y-0.5"
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
            <h2 className="text-lg font-bold text-slate-950">Update hospital profile</h2>
            <p className="mt-1 text-sm text-slate-500">
              Keep bed counts and emergency services current for dispatch and seekers.
            </p>
            <form onSubmit={handleUpdate} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Beds</label>
                <input
                  type="number"
                  min="0"
                  value={editBeds}
                  onChange={(e) => setEditBeds(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-red-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">ICU Beds</label>
                <input
                  type="number"
                  min="0"
                  value={editICU}
                  onChange={(e) => setEditICU(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-red-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">
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
                className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Update Info"}
              </button>
              {saveMsg && (
                <div className="text-sm font-semibold text-emerald-600">{saveMsg}</div>
              )}
            </form>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-slate-950 p-6 text-white shadow-sm">
            <h2 className="text-lg font-bold">Live Emergency Forwarding</h2>
            <p className="mt-2 text-sm text-white/70">
              Incoming requests will appear here once routing is connected.
            </p>
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-white/70">
              No patients currently being forwarded.
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
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">{label}</p>
        <Icon className="h-5 w-5 text-red-500" />
      </div>
      <p className="mt-4 text-2xl font-black tracking-tight text-slate-950">{value}</p>
    </div>
  );
}
