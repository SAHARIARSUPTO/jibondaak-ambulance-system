"use client";
import { useState } from "react";
import Image from "next/image";
const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <main className="bg-white text-slate-900 font-sans selection:bg-red-100">
        {/* 1. HERO SECTION */}
        <section className="relative items-center justify-center border-b border-slate-100 pt-8 pb-20 md:pt-12 md:pb-32">
          <div className="absolute inset-0">
            <Image
              src="https://user-gen-media-assets.s3.amazonaws.com/seedream_images/2f58b4e4-da5f-43f2-8a90-0342697fe3b5.png"
              alt="Ambulance service Bangladesh"
              fill
              className="object-cover opacity-15"
              priority
            />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full text-red-600 text-sm font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              ২৪ ঘণ্টা জরুরি অ্যাম্বুলেন্স সেবা
            </div>

            <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
              জীবন বাঁচাতে সময়ের <br />
              <span className="text-red-600">মূল্য আমরা বুঝি</span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              আপনার প্রিয়জনের জরুরি প্রয়োজনে দ্রুত এবং বিশ্বস্ত অ্যাম্বুলেন্স
              খুঁজে পেতে আমরা আছি সবসময় আপনার পাশে।
            </p>

            <form className="max-w-2xl mx-auto mb-8">
              <div
                className={`flex flex-col sm:flex-row shadow-2xl rounded-2xl overflow-hidden border-2 transition-all ${isFocused ? "border-red-600 ring-4 ring-red-50" : "border-slate-200"}`}
              >
                <input
                  type="text"
                  placeholder="আপনার বর্তমান অবস্থান বা গ্রাম লিখুন..."
                  className="flex-1 px-6 py-5 text-xl outline-none"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 text-xl font-bold transition-colors">
                  খুঁজুন
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              সারাদেশে ১,২০০+ অ্যাম্বুলেন্স যুক্ত আছে
            </div>
          </div>
        </section>

        {/* 2. WHAT WE DO & PROCESS */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                আমরা যেভাবে কাজ করি
              </h2>
              <div className="h-1.5 w-24 bg-red-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4 p-6 hover:bg-slate-50 rounded-3xl transition-colors">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold">
                  ১
                </div>
                <h3 className="text-2xl font-bold">সহজ সার্চ</h3>
                <p className="text-slate-600 leading-relaxed">
                  আপনার লোকেশন লিখে সার্চ দিলেই আপনার সবচেয়ে কাছে থাকা
                  অ্যাম্বুলেন্সগুলোর তালিকা চলে আসবে।
                </p>
              </div>
              <div className="space-y-4 p-6 hover:bg-slate-50 rounded-3xl transition-colors">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold">
                  ২
                </div>
                <h3 className="text-2xl font-bold">সরাসরি যোগাযোগ</h3>
                <p className="text-slate-600 leading-relaxed">
                  মাঝখানে কোনো দালাল নেই। সরাসরি ড্রাইভারের সাথে কথা বলে ভাড়া
                  নির্ধারণ করুন ও কনফার্ম করুন।
                </p>
              </div>
              <div className="space-y-4 p-6 hover:bg-slate-50 rounded-3xl transition-colors">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold">
                  ৩
                </div>
                <h3 className="text-2xl font-bold">দ্রুত সেবা</h3>
                <p className="text-slate-600 leading-relaxed">
                  অ্যাম্বুলেন্সটি ম্যাপে ট্র্যাক করুন এবং কয়েক মিনিটের মধ্যেই
                  সেটি আপনার দরজায় পৌঁছে যাবে।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PROVIDER / DRIVER JOIN SECTION */}
        <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 z-10">
              <span className="text-red-500 font-bold tracking-widest uppercase text-sm">
                অ্যাম্বুলেন্স মালিক ও চালকদের জন্য
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
                আমাদের সাথে যোগ দিন, <br />
                অসহায় মানুষের পাশে দাঁড়ান
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                আপনার যদি একটি অ্যাম্বুলেন্স থাকে, তবে আজই প্রোভাইডার হিসেবে
                রেজিস্ট্রেশন করুন। আমরা আপনাকে সরাসরি রোগীদের সাথে সংযোগ করিয়ে
                দেব।
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "কোনো মাসিক চার্জ নেই",
                  "সরাসরি পেমেন্ট পান",
                  "সারাদেশে সেবা দেওয়ার সুযোগ",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="bg-green-500 rounded-full p-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-slate-200 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-500 hover:text-white transition-all transform hover:scale-105">
                ড্রাইভার হিসেবে যোগ দিন
              </button>
            </div>
            <div className="flex-1 relative">
              <div className="bg-gradient-to-tr from-red-600 to-orange-400 w-full aspect-square rounded-full opacity-20 blur-3xl absolute -right-20 -top-20"></div>
              <div className="border border-white/10 bg-white/5 p-6 rounded-3xl backdrop-blur-xl relative">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold">লাইভ ট্র্যাকিং ড্যাশবোর্ড</span>
                  <span className="bg-red-500 px-3 py-1 rounded-full text-xs">
                    LIVE
                  </span>
                </div>
                <iframe
                  title="OSM Live"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=90.320%2C23.690%2C90.470%2C23.800&amp;layer=mapnik"
                  className="w-full h-64 rounded-xl grayscale"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. FOOTER / CALL TO ACTION */}
        <footer className="py-12 border-t border-slate-100 bg-slate-50 text-center">
          <p className="text-slate-500 font-medium mb-4">জরুরি হেল্পলাইন</p>
          <a
            href="tel:999"
            className="text-5xl font-black text-red-600 hover:text-red-700 transition-colors"
          >
            ৯৯৯
          </a>
          <div className="mt-8 text-slate-400 text-sm">
            © ২০২৪ আপনার লাইফলাইন অ্যাম্বুলেন্স সেবা। সর্বস্বত্ব সংরক্ষিত।
          </div>
        </footer>
      </main>
    </>
  );
};

export default HomePage;
