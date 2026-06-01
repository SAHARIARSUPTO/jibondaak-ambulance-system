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
                Founded 2026
              </span>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl lg:text-8xl mb-10 leading-[0.95]">
              A <span className="text-red-600 italic">trusted</span> name <br />
              in emergencies.
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed mb-12">
              JibonDaak is a technology-driven response network. Our goal is to
              make emergency ambulance service accessible and transparent for
              everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={makeEmergencyCall}
                className="bg-red-600 text-white px-10 py-5 text-lg font-bold hover:bg-black transition-colors duration-300"
              >
                Call for Emergency
              </button>
              <button
                onClick={scrollToCoreValues}
                className="bg-white text-black border-2 border-black px-10 py-5 text-lg font-bold hover:bg-slate-50 transition-colors"
              >
                Learn Our Mission
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
                Why We Are <br /> Different
              </h2>
              <div className="mt-6 h-1 w-20 bg-black"></div>
            </div>

            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-12 gap-y-16">
              {[
                {
                  id: "০১",
                  title: "Direct Communication",
                  desc: "No middlemen or brokers. You can speak directly with the driver and set the fare yourself.",
                },
                {
                  id: "০২",
                  title: "Smart Routing System",
                  desc: "Our technology finds the nearest ambulance on the map based on your location.",
                },
                {
                  id: "০৩",
                  title: "Verified Drivers and Vehicles",
                  desc: "Every vehicle and driver in our network is thoroughly verified.",
                },
                {
                  id: "০৪",
                  title: "Nationwide Coverage",
                  desc: "From Dhaka to remote villages, our network is active across all 64 districts of Bangladesh.",
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
                label: "Mission",
                text: "Use technology to ensure the fastest possible ambulance service for every person in the country.",
              },
              {
                label: "Vision",
                text: "Build a modern Bangladesh where no life is lost while waiting for medical care to arrive.",
              },
              {
                label: "Values",
                text: "Transparency, speed, and accountability are non-negotiable in every JibonDaak service.",
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
              { val: "64", unit: "districts", label: "Coverage" },
              { val: "500+", unit: "vehicles", label: "Active network" },
              { val: "90", unit: "seconds", label: "Average response" },
              { val: "15k+", unit: "successful", label: "Trips completed" },
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
                Join Us
              </h2>
              <p className="text-slate-400 text-lg">
                If you own an ambulance or are a driver, register today as a
                verified partner.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <button
                onClick={openPartnerPortal}
                className="bg-white text-black px-10 py-5 text-lg font-bold hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                Partner Registration
              </button>
              <button
                onClick={makeEmergencyCall}
                className="border-2 border-white/20 text-white px-10 py-5 text-lg font-bold hover:bg-white hover:text-black transition-all"
              >
                Call for Support
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
