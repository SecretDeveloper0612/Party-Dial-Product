"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Calendar,
  Layers,
  Activity,
  ArrowUpRight,
  Target
} from "lucide-react";

export default function BillingOverview() {
  const [allPayments, setAllPayments] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState("Today");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const rawBase = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const base = rawBase.replace(/\/+$/, "");
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;
        const res = await fetch(`${serverUrl}/payments`);
        const result = await res.json();
        if (result.status === "success" && result.data) {
          setAllPayments(result.data);
        }
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = startOfToday - 7 * 24 * 60 * 60 * 1000;
  const startOfMonth = startOfToday - 30 * 24 * 60 * 60 * 1000;
  const startOfYear = startOfToday - 365 * 24 * 60 * 60 * 1000;

  const filteredPayments = allPayments.filter(p => {
    if (timeFilter === "Lifetime") return true;
    const createdAt = p.$createdAt ? new Date(p.$createdAt).getTime() : 0;
    if (timeFilter === "Today") return createdAt >= startOfToday;
    if (timeFilter === "Weekly") return createdAt >= startOfWeek;
    if (timeFilter === "Monthly") return createdAt >= startOfMonth;
    if (timeFilter === "Yearly") return createdAt >= startOfYear;
    return true;
  });

  const captured = filteredPayments.filter((p: any) => p.status === 'captured');
  const gross = filteredPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const settled = captured.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const stats = {
    gross,
    invoiced: gross * 1.2,
    settled,
    count: captured.length
  };

  const chartData = useMemo(() => {
    const validPayments = filteredPayments.filter(p => p.status === 'captured');
    if (!validPayments.length) return [];
    
    // Group by date string
    const groups = validPayments.reduce((acc, p) => {
      const date = new Date(p.$createdAt || Date.now());
      const key = timeFilter === "Today" 
        ? `${date.getHours().toString().padStart(2, '0')}:00`
        : timeFilter === "Yearly" || timeFilter === "Lifetime"
          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          : date.toISOString().split('T')[0];
          
      if (!acc[key]) acc[key] = 0;
      acc[key] += p.amount || 0;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort
    const sortedKeys = Object.keys(groups).sort();
    const data = sortedKeys.map(k => ({ label: k, value: groups[k] }));
    
    // Ensure at least some bars for empty state visual if there's only 1 point
    if (data.length === 1) {
       data.unshift({ label: 'Prev', value: 0 });
       data.push({ label: 'Next', value: 0 });
    }
    
    return data;
  }, [filteredPayments, timeFilter]);

  const maxChartVal = Math.max(...chartData.map(d => d.value), 1);

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
         <div className="flex items-center gap-2">
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl px-4 py-2 outline-none hover:border-purple-300 transition-colors cursor-pointer shadow-sm"
            >
              <option value="Today">Today</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
              <option value="Lifetime">Lifetime</option>
            </select>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title="Gross Portfolio" value={loading ? "..." : formatVal(stats.gross)} icon={IndianRupee} color="grad-purple" />
            <StatsCard title="Invoiced Volume" value={loading ? "..." : formatVal(stats.invoiced)} icon={Layers} color="grad-blue" />
            <StatsCard title="Settled Cashflow" value={loading ? "..." : formatVal(stats.settled)} icon={Activity} color="grad-green" />
         </div>
         <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
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
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-10 min-h-[400px]">
         <div className="flex items-center justify-between mb-10">
            <div>
               <h3 className="text-xl font-black text-slate-800 m-0 tracking-tight">Revenue Stream Analysis</h3>
               <p className="text-sm text-slate-400 font-medium mt-1">Live distribution of platform receivables</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 animate-pulse">
               <Activity size={24} />
            </div>
         </div>
         
         {chartData.length > 0 ? (
            <div className="h-[300px] mt-8 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#b66dff" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#b66dff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                       dataKey="label" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                       tickFormatter={(value) => value >= 1000 ? `₹${(value / 1000).toFixed(1)}k` : `₹${value}`}
                    />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 700 }}
                      itemStyle={{ color: '#0f172a' }}
                      formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Area 
                       type="monotone" 
                       dataKey="value" 
                       stroke="#b66dff" 
                       strokeWidth={3}
                       fillOpacity={1} 
                       fill="url(#colorValue)" 
                       animationDuration={1500}
                    />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
                  <TrendingUp size={40} />
               </div>
               <h4 className="text-lg font-black text-slate-400 uppercase tracking-widest">No Data Found</h4>
               <p className="text-sm text-slate-400 font-medium mt-2 max-w-sm mx-auto">There are no settled transactions in the selected time period.</p>
            </div>
         )}
      </div>

    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-50 shadow-sm relative overflow-hidden group">
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
