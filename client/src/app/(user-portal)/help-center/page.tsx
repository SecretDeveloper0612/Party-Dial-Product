'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Book, 
  Users, 
  Building2, 
  CreditCard, 
  Settings, 
  MessageCircle, 
  LifeBuoy, 
  ChevronRight,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Zap,
  Phone,
  Mail,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

const helpCategories = [
  { 
    id: 'general', 
    title: 'General Support', 
    icon: HelpCircle, 
    color: 'pd-red', 
    desc: 'Basics of how PartyDial works and account setup.' 
  },
  { 
    id: 'planners', 
    title: 'For Event Planners', 
    icon: Users, 
    color: 'pd-purple', 
    desc: 'Tips for finding, comparing, and booking the best venues.' 
  },
  { 
    id: 'owners', 
    title: 'For Venue Owners', 
    icon: Building2, 
    color: 'pd-blue', 
    desc: 'Manage your listings, leads, and venue dashboard.' 
  },
  { 
    id: 'payments', 
    title: 'Payments & Pricing', 
    icon: CreditCard, 
    color: 'pd-pink', 
    desc: 'Information about fees, quotes, and direct negotiations.' 
  },
  { 
    id: 'safety', 
    title: 'Trust & Safety', 
    icon: ShieldCheck, 
    color: 'emerald-400', 
    desc: 'Our verification process and commitment to transparency.' 
  },
  { 
    id: 'account', 
    title: 'Account Settings', 
    icon: Settings, 
    color: 'slate-500', 
    desc: 'Change your password, email settings, and profile info.' 
  }
];

const faqs = [
  {
    q: "Is it free to book a venue via PartyDial?",
    a: "Yes! PartyDial is 100% free for event planners. We never charge a commission on your bookings. You negotiate directly with the venue owners to get the best possible rates."
  },
  {
    q: "How do I know if a venue is verified?",
    a: "Look for the red 'Verified' badge on venue listings. This means our local managers have personally visited the location to verify its facilities, photos, and services."
  },
  {
    q: "Can I manage multiple venues from one account?",
    a: "Absolutely. Our Partner Dashboard allows venue owners to list and manage multiple properties seamlessly. You can track leads and update details for each venue individually."
  },
  {
    q: "What should I do if a venue owner doesn't respond?",
    a: "While most owners respond within 4-6 hours, you can use the 'Request Call Back' feature or reach out to our support team if you haven't heard back within 24 hours."
  }
];

