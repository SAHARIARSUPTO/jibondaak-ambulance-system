'use client';

import { useState, useEffect } from 'react';
import { Ambulance, Wind, Heart, Snowflake, Hospital, Phone, BookOpen, ChevronRight } from 'lucide-react';

const AMBULANCE_ICONS = {
  'non-ac': Ambulance,
  'ac': Wind,
  'icu': Heart,
  'freezer': Snowflake
};

export default function QuickActionCards({ userLocation, selectedAmbulanceType, onAmbulanceTypeSelect }) {
  const [ambulanceTypes, setAmbulanceTypes] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [firstAidGuides, setFirstAidGuides] = useState([]);
  const [showFirstAidModal, setShowFirstAidModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loading, setLoading] = useState(true);

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
    try {
      const response = await fetch('/api/ambulance-types');
      const data = await response.json();
      if (data.success) {
        setAmbulanceTypes(data.ambulanceTypes);
      }
    } catch (error) {
      console.error('Error fetching ambulance types:', error);
    }
  };

  const fetchNearbyHospitals = async () => {
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
      setLoading(false);
    }
  };

  const fetchFirstAidGuides = async () => {
    try {
      const response = await fetch('/api/first-aid');
      const data = await response.json();
      if (data.success) {
        setFirstAidGuides(data.guides);
      }
    } catch (error) {
      console.error('Error fetching first aid guides:', error);
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Ambulance Type Picker */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Ambulance className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-bold text-gray-900">Ambulance Type</h3>
        </div>
        
        <div className="space-y-3">
          {ambulanceTypes.map((type) => {
            const Icon = AMBULANCE_ICONS[type.id] || Ambulance;
            const isSelected = selectedAmbulanceType === type.id;
            
            return (
              <button
                key={type.id}
                onClick={() => onAmbulanceTypeSelect(type.id)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-red-600' : 'text-gray-600'}`} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{type.name}</p>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hospital List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Hospital className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Nearby Hospitals</h3>
        </div>
        
        {loading ? (
          <p className="text-gray-600 text-sm">Loading hospitals...</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {hospitals.map((hospital, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{hospital.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{hospital.address}</p>
                    {hospital.distance && (
                      <p className="text-xs text-blue-600 mt-1">
                        📍 {hospital.distance.toFixed(1)} km away
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleCallHospital(hospital.phone)}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors"
                    title={`Call ${hospital.phone}`}
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* First Aid Guide */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-gray-900">First Aid Guide</h3>
        </div>
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {firstAidGuides.map((guide, index) => (
            <button
              key={index}
              onClick={() => openFirstAidGuide(guide)}
              className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    guide.priority === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    <span className="text-xl">
                      {guide.priority === 'high' ? '🚨' : '⚠️'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{guide.title}</p>
                    <p className="text-xs text-gray-600">{guide.steps.length} steps</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* First Aid Modal */}
      {showFirstAidModal && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedGuide.title}</h2>
                <button
                  onClick={() => setShowFirstAidModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedGuide.steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> Always call emergency services (999) in serious situations. This guide is for reference only.
                </p>
              </div>

              <button
                onClick={() => setShowFirstAidModal(false)}
                className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
