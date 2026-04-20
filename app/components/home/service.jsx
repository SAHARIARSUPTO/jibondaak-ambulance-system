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
      label: "সক্রিয় অ্যাম্বুলেন্স",
      value: "৫০০+",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      label: "গড় রেসপন্স টাইম",
      value: "১২ মিনিট",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: "সফল ট্রিপ",
      value: "১০,০০০+",
      icon: <ShieldCheck className="w-5 h-5" />,
    },
  ];

  const features = [
    {
      title: "লাইফ সাপোর্ট সিস্টেম",
      description:
        "আমাদের ICU অ্যাম্বুলেন্সগুলো আধুনিক ভেন্টিলেটর এবং হার্ট মনিটর দ্বারা সুসজ্জিত।",
      icon: <Stethoscope className="w-6 h-6" />,
      tag: "Advanced",
    },
    {
      title: "স্মার্ট লোকেশন ট্র্যাকিং",
      description:
        "রিয়েল-টাইম জিপিএস প্রযুক্তির মাধ্যমে আপনার নিকটস্থ চালককে দ্রুত খুঁজে বের করা হয়।",
      icon: <Map className="w-6 h-6" />,
      tag: "Precision",
    },
    {
      title: "স্বচ্ছ ভাড়া নীতি",
      description:
        "কোনো লুকানো খরচ নেই। সরাসরি চালকের সাথে কথা বলে সাশ্রয়ী মূল্যে সেবা নিশ্চিত করুন।",
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
              <ShieldCheck className="w-4 h-4" /> কেন আমরা সেরা
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              নির্ভযোগ্যতার সাথে <br />
              <span className="text-red-600 underline decoration-red-200 underline-offset-8">
                আপনার পাশে আছি
              </span>
            </h2>
            <p className="text-slate-600 text-lg max-w-lg leading-relaxed">
              জরুরি মুহূর্তে সঠিক সিদ্ধান্ত নেওয়াই জীবন বাঁচানোর প্রথম ধাপ। আমরা
              দিচ্ছি আধুনিক ও দ্রুততম মেডিকেল ট্রান্সপোর্ট সমাধান।
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
                <CheckCircle2 className="w-4 h-4" /> ভেরিফাইড সার্ভিস
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
                  সরাসরি সহায়তা প্রয়োজন?
                </h4>
                <p className="text-slate-400">
                  আমাদের কাস্টমার সাপোর্ট টিম ২৪/৭ আপনার সেবায় নিয়োজিত
                </p>
              </div>
            </div>
            <button className="bg-white hover:bg-red-600 hover:text-white text-slate-900 px-8 py-4 rounded-xl font-black text-lg transition-all transform active:scale-95 shadow-xl">
              সাপোর্ট সেন্টারে কথা বলুন
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
