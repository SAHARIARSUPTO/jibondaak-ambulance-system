export const metadata = {
  title: "About | JibonDaak",
  description: "Learn about JibonDaak and our emergency response mission.",
};

const AboutPage = () => {
  return (
    <main className="bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden border-b border-white/5 bg-linear-to-br from-slate-950 via-slate-900 to-black py-20">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute -top-24 left-10 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
          <div className="flex-1 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-red-300">
              About Us
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              A nationwide emergency network built for people, not just cities.
            </h1>
            <p className="text-base text-slate-300 sm:text-lg">
              JibonDaak connects dispatchers, medics, and local responders in a
              single command layer, delivering rapid ambulance care across
              Bangladesh. We bridge rivers, villages, and dense city streets with
              real-time routing and community-trained support.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                "24/7 operator teams",
                "Licensed medical partners",
                "Multi-tier ambulance fleet",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-100"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
              <div className="grid gap-4">
                {[
                  { label: "Districts Served", value: "64" },
                  { label: "Ambulances Online", value: "320" },
                  { label: "Avg. Dispatch Time", value: "90 sec" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {[
            {
              title: "Mission",
              text: "Deliver rapid, reliable emergency transport by combining local knowledge with modern dispatch technology.",
            },
            {
              title: "Vision",
              text: "Ensure no one in Bangladesh is more than minutes away from trained emergency medical care.",
            },
            {
              title: "Values",
              text: "Empathy, speed, and accountability guide every call, every route, and every response.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="font-display text-2xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-4 text-sm text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900/40 py-16">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold text-white">
            How JibonDaak grew
          </h2>
          <div className="mt-8 grid gap-6">
            {[
              {
                year: "2019",
                text: "Pilot dispatch center launches with 15 ambulances in Dhaka.",
              },
              {
                year: "2021",
                text: "Community responder program expands to 30 districts.",
              },
              {
                year: "2024",
                text: "Nationwide routing layer integrates river and rural access routes.",
              },
              {
                year: "2026",
                text: "24/7 coverage reaches all 64 districts with multi-tier ambulance fleet.",
              },
            ].map((item) => (
              <div
                key={item.year}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 sm:flex-row sm:items-center"
              >
                <span className="text-lg font-semibold text-red-300">
                  {item.year}
                </span>
                <p className="text-sm text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
