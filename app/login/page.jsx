"use client";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    alert(`✅ Login Success!\nEmail: ${email}\nRemember Me: ${rememberMe}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F5] p-6">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl border border-red-200">
       <h2 className="text-3xl font-bold mb-4 text-center">
     <span className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
         <h1>welcome to</h1>Jibon<span className="text-red-600">Daak</span> 
         </span>
       </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Please log in to your account
        </p>

        {error && (
          <div className="mb-4 text-red-600 font-medium text-center bg-red-50 py-2 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 bg-[#FFF0F0] text-gray-800 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] placeholder-gray-400 transition"
            />
          </div>

          {/* Password Field */}
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
                className="w-full px-4 py-2 bg-[#FFF0F0] text-gray-800 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] placeholder-gray-400 pr-10 transition"
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

          {/* Remember Me + Forgot Password */}
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
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#DC2626] text-white py-2 rounded-lg hover:bg-[#B91C1C] transition font-semibold text-lg shadow-md"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <a href="#" className="text-[#DC2626] font-medium hover:underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
