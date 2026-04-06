"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Layers,
  Activity,
  ArrowUpRight,
  Target
} from "lucide-react";

export default function BillingOverview() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Overview Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
               <TrendingUp size={28} />
            </div>
             <div>
                <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Billing Intelligence</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">Real-time financial performance and analytics hub</p>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title="Gross Portfolio" value="₹12.4M" change="+14.2%" icon={DollarSign} color="grad-purple" />
            <StatsCard title="Invoiced Volume" value="₹4.8M" change="+8.1%" icon={Layers} color="grad-blue" />
            <StatsCard title="Settled Cashflow" value="₹3.2M" change="+12.5%" icon={Activity} color="grad-green" />
         </div>
         <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Fiscal Health</p>
                  <h4 className="text-xl font-black uppercase tracking-tight">Aegis Secure</h4>
               </div>
               <div className="mt-8">
                  <p className="text-3xl font-black">98.2%</p>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mt-1">Recovery Rate</p>
               </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Target size={180} />
            </div>
         </div>
      </div>

      {/* Main Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-10 h-80 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300">
               <Activity size={32} />
            </div>
            <div>
               <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Yield Engine Offline</h4>
               <p className="text-xs text-slate-400 font-medium mt-1 max-w-xs mx-auto">Connect your transaction gateway to activate granular performance charting.</p>
            </div>
         </div>
         <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-10 h-80 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300">
               <Calendar size={32} />
            </div>
            <div>
               <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Forecast Pending</h4>
               <p className="text-xs text-slate-400 font-medium mt-1 max-w-xs mx-auto">AI models are currently synchronizing historic events to predict future revenue cycles.</p>
            </div>
         </div>
      </div>

    </div>
  );
}

function StatsCard({ title, value, change, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
         <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
            <Icon size={20} />
         </div>
         <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase tracking-widest px-2 py-1 bg-emerald-50 rounded-lg">
            <ArrowUpRight size={10} /> {change}
         </div>
      </div>
      <div>
         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest m-0">{title}</p>
         <h3 className="text-2xl font-black text-slate-800 m-0 mt-1">{value}</h3>
      </div>
    </div>
  );
}
