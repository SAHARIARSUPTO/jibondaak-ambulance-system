﻿"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Loader2,
  Edit3,
  Save,
  X,
  Ambulance,
  Phone,
  User,
  Route,
  CircleDot,
  CheckCircle2,
  HeartPulse,
  ShieldAlert,
  History,
  Navigation,
  Clock,
  Hospital,
  Activity,
  FileText,
  Stethoscope,
  Baby,
  Zap,
  Wind,
  BedSingle,
  Send,
  Star,
  BadgeDollarSign,
  MessageCircle,
} from "lucide-react";

const DEFAULT_LOCATION = { latitude: 23.8103, longitude: 90.4125 };

const TRACKING_STEPS = [
  { key: "pending_driver_acceptance", label: "Awaiting driver approval" },
  { key: "searching", label: "Searching for ambulance" },
  { key: "driver_assigned", label: "Driver assigned" },
  { key: "en_route", label: "Ambulance is on the way" },
  { key: "arrived", label: "Ambulance has arrived" },
  { key: "destination_reached", label: "Destination reached" },
  { key: "awaiting_seeker_approval", label: "Awaiting your confirmation" },
  { key: "completed", label: "Trip completed" },
  { key: "rejected", label: "Request rejected" },
  { key: "cancelled", label: "Trip cancelled" },
];

const FIRST_AID_TIPS = {
  critical:
    "Check breathing, lay the patient flat, and apply pressure to any bleeding wound.",
  urgent:
    "Keep the patient calm, make sure there is fresh air, and consult a doctor before giving any medicine.",
  stable:
    "Monitor the patient and wait for the ambulance. Ask them to keep movement to a minimum.",
};

