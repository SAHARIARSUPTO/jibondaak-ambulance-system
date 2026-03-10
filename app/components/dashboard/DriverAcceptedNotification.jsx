'use client';

import { useEffect } from 'react';
import { CheckCircle, User, Phone, Car, X } from 'lucide-react';

export default function DriverAcceptedNotification({ driverInfo, onClose }) {
  useEffect(() => {
    // Auto-close after 10 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!driverInfo) return null;

  return (
    <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full border-4 border-green-500/50 animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-3xl border-b-2 border-green-500/30 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full border-2 border-white/30">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">Driver Assigned!</h2>
              <p className="text-green-100 text-sm">Your ambulance is on the way</p>
            </div>
          </div>
        </div>

        {/* Driver Details */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-800 rounded-xl p-4 border-2 border-green-500/30">
            <p className="text-sm text-green-300 font-bold mb-3">Driver Information</p>
            
            <div className="space-y-3">
              {/* Driver Name */}
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-blue-300">Driver Name</p>
                  <p className="text-base font-bold text-white">{driverInfo.name}</p>
                </div>
              </div>

              {/* Driver Phone */}
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <Phone className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-green-300">Contact Number</p>
                  <p className="text-base font-bold text-white">{driverInfo.phone}</p>
                </div>
              </div>

              {/* Vehicle Number */}
              <div className="flex items-center gap-3">
                <div className="bg-cyan-500/20 p-2 rounded-lg">
                  <Car className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-cyan-300">Vehicle Number</p>
                  <p className="text-base font-bold text-white">{driverInfo.vehicleNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-green-900/30 rounded-xl p-4 border border-green-500/30">
            <p className="text-sm text-green-300 text-center">
              🚑 The ambulance is en route to your location. You can track it on the map above.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg border border-blue-400/30"
          >
            Got it!
          </button>

          <p className="text-center text-xs text-slate-400">
            This notification will auto-close in 10 seconds
          </p>
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
        @keyframes slide-up {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
}
