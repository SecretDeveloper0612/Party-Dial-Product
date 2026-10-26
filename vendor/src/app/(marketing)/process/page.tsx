'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShieldCheck, Zap, ArrowRight, CheckCircle2,
  MessageSquare, Smartphone, Globe, Target, PhoneCall,
  LayoutDashboard, Share2, Shield, Check, Clock,
  InstagramIcon,
  FacebookIcon,
  MousePointer2,
  BarChart3,
  Calendar,
  Users,
  Award,
  Sparkles,
  TrendingUp,
  Lock,
  Percent,
  Rocket,
  HeartHandshake,
  BadgePercent,
  UserCheck,
  ChevronDown,
  HelpCircle
} from 'lucide-react';

export default function ProcessPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div suppressHydrationWarning className="bg-slate-50 min-h-screen pt-20 pb-12 font-pd text-slate-600">
      
      {/* 1. HERO - HOW PARTYDIAL WORKS (FULL SCREEN SPLIT HERO WITH ORIGINAL IPHONE 18 PRO MAX) */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center py-6 sm:py-8 lg:py-10 overflow-hidden bg-slate-50">
        {/* Ambient atmospheric glow & micro-grid */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
          <div className="absolute -top-24 right-1/4 w-[600px] h-[450px] bg-gradient-to-b from-pd-pink/15 via-purple-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Value Proposition & Interactive Step Highlights (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Eyebrow badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold font-poppins text-slate-800 uppercase tracking-wider">
                  How PartyDial Works
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 font-semibold font-poppins text-emerald-700 border border-emerald-200/60">
                  Direct Inbound Engine
                </span>
              </motion.div>

              {/* Primary Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-[54px] font-semibold font-poppins text-slate-900 tracking-tight leading-[1.12] mb-6"
              >
                Real Customers Searching. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pd-pink via-purple-600 to-pd-blue">
                  Calling Your Phone Direct.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-600 text-base sm:text-lg font-normal font-poppins leading-relaxed max-w-xl mb-8"
              >
                We capture event planners actively booking in your city, verify their date & guest budget with mobile OTP, and ring your venue directly. No commissions. Zero shared competitors.
              </motion.p>

              {/* 3 Value Pillars */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8"
              >
                <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold font-poppins text-slate-900">1:1 Exclusive</span>
                  </div>
                  <p className="text-[11px] font-normal font-poppins text-slate-500">
                    Lead is only given to you, not 5 competitors.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={16} className="text-amber-500 shrink-0" />
                    <span className="text-xs font-semibold font-poppins text-slate-900">&lt; 2s Delivery</span>
                  </div>
                  <p className="text-[11px] font-normal font-poppins text-slate-500">
                    Instant WhatsApp & phone notification.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={16} className="text-blue-500 shrink-0" />
                    <span className="text-xs font-semibold font-poppins text-slate-900">0% Commission</span>
                  </div>
                  <p className="text-[11px] font-normal font-poppins text-slate-500">
                    100% of event revenue stays in your pocket.
                  </p>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
              >
                <Link href="/login" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-7 py-3.5 bg-pd-pink hover:bg-rose-600 text-white rounded-full font-semibold font-poppins text-xs uppercase tracking-wider shadow-md shadow-pd-pink/25 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Become a PartyDial Partner
                    <ArrowRight size={15} />
                  </motion.button>
                </Link>

                <a href="#pipeline" className="w-full sm:w-auto">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 rounded-full font-semibold font-poppins text-xs uppercase tracking-wider border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    View Step-by-Step Flow ↓
                  </button>
                </a>
              </motion.div>
            </div>

            {/* Right Column: Live Simulated Smartphone with WhatsApp Lead Animation (5 Cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="lg:col-span-5 flex justify-center relative"
            >
              {/* Outer Decorative Glow Rings */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-pd-pink/25 via-purple-500/20 to-emerald-400/25 rounded-[60px] blur-3xl opacity-70 pointer-events-none" />

              {/* iPhone 18 Pro Max Chassis Container (Matching Original iPhone Mockup Proportions) */}
              <div className="relative z-10 w-[300px] sm:w-[325px]">
                
                {/* Hardware Side Buttons matching uploaded mockup */}
                {/* Left Side: Action Button + Volume Up + Volume Down */}
                <div className="absolute -left-[3px] top-[125px] w-[3px] h-6 bg-gradient-to-b from-[#5c2d3c] via-[#3a1523] to-[#1f0a12] rounded-l-xs shadow-xs border-l border-white/20" title="Action Button" />
                <div className="absolute -left-[3px] top-[162px] w-[3px] h-11 bg-gradient-to-b from-[#5c2d3c] via-[#3a1523] to-[#1f0a12] rounded-l-xs shadow-xs border-l border-white/20" title="Volume Up" />
                <div className="absolute -left-[3px] top-[222px] w-[3px] h-11 bg-gradient-to-b from-[#5c2d3c] via-[#3a1523] to-[#1f0a12] rounded-l-xs shadow-xs border-l border-white/20" title="Volume Down" />
                
                {/* Right Side: Siri / Power Button */}
                <div className="absolute -right-[3px] top-[175px] w-[3px] h-15 bg-gradient-to-b from-[#5c2d3c] via-[#3a1523] to-[#1f0a12] rounded-r-xs shadow-xs border-r border-white/20" title="Power Button" />

                {/* iPhone Pro Deep Plum Titanium Chassis Frame from Mockup */}
                <div className="relative bg-gradient-to-b from-[#4d1f30] via-[#240c17] to-[#15060d] rounded-[50px] p-[7px] shadow-[0_20px_70px_-15px_rgba(20,5,15,0.7),0_0_0_1.5px_rgba(255,255,255,0.18)_inset,0_0_0_1px_rgba(142,107,120,0.4)]">
                  
                  {/* Subtle Inner Bezel Edge (Near Black with Ceramic Gleam) */}
                  <div className="relative bg-[#0d0408] rounded-[44px] p-[2px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">

                    {/* Speaker Ear-piece Slit */}
                    <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-11 h-[2.5px] bg-[#1a0811] rounded-full border border-black/60 z-30 pointer-events-none" />

                    {/* Inner Super Retina XDR Display */}
                    <div className="bg-[#EFEAE2] rounded-[42px] overflow-hidden flex flex-col min-h-[580px] relative">
                      
                      {/* Top Status Bar with Matching Dynamic Island */}
                      <div className="bg-[#075E54] text-white pt-2.5 pb-2 px-4 flex items-center justify-between relative z-20">
                        {/* Left: Time */}
                        <span className="text-[11px] font-semibold tracking-tight text-white/90 font-poppins select-none w-10">
                          9:41
                        </span>

                        {/* Centered Dynamic Island Pill matching mockup proportions */}
                        <div className="h-[22px] w-[74px] sm:w-[78px] bg-black rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.8)] flex items-center justify-between px-2 border border-white/10 shrink-0">
                          {/* Front Camera Lens */}
                          <div className="w-2 h-2 rounded-full bg-slate-950 ring-1 ring-blue-500/40 flex items-center justify-center">
                            <span className="w-1 h-1 rounded-full bg-blue-400 blur-[0.2px]" />
                          </div>
                          {/* FaceID / Mic sensor */}
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-950 ring-1 ring-purple-500/20 flex items-center justify-center">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                          </div>
                        </div>

                        {/* Right: Cellular, WiFi, Battery Icons */}
                        <div className="flex items-center gap-1.5 text-white/90 select-none w-10 justify-end">
                          {/* 5G Signal */}
                          <svg className="w-3.5 h-2.5 fill-current" viewBox="0 0 16 12">
                            <rect x="0" y="9" width="2" height="3" rx="0.5" />
                            <rect x="3.5" y="6" width="2" height="6" rx="0.5" />
                            <rect x="7" y="3" width="2" height="9" rx="0.5" />
                            <rect x="10.5" y="0" width="2" height="12" rx="0.5" />
                          </svg>
                          {/* Battery Pill */}
                          <div className="w-5 h-2.5 border border-white/70 rounded-[3px] p-[1px] flex items-center">
                            <div className="h-full w-full bg-emerald-400 rounded-[1.5px]" />
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp App Header Bar */}
                      <div className="bg-[#075E54] text-white px-3 pb-2 pt-0.5 flex items-center justify-between shadow-md relative z-10 border-t border-emerald-700/30">
                      <div className="flex items-center gap-2">
                        {/* WhatsApp Back Chevron */}
                        <svg className="w-4 h-4 text-emerald-100" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        {/* Profile Avatar */}
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pd-pink to-purple-600 text-white flex items-center justify-center font-bold font-poppins text-[11px] shadow-sm ring-1 ring-white/30">
                            PD
                          </div>
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1 ring-white" />
                        </div>
                        {/* Partner Name & Subtitle */}
                        <div>
                          <div className="text-xs font-semibold font-poppins leading-tight flex items-center gap-1">
                            PartyDial Partner Bot
                            <ShieldCheck size={13} className="text-emerald-300 shrink-0" />
                          </div>
                          <div className="text-[10px] text-emerald-100 font-normal font-poppins">
                            Online • Instant Alerts
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-emerald-100 pr-1">
                        <PhoneCall size={15} className="hover:text-white transition-colors cursor-pointer" />
                        <MessageSquare size={15} className="hover:text-white transition-colors cursor-pointer" />
                      </div>
                    </div>

                    {/* Chat Background Subtle Pattern Overlay */}
                    <div 
                      className="absolute inset-0 top-[88px] opacity-[0.04] pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(#075E54 1px, transparent 1px)`,
                        backgroundSize: '16px 16px'
                      }}
                    />

                    {/* Chat Timeline & Lead Message Bubble */}
                    <div className="p-3 flex-1 flex flex-col justify-end space-y-2.5 relative z-10">
                      
                      {/* Timestamp Pill */}
                      <div className="text-center my-0.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-white/80 text-slate-500 text-[9px] font-semibold font-poppins shadow-2xs uppercase tracking-wide">
                          TODAY • JUST NOW
                        </span>
                      </div>

                      {/* Simulation Message 1: Incoming Exclusive Lead */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-2xl rounded-tl-xs p-3 shadow-md border border-slate-200/70 max-w-[94%]"
                      >
                        {/* Badge in message */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-semibold font-poppins border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 size={10} className="text-emerald-600" />
                            VERIFIED HIGH-INTENT
                          </span>
                          <span className="text-[9px] font-normal font-poppins text-slate-400">18:24</span>
                        </div>

                        <div className="text-xs font-semibold font-poppins text-slate-900 mb-1.5 flex items-center gap-1">
                          <span>🎉</span> New Direct Venue Enquiry!
                        </div>

                        {/* Lead Details Table */}
                        <div className="bg-slate-50/80 rounded-xl p-2 space-y-1.5 text-[11px] font-poppins border border-slate-100 mb-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-normal">Customer:</span>
                            <span className="font-semibold text-slate-800">Aarav Sharma</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-normal">Occasion:</span>
                            <span className="font-semibold text-pd-pink">Wedding Reception</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-normal">Expected Guests:</span>
                            <span className="font-semibold text-slate-800">350 - 400 Pax</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-normal">Target Date:</span>
                            <span className="font-semibold text-slate-800">Nov 18, 2026</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-normal">Estimated Budget:</span>
                            <span className="font-semibold text-emerald-600">₹3,50,000</span>
                          </div>
                        </div>

                        {/* Verification Status */}
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium font-poppins mb-2 bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-100">
                          <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
                          <span>OTP Verified: +91 98765-XXXXX</span>
                        </div>

                        {/* Quick Call Action button */}
                        <div className="pt-1 border-t border-slate-100 flex gap-2">
                          <button
                            type="button"
                            className="flex-1 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg text-[11px] font-semibold font-poppins flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-[0.98] transition-transform"
                          >
                            <PhoneCall size={12} /> Call Customer Now
                          </button>
                        </div>
                      </motion.div>

                      {/* Simulation Message 2: Partner Direct Routing Reassurance */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="bg-[#DCF8C6] rounded-2xl rounded-tr-xs p-2.5 shadow-xs border border-emerald-100 self-end max-w-[88%]"
                      >
                        <p className="text-[11px] font-normal font-poppins text-slate-800 leading-snug">
                          ✨ Exclusive to your venue profile. No other venues received this lead.
                        </p>
                        <div className="text-right text-[8px] font-normal text-slate-400 mt-1 flex items-center justify-end gap-1">
                          <span>18:24</span>
                          <span className="text-blue-500 font-bold">✓✓</span>
                        </div>
                      </motion.div>

                    </div>

                    {/* Simulated Floating Call Notification Banner */}
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="mx-3 mb-2 p-2.5 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700/80 flex items-center justify-between relative z-10"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
                          <PhoneCall size={13} className="text-white" />
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold font-poppins leading-tight">
                            Direct Host Inbound
                          </div>
                          <div className="text-[9px] text-slate-300 font-normal font-poppins">
                            Connected in &lt; 2 seconds
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-semibold font-poppins bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        LIVE
                      </span>
                    </motion.div>

                    {/* iPhone 18 Bottom Home Swipe Indicator Bar */}
                    <div className="w-full pb-2 pt-1 flex justify-center bg-[#EFEAE2] relative z-20">
                      <div className="w-32 h-1 bg-slate-400/80 rounded-full" />
                    </div>

                  </div>
                </div>
              </div>

                {/* Floating Reassurance Badges outside iPhone (Offset so they don't cover header or crop screen) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="hidden md:flex absolute -left-12 top-28 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border border-slate-200/80 items-center gap-2.5 z-30"
                >
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold font-poppins text-slate-900">Zero Middleman</div>
                    <div className="text-[9.5px] font-normal font-poppins text-slate-500">100% direct customer contact</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="hidden md:flex absolute -right-8 bottom-10 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border border-slate-200/80 items-center gap-2.5 z-30"
                >
                  <div className="w-7 h-7 rounded-xl bg-pd-pink/10 text-pd-pink flex items-center justify-center shadow-2xs">
                    <Zap size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold font-poppins text-slate-900">OTP Pre-Qualified</div>
                    <div className="text-[9.5px] font-normal font-poppins text-slate-500">Verified mobile numbers only</div>
                  </div>
                </motion.div>

              </div>

            </motion.div>

          </div>
        </div>
      </section>



      {/* 2. HOW PARTYDIAL GENERATES LEADS (MULTI-CHANNEL INBOUND INFRASTRUCTURE) */}
      <section id="pipeline" className="py-20 md:py-28 px-5 sm:px-8 lg:px-12 relative overflow-hidden bg-slate-50 border-b border-slate-100">
        {/* Ambient lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-pd-pink/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-semibold font-poppins uppercase tracking-wider mb-4 shadow-2xs"
            >
              <Target size={13} className="text-blue-600" />
              <span>Multi-Channel Acquisition</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-semibold font-poppins text-slate-900 tracking-tight leading-[1.15] mb-4"
            >
              How PartyDial <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pd-pink">
                Generates High-Intent Leads
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 font-normal font-poppins text-sm sm:text-base leading-relaxed"
            >
              We run always-on, hyper-targeted campaigns across 4 precision channels to capture customers at the exact moment they are deciding where to host their event.
            </motion.p>
          </div>

          {/* 4 Generation Channels Grid with Rich Visuals & Minimal Text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            
            {/* Channel 1: High-Intent Google Search */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.25, ease: 'easeOut' }
              }}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_35px_-10px_rgba(37,99,235,0.15)] hover:border-blue-300 transition-all flex flex-col justify-between group relative overflow-hidden cursor-default"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-80 group-hover:h-1.5 transition-all duration-300" />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-2xs"
                  >
                    <Search size={20} />
                  </motion.div>
                  <span className="text-[10px] font-semibold font-poppins uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50">
                    Search Ads
                  </span>
                </div>

                <h3 className="text-lg font-semibold font-poppins text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  Google Search Intent
                </h3>
                <p className="text-xs font-normal font-poppins text-slate-500 mb-4">
                  Captures buyers searching with instant booking intent.
                </p>

                {/* Visual UI: Simulated Google Ad Result */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 mb-4 space-y-2 group-hover:bg-blue-50/30 transition-colors">
                  <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 text-[11px] font-poppins text-slate-700 shadow-2xs">
                    <Search size={12} className="text-blue-500 shrink-0" />
                    <span className="font-medium truncate">Wedding banquet near me</span>
                  </div>
                  <div className="bg-white rounded-xl p-2 border border-slate-100 shadow-2xs">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-semibold font-poppins bg-emerald-50 text-emerald-700 px-1 rounded">Ad #1</span>
                      <span className="text-[10px] font-semibold font-poppins text-slate-900 truncate">Your Venue Name</span>
                    </div>
                    <div className="w-full bg-blue-100/60 h-1.5 rounded-full mb-1"></div>
                    <div className="w-2/3 bg-slate-100 h-1.5 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold font-poppins text-slate-700">
                <span className="text-slate-500 font-normal">Intent Score:</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">98% High</span>
              </div>
            </motion.div>

            {/* Channel 2: Meta Hyper-Local Retargeting */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.25, ease: 'easeOut' }
              }}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_35px_-10px_rgba(236,72,153,0.15)] hover:border-pink-300 transition-all flex flex-col justify-between group relative overflow-hidden cursor-default"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-400 opacity-80 group-hover:h-1.5 transition-all duration-300" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    whileHover={{ rotate: -12, scale: 1.1 }}
                    className="w-11 h-11 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-rose-500 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-2xs"
                  >
                    <InstagramIcon size={20} />
                  </motion.div>
                  <span className="text-[10px] font-semibold font-poppins uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200/50">
                    Social Video
                  </span>
                </div>

                <h3 className="text-lg font-semibold font-poppins text-slate-900 mb-1 group-hover:text-pink-600 transition-colors">
                  Instagram & Meta Ads
                </h3>
                <p className="text-xs font-normal font-poppins text-slate-500 mb-4">
                  Targeted reels shown to couples in your city.
                </p>

                {/* Visual UI: Simulated Instagram Ad Reel Card */}
                <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-200/80 mb-4 group-hover:bg-pink-50/30 transition-colors">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-3 text-white relative overflow-hidden shadow-sm">
                    <div className="absolute top-2 right-2 text-[9px] font-semibold bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded text-white">
                      Sponsored
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-[9px] font-bold">
                        PD
                      </div>
                      <span className="text-[10px] font-semibold font-poppins truncate">Explore Luxury Halls</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
                      <span className="text-slate-300">Geo Target:</span>
                      <span className="text-pink-300 font-semibold">10km Radius</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold font-poppins text-slate-700">
                <span className="text-slate-500 font-normal">Geo Radius:</span>
                <span className="text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md font-semibold">Local Only</span>
              </div>
            </motion.div>

            {/* Channel 3: Organic Local SEO */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.25, ease: 'easeOut' }
              }}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_35px_-10px_rgba(16,185,129,0.15)] hover:border-emerald-300 transition-all flex flex-col justify-between group relative overflow-hidden cursor-default"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-80 group-hover:h-1.5 transition-all duration-300" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-2xs"
                  >
                    <Globe size={20} />
                  </motion.div>
                  <span className="text-[10px] font-semibold font-poppins uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                    Organic SEO
                  </span>
                </div>

                <h3 className="text-lg font-semibold font-poppins text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  City & Locality SEO
                </h3>
                <p className="text-xs font-normal font-poppins text-slate-500 mb-4">
                  Top positions on city directories and Google maps.
                </p>

                {/* Visual UI: Simulated Local SEO Map Rank Widget */}
                <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-200/80 mb-4 group-hover:bg-emerald-50/30 transition-colors space-y-1.5">
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                        #1
                      </div>
                      <div className="text-[11px] font-semibold font-poppins text-slate-800">Local Area Pack</div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-600">Active</span>
                  </div>
                  <div className="bg-white/80 rounded-xl px-2.5 py-1.5 border border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                    <span>Direct Inbound:</span>
                    <span className="font-semibold text-emerald-600">Zero Commission</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold font-poppins text-slate-700">
                <span className="text-slate-500 font-normal">Traffic Type:</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">24/7 Organic</span>
              </div>
            </motion.div>

            {/* Channel 4: Repeat & Referral Host Network */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.25, ease: 'easeOut' }
              }}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_35px_-10px_rgba(147,51,234,0.15)] hover:border-purple-300 transition-all flex flex-col justify-between group relative overflow-hidden cursor-default"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-80 group-hover:h-1.5 transition-all duration-300" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    whileHover={{ rotate: -15, scale: 1.1 }}
                    className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-2xs"
                  >
                    <Smartphone size={20} />
                  </motion.div>
                  <span className="text-[10px] font-semibold font-poppins uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/50">
                    WhatsApp AI
                  </span>
                </div>

                <h3 className="text-lg font-semibold font-poppins text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
                  WhatsApp Concierge
                </h3>
                <p className="text-xs font-normal font-poppins text-slate-500 mb-4">
                  Automated assistant qualifying guest dates & budget.
                </p>

                {/* Visual UI: Simulated WhatsApp Chat Snippet */}
                <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-200/80 mb-4 group-hover:bg-purple-50/30 transition-colors space-y-1.5">
                  <div className="bg-[#DCF8C6] rounded-xl rounded-tr-xs p-2 text-slate-800 text-[10px] font-poppins shadow-2xs border border-emerald-100">
                    <span className="font-semibold text-emerald-900">Enquiry Confirmed:</span> 350 Guests, Nov 2026 ✓✓
                  </div>
                  <div className="bg-white rounded-xl p-1.5 border border-slate-100 flex items-center justify-between text-[10px] text-purple-700 font-semibold px-2">
                    <span className="flex items-center gap-1">
                      <PhoneCall size={10} /> Routed to Venue
                    </span>
                    <span className="text-slate-400 font-normal">&lt; 2s</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold font-poppins text-slate-700">
                <span className="text-slate-500 font-normal">Speed:</span>
                <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-semibold">&lt; 5 Seconds</span>
              </div>
            </motion.div>

          </div>

          {/* Lead Funnel Transparency Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-base font-semibold font-poppins text-slate-900 mb-0.5">
                  Every Single Lead Is 100% Exclusive to You
                </h4>
                <p className="text-xs font-normal font-poppins text-slate-500">
                  We do not resell or auction enquiries. If a customer clicks your venue, they belong to only you.
                </p>
              </div>
            </div>

            <Link href="/login" className="shrink-0 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-semibold font-poppins text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                Become a PartyDial Partner →
              </motion.button>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* 4. CUSTOMER ENQUIRY & VERIFICATION (PARTYDIAL GRADIENT THEME) */}
      <section className="py-20 md:py-28 px-5 sm:px-8 lg:px-12 relative overflow-hidden bg-white border-b border-slate-100">
        {/* PartyDial Ambient lighting aura */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-pd-pink/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-pd-blue/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-semibold font-poppins uppercase tracking-wider mb-4 shadow-2xs"
            >
              <ShieldCheck size={14} className="text-pd-pink" />
              <span>Strict Anti-Spam Filtering</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-semibold font-poppins text-slate-900 tracking-tight leading-[1.15] mb-4"
            >
              Customer Enquiry <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pd-pink via-purple-600 to-pd-blue">
                &amp; Quality Verification
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 font-normal font-poppins text-sm sm:text-base leading-relaxed"
            >
              Every enquiry undergoes a 3-point automated screening process before reaching you. We eliminate junk numbers, brokers, and window shoppers.
            </motion.p>
          </div>

          {/* Visual Interactive Verification Pipeline Container */}
          <div className="relative mb-12">
            
            {/* Visual Process Flow Connector Line behind cards on desktop */}
            <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-1 bg-gradient-to-r from-pd-pink/30 via-purple-500/40 to-pd-blue/30 -translate-y-8 z-0" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
              
              {/* Stage 01: Carrier-Grade Mobile OTP Verification */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-md hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between group"
              >
                {/* Ambient Soft Top Sheen */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pd-pink to-rose-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pd-pink to-rose-500 text-white flex items-center justify-center font-bold font-poppins text-sm shadow-md shadow-pd-pink/25">
                        01
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-pd-pink font-poppins">
                          Stage 1
                        </div>
                        <h3 className="text-base font-semibold font-poppins text-slate-900 leading-tight">
                          Mobile OTP Gate
                        </h3>
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold font-poppins text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                      <CheckCircle2 size={10} className="text-emerald-600" />
                      Live Verified
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-poppins font-normal leading-relaxed mb-5">
                    Instant 4-digit SMS challenge stops fake numbers, spam bots, and invalid contacts at point of entry.
                  </p>

                  {/* Visual Simulation: Live Carrier Checked Passcode Box */}
                  <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3 mb-2">
                    <div className="flex items-center justify-between text-[11px] font-poppins">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Smartphone size={13} className="text-pd-pink" />
                        <span>+91 98765-XXXXX</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-slate-200/60 shadow-2xs">
                        <ShieldCheck size={11} /> 100% Genuine
                      </span>
                    </div>

                    {/* Animated 4 Digit Boxes */}
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {[
                        { num: "5", active: true },
                        { num: "9", active: true },
                        { num: "1", active: true },
                        { num: "4", active: true },
                      ].map((digit, i) => (
                        <div
                          key={i}
                          className="h-11 rounded-xl bg-white border-2 border-pink-400 text-slate-900 flex items-center justify-center font-bold font-poppins text-base shadow-xs relative"
                        >
                          {digit.num}
                          <span className="absolute -bottom-1 w-2 h-0.5 bg-pd-pink rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Metric Pill */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-poppins">
                  <span className="text-slate-400 font-normal">Spam Rejection:</span>
                  <span className="font-semibold text-pd-pink bg-pink-50 px-2 py-0.5 rounded-lg border border-pink-100">
                    99.8% Filter Rate
                  </span>
                </div>
              </motion.div>

              {/* Stage 02: Intent & Budget Fit Qualification */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-md hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between group"
              >
                {/* Ambient Soft Top Sheen */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold font-poppins text-sm shadow-md shadow-purple-500/25">
                        02
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-poppins">
                          Stage 2
                        </div>
                        <h3 className="text-base font-semibold font-poppins text-slate-900 leading-tight">
                          Event Intent Match
                        </h3>
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold font-poppins text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                      <Zap size={10} className="text-purple-600" />
                      Pre-Screened
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-poppins font-normal leading-relaxed mb-5">
                    Planner enters specific headcount, confirmed date, and event budget before any contact is released.
                  </p>

                  {/* Visual Simulation: Structured Lead Sheet */}
                  <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs space-y-2 mb-2 text-[11px] font-poppins">
                    <div className="flex justify-between items-center bg-white px-3 py-2 rounded-xl border border-slate-200/70 shadow-2xs">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar size={13} className="text-purple-500" /> Target Date:
                      </span>
                      <span className="font-semibold text-slate-900">Nov 18, 2026</span>
                    </div>
                    <div className="flex justify-between items-center bg-white px-3 py-2 rounded-xl border border-slate-200/70 shadow-2xs">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Users size={13} className="text-purple-500" /> Guest Count:
                      </span>
                      <span className="font-semibold text-purple-600">350 - 400 Pax</span>
                    </div>
                    <div className="flex justify-between items-center bg-white px-3 py-2 rounded-xl border border-slate-200/70 shadow-2xs">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Award size={13} className="text-pd-pink" /> Estimated Budget:
                      </span>
                      <span className="font-semibold text-emerald-600">₹3,50,000</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Metric Pill */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-poppins">
                  <span className="text-slate-400 font-normal">Intent Quality:</span>
                  <span className="font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                    High Conversion Ready
                  </span>
                </div>
              </motion.div>

              {/* Stage 03: Exclusive 1:1 Inbound Dispatch */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-md hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between group"
              >
                {/* Ambient Soft Top Sheen */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pd-blue to-emerald-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pd-blue to-cyan-500 text-white flex items-center justify-center font-bold font-poppins text-sm shadow-md shadow-pd-blue/25">
                        03
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-pd-blue font-poppins">
                          Stage 3
                        </div>
                        <h3 className="text-base font-semibold font-poppins text-slate-900 leading-tight">
                          1:1 Direct Dispatch
                        </h3>
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold font-poppins text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                      <Sparkles size={10} className="text-pd-blue" />
                      Zero Competitors
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-poppins font-normal leading-relaxed mb-5">
                    Enquiry rings your phone & WhatsApp directly in &lt; 2s. No directory listings, no lead auctioning.
                  </p>

                  {/* Visual Simulation: Instant Inbound Notification Card */}
                  <div className="bg-slate-900 text-white rounded-2xl p-3.5 shadow-md border border-slate-800 space-y-2.5 mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-pulse">
                          <PhoneCall size={14} />
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold font-poppins text-white leading-tight">
                            Live Customer Inbound
                          </div>
                          <div className="text-[9px] text-emerald-300 font-normal font-poppins">
                            Connected in 1.8 seconds
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-semibold font-poppins bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        LIVE CALL
                      </span>
                    </div>

                    <div className="bg-gradient-to-r from-pd-pink/20 to-purple-600/20 border border-pink-500/30 rounded-xl p-2 text-center text-[10px] font-semibold text-pink-200 font-poppins">
                      ✨ 100% Exclusive — Only Routed To You
                    </div>
                  </div>
                </div>

                {/* Bottom Metric Pill */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-poppins">
                  <span className="text-slate-400 font-normal">Delivery Speed:</span>
                  <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                    &lt; 2 Seconds Real-Time
                  </span>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Bottom Verification Guarantee Strip in PartyDial Visual Theme */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-around gap-6 text-xs font-poppins text-slate-700"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-pd-pink flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <span className="font-medium">Zero Fake or Unreachable Numbers</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <span className="font-medium">Host Budgets Pre-Checked Against Pricing</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-pd-blue flex items-center justify-center shrink-0">
                <Zap size={16} />
              </div>
              <span className="font-medium">Direct Customer Callback Within Seconds</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 5. FROM LEAD TO BOOKING (VISUAL JOURNEY PIPELINE) */}
      <section className="py-20 md:py-28 px-5 sm:px-8 lg:px-12 relative overflow-hidden bg-slate-50 border-b border-slate-100">
        {/* Ambient lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-pd-pink/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-14 md:mb-18 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-pink-200 text-slate-800 text-xs font-semibold font-poppins uppercase tracking-wider mb-4 shadow-2xs"
            >
              <Zap size={13} className="text-pd-pink" fill="currentColor" />
              <span>Conversion Pipeline</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-semibold font-poppins text-slate-900 tracking-tight leading-[1.15]"
            >
              From Lead <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pd-pink via-purple-600 to-pd-blue">
                To Confirmed Booking
              </span>
            </motion.h2>
          </div>

          {/* Continuous Interactive Horizontal Visual Pipeline */}
          <div className="relative mb-14">
            
            {/* Background Connecting Gradient Laser Rail (Visible on Desktop) */}
            <div className="hidden lg:block absolute top-[52px] left-[8%] right-[8%] h-1 bg-slate-200 z-0">
              <div className="h-full bg-gradient-to-r from-pd-pink via-purple-600 to-pd-blue w-full rounded-full" />
              {/* Moving Pulse Particle */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-4 h-4 rounded-full bg-pd-pink blur-[2px] animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
            </div>

            {/* 4 Pipeline Stages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              
              {/* Stage 01: Instant Inbound Ping */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group"
              >
                {/* Milestone Node */}
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-pd-pink text-pd-pink flex items-center justify-center font-black font-poppins text-base shadow-lg shadow-pd-pink/20 mb-4 group-hover:scale-110 transition-transform">
                  01
                </div>

                <div className="text-xs font-bold text-pd-pink font-poppins uppercase tracking-wider mb-1">
                  &lt; 2s Dispatch
                </div>
                <h3 className="text-base font-semibold font-poppins text-slate-900 mb-3">
                  Lead Notification
                </h3>

                {/* Micro Visual: Live Mobile Phone Incoming Ping */}
                <div className="w-full rounded-2xl bg-gradient-to-b from-white to-pink-50/30 p-3.5 border border-pink-200/80 shadow-sm text-left">
                  <div className="flex items-center justify-between text-[10px] font-poppins text-slate-500 mb-2">
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Host Inbound
                    </span>
                    <span className="bg-pink-100 text-pd-pink font-bold px-1.5 py-0.2 rounded text-[9px]">NOW</span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-2xs space-y-1">
                    <div className="text-[11px] font-bold font-poppins text-slate-800 flex items-center gap-1">
                      <PhoneCall size={12} className="text-pd-pink" /> Aarav S. • Wedding
                    </div>
                    <div className="text-[10px] font-semibold text-pd-pink font-poppins">
                      ₹3,50,000 Budget • 450 Pax
                    </div>
                  </div>
                  <div className="text-[9.5px] font-poppins text-slate-500 mt-2 flex justify-between">
                    <span>Host Phone Verified</span>
                    <span className="font-semibold text-slate-700">1-Tap Dial</span>
                  </div>
                </div>
              </motion.div>

              {/* Stage 02: 1-Tap PDF & Quote Sharing */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Milestone Node */}
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-purple-600 text-purple-600 flex items-center justify-center font-black font-poppins text-base shadow-lg shadow-purple-500/20 mb-4 group-hover:scale-110 transition-transform">
                  02
                </div>

                <div className="text-xs font-bold text-purple-600 font-poppins uppercase tracking-wider mb-1">
                  Host Connect
                </div>
                <h3 className="text-base font-semibold font-poppins text-slate-900 mb-3">
                  Share Menus &amp; Quote
                </h3>

                {/* Micro Visual: WhatsApp PDF Brochure Snippet */}
                <div className="w-full rounded-2xl bg-gradient-to-b from-white to-purple-50/30 p-3.5 border border-purple-200/80 shadow-sm text-left">
                  <div className="flex items-center justify-between text-[10px] font-poppins text-slate-500 mb-2">
                    <span className="font-semibold text-purple-700 flex items-center gap-1">
                      <MessageSquare size={11} /> WhatsApp Direct
                    </span>
                    <span className="text-slate-400">Delivered</span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-2xs flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold font-poppins text-[10px] shadow-2xs">
                      PDF
                    </div>
                    <div className="text-[10px] font-poppins truncate">
                      <div className="font-bold text-slate-800">Wedding-Package.pdf</div>
                      <div className="text-slate-400">Catering &amp; Hall Specs</div>
                    </div>
                  </div>
                  <div className="text-[9.5px] font-poppins text-purple-600 font-semibold mt-2 flex justify-between">
                    <span>Sent via Bot</span>
                    <span className="text-emerald-600 flex items-center gap-0.5"><Check size={11} /><Check size={11} className="-ml-1.5" /> Read</span>
                  </div>
                </div>
              </motion.div>

              {/* Stage 03: In-Person Tasting & Inspection */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Milestone Node */}
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-pd-blue text-pd-blue flex items-center justify-center font-black font-poppins text-base shadow-lg shadow-pd-blue/20 mb-4 group-hover:scale-110 transition-transform">
                  03
                </div>

                <div className="text-xs font-bold text-pd-blue font-poppins uppercase tracking-wider mb-1">
                  Physical Visit
                </div>
                <h3 className="text-base font-semibold font-poppins text-slate-900 mb-3">
                  Venue Walkthrough
                </h3>

                {/* Micro Visual: Scheduled Walkthrough Pass */}
                <div className="w-full rounded-2xl bg-gradient-to-b from-white to-blue-50/30 p-3.5 border border-blue-200/80 shadow-sm text-left">
                  <div className="flex items-center justify-between text-[10px] font-poppins text-slate-500 mb-2">
                    <span className="font-semibold text-blue-700 flex items-center gap-1">
                      <Calendar size={11} /> Site Inspection
                    </span>
                    <span className="bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded text-[9px]">CONFIRMED</span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-2xs space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-poppins">
                      <span className="text-slate-500">Visit Time:</span>
                      <span className="font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Saturday • 3 PM</span>
                    </div>
                    <div className="text-[10px] text-slate-600 font-medium font-poppins flex items-center gap-1 pt-0.5">
                      <CheckCircle2 size={11} className="text-emerald-500" />
                      Food Tasting &amp; Hall Tour
                    </div>
                  </div>
                  <div className="text-[9.5px] font-poppins text-slate-500 mt-2 flex justify-between">
                    <span>Host Attending</span>
                    <span className="text-blue-600 font-semibold">High Intent</span>
                  </div>
                </div>
              </motion.div>

              {/* Stage 04: Deal Closed & Advance Paid */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Milestone Node */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-black font-poppins text-base shadow-lg shadow-emerald-500/25 mb-4 group-hover:scale-110 transition-transform">
                  04
                </div>

                <div className="text-xs font-bold text-emerald-600 font-poppins uppercase tracking-wider mb-1">
                  100% Retained
                </div>
                <h3 className="text-base font-semibold font-poppins text-slate-900 mb-3">
                  Advance Paid &amp; Booked
                </h3>

                {/* Micro Visual: Official Booking Advance Receipt */}
                <div className="w-full rounded-2xl bg-gradient-to-b from-white to-emerald-50/40 p-3.5 border border-emerald-300 shadow-md shadow-emerald-500/10 text-left">
                  <div className="flex items-center justify-between text-[10px] font-poppins text-slate-500 mb-2">
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck size={12} className="text-emerald-600" /> Deal Sealed
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded text-[9px]">PAID</span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-emerald-200/80 shadow-2xs space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-poppins">
                      <span className="text-slate-500">Advance:</span>
                      <span className="font-mono font-bold text-emerald-600 text-[11px]">₹1,00,000</span>
                    </div>
                    <div className="text-[9.5px] font-semibold text-slate-700 flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 size={11} className="text-emerald-500" /> Direct to Venue Account
                    </div>
                  </div>
                  <div className="text-[9.5px] font-poppins text-slate-500 mt-2 flex justify-between">
                    <span>Commission Deducted:</span>
                    <span className="font-bold text-emerald-600">₹0</span>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>

          {/* Bottom Conversion Guarantee Strip */}
          <div className="bg-gradient-to-r from-pink-50/40 via-purple-50/40 to-blue-50/40 border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-around gap-4 text-xs font-poppins text-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pd-pink" />
              <span className="font-medium">Direct Customer Relationship (No Intermediary)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span className="font-medium">Host Pays Advance Straight into Your Bank</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pd-blue" />
              <span className="font-medium">Zero Success Fees or Booking Deductions</span>
            </div>
          </div>

        </div>
      </section>

      {/* 5. PARTNER BENEFITS — KEY ADVANTAGES OF JOINING PARTYDIAL */}
      <section className="py-20 md:py-28 px-5 sm:px-8 lg:px-12 relative overflow-hidden bg-gradient-to-b from-white via-pink-50/15 to-white border-b border-slate-200/80">
        {/* Soft PartyDial Radial Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-pd-pink/10 via-purple-500/10 to-pd-blue/10 rounded-full blur-3xl opacity-75" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Section Header - Bold & Clean, Minimal Text */}
          <div className="text-center mb-14 md:mb-18 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-pink-200 text-slate-800 text-xs font-semibold font-poppins uppercase tracking-wider mb-3 shadow-2xs"
            >
              <Award size={14} className="text-pd-pink" />
              <span>Partner Privileges</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-semibold font-poppins text-slate-900 tracking-tight leading-tight"
            >
              Partner Benefits <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pd-pink via-purple-600 to-pd-blue">
                Key Advantages of Joining PartyDial
              </span>
            </motion.h2>
          </div>

          {/* 4 Interactive Infographic Visuals (Zero Cards, Zero Clutter) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-16">
            
            {/* Visual 1: 0% Commission (Big Visual Stat + Direct Bank Pipeline) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group"
            >
              {/* Graphic Display */}
              <div className="w-full aspect-[4/3] rounded-3xl bg-gradient-to-b from-pink-50/60 to-rose-50/20 border border-pink-200/70 p-5 flex flex-col justify-between items-center relative overflow-hidden group-hover:border-pd-pink transition-all shadow-xs">
                {/* Floating ambient glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-pd-pink/15 rounded-full blur-xl" />
                
                <div className="w-full flex justify-between items-center text-[11px] font-poppins">
                  <span className="px-2.5 py-0.5 rounded-full bg-pd-pink text-white font-bold text-[10px]">
                    0% CUT
                  </span>
                  <span className="text-slate-400 font-medium">Keep Every Rupee</span>
                </div>

                {/* Big Visual: 0% with Bank Vault Arrow */}
                <div className="my-auto flex flex-col items-center">
                  <div className="text-4xl sm:text-5xl font-black font-poppins text-transparent bg-clip-text bg-gradient-to-r from-pd-pink to-rose-600 tracking-tight">
                    0%
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-emerald-600 font-semibold text-xs font-poppins">
                    <CheckCircle2 size={13} />
                    <span>Direct Bank Deposit</span>
                  </div>
                </div>

                {/* Visual Graphic: Payout Pipeline */}
                <div className="w-full bg-white rounded-xl p-2 border border-pink-100 flex items-center justify-between text-[11px] font-poppins shadow-2xs">
                  <span className="text-slate-500">Advance:</span>
                  <span className="font-bold text-slate-900 font-mono">100% Retained</span>
                </div>
              </div>

              <h3 className="mt-4 text-base font-semibold font-poppins text-slate-900">
                Zero Commission Fees
              </h3>
              <p className="text-xs font-poppins text-slate-500 mt-1 max-w-[200px]">
                Host advances go straight to your bank account with no cuts.
              </p>
            </motion.div>

            {/* Visual 2: 1:1 Exclusive Direct Route (Laser Pipeline vs Shared) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              {/* Graphic Display */}
              <div className="w-full aspect-[4/3] rounded-3xl bg-gradient-to-b from-purple-50/60 to-indigo-50/20 border border-purple-200/70 p-5 flex flex-col justify-between items-center relative overflow-hidden group-hover:border-purple-500 transition-all shadow-xs">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/15 rounded-full blur-xl" />

                <div className="w-full flex justify-between items-center text-[11px] font-poppins">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px]">
                    1:1 EXCLUSIVE
                  </span>
                  <span className="text-slate-400 font-medium">Never Shared</span>
                </div>

                {/* Big Visual: Laser Conduit Route */}
                <div className="w-full my-auto px-2">
                  <div className="flex items-center justify-between text-xs font-poppins font-semibold text-slate-700 mb-2">
                    <span className="flex items-center gap-1 text-purple-700">
                      <UserCheck size={14} /> Host
                    </span>
                    <span className="flex items-center gap-1 text-purple-700">
                      <ShieldCheck size={14} /> You
                    </span>
                  </div>
                  {/* Glowing Laser Pipe */}
                  <div className="relative h-2.5 bg-purple-100 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-pd-blue rounded-full" />
                    <div className="absolute top-0 bottom-0 w-8 bg-white/80 rounded-full blur-[2px] animate-[pulse_1.5s_ease-in-out_infinite]" />
                  </div>
                  <div className="text-[10px] text-purple-600 font-medium font-poppins mt-2">
                    Direct 1-to-1 Connection
                  </div>
                </div>

                <div className="w-full bg-white rounded-xl p-2 border border-purple-100 flex items-center justify-between text-[11px] font-poppins shadow-2xs">
                  <span className="text-slate-500">Rivals on Lead:</span>
                  <span className="font-bold text-purple-700">0 Venues</span>
                </div>
              </div>

              <h3 className="mt-4 text-base font-semibold font-poppins text-slate-900">
                100% Exclusive Inquiries
              </h3>
              <p className="text-xs font-poppins text-slate-500 mt-1 max-w-[200px]">
                Every inquiry is locked to you. No competing with 5 other halls.
              </p>
            </motion.div>

            {/* Visual 3: <2s Direct Touch (Waveform & Stopwatch) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              {/* Graphic Display */}
              <div className="w-full aspect-[4/3] rounded-3xl bg-gradient-to-b from-blue-50/60 to-cyan-50/20 border border-blue-200/70 p-5 flex flex-col justify-between items-center relative overflow-hidden group-hover:border-pd-blue transition-all shadow-xs">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pd-blue/15 rounded-full blur-xl" />

                <div className="w-full flex justify-between items-center text-[11px] font-poppins">
                  <span className="px-2.5 py-0.5 rounded-full bg-pd-blue text-white font-bold text-[10px]">
                    &lt; 2s SPEED
                  </span>
                  <span className="text-slate-400 font-medium">Instant Ring</span>
                </div>

                {/* Big Visual: Animated Audio Waveform & WhatsApp Dial */}
                <div className="my-auto flex flex-col items-center">
                  <div className="flex items-center gap-1.5 h-8">
                    <span className="w-1.5 h-4 bg-pd-blue rounded-full animate-bounce" />
                    <span className="w-1.5 h-7 bg-purple-600 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-1.5 h-3 bg-pd-pink rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-8 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-5 bg-pd-blue rounded-full animate-bounce [animation-delay:0.25s]" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 font-poppins mt-2 flex items-center gap-1">
                    <PhoneCall size={12} className="text-pd-blue" />
                    <span>Direct Call & WhatsApp</span>
                  </div>
                </div>

                <div className="w-full bg-white rounded-xl p-2 border border-blue-100 flex items-center justify-between text-[11px] font-poppins shadow-2xs">
                  <span className="text-slate-500">Latency:</span>
                  <span className="font-bold text-pd-blue font-mono">&lt; 1.8s</span>
                </div>
              </div>

              <h3 className="mt-4 text-base font-semibold font-poppins text-slate-900">
                Instant Customer Dial
              </h3>
              <p className="text-xs font-poppins text-slate-500 mt-1 max-w-[200px]">
                Host dials you immediately on WhatsApp and phone while intent is hot.
              </p>
            </motion.div>

            {/* Visual 4: Google #1 SEO Dominance (SERP Snippet & Crown) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center text-center group"
            >
              {/* Graphic Display */}
              <div className="w-full aspect-[4/3] rounded-3xl bg-gradient-to-b from-emerald-50/60 to-teal-50/20 border border-emerald-200/70 p-5 flex flex-col justify-between items-center relative overflow-hidden group-hover:border-emerald-500 transition-all shadow-xs">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/15 rounded-full blur-xl" />

                <div className="w-full flex justify-between items-center text-[11px] font-poppins">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                    #1 ON GOOGLE
                  </span>
                  <span className="text-slate-400 font-medium">Digital HQ</span>
                </div>

                {/* Big Visual: Search Snippet with Rating */}
                <div className="w-full my-auto bg-white rounded-xl p-2.5 border border-emerald-100 shadow-2xs text-left">
                  <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 font-poppins">
                    <Globe size={11} /> partydial.com/venue
                  </div>
                  <div className="text-xs font-semibold text-blue-600 font-poppins truncate mt-0.5">
                    Your Venue Name
                  </div>
                  <div className="text-[10px] text-amber-500 font-medium font-poppins flex items-center gap-1 mt-0.5">
                    <span>★ 4.9 Verified</span>
                    <span className="text-slate-400">• 360° Tours</span>
                  </div>
                </div>

                <div className="w-full bg-white rounded-xl p-2 border border-emerald-100 flex items-center justify-between text-[11px] font-poppins shadow-2xs">
                  <span className="text-slate-500">Google Rank:</span>
                  <span className="font-bold text-emerald-600">Top 3</span>
                </div>
              </div>

              <h3 className="mt-4 text-base font-semibold font-poppins text-slate-900">
                Dedicated Digital HQ
              </h3>
              <p className="text-xs font-poppins text-slate-500 mt-1 max-w-[200px]">
                High-converting Google ranking microsite with 360° gallery tours.
              </p>
            </motion.div>

          </div>

          {/* Bottom Conversion Action Strip — PartyDial Gradient */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-pd-pink via-purple-600 to-pd-blue text-white shadow-xl shadow-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-5"
          >
            <div>
              <div className="text-base sm:text-lg font-semibold font-poppins text-white mb-0.5">
                Start Receiving Direct Leads In Your City Today
              </div>
              <div className="text-xs sm:text-sm font-normal font-poppins text-pink-100">
                No long-term contracts. No setup fees. Free listing verification in 24 hours.
              </div>
            </div>
            <Link href="/login" className="shrink-0 w-full md:w-auto">
              <button
                type="button"
                className="w-full md:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-900 rounded-full font-semibold font-poppins text-xs uppercase tracking-wider shadow-lg shadow-black/10 hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Become a PartyDial Partner
                <ArrowRight size={15} className="text-pd-pink" />
              </button>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS (FAQ) — ANSWER COMMON PARTNER QUESTIONS */}
      <section className="py-12 sm:py-20 md:py-28 px-4 sm:px-8 lg:px-12 relative overflow-hidden bg-white border-b border-slate-200/80">
        {/* Ambient atmospheric aura */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-pd-pink/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-pd-blue/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-14 md:mb-18 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white border border-pink-200 text-slate-800 text-[10px] sm:text-xs font-semibold font-poppins uppercase tracking-wider mb-3 sm:mb-4 shadow-2xs"
            >
              <HelpCircle size={13} className="text-pd-pink shrink-0" />
              <span>Partner Support &amp; Clarity</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-5xl font-semibold font-poppins text-slate-900 tracking-tight leading-tight mb-3 sm:mb-4"
            >
              Frequently Asked Questions <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pd-pink via-purple-600 to-pd-blue">
                Answer Common Partner Questions
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 font-normal font-poppins text-xs sm:text-base leading-relaxed px-2"
            >
              Everything you need to know about lead exclusivity, 0% commissions, customer dispatch, and managing your venue on PartyDial.
            </motion.p>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3 sm:space-y-4">
            {[
              {
                q: "How does PartyDial provide 0% commission on bookings?",
                a: "Unlike traditional aggregator sites that take 10%–15% cuts from your booking advances, PartyDial operates on a flat, transparent partner subscription model. The event host pays the entire advance deposit straight into your venue's bank account with zero platform deduction.",
                tag: "Commission & Payouts",
                badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
              },
              {
                q: "Are inquiries really exclusive to my venue, or shared with competitors?",
                a: "Inquiries generated from your dedicated PartyDial Digital HQ are 100% exclusive (1:1 routing). We never resell or broadcast your customer leads to rival halls or competitors in your area.",
                tag: "1:1 Exclusivity",
                badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
              },
              {
                q: "How fast do I receive notifications when a customer inquires?",
                a: "Within less than 2 seconds. The moment an event host verifies their inquiry on PartyDial, our automated dispatch system sends a verified WhatsApp summary and instantly connects their phone line directly to your manager.",
                tag: "< 2s Dispatch",
                badgeColor: "bg-blue-50 text-pd-blue border-blue-200"
              },
              {
                q: "What is included in my venue's Digital HQ microsite?",
                a: "Your Digital HQ is a dedicated, high-converting Google-optimized landing page featuring 360° virtual hall tours, verified pricing tiers, catering menus in downloadable PDF format, authentic guest reviews, and direct 1-tap WhatsApp dialers.",
                tag: "Digital HQ",
                badgeColor: "bg-pink-50 text-pd-pink border-pink-200"
              },
              {
                q: "How are event host leads verified before reaching me?",
                a: "Every host inquiry undergoes carrier OTP phone verification, event date conflict checks, guest count screening (pax), and minimum budget validation to prevent spam, duplicate submissions, and window shoppers.",
                tag: "Lead Quality",
                badgeColor: "bg-amber-50 text-amber-700 border-amber-200"
              },
              {
                q: "How quickly can I onboard and verify my venue?",
                a: "Onboarding takes less than 5 minutes. Submit your basic hall capacity, photos, and manager contact number. Our partner verification team approves your listing within 24 hours.",
                tag: "24h Onboarding",
                badgeColor: "bg-teal-50 text-teal-700 border-teal-200"
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl sm:rounded-2xl border transition-colors duration-200 overflow-hidden ${
                    isOpen 
                      ? 'bg-gradient-to-r from-pink-50/25 via-white to-purple-50/25 border-pd-pink/50 shadow-xs' 
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-6 text-left flex items-start justify-between gap-3 sm:gap-4 cursor-pointer select-none"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1 sm:space-y-1.5 flex-1 pr-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] sm:text-[10px] font-bold font-poppins uppercase tracking-wider px-2 py-0.5 rounded-full border ${faq.badgeColor}`}>
                          {faq.tag}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold font-poppins text-slate-900 leading-snug">
                        {faq.q}
                      </h3>
                    </div>
                    <div 
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ease-out mt-0.5 ${
                        isOpen ? 'bg-pd-pink text-white rotate-180' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <ChevronDown size={15} />
                    </div>
                  </button>

                  {/* GPU-accelerated 60fps CSS Grid Accordion Transition */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-250 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-slate-600 font-normal font-poppins text-xs sm:text-sm leading-relaxed border-t border-slate-100/80 pt-2.5 sm:pt-3">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Help Card */}
          <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <div>
              <div className="text-xs sm:text-sm font-semibold font-poppins text-slate-900">
                Have a specific question about your banquet or resort?
              </div>
              <div className="text-[11px] sm:text-xs font-normal font-poppins text-slate-500 mt-0.5">
                Our partner manager team is available 7 days a week on WhatsApp and call.
              </div>
            </div>
            <Link href="/contact" className="shrink-0 w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 rounded-full font-semibold font-poppins text-xs border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <PhoneCall size={13} className="text-pd-pink shrink-0" />
                <span>Speak with Partner Desk</span>
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* 7. BECOME A PARTNER (CTA) — ENCOURAGE VENUE OWNERS TO REGISTER */}
      <section className="py-12 sm:py-20 md:py-28 px-4 sm:px-8 lg:px-12 relative overflow-hidden bg-gradient-to-b from-white via-pink-50/20 to-purple-50/20 border-b border-slate-200/80">
        {/* Ambient atmospheric lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-pd-pink/15 via-purple-600/10 to-pd-blue/15 rounded-full blur-3xl opacity-75" />
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="rounded-[28px] sm:rounded-[36px] bg-white border border-pink-200/90 shadow-xl shadow-pink-500/5 p-6 sm:p-10 lg:p-16 relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 sm:h-2 bg-gradient-to-r from-pd-pink via-purple-600 to-pd-blue" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              
              {/* Left Column: Bold Copy & Registration Value Propositions */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
                
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pd-pink text-[10px] sm:text-xs font-semibold font-poppins uppercase tracking-wider shadow-2xs max-w-full">
                  <Sparkles size={12} className="shrink-0" />
                  <span className="truncate">Join India's Leading Venue Network</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold font-poppins text-slate-900 tracking-tight leading-tight">
                  Become a Partner <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pd-pink via-purple-600 to-pd-blue">
                    Start Receiving High-Intent Inquiries
                  </span>
                </h2>

                <p className="text-slate-600 font-normal font-poppins text-xs sm:text-base leading-relaxed max-w-xl">
                  Take full ownership of your venue's growth. List your banquet, resort, or party lawn in under 5 minutes and receive 100% direct customer leads with zero commission deductions.
                </p>

                {/* 3 Visual Pillars: Clean row/grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
                  <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/70 text-center sm:text-left">
                    <div className="text-pd-pink font-bold text-[10px] sm:text-xs font-poppins uppercase tracking-wide flex items-center justify-center sm:justify-start gap-1">
                      <CheckCircle2 size={12} className="shrink-0" /> <span>0% Cut</span>
                    </div>
                    <div className="text-[9px] sm:text-[11px] font-medium text-slate-700 leading-tight mt-0.5">100% Payouts</div>
                  </div>
                  <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/70 text-center sm:text-left">
                    <div className="text-purple-600 font-bold text-[10px] sm:text-xs font-poppins uppercase tracking-wide flex items-center justify-center sm:justify-start gap-1">
                      <Lock size={12} className="shrink-0" /> <span>1:1 Leads</span>
                    </div>
                    <div className="text-[9px] sm:text-[11px] font-medium text-slate-700 leading-tight mt-0.5">Exclusive</div>
                  </div>
                  <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/70 text-center sm:text-left">
                    <div className="text-pd-blue font-bold text-[10px] sm:text-xs font-poppins uppercase tracking-wide flex items-center justify-center sm:justify-start gap-1">
                      <Zap size={12} className="shrink-0" /> <span>24h Setup</span>
                    </div>
                    <div className="text-[9px] sm:text-[11px] font-medium text-slate-700 leading-tight mt-0.5">Fast Listing</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                  <Link href="/login" className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-pd-pink hover:bg-rose-600 text-white rounded-full font-semibold font-poppins text-xs uppercase tracking-wider shadow-lg shadow-pd-pink/25 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Become a PartyDial Partner</span>
                      <ArrowRight size={15} />
                    </motion.button>
                  </Link>

                  <Link href="/contact" className="w-full sm:w-auto">
                    <button
                      type="button"
                      className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-full font-semibold font-poppins text-xs uppercase tracking-wider border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <PhoneCall size={14} className="text-pd-pink shrink-0" />
                      <span>Speak with Venue Advisor</span>
                    </button>
                  </Link>
                </div>

                <div className="text-[10px] sm:text-[11px] font-poppins text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
                  <span>✓ No setup fees</span>
                  <span>•</span>
                  <span>✓ No lock-ins</span>
                  <span>•</span>
                  <span>✓ 24/7 dedicated support</span>
                </div>

              </div>

              {/* Right Column: Visual Telemetry Card (Live Inbound Growth Simulation) */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6 border border-slate-200/80 shadow-md space-y-3 sm:space-y-4 relative">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-gradient-to-tr from-pd-pink to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs font-poppins">
                        PD
                      </div>
                      <div>
                        <div className="text-xs font-bold font-poppins text-slate-900 leading-tight">Partner Onboarding Desk</div>
                        <div className="text-[10px] text-slate-500 font-poppins">Real-time venue activation</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[9px] font-poppins">
                      LIVE
                    </span>
                  </div>

                  {/* Visual Step Timeline */}
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
                      <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div className="text-[11px] font-poppins">
                        <div className="font-semibold text-slate-800 text-xs">1. Submit Venue Details</div>
                        <div className="text-slate-500 text-[10px]">Hall capacity, photos, and manager contact</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
                      <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        2
                      </div>
                      <div className="text-[11px] font-poppins">
                        <div className="font-semibold text-slate-800 text-xs">2. Free Verification within 24h</div>
                        <div className="text-slate-500 text-[10px]">Dedicated partner desk validates your listing</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
                      <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-pd-pink text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        3
                      </div>
                      <div className="text-[11px] font-poppins">
                        <div className="font-semibold text-slate-800 text-xs">3. Direct Leads Ring Your Phone</div>
                        <div className="text-slate-500 text-[10px]">Hosts call &amp; message your WhatsApp instantly</div>
                      </div>
                    </div>
                  </div>

                  {/* Guaranteed Protection Banner */}
                  <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-pink-50/70 via-purple-50/70 to-blue-50/70 border border-pink-100 text-[10px] sm:text-[10.5px] font-poppins text-slate-700 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-pd-pink shrink-0" />
                    <span><strong>100% Direct:</strong> Guests pay directly to your venue bank account.</span>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
