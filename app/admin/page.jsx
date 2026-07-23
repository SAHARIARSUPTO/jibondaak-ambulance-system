"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/admin/session");
        const data = await response.json();

        if (!response.ok || !data.success) {
          router.push("/admin/login");
          return;
        }

        setAdminEmail(data.admin.email);
      } catch (error) {
        console.error("Session check error:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600 font-bold">Loading...</div>
      </div>
    );
  }

  if (!adminEmail) {
    return null; // Will redirect in useEffect
  }

  return <AdminDashboardClient adminEmail={adminEmail} />;
}
