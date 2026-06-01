'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, HelpCircle, PhoneCall, Headphones, BookOpen, ExternalLink } from 'lucide-react';

const QuickSupport = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl mx-auto space-y-8">
       {/* Header */}
       <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
          <div className="relative z-10 max-w-2xl">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-pd-pink mb-6 backdrop-blur-sm border border-white/10">
                <Headphones size={24} />
             </div>
             <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Partner Support Center</h1>
             <p className="text-slate-400 font-medium text-lg max-w-lg">We're dedicated to helping you maximize your venue's potential on our platform.</p>
          </div>
          
          {/* Abstract Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pd-pink/20 to-purple-600/20 blur-3xl -mr-20 -mt-20 rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-32 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a 
            href="https://wa.me/918864959977?text=Hi%20PartyDial%20Support,%20I%20need%20help%20with%20my%20venue%20listing." 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-emerald-500/30 transition-all cursor-pointer group"
          >
             <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                   <MessageSquare size={24} />
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                   <ExternalLink size={14} />
                </div>
             </div>
             <div>
                <h4 className="text-lg font-extrabold text-slate-900 mb-2">WhatsApp Support</h4>
                <p className="text-sm text-slate-500 font-medium">Chat instantly with our partner success team for quick resolutions and onboarding help.</p>
             </div>
          </a>

          <a 
            href="mailto:support@partydial.com"
            className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-pd-pink/30 transition-all cursor-pointer group"
          >
             <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 text-pd-pink group-hover:bg-pd-pink group-hover:text-white transition-all shadow-sm">
                   <HelpCircle size={24} />
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-pd-pink transition-colors">
                   <ExternalLink size={14} />
                </div>
             </div>
             <div>
                <h4 className="text-lg font-extrabold text-slate-900 mb-2">Email Support</h4>
                <p className="text-sm text-slate-500 font-medium">Send us an email for detailed queries, billing issues, or feature requests. We typically reply within 24 hours.</p>
             </div>
          </a>
       </div>

       {/* FAQ / Resources Teaser */}
       <div className="bg-slate-50 rounded-3xl border border-slate-200/60 p-8 md:p-10 mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm shrink-0">
                <BookOpen size={20} />
             </div>
             <div>
                <h4 className="text-base font-extrabold text-slate-900 mb-1">Knowledge Base</h4>
                <p className="text-sm font-medium text-slate-500">Learn how to optimize your profile and get more bookings.</p>
             </div>
          </div>
          <button className="w-full md:w-auto px-6 py-3 bg-white border border-slate-200/80 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm whitespace-nowrap">
             View Guides
          </button>
       </div>
    </motion.div>
  );
};

export default React.memo(QuickSupport);
