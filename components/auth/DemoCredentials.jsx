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

export default function DemoCredentials({ onFillCredentials }) {
  const [copiedStates, setCopiedStates] = useState({});

  const handleCopy = (email, password, index) => {
    const text = `Email: ${email}\nPassword: ${password}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [index]: false }));
      }, 2000);
    });
  };

  const handleOneClickFill = (email, password, index) => {
    if (onFillCredentials) {
      onFillCredentials(email, password);
    } else {
      // Fallback: copy to clipboard
      handleCopy(email, password, index);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Demo Credentials</h3>
            <p className="text-sm text-slate-500">Test accounts for development and testing</p>
          </div>
        </div>

        <div className="space-y-3">
          {demoCredentials.map((cred, index) => {
            const Icon = cred.icon;
            const colors = colorClasses[cred.color];

            return (
              <div
                key={index}
                className={`rounded-2xl border ${colors.border} ${colors.bg} p-4 transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm">{cred.role}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase w-12">Email</span>
                          <code className="text-xs font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                            {cred.email}
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase w-12">Pass</span>
                          <code className="text-xs font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                            {cred.password}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleOneClickFill(cred.email, cred.password, index)}
                      className={`px-3 py-2 ${colors.button} text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5`}
                    >
                      {copiedStates[index] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Filled
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          {onFillCredentials ? "Fill" : "Copy"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center font-bold">
            🔒 These are demo accounts for testing purposes only
          </p>
        </div>
      </div>
    </div>
  );
}
