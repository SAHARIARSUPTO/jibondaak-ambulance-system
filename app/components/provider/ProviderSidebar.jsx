'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  Ambulance, 
  LogOut, 
  Menu, 
  X,
  Building,
  Bell,
  BadgeDollarSign,
  MessageCircle
} from 'lucide-react';

export default function ProviderSidebar({ provider, isOnline, onToggleStatus }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/driver-dashboard' },
    { icon: Bell, label: 'Emergency Requests', path: '/driver-dashboard/emergency' },
    { icon: BadgeDollarSign, label: 'Route Fares', path: '/driver-dashboard/fares' },
    { icon: MessageCircle, label: 'Trip Chat', path: '/driver-dashboard/chat' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-red-950/20 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-red-100 z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-72
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-red-100">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <Ambulance className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Jibon<span className="text-red-600">Daak</span>
                </h1>
                <p className="text-xs text-red-500">Driver Portal</p>
              </div>
            </div>
          </div>

          {/* Provider Info */}
          <div className="p-6 border-b border-red-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-50 p-3 rounded-full border border-red-200">
                <Building className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{provider?.companyName || 'Driver'}</p>
                <p className="text-xs text-slate-500 truncate">{provider?.email || ''}</p>
              </div>
            </div>

            {/* Online/Offline Toggle */}
            <button
              onClick={onToggleStatus}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all font-medium
                ${isOnline 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                }
              `}
            >
              <span className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                {isOnline ? 'Online' : 'Offline'}
              </span>
              <span className="text-xs">Click to toggle</span>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const isActive = pathname === item.path;
                return (
                  <li key={index}>
                    <button
                      onClick={() => {
                        router.push(item.path);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                        ${isActive 
                          ? 'bg-red-600 text-white shadow-lg' 
                          : 'text-slate-700 hover:bg-red-50 hover:text-red-700'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-red-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all border border-red-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
