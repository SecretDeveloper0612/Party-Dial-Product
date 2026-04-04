'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Filter, 
  ChevronDown, 
  CalendarDays, 
  Users, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  FileText 
} from 'lucide-react';

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
}

interface LeadInboxProps {
  filteredAdvancedLeads: Lead[];
  leadFilter: string;
  setLeadFilter: (filter: string) => void;
  updateLeadStatus: (leadId: string, newStatus: string) => void;
  setActiveTab: (tab: string) => void;
  setQuoteData: React.Dispatch<React.SetStateAction<any>>;
}

const LeadInbox = ({
  filteredAdvancedLeads,
  leadFilter,
  setLeadFilter,
  updateLeadStatus,
  setActiveTab,
  setQuoteData
}: LeadInboxProps) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Lead Inbox</h1>
          <p className="text-sm font-medium text-slate-500">Real-time inquiries from clients</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="bg-slate-100 p-3 rounded-2xl text-slate-600 hover:text-slate-900 transition-all">
              <Filter size={20} />
           </button>
        </div>
      </header>

      <div className="flex overflow-x-auto pb-2 custom-scrollbar bg-slate-50 p-1.5 rounded-3xl w-max">
         {['All', 'New', 'Contacted', 'Followups', 'Quoted'].map(filter => (
           <button 
             key={filter} 
             onClick={() => setLeadFilter(filter)}
             className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${leadFilter === filter ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
           >
             {filter}
           </button>
         ))}
      </div>

      <div className="space-y-4">
            {filteredAdvancedLeads.map((lead, i) => (
              <motion.div 
                key={lead.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-50 rounded-[32px] p-6 flex flex-col gap-5 border border-slate-100 shadow-sm hover:border-slate-300 transition-all font-sans"
              >
                 <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xl">
                          {lead.name ? lead.name.charAt(0).toUpperCase() : 'U'}
                       </div>
                       <div>
                          <h4 className="text-base font-black text-slate-900 flex items-center gap-2">{lead.name}</h4>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wide">just now</p>
                       </div>
                    </div>
                    <div className="relative">
                       <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100/50 text-[10px] font-black rounded-xl uppercase tracking-widest">
                          {lead.status} <ChevronDown size={14} />
                       </button>
                       <select 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                       >
                          {['New', 'In-Progress', 'Contacted', 'Followups', 'Quoted', 'Booked', 'Lost'].map(s => (
                             <option key={s} value={s}>{s}</option>
                          ))}
                       </select>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-1.5">
                       <CalendarDays size={14} className="text-slate-400" /> {lead.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Users size={14} className="text-slate-400" /> {lead.guests || '0'} Guests
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2 text-[13px] font-black italic text-slate-800">
                    <Sparkles size={14} className="text-rose-400" />
                    {lead.event}
                 </div>

                 <div className="mt-2">
                    <p className="text-[9px] uppercase font-black tracking-widest text-slate-400 mb-1">Phone Number</p>
                    <div className="flex items-center justify-between">
                       <p className="text-base font-black text-slate-900">{lead.phone || '+91 98765 43210'}</p>
                       <div className="flex gap-2">
                          <button 
                            onClick={() => window.location.href = `tel:${lead.phone ? lead.phone.replace(/[^\d+]/g, '') : ''}`}
                            className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center text-blue-600 z-10 relative"
                          >
                             <Phone size={14} />
                          </button>
                          <button 
                            onClick={() => window.open(`https://wa.me/${lead.phone ? lead.phone.replace(/[^\d+]/g, '').replace('+', '') : ''}`, '_blank')}
                            className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center text-emerald-600 z-10 relative"
                          >
                             <MessageCircle size={14} />
                          </button>
                       </div>
                    </div>
                 </div>

                 <div className="border-t border-slate-200/60 pt-5 flex items-center justify-between mt-2">
                    <button 
                      onClick={() => setActiveTab('pipeline')}
                      className="flex items-center gap-2 text-xs font-black text-slate-600 hover:text-slate-900 transition-colors z-10 relative"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v12"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
                       Update Pipeline
                    </button>
                    <button 
                      onClick={() => {
                         setQuoteData((prev: any) => ({ ...prev, client: lead.name, event: lead.event || 'Special Event' }));
                         setActiveTab('quotation');
                      }}
                      className="flex items-center gap-2 text-xs font-black text-slate-600 hover:text-slate-900 transition-colors z-10 relative"
                    >
                       <FileText size={16} strokeWidth={2.5} />
                       Send Quote
                    </button>
                 </div>
              </motion.div>
            ))}
         </div>
    </motion.div>
  );
};

export default React.memo(LeadInbox);
