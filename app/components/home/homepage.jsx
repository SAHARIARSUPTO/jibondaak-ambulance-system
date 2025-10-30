"use client";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            {/* Main Content */}
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Emergency Ambulance</span>
                    <span className="block text-red-600">Service</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
                    When every second counts, trust Jibon Daak for rapid and
                    reliable ambulance services. We are here for you 24/7.
                  </p>

                  {/* CTA Buttons */}
                  <div className="mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                    <Link
                      href="/book-ambulance"
                      className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 md:py-4 md:px-10 md:text-lg shadow-lg hover:shadow-xl"
                    >
                      Book Ambulance Now
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center px-8 py-3 border-2 border-red-600 text-base font-semibold rounded-lg text-red-600 bg-white hover:bg-red-50 transition-colors duration-200 md:py-4 md:px-10 md:text-lg mt-3 sm:mt-0"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                  <div className="relative w-full rounded-lg shadow-xl overflow-hidden">
                    <Image
                      className="w-full object-cover"
                      src="/ambulance-hero.jpg"
                      alt="Emergency Ambulance Service"
                      width={1000}
                      height={700}
                      priority
                    />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
