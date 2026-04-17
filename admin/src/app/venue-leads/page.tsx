"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Search, 
  Filter, 
  Phone, 
  Calendar, 
  MoreVertical,
  Loader2,
  Download,
  Users as UsersIcon,
  MapPin,
  CheckCircle2,
  XCircle,
  Zap,
  TrendingUp,
  FileText,
  Mail,
  RefreshCw,
  Clock,
  MessageSquare,
  ChevronDown,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VenueLead {
  $id: string;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  guests: number;
  notes: string;
  status: string;
  venueId: string;
  assignedVenue: string;
  $createdAt: string;
  pincode?: string;
  eventDate?: string;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "New", label: "New" },
  { value: "Contacted", label: "Contacted" },
  { value: "In-Progress", label: "In-Progress" },
  { value: "Followups", label: "Followups" },
  { value: "Quotation Send", label: "Quotation Sent" },
  { value: "Booked", label: "Booked" },
  { value: "Lost Leads", label: "Lost Leads" },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'New': return "bg-blue-50 text-blue-600 border-blue-100";
    case 'Contacted': return "bg-purple-50 text-purple-600 border-purple-100";
    case 'In-Progress': return "bg-amber-50 text-amber-600 border-amber-100";
    case 'Followups': return "bg-orange-50 text-orange-600 border-orange-100";
    case 'Quotation Send': return "bg-pink-50 text-pink-600 border-pink-100";
    case 'Booked': return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case 'Lost Leads': case 'Lost': return "bg-rose-50 text-rose-600 border-rose-100";
    default: return "bg-slate-50 text-slate-500 border-slate-100";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'New': return <Zap size={10} />;
    case 'Contacted': return <Phone size={10} />;
    case 'Booked': return <CheckCircle2 size={10} />;
    case 'Lost Leads': case 'Lost': return <XCircle size={10} />;
    default: return <Clock size={10} />;
  }
};

const TIME_OPTIONS = [
  { value: "LIFETIME", label: "Lifetime Leads" },
  { value: "7_DAYS", label: "Last 7 Days" },
  { value: "1_MONTH", label: "Last 30 Days" },
  { value: "6_MONTHS", label: "Last 6 Months" },
];

