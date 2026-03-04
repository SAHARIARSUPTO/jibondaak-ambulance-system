'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Ambulance, Plus, Power, Bell, MapPin, User as UserIcon, Phone, Clock } from 'lucide-react';
import Toast from '../components/Toast';
import AddAmbulanceModal from '../components/provider/AddAmbulanceModal';
import RequestNotification from '../components/provider/RequestNotification';

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
  const [currentRequest, setCurrentRequest] = useState(null);

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
        
        // Check if there's a new request (not already in the list)
        const hasNewRequest = newRequests.some(newReq => 
          !incomingRequests.some(oldReq => oldReq._id === newReq._id)
        );
        
        if (hasNewRequest && newRequests.length > 0) {
          // New request arrived - show notification popup for the first new one
          const firstNewRequest = newRequests.find(newReq => 
            !incomingRequests.some(oldReq => oldReq._id === newReq._id)
          );
          
          if (firstNewRequest) {
            setCurrentRequest(firstNewRequest);
            setShowNotification(true);
          }
        }
        
        setIncomingRequests(newRequests);
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
      const data = await response.json();

      if (data.success) {
        setActiveBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching active bookings:', error);
    }
  };

  const toggleOnlineStatus = async () => {
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

      const data = await response.json();

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
    // Close popup if open
    setShowNotification(false);
    setCurrentRequest(null);
    
    console.log('🔵 Accept clicked:', { 
      requestId, 
      providerId: provider?._id,
      providerExists: !!provider 
    });
    
    if (!provider || !provider._id) {
      showToast('Provider information missing. Please refresh the page.', 'error');
      return;
    }
    
    // Immediately remove from UI for instant feedback
    setIncomingRequests(prev => {
      const filtered = prev.filter(req => req._id !== requestId);
      console.log('Removing request:', requestId, 'Remaining:', filtered.length);
      return filtered;
    });
    
    try {
      console.log('🔵 Sending accept request to API...');
      
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

      const data = await response.json();
      
      console.log('🔵 API Response:', { status: response.status, data });

      if (data.success) {
        showToast('Request accepted successfully!', 'success');
        
        // Update booking status to "en_route"
        await updateBookingStatus(requestId, 'en_route');
        
        // Refresh active bookings
        await fetchActiveBookings(provider._id);
        
        // Force refresh requests after 2 seconds to ensure sync
        setTimeout(() => {
          fetchIncomingRequests();
        }, 2000);
      } else {
        console.error('❌ Accept failed:', data.error);
        showToast(data.error || 'Failed to accept request', 'error');
        // Restore request if failed
        fetchIncomingRequests();
      }
    } catch (error) {
      console.error('❌ Accept error:', error);
      showToast('Something went wrong', 'error');
      // Restore request if failed
      fetchIncomingRequests();
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

      const data = await response.json();

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
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-lg border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-xl shadow-lg border border-blue-400/30">
                <Ambulance className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Provider Dashboard</h1>
                <p className="text-sm text-blue-300">{provider?.companyName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Online/Offline Toggle */}
              <button
                onClick={toggleOnlineStatus}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg border-2 ${
                  isOnline
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-green-400/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
                }`}
              >
                <Power className="w-5 h-5" />
                {isOnline ? 'Online' : 'Offline'}
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg font-medium transition-colors border border-red-500/30"
              >
                Logout
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

        {/* Incoming Requests */}
        {incomingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6 text-yellow-400 animate-pulse" />
              Incoming Requests ({incomingRequests.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {incomingRequests.map((request) => (
                <div key={request._id} className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-xl p-6 border-2 border-yellow-500/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-yellow-500/20 p-2 rounded-lg border border-yellow-500/30">
                          <UserIcon className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white">Emergency Request</h3>
                          <p className="text-sm text-yellow-300">Ambulance Type: {request.ambulanceType}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-blue-200">
                          <MapPin className="w-4 h-4 text-red-400" />
                          <span className="text-sm">
                            {request.userLocation?.latitude.toFixed(4)}, {request.userLocation?.longitude.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-200">
                          <Clock className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm">{new Date(request.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      {request.triageInfo && (
                        <div className="bg-blue-900/30 p-4 rounded-lg mb-4 border border-blue-500/30">
                          <p className="font-semibold text-blue-300 mb-2">Patient Information:</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-blue-200"><span className="font-medium text-blue-300">Age:</span> {request.triageInfo.age}</p>
                            <p className="text-blue-200"><span className="font-medium text-blue-300">Gender:</span> {request.triageInfo.gender}</p>
                            <p className="col-span-2 text-blue-200"><span className="font-medium text-blue-300">Condition:</span> {request.triageInfo.condition}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 ml-4">
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg border border-green-400/30"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request._id)}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg border border-red-400/30"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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

      {/* Request Notification Popup */}
      {showNotification && currentRequest && (
        <RequestNotification
          request={currentRequest}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
          onClose={() => {
            setShowNotification(false);
            setCurrentRequest(null);
          }}
        />
      )}
    </div>
  );
}
