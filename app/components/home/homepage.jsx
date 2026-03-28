"use client";
import Image from "next/image";
import AmbulanceFinder from "../AmbulanceFinder";

const HomePage = () => {
  return (
    <main className="bg-slate-950 text-slate-100">
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

          <AmbulanceFinder className="max-w-2xl mx-auto mb-12 md:mb-16 animate-fade-in-up-delayed-more" />

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
              Critical care available nationwide
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

      <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
          <div className="flex-1 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-red-300">
              Live Coverage
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              OpenStreetMap visibility for every dispatch zone.
            </h2>
            <p className="text-base text-slate-300 sm:text-lg">
              Track the nearest response units, identify clear routes, and share
              the fastest pickup point with our operators. The live map panel
              gives you confidence before the ambulance arrives.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Median Response", value: "9 min" },
                { label: "Coverage Points", value: "1,200+" },
                { label: "Active Units", value: "320" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              {["Geo-verified drivers", "Smart rerouting", "Village coverage"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-xs text-slate-300">
                <span className="uppercase tracking-[0.3em]">Dhaka Live Grid</span>
                <span className="rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-semibold text-red-200">
                  Active
                </span>
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  title="OpenStreetMap live coverage"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=90.320%2C23.690%2C90.470%2C23.800&amp;layer=mapnik"
                  className="h-80 w-full border-0 sm:h-96"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Powered by OpenStreetMap contributors</span>
                <a
                  href="https://www.openstreetmap.org"
                  className="text-red-300 hover:text-red-200"
                  rel="noreferrer"
                  target="_blank"
                >
                  Open full map
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
