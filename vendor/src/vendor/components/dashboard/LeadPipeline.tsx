'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [expandedStage, setExpandedStage] = React.useState<string | null>(null);

  const toggleStage = (stageId: string) => {
    setExpandedStage(prev => prev === stageId ? null : stageId);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto py-4 lg:py-8">
      <header className="mb-6 lg:mb-10 px-4 text-center lg:text-left">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Lead <span className="text-pd-pink">Pipeline</span></h1>
        <p className="text-[9px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest italic leading-none opacity-70">Track your sales funnel progression</p>
      </header>

      <div className="space-y-3 lg:space-y-4 px-4">
        {pipelineStages.map((stage, i) => {
          const stageLeads = recentLeads.filter(l => l.status === stage.id);
          const isExpanded = expandedStage === stage.id;

          return (
            <div key={stage.id} className="group">
              <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => toggleStage(stage.id)}
                className={`w-full flex items-center justify-between p-4 lg:p-5 bg-white border border-slate-50 rounded-[25px] lg:rounded-[30px] hover:shadow-xl hover:border-pd-pink/20 transition-all duration-500 relative overflow-hidden group shadow-sm ${isExpanded ? 'ring-2 ring-pd-pink' : ''}`}
              >
                <div className="flex items-center gap-4 lg:gap-6 relative z-10">
                  <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl ${stage.color} flex items-center justify-center text-white shadow-lg shadow-opacity-20 transform group-hover:scale-110 transition-transform duration-500 shrink-0`}>
                    {React.isValidElement(stage.icon) && React.cloneElement(stage.icon as React.ReactElement<any>, { size: 22 })}
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm lg:text-base font-black italic uppercase text-slate-900 tracking-tight leading-none mb-1.5">{stage.id}</h3>
                    <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{stageLeads.length} total inquiries</p>
                  </div>
                </div>
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-pd-pink/10 group-hover:text-pd-pink transition-all duration-500 ${isExpanded ? 'rotate-90 bg-pd-pink text-white shadow-md' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
                
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-slate-50/50 to-transparent pointer-events-none"></div>
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-slate-50/30 rounded-b-[40px] -mt-10 pt-16 pb-10 px-6 lg:px-12 space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-4">
                      {stageLeads.length > 0 ? (
                        stageLeads.map((lead, idx) => (
                          <motion.div 
                            key={lead.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-6 rounded-[30px] border border-slate-100 flex items-center justify-between hover:border-pd-pink transition-all shadow-sm group/card"
                          >
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/card:bg-pd-pink/10 group-hover/card:text-pd-pink transition-colors">
                                <Users size={20} />
                              </div>
                              <div className="text-left">
                                <h4 className="text-sm font-black italic uppercase text-slate-900 leading-none mb-1.5">{lead.name}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest">{lead.event} • {lead.guests} Pax</p>
                                <p className="text-[8px] font-black text-pd-pink uppercase tracking-widest mt-1 opacity-60">Recieved: {lead.date}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                               {pipelineStages.filter(s => s.id !== stage.id).slice(0, 2).map(s => (
                                  <button 
                                    key={s.id}
                                    onClick={(e) => { e.stopPropagation(); updateLeadStatus(lead.id, s.id); }}
                                    className="px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-900 transition-all border border-slate-100"
                                  >
                                     Move to {s.id.split(' ')[0]}
                                  </button>
                               ))}
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[40px]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">No inquiries currently in this stage</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <footer className="mt-20 text-center pb-10">
        <button onClick={() => setLeadView('list')} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-pd-pink transition-colors italic">Switch to Database View</button>
      </footer>
    </motion.div>
  );
};

export default React.memo(LeadPipeline);
