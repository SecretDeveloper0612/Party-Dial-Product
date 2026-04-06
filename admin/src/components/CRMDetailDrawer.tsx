"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Clock, 
  Phone, 
  Mail, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  User,
  Plus,
  Send,
  MoreVertical,
  Zap,
  Tag,
  Paperclip,
  Activity as ActivityIcon,
  Sparkles
} from "lucide-react";
import { Lead, Opportunity, Activity, getActivities, getUsers } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import SendQuotationModal from "./SendQuotationModal";

interface CRMDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entity: Lead | Opportunity | null;
  type: 'Lead' | 'Opportunity' | 'Account' | 'Contact';
}

export default function CRMDetailDrawer({ isOpen, onClose, entity, type }: CRMDetailDrawerProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const team = getUsers();

  useEffect(() => {
    if (entity && isOpen) {
      setActivities(getActivities(entity.id));
    }
  }, [entity, isOpen]);

  if (!entity) return null;

  const getEntityName = () => {
    if (!entity) return "Unknown";
    if ('customerName' in entity) return entity.customerName;
    if ('firstName' in entity && 'lastName' in entity) return `${entity.firstName} ${entity.lastName}`;
    return (entity as any).name || "Entity";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="drawer-hub" className="relative z-[150]">
          <motion.div 
            key="drawer-overlay"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" 
          />
          <motion.div 
            key={`drawer-content-${entity.id}`}
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-3xl grad-brand text-white flex items-center justify-center font-black text-xl shadow-xl shadow-purple-500/10">
                     {getEntityName().charAt(0)}
                  </div>
                  <div>
                     <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{getEntityName()}</h2>
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">Active {type}</span>
                     </div>
                     <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{type} Identifier: {entity.id}</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-all text-slate-300 hover:text-slate-600 shadow-sm"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
               
               {/* Quick Info Grid */}
               <div className="grid grid-cols-3 gap-1 p-2 bg-slate-50/50 border-b border-slate-50">
                  <div className="bg-white p-6 flex flex-col items-center justify-center text-center gap-1">
                     <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Phone</span>
                     <span className="text-xs font-black text-slate-700">{'phone' in entity ? entity.phone : 'N/A'}</span>
                  </div>
                  <div className="bg-white p-6 flex flex-col items-center justify-center text-center gap-1">
                     <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Email</span>
                     <span className="text-xs font-black text-slate-700">{'email' in entity ? entity.email : 'N/A'}</span>
                  </div>
                  <div className="bg-white p-6 flex flex-col items-center justify-center text-center gap-1">
                     <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Created At</span>
                     <span className="text-xs font-black text-slate-700">{entity.createdAt.split('T')[0]}</span>
                  </div>
               </div>

               <div className="p-10 space-y-12">
                  
                  {/* Performance Hub */}
                  <div>
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#b66dff] flex items-center justify-center"><ActivityIcon size={20} /></div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none uppercase tracking-widest text-xs">Interaction Timeline</h3>
                     </div>

                     <div className="space-y-8 relative pl-6">
                        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-slate-100" />
                        
                        <AnimatePresence>
                           {activities.map((act, i) => (
                             <motion.div 
                               key={act.id} 
                               initial={{ opacity: 0, x: -10 }} 
                               animate={{ opacity: 1, x: 0 }} 
                               transition={{ delay: i * 0.1 }}
                               className="relative group"
                             >
                                <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#b66dff] group-hover:scale-125 transition-transform" />
                                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer">
                                   <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                         <span className="text-[10px] font-black uppercase text-[#b66dff]">{act.type}</span>
                                         <span className="text-[10px] font-bold text-slate-300 uppercase">{new Date(act.createdAt).toLocaleDateString()} at {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                         <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-[8px]"><User size={10} /></div>
                                         <span className="text-[10px] font-black uppercase text-slate-400">{team.find(u => u.id === act.personnelId)?.name || 'System'}</span>
                                      </div>
                                   </div>
                                   <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{act.content}"</p>
                                   {act.outcome && (
                                     <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 w-fit">
                                        <CheckCircle2 size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{act.outcome}</span>
                                     </div>
                                   )}
                                </div>
                             </motion.div>
                           ))}
                        </AnimatePresence>
                     </div>
                  </div>

                  {/* Remarks & Notes System */}
                  <div>
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center"><FileText size={20} /></div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none uppercase tracking-widest text-xs">Strategic Remarks</h3>
                     </div>
                     <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                           <Zap size={60} className="text-[#b66dff]" />
                        </div>
                        <p className="text-sm font-bold text-slate-600 leading-relaxed mb-6">
                           {'notes' in entity ? entity.notes[0] : 'No high-level remarks available for this tactical deal node.'}
                        </p>
                        <div className="flex flex-col gap-4">
                           <button 
                             onClick={() => setIsQuoteModalOpen(true)}
                             className="flex-1 py-4 grad-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-purple-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 group/btn"
                           >
                              <Sparkles size={16} className="group-hover/btn:scale-125 transition-transform" /> <span>Send Official Quotation</span>
                           </button>
                           <div className="flex items-center gap-3">
                              <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95">
                                 <Plus size={14} /> <span>Log New Activity</span>
                              </button>
                              <button className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:text-rose-500 hover:bg-rose-50 transition-all"><MoreVertical size={16} /></button>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* System Dossier Assets */}
                  <div>
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center"><Paperclip size={20} /></div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none uppercase tracking-widest text-xs">System Dossier Assets</h3>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        {['Contract_Draft_V1.pdf', 'Venue_Floorplan_2024.jpg'].map((file, i) => (
                          <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-[#b66dff] hover:shadow-lg transition-all cursor-pointer group">
                             <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-300 group-hover:text-[#b66dff] transition-all shadow-sm"><FileText size={16} /></div>
                             <div className="flex-1">
                                <p className="text-[10px] font-black text-slate-700 leading-none mb-1">{file}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase">2.4 MB • PDF Document</p>
                             </div>
                             <Send size={12} className="text-slate-200 group-hover:text-[#b66dff]" />
                          </div>
                        ))}
                     </div>
                  </div>

               </div>
            </div>

            {/* Quick Communicator */}
            <div className="p-8 bg-slate-50/50 border-t border-slate-100">
               <div className="flex items-center gap-4 relative">
                  <input 
                    placeholder="Log a rapid remark..." 
                    className="flex-1 bg-white border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-[#b66dff] transition-all shadow-lg shadow-slate-200/20" 
                  />
                  <button className="p-4 grad-brand text-white rounded-2xl shadow-xl shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all"><Clock size={20} /></button>
               </div>
            </div>

          </motion.div>
        </div>
      )}

      <SendQuotationModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        entityName={getEntityName()} 
        entityId={entity.id} 
      />
    </AnimatePresence>
  );
}
