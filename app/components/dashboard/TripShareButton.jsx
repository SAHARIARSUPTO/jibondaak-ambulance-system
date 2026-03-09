'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Send } from 'lucide-react';

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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15">
          <Share2 className="h-5 w-5 text-emerald-300" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Share</p>
          <h3 className="text-xl font-semibold text-white">Trip Share Link</h3>
        </div>
      </div>

      {!shareLink ? (
        <button
          onClick={generateShareLink}
          disabled={loading}
          className="mt-5 w-full rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:bg-emerald-300"
        >
          {loading ? 'Generating link...' : 'Generate Share Link'}
        </button>
      ) : (
        <div className="mt-5 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-slate-200"
            />
            <button
              onClick={copyToClipboard}
              className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10"
            >
              {copied ? <Check className="h-5 w-5 text-emerald-300" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>

          <button
            onClick={shareViaWhatsApp}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            <Send className="h-4 w-4" />
            Share via WhatsApp
          </button>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Share this link with family members to let them track your trip in real-time.
      </p>
    </div>
  );
}
