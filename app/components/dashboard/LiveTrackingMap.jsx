'use client';

import { useMemo } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const DEFAULT_LOCATION = { latitude: 23.8103, longitude: 90.4125 };

export default function LiveTrackingMap({ userLocation, driverLocation, status }) {
  const mapCenter = driverLocation || userLocation || DEFAULT_LOCATION;

  const mapSrc = useMemo(() => {
    const lat = mapCenter.latitude;
    const lon = mapCenter.longitude;
    const delta = 0.03;
    const left = (lon - delta).toFixed(5);
    const right = (lon + delta).toFixed(5);
    const bottom = (lat - delta).toFixed(5);
    const top = (lat + delta).toFixed(5);
    const marker = `${lat.toFixed(5)},${lon.toFixed(5)}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${marker}`;
  }, [mapCenter.latitude, mapCenter.longitude]);

  return (
    <div className="relative h-[480px] overflow-hidden rounded-3xl">
      <iframe
        title="Live tracking map"
        src={mapSrc}
        className="h-full w-full border-0"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

      <div className="absolute left-4 top-4 space-y-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Live Map</p>
          <p className="mt-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cyan-300" />
            {userLocation
              ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
              : 'Locating your position...'}
          </p>
        </div>

        {driverLocation && (
          <div className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Driver</p>
            <p className="mt-2 flex items-center gap-2">
              <Navigation className="h-4 w-4 text-red-300" />
              {driverLocation.latitude.toFixed(4)}, {driverLocation.longitude.toFixed(4)}
            </p>
            <p className="mt-1 text-xs text-slate-400">Status: {status || 'Pending'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
