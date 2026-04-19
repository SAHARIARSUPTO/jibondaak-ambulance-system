"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Phone, MapPin, Building2, BadgeCheck } from "lucide-react";
import Link from "next/link";

export default function RegisterProviderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    licenseNumber: "",
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
      setFormData({ ...formData, division: value, district: "", upazila: "" });
    } else if (name === "district") {
      setFormData({ ...formData, district: value, upazila: "" });
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
      setError("Please select division, district and upazila.");
      setLoading(false);
      return;
    }

    if (!formData.companyName.trim() || !formData.licenseNumber.trim()) {
      setError("Company name and license number are required for providers.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
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
          companyName: formData.companyName,
          licenseNumber: formData.licenseNumber,
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
              companyName: formData.companyName,
              licenseNumber: formData.licenseNumber,
            }),
          );
        }
        setSuccess(true);
        setTimeout(() => {
          router.push("/driver-dashboard");
        }, 500);
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
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
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Provider Registration</h2>
        </div>

        {success && <div className="bg-green-50 border-2 border-green-500 text-green-700 p-4 rounded-lg text-center">Registration successful. Redirecting...</div>}
        {error && <div className="bg-red-50 border-2 border-red-500 text-red-700 p-4 rounded-lg text-center">{error}</div>}

        <form className="mt-8 space-y-6 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input icon={User} id="name" label="Name" value={formData.name} onChange={handleChange} />
            <Input icon={Mail} id="email" label="Email" type="email" value={formData.email} onChange={handleChange} />
            <Input icon={Phone} id="phone" label="Phone" value={formData.phone} onChange={handleChange} />
            <Input icon={Building2} id="companyName" label="Company Name" value={formData.companyName} onChange={handleChange} />
            <Input icon={BadgeCheck} id="licenseNumber" label="License Number" value={formData.licenseNumber} onChange={handleChange} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select id="division" label="Division" value={formData.division} onChange={handleChange} options={divisions.map((d) => ({ value: d.id, label: d.bn_name }))} />
              <Select id="district" label="District" value={formData.district} onChange={handleChange} disabled={!formData.division} options={districts.map((d) => ({ value: d.id, label: d.bn_name }))} />
              <Select id="upazila" label="Upazila" value={formData.upazila} onChange={handleChange} disabled={!formData.district} options={upazilas.map((u) => ({ value: u.id, label: u.bn_name }))} />
            </div>

            <Input icon={Lock} id="password" label="Password" type="password" value={formData.password} onChange={handleChange} />
            <Input icon={Lock} id="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} />
          </div>

          <button type="submit" disabled={loading || success} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            {loading ? "Registering..." : "Create Provider Account"}
          </button>

          <div className="text-center text-sm text-gray-600">
            Already have an account? <Link href="/login/provider" className="font-medium text-gray-900 hover:text-gray-700">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ icon: Icon, id, label, type = "text", value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={id}
          name={id}
          type={type}
          required
          value={value}
          onChange={onChange}
          className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
      </div>
    </div>
  );
}

function Select({ id, label, value, onChange, options, disabled = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <select
          name={id}
          required
          value={value}
          disabled={disabled}
          onChange={onChange}
          className="relative block w-full pl-10 pr-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white disabled:bg-gray-50"
        >
          <option value="">Select</option>
          {options.map((o) => (
            <option key={String(o.value)} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
