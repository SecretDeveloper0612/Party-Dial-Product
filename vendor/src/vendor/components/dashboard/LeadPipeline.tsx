'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, MessageCircle, Phone, CalendarDays, IndianRupee } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  event: string;
  guests: string;
  date: string;
  time: string;
  status: string;
  color: string;
  text?: string;
}

interface Stage {
  id: string;
  color: string;
  text: string;
  icon: React.ReactNode;
}

interface LeadPipelineProps {
  recentLeads: Lead[];
  pipelineStages: Stage[];
  updateLeadStatus: (leadId: string, newStatus: string) => void;
  setLeadView: (view: 'list' | 'pipeline') => void;
}

const LeadPipeline = ({
  recentLeads,
  pipelineStages,
  updateLeadStatus,
  setLeadView
}: LeadPipelineProps) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full">
      <header className="flex flex-col justify-between gap-2 mb-6 ml-2">
        <h1 className="text-3xl font-black text-slate-900 mb-0">Lead Pipeline</h1>
        <p className="text-sm font-medium text-slate-500">Manage your lead funnel visually</p>
      </header>
         <div className="flex gap-6 overflow-x-auto pb-10 custom-scrollbar -mx-2 px-2 min-h-[600px]">
            {pipelineStages.map((stage) => {
               const stageLeads = recentLeads.filter(l => l.status === stage.id);
               return (
                  <div key={stage.id} className="min-w-[340px] w-[340px] bg-slate-50/50 rounded-[40px] p-6 border border-slate-100 flex flex-col h-full shadow-inner">
                     <div className="flex items-center justify-between mb-8 px-4">
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-2xl ${stage.color} flex items-center justify-center text-white shadow-xl shadow-opacity-20`}>
                              {stage.icon}
                           </div>
                           <div>
                              <h3 className="text-xs font-black italic uppercase text-slate-900 tracking-tighter leading-none">{stage.id}</h3>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{stageLeads.length} Inquiries</p>
                           </div>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-pd-pink cursor-pointer transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </div>
                     </div>
                     
                     <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {stageLeads.map((lead, idx) => (
                           <motion.div 
                             key={lead.id}
                             initial={{ opacity: 0, scale: 0.95 }}
                             animate={{ opacity: 1, scale: 1 }}
                             transition={{ delay: idx * 0.05 }}
                             whileHover={{ y: -5, rotate: 1, scale: 1.02 }}
                             className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-pd-soft cursor-grab active:cursor-grabbing hover:border-pd-pink/40 hover:shadow-2xl transition-all duration-300 group relative"
                           >
                              <button 
                                onClick={() => setLeadView('list')} 
                                className="absolute top-4 right-4 w-6 h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                              </button>
                              <div className="flex items-start justify-between mb-6">
                                 <div className={`w-12 h-12 rounded-[22px] ${stage.color}/10 ${stage.text} flex items-center justify-center border border-current/10`}>
                                    <Users size={22} />
                                 </div>
                              </div>
                              
                              <h4 className="text-base font-black italic text-slate-900 uppercase tracking-tight mb-1 group-hover:text-pd-pink transition-colors">{lead.name}</h4>
                              <div className="flex items-center gap-2 mb-6">
                                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{lead.event}</p>
                                 <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                 <p className="text-[11px] font-black text-pd-pink italic">{lead.guests} Pax</p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-50 relative z-10">
                                 {pipelineStages.filter(s => s.id !== stage.id).slice(0, 2).map(s => (
                                    <button 
                                      key={s.id}
                                      onClick={() => updateLeadStatus(lead.id, s.id)}
                                      className="py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-white hover:bg-slate-900 transition-all bg-slate-50 border border-slate-100"
                                    >
                                       {s.id.split(' ')[0]}
                                    </button>
                                 ))}
                              </div>
                           </motion.div>
                        ))}
                        {stageLeads.length === 0 && (
                           <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[45px] opacity-20">
                              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Empty Stage</div>
                           </div>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>
    </motion.div>
  );
};

export default React.memo(LeadPipeline);
