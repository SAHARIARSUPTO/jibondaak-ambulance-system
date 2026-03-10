'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell  MapPin, User, Phone, Clock, AlertCircle } from 'lucide-react';
import ProviderSidebar from '@/app/components/provider/ProviderSidebar';
import Toast from '@/app/components/Toast';

export default function RequestsPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'provider') {
        router.push('/dashboard');
        return;
      }
      setProvider(parsedUser);
      fetchProviderStatus(parsedUser._id);
      fetchRequests();
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchRequests();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchProviderStatus = async (providerId) => {
    try {
      const response = await fetch(`/api/provider/status?providerId=${providerId}`);
      const data = await response.json();
      if (data.success) {
        setIsOnline(data.isOnline);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch