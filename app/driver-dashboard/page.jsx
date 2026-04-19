"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DriverDashboardAliasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/provider-dashboard");
  }, [router]);
  return null;
}
