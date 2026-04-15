"use client";

<<<<<<< HEAD
import Link from "next/link";
=======
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserPlus, Mail, Lock, User, Phone, Ambulance, ChevronDown, Building } from 'lucide-react';
import Link from 'next/link';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState('user');
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    licenseNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'provider') {
      setUserType('provider');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          userType,
          companyName: userType === 'provider' ? formData.companyName : undefined,
          licenseNumber: userType === 'provider' ? formData.licenseNumber : undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54

export default function RegisterIndexPage() {
  return (
<<<<<<< HEAD
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
              <Link href="/login/seeker" className="text-red-600 hover:underline">
                Sign in
=======
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-full border border-blue-400/30">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-blue-200">
            Join JibonDaak to access emergency ambulance services
          </p>
        </div>

        {success && (
          <div className="bg-green-900/30 border-2 border-green-500 text-green-300 p-4 rounded-lg text-center">
            <p className="font-bold">Registration Successful!</p>
            <p className="text-sm">Redirecting to login...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border-2 border-red-500 text-red-300 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6 bg-slate-900 p-8 rounded-xl shadow-lg border-2 border-blue-500/30" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">
              Register As
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

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-blue-300 mb-2">
                {userType === 'provider' ? 'Contact Person Name' : 'Full Name'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-blue-500/30 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {userType === 'provider' && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-blue-300 mb-2">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-blue-500/30 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800"
                    placeholder="Enter company name"
                  />
                </div>
              </div>
            )}

            {userType === 'provider' && (
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-blue-300 mb-2">
                  License Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Ambulance className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-blue-500/30 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800"
                    placeholder="Enter license number"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-blue-500/30 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-blue-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-blue-500/30 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-blue-500/30 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800"
                  placeholder="Enter password (min 6 characters)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-blue-500/30 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="group relative w-full flex justify-center py-3 px-4 border border-blue-400/30 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {loading ? 'Creating Account...' : `Create ${userType === 'provider' ? 'Provider' : 'User'} Account`}
          </button>

          <div className="text-center">
            <p className="text-sm text-blue-200">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
                Sign in here
>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54
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
              <Link href="/login/provider" className="text-gray-900 hover:underline">
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
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-blue-300">Loading...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
