"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Filter, 
  Search, 
  MoreHorizontal, 
  Phone, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight,
  User,
  Building2,
  Zap,
  ArrowRight,
  TrendingUp,
  XCircle,
  Plus,
  Mail,
  Video
} from "lucide-react";
import { getOpportunities, getAccounts, Opportunity, Account } from "@/lib/store";
import { cn } from "@/lib/utils";
import CRMDetailDrawer from "@/components/CRMDetailDrawer";

export default function CRMFollowUps() {
  const [deals, setDeals] = useState<Opportunity[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'overdue' | 'upcoming'>('all');
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState<Opportunity | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeals(getOpportunities());
      setAccounts(getAccounts());
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredFollowUps = deals.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    // Simulate real date logic (all mock dates are in the past)
    if (activeFilter === 'today') return d.id === 'opp1'; // Mock
    if (activeFilter === 'overdue') return true; // Most mocks
    return true;
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-1000">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
               <Clock size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Daily Follow-ups</h1>
               <p className="text-sm text-slate-400 font-medium mt-1">Manage active tasks and upcoming customer touchpoints</p>
            </div>
         </div>
         <button className="px-6 py-4 grad-purple text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
            <Plus size={18} /> <span>New Task</span>
         </button>
      </div>

      {/* Control Surface & Quick Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         <div className="lg:col-span-6 relative group flex items-center">
            <input 
              type="text" 
              placeholder="Locate a task or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="user-input pr-12 pl-4 shadow-sm"
            />
            <div className="absolute right-4 pointer-events-none">
               <Search className="text-slate-300" size={18} />
            </div>
         </div>
         <div className="lg:col-span-6 flex gap-2">
            {[
              { id: 'all', label: 'All Tasks', icon: Calendar },
              { id: 'today', label: 'Due Today', icon: Zap },
              { id: 'overdue', label: 'Overdue', icon: AlertCircle },
              { id: 'upcoming', label: 'Upcoming', icon: TrendingUp },
            ].map(f => (
               <button 
                 key={f.id}
                 onClick={() => setActiveFilter(f.id as any)}
                 className={cn(
                   "flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                   activeFilter === f.id 
                     ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                     : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                 )}
               >
                  <f.icon size={12} />
                  <span>{f.label}</span>
               </button>
            ))}
         </div>
      </div>

      {/* Follow-up Hub List */}
      <div className="space-y-4">
         {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
               <Loader2 className="animate-spin text-[#b66dff]" size={40} />
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Compiling Deadlines...</p>
            </div>
         ) : filteredFollowUps.length === 0 ? (
            <div className="py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center opacity-30">
               <CheckCircle2 size={40} className="mb-4 text-emerald-500" />
               <h3 className="text-[10px] font-black uppercase tracking-widest">Inbox Clean</h3>
               <p className="text-[9px] font-bold uppercase mt-2">No pending follow-ups for this selection</p>
            </div>
         ) : filteredFollowUps.map((task, i) => {
            const acc = accounts.find(a => a.id === task.accountId);
            return (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                  setViewingTask(task);
                  setIsDrawerOpen(true);
                }}
                className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm hover:shadow-xl hover:scale-[1.005] transition-all group relative overflow-hidden cursor-pointer"
              >
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm group-hover:bg-purple-50 group-hover:text-[#b66dff] transition-all">
                          {i % 3 === 0 ? <Phone size={24} /> : i % 3 === 1 ? <Mail size={24} /> : <Video size={24} />}
                       </div>
                       <div>
                          <div className="flex items-center gap-3">
                             <h3 className="text-xl font-black text-slate-800 m-0 leading-none">{task.name}</h3>
                             <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                                i === 0 ? "bg-rose-50 text-rose-500 border border-rose-100" : "bg-emerald-50 text-emerald-500 border border-emerald-100"
                             )}>
                                {i === 0 ? "High Priority" : "Normal"}
                             </span>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                             <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                <Building2 size={12} className="text-[#b66dff]" />
                                {acc?.name || 'Inquiry Contact'}
                             </div>
                             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <Calendar size={12} className="text-orange-400" />
                                {task.expectedCloseDate}
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all transform active:scale-95 shadow-sm">
                          <CheckCircle2 size={14} /> <span>Mark Complete</span>
                       </button>
                       <button onClick={(e) => e.stopPropagation()} className="p-4 rounded-xl bg-slate-50 text-slate-300 hover:text-[#b66dff] hover:bg-white hover:shadow-md transition-all">
                          <MoreHorizontal size={20} />
                       </button>
                    </div>
                 </div>

                 {/* Simulated Logic Indicator */}
                 <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-300 italic">Expected Outcome: Discovery Call regarding Platinum Subscription</p>
                    <div className="flex -space-x-3">
                       {[1,2].map(u => (
                         <div key={u} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm"><User size={12} /></div>
                       ))}
                    </div>
                 </div>
              </motion.div>
            );
         })}
      </div>

      <CRMDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        entity={viewingTask as any} 
        type="Opportunity" 
      />

      <style jsx global>{`
        .user-input { width: 100%; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 1.25rem; padding: 1.25rem; font-size: 0.875rem; font-weight: 700; transition: all 0.3s; outline: none; }
        .user-input:focus { border-color: #b66dff; background: #ffffff; box-shadow: 0 4px 20px rgba(182, 109, 255, 0.08); }
      `}</style>
    </div>
  );
}
