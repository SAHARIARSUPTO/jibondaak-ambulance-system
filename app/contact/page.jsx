"use client";
import React, { useState } from "react";

// NOTE: Metadata cannot be exported from here because of "use client".
// Move metadata to a separate layout.js file in this folder.

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করবো।");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="bg-white text-[#1a1a1a] font-sans antialiased">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-12 bg-red-600"></span>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">
                যোগাযোগ করুন
              </span>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl lg:text-8xl mb-10 leading-[0.95]">
              আপনার সেবায় <br />
              আমরা <span className="text-red-600 italic">২৪/৭</span> প্রস্তুত।
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed">
              জরুরি প্রয়োজনে সরাসরি কল করুন। পার্টনারশিপ বা অন্যান্য তথ্যের জন্য
              নিচের ফর্মটি পূরণ করুন, আমরা ২৪ ঘণ্টার মধ্যে উত্তর দেব।
            </p>
          </div>
        </div>
      </section>

      {/* --- CONTACT CONTENT --- */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16">
            {/* Left Side: Contact Details */}
            <div className="lg:col-span-5 space-y-12">
              <div className="border-t-4 border-red-600 pt-8">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                  জরুরি হটলাইন
                </p>
                <h2 className="text-4xl font-black text-slate-900 mb-2">৯৯৯</h2>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                  হেড অফিস
                </p>
                <p className="text-xl font-bold text-slate-900 leading-relaxed">
                  পদ্মা আবাসিক রোড,ভদ্রা মোড় <br /> রাজশাহী, বাংলাদেশ।
                </p>
                <p className="mt-2 text-slate-500 font-medium text-sm">
                  রবি - বৃহস্পতি, সকাল ৯:০০ - সন্ধ্যা ৬:০০
                </p>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                  পার্টনারশিপ ও মিডিয়া
                </p>
                <p className="text-xl font-bold text-slate-900">
                  partners@jibondaak.com
                </p>
                <p className="text-lg text-slate-500">+৮৮০১৭৪৪২১৮৯৬০</p>
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="lg:col-span-7 bg-[#f8f8f8] p-8 md:p-12 border border-slate-100">
              <h3 className="text-3xl font-black text-slate-900 mb-8">
                আমাদের বার্তা পাঠান
              </h3>
              <form onSubmit={handleSubmit} className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                      আপনার নাম
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="পুরো নাম লিখুন"
                      className="w-full bg-white border border-slate-200 px-5 py-4 text-slate-900 focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                      ইমেইল ঠিকানা
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@address.com"
                      className="w-full bg-white border border-slate-200 px-5 py-4 text-slate-900 focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    বিষয়
                  </label>
                  <input
                    required
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="বার্তার বিষয়"
                    className="w-full bg-white border border-slate-200 px-5 py-4 text-slate-900 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    আপনার বার্তা
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="আমরা আপনাকে কীভাবে সাহায্য করতে পারি?"
                    className="w-full bg-white border border-slate-200 px-5 py-4 text-slate-900 focus:outline-none focus:border-red-600 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white px-10 py-5 text-lg font-bold hover:bg-red-600 transition-all duration-300 uppercase tracking-widest"
                >
                  বার্তা পাঠান
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm">
          © ২০২৬ জীবনডাক। আধুনিক জরুরি সেবা নেটওয়ার্ক।
        </p>
      </footer>
    </main>
  );
};

export default ContactPage;
