'use client';

import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

export default function TripShareButton({ bookingId, userId }) {
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/trip/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, userId })
      });
      const data = await response.json();
      if (data.success) {
        setShareLink(data.shareLink);
      }
    } catch (error) {
      console.error('Error generating share link:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const message = `Track my ambulance in real-time: ${shareLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold">Share Trip</h3>
      </div>

      {!shareLink ? (
        <button
          onClick={generateShareLink}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg disabled:bg-green-300"
        >
          {loading ? 'Generating...' : 'Generate Share Link'}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={shareViaWhatsApp}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg"
          >
            Share via WhatsApp
          </button>
        </div>
      )}

      <p className="text-xs text-gray-600 mt-3">
        Share this link with family members to let them track your trip in real-time
      </p>
    </div>
  );
}
