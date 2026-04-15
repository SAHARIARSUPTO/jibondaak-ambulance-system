﻿"use client";

<<<<<<< HEAD
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
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
} from "lucide-react";
=======
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import LiveTrackingMap from '../components/dashboard/LiveTrackingMap';
import StatusBadge from '../components/dashboard/StatusBadge';
import QuickActionCards from '../components/dashboard/QuickActionCards';
import TriageFormModal from '../components/dashboard/TriageFormModal';
import ETADisplay from '../components/dashboard/ETADisplay';
import TripShareButton from '../components/dashboard/TripShareButton';
import BedAvailabilityPanel from '../components/dashboard/BedAvailabilityPanel';
import DriverAcceptedNotification from '../components/dashboard/DriverAcceptedNotification';
import UserSidebar from '../components/dashboard/UserSidebar';
>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54

const DEFAULT_LOCATION = { latitude: 23.8103, longitude: 90.4125 };

const TRACKING_STEPS = [
  { key: "searching", label: "অ্যাম্বুলেন্স খোঁজা হচ্ছে" },
  { key: "driver_assigned", label: "চালক নির্ধারিত হয়েছে" },
  { key: "en_route", label: "অ্যাম্বুলেন্স পথে আছে" },
  { key: "arrived", label: "অ্যাম্বুলেন্স পৌঁছেছে" },
  { key: "completed", label: "ট্রিপ সম্পন্ন" },
];

const FIRST_AID_TIPS = {
  critical:
    "শ্বাস-প্রশ্বাস পরীক্ষা করুন। রোগীকে সমতল জায়গায় শুইয়ে দিন। রক্তপাত হলে ক্ষতস্থান চেপে ধরুন।",
  urgent:
    "রোগীকে আশ্বস্ত করুন। পর্যাপ্ত বাতাস চলাচলের ব্যবস্থা করুন। কোনো ওষুধ দেওয়ার আগে ডাক্তারের পরামর্শ নিন।",
  stable:
    "রোগীর অবস্থা পর্যবেক্ষণ করুন এবং অ্যাম্বুলেন্স আসার অপেক্ষা করুন। রোগীকে নড়াচড়া কম করতে বলুন।",
};

