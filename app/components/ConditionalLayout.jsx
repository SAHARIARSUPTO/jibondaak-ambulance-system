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
  const isHospitalDashboard = pathname.startsWith("/hospital-dashboard");

  const showNavbar = !isAuthPage && !isHospitalDashboard;
  const showFooter =
    !isAuthPage &&
    !isHospitalDashboard &&
    !isUserDashboard &&
    !isProviderDashboard;

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
      {showFooter && <Footer />}
    </>
  );
}
