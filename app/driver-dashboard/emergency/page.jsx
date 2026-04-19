"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  MapPin,
  User as UserIcon,
  Phone,
  Clock,
  AlertCircle,
  ShieldAlert,
  ChevronLeft,
} from "lucide-react";
import Toast from "@/app/components/Toast";
import RequestNotification from "@/app/components/provider/RequestNotification";

export default function EmergencyRequestsPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [previousRequestCount, setPreviousRequestCount] = useState(0);
  const [processingRequests, setProcessingRequests] = useState(new Set());

  // --- LOGIC (UNTOUCHED) ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
        return;
      }
      const parsedUser = JSON.parse(userData);
      const normalizedRole = String(parsedUser?.role || "").toLowerCase();

      if (normalizedRole !== "provider") {
        router.push("/dashboard");
        return;
      }

      setProvider(parsedUser);
      fetchProviderStatus(parsedUser._id);
      fetchIncomingRequests();
    }
  }, [router]);

  useEffect(() => {
    if (provider && isOnline) {
      const interval = setInterval(() => {
        fetchIncomingRequests();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [provider, isOnline]);

  const fetchProviderStatus = async (providerId) => {
    try {
      const response = await fetch(
        `/api/provider/status?providerId=${providerId}`,
      );
      if (!response.ok) return;
      const text = await response.text();
      if (!text) return;
      const data = JSON.parse(text);
      if (data.success) setIsOnline(data.isOnline);
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomingRequests = async () => {
    if (!provider) return;
    try {
      const response = await fetch(
        `/api/provider/requests?providerId=${provider._id}`,
      );
      if (!response.ok) return;
      const data = await response.json();
      if (data.success) {
        const newRequests = data.requests || [];
        const filteredRequests = newRequests.filter(
          (req) => !processingRequests.has(req._id),
        );
        if (
          filteredRequests.length > previousRequestCount &&
          filteredRequests.length > 0
        ) {
          setShowNotification(true);
        }
        setPreviousRequestCount(filteredRequests.length);
        setIncomingRequests(filteredRequests);
      }
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    if (processingRequests.has(requestId)) return;
    if (!provider?._id) {
      showToast("Provider information missing", "error");
      return;
    }
    setProcessingRequests((prev) => new Set(prev).add(requestId));
    setShowNotification(false);
    setIncomingRequests((prev) => prev.filter((req) => req._id !== requestId));

    try {
      const response = await fetch("/api/provider/accept-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, providerId: provider._id }),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (data.success) {
        showToast("Request accepted successfully!", "success");
        await fetch("/api/provider/update-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: requestId,
            status: "en_route",
            providerId: provider._id,
          }),
        });
      } else {
        showToast(data.error || "Failed to accept", "error");
        fetchIncomingRequests();
      }
    } catch (error) {
      showToast("Something went wrong", "error");
      fetchIncomingRequests();
    } finally {
      setTimeout(() => {
        setProcessingRequests((prev) => {
          const newSet = new Set(prev);
          newSet.delete(requestId);
          return newSet;
        });
      }, 10000);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setShowNotification(false);
    setIncomingRequests((prev) => prev.filter((req) => req._id !== requestId));
    try {
      const response = await fetch("/api/provider/reject-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, providerId: provider._id }),
      });
      if (response.ok) {
        showToast("Request rejected", "success");
        setTimeout(() => fetchIncomingRequests(), 2000);
      }
    } catch (error) {
      showToast("Failed to reject", "error");
      fetchIncomingRequests();
    }
  };

  const showToast = (message, type = "success") => setToast({ message, type });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-black font-bold uppercase tracking-widest">
            Loading Dispatch...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Top Navigation Row */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/provider-dashboard")}
            className="group flex items-center gap-2 px-4 py-2 border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-6 mb-10">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4">
              <ShieldAlert className="w-12 h-12 text-red-600" />
              Incoming <span className="text-red-600">Requests</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2">
              Active Emergency Dispatch Monitor
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div
              className={`flex items-center gap-2 px-4 py-1 rounded-full border-2 ${isOnline ? "border-green-600 text-green-600" : "border-red-600 text-red-600"} font-bold text-xs uppercase`}
            >
              <div
                className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-600 animate-pulse" : "bg-red-600"}`}
              ></div>
              {isOnline ? "System Online" : "System Offline"}
            </div>
          </div>
        </div>

        {/* Offline Warning */}
        {!isOnline && (
          <div className="bg-red-600 text-white p-4 mb-8 flex items-center gap-4 animate-bounce">
            <AlertCircle className="shrink-0" />
            <p className="font-bold uppercase text-sm tracking-wide">
              Immediate Action Required: You are offline. Change status to
              receive emergencies.
            </p>
          </div>
        )}

        {/* Empty State */}
        {incomingRequests.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-black uppercase">
              No Active Calls
            </h3>
            <p className="text-gray-400 mt-2">
              Standing by for incoming emergency signals...
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {incomingRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 transition-transform hover:-translate-y-1"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  {/* Left Side: Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="bg-red-600 text-white px-3 py-1 text-xs font-black uppercase tracking-widest">
                        Priority 1
                      </span>
                      <span className="text-gray-400 font-mono text-xs">
                        ID: {request._id.slice(-8).toUpperCase()}
                      </span>
                    </div>

                    <h2 className="text-3xl font-black uppercase mb-6 leading-none">
                      {request.ambulanceType}{" "}
                      <span className="text-red-600">Ambulance</span> Required
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Patient Details */}
                      <div className="space-y-3">
                        <p className="text-xs font-black uppercase text-gray-400 tracking-widest">
                          Caller Details
                        </p>
                        <div className="flex items-center gap-3">
                          <UserIcon className="w-5 h-5 text-red-600" />
                          <span className="font-bold text-lg">
                            {request.userName || "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-red-600" />
                          <span className="font-mono text-lg">
                            {request.userPhone || "---"}
                          </span>
                        </div>
                      </div>

                      {/* Logistics */}
                      <div className="space-y-3">
                        <p className="text-xs font-black uppercase text-gray-400 tracking-widest">
                          Location & Time
                        </p>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-black" />
                          <span className="font-mono font-bold">
                            {request.userLocation?.latitude.toFixed(4)},{" "}
                            {request.userLocation?.longitude.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-black" />
                          <span className="font-mono uppercase text-sm">
                            Received:{" "}
                            {new Date(request.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Triage Section */}
                    {request.triageInfo && (
                      <div className="mt-8 pt-6 border-t-2 border-gray-100">
                        <p className="text-xs font-black uppercase text-red-600 tracking-widest mb-3">
                          Medical Brief
                        </p>
                        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 border-l-4 border-red-600">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400">
                              Age
                            </p>
                            <p className="font-black">
                              {request.triageInfo.age}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400">
                              Gender
                            </p>
                            <p className="font-black">
                              {request.triageInfo.gender}
                            </p>
                          </div>
                          <div className="col-span-3 mt-2">
                            <p className="text-[10px] uppercase font-bold text-gray-400">
                              Chief Complaint
                            </p>
                            <p className="font-bold text-red-600">
                              {request.triageInfo.condition}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Actions */}
                  <div className="flex flex-col gap-4 min-w-[200px]">
                    <button
                      onClick={() => handleAcceptRequest(request._id)}
                      disabled={processingRequests.has(request._id)}
                      className={`w-full py-5 font-black uppercase tracking-widest text-lg border-2 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
                        processingRequests.has(request._id)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300 shadow-none"
                          : "bg-black text-white hover:bg-red-600"
                      }`}
                    >
                      {processingRequests.has(request._id)
                        ? "Deploying..."
                        : "Accept Call"}
                    </button>

                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      disabled={processingRequests.has(request._id)}
                      className="w-full py-4 font-bold uppercase tracking-widest text-sm border-2 border-black hover:bg-gray-100 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overlays */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showNotification && incomingRequests.length > 0 && (
        <RequestNotification
          requestCount={incomingRequests.length}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
}
