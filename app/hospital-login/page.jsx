"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HospitalLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/hospitals/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success && data.hospital) {
      // Store session (for demo, use localStorage)
      localStorage.setItem("hospitalUserId", data.hospital._id);
      router.push("/hospital-dashboard");
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Hospital Login</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 p-3 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
