'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RequestsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to emergency page (this is the actual requests page)
    router.push('/provider-dashboard/emergency');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 flex items-center justify-center">
      <div className="text-white text-center">
        <p className="text-xl">Redirecting to Emergency Requests...</p>
      </div>
    </div>
  );
}
