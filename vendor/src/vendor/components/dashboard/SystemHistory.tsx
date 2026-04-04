'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface Activity {
  id: number;
  type: string;
  title: string;
  time: string;
  icon: React.ReactNode;
}

interface SystemHistoryProps {
  pastActivities: Activity[];
}

const SystemHistory = ({ pastActivities }: SystemHistoryProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 leading-none">Activity <span className="text-blue-600">History</span></h1>
             <p className="text-sm font-medium text-slate-500 italic">Complete chronological log of your venue interactions and events.</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-pd-soft self-start">
             {['All', 'Leads', 'Bookings', 'System'].map(t => (
                <button key={t} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${t === 'All' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:text-slate-900'}`}>{t}</button>
             ))}
          </div>
       </header>

       <div className="max-w-4xl bg-white rounded-[50px] border border-slate-100 shadow-pd-soft overflow-hidden">
          <div className="p-10">
             <div className="space-y-10 relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100"></div>

                {pastActivities.map((activity, idx) => (
                   <motion.div 
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative pl-16 flex items-start gap-10 group"
                   >
                      {/* Circle on timeline */}
                      <div className="absolute left-[18px] top-4 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-200 group-hover:border-pd-pink transition-colors z-10 shadow-sm" />
                      
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-pd-soft transition-all group-hover:scale-110">
                         {activity.icon}
                      </div>
                      <div className="flex-1 pb-10 border-b border-slate-50 last:border-0">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-pd-pink transition-colors">{activity.type}</span>
                            <span className="text-[10px] font-bold text-slate-300 italic">{activity.time}</span>
                         </div>
                         <h3 className="text-lg font-black italic tracking-tight text-slate-900 mb-1 leading-none">{activity.title}</h3>
                         <p className="text-[11px] font-medium text-slate-400 italic">Activity ID: #{activity.id*1234} • Successfully recorded in system</p>
                      </div>
                      <ChevronRight className="mt-4 text-slate-200 group-hover:text-slate-900 transition-colors cursor-pointer" size={20} />
                   </motion.div>
                ))}
             </div>
          </div>
          
          <div className="bg-slate-50/50 p-8 text-center border-t border-slate-100">
             <button className="text-[10px] font-black uppercase tracking-[0.3em] text-pd-pink hover:text-slate-900 transition-all italic">Archive History Log</button>
          </div>
       </div>
    </motion.div>
  );
};

export default React.memo(SystemHistory);
