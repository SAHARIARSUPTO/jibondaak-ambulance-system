'use client';

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

const DEFAULT_LOCATION = { latitude: 23.8103, longitude: 90.4125 };

const formatStatus = (status) => {
  if (!status) return 'No active booking';
  return status
    .split('_')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');
};

const formatAmbulanceType = (type) => {
  if (!type) return 'Not selected';
  return type.replace('-', ' ').toUpperCase();
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedAmbulanceType, setSelectedAmbulanceType] = useState('non-ac');
  const [showTriageForm, setShowTriageForm] = useState(false);
  const [showDriverNotification, setShowDriverNotification] = useState(false);
  const [previousStatus, setPreviousStatus] = useState(null);

  const greeting = useMemo(() => getGreeting(), []);

  useEffect(() => {
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

      const interval = setInterval(() => {
        fetchActiveBooking();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const getUserLocation = () => {
    if (typeof window === 'undefined') return;

    if (!navigator.geolocation) {
      setUserLocation(DEFAULT_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => {
        setUserLocation(DEFAULT_LOCATION);
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

    setShowTriageForm(true);
  };

  const handleTriageSubmit = async () => {
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
          ambulanceType: selectedAmbulanceType,
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
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const bookingStatus = formatStatus(activeBooking?.status);
  const locationLabel = userLocation
    ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
    : 'Locating...';

  return (
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

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Booking Status', value: bookingStatus },
            { label: 'Ambulance Type', value: formatAmbulanceType(selectedAmbulanceType) },
            { label: 'Your Location', value: locationLabel },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl">
              <LiveTrackingMap
                userLocation={userLocation || activeBooking?.userLocation}
                driverLocation={activeBooking?.driverLocation}
                status={activeBooking?.status}
              />
            </div>

            <QuickActionCards
              userLocation={userLocation}
              selectedAmbulanceType={selectedAmbulanceType}
              onAmbulanceTypeSelect={setSelectedAmbulanceType}
            />
          </div>

          <div className="space-y-6">
            {activeBooking ? (
              <StatusBadge
                status={activeBooking.status}
                driverInfo={activeBooking.driverInfo}
                onCancel={handleCancelBooking}
              />
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Dispatch
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  No active booking.
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Select an ambulance type and press Emergency SOS to start a
                  request. Your live status and ETA will appear here.
                </p>
              </div>
            )}

            {activeBooking && activeBooking.driverLocation && (
              <ETADisplay
                userLocation={userLocation || activeBooking.userLocation}
                driverLocation={activeBooking.driverLocation}
              />
            )}

            {activeBooking && (
              <TripShareButton
                bookingId={activeBooking._id}
                userId={user._id}
              />
            )}

            {activeBooking && (
              <BedAvailabilityPanel />
            )}
          </div>
        </div>

        {!activeBooking && (
          <div className="rounded-3xl border border-cyan-400/30 bg-cyan-500/10 p-6">
            <p className="text-sm font-semibold text-cyan-100">
              Need immediate help? Choose an ambulance type and tap Emergency SOS.
            </p>
          </div>
        )}
      </div>

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
    </div>
  );
}
