'use client';

import { Search, UserCheck, Navigation, CheckCircle, X } from 'lucide-react';

const STATUS_CONFIG = {
  searching: {
    icon: Search,
    text: 'Searching for Driver',
    color: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    iconColor: 'text-yellow-600'
  },
  driver_assigned: {
    icon: UserCheck,
    text: 'Driver Assigned',
    color: 'bg-blue-100 border-blue-500 text-blue-800',
    iconColor: 'text-blue-600'
  },
  en_route: {
    icon: Navigation,
    text: 'Driver En Route',
    color: 'bg-purple-100 border-purple-500 text-purple-800',
    iconColor: 'text-purple-600'
  },
  arrived: {
    icon: CheckCircle,
    text: 'Driver Arrived',
    color: 'bg-green-100 border-green-500 text-green-800',
    iconColor: 'text-green-600'
  }
};

export default function StatusBadge({ status, driverInfo, onCancel }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.searching;
  const Icon = config.icon;

  return (
    <div className={`${config.color} border-2 rounded-xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="animate-pulse">
            <Icon className={`w-12 h-12 ${config.iconColor}`} />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-1">{config.text}</h2>
            
            {driverInfo && (
              <div className="text-sm space-y-1">
                <p><span className="font-semibold">Driver:</span> {driverInfo.name}</p>
                <p><span className="font-semibold">Phone:</span> {driverInfo.phone}</p>
                <p><span className="font-semibold">Vehicle:</span> {driverInfo.vehicleNumber}</p>
              </div>
            )}
            
            {!driverInfo && status === 'searching' && (
              <p className="text-sm">Please wait while we find a driver near you...</p>
            )}
          </div>
        </div>

        {/* Cancel Button */}
        {status !== 'arrived' && status !== 'completed' && (
          <button
            onClick={onCancel}
            className="bg-white hover:bg-red-50 text-red-600 font-bold py-2 px-4 rounded-lg border-2 border-red-600 transition-colors flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {status === 'searching' && (
        <div className="mt-4">
          <div className="w-full bg-yellow-200 rounded-full h-2 overflow-hidden">
            <div className="bg-yellow-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
