'use client';

import { useState, useEffect } from 'react';
import {
  Ambulance,
  Wind,
  Heart,
  Snowflake,
  Hospital,
  Phone,
  BookOpen,
  ChevronRight,
  AlertTriangle,
  X
} from 'lucide-react';

const AMBULANCE_ICONS = {
  'non-ac': Ambulance,
  'ac': Wind,
  'icu': Heart,
  'freezer': Snowflake
};

export default function QuickActionCards({
  userLocation,
  selectedAmbulanceType,
  onAmbulanceTypeSelect
}) {
  const [ambulanceTypes, setAmbulanceTypes] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [firstAidGuides, setFirstAidGuides] = useState([]);
  const [showFirstAidModal, setShowFirstAidModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingGuides, setLoadingGuides] = useState(true);

  useEffect(() => {
    fetchAmbulanceTypes();
    fetchFirstAidGuides();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyHospitals();
    }
  }, [userLocation]);

  const fetchAmbulanceTypes = async () => {
    setLoadingTypes(true);
    try {
      const response = await fetch('/api/ambulance-types');
      const data = await response.json();
      if (data.success) {
        setAmbulanceTypes(data.ambulanceTypes);
      }
    } catch (error) {
      console.error('Error fetching ambulance types:', error);
    } finally {
      setLoadingTypes(false);
    }
  };

  const fetchNearbyHospitals = async () => {
    setLoadingHospitals(true);
    try {
      const response = await fetch('/api/hospitals/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          limit: 5
        })
      });
      const data = await response.json();
      if (data.success) {
        setHospitals(data.hospitals);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoadingHospitals(false);
    }
  };

  const fetchFirstAidGuides = async () => {
    setLoadingGuides(true);
    try {
      const response = await fetch('/api/first-aid');
      const data = await response.json();
      if (data.success) {
        setFirstAidGuides(data.guides);
      }
    } catch (error) {
      console.error('Error fetching first aid guides:', error);
    } finally {
      setLoadingGuides(false);
    }
  };

  const handleCallHospital = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const openFirstAidGuide = (guide) => {
    setSelectedGuide(guide);
    setShowFirstAidModal(true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/15">
            <Ambulance className="h-5 w-5 text-red-300" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Fleet
            </p>
            <h3 className="text-xl font-semibold text-white">Ambulance Type</h3>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {loadingTypes && (
            <p className="text-sm text-slate-400">Loading types...</p>
          )}
          {!loadingTypes && ambulanceTypes.length === 0 && (
            <p className="text-sm text-slate-400">No types available.</p>
          )}
          {ambulanceTypes.map((type) => {
            const Icon = AMBULANCE_ICONS[type.id] || Ambulance;
            const isSelected = selectedAmbulanceType === type.id;

            return (
              <button
                key={type.id}
                onClick={() => onAmbulanceTypeSelect(type.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  isSelected
                    ? 'border-red-400/70 bg-red-500/10'
                    : 'border-white/10 bg-white/5 hover:border-red-400/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-red-300' : 'text-slate-300'}`} />
                  <div className="flex-1">
                    <p className="font-semibold text-white">{type.name}</p>
                    <p className="text-xs text-slate-400">{type.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15">
            <Hospital className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Network
            </p>
            <h3 className="text-xl font-semibold text-white">Nearby Hospitals</h3>
          </div>
        </div>

        {!userLocation && (
          <p className="mt-4 text-sm text-slate-400">
            Waiting for your location to list nearby hospitals.
          </p>
        )}

        {userLocation && loadingHospitals && (
          <p className="mt-4 text-sm text-slate-400">Loading hospitals...</p>
        )}

        {userLocation && !loadingHospitals && hospitals.length === 0 && (
          <p className="mt-4 text-sm text-slate-400">No hospitals found nearby.</p>
        )}

        <div className="mt-4 space-y-3">
          {hospitals.map((hospital, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {hospital.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {hospital.address}
                  </p>
                  {hospital.distance && (
                    <p className="text-xs text-cyan-200 mt-1">
                      {hospital.distance.toFixed(1)} km away
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleCallHospital(hospital.phone)}
                  className="rounded-full bg-emerald-500/80 p-2 text-white transition hover:bg-emerald-500"
                  title={`Call ${hospital.phone}`}
                >
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15">
            <BookOpen className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Guidance
            </p>
            <h3 className="text-xl font-semibold text-white">First Aid Guides</h3>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {loadingGuides && (
            <p className="text-sm text-slate-400">Loading guides...</p>
          )}
          {!loadingGuides && firstAidGuides.length === 0 && (
            <p className="text-sm text-slate-400">No guides available.</p>
          )}
          {firstAidGuides.map((guide, index) => (
            <button
              key={index}
              onClick={() => openFirstAidGuide(guide)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left transition hover:border-emerald-400/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      guide.priority === 'high'
                        ? 'bg-red-500/20 text-red-200'
                        : 'bg-amber-500/20 text-amber-200'
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {guide.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {guide.steps.length} steps
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {showFirstAidModal && selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950 p-6 text-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">{selectedGuide.title}</h2>
              <button
                onClick={() => setShowFirstAidModal(false)}
                className="rounded-full border border-white/10 p-2 text-slate-200 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {selectedGuide.steps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-sm font-semibold text-red-200">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-300 pt-1">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
              <p className="text-sm text-amber-200">
                Important: Always call emergency services (999) in serious situations.
                This guide is for reference only.
              </p>
            </div>

            <button
              onClick={() => setShowFirstAidModal(false)}
              className="mt-6 w-full rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
