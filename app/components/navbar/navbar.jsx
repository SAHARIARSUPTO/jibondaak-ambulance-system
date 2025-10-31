"use client";
import React, { useState } from "react";
// Using lucide-react for modern, crisp icons instead of react-icons
import {
  Ambulance,
  Globe,
  Menu,
  X,
  HeartHandshake,
  ChevronDown,
} from "lucide-react";

// NOTE: The Link component is moved outside the Navbar function to fix the "Cannot create components during render" error.
const Link = ({ href, children, className, onClick }) => (
  <a href={href} className={className} onClick={onClick}>
    {children}
  </a>
);

// Define available languages
const LANGUAGES = [
  { code: "EN", name: "English" },
  { code: "BN", name: "Bangla" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [isLangOpen, setIsLangOpen] = useState(false); // State for the desktop language dropdown

  const toggleNavbar = () => setIsOpen(!isOpen);

  // Function to handle language selection
  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
    setIsLangOpen(false);
  };

  // Define menu items for easy mapping
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
    { name: "Support", href: "/support" },
  ];

  return (
    // Modern: Use backdrop-blur for a "floating" glass effect, subtle border
    <nav className="fixed w-full z-50 transition-all duration-300 backdrop-blur-sm bg-white/80 border-b border-gray-100 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Increased height (h-20) for a more substantial, professional feel */}
        <div className="flex items-center justify-between h-20">
          {/* Logo: Prominent and visually engaging */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-transform hover:scale-[1.02]"
          >
            <Ambulance className="text-red-600 w-8 h-8 md:w-7 md:h-7 shrink-0" />
            <span className="text-2xl md:text-xl font-extrabold text-gray-900 tracking-tight">
              Jibon<span className="text-red-600">Daak</span>
            </span>
          </Link>

          {/* Desktop Menu: Cleaner layout, pill-shaped hover/focus states */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                // Pill-shaped, smooth transition hover
                className="text-gray-700 text-[15px] font-medium px-4 py-2 rounded-full transition-all duration-200 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Utility Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Donate Button: Elevated and dynamic */}
            <Link
              href="/donate"
              className="group flex items-center bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <HeartHandshake className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Donate Now
            </Link>

            {/* Language Dropdown (Desktop) */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                aria-expanded={isLangOpen}
                aria-controls="language-menu"
                className="flex items-center text-gray-700 hover:text-red-600 font-medium text-sm p-3 rounded-full transition-colors hover:bg-gray-100"
              >
                <Globe className="w-5 h-5 mr-1" />
                <span className="font-bold">{selectedLang.code}</span>
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    isLangOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isLangOpen && (
                <div
                  id="language-menu"
                  className="absolute right-0 mt-2 w-32 origin-top-right rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-1 transform opacity-100 scale-100 transition-all duration-150 ease-out z-50"
                >
                  {LANGUAGES.map((langItem) => (
                    <button
                      key={langItem.code}
                      onClick={() => handleLanguageChange(langItem)}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors rounded-lg mx-auto ${
                        selectedLang.code === langItem.code
                          ? "bg-red-50 text-red-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      aria-current={
                        selectedLang.code === langItem.code ? "page" : undefined
                      }
                    >
                      {langItem.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button & Language (Mobile) */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Language Display (Dropdown inside mobile menu) */}
            <div className="flex items-center text-gray-700">
              <Globe className="w-6 h-6 mr-1" />
              <span className="font-bold text-lg">{selectedLang.code}</span>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleNavbar}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="text-gray-700 hover:text-red-600 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors"
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

      {/* Mobile Menu: Uses max-h and opacity for a smooth slide-down effect */}
      <div
        className={`md:hidden absolute w-full transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-white shadow-xl border-t border-gray-200`}
      >
        <div className="px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={`mobile-${item.name}`}
              href={item.href}
              className="block text-gray-700 hover:text-red-600 font-semibold py-2 px-3 rounded-lg transition-colors hover:bg-red-50"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Language Selector in Mobile Menu */}
          <div className="pt-3 border-t border-gray-100">
            <div className="text-gray-900 font-bold mb-2 pt-2">
              Select Language:
            </div>
            <div className="flex space-x-3">
              {LANGUAGES.map((langItem) => (
                <button
                  key={`mobile-lang-${langItem.code}`}
                  onClick={() => {
                    handleLanguageChange(langItem);
                    setIsOpen(false);
                  }}
                  className={`text-sm font-semibold px-4 py-2 rounded-full transition-all ${
                    selectedLang.code === langItem.code
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {langItem.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 mt-3">
            <Link
              href="/donate"
              className="flex items-center justify-center bg-red-600 text-white w-full py-3 rounded-lg font-bold shadow-md hover:bg-red-700 transition-colors text-base mt-2"
              onClick={() => setIsOpen(false)}
            >
              <HeartHandshake className="w-5 h-5 mr-3" />
              Donate Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
