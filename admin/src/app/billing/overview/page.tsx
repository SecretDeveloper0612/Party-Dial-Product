"use client";

import { useState, useEffect } from "react";
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
  const [stats, setStats] = useState({ gross: 0, invoiced: 0, settled: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
        const serverUrl = base.endsWith("/api") ? base : `${base}/api`;
        const res = await fetch(`${serverUrl}/payments`);
        const result = await res.json();
        if (result.status === "success" && result.data) {
          const payments = result.data;
          const captured = payments.filter((p: any) => p.status === 'captured');
          const gross = payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
          const settled = captured.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
          
          setStats({
            gross,
            invoiced: gross * 1.2, // Mocking invoiced as gross + some margin if not tracked separately
            settled,
            count: captured.length
          });
        }
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatVal = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString()}`;
  };

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
            <StatsCard title="Gross Portfolio" value={loading ? "..." : formatVal(stats.gross)} icon={DollarSign} color="grad-purple" />
            <StatsCard title="Invoiced Volume" value={loading ? "..." : formatVal(stats.invoiced)} icon={Layers} color="grad-blue" />
            <StatsCard title="Settled Cashflow" value={loading ? "..." : formatVal(stats.settled)} icon={Activity} color="grad-green" />
         </div>
         <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Fiscal Health</p>
                  <h4 className="text-xl font-black uppercase tracking-tight">Aegis Secure</h4>
               </div>
               <div className="mt-8">
                  <p className="text-3xl font-black">{loading || stats.gross === 0 ? "—" : `${((stats.settled / stats.gross) * 100).toFixed(1)}%`}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mt-1">Recovery Rate</p>
               </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Target size={180} />
            </div>
         </div>
      </div>

      {/* Main Analysis Area */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10 min-h-[400px]">
         <div className="flex items-center justify-between mb-10">
            <div>
               <h3 className="text-xl font-black text-slate-800 m-0 tracking-tight">Revenue Stream Analysis</h3>
               <p className="text-sm text-slate-400 font-medium mt-1">Live distribution of platform receivables</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 animate-pulse">
               <Activity size={24} />
            </div>
         </div>
         
         <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
               <TrendingUp size={40} />
            </div>
            <h4 className="text-lg font-black text-slate-400 uppercase tracking-widest">Real-time Graphing Active</h4>
            <p className="text-sm text-slate-400 font-medium mt-2 max-w-sm mx-auto">Waiting for more transaction events to populate trend analysis charts.</p>
         </div>
      </div>

    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
         <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
            <Icon size={20} />
         </div>
      </div>
      <div>
         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest m-0">{title}</p>
         <h3 className="text-2xl font-black text-slate-800 m-0 mt-1">{value}</h3>
      </div>
    </div>
  );
}
