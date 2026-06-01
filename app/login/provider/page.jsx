"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProviderLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const role = "provider";

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
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        router.push("/driver-dashboard");
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white p-4 md:p-6">
      <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] border border-gray-100 animate-text-reveal">
        <div className="text-center mb-8">
          <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600 mb-2">
            Ambulance Provider Login
          </h1>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tighter">
            জীবন<span className="text-red-600">ডাক</span>
          </h2>
          <p className="mt-3 text-gray-500 text-sm">
            Log in to manage your ambulance and services.
          </p>
        </div>

        {error && (
          <div className="mb-6 text-red-600 text-sm font-medium text-center bg-red-50 py-3 rounded-2xl border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Example: provider@email.com"
              className="w-full px-4 py-3 bg-gray-50 text-gray-800 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 placeholder-gray-400 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-50 text-gray-800 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 placeholder-gray-400 pr-10 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-900 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-gray-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              className="text-gray-700 hover:underline text-sm font-medium"
            >
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl hover:bg-gray-800 transition-all font-bold text-base shadow-lg shadow-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed active:scale-[0.98]"
          >
              {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
            Don't have a provider account?{" "}
          <Link
            href="/register/provider"
            className="text-gray-900 font-medium hover:underline"
          >
              Register
          </Link>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
            Looking for ambulance service?{" "}
          <Link href="/login/seeker" className="text-red-600 hover:underline">
              Go to seeker login
          </Link>
        </div>
      </div>
    </div>
  );
}
