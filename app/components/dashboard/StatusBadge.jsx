'use client';

import { Search, UserCheck, Navigation, CheckCircle, X } from 'lucide-react';

const STATUS_CONFIG = {
  searching: {
    icon: Search,
    text: 'Searching for Driver',
    accent: 'from-amber-500/20 via-amber-500/5 to-transparent',
    border: 'border-amber-400/40',
    iconColor: 'text-amber-300'
  },
  driver_assigned: {
    icon: UserCheck,
    text: 'Driver Assigned',
    accent: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
    border: 'border-cyan-400/40',
    iconColor: 'text-cyan-300'
  },
  en_route: {
    icon: Navigation,
    text: 'Driver En Route',
    accent: 'from-purple-500/20 via-purple-500/5 to-transparent',
    border: 'border-purple-400/40',
    iconColor: 'text-purple-300'
  },
  arrived: {
    icon: CheckCircle,
    text: 'Driver Arrived',
    accent: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    border: 'border-emerald-400/40',
    iconColor: 'text-emerald-300'
  }
};

export default function StatusBadge({ status, driverInfo, onCancel }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.searching;
  const Icon = config.icon;

  return (
    <div className={`rounded-3xl border ${config.border} bg-gradient-to-r ${config.accent} p-6`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-white">{config.text}</h2>
              <p className="text-sm text-slate-300">
                {driverInfo ? 'Driver details confirmed.' : 'Dispatch is locating the closest unit.'}
              </p>
            </div>
          </div>

          {status !== 'arrived' && status !== 'completed' && (
            <button
              onClick={onCancel}
              className="flex items-center gap-2 rounded-full border border-red-400/60 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
        </div>

        {driverInfo && (
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
            <p><span className="text-slate-400">Driver:</span> {driverInfo.name}</p>
            <p><span className="text-slate-400">Phone:</span> {driverInfo.phone}</p>
            <p><span className="text-slate-400">Vehicle:</span> {driverInfo.vehicleNumber}</p>
          </div>
        )}

        {status === 'searching' && (
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-2 w-2/3 animate-pulse rounded-full bg-amber-400/70" />
          </div>
        )}
      </div>
    </div>
  );
}
