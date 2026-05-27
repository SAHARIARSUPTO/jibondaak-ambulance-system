"use client";
import { usePathname } from "next/navigation";
import Navbar from "./navbar/navbar";
import Footer from "./footer/footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.includes("/login") || pathname.includes("/register");
  const isUserDashboard = pathname.startsWith("/dashboard");
  const isProviderDashboard = pathname.startsWith("/provider-dashboard");

  return (
    <>
      {!isAuthPage && !isUserDashboard && !isProviderDashboard && <Navbar />}
      {children}
      {!isAuthPage && !isUserDashboard && !isProviderDashboard && <Footer />}
    </>
  );
}
