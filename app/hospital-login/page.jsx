"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Lock, User } from "lucide-react";

export default function HospitalLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/hospitals/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { success: false, error: await res.text() };

      if (res.ok && data.success && data.hospital) {
        localStorage.setItem("hospitalUserId", data.hospital._id);
        localStorage.setItem("hospitalName", data.hospital.name || "");
        router.push("/hospital-dashboard");
        return;
      }

      setError(data.error || "Login failed");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl items-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden flex-col justify-between gap-10 bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.12),_transparent_45%),linear-gradient(135deg,rgba(255,255,255,1),rgba(255,247,247,1))] p-10 lg:flex">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-red-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-700 shadow-sm">
                <Building2 className="h-4 w-4" /> Hospital Portal
              </div>
              <h1 className="mt-8 max-w-md text-4xl font-black tracking-tight text-slate-950">
                Sign in to manage beds, ICU capacity, and incoming emergency requests.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600">
                Use your hospital credentials to open the dashboard and keep your profile up to date.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-red-100 bg-white p-6 text-sm text-slate-600 shadow-sm">
              <p className="font-semibold text-slate-900">New hospital?</p>
              <p className="mt-2">
                Create an account first, then come back here to access the dashboard.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 text-slate-900 sm:p-8 lg:p-10">
            <form
              onSubmit={handleLogin}
              className="mx-auto flex w-full max-w-md flex-col gap-6"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
                  Hospital Login
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter your hospital username and password to continue.
                </p>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Demo Credentials</p>
                <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-slate-200">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Username</p>
                    <p className="text-sm font-bold text-slate-900">hospital</p>
                  </div>
                  <button
                    onClick={() => {
                      setUsername("hospital");
                      setPassword("demo123");
                    }}
                    className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Fill
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-slate-200">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Password</p>
                    <p className="text-sm font-bold text-slate-900">demo123</p>
                  </div>
                </div>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Username</span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-red-500 focus-within:bg-white">
                  <User className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="hospital-admin"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Password</span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-red-500 focus-within:bg-white">
                  <Lock className="h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition-transform hover:-translate-y-0.5"
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                <span>Need a hospital account?</span>
                <Link
                  href="/hospital-register"
                  className="font-semibold text-red-600 hover:text-red-700"
                >
                  Register here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
