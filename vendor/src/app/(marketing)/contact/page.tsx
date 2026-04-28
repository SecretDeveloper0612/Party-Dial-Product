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
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-pd-pink text-[10px] font-black uppercase tracking-[0.4em] mb-8"
               >
                  <ShieldCheck size={12} className="fill-pd-pink/10" /> Priority Partner Success
               </motion.div>
               <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-7xl font-black text-white italic uppercase leading-tight mb-8"
               >
                  Let's build your <br />
                  <span className="pd-gradient-text not-italic">Legacy together.</span>
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
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pd-blue/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pd-pink/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-20"></div>
         </section>

         {/* 2. CONTACT CHANNELS */}
         <section className="py-24 px-6 relative">
            <div className="max-w-[1440px] mx-auto lg:px-12">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
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
                        detail: "Preet Tech OPC Private Limited",
                        sub: "Preet Tech OPC Private Limited, near Krishna Hospital, Subhash Nagar, Haldwani, Uttarakhand 263139",
                        icon: <MapPin className="text-pd-red" />,
                        bg: "bg-pd-red/5",
                        action: "Get Directions",
                        href: "https://www.google.com/maps/search/?api=1&query=Preet+Tech+OPC+Private+Limited+Haldwani+Uttarakhand"
                     }
                  ].map((channel, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[40px] border border-slate-100 hover:shadow-perfect-pd transition-all group"
                     >
                        <div className={`w-14 h-14 rounded-2xl ${channel.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                           {channel.icon}
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{channel.title}</h3>
                        <p className="text-xl font-black text-slate-900 mb-1">{channel.detail}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-8">{channel.sub}</p>

                        <a 
                           href={channel.href}
                           target={channel.href.startsWith('http') ? '_blank' : undefined}
                           rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                           className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pd-pink hover:gap-4 transition-all"
                        >
                           {channel.action} <ChevronRight size={14} />
                        </a>
                     </motion.div>
                  ))}
               </div>

               {/* 3. CONTACT FORM ENGINE */}
               <div className="flex flex-col lg:flex-row gap-20 items-center">
                  {/* Left Content */}
                  <div className="flex-1 space-y-12">
                     <div>
                        <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] uppercase italic leading-none mb-8">
                           Send a <br />
                           <span className="pd-gradient-text not-italic">Priority Message.</span>
                        </h2>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                           Our specialized advisors will analyze your inquiry and reach back with
                           tailored solutions for your venue's growth.
                        </p>
                     </div>

                     <div className="space-y-8">
                        {[
                           { icon: <Zap className="text-pd-pink" size={18} />, text: "Instant ticket creation" },
                           { icon: <CheckCircle2 className="text-emerald-500" size={18} />, text: "Direct route to Success Manager" },
                           { icon: <Clock className="text-pd-blue" size={18} />, text: "24-hour SLA guaranteed" }
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">{item.icon}</div>
                              <span className="text-sm font-black uppercase tracking-widest text-slate-900">{item.text}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Right Form */}
                  <div className="flex-1 w-full max-w-xl">
                     <div className="bg-slate-900 rounded-[48px] p-8 md:p-12 relative overflow-hidden shadow-2xl">
                        {/* Background Visual */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pd-pink/10 rounded-full blur-[100px] pointer-events-none"></div>

                        {submitted ? (
                           <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center py-20"
                           >
                              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20">
                                 <CheckCircle2 size={40} className="text-white" />
                              </div>
                              <h3 className="text-2xl font-black text-white uppercase italic mb-4">Message Sent!</h3>
                              <p className="text-slate-400 font-medium mb-10">Our team has received your priority ticket. Expect a call shortly.</p>
                              <button
                                 onClick={() => setSubmitted(false)}
                                 className="text-[10px] font-black uppercase tracking-widest text-pd-pink border-b border-pd-pink/30 pb-1"
                              >
                                 Send another message
                              </button>
                           </motion.div>
                        ) : (
                           <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">YOUR NAME</label>
                                    <input required className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm font-bold focus:border-pd-pink outline-none transition-all" placeholder="John Doe" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">VENUE NAME</label>
                                    <input required className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm font-bold focus:border-pd-pink outline-none transition-all" placeholder="Royal Banquet" />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">BUSINESS EMAIL</label>
                                 <input required type="email" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm font-bold focus:border-pd-pink outline-none transition-all" placeholder="owner@venue.com" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">MESSAGE</label>
                                 <textarea required className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm font-bold focus:border-pd-pink outline-none transition-all resize-none" placeholder="I'm interested in the Premium Growth Plan..."></textarea>
                              </div>

                              <motion.button
                                 whileHover={{ scale: 1.02 }}
                                 whileTap={{ scale: 0.98 }}
                                 disabled={isSubmitting}
                                 className="w-full h-16 bg-pd-red text-white rounded-3xl text-sm font-black uppercase tracking-[0.4em] italic shadow-2xl flex items-center justify-center gap-4 group disabled:opacity-50"
                              >
                                 {isSubmitting ? "Processing..." : (
                                    <>
                                       Submit
                                       <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </>
                                 )}
                              </motion.button>
                              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest text-center">Identity & Data encrypted via SSL v3.0</p>
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
