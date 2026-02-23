export const metadata = {
  title: "Services | JibonDaak",
  description: "Emergency ambulance services, critical care, and community support.",
};

const SERVICES = [
  {
    title: "Emergency Response",
    text: "Rapid dispatch with trained EMTs and paramedics for trauma, cardiac, and critical incidents.",
  },
  {
    title: "ICU Ambulance",
    text: "Advanced life-support units equipped with ventilators, monitors, and critical-care teams.",
  },
  {
    title: "Neonatal Transfer",
    text: "Specialized transport for newborns with temperature control and pediatric staff.",
  },
  {
    title: "Rural Access",
    text: "Multi-modal response integrating river boats and local health workers.",
  },
  {
    title: "Interfacility Transfer",
    text: "Safe and coordinated patient transfers between clinics and hospitals.",
  },
  {
    title: "Event Standby",
    text: "On-site medical coverage for festivals, stadiums, and large gatherings.",
  },
];

const ServicesPage = () => {
  return (
    <main className="bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden border-b border-white/5 bg-linear-to-br from-slate-950 via-slate-900 to-black py-20">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-red-300">
            Services
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            A full spectrum of emergency care, from roadside rescue to ICU transfer.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
            Our fleet is structured in layers so you always get the right
            response unit with the right equipment. Dispatchers monitor live
            conditions to reduce arrival times and keep you informed.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-red-400/50 hover:bg-red-500/10"
            >
              <h3 className="font-display text-2xl font-semibold text-white">
                {service.title}
              </h3>
              <p className="mt-3 text-sm text-slate-300">{service.text}</p>
              <div className="mt-6 h-px w-12 bg-red-400/60 transition group-hover:w-24" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900/40 py-16">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <h2 className="font-display text-3xl font-semibold text-white">
                How we coordinate every response
              </h2>
              <p className="text-base text-slate-300">
                Calls are triaged by licensed operators who dispatch the nearest
                unit, activate medical partners, and keep families updated. Our
                routing engine factors traffic, flood routes, and local access
                points to keep response times low.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Live dispatcher updates",
                  "Hospital pre-notification",
                  "Priority route clearance",
                  "Critical care handoff",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-500/10 via-slate-900/40 to-slate-950 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-red-300">
                Coverage Guarantee
              </p>
              <h3 className="mt-4 font-display text-2xl font-semibold text-white">
                Every call receives a response plan within 90 seconds.
              </h3>
              <p className="mt-4 text-sm text-slate-300">
                If the closest ambulance is more than 20 minutes away, we
                activate a relay team with local responders and community
                transport support.
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
                98% of calls receive a confirmed dispatch in under two minutes.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
