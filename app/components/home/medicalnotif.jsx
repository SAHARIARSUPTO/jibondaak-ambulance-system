"use client";
import React from "react";
import {
  Hospital,
  Activity,
  Radio,
  BaggageClaim,
  Stethoscope,
  Timer,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";

const MedicalNetworkSection = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-[1.15]">
            The hospital is ready <br />
            <span className="text-red-600">before the ambulance arrives</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            We do more than transport patients. We have built a digital network.
            As soon as you make a booking, the destination hospital's emergency
            department receives updates about the patient's condition.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Steps with Connected Line */}
          <div className="lg:col-span-7 space-y-12 relative">
            {/* The Connecting Line (Vertical) */}
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-100 hidden md:block" />

            {/* Step 1 */}
            <div className="flex gap-6 relative group">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-red-600 text-white flex items-center justify-center z-10 shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
                <Radio className="w-7 h-7 animate-pulse" />
              </div>
              <div className="pt-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Instant triage report
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  As soon as the patient enters the ambulance, paramedics update
                  the patient's vitals (BP, pulse) through the digital app.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 relative group">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-slate-900 text-white flex items-center justify-center z-10 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                <Hospital className="w-7 h-7" />
              </div>
              <div className="pt-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Pre-arrival notification
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  A "Patient Incoming" alert is sent to the hospital emergency
                  dashboard. Doctors can see the ambulance live on the map.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 relative group">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-green-600 text-white flex items-center justify-center z-10 shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                <BaggageClaim className="w-7 h-7" />
              </div>
              <div className="pt-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Zero waiting time
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Before the patient arrives, the emergency bed, oxygen, and
                  necessary investigation team are already prepared.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Visual Dashboard Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 relative">
              {/* Mock Dashboard UI */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      ER Dashboard
                    </span>
                  </div>
                  <Timer className="w-5 h-5 text-slate-400" />
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-red-600 uppercase">
                        Incoming emergency
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        3.5 km away
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          Oxygen support required
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Driver: MD. Karim (verified)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Stethoscope className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">
                        ICU Bed #04 Reserved
                      </span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                </div>
              </div>

              {/* Decorative Background Elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-600/5 rounded-full blur-3xl" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl" />
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Smart gateway",
              icon: <ShieldAlert className="w-5 h-5" />,
            },
            {
              label: "Digital report",
              icon: <Activity className="w-5 h-5" />,
            },
            { label: "Live connectivity", icon: <Radio className="w-5 h-5" /> },
            {
              label: "Advance preparation",
              icon: <Hospital className="w-5 h-5" />,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-3 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-red-100 hover:bg-white transition-all"
            >
              <div className="text-red-600">{item.icon}</div>
              <span className="text-sm font-bold text-slate-800">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MedicalNetworkSection;
