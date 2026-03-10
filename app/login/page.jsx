"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Ambulance, ChevronDown } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("user"); // user or provider
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Trim whitespace from email and password
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    console.log('🔐 Login attempt:', { email: trimmedEmail, userType });

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      console.log('📡 Sending login request...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: trimmedEmail, 
          password: trimmedPassword, 
          userType 
        })
      });

      console.log('📥 Response status:', response.status);
      
      // Check if response is ok
      if (!response.ok && response.status !== 401 && response.status !== 400) {
        setError('Server error. Please try again later.');
        setLoading(false);
        return;
      }

      // Get response text first
      const text = await response.text();
      console.log('� Response text length:', text.length);

      // Check if response is empty
      if (!text || text.trim() === '') {
        console.error('❌ Empty response from server');
        setError('Server returned empty response. Please try again.');
        setLoading(false);
        return;
      }

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(text);
        console.log('📦 Response data:', data);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('Response text:', text);
        setError('Invalid response from server. Please try again.');
        setLoading(false);
        return;
      }

      if (data.success) {
        console.log('✅ Login successful, redirecting...');
        // Store user data in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Redirect based on user type
        if (data.user.role === 'provider') {
          console.log('🚑 Redirecting to provider dashboard');
          router.push('/provider-dashboard');
        } else {
          console.log('👤 Redirecting to user dashboard');
          router.push('/dashboard');
        }
      } else {
        console.error('❌ Login failed:', data.error);
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 p-6">
      <div className="w-full max-w-md p-8 bg-slate-900 shadow-2xl rounded-2xl border-2 border-blue-500/30">
        <h2 className="text-3xl font-bold mb-2 text-center">
          <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Welcome to<br />Jibon<span className="text-blue-400">Daak</span> 
          </span>
        </h2>
        <p className="text-center text-blue-200 mb-6 text-sm">
          Please log in to your account
        </p>

        {/* User Type Selector Dropdown */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-blue-300">
            Login As
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full px-4 py-3 bg-slate-800 text-white border-2 border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition flex items-center justify-between hover:bg-slate-700"
            >
              <div className="flex items-center gap-3">
                {userType === "user" ? (
                  <>
                    <User className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">User / Patient</span>
                  </>
                ) : (
                  <>
                    <Ambulance className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">Ambulance Service Provider</span>
                  </>
                )}
              </div>
              <ChevronDown className={`w-5 h-5 text-blue-300 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-slate-800 border-2 border-blue-500/30 rounded-lg shadow-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setUserType("user");
                    setShowDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                    userType === "user" 
                      ? "bg-blue-900/50 text-blue-300 font-semibold" 
                      : "hover:bg-slate-700 text-white"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <div>
                    <p className="font-medium">User / Patient</p>
                    <p className="text-xs text-blue-200">Book ambulance services</p>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setUserType("provider");
                    setShowDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-t border-slate-700 ${
                    userType === "provider" 
                      ? "bg-blue-900/50 text-blue-300 font-semibold" 
                      : "hover:bg-slate-700 text-white"
                  }`}
                >
                  <Ambulance className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Ambulance Service Provider</p>
                    <p className="text-xs text-blue-200">Manage ambulance services</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-xs text-blue-300 font-semibold mb-2">🧪 Demo Credentials:</p>
          {userType === "user" ? (
            <div className="text-xs text-blue-200 space-y-1">
              <p>Email: <span className="font-mono text-blue-400">user@demo.com</span></p>
              <p>Password: <span className="font-mono text-blue-400">demo123</span></p>
            </div>
          ) : (
            <div className="text-xs text-blue-200 space-y-1">
              <p>Email: <span className="font-mono text-blue-400">provider@demo.com</span></p>
              <p>Password: <span className="font-mono text-blue-400">demo123</span></p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 text-red-300 font-medium text-center bg-red-900/30 py-2 rounded-lg border border-red-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block mb-2 font-medium text-blue-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 bg-slate-800 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 transition"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-2 font-medium text-blue-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-2 bg-slate-800 text-white border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 pr-10 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-blue-200">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-500/30 rounded bg-slate-800"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2 rounded-lg transition font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/30"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-6 text-center text-blue-200 text-sm">
          Don't have an account?{" "}
          <Link 
            href={userType === "user" ? "/register" : "/register?type=provider"} 
            className="text-blue-400 font-medium hover:text-blue-300"
          >
            Sign Up as {userType === "user" ? "User" : "Provider"}
          </Link>
        </div>
      </div>
    </div>
  );
}
