"use client";
import Image from "next/image";
import React, { useState } from "react";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for ambulances near:", searchTerm);
    // Integrate with your backend/API here
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-900 via-gray-900 to-black">
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-red-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse-slower"></div>
      </div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://user-gen-media-assets.s3.amazonaws.com/seedream_images/2f58b4e4-da5f-43f2-8a90-0342697fe3b5.png"
          alt="Bangladeshi rural ambulance background"
          fill
          priority
          className="object-cover animate-fade-in opacity-40"
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/70 to-black/60 backdrop-blur-[2px]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs sm:text-sm font-medium mb-6 animate-fade-in-down backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Available 24/7 Nationwide
          </div>

          {/* Heading with Gradient */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight mb-6 tracking-tight animate-fade-in-up">
            <span className="text-white">Your Lifeline,</span>
            <br />
            <span className="bg-linear-to-r from-red-500 via-red-600 to-orange-500 bg-clip-text text-transparent animate-gradient bg-300% drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              Reaching Every Corner
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-10 md:mb-14 max-w-3xl mx-auto text-gray-300 leading-relaxed animate-fade-in-up-delayed">
            Connecting you to critical care, no matter where you are in
            Bangladesh.
          </p>

          {/* Search Form with Glow Effect */}
          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-12 md:mb-16 animate-fade-in-up-delayed-more"
          >
            <div
              className={`relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 bg-white/10 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border transition-all duration-300 ${
                isFocused
                  ? "border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]"
                  : "border-white/10 shadow-2xl"
              }`}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-linear-to-r from-red-600 to-orange-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-300"></div>

              <input
                type="text"
                placeholder="Enter your location or village name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="relative flex-1 px-5 sm:px-7 py-4 sm:py-5 rounded-xl sm:rounded-l-xl sm:rounded-r-none border-none outline-none text-white text-sm sm:text-base placeholder-gray-400 focus:placeholder-gray-500 transition-all duration-200 bg-white/5 backdrop-blur-sm"
                aria-label="Search for ambulances"
                required
              />
              <button
                type="submit"
                className="relative bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-95 text-white font-bold py-4 sm:py-5 px-7 sm:px-10 rounded-xl sm:rounded-r-xl sm:rounded-l-none shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2.5 whitespace-nowrap text-sm sm:text-base group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Find Ambulance</span>
              </button>
            </div>
          </form>

          {/* Emergency Contact */}
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 animate-fade-in-delayed">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-red-500/20 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400">Emergency Hotline</p>
                <p className="text-lg sm:text-xl font-bold text-white">999</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/10"></div>
            <p className="text-sm text-gray-300">
              🚨 Critical care available nationwide
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes pulseSlow {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.15;
          }
        }
        @keyframes pulseSlower {
          0%,
          100% {
            opacity: 0.08;
          }
          50% {
            opacity: 0.12;
          }
        }

        .bg-300% {
          background-size: 300%;
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        .animate-fade-in-up-delayed {
          animation: fadeInUp 1s ease-out forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }
        .animate-fade-in-up-delayed-more {
          animation: fadeInUp 1s ease-out forwards;
          animation-delay: 0.7s;
          opacity: 0;
        }
        .animate-fade-in-down {
          animation: fadeInDown 1s ease-out forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }
        .animate-fade-in-delayed {
          animation: fadeIn 1s ease-out forwards;
          animation-delay: 1s;
          opacity: 0;
        }
        .animate-fade-in-stagger {
          animation: fadeInUp 1s ease-out forwards;
          animation-delay: 0.9s;
          opacity: 0;
        }
        .animate-pulse-slow {
          animation: pulseSlow 8s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulseSlower 10s ease-in-out infinite;
        }

        .particle {
          position: absolute;
          background: radial-gradient(
            circle,
            rgba(239, 68, 68, 0.1) 0%,
            transparent 70%
          );
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        .particle-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        .particle-2 {
          width: 200px;
          height: 200px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }
        .particle-3 {
          width: 250px;
          height: 250px;
          bottom: 10%;
          left: 50%;
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default HomePage;
