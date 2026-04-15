"use client";

<<<<<<< HEAD
import Link from "next/link";
=======
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Ambulance, Shield, ChevronDown } from "lucide-react";

const userTypeOptions = [
  {
    id: "user",
    label: "User / Patient",
    description: "Book ambulance services",
    icon: User,
  },
  {
    id: "provider",
    label: "Ambulance Service Provider",
    description: "Manage ambulance services",
    icon: Ambulance,
  },
  {
    id: "admin",
    label: "Administrator",
    description: "Control & dispatch operations",
    icon: Shield,
  },
];

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("user"); // user, provider or admin
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedUserType =
    userTypeOptions.find((option) => option.id === userType) ?? userTypeOptions[0];
  const SelectedIcon = selectedUserType.icon;

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
        
        // Redirect based on user role
        if (data.user.role === 'provider') {
          console.log('🚑 Redirecting to provider dashboard');
          router.push('/provider-dashboard');
        } else if (data.user.role === 'admin') {
          console.log('🛡️ Redirecting to admin console');
          router.push('/admin');
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
>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54

export default function LoginIndexPage() {
  return (
<<<<<<< HEAD
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
=======
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
          <label className="block mb-2 font-medium text-blue-300">Login As</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full px-4 py-3 bg-slate-800 text-white border-2 border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition flex items-center justify-between hover:bg-slate-700"
            >
              <div className="flex items-center gap-3">
                <SelectedIcon className="w-5 h-5 text-blue-400" />
                <span className="font-medium">{selectedUserType.label}</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-blue-300 transition-transform ${showDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-slate-800 border-2 border-blue-500/30 rounded-lg shadow-xl overflow-hidden">
                {userTypeOptions.map((option, index) => {
                  const OptionIcon = option.icon;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setUserType(option.id);
                        setShowDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                        option.id === userType
                          ? "bg-blue-900/50 text-blue-300 font-semibold"
                          : "hover:bg-slate-700 text-white"
                      } ${index > 0 ? "border-t border-slate-700" : ""}`}
                    >
                      <OptionIcon className="w-5 h-5" />
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-xs text-blue-200">{option.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-xs text-blue-300 font-semibold mb-2">🧪 Demo Credentials:</p>
          {userType === "user" ? (
            <div className="text-xs text-blue-200 space-y-1">
              <p>
                Email: <span className="font-mono text-blue-400">user@demo.com</span>
              </p>
              <p>
                Password: <span className="font-mono text-blue-400">demo123</span>
              </p>
            </div>
          ) : userType === "provider" ? (
            <div className="text-xs text-blue-200 space-y-1">
              <p>
                Email: <span className="font-mono text-blue-400">provider@demo.com</span>
              </p>
              <p>
                Password: <span className="font-mono text-blue-400">demo123</span>
              </p>
            </div>
          ) : (
            <div className="text-xs text-blue-200">
              Admin accounts are provisioned via the operations database. Contact your team lead for credentials.
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
>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54
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

<<<<<<< HEAD
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
=======
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
>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54
        </div>
      </div>
    </div>
  );
}
