"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Building2, 
  Target, 
  Activity,
  Bookmark,
  TrendingUp,
  Diamond,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { getLeads, getVenues, getAlerts, Venue, Lead } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLeads(getLeads());
    setVenues(getVenues());
    setAlerts(getAlerts());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Derived Metrics
  const subscribedVenues = venues.filter((v: Venue) => v.hasActivePlan).length;
  const freeVenues = venues.filter((v: Venue) => !v.hasActivePlan).length;
  const totalVenues = venues.length;
  const totalLeads = leads.length;
  const totalRevenue = 1500000;
  
  const pendingVerification = venues.filter((v: Venue) => !v.isVerified).length;
  const pendingQuotations = venues
    .filter((v: Venue) => !v.hasActivePlan)
    .reduce((acc, curr) => acc + (curr.totalLeads || 0), 0) * 8;

  const renewalsPending = 42; // Simulated

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-200">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg grad-purple flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
               <Building2 size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 m-0">Intelligence Dashboard</h1>
         </div>
         <div className="flex items-center gap-2 text-[13px] font-medium text-slate-400">
            <span>Overview</span>
            <Info size={14} className="text-purple-400" />
         </div>
      </div>

       {/* High-Impact Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        
        {/* Total Revenue */}
        <div 
          style={{ background: 'linear-gradient(to right, #ffbf96, #fe7096)' }}
          className="rounded-xl p-6 text-white relative mesh-bg min-h-[160px] flex flex-col justify-between group cursor-pointer hover:shadow-xl transition-shadow shadow-sm overflow-hidden"
        >
           <div className="flex justify-between items-start relative z-10">
              <p className="text-[13px] font-medium opacity-90 text-white/80">Total Revenue</p>
              <Activity size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
           </div>
           <div className="relative z-10">
              <h2 className="text-2xl font-bold m-0 tracking-tight">₹ {totalRevenue.toLocaleString()}</h2>
              <p className="text-[9px] mt-3 font-bold opacity-80 uppercase tracking-widest text-white/70">Yield Index</p>
           </div>
        </div>

        {/* Renewals Pending -> Link to Approvals/Venues */}
        <Link href="/approvals" className="block outline-none">
           <div 
             style={{ background: 'linear-gradient(to right, #90caf9, #047edf)' }}
             className="rounded-xl p-6 text-white relative mesh-bg min-h-[160px] flex flex-col justify-between group cursor-pointer hover:shadow-xl transition-shadow shadow-sm overflow-hidden"
           >
              <div className="flex justify-between items-start relative z-10">
                 <p className="text-[13px] font-medium opacity-90 text-white/80">Renewals Pending</p>
                 <Activity size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="relative z-10">
                 <h2 className="text-2xl font-bold m-0 tracking-tight text-white">{renewalsPending}</h2>
                 <p className="text-[9px] mt-3 font-bold opacity-80 uppercase tracking-widest text-white/70">Partners</p>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0"><ChevronRight size={14} /></div>
           </div>
        </Link>

        {/* Subscribed Venues -> Link to Venues filtered */}
        <Link href="/venues?filter=subscribed" className="block outline-none">
           <div 
             style={{ background: 'linear-gradient(to right, #84d9d2, #07cdae)' }}
             className="rounded-xl p-6 text-white relative mesh-bg min-h-[160px] flex flex-col justify-between group cursor-pointer hover:shadow-xl transition-shadow shadow-sm overflow-hidden"
           >
              <div className="flex justify-between items-start relative z-10">
                 <p className="text-[13px] font-medium opacity-90 text-white/80">Subscribed Venues</p>
                 <Diamond size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="relative z-10">
                 <h2 className="text-2xl font-bold m-0 tracking-tight text-white">{subscribedVenues}</h2>
                 <p className="text-[9px] mt-3 font-bold opacity-80 uppercase tracking-widest text-white/70">Paid Partners</p>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0"><ChevronRight size={14} /></div>
           </div>
        </Link>

        {/* Free Quotations -> Link to Venues filtered */}
        <Link href="/venues?filter=unsubscribed" className="block outline-none">
           <div 
             style={{ backgroundColor: '#a855f7' }}
             className="rounded-xl p-6 text-white relative mesh-bg min-h-[160px] flex flex-col justify-between group cursor-pointer hover:shadow-xl transition-shadow shadow-sm overflow-hidden"
           >
              <div className="flex justify-between items-start relative z-10">
                 <p className="text-[13px] font-medium opacity-90 text-white/80">Free Quotations</p>
                 <ExternalLink size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="relative z-10">
                 <h2 className="text-2xl font-bold m-0 tracking-tight text-white">{pendingQuotations}</h2>
                 <p className="text-[9px] mt-3 font-bold opacity-80 uppercase tracking-widest text-white/70">Unsubscribed Sent</p>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0"><ChevronRight size={14} /></div>
           </div>
        </Link>

        {/* Total Venues -> Link to Venues */}
        <Link href="/venues" className="block outline-none">
           <div 
             style={{ backgroundColor: '#334155' }}
             className="rounded-xl p-6 text-white relative mesh-bg min-h-[160px] flex flex-col justify-between group cursor-pointer hover:shadow-xl transition-shadow shadow-sm overflow-hidden"
           >
              <div className="flex justify-between items-start relative z-10">
                 <p className="text-[13px] font-medium opacity-90 text-white/80">Total Venues</p>
                 <Building2 size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="relative z-10">
                 <h2 className="text-2xl font-bold m-0 tracking-tight text-white">{totalVenues}</h2>
                 <p className="text-[9px] mt-3 font-bold opacity-80 uppercase tracking-widest text-white/70">All Entities</p>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0"><ChevronRight size={14} /></div>
           </div>
        </Link>

        {/* Pending KYC -> Link to Approvals */}
        <Link href="/approvals" className="block outline-none">
           <div 
             style={{ background: 'linear-gradient(to right, #ff719a, #f72365)' }}
             className="rounded-xl p-6 text-white relative mesh-bg min-h-[160px] flex flex-col justify-between group cursor-pointer hover:shadow-xl transition-shadow shadow-sm overflow-hidden"
           >
              <div className="flex justify-between items-start relative z-10">
                 <p className="text-[13px] font-medium opacity-90 text-white/80">Pending KYC</p>
                 <AlertTriangle size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="relative z-10">
                 <h2 className="text-2xl font-bold m-0 tracking-tight text-white">{pendingVerification}</h2>
                 <p className="text-[9px] mt-3 font-bold opacity-80 uppercase tracking-widest text-white/70">Action Required</p>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0"><ChevronRight size={14} /></div>
           </div>
        </Link>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Distribution Status */}
        <div className="purple-card p-10 min-h-[400px] flex flex-col">
           <h3 className="text-lg font-bold text-[#343a40] mb-8">Subscribed vs Free Listing</h3>
           <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="relative w-48 h-48 mb-8">
                 <div className="absolute inset-0 rounded-full border-[16px] border-slate-100" />
                 <div className="absolute inset-0 rounded-full border-[16px] border-emerald-400 border-t-transparent -rotate-45" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-800">{subscribedVenues}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-[#343a40]/60">Subscribed</span>
                 </div>
              </div>
              <div className="flex gap-12 text-sm font-bold">
                 <div className="flex flex-col gap-1">
                    <span className="text-emerald-500 ring-2 ring-emerald-500/20 px-3 py-1 rounded-full text-[10px] uppercase">Active Subscriptions</span>
                    <span className="text-xl text-slate-800">{subscribedVenues} Units</span>
                 </div>
                 <div className="flex flex-col gap-1 text-slate-400">
                    <span className="text-slate-400 ring-2 ring-slate-400/20 px-3 py-1 rounded-full text-[10px] uppercase">Free Listings</span>
                    <span className="text-xl text-slate-400">{freeVenues} Units</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Global Intelligence Alerts */}
        <div className="purple-card p-10 min-h-[400px]">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-[#343a40]">Global Intelligence Alerts</h3>
              <MoreHorizontal size={18} className="text-slate-300 cursor-pointer" />
           </div>
           
           <div className="space-y-4">
              {alerts.map((alert: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-white/50 border border-slate-100 group hover:bg-white hover:shadow-md transition-all cursor-pointer">
                   <div className={cn(
                     "w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-inner",
                     alert.type === 'Urgent' ? 'bg-orange-50 text-orange-500' :
                     alert.type === 'Payment' ? 'bg-rose-50 text-rose-500' : 
                     alert.type === 'Signup' ? 'bg-emerald-50 text-emerald-500' : 
                     alert.type === 'Suspended' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                   )}>
                      {alert.type === 'Urgent' ? <AlertTriangle size={18} /> : 
                       alert.type === 'Payment' ? <Activity size={18} /> : 
                       alert.type === 'Signup' ? <ChevronRight size={18} /> : 
                       alert.type === 'Suspended' ? <AlertTriangle size={18} /> : <Target size={18} />}
                   </div>
                   <div className="flex-1 mt-0.5">
                      <div className="flex items-center justify-between">
                         <span className={cn(
                           "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded leading-none",
                           alert.type === 'Urgent' ? 'bg-orange-500 text-white' :
                           alert.type === 'Payment' ? 'bg-rose-500 text-white' : 
                           alert.type === 'Signup' ? 'bg-emerald-500 text-white' : 
                           alert.type === 'Suspended' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                         )}>{alert.type}</span>
                         <span className="text-[10px] font-bold text-slate-400">{alert.time}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 mt-2 line-clamp-2 leading-snug">{alert.message}</p>
                   </div>
                </div>
              ))}
              
              <button className="w-full py-4 mt-4 text-[13px] font-bold text-[#b66dff] bg-white border border-[#b66dff]/20 rounded-lg hover:bg-[#b66dff] hover:text-white transition-all transition-standard cursor-pointer shadow-sm">
                 View Systematic Log
              </button>
           </div>
        </div>

      </div>

      <section className="purple-card p-10">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h3 className="text-lg font-bold text-[#343a40] m-0 italic">Revenue Intelligence Breakdown</h3>
               <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-tighter">Plan-Wise Performance Index</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#b66dff]/10 text-[#b66dff] rounded-full">
               <TrendingUp size={14} />
               <span className="text-[10px] font-bold uppercase tracking-wider">Live Yield</span>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {[
              { plan: '0-50 PAX', rate: '₹33/day', share: '12%', color: 'bg-blue-400', val: '₹1.8L' },
              { plan: '50-100 PAX', rate: '₹44/day', share: '18%', color: 'bg-sky-400', val: '₹2.7L' },
              { plan: '100-200 PAX', rate: '₹77/day', share: '32%', color: 'bg-[#b66dff]', val: '₹4.8L', popular: true },
              { plan: '200-500 PAX', rate: '₹123/day', share: '21%', color: 'bg-emerald-400', val: '₹3.1L' },
              { plan: '500-1000 PAX', rate: '₹178/day', share: '9%', color: 'bg-amber-400', val: '₹1.3L' },
              { plan: '1000-2000 PAX', rate: '₹247/day', share: '5%', color: 'bg-orange-400', val: '₹0.7L' },
              { plan: '2000-5000 PAX', rate: '₹384/day', share: '2%', color: 'bg-rose-400', val: '₹0.3L' },
              { plan: '5000+ PAX', rate: '₹603/day', share: '1%', color: 'bg-slate-400', val: '₹0.1L' },
            ].map((sub, i) => (
              <div key={i} className={cn("space-y-4 relative p-4 rounded-2xl transition-all hover:bg-slate-50 border border-transparent", sub.popular && "border-[#b66dff]/20 bg-[#b66dff]/5")}>
                 {sub.popular && (
                    <span className="absolute -top-3 left-4 px-2 py-0.5 bg-[#b66dff] text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-purple-500/20">
                       Most Popular
                    </span>
                 )}
                 <div className="flex items-center justify-between">
                    <div>
                       <span className="text-xs font-black text-slate-800 tracking-tight">{sub.plan}</span>
                       <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{sub.rate}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-500">{sub.share}</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: sub.share }}
                      transition={{ delay: i*0.1, duration: 2 }}
                      className={cn("h-full", sub.color)} 
                    />
                 </div>
                 <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-slate-700">{sub.val}</p>
                    <ExternalLink size={12} className="text-slate-300 hover:text-purple-500 cursor-pointer transition-colors" />
                 </div>
              </div>
            ))}
         </div>
      </section>

    </div>
  );
}
