"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Search, 
  Plus, 
  IndianRupee, 
  Calendar, 
  Building2, 
  TrendingUp, 
  Target,
  MoreHorizontal,
  Loader2,
  PieChart,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight
} from "lucide-react";
import { getOpportunities, getAccounts, Opportunity, Account } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function CRMOpportunities() {
  const [deals, setDeals] = useState<Opportunity[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeals(getOpportunities());
      setAccounts(getAccounts());
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredDeals = deals.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDealValue = deals.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
               <Briefcase size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Sales Deals</h1>
               <p className="text-sm text-slate-400 font-medium mt-1">Track active revenue opportunities and subscriptions</p>
            </div>
         </div>
         <button className="px-6 py-4 grad-purple text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
            <Plus size={18} /> <span>Add New Deal</span>
         </button>
      </div>

      {/* Sales Summary Overlay */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Active Pipeline', val: `₹${(totalDealValue/1000).toFixed(1)}k`, valSub: `${deals.length} Open Deals`, icon: TrendingUp, color: 'text-[#b66dff]' },
           { label: 'Win Probability', val: '72%', valSub: 'Average Index', icon: Target, color: 'text-emerald-500' },
           { label: 'Closure Target', val: '₹12.5L', valSub: 'Target Q2', icon: Zap, color: 'text-orange-500' },
           { label: 'Conversion Rate', val: '34%', valSub: '+2% this month', icon: PieChart, color: 'text-blue-500' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm transition-all hover:bg-slate-50/10 group">
              <div className="flex justify-between items-start mb-4">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
                 <stat.icon size={16} className={cn("opacity-40 group-hover:opacity-100 transition-opacity", stat.color)} />
              </div>
              <h4 className={cn("text-2xl font-black mb-1", stat.color)}>{stat.val}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.valSub}</p>
           </div>
         ))}
      </div>

      {/* Control Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         <div className="lg:col-span-12 relative group flex items-center">
            <input 
              type="text" 
              placeholder="Search active deals by identifier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="user-input pr-12 pl-4 shadow-sm"
            />
            <div className="absolute right-4 pointer-events-none">
               <Search className="text-slate-400" size={18} />
            </div>
         </div>
      </div>

      {/* Deals Portfolio Ledger */}
      <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden group">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Deal Name</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Account</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Deal Value</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Deal Stage</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Expected Closing</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                         <Loader2 className="animate-spin text-[#b66dff] mx-auto mb-4" size={32} />
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Sales Pipeline...</p>
                      </td>
                    </tr>
                  ) : filteredDeals.map((deal, i) => (
                    <motion.tr 
                      key={deal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group/row"
                    >
                       <td className="p-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl grad-brand text-white flex items-center justify-center font-black text-sm">{deal.name.charAt(0)}</div>
                             <div>
                                <h4 className="text-sm font-bold text-slate-800">{deal.name}</h4>
                             </div>
                          </div>
                       </td>
                       <td className="p-6">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                             <Building2 size={12} className="text-slate-300" />
                             {accounts.find(a => a.id === deal.accountId)?.name || 'Direct Business'}
                          </div>
                       </td>
                       <td className="p-6">
                          <span className="text-sm font-black text-slate-800 flex items-center gap-1">
                             <IndianRupee size={12} className="text-emerald-500" />
                             {deal.value.toLocaleString()}
                          </span>
                       </td>
                       <td className="p-6 text-sm font-bold text-slate-600">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 w-fit">
                             <TrendingUp size={12} />
                             <span className="text-[10px] font-black uppercase tracking-widest">{deal.stage}</span>
                          </div>
                       </td>
                       <td className="p-6 text-xs font-bold text-slate-400 flex items-center gap-2">
                          <Calendar size={12} />
                          {deal.expectedCloseDate}
                       </td>
                       <td className="p-6"><MoreHorizontal className="text-slate-300 hover:text-[#b66dff] cursor-pointer" /></td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <style jsx global>{`
        .user-input { width: 100%; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 1.25rem; padding: 1.25rem; font-size: 0.875rem; font-weight: 700; transition: all 0.3s; outline: none; }
        .user-input:focus { border-color: #b66dff; background: #ffffff; box-shadow: 0 4px 20px rgba(182, 109, 255, 0.08); }
      `}</style>
    </div>
  );
}
