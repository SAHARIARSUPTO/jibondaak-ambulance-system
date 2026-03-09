import { Ambulance, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-200">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15">
                <Ambulance className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-xl font-semibold tracking-tight">
                  Jibon<span className="text-red-400">Daak</span>
                </p>
                <p className="text-sm text-slate-400">
                  Fast, reliable emergency response across Bangladesh.
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm text-slate-300">
              We coordinate ambulances, trained responders, and critical-care
              transport with a single call. Built to reach every village, river
              crossing, and city lane.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Contact
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-red-400" /> 999 / 16263
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-red-400" /> help@jibondaak.com
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-400" /> Dhaka, Bangladesh
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Quick Links
              </p>
              <div className="grid gap-2 text-sm">
                {[
                  { label: "About", href: "/about" },
                  { label: "Services", href: "/services" },
                  { label: "Contact", href: "/contact" },
                  { label: "Track Ambulance", href: "/track" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-200 transition hover:border-red-400/60 hover:bg-red-500/10"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-red-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>(c) 2026 JibonDaak. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <a href="/privacy" className="hover:text-red-300">
              Privacy
            </a>
            <a href="/terms" className="hover:text-red-300">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
