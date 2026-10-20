'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, FileCheck, Shield, Award, CheckCircle2, ChevronRight, Zap, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

const SectionHeader = ({ title, icon: Icon, color }: { title: string; icon: any; color: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`p-2 rounded-lg bg-${color}/10 text-${color}`}>
      <Icon size={20} />
    </div>
    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{title}</h2>
  </div>
);

const PartnerAgreement = () => {
  const sections = [
    { id: 'program-scope', title: 'Partner Program Scope', icon: Handshake, color: 'pd-pink' },
    { id: 'listing-standards', title: 'Listing Standards', icon: FileCheck, color: 'pd-purple' },
    { id: 'leads-protocol', title: 'Direct Leads & Inquiries', icon: Zap, color: 'pd-blue' },
    { id: 'zero-commission', title: 'Zero Commission Model', icon: Award, color: 'emerald-500' },
    { id: 'subscription-renewal', title: 'Subscriptions & Renewals', icon: RefreshCw, color: 'pd-pink' },
    { id: 'compliance-termination', title: 'Code of Conduct & Termination', icon: AlertCircle, color: 'pd-red' },
  ];

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" as const }
  };

  return (
    <main className="bg-white min-h-screen text-slate-700 font-sans leading-relaxed selection:bg-pd-pink/10 selection:text-pd-pink">
      {/* 1. HERO HEADER */}
      <section className="pt-32 pb-12 px-6 bg-linear-to-b from-slate-50 to-white overflow-hidden relative border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pd-pink/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp} className="mb-6">
            <span className="inline-block bg-pd-pink/10 text-pd-pink text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-[0.2em] border border-pd-pink/10 shadow-sm">
              Official Partner Terms
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter mb-4 uppercase">
              Partner <span className="text-pd-pink">Agreement.</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Standard operating agreement between PartyDial (operated by Preet Tech OPC Private Limited) and registered Venue Merchants & Service Partners.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center justify-center gap-6 mt-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
              <Sparkles size={14} className="text-pd-pink" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Partner Pro & Free Tiers</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
              <Shield size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">100% Commission-Free</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CONTENT AREA */}
      <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20">
          
          {/* STICKY SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-1 border-r border-slate-100 pr-8 hidden lg:block">
            <div className="sticky top-24 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 underline decoration-pd-pink/20 underline-offset-4">
                Agreement Clauses
              </p>
              {sections.map((section) => (
                <a 
                  key={section.id}
                  href={`#${section.id}`} 
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-pd-pink font-bold text-xs uppercase tracking-wider transition-all group"
                >
                  {section.title}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-black" />
                </a>
              ))}
              <div className="mt-12 pt-12 border-t border-slate-100">
                <Link href="/contact" className="p-6 bg-slate-900 rounded-2xl block text-center group transition-all hover:bg-black">
                  <p className="text-[10px] font-black text-pd-pink uppercase tracking-widest mb-2 leading-none">Partner Helpdesk</p>
                  <p className="text-white font-bold text-xs uppercase tracking-tight border-b border-white/10 pb-2 mb-4">Dedicated Support</p>
                  <button className="w-full bg-pd-pink text-white py-2 rounded-lg font-black text-[9px] uppercase tracking-[0.2em] shadow-lg group-hover:scale-105 transition-transform leading-none">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </aside>

          {/* MAIN LEGAL CONTENT */}
          <article className="lg:col-span-3 space-y-16">
            
            {/* 2.1 Program Scope */}
            <motion.div {...fadeUp} id="program-scope" className="scroll-mt-24">
              <SectionHeader title="1. Partner Program Scope" icon={Handshake} color="pd-pink" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <p>
                  This Partner Agreement (&quot;Agreement&quot;) is entered into by and between <strong>Preet Tech OPC Private Limited</strong> (&quot;PartyDial&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;us&quot;) and the registered venue owner, banquet manager, farm owner, or event vendor (&quot;Partner&quot;, &quot;Merchant&quot;, &quot;you&quot;).
                </p>
                <p>
                  By completing the onboarding registration, verifying your phone number, or checking the acceptance box, you agree to become a verified Partner on the PartyDial discovery network. PartyDial functions as a technology platform connecting customers searching for event venues and vendors with relevant businesses.
                </p>
              </div>
            </motion.div>

            {/* 2.2 Listing Standards */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} id="listing-standards" className="scroll-mt-24">
              <SectionHeader title="2. Venue Listing Standards & Authenticity" icon={FileCheck} color="pd-purple" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <p>
                  To preserve consumer confidence and listing quality across the PartyDial directory, all Partners commit to the following listing standards:
                </p>
                <ul className="list-none space-y-4 mt-6">
                  {[
                    "Accurate Venue Details: You agree to provide genuine venue capacity, accurate address details, genuine photographs, amenities, and true operational hours.",
                    "Transparent Pricing: Display realistic starting prices, per plate catering charges, or rental fees without deceptive hidden costs.",
                    "Ownership & Authorization: You warrant that you are the lawful owner, leaseholder, or authorized representative permitted to list the property and transact bookings.",
                    "Licensing & Compliance: You warrant that your establishment maintains all compulsory municipal, fire safety, health, food handling (FSSAI), and local administrative licenses."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:shadow-md">
                      <div className="mt-1 w-4 h-4 rounded-full bg-pd-purple/10 flex items-center justify-center flex-shrink-0 text-pd-purple">
                        <CheckCircle2 size={12} />
                      </div>
                      <span className="font-semibold text-slate-800 text-xs md:text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* 2.3 Leads Protocol */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} id="leads-protocol" className="scroll-mt-24">
              <SectionHeader title="3. Direct Inquiries & Customer Communication" icon={Zap} color="pd-blue" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <p>
                  When party hosts, wedding planners, or corporate event organizers submit inquiries for your venue:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-black text-pd-blue uppercase tracking-wider mb-1">Direct Communication</p>
                    <p className="text-xs text-slate-600">Customers reach out directly via call, WhatsApp, or instant lead delivery to your verified email and vendor dashboard.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-black text-pd-blue uppercase tracking-wider mb-1">Prompt Response Time</p>
                    <p className="text-xs text-slate-600">Partners agree to respond to customer inquiries within a reasonable business timeframe to maintain high conversion and rating.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-black text-pd-blue uppercase tracking-wider mb-1">Confidentiality</p>
                    <p className="text-xs text-slate-600">Customer contact information received through PartyDial must only be used for responding to event inquiries and cannot be sold, rented, or transferred.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-black text-pd-blue uppercase tracking-wider mb-1">Direct Deal Closure</p>
                    <p className="text-xs text-slate-600">All customer booking negotiations, advance payments, and event execution are conducted directly between Partner and customer.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2.4 Zero Commission */}
            <motion.div {...fadeUp} transition={{ delay: 0.3 }} id="zero-commission" className="scroll-mt-24">
              <SectionHeader title="4. 0% Commission Policy" icon={Award} color="emerald-500" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <h3 className="text-emerald-900 font-black text-base uppercase tracking-tight mb-2">
                    PartyDial Does Not Charge Booking Commissions
                  </h3>
                  <p className="text-emerald-800 text-xs md:text-sm leading-relaxed">
                    Unlike traditional event brokers or booking agencies that take a 10% to 25% cut on every booking, PartyDial operates on a transparent SaaS subscription model. You keep 100% of all client booking revenues generated from your leads.
                  </p>
                </div>
                <p>
                  PartyDial does not participate in client-to-venue financial transactions, security deposits, or event-day settlement disputes. Partners are solely responsible for invoicing and collecting payments directly from customers.
                </p>
              </div>
            </motion.div>

            {/* 2.5 Subscription & Renewals */}
            <motion.div {...fadeUp} transition={{ delay: 0.4 }} id="subscription-renewal" className="scroll-mt-24">
              <SectionHeader title="5. Subscriptions, Auto-Debit & Billing" icon={RefreshCw} color="pd-pink" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <p>
                  PartyDial offers free basic listings as well as upgraded Partner Pro membership tiers (e.g. Starter, Growth, Enterprise).
                </p>
                <ul className="list-disc ml-6 space-y-2 text-xs md:text-sm">
                  <li><strong>Billing Cycle:</strong> Plans are billed on monthly or annual schedules in advance through our authorized payment gateway, Razorpay.</li>
                  <li><strong>Auto-Debit / Subscriptions:</strong> For recurring subscription plans with auto-debit enabled, renewal charges will automatically occur at the end of each billing cycle unless cancelled prior to the renewal date.</li>
                  <li><strong>Non-Refundable:</strong> As digital promotion and immediate priority listing visibility are activated upon payment, subscription payments are non-refundable as detailed in our Refund Policy.</li>
                  <li><strong>Plan Changes:</strong> Partners can upgrade or downgrade their tier directly from the Partner Dashboard.</li>
                </ul>
              </div>
            </motion.div>

            {/* 2.6 Code of Conduct & Termination */}
            <motion.div {...fadeUp} transition={{ delay: 0.5 }} id="compliance-termination" className="scroll-mt-24">
              <SectionHeader title="6. Partner Code of Conduct & Termination" icon={AlertCircle} color="pd-red" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base border-l-2 border-slate-100 pl-6 md:pl-10 text-justify pb-10">
                <p>
                  PartyDial reserves the right to suspend or delist any Partner without notice if the Partner:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-pd-red/5 rounded-xl border border-pd-red/10">
                    <p className="text-[11px] font-black text-pd-red uppercase tracking-widest mb-1">Misrepresentation</p>
                    <p className="text-[11px] font-medium text-slate-500">Uploads fraudulent venue imagery, false pricing, or impersonates another hospitality brand.</p>
                  </div>
                  <div className="p-4 bg-pd-red/5 rounded-xl border border-pd-red/10">
                    <p className="text-[11px] font-black text-pd-red uppercase tracking-widest mb-1">Consumer Harm</p>
                    <p className="text-[11px] font-medium text-slate-500">Engages in fraudulent bookings, failure to deliver services for paid events, or abusive conduct toward clients.</p>
                  </div>
                </div>
                <p className="mt-6">
                  Either party may terminate participation in the Partner Program at any time via the Partner Portal or by notifying our support desk. Upon termination, public directory listings will be deactivated.
                </p>
                <p>
                  This agreement is governed by the laws of India, with exclusive jurisdiction in the courts of Udham Singh Nagar, Uttarakhand.
                </p>
              </div>
            </motion.div>

          </article>
        </div>
      </section>

      {/* FINAL CTA/FOOTNOTE */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
            Questions About Our <span className="text-pd-pink">Partner Program?</span>
          </h2>
          <p className="text-slate-500 font-medium mb-10 text-sm">
            Our merchant onboarding specialists are here to guide you through verification, photography standards, and listing optimization.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl leading-none">
                Contact Partner Support
              </button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:border-pd-pink hover:text-pd-pink transition-all active:scale-95 leading-none">
                View Partner Plans
              </button>
            </Link>
          </div>
          <div className="mt-16 text-[10px] font-black pointer-events-none text-slate-300 uppercase tracking-[0.4em] space-y-2">
            <p>© 2026 PARTYDIAL</p>
            <p>A Platform by Preet Tech OPC Private Limited</p>
            <p>All billing and operations managed exclusively by Preet Tech OPC Private Limited</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PartnerAgreement;
