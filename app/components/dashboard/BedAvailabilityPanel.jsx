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

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/15">
          <Bed className="h-5 w-5 text-purple-300" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Capacity
          </p>
          <h3 className="text-xl font-semibold text-white">Bed Availability</h3>
        </div>
      </div>

      {loading && (
        <p className="mt-4 text-sm text-slate-400">Loading bed status...</p>
      )}

      {!loading && beds.length === 0 && (
        <p className="mt-4 text-sm text-slate-400">No bed updates available.</p>
      )}

      <div className="mt-5 space-y-4">
        {beds.map((hospital, index) => (
          <div key={index} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">
                {hospital.hospitalName}
              </h4>
              <Activity className="h-4 w-4 text-purple-300" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <BedItem label="General" count={hospital.generalBeds} />
              <BedItem label="ICU" count={hospital.icuBeds} critical />
              <BedItem label="Oxygen" count={hospital.oxygenBeds} />
              <BedItem label="Ventilator" count={hospital.ventilatorBeds} critical />
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Last updated: {new Date(hospital.lastUpdated).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BedItem({ label, count }) {
  const status = count > 5 ? 'green' : count > 0 ? 'yellow' : 'red';

  return (
    <div
      className={`rounded-2xl border px-3 py-2 text-sm ${
        status === 'green'
          ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
          : status === 'yellow'
          ? 'border-amber-400/40 bg-amber-500/10 text-amber-200'
          : 'border-red-400/40 bg-red-500/10 text-red-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
        <span className="text-lg font-semibold">{count}</span>
      </div>
    </div>
  );
}