const formatStatus = (status) => {
  if (!status) return "No active booking";
  const statusMap = {
    pending_driver_acceptance: "Awaiting approval",
    searching: "Searching",
    driver_assigned: "Driver assigned",
    en_route: "On the way",
    arrived: "Arrived",
    destination_reached: "Destination reached",
    awaiting_seeker_approval: "Awaiting your approval",
    completed: "Completed",
    rejected: "Request rejected",
    cancelled: "Cancelled",
  };
  return statusMap[status] || status;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [dismissedBookingId, setDismissedBookingId] = useState("");
  const [selectedAmbulanceType, setSelectedAmbulanceType] = useState("non-ac");
  const [needsAmbulance, setNeedsAmbulance] = useState(false);
  const [isEditingArea, setIsEditingArea] = useState(false);

  // Triage States
  const [patientAge, setPatientAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState("stable");
  const [targetHospitalId, setTargetHospitalId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [driverLiveLocation, setDriverLiveLocation] = useState(null);
  const [bookingNotice, setBookingNotice] = useState("");
  const [lastBookingStatus, setLastBookingStatus] = useState("");

  // Area states
  const [allDivisions, setAllDivisions] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [allHospitals, setAllHospitals] = useState({});
  const [allDrivers, setAllDrivers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loadingAction, setLoadingAction] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [hospitalLoading, setHospitalLoading] = useState(false);
  const [hospitalError, setHospitalError] = useState("");

  const greeting = useMemo(() => getGreeting(), []);

  const [dbHospitals, setDbHospitals] = useState([]);

  // Fetch Hospitals from Database based on user's selected area
  useEffect(() => {
    const fetchDbHospitals = async () => {
      setHospitalError("");
      setHospitalLoading(true);
      setDbHospitals([]);

      if (!user?.division) {
        setHospitalLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams();
        if (user.division) params.append("division_id", user.division);
        if (user.district) params.append("district_id", user.district);
        if (user.upazila) params.append("upazila_id", user.upazila);

        const res = await fetch(`/api/admin/hospitals?${params.toString()}`);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to load hospitals");
        }

        const data = await res.json();
        if (data.success) {
          const hospitals = data.hospitals || [];
          setDbHospitals(hospitals);
          if (hospitals.length === 0) {
            setHospitalError(
              "No hospitals were found for your selected area. Please adjust the division, district, or upazila and try again.",
            );
          }
        } else {
          setHospitalError(data.error || "Failed to load hospitals");
        }
      } catch (err) {
        console.error("Failed to fetch area-wise hospitals:", err);
        setHospitalError("Failed to load hospitals. Please try again later.");
      } finally {
        setHospitalLoading(false);
      }
    };
    fetchDbHospitals();
  }, [user?.division, user?.district, user?.upazila]);

  // Memoized user location names for display
  const userDivisionName = useMemo(() => {
    if (!user?.division || allDivisions.length === 0) return "";
    const division = allDivisions.find(
      (d) => d.id.toString() === user.division.toString(),
    );
    return division ? division.bn_name : "";
  }, [user?.division, allDivisions]);

  const userDistrictName = useMemo(() => {
    if (!user?.district || allDistricts.length === 0) return "";
    const district = allDistricts.find(
      (d) => d.id.toString() === user.district.toString(),
    );
    return district ? district.bn_name : "";
  }, [user?.district, allDistricts]);

  const userUpazilaName = useMemo(() => {
    if (!user?.upazila || allUpazilas.length === 0) return "";
    const upazila = allUpazilas.find(
      (u) => u.id.toString() === user.upazila.toString(),
    );
    return upazila ? upazila.bn_name : "";
  }, [user?.upazila, allUpazilas]);

  // Filtered hospitals based on user division
  const filteredHospitals = useMemo(() => dbHospitals, [dbHospitals]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
        return;
      }
      setUser(JSON.parse(userData));
    }
  }, [router]);

  // Data Fetching Logic (Divisions, Districts, etc.)
  useEffect(() => {
    const fetchLocationData = async () => {
      const safeFetch = async (url) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return [];
          const ct = res.headers.get("content-type");
          if (!ct || !ct.includes("application/json")) return [];
          return await res.json();
        } catch (e) {
          return [];
        }
      };

      try {
        const [divRes, distRes, upzRes, drvRes, routesRes] = await Promise.all([
          safeFetch("/json/bd-divisions.json"),
          safeFetch("/json/bd-districts.json"),
          safeFetch("/json/bd-upazilas.json"),
          safeFetch("/json/drivers.json"),
          safeFetch("/json/routes.json"),
        ]);

        // Handle different JSON structures
        const divs = divRes?.divisions || divRes || [];
        const dists = distRes?.districts || distRes || [];
        const upzs = upzRes?.upazilas || upzRes || [];
        const drvs = drvRes?.drivers || [];
        const routeList = routesRes?.routes || [];

        setAllDivisions(divs);
        setAllDistricts(dists);
        setAllUpazilas(upzs);
        setAllDrivers(drvs);
        setRoutes(routeList);
      } catch (err) {
        console.error("Error loading location data:", err);
      }
    };
    fetchLocationData();
  }, []);

  // Filter logic for cascading dropdowns
  useEffect(() => {
    if (isEditingArea) setDivisions(allDivisions);
  }, [isEditingArea, allDivisions]);

  useEffect(() => {
    if (user?.division) {
      setDistricts(
        allDistricts.filter(
          (d) => d.division_id.toString() === user.division.toString(),
        ),
      );
    }
  }, [user?.division, allDistricts]);

  useEffect(() => {
    if (user?.district) {
      setUpazilas(
        allUpazilas.filter(
          (u) => u.district_id.toString() === user.district.toString(),
        ),
      );
    }
  }, [user?.district, allUpazilas]);

  useEffect(() => {
    if (user) {
      getUserLocation();
      fetchActiveBooking();
      const interval = setInterval(() => fetchActiveBooking(), 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (!activeBooking?._id) {
      setChatMessages([]);
      return;
    }
    const fetchChat = async () => {
      try {
        const res = await fetch(
          `/api/bookings/chat?bookingId=${activeBooking._id}`,
        );
        if (!res.ok) return;
        const ct = res.headers.get("content-type");
        if (!ct || !ct.includes("application/json")) return;

        const data = await res.json();
        if (data.success) setChatMessages(data.messages || []);
      } catch (error) {}
    };
    fetchChat();
    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);
  }, [activeBooking?._id]);

  useEffect(() => {
    if (!activeBooking?._id) {
      setDriverLiveLocation(null);
      return;
    }
    const fetchDriverLocation = async () => {
      try {
        const res = await fetch(
          `/api/bookings/driver-location?bookingId=${activeBooking._id}`,
        );
        if (!res.ok) return;
        const ct = res.headers.get("content-type");
        if (!ct || !ct.includes("application/json")) return;

        const data = await res.json();
        if (data.success && data.location) {
          setDriverLiveLocation(data.location);
        }
      } catch (error) {}
    };
    fetchDriverLocation();
    const interval = setInterval(fetchDriverLocation, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [activeBooking?._id]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation(DEFAULT_LOCATION);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => setUserLocation(DEFAULT_LOCATION),
      { enableHighAccuracy: true, timeout: 5000 },
    );
  };

  const fetchActiveBooking = async (targetHospitalId = null, eta = null) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/bookings/active?userId=${user._id}`);
      if (!res.ok) return;
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) return;

      const data = await res.json();
      if (data.success) {
        const nextBooking = data.booking;

        // If this specific booking was dismissed by the user, don't show it
        if (nextBooking?._id === dismissedBookingId) {
          setActiveBooking(null);
          return;
        }

        // Auto-delete cancelled/rejected bookings permanently
        if (
          nextBooking?.status === "cancelled" ||
          nextBooking?.status === "rejected"
        ) {
          try {
            await fetch(`/api/bookings/delete/${nextBooking._id}`, {
              method: "DELETE",
            });
          } catch (e) {
            console.error("Failed to delete booking:", e);
          }
          setActiveBooking(null);
          setBookingNotice("");
          return;
        }

        if (nextBooking?.status && nextBooking.status !== lastBookingStatus) {
          if (nextBooking.status === "pending_driver_acceptance") {
            setBookingNotice(
              "Your booking is waiting for the driver to respond.",
            );
          } else if (nextBooking.status === "searching") {
            setBookingNotice("We are searching for a suitable ambulance for you.");
          } else if (nextBooking.status === "driver_assigned") {
            setBookingNotice(
              "The driver has accepted your request and the ambulance is being prepared.",
            );
          } else if (nextBooking.status === "en_route") {
            setBookingNotice("The ambulance is now heading toward you.");
          } else if (nextBooking.status === "arrived") {
            setBookingNotice("The ambulance has reached your location.");
          } else if (nextBooking.status === "trip_started") {
            setBookingNotice("Your trip has started. Have a safe journey.");
          } else if (nextBooking.status === "destination_reached") {
            setBookingNotice("You have reached the destination. Please inform the driver.");
          } else if (nextBooking.status === "awaiting_seeker_approval") {
            setBookingNotice(
              "The driver has marked the trip as complete. Please confirm.",
            );
          } else if (nextBooking.status === "completed") {
            setBookingNotice("The trip has been completed successfully. Thank you.");
          } else if (nextBooking.status === "rejected") {
            setBookingNotice(
              "Sorry, the driver could not accept your request. Please try another driver.",
            );
          } else if (nextBooking.status === "cancelled") {
            setBookingNotice(
              `The trip was cancelled. Reason: ${nextBooking.cancellationReason || "Not provided"}`,
            );
          }
          setLastBookingStatus(nextBooking.status);
        }
        setActiveBooking(nextBooking);
      }
    } catch (error) {
      console.error("Booking fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyDrivers = async () => {
    if (!needsAmbulance) {
      setNeedsAmbulance(true);
    }

    if (!userLocation)
      return alert("We are detecting your location. Please wait...");

    if (!patientAge || !symptoms) {
      return alert("Please fill in the patient details first (age and symptoms).");
    }

    if (!selectedRouteId) return alert("Please select a route.");
    if (!user?.division || !user?.district || !user?.upazila) {
      return alert(
        "Please select and save your area first (division, district, and upazila).",
      );
    }
    setLoadingDrivers(true);
    setLoadingAction(true);
    try {
      const response = await fetch("/api/drivers/nearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userLocation,
          ambulanceType: selectedAmbulanceType,
          userDivision: user?.division,
          userUpazila: user?.upazila,
          routeId: selectedRouteId,
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const ct = response.headers.get("content-type");
      if (!ct || !ct.includes("application/json"))
        throw new Error("Invalid response from server");

      const data = await response.json();
      if (!data?.success)
        throw new Error(data?.error || "Unable to load drivers");

      setAvailableDrivers(data.drivers || []);

      if (data.drivers?.length === 0) {
        alert(
          "Sorry, no drivers are available for this route right now. Please try another route.",
        );
      }
    } catch (error) {
      console.error("Driver fetch error:", error);
      alert("Server error. Unable to load drivers. Please try again.");
    } finally {
      setLoadingDrivers(false);
      setLoadingAction(false);
    }
  };

  const handleSOSClick = async (
    selectedDriver,
    directHospitalId = null,
    eta = null,
  ) => {
    if (!needsAmbulance)
      return alert("Please turn on the 'Need ambulance' option first.");
    if (!userLocation)
      return alert("We are detecting your location. Please wait...");
    if (!patientAge || !symptoms)
      return alert("Please provide the patient age and symptoms briefly.");
    if (!selectedDriver) return alert("Please select a driver.");

    // 1. Robust ID Extraction: Ensure we get a clean 24-character hex string if available
    const getCleanId = (obj) => {
      if (!obj) return "";
      if (typeof obj === "string") return obj;
      if (obj.$oid) return obj.$oid;

      // If this is a driver/ambulance object, prioritize the system 'id'
      // or reconstruct it from providerId if missing.
      const systemId =
        obj.id || (obj.providerId ? `provider_${obj.providerId}` : null);

      return String(systemId || obj._id || "");
    };

    const userId = getCleanId(user);
    const driverId = getCleanId(selectedDriver);
    const hospitalId = getCleanId(directHospitalId || targetHospitalId);

    console.log("Booking Request Payload:", { userId, driverId, hospitalId });

    setIsSubmitting(true);
    setLoadingAction(true);
    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName: user.name,
          userPhone: user.phone,
          userLocation,
          ambulanceType: selectedAmbulanceType,
          userDivision: user.division,
          userUpazila: user.upazila,
          selectedDriverId: driverId,
          routeId: selectedRouteId,
          routeName: selectedDriver.routeName,
          offeredFare: selectedDriver.offeredFare,
          targetHospitalId: hospitalId,
          estimatedArrival: eta,
          patientInfo: {
            age: patientAge,
            symptoms: symptoms,
            severity: severity,
          },
        }),
      });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Booking request failed");
      }

      setActiveBooking(data.booking);
      setAvailableDrivers([]);
    } catch (e) {
      alert(e.message || "There was a problem placing the booking.");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(false);
    }
  };

  const handleSendChat = async () => {
    if (!activeBooking?._id || !chatText.trim()) return;
    setIsSendingChat(true);
    setLoadingAction(true);
    try {
      const res = await fetch("/api/bookings/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: activeBooking._id,
          senderId: user?._id,
          senderRole: "seeker",
          text: chatText.trim(),
        }),
      });

      if (!res.ok) throw new Error("Chat delivery failed");
      const ct = res.headers.get("content-type");
      if (!ct || !ct.includes("application/json"))
        throw new Error("Invalid chat response");

      const data = await res.json();
      if (res.ok && data.success) {
        setChatText("");
        setChatMessages((prev) => [...prev, data.message]);
      }
    } catch (error) {
    } finally {
      setLoadingAction(false);
      setIsSendingChat(false);
    }
  };

  const saveAreaDetails = async () => {
    if (!user.division || !user.district || !user.upazila) {
      alert("Please select the division, district, and upazila completely.");
      return;
    }

    setLoadingAction(true);
    try {
      const response = await fetch("/api/users/update-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          division: user.division,
          district: user.district,
          upazila: user.upazila,
        }),
      });

      if (!response.ok) throw new Error("Address update failed");
      const ct = response.headers.get("content-type");
      if (!ct || !ct.includes("application/json"))
        throw new Error("Invalid server response");

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      const nextUser = data.user
        ? {
            ...data.user,
            _id: data.user?._id?.toString?.() || String(data.user?._id || ""),
          }
        : user;
      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(nextUser));
      setIsEditingArea(false);
    } catch (err) {
      alert("Failed to save address: " + err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  // Permanently delete cancelled/rejected booking from user dashboard
  const handleClearBooking = async () => {
    if (activeBooking?._id) {
      try {
        await fetch(`/api/bookings/delete/${activeBooking._id}`, {
          method: "DELETE",
        });
      } catch (e) {
        // Ignore error, just clear from UI
      }
      setDismissedBookingId(activeBooking._id);
    }
    setActiveBooking(null);
    setBookingNotice("");
  };

  const handleCancelBooking = async () => {
    alert(
      "For safety reasons, customers cannot cancel after the booking is active. Please contact the driver.",
    );
  };

  const handleApproveCompletion = async () => {
    if (!activeBooking?._id || !user?._id) return;
    setLoadingAction(true);
    try {
      const res = await fetch(`/api/bookings/complete/${activeBooking._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      if (!res.ok) throw new Error("Request failed");
      const ct = res.headers.get("content-type");
      if (!ct || !ct.includes("application/json"))
        throw new Error("Invalid response");

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Completion approval failed");
      }
      setActiveBooking(data.booking);
      setBookingNotice("Trip marked as completed successfully.");
    } catch (error) {
      alert(error.message || "Trip completion approval failed.");
    } finally {
      setLoadingAction(false);
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        Loading...
      </div>
    );

  const currentStepIndex = activeBooking?.status
    ? TRACKING_STEPS.findIndex((s) => s.key === activeBooking.status)
    : -1;

  return (
    <>
      {loadingAction && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 border border-slate-100">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            <p className="font-black text-black animate-pulse">
              Processing, please wait...
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-slate-50 text-black pb-10">
        <main className="mx-auto max-w-7xl px-4 pt-8 space-y-6">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="relative p-8 md:p-10 bg-[linear-gradient(135deg,_#0f172a_0%,_#1d4ed8_60%,_#2563eb_100%)] text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.10),_transparent_24%)]" />
                <div className="relative flex flex-col gap-5">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.35em] text-white/90 backdrop-blur">
                    User Dashboard
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
                      {greeting}
                    </p>
                    <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tight">
                      Welcome back, {user.name}
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm md:text-base text-blue-50/90 leading-relaxed">
                      Manage your ambulance request, track active trips, and update your profile from one focused workspace.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs font-bold">
                    <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">Live request tracking</span>
                    <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">Area management</span>
                    <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">Driver chat</span>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 p-6 md:p-8 bg-slate-50">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black mb-2">
                    Account
                  </p>
                  <p className="text-xl font-black text-black">{user.name}</p>
                  <p className="mt-1 text-sm text-black">{user.phone || "No phone number saved"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black mb-2">
                      Active drivers
                    </p>
                    <p className="text-2xl font-black text-black">{availableDrivers.length}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black mb-2">
                      Hospitals
                    </p>
                    <p className="text-2xl font-black text-black">{hospitalLoading ? "..." : dbHospitals.length}</p>
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black mb-2">
                    Current area
                  </p>
                  <p className="text-sm font-bold text-black">{userDivisionName || "Division not selected"}</p>
                  <p className="mt-1 text-sm text-black">
                    {userDistrictName && `${userDistrictName}, `}
                    {userUpazilaName || "Upazila not selected"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Active Trip Banner */}
          {activeBooking && (
            <div className="relative">
              <div
                className={`${
                  activeBooking.status === "rejected"
                    ? "bg-red-600"
                    : activeBooking.status === "cancelled"
                      ? "bg-slate-800"
                      : "bg-blue-600"
                } rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-blue-100 animate-in fade-in slide-in-from-top-4 duration-500`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                    <Activity className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest">
                      {activeBooking.status === "rejected"
                        ? "Request rejected"
                        : activeBooking.status === "cancelled"
                          ? "Trip cancelled"
                          : "Active trip"}
                    </p>
                    <h2 className="text-xl font-black">
                      {activeBooking.driverInfo
                        ? `${activeBooking.driverInfo.name} ${formatStatus(activeBooking.status)}`
                        : formatStatus(activeBooking.status)}
                    </h2>
                    {activeBooking.driverInfo && (
                      <p className="text-sm font-bold mt-1">
                        Phone: {activeBooking.driverInfo.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {activeBooking?.status === "awaiting_seeker_approval" && (
                    <button
                      onClick={handleApproveCompletion}
                      className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-xl font-bold text-sm transition-all"
                    >
                      Confirm trip completion
                    </button>
                  )}
                  {(activeBooking?.status === "rejected" ||
                    activeBooking?.status === "cancelled") && (
                    <button
                      onClick={handleClearBooking}
                      className="bg-white text-black hover:bg-slate-100 px-6 py-3 rounded-xl font-bold text-sm transition-all"
                    >
                      Search again
                    </button>
                  )}
                </div>

                {/* Quick Dismiss Button */}
                {(activeBooking.status === "rejected" ||
                  activeBooking.status === "cancelled") && (
                  <button
                    onClick={handleClearBooking}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {bookingNotice && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex justify-between items-center">
              <p className="text-emerald-800 text-sm font-bold">
                {bookingNotice}
              </p>
              <button
                onClick={() => setBookingNotice("")}
                className="text-emerald-600 hover:text-emerald-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-black font-bold mb-3">
                Hospitals
              </p>
              <p className="text-3xl font-black text-black">
                {hospitalLoading ? "..." : dbHospitals.length}
              </p>
              <p className="text-sm text-black mt-2">
                Hospitals in your selected area
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-black font-bold mb-3">
                Drivers
              </p>
              <p className="text-3xl font-black text-black">
                {availableDrivers.length}
              </p>
              <p className="text-sm text-black mt-2">Nearby drivers</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-black font-bold mb-3">
                Booking status
              </p>
              <p className="text-3xl font-black text-black">
                {activeBooking
                  ? formatStatus(activeBooking.status)
                  : "No booking"}
              </p>
              <p className="text-sm text-black mt-2">
                Your latest status
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-black font-bold mb-3">
                Location
              </p>
              <p className="text-base font-bold text-black">
                {userDivisionName || "No division selected"}
              </p>
              <p className="text-sm text-black mt-1">
                {userDistrictName && `${userDistrictName}, `}
                {userUpazilaName || "No upazila selected"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* --- MAIN ACTION COLUMN --- */}
            <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    Ambulance request
                  </h2>
                  <p className="text-sm text-black font-medium">
                    Fill in the details below accurately
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setNeedsAmbulance(!needsAmbulance)}
                    className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${needsAmbulance ? "bg-red-600 text-white" : "text-black"}`}
                  >
                    Need ambulance
                  </button>
                  <button
                    onClick={() => setNeedsAmbulance(false)}
                    className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${!needsAmbulance ? "bg-emerald-600 text-white" : "text-black"}`}
                  >
                    I am okay
                  </button>
                </div>
              </div>

              <div
                className={`space-y-6 transition-opacity ${activeBooking ? "opacity-50 pointer-events-none" : "opacity-100"}`}
              >
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-black uppercase mb-3">
                    Step 1: Select your travel area
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none text-black"
                      value={user.division || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          division: e.target.value,
                          district: "",
                          upazila: "",
                        })
                      }
                    >
                      <option value="">Division</option>
                      {allDivisions.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.bn_name}
                        </option>
                      ))}
                    </select>
                    <select
                      disabled={!user.division}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none text-black disabled:opacity-50"
                      value={user.district || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          district: e.target.value,
                          upazila: "",
                        })
                      }
                    >
                      <option value="">District</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.bn_name}
                        </option>
                      ))}
                    </select>
                    <select
                      disabled={!user.district}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none text-black disabled:opacity-50"
                      value={user.upazila || ""}
                      onChange={(e) =>
                        setUser({ ...user, upazila: e.target.value })
                      }
                    >
                      <option value="">Upazila</option>
                      {upazilas.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.bn_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={saveAreaDetails}
                      className="px-4 py-2 rounded-xl bg-black text-white text-sm font-bold"
                    >
                      Save area
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black uppercase flex items-center gap-2">
                      <User className="h-3 w-3" /> Patient age
                    </label>
                    <input
                      type="number"
                      placeholder="Example: 25"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-2 ring-red-100 text-black"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black uppercase flex items-center gap-2">
                      <Stethoscope className="h-3 w-3" /> Patient condition
                    </label>
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none appearance-none text-black"
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                    >
                      <option value="stable">Stable</option>
                      <option value="urgent">Urgent</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-black uppercase flex items-center gap-2">
                    <Hospital className="h-3 w-3" /> Preferred hospital (optional)
                  </label>
                  <select
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none appearance-none text-black"
                    value={targetHospitalId}
                    onChange={(e) => setTargetHospitalId(e.target.value)}
                  >
                    <option value="">Any nearby hospital</option>
                    {filteredHospitals.map((h) => (
                      <option key={h._id} value={h._id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-black uppercase flex items-center gap-2">
                    <Route className="h-3 w-3" /> Select route
                  </label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none appearance-none focus:border-blue-500 focus:bg-white transition-all font-bold text-black"
                    value={selectedRouteId}
                    onChange={(e) => setSelectedRouteId(e.target.value)}
                  >
                    <option value="">Select a route</option>
                    {routes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.name} - BDT {route.baseFare}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-black uppercase flex items-center gap-2">
                    <FileText className="h-3 w-3" /> Main symptoms
                  </label>
                  <textarea
                    placeholder="Describe the patient's symptoms in detail (for example: shortness of breath, chest pain...)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none min-h-[100px] focus:ring-2 ring-blue-100 focus:bg-white transition-all"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                  />
                </div>

                <div className="pt-4 flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-black mb-2">
                      Select ambulance type
                    </p>
                    <div className="flex gap-2">
                      {["non-ac", "ac", "icu"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedAmbulanceType(type)}
                          className={`flex-1 py-3 rounded-xl border-2 text-xs font-bold transition-all ${selectedAmbulanceType === type ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" : "bg-white border-slate-200 text-black hover:bg-slate-50"}`}
                        >
                          {type.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <button
                        onClick={fetchNearbyDrivers}
                        disabled={isSubmitting || !!activeBooking}
                        className={`w-full py-4 rounded-xl text-white text-sm font-black transition-all flex items-center justify-center gap-2 ${loadingDrivers ? "bg-slate-400" : "bg-slate-900 hover:bg-black shadow-lg"}`}
                      >
                        {loadingDrivers ? (
                          <>
                            <Activity className="animate-spin h-4 w-4" />{" "}
                            Searching for drivers...
                          </>
                        ) : (
                          "View nearby drivers"
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {availableDrivers.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-black uppercase">
                      Nearby drivers ({availableDrivers.length})
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableDrivers.map((driver) => (
                        <div
                          key={driver._id || driver.id}
                          className="group relative rounded-3xl border-2 border-slate-100 bg-white p-5 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 transform active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                              <Ambulance
                                className={`h-6 w-6 group-hover:text-white ${driver.ambulanceType === "icu" ? "text-red-500" : "text-blue-600"}`}
                              />
                            </div>
                            <div>
                              <h4 className="text-base font-black text-black leading-none mb-1">
                                {driver.name}
                              </h4>
                              <p className="text-[10px] text-black font-bold uppercase tracking-tight">
                                {driver.ambulanceModel} (
                                {driver.ambulanceType.toUpperCase()}) •{" "}
                                <span className="text-black">
                                  {driver.ambulanceNumber}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 mb-6">
                            <div className="bg-slate-50 rounded-2xl p-2.5 text-center border border-slate-100/50">
                              <Navigation className="h-3.5 w-3.5 mx-auto mb-1 text-blue-500" />
                              <p className="text-[10px] font-black text-black">
                                {driver.distanceKm} KM
                              </p>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-2.5 text-center border border-slate-100/50">
                              <BadgeDollarSign className="h-3.5 w-3.5 mx-auto mb-1 text-emerald-500" />
                              <p className="text-[10px] font-black text-black">
                                BDT {driver.offeredFare}
                              </p>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-2.5 text-center border border-slate-100/50">
                              <Star className="h-3.5 w-3.5 mx-auto mb-1 text-amber-500 fill-amber-500" />
                              <p className="text-[10px] font-black text-black">
                                {driver.rating}/5
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleSOSClick(driver)}
                            disabled={isSubmitting || !!activeBooking}
                            className="w-full py-3.5 rounded-2xl bg-red-600 text-white text-xs font-black hover:bg-red-700 shadow-lg shadow-red-100 active:translate-y-0.5 transition-all disabled:opacity-50 disabled:shadow-none"
                          >
                            {isSubmitting
                              ? "Sending request..."
                              : "Book now"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {availableDrivers.length === 0 && !loadingDrivers && (
                  <p className="text-xs font-semibold text-black">
                    Click the button above to view drivers.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* First Aid Suggestions */}
              <section
                className={`rounded-3xl p-6 border-2 shadow-sm ${severity === "critical" ? "bg-red-50 border-red-100" : severity === "urgent" ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <HeartPulse
                    className={
                      severity === "critical"
                        ? "text-red-600"
                        : severity === "urgent"
                          ? "text-amber-600"
                          : "text-emerald-600"
                    }
                  />
                  <h3 className="font-black text-sm uppercase tracking-wider">
                    First aid tips
                  </h3>
                </div>
                <p className="text-black text-sm font-bold leading-relaxed">
                  {FIRST_AID_TIPS[severity]}
                </p>
              </section>

              {/* Hospital List */}
              <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                  <Hospital className="h-5 w-5 text-blue-600" /> Nearby hospitals
                </h3>
                <p className="text-[10px] font-bold text-black mb-4 uppercase tracking-wider">
                  You can send a request directly to a specific hospital
                </p>
                <div className="space-y-3">
                  {hospitalLoading ? (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-black">
                      Loading hospitals...
                    </div>
                  ) : hospitalError ? (
                    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-800">
                      {hospitalError}
                    </div>
                  ) : filteredHospitals.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-black">
                      No hospital found in your selected area. Please verify the region.
                    </div>
                  ) : (
                    filteredHospitals.map((h) => (
                      <div
                        key={h._id}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-100"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-black">{h.name}</p>
                          <a href={`tel:${h.phone}`} className="text-blue-600">
                            <Phone className="h-3 w-3" />
                          </a>
                        </div>
                        <p className="text-[10px] text-black mb-2">
                          {h.address}
                        </p>
                        {h.emergency_services && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-100 text-[8px] font-bold text-black uppercase">
                              {h.emergency_services}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-[9px] font-bold text-black">
                                <BedSingle className="h-3 w-3 text-emerald-500" />{" "}
                                Beds: {h.beds || 0}
                              </span>
                              <span className="flex items-center gap-1 text-[9px] font-bold text-black">
                                <Activity className="h-3 w-3 text-red-500" />{" "}
                                ICU: {h.icu || 0}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (availableDrivers.length === 0) {
                                alert("Please load nearby drivers first.");
                                return;
                              }
                              handleSOSClick(availableDrivers[0], h._id);
                            }}
                            disabled={
                              isSubmitting ||
                              !!activeBooking ||
                              availableDrivers.length === 0
                            }
                            className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-slate-200"
                            title="Send request to this hospital"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>

          {activeBooking && (
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-black text-lg">Chat with the driver</h3>
              </div>
              <div className="h-48 overflow-y-auto bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-2">
                {chatMessages.length === 0 ? (
                  <p className="text-xs text-black">No messages yet.</p>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                        msg.senderRole === "seeker"
                          ? "ml-auto bg-blue-600 text-white"
                          : "bg-white border border-slate-200 text-black"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder="Write a message..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none"
                />
                <button
                  onClick={handleSendChat}
                  disabled={isSendingChat || !chatText.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold disabled:bg-slate-300"
                >
                  Send
                </button>
              </div>
            </section>
          )}

          {activeBooking && driverLiveLocation && (
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Navigation className="h-5 w-5 text-blue-600" />
                <h3 className="font-black text-lg">
                  Ambulance live location
                </h3>
              </div>
              <div className="mb-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                <div className="h-2 w-2 bg-red-500 rounded-full animate-ping" />
                <p className="text-xs font-bold text-blue-800">
                  The ambulance is moving toward your location on the live map.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200">
                <iframe
                  title="driver-live-location"
                  src={`https://maps.google.com/maps?q=${driverLiveLocation.latitude},${driverLiveLocation.longitude}&z=15&output=embed`}
                  className="w-full h-64"
                  loading="lazy"
                />
              </div>
              <a
                href={`https://www.google.com/maps?q=${driverLiveLocation.latitude},${driverLiveLocation.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex mt-3 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                Open in Google Maps
              </a>
            </section>
          )}

          {/* Profile Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
            {/* User Profile */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-lg">Profile information</h3>
                {!isEditingArea ? (
                    <button
                    onClick={() => setIsEditingArea(true)}
                    className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                  >
                    <Edit3 className="h-4 w-4 text-black" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={saveAreaDetails}
                      className="bg-emerald-600 text-white p-2 rounded-lg"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsEditingArea(false)}
                      className="bg-slate-100 text-black p-2 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg text-black">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold">{user.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg text-black">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold">
                    {user.phone || "No phone number"}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg text-black mt-1">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold leading-relaxed">
                    {userUpazilaName && userDistrictName && userDivisionName
                      ? `${userUpazilaName}, ${userDistrictName}, ${userDivisionName}`
                      : "No address set"}
                  </span>
                </div>
              </div>

              {isEditingArea && (
                <div className="mt-6 space-y-3 p-4 bg-slate-50 rounded-2xl">
                  <select
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-sm outline-none"
                    value={user.division || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        division: e.target.value,
                        district: "", // Reset children
                        upazila: "",
                      })
                    }
                  >
                    <option value="">Select division</option>
                    {divisions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.bn_name}
                      </option>
                    ))}
                  </select>
                  <select
                    disabled={!user.division}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-sm outline-none disabled:opacity-50"
                    value={user.district || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        district: e.target.value,
                        upazila: "", // Reset child
                      })
                    }
                  >
                    <option value="">Select district</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.bn_name}
                      </option>
                    ))}
                  </select>
                  <select
                    disabled={!user.district}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-sm outline-none disabled:opacity-50"
                    value={user.upazila || ""}
                    onChange={(e) =>
                      setUser({ ...user, upazila: e.target.value })
                    }
                  >
                    <option value="">Select upazila</option>
                    {upazilas.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.bn_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </section>

            {/* Medical Info */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-lg">Medical information</h3>
                <HeartPulse className="text-red-500 h-5 w-5" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-red-400 uppercase">
                    Blood group
                  </p>
                  <p className="text-xl font-black text-red-700">
                    {user.bloodGroup || "O+"}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-black uppercase">
                    Allergies
                  </p>
                  <p className="text-sm font-bold text-black">None</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
