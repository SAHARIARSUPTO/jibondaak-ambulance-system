import React from "react";
import {
  Ambulance,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-200 bg-white text-slate-600">
      {/* Subtle Background Pattern or Soft Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-red-50/50 blur-3xl" />
        <div className="absolute top-1/2 right-0 h-64 w-64 rounded-full bg-blue-50/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand Section */}
          <div className="space-y-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500 shadow-lg shadow-red-200">
                <Ambulance className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Jibon<span className="text-red-500">Daak</span>
              </span>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              Bangladesh's premier emergency response network. We bridge the gap
              between critical moments and life-saving care with intelligent
              coordination and a mission-first approach.
            </p>

            <div className="flex gap-4">
              <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 border border-slate-100">
                <HeartPulse className="h-4 w-4 text-red-500" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-600">
                  24/7 Active
                </span>
              </div>
            </div>
          </div>

          {/* Links & Contact Sections */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:col-span-7">
            {/* Quick Navigation */}
            <div className="space-y-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-900">
                Services & Navigation
              </p>
              <ul className="grid grid-cols-1 gap-3">
                {[
                  { label: "About Our Mission", href: "/about" },
                  { label: "Emergency Services", href: "/contact" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="group flex items-center text-sm font-medium transition hover:text-red-600"
                    >
                      {item.label}
                      <ArrowUpRight className="ml-1 h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-900">
                Get in Touch
              </p>
              <div className="space-y-4">
                <a href="tel:+000" className="flex items-start gap-3 group">
                  <div className="mt-1 rounded-md bg-red-50 p-2 group-hover:bg-red-100 transition">
                    <Phone className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Emergency Call
                    </p>
                    <p className="text-sm font-semibold text-slate-800">999</p>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-md bg-blue-50 p-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Support Email
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      help@jibondaak.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-md bg-slate-100 p-2">
                    <MapPin className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Headquarters
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      Rajshahi, Bangladesh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {currentYear} JibonDaak. A digital initiative for emergency
            healthcare.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="text-xs font-medium hover:text-red-600"
            >
              Privacy Policy
            </a>
            <a href="/terms" className="text-xs font-medium hover:text-red-600">
              Terms of Service
            </a>
            <div className="h-4 w-[1px] bg-slate-200" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
