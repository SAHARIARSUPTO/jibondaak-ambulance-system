'use client';

import { useState, useEffect } from 'react';
import { Clock, MapPin } from 'lucide-react';

export default function ETADisplay({ userLocation, driverLocation }) {
  const [eta, setEta] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userLocation && driverLocation) {
      calculateETA();
      const interval = setInterval(calculateETA, 10000);
      return () => clearInterval(interval);
    }
  }, [userLocation, driverLocation]);

  const calculateETA = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bookings/eta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userLocation, driverLocation })
      });
      const data = await response.json();
      if (data.success) {
        setEta(data);
      }
    } catch (error) {
      console.error('Error calculating ETA:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!eta && !loading) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            <MapPin className="h-4 w-4" />
            Distance
          </div>
          <p className="mt-3 text-3xl font-semibold text-white">
            {loading ? 'Updating...' : `${eta.distance} km`}
          </p>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            <Clock className="h-4 w-4" />
            ETA
          </div>
          <p className="mt-3 text-3xl font-semibold text-white">
            {loading ? '--' : `${eta.eta} mins`}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-300">
        {loading ? 'Refreshing live ETA from dispatch.' : eta.message}
      </p>
    </div>
  );
}
