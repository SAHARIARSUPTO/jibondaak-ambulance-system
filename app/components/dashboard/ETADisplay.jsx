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

  if (!eta) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5" />
            <span className="text-sm opacity-90">Distance</span>
          </div>
          <p className="text-3xl font-bold">{eta.distance} km</p>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 mb-2 justify-end">
            <Clock className="w-5 h-5" />
            <span className="text-sm opacity-90">ETA</span>
          </div>
          <p className="text-3xl font-bold">{eta.eta} mins</p>
        </div>
      </div>
      
      <p className="text-sm mt-4 opacity-90">{eta.message}</p>
    </div>
  );
}
