'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Phone, CalendarDays, MoreHorizontal, ArrowRight, MessageCircle } from 'lucide-react';

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
  setActiveTab: (tab: string) => void;
}

const LeadPipeline = ({
  recentLeads,
  pipelineStages,
  updateLeadStatus,
  setActiveTab
}: LeadPipelineProps) => {

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full h-full min-h-[70vh] flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm shrink-0">
         <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Lead Pipeline</h1>
            <p className="text-sm font-medium text-slate-500">Track and move your leads through the sales funnel</p>
         </div>
         <button 
           onClick={() => setActiveTab('leads')}
           className="px-4 py-2.5 bg-slate-50 border border-slate-200/60 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center gap-2 w-max shadow-sm"
         >
            Switch to List View <ArrowRight size={14} />
         </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-6 scrollbar-hide items-start">
        {pipelineStages.map((stage, i) => {
          const stageLeads = recentLeads.filter(l => l.status === stage.id);
          
          return (
            <motion.div 
              key={stage.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="w-[320px] shrink-0 flex flex-col max-h-full"
            >
              {/* Column Header */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 mb-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
                 <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${stage.color} flex items-center justify-center text-white shadow-sm`}>
                       {React.isValidElement(stage.icon) && React.cloneElement(stage.icon as React.ReactElement<{ size?: number }>, { size: 14 })}
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900">{stage.id}</h3>
                 </div>
                 <span className="px-2.5 py-1 bg-white border border-slate-200/60 rounded-full text-[10px] font-bold text-slate-600">
                   {stageLeads.length}
                 </span>
              </div>

              {/* Column Content */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-3 pb-2 scrollbar-hide min-h-[150px] bg-slate-50/30 rounded-2xl p-2 border border-slate-100 border-dashed">
                <AnimatePresence>
                  {stageLeads.map((lead, idx) => (
                    <motion.div 
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group relative cursor-grab active:cursor-grabbing"
                    >
                       <div className="flex justify-between items-start mb-3">
                          <h4 className="text-sm font-extrabold text-slate-900 leading-tight pr-2">{lead.name}</h4>
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === lead.id ? null : lead.id);
                              }}
                              className={`text-slate-400 hover:text-slate-700 transition-all ${activeDropdown === lead.id ? 'opacity-100 text-slate-700' : 'opacity-0 group-hover:opacity-100'}`}
                            >
                               <MoreHorizontal size={16} />
                            </button>
                            
                            <AnimatePresence>
                              {activeDropdown === lead.id && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 z-50 overflow-hidden py-1"
                                >
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${lead.phone.replace(/[^\d+]/g, '')}`; setActiveDropdown(null); }}
                                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2"
                                  >
                                    <Phone size={12} /> Call
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${lead.phone.replace(/[^\d+]/g, '').replace('+', '')}`, '_blank'); setActiveDropdown(null); }}
                                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2"
                                  >
                                    <MessageCircle size={12} /> WhatsApp
                                  </button>
                                  <div className="h-px bg-slate-100 my-1"></div>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); updateLeadStatus(lead.id, 'Lost'); setActiveDropdown(null); }}
                                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2"
                                  >
                                    Mark as Lost
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                       </div>
                       
                       <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                             <CalendarDays size={12} className="text-slate-400" />
                             <span className="truncate">{lead.event}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                             <Users size={12} className="text-slate-400" />
                             <span>{lead.guests} Guests</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                             <Phone size={12} className="text-slate-400" />
                             <span>{lead.phone}</span>
                          </div>
                       </div>

                       <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{lead.date}</span>
                          
                          {/* Quick Actions (Move to next stage) */}
                          <div className="flex gap-1">
                            {pipelineStages.findIndex(s => s.id === stage.id) < pipelineStages.length - 1 && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextStage = pipelineStages[pipelineStages.findIndex(s => s.id === stage.id) + 1];
                                  updateLeadStatus(lead.id, nextStage.id);
                                }}
                                className="w-6 h-6 rounded-md bg-slate-50 hover:bg-pd-pink/10 hover:text-pd-pink text-slate-400 flex items-center justify-center transition-colors"
                                title="Move Forward"
                              >
                                <ArrowRight size={12} />
                              </button>
                            )}
                          </div>
                       </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {stageLeads.length === 0 && (
                  <div className="h-32 flex flex-col items-center justify-center text-slate-300/60">
                    <MessageCircle size={24} className="mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400/60">Drop leads here</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default React.memo(LeadPipeline);
