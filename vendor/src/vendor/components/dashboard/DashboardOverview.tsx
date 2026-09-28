'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Star, 
  Users, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  Calendar,
  CheckCircle2,
  XCircle,
  Phone,
  CalendarDays,
  IndianRupee
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
  stats?: Stat[]; // Keep optional for backwards compatibility before page.tsx is updated
  averageRating?: number; // Receive averageRating directly
  setShowInquiryPopup: (val: boolean) => void;
}

const DashboardOverview = ({
  venueProfile,
  userName,
  recentLeads,
  setActiveTab,
  averageRating = 0,
  setShowInquiryPopup
}: DashboardOverviewProps) => {

  const [timeFilter, setTimeFilter] = useState<'today' | 'weekly' | 'monthly' | 'yearly' | 'all'>('today');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getLeadIcon = (status: string) => {
    switch (status) {
      case 'New': return <Zap size={16} />;
      case 'Contacted': return <Phone size={16} />;
      case 'Followups': return <CalendarDays size={16} />;
      case 'Quotation Send': return <IndianRupee size={16} />;
      case 'Booked': return <CheckCircle2 size={16} />;
      case 'Lost': return <XCircle size={16} />;
      default: return <Users size={16} />;
    }
  };

  // Compute stats locally based on timeFilter
  const filteredData = useMemo(() => {
    const now = new Date();
    
    // Helper to check if a date string is within the current filter range
    const isWithinRange = (dateString: string | undefined | null) => {
      if (timeFilter === 'all') return true;
      if (!dateString) return false;
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return false;

      if (timeFilter === 'today') {
        return date.toDateString() === now.toDateString();
      }
      if (timeFilter === 'weekly') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return date >= weekAgo;
      }
      if (timeFilter === 'monthly') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }
      if (timeFilter === 'yearly') {
        return date.getFullYear() === now.getFullYear();
      }
      return true;
    };

    // Filter leads by creation/update date
    const filteredLeads = recentLeads.filter((l: Lead & { updatedAt?: string; rawDate?: string; eventDate?: string }) => {
        // Use the updatedAt field so that when a lead changes status to "Booked" today, it reflects in today's stats.
        // Fall back to rawDate or eventDate if updatedAt isn't available.
        const relevantDate = l.updatedAt || l.rawDate || l.eventDate;
        if (relevantDate) return isWithinRange(relevantDate);
        return isWithinRange(l.date);
    });

    const totalLeads = filteredLeads.length;
    const bookedLeads = filteredLeads.filter(l => l.status === 'Booked').length;
    const lostLeads = filteredLeads.filter(l => l.status === 'Lost').length;
    
    const statsArray = [
      { 
        label: 'Total Leads', 
        value: totalLeads.toString(), 
        icon: <Users size={20} />, 
        color: 'bg-blue-50 text-blue-600', 
        trend: timeFilter === 'all' ? 'All Time' : 'Current', 
        isUp: totalLeads > 0 
      },
      { 
        label: 'Booked Leads', 
        value: bookedLeads.toString(), 
        icon: <CheckCircle2 size={20} />, 
        color: 'bg-emerald-50 text-emerald-600', 
        trend: bookedLeads > 0 ? 'Success' : '0%', 
        isUp: bookedLeads > 0 
      },
      { 
        label: 'Lost Leads', 
        value: lostLeads.toString(), 
        icon: <XCircle size={20} />, 
        color: 'bg-rose-50 text-rose-600', 
        trend: lostLeads > 0 ? 'Action Needed' : '0%', 
        isUp: false 
      },
      { 
        label: 'Average Rating', 
        value: averageRating.toFixed(1), 
        icon: <Star size={20} />, 
        color: 'bg-amber-50 text-amber-600', 
        trend: '0.0%', 
        isUp: true 
      },
    ];
    return { statsArray, filteredLeads };
  }, [recentLeads, timeFilter, averageRating]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6 lg:space-y-8"
    >
        


         {/* Time Filter & Stats Grid */}
         <div className="flex flex-col gap-4">
           <div className="flex justify-end items-center px-1">
             <div className="bg-white border border-slate-200/60 px-4 py-2 rounded-full flex items-center shadow-sm relative group cursor-pointer hover:border-slate-300 transition-colors">
                <Calendar size={16} className="text-slate-400 mr-2" />
                <select 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value as 'today' | 'weekly' | 'monthly' | 'yearly' | 'all')}
                  className="bg-transparent text-sm font-bold text-slate-700 outline-none pr-6 cursor-pointer appearance-none relative z-10 w-full"
                >
                   <option value="today">Today</option>
                   <option value="weekly">This Week</option>
                   <option value="monthly">This Month</option>
                   <option value="yearly">This Year</option>
                   <option value="all">All Time</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700 z-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
             </div>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
             {filteredData.statsArray.map((stat, i) => (
             <motion.div
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 + (i * 0.05), ease: "easeOut" }}
               key={i}
               className="group bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
             >
                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 bg-linear-to-br from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                     <div className={`w-10 h-10 rounded-[14px] ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                        {stat.icon}
                     </div>
                     <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {stat.isUp ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                        {stat.trend}
                     </div>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-500 mb-1">{stat.label}</h4>
                  <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                </div>
             </motion.div>
          ))}
        </div>
      </div>

       {/* Feed Section */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
             
             {/* Header */}
             <div className="px-6 lg:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <h2 className="text-base font-bold text-slate-900 tracking-tight">
                      Recent Activity
                   </h2>
                </div>
                <button onClick={() => setActiveTab('leads')} className="text-xs font-semibold text-pd-pink hover:text-pd-pink/80 transition-colors flex items-center gap-1">
                   View All <ArrowRight size={14} />
                </button>
             </div>
             
             {/* Data Table / List */}
             <div className="flex-1 bg-slate-50/30 p-2 lg:p-4">
                {filteredData.filteredLeads.length > 0 ? (
                  <div className="space-y-2">
                    {[...filteredData.filteredLeads].slice(0, 5).map((lead, i) => (
                      <motion.div 
                        key={lead.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.05) }}
                        onClick={() => setActiveTab('leads')}
                        className="group p-4 bg-white border border-slate-200/50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md hover:border-slate-300 transition-all cursor-pointer gap-4 sm:gap-0"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-slate-100 to-slate-50 flex items-center justify-center text-slate-400 group-hover:text-pd-pink border border-slate-200/50 shrink-0 shadow-sm transition-colors">
                               {getLeadIcon(lead.status)}
                            </div>
                            <div>
                               <h4 className="text-sm font-bold text-slate-900 mb-0.5">{lead.name}</h4>
                               <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                  <span className="flex items-center gap-1">
                                     <Clock size={12} className="opacity-70" /> {lead.date}
                                  </span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span className="text-slate-600">{lead.event}</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${lead.color} border border-current/10`}>
                               {lead.status}
                            </span>
                         </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-6">
                     <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-slate-300 mb-4 shadow-sm border border-slate-100">
                        <Zap size={24} />
                     </div>
                     <h3 className="text-sm font-bold text-slate-900 mb-1">No Leads Found</h3>
                     <p className="text-xs text-slate-500 mb-6 text-center max-w-xs">There are no leads matching your selected timeframe.</p>
                     
                     {venueProfile?.subscriptionPlan === 'free' || !venueProfile?.subscriptionPlan ? (
                        <button 
                          onClick={() => setShowInquiryPopup(true)}
                          className="px-6 py-2.5 bg-pd-pink text-white text-xs font-bold rounded-xl hover:bg-pd-pink/90 transition-all shadow-md shadow-pd-pink/20"
                        >
                           Upgrade to Receive Leads
                        </button>
                     ) : null}
                  </div>
                )}
             </div>
          </div>

       </div>
    </motion.div>
  );
};

export default React.memo(DashboardOverview);
