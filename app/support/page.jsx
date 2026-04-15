'use client';

import { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Ambulance, 
  HeadphonesIcon, MessageSquare, FileText, 
  AlertCircle, Users, Shield, Wrench, BookOpen,
  ChevronDown, Search
} from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const supportCategories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'emergency', name: 'Emergency', icon: AlertCircle },
    { id: 'booking', name: 'Booking', icon: Ambulance },
    { id: 'provider', name: 'Provider', icon: Users },
    { id: 'technical', name: 'Technical', icon: Wrench },
    { id: 'account', name: 'Account', icon: Shield }
  ];

  const faqs = [
    {
      category: 'emergency',
      question: 'How do I request an emergency ambulance?',
      answer: 'Click the SOS button on your dashboard, fill in the triage form with patient details, select ambulance type, and confirm your location. A nearby provider will be notified immediately.'
    },
    {
      category: 'emergency',
      question: 'What information do I need for emergency booking?',
      answer: 'You need patient age, gender, condition description, current location, and preferred ambulance type (AC, Non-AC, ICU, or Freezer Van).'
    },
    {
      category: 'booking',
      question: 'How long does it take to get an ambulance?',
      answer: 'Average response time is 5-15 minutes depending on your location and ambulance availability. You can track the ambulance in real-time once accepted.'
    },
    {
      category: 'booking',
      question: 'Can I cancel a booking?',
      answer: 'Yes, you can cancel a booking from your dashboard before the ambulance arrives. However, frequent cancellations may affect your account status.'
    },
    {
      category: 'booking',
      question: 'What types of ambulances are available?',
      answer: 'We offer Non-AC Ambulance, AC Ambulance, ICU Ambulance with medical equipment, and Freezer Van for special requirements.'
    },
    {
      category: 'provider',
      question: 'How do I register as an ambulance provider?',
      answer: 'Sign up with "Ambulance Service Provider" option, provide company details, license number, and add your ambulances with driver information.'
    },
    {
      category: 'provider',
      question: 'How do I receive booking requests?',
      answer: 'Toggle your status to "Online" in the provider dashboard. You will receive real-time notifications with patient details and can accept or reject requests.'
    },
    {
      category: 'provider',
      question: 'Can I manage multiple ambulances?',
      answer: 'Yes, you can add unlimited ambulances to your account. Each ambulance can be marked as available or busy independently.'
    },
    {
      category: 'technical',
      question: 'The app is not showing my location correctly',
      answer: 'Enable location permissions in your browser settings. If using mobile, ensure GPS is turned on. You can also manually enter your location.'
    },
    {
      category: 'technical',
      question: 'I am not receiving notifications',
      answer: 'Check browser notification permissions. For providers, ensure you are online and have at least one available ambulance registered.'
    },
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email, and follow the reset link sent to your inbox.'
    },
    {
      category: 'account',
      question: 'Can I switch between user and provider accounts?',
      answer: 'You need separate accounts for user and provider roles. However, you can register with different emails for each role.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-blue-500/20 py-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-16 left-1/4 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-full border-2 border-blue-400/30">
                <HeadphonesIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              How can we help you?
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-blue-200">
              Get support for emergency services, bookings, provider management, and technical issues
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800 text-white border-2 border-blue-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Cards */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Emergency Hotline */}
          <div className="bg-blue-950/80 backdrop-blur-lg rounded-xl p-6 border-2 border-blue-900/70">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-900/40 p-3 rounded-lg border border-blue-800/50">
                <Phone className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold text-white">Emergency Hotline</h3>
            </div>
            <p className="text-blue-200 mb-4">24/7 Emergency Ambulance Service</p>
            <a href="tel:999" className="text-3xl font-bold text-blue-200 hover:text-blue-100">999</a>
            <p className="text-sm text-blue-300 mt-2">Alternate: 16263</p>
          </div>

          {/* Support Email */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border-2 border-blue-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Email Support</h3>
            </div>
            <p className="text-blue-200 mb-4">Get help via email</p>
            <a href="mailto:support@jibondaak.com" className="text-lg font-semibold text-blue-300 hover:text-blue-200">
              support@jibondaak.com
            </a>
            <p className="text-sm text-blue-300 mt-2">Response within 24 hours</p>
          </div>

          {/* Office Location */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border-2 border-blue-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-cyan-500/20 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Office Location</h3>
            </div>
            <p className="text-blue-200 mb-2">87/2 Emergency Lane</p>
            <p className="text-blue-200 mb-4">Tejgaon, Dhaka 1208</p>
            <div className="flex items-center gap-2 text-sm text-cyan-300">
              <Clock className="w-4 h-4" />
              <span>Sun-Thu, 9:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {supportCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white border-2 border-blue-400'
                    : 'bg-slate-800 text-blue-200 border-2 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Frequently Asked Questions
        </h2>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No results found. Try a different search term.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-lg rounded-xl border-2 border-blue-500/30 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/50 transition-colors"
                >
                  <span className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-400 flex-shrink-0 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4 text-blue-200 border-t border-slate-700 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Links */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Quick Links
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard"
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border-2 border-blue-500/30 hover:border-blue-400 transition-all group"
          >
            <Ambulance className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">User Dashboard</h3>
            <p className="text-sm text-blue-200">Book ambulance services</p>
          </Link>

          <Link
            href="/provider-dashboard"
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border-2 border-blue-500/30 hover:border-blue-400 transition-all group"
          >
            <Users className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">Provider Dashboard</h3>
            <p className="text-sm text-blue-200">Manage your ambulances</p>
          </Link>

          <Link
            href="/contact"
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border-2 border-blue-500/30 hover:border-blue-400 transition-all group"
          >
            <MessageSquare className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">Contact Us</h3>
            <p className="text-sm text-blue-200">Send us a message</p>
          </Link>

          <Link
            href="/about"
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border-2 border-blue-500/30 hover:border-blue-400 transition-all group"
          >
            <FileText className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">About Us</h3>
            <p className="text-sm text-blue-200">Learn more about JibonDaak</p>
          </Link>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 backdrop-blur-lg rounded-2xl p-8 border-2 border-blue-500/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Still need help?
          </h2>
          <p className="text-blue-200 mb-6">
            Our support team is available 24/7 to assist you with any questions or concerns
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="tel:999"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg border border-blue-400/30"
            >
              Call Emergency: 999
            </a>
            <a
              href="mailto:support@jibondaak.com"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg border border-slate-600"
            >
              Email Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
