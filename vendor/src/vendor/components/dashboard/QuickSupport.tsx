'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, HelpCircle } from 'lucide-react';

const QuickSupport = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-12">
       <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tight mb-4 leading-none">Vendor Help Center</h1>
          <p className="text-slate-500 font-medium italic">We&apos;re here to help you grow your venue business.</p>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <a 
            href="https://wa.me/918864959977?text=Hi%20PartyDial%20Support,%20I%20need%20help%20with%20my%20venue%20listing." 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-pd-soft flex items-center gap-6 hover:border-emerald-500 transition-all cursor-pointer group hover:scale-[1.02]"
          >
             <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <MessageSquare size={24} />
             </div>
             <div>
                <h4 className="text-sm font-black italic text-slate-900 uppercase">WhatsApp Support</h4>
                <p className="text-[10px] text-slate-400 font-bold italic">Chat with our team instantly</p>
             </div>
          </a>

          <a 
            href="mailto:support@partydial.com"
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-pd-soft flex items-center gap-6 hover:border-blue-500 transition-all cursor-pointer group hover:scale-[1.02]"
          >
             <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <HelpCircle size={24} />
             </div>
             <div>
                <h4 className="text-sm font-black italic text-slate-900 uppercase">Email Support</h4>
                <p className="text-[10px] text-slate-400 font-bold italic">Official help desk channel</p>
             </div>
          </a>
       </div>
       

    </motion.div>
  );
};

export default React.memo(QuickSupport);
