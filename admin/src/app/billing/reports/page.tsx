"use client";

import React, { useState, useEffect } from "react";
import { 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Users,
  CreditCard,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BillingReportsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${serverUrl}/payments`);
        const result = await res.json();
        if (result.status === "success") {
           // Aggregate stats
           const payments = result.data || [];
           const success = payments.filter((p: any) => p.status === 'captured');
           const today = new Date().toDateString();
           
           setData({
              totalRevenue: success.reduce((acc: number, p: any) => acc + p.amount, 0),
              todayRevenue: success.filter((p: any) => new Date(p.paidAt).toDateString() === today)
                                    .reduce((acc: number, p: any) => acc + p.amount, 0),
              count: success.length,
              failedCount: payments.filter((p: any) => p.status !== 'captured').length,
              plansDistribution: success.reduce((acc: any, p: any) => {
                 acc[p.planName] = (acc[p.planName] || 0) + 1;
                 return acc;
              }, {})
           });
        }
      } catch (e) {
        console.error("Stats fetch failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="h-[400px] flex items-center justify-center"><Loader2 className="animate-spin text-slate-300" size={40} /></div>;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <PieChart size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Financial Reports</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Real-time revenue and subscription metrics</p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
               <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <DollarSign size={24} />
               </div>
               <span className="flex items-center gap-1 text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={14} /> 12%
               </span>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Lifetime Revenue</p>
               <h3 className="text-3xl font-black text-slate-800 tracking-tighter">₹{data?.totalRevenue?.toLocaleString()}</h3>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
               <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                  <TrendingUp size={24} />
               </div>
               <span className="flex items-center gap-1 text-xs font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={14} /> 4%
               </span>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Today's Revenue</p>
               <h3 className="text-3xl font-black text-slate-800 tracking-tighter">₹{data?.todayRevenue || 0}</h3>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
               <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                  <Users size={24} />
               </div>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Paid Subscriptions</p>
               <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{data?.count}</h3>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
               <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                  <BarChart3 size={24} />
               </div>
               <span className="flex items-center gap-1 text-xs font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-full">
                  <ArrowDownRight size={14} /> 0%
               </span>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Failed Payments</p>
               <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{data?.failedCount}</h3>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Plan Distribution */}
         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-50 pb-4">Revenue by Plan</h4>
            <div className="space-y-6">
               {Object.entries(data?.plansDistribution || {}).map(([name, count]: any, idx) => (
                  <div key={idx} className="space-y-2">
                     <div className="flex justify-between items-center text-sm font-black text-slate-700">
                        <span>{name}</span>
                        <span>{count} Units</span>
                     </div>
                     <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(count / data.count) * 100}%` }} />
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Growth Insights */}
         <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white/50 mb-2">Growth Forecast</h4>
                  <h3 className="text-2xl font-black text-white leading-tight">Your revenue is projected to grow by <span className="text-indigo-400">18%</span> in the next quarter.</h3>
               </div>
               <div className="pt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                     <Zap size={20} className="text-amber-400 mb-2" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Power Users</p>
                     <p className="text-lg font-black text-white">42</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                     <CreditCard size={20} className="text-indigo-400 mb-2" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Avg. Checkout</p>
                     <p className="text-lg font-black text-white">₹2,490</p>
                  </div>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32" />
         </div>
      </div>
    </div>
  );
}
