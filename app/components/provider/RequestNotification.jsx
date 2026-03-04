'use client';

import { useEffect, useRef } from 'react';
import { Bell, MapPin, User, Clock, AlertCircle } from 'lucide-react';

export default function RequestNotification({ request, onAccept, onReject, onClose }) {
  const audioRef = useRef(null);

  useEffect(() => {
    // Play notification sound (optional - gracefully handle if file missing)
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        // Silently ignore if audio file not found
        console.log('Audio notification not available');
      });
    }

    // Auto-close after 30 seconds if no action
    const timer = setTimeout(() => {
      onClose();
    }, 30000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!request) return null;

  return (
    <>
      {/* Notification Sound */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* Popup Modal */}
      <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full border-4 border-yellow-500/50 animate-bounce-in">
          {/* Header with Alert */}
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 rounded-t-3xl border-b-2 border-yellow-500/30">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full animate-pulse border-2 border-white/30">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 animate-pulse" />
                  Emergency Request!
                </h2>
                <p className="text-yellow-100 text-sm">New ambulance request received</p>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="p-6 space-y-4">
            {/* Ambulance Type */}
            <div className="bg-slate-800 rounded-xl p-4 border-2 border-yellow-500/30">
              <p className="text-sm text-yellow-300 font-medium">Ambulance Type Requested</p>
              <p className="text-xl font-bold text-white capitalize">
                {request.ambulanceType?.replace('-', ' ')} Ambulance
              </p>
            </div>

            {/* Location */}
            <div className="bg-slate-800 rounded-xl p-4 border-2 border-blue-500/30">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-blue-300 font-medium">Patient Location</p>
                  <p className="text-base font-semibold text-white">
                    {request.userLocation?.latitude.toFixed(4)}, {request.userLocation?.longitude.toFixed(4)}
                  </p>
                  <p className="text-xs text-blue-200 mt-1">
                    📍 Tap to view on map
                  </p>
                </div>
              </div>
            </div>

            {/* Patient Info (Triage) */}
            {request.triageInfo && (
              <div className="bg-red-900/30 rounded-xl p-4 border-2 border-red-500/30">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-red-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-red-300 font-bold mb-2">Patient Information</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-red-300">Age:</p>
                        <p className="font-semibold text-white">{request.triageInfo.age} years</p>
                      </div>
                      <div>
                        <p className="text-red-300">Gender:</p>
                        <p className="font-semibold text-white capitalize">{request.triageInfo.gender}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-red-300">Condition:</p>
                        <p className="font-semibold text-white">{request.triageInfo.condition}</p>
                      </div>
                      {request.triageInfo.notes && (
                        <div className="col-span-2">
                          <p className="text-red-300">Notes:</p>
                          <p className="font-semibold text-white">{request.triageInfo.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Time */}
            <div className="flex items-center gap-2 text-blue-200 text-sm">
              <Clock className="w-4 h-4" />
              <span>Requested: {new Date(request.createdAt).toLocaleTimeString()}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => onReject(request._id)}
                className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 border border-slate-700"
              >
                Reject
              </button>
              <button
                onClick={() => onAccept(request._id)}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg border border-green-400/30"
              >
                Accept Request
              </button>
            </div>

            {/* Auto-close warning */}
            <p className="text-center text-xs text-slate-400">
              This notification will auto-close in 30 seconds
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </>
  );
}
