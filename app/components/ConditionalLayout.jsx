"use client";
import { usePathname } from "next/navigation";
import Navbar from "./navbar/navbar";
import Footer from "./footer/footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.includes("/login") || pathname.includes("/register");

  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
}
