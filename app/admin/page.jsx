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
  // Hospital user creation
  const [hospitalUserForm, setHospitalUserForm] = useState({ hospitalId: "", username: "", password: "" });
  const [hospitalUserMsg, setHospitalUserMsg] = useState("");

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
      const safeLoad = async (url) => {
        const res = await fetch(url);
        if (!res.ok) return [];
        const ct = res.headers.get("content-type");
        if (!ct || !ct.includes("application/json")) {
          const text = await res.text();
          return text ? JSON.parse(text) : [];
        }
        return res.json();
      };

      const [divs, dists, upzs] = await Promise.all([
        safeLoad("/json/bd-divisions.json"),
        safeLoad("/json/bd-districts.json"),
        safeLoad("/json/bd-upazilas.json"),
      ]);
      setLocations({        divisions: divs.divisions || divs,
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
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const ct = response.headers.get("content-type");
      if (!ct || !ct.includes("application/json")) throw new Error("Invalid response from server");

      const data = await response.json();
      if (!data?.success) {
        throw new Error(data.error || "Failed to load admin data");
      }
      setDashboardData(data);
    } catch (err) {
      setError(err.message || "Unable to load admin console");
    } finally {
      setLoading(false);
    }
  };
  // Hospital user creation handler
  const handleCreateHospitalUser = async () => {
    setHospitalUserMsg("");
    if (!hospitalUserForm.hospitalId || !hospitalUserForm.username || !hospitalUserForm.password) {
      setHospitalUserMsg("Fill all fields");
      return;
    }
    const res = await fetch("/api/admin/hospital-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hospitalUserForm),
    });
    if (!res.ok) {
      setHospitalUserMsg("Server error creating user");
      return;
    }
    const data = await res.json().catch(() => ({ success: false }));
    if (data?.success) {
      setHospitalUserMsg("Hospital user created!");
      setHospitalUserForm({ hospitalId: "", username: "", password: "" });
      fetchDashboard();
    } else {
      setHospitalUserMsg(data.error || "Failed to create user");
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
      if (!res.ok) throw new Error("Server error saving driver");
      const data = await res.json().catch(() => ({ success: false, error: "Invalid JSON" }));
      if (!data?.success) throw new Error(data?.error || "Unknown error");

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
      if (!res.ok) throw new Error("Server error saving hospital");
      const data = await res.json().catch(() => ({ success: false, error: "Invalid JSON" }));
      if (!data?.success) throw new Error(data?.error || "Unknown error");

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
      if (!response.ok) throw new Error("Update failed");
      const ct = response.headers.get("content-type");
      if (!ct || !ct.includes("application/json")) throw new Error("Invalid server response");

      const data = await response.json();
      if (!data?.success) {
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
      if (!response.ok) throw new Error("Update failed");
      const ct = response.headers.get("content-type");
      if (!ct || !ct.includes("application/json")) throw new Error("Invalid server response");

      const data = await response.json();
      if (!data?.success) {
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
      if (!response.ok) throw new Error("Update failed");
      const ct = response.headers.get("content-type");
      if (!ct || !ct.includes("application/json")) throw new Error("Invalid server response");

      const data = await response.json();
      if (!data?.success) {
        throw new Error(data.error || "Failed to update provider status");
      }
      setDashboardData((prev) => {
        if (!prev) return prev;
        const delta = currentStatus ? -1 : 1;
        const updatedProviders = prev.providers.map((p) =>
          p.id === providerId ? { ...p, isOnline: !currentStatus } : p
        );
        return {
          ...prev,
          providers: updatedProviders,
          metrics: {
            ...prev.metrics,
            onlineProviders: (prev.metrics?.onlineProviders || 0) + delta,
          },
        };
      });
    } catch (err) {
      setError(err.message || "Unable to update provider status");
    } finally {
      setBusyProviders((prev) => {
        const next = new Set(prev);
        next.delete(providerId);
        return next;
      });
    }
  };

  if (loading && !dashboardData) {
    return <div className="min-h-screen flex items-center justify-center">লোডিং হচ্ছে...</div>;
  }

  const metrics = dashboardData?.metrics || {};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header with Navigation */}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-red-600" />
            <span className="text-xl font-bold">Admin Console</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab("overview")} className={`text-xs font-bold ${activeTab === "overview" ? "text-red-600" : "text-slate-500"}`}>
              Overview
            </button>
            <button onClick={() => setActiveTab("drivers")} className={`text-xs font-bold ${activeTab === "drivers" ? "text-red-600" : "text-slate-500"}`}>
              Drivers
            </button>
            <button onClick={() => setActiveTab("hospitals")} className={`text-xs font-bold ${activeTab === "hospitals" ? "text-red-600" : "text-slate-500"}`}>
              Hospitals
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl mb-6 text-red-600 text-sm font-bold">
            {error}
          </div>
        )}

        {activeTab === "overview" && (
          <section className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Total Users" value={metrics.totalUsers} subValue="+12% this week" icon={<Users className="text-blue-600" />} />
              <MetricCard title="Online Drivers" value={metrics.onlineProviders} icon={<RefreshCw className="text-red-600" />} />
              <MetricCard title="Active Requests" value={metrics.searchingRequests} icon={<MapPin className="text-orange-600" />} />
              <MetricCard title="Active Trips" value={metrics.activeBookings} icon={<Activity className="text-emerald-600" />} />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" /> User Directory
                </h2>
                <div className="space-y-3">
                  {dashboardData?.users.map((user) => (
                    <div key={user.id} className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex items-center justify-between">
                      <div>
                        <p className="font-black text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-400 font-bold">{user.email} • {user.role}</p>
                      </div>
                      <button
                        disabled={busyUserIds.has(user.id)}
                        onClick={() => toggleUserActive(user.id, user.isActive)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border-2 transition-all ${user.isActive ? "border-emerald-100 text-emerald-600 bg-emerald-50" : "border-red-100 text-red-600 bg-red-50"}`}
                      >
                        {user.isActive ? "Active" : "Suspended"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-600" /> Recent Requests
                </h2>
                <div className="space-y-3">
                  {dashboardData?.searchRequests.length === 0 ? (
                    <p className="text-slate-400 text-sm font-bold">No pending requests</p>
                  ) : (
                    dashboardData?.searchRequests.map((req) => (
                      <div key={req.id} className="bg-slate-50 border border-slate-100 rounded-3xl p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-red-50 text-red-600 text-[10px] px-3 py-1 rounded-full font-black uppercase">
                            {req.ambulanceType || "General"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {new Date(req.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-600">
                          Location: {req.userLocation?.latitude.toFixed(3)}, {req.userLocation?.longitude.toFixed(3)}
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
            <div className="bg-white rounded-[3rem] p-10 border-2 border-slate-100 shadow-xl">
              <h2 className="text-2xl font-black mb-2">Add New Driver</h2>
              <p className="text-slate-400 text-sm font-bold mb-10 uppercase tracking-widest">Database Registration</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <AdminInput label="Full Name" placeholder="e.g. Supto" value={driverForm.name} onChange={(v) => setDriverForm({ ...driverForm, name: v })} />
                <AdminInput label="Phone Number" placeholder="017XXXXXXXX" value={driverForm.phone} onChange={(v) => setDriverForm({ ...driverForm, phone: v })} />
                <AdminInput label="Vehicle Model" placeholder="Toyota Hiace" value={driverForm.ambulanceModel} onChange={(v) => setDriverForm({ ...driverForm, ambulanceModel: v })} />
                <AdminInput label="Plate Number" placeholder="DHA-1234" value={driverForm.ambulanceNumber} onChange={(v) => setDriverForm({ ...driverForm, ambulanceNumber: v })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 mb-10">
                <LocationSelect label="Division" list={locations.divisions} value={driverForm.division_id} onChange={(v) => setDriverForm({ ...driverForm, division_id: v })} />
                <LocationSelect label="District" list={filteredDistricts} value={driverForm.district_id} onChange={(v) => setDriverForm({ ...driverForm, district_id: v })} />
                <LocationSelect label="Upazila" list={filteredUpazilas} value={driverForm.upazila_id} onChange={(v) => setDriverForm({ ...driverForm, upazila_id: v })} />
              </div>
              <button onClick={handleSaveDriver} disabled={loading} className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-3xl font-black shadow-lg">
                {loading ? <RefreshCw className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />} ড্রাইভার সেভ করুন
              </button>
            </div>
          </div>
        )}

        {activeTab === "hospitals" && (
          <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            {/* Registration Form */}
            <div className="bg-white rounded-[3rem] p-10 border-2 border-slate-100 shadow-xl mb-10">
              <h2 className="text-2xl font-black mb-2">Register Hospital</h2>
              <p className="text-slate-400 text-sm font-bold mb-10 uppercase tracking-widest">Regional Healthcare Mapping</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <AdminInput label="Hospital Name" placeholder="City Medical College" value={hospForm.name} onChange={(v) => setHospForm({ ...hospForm, name: v })} />
                <AdminInput label="Contact Phone" placeholder="02-XXXXXXX" value={hospForm.phone} onChange={(v) => setHospForm({ ...hospForm, phone: v })} />
                <div className="md:col-span-2">
                  <AdminInput label="Street Address" placeholder="123 Health Road, Rajshahi" value={hospForm.address} onChange={(v) => setHospForm({ ...hospForm, address: v })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 mb-10">
                <LocationSelect label="Division" list={locations.divisions} value={hospForm.division_id} onChange={(v) => setHospForm({ ...hospForm, division_id: v })} />
                <LocationSelect label="District" list={filteredDistricts} value={hospForm.district_id} onChange={(v) => setHospForm({ ...hospForm, district_id: v })} />
                <LocationSelect label="Upazila" list={filteredUpazilas} value={hospForm.upazila_id} onChange={(v) => setHospForm({ ...hospForm, upazila_id: v })} />
              </div>
              <button onClick={handleSaveHospital} disabled={loading} className="w-full py-5 bg-black hover:bg-slate-900 text-white rounded-3xl font-black flex items-center justify-center gap-3">
                {loading ? <RefreshCw className="animate-spin h-5 w-5" /> : <Plus className="h-5 w-5" />} হাসপাতাল যোগ করুন
              </button>
            </div>

            {/* User Login Creation */}
            <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-100 shadow-sm mb-10">
              <h3 className="text-lg font-bold mb-4">Create Hospital Login</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <select className="p-3 border rounded-xl text-sm" value={hospitalUserForm.hospitalId} onChange={e => setHospitalUserForm(f => ({ ...f, hospitalId: e.target.value }))}>
                  <option value="">Select Hospital</option>
                  {dashboardData?.hospitals?.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                </select>
                <input className="p-3 border rounded-xl text-sm" placeholder="Username" value={hospitalUserForm.username} onChange={e => setHospitalUserForm(f => ({ ...f, username: e.target.value }))} />
                <input className="p-3 border rounded-xl text-sm" type="password" placeholder="Password" value={hospitalUserForm.password} onChange={e => setHospitalUserForm(f => ({ ...f, password: e.target.value }))} />
                <button className="bg-red-600 text-white rounded-xl font-bold px-4 hover:bg-red-700" onClick={handleCreateHospitalUser}>Create</button>
              </div>
              {hospitalUserMsg && <div className="text-sm text-red-600 font-bold">{hospitalUserMsg}</div>}
            </div>

            {/* Hospital List */}
            <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Registered Hospitals</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Contact</th>
                      <th className="p-3 text-left">Location</th>
                      <th className="p-3 text-left">Capacity</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.hospitals?.map(h => (
                      <tr key={h._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold">{h.name}</td>
                        <td className="p-3">{h.phone}</td>
                        <td className="p-3 text-slate-500">{h.address}</td>
                        <td className="p-3">Beds: {h.beds} | ICU: {h.icu}</td>
                        <td className="p-3">
                          <button className="text-red-600 hover:text-red-700 font-black flex items-center gap-1" onClick={async () => {
                            if (!window.confirm("Delete this hospital?")) return;
                            await fetch(`/api/admin/hospitals?hospitalId=${h._id}`, { method: "DELETE" });
                            fetchDashboard();
                          }}>
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
