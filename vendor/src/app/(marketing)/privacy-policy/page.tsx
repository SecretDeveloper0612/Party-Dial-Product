'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Fingerprint, Database, UserCheck, CheckCircle2, ChevronRight, Globe, Bell, Mail } from 'lucide-react';
import Link from 'next/link';

const SectionHeader = ({ title, icon: Icon, color }: { title: string; icon: any; color: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`p-2 rounded-lg bg-${color}/10 text-${color}`}>
      <Icon size={20} />
    </div>
    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight italic">{title}</h2>
  </div>
);

const PrivacyPolicy = () => {
  const sections = [
    { id: 'collection', title: 'Data Collection', icon: Database, color: 'pd-blue' },
    { id: 'usage', title: 'How We Use Data', icon: Eye, color: 'pd-purple' },
    { id: 'sharing', title: 'Third-Party Sharing', icon: Globe, color: 'pd-red' },
    { id: 'security', title: 'Security Measures', icon: Lock, color: 'pd-pink' },
    { id: 'rights', title: 'Your Rights', icon: UserCheck, color: 'emerald-400' },
  ];

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" as const }
  };

  return (
    <main className="bg-white min-h-screen text-slate-700 font-sans leading-relaxed selection:bg-pd-blue/10 selection:text-pd-blue">
      {/* 1. HERO HEADER */}
      <section className="pt-32 pb-12 px-6 bg-gradient-to-b from-slate-50 to-white overflow-hidden relative border-b border-slate-100">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pd-blue/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-50"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp} className="mb-6">
            <span className="inline-block bg-pd-blue/10 text-pd-blue text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-[0.2em] border border-pd-blue/10 shadow-sm text-black">Trust & Safety</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter mb-4 italic uppercase">
              Privacy <span className="text-pd-blue">Policy.</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto italic text-sm md:text-base leading-relaxed">
              At PartyDial, we are committed to protecting our Merchant Partners' data and ensuring the privacy of your business operations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center justify-center gap-6 mt-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
              <Shield size={14} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Enterprise Grade</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
              <Fingerprint size={14} className="text-pd-purple" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">End-to-End Encryption</span>
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
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 italic underline decoration-pd-blue/20 underline-offset-4">Merchant Policy</p>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-pd-blue font-bold text-xs uppercase tracking-wider transition-all group"
                >
                  {section.title}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-black" />
                </a>
              ))}
              <div className="mt-12 pt-12 border-t border-slate-100">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-400 border border-emerald-400/20"><UserCheck size={16} /></div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic leading-none mb-1">DPO Contact</h4>
                    <p className="text-[11px] font-medium text-slate-500 italic">support@partydial.com</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN LEGAL CONTENT */}
          <article className="lg:col-span-3 space-y-16">

            {/* 2.1 Information Collection */}
            <motion.div {...fadeUp} id="collection" className="scroll-mt-24">
              <SectionHeader title="Data Collection" icon={Database} color="pd-blue" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base italic border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <p>
                  As a Merchant Partner, we collect information necessary to manage your venue listings, process subscription payments, and facilitate lead management.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
                    <Mail size={16} className="text-pd-blue mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 italic mb-2">Business Data</h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Company name, GST details, KYC documents, and financial information for billing and payouts.</p>
                  </div>
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
                    <Globe size={16} className="text-pd-purple mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 italic mb-2">Platform Metrics</h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Engagement stats, lead conversion data, and dashboard interaction history to optimize your performance.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2.2 How We Use Data */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} id="usage" className="scroll-mt-24">
              <SectionHeader title="How We Use Data" icon={Eye} color="pd-purple" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base italic border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <p>
                  Your business data is used to empower your presence on PartyDial. We utilize this information for:
                </p>
                <ul className="list-none space-y-3 mt-6">
                  {[
                    "Verifying your business identity for premium listing status.",
                    "Generating real-time lead alerts and performance analytics.",
                    "Managing automated billing and subscription cycles.",
                    "Providing priority technical support and venue optimization tips."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-1" />
                      <span className="font-bold text-slate-800 text-xs md:text-sm italic uppercase tracking-tight border-b border-slate-50 pb-1 w-full">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* 2.3 Third-Party Sharing */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} id="sharing" className="scroll-mt-24">
              <SectionHeader title="Third-Party Sharing" icon={Globe} color="pd-red" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base italic border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <p>
                  We prioritize your business intelligence. We do not share your lead data or performance metrics with competing venues.
                </p>
                <div className="p-6 bg-slate-900 rounded-3xl border border-white/5 relative overflow-hidden group mt-6">
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="w-12 h-12 rounded-2xl bg-pd-red flex-shrink-0 flex items-center justify-center text-white shadow-xl">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-black italic uppercase tracking-widest mb-1 text-sm">Strategic Governance</h3>
                      <p className="text-white/50 text-xs font-medium leading-relaxed italic">
                        Your lead data is proprietary. We only share summary analytics with authorized payment gateway partners and statutory bodies as required by law.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2.4 Security Measures */}
            <motion.div {...fadeUp} transition={{ delay: 0.3 }} id="security" className="scroll-mt-24">
              <SectionHeader title="Security Measures" icon={Lock} color="pd-pink" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base italic border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <p>
                  We utilize enterprise-level security protocols to protect your financial transactions and lead databases.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {["2048-bit RSA Encryption", "PCI-DSS Compliant", "Daily Backups", "IP Whitelisting Options"].map((item, i) => (
                    <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 group hover:border-pd-pink hover:text-pd-pink transition-all cursor-default text-black">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 2.5 Your Rights */}
            <motion.div {...fadeUp} transition={{ delay: 0.4 }} id="rights" className="scroll-mt-24">
              <SectionHeader title="Your Rights" icon={UserCheck} color="emerald-400" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base italic border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <p>
                  You maintain full ownership of your venue's listing information. You can modify or remove listing data at your discretion through the Partner Dashboard.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 text-black">
                  <div className="p-4 bg-emerald-400/[0.03] border border-emerald-400/10 rounded-xl text-center group hover:border-emerald-400 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic mb-2 leading-none">Access Control</p>
                    <p className="text-[9px] font-medium text-slate-500 italic">Manage staff permissions and data access levels from your settings.</p>
                  </div>
                  <div className="p-4 bg-emerald-400/[0.03] border border-emerald-400/10 rounded-xl text-center group hover:border-emerald-400 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic mb-2 leading-none">Portability</p>
                    <p className="text-[9px] font-medium text-slate-500 italic">Export your lead data and performance reports anytime in CSV format.</p>
                  </div>
                  <div className="p-4 bg-emerald-400/[0.03] border border-emerald-400/10 rounded-xl text-center group hover:border-emerald-400 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic mb-2 leading-none">Suspension</p>
                    <p className="text-[9px] font-medium text-slate-500 italic">Temporarily hide your venue from the discovery portal when needed.</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </article>
        </div>
      </section>

      {/* UPDATES & CONTACT */}
      <section className="py-20 bg-slate-950 text-white rounded-[4rem] mx-4 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pd-blue/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="w-16 h-16 rounded-full bg-pd-blue/10 flex items-center justify-center text-pd-blue mx-auto mb-8 border border-white/5 shadow-2xl text-white">
            <Bell size={28} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 italic uppercase tracking-tighter italic">Merchant <span className="text-pd-blue">Security.</span></h2>
          <p className="text-white/50 font-medium mb-12 italic text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            We periodically review our data handling practices for Merchant Partners. Any significant updates to the merchant console privacy will be notified via your dashboard.
          </p>
          <Link href="/contact" className="inline-block">
            <button className="bg-pd-blue text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-pd-blue/80 transition-all active:scale-95 shadow-xl italic leading-none">Merchant Support Desk</button>
          </Link>
          <div className="mt-20 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] space-y-2 pointer-events-none">
            <p>© 2026 PARTYDIAL</p>
            <p>A Platform by Preet Tech</p>
            <p>All billing and operations managed exclusively by Preet Tech</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
