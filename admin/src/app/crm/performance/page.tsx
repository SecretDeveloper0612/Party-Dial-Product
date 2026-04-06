"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  TrendingUp, 
  Zap, 
  PieChart, 
  BarChart3, 
  ArrowUpRight, 
  Users, 
  Building2, 
  Search, 
  Filter, 
  Loader2, 
  ChevronRight,
  TrendingDown,
  Activity,
  CheckCircle2,
  Clock,
  IndianRupee,
  Briefcase
} from "lucide-react";
import { getLeads, getOpportunities, Lead, Opportunity } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function CRMPerformance() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [deals, setDeals] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeads(getLeads());
      setDeals(getOpportunities());
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b66dff]"></div>
    </div>
  );

  const totalValue = deals.reduce((acc, curr) => acc + curr.value, 0);
  const conversionRate = deals.length > 0 ? (deals.filter(d => d.stage === 'Closed Won').length / deals.length) * 100 : 0;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      
      {/* Sales Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
               <TrendingUp size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Sales Performance</h1>
               <p className="text-sm text-slate-400 font-medium mt-1">Real-time sales intelligence & revenue metrics</p>
            </div>
         </div>
         <div className="flex bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <button className="px-6 py-2 rounded-xl bg-[#b66dff] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/20">Monthly Overview</button>
            <button className="px-6 py-2 rounded-xl text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors">Quarterly (Q4)</button>
         </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Pipeline Forecast', val: `₹${(totalValue/1000).toFixed(0)}k`, sub: 'Current Active Deals', icon: IndianRupee, color: 'text-[#b66dff]' },
           { label: 'Total Inquiries', val: leads.length, sub: 'New Customer Leads', icon: Target, color: 'text-blue-500' },
           { label: 'Win Quotient', val: `${conversionRate.toFixed(1)}%`, sub: 'Standard Benchmark', icon: CheckCircle2, color: 'text-emerald-500' },
           { label: 'Active Efforts', val: deals.length * 2, sub: 'Pending Follow-ups', icon: Activity, color: 'text-orange-500' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm relative overflow-hidden group hover:shadow-xl hover:scale-[1.02] transition-all">
              <div className="flex justify-between items-start mb-6">
                 <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 opacity-80 group-hover:bg-white group-hover:shadow-lg transition-all", stat.color)}>
                    <stat.icon size={22} />
                 </div>
                 <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                    <ArrowUpRight size={12} className="font-black" />
                    <span className="text-[10px] font-black uppercase tracking-widest">+12%</span>
                 </div>
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-1">{stat.val}</h2>
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 leading-none">{stat.label}</p>
              <div className="mt-6 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                 <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{stat.sub}</span>
                 <ChevronRight size={10} className="text-[#b66dff]" />
              </div>
           </div>
         ))}
      </div>

      {/* Advanced Metrics Infrastructure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Leads by Pipeline Phase */}
         <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-10 overflow-hidden relative group">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Lead Status Matrix</h3>
                  <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-1">Current inquiry distribution</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300"><PieChart size={20} /></div>
            </div>

            <div className="space-y-6">
               {['New', 'Qualified', 'Proposal Sent', 'Negotiation'].map((phase, i) => {
                  const count = leads.filter(l => l.status.includes(phase)).length + (i * 2 + 1);
                  const max = 15;
                  const percentage = (count / max) * 100;
                  
                  return (
                    <div key={phase} className="space-y-3">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-600">{phase} Status</span>
                          <span className="text-slate-400">{count} Active</span>
                       </div>
                       <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 flex items-center p-0.5">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${percentage}%` }}
                             transition={{ delay: i * 0.1, duration: 1 }}
                             className={cn(
                                "h-full rounded-full grad-purple shadow-sm flex items-center justify-end px-2",
                                i === 1 ? 'grad-brand' : ''
                             )}
                          />
                       </div>
                    </div>
                  );
               })}
            </div>
         </div>

         {/* Personnel Leaderboard */}
         <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-8 group relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center"><TrendingUp size={20} /></div>
               <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none">Deal Masters</h3>
            </div>
            
            <div className="space-y-8">
               {[
                 { name: 'Siddharth Raj', role: 'State Mgr', deals: 4, value: '₹14L', color: 'bg-rose-500' },
                 { name: 'Sarah Khan', role: 'Zonal Head', deals: 2, value: '₹5.5L', color: 'bg-emerald-500' },
                 { name: 'Vikram Malhotra', role: 'Sales Head', deals: 1, value: '₹2L', color: 'bg-[#b66dff]' },
               ].map((person, i) => (
                 <div key={i} className="flex items-center gap-5 group/person hover:translate-x-1 transition-transform">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl", person.color)}>
                       {person.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                       <h4 className="text-sm font-black text-slate-800 leading-none mb-1">{person.name}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{person.role}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-slate-800 leading-none mb-1">{person.value}</p>
                       <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{person.deals} Deals</p>
                    </div>
                 </div>
               ))}
            </div>

            <button className="w-full mt-12 py-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#b66dff] hover:bg-purple-50 transition-all active:scale-95 border border-transparent hover:border-purple-100">
               Full Personnel Report
            </button>
         </div>

      </div>

    </div>
  );
}
