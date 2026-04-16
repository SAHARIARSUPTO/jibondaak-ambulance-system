"use client";

import Link from "next/link";

export default function LoginIndexPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500 mb-3">
            জীবনডাক পোর্টাল
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            লগইন<span className="text-red-600"> করুন</span>
          </h1>
          <p className="mt-3 text-gray-600">
            আপনার অ্যাকাউন্টের ধরন বেছে নিন এবং এগিয়ে যান
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                রোগী বা সাধারণ ইউজার
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                সেবাগ্রহীতা হিসেবে
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                জরুরি অ্যাম্বুলেন্স বুকিং এবং ট্র্যাকিং করার জন্য
              </p>
            </div>
            <Link
              href="/login/seeker"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-red-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-red-100 transition hover:bg-red-700"
            >
              সিকার হিসেবে লগইন
            </Link>
            <p className="mt-4 text-center text-sm text-gray-500">
              অ্যাকাউন্ট নেই?{" "}
              <Link
                href="/register/seeker"
                className="text-red-600 hover:underline"
              >
                এখনি তৈরি করুন
              </Link>
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                অ্যাম্বুলেন্স মালিক বা চালক
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                সেবাদাতা হিসেবে
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                আপনার ট্রিপ ম্যানেজ এবং আয় ট্র্যাক করার জন্য
              </p>
            </div>
            <Link
              href="/login/provider"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-gray-200 transition hover:bg-gray-800"
            >
              প্রোভাইডার হিসেবে লগইন
            </Link>
            <p className="mt-4 text-center text-sm text-gray-500">
              পার্টনার হতে চান?{" "}
              <Link
                href="/register/provider"
                className="text-gray-900 hover:underline"
              >
                নিবন্ধন করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
