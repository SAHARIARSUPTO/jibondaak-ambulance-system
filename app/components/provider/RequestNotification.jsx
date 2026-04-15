'use client';

import { useEffect } from 'react';
import { Bell, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RequestNotification({ requestCount, onClose }) {
  const router = useRouter();

  useEffect(() => {
    // Auto-close after 10 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleViewRequests = () => {
    router.push('/provider-dashboard/emergency');
    onClose();
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl shadow-2xl border-2 border-yellow-400/50 max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg animate-pulse">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">New Emergency Request!</h3>
              <p className="text-yellow-100 text-sm">
                {requestCount} {requestCount === 1 ? 'request' : 'requests'} waiting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button */}
        <div className="bg-white/10 backdrop-blur-sm p-4 border-t border-white/20">
          <button
            onClick={handleViewRequests}
            className="w-full bg-white hover:bg-yellow-50 text-orange-600 font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
          >
            View Requests
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
}
