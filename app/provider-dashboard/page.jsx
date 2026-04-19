"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Ambulance,
  Loader2,
  Plus,
  Power,
  Bell,
  MapPin,
  User,
  Phone,
  Clock,
  MessageCircle,
  BadgeDollarSign,
  Save,
  Edit3,
  XCircle,
} from "lucide-react";
import Toast from "../components/Toast";
import AddAmbulanceModal from "../components/provider/AddAmbulanceModal";
import RequestNotification from "../components/provider/RequestNotification";

export default function ProviderDashboard() {
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [showAddAmbulance, setShowAddAmbulance] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [previousRequestCount, setPreviousRequestCount] = useState(0);
  const [processingRequests, setProcessingRequests] = useState(new Set());
  const [autoProvisioning, setAutoProvisioning] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const [routeList, setRouteList] = useState([]);
  const [fareMap, setFareMap] = useState({});

  // Location Data for Name Resolution
  const [allDivisions, setAllDivisions] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    type: "non-ac",
    vehicleNumber: "",
    licenseNumber: "",
    driverName: "",
    driverPhone: "",
    locationLabel: "",
    divisionId: "",
    upazilaId: "",
  });

  useEffect(() => {
    // Check if provider is logged in
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
        return;
      }
      const parsedUser = JSON.parse(userData);
      const normalizedRole = String(parsedUser?.role || "").toLowerCase();

      // Check if user is provider
      if (normalizedRole !== "provider") {
        router.push("/dashboard");
        return;
      }

      setProvider(parsedUser);
      fetchProviderData(parsedUser._id);
    }
  }, [router]);

  useEffect(() => {
    if (provider && isOnline) {
      // Poll for new requests every 3 seconds when online
      const interval = setInterval(() => {
        fetchIncomingRequests();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [provider, isOnline]);

  useEffect(() => {
    if (!isOnline || activeBookings.length === 0) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    const syncGps = () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;
          try {
            await Promise.all(
              activeBookings.map((booking) =>
                fetch("/api/provider/update-status", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    bookingId: booking._id,
                    status:
                      booking.status === "driver_assigned"
                        ? "en_route"
                        : booking.status,
                    latitude,
                    longitude,
                    providerId: provider?._id,
                  }),
                }),
              ),
            );
          } catch (error) {}
        },
        () => {},
        { enableHighAccuracy: true, timeout: 15000 },
      );
    };
    syncGps();
    const interval = setInterval(syncGps, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isOnline, activeBookings]);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const [routesRes, divsRes, upzRes] = await Promise.all([
          fetch("/json/routes.json"),
          fetch("/json/bd-divisions.json"),
          fetch("/json/bd-upazilas.json"),
        ]);

        const routesData = await routesRes.json();
        const divsData = await divsRes.json();
        const upzData = await upzRes.json();

        setRouteList(routesData?.routes || []);
        setAllDivisions(divsData?.divisions || divsData || []);
        setAllUpazilas(upzData?.upazilas || upzData || []);
      } catch (error) {}
    };
    loadAssets();
  }, []);

  useEffect(() => {
    if (!provider?._id) return;
    const driverId = `provider_${provider._id}`;
    fetch(`/api/provider/route-fares?driverId=${driverId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setFareMap(d.fares || {});
      })
      .catch(() => {});
  }, [provider?._id]);

  useEffect(() => {
    if (!selectedBookingId) {
      setMessages([]);
      return;
    }
    const loadMessages = async () => {
      try {
        const res = await fetch(
          `/api/bookings/chat?bookingId=${selectedBookingId}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) setMessages(data.messages || []);
      } catch (error) {}
    };
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedBookingId]);

  const fetchProviderData = async (providerId) => {
    try {
      // Fetch ambulances
      const ambulanceRes = await fetch(
        `/api/provider/ambulances?providerId=${providerId}`,
      );
      const ambulanceData = await ambulanceRes.json();

      if (ambulanceData.success) {
        setAmbulances(ambulanceData.ambulances);
        if ((ambulanceData.ambulances || []).length === 0) {
          autoProvisionDriverProfile(providerId);
        }
      }

      // Fetch provider status
      const statusRes = await fetch(
        `/api/provider/status?providerId=${providerId}`,
      );
      const statusData = await statusRes.json();

      if (statusData.success) {
        setIsOnline(statusData.isOnline);
      }

      // Fetch active bookings
      fetchActiveBookings(providerId);
      fetchProviderBookings(providerId);
    } catch (error) {
      console.error("Error fetching provider data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviderBookings = async (providerId) => {
    try {
      const response = await fetch(
        `/api/provider/bookings?providerId=${providerId}`,
      );
      if (!response.ok) return;
      const data = await response.json();
      if (data.success) {
        setAllBookings(data.bookings || []);
        setTotalEarnings(Number(data.earnings || 0));
      }
    } catch (error) {}
  };

  const autoProvisionDriverProfile = async (providerId) => {
    if (autoProvisioning) return;
    setAutoProvisioning(true);
    try {
      const response = await fetch("/api/provider/ambulances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          type: "non-ac",
          vehicleNumber: `DRV-${String(providerId).slice(-6).toUpperCase()}`,
          licenseNumber:
            provider?.licenseNumber ||
            `LIC-${String(providerId).slice(-6).toUpperCase()}`,
          driverName: provider?.name || "Driver",
          driverPhone: provider?.phone || "",
          locationLabel: "Registration area",
          divisionId: provider?.division || undefined,
          upazilaId: provider?.upazila || undefined,
        }),
      });
      const data = await response.json();
      if (response.ok && data?.success) {
        setAmbulances([data.ambulance]);
        showToast("Driver profile auto-created from registration.", "success");
      }
    } catch (error) {
      console.error("Auto provision failed:", error);
    } finally {
      setAutoProvisioning(false);
    }
  };

  const fetchIncomingRequests = async () => {
    if (!provider) return;

    try {
      const response = await fetch(
        `/api/provider/requests?providerId=${provider._id}`,
      );

      // Check if response is ok
      if (!response.ok) {
        console.error("❌ Request failed with status:", response.status);
        return;
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ Response is not JSON:", contentType);
        return;
      }

      const data = await response.json();

      if (data.success) {
        const newRequests = data.requests || [];

        // Filter out requests that are currently being processed
        const filteredRequests = newRequests.filter(
          (req) => !processingRequests.has(req._id),
        );

        console.log(
          "📋 Fetched requests:",
          newRequests.length,
          "After filtering:",
          filteredRequests.length,
        );

        // Check if request count increased (new request arrived)
        if (
          filteredRequests.length > previousRequestCount &&
          filteredRequests.length > 0
        ) {
          setShowNotification(true);
        }

        setPreviousRequestCount(filteredRequests.length);
        setIncomingRequests(filteredRequests);
      } else {
        console.error("❌ API returned error:", data.error);
      }
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
    }
  };

  const fetchActiveBookings = async (providerId) => {
    try {
      const response = await fetch(
        `/api/provider/active-bookings?providerId=${providerId}`,
      );

      if (!response.ok) {
        console.error("Failed to fetch active bookings:", response.status);
        return;
      }

      const text = await response.text();
      if (!text) {
        console.log("No active bookings");
        return;
      }

      const data = JSON.parse(text);

      if (data.success) {
        setActiveBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching active bookings:", error);
    }
  };

  const handleToggleStatus = async () => {
    if (ambulances.length === 0) {
      showToast(
        "Please add at least one ambulance before going online",
        "warning",
      );
      return;
    }

    try {
      const response = await fetch("/api/provider/toggle-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId: provider._id,
          isOnline: !isOnline,
        }),
      });

      if (!response.ok) {
        showToast("Failed to update status", "error");
        return;
      }

      const text = await response.text();
      if (!text) {
        showToast("Empty response from server", "error");
        return;
      }

      const data = JSON.parse(text);

      if (data.success) {
        setIsOnline(!isOnline);
        showToast(
          !isOnline
            ? "You are now online and ready to receive requests"
            : "You are now offline",
          "success",
        );
      }
    } catch (error) {
      showToast("Failed to update status", "error");
    }
  };

  const handleAcceptRequest = async (requestId) => {
    console.log("🔵 Accept clicked:", {
      requestId,
      providerId: provider?._id,
      alreadyProcessing: processingRequests.has(requestId),
    });

    // CRITICAL: Check if already processing - prevent duplicate
    if (processingRequests.has(requestId)) {
      console.log(
        "⚠️ Already processing this request, BLOCKING duplicate accept",
      );
      return;
    }

    if (!provider || !provider._id) {
      showToast(
        "Provider information missing. Please refresh the page.",
        "error",
      );
      return;
    }

    // IMMEDIATELY mark as processing BEFORE any async operations
    setProcessingRequests((prev) => {
      const newSet = new Set(prev);
      newSet.add(requestId);
      console.log(
        "🔒 Locked request:",
        requestId,
        "Total locked:",
        newSet.size,
      );
      return newSet;
    });

    // Close popup if open
    setShowNotification(false);

    // Immediately remove from UI for instant feedback
    setIncomingRequests((prev) => {
      const filtered = prev.filter((req) => req._id !== requestId);
      console.log(
        "🗑️ Removed from UI:",
        requestId,
        "Remaining:",
        filtered.length,
      );
      return filtered;
    });

    try {
      console.log("📡 Sending accept request to API...");

      const response = await fetch("/api/provider/accept-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          providerId: provider._id,
        }),
      });

      if (!response.ok) {
        showToast("Failed to accept request", "error");
        fetchIncomingRequests();
        return;
      }

      const text = await response.text();
      if (!text) {
        showToast("Empty response from server", "error");
        fetchIncomingRequests();
        return;
      }

      const data = JSON.parse(text);

      console.log("📥 API Response:", {
        status: response.status,
        success: data.success,
      });

      if (data.success) {
        showToast("Request accepted successfully!", "success");

        // Update booking status to "en_route"
        await updateBookingStatus(requestId, "en_route");

        // Refresh active bookings
        await fetchActiveBookings(provider._id);

        console.log("✅ Accept complete");
      } else {
        console.error("❌ Accept failed:", data.error);
        showToast(data.error || "Failed to accept request", "error");

        // Only restore if it was a real failure (not "already accepted")
        if (!data.error?.includes("already accepted")) {
          fetchIncomingRequests();
        }
      }
    } catch (error) {
      console.error("❌ Accept error:", error);
      showToast("Something went wrong", "error");
      fetchIncomingRequests();
    } finally {
      setLoadingAction(false);
      // Keep in processing set for 10 seconds to prevent any duplicate
      setTimeout(() => {
        setProcessingRequests((prev) => {
          const newSet = new Set(prev);
          newSet.delete(requestId);
          console.log("🔓 Unlocked request:", requestId);
          return newSet;
        });
      }, 10000);
    }
  };

  const handleCancelTrip = async (bookingId) => {
    const reason = prompt(
      "ট্রিপ বাতিল করার কারণ লিখুন (Comment for cancellation):",
    );
    if (!reason) return;

    setLoadingAction(true);
    try {
      const res = await fetch("/api/provider/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          status: "cancelled",
          providerId: provider?._id,
          reason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Trip cancelled successfully", "success");
        fetchActiveBookings(provider._id);
        fetchProviderBookings(provider._id);
      } else {
        showToast(data.error || "Failed to cancel", "error");
      }
    } catch (e) {
      showToast("Something went wrong", "error");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    // Close popup if open
    setShowNotification(false);

    // Immediately remove from UI
    setIncomingRequests((prev) => {
      const filtered = prev.filter((req) => req._id !== requestId);
      console.log(
        "Rejecting request:",
        requestId,
        "Remaining:",
        filtered.length,
      );
      return filtered;
    });

    try {
      setLoadingAction(true);
      const response = await fetch("/api/provider/reject-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          providerId: provider._id,
        }),
      });

      if (!response.ok) {
        showToast("Failed to reject request", "error");
        fetchIncomingRequests();
        return;
      }

      const text = await response.text();
      if (!text) {
        showToast("Empty response from server", "error");
        fetchIncomingRequests();
        return;
      }

      const data = JSON.parse(text);

      if (data.success) {
        showToast("Request rejected", "success");

        // Force refresh after 2 seconds
        setTimeout(() => {
          fetchIncomingRequests();
        }, 2000);
      } else {
        showToast(data.error || "Failed to reject", "error");
        fetchIncomingRequests();
      }
    } catch (error) {
      console.error("Reject error:", error);
      showToast("Something went wrong", "error");
      fetchIncomingRequests();
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await fetch("/api/provider/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          status,
          providerId: provider?._id,
        }),
      });
      fetchActiveBookings(provider._id);
      showToast(`Status updated to ${status.replace("_", " ")}`, "success");
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      setLoadingAction(false);
    }
  };

  const getAreaName = (divId, upzId) => {
    const div = allDivisions.find((d) => String(d.id) === String(divId));
    const upz = allUpazilas.find((u) => String(u.id) === String(upzId));
    if (!div && !upz) return "Location pending...";
    return `${upz?.bn_name || ""}, ${div?.bn_name || ""}`;
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleAmbulanceAdded = (newAmbulance) => {
    setAmbulances((prev) => [...prev, newAmbulance]);
    setProfileForm({
      type: newAmbulance.type || "non-ac",
      vehicleNumber: newAmbulance.vehicleNumber || "",
      licenseNumber: newAmbulance.licenseNumber || "",
      driverName: newAmbulance.driverName || "",
      driverPhone: newAmbulance.driverPhone || "",
      locationLabel: newAmbulance.locationLabel || "",
      divisionId: provider?.division || "",
      upazilaId: provider?.upazila || "",
    });
    showToast("Ambulance added successfully!", "success");
  };

  const sendMessage = async () => {
    if (!selectedBookingId || !chatText.trim() || !provider?._id) return;
    try {
      const res = await fetch("/api/bookings/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBookingId,
          senderId: provider._id,
          senderRole: "provider",
          text: chatText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setChatText("");
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (error) {}
  };

  const handleFareChange = async (routeId, amount) => {
    if (!provider?._id) return;
    const value = Number(amount);
    if (!Number.isFinite(value)) return;
    const driverId = `provider_${provider._id}`;
    try {
      const res = await fetch("/api/provider/route-fares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId, routeId, amount: value }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error();
      setFareMap((prev) => ({ ...prev, [routeId]: value }));
      showToast("Fare updated", "success");
    } catch (error) {
      showToast("Failed to update fare", "error");
    }
  };

  useEffect(() => {
    if (!ambulances.length) return;
    const a = ambulances[0];
    setProfileForm({
      type: a.type || "non-ac",
      vehicleNumber: a.vehicleNumber || "",
      licenseNumber: a.licenseNumber || "",
      driverName: a.driverName || "",
      driverPhone: a.driverPhone || "",
      locationLabel: a.locationLabel || "",
      divisionId: provider?.division || "",
      upazilaId: provider?.upazila || "",
    });
  }, [ambulances, provider?.division, provider?.upazila]);

  const saveDriverProfile = async () => {
    if (!provider?._id) return;
    try {
      const response = await fetch("/api/provider/ambulances", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: provider._id,
          ...profileForm,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Failed to save profile");
      }
      setAmbulances([data.ambulance]);
      setEditingProfile(false);
      showToast("Driver profile updated.", "success");
    } catch (error) {
      showToast(error.message || "Failed to save profile", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff7f7] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            {/* Animated background circle */}
            <div className="absolute inset-0 w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 bg-cyan-500 rounded-full animate-pulse opacity-30"></div>
            </div>

            {/* Ambulance icon */}
            <div className="relative bg-gradient-to-br from-red-600 to-red-500 p-6 rounded-3xl shadow-2xl mx-auto w-32 h-32 flex items-center justify-center border-2 border-blue-400/30">
              <Ambulance className="w-16 h-16 text-slate-900 animate-bounce" />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Loading Dashboard
            </h2>
            <p className="text-slate-600 text-lg">Please wait...</p>

            {/* Loading dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div
                className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-3 h-3 bg-blue-300 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7f7]">
      {loadingAction && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 border border-red-50">
            <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
            <p className="font-black text-slate-800">
              আপডেট হচ্ছে, অপেক্ষা করুন...
            </p>
          </div>
        </div>
      )}

      <div>
        {/* Header */}
        <header className="bg-white border-b border-red-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-red-600 to-red-500 p-3 rounded-xl shadow-lg border border-blue-400/30">
                  <Ambulance className="w-8 h-8 text-slate-900" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Driver Dashboard
                  </h1>
                  <p className="text-sm text-slate-500">
                    {provider?.companyName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleToggleStatus}
                  className={`px-4 py-2 rounded-lg font-medium border ${
                    isOnline
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("requests-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                >
                  <Bell className="w-4 h-4" /> Requests
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("chat-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                >
                  <MessageCircle className="w-4 h-4" /> Chat
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("fares-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                >
                  <BadgeDollarSign className="w-4 h-4" /> Fares
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() =>
                document
                  .getElementById("requests-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="p-4 rounded-xl bg-white border border-red-100 text-left hover:border-red-300"
            >
              <p className="text-xs text-slate-500">Manage</p>
              <p className="text-lg font-bold text-slate-900">
                Emergency Requests
              </p>
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("chat-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="p-4 rounded-xl bg-white border border-red-100 text-left hover:border-red-300"
            >
              <p className="text-xs text-slate-500">Communicate</p>
              <p className="text-lg font-bold text-slate-900">Trip Chat</p>
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("fares-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="p-4 rounded-xl bg-white border border-red-100 text-left hover:border-red-300"
            >
              <p className="text-xs text-slate-500">Configure</p>
              <p className="text-lg font-bold text-slate-900">Route Fares</p>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-xl p-6 border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Driver Vehicle</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {ambulances.length ? "1" : "0"}
                  </p>
                </div>
                <Ambulance className="w-12 h-12 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-6 border border-yellow-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-700 text-sm">Pending Requests</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {incomingRequests.length}
                  </p>
                </div>
                <Bell className="w-12 h-12 text-yellow-400" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-6 border border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-700 text-sm">Active Bookings</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {activeBookings.length}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-green-400" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-700 text-sm">Status</p>
                  <p
                    className={`text-2xl font-bold ${isOnline ? "text-green-400" : "text-slate-400"}`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
                <Power
                  className={`w-12 h-12 ${isOnline ? "text-green-400" : "text-slate-400"}`}
                />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-xl p-6 border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Total Earnings</p>
                  <p className="text-3xl font-bold text-slate-900">
                    ৳{totalEarnings}
                  </p>
                </div>
                <BadgeDollarSign className="w-12 h-12 text-red-500" />
              </div>
            </div>
          </div>

          {/* Emergency Requests Alert */}
          {incomingRequests.length > 0 && (
            <div className="mb-8">
              <div
                onClick={() =>
                  document
                    .getElementById("requests-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 backdrop-blur-lg rounded-xl shadow-xl p-6 border-2 border-yellow-500/50 cursor-pointer hover:border-yellow-400 transition-all transform hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-500/30">
                      <Bell className="w-8 h-8 text-yellow-400 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">
                        {incomingRequests.length} New Emergency{" "}
                        {incomingRequests.length === 1 ? "Request" : "Requests"}
                      </h3>
                      <p className="text-amber-700">
                        Click here to view and accept requests
                      </p>
                    </div>
                  </div>
                  <div className="text-yellow-400 text-4xl">→</div>
                </div>
              </div>
            </div>
          )}

          <section
            id="requests-section"
            className="mb-8 bg-white rounded-xl shadow-xl p-6 border border-red-100"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Emergency Requests
            </h2>
            {incomingRequests.length === 0 ? (
              <p className="text-slate-500">No pending requests right now.</p>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="rounded-lg border border-red-100 bg-[#fffafa] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">
                          {request.userName || "User"}
                        </p>
                        <p className="text-sm text-slate-600">
                          Phone: {request.userPhone || "--"}
                        </p>
                        <p className="text-sm font-bold text-blue-600">
                          অঞ্চল:{" "}
                          {getAreaName(
                            request.userDivision,
                            request.userUpazila,
                          )}
                        </p>
                        <p className="text-sm text-slate-600">
                          Ambulance Type: {request.ambulanceType}
                        </p>
                        <p className="text-sm text-slate-600">
                          Condition: {request.triageInfo?.condition || "--"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          disabled={processingRequests.has(request._id)}
                          className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:bg-slate-300"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          disabled={processingRequests.has(request._id)}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:bg-slate-300"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mb-8 bg-white rounded-xl shadow-xl p-6 border border-red-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Ongoing Trips
            </h2>
            {activeBookings.length === 0 ? (
              <p className="text-slate-500">No active bookings.</p>
            ) : (
              <div className="space-y-3">
                {activeBookings.map((b) => (
                  <div
                    key={b._id}
                    className="rounded-lg border border-red-100 bg-[#fffafa] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">
                          {b.userName || "User"}
                        </p>
                        <p className="text-sm text-slate-600">
                          Phone: {b.userPhone || "--"}
                        </p>
                        <p className="text-sm font-bold text-blue-600">
                          অঞ্চল: {getAreaName(b.userDivision, b.userUpazila)}
                        </p>
                        <p className="text-xs uppercase font-black text-slate-400">
                          Status: {b.status.replace("_", " ")}
                        </p>
                        <p className="text-sm font-bold text-red-600">
                          Fare: ৳{b.offeredFare || 0}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "en_route",
                          "arrived",
                          "trip_started",
                          "destination_reached",
                          "awaiting_seeker_approval",
                        ].map((s) => (
                          <button
                            key={s}
                            onClick={() => updateBookingStatus(b._id, s)}
                            className="px-3 py-1.5 rounded-md border border-red-200 text-red-700 bg-red-50 text-sm"
                          >
                            {s === "en_route" && "পথে আছি"}
                            {s === "arrived" && "রোগীর কাছে পৌঁছেছি"}
                            {s === "trip_started" && "ট্রিপ শুরু হয়েছে"}
                            {s === "destination_reached" && "গন্তব্যে পৌঁছেছি"}
                            {s === "awaiting_seeker_approval" &&
                              "সম্পন্ন (কনফার্মেশন)"}
                          </button>
                        ))}
                        <button
                          onClick={() => setSelectedBookingId(b._id)}
                          className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm"
                        >
                          Open Chat
                        </button>
                        <button
                          onClick={() => handleCancelTrip(b._id)}
                          className="px-3 py-1.5 rounded-md border border-red-600 text-red-600 hover:bg-red-50 text-sm flex items-center gap-1"
                        >
                          <XCircle className="w-3 h-3" /> বাতিল করুন
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Driver Profile */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">
                Driver Profile
              </h2>
              {!ambulances.length && (
                <button
                  onClick={() => setShowAddAmbulance(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg border border-red-300"
                >
                  <Plus className="w-5 h-5" />
                  Complete Profile
                </button>
              )}
            </div>

            {ambulances.length === 0 ? (
              <div className="bg-white rounded-xl shadow-xl p-12 text-center border border-slate-700">
                <Ambulance className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-300 mb-4">
                  {autoProvisioning
                    ? "Creating your driver profile from registration info..."
                    : "Complete your driver profile before going online"}
                </p>
                <button
                  onClick={() => setShowAddAmbulance(true)}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg border border-red-300"
                >
                  {autoProvisioning
                    ? "Setting Up..."
                    : "Complete Driver Profile"}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-xl p-6 border border-red-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Vehicle & Location
                  </h3>
                  <button
                    onClick={() => setEditingProfile((v) => !v)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-red-200 text-red-700 bg-red-50"
                  >
                    <Edit3 className="w-4 h-4" />{" "}
                    {editingProfile ? "Cancel" : "Edit"}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editingProfile ? (
                    <>
                      <input
                        className="border border-red-200 rounded-lg px-3 py-2"
                        placeholder="Ambulance Type"
                        value={profileForm.type}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            type: e.target.value,
                          })
                        }
                      />
                      <input
                        className="border border-red-200 rounded-lg px-3 py-2"
                        placeholder="Vehicle Number"
                        value={profileForm.vehicleNumber}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            vehicleNumber: e.target.value,
                          })
                        }
                      />
                      <input
                        className="border border-red-200 rounded-lg px-3 py-2"
                        placeholder="License Number"
                        value={profileForm.licenseNumber}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            licenseNumber: e.target.value,
                          })
                        }
                      />
                      <input
                        className="border border-red-200 rounded-lg px-3 py-2"
                        placeholder="Driver Name"
                        value={profileForm.driverName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            driverName: e.target.value,
                          })
                        }
                      />
                      <input
                        className="border border-red-200 rounded-lg px-3 py-2"
                        placeholder="Driver Phone"
                        value={profileForm.driverPhone}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            driverPhone: e.target.value,
                          })
                        }
                      />
                      <input
                        className="border border-red-200 rounded-lg px-3 py-2"
                        placeholder="Location Label"
                        value={profileForm.locationLabel}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            locationLabel: e.target.value,
                          })
                        }
                      />
                      <button
                        onClick={saveDriverProfile}
                        className="md:col-span-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white"
                      >
                        <Save className="w-4 h-4" /> Save Profile
                      </button>
                    </>
                  ) : (
                    <>
                      <p>
                        <span className="text-slate-500">Type:</span>{" "}
                        {ambulances[0]?.type}
                      </p>
                      <p>
                        <span className="text-slate-500">Vehicle:</span>{" "}
                        {ambulances[0]?.vehicleNumber}
                      </p>
                      <p>
                        <span className="text-slate-500">License:</span>{" "}
                        {ambulances[0]?.licenseNumber}
                      </p>
                      <p>
                        <span className="text-slate-500">Driver:</span>{" "}
                        {ambulances[0]?.driverName}
                      </p>
                      <p>
                        <span className="text-slate-500">Phone:</span>{" "}
                        {ambulances[0]?.driverPhone}
                      </p>
                      <p>
                        <span className="text-slate-500">Area:</span>{" "}
                        {ambulances[0]?.locationLabel ||
                          `Division ${provider?.division || "--"}, Upazila ${provider?.upazila || "--"}`}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 border border-red-100">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              Recent Trips
            </h3>
            <div className="space-y-2">
              {allBookings.slice(0, 8).map((b) => (
                <div
                  key={b._id}
                  className="p-3 rounded-lg border border-red-100 bg-[#fffafa]"
                >
                  <div className="flex justify-between">
                    <p className="font-semibold text-slate-900">
                      {b.userName || "User"}
                    </p>
                    <p className="text-sm text-slate-500">{b.status}</p>
                  </div>
                  <p className="text-sm text-slate-600">
                    Phone: {b.userPhone || "--"}
                  </p>
                  <p className="text-sm text-slate-600">
                    অঞ্চল: {getAreaName(b.userDivision, b.userUpazila)}
                  </p>
                  <p className="text-sm font-bold text-red-600">
                    Fare: ৳{b.offeredFare || 0}
                  </p>
                </div>
              ))}
              {allBookings.length === 0 && (
                <p className="text-slate-500 text-sm">No trips yet.</p>
              )}
            </div>
          </div>

          <section
            id="chat-section"
            className="mt-8 bg-white rounded-xl shadow-xl p-6 border border-red-100"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-3">Trip Chat</h3>
            <div className="mb-3">
              <select
                className="w-full md:w-80 border border-red-200 rounded-lg px-3 py-2"
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
              >
                <option value="">Select ongoing trip</option>
                {activeBookings.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.userName || "User"} - {b._id}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-64 overflow-y-auto bg-[#fffafa] border border-red-100 rounded-lg p-3 space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.senderRole === "provider"
                      ? "ml-auto bg-red-600 text-white"
                      : "bg-white border border-red-100 text-slate-700"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {selectedBookingId && messages.length === 0 && (
                <p className="text-sm text-slate-500">No messages yet.</p>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Type message..."
                className="flex-1 border border-red-200 rounded-lg px-3 py-2"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Send
              </button>
            </div>
          </section>

          <section
            id="fares-section"
            className="mt-8 bg-white rounded-xl shadow-xl p-6 border border-red-100"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              Route Fare Settings
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Set custom fares for your driver account.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routeList.map((route) => (
                <div
                  key={route.id}
                  className="rounded-lg border border-red-100 p-4 bg-[#fffafa]"
                >
                  <p className="font-semibold text-slate-900">{route.name}</p>
                  <p className="text-sm text-slate-500 mb-2">
                    Base fare: ৳{route.baseFare}
                  </p>
                  <input
                    type="number"
                    defaultValue={fareMap[route.id] ?? route.baseFare}
                    onBlur={(e) => handleFareChange(route.id, e.target.value)}
                    className="w-full border border-red-200 rounded-lg px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Add Ambulance Modal */}
        <AddAmbulanceModal
          isOpen={showAddAmbulance}
          onClose={() => setShowAddAmbulance(false)}
          onSuccess={handleAmbulanceAdded}
          providerId={provider?._id}
          provider={provider}
        />

        {/* Request Notification Toast */}
        {showNotification && incomingRequests.length > 0 && (
          <RequestNotification
            requestCount={incomingRequests.length}
            onClose={() => setShowNotification(false)}
          />
        )}
      </div>
    </div>
  );
}
