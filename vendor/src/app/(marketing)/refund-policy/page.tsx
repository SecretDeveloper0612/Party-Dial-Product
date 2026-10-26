'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Ban,
  Receipt,
  CalendarX,
  PackageX,
  CreditCard,
  ShieldAlert,
  ChevronRight,
  Clock,
  Building2,
  FileText,
  Mail,
  Phone,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Bell
} from 'lucide-react';
import Link from 'next/link';

interface SectionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

export default function RefundPolicy() {
  const [activeSection, setActiveSection] = useState('no-refund');

  const sections: SectionItem[] = [
    { id: 'no-refund', title: '1. No Refund Policy', subtitle: 'Digital SaaS consumption terms', icon: Ban },
    { id: 'subscriptions', title: '2. Subscription Services', subtitle: 'Immediate feature unlock & cycles', icon: Receipt },
    { id: 'cancellations', title: '3. Cancellation Policy', subtitle: 'Account pause vs. vendor bookings', icon: CalendarX },
    { id: 'return-policy', title: '4. Digital Return Policy', subtitle: 'Intangible SaaS lead services', icon: PackageX },
    { id: 'platform-fees', title: '5. Platform & Service Fees', subtitle: 'Technology & infrastructure costs', icon: CreditCard },
    { id: 'billing-support', title: '6. Billing Support & Desk', subtitle: 'Preet Tech OPC Private Limited', icon: ShieldAlert },
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-rose-500/10 via-amber-500/10 to-purple-500/10 rounded-full blur-[110px] pointer-events-none -z-0" />
        <div className="absolute top-12 left-10 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-5"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/60 text-rose-600 text-xs font-poppins font-semibold shadow-xs">
              <Ban className="w-3.5 h-3.5" />
              Transparent Commercial Policy
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-poppins font-light">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Effective: April 2026 • SaaS Merchant Standard
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-semibold text-slate-900 tracking-tight leading-[1.15] mb-5"
          >
            Refund &amp; Cancellation <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-amber-600 bg-clip-text text-transparent">
              Commercial Policy
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 font-poppins font-light text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-8"
          >
            At PartyDial, we deliver immediate, real-time discovery services, digital verified badging, and automated lead allocation for venue merchants. Please review our clear non-refundable SaaS commercial framework.
          </motion.p>

          {/* Quick Assurance Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto"
          >
            <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Ban className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-poppins font-semibold text-slate-900 leading-snug">Final Transactions</p>
                <p className="text-[11px] font-poppins font-light text-slate-500">Zero hidden claws</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-poppins font-semibold text-slate-900 leading-snug">Instant Provisioning</p>
                <p className="text-[11px] font-poppins font-light text-slate-500">Live within seconds</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <PackageX className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-poppins font-semibold text-slate-900 leading-snug">Digital Software</p>
                <p className="text-[11px] font-poppins font-light text-slate-500">No physical return</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
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

              {/* Billing Desk Card */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span className="text-[11px] font-poppins font-semibold uppercase tracking-wider text-rose-300">
                      Merchant Billing Desk
                    </span>
                  </div>
                  <p className="text-xs font-poppins font-light text-slate-300 leading-relaxed mb-3">
                    Have questions regarding an active invoice, GST receipt, or subscription renewal?
                  </p>
                  <div className="space-y-1.5">
                    <Link
                      href="mailto:support@partydial.com"
                      className="flex items-center gap-1.5 text-xs font-poppins font-semibold text-rose-300 hover:text-white transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      support@partydial.com
                    </Link>
                    <a
                      href="tel:+918864959977"
                      className="flex items-center gap-1.5 text-xs font-poppins font-semibold text-slate-300 hover:text-white transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      +91 88649 59977
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT / MAIN CONTENT PANELS */}
          <div className="lg:col-span-8 space-y-8">

            {/* SECTION 1: NO REFUND POLICY */}
            <motion.section
              {...fadeUp}
              id="no-refund"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Ban className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    Policy Foundation
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    1. No Refund Policy
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed">
                <p className="font-poppins font-semibold text-rose-600 text-base">
                  In this SaaS platform, all transactions are strictly non-refundable. We do not maintain any return, exchange, or refund policy.
                </p>
                <p>
                  At PartyDial, we strive to deliver the highest quality event discovery and venue lead generation services. To maintain continuous cloud server availability, high-speed lead routing algorithms, and reliable anti-fraud verification, all payments processed through our systems are deemed final. Once a transaction has been confirmed by our banking partner, no refunds, chargebacks, reversals, or credits will be issued under any circumstances.
                </p>
              </div>

              <div className="mt-6 bg-gradient-to-r from-rose-50/70 to-pink-50/50 rounded-2xl p-4 sm:p-5 border border-rose-100 flex items-start gap-3.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm font-poppins font-light text-slate-700 leading-relaxed">
                  <strong className="font-poppins font-semibold text-rose-950 block mb-1">
                    Pre-Purchase Verification Notice
                  </strong>
                  We urge all prospective venue merchants to carefully review plan features, lead allocation structures, and pricing tiers before completing checkout. Our team is available 6 days a week to answer pre-sales questions.
                </div>
              </div>
            </motion.section>

            {/* SECTION 2: SUBSCRIPTION SERVICES */}
            <motion.section
              {...fadeUp}
              id="subscriptions"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                    SaaS Subscriptions
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    2. Subscription Services
                  </h2>
                </div>
              </div>

              <p className="text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                For venue owners, banquet partners, and event vendors, all promotional subscriptions, verified badge fees, and featured discovery placements are strictly non-refundable.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-poppins font-semibold text-slate-900 mb-1.5">
                    Instant Feature Consumption
                  </h3>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    Immediate access to verified merchant badging, premium search indexing, and real-time WhatsApp inquiry dispatch is granted the moment payment is confirmed, which legally constitutes full delivery and completion of the service.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-poppins font-semibold text-slate-900 mb-1.5">
                    No Partial or Prorated Refunds
                  </h3>
                  <p className="text-xs font-poppins font-light text-slate-600 leading-relaxed">
                    Partners may cancel or unpublish their venue listing at any point to prevent future billing renewals; however, no partial refunds, prorated credits, or fee adjustments will be issued for remaining days in an active billing term.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* SECTION 3: CANCELLATIONS */}
            <motion.section
              {...fadeUp}
              id="cancellations"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <CalendarX className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    Account Cancellation
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    3. Cancellation Policy
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                <p>
                  Partners maintain sovereign control over their presence on PartyDial and may choose to stop utilizing our platform or pause venue listings at their discretion. However, the following governing rules apply:
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/60 border border-slate-200/70">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Ban className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-poppins font-semibold text-slate-900 leading-tight">
                      Account Deletion Does Not Trigger Refunds
                    </h4>
                    <p className="text-xs font-poppins font-light text-slate-600 mt-1 leading-relaxed">
                      Voluntary deletion, unpublishing, or temporary pausing of a vendor profile prior to plan expiration does not entitle the merchant to any retroactive refund of paid fees.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/60 border border-slate-200/70">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-poppins font-semibold text-slate-900 leading-tight">
                      Independent Venue Booking Cancellations
                    </h4>
                    <p className="text-xs font-poppins font-light text-slate-600 mt-1 leading-relaxed">
                      In the case of customer event bookings initiated through our discovery portal, all event cancellations, advance deposit forfeitures, or date rescheduling agreements are governed strictly by the individual venue merchant's private policy. PartyDial is not a contractual party to end-client event agreements and assumes zero liability for booking refunds.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* SECTION 4: DIGITAL RETURN POLICY */}
            <motion.section
              {...fadeUp}
              id="return-policy"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <PackageX className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    Intangible Digital Goods
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    4. Return Policy for Digital SaaS
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed">
                <p>
                  Because PartyDial operates exclusively as a Software-as-a-Service (SaaS) engine providing digital storefront indexing, inquiry routing, and marketing discovery, <strong className="font-poppins font-semibold text-slate-900">there are no physical goods or tangible merchandise to be returned.</strong>
                </p>
                <p>
                  All digital software access, portal features, lead allocation limits, and verified badging granted to vendors are consumed digitally in real time upon activation. Consequently, conventional consumer return rights for physical products do not apply to services provided under this agreement.
                </p>
              </div>
            </motion.section>

            {/* SECTION 5: PLATFORM & SERVICE FEES */}
            <motion.section
              {...fadeUp}
              id="platform-fees"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Infrastructure Operations
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    5. Platform &amp; Operational Service Fees
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                <p>
                  Any administrative onboarding, verification processing, or technological subscription fees charged by PartyDial are 100% non-refundable.
                </p>
                <p>
                  These operational charges directly offset the unavoidable costs of cloud server hosting, automated SMS &amp; WhatsApp gateway dispatch fees, continuous software security patches, and merchant desk personnel provided by <strong className="font-poppins font-semibold text-slate-900">Preet Tech OPC Private Limited</strong>.
                </p>
              </div>

              <div className="bg-emerald-50/50 rounded-2xl p-4 sm:p-5 border border-emerald-100 text-xs sm:text-sm font-poppins font-light text-slate-700 leading-relaxed">
                <strong className="font-poppins font-semibold text-emerald-950 block mb-1">
                  Tax Invoicing &amp; GST Compliance
                </strong>
                All payments include standard 18% Goods and Services Tax (GST) under Indian Revenue laws. Tax invoices issued with valid GST input tax credits (ITC) cannot be retroactively cancelled once officially recorded with the GST portal.
              </div>
            </motion.section>

            {/* SECTION 6: MANAGEMENT & BILLING SUPPORT */}
            <motion.section
              {...fadeUp}
              id="billing-support"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Corporate Governance
                  </span>
                  <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 mt-0.5">
                    6. Billing Support &amp; Corporate Management
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 font-poppins font-light text-sm sm:text-base leading-relaxed mb-6">
                <p>
                  The PartyDial platform, its partner portals, and all financial merchant billing are managed and operated exclusively by <strong className="font-poppins font-semibold text-slate-900">Preet Tech OPC Private Limited</strong>, a corporate entity registered under the Companies Act, 2013 (India).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Official Billing Email
                  </p>
                  <p className="text-base font-poppins font-semibold text-slate-900 mb-1">
                    support@partydial.com
                  </p>
                  <p className="text-xs font-poppins font-light text-slate-500">
                    Direct channel for invoice queries and billing clarifications.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-poppins font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Partner Helpline Phone
                  </p>
                  <p className="text-base font-poppins font-semibold text-slate-900 mb-1">
                    +91 88649 59977
                  </p>
                  <p className="text-xs font-poppins font-light text-slate-500">
                    Operating Monday to Saturday, 10:00 AM – 7:00 PM IST.
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
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-rose-400 mx-auto mb-6 border border-white/10 shadow-lg">
              <Ban className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-semibold text-white tracking-tight mb-4">
              Need Pre-Subscription Advice or Billing Clarification?
            </h2>

            <p className="text-slate-300 font-poppins font-light text-sm sm:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
              Our merchant onboarding specialists are ready to walk you through our pricing tiers and features before you subscribe.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white text-xs sm:text-sm font-poppins font-semibold uppercase tracking-wider hover:shadow-lg hover:shadow-rose-500/25 transition-all active:scale-95"
              >
                Speak with Billing Team
              </Link>
              <Link
                href="/pricing"
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-poppins font-semibold uppercase tracking-wider border border-white/15 transition-all active:scale-95"
              >
                Review Plans &amp; Pricing
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 text-center space-y-1.5 text-[11px] font-poppins font-light text-slate-400">
              <p className="font-poppins font-semibold text-slate-300">© 2026 PARTYDIAL. ALL RIGHTS RESERVED.</p>
              <p>A Proprietary Platform Developed and Operated by Preet Tech OPC Private Limited</p>
              <p>All merchant billing, digital services, and financial operations managed under Indian Law.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
