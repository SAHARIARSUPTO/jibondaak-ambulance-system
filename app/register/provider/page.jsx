"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function RegisterProviderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    division: "",
    district: "",
    upazila: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const role = "provider";

  const fetchJson = async (url) => {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) {
      throw new Error(`Failed to load ${url}: ${res.status}`);
    }
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(
        `Expected JSON from ${url} but received ${contentType}. Check if the file exists in public/json/`,
      );
    }
    return await res.json();
  };

  useEffect(() => {
    fetchJson("/json/bd-divisions.json")
      .then((data) => setDivisions(data.divisions || data || []))
      .catch((err) => console.error("Error loading divisions:", err));
  }, []);

  useEffect(() => {
    if (formData.division) {
      fetchJson("/json/bd-districts.json")
        .then((data) => {
          const list = data.districts || data || [];
          setDistricts(
            list.filter(
              (d) => d.division_id.toString() === formData.division.toString(),
            ),
          );
        })
        .catch((err) => console.error("Error loading districts:", err));
    } else {
      setDistricts([]);
    }
  }, [formData.division]);

  useEffect(() => {
    if (formData.district) {
      fetchJson("/json/bd-upazilas.json")
        .then((data) => {
          const list = data.upazilas || data || [];
          setUpazilas(
            list.filter(
              (u) => u.district_id.toString() === formData.district.toString(),
            ),
          );
        })
        .catch((err) => console.error("Error loading upazilas:", err));
    } else {
      setUpazilas([]);
    }
  }, [formData.district]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "division") {
      setFormData({
        ...formData,
        division: value,
        district: "",
        upazila: "",
      });
    } else if (name === "district") {
      setFormData({ ...formData, district: value, upazila: "" });
    } else if (name === "upazila") {
      setFormData({ ...formData, upazila: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.division || !formData.district || !formData.upazila) {
      setError("আপনার বর্তমান অবস্থান সঠিকভাবে নির্বাচন করুন।");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("পাসওয়ার্ড দুটি মিলছে না।");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role,
          division: formData.division,
          district: formData.district,
          upazila: formData.upazila,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (typeof window !== "undefined" && data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...data.user,
              division: formData.division,
              district: formData.district,
              upazila: formData.upazila,
              phone: formData.phone,
            }),
          );
        }
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/provider");
        }, 2000);
      } else {
        setError(data.error || "নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch (error) {
      setError("কিছু সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white flex items-center justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-gray-900 p-3 rounded-2xl shadow-lg shadow-gray-200">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            অ্যাম্বুলেন্স প্রোভাইডার নিবন্ধন
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            আপনার অ্যাম্বুলেন্স ও সার্ভিস ম্যানেজ করতে একটি অ্যাকাউন্ট তৈরি করুন
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border-2 border-green-500 text-green-700 p-4 rounded-lg text-center">
            <p className="font-bold">নিবন্ধন সফল হয়েছে!</p>
            <p className="text-sm">ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-500 text-red-700 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <form
          className="mt-8 space-y-6 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                পুরো নাম
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="উদাহরণ: সুমিত আহমেদ"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  বিভাগ
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="division"
                    required
                    value={formData.division}
                    onChange={handleChange}
                    className="relative block w-full pl-10 pr-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white"
                  >
                    <option value="">বিভাগ নির্বাচন করুন</option>
                    {divisions.map((div) => (
                      <option key={div.id} value={div.id}>
                        {div.bn_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  জেলা
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="district"
                    required
                    disabled={!formData.division}
                    value={formData.district}
                    onChange={handleChange}
                    className="relative block w-full pl-10 pr-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white disabled:bg-gray-50"
                  >
                    <option value="">জেলা নির্বাচন করুন</option>
                    {districts.map((dis) => (
                      <option key={dis.id} value={dis.id}>
                        {dis.bn_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  উপজেলা
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="upazila"
                    required
                    disabled={!formData.district}
                    value={formData.upazila}
                    onChange={handleChange}
                    className="relative block w-full pl-10 pr-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white disabled:bg-gray-50"
                  >
                    <option value="">উপজেলা নির্বাচন করুন</option>
                    {upazilas.map((upz) => (
                      <option key={upz.id} value={upz.id}>
                        {upz.bn_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ইমেইল অ্যাড্রেস
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="উদাহরণ: provider@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                মোবাইল নম্বর
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="০১XXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="আবার পাসওয়ার্ডটি দিন"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "নিবন্ধন হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ইতিমধ্যেই অ্যাকাউন্ট আছে?{" "}
              <Link
                href="/login/provider"
                className="font-medium text-gray-900 hover:text-gray-700"
              >
                লগইন করুন
              </Link>
            </p>
          </div>
        </form>

        <p className="text-center text-xs text-gray-500">
          আপনি কি সেবা খুঁজছেন?{" "}
          <Link
            href="/register/seeker"
            className="text-red-600 hover:underline"
          >
            সেবাগ্রহীতা নিবন্ধন পেজে যান
          </Link>
        </p>
      </div>
    </div>
  );
}
