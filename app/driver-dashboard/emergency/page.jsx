"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DriverEmergencyAliasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/provider-dashboard/emergency");
  }, [router]);
  return null;
}
