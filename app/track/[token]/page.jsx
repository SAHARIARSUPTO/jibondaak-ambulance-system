"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LiveTrackingMap from "../../components/dashboard/LiveTrackingMap";
import StatusBadge from "../../components/dashboard/StatusBadge";
import { Ambulance } from "lucide-react";

export default function TrackTripPage() {
  const params = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.token) {
      fetchTripData();
      const interval = setInterval(fetchTripData, 5000);
      return () => clearInterval(interval);
    }
  }, [params.token]);

  const fetchTripData = async () => {
    try {
      const response = await fetch(`/api/trip/track/${params.token}`);
      const data = await response.json();

      if (data.success) {
        setBooking(data.booking);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Failed to load trip data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg">
            <p className="font-bold text-lg mb-2">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <Ambulance className="text-red-600 w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Jibon<span className="text-red-600">Daak</span> - Live Tracking
            </h1>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Status Badge */}
          {booking && (
            <div className="mb-6">
              <StatusBadge
                status={booking.status}
                driverInfo={booking.driverInfo}
                onCancel={null}
              />
            </div>
          )}

          {/* Live Tracking Map */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <LiveTrackingMap
              userLocation={booking?.userLocation}
              driverLocation={booking?.driverLocation}
              status={booking?.status}
            />
          </div>

          {/* Info */}
          <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <p className="text-blue-800 font-medium text-center">
              You are viewing a shared trip. This page updates automatically
              every 5 seconds.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
