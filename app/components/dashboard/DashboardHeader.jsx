'use client';

import { useState } from 'react';
import { Ambulance, AlertCircle, User, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardHeader({
  user,
  greeting,
  statusLabel,
  onSOSClick,
  hasActiveBooking,
  loading
}) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  return (
    <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl">
      <div className="absolute inset-0">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15">
              <Ambulance className="h-6 w-6 text-red-400" />
            </span>
            <span className="text-2xl font-semibold text-white">
              Jibon<span className="text-red-400">Daak</span> Command
            </span>
          </Link>
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-red-300">
              {greeting}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              Welcome back, {user?.name}
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Status: <span className="text-slate-100">{statusLabel}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onSOSClick}
            disabled={hasActiveBooking || loading}
            className="group flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700 disabled:bg-red-300"
          >
            <AlertCircle className="h-5 w-5 transition group-hover:scale-105" />
            Emergency SOS
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/30">
                <User className="h-5 w-5" />
              </span>
              <span className="hidden sm:block">{user?.name}</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-2xl">
                <div className="border-b border-white/10 px-3 py-2">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>

                <button
                  onClick={() => setShowMenu(false)}
                  className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
