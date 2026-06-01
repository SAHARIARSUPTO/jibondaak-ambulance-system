"use client";

import Link from "next/link";

export default function LoginIndexPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500 mb-3">
            JibonDaak Portal
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Log<span className="text-red-600"> in</span>
          </h1>
          <p className="mt-3 text-gray-600">
            Choose your account type and continue.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                Patient or general user
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                As a seeker
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                For emergency ambulance booking and tracking.
              </p>
            </div>
            <Link
              href="/login/seeker"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-red-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-red-100 transition hover:bg-red-700"
            >
              Log in as seeker
            </Link>
            <p className="mt-4 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/register/seeker"
                className="text-red-600 hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                Ambulance owner or driver
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                As a provider
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                For managing trips and tracking earnings.
              </p>
            </div>
            <Link
              href="/login/provider"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-gray-200 transition hover:bg-gray-800"
            >
              Log in as provider
            </Link>
            <p className="mt-4 text-center text-sm text-gray-500">
              Want to become a partner?{" "}
              <Link
                href="/register/provider"
                className="text-gray-900 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
