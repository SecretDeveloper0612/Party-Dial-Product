'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Search, 
  X, 
  User, 
  ChevronRight 
} from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  location: string;
  event: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  unread?: boolean;
}

interface LeadExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  leadFilter: string;
  setLeadFilter: (filter: string) => void;
  recentLeads: Lead[];
  selectedEventTypes: string[];
  setSelectedEventTypes: (types: string[]) => void;
  guestRange: { min: number; max: number };
  setGuestRange: (range: { min: number; max: number }) => void;
  filteredLeads: Lead[];
}

const LeadExplorer = ({
  isOpen,
  onClose,
  searchTerm,
  setSearchTerm,
  leadFilter,
  setLeadFilter,
  recentLeads,
  selectedEventTypes,
  setSelectedEventTypes,
  guestRange,
  setGuestRange,
  filteredLeads
}: LeadExplorerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-slate-900/40 flex items-center justify-center p-4 md:p-10"
          style={{ willChange: 'opacity' }}
        >
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="bg-white w-full max-w-7xl h-full lg:h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative z-20"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Header */}
            <header className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-pd-pink flex items-center justify-center text-white shadow-lg shadow-pd-pink/20">
                  <Zap size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tight text-slate-900 leading-none mb-1">Lead <span className="text-pd-pink">Explorer</span></h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">High-Performance Lead Management Architecture</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 shadow-inner">
                  <Search size={14} className="text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name, event..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-900 w-48 italic"
                  />
                </div>
                <button 
                  onClick={onClose}
                  className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-900/20 hover:bg-pd-pink transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
              {/* SIDEBAR FILTERS - Light and optimized */}
              <aside className="w-80 border-r border-slate-100 p-8 space-y-10 overflow-y-auto hidden lg:block shrink-0 scrollbar-hide">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6 font-pd">Status Categorization</h4>
                  <div className="space-y-2">
                    {['All', 'New', 'In-Progress', 'Booked', 'Archived'].map(status => (
                      <button 
                        key={status}
                        onClick={() => setLeadFilter(status)}
                        className={`w-full flex items-center justify-between px-5 py-3 rounded-xl text-[11px] font-black uppercase italic transition-all ${leadFilter === status ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                      >
                        {status}
                        <span className="text-[9px] opacity-40">({recentLeads.filter(l => status === 'All' || l.status === status).length})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6 font-pd">Event Morphology</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {['Wedding', 'Corporate', 'Birthday', 'Engagement'].map(evt => (
                      <label key={evt} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer group transition-all">
                        <input 
                          type="checkbox" 
                          checked={selectedEventTypes.includes(evt)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedEventTypes([...selectedEventTypes, evt]);
                            else setSelectedEventTypes(selectedEventTypes.filter(t => t !== evt));
                          }}
                          className="w-4 h-4 rounded border-slate-200 text-pd-pink focus:ring-pd-pink" 
                        />
                        <span className="text-[11px] font-black uppercase italic text-slate-500 group-hover:text-slate-900">{evt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6 flex justify-between font-pd">
                    Guest Magnitude 
                    <span className="text-pd-pink font-pd">{guestRange.max}+</span>
                  </h4>
                  <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    step="50"
                    value={guestRange.max}
                    onChange={(e) => setGuestRange({ ...guestRange, max: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pd-pink"
                  />
                  <div className="flex justify-between mt-2 text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none font-pd">
                    <span>0 Pax</span>
                    <span>2k+ Pax</span>
                  </div>
                </div>

                <button 
                  onClick={() => { setSearchTerm(''); setLeadFilter('All'); setSelectedEventTypes([]); setGuestRange({ min: 0, max: 2000 }); }}
                  className="w-full py-4 border border-dashed border-slate-200 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-pd-pink hover:border-pd-pink transition-all font-pd"
                >
                  Reset Intelligence
                </button>
              </aside>

              {/* LEAD LIST - Optimized with hardware acceleration */}
              <main 
                className="flex-1 overflow-y-auto p-8 bg-slate-50/30 scroll-smooth" 
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <div className="grid grid-cols-1 gap-5 pb-20 max-w-5xl mx-auto">
                  {filteredLeads.map((lead) => (
                    <motion.div 
                      key={lead.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      className="bg-white p-5 rounded-[30px] border border-white shadow-sm hover:shadow-pd-soft hover:border-blue-100 transition-all flex items-center justify-between group cursor-pointer"
                      style={{ transform: 'translateZ(0)' }}
                    >
                      <div className="flex items-center gap-6 text-left">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform duration-500">
                          <User size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-base font-black italic text-slate-900 uppercase tracking-tight leading-none">{lead.name}</h4>
                            {lead.unread && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{lead.location}</span>
                            <span className="text-[9px] font-black uppercase text-pd-pink italic">{lead.event}</span>
                            <span className="text-[9px] font-bold text-slate-300 italic">{lead.date} • {lead.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-10">
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] font-black uppercase text-slate-300">Guests</span>
                          <span className="text-sm font-black italic text-slate-900 leading-none">{lead.guests}</span>
                        </div>
                        <div className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          lead.status === 'Booked' ? 'bg-emerald-50 text-emerald-600' : 
                          lead.status === 'New' ? 'bg-blue-50 text-blue-600 animate-pulse' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {lead.status}
                        </div>
                        <div className="flex items-center gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-pd-pink transition-colors">
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {filteredLeads.length === 0 && (
                    <div className="py-32 flex flex-col items-center justify-center text-center opacity-40">
                      <Search size={48} className="text-slate-200 mb-6" />
                      <p className="text-[11px] font-black uppercase italic tracking-widest">No matching inquiries found</p>
                    </div>
                  )}
                </div>
              </main>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(LeadExplorer);
