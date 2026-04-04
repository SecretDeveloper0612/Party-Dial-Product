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
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
             { title: 'Chat Support', desc: 'Average response time: 5 mins', icon: <MessageSquare className="text-pd-pink" size={24} /> },
             { title: 'Knowledge Base', desc: 'Read guides on getting more leads', icon: <HelpCircle className="text-blue-500" size={24} /> }
          ].map((item, idx) => (
             <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-pd-soft flex items-center gap-6 hover:border-pd-pink transition-all cursor-pointer">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                   {item.icon}
                </div>
                <div>
                   <h4 className="text-sm font-black italic text-slate-900 uppercase">{item.title}</h4>
                   <p className="text-[10px] text-slate-400 font-bold italic">{item.desc}</p>
                </div>
             </div>
          ))}
       </div>
       
       <div className="bg-slate-900 p-12 rounded-[50px] text-white text-center shadow-2xl">
          <h3 className="text-2xl font-black italic uppercase mb-4">Dedicated Account Manager</h3>
          <p className="text-slate-400 text-sm mb-8 italic">Available for <span className="text-emerald-400">Platinum Plus</span> vendors to optimize listings manually.</p>
          <button className="pd-btn-primary px-10">Email My Manager</button>
       </div>
    </motion.div>
  );
};

export default React.memo(QuickSupport);
