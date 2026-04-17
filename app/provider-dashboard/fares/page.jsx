'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProviderSidebar from '@/app/components/provider/ProviderSidebar';

export default function ProviderFaresPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [fareMap, setFareMap] = useState({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    const normalizedRole = String(parsed?.role || '').toLowerCase();
    if (normalizedRole !== 'provider') {
      router.push('/dashboard');
      return;
    }
    queueMicrotask(() => setProvider(parsed));
    fetch(`/api/provider/status?providerId=${parsed._id}`)
      .then((r) => r.json())
      .then((d) => setIsOnline(!!d.isOnline))
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    const run = async () => {
      try {
        const [driversRes, routesRes] = await Promise.all([
          fetch('/json/drivers.json'),
          fetch('/api/routes'),
        ]);
        const driversData = await driversRes.json();
        const routesData = await routesRes.json();
        setDrivers(driversData.drivers || []);
        setRoutes(routesData.routes || []);
      } catch (error) {}
    };
    run();
  }, []);

  useEffect(() => {
    if (!selectedDriverId) return;
    fetch(`/api/provider/route-fares?driverId=${selectedDriverId}`)
      .then((r) => r.json())
      .then((d) => setFareMap(d.fares || {}))
      .catch(() => {});
  }, [selectedDriverId]);

  const selectedDriver = useMemo(
    () => drivers.find((d) => d.id === selectedDriverId),
    [drivers, selectedDriverId],
  );

  const handleFareChange = async (routeId, value) => {
    const amount = Number(value);
    if (!selectedDriverId || !Number.isFinite(amount)) return;
    await fetch('/api/provider/route-fares', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverId: selectedDriverId, routeId, amount }),
    });
    setFareMap((prev) => ({ ...prev, [routeId]: amount }));
  };

  const toggleStatus = async () => {
    if (!provider?._id) return;
    const next = !isOnline;
    const res = await fetch('/api/provider/toggle-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providerId: provider._id, isOnline: next }),
    });
    const data = await res.json();
    if (data.success) setIsOnline(next);
  };

  return (
    <div className="min-h-screen bg-[#fff7f7]">
      <ProviderSidebar provider={provider} isOnline={isOnline} onToggleStatus={toggleStatus} />
      <div className="lg:ml-72 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Route Fare Desk</h1>
          <p className="text-slate-500 mb-6">Set static fares per route for each driver.</p>

          <div className="bg-white border border-red-100 rounded-2xl p-5 mb-6">
            <label className="block text-slate-500 text-sm mb-2">Select Driver</label>
            <select
              className="w-full md:w-96 bg-white border border-red-200 rounded-xl px-3 py-2 text-slate-900"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
            >
              <option value="">Choose driver</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} - {d.ambulanceNumber}
                </option>
              ))}
            </select>
            {selectedDriver && (
              <p className="text-slate-600 text-sm mt-2">
                {selectedDriver.ambulanceModel} | Trips: {selectedDriver.tripsCovered}
              </p>
            )}
          </div>

          {selectedDriverId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="bg-white border border-red-100 rounded-2xl p-5"
                >
                  <p className="text-slate-900 font-bold">{route.name}</p>
                  <p className="text-slate-600 text-sm mb-3">Base fare: ৳{route.baseFare}</p>
                  <input
                    type="number"
                    defaultValue={fareMap[route.id] ?? route.baseFare}
                    className="w-full bg-white border border-red-200 rounded-xl px-3 py-2 text-slate-900"
                    onBlur={(e) => handleFareChange(route.id, e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-2">Save by clicking outside input.</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

