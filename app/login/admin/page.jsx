"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const role = "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("adminUser", JSON.stringify(data.user));
        }
        router.push("/admin");
      } else {
        // Handle 403 role mismatch errors with helpful message
        if (data.correctLoginPath) {
          setError(
            <div className="space-y-2">
              <p>{data.error}</p>
              <Link
                href={data.correctLoginPath}
                className="inline-block text-red-600 hover:underline font-bold"
              >
                Go to correct login page →
              </Link>
            </div>
          );
        } else {
          setError(data.error || "Login failed. Please try again.");
        }
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 p-4 md:p-6">
      <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 mb-2">
            Admin Login
          </h1>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tighter">
            জীবন<span className="text-red-600">ডাক</span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm">
            Log in to manage the platform.
          </p>
        </div>

        {error && (
          <div className="mb-6 text-red-600 text-sm font-medium text-center bg-red-50 py-3 rounded-2xl border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Demo Credentials</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-slate-200">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                <p className="text-sm font-bold text-slate-900">admin@jibondaak.com</p>
              </div>
              <button
                onClick={() => {
                  setEmail("admin@jibondaak.com");
                  setPassword("admin123");
                }}
                className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Fill
              </button>
            </div>
            <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-slate-200">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Password</p>
                <p className="text-sm font-bold text-slate-900">admin123</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@jibondaak.com"
              className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 placeholder-slate-400 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 placeholder-slate-400 pr-10 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-900 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl hover:bg-slate-800 transition-all font-bold text-base shadow-lg shadow-slate-200 disabled:bg-slate-200 disabled:cursor-not-allowed active:scale-[0.98]"
          >
              {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-slate-600 text-sm">
          <Link
            href="/login/seeker"
            className="text-red-600 font-medium hover:underline"
          >
              Go to seeker login
          </Link>
        </div>

        <div className="mt-4 text-center text-xs text-slate-500">
          <Link href="/login/provider" className="text-slate-900 hover:underline">
              Go to provider login
          </Link>
        </div>
      </div>
    </div>
  );
}
