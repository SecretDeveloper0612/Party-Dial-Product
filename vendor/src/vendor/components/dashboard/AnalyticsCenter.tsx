'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsCenter = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 leading-none">Performance <span className="text-pd-pink">Analytics</span></h1>
             <p className="text-sm font-medium text-slate-500 italic">Advanced tracking of your venue&apos;s digital growth and velocity.</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-pd-soft self-start">
             {['7D', '30D', '90D', '1Y'].map(t => (
                <button key={t} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${t === '30D' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:text-slate-900'}`}>{t}</button>
             ))}
          </div>
       </header>
       
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart Card */}
          <div className="lg:col-span-8 bg-white p-10 rounded-[50px] border border-slate-100 shadow-pd-soft relative overflow-hidden group">
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                   <div>
                      <h3 className="text-xl font-black italic uppercase text-slate-900">Visibility Trend</h3>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">+24% vs last month</p>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-pd-pink"></div>
                         <span className="text-[10px] font-black text-slate-400 uppercase">Views</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                         <span className="text-[10px] font-black text-slate-400 uppercase">Leads</span>
                      </div>
                   </div>
                </div>

                <div className="h-64 flex items-end gap-3 px-2">
                   {[40, 65, 45, 95, 70, 85, 60, 80, 100, 90, 75, 85].map((h, i) => (
                      <div key={i} className="flex-1 h-full flex flex-col justify-end group/bar cursor-pointer relative">
                         {/* Tooltip on hover */}
                         <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all scale-75 group-hover/bar:scale-100 whitespace-nowrap z-20 shadow-xl pointer-events-none">
                            {h * 42} Views
                         </div>
                         
                         <motion.div 
                            initial={{ height: 0 }} 
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.05, duration: 1, ease: "circOut" }}
                            className="w-full bg-slate-100/80 rounded-t-2xl group-hover/bar:bg-pd-pink/10 transition-all relative overflow-hidden"
                         >
                            {/* Inner progress part */}
                            <div className="absolute bottom-0 inset-x-0 bg-pd-pink rounded-t-2xl h-1/2 opacity-40 group-hover/bar:h-full group-hover/bar:opacity-100 transition-all duration-500" />
                            {/* Gloss effect */}
                            <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-white/40 to-transparent" />
                         </motion.div>
                         
                         <div className="h-1.5 w-full mt-2 rounded-full bg-slate-50 group-hover/bar:bg-pd-pink/20 transition-colors" />
                      </div>
                   ))}
                </div>
                
                <div className="flex justify-between mt-8 border-t border-slate-50 pt-6 px-1">
                   {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map(m => (
                      <span key={m} className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{m}</span>
                   ))}
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 gap-8">
             <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-pd-soft">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Conversion Funnel</h4>
                <div className="space-y-6">
                   {[
                      { label: 'Profile Views', value: '4,280', color: 'bg-slate-100' },
                      { label: 'Enquiry Button', value: '840', color: 'bg-emerald-50' },
                      { label: 'Form Submits', value: '124', color: 'bg-pd-pink/5' }
                   ].map((f, i) => (
                      <div key={i}>
                         <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase italic">{f.label}</span>
                            <span className="text-sm font-black text-slate-900 italic">{f.value}</span>
                         </div>
                         <div className={`h-2 w-full ${f.color} rounded-full overflow-hidden`}>
                            <div className="h-full bg-slate-900 w-3/4 rounded-full" />
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             
             <div className="bg-slate-900 p-10 rounded-[50px] text-white">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-pd-pink mb-4">Pro Insight</h4>
                <p className="text-sm font-black italic tracking-tight leading-relaxed">Your conversion rate is 8% higher than average Gurgaon venues this week. Keep up the high response speed!</p>
             </div>
          </div>
       </div>
    </motion.div>
  );
};

export default React.memo(AnalyticsCenter);
