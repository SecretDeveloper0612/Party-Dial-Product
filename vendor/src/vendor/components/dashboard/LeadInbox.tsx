'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ChevronDown, 
  CalendarDays, 
  Users, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  FileText,
  Search,
  MoreVertical,
  Mail
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  event: string;
  guests: string;
  date: string;
  time: string;
  eventDate: string | null;
  status: string;
  email: string;
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

  const filters = ['All', 'New', 'Contacted', 'Followups', 'Quotation Send', 'Booked', 'Lost'];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lead Inbox</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Manage and respond to your venue inquiries</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search leads..." 
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-pd-pink/20 focus:border-pd-pink transition-all w-full md:w-64"
                />
             </div>
             <button className="p-2.5 bg-white border border-slate-200/60 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={18} />
             </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2 w-max max-w-full">
           {filters.map(filter => (
             <button 
               key={filter} 
               onClick={() => setLeadFilter(filter)}
               className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                 leadFilter === filter 
                 ? 'bg-slate-900 text-white shadow-md' 
                 : 'bg-white border border-slate-200/60 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
               }`}
             >
               {filter}
             </button>
           ))}
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        
        {/* Table Header (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
           <div className="col-span-4 pl-4">Lead Info</div>
           <div className="col-span-3">Event Details</div>
           <div className="col-span-3">Contact</div>
           <div className="col-span-2 text-right pr-4">Status & Action</div>
        </div>

        <div className="divide-y divide-slate-100">
          <AnimatePresence>
            {filteredAdvancedLeads.length > 0 ? filteredAdvancedLeads.map((lead, i) => (
              <motion.div 
                key={lead.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col md:grid md:grid-cols-12 gap-4 p-4 lg:p-5 hover:bg-slate-50/50 transition-all items-start md:items-center relative"
              >
                 {/* Lead Info */}
                 <div className="col-span-4 flex gap-4 items-center w-full md:w-auto md:pl-2">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-linear-to-tr from-pd-pink/10 to-pd-purple/10 text-pd-pink flex items-center justify-center font-extrabold text-sm lg:text-base shrink-0 border border-pd-pink/20">
                       {lead.name ? lead.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                       <h4 className="text-sm font-extrabold text-slate-900 truncate">{lead.name}</h4>
                       <div className="flex items-center gap-1 text-xs font-medium text-slate-500 mt-0.5">
                         <span className="truncate">{lead.email || 'No email provided'}</span>
                       </div>
                       <div className="md:hidden mt-2 flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${lead.color} border border-current/10`}>
                            {lead.status}
                          </span>
                       </div>
                    </div>
                 </div>

                 {/* Event Details */}
                 <div className="col-span-3 flex flex-col gap-1.5 w-full md:w-auto text-sm">
                    <div className="flex items-center gap-2 font-bold text-slate-700">
                       <Sparkles size={14} className="text-pd-purple shrink-0" />
                       <span className="truncate">{lead.event}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                       <span className="flex items-center gap-1.5 whitespace-nowrap">
                         <Users size={12} className="opacity-70" /> {lead.guests || '0'} Guests
                       </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                       <CalendarDays size={12} className="text-amber-500 shrink-0" />
                       {lead.eventDate ? (
                         <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50 whitespace-nowrap">
                           {new Date(lead.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                         </span>
                       ) : (
                         <span className="text-[10px] text-slate-400 italic">Date unconfirmed</span>
                       )}
                    </div>
                 </div>

                 {/* Contact Actions */}
                 <div className="col-span-3 flex md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <p className="text-sm font-extrabold text-slate-900 hidden md:block">{lead.phone || '+91 98765 43210'}</p>
                    <div className="flex gap-2 w-full md:w-auto">
                       <button 
                         onClick={() => window.location.href = `tel:${lead.phone ? lead.phone.replace(/[^\d+]/g, '') : ''}`}
                         className="flex-1 md:flex-none h-8 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center text-blue-600 text-xs font-bold gap-1.5 border border-blue-200/50"
                       >
                          <Phone size={12} /> <span className="md:hidden">Call</span>
                       </button>
                       <button 
                         onClick={() => window.open(`https://wa.me/${lead.phone ? lead.phone.replace(/[^\d+]/g, '').replace('+', '') : ''}`, '_blank')}
                         className="flex-1 md:flex-none h-8 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center text-emerald-600 text-xs font-bold gap-1.5 border border-emerald-200/50"
                       >
                          <MessageCircle size={12} /> <span className="md:hidden">WhatsApp</span>
                       </button>
                    </div>
                 </div>

                 {/* Status & Action */}
                 <div className="col-span-2 flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-4 md:mt-0 md:pr-2">
                    <div className="relative hidden md:block group/select w-full max-w-[140px]">
                       <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400 group-hover/select:text-slate-600">
                         <ChevronDown size={14} />
                       </div>
                       <select 
                          className={`w-full appearance-none pr-8 pl-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
                            lead.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200/50' :
                            lead.status === 'Booked' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                            lead.status === 'Lost' ? 'bg-rose-50 text-rose-700 border-rose-200/50' :
                            'bg-slate-50 text-slate-700 border-slate-200/60'
                          }`}
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                       >
                          {['New', 'Contacted', 'Followups', 'Quotation Send', 'Booked', 'Lost'].map(s => (
                             <option key={s} value={s} className="bg-white text-slate-900">{s}</option>
                          ))}
                       </select>
                    </div>

                    <button 
                      onClick={() => setActiveTab('pipeline')}
                      className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                      title="View in Pipeline"
                    >
                       <MoreVertical size={16} />
                    </button>
                 </div>
                 
                 {/* Mobile divider */}
                 <div className="md:hidden w-full h-px bg-slate-100 mt-2"></div>
              </motion.div>
            )) : (
              <div className="p-12 flex flex-col items-center justify-center text-center bg-slate-50/30">
                 <div className="w-16 h-16 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                   <Users size={24} />
                 </div>
                 <h3 className="text-base font-bold text-slate-900 mb-1">No Leads Found</h3>
                 <p className="text-sm font-medium text-slate-500 max-w-sm">No inquiries match the current filter. Try selecting a different category or wait for new leads.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(LeadInbox);
