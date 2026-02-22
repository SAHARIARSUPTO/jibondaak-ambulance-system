'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import LiveTrackingMap from '../components/dashboard/LiveTrackingMap';
import StatusBadge from '../components/dashboard/StatusBadge';
import QuickActionCards from '../components/dashboard/QuickActionCards';
import TriageFormModal from '../components/dashboard/TriageFormModal';
import ETADisplay from '../components/dashboard/ETADisplay';
import TripShareButton from '../components/dashboard/TripShareButton';
import BedAvailabilityPanel from '../components/dashboard/BedAvailabilityPanel';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedAmbulanceType, setSelectedAmbulanceType] = useState('non-ac');
  const [showTriageForm, setShowTriageForm] = useState(false);
  const [triageSubmitted, setTriageSubmitted] = useState(false);

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
    if (typeof window === 'undefined') return;
    
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by your browser');
      // Set default location (Dhaka)
      setUserLocation({
        latitude: 23.8103,
        longitude: 90.4125
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.warn('Location access denied or unavailable:', error.message);
        // Default location (Dhaka)
        setUserLocation({
          latitude: 23.8103,
          longitude: 90.4125
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
      }
    );
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
      alert('Getting your location, please wait...');
      getUserLocation();
      return;
    }

    if (activeBooking) {
      alert('You already have an active booking');
      return;
    }

    if (!selectedAmbulanceType) {
      alert('Please select an ambulance type');
      return;
    }

    // Show triage form first
    setShowTriageForm(true);
  };

  const handleTriageSubmit = async (triageData) => {
    setTriageSubmitted(true);
    // Now create booking
    await createBooking();
  };

  const createBooking = async () => {
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
          ambulanceType: selectedAmbulanceType
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

          {/* ETA Display */}
          {activeBooking && activeBooking.driverLocation && (
            <div className="mb-6">
              <ETADisplay
                userLocation={userLocation || activeBooking.userLocation}
                driverLocation={activeBooking.driverLocation}
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

          {/* Quick Action Cards */}
          <QuickActionCards
            userLocation={userLocation}
            selectedAmbulanceType={selectedAmbulanceType}
            onAmbulanceTypeSelect={setSelectedAmbulanceType}
          />

          {/* Additional Features Grid */}
          {activeBooking && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Trip Share */}
              <TripShareButton
                bookingId={activeBooking._id}
                userId={user._id}
              />

              {/* Bed Availability */}
              <BedAvailabilityPanel />
            </div>
          )}

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

      {/* Triage Form Modal */}
      <TriageFormModal
        isOpen={showTriageForm}
        onClose={() => setShowTriageForm(false)}
        onSubmit={handleTriageSubmit}
        bookingId={activeBooking?._id || 'temp'}
      />
    </div>
  );
}
