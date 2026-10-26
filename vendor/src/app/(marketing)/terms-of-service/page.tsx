'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Shield,
  Scale,
  Clock,
  CheckCircle2,
  ChevronRight,
  Lock,
  Eye,
  AlertCircle,
  Building2,
  Receipt,
  Headphones,
  Mail,
  FileCheck2,
  BadgeAlert,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface SectionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections: SectionItem[] = [
    { id: 'acceptance', title: '1. Agreement Scope', subtitle: 'Commercial framework & engagement', icon: Scale },
    { id: 'merchant-obligations', title: '2. Merchant Obligations', subtitle: 'Listing accuracy & SLA terms', icon: FileCheck2 },
    { id: 'leads-and-billing', title: '3. Leads & Billing Policies', subtitle: '0% commission & prepaid plans', icon: Receipt },
    { id: 'content-rights', title: '4. Content & IP Licensing', subtitle: 'Venue photos & trademark rights', icon: Lock },
    { id: 'termination', title: '5. Termination & Suspension', subtitle: 'Notice periods & data export', icon: BadgeAlert },
    { id: 'jurisdiction', title: '6. Governing Law & Dispute', subtitle: 'Exclusive Indian jurisdiction', icon: Shield },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.5, ease: 'easeOut' as const }
  };

  return (
    <main className="bg-slate-50/60 min-h-screen text-slate-800 font-poppins font-light selection:bg-rose-500/10 selection:text-rose-600">
      {/* 1. HERO HEADER */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 relative overflow-hidden border-b border-slate-200/60">
        {/* Ambient Gradient Blobs */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-rose-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-[110px] pointer-events-none -z-0" />
        <div className="absolute top-12 left-10 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-5"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/60 text-rose-600 text-xs font-poppins font-semibold shadow-xs">
              <Scale className="w-3.5 h-3.5" />
              Partner Service Level Agreement
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-poppins font-light">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Effective: April 2026 • v2.2 Merchant Edition
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-semibold text-slate-900 tracking-tight leading-[1.15] mb-5"
          >
            Merchant Terms of <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Engagement &amp; Service
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 font-poppins font-light text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-8"
          >
            This binding legal framework defines the commercial rights, SLA expectations, and operating protocols between Preet Tech OPC Private Limited (PartyDial) and our registered venue partners and event merchants.
          </motion.p>

          {/* Quick Pillar Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto"
          >
            <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-poppins font-semibold text-slate-900 leading-snug">0% Commission</p>
                <p className="text-[11px] font-poppins font-light text-slate-500">Keep 100% earnings</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-poppins font-semibold text-slate-900 leading-snug">Direct Booking</p>
                <p className="text-[11px] font-poppins font-light text-slate-500">No client middleman</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-poppins font-semibold text-slate-900 leading-snug">Verified Badging</p>
                <p className="text-[11px] font-poppins font-light text-slate-500">Fraud-screened venue</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-poppins font-semibold text-slate-900 leading-snug">Indian Entity</p>
                <p className="text-[11px] font-poppins font-light text-slate-500">Preet Tech OPC Pvt Ltd</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. MAIN DOCUMENT BODY */}
      <section className="py-12 md:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">

          {/* FROZEN / STICKY LEFT DIRECTORY TABLE OF CONTENTS */}
          <aside className="lg:col-span-4 hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-poppins font-semibold text-slate-900">
                    Agreement Index
                  </h3>
                </div>
                <span className="text-[10px] font-poppins font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  6 Clauses
                </span>
              </div>

              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollTo(section.id)}
                      className={`w-full text-left flex items-center justify-between p-3 rounded-2xl transition-all duration-200 group ${
                        isActive
                          ? 'bg-rose-50/70 text-rose-700 border border-rose-200/60 shadow-xs'
                          : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-500 group-hover:text-slate-800 group-hover:bg-slate-200/70'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p
                            className={`text-xs font-poppins font-semibold leading-tight ${
                              isActive ? 'text-rose-900' : 'text-slate-800'
                            }`}
                          >
                            {section.title}
                          </p>
                          <p className="text-[11px] font-poppins font-light text-slate-500 leading-none mt-1">
                            {section.subtitle}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isActive
                            ? 'text-rose-600 translate-x-0'
                            : 'text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0'
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>

              {/* Merchant Legal Help Desk */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones className="w-4 h-4 text-rose-400" />
                    <span className="text-[11px] font-poppins font-semibold uppercase tracking-wider text-rose-300">
                      Merchant Legal Counsel
                    </span>
                  </div>
                  <p className="text-xs font-poppins font-light text-slate-300 leading-relaxed mb-3">
                    Require enterprise invoicing, customized multi-venue addendums, or commercial terms consultation?
                  </p>
                  <Link
                    href="mailto:support@partydial.com"
                    className="inline-flex items-center gap-1.5 text-xs font-poppins font-semibold text-rose-300 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    support@partydial.com
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT / MAIN CONTENT PANELS */}
          <div className="lg:col-span-8 space-y-8">

            {/* SECTION 1: AGREEMENT SCOPE */}
            <motion.section
              {...fadeUp}
              id="acceptance"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    Clause 1
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    1. Agreement Scope &amp; Commercial Model
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed">
                <p>
                  This Merchant Agreement ("Agreement") establishes the operating conditions between <strong className="font-poppins font-semibold text-slate-900">Preet Tech OPC Private Limited</strong> (operator of the brand <strong className="font-poppins font-semibold text-slate-900">PartyDial</strong>) and you, the authorized representative of the banquet hall, hotel, resort, caterer, decorator, DJ, or event service enterprise ("Merchant Partner").
                </p>
                <p>
                  PartyDial operates purely as a discovery, marketing, and lead-generation engine. By registering on the PartyDial Partner Portal, submitting venue details, or subscribing to any promotional tier, you unconditionally affirm and agree to be bound by these Terms of Engagement.
                </p>
              </div>

              <div className="mt-6 bg-gradient-to-r from-rose-50/70 to-pink-50/50 rounded-2xl p-4 sm:p-5 border border-rose-100 flex items-start gap-3.5">
                <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm font-poppins font-light text-slate-700 leading-relaxed">
                  <strong className="font-poppins font-semibold text-rose-950 block mb-1">
                    Direct Customer Dealings &amp; 0% Commission
                  </strong>
                  All event booking negotiations, contracts, catering selections, advance deposits, and cancellations take place directly between you and the event host. PartyDial collects zero percent commission from booking proceeds.
                </div>
              </div>
            </motion.section>

            {/* SECTION 2: MERCHANT OBLIGATIONS */}
            <motion.section
              {...fadeUp}
              id="merchant-obligations"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                    Clause 2
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    2. Merchant Obligations &amp; Service Standards
                  </h2>
                </div>
              </div>

              <p className="text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                To maintain consumer trust and ensure the integrity of the PartyDial Verified seal, Merchant Partners commit to upholding the following operational benchmarks:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-poppins font-semibold text-slate-900 mb-1.5">
                    Listing Accuracy &amp; Rate Cards
                  </h3>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    Provide authentic photographs, accurate plate pricing ranges, true seating capacities, and genuine operational amenities without misleading consumer representations.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-poppins font-semibold text-slate-900 mb-1.5">
                    Prompt Response SLA
                  </h3>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    Acknowledge customer inquiries received via the Partner Dashboard or WhatsApp within a reasonable operational window (ideally within 2 to 4 business hours).
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-poppins font-semibold text-slate-900 mb-1.5">
                    Statutory Licenses &amp; Safety
                  </h3>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    Maintain valid local municipal permits, fire department NOCs, FSSAI licenses for food handling, and GST registrations required under applicable Indian municipal law.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                    <BadgeAlert className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-poppins font-semibold text-slate-900 mb-1.5">
                    Zero Customer Discrimination
                  </h3>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    Treat all platform customers with courtesy and professional fairness, refraining from discriminatory practices prohibited under the Constitution of India.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* SECTION 3: LEADS & BILLING */}
            <motion.section
              {...fadeUp}
              id="leads-and-billing"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    Clause 3
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    3. Leads &amp; Commercial Billing Policies
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                <p>
                  Promotional packages, verified badges, and priority discovery listings are billed on a prepaid subscription basis according to the selected package (Starter, Growth, or Enterprise).
                </p>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    title: '1:1 Exclusive Lead Allocation',
                    desc: 'Party hosts who submit an inquiry specifically on your venue profile will be routed exclusively to your account. We never auction your direct venue inquiries to competing banquet halls.'
                  },
                  {
                    title: 'Prepaid Subscriptions & Taxes',
                    desc: 'All subscription prices are denominated in Indian Rupees (INR) and are subject to applicable Goods and Services Tax (GST 18%). GST tax invoices are automatically generated in your billing tab.'
                  },
                  {
                    title: 'Secure Payment Processing',
                    desc: 'Digital checkouts are processed via RBI-compliant, PCI-DSS certified payment gateways (Razorpay / Cashfree). PartyDial never stores sensitive credit card credentials.'
                  },
                  {
                    title: 'Refund Disclaimers',
                    desc: 'Because platform listing, badge verification, and search rank algorithms deploy immediately upon checkout, subscription fees are non-refundable once the billing cycle commences.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/50 border border-slate-200/60">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-poppins font-semibold text-slate-900 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs font-poppins font-light text-slate-600 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* SECTION 4: CONTENT & IP RIGHTS */}
            <motion.section
              {...fadeUp}
              id="content-rights"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                    Clause 4
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    4. Content Ownership &amp; Intellectual Property
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                <p>
                  You retain complete intellectual property ownership over all venue names, trade logos, photographic portfolios, and virtual walkthrough videos uploaded to your Partner Portal.
                </p>
                <p>
                  By publishing media on the platform, you grant Preet Tech OPC Private Limited a worldwide, royalty-free, non-exclusive license to showcase your photographs and promotional descriptions across PartyDial web portals, partner applications, and social media advertising channels to drive booking traffic to your venue.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 border border-slate-700 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-rose-400" />
                    <h4 className="text-sm font-poppins font-semibold text-white">
                      Anti-Scraping Protection &amp; Watermarking
                    </h4>
                  </div>
                  <p className="text-xs font-poppins font-light text-slate-300 leading-relaxed">
                    PartyDial reserves the right to apply protective digital watermarks or digital signatures to venue photographs to deter unauthorized commercial cloning or scraping by third-party competitor directories.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* SECTION 5: TERMINATION & SUSPENSION */}
            <motion.section
              {...fadeUp}
              id="termination"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <BadgeAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    Clause 5
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    5. Partnership Termination &amp; Suspension
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                <p>
                  Either party may terminate the business collaboration by providing a written 30-day notice period to the designated operational email address.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/40 border border-rose-100">
                  <span className="text-xs font-poppins font-semibold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Immediate Suspension Rights
                  </span>
                  <h4 className="text-sm font-poppins font-semibold text-slate-900 mb-1">
                    Fraud &amp; Severe Misconduct
                  </h4>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    PartyDial reserves the right to suspend partner storefronts immediately upon verifiable evidence of customer financial fraud, bait-and-switch pricing scams, or multiple unresolved safety complaints.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/40 border border-blue-100">
                  <span className="text-xs font-poppins font-semibold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Data Portability
                  </span>
                  <h4 className="text-sm font-poppins font-semibold text-slate-900 mb-1">
                    7-Day Export Window
                  </h4>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    Upon mutual termination or plan expiration, Merchant Partners will retain a 7-day administrative grace period to download and export their historical lead records and billing receipts.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* SECTION 6: JURISDICTION */}
            <motion.section
              {...fadeUp}
              id="jurisdiction"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Clause 6
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    6. Governing Law &amp; Dispute Redressal
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                <p>
                  This Agreement, along with all vendor disputes, commercial claims, and service interpretation issues, shall be construed in accordance with the substantive laws of India.
                </p>
                <p>
                  Any legal proceedings, actions, or arbitrations arising out of or in connection with this agreement shall fall under the exclusive territorial jurisdiction of the competent civil courts located in <strong className="font-poppins font-semibold text-slate-900">Udham Singh Nagar, Uttarakhand, India</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Operating Corporate Entity
                  </p>
                  <p className="text-base font-poppins font-semibold text-slate-900 mb-1">
                    Preet Tech OPC Private Limited
                  </p>
                  <p className="text-xs font-poppins font-light text-slate-500">
                    CIN: Registered under the Companies Act, 2013 (India).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Corporate Legal Desk
                  </p>
                  <p className="text-base font-poppins font-semibold text-slate-900 mb-1">
                    support@partydial.com
                  </p>
                  <p className="text-xs font-poppins font-light text-slate-500">
                    Official channel for legal notices and dispute filings.
                  </p>
                </div>
              </div>
            </motion.section>

          </div>
        </div>
      </section>

      {/* 3. BOTTOM CTA CARD */}
      <section className="px-4 sm:px-6 pb-20 max-w-7xl mx-auto">
        <div className="rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-xl border border-slate-800">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-rose-400 mx-auto mb-6 border border-white/10 shadow-lg">
              <Scale className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-semibold text-white tracking-tight mb-4">
              Have Inquiries Regarding Our Merchant Agreement?
            </h2>

            <p className="text-slate-300 font-poppins font-light text-sm sm:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
              Our partner advisory team is ready to clarify terms, discuss enterprise SLA options, or assist with GST onboarding requirements.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white text-xs sm:text-sm font-poppins font-semibold uppercase tracking-wider hover:shadow-lg hover:shadow-rose-500/25 transition-all active:scale-95"
              >
                Contact Merchant Counsel
              </Link>
              <Link
                href="/pricing"
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-poppins font-semibold uppercase tracking-wider border border-white/15 transition-all active:scale-95"
              >
                Explore Partner Plans
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 text-center space-y-1.5 text-[11px] font-poppins font-light text-slate-400">
              <p className="font-poppins font-semibold text-slate-300">© 2026 PARTYDIAL. ALL RIGHTS RESERVED.</p>
              <p>A Proprietary Platform Developed and Operated by Preet Tech OPC Private Limited</p>
              <p>All merchant billing, verified badge endorsements, and platform infrastructure managed under Indian Commercial Law.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsOfService;
