"use client";

import { useState } from "react";
import { Copy, Check, User, Ambulance, Building2, Shield } from "lucide-react";

const demoCredentials = [
  {
    role: "Ambulance Provider",
    icon: Ambulance,
    email: "provider@demo.com",
    password: "demo123",
    color: "gray",
  },
  {
    role: "User/Patient",
    icon: User,
    email: "user@demo.com",
    password: "demo123",
    color: "red",
  },
  {
    role: "Hospital Admin",
    icon: Building2,
    email: "hospital@demo.com",
    password: "demo123",
    color: "blue",
  },
];

const colorClasses = {
  gray: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    icon: "text-gray-600",
    button: "bg-gray-900 hover:bg-gray-800",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-600",
    button: "bg-red-600 hover:bg-red-700",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
  },
};

export default function DemoCredentialsInline({ onFillCredentials }) {
  const [filledIndex, setFilledIndex] = useState(null);

  const handleFill = (email, password, index) => {
    if (onFillCredentials) {
      onFillCredentials(email, password);
      setFilledIndex(index);
      setTimeout(() => setFilledIndex(null), 2000);
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-amber-600" />
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Demo Credentials
        </p>
      </div>
      
      <div className="grid gap-2">
        {demoCredentials.map((cred, index) => {
          const Icon = cred.icon;
          const colors = colorClasses[cred.color];
          const isFilled = filledIndex === index;

          return (
            <div
              key={index}
              className={`flex items-center justify-between gap-3 rounded-xl border ${colors.border} ${colors.bg} px-3 py-2 transition-all hover:shadow-sm`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Icon className={`w-4 h-4 ${colors.icon} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate">{cred.role}</p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">
                    {cred.email} | {cred.password}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleFill(cred.email, cred.password, index)}
                className={`px-3 py-1.5 ${colors.button} text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 flex-shrink-0`}
              >
                {isFilled ? (
                  <>
                    <Check className="w-3 h-3" />
                    Filled
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Fill
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
      
      <p className="mt-3 text-[10px] text-slate-400 text-center font-bold">
        Click "Fill" to auto-populate the form
      </p>
    </div>
  );
}
