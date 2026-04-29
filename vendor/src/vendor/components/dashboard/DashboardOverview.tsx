'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  BarChart3, 
  Star, 
  IndianRupee, 
  Users, 
  Clock, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  event: string;
  guests: string;
  date: string;
  time: string;
  status: string;
  color: string;
}

interface VenueProfile {
  venueName?: string;
  subscriptionPlan?: string;
  isVerified?: boolean;
  onboardingComplete?: boolean;
}

interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend: string;
  isUp: boolean;
}

interface DashboardOverviewProps {
  venueProfile: VenueProfile | null;
  userName?: string;
  recentLeads: Lead[];
  setActiveTab: (tab: string) => void;
  stats: Stat[];
  setShowInquiryPopup: (val: boolean) => void;
}

const DashboardOverview = ({
  venueProfile,
  userName,
  recentLeads,
  setActiveTab,
  stats,
  setShowInquiryPopup
}: DashboardOverviewProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        
        {/* Executive Hero Banner */}
        <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[24px] lg:rounded-[30px] p-6 lg:p-12 mb-6 lg:mb-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
           <div className="absolute top-0 right-0 w-full lg:w-1/4 h-full bg-slate-50/50"></div>
           <div className="absolute top-0 right-0 w-[1px] h-full bg-slate-100 hidden lg:block"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 lg:gap-10">
              <div>
                 <div className="flex items-center gap-3 mb-4 lg:mb-8">
                    <span className="w-10 h-[3px] bg-pd-pink"></span>
                    <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Executive Briefing</span>
                 </div>
                 <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 lg:mb-6 leading-none">
                    {venueProfile?.venueName || userName || "Your Venue"}
                 </h1>
                 <div className="flex flex-wrap gap-2 lg:gap-4">
                    <div className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-slate-900 text-white rounded-lg text-[8px] lg:text-[9px] font-black uppercase tracking-widest">
                       {recentLeads.length} Inquiries
                    </div>
                    <div className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] lg:text-[9px] font-black uppercase tracking-widest">
                       Top tier
                    </div>
                 </div>
              </div>
              
              <div className="flex flex-col gap-3">
                 <button 
                   onClick={() => setActiveTab('leads')}
                   className="h-12 lg:h-14 px-6 lg:px-10 bg-slate-900 text-white rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] italic hover:bg-pd-pink transition-all shadow-xl shadow-slate-900/5 group w-full sm:w-auto"
                 >
                    Launch Inquiry Manager
                 </button>
              </div>
           </div>
        </div>

        {/* Minimal Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6 mb-8 lg:mb-12">
          {stats.map((stat, i) => (
             <motion.div
               key={i}
               className="bg-white p-5 lg:p-8 rounded-[24px] border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-pd-pink transition-all"
             >
                <div className="flex items-center justify-between mb-6 lg:mb-10">
                   <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg ${stat.color} flex items-center justify-center scale-90 lg:scale-100`}>
                      {stat.icon}
                   </div>
                   <span className={`text-[8px] lg:text-[9px] font-black uppercase tracking-widest ${stat.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                      {stat.trend}
                   </span>
                </div>
                <h4 className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 lg:mb-2">{stat.label}</h4>
                <p className="text-xl lg:text-2xl font-black italic text-slate-900 tracking-tight">{stat.value}</p>
             </motion.div>
          ))}
        </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 bg-white rounded-[32px] border border-slate-100 p-6 lg:p-10">
             <div className="flex items-center justify-between mb-8 lg:mb-10">
                <h2 className="text-lg lg:text-xl font-black italic tracking-tighter uppercase leading-none">
                   Live <span className="text-pd-pink">Inquiry Feed</span>
                </h2>
                <button onClick={() => setActiveTab('leads')} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-pd-pink transition-colors">View All History</button>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
                {recentLeads.length > 0 ? (
                  [...recentLeads].slice(0, 4).map((lead, i) => (
                    <motion.div 
                      key={lead.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group p-4 sm:p-5 bg-white border border-slate-50 rounded-[24px] flex items-center justify-between hover:border-pd-pink transition-all cursor-pointer"
                    >
                       <div className="flex items-center gap-4 sm:gap-5">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-pd-pink/10 group-hover:text-pd-pink transition-all border border-slate-100 group-hover:border-pd-pink/20 shrink-0">
                             <Users size={18} />
                          </div>
                          <div className="min-w-0">
                             <h4 className="text-xs sm:text-sm font-black italic uppercase tracking-tight text-slate-900 leading-none mb-1.5 truncate">{lead.name}</h4>
                             <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 italic lowercase">
                                   <Clock size={10} /> {lead.date}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                <span className="text-[8px] font-black text-pd-pink uppercase tracking-widest leading-none">{lead.event}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-widest ${lead.color}`}>
                             {lead.status}
                          </span>
                       </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                        <Zap size={18} />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 text-center">No Leads Available</p>
                     {venueProfile?.subscriptionPlan === 'free' || !venueProfile?.subscriptionPlan ? (
                        <button 
                          onClick={() => setShowInquiryPopup(true)}
                          className="px-6 py-3 bg-white border border-slate-200 text-slate-900 text-[8px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                        >
                           Upgrade to receive leads
                        </button>
                     ) : (
                        <p className="text-[9px] font-bold text-slate-400 italic">Waiting for your first inquiry...</p>
                     )}
                  </div>
                )}
             </div>
          </div>


       </div>
    </motion.div>
  );
};

export default React.memo(DashboardOverview);
