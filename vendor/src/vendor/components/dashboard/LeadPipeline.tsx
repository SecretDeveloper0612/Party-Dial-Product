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
  email: string;
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
  const [activeStage, setActiveStage] = React.useState<string | null>(null);

  const selectedStageData = pipelineStages.find(s => s.id === activeStage);
  const stageLeads = activeStage ? recentLeads.filter(l => l.status === activeStage) : [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto py-4 lg:py-8 min-h-[600px] flex flex-col">
      <AnimatePresence mode="wait">
        {!activeStage ? (
          <motion.div 
            key="pipeline-overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1"
          >
            <header className="mb-6 lg:mb-10 px-4 text-center lg:text-left">
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Lead <span className="text-pd-pink">Pipeline</span></h1>
              <p className="text-[9px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest italic leading-none opacity-70">Track your sales funnel progression</p>
            </header>

            <div className="space-y-3 lg:space-y-4 px-4">
              {pipelineStages.map((stage, i) => {
                const count = recentLeads.filter(l => l.status === stage.id).length;

                return (
                  <motion.button 
                    key={stage.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setActiveStage(stage.id)}
                    className="w-full flex items-center justify-between p-4 lg:p-6 bg-white border border-slate-50 rounded-[25px] lg:rounded-[35px] hover:shadow-2xl hover:border-pd-pink/20 transition-all duration-500 relative overflow-hidden group shadow-sm"
                  >
                    <div className="flex items-center gap-4 lg:gap-8 relative z-10">
                      <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl ${stage.color} flex items-center justify-center text-white shadow-xl shadow-opacity-20 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shrink-0`}>
                        {React.isValidElement(stage.icon) && React.cloneElement(stage.icon as React.ReactElement<{ size?: number }>, { size: 28 })}
                      </div>
                      <div className="text-left">
                        <h3 className="text-base lg:text-lg font-black italic uppercase text-slate-900 tracking-tight leading-none mb-1.5">{stage.id}</h3>
                        <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{count} total inquiries</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-pd-pink group-hover:text-white transition-all duration-500 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                    
                    <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-slate-50/50 to-transparent pointer-events-none"></div>
                  </motion.button>
                );
              })}
            </div>

            <footer className="mt-20 text-center pb-10">
              <button onClick={() => setLeadView('list')} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-pd-pink transition-colors italic">Switch to Database View</button>
            </footer>
          </motion.div>
        ) : (
          <motion.div 
            key="stage-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 px-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
               <div className="flex items-center gap-6">
                 <button 
                  onClick={() => setActiveStage(null)}
                  className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-pd-pink hover:border-pd-pink transition-all"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                 </button>
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${selectedStageData?.color} flex items-center justify-center text-white shadow-lg`}>
                       {React.isValidElement(selectedStageData?.icon) && React.cloneElement(selectedStageData.icon as React.ReactElement<{ size?: number }>, { size: 20 })}
                    </div>
                    <div>
                       <h2 className="text-xl lg:text-2xl font-black italic uppercase text-slate-900 leading-none mb-1">{activeStage}</h2>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Queue for processing leads</p>
                    </div>
                 </div>
               </div>
               
               <div className="flex bg-slate-100/50 p-1 rounded-2xl self-start">
                  <div className="px-4 py-2 bg-white rounded-xl shadow-sm">
                     <span className="text-[10px] font-black uppercase italic text-slate-400 mr-2">Count:</span>
                     <span className="text-[10px] font-black uppercase italic text-slate-900">{stageLeads.length} Leads</span>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
              {stageLeads.length > 0 ? (
                stageLeads.map((lead, idx) => (
                  <motion.div 
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-6 rounded-[35px] border border-slate-50 flex flex-col md:flex-row md:items-center justify-between hover:border-pd-pink/30 transition-all shadow-sm group/card gap-6"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/card:bg-pd-pink/10 group-hover/card:text-pd-pink transition-colors shrink-0">
                        <Users size={24} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-base font-black italic uppercase text-slate-900 leading-none mb-1.5">{lead.name}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest">{lead.event} • {lead.guests} Pax</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest flex items-center gap-1">
                            <Phone size={10} /> {lead.phone}
                          </p>
                        </div>
                        <p className="text-[9px] font-black text-pd-pink uppercase tracking-widest mt-2 opacity-70 bg-pd-pink/5 px-2 py-0.5 rounded-full inline-block">Received: {lead.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                       {pipelineStages.filter(s => s.id !== activeStage).slice(0, 3).map(s => (
                          <button 
                            key={s.id}
                            onClick={(e) => { e.stopPropagation(); updateLeadStatus(lead.id, s.id); }}
                            className="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-slate-900 transition-all border border-slate-100/50 bg-slate-50/50"
                          >
                             Move to {s.id.split(' ')[0]}
                          </button>
                       ))}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-32 text-center border-4 border-dashed border-slate-100 rounded-[50px] bg-slate-50/30">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <MessageCircle size={32} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 italic mb-2">No Inquiries Found</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 italic opacity-70">Looks like this stage is currently empty</p>
                  <button 
                    onClick={() => setActiveStage(null)}
                    className="mt-8 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                  >
                    Back to Overview
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(LeadPipeline);
