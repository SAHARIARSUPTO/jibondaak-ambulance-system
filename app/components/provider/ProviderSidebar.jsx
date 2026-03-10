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
  Activity,
  BarChart3,
  FileText,
  Users
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
    { icon: Home, label: 'Dashboard', path: '/provider-dashboard' },
    { icon: Bell, label: 'Emergency Requests', path: '/provider-dashboard/emergency' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-slate-900 rounded-xl border border-blue-500/30 text-white hover:bg-slate-800 transition"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-slate-900 border-r border-blue-500/30 z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-72
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-blue-500/30">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
                <Ambulance className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Jibon<span className="text-blue-400">Daak</span>
                </h1>
                <p className="text-xs text-blue-300">Provider Portal</p>
              </div>
            </div>
          </div>

          {/* Provider Info */}
          <div className="p-6 border-b border-blue-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-3 rounded-full border border-blue-500/30">
                <Building className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{provider?.companyName || 'Provider'}</p>
                <p className="text-xs text-blue-300 truncate">{provider?.email || ''}</p>
              </div>
            </div>

            {/* Online/Offline Toggle */}
            <button
              onClick={onToggleStatus}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all font-medium
                ${isOnline 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                }
              `}
            >
              <span className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
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
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                          : 'text-blue-200 hover:bg-slate-800 hover:text-white'
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
          <div className="p-4 border-t border-blue-500/30">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all border border-red-500/30"
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
