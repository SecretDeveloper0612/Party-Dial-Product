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

      {/* 1. HERO SECTION - LIGHT THEME */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-50 border-b border-slate-200/70">
         {/* Subtle Ambient Lighting for Light Mode */}
         <div className="absolute top-0 inset-x-0 h-64 bg-linear-to-b from-slate-100 to-transparent pointer-events-none" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-pd-pink/10 rounded-full blur-[130px] pointer-events-none mix-blend-multiply" />
         <div className="absolute top-1/3 right-[5%] w-[500px] h-[500px] bg-pd-blue/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />

         <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center relative z-10">
            <motion.div
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-xs mb-6"
            >
               <Zap size={13} className="text-pd-pink fill-pd-pink" />
               <span className="text-slate-800 text-xs font-semibold font-poppins tracking-wider uppercase">
                  Partner Success & Growth
               </span>
            </motion.div>

            <motion.h1
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-4xl sm:text-5xl lg:text-6xl font-semibold font-poppins text-slate-900 tracking-tight leading-[1.15] mb-6"
            >
               Let&apos;s Build Your Venue&apos;s <br className="hidden sm:block" />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 font-semibold font-poppins">
                  Legacy Together.
               </span>
            </motion.h1>

            <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="max-w-2xl mx-auto text-slate-600 text-base sm:text-lg font-normal font-poppins leading-relaxed"
            >
               Have questions about lead distribution, subscription plans, or venue onboarding?
               Our dedicated partner team is here to help you maximize bookings and grow your event business.
            </motion.p>
         </div>
      </section>

      {/* 2. CONTACT CHANNELS */}
      <section className="py-12 sm:py-20 px-3.5 sm:px-6 relative bg-[#FAFBFD]">
         <div className="max-w-[1240px] mx-auto">
            {/* Quick Channel Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-20 -mt-16 sm:-mt-24 lg:-mt-28 relative z-20">
               {[
                  {
                     title: "Direct Support Call",
                     detail: "+91 8679933304",
                     desc: "Speak with a dedicated growth partner (Mon – Sat, 10am – 7pm)",
                     icon: <PhoneCall className="text-pd-blue" size={22} />,
                     bg: "bg-blue-50/80 border-blue-100",
                     action: "Call Now",
                     href: "tel:+918679933304"
                  },
                  {
                     title: "Official Email Desk",
                     detail: "support@partydial.com",
                     desc: "Fast email responses for accounts, billing, and technical queries",
                     icon: <Mail className="text-pd-pink" size={22} />,
                     bg: "bg-pink-50/80 border-pink-100",
                     action: "Send Email",
                     href: "mailto:support@partydial.com"
                  },
                  {
                     title: "Company Headquarters",
                     detail: "Preet Tech Private Limited",
                     desc: "Subhash Nagar, Haldwani, Uttarakhand 263139, India",
                     icon: <MapPin className="text-pd-red" size={22} />,
                     bg: "bg-rose-50/80 border-rose-100",
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
                     className="p-5 sm:p-8 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                     <div>
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${channel.bg} border flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-300`}>
                           {channel.icon}
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-semibold font-poppins uppercase tracking-wider text-slate-400">
                           {channel.title}
                        </span>
                        <h3 className="text-lg sm:text-2xl font-semibold font-poppins text-slate-900 tracking-tight mt-1 mb-2 break-words">
                           {channel.detail}
                        </h3>
                        <p className="text-xs sm:text-sm font-normal font-poppins text-slate-500 leading-relaxed mb-5 sm:mb-6">
                           {channel.desc}
                        </p>
                     </div>

                     <a 
                        href={channel.href}
                        target={channel.href.startsWith('http') ? '_blank' : undefined}
                        rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-2 text-xs font-semibold font-poppins uppercase tracking-wider text-pd-pink hover:text-rose-600 transition-colors w-fit pt-1 sm:pt-2"
                     >
                        <span>{channel.action}</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </a>
                  </motion.div>
               ))}
            </div>

            {/* 3. CONTACT FORM & VALUE PROPOSITION */}
            <div className="bg-white rounded-3xl sm:rounded-4xl border border-slate-200/80 p-4 sm:p-10 lg:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start lg:items-center">
                  
                  {/* Left Column: Context & Guarantees */}
                  <div className="lg:col-span-5 space-y-6 sm:space-y-8">
                     <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pd-pink text-[10px] sm:text-[11px] font-semibold font-poppins uppercase tracking-wider mb-3 sm:mb-4">
                           <MessageSquare size={12} />
                           <span>Priority Partner Inquiry</span>
                        </span>
                        <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-semibold font-poppins text-slate-900 tracking-tight leading-[1.2] mb-3 sm:mb-4">
                           Send Us a <br className="hidden sm:block" />
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 font-semibold font-poppins">
                              Direct Message.
                           </span>
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-base font-normal font-poppins leading-relaxed">
                           Whether you need onboarding assistance, want to inquire about custom enterprise plans, or require help with your listing, our team will connect with you promptly.
                        </p>
                     </div>

                     <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                        {[
                           { 
                              icon: <Zap className="text-pd-pink" size={18} />, 
                              title: "Fast Response Time", 
                              desc: "Dedicated response within 2 business hours." 
                           },
                           { 
                              icon: <ShieldCheck className="text-emerald-500" size={18} />, 
                              title: "Dedicated Relationship Manager", 
                              desc: "Personalized assistance for your venue profile." 
                           },
                           { 
                              icon: <Clock className="text-pd-blue" size={18} />, 
                              title: "24/7 Portal Dashboard", 
                              desc: "Manage leads, quotations, and stats anytime." 
                           }
                        ].map((item, i) => (
                           <div key={i} className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs">
                                 {item.icon}
                              </div>
                              <div>
                                 <h4 className="text-xs sm:text-sm font-semibold font-poppins text-slate-900 leading-snug">
                                    {item.title}
                                 </h4>
                                 <p className="text-[11px] sm:text-xs font-normal font-poppins text-slate-500 mt-0.5 leading-relaxed">
                                    {item.desc}
                                 </p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Right Column: Interactive Form */}
                  <div className="lg:col-span-7">
                     <div className="p-4 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-slate-50/70 border border-slate-200/90 relative">
                        {submitted ? (
                           <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center py-12 sm:py-16 px-4"
                           >
                              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 text-emerald-600 rounded-2xl sm:rounded-3xl border border-emerald-200 flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-sm">
                                 <CheckCircle2 size={30} />
                              </div>
                              <h3 className="text-xl sm:text-2xl font-semibold font-poppins text-slate-900 tracking-tight mb-2">
                                 Inquiry Submitted Successfully!
                              </h3>
                              <p className="text-xs sm:text-sm font-normal font-poppins text-slate-600 max-w-sm mx-auto leading-relaxed mb-6 sm:mb-8">
                                 Thank you for reaching out. Our venue growth manager will review your request and get in touch with you shortly.
                              </p>
                              <button
                                 type="button"
                                 onClick={() => setSubmitted(false)}
                                 className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold font-poppins uppercase tracking-wider transition-all cursor-pointer"
                              >
                                 Send Another Message
                              </button>
                           </motion.div>
                        ) : (
                           <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                              <div>
                                 <h3 className="text-lg sm:text-xl font-semibold font-poppins text-slate-900 tracking-tight mb-1">
                                    Tell Us About Your Venue
                                 </h3>
                                 <p className="text-xs font-normal font-poppins text-slate-500">
                                    Fill in your details below and our team will get back to you.
                                 </p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1 sm:pt-2">
                                 <div className="space-y-1 sm:space-y-1.5">
                                    <label className="block text-[11px] sm:text-xs font-semibold font-poppins text-slate-700 uppercase tracking-wider">
                                       Your Name *
                                    </label>
                                    <input 
                                       required 
                                       type="text"
                                       className="w-full h-11 sm:h-12 bg-white border border-slate-200 rounded-xl px-3.5 sm:px-4 text-slate-900 text-sm font-normal font-poppins focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 outline-none transition-all placeholder:text-slate-400"
                                       placeholder="e.g. Rajesh Sharma" 
                                    />
                                 </div>
                                 <div className="space-y-1 sm:space-y-1.5">
                                    <label className="block text-[11px] sm:text-xs font-semibold font-poppins text-slate-700 uppercase tracking-wider">
                                       Venue Name *
                                    </label>
                                    <input 
                                       required 
                                       type="text"
                                       className="w-full h-11 sm:h-12 bg-white border border-slate-200 rounded-xl px-3.5 sm:px-4 text-slate-900 text-sm font-normal font-poppins focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 outline-none transition-all placeholder:text-slate-400"
                                       placeholder="e.g. Royal Crystal Banquet" 
                                    />
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                                 <div className="space-y-1 sm:space-y-1.5">
                                    <label className="block text-[11px] sm:text-xs font-semibold font-poppins text-slate-700 uppercase tracking-wider">
                                       Business Email *
                                    </label>
                                    <input 
                                       required 
                                       type="email" 
                                       className="w-full h-11 sm:h-12 bg-white border border-slate-200 rounded-xl px-3.5 sm:px-4 text-slate-900 text-sm font-normal font-poppins focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 outline-none transition-all placeholder:text-slate-400"
                                       placeholder="owner@venue.com" 
                                    />
                                 </div>
                                 <div className="space-y-1 sm:space-y-1.5">
                                    <label className="block text-[11px] sm:text-xs font-semibold font-poppins text-slate-700 uppercase tracking-wider">
                                       Phone Number *
                                    </label>
                                    <input 
                                       required 
                                       type="tel" 
                                       className="w-full h-11 sm:h-12 bg-white border border-slate-200 rounded-xl px-3.5 sm:px-4 text-slate-900 text-sm font-normal font-poppins focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 outline-none transition-all placeholder:text-slate-400"
                                       placeholder="+91 98765 43210" 
                                    />
                                 </div>
                              </div>

                              <div className="space-y-1 sm:space-y-1.5">
                                 <label className="block text-[11px] sm:text-xs font-semibold font-poppins text-slate-700 uppercase tracking-wider">
                                    Your Message *
                                 </label>
                                 <textarea 
                                    required 
                                    rows={3}
                                    className="w-full bg-white border border-slate-200 rounded-xl p-3 sm:p-4 text-slate-900 text-sm font-normal font-poppins focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 outline-none transition-all resize-none placeholder:text-slate-400"
                                    placeholder="Please describe how we can assist you (e.g., plan queries, lead requirements, city coverage)..."
                                 />
                              </div>

                              <button
                                 type="submit"
                                 disabled={isSubmitting}
                                 className="w-full py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-semibold font-poppins uppercase tracking-wider text-white shadow-lg shadow-pink-500/25 bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                              >
                                 {isSubmitting ? (
                                    <span>Submitting Your Request...</span>
                                 ) : (
                                    <>
                                       <span>Send Priority Message</span>
                                       <Send size={14} />
                                    </>
                                 )}
                              </button>

                              <p className="text-[10px] sm:text-[11px] font-normal font-poppins text-slate-400 text-center pt-1 px-2">
                                 Your contact information is strictly confidential and protected by 256-bit encryption.
                              </p>
                           </form>
                        )}
                     </div>
                  </div>

               </div>
            </div>
         </div>
      </section>


      </div>
   );
}
