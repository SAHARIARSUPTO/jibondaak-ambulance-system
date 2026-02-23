'use client';

import { useState, useEffect } from 'react';
import { X, User, Calendar, AlertCircle, Info } from 'lucide-react';

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
    setFormData((prev) => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.includes(symptomId)
        ? prev.selectedSymptoms.filter((id) => id !== symptomId)
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
          patientAge: parseInt(formData.patientAge, 10),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950 text-slate-100">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Patient Information</h2>
            <button
              onClick={onClose}
              className="rounded-full border border-white/10 p-2 text-slate-200 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                    step >= s
                      ? 'bg-red-500/80 text-white'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`mx-2 h-1 flex-1 rounded-full ${
                      step > s ? 'bg-red-500/70' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Patient Age
                </label>
                <input
                  type="number"
                  value={formData.patientAge}
                  onChange={(e) =>
                    setFormData({ ...formData, patientAge: e.target.value })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-red-400/60"
                  placeholder="Enter age"
                  min="0"
                  max="150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  <User className="inline h-4 w-4 mr-2" />
                  Patient Gender
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['male', 'female', 'other'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() =>
                        setFormData({ ...formData, patientGender: gender })
                      }
                      className={`rounded-2xl border px-3 py-3 text-sm font-semibold capitalize transition ${
                        formData.patientGender === gender
                          ? 'border-red-400/70 bg-red-500/10 text-red-200'
                          : 'border-white/10 text-slate-200 hover:border-red-400/40'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 space-y-4">
              <label className="block text-sm font-medium text-slate-200">
                <AlertCircle className="inline h-4 w-4 mr-2" />
                Select symptoms (choose all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {symptoms.map((symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => handleSymptomToggle(symptom.id)}
                    className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${
                      formData.selectedSymptoms.includes(symptom.id)
                        ? 'border-red-400/70 bg-red-500/10 text-red-100'
                        : 'border-white/10 text-slate-200 hover:border-red-400/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{symptom.name}</span>
                      {symptom.priority === 'critical' && (
                        <span className="text-xs text-red-300">High</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-8 space-y-4">
              <label className="block text-sm font-medium text-slate-200">
                Additional Notes (optional)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) =>
                  setFormData({ ...formData, additionalNotes: e.target.value })
                }
                className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-red-400/60"
                rows="4"
                placeholder="Any additional information about the patient's condition..."
              />

              <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4">
                <p className="flex items-start gap-2 text-sm text-cyan-100">
                  <Info className="mt-0.5 h-4 w-4" />
                  This information is shared with the driver and hospital to help
                  them prepare for your arrival.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-red-300"
              >
                {loading ? 'Submitting...' : 'Submit and Request Ambulance'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
