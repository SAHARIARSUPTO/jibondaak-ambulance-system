'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProviderSidebar from '@/app/components/provider/ProviderSidebar';

export default function ProviderChatPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    const normalizedRole = String(parsed?.role || '').toLowerCase();
    if (normalizedRole !== 'provider') {
      router.push('/dashboard');
      return;
    }
    queueMicrotask(() => setProvider(parsed));
    fetch(`/api/provider/status?providerId=${parsed._id}`)
      .then((r) => r.json())
      .then((d) => setIsOnline(!!d.isOnline))
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    if (!provider?._id) return;
    const loadBookings = async () => {
      const res = await fetch(`/api/provider/active-bookings?providerId=${provider._id}`);
      const data = await res.json();
      if (data.success) setBookings(data.bookings || []);
    };
    loadBookings();
    const interval = setInterval(loadBookings, 4000);
    return () => clearInterval(interval);
  }, [provider?._id]);

  useEffect(() => {
    if (!selectedBookingId) {
      return;
    }
    const loadMessages = async () => {
      const res = await fetch(`/api/bookings/chat?bookingId=${selectedBookingId}`);
      const data = await res.json();
      if (data.success) setMessages(data.messages || []);
    };
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedBookingId]);

  const sendMessage = async () => {
    if (!selectedBookingId || !text.trim() || !provider?._id) return;
    const res = await fetch('/api/bookings/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: selectedBookingId,
        senderId: provider._id,
        senderRole: 'provider',
        text: text.trim(),
      }),
    });
    const data = await res.json();
    if (data.success) {
      setText('');
      setMessages((prev) => [...prev, data.message]);
    }
  };

  const toggleStatus = async () => {
    if (!provider?._id) return;
    const next = !isOnline;
    const res = await fetch('/api/provider/toggle-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providerId: provider._id, isOnline: next }),
    });
    const data = await res.json();
    if (data.success) setIsOnline(next);
  };

  return (
    <div className="min-h-screen bg-[#fff7f7]">
      <ProviderSidebar provider={provider} isOnline={isOnline} onToggleStatus={toggleStatus} />
      <div className="lg:ml-72 p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white border border-red-100 rounded-2xl p-4">
            <h2 className="text-slate-900 font-bold mb-3">Active Trips</h2>
            <div className="space-y-2">
              {bookings.map((b) => (
                <button
                  key={b._id}
                  onClick={() => setSelectedBookingId(b._id)}
                  className={`w-full text-left p-3 rounded-xl border ${
                    selectedBookingId === b._id
                      ? 'border-red-300 bg-red-50'
                      : 'border-red-100 bg-white'
                  }`}
                >
                  <p className="text-slate-900 text-sm font-semibold">{b.driverInfo?.name || 'Driver'}</p>
                  <p className="text-slate-500 text-xs">Fare: ৳{b.offeredFare ?? '--'}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-white border border-red-100 rounded-2xl p-4">
            <h2 className="text-slate-900 font-bold mb-3">Trip Chat</h2>
            <div className="h-96 overflow-y-auto bg-[#fffafa] border border-red-100 rounded-xl p-3 space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                    msg.senderRole === 'provider'
                      ? 'ml-auto bg-red-600 text-white'
                      : 'bg-white text-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type message..."
                className="flex-1 bg-[#fffafa] border border-red-100 rounded-xl px-3 py-2 text-slate-900"
              />
              <button
                onClick={sendMessage}
                disabled={!selectedBookingId || !text.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold disabled:bg-slate-300"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

