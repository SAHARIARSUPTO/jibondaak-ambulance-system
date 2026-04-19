"use client";
import { Suspense } from "react";
import Link from "next/link";

function RegisterForm() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500 mb-3">
            choose your portal
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Create Your Jibon<span className="text-red-600">Daak</span> Account
          </h1>
          <p className="mt-3 text-gray-600">
            Pick the account type that matches your role.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                For Patients
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                Ambulance Seeker
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Request emergency help and track your pickup in real time.
              </p>
            </div>
            <Link
              href="/register/seeker"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-red-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-red-100 transition hover:bg-red-700"
            >
              Create Seeker Account
            </Link>
            <p className="mt-4 text-center text-sm text-gray-500">
              Already registered?{" "}
              <Link
                href="/login/seeker"
                className="text-red-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                For Providers
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                Service Provider
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Register your team, fleet, and dispatch operators.
              </p>
            </div>
            <Link
              href="/register/provider"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-gray-200 transition hover:bg-gray-800"
            >
              Create Provider Account
            </Link>
            <p className="mt-4 text-center text-sm text-gray-500">
              Already registered?{" "}
              <Link
                href="/login/provider"
                className="text-gray-900 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-blue-300">Loading...</p>
          </div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
