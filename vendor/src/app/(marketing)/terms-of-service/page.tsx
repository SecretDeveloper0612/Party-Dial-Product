'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Scale, Clock, CheckCircle2, ChevronRight, Lock, Eye, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const SectionHeader = ({ title, icon: Icon, color }: { title: string; icon: any; color: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`p-2 rounded-lg bg-${color}/10 text-${color}`}>
      <Icon size={20} />
    </div>
    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight italic">{title}</h2>
  </div>
);

const TermsOfService = () => {
  const sections = [
    { id: 'acceptance', title: 'Agreement Scope', icon: CheckCircle2, color: 'pd-red' },
    { id: 'merchant-obligations', title: 'Merchant Obligations', icon: FileText, color: 'pd-purple' },
    { id: 'leads-and-billing', title: 'Leads & Billing', icon: Scale, color: 'pd-blue' },
    { id: 'content-rights', title: 'Content Rights', icon: Lock, color: 'pd-pink' },
    { id: 'termination', title: 'Termination Policy', icon: AlertCircle, color: 'pd-red' },
  ];

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" as const }
  };

  return (
    <main className="bg-white min-h-screen text-slate-700 font-sans leading-relaxed selection:bg-pd-red/10 selection:text-pd-red">
      {/* 1. HERO HEADER */}
      <section className="pt-32 pb-12 px-6 bg-gradient-to-b from-slate-50 to-white overflow-hidden relative border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pd-red/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp} className="mb-6">
            <span className="inline-block bg-pd-red/10 text-pd-red text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-[0.2em] border border-pd-red/10 shadow-sm text-black">Partner Agreement</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter mb-4 italic uppercase">
              Terms of <span className="text-pd-red">Engagement.</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto italic text-sm md:text-base leading-relaxed">
              Legal framework governing the partnership between PartyDial and our Venue Merchants. Please review these terms to ensure a successful collaboration.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center justify-center gap-6 mt-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                <Clock size={14} className="text-pd-red" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Effective: March 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                <Shield size={14} className="text-pd-purple" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">v2.1 Merchant Edition</span>
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
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 italic underline decoration-pd-red/20 underline-offset-4">Agreement Sections</p>
              {sections.map((section) => (
                <a 
                  key={section.id}
                  href={`#${section.id}`} 
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-pd-red font-bold text-xs uppercase tracking-wider transition-all group"
                >
                  {section.title}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-black" />
                </a>
              ))}
              <div className="mt-12 pt-12 border-t border-slate-100">
                <Link href="/contact" className="p-6 bg-slate-900 rounded-2xl block text-center group transition-all hover:bg-black">
                  <p className="text-[10px] font-black text-pd-red uppercase tracking-widest mb-2 italic leading-none">Legal Desk</p>
                  <p className="text-white font-bold text-xs uppercase tracking-tight italic border-b border-white/10 pb-2 mb-4">Merchant Relations</p>
                  <button className="w-full bg-pd-red text-white py-2 rounded-lg font-black text-[9px] uppercase tracking-[0.2em] shadow-lg group-hover:scale-105 transition-transform italic leading-none">Email Counsel</button>
                </Link>
              </div>
            </div>
          </aside>

          {/* MAIN LEGAL CONTENT */}
          <article className="lg:col-span-3 space-y-16">
            
            {/* 2.1 Agreement Scope */}
            <motion.div {...fadeUp} id="acceptance" className="scroll-mt-24">
              <SectionHeader title="Agreement Scope" icon={CheckCircle2} color="pd-red" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base italic border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <p>
                  This Merchant Agreement ("Agreement") governs the relationship between Preet Tech (operator of "PartyDial") and the Venue Merchant ("Partner"). By registering on the Partner Dashboard, you agree to these commercial terms.
                </p>
                <p>
                  PartyDial acts as a Lead Generation and Discovery Engine. We provide the technology infrastructure to connect your venue with qualified event planners and individual customers.
                </p>
              </div>
            </motion.div>

            {/* 2.2 Merchant Obligations */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} id="merchant-obligations" className="scroll-mt-24">
              <SectionHeader title="Merchant Obligations" icon={FileText} color="pd-purple" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base italic border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <p>
                  To maintain high platform standards, Partners agree to:
                </p>
                <ul className="list-none space-y-4 mt-6">
                  {[
                    "Provide accurate and up-to-date pricing, availability, and venue photos.",
                    "Respond to leads within reasonable timeframes (ideally within 4 hours).",
                    "Honor the commitments and pricing displayed on the PartyDial portal.",
                    "Ensure the venue maintains all necessary local licenses and safety permits."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:shadow-md">
                      <div className="mt-1 w-4 h-4 rounded-full bg-pd-purple/10 flex items-center justify-center flex-shrink-0 group-hover:bg-pd-purple group-hover:text-white transition-colors">
                        <ChevronRight size={10} />
                      </div>
                      <span className="font-bold text-slate-800 text-xs md:text-sm italic uppercase tracking-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* 2.3 Leads and Billing */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} id="leads-and-billing" className="scroll-mt-24">
              <SectionHeader title="Leads & Billing" icon={Scale} color="pd-blue" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base italic border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <p>
                  Subscription fees are billed in advance according to the selected "Intro", "Growth", or "Enterprise" plan.
                </p>
                <ul className="list-none space-y-2 mt-4 ml-2">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-pd-blue"></div>
                    <p className="font-bold text-slate-700 italic border-b border-pd-blue/20 pb-1 w-full">All payments are processed securely via Razorpay.</p>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-pd-blue"></div>
                    <p className="font-bold text-slate-700 italic border-b border-pd-blue/20 pb-1 w-full">Fees are non-refundable once the subscription period begins.</p>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-pd-blue"></div>
                    <p className="font-bold text-slate-700 italic border-b border-pd-blue/20 pb-1 w-full">Leads provided are for the exclusive use of the registered venue.</p>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* 2.4 Content Rights */}
            <motion.div {...fadeUp} transition={{ delay: 0.3 }} id="content-rights" className="scroll-mt-24">
              <SectionHeader title="Content Rights" icon={Lock} color="pd-pink" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base italic border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <p>
                  By uploading photos and videos of your venue, you grant PartyDial a non-exclusive license to use this media for marketing and promotional purposes on the platform and associated social channels.
                </p>
                <div className="p-6 bg-slate-900 rounded-2xl border border-white/5 relative overflow-hidden group mt-8">
                  <div className="absolute right-0 top-0 p-8 text-pd-pink opacity-5 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                    <Eye size={120} />
                  </div>
                  <h3 className="text-white font-black italic uppercase tracking-widest mb-4 inline-block border-b-2 border-pd-pink pb-1 leading-none">Intellectual Property</h3>
                  <p className="text-white/60 text-xs md:text-sm font-medium leading-relaxed italic relative z-10">
                    You represent that you own the rights to all uploaded media. PartyDial reserved the right to watermark photos to prevent unauthorized cross-platform usage by competitors.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 2.5 Termination Policy */}
            <motion.div {...fadeUp} transition={{ delay: 0.4 }} id="termination" className="scroll-mt-24">
              <SectionHeader title="Termination Policy" icon={AlertCircle} color="pd-red" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base italic border-l-2 border-slate-100 pl-6 md:pl-10 text-justify pb-10">
                <p>
                  Either party may terminate the partnership with a 30-day notice period.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-pd-red/5 rounded-xl border border-pd-red/10">
                    <p className="text-[10px] font-black text-pd-red uppercase tracking-widest mb-2 italic">Immediate Termination</p>
                    <p className="text-[11px] font-medium text-slate-500 italic">PartyDial reserves the right to suspend accounts immediately in case of fraudulent activity or consistent customer complaints.</p>
                  </div>
                  <div className="p-4 bg-pd-red/5 rounded-xl border border-pd-red/10">
                    <p className="text-[10px] font-black text-pd-red uppercase tracking-widest mb-2 italic">Data Access</p>
                    <p className="text-[11px] font-medium text-slate-500 italic">Upon termination, the Partner will have 7 days to export lead data before dashboard access is revoked.</p>
                  </div>
                </div>
                <p className="mt-8">
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
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 italic uppercase tracking-tighter italic">Partner <span className="text-pd-red">Enquiries.</span></h2>
            <p className="text-slate-500 font-medium mb-10 italic text-sm">For amendments or custom enterprise contracts, please reach out to our legal department.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl italic leading-none">Contact Legal</button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-400 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:border-pd-red hover:text-pd-red transition-all active:scale-95 italic leading-none">Platform Home</button>
              </Link>
            </div>
            <div className="mt-16 text-[10px] font-black pointer-events-none text-slate-300 uppercase tracking-[0.4em] space-y-2">
               <p>© 2026 PARTYDIAL</p>
               <p>A Platform by Preet Tech</p>
               <p>All billing and operations managed exclusively by Preet Tech</p>
            </div>
        </div>
      </section>
    </main>
  );
};

export default TermsOfService;
