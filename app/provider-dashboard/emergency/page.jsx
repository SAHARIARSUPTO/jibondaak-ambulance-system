'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, MapPin, User as UserIcon, Phone, Clock, AlertCircle } from 'lucide-react';
import Toast from '@/app/components/Toast';
import RequestNotification from '@/app/components/provider/RequestNotification';

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }
      const parsedUser = JSON.parse(userData);
      const normalizedRole = String(parsedUser?.role || '').toLowerCase();
      
      if (normalizedRole !== 'provider') {
        router.push('/dashboard');
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
      const response = await fetch(`/api/provider/status?providerId=${providerId}`);
      if (!response.ok) return;
      
      const text = await response.text();
      if (!text) return;
      
      const data = JSON.parse(text);
      if (data.success) {
        setIsOnline(data.isOnline);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomingRequests = async () => {
    if (!provider) return;

    try {
      const response = await fetch(`/api/provider/requests?providerId=${provider._id}`);
      
      if (!response.ok) {
        console.error('❌ Request failed with status:', response.status);
        return;
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ Response is not JSON:', contentType);
        return;
      }

      const data = await response.json();

      if (data.success) {
        const newRequests = data.requests || [];
        
        const filteredRequests = newRequests.filter(req => 
          !processingRequests.has(req._id)
        );
        
        // Check if request count increased (new request arrived)
        if (filteredRequests.length > previousRequestCount && filteredRequests.length > 0) {
          setShowNotification(true);
        }
        
        setPreviousRequestCount(filteredRequests.length);
        setIncomingRequests(filteredRequests);
      }
    } catch (error) {
      console.error('❌ Error fetching requests:', error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    console.log('🔵 Accept clicked:', { requestId, alreadyProcessing: processingRequests.has(requestId) });
    
    if (processingRequests.has(requestId)) {
      console.log('⚠️ Already processing, BLOCKING');
      return;
    }
    
    if (!provider || !provider._id) {
      showToast('Provider information missing', 'error');
      return;
    }
    
    setProcessingRequests(prev => {
      const newSet = new Set(prev);
      newSet.add(requestId);
      return newSet;
    });
    
    setShowNotification(false);
    
    setIncomingRequests(prev => prev.filter(req => req._id !== requestId));
    
    try {
      const response = await fetch('/api/provider/accept-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, providerId: provider._id })
      });

      if (!response.ok) {
        showToast('Failed to accept request', 'error');
        fetchIncomingRequests();
        return;
      }

      const text = await response.text();
      if (!text) {
        showToast('Empty response', 'error');
        fetchIncomingRequests();
        return;
      }

      const data = JSON.parse(text);

      if (data.success) {
        showToast('Request accepted successfully!', 'success');
        
        await fetch('/api/provider/update-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: requestId, status: 'en_route' })
        });
      } else {
        showToast(data.error || 'Failed to accept', 'error');
        if (!data.error?.includes('already accepted')) {
          fetchIncomingRequests();
        }
      }
    } catch (error) {
      console.error('❌ Accept error:', error);
      showToast('Something went wrong', 'error');
      fetchIncomingRequests();
    } finally {
      setTimeout(() => {
        setProcessingRequests(prev => {
          const newSet = new Set(prev);
          newSet.delete(requestId);
          return newSet;
        });
      }, 10000);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setShowNotification(false);
    
    setIncomingRequests(prev => prev.filter(req => req._id !== requestId));
    
    try {
      const response = await fetch('/api/provider/reject-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, providerId: provider._id })
      });

      if (!response.ok) {
        showToast('Failed to reject', 'error');
        fetchIncomingRequests();
        return;
      }

      const text = await response.text();
      if (!text) {
        fetchIncomingRequests();
        return;
      }

      const data = JSON.parse(text);

      if (data.success) {
        showToast('Request rejected', 'success');
        setTimeout(() => fetchIncomingRequests(), 2000);
      } else {
        showToast(data.error || 'Failed to reject', 'error');
        fetchIncomingRequests();
      }
    } catch (error) {
      showToast('Failed to reject', 'error');
      fetchIncomingRequests();
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff7f7] flex items-center justify-center">
        <div className="text-slate-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7f7]">
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Bell className="w-8 h-8 text-yellow-400" />
              Emergency Requests
            </h1>
            <p className="text-slate-500">Manage incoming ambulance requests</p>
          </div>

          {!isOnline && (
            <div className="bg-yellow-900/30 border-2 border-amber-200 rounded-xl p-6 mb-6">
              <p className="text-amber-700 text-center font-semibold">
                ⚠️ You are currently offline. Go online to receive emergency requests.
              </p>
            </div>
          )}

          {incomingRequests.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-red-100">
              <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Pending Requests</h3>
              <p className="text-slate-500">
                {isOnline 
                  ? 'New emergency requests will appear here when users need ambulance services' 
                  : 'Go online to start receiving requests'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {incomingRequests.map((request) => (
                <div key={request._id} className="bg-white rounded-xl shadow-xl p-6 border-2 border-amber-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-yellow-500/20 p-2 rounded-lg border border-yellow-500/30">
                          <AlertCircle className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">Emergency Request</h3>
                          <p className="text-sm text-amber-700">Type: {request.ambulanceType}</p>
                        </div>
                      </div>

                      <div className="bg-red-50 p-4 rounded-lg mb-4 border border-red-200">
                        <p className="font-semibold text-slate-500 mb-2">Patient Contact:</p>
                        <div className="space-y-1 text-sm">
                          <p className="text-slate-900 flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-red-500" />
                            <span className="font-medium text-slate-500">Name:</span> {request.userName || 'Not provided'}
                          </p>
                          <p className="text-slate-900 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-red-500" />
                            <span className="font-medium text-slate-500">Phone:</span> {request.userPhone || 'Not provided'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4 text-red-400" />
                          <span className="text-sm">
                            {request.userLocation?.latitude.toFixed(4)}, {request.userLocation?.longitude.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm">{new Date(request.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      {request.triageInfo && (
                        <div className="bg-red-900/30 p-4 rounded-lg mb-4 border border-red-500/30">
                          <p className="font-semibold text-red-300 mb-2">Patient Medical Information:</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-red-200"><span className="font-medium text-red-300">Age:</span> {request.triageInfo.age}</p>
                            <p className="text-red-200"><span className="font-medium text-red-300">Gender:</span> {request.triageInfo.gender}</p>
                            <p className="col-span-2 text-red-200"><span className="font-medium text-red-300">Condition:</span> {request.triageInfo.condition}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 ml-4">
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        disabled={processingRequests.has(request._id)}
                        className={`px-6 py-3 rounded-lg font-bold transition-all shadow-lg border ${
                          processingRequests.has(request._id)
                            ? 'bg-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 border-green-400/30'
                        } text-slate-900`}
                      >
                        {processingRequests.has(request._id) ? 'Processing...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request._id)}
                        disabled={processingRequests.has(request._id)}
                        className={`px-6 py-3 rounded-lg font-bold transition-all shadow-lg border ${
                          processingRequests.has(request._id)
                            ? 'bg-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 transform hover:scale-105 border-red-400/30'
                        } text-slate-900`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Request Notification Toast */}
      {showNotification && incomingRequests.length > 0 && (
        <RequestNotification
          requestCount={incomingRequests.length}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
}

