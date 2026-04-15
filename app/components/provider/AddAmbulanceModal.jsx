'use client';

import { useState } from 'react';
import { X, Ambulance, User, Phone, FileText } from 'lucide-react';

export default function AddAmbulanceModal({ isOpen, onClose, onSuccess, providerId }) {
  const [formData, setFormData] = useState({
    type: 'non-ac',
    vehicleNumber: '',
    licenseNumber: '',
    driverName: '',
    driverPhone: '',
    latitude: '',
    longitude: '',
    locationName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/provider/ambulances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({
        providerId,
        type: formData.type,
        vehicleNumber: formData.vehicleNumber,
        licenseNumber: formData.licenseNumber,
        driverName: formData.driverName,
        driverPhone: formData.driverPhone,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        locationLabel: formData.locationName || undefined
      })
    });

      const data = await response.json();

      if (data.success) {
        onSuccess(data.ambulance);
        setFormData({
        type: 'non-ac',
        vehicleNumber: '',
        licenseNumber: '',
        driverName: '',
        driverPhone: '',
        latitude: '',
        longitude: '',
        locationName: ''
      });
        onClose();
      } else {
        setError(data.error || 'Failed to add ambulance');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-blue-500/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
              <Ambulance className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Add Ambulance</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-900/30 border-2 border-red-500 text-red-300 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Ambulance Type */}
          <div>
            <label className="block text-sm font-bold text-blue-300 mb-2">
              Ambulance Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-medium bg-slate-800"
            >
              <option value="non-ac" className="text-white bg-slate-800">Non-AC Ambulance</option>
              <option value="ac" className="text-white bg-slate-800">AC Ambulance</option>
              <option value="icu" className="text-white bg-slate-800">ICU Ambulance</option>
              <option value="freezer" className="text-white bg-slate-800">Freezer Van</option>
            </select>
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="block text-sm font-bold text-blue-300 mb-2">
              Vehicle Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Ambulance className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
                placeholder="DHA-1234"
                className="w-full pl-10 pr-4 py-3 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 bg-slate-800"
              />
            </div>
          </div>

          {/* License Number */}
          <div>
            <label className="block text-sm font-bold text-blue-300 mb-2">
              License Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                placeholder="LIC-12345"
                className="w-full pl-10 pr-4 py-3 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 bg-slate-800"
              />
            </div>
          </div>

          {/* Driver Name */}
          <div>
            <label className="block text-sm font-bold text-blue-300 mb-2">
              Driver Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                required
                placeholder="Enter driver name"
                className="w-full pl-10 pr-4 py-3 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 bg-slate-800"
              />
            </div>
          </div>

          {/* Driver Phone */}
          <div>
            <label className="block text-sm font-bold text-blue-300 mb-2">
              Driver Phone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="tel"
                name="driverPhone"
                value={formData.driverPhone}
                onChange={handleChange}
                required
                placeholder="01712345678"
                className="w-full pl-10 pr-4 py-3 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 bg-slate-800"
              />
            </div>
          </div>

          {/* Optional Location Coordinates */}
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-blue-300 mb-2">
                Base Latitude
              </label>
              <input
                type="number"
                name="latitude"
                step="0.000001"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="23.8103"
                className="w-full px-4 py-3 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-blue-300 mb-2">
                Base Longitude
              </label>
              <input
                type="number"
                name="longitude"
                step="0.000001"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="90.4125"
                className="w-full px-4 py-3 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-blue-300 mb-2">
              Location Label (area, hospital, or base)
            </label>
            <input
              type="text"
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              placeholder="Dhanmondi / Narayanganj Base"
              className="w-full px-4 py-3 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 bg-slate-800"
            />
            <p className="text-xs text-slate-500 mt-1">
              Optional, but helps users understand where the ambulance is deployed.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-slate-700 text-slate-300 rounded-lg font-bold hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-blue-400/30"
            >
              {loading ? 'Adding...' : 'Add Ambulance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
