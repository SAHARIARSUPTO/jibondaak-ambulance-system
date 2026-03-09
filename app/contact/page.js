export const metadata = {
  title: "Contact | JibonDaak",
  description: "Reach the JibonDaak dispatch and support teams.",
};

const ContactPage = () => {
  return (
    <main className="bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden border-b border-white/5 bg-linear-to-br from-slate-950 via-slate-900 to-black py-20">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute -top-16 left-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-red-300">
            Contact
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Reach our dispatch, partnerships, and support teams.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
            Emergency? Call 999 or 16263. For partnerships, media, and feedback,
            use the form below and we will respond within one business day.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-display text-2xl font-semibold text-white">
                Hotline & Dispatch
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                Immediate support and ambulance requests.
              </p>
              <p className="mt-4 text-2xl font-semibold text-red-300">999</p>
              <p className="text-sm text-slate-400">Alternate: 16263</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-display text-2xl font-semibold text-white">
                Operations Office
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                87/2 Emergency Lane, Tejgaon, Dhaka 1208
              </p>
              <p className="mt-3 text-sm text-slate-400">
                Sun-Thu, 9:00 AM - 6:00 PM
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-display text-2xl font-semibold text-white">
                Partnerships
              </h2>
              <p className="mt-3 text-sm text-slate-300">partners@jibondaak.com</p>
              <p className="text-sm text-slate-400">+880 1711 000 000</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-display text-2xl font-semibold text-white">
              Send a message
            </h2>
            <form className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-red-400/60"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-red-400/60"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-red-400/60"
              />
              <textarea
                name="message"
                placeholder="Tell us how we can help"
                rows="5"
                className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-red-400/60"
              />
              <button
                type="submit"
                className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
