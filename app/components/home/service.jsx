"use client";
import React from "react";
import {
  ShieldCheck,
  Stethoscope,
  PhoneCall,
  Clock,
  Map,
  CheckCircle2,
  Zap,
  Activity,
} from "lucide-react";

const ExpertiseSection = () => {
  const stats = [
    {
      label: "Active ambulances",
      value: "500+",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      label: "Average response time",
      value: "12 minutes",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: "Successful trips",
      value: "10,000+",
      icon: <ShieldCheck className="w-5 h-5" />,
    },
  ];

  const features = [
    {
      title: "Life support system",
      description:
        "Our ICU ambulances are equipped with modern ventilators and heart monitors.",
      icon: <Stethoscope className="w-6 h-6" />,
      tag: "Advanced",
    },
    {
      title: "Smart location tracking",
      description:
        "Real-time GPS technology helps us quickly find the nearest driver to you.",
      icon: <Map className="w-6 h-6" />,
      tag: "Precision",
    },
    {
      title: "Transparent fare policy",
      description:
        "No hidden costs. Speak directly with the driver and get service at a fair price.",
      icon: <Zap className="w-6 h-6" />,
      tag: "Transparent",
    },
  ];

  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top Header & Stats */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4" /> Why we are the best
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Reliability you can trust <br />
              <span className="text-red-600 underline decoration-red-200 underline-offset-8">
                right by your side
              </span>
            </h2>
            <p className="text-slate-600 text-lg max-w-lg leading-relaxed">
              Making the right decision in an emergency is the first step to
              saving a life. We provide modern and fast medical transport
              solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-red-600 mb-3">{stat.icon}</div>
                <div className="text-2xl font-black text-slate-900">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-red-200 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500">
                {React.cloneElement(feature.icon, { size: 120 })}
              </div>

              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors duration-300 shadow-lg shadow-slate-200">
                {feature.icon}
              </div>

              <div className="inline-block px-3 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase mb-4 tracking-widest">
                {feature.tag}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {feature.description}
              </p>

              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" /> Verified service
              </div>
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="mt-16 bg-slate-900 rounded-3xl p-1 md:p-2 overflow-hidden shadow-2xl">
          <div className="border border-white/10 rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                <PhoneCall className="text-white w-8 h-8" />
              </div>
              <div>
                <h4 className="text-white text-2xl font-bold">
                  Need direct support?
                </h4>
                <p className="text-slate-400">
                  Our customer support team is available 24/7 to help you.
                </p>
              </div>
            </div>
            <button className="bg-white hover:bg-red-600 hover:text-white text-slate-900 px-8 py-4 rounded-xl font-black text-lg transition-all transform active:scale-95 shadow-xl">
              Talk to Support Center
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
