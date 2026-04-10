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
      <section className="pt-24 pb-12 px-6 bg-gradient-to-b from-slate-50 to-white overflow-hidden relative border-b border-slate-100">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pd-blue/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-50"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp} className="mb-6">
            <span className="inline-block bg-pd-blue/10 text-pd-blue text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-[0.2em] border border-pd-blue/10 shadow-sm">Trust & Safety</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter mb-4 italic uppercase">
              Privacy <span className="text-pd-blue">Policy.</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto italic text-sm md:text-base leading-relaxed">
              At PartyDial, we are committed to protecting your personal data and ensuring your privacy. This policy explains how we handle your information securely.
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
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                <Fingerprint size={14} className="text-pd-purple" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Secure Data Encryption</span>
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
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 italic underline decoration-pd-blue/20 underline-offset-4">Policy Navigation</p>
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
                       <p className="text-[11px] font-medium text-slate-500 italic">privacy@partydial.com</p>
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
                  We collect information that you provide directly to us when you use the PartyDial platform. This includes contact information, venue listing details, and inquiry history.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
                     <Mail size={16} className="text-pd-blue mb-2 group-hover:scale-110 transition-transform" />
                     <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 italic mb-2">Personal Data</h3>
                     <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Name, email address, phone number, and account credentials when you register or make an inquiry.</p>
                  </div>
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
                     <Globe size={16} className="text-pd-purple mb-2 group-hover:scale-110 transition-transform" />
                     <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 italic mb-2">Usage Data</h3>
                     <p className="text-[11px] text-slate-500 font-medium leading-relaxed">IP address, browser type, device info, and how you interact with our venue search features.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2.2 How We Use Data */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} id="usage" className="scroll-mt-24">
              <SectionHeader title="How We Use Data" icon={Eye} color="pd-purple" />
              <div className="space-y-4 text-slate-600 font-medium leading-[1.8] text-sm md:text-base italic border-l-2 border-slate-100 pl-6 md:pl-10 text-justify">
                <p>
                  All collected data is used strictly for enhancing your venue discovery and booking experience. We use your data for:
                </p>
                <ul className="list-none space-y-3 mt-6">
                  {[
                    "Facilitating communication between event planners and venue hosts.",
                    "Personalizing search results based on your preferences.",
                    "Improving platform security and preventing fraudulent activity.",
                    "Sending important updates regarding your inquiries and bookings."
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
                  PartyDial is built on trust. We do not sell your personal information to third-party data brokers. We only share information with:
                </p>
                <div className="p-6 bg-slate-900 rounded-3xl border border-white/5 relative overflow-hidden group mt-6">
                   <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                      <div className="w-12 h-12 rounded-2xl bg-pd-red flex-shrink-0 flex items-center justify-center text-white shadow-xl">
                         <Shield size={24} />
                      </div>
                      <div>
                         <h3 className="text-white font-black italic uppercase tracking-widest mb-1 text-sm">Venue Partners Only</h3>
                         <p className="text-white/50 text-xs font-medium leading-relaxed italic">
                           When you make an inquiry, we share your contact details ONLY with the specific venue owner you requested to contact.
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
                  We employ industry-standard security measures to safeguard your data, including SSL encryption and secure server architectures. Our systems are regularly audited to ensure the highest standards of protection.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {["SSL Encryption", "SOC 2 Type II", "AES-256", "Firewall Control"].map((item, i) => (
                    <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 group hover:border-pd-pink hover:text-pd-pink transition-all cursor-default">
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
                  You have full control over your data on PartyDial. You have the right to access, rectify, or request the deletion of your personal information at any time.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                  <div className="p-4 bg-emerald-400/[0.03] border border-emerald-400/10 rounded-xl text-center group hover:border-emerald-400 transition-all">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic mb-2 leading-none">Access</p>
                      <p className="text-[9px] font-medium text-slate-500 italic">Request a copy of your personal data stored with us.</p>
                  </div>
                  <div className="p-4 bg-emerald-400/[0.03] border border-emerald-400/10 rounded-xl text-center group hover:border-emerald-400 transition-all">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic mb-2 leading-none">Update</p>
                      <p className="text-[9px] font-medium text-slate-500 italic">Modify your account information from your profile dashboard.</p>
                  </div>
                  <div className="p-4 bg-emerald-400/[0.03] border border-emerald-400/10 rounded-xl text-center group hover:border-emerald-400 transition-all">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic mb-2 leading-none">Delete</p>
                      <p className="text-[9px] font-medium text-slate-500 italic">Request permanent removal of your account and data.</p>
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
            <div className="w-16 h-16 rounded-full bg-pd-blue/10 flex items-center justify-center text-pd-blue mx-auto mb-8 border border-white/5 shadow-2xl">
              <Bell size={28} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 italic uppercase tracking-tighter italic">Policy <span className="text-pd-blue">Updates.</span></h2>
            <p className="text-white/50 font-medium mb-12 italic text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              We may update our Privacy Policy to reflect changes in legal requirements or our internal processes. Significant changes will be communicated via email or platform notifications.
            </p>
            <Link href="/contact" className="inline-block">
                <button className="bg-pd-blue text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-pd-blue/80 transition-all active:scale-95 shadow-xl italic leading-none">Reach Our Privacy Team</button>
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
