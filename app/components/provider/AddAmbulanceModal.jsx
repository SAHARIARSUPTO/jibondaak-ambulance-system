'use client';

import { useState } from 'react';
import { X, Ambulance, User, Phone, FileText } from 'lucide-react';

export default function AddAmbulanceModal({ isOpen, onClose, onSuccess, providerId, provider }) {
  const [formData, setFormData] = useState({
    type: 'non-ac',
    vehicleNumber: '',
    licenseNumber: '',
    driverName: '',
    driverPhone: '',
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
        locationLabel: formData.locationName || undefined,
        divisionId: provider?.division || undefined,
        upazilaId: provider?.upazila || undefined
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
    <div className="fixed inset-0 bg-red-950/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-red-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2 rounded-lg border border-red-200">
              <Ambulance className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Add Ambulance</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Ambulance Type */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Ambulance Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 font-medium bg-white"
            >
              <option value="non-ac" className="text-slate-900 bg-white">Non-AC Ambulance</option>
              <option value="ac" className="text-slate-900 bg-white">AC Ambulance</option>
              <option value="icu" className="text-slate-900 bg-white">ICU Ambulance</option>
              <option value="freezer" className="text-slate-900 bg-white">Freezer Van</option>
            </select>
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Vehicle Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Ambulance className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
                placeholder="DHA-1234"
                className="w-full pl-10 pr-4 py-3 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 placeholder-slate-400 bg-white"
              />
            </div>
          </div>

          {/* License Number */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              License Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                placeholder="LIC-12345"
                className="w-full pl-10 pr-4 py-3 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 placeholder-slate-400 bg-white"
              />
            </div>
          </div>

          {/* Driver Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Driver Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                required
                placeholder="Enter driver name"
                className="w-full pl-10 pr-4 py-3 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 placeholder-slate-400 bg-white"
              />
            </div>
          </div>

          {/* Driver Phone */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Driver Phone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="tel"
                name="driverPhone"
                value={formData.driverPhone}
                onChange={handleChange}
                required
                placeholder="01712345678"
                className="w-full pl-10 pr-4 py-3 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 placeholder-slate-400 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Location Label
            </label>
            <input
              type="text"
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              placeholder="Dhanmondi / Narayanganj Base"
              className="w-full px-4 py-3 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 placeholder-slate-400 bg-white"
            />
            <p className="text-xs text-slate-400 mt-1">
              Optional: your registration division/upazila is used automatically for matching.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-red-200 text-slate-600 rounded-lg font-bold hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-red-300"
            >
              {loading ? 'Adding...' : 'Add Ambulance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

