﻿"use client";
import React, { useState, useEffect } from "react";
import {
  Ambulance,
  Menu,
  X,
  HeartHandshake,
  Home,
  Info,
  Phone,
  User,
  LogOut,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    checkUser();
    // Sync user state across tabs/components
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [pathname]);

  const toggleNavbar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsOpen(false);
    router.push("/login");
  };

  const navItems = [
    { name: "হোম", href: "/", icon: Home },
    { name: "আমাদের সম্পর্কে", href: "/about", icon: Info },
    { name: "যোগাযোগ", href: "/contact", icon: Phone },
  ];

  return (
    // NOT sticky
    <nav className="w-full z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-transform hover:scale-[1.02]"
          >
            <Ambulance className="text-red-600 w-8 h-8 md:w-7 md:h-7 shrink-0" />
            <span className="text-2xl md:text-xl font-bold text-gray-900 tracking-tighter">
              জীবন<span className="text-red-500">ডাক</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-600 text-[15px] font-medium tracking-tight px-4 py-2 rounded-full transition-all duration-200 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Utility Buttons Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Persistent Action Buttons */}
            {!user?._id && (
              <>
                <Link
                  href="/login/seeker"
                  className="flex items-center border border-red-200 text-red-600 px-4 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:bg-red-50 transition-all duration-300 whitespace-nowrap"
                >
                  অ্যাম্বুলেন্স দরকার?
                </Link>
                <Link
                  href="/login/provider"
                  className="flex items-center border border-gray-200 text-gray-900 px-4 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:bg-gray-50 transition-all duration-300 whitespace-nowrap"
                >
                  অ্যাম্বুলেন্স রেজিস্টার
                </Link>
              </>
            )}

            {user?._id && (
              <div className="flex items-center space-x-3 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                <div className="bg-red-100 p-1.5 rounded-full">
                  <User className="w-4 h-4 text-red-600" />
                </div>
                <Link
                  href={
                    user.role === "provider"
                      ? "/provider-dashboard"
                      : "/dashboard"
                  }
                  className="flex flex-col"
                >
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold leading-none">
                      Welcome
                    </span>
                    <span className="text-sm font-bold text-gray-900 leading-tight">
                      {user.name}
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {/* Donate Button */}
            <Link
              href="/donate"
              className="group flex items-center bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <HeartHandshake className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              ডোনেট করুন
            </Link>

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-red-600 font-medium text-sm p-3 rounded-full transition-colors hover:bg-red-50"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Mobile Language + Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <div className="flex items-center space-x-2 mr-2">
                <User className="w-5 h-5 text-red-600" />
                <span className="text-sm font-bold text-gray-900">
                  {user.name.split(" ")[0]}
                </span>
              </div>
            )}
            <button
              onClick={toggleNavbar}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="text-gray-900 hover:text-red-600 focus:outline-none p-2 rounded-full hover:bg-gray-50 transition-colors"
            >
              {isOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Animated Mobile Menu */}
      <div
        className={`md:hidden fixed top-20 left-0 right-0 w-full overflow-hidden
          transition-all duration-300 
          ${
            isOpen
              ? "animate-navbar-show max-h-96 opacity-100"
              : "animate-navbar-hide max-h-0 opacity-0"
          }
          bg-white shadow-2xl border-t border-gray-100`}
        style={{ zIndex: 40 }}
      >
        <div className="px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={`mobile-${item.name}`}
              href={item.href}
              className="flex items-center space-x-3 text-gray-700 hover:text-red-600 font-semibold py-3 px-4 rounded-xl transition-colors hover:bg-red-50"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}

          <div className="pt-3 border-t border-gray-100 space-y-3">
            {!user && (
              <>
                <Link
                  href="/login/seeker"
                  className="block text-center bg-red-50 text-red-600 font-semibold py-3 px-4 rounded-xl transition-colors hover:bg-red-100"
                  onClick={() => setIsOpen(false)}
                >
                  অ্যাম্বুলেন্স দরকার?
                </Link>
                <Link
                  href="/login/provider"
                  className="block text-center bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-xl transition-colors hover:bg-gray-200"
                  onClick={() => setIsOpen(false)}
                >
                  অ্যাম্বুলেন্স রেজিস্টার
                </Link>
              </>
            )}
            {user && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Logged in as
                </p>
                <p className="text-gray-900 font-bold">{user.name}</p>
                <button
                  onClick={handleLogout}
                  className="mt-3 flex items-center justify-center space-x-2 w-full py-2.5 bg-white border border-red-100 text-red-600 rounded-xl text-sm font-bold shadow-sm hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>লগআউট</span>
                </button>
              </div>
            )}
          </div>
          {/* Donate Button - Hidden when user is present */}
          {!user && (
            <div className="pt-4 border-t border-gray-100 mt-3">
              <Link
                href="/donate"
                className="flex items-center justify-center bg-red-600 text-white w-full py-4 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-colors text-base mt-2"
                onClick={() => setIsOpen(false)}
              >
                <HeartHandshake className="w-5 h-5 mr-3" />
                ডোনেট করুন
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes navbarShow {
          0% {
            opacity: 0;
            transform: translateY(-20px) scaleY(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scaleY(1);
          }
        }
        @keyframes navbarHide {
          0% {
            opacity: 1;
            transform: translateY(0px) scaleY(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scaleY(0.95);
          }
        }
        .animate-navbar-show {
          animation: navbarShow 0.25s ease-out forwards;
        }
        .animate-navbar-hide {
          animation: navbarHide 0.2s ease-in forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
