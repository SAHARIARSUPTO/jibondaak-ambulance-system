'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import LiveTrackingMap from '../components/dashboard/LiveTrackingMap';
import StatusBadge from '../components/dashboard/StatusBadge';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }
      setUser(JSON.parse(userData));
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchActiveBooking();
      getUserLocation();
      
      // Poll for booking updates every 5 seconds
      const interval = setInterval(() => {
        fetchActiveBooking();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default location (Dhaka)
          setUserLocation({
            latitude: 23.8103,
            longitude: 90.4125
          });
        }
      );
    }
  };

  const fetchActiveBooking = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/bookings/active?userId=${user._id}`);
      const data = await response.json();

      if (data.success) {
        setActiveBooking(data.booking);
      }
    } catch (error) {
      console.error('Error fetching active booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSOSClick = async () => {
    if (!userLocation) {
      alert('Please enable location services');
      return;
    }

    if (activeBooking) {
      alert('You already have an active booking');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          userLocation,
          ambulanceType: 'basic'
        })
      });

      const data = await response.json();

      if (data.success) {
        setActiveBooking(data.booking);
      } else {
        alert(data.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!activeBooking) return;

    setLoading(true);

    try {
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: activeBooking._id
        })
      });

      const data = await response.json();

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
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        user={user} 
        onSOSClick={handleSOSClick}
        hasActiveBooking={!!activeBooking}
        loading={loading}
      />

      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Status Badge */}
          {activeBooking && (
            <div className="mb-6">
              <StatusBadge 
                status={activeBooking.status}
                driverInfo={activeBooking.driverInfo}
                onCancel={handleCancelBooking}
              />
            </div>
          )}

          {/* Live Tracking Map */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <LiveTrackingMap
              userLocation={userLocation || activeBooking?.userLocation}
              driverLocation={activeBooking?.driverLocation}
              status={activeBooking?.status}
            />
          </div>

          {/* Instructions */}
          {!activeBooking && (
            <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-800 font-medium">
                Click the Emergency SOS button to request an ambulance
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
