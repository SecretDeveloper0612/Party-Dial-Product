"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Search, 
  Plus, 
  IndianRupee, 
  ArrowRight,
  TrendingUp,
  Loader2,
  ChevronLeft,
  XCircle,
  Clock,
  MoreHorizontal,
  Target,
  Zap,
  LayoutGrid,
  Users,
  ChevronRight
} from "lucide-react";
import { getOpportunities, getAccounts, Opportunity, Account, OpportunityStage, getProbabilityByStage } from "@/lib/store";
import { cn } from "@/lib/utils";
import CRMDetailDrawer from "@/components/CRMDetailDrawer";

const STAGES: { id: OpportunityStage; color: string; bg: string; icon: any }[] = [
  { id: 'New Lead', color: 'text-blue-500', bg: 'bg-blue-50/50', icon: Target },
  { id: 'Qualified', color: 'text-purple-500', bg: 'bg-purple-50/50', icon: Zap },
  { id: 'Meeting Scheduled', color: 'text-amber-500', bg: 'bg-amber-50/50', icon: Users },
  { id: 'Proposal Sent', color: 'text-indigo-500', bg: 'bg-indigo-50/50', icon: IndianRupee },
  { id: 'Negotiation', color: 'text-orange-500', bg: 'bg-orange-50/50', icon: TrendingUp },
  { id: 'Closed Won', color: 'text-emerald-500', bg: 'bg-emerald-50/50', icon: ChevronRight },
  { id: 'Closed Lost', color: 'text-rose-500', bg: 'bg-rose-50/50', icon: XCircle }
];

export default function CRMPipeline() {
  const [deals, setDeals] = useState<Opportunity[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<OpportunityStage | null>(null);
  
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewingDeal, setViewingDeal] = useState<Opportunity | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeals(getOpportunities());
      setAccounts(getAccounts());
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const getStageTotal = (stage: OpportunityStage) => {
    return deals
      .filter(d => d.stage === stage)
      .reduce((acc, curr) => acc + curr.value, 0);
  };

  const currentStageDeals = deals.filter(d => d.stage === selectedStage);

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-200">
      
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
         <div className="flex items-center gap-5">
            {selectedStage ? (
               <button 
                 onClick={() => setSelectedStage(null)}
                 className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-[#b66dff] hover:shadow-lg transition-all"
               >
                  <ChevronLeft size={24} />
               </button>
            ) : (
               <div className="w-16 h-16 rounded-[2rem] grad-brand flex items-center justify-center text-white shadow-2xl shadow-purple-500/30 transform -rotate-3">
                  <LayoutGrid size={32} />
               </div>
            )}
            <div>
               <h1 className="text-4xl font-black text-slate-800 m-0 tracking-tighter">
                  {selectedStage ? selectedStage : "Sales Phases"}
               </h1>
               <p className="text-sm text-slate-400 font-medium mt-1.5 uppercase tracking-widest font-black opacity-60">
                  {selectedStage ? `Reviewing ${currentStageDeals.length} active opportunities` : "Select a phase to explore active deals"}
               </p>
            </div>
         </div>
      </div>

      <AnimatePresence mode="wait">
         {!selectedStage ? (
            /* GRID VIEW: Stage Hubs */
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
               {STAGES.map((stage, i) => {
                  const count = deals.filter(d => d.stage === stage.id).length;
                  const value = getStageTotal(stage.id);
                  return (
                    <motion.div 
                      key={stage.id}
                      onClick={() => setSelectedStage(stage.id)}
                      whileHover={{ y: -10, scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "p-10 rounded-[3rem] border border-white shadow-2xl shadow-slate-200/50 cursor-pointer relative group overflow-hidden transition-all",
                        stage.bg
                      )}
                    >
                       <div className={cn("absolute -right-6 -top-6 opacity-[0.05] group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700", stage.color)}>
                          <stage.icon size={120} />
                       </div>
                       
                       <div className="relative z-10">
                          <div className={cn("w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-10 transition-shadow group-hover:shadow-xl", stage.color)}>
                             <stage.icon size={24} />
                          </div>
                          
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{stage.id}</h3>
                          <div className="flex items-baseline gap-3">
                             <span className="text-4xl font-black text-slate-800">{count}</span>
                             <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Active Deals</span>
                          </div>
                          
                          <div className="mt-8 pt-8 border-t border-white/50 flex items-center justify-between">
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Stage Value</span>
                                <span className="text-lg font-black text-slate-800">₹{(value/1000).toFixed(0)}k</span>
                             </div>
                             <div className={cn("w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity", stage.color)}>
                                <ChevronRight size={20} />
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  );
               })}
            </motion.div>
         ) : (
            /* DETAILED VIEW: Stage Leads */
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
               {/* Stage Breakdown Summary */}
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex gap-10">
                     <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Pipeline Value</p>
                        <p className="text-2xl font-black text-slate-800 flex items-center gap-2">
                           <IndianRupee size={20} className="text-emerald-500" />
                           {getStageTotal(selectedStage).toLocaleString()}
                        </p>
                     </div>
                     <div className="w-[1px] bg-slate-100" />
                     <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Lead Count</p>
                        <p className="text-2xl font-black text-slate-800">{currentStageDeals.length}</p>
                     </div>
                  </div>
               </div>

               {/* Lead Stack */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                  {currentStageDeals.length === 0 ? (
                    <div className="col-span-full py-32 text-center flex flex-col items-center gap-4 opacity-30">
                       <Zap size={40} />
                       <h3 className="text-[10px] font-black uppercase tracking-widest">No active deals in this phase</h3>
                    </div>
                  ) : currentStageDeals.map((deal, i) => (
                    <motion.div 
                      key={deal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        setViewingDeal(deal);
                        setIsDrawerOpen(true);
                      }}
                      className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all group relative overflow-hidden cursor-pointer"
                    >
                       <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl grad-brand text-white flex items-center justify-center font-black text-lg shadow-xl shadow-purple-500/10">
                                {deal.name.charAt(0)}
                             </div>
                             <div>
                                <h4 className="text-lg font-black text-slate-800 leading-none mb-2">{deal.name}</h4>
                                <p className="text-xs font-bold text-slate-400 flex items-center gap-2 tracking-tight uppercase tracking-tighter">
                                   <Building2 size={12} className="text-[#b66dff]" />
                                   {accounts.find(a => a.id === deal.accountId)?.name || 'Direct Business'}
                                </p>
                             </div>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                             <TrendingUp size={10} className="font-black" />
                             <span className="text-[9px] font-black uppercase tracking-widest">{getProbabilityByStage(deal.stage)}%</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                          <div className="space-y-1">
                             <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Deal Amount</p>
                             <p className="text-xl font-black text-slate-800">₹{deal.value.toLocaleString()}</p>
                          </div>
                          <div className="space-y-1 text-right">
                             <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Expected Close</p>
                             <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-600">
                                <Clock size={12} className="text-orange-400" />
                                {deal.expectedCloseDate}
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      <CRMDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        entity={viewingDeal as any} 
        type="Opportunity" 
      />

    </div>
  );
}
