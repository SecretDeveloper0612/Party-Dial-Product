'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Eye,
  Lock,
  Fingerprint,
  Database,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  Globe,
  Bell,
  Mail,
  FileText,
  KeyRound,
  FileCheck,
  Building2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

interface SectionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badgeColor: string;
}

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections: SectionItem[] = [
    { id: 'overview', title: '1. Overview & Scope', subtitle: 'Platform charter & commitment', icon: Shield, badgeColor: 'from-blue-500 to-indigo-600' },
    { id: 'collection', title: '2. Information We Collect', subtitle: 'Venue details & merchant KYC', icon: Database, badgeColor: 'from-blue-600 to-cyan-500' },
    { id: 'usage', title: '3. How We Use Data', subtitle: 'Lead alerts & verification', icon: Eye, badgeColor: 'from-purple-500 to-pink-500' },
    { id: 'sharing', title: '4. Third-Party Sharing', subtitle: 'Zero competitor distribution', icon: Globe, badgeColor: 'from-rose-500 to-red-600' },
    { id: 'security', title: '5. Security Protocols', subtitle: '256-bit SSL & encrypted storage', icon: Lock, badgeColor: 'from-emerald-500 to-teal-600' },
    { id: 'rights', title: '6. Partner Rights & Control', subtitle: 'Export, update, or unpublish', icon: UserCheck, badgeColor: 'from-amber-500 to-orange-500' },
    { id: 'contact', title: '7. DPO & Merchant Support', subtitle: 'Legal desk & grievance redressal', icon: Mail, badgeColor: 'from-indigo-500 to-purple-600' },
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-rose-400/10 via-purple-500/10 to-blue-500/10 rounded-full blur-[110px] pointer-events-none -z-0" />
        <div className="absolute top-12 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-5"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/60 text-rose-600 text-xs font-poppins font-semibold shadow-xs">
              <Shield className="w-3.5 h-3.5" />
              PartyDial Partner Trust Charter
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-poppins font-light">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Last Updated: April 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-semibold text-slate-900 tracking-tight leading-[1.15] mb-5"
          >
            Merchant Privacy &amp; <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Data Governance Policy
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 font-poppins font-light text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-8"
          >
            We take your venue credentials, customer inquiry records, and business financial privacy seriously. Learn how PartyDial and Preet Tech OPC Private Limited safeguard, isolate, and strictly never resell your merchant records.
          </motion.p>

          {/* Quick Pillar Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto"
          >
            <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-poppins font-semibold text-slate-900 leading-snug">0% Data Reselling</p>
                <p className="text-[11px] font-poppins font-light text-slate-500">Never monetized</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-poppins font-semibold text-slate-900 leading-snug">1:1 Exclusive</p>
                <p className="text-[11px] font-poppins font-light text-slate-500">Leads sent only to you</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-poppins font-semibold text-slate-900 leading-snug">256-Bit SSL</p>
                <p className="text-[11px] font-poppins font-light text-slate-500">Bank-level cipher</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
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
                    Policy Index
                  </h3>
                </div>
                <span className="text-[10px] font-poppins font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  7 Sections
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

              {/* Security Audit Badge */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-poppins font-semibold uppercase tracking-wider text-emerald-300">
                      Merchant Safe Guard
                    </span>
                  </div>
                  <p className="text-xs font-poppins font-light text-slate-300 leading-relaxed mb-3">
                    Have questions regarding your GST invoice, compliance or personal data removal?
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
            
            {/* SECTION 1: OVERVIEW & SCOPE */}
            <motion.section
              {...fadeUp}
              id="overview"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    Scope of Coverage
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    1. Overview &amp; Platform Charter
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed">
                <p>
                  This Privacy Policy delineates the protocols, mechanisms, and legal standards by which <strong className="font-poppins font-semibold text-slate-900">Preet Tech OPC Private Limited</strong> (operating the brand <strong className="font-poppins font-semibold text-slate-900">PartyDial</strong>) gathers, manages, retains, and secures records from event vendors, banquet managers, caterers, photographers, decor specialists, and entertainment merchants registering via <strong className="font-poppins font-semibold text-slate-900">partydial.com</strong> and the PartyDial Partner Mobile App.
                </p>
                <p>
                  Unlike generic public listings, PartyDial operates as a dedicated partner ecosystem. We recognize your commercial venue schedules, rate cards, and direct customer telephone numbers constitute proprietary business assets that must be safeguarded with enterprise-grade isolation.
                </p>
              </div>

              <div className="mt-6 bg-blue-50/60 rounded-2xl p-4 sm:p-5 border border-blue-100 flex items-start gap-3.5">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm font-poppins font-light text-slate-700 leading-relaxed">
                  <strong className="font-poppins font-semibold text-blue-900 block mb-1">
                    Zero Customer Commission Context
                  </strong>
                  Because PartyDial charges 0% commission on your event bookings, we do not require access to your end-client contracts, private bank balance logs, or final venue pricing agreements.
                </div>
              </div>
            </motion.section>

            {/* SECTION 2: INFORMATION WE COLLECT */}
            <motion.section
              {...fadeUp}
              id="collection"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md">
                    Data Intake
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    2. Information We Collect
                  </h2>
                </div>
              </div>

              <p className="text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                To activate your vendor storefront, process verified customer inquiries, and activate instant WhatsApp lead alerts, we collect the following categorized parameters:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center mb-3">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-poppins font-semibold text-slate-900 mb-1.5">
                    Business Profile &amp; Venue
                  </h3>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    Brand trading name, registered company address, venue photos, seating capacities, catering menus, operational hours, and city pin-codes.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center mb-3">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-poppins font-semibold text-slate-900 mb-1.5">
                    Statutory &amp; KYC Records
                  </h3>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    GSTIN registration certificates, business owner PAN details, government identity records for fraud prevention, and authorized representative credentials.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-rose-100/70 text-rose-700 flex items-center justify-center mb-3">
                    <Mail className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-poppins font-semibold text-slate-900 mb-1.5">
                    Contact &amp; Notification Endpoints
                  </h3>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    Primary mobile phone number for OTP authentications, verified WhatsApp phone numbers for real-time lead dispatch, and administrative email IDs.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-3">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-poppins font-semibold text-slate-900 mb-1.5">
                    Payment Gateway Tokens
                  </h3>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    Transaction reference IDs, subscription activation status, and GST tax invoice receipts. <strong className="font-poppins font-semibold text-slate-800">We never store your raw credit card numbers or CVV.</strong>
                  </p>
                </div>
              </div>
            </motion.section>

            {/* SECTION 3: HOW WE USE DATA */}
            <motion.section
              {...fadeUp}
              id="usage"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                    Purpose Limitation
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    3. How We Use Merchant Information
                  </h2>
                </div>
              </div>

              <p className="text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                Your data is utilized solely to power your commercial growth, verify consumer leads, and protect our mutual operational integrity:
              </p>

              <div className="space-y-3.5">
                {[
                  {
                    title: '1:1 Direct Lead Delivery',
                    desc: 'Instantly delivering genuine party host inquiries (guest counts, tentative dates, catering preferences) directly to your dashboard and WhatsApp phone line.'
                  },
                  {
                    title: 'Fraud Prevention & Verification Badges',
                    desc: 'Screening prospective partners against public business registers to award the Verified Partner seal, boosting conversion rates among customers.'
                  },
                  {
                    title: 'Performance & Rank Analytics',
                    desc: 'Compiling anonymized engagement graphs showing venue profile visits, telephone call clicks, and quote requests to help optimize your promotional presence.'
                  },
                  {
                    title: 'Regulatory & GST Billing Compliance',
                    desc: 'Generating accurate tax invoices with valid GST input tax credits (ITC) under applicable Indian financial regulations.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/50 border border-slate-200/60">
                    <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
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

            {/* SECTION 4: THIRD-PARTY SHARING */}
            <motion.section
              {...fadeUp}
              id="sharing"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    Zero Resale Guarantee
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    4. Third-Party Sharing &amp; Anti-Spam
                  </h2>
                </div>
              </div>

              <p className="text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                PartyDial enforces a zero-tolerance policy against the commoditization of merchant partner data.
              </p>

              {/* Callout box */}
              <div className="bg-gradient-to-br from-rose-50 via-pink-50/40 to-slate-50 rounded-2xl p-5 border border-rose-200/70 mb-6">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-poppins font-semibold">
                    ✓
                  </div>
                  <h4 className="text-sm font-poppins font-semibold text-rose-950">
                    Never Sold to Rival Venues or Data Aggregators
                  </h4>
                </div>
                <p className="text-xs font-poppins font-light text-slate-700 leading-relaxed">
                  We never distribute customer phone numbers inquiring at your venue to rival banquet halls. Your customer conversations, private notes, and promotional agreements remain confidential between you and the customer.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-poppins font-semibold uppercase tracking-wider text-slate-400">
                  Permitted Operational Integrations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/40">
                    <p className="text-xs font-poppins font-semibold text-slate-900 mb-1">PCI-DSS Gateways</p>
                    <p className="text-[11px] font-poppins font-light text-slate-500 leading-relaxed">
                      Encrypted session tokenization for subscription checkout (Razorpay / Cashfree).
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/40">
                    <p className="text-xs font-poppins font-semibold text-slate-900 mb-1">WhatsApp Cloud API</p>
                    <p className="text-[11px] font-poppins font-light text-slate-500 leading-relaxed">
                      Meta enterprise infrastructure for instant delivery of customer inquiry alerts.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/40">
                    <p className="text-xs font-poppins font-semibold text-slate-900 mb-1">Indian Law Authorities</p>
                    <p className="text-[11px] font-poppins font-light text-slate-500 leading-relaxed">
                      Statutory compliance upon receipt of legally binding warrants or court orders.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* SECTION 5: SECURITY PROTOCOLS */}
            <motion.section
              {...fadeUp}
              id="security"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Technical Defense
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    5. Security Measures &amp; Infrastructure
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                <p>
                  Our server clusters adhere to modern cloud architectural safeguards to prevent unauthorized interception, distributed Denial of Service (DDoS) attacks, and credential spoofing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
                  <KeyRound className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-poppins font-semibold text-slate-900">
                      Transport Layer Security (TLS 1.3)
                    </h4>
                    <p className="text-xs font-poppins font-light text-slate-600 mt-1 leading-relaxed">
                      All network traffic between your browser or mobile app and PartyDial servers is encrypted using modern 256-bit AES algorithms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
                  <Fingerprint className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-poppins font-semibold text-slate-900">
                      OTP Authentication Tokens
                    </h4>
                    <p className="text-xs font-poppins font-light text-slate-600 mt-1 leading-relaxed">
                      Vendor accounts rely on time-sensitive, phone-verified one-time passwords, preventing brute force credential stuffing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
                  <Database className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-poppins font-semibold text-slate-900">
                      Automated Snapshot Backups
                    </h4>
                    <p className="text-xs font-poppins font-light text-slate-600 mt-1 leading-relaxed">
                      Redundant geo-replicated database backups are created on a rolling 24-hour cycle to prevent data loss.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-poppins font-semibold text-slate-900">
                      Role-Based Access Control
                    </h4>
                    <p className="text-xs font-poppins font-light text-slate-600 mt-1 leading-relaxed">
                      Internal PartyDial personnel have strictly audited, least-privilege administrative access to resolve support tickets.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* SECTION 6: PARTNER RIGHTS */}
            <motion.section
              {...fadeUp}
              id="rights"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    Merchant Governance
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    6. Your Rights &amp; Listing Control
                  </h2>
                </div>
              </div>

              <p className="text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                You maintain absolute sovereignty over your venue representation. As a registered Partner, you are entitled to:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <span className="text-xs font-poppins font-semibold text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Right to Modify
                  </span>
                  <h4 className="text-sm font-poppins font-semibold text-slate-900 mb-1">
                    Instant Updates
                  </h4>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    Update phone numbers, hall capacities, rental pricing, and photographs directly through your Partner Portal 24/7.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <span className="text-xs font-poppins font-semibold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Data Portability
                  </span>
                  <h4 className="text-sm font-poppins font-semibold text-slate-900 mb-1">
                    CSV Lead Export
                  </h4>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    Export your lifetime inquiries, customer interaction logs, and invoice records at any moment in open spreadsheet format.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <span className="text-xs font-poppins font-semibold text-rose-700 bg-rose-100/70 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Pause &amp; Removal
                  </span>
                  <h4 className="text-sm font-poppins font-semibold text-slate-900 mb-1">
                    Temporary Unpublish
                  </h4>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    Temporarily toggle your listing off during venue renovations or request permanent account deletion via our legal desk.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* SECTION 7: DPO & MERCHANT DESK */}
            <motion.section
              {...fadeUp}
              id="contact"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Grievance Officer
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    7. Grievance Redressal &amp; DPO Desk
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                <p>
                  In compliance with the Information Technology Act, 2000 and Digital Personal Data Protection (DPDP) Act frameworks of India, any privacy complaints or requests for data deletion may be formally directed to our designated Data Protection Officer.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Official Support Email
                  </p>
                  <p className="text-base font-poppins font-semibold text-slate-900 mb-1">
                    support@partydial.com
                  </p>
                  <p className="text-xs font-poppins font-light text-slate-500">
                    Typical response time: within 24 to 48 business hours.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Operating Corporate Entity
                  </p>
                  <p className="text-base font-poppins font-semibold text-slate-900 mb-1">
                    Preet Tech OPC Private Limited
                  </p>
                  <p className="text-xs font-poppins font-light text-slate-500">
                    Registered under the Companies Act, 2013 (India).
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
              <Bell className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-semibold text-white tracking-tight mb-4">
              Need Clarification on Your Merchant Listing?
            </h2>

            <p className="text-slate-300 font-poppins font-light text-sm sm:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
              Our merchant partner desk is on standby to assist with profile verification, GST invoice reconciliation, or data preferences anytime.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white text-xs sm:text-sm font-poppins font-semibold uppercase tracking-wider hover:shadow-lg hover:shadow-rose-500/25 transition-all active:scale-95"
              >
                Contact Merchant Desk
              </Link>
              <Link
                href="/pricing"
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-poppins font-semibold uppercase tracking-wider border border-white/15 transition-all active:scale-95"
              >
                View Transparent Pricing
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 text-center space-y-1.5 text-[11px] font-poppins font-light text-slate-400">
              <p className="font-poppins font-semibold text-slate-300">© 2026 PARTYDIAL. ALL RIGHTS RESERVED.</p>
              <p>A Proprietary Platform Developed and Operated by Preet Tech OPC Private Limited</p>
              <p>All merchant billing, verified badge endorsements, and server infrastructure managed under Indian Commercial Law.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
