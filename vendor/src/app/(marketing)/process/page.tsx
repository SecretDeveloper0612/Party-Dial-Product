'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search, ShieldCheck, Zap, ArrowRight, CheckCircle2,
  MessageSquare, Smartphone, Globe, Target, PhoneCall,
  LayoutDashboard, Share2, Shield, Check, Clock,
  InstagramIcon,
  FacebookIcon
} from 'lucide-react';

export default function ProcessPage() {
  return (
    <div suppressHydrationWarning className="bg-white min-h-screen">

      {/* 1. HERO - THE ENGINE */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-pd-pink text-[10px] font-black uppercase tracking-[0.4em] mb-8"
          >
            <Zap size={12} className="fill-pd-pink/10" /> Transparent Acquisition v4
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.1] mb-6"
          >
            How we drive <br />
            <span className="pd-gradient-text italic">Hyper-Growth.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-400 text-lg font-medium leading-relaxed"
          >
            From the moment we spend on ads to the second you receive a high-intent call—explore the tech stack that powers India's elite venues.
          </motion.p>
        </div>

        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-125 h-[500px] bg-pd-blue/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-125 h-[500px] bg-pd-pink/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-20"></div>
      </section>

      {/* 2. THE THREE PILLAR CYCLE - PROFESSIONAL TIMELINE */}
      <section className="py-24 md:py-32 px-6 bg-slate-50 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-linear-to-b from-pd-pink/5 to-transparent blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-[1200px] mx-auto relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-24">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
               <Target size={12} className="text-pd-pink" /> Core Methodology
             </div>
             <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] tracking-tight uppercase mb-6">
               The Acquisition Engine
             </h2>
             <p className="text-slate-500 font-medium max-w-2xl mx-auto text-base">
               A seamless, three-step pipeline engineered to bring high-intent customers directly to your venue, fully vetted and ready to book.
             </p>
          </div>

          <div className="relative mt-12 lg:mt-20">
            {/* Horizontal Line for Desktop */}
            <div className="hidden lg:block absolute top-[28px] left-[16%] right-[16%] h-px bg-slate-200 z-0"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative z-10">
              {[
                {
                  title: "Inbound Capture",
                  subtitle: "Omnichannel Ads",
                  platforms: [
                    { n: "Google Ads", icon: <Search size={14} />, c: "from-blue-500 to-green-500" },
                    { n: "Instagram Ads", icon: <InstagramIcon size={14} />, c: "from-purple-500 to-pink-500" },
                    { n: "Facebook Ads", icon: <FacebookIcon size={14} />, c: "from-sky-500 to-indigo-500" }
                  ],
                  desc: "We deploy aggressive quarterly budgets into Google Ads and Meta platforms to drive thousands of monthly visitors specifically looking for venues in your region."
                },
                {
                  title: "Quality Verification",
                  subtitle: "Zero-Bypass Filtering",
                  platforms: [
                    { n: "Mobile OTP", icon: <Smartphone size={14} />, c: "from-emerald-500 to-teal-500" },
                    { n: "Intent Analysis", icon: <Target size={14} />, c: "from-rose-500 to-orange-500" },
                    { n: "Budget Check", icon: <CheckCircle2 size={14} />, c: "from-amber-500 to-yellow-500" }
                  ],
                  desc: "Every enquiry is pre-qualified. Our system verifies the customer’s WhatsApp number and ensures their budget and event-type match your venue profile."
                },
                {
                  title: "Direct Routing",
                  subtitle: "Priority Delivery",
                  platforms: [
                    { n: "Real-time Email", icon: <MessageSquare size={14} />, c: "from-green-500 to-emerald-500" },
                    { n: "Exclusive Calls", icon: <PhoneCall size={14} />, c: "from-blue-600 to-sky-400" },
                    { n: "Partner Dashboard", icon: <LayoutDashboard size={14} />, c: "from-slate-700 to-slate-900" }
                  ],
                  desc: "Speed to lead is king. We route enquiries directly to your Email in < 2 seconds, ensuring you are the first one the customer speaks to."
                }
              ].map((pillar, i) => (
                <div key={i} className="relative flex flex-col group">
                   
                   {/* Horizontal Timeline Node */}
                   <div className="w-14 h-14 bg-slate-50 border-[4px] border-white rounded-full flex items-center justify-center z-10 shadow-sm mx-auto mb-8 group-hover:border-pd-pink/20 transition-colors duration-500 relative">
                      <span className="text-sm font-black text-slate-400 group-hover:text-pd-pink transition-colors duration-500">0{i+1}</span>
                   </div>

                   {/* Content Card */}
                   <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-slate-200 hover:-translate-y-2 flex-1 flex flex-col">
                      <div className="mb-6 text-center lg:text-left">
                         <span className="text-[10px] font-black text-pd-pink uppercase tracking-widest">{pillar.subtitle}</span>
                      </div>
                      <h3 className="text-2xl font-black text-[#0F172A] tracking-tight uppercase mb-4 text-center lg:text-left">{pillar.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1 text-center lg:text-left">{pillar.desc}</p>
                      
                      <div className="space-y-3 border-t border-slate-100 pt-8 mt-auto">
                        {pillar.platforms.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-300">
                             <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${p.c} text-white flex items-center justify-center shadow-sm shrink-0`}>
                               {p.icon}
                             </div>
                             <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide">{p.n}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                   
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. DIGITAL HQ DEEP DIVE */}
      {/* 3. DIGITAL HQ DEEP DIVE */}
      {/* 3. DIGITAL HQ DEEP DIVE */}
      <section className="py-24 md:py-32 bg-slate-50 border-y border-slate-100 px-6 overflow-hidden">
        <div className="max-w-[1440px] mx-auto lg:px-12 lg:grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - Content */}
          <div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight uppercase leading-[1.1] mb-6">
              Your <span className="pd-gradient-text italic">Digital HQ.</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-12 max-w-xl">
              Unlike generic listing sites, each PartyDial partner gets a dedicated professional microsite.
              This isn't just a profile—it's a high-conversion landing page optimized for mobile booking.
            </p>

            <div className="space-y-4">
              {[
                { t: "Exclusive Call Line", d: "Calls from your page go directly to you. We never rotate your leads to competitors.", i: <PhoneCall size={18} /> },
                { t: "Verified Review Engine", d: "Build trust with authentic customer reviews managed directly from your dashboard.", i: <CheckCircle2 size={18} /> },
                { t: "SEO Booster", d: "Your microsite is indexed by Google, giving you organic visibility beyond our platform.", i: <Globe size={18} /> }
              ].map((item, i) => (
                <div key={i} className="group flex items-start gap-5 p-5 bg-white border border-slate-100 rounded-[28px] hover:border-slate-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-500 ease-out cursor-default">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-pd-pink flex items-center justify-center group-hover:scale-110 group-hover:bg-pd-pink group-hover:text-white transition-all duration-500 ease-out shadow-sm">
                    {item.i}
                  </div>
                  <div>
                    <h4 className="text-base font-black uppercase tracking-tight text-slate-900 mb-1">{item.t}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="mt-16 lg:mt-0 relative group">
            <div className="aspect-4/3 bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden relative transition-transform duration-700 ease-out hover:scale-[1.02]">
              <img
                src="/images/dashboard-process.png"
                alt="PartyDial Digital HQ"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Floating Mobile Badge - Static but highly interactive to avoid lag */}
            <div className="absolute -bottom-8 -right-4 lg:-bottom-10 lg:-right-10 w-64 bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-slate-700 z-10 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 ease-out cursor-default">
              <div className="flex items-center gap-3 mb-2">
                <PhoneCall size={16} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-100">Live Direct Line</span>
              </div>
              <p className="text-xs text-slate-400 font-bold">1:1 Distribution Active</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. COMPARISON SECTION - REDESIGNED FOR MOBILE & IMPACT */}
      <section className="py-24 md:py-40 px-6 bg-[#0B1121] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-pd-pink/30 to-transparent"></div>
        <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-pd-blue/10 rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute -bottom-[200px] -left-[200px] w-[600px] h-[600px] bg-pd-pink/10 rounded-full blur-[150px] opacity-20"></div>

        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="text-center mb-20 md:mb-32">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-pd-pink text-[10px] font-black uppercase tracking-[0.4em] mb-8"
            >
              The Performance Gap
            </motion.div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.1] mb-8">
              Superior <br className="md:hidden" />
              <span className="pd-gradient-text italic">Acquisition.</span>
            </h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto text-base md:text-lg">
              We don't just list venues. We engineer a high-velocity acquisition pipeline that standard platforms can't match.
            </p>
          </div>

          {/* COMPARISON CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                label: "Lead Ownership",
                icon: <Smartphone size={24} />,
                others: "Shared with 5+ competitors",
                pd: "100% Exclusive (1:1)",
                desc: "Leads from your page go only to you. No price wars."
              },
              {
                label: "Verification Level",
                icon: <ShieldCheck size={24} />,
                others: "Basic Email Only",
                pd: "Dual-Layer (OTP + Intent)",
                desc: "Every caller is verified via WhatsApp OTP before connection."
              },
              {
                label: "Response Speed",
                icon: <Clock size={24} />,
                others: "Delayed (30-60 mins)",
                pd: "Real-time (< 2 Seconds)",
                desc: "Inbound calls routed to your mobile in under 2 seconds."
              },
              {
                label: "Branding Depth",
                icon: <Globe size={24} />,
                others: "Generic Catalog Profile",
                pd: "Dedicated Digital HQ",
                desc: "A professional landing page optimized for venue conversions."
              },
              {
                label: "Distribution Logic",
                icon: <Zap size={24} />,
                others: "Rotating / Scheduled",
                pd: "Priority Instant Routing",
                desc: "You get the lead the moment the intent is captured."
              },
              {
                label: "Growth Support",
                icon: <Target size={24} />,
                others: "Help Center / Ticketing",
                pd: "Personal Growth Advisor",
                desc: "Direct access to experts to optimize your venue performance."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                {/* Card Body */}
                <div className="h-full bg-white/5 border border-white/10 rounded-4xl p-8 md:p-10 transition-all duration-500 hover:bg-white/10 hover:border-pd-pink/30 hover:translate-y-[-8px]">
                  {/* Icon & Label */}
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-pd-pink/10 text-pd-pink flex items-center justify-center shadow-lg shadow-pd-pink/5">
                      {feature.icon}
                    </div>
                    <h3 className="text-sm md:text-base font-black text-white uppercase tracking-tight">{feature.label}</h3>
                  </div>

                  {/* Comparison Grid */}
                  <div className="space-y-6">
                    <div className="space-y-2 opacity-40 grayscale transition-all group-hover:grayscale-0 group-hover:opacity-60">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Industry Standard</span>
                      <p className="text-xs font-bold text-slate-300">{feature.others}</p>
                    </div>

                    <div className="h-px bg-white/10 w-full"></div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-pd-pink uppercase tracking-widest">The PartyDial Edge</span>
                        <div className="h-1 flex-1 bg-pd-pink/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-pd-pink"
                          />
                        </div>
                      </div>
                      <p className="text-base font-black text-white uppercase tracking-tight">{feature.pd}</p>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Subtle Glow */}
                <div className="absolute -inset-1 bg-linear-to-r from-pd-pink to-pd-blue rounded-[34px] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-24 md:py-32 px-6 text-center">
        <div className="max-w-[1440px] mx-auto lg:px-12">
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight uppercase leading-[1.1] mb-12">
            Ready to <span className="pd-gradient-text italic">Scale?</span>
          </h3>
          <div className="flex flex-wrap gap-8 justify-center items-center">
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic shadow-2xl"
              >
                Sign Up Now
              </motion.button>
            </Link>
            <span className="text-slate-400 font-black text-[10px] uppercase">or</span>
            <Link href="/contact" className="text-pd-pink font-black text-[10px] uppercase tracking-widest hover:underline transition-all">
              Talk to Growth Expert
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
