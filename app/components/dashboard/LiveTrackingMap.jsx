'use client';

import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function LiveTrackingMap({ userLocation, driverLocation, status }) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="relative w-full h-[500px] bg-gray-100 overflow-hidden">
      {/* Map Placeholder - In production, use Google Maps or Mapbox */}
      <div 
        className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
      >
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Live Tracking Map</p>
          <p className="text-sm text-gray-500 mt-2">
            {userLocation 
              ? `Your Location: ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
              : 'Getting your location...'}
          </p>
        </div>
      </div>

      {/* User Location Marker */}
      {userLocation && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
          style={{ transform: `translate(-50%, -50%) scale(${zoom})` }}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">You</span>
            </div>
          </div>
        </div>
      )}

      {/* Driver Location Marker */}
      {driverLocation && (
        <div 
          className="absolute top-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
          style={{ transform: `translate(-50%, -50%) scale(${zoom})` }}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <Navigation className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">Driver</span>
            </div>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <button 
          onClick={handleZoomIn}
          className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors w-12 h-12 flex items-center justify-center"
          title="Zoom In"
        >
          <span className="text-2xl font-bold text-gray-700">+</span>
        </button>
        <button 
          onClick={handleZoomOut}
          className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors w-12 h-12 flex items-center justify-center"
          title="Zoom Out"
        >
          <span className="text-2xl font-bold text-gray-700">−</span>
        </button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 z-10">
        <p className="text-xs text-gray-600">Zoom: {Math.round(zoom * 100)}%</p>
      </div>

      {/* Location Info */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10">
        <h3 className="font-bold text-gray-900 mb-2">Location Details</h3>
        {userLocation && (
          <div className="text-sm text-gray-600 space-y-1">
            <p>Latitude: {userLocation.latitude.toFixed(6)}</p>
            <p>Longitude: {userLocation.longitude.toFixed(6)}</p>
          </div>
        )}
        {driverLocation && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-1">Driver Location:</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Latitude: {driverLocation.latitude.toFixed(6)}</p>
              <p>Longitude: {driverLocation.longitude.toFixed(6)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