const HelpCenter = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" as const }
  };

  return (
    <main className="bg-white min-h-screen text-slate-700 font-sans leading-relaxed selection:bg-pd-red/10 selection:text-pd-red">
      
      {/* 1. HERO SEARCH */}
      <section className="pt-24 pb-16 px-6 bg-slate-900 overflow-hidden relative border-b border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pd-red/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pd-purple/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-30"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp}>
            <span className="inline-block bg-white/5 text-pd-red text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-[0.2em] border border-white/5 shadow-2xl backdrop-blur-md">24/7 Support Desk</span>
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tighter mb-8 italic uppercase">
              How can we help <br /> <span className="text-pd-red underline decoration-white/10 underline-offset-8">You today?</span>
            </h1>
            
            {/* SEARCH BAR */}
            <div className="max-w-2xl mx-auto relative group px-2">
               <div className="absolute inset-0 bg-linear-to-r from-pd-red via-pd-purple to-pd-blue rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
               <div className="relative flex items-center bg-white rounded-[1.5rem] md:rounded-[2rem] p-2 shadow-2xl border border-white/10">
                  <div className="pl-6 text-slate-400"><Search size={22} strokeWidth={2.5}/></div>
                  <input 
                    type="text" 
                    placeholder="Search for articles, guides, or keywords..." 
                    className="w-full bg-transparent px-4 py-4 md:py-5 font-bold text-slate-900 placeholder:text-slate-400 outline-none text-sm md:text-base italic"
                  />
                  <button className="bg-slate-900 text-white px-6 md:px-10 py-3 md:py-4 rounded-[1rem] md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-pd-red transition-all active:scale-95 shadow-lg italic leading-none whitespace-nowrap">Search</button>
               </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-12">
               {['Booking Help', 'Verification', 'Partner Dashboard'].map((tag, i) => (
                 <button key={i} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-pd-red transition-colors italic border-b border-white/5 pb-1 hover:border-pd-red/20">{tag}</button>
               ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CATEGORIES GRID */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">Browse <span className="text-pd-purple">Categories.</span></h2>
            <p className="text-slate-500 font-medium italic text-sm md:text-base">Quick access to specialized guides and support documentation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
           {helpCategories.map((cat, i) => (
             <motion.div 
               key={cat.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="group p-8 md:p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-2xl hover:border-pd-red/10 transition-all flex flex-col items-center text-center relative overflow-hidden"
             >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${cat.color}/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className={`w-16 h-16 rounded-2xl bg-${cat.color}/10 flex items-center justify-center text-${cat.color} mb-8 border border-${cat.color}/10 group-hover:bg-${cat.color} group-hover:text-white transition-all transform group-hover:scale-110 duration-500 shadow-sm`}>
                   <cat.icon size={28} strokeWidth={2.5}/>
                </div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-4 italic uppercase tracking-tight">{cat.title}</h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed italic mb-8 group-hover:text-slate-600 transition-colors">{cat.desc}</p>
                <div className="h-[2px] w-8 bg-slate-100 group-hover:w-full group-hover:bg-pd-red transition-all duration-700 mb-8"></div>
                <button className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-${cat.color} flex items-center gap-2 transition-colors italic`}>
                  Explore Guides <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </button>
             </motion.div>
           ))}
        </div>
      </section>

      {/* 3. POPULAR FAQS */}
      <section className="py-20 md:py-32 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-16">
              <span className="text-[10px] font-black text-pd-red uppercase tracking-widest mb-2 inline-block">Still Confused?</span>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter font-pd">Popular <span className="text-pd-red">Questions.</span></h2>
           </div>

           <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className={`bg-white rounded-2xl border transition-all ${activeFaq === i ? 'border-pd-red shadow-xl' : 'border-slate-100 hover:border-pd-red/30 cursor-pointer'}`}
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                   <div className="p-6 md:p-8 flex items-center justify-between">
                      <h3 className="text-sm md:text-lg font-bold text-slate-900 italic tracking-tight uppercase leading-tight">{faq.q}</h3>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeFaq === i ? 'bg-pd-red text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                         <ChevronDown size={18} strokeWidth={3}/>
                      </div>
                   </div>
                   <AnimatePresence>
                      {activeFaq === i && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                           <div className="px-6 md:px-8 pb-8 pt-0 text-xs md:text-sm text-slate-500 font-medium leading-relaxed italic border-t border-slate-50 pt-6 mt-2 ml-2">
                             {faq.a}
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
              ))}
           </div>

           <div className="mt-16 text-center">
              <button className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-pd-red border-b border-transparent hover:border-pd-red transition-all italic">View All Frequently Asked Questions</button>
           </div>
        </div>
      </section>

      {/* 4. DIRECT CONTACT CTA */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col lg:flex-row items-stretch gap-6 md:gap-10">
              
              {/* LIVE CHAT */}
              <motion.div 
                {...fadeUp}
                className="flex-1 p-10 md:p-16 rounded-[3rem] bg-linear-to-br from-pd-purple/5 to-white border border-pd-purple/10 flex flex-col justify-between group hover:shadow-2xl transition-all"
              >
                 <div>
                    <div className="w-20 h-20 rounded-3xl bg-pd-purple flex items-center justify-center text-white mb-10 shadow-xl group-hover:scale-110 transition-transform duration-500"><MessageCircle size={32} strokeWidth={2.5}/></div>
                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 italic uppercase tracking-tighter">Instant <br /> <span className="text-pd-purple underline decoration-pd-purple/10 underline-offset-8">Live Chat.</span></h2>
                    <p className="text-slate-500 font-medium italic mb-10 text-sm md:text-base leading-relaxed">Connect with our support experts in real-time for immediate answers to your queries.</p>
                 </div>
                 <button className="w-fit bg-slate-900 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-pd-purple transition-all italic leading-none active:scale-95">Start Chatting Now</button>
              </motion.div>

              {/* EMAIL SUPPORT */}
              <motion.div 
                {...fadeUp}
                transition={{ delay: 0.1 }}
                className="flex-1 p-10 md:p-16 rounded-[3rem] bg-slate-900 text-white flex flex-col justify-between group hover:shadow-2xl transition-all relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-pd-red/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-30 pointer-events-none"></div>
                 <div className="relative z-10">
                    <div className="w-20 h-20 rounded-3xl bg-pd-red flex items-center justify-center text-white mb-10 shadow-xl group-hover:scale-110 transition-transform duration-500"><Mail size={32} strokeWidth={2.5}/></div>
                    <h2 className="text-2xl md:text-4xl font-black text-white mb-6 italic uppercase tracking-tighter">Email <br /> <span className="text-pd-red underline decoration-white/10 underline-offset-8">Expert Support.</span></h2>
                    <p className="text-white/50 font-medium italic mb-10 text-sm md:text-base leading-relaxed">Send us a detailed inquiry and our team will get back to you within 4 business hours.</p>
                 </div>
                 <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-center">
                    <Link href="/contact" className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto bg-pd-red text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:text-pd-red transition-all italic leading-none active:scale-95">Send Ticket</button>
                    </Link>
                    <div className="flex items-center gap-2 text-white/40 italic text-[10px] font-black uppercase tracking-widest px-4">
                       <Zap size={14} className="text-pd-red" /> 4h Response Time
                    </div>
                 </div>
              </motion.div>

           </div>

           {/* EMERGENCY CONTACT */}
           <motion.div 
             {...fadeUp}
             transition={{ delay: 0.2 }}
             className="mt-10 p-8 rounded-[2rem] bg-white border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl transition-all"
           >
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-pd-blue transition-colors"><Phone size={24} strokeWidth={2.5}/></div>
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none mb-1">Corporate Hotline</h4>
                    <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter italic">+91 98765 43210</p>
                 </div>
              </div>
              <div className="h-[20px] w-[1px] bg-slate-100 hidden md:block"></div>
              <div className="text-center md:text-left">
                 <p className="text-xs font-bold text-slate-500 italic max-w-sm">Our phone lines are open from 9 AM to 8 PM (IST) Monday for urgent venue assistance.</p>
              </div>
              <Link href="/contact">
                <button className="w-full md:w-auto px-8 py-3 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all italic">More Ways to Connect</button>
              </Link>
           </motion.div>
        </div>
      </section>

      {/* FOOTNOTE */}
      <section className="pb-16 pt-10 text-center border-t border-slate-100">
          <div className="w-16 h-1 bg-pd-red/10 rounded-full mx-auto mb-10"></div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em] pointer-events-none mb-4 italic">PartyDial Support Ecosystem • Est. 2026</p>
          <div className="flex items-center justify-center gap-8">
             {['Forum', 'Community', 'Status'].map((item, i) => (
               <button key={i} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-pd-red transition-colors italic">{item}</button>
             ))}
          </div>
      </section>

    </main>
  );
};

export default HelpCenter;
