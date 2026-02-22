'use client';

import { useState, useEffect } from 'react';
import { X, User, Calendar, AlertCircle } from 'lucide-react';

export default function TriageFormModal({ isOpen, onClose, onSubmit, bookingId }) {
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState([]);
  const [formData, setFormData] = useState({
    patientAge: '',
    patientGender: '',
    selectedSymptoms: [],
    additionalNotes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSymptoms();
    }
  }, [isOpen]);

  const fetchSymptoms = async () => {
    try {
      const response = await fetch('/api/triage/symptoms');
      const data = await response.json();
      if (data.success) {
        setSymptoms(data.symptoms);
      }
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    }
  };

  const handleSymptomToggle = (symptomId) => {
    setFormData(prev => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.includes(symptomId)
        ? prev.selectedSymptoms.filter(id => id !== symptomId)
        : [...prev.selectedSymptoms, symptomId]
    }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.patientAge || !formData.patientGender)) {
      alert('Please fill all fields');
      return;
    }
    if (step === 2 && formData.selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/triage/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          patientAge: parseInt(formData.patientAge),
          patientGender: formData.patientGender,
          symptoms: formData.selectedSymptoms,
          additionalNotes: formData.additionalNotes
        })
      });

      const data = await response.json();
      if (data.success) {
        onSubmit(data.triageForm);
        onClose();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Patient Information</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-red-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Patient Age
                </label>
                <input
                  type="number"
                  value={formData.patientAge}
                  onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Enter age"
                  min="0"
                  max="150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Patient Gender
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['male', 'female', 'other'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setFormData({ ...formData, patientGender: gender })}
                      className={`p-3 rounded-lg border-2 font-medium capitalize ${
                        formData.patientGender === gender
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 text-gray-700 hover:border-red-300'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Symptoms */}
          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                Select Symptoms (Choose all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {symptoms.map((symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => handleSymptomToggle(symptom.id)}
                    className={`p-3 rounded-lg border-2 text-left ${
                      formData.selectedSymptoms.includes(symptom.id)
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{symptom.name}</span>
                      {symptom.priority === 'critical' && (
                        <span className="text-red-600 text-xs">🚨</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Additional Notes */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                rows="4"
                placeholder="Any additional information about the patient's condition..."
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  ℹ️ This information will be automatically shared with the driver and hospital to help them prepare for your arrival.
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg disabled:bg-red-300"
              >
                {loading ? 'Submitting...' : 'Submit & Request Ambulance'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
