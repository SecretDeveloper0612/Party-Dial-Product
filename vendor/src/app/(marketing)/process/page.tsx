'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search, ShieldCheck, Zap, ArrowRight, CheckCircle2,
  MessageSquare, Smartphone, Globe, Target, PhoneCall,
  LayoutDashboard, Share2, Shield, Check, Clock,
  InstagramIcon,
  FacebookIcon,
  MousePointer2,
  BarChart3
} from 'lucide-react';

export default function ProcessPage() {
  return (
    <div suppressHydrationWarning className="bg-slate-50 min-h-screen pt-24 pb-12 font-pd text-slate-600">
      
      {/* 1. HERO - MODERN, CLEAN, SPATIAL */}
      <section className="relative pt-16 md:pt-28 pb-24 overflow-hidden bg-slate-50">
        <div className="absolute top-0 inset-x-0 h-64 bg-linear-to-b from-slate-100 to-transparent"></div>
        
        {/* Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pd-pink/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/4 w-[500px] h-[500px] bg-pd-blue/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

        <div className="max-w-[1000px] mx-auto px-6 lg:px-12 text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm mb-8"
          >
            <Zap size={14} className="text-pd-pink" fill="currentColor" /> 
            <span>The PartyDial Engine</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold font-sf text-slate-900 tracking-tight leading-[1.1] mb-8"
          >
            How We Drive <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-blue via-purple-500 to-pd-pink">Hyper-Growth.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-normal leading-relaxed"
          >
            From the moment we spend on ads to the second you receive a high-intent call—explore the tech stack that powers India's elite venues.
          </motion.p>
        </div>
      </section>

      {/* 2. THE THREE PILLAR CYCLE - BENTO GRID DESIGN */}
      <section className="py-24 px-6 relative">
        <div className="max-w-[1200px] mx-auto relative z-10">
          
          <div className="text-center mb-16 md:mb-24">
             <h2 className="text-3xl md:text-5xl font-semibold font-sf text-slate-900 tracking-tight mb-4">
               The Acquisition Engine
             </h2>
             <p className="text-slate-500 font-normal max-w-2xl mx-auto text-base md:text-lg">
               A seamless, three-step pipeline engineered to bring high-intent customers directly to your venue.
             </p>
          </div>

          {/* BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            
            {/* Step 1: Inbound Capture */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row gap-8 items-center overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full -z-0 transition-transform duration-700 group-hover:scale-110"></div>
              
              <div className="flex-1 relative z-10">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Search size={24} />
                </div>
                <h3 className="text-2xl font-semibold font-sf text-slate-900 mb-3">1. Inbound Capture</h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  We deploy aggressive budgets into Google and Meta to intercept customers actively searching for venues in your specific region.
                </p>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-red-500 border border-slate-100"><Search size={16}/></div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-pink-500 border border-slate-100"><InstagramIcon size={16}/></div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100"><FacebookIcon size={16}/></div>
                </div>
              </div>
              
              <div className="flex-1 w-full relative z-10">
                {/* Mock UI */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-4">
                    <Search size={16} className="text-slate-400" />
                    <div className="text-sm text-slate-600 font-medium">Wedding venues near me</div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-20 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                      <div className="w-8 h-3 bg-slate-200 rounded-full mb-2"></div>
                      <div className="w-3/4 h-4 bg-pd-blue/20 rounded-full mb-2"></div>
                      <div className="w-1/2 h-3 bg-slate-100 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2: Quality Verification */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-bl-full -z-0 transition-transform duration-700 group-hover:scale-110"></div>
              
              <div className="relative z-10 flex-1">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-2xl font-semibold font-sf text-slate-900 mb-3">2. Quality Verification</h3>
                <p className="text-slate-500 leading-relaxed">
                  Every enquiry is pre-qualified. We verify their WhatsApp number and ensure their budget matches your venue profile.
                </p>
              </div>

              <div className="mt-8 bg-slate-50 rounded-2xl p-4 border border-slate-100 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500">OTP Verification</span>
                  <CheckCircle2 size={14} className="text-emerald-500" />
                </div>
                <div className="flex gap-2 justify-center">
                  {[4,8,2,9].map((n, i) => (
                    <div key={i} className="w-8 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-sf font-semibold text-slate-700">{n}</div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Step 3: Direct Routing */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-3 bg-slate-900 rounded-[32px] p-8 md:p-16 shadow-2xl flex flex-col md:flex-row gap-12 items-center overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pd-pink/10 rounded-full blur-[100px] -z-0 transition-transform duration-700 group-hover:scale-110 translate-x-1/3 -translate-y-1/3"></div>
              
              <div className="flex-1 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-6">
                  <Zap size={14} className="text-yellow-400" fill="currentColor" /> &lt; 2 Seconds
                </div>
                <h3 className="text-3xl md:text-4xl font-semibold font-sf text-white mb-4">3. Direct Routing</h3>
                <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl">
                  Speed to lead is king. We route enquiries directly to your Email and phone in under 2 seconds. No shared leads. No price wars. Just you and the customer.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-4 py-2 rounded-xl"><PhoneCall size={16}/> Instant Calls</div>
                  <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-4 py-2 rounded-xl"><MessageSquare size={16}/> Real-time SMS</div>
                  <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-4 py-2 rounded-xl"><LayoutDashboard size={16}/> Partner Portal</div>
                </div>
              </div>
              
              <div className="w-full md:w-[400px] relative z-10">
                <div className="bg-white rounded-2xl p-6 shadow-2xl relative">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-pd-pink text-white rounded-full flex items-center justify-center shadow-lg shadow-pd-pink/30 animate-bounce">
                    <PhoneCall size={20} fill="currentColor" />
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Search size={20} />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-semibold">New Enquiry!</h4>
                      <p className="text-slate-500 text-sm">Via PartyDial</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 text-sm">Guest Count</span>
                      <span className="text-slate-900 font-semibold text-sm">250-300</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500 text-sm">Event Date</span>
                      <span className="text-slate-900 font-semibold text-sm">Oct 18, 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. DIGITAL HQ DEEP DIVE - GLASSMORPHISM LAYOUT */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="bg-white border border-slate-200 rounded-[40px] p-8 md:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] grid lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="text-3xl md:text-5xl font-semibold font-sf text-slate-900 tracking-tight leading-tight mb-6">
                Your <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-blue via-purple-500 to-pd-pink">Digital HQ.</span>
              </h2>
              <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-10 max-w-xl">
                Unlike generic listing sites, each PartyDial partner gets a dedicated professional microsite.
                This isn't just a profile—it's a high-conversion landing page optimized for mobile booking.
              </p>

              <div className="space-y-6">
                {[
                  { t: "Exclusive Call Line", d: "Calls from your page go directly to you.", i: <PhoneCall size={20} /> },
                  { t: "Verified Review Engine", d: "Build trust with authentic customer reviews.", i: <CheckCircle2 size={20} /> },
                  { t: "SEO Booster", d: "Your microsite is indexed heavily by Google.", i: <Globe size={20} /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-5">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-pd-pink/10 text-pd-pink flex items-center justify-center shadow-sm">
                      {item.i}
                    </div>
                    <div>
                      <h4 className="text-base font-semibold font-sf text-slate-900 mb-1">{item.t}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-[4/3] bg-slate-50 rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative group-hover:shadow-2xl transition-all duration-500">
                <img
                  src="/images/dashboard-process.png"
                  alt="PartyDial Digital HQ"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <MousePointer2 size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Conversion Rate</div>
                  <div className="text-lg font-semibold text-slate-900">12.4% <span className="text-emerald-500 text-xs">↑</span></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. COMPARISON SECTION - SLEEK TABLE */}
      <section className="py-24 px-6 relative">
        <div className="max-w-[1000px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold font-sf text-slate-900 tracking-tight mb-4">
              The <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-blue via-purple-500 to-pd-pink">PartyDial Advantage</span>
            </h2>
            <p className="text-slate-500 font-normal max-w-2xl mx-auto text-base">
              See why top venues are switching to PartyDial for their primary acquisition.
            </p>
          </div>

          <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-6 text-sm font-semibold font-sf text-slate-900 text-center md:text-left">
              <div className="hidden md:block">Feature</div>
              <div>Industry Standard</div>
              <div className="text-pd-pink flex items-center justify-center md:justify-start gap-2"><Zap size={16} fill="currentColor" /> PartyDial Edge</div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {[
                { label: "Lead Ownership", others: "Shared (5+ venues)", pd: "100% Exclusive (1:1)" },
                { label: "Verification Level", others: "Basic Email Only", pd: "Dual-Layer (OTP + Intent)" },
                { label: "Response Speed", others: "Delayed (30-60 mins)", pd: "Real-time (< 2 Secs)" },
                { label: "Branding Depth", others: "Generic Catalog Profile", pd: "Dedicated Digital HQ" },
                { label: "Distribution Logic", others: "Rotating / Scheduled", pd: "Priority Instant Routing" }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-2 md:grid-cols-3 p-6 items-center transition-colors hover:bg-slate-50/50">
                  <div className="hidden md:block text-slate-700 font-medium">{row.label}</div>
                  <div className="text-slate-500 text-sm md:text-base text-center md:text-left">{row.others}</div>
                  <div className="text-slate-900 font-semibold text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> {row.pd}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-20 md:py-28 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-white p-10 md:p-16 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-semibold font-sf text-slate-900 tracking-tight leading-tight mb-6">
              Ready to <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-blue via-purple-500 to-pd-pink">Scale?</span>
            </h3>
            <p className="text-slate-500 mb-10 max-w-md mx-auto">
              Join PartyDial today and start building your digital presence with India's fastest-growing venue platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 bg-pd-pink hover:bg-rose-600 text-white rounded-2xl text-sm font-semibold shadow-xl shadow-pd-pink/30 transition-all whitespace-nowrap"
                >
                  Become a PartyDial Partner →
                </motion.button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl text-sm font-semibold border border-slate-200 shadow-sm transition-all whitespace-nowrap">
                  Talk to Growth Expert
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
