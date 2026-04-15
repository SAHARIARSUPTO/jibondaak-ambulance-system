'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AmbulanceFinder from "@/app/components/AmbulanceFinder";
import {
  Activity,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Users,
  Layers,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyUserIds, setBusyUserIds] = useState(() => new Set());
  const [busyAmbulances, setBusyAmbulances] = useState(() => new Set());
  const [busyProviders, setBusyProviders] = useState(() => new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.role !== "admin") {
      router.push("/login");
      return;
    }
    setAdminUser(parsed);
  }, [router]);

  useEffect(() => {
    if (adminUser) {
      fetchDashboard();
    }
  }, [adminUser]);

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
                user.id === userId ? data.user : user
              ),
            }
          : prev
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
                  : ambulance
              ),
            }
          : prev
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
            : provider
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <header className="mb-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-red-300">
            Admin console
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-black text-white">
                Control & Dispatch Center
              </h1>
              <p className="text-sm text-slate-400">
                Monitor users, providers, ambulances, and live requests from a
                single pane of glass.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <button
                onClick={fetchDashboard}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 font-semibold transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <RefreshCw className="h-4 w-4 text-white" />
                Refresh data
              </button>
              {loading && (
                <span className="text-xs uppercase tracking-[0.4em] text-slate-400">
                  syncing live metrics
                </span>
              )}
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-500/40 bg-red-900/30 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading && !dashboardData ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-300">
            Fetching admin data...
          </div>
        ) : (
          dashboardData && (
            <section className="space-y-8">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-6">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span>Total Users</span>
                  </div>
                  <p className="mt-4 text-3xl font-black text-white">
                    {metrics.totalUsers ?? "—"}
                  </p>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                    Registered
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-6">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span>Service Providers</span>
                  </div>
                  <p className="mt-4 text-3xl font-black text-white">
                    {metrics.totalProviders ?? "—"}
                  </p>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                    {metrics.providersOnline ?? 0} online
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-6">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <MapPin className="h-5 w-5 text-red-400" />
                    <span>Active Requests</span>
                  </div>
                  <p className="mt-4 text-3xl font-black text-white">
                    {metrics.searchingRequests ?? "—"}
                  </p>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                    Awaiting dispatch
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-6">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <Activity className="h-5 w-5 text-cyan-400" />
                    <span>Active Trips</span>
                  </div>
                  <p className="mt-4 text-3xl font-black text-white">
                    {metrics.activeBookings ?? "—"}
                  </p>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                    En route or arriving
                  </p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">User Directory</h2>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                      Latest 8
                    </p>
                  </div>
                  <div className="grid gap-3">
                    {dashboardData.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-100"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-base font-semibold text-white">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                          <button
                            onClick={() => toggleUserActive(user.id, user.isActive)}
                            disabled={busyUserIds.has(user.id)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] ${
                              user.isActive
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-red-500/20 text-red-300 border border-red-500/40"
                            }`}
                          >
                            {busyUserIds.has(user.id)
                              ? "Saving..."
                              : user.isActive
                              ? "Active"
                              : "Suspended"}
                          </button>
                        </div>
                        <p className="text-xs text-slate-500">
                          Role: {user.role}{" "}
                          {user.companyName ? (
                            <>
                              • {user.companyName}
                            </>
                          ) : (
                            ""
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-white">Providers</h2>
                      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                        Latest 8
                      </p>
                    </div>
                    <div className="space-y-3">
                      {dashboardData.providers.map((provider) => (
                        <div
                          key={provider.id}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100"
                        >
                          <div>
                            <p className="font-semibold text-white">{provider.companyName || provider.name}</p>
                            <p className="text-xs text-slate-400">{provider.email}</p>
                          </div>
                          <button
                            onClick={() => toggleProviderStatus(provider.id, provider.isOnline)}
                            disabled={busyProviders.has(provider.id)}
                            className={`rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.4em] ${
                              provider.isOnline
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-red-500/20 text-red-300 border border-red-500/40"
                            }`}
                          >
                            {busyProviders.has(provider.id)
                              ? "saving..."
                              : provider.isOnline
                              ? "Online"
                              : "Offline"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-white">Live Requests</h2>
                      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                        Latest {dashboardData.searchRequests.length}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {dashboardData.searchRequests.length === 0 ? (
                        <p className="text-xs text-slate-500">
                          No pending requests right now.
                        </p>
                      ) : (
                        dashboardData.searchRequests.map((request) => (
                          <div
                            key={request.id}
                            className="rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-300"
                          >
                            <p className="font-semibold text-white">{request.ambulanceType || "General"}</p>
                            <p>
                              {request.userLocation?.latitude?.toFixed(3)}, {request.userLocation?.longitude?.toFixed(3)}
                            </p>
                            <p className="text-[0.6rem] text-slate-400">
                              {new Date(request.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Ambulances</h2>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                    Latest {dashboardData.ambulances.length}
                  </p>
                </div>
                <div className="grid gap-3 text-sm">
                  {dashboardData.ambulances.map((ambulance) => (
                    <div
                      key={ambulance.id}
                      className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-base font-semibold text-white">{ambulance.type}</p>
                          <p className="text-xs text-slate-400">
                            Driver: {ambulance.driverName} • Vehicle #{ambulance.vehicleNumber}
                          </p>
                      </div>
                      <button
                        onClick={() => toggleAmbulanceAvailability(ambulance.id, ambulance.isAvailable)}
                        disabled={busyAmbulances.has(ambulance.id)}
                        className={`rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.4em] ${
                          ambulance.isAvailable
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-red-500/20 text-red-300 border border-red-500/40"
                        }`}
                      >
                        {busyAmbulances.has(ambulance.id)
                          ? "Saving..."
                          : ambulance.isAvailable
                          ? "Available"
                          : "Busy"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Ambulance Finder</h2>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                    Live search
                  </p>
                </div>
                <AmbulanceFinder
                  className="w-full"
                  sectionLabel="Admin search"
                  sectionTitleFallback="Enter any point"
                />
              </section>
            </section>
          )
        )}
      </div>
    </div>
  );
}
