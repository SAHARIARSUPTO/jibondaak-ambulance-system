"use client";
import React from "react";

export default function AboutPage() {
  // Functional Handlers
  const makeEmergencyCall = () => {
    window.location.href = "tel:999";
  };

  const openPartnerPortal = () => {
    // Replace with your actual registration route or external link
    window.location.href = "/";
  };

  const scrollToCoreValues = () => {
    const section = document.getElementById("values-section");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="bg-white text-[#1a1a1a] font-sans antialiased selection:bg-red-600 selection:text-white">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-12 bg-red-600"></span>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">
                স্থাপিত ২০২৬
              </span>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl lg:text-8xl mb-10 leading-[0.95]">
              জরুরি মুহূর্তে <br />
              <span className="text-red-600 italic">নির্ভরযোগ্য</span> নাম।
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed mb-12">
              জীবনডাক প্রযুক্তিনির্ভর একটি রেসপন্স নেটওয়ার্ক। আমাদের লক্ষ্য
              সাধারণ মানুষের জন্য জরুরি অ্যাম্বুলেন্স সেবা সহজলভ্য ও স্বচ্ছ করা।
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={makeEmergencyCall}
                className="bg-red-600 text-white px-10 py-5 text-lg font-bold hover:bg-black transition-colors duration-300"
              >
                জরুরি প্রয়োজনে কল করুন
              </button>
              <button
                onClick={scrollToCoreValues}
                className="bg-white text-black border-2 border-black px-10 py-5 text-lg font-bold hover:bg-slate-50 transition-colors"
              >
                আমাদের লক্ষ্য জানুন
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- REPLACED SECTION: OPERATIONAL STRENGTH (No Icons) --- */}
      <section className="py-24 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <h2 className="text-4xl font-black text-slate-900 leading-tight">
                কেন আমরা <br /> অন্যদের চেয়ে আলাদা
              </h2>
              <div className="mt-6 h-1 w-20 bg-black"></div>
            </div>

            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-12 gap-y-16">
              {[
                {
                  id: "০১",
                  title: "সরাসরি যোগাযোগ ব্যবস্থা",
                  desc: "মাঝখানে কোনো দালালি বা মধ্যস্বত্বভোগী নেই। আপনি সরাসরি চালকের সাথে কথা বলে ভাড়া নির্ধারণ করতে পারেন।",
                },
                {
                  id: "০২",
                  title: "স্মার্ট রাউটিং সিস্টেম",
                  desc: "আমাদের প্রযুক্তি আপনার লোকেশন অনুযায়ী সবচেয়ে কাছে থাকা গাড়িটিকে ম্যাপে খুঁজে বের করে।",
                },
                {
                  id: "০৩",
                  title: "যাচাইকৃত চালক ও গাড়ি",
                  desc: "আমাদের নেটওয়ার্কের প্রতিটি গাড়ি এবং চালকের কাগজপত্র কঠোরভাবে যাচাই করা হয়।",
                },
                {
                  id: "০৪",
                  title: "দেশব্যাপী বিস্তৃত সেবা",
                  desc: "ঢাকা থেকে শুরু করে প্রত্যন্ত গ্রাম—বাংলাদেশের ৬৪টি জেলাতেই আমাদের নেটওয়ার্ক সক্রিয়।",
                },
              ].map((item) => (
                <div key={item.id} className="border-t border-slate-200 pt-6">
                  <span className="text-red-600 font-black text-lg block mb-4">
                    {item.id}
                  </span>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- MISSION & VISION (Structural Typography) --- */}
      <section id="values-section" className="py-24 bg-[#f8f8f8]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-1px bg-slate-200 border border-slate-200">
            {[
              {
                label: "লক্ষ্য (Mission)",
                text: "প্রযুক্তির ব্যবহারের মাধ্যমে দেশের প্রতিটি মানুষের জন্য দ্রুততম সময়ে অ্যাম্বুলেন্স সেবা নিশ্চিত করা।",
              },
              {
                label: "ভিশন (Vision)",
                text: "একটি আধুনিক বাংলাদেশ গড়া যেখানে চিকিৎসা সেবা পৌঁছানোর অপেক্ষায় কোনো প্রাণ অকালে ঝরবে না।",
              },
              {
                label: "মূলবোধ (Values)",
                text: "স্বচ্ছতা, গতি এবং দায়বদ্ধতা—জীবনডাকের প্রতিটি সেবায় এই তিনটি বিষয় অপরিবর্তনীয়।",
              },
            ].map((value, i) => (
              <div
                key={i}
                className="bg-[#f8f8f8] p-12 hover:bg-white transition-colors duration-500"
              >
                <p className="text-xs font-black uppercase tracking-widest text-red-600 mb-6">
                  {value.label}
                </p>
                <p className="text-2xl font-bold text-slate-900 leading-snug">
                  "{value.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS SECTION (Clean Grid) --- */}
      <section className="py-20 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { val: "৬৪", unit: "জেলা", label: "কভারেজ" },
              { val: "৫০০+", unit: "গাড়ি", label: "সক্রিয় নেটওয়ার্ক" },
              { val: "৯০", unit: "সেকেন্ড", label: "গড় রেসপন্স" },
              { val: "১৫কে+", unit: "সফল", label: "ট্রিপ পূর্ণ" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-slate-900">
                  {stat.val}
                  <span className="text-red-600 text-2xl ml-1">
                    {stat.unit}
                  </span>
                </div>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ACTION SECTION --- */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="bg-black text-white p-12 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                আমাদের সাথে যোগ দিন
              </h2>
              <p className="text-slate-400 text-lg">
                আপনি যদি একজন অ্যাম্বুলেন্স মালিক বা চালক হয়ে থাকেন, তবে আজই
                আমাদের ভেরিফাইড পার্টনার হিসেবে রেজিস্ট্রেশন করুন।
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <button
                onClick={openPartnerPortal}
                className="bg-white text-black px-10 py-5 text-lg font-bold hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                পার্টনার রেজিস্ট্রেশন
              </button>
              <button
                onClick={makeEmergencyCall}
                className="border-2 border-white/20 text-white px-10 py-5 text-lg font-bold hover:bg-white hover:text-black transition-all"
              >
                সহযোগিতার জন্য কল
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER (Minimal) --- */}
      <footer className="py-12 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm">
            © ২০২৪ জীবনডাক। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex gap-8 text-sm font-bold text-slate-900 uppercase tracking-widest">
            <a href="#" className="hover:text-red-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-red-600 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-red-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
