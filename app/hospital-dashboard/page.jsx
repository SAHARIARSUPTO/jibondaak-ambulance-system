"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  if (loading) return <div className="p-10">Loading...</div>;
  if (error) return <div className="p-10 text-red-600">{error}</div>;
  if (!hospital) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome, {hospital.name}</h1>
        <div className="mb-4 text-slate-600">{hospital.address}</div>
        <form onSubmit={handleUpdate} className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Beds</label>
            <input
              type="number"
              min="0"
              value={editBeds}
              onChange={(e) => setEditBeds(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">ICU Beds</label>
            <input
              type="number"
              min="0"
              value={editICU}
              onChange={(e) => setEditICU(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">
              Emergency Services
            </label>
            <input
              type="text"
              value={editEmergency}
              onChange={(e) => setEditEmergency(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="e.g. 24/7 ambulance, trauma care"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded font-bold disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Info"}
          </button>
          {saveMsg && (
            <div className="text-green-600 font-bold mt-2">{saveMsg}</div>
          )}
        </form>
        <div className="mb-4">
          Beds: {hospital.beds} | ICU: {hospital.icu}
        </div>
        <div className="mb-4">
          Emergency Services: {hospital.emergency_services || "Not specified"}
        </div>
        {/* TODO: Live dashboard of incoming patients */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-2">Live Emergency Forwarding</h2>
          <div className="bg-slate-100 rounded p-4 text-slate-500">
            {/* Placeholder for live patient list */}
            No patients currently being forwarded.
          </div>
        </div>
      </div>
    </div>
  );
}
