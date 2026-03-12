'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Ambulance, Plus, Power, Bell, MapPin, User, Phone, Clock } from 'lucide-react';
import Toast from '../components/Toast';
import AddAmbulanceModal from '../components/provider/AddAmbulanceModal';
import RequestNotification from '../components/provider/RequestNotification';
import ProviderSidebar from '../components/provider/ProviderSidebar';

export default function ProviderDashboard() {
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [showAddAmbulance, setShowAddAmbulance] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [previousRequestCount, setPreviousRequestCount] = useState(0);
  const [processingRequests, setProcessingRequests] = useState(new Set());

  useEffect(() => {
    // Check if provider is logged in
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }
      const parsedUser = JSON.parse(userData);
      
      // Check if user is provider
      if (parsedUser.role !== 'provider') {
        router.push('/dashboard');
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

  const fetchProviderData = async (providerId) => {
    try {
      // Fetch ambulances
      const ambulanceRes = await fetch(`/api/provider/ambulances?providerId=${providerId}`);
      const ambulanceData = await ambulanceRes.json();
      
      if (ambulanceData.success) {
        setAmbulances(ambulanceData.ambulances);
      }

      // Fetch provider status
      const statusRes = await fetch(`/api/provider/status?providerId=${providerId}`);
      const statusData = await statusRes.json();
      
      if (statusData.success) {
        setIsOnline(statusData.isOnline);
      }

      // Fetch active bookings
      fetchActiveBookings(providerId);
    } catch (error) {
      console.error('Error fetching provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomingRequests = async () => {
    if (!provider) return;

    try {
      const response = await fetch(`/api/provider/requests?providerId=${provider._id}`);
      
      // Check if response is ok
      if (!response.ok) {
        console.error('❌ Request failed with status:', response.status);
        return;
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ Response is not JSON:', contentType);
        return;
      }

      const data = await response.json();

      if (data.success) {
        const newRequests = data.requests || [];
        
        // Filter out requests that are currently being processed
        const filteredRequests = newRequests.filter(req => 
          !processingRequests.has(req._id)
        );
        
        console.log('📋 Fetched requests:', newRequests.length, 'After filtering:', filteredRequests.length);
        
        // Check if request count increased (new request arrived)
        if (filteredRequests.length > previousRequestCount && filteredRequests.length > 0) {
          setShowNotification(true);
        }
        
        setPreviousRequestCount(filteredRequests.length);
        setIncomingRequests(filteredRequests);
      } else {
        console.error('❌ API returned error:', data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching requests:', error);
    }
  };

  const fetchActiveBookings = async (providerId) => {
    try {
      const response = await fetch(`/api/provider/active-bookings?providerId=${providerId}`);
      
      if (!response.ok) {
        console.error('Failed to fetch active bookings:', response.status);
        return;
      }

      const text = await response.text();
      if (!text) {
        console.log('No active bookings');
        return;
      }

      const data = JSON.parse(text);

      if (data.success) {
        setActiveBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching active bookings:', error);
    }
  };

  const handleToggleStatus = async () => {
    if (ambulances.length === 0) {
      showToast('Please add at least one ambulance before going online', 'warning');
      return;
    }

    try {
      const response = await fetch('/api/provider/toggle-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId: provider._id,
          isOnline: !isOnline
        })
      });

      if (!response.ok) {
        showToast('Failed to update status', 'error');
        return;
      }

      const text = await response.text();
      if (!text) {
        showToast('Empty response from server', 'error');
        return;
      }

      const data = JSON.parse(text);

      if (data.success) {
        setIsOnline(!isOnline);
        showToast(
          !isOnline ? 'You are now online and ready to receive requests' : 'You are now offline',
          'success'
        );
      }
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleAcceptRequest = async (requestId) => {
    console.log('🔵 Accept clicked:', { 
      requestId, 
      providerId: provider?._id,
      alreadyProcessing: processingRequests.has(requestId)
    });
    
    // CRITICAL: Check if already processing - prevent duplicate
    if (processingRequests.has(requestId)) {
      console.log('⚠️ Already processing this request, BLOCKING duplicate accept');
      return;
    }
    
    if (!provider || !provider._id) {
      showToast('Provider information missing. Please refresh the page.', 'error');
      return;
    }
    
    // IMMEDIATELY mark as processing BEFORE any async operations
    setProcessingRequests(prev => {
      const newSet = new Set(prev);
      newSet.add(requestId);
      console.log('🔒 Locked request:', requestId, 'Total locked:', newSet.size);
      return newSet;
    });
    
    // Close popup if open
    setShowNotification(false);
    setCurrentRequest(null);
    
    // Immediately remove from UI for instant feedback
    setIncomingRequests(prev => {
      const filtered = prev.filter(req => req._id !== requestId);
      console.log('🗑️ Removed from UI:', requestId, 'Remaining:', filtered.length);
      return filtered;
    });
    
    try {
      console.log('📡 Sending accept request to API...');
      
      const response = await fetch('/api/provider/accept-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          providerId: provider._id
        })
      });

      if (!response.ok) {
        showToast('Failed to accept request', 'error');
        fetchIncomingRequests();
        return;
      }

      const text = await response.text();
      if (!text) {
        showToast('Empty response from server', 'error');
        fetchIncomingRequests();
        return;
      }

      const data = JSON.parse(text);
      
      console.log('📥 API Response:', { status: response.status, success: data.success });

      if (data.success) {
        showToast('Request accepted successfully!', 'success');
        
        // Update booking status to "en_route"
        await updateBookingStatus(requestId, 'en_route');
        
        // Refresh active bookings
        await fetchActiveBookings(provider._id);
        
        console.log('✅ Accept complete');
      } else {
        console.error('❌ Accept failed:', data.error);
        showToast(data.error || 'Failed to accept request', 'error');
        
        // Only restore if it was a real failure (not "already accepted")
        if (!data.error?.includes('already accepted')) {
          fetchIncomingRequests();
        }
      }
    } catch (error) {
      console.error('❌ Accept error:', error);
      showToast('Something went wrong', 'error');
      fetchIncomingRequests();
    } finally {
      // Keep in processing set for 10 seconds to prevent any duplicate
      setTimeout(() => {
        setProcessingRequests(prev => {
          const newSet = new Set(prev);
          newSet.delete(requestId);
          console.log('🔓 Unlocked request:', requestId);
          return newSet;
        });
      }, 10000);
    }
  };

  const handleRejectRequest = async (requestId) => {
    // Close popup if open
    setShowNotification(false);
    setCurrentRequest(null);
    
    // Immediately remove from UI
    setIncomingRequests(prev => {
      const filtered = prev.filter(req => req._id !== requestId);
      console.log('Rejecting request:', requestId, 'Remaining:', filtered.length);
      return filtered;
    });
    
    try {
      const response = await fetch('/api/provider/reject-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          providerId: provider._id
        })
      });

      if (!response.ok) {
        showToast('Failed to reject request', 'error');
        fetchIncomingRequests();
        return;
      }

      const text = await response.text();
      if (!text) {
        showToast('Empty response from server', 'error');
        fetchIncomingRequests();
        return;
      }

      const data = JSON.parse(text);

      if (data.success) {
        showToast('Request rejected', 'success');
        
        // Force refresh after 2 seconds
        setTimeout(() => {
          fetchIncomingRequests();
        }, 2000);
      } else {
        showToast(data.error || 'Failed to reject', 'error');
        fetchIncomingRequests();
      }
    } catch (error) {
      console.error('Reject error:', error);
      showToast('Something went wrong', 'error');
      fetchIncomingRequests();
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await fetch('/api/provider/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          status
        })
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const handleAmbulanceAdded = (newAmbulance) => {
    setAmbulances(prev => [...prev, newAmbulance]);
    showToast('Ambulance added successfully!', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            {/* Animated background circle */}
            <div className="absolute inset-0 w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 bg-cyan-500 rounded-full animate-pulse opacity-30"></div>
            </div>
            
            {/* Ambulance icon */}
            <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-6 rounded-3xl shadow-2xl mx-auto w-32 h-32 flex items-center justify-center border-2 border-blue-400/30">
              <Ambulance className="w-16 h-16 text-white animate-bounce" />
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-2">Loading Dashboard</h2>
            <p className="text-blue-200 text-lg">Please wait...</p>
            
            {/* Loading dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950">
      {/* Sidebar */}
      <ProviderSidebar 
        provider={provider} 
        isOnline={isOnline} 
        onToggleStatus={handleToggleStatus}
      />

      {/* Main Content with left margin for sidebar */}
      <div className="lg:ml-72">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-lg border-b border-blue-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo & Brand - Hidden on large screens (sidebar shows it) */}
              <div className="flex items-center gap-4 lg:hidden">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-xl shadow-lg border border-blue-400/30">
                  <Ambulance className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Provider Dashboard</h1>
                  <p className="text-sm text-blue-300">{provider?.companyName}</p>
                </div>
              </div>

              {/* Page Title for large screens */}
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-sm text-blue-300">Manage your ambulance services</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Add Ambulance Button */}
                <button
                  onClick={() => setShowAddAmbulance(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all border border-blue-400/30"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Ambulance</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Total Ambulances</p>
                <p className="text-3xl font-bold text-white">{ambulances.length}</p>
              </div>
              <Ambulance className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm">Pending Requests</p>
                <p className="text-3xl font-bold text-white">{incomingRequests.length}</p>
              </div>
              <Bell className="w-12 h-12 text-yellow-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">Active Bookings</p>
                <p className="text-3xl font-bold text-white">{activeBookings.length}</p>
              </div>
              <Clock className="w-12 h-12 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Status</p>
                <p className={`text-2xl font-bold ${isOnline ? 'text-green-400' : 'text-slate-400'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
              <Power className={`w-12 h-12 ${isOnline ? 'text-green-400' : 'text-slate-400'}`} />
            </div>
          </div>
        </div>

        {/* Emergency Requests Alert - Redirects to dedicated page */}
        {incomingRequests.length > 0 && (
          <div className="mb-8">
            <div 
              onClick={() => router.push('/provider-dashboard/emergency')}
              className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 backdrop-blur-lg rounded-xl shadow-xl p-6 border-2 border-yellow-500/50 cursor-pointer hover:border-yellow-400 transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-500/30">
                    <Bell className="w-8 h-8 text-yellow-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {incomingRequests.length} New Emergency {incomingRequests.length === 1 ? 'Request' : 'Requests'}
                    </h3>
                    <p className="text-yellow-300">Click here to view and accept requests</p>
                  </div>
                </div>
                <div className="text-yellow-400 text-4xl">→</div>
              </div>
            </div>
          </div>
        )}

        {/* My Ambulances */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">My Ambulances</h2>
            <button
              onClick={() => setShowAddAmbulance(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg border border-blue-400/30"
            >
              <Plus className="w-5 h-5" />
              Add Ambulance
            </button>
          </div>

          {ambulances.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-xl p-12 text-center border border-slate-700">
              <Ambulance className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 mb-4">No ambulances registered yet</p>
              <button
                onClick={() => setShowAddAmbulance(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg border border-blue-400/30"
              >
                Add Your First Ambulance
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ambulances.map((ambulance) => (
                <div key={ambulance._id} className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
                      <Ambulance className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{ambulance.type}</h3>
                      <p className="text-sm text-blue-300">{ambulance.vehicleNumber}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-blue-200">
                    <p><span className="font-medium text-blue-300">License:</span> {ambulance.licenseNumber}</p>
                    <p><span className="font-medium text-blue-300">Driver:</span> {ambulance.driverName}</p>
                    <p><span className="font-medium text-blue-300">Phone:</span> {ambulance.driverPhone}</p>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      ambulance.isAvailable 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-slate-700 text-slate-400 border border-slate-600'
                    }`}>
                      {ambulance.isAvailable ? 'Available' : 'Busy'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
