"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DriverFaresAliasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/provider-dashboard/fares");
  }, [router]);
  return null;
}
