"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SeekerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const role = "seeker";

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
        router.push("/dashboard");
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
          <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 mb-2">
            Seeker Login
          </h1>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tighter">
            জীবন<span className="text-red-600">ডাক</span>
          </h2>
          <p className="mt-3 text-gray-500 text-sm">
            Log in for emergency ambulance service or assistance.
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
              placeholder="Example: user@email.com"
              className="w-full px-4 py-3 bg-gray-50 text-gray-800 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400 transition-all outline-none"
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
                className="w-full px-4 py-3 bg-gray-50 text-gray-800 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400 pr-10 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-600 text-sm"
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
                className="h-4 w-4 text-[#DC2626] focus:ring-[#DC2626] border-red-300 rounded"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              className="text-[#DC2626] hover:underline text-sm font-medium"
            >
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-4 rounded-2xl hover:bg-red-700 transition-all font-bold text-base shadow-lg shadow-red-100 disabled:bg-gray-200 disabled:cursor-not-allowed active:scale-[0.98]"
          >
              {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
          <Link
            href="/register/seeker"
            className="text-[#DC2626] font-medium hover:underline"
          >
              Register
          </Link>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
            Are you an ambulance provider?{" "}
          <Link
            href="/login/provider"
            className="text-gray-900 hover:underline"
          >
              Go to provider login
          </Link>
        </div>
      </div>
    </div>
  );
}