export default function VenueLeadsCheckPage() {
  const [leads, setLeads] = useState<VenueLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedVenue, setSelectedVenue] = useState("ALL");
  const [selectedTime, setSelectedTime] = useState("LIFETIME");
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [redistributing, setRedistributing] = useState(false);
  const [redistResult, setRedistResult] = useState<any>(null);

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/leads/venue-leads-check`);
      const result = await res.json();
      if (result.status === "success") {
        setLeads(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch venue leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Helper to get all venues associated with a lead (direct + broadcasted)
  const getRecipientVenues = (lead: VenueLead) => {
    const vSet = new Set<string>();
    if (lead.assignedVenue && lead.assignedVenue !== 'Broadcast') {
      vSet.add(lead.assignedVenue);
    }
    if (lead.notes?.includes('[DISTRIBUTED] to:')) {
      try {
        const listPart = lead.notes.split('[DISTRIBUTED] to:')[1].split('|')[0];
        listPart.split(',').forEach(v => {
          const name = v.trim();
          if (name) vSet.add(name);
        });
      } catch (e) { console.error("Parse error", e); }
    }
    // Still include 'Broadcast' as a pseudo-venue if it was never distributed
    if (vSet.size === 0 && lead.assignedVenue === 'Broadcast') {
      vSet.add('Broadcast');
    }
    return Array.from(vSet);
  };

  // Primary filtering for Date Range
  const leadsWithinTime = useMemo(() => {
    if (selectedTime === "LIFETIME") return leads;
    
    const now = new Date();
    const cutoff = new Date();
    if (selectedTime === "7_DAYS") cutoff.setDate(now.getDate() - 7);
    else if (selectedTime === "1_MONTH") cutoff.setDate(now.getDate() - 30);
    else if (selectedTime === "6_MONTHS") cutoff.setMonth(now.getMonth() - 6);
    
    return leads.filter(l => new Date(l.$createdAt) >= cutoff);
  }, [leads, selectedTime]);

  // Extract unique venue names for filter from time-filtered leads
  const uniqueVenues = useMemo(() => {
    const venues = new Set<string>();
    leadsWithinTime.forEach(l => {
      getRecipientVenues(l).forEach(v => venues.add(v));
    });
    return Array.from(venues).sort();
  }, [leadsWithinTime]);

  // Stats per venue from time-filtered leads
  const venueStats = useMemo(() => {
    const stats: Record<string, {total: number, new: number, booked: number}> = {};
    leadsWithinTime.forEach(l => {
      const myVenues = getRecipientVenues(l);
      myVenues.forEach(vName => {
        if (!stats[vName]) stats[vName] = { total: 0, new: 0, booked: 0 };
        stats[vName].total++;
        if (l.status === 'New') stats[vName].new++;
        if (l.status === 'Booked') stats[vName].booked++;
      });
    });
    return stats;
  }, [leadsWithinTime]);

  const filteredLeads = leadsWithinTime.filter(l => {
    const myVenues = getRecipientVenues(l);
    
    const matchesSearch = 
      l.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.phone?.includes(searchQuery) ||
      l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      myVenues.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = selectedStatus === "ALL" || l.status === selectedStatus;
    const matchesVenue = selectedVenue === "ALL" || myVenues.includes(selectedVenue);

    return matchesSearch && matchesStatus && matchesVenue;
  });

  const todayLeads = leads.filter(l => new Date(l.$createdAt).toDateString() === new Date().toDateString()).length;
  const bookedLeads = leadsWithinTime.filter(l => l.status === 'Booked').length;

  const exportToCSV = () => {
    const headers = ["Date", "Time", "Customer Name", "Phone", "Email", "Event Type", "PAX", "Pincode", "Proposed Event Date", "Venue", "Status", "Notes"];
    const rows = filteredLeads.map(l => [
      new Date(l.$createdAt).toLocaleDateString(),
      new Date(l.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      l.name,
      l.phone,
      l.email || '',
      l.eventType,
      l.guests,
      l.pincode || '',
      l.eventDate || '',
      l.assignedVenue,
      l.status,
      (l.notes || '').replace(/,/g, ';')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `venue_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRedistribute = async (dryRun: boolean) => {
    setRedistributing(true);
    setRedistResult(null);
    try {
      const res = await fetch(`${serverUrl}/leads/redistribute-old`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun })
      });
      const data = await res.json();
      setRedistResult(data);
      if (!dryRun && data.status === 'success') {
        fetchLeads(); // refresh table
      }
    } catch (err) {
      console.error('Redistribute failed', err);
      setRedistResult({ status: 'error', message: 'Network error' });
    } finally {
      setRedistributing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
               <TrendingUp size={28} />
            </div>
             <div>
                <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Venue Leads Check</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">All leads distributed to partner venues</p>
             </div>
         </div>
         <div className="flex items-center gap-3">
            <button 
              onClick={fetchLeads} 
              className="px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all flex items-center gap-2 font-bold text-sm"
            >
               <RefreshCw size={16} />
            </button>
         </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Leads</p>
               <h3 className="text-2xl font-black text-slate-800">{leads.length}</h3>
            </div>
            <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
               <FileText size={20} />
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Today</p>
               <h3 className="text-2xl font-black text-slate-800">{todayLeads}</h3>
            </div>
            <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
               <Zap size={20} />
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Booked</p>
               <h3 className="text-2xl font-black text-emerald-600">{bookedLeads}</h3>
            </div>
            <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
               <CheckCircle2 size={20} />
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Venues</p>
               <h3 className="text-2xl font-black text-purple-600">{uniqueVenues.length}</h3>
            </div>
            <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
               <Building2 size={20} />
            </div>
         </div>
      </div>

      {/* Redistribution Results Panel */}
      {redistResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-2xl border",
            redistResult.status === 'success' ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-slate-800">
              {redistResult.stats?.dryRun ? '🔍 Preview Results' : '✅ Redistribution Complete'}
            </h3>
            <button onClick={() => setRedistResult(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
              Dismiss
            </button>
          </div>
          <p className="text-xs font-semibold text-slate-600 mb-3">{redistResult.message}</p>
          {redistResult.stats && (
            <div className="flex gap-4 flex-wrap mb-3">
              <span className="text-[10px] font-black uppercase text-slate-500">Evaluated: {redistResult.stats.evaluated}</span>
              <span className="text-[10px] font-black uppercase text-emerald-600">Matched: {redistResult.stats.matched}</span>
              <span className="text-[10px] font-black uppercase text-amber-600">Skipped: {redistResult.stats.skipped}</span>
              <span className="text-[10px] font-black uppercase text-rose-600">No Venue: {redistResult.stats.noVenue}</span>
            </div>
          )}
          {redistResult.results && redistResult.results.length > 0 && (
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {redistResult.results.map((r: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
                    r.status === 'distributed' || r.status === 'would_distribute' ? "bg-emerald-100 text-emerald-700" :
                    r.status === 'skipped' ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                  )}>{r.status}</span>
                  <span className="font-bold">{r.name}</span>
                  {r.pincode && <span className="text-slate-400">Pin: {r.pincode}</span>}
                  {r.guests && <span className="text-slate-400">PAX: {r.guests}</span>}
                  {r.assignedTo?.length > 0 && <span className="text-indigo-500">→ {r.assignedTo.join(', ')}</span>}
                  {r.reason && <span className="text-rose-400">{r.reason}</span>}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Per-Venue Breakdown */}
      {uniqueVenues.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Object.entries(venueStats).sort((a, b) => b[1].total - a[1].total).map(([venue, stat]) => (
            <button
              key={venue}
              onClick={() => setSelectedVenue(selectedVenue === venue ? "ALL" : venue)}
              className={cn(
                "p-4 rounded-xl border text-left transition-all hover:shadow-md",
                selectedVenue === venue 
                  ? "bg-indigo-50 border-indigo-200 shadow-md" 
                  : "bg-white border-slate-50 hover:border-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-500 flex items-center justify-center font-black text-xs shrink-0">
                  {venue.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-700 truncate">{venue}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] font-black text-slate-400">{stat.total} leads</span>
                    {stat.new > 0 && <span className="text-[10px] font-black text-blue-500">{stat.new} new</span>}
                    {stat.booked > 0 && <span className="text-[10px] font-black text-emerald-500">{stat.booked} booked</span>}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="relative group flex items-center">
            <input 
              type="text" 
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 pl-12 text-sm font-semibold outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
            />
            <Search className="absolute left-4 text-slate-400" size={18} />
         </div>
         <div className="relative">
            <select 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-black outline-none focus:border-indigo-400 cursor-pointer appearance-none text-slate-700 shadow-sm pr-10"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              {TIME_OPTIONS.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
         </div>
         <div className="relative">
            <select 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-semibold outline-none focus:border-indigo-400 cursor-pointer appearance-none text-slate-600 shadow-sm pr-10"
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
            >
              <option value="ALL">All Venues ({leadsWithinTime.length})</option>
              {uniqueVenues.map(v => (
                <option key={v} value={v}>{v} ({venueStats[v]?.total || 0})</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
         </div>
         <div className="relative">
            <select 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-semibold outline-none focus:border-indigo-400 cursor-pointer appearance-none text-slate-600 shadow-sm pr-10"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
         </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">
          Showing <span className="text-slate-700">{filteredLeads.length}</span> of {leads.length} leads
          {selectedVenue !== "ALL" && <span className="text-indigo-500"> · Filtered by: {selectedVenue}</span>}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-50 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                     <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Lead Info</th>
                     <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Event</th>
                     <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Venue</th>
                     <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                     <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                     <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                         <Loader2 className="animate-spin text-indigo-500 mx-auto mb-4" size={32} />
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Leads Data...</p>
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                           <FileText size={28} className="text-slate-300" />
                         </div>
                         <p className="text-sm font-bold text-slate-400">No leads found matching your criteria.</p>
                         {(searchQuery || selectedVenue !== "ALL" || selectedStatus !== "ALL") && (
                           <button 
                             onClick={() => { setSearchQuery(""); setSelectedVenue("ALL"); setSelectedStatus("ALL"); }}
                             className="text-indigo-500 text-xs font-bold mt-2 underline"
                           >
                             Clear all filters
                           </button>
                         )}
                      </td>
                    </tr>
                  ) : filteredLeads.map((lead, i) => (
                    <React.Fragment key={lead.$id}>
                    <motion.tr 
                      key={lead.$id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.5) }}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                      onClick={() => setExpandedLead(expandedLead === lead.$id ? null : lead.$id)}
                    >
                       <td className="p-5">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-black text-sm uppercase shrink-0">
                               {lead.name?.charAt(0) || '?'}
                             </div>
                             <div className="min-w-0">
                                <h4 className="text-sm font-bold text-slate-800 truncate">{lead.name}</h4>
                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                   <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold"><Phone size={9} /> {lead.phone}</span>
                                   {lead.pincode && <span className="text-[10px] text-indigo-500 flex items-center gap-1 font-black"><MapPin size={9} /> {lead.pincode}</span>}
                                   {lead.email && <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold"><Mail size={9} /> {lead.email}</span>}
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="p-5">
                          <div className="flex flex-col gap-1.5">
                             <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase tracking-widest w-fit">
                               {lead.eventType}
                             </span>
                             <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-[10px] font-black text-slate-500">
                                   <UsersIcon size={10} className="text-slate-400" /> {lead.guests} PAX
                                </span>
                                {lead.eventDate && (
                                  <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100 uppercase text-[9px]">
                                     <Calendar size={10} /> {new Date(lead.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                  </span>
                                )}
                             </div>
                          </div>
                       </td>
                       <td className="p-5">
                          <div className="flex items-center gap-2">
                             <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
                                <Building2 size={14} />
                             </div>
                             <span className="text-xs font-bold text-slate-700 truncate max-w-[160px]">{lead.assignedVenue}</span>
                          </div>
                       </td>
                       <td className="p-5">
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-1",
                            getStatusStyle(lead.status)
                          )}>
                            {getStatusIcon(lead.status)} {lead.status}
                          </span>
                       </td>
                       <td className="p-5">
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-slate-600">{new Date(lead.$createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                             <span className="text-[10px] text-slate-300 font-semibold">{new Date(lead.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                       </td>
                       <td className="p-5">
                          <button className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-indigo-500">
                            <Eye size={16} />
                          </button>
                       </td>
                    </motion.tr>
                    {/* Expanded Notes Row */}
                    {expandedLead === lead.$id && (
                      <tr key={`${lead.$id}-notes`} className="bg-slate-50/80">
                        <td colSpan={6} className="px-5 py-4">
                          <div className="flex items-start gap-3">
                            <MessageSquare size={14} className="text-slate-400 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Notes / Distribution Info</p>
                              <div className="flex flex-col gap-2">
                                 {lead.notes?.includes('[DISTRIBUTED] to:') ? (
                                   <div className="bg-violet-50/50 border border-violet-100/50 rounded-xl p-3">
                                      <p className="text-[9px] font-black text-violet-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                         <CheckCircle2 size={12} /> Successfully Distributed To:
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                         {lead.notes.split('[DISTRIBUTED] to:')[1].split('|')[0].split(',').map((v: string) => (
                                           <span key={v} className="px-2 py-1 bg-white border border-violet-100 text-violet-600 rounded-lg text-[10px] font-bold shadow-sm">
                                              {v.trim()}
                                           </span>
                                         ))}
                                      </div>
                                      <p className="text-[10px] text-slate-400 mt-2 italic">
                                         {lead.notes.split('|').slice(1).join('|').trim() || 'No additional notes'}
                                      </p>
                                   </div>
                                 ) : (
                                   <p className="text-xs font-semibold text-slate-600 leading-relaxed break-words">
                                     {lead.notes || 'No notes available'}
                                   </p>
                                 )}
                              </div>
                              <div className="flex flex-wrap gap-3 mt-2">
                                <span className="text-[10px] font-bold text-slate-400">Venue ID: {lead.venueId}</span>
                                <span className="text-[10px] font-bold text-slate-400">Lead ID: {lead.$id}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
