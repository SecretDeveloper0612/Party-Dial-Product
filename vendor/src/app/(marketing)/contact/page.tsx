'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
   Mail,
   PhoneCall,
   MapPin,
   Send,
   MessageSquare,
   Zap,
   Clock,
   CheckCircle2,
   ChevronRight,
   Globe,
   ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitted, setSubmitted] = useState(false);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setTimeout(() => {
         setIsSubmitting(false);
         setSubmitted(true);
      }, 1500);
   };

   return (
      <div suppressHydrationWarning className="bg-white min-h-screen">

         {/* 1. HERO SECTION */}
         <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 border-b border-white/5">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center relative z-10">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 mb-8"
               >
                  {/* PARTYDIAL LOGO PILL */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm shadow-lg">
                     <div className="w-7 h-7 rounded-[10px] bg-pd-pink flex items-center justify-center">
                        <span className="text-white font-black  text-sm leading-none pt-0.5 pr-0.5">P</span>
                     </div>
                     <span className="text-white font-black  tracking-tight text-sm pr-1">PARTYDIAL</span>
                  </div>
                  {/* PARTNER PILL */}
                  <div className="flex items-center h-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm shadow-lg">
                     <span className="text-white font-black uppercase  tracking-[0.2em] text-[11px] leading-none">PARTNER</span>
                  </div>
               </motion.div>
               <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.1] mb-8"
               >
                  Let's build your <br />
                  <span className="pd-gradient-text ">Legacy together.</span>
               </motion.h1>
               <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-2xl mx-auto text-slate-400 text-lg font-medium leading-relaxed"
               >
                  Have a question about lead quality, subscription plans, or venue onboarding?
                  Our dedicated partner success team is ready to help you dominate your local market.
               </motion.p>
            </div>

            {/* Abstract background shapes */}
            <div className="absolute top-0 right-0 w-125 h-[500px] bg-pd-blue/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-125 h-[500px] bg-pd-pink/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-20 pointer-events-none"></div>
         </section>

         {/* 2. CONTACT CHANNELS & FORM */}
         <section className="py-24 px-6 relative bg-slate-50">
            <div className="max-w-[1440px] mx-auto lg:px-12">
               
               {/* Channels Grid */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 lg:mb-32">
                  {[
                     {
                        title: "Direct Support",
                        detail: "+91 8864959977",
                        sub: "Mon - Sat, 10am - 7pm",
                        icon: <PhoneCall className="text-pd-blue" />,
                        bg: "bg-pd-blue/5",
                        action: "Call Now",
                        href: "tel:+918864959977"
                     },
                     {
                        title: "Official Email",
                        detail: "support@partydial.com",
                        sub: "Avg. response: 2 hours",
                        icon: <Mail className="text-pd-pink" />,
                        bg: "bg-pd-pink/5",
                        action: "Send Email",
                        href: "mailto:support@partydial.com"
                     },
                     {
                        title: "Office HQ",
                        detail: "Preet Tech",
                        sub: "Subhash Nagar, Haldwani, UK 263139",
                        icon: <MapPin className="text-pd-red" />,
                        bg: "bg-pd-red/5",
                        action: "Get Directions",
                        href: "https://www.google.com/maps/search/?api=1&query=Preet+Tech+OPC+Private+Limited+Haldwani+Uttarakhand"
                     }
                  ].map((channel, i) => (
                     <div
                        key={i}
                        className="p-8 md:p-10 bg-white rounded-4xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-slate-200 transition-all duration-500 ease-out group"
                     >
                        <div className={`w-14 h-14 rounded-2xl ${channel.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 ease-out`}>
                           {channel.icon}
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{channel.title}</h3>
                        <p className="text-xl md:text-2xl font-black text-[#0F172A] tracking-tight uppercase mb-1">{channel.detail}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-8">{channel.sub}</p>

                        <a 
                           href={channel.href}
                           target={channel.href.startsWith('http') ? '_blank' : undefined}
                           rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                           className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pd-pink group-hover:gap-4 transition-all duration-300"
                        >
                           {channel.action} <ChevronRight size={14} />
                        </a>
                     </div>
                  ))}
               </div>

               {/* 3. CONTACT FORM ENGINE */}
               <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                  {/* Left Content */}
                  <div className="flex-1 space-y-12">
                     <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                           <MessageSquare size={12} className="text-pd-pink" /> 24/7 Priority Support
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight uppercase leading-[1.1] mb-6">
                           Send a <br />
                           <span className="pd-gradient-text ">Priority Message.</span>
                        </h2>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                           Our specialized advisors will analyze your inquiry and reach back with
                           tailored solutions for your venue's growth.
                        </p>
                     </div>

                     <div className="space-y-6">
                        {[
                           { icon: <Zap className="text-pd-pink" size={18} />, text: "Instant ticket creation" },
                           { icon: <CheckCircle2 className="text-emerald-500" size={18} />, text: "Direct route to Success Manager" },
                           { icon: <Clock className="text-pd-blue" size={18} />, text: "24-hour SLA guaranteed" }
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-5 p-4 bg-white border border-slate-100 rounded-[20px] shadow-sm">
                              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">{item.icon}</div>
                              <span className="text-sm font-black uppercase tracking-widest text-[#0F172A]">{item.text}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Right Form */}
                  <div className="flex-1 w-full max-w-xl">
                     <div className="bg-white rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-200 group">
                        {/* Subtle Background Glow inside form */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-linear-to-bl from-pd-pink/5 via-pd-blue/5 to-transparent rounded-full blur-[80px] pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>

                        {submitted ? (
                           <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center py-20 relative z-10"
                           >
                              <div className="w-20 h-20 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-center mx-auto mb-8 shadow-sm">
                                 <CheckCircle2 size={40} className="text-emerald-500" />
                              </div>
                              <h3 className="text-2xl font-black text-[#0F172A] tracking-tight uppercase mb-4">Message Sent!</h3>
                              <p className="text-slate-500 font-medium mb-10 max-w-xs mx-auto">Our team has received your priority ticket. Expect a call shortly.</p>
                              <button
                                 onClick={() => setSubmitted(false)}
                                 className="text-[10px] font-black uppercase tracking-widest text-pd-pink border-b border-pd-pink/30 pb-1 hover:border-pd-pink transition-colors"
                              >
                                 Send another message
                              </button>
                           </motion.div>
                        ) : (
                           <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Name</label>
                                    <input required className="w-full h-14 bg-slate-50 border border-slate-200 rounded-[20px] px-6 text-[#0F172A] text-sm font-bold focus:border-pd-pink focus:bg-white focus:shadow-[0_0_0_4px_rgba(236,72,153,0.1)] outline-none transition-all" placeholder="John Doe" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Venue Name</label>
                                    <input required className="w-full h-14 bg-slate-50 border border-slate-200 rounded-[20px] px-6 text-[#0F172A] text-sm font-bold focus:border-pd-pink focus:bg-white focus:shadow-[0_0_0_4px_rgba(236,72,153,0.1)] outline-none transition-all" placeholder="Royal Banquet" />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Business Email</label>
                                 <input required type="email" className="w-full h-14 bg-slate-50 border border-slate-200 rounded-[20px] px-6 text-[#0F172A] text-sm font-bold focus:border-pd-pink focus:bg-white focus:shadow-[0_0_0_4px_rgba(236,72,153,0.1)] outline-none transition-all" placeholder="owner@venue.com" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Message</label>
                                 <textarea required className="w-full h-32 bg-slate-50 border border-slate-200 rounded-[20px] p-6 text-[#0F172A] text-sm font-bold focus:border-pd-pink focus:bg-white focus:shadow-[0_0_0_4px_rgba(236,72,153,0.1)] outline-none transition-all resize-none" placeholder="I'm interested in the Premium Growth Plan..."></textarea>
                              </div>

                              <button
                                 disabled={isSubmitting}
                                 className="w-full h-16 bg-slate-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.3em]  shadow-2xl hover:bg-slate-800 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 flex items-center justify-center gap-4 group/btn disabled:opacity-50 disabled:hover:translate-y-0"
                              >
                                 {isSubmitting ? "Processing..." : (
                                    <>
                                       Submit
                                       <Send size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                                    </>
                                 )}
                              </button>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center pt-2">Identity & Data encrypted via SSL v3.0</p>
                           </form>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </section>


      </div>
   );
}
