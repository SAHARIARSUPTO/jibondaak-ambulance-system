"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Users,
  Plus,
  Hospital as HospitalIcon,
  Save,
  Trash2,
  ChevronRight,
  Building2,
  Phone,
  Ambulance as AmbulanceIcon,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, drivers, hospitals

  // Location Data for Dynamic Selection
  const [locations, setLocations] = useState({
    divisions: [],
    districts: [],
    upazilas: [],
  });
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  // Forms
  const [driverForm, setDriverForm] = useState({
    name: "",
    phone: "",
    ambulanceModel: "",
    ambulanceNumber: "",
    ambulanceType: "ac",
    division_id: "",
    district_id: "",
    upazila_id: "",
  });
  const [hospForm, setHospForm] = useState({
    name: "",
    phone: "",
    address: "",
    division_id: "",
    district_id: "",
    upazila_id: "",
    beds: 0,
    icu: 0,
  });

  const [busyUserIds, setBusyUserIds] = useState(() => new Set());
  const [busyAmbulances, setBusyAmbulances] = useState(() => new Set());
  const [busyProviders, setBusyProviders] = useState(() => new Set());

  useEffect(() => {
    fetchDashboard();
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      const [divs, dists, upzs] = await Promise.all([
        fetch("/json/bd-divisions.json").then((res) => res.json()),
        fetch("/json/bd-districts.json").then((res) => res.json()),
        fetch("/json/bd-upazilas.json").then((res) => res.json()),
      ]);
      setLocations({
        divisions: divs.divisions || divs,
        districts: dists.districts || dists,
        upazilas: upzs.upazilas || upzs,
      });
    } catch (e) {
      console.error("Location load error", e);
    }
  };

  // Cascade filters
  useEffect(() => {
    if (locations.districts.length) {
      const d = locations.districts.filter(
        (x) =>
          x.division_id ===
          (activeTab === "drivers"
            ? driverForm.division_id
            : hospForm.division_id),
      );
      setFilteredDistricts(d);
    }
  }, [
    driverForm.division_id,
    hospForm.division_id,
    locations.districts,
    activeTab,
  ]);

  useEffect(() => {
    if (locations.upazilas.length) {
      const u = locations.upazilas.filter(
        (x) =>
          x.district_id ===
          (activeTab === "drivers"
            ? driverForm.district_id
            : hospForm.district_id),
      );
      setFilteredUpazilas(u);
    }
  }, [
    driverForm.district_id,
    hospForm.district_id,
    locations.upazilas,
    activeTab,
  ]);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/dashboard");
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to load admin data");
      }
      setDashboardData(data);
    } catch (err) {
      setError(err.message || "Unable to load admin console");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDriver = async () => {
    if (!driverForm.name || !driverForm.phone || !driverForm.division_id) {
      alert("দয়া করে নাম, ফোন এবং বিভাগ পূরণ করুন।");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driverForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      alert("ড্রাইভার সফলভাবে ডাটাবেসে যোগ করা হয়েছে!");
      setDriverForm({
        name: "",
        phone: "",
        ambulanceModel: "",
        ambulanceNumber: "",
        ambulanceType: "ac",
        division_id: "",
        district_id: "",
        upazila_id: "",
      });
      fetchDashboard(); // Refresh metrics after add
    } catch (err) {
      alert("ত্রুটি: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHospital = async () => {
    if (!hospForm.name || !hospForm.division_id) {
      alert("দয়া করে হাসপাতালের নাম এবং বিভাগ পূরণ করুন।");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hospitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hospForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      alert("হাসপাতাল সফলভাবে রেজিস্টার করা হয়েছে!");
      setHospForm({
        name: "",
        phone: "",
        address: "",
        division_id: "",
        district_id: "",
        upazila_id: "",
        beds: 0,
        icu: 0,
      });
      fetchDashboard();
    } catch (err) {
      alert("ত্রুটি: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserActive = async (userId, currentStatus) => {
    setError("");
    setBusyUserIds((prev) => {
      const next = new Set(prev);
      next.add(userId);
      return next;
    });
    try {
      const response = await fetch("/api/admin/update-user-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentStatus }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update user");
      }
      setDashboardData((prev) =>
        prev
          ? {
              ...prev,
              users: prev.users.map((user) =>
                user.id === userId ? data.user : user,
              ),
            }
          : prev,
      );
    } catch (err) {
      setError(err.message || "Unable to update user status");
    } finally {
      setBusyUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const toggleAmbulanceAvailability = async (ambulanceId, currentStatus) => {
    setError("");
    setBusyAmbulances((prev) => {
      const next = new Set(prev);
      next.add(ambulanceId);
      return next;
    });
    try {
      const response = await fetch("/api/admin/ambulance-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ambulanceId, isAvailable: !currentStatus }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update ambulance");
      }
      setDashboardData((prev) =>
        prev
          ? {
              ...prev,
              ambulances: prev.ambulances.map((ambulance) =>
                ambulance.id === ambulanceId
                  ? { ...ambulance, isAvailable: !currentStatus }
                  : ambulance,
              ),
            }
          : prev,
      );
    } catch (err) {
      setError(err.message || "Unable to update ambulance status");
    } finally {
      setBusyAmbulances((prev) => {
        const next = new Set(prev);
        next.delete(ambulanceId);
        return next;
      });
    }
  };

  const toggleProviderStatus = async (providerId, currentStatus) => {
    setError("");
    setBusyProviders((prev) => {
      const next = new Set(prev);
      next.add(providerId);
      return next;
    });
    try {
      const response = await fetch("/api/provider/toggle-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId, isOnline: !currentStatus }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update provider status");
      }
      setDashboardData((prev) => {
        if (!prev) return prev;
        const delta = currentStatus ? -1 : 1;
        const updatedProviders = prev.providers.map((provider) =>
          provider.id === providerId
            ? { ...provider, isOnline: !currentStatus }
            : provider,
        );
        const currentOnline = prev.metrics?.providersOnline || 0;
        return {
          ...prev,
          providers: updatedProviders,
          metrics: {
            ...prev.metrics,
            providersOnline: Math.max(0, currentOnline + delta),
          },
        };
      });
    } catch (err) {
      setError(err.message || "Unable to toggle provider availability");
    } finally {
      setBusyProviders((prev) => {
        const next = new Set(prev);
        next.delete(providerId);
        return next;
      });
    }
  };

  const metrics = dashboardData?.metrics || {};

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation Sidebar/Top Bar */}
      <nav className="border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-100">
              <ShieldCheck className="text-white h-6 w-6" />
            </div>
            <h1 className="text-xl font-black tracking-tight uppercase">
              JibonDaak <span className="text-red-600">Admin</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
            {["overview", "drivers", "hospitals"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === t ? "bg-white text-red-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {activeTab === "overview" && (
          <section className="space-y-10 animate-in fade-in duration-500">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Users"
                value={metrics.totalUsers}
                icon={<Users className="text-blue-600" />}
              />
              <MetricCard
                title="Providers"
                value={metrics.totalProviders}
                subValue={`${metrics.providersOnline || 0} Online`}
                icon={<ShieldCheck className="text-red-600" />}
              />
              <MetricCard
                title="Active Requests"
                value={metrics.searchingRequests}
                icon={<MapPin className="text-orange-600" />}
              />
              <MetricCard
                title="Active Trips"
                value={metrics.activeBookings}
                icon={<Activity className="text-emerald-600" />}
              />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5" /> User Directory
                </h2>
                <div className="space-y-3">
                  {dashboardData?.users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center justify-between shadow-sm"
                    >
                      <div>
                        <p className="font-black text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-400 font-bold">
                          {user.email} • {user.role}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleUserActive(user.id, user.isActive)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border-2 transition-all ${user.isActive ? "border-emerald-100 text-emerald-600 bg-emerald-50" : "border-red-100 text-red-600 bg-red-50"}`}
                      >
                        {user.isActive ? "Active" : "Suspended"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Recent Requests
                </h2>
                <div className="space-y-3">
                  {dashboardData?.searchRequests.length === 0 ? (
                    <p className="text-slate-400 text-sm font-bold">
                      No pending requests
                    </p>
                  ) : (
                    dashboardData?.searchRequests.map((req) => (
                      <div
                        key={req.id}
                        className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-red-50 text-red-600 text-[10px] px-3 py-1 rounded-full font-black uppercase">
                            {req.ambulanceType || "General"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {new Date(req.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-600">
                          Location: {req.userLocation?.latitude.toFixed(3)},{" "}
                          {req.userLocation?.longitude.toFixed(3)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "drivers" && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[3rem] p-10 border-2 border-slate-100 shadow-xl shadow-slate-100/50">
              <h2 className="text-2xl font-black mb-2 tracking-tight">
                Add New Driver
              </h2>
              <p className="text-slate-400 text-sm font-bold mb-10 uppercase tracking-widest">
                Database Registration
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <AdminInput
                  label="Full Name"
                  placeholder="e.g. Supto"
                  value={driverForm.name}
                  onChange={(v) => setDriverForm({ ...driverForm, name: v })}
                />
                <AdminInput
                  label="Phone Number"
                  placeholder="017XXXXXXXX"
                  value={driverForm.phone}
                  onChange={(v) => setDriverForm({ ...driverForm, phone: v })}
                />
                <AdminInput
                  label="Vehicle Model"
                  placeholder="Toyota Hiace"
                  value={driverForm.ambulanceModel}
                  onChange={(v) =>
                    setDriverForm({ ...driverForm, ambulanceModel: v })
                  }
                />
                <AdminInput
                  label="Plate Number"
                  placeholder="DHA-1234"
                  value={driverForm.ambulanceNumber}
                  onChange={(v) =>
                    setDriverForm({ ...driverForm, ambulanceNumber: v })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 mb-10">
                <LocationSelect
                  label="Division"
                  list={locations.divisions}
                  value={driverForm.division_id}
                  onChange={(v) =>
                    setDriverForm({ ...driverForm, division_id: v })
                  }
                />
                <LocationSelect
                  label="District"
                  list={filteredDistricts}
                  value={driverForm.district_id}
                  onChange={(v) =>
                    setDriverForm({ ...driverForm, district_id: v })
                  }
                />
                <LocationSelect
                  label="Upazila"
                  list={filteredUpazilas}
                  value={driverForm.upazila_id}
                  onChange={(v) =>
                    setDriverForm({ ...driverForm, upazila_id: v })
                  }
                />
              </div>

              <button
                onClick={handleSaveDriver}
                disabled={loading}
                className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-3xl font-black transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-100 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="animate-spin h-5 w-5" />
                ) : (
                  <Save className="h-5 w-5" />
                )}{" "}
                ড্রইভার সেভ করুন
              </button>
            </div>
          </div>
        )}

        {activeTab === "hospitals" && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[3rem] p-10 border-2 border-slate-100 shadow-xl shadow-slate-100/50">
              <h2 className="text-2xl font-black mb-2 tracking-tight">
                Register Hospital
              </h2>
              <p className="text-slate-400 text-sm font-bold mb-10 uppercase tracking-widest">
                Regional Healthcare Mapping
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <AdminInput
                  label="Hospital Name"
                  placeholder="City Medical College"
                  value={hospForm.name}
                  onChange={(v) => setHospForm({ ...hospForm, name: v })}
                />
                <AdminInput
                  label="Contact Phone"
                  placeholder="02-XXXXXXX"
                  value={hospForm.phone}
                  onChange={(v) => setHospForm({ ...hospForm, phone: v })}
                />
                <div className="md:col-span-2">
                  <AdminInput
                    label="Street Address"
                    placeholder="123 Health Road, Rajshahi"
                    value={hospForm.address}
                    onChange={(v) => setHospForm({ ...hospForm, address: v })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 mb-10">
                <LocationSelect
                  label="Division"
                  list={locations.divisions}
                  value={hospForm.division_id}
                  onChange={(v) => setHospForm({ ...hospForm, division_id: v })}
                />
                <LocationSelect
                  label="District"
                  list={filteredDistricts}
                  value={hospForm.district_id}
                  onChange={(v) => setHospForm({ ...hospForm, district_id: v })}
                />
                <LocationSelect
                  label="Upazila"
                  list={filteredUpazilas}
                  value={hospForm.upazila_id}
                  onChange={(v) => setHospForm({ ...hospForm, upazila_id: v })}
                />
              </div>

              <button
                onClick={handleSaveHospital}
                disabled={loading}
                className="w-full py-5 bg-black hover:bg-slate-900 text-white rounded-3xl font-black transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="animate-spin h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}{" "}
                হাসপাতাল যোগ করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, subValue, icon }) {
  return (
    <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 transition-all hover:border-red-600 group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-red-50 transition-colors">
          {icon}
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300" />
      </div>
      <p className="text-3xl font-black text-slate-900 mb-1">{value ?? "—"}</p>
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
        {title}
      </p>
      {subValue && (
        <p className="mt-2 text-[9px] font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">
          {subValue}
        </p>
      )}
    </div>
  );
}

function AdminInput({ label, placeholder, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-sm font-bold outline-none focus:border-red-600 focus:bg-white transition-all"
      />
    </div>
  );
}

function LocationSelect({ label, list, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border-2 border-slate-100 rounded-xl p-3 text-xs font-bold outline-none focus:border-red-600 transition-all"
      >
        <option value="">Select {label}</option>
        {list.map((item) => (
          <option key={item.id} value={item.id}>
            {item.bn_name || item.name}
          </option>
        ))}
      </select>
    </div>
  );
}
