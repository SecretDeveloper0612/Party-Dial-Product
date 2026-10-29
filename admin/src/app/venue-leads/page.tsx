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
  Eye,
  X
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
  inquiryId?: string;
  city?: string;
  location?: string;
}

interface GroupedLead {
  groupKey: string;
  primaryLead: VenueLead;
  leadIds: string[];
  distributedVenues: {
    venueName: string;
    venueId: string;
    leadId: string;
    status: string;
  }[];
  eventDate: string;
  city: string;
  pincode: string;
  notes: string;
  totalVenues: number;
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
  const [activeModalLead, setActiveModalLead] = useState<GroupedLead | null>(null);
  const [redistributing, setRedistributing] = useState(false);
  const [redistResult, setRedistResult] = useState<any>(null);

  const rawBase = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const base = rawBase.replace(/\/+$/, "");
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

  // Helper to extract Event Date, City, and Pincode cleanly
  const extractLeadDetails = (lead: VenueLead) => {
    let eventDate = lead.eventDate || "N/A";
    let city = lead.city || lead.location || "N/A";
    let pincode = lead.pincode || "N/A";

    if (lead.notes) {
      // Event Date:
      const dateMatch = lead.notes.match(/Event Date:\s*([^|]+)/i);
      if (dateMatch && dateMatch[1].trim() && dateMatch[1].trim() !== 'N/A') {
        eventDate = dateMatch[1].trim();
      }
      // City / Location:
      const cityMatch = lead.notes.match(/(?:City|Location):\s*([^|]+)/i);
      if (cityMatch && cityMatch[1].trim() && cityMatch[1].trim() !== 'N/A') {
        city = cityMatch[1].trim();
      }
      // Pincode:
      const pinMatch = lead.notes.match(/(?:Pin|Pincode):\s*(\d{6})/i) || lead.notes.match(/\| (\d{6}) \|/);
      if (pinMatch && pinMatch[1].trim()) {
        pincode = pinMatch[1].trim();
      }
    }

    return { eventDate, city, pincode };
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

  // Group leads representing the same inquiry into a single unique row
  const groupedLeads = useMemo(() => {
    const map = new Map<string, GroupedLead>();

    leadsWithinTime.forEach((lead) => {
      const rawPhone = (lead.phone || "").replace(/\D/g, "").slice(-10);
      const { eventDate, city, pincode } = extractLeadDetails(lead);
      const evType = (lead.eventType || "").toLowerCase().trim();
      const guests = lead.guests || 0;

      // Group key: if inquiryId exists use it, otherwise phone + eventType + 10-minute time bucket
      const createdAtMs = new Date(lead.$createdAt).getTime();
      const timeBucket = Math.floor(createdAtMs / (10 * 60 * 1000));
      const groupKey = lead.inquiryId
        ? `inq_${lead.inquiryId}`
        : rawPhone
        ? `${rawPhone}_${evType}_${guests}_${timeBucket}`
        : lead.$id;

      if (!map.has(groupKey)) {
        map.set(groupKey, {
          groupKey,
          primaryLead: lead,
          leadIds: [lead.$id],
          distributedVenues: [
            {
              venueName: lead.assignedVenue || "Unknown Venue",
              venueId: lead.venueId,
              leadId: lead.$id,
              status: lead.status || "New"
            }
          ],
          eventDate,
          city,
          pincode,
          notes: lead.notes || "",
          totalVenues: 1
        });
      } else {
        const existing = map.get(groupKey)!;
        existing.leadIds.push(lead.$id);
        
        // Add venue if not already in list
        const alreadyHasVenue = existing.distributedVenues.some(
          v => v.venueId === lead.venueId || v.venueName === lead.assignedVenue
        );
        if (!alreadyHasVenue) {
          existing.distributedVenues.push({
            venueName: lead.assignedVenue || "Unknown Venue",
            venueId: lead.venueId,
            leadId: lead.$id,
            status: lead.status || "New"
          });
        }
        existing.totalVenues = existing.distributedVenues.length;

        // Fill in missing details if secondary lead has them
        if (existing.eventDate === "N/A" && eventDate !== "N/A") existing.eventDate = eventDate;
        if (existing.city === "N/A" && city !== "N/A") existing.city = city;
        if (existing.pincode === "N/A" && pincode !== "N/A") existing.pincode = pincode;
      }
    });

    return Array.from(map.values());
  }, [leadsWithinTime]);

  // Extract unique venue names for filter from time-filtered grouped leads
  const uniqueVenues = useMemo(() => {
    const venues = new Set<string>();
    groupedLeads.forEach(g => {
      g.distributedVenues.forEach(v => venues.add(v.venueName));
    });
    return Array.from(venues).sort();
  }, [groupedLeads]);

  // Stats per venue
  const venueStats = useMemo(() => {
    const stats: Record<string, { total: number; new: number; booked: number }> = {};
    groupedLeads.forEach(g => {
      g.distributedVenues.forEach(v => {
        if (!stats[v.venueName]) stats[v.venueName] = { total: 0, new: 0, booked: 0 };
        stats[v.venueName].total++;
        if (v.status === 'New') stats[v.venueName].new++;
        if (v.status === 'Booked') stats[v.venueName].booked++;
      });
    });
    return stats;
  }, [groupedLeads]);

  // Filtered unique grouped leads based on search query, venue filter, and status filter
  const filteredGroupedLeads = useMemo(() => {
    return groupedLeads.filter(g => {
      const p = g.primaryLead;
      const venueNames = g.distributedVenues.map(v => v.venueName.toLowerCase());

      const matchesSearch =
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone?.includes(searchQuery) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.pincode.includes(searchQuery) ||
        venueNames.some(v => v.includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatus === "ALL" ||
        g.distributedVenues.some(v => v.status === selectedStatus) ||
        p.status === selectedStatus;

      const matchesVenue =
        selectedVenue === "ALL" ||
        g.distributedVenues.some(v => v.venueName === selectedVenue);

      return matchesSearch && matchesStatus && matchesVenue;
    });
  }, [groupedLeads, searchQuery, selectedStatus, selectedVenue]);

  const todayLeads = groupedLeads.filter(g => new Date(g.primaryLead.$createdAt).toDateString() === new Date().toDateString()).length;
  const bookedLeads = groupedLeads.filter(g => g.distributedVenues.some(v => v.status === 'Booked') || g.primaryLead.status === 'Booked').length;

  const exportToCSV = () => {
    const headers = ["Date", "Time", "Customer Name", "Phone", "Email", "Event Type", "PAX", "City", "Pincode", "Event Date", "Distributed Venues", "Status"];
    const rows = filteredGroupedLeads.map(g => [
      new Date(g.primaryLead.$createdAt).toLocaleDateString(),
      new Date(g.primaryLead.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      g.primaryLead.name,
      g.primaryLead.phone,
      g.primaryLead.email || '',
      g.primaryLead.eventType,
      g.primaryLead.guests,
      g.city,
      g.pincode,
      g.eventDate,
      g.distributedVenues.map(v => v.venueName).join('; '),
      g.primaryLead.status
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
          Showing <span className="text-slate-700">{filteredGroupedLeads.length}</span> unique leads (from {leads.length} distributions)
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
                     <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Distributed To</th>
                     <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                     <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                     <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Leads Data...</p>
                      </td>
                    </tr>
                  ) : filteredGroupedLeads.length === 0 ? (
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
                  ) : filteredGroupedLeads.map((group, i) => {
                    const lead = group.primaryLead;
                    const venueCount = group.distributedVenues.length;
                    const primaryVenue = group.distributedVenues[0]?.venueName || "Unknown Venue";

                    return (
                      <React.Fragment key={group.groupKey}>
                      <motion.tr 
                        key={group.groupKey}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.02, 0.5) }}
                        className="hover:bg-slate-50/50 transition-colors"
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
                                     {group.pincode && group.pincode !== 'N/A' && (
                                       <span className="text-[10px] text-indigo-500 flex items-center gap-1 font-black"><MapPin size={9} /> {group.pincode}</span>
                                     )}
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
                                  {group.eventDate && group.eventDate !== 'N/A' && (
                                    <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100 uppercase text-[9px]">
                                       <Calendar size={10} /> {group.eventDate}
                                    </span>
                                  )}
                               </div>
                            </div>
                         </td>
                         <td className="p-5">
                            <div className="flex flex-col gap-1.5">
                               <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
                                     <Building2 size={14} />
                                  </div>
                                  <span className="text-xs font-bold text-slate-700 truncate max-w-[160px]">{primaryVenue}</span>
                               </div>
                               {venueCount > 1 && (
                                 <button
                                   onClick={() => setActiveModalLead(group)}
                                   className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[10px] font-black tracking-wide w-fit transition-colors"
                                 >
                                   +{venueCount - 1} more {venueCount - 1 === 1 ? 'venue' : 'venues'}
                                 </button>
                               )}
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
                         <td className="p-5 text-center">
                            <button 
                              onClick={() => setActiveModalLead(group)}
                              title="View distribution details & received venues"
                              className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl transition-all text-slate-500 hover:text-indigo-600 shadow-sm active:scale-95 inline-flex items-center justify-center"
                            >
                              <Eye size={16} />
                            </button>
                         </td>
                      </motion.tr>
                      </React.Fragment>
                    );
                  })}
               </tbody>
            </table>
         </div>
      </div>

      {/* MODAL: Received Venues & Distribution Details */}
      <AnimatePresence>
        {activeModalLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg uppercase shadow-sm">
                    {activeModalLead.primaryLead.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 leading-tight">
                      {activeModalLead.primaryLead.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      Lead Distribution Breakdown
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalLead(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                {/* Meta details banner */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Event Date</span>
                    <span className="font-bold text-slate-700">{activeModalLead.eventDate || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">City</span>
                    <span className="font-bold text-slate-700">{activeModalLead.city || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Pin</span>
                    <span className="font-bold text-slate-700">{activeModalLead.pincode || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Guests</span>
                    <span className="font-bold text-slate-700">{activeModalLead.primaryLead.guests} PAX</span>
                  </div>
                </div>

                {/* Contact row */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 px-1">
                  <span className="flex items-center gap-1.5"><Phone size={13} className="text-slate-400" /> {activeModalLead.primaryLead.phone}</span>
                  {activeModalLead.primaryLead.email && (
                    <span className="flex items-center gap-1.5"><Mail size={13} className="text-slate-400" /> {activeModalLead.primaryLead.email}</span>
                  )}
                  <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-black uppercase tracking-wider">
                    {activeModalLead.primaryLead.eventType}
                  </span>
                </div>

                {/* Venues that received this lead */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Building2 size={14} className="text-indigo-500" />
                      Venues That Received This Lead ({activeModalLead.distributedVenues.length})
                    </h4>
                  </div>
                  
                  <div className="space-y-2">
                    {activeModalLead.distributedVenues.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 transition-colors flex items-center justify-between gap-3 shadow-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-sm font-bold text-slate-800 truncate">{v.venueName}</h5>
                            <p className="text-[10px] text-slate-400 font-semibold truncate">Venue ID: {v.venueId}</p>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border",
                            getStatusStyle(v.status)
                          )}>
                            {v.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distribution Notes if present */}
                {activeModalLead.notes && (
                  <div className="p-4 rounded-2xl bg-violet-50/40 border border-violet-100/60 text-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-violet-600 block mb-1">
                      Distribution Note Log
                    </span>
                    <p className="font-semibold text-slate-600 leading-relaxed break-words whitespace-pre-wrap">
                      {activeModalLead.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setActiveModalLead(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