const formatStatus = (status) => {
  if (!status) return "কোনো বুকিং নেই";
  const statusMap = {
    searching: "খোঁজা হচ্ছে",
    driver_assigned: "চালক নিযুক্ত",
    en_route: "পথে আছে",
    arrived: "পৌঁছেছে",
    completed: "সম্পন্ন",
  };
  return statusMap[status] || status;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return "শুভ রাত্রি";
  if (hour < 12) return "শুভ সকাল";
  if (hour < 18) return "শুভ বিকাল";
  return "শুভ সন্ধ্যা";
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
<<<<<<< HEAD
  const [selectedAmbulanceType, setSelectedAmbulanceType] = useState("non-ac");
  const [needsAmbulance, setNeedsAmbulance] = useState(false);
  const [isEditingArea, setIsEditingArea] = useState(false);

  // Triage States
  const [patientAge, setPatientAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState("stable");
  const [targetHospitalId, setTargetHospitalId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Area states
  const [allDivisions, setAllDivisions] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [allHospitals, setAllHospitals] = useState({});
  const [allDrivers, setAllDrivers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
=======
  const [selectedAmbulanceType, setSelectedAmbulanceType] = useState('non-ac');
  const [showTriageForm, setShowTriageForm] = useState(false);
  const [showDriverNotification, setShowDriverNotification] = useState(false);
  const [previousStatus, setPreviousStatus] = useState(null);
>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54

  const greeting = useMemo(() => getGreeting(), []);

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
  const filteredHospitals = useMemo(() => {
    // Map Bangla division name to English key in JSON
    const divisionMap = {
      রাজশাহী: "Rajshahi",
    };
    const englishKey = divisionMap[userDivisionName] || "Rajshahi";
    return allHospitals[englishKey] || [];
  }, [userDivisionName, allHospitals]);

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
        const [divRes, distRes, upzRes, hospRes, drvRes] = await Promise.all([
          safeFetch("/json/bd-divisions.json"),
          safeFetch("/json/bd-districts.json"),
          safeFetch("/json/bd-upazilas.json"),
          safeFetch("/json/hospitals.json"),
          safeFetch("/json/drivers.json"),
        ]);

        // Handle different JSON structures
        const divs = divRes?.divisions || divRes || [];
        const dists = distRes?.districts || distRes || [];
        const upzs = upzRes?.upazilas || upzRes || [];
        const hosps = hospRes || {};
        const drvs = drvRes?.drivers || [];

        setAllDivisions(divs);
        setAllDistricts(dists);
        setAllUpazilas(upzs);
        setAllHospitals(hosps);
        setAllDrivers(drvs);
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
      const interval = setInterval(() => fetchActiveBooking(), 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

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
<<<<<<< HEAD
      const res = await fetch(`/api/bookings/active?userId=${user._id}`);
      if (!res.ok) return;
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) return;

      const data = await res.json();
      if (data.success) setActiveBooking(data.booking);
=======
      const response = await fetch(`/api/bookings/active?userId=${user._id}`);
      
      // Check if response is ok
      if (!response.ok) {
        console.error('Failed to fetch booking:', response.status);
        return;
      }

      // Check if response has content
      const text = await response.text();
      if (!text) {
        console.log('No active booking');
        return;
      }

      const data = JSON.parse(text);

      if (data.success && data.booking) {
        const newBooking = data.booking;
        
        // Check if status changed from 'searching' to 'driver_assigned' or 'en_route'
        if (previousStatus === 'searching' && 
            (newBooking.status === 'driver_assigned' || newBooking.status === 'en_route') &&
            newBooking.driverInfo) {
          // Show driver notification
          setShowDriverNotification(true);
        }
        
        // Update previous status
        setPreviousStatus(newBooking.status);
        setActiveBooking(newBooking);
      }
>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54
    } catch (error) {
      console.error("Booking fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const findNearestDriver = () => {
    if (!user) return null;

    // Tier 1: Match Upazila + Type
    let matched = allDrivers.filter(
      (d) =>
        d.status === "available" &&
        d.ambulanceType === selectedAmbulanceType &&
        d.upazila_id.toString() === user.upazila?.toString(),
    );

    // Tier 2: Match District + Type
    if (matched.length === 0) {
      matched = allDrivers.filter(
        (d) =>
          d.status === "available" &&
          d.ambulanceType === selectedAmbulanceType &&
          d.district_id.toString() === user.district?.toString(),
      );
    }

    // Tier 3: Match Division + Type
    if (matched.length === 0) {
      matched = allDrivers.filter(
        (d) =>
          d.status === "available" &&
          d.ambulanceType === selectedAmbulanceType &&
          d.division_id.toString() === user.division?.toString(),
      );
    }

    return matched.length > 0 ? matched[0] : null;
  };

  const handleSOSClick = async (directHospitalId = null, eta = null) => {
    if (!needsAmbulance)
      return alert("দয়া করে আগে 'অ্যাম্বুলেন্স প্রয়োজন' অপশনটি চালু করুন।");
    if (!userLocation)
      return alert("আপনার অবস্থান শনাক্ত করা হচ্ছে, দয়া করে অপেক্ষা করুন...");
    if (!patientAge || !symptoms)
      return alert("দয়া করে রোগীর বয়স এবং সমস্যা সংক্ষেপে লিখুন।");

    const driver = findNearestDriver();
    if (!driver) {
      return alert(
        "দুঃখিত, এই মুহূর্তে আপনার এলাকায় কোনো অ্যাম্বুলেন্স পাওয়া যায়নি।",
      );
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          userLocation,
          ambulanceType: selectedAmbulanceType,
<<<<<<< HEAD
          targetHospitalId: directHospitalId || targetHospitalId,
          estimatedArrival: eta,
          driverId: driver.id,
          driverInfo: {
            name: driver.name,
            phone: driver.phone,
          },
          patientInfo: {
            age: patientAge,
            symptoms: symptoms,
            severity: severity,
          },
        }),
      });
      const data = await response.json();
      if (data.success) setActiveBooking(data.booking);
    } catch (e) {
      alert("বুকিং করতে সমস্যা হয়েছে।");
=======
          userName: user.name,
          userPhone: user.phone
        })
      });

      if (!response.ok) {
        alert('Failed to create booking');
        return;
      }

      const text = await response.text();
      if (!text) {
        alert('Empty response from server');
        return;
      }

      const data = JSON.parse(text);

      if (data.success) {
        setActiveBooking(data.booking);
      } else {
        alert(data.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Something went wrong. Please try again.');
>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveAreaDetails = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setIsEditingArea(false);
    alert("ঠিকানা সফলভাবে আপডেট করা হয়েছে।");
  };

  const handleCancelBooking = async () => {
    if (!activeBooking) return;
    if (!confirm("আপনি কি নিশ্চিত যে আপনি বুকিংটি বাতিল করতে চান?")) return;
    try {
      await fetch(`/api/bookings/cancel/${activeBooking._id}`, {
        method: "POST",
      });
<<<<<<< HEAD
      setActiveBooking(null);
      alert("বুকিং বাতিল করা হয়েছে।");
    } catch (e) {
      alert("বাতিল করতে সমস্যা হয়েছে।");
=======

      if (!response.ok) {
        alert('Failed to cancel booking');
        return;
      }

      const text = await response.text();
      if (!text) {
        alert('Empty response from server');
        return;
      }

      const data = JSON.parse(text);

      if (data.success) {
        setActiveBooking(null);
      } else {
        alert(data.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        লোডিং হচ্ছে...
      </div>
    );

  const currentStepIndex = activeBooking?.status
    ? TRACKING_STEPS.findIndex((s) => s.key === activeBooking.status)
    : -1;

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-10">
      {/* --- RE-DESIGNED HEADER --- */}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs font-bold pr-2">{user.name}</span>
          </div>
        </div>
      </header>
=======
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <UserSidebar user={user} />

      {/* Main Content with left margin for sidebar */}
      <div className="lg:ml-72">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <DashboardHeader
          user={user}
          greeting={greeting}
          statusLabel={bookingStatus}
          onSOSClick={handleSOSClick}
          hasActiveBooking={!!activeBooking}
          loading={loading}
        />
>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54

      <main className="mx-auto max-w-7xl px-4 mt-8 space-y-6">
        {/* Active Trip Banner */}
        {activeBooking && (
          <div className="bg-blue-600 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-blue-100 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                <Activity className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">
                  একটি ট্রিপ সচল আছে
                </p>
                <h2 className="text-xl font-black">
                  {activeBooking.driverInfo
                    ? `${activeBooking.driverInfo.name} ${formatStatus(activeBooking.status)}`
                    : formatStatus(activeBooking.status)}
                </h2>
                {activeBooking.driverInfo && (
                  <p className="text-sm font-bold mt-1">
                    ফোন: {activeBooking.driverInfo.phone}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleCancelBooking}
              className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold text-sm backdrop-blur-md transition-all"
            >
              বাতিল করুন
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- MAIN ACTION COLUMN --- */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  অ্যাম্বুলেন্স রিকোয়েস্ট
                </h2>
                <p className="text-sm text-slate-400 font-medium">
                  নিচের তথ্যগুলো সঠিক ভাবে পূরণ করুন
                </p>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setNeedsAmbulance(!needsAmbulance)}
                  className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${needsAmbulance ? "bg-red-600 text-white" : "text-slate-500"}`}
                >
                  জরুরি প্রয়োজন
                </button>
                <button
                  onClick={() => setNeedsAmbulance(false)}
                  className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${!needsAmbulance ? "bg-emerald-600 text-white" : "text-slate-500"}`}
                >
                  ঠিক আছি
                </button>
              </div>
            </div>

            <div
              className={`space-y-6 transition-opacity ${activeBooking ? "opacity-50 pointer-events-none" : "opacity-100"}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <User className="h-3 w-3" /> রোগীর বয়স
                  </label>
                  <input
                    type="number"
                    placeholder="যেমন: ২৫"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-2 ring-red-100"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Stethoscope className="h-3 w-3" /> রোগীর অবস্থা
                  </label>
                  <select
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none appearance-none"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="stable">স্থিতিশীল (Stable)</option>
                    <option value="urgent">জরুরি (Urgent)</option>
                    <option value="critical">সংকটাপন্ন (Critical)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Hospital className="h-3 w-3" /> পছন্দের হাসপাতাল (ঐচ্ছিক)
                </label>
                <select
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none appearance-none"
                  value={targetHospitalId}
                  onChange={(e) => setTargetHospitalId(e.target.value)}
                >
                  <option value="">নিকটস্থ যেকোনো হাসপাতাল</option>
                  {filteredHospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name_bn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <FileText className="h-3 w-3" /> প্রধান সমস্যা/লক্ষণসমূহ
                </label>
                <textarea
                  placeholder="রোগীর সমস্যা বিস্তারিত লিখুন (যেমন: শ্বাসকষ্ট, বুকে ব্যথা...)"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none min-h-[100px] focus:ring-2 ring-red-100"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>

              <div className="pt-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-400 mb-2">
                    অ্যাম্বুলেন্সের ধরন নির্বাচন করুন
                  </p>
                  <div className="flex gap-2">
                    {["non-ac", "ac", "icu"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedAmbulanceType(type)}
                        className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${selectedAmbulanceType === type ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleSOSClick}
                  disabled={isSubmitting || !!activeBooking || !needsAmbulance}
                  className="md:w-64 bg-red-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-95 disabled:bg-slate-200 disabled:shadow-none h-16 md:mt-6"
                >
                  <ShieldAlert className="h-6 w-6" />
                  {isSubmitting
                    ? "পাঠানো হচ্ছে..."
                    : activeBooking
                      ? "বুকিং সচল"
                      : "অ্যাম্বুলেন্স ডাকুন"}
                </button>
              </div>
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
                  ফার্স্ট এইড টিপস
                </h3>
              </div>
              <p className="text-slate-700 text-sm font-bold leading-relaxed">
                {FIRST_AID_TIPS[severity]}
              </p>
            </section>

            {/* Hospital List */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                <Hospital className="h-5 w-5 text-blue-600" /> নিকটস্থ
                হাসপাতালসমূহ
              </h3>
              <p className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-wider">
                আপনি চাইলে নির্দিষ্ট হাসপাতালে সরাসরি রিকোয়েস্ট পাঠাতে পারেন
              </p>
              <div className="space-y-3">
                {filteredHospitals.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-black">{h.name_bn}</p>
                      <a href={`tel:${h.phone}`} className="text-blue-600">
                        <Phone className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-2">
                      {h.address}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {h.specialties.map((f) => (
                        <span
                          key={f}
                          className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-100 text-[8px] font-bold text-slate-500 uppercase"
                        >
                          {f.toLowerCase().includes("icu") && (
                            <>
                              <Activity className="h-2 w-2 text-red-500" /> ICU
                            </>
                          )}
                          {f.toLowerCase().includes("emergency") && (
                            <>
                              <Zap className="h-2 w-2 text-amber-500" />{" "}
                              Emergency
                            </>
                          )}
                          {f.toLowerCase().includes("nicu") && (
                            <>
                              <Baby className="h-2 w-2 text-blue-500" /> NICU
                            </>
                          )}
                          {f.toLowerCase().includes("ventilator") && (
                            <>
                              <Wind className="h-2 w-2 text-slate-500" />{" "}
                              Ventilator
                            </>
                          )}
                          {f.toLowerCase().includes("general") && (
                            <>
                              <BedSingle className="h-2 w-2 text-emerald-500" />{" "}
                              General
                            </>
                          )}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[9px] font-bold text-slate-500">
                            <BedSingle className="h-3 w-3 text-emerald-500" />{" "}
                            বেড: {h.availableBeds || 0}
                          </span>
                          <span className="flex items-center gap-1 text-[9px] font-bold text-slate-500">
                            <Activity className="h-3 w-3 text-red-500" /> ICU:{" "}
                            {h.availableIcu || 0}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSOSClick(h.id)}
                        disabled={
                          isSubmitting || !!activeBooking || !needsAmbulance
                        }
                        className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-slate-200"
                        title="এই হাসপাতালে রিকোয়েস্ট পাঠান"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
          {/* User Profile */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg">প্রোফাইল তথ্য</h3>
              {!isEditingArea ? (
                <button
                  onClick={() => setIsEditingArea(true)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <Edit3 className="h-4 w-4 text-slate-400" />
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
                    className="bg-slate-100 text-slate-500 p-2 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

<<<<<<< HEAD
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold">{user.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold">
                  {user.phone || "ফোন নম্বর নেই"}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-500 mt-1">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold leading-relaxed">
                  {userUpazilaName && userDistrictName && userDivisionName
                    ? `${userUpazilaName}, ${userDistrictName}, ${userDivisionName}`
                    : "ঠিকানা সেট করা নেই"}
                </span>
              </div>
            </div>

            {isEditingArea && (
              <div className="mt-6 space-y-3 p-4 bg-slate-50 rounded-2xl">
                <select
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-sm outline-none"
                  value={user.division || ""}
                  onChange={(e) =>
                    setUser({ ...user, division: e.target.value })
                  }
                >
                  <option value="">বিভাগ সিলেক্ট করুন</option>
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
                    setUser({ ...user, district: e.target.value })
                  }
                >
                  <option value="">জেলা সিলেক্ট করুন</option>
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
                  <option value="">উপজেলা সিলেক্ট করুন</option>
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
              <h3 className="font-black text-lg">মেডিকেল তথ্য</h3>
              <HeartPulse className="text-red-500 h-5 w-5" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-red-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-red-400 uppercase">
                  রক্তের গ্রুপ
                </p>
                <p className="text-xl font-black text-red-700">
                  {user.bloodGroup || "O+"}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  অ্যালার্জি
                </p>
                <p className="text-sm font-bold text-slate-700">নেই</p>
              </div>
            </div>
          </section>
        </div>
      </main>
=======
      <TriageFormModal
        isOpen={showTriageForm}
        onClose={() => setShowTriageForm(false)}
        onSubmit={handleTriageSubmit}
        bookingId={activeBooking?._id || 'temp'}
      />

      {/* Driver Accepted Notification */}
      {showDriverNotification && activeBooking?.driverInfo && (
        <DriverAcceptedNotification
          driverInfo={activeBooking.driverInfo}
          onClose={() => setShowDriverNotification(false)}
        />
      )}
      </div>
>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54
    </div>
  );
}
