"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Building2, Lock, MapPin, Phone, User } from "lucide-react";

export default function HospitalRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
    beds: "0",
    icu: "0",
    emergency_services: "24/7 ambulance support",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/hospitals/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success || !data.hospital) {
        setError(data.error || "Registration failed");
        return;
      }

      localStorage.setItem("hospitalUserId", data.hospital._id);
      localStorage.setItem("hospitalName", data.hospital.name || "");
      router.push("/hospital-dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.18),_transparent_30%),linear-gradient(180deg,#fff7f7_0%,#ffffff_45%,#fffafa_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
              Hospital Registration
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Create your hospital account
            </h1>
          </div>
          <Link
            href="/hospital-login"
            className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm transition-colors hover:bg-red-50"
          >
            Already registered? Login
          </Link>
        </div>

        <div className="grid overflow-hidden rounded-[2rem] border border-red-100 bg-white shadow-[0_20px_60px_rgba(127,29,29,0.08)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-between gap-8 bg-gradient-to-br from-red-600 via-rose-600 to-slate-900 p-8 text-white lg:p-10">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                <Building2 className="h-4 w-4" /> Hospital Onboarding
              </div>
              <h2 className="mt-8 text-3xl font-black tracking-tight">
                Set up the profile that the dashboard and seekers will see.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
                Register the hospital, choose a username, and store the first dashboard settings in one pass.
              </p>
            </div>

            <div className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 text-sm text-white/80">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4" /> Contact number for responders
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4" /> Address for location-based routing
              </div>
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4" /> Username + password for hospital login
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                icon={Building2}
                label="Hospital Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dhaka General Hospital"
              />
              <Field
                icon={Phone}
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
              />
              <div className="md:col-span-2">
                <Field
                  icon={MapPin}
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Road 12, Dhanmondi, Dhaka"
                />
              </div>
              <Field
                icon={User}
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="hospital-admin"
              />
              <Field
                icon={Lock}
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
              <Field
                icon={Lock}
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
              />
              <Field
                icon={Building2}
                label="Beds"
                name="beds"
                type="number"
                value={formData.beds}
                onChange={handleChange}
                placeholder="0"
              />
              <Field
                icon={Building2}
                label="ICU Beds"
                name="icu"
                type="number"
                value={formData.icu}
                onChange={handleChange}
                placeholder="0"
              />
              <div className="md:col-span-2">
                <Field
                  icon={Building2}
                  label="Emergency Services"
                  name="emergency_services"
                  value={formData.emergency_services}
                  onChange={handleChange}
                  placeholder="24/7 ambulance, trauma care"
                />
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-slate-950/20 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Hospital Account"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, name, value, onChange, type = "text", placeholder }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-red-500 focus-within:bg-white">
        <Icon className="h-5 w-5 text-slate-400" />
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>
    </label>
  );
}