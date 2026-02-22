'use client';

import { useState, useEffect } from 'react';
import { Bed, Activity } from 'lucide-react';

export default function BedAvailabilityPanel() {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBedAvailability();
    const interval = setInterval(fetchBedAvailability, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBedAvailability = async () => {
    try {
      const response = await fetch('/api/beds/availability');
      const data = await response.json();
      if (data.success) {
        setBeds(data.beds);
      }
    } catch (error) {
      console.error('Error fetching bed availability:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bed className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold">Bed Availability</h3>
      </div>

      <div className="space-y-4">
        {beds.map((hospital, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3">{hospital.hospitalName}</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <BedItem label="General" count={hospital.generalBeds} />
              <BedItem label="ICU" count={hospital.icuBeds} critical />
              <BedItem label="Oxygen" count={hospital.oxygenBeds} />
              <BedItem label="Ventilator" count={hospital.ventilatorBeds} critical />
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Last updated: {new Date(hospital.lastUpdated).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BedItem({ label, count, critical }) {
  const color = count > 5 ? 'green' : count > 0 ? 'yellow' : 'red';
  
  return (
    <div className={`p-2 rounded border-2 ${
      color === 'green' ? 'border-green-500 bg-green-50' :
      color === 'yellow' ? 'border-yellow-500 bg-yellow-50' :
      'border-red-500 bg-red-50'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className={`text-lg font-bold ${
          color === 'green' ? 'text-green-700' :
          color === 'yellow' ? 'text-yellow-700' :
          'text-red-700'
        }`}>
          {count}
        </span>
      </div>
    </div>
  );
}
