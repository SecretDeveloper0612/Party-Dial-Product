"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  Search,
  MapPin,
  ExternalLink,
  CheckCircle2,
  XSquare,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Calendar,
  FileCheck,
  Loader2,
  Filter,
  RefreshCw,
  AlertCircle,
  Phone,
  Mail,
  Clock,
  Building2,
  Users,
  X,
  ThumbsUp,
  ThumbsDown,
  Info,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveVenue {
  id: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
  contactNumber: string;
  ownerEmail: string;
  subscriptionPlan: string;
  hasActivePlan: boolean;
  isVerified: boolean;
  status: string;
  totalLeads: number;
  onboardingComplete: boolean;
  venueType: string;
  capacity: number;
  joinedAt: string;
  description: string;
  amenities: string[];
  eventTypes: string[];
  raw: any;
}

function mapDoc(doc: any): LiveVenue {
  let amenities: string[] = [];
  let eventTypes: string[] = [];
  try { amenities = doc.amenities ? (typeof doc.amenities === 'string' ? JSON.parse(doc.amenities) : doc.amenities) : []; } catch {}
  try { eventTypes = doc.eventTypes ? (typeof doc.eventTypes === 'string' ? JSON.parse(doc.eventTypes) : doc.eventTypes) : []; } catch {}

  return {
    id: doc.$id,
    name: doc.venueName || doc.businessName || "Unnamed Venue",
    city: doc.city || "—",
    state: doc.state || "",
    pincode: doc.pincode || "",
    contactNumber: doc.contactNumber || "—",
    ownerEmail: doc.contactEmail || doc.ownerEmail || "—",
    subscriptionPlan: doc.subscriptionPlan || "None",
    hasActivePlan: !!(doc.subscriptionPlan && doc.subscriptionPlan !== "None"),
    isVerified: doc.isVerified === true,
    status: doc.status || "active",
    totalLeads: doc.totalLeads || 0,
    onboardingComplete: doc.onboardingComplete === true,
    venueType: doc.venueType || "Venue",
    capacity: parseInt(doc.capacity) || 0,
    joinedAt: doc.$createdAt ? new Date(doc.$createdAt).toLocaleDateString('en-IN') : "—",
    description: doc.description || "",
    amenities,
    eventTypes,
    raw: doc,
  };
}

const getCapacityLabel = (capacity: any) => {
  const cap = parseInt(capacity);
  if (isNaN(cap)) return "0";
  if (cap >= 5001) return "5000+";
  if (cap >= 2001) return "2000-5000";
  if (cap >= 1001) return "1000-2000";
  if (cap >= 501)  return "500-1000";
  if (cap >= 201)  return "200-500";
  if (cap >= 101)  return "100-200";
  if (cap >= 51)   return "50-100";
  if (cap >= 1)    return "0-50";
  return "0-50";
};

type FilterTab = "all" | "pending" | "approved" | "rejected" | "incomplete";

export default function ApprovalsQueue() {
  const [allVenues, setAllVenues] = useState<LiveVenue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("pending");
  const [selectedVenue, setSelectedVenue] = useState<LiveVenue | null>(null);
  const [rejectModal, setRejectModal] = useState<{ venue: LiveVenue } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('Fetching venues from:', `${serverUrl}/venues`);
    try {
      const res = await fetch(`${serverUrl}/venues`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }
      const result = await res.json();
      if (result.status === "success") {
        setAllVenues((result.data || []).map(mapDoc));
      } else {
        setError("Failed to load venues from server.");
      }
    } catch {
      setError("Cannot connect to server. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => { fetchVenues(); }, [fetchVenues]);

  // Derived stats
  const pendingVenues = allVenues.filter(v => !v.isVerified && v.status !== 'rejected' && v.onboardingComplete);
  const approvedVenues = allVenues.filter(v => v.isVerified);
  const rejectedVenues = allVenues.filter(v => v.status === 'rejected');
  const incompleteVenues = allVenues.filter(v => !v.onboardingComplete);

  const displayVenues = (() => {
    let list = activeTab === "pending" ? pendingVenues
      : activeTab === "approved" ? approvedVenues
      : activeTab === "rejected" ? rejectedVenues
      : activeTab === "incomplete" ? incompleteVenues
      : allVenues;

    if (searchQuery) {
      list = list.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return list;
  })();

  const handleApprove = async (venue: LiveVenue) => {
    setProcessingId(venue.id);
    const targetUrl = `${serverUrl}/venues/${venue.id}/approve`;
    console.log('Attempting approval at:', targetUrl);
    try {
      const res = await fetch(targetUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      
      let result;
      try {
        result = await res.json();
      } catch (e) {
        throw new Error(`Failed to parse server response as JSON. Status: ${res.status}`);
      }

      if (res.ok && result.status === "success") {
        setAllVenues(prev => prev.map(v => v.id === venue.id
          ? { ...v, isVerified: true, status: "active" }
          : v
        ));
        showToast(`✓ ${venue.name} has been approved and activated!`, "success");
        if (selectedVenue?.id === venue.id) setSelectedVenue({ ...selectedVenue, isVerified: true, status: "active" });
      } else {
        showToast(result.message || `Approval failed (Status: ${res.status})`, "error");
      }
    } catch (err: any) {
      console.error('Approval request failed:', err);
      showToast(`Network or Server error: ${err.message}`, "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModal) return;
    const venue = rejectModal.venue;
    setProcessingId(venue.id);
    setRejectModal(null);
    try {
      const res = await fetch(`${serverUrl}/venues/${venue.id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const result = await res.json();
      if (result.status === "success") {
        setAllVenues(prev => prev.map(v => v.id === venue.id
          ? { ...v, isVerified: false, status: "rejected" }
          : v
        ));
        showToast(`✗ ${venue.name} listing has been rejected.`, "error");
      } else {
        showToast(result.message || "Rejection failed.", "error");
      }
    } catch {
      showToast("Server error during rejection.", "error");
    } finally {
      setProcessingId(null);
      setRejectReason("");
    }
  };

  const tabs: { id: FilterTab; label: string; count: number; color: string }[] = [
    { id: "pending", label: "Pending Approval", count: pendingVenues.length, color: "bg-amber-500" },
    { id: "approved", label: "Approved", count: approvedVenues.length, color: "bg-emerald-500" },
    { id: "rejected", label: "Rejected", count: rejectedVenues.length, color: "bg-rose-500" },
    { id: "incomplete", label: "Incomplete", count: incompleteVenues.length, color: "bg-indigo-500" },
    { id: "all", label: "All Venues", count: allVenues.length, color: "bg-slate-400" },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl text-white text-sm font-bold shadow-2xl flex items-center gap-3",
              toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"
            )}
          >
            {toast.type === "success" ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Listing Approvals</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Verify and activate new partner venue listings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <div className={cn("w-2 h-2 rounded-full ", pendingVenues.length > 0 ? "bg-amber-500" : "bg-emerald-400")} />
            <span className="text-xs font-black text-slate-800">{pendingVenues.length} Pending Actions</span>
          </div>
          <button
            onClick={fetchVenues}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#b66dff] hover:border-purple-100 transition-all shadow-sm"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Approval", val: pendingVenues.length, color: "text-amber-500", bg: "bg-amber-50", icon: <Clock size={18} className="text-amber-500" /> },
          { label: "Approved Active", val: approvedVenues.length, color: "text-emerald-500", bg: "bg-emerald-50", icon: <CheckCircle2 size={18} className="text-emerald-500" /> },
          { label: "Rejected", val: rejectedVenues.length, color: "text-rose-500", bg: "bg-rose-50", icon: <XSquare size={18} className="text-rose-500" /> },
          { label: "Onboarding Incomplete", val: incompleteVenues.length, color: "text-slate-500", bg: "bg-slate-50", icon: <AlertCircle size={18} className="text-slate-400" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">{stat.label}</p>
              <h4 className={cn("text-2xl font-black", stat.color)}>{loading ? "—" : stat.val}</h4>
            </div>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-full overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 min-w-max flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            {tab.label}
            <span className={cn(
              "w-5 h-5 rounded-full text-[9px] flex items-center justify-center text-white font-black",
              tab.color
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search by venue name, city, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 pl-12 text-sm font-semibold shadow-sm outline-none focus:border-[#b66dff] transition-all"
        />
        <Search size={18} className="absolute left-4 text-slate-400" />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="absolute right-4 text-slate-400 hover:text-slate-700">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Main List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <Loader2 className=" text-[#b66dff]" size={40} />
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Loading venue queue...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400">
              <AlertCircle size={32} />
            </div>
            <p className="text-sm font-bold text-slate-500">{error}</p>
            <button onClick={fetchVenues} className="px-6 py-3 bg-[#b66dff] text-white rounded-xl text-sm font-bold">Try Again</button>
          </div>
        ) : displayVenues.length === 0 ? (
          <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
            <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4 opacity-40" />
            <h3 className="text-xl font-bold text-slate-800">
              {activeTab === "pending" ? "Clear Horizon" : "No venues here"}
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              {activeTab === "pending"
                ? "All pending listings have been reviewed."
                : searchQuery ? "No venues match your search." : "No venues in this category."}
            </p>
          </div>
        ) : (
          displayVenues.map((venue, i) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-slate-50 shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Identity */}
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="w-16 h-16 rounded-2xl grad-brand text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
                    {venue.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-800 m-0 truncate">{venue.name}</h3>

                      {/* Status Badge */}
                      {venue.isVerified ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                          <ShieldCheck size={9} /> Approved
                        </span>
                      ) : venue.status === 'rejected' ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-[9px] font-black uppercase tracking-widest">
                          Rejected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                          <Clock size={9} /> Pending Approval
                        </span>
                      )}

                      {!venue.onboardingComplete && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-100 text-[9px] font-black uppercase tracking-widest">
                          Incomplete Profile
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <MapPin size={11} className="text-[#b66dff]" />
                        {venue.city}{venue.state ? `, ${venue.state}` : ""}
                        {venue.pincode ? ` - ${venue.pincode}` : ""}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <Mail size={11} /> {venue.ownerEmail}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <Calendar size={11} /> {venue.joinedAt}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                        venue.hasActivePlan
                          ? "bg-purple-50 text-[#b66dff] border-purple-100"
                          : "bg-slate-50 text-slate-400 border-slate-100"
                      )}>
                        {venue.subscriptionPlan === "None" || !venue.subscriptionPlan ? "Free" : venue.subscriptionPlan}
                      </span>
                      {venue.venueType && (
                        <span className="text-[9px] font-bold text-slate-400">· {venue.venueType}</span>
                      )}
                      {venue.capacity > 0 && (
                        <span className="text-[9px] font-bold text-slate-400">· {getCapacityLabel(venue.capacity)} Guests</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* View Details */}
                  <button
                    onClick={() => setSelectedVenue(venue)}
                    className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-[#b66dff] hover:bg-purple-50 transition-all"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>

                  {/* Reject */}
                  {!venue.isVerified && venue.status !== 'rejected' && (
                    <button
                      onClick={() => { setRejectModal({ venue }); setRejectReason(""); }}
                      disabled={processingId === venue.id}
                      className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 disabled:opacity-50"
                      title="Reject Listing"
                    >
                      <XSquare size={18} />
                    </button>
                  )}

                  {/* Approve */}
                  {!venue.isVerified ? (
                    <button
                      onClick={() => handleApprove(venue)}
                      disabled={processingId === venue.id}
                      className="px-6 py-3 grad-purple text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-all relative active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {processingId === venue.id ? (
                        <><Loader2 size={14}  /> Activating...</>
                      ) : (
                        <><ShieldCheck size={14} /> Approve & Activate</>
                      )}
                    </button>
                  ) : (
                    <div className="px-5 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                      <CheckCircle2 size={14} /> Approved
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Venue Detail Drawer */}
      <AnimatePresence>
        {selectedVenue && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedVenue(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div initial={{ opacity: 0, x: 200 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 200 }}
              className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white z-[101] shadow-2xl flex flex-col overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl grad-brand text-white flex items-center justify-center font-black text-lg">
                    {selectedVenue.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-800">{selectedVenue.name}</h2>
                    <p className="text-xs text-slate-400">{selectedVenue.city}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedVenue(null)} className="p-2 hover:bg-slate-50 rounded-full">
                  <X size={20} className="text-slate-300" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                    selectedVenue.isVerified ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                  )}>
                    {selectedVenue.isVerified ? "✓ Verified" : "⏳ Pending Verification"}
                  </span>
                  <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                    selectedVenue.onboardingComplete ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-orange-50 text-orange-600 border-orange-100"
                  )}>
                    {selectedVenue.onboardingComplete ? "✓ Profile Complete" : "⚠ Incomplete Profile"}
                  </span>
                </div>

                {/* Details */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Venue Information</p>
                  {[
                    { label: "Venue Type", val: selectedVenue.venueType },
                    { label: "City", val: `${selectedVenue.city}${selectedVenue.state ? `, ${selectedVenue.state}` : ""}` },
                    { label: "Pincode", val: selectedVenue.pincode },
                    { label: "Capacity", val: selectedVenue.capacity > 0 ? getCapacityLabel(selectedVenue.capacity) : "—" },
                    { label: "Contact", val: selectedVenue.contactNumber },
                    { label: "Email", val: selectedVenue.ownerEmail },
                    { label: "Plan", val: selectedVenue.subscriptionPlan || "Free" },
                    { label: "Total Leads", val: String(selectedVenue.totalLeads) },
                    { label: "Registered On", val: selectedVenue.joinedAt },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                      <span className="text-sm font-bold text-slate-700 text-right max-w-[55%] truncate">{val || "—"}</span>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {selectedVenue.description && (
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedVenue.description}</p>
                  </div>
                )}

                {/* Amenities */}
                {selectedVenue.amenities.length > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedVenue.amenities.map(a => (
                        <span key={a} className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-slate-600">{a}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Event Types */}
                {selectedVenue.eventTypes.length > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Events Hosted</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedVenue.eventTypes.map(e => (
                        <span key={e} className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-slate-600">{e}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons in Drawer */}
                {!selectedVenue.isVerified && selectedVenue.status !== 'rejected' && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { setRejectModal({ venue: selectedVenue }); setRejectReason(""); setSelectedVenue(null); }}
                      className="flex-1 py-4 rounded-xl border border-rose-200 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                    >
                      <XSquare size={16} /> Reject
                    </button>
                    <button
                      onClick={() => { handleApprove(selectedVenue); setSelectedVenue(null); }}
                      disabled={processingId === selectedVenue.id}
                      className="flex-1 py-4 grad-purple text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <ShieldCheck size={16} /> Approve
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reject Reason Modal */}
      <AnimatePresence>
        {rejectModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setRejectModal(null)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-[111] flex items-center justify-center p-6"
            >
              <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                    <XSquare size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800">Reject Listing?</h3>
                    <p className="text-xs text-slate-400 font-medium">{rejectModal.venue.name}</p>
                  </div>
                </div>
                <textarea
                  rows={4}
                  placeholder="Reason for rejection (optional — for internal records)..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium outline-none focus:border-rose-300 resize-none mb-6"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setRejectModal(null)}
                    className="flex-1 py-3 rounded-xl border border-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRejectConfirm}
                    className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-all"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Debug Info (Only in dev or for troubleshooting) */}
      <div className="mt-20 pt-8 border-t border-slate-100 flex items-center justify-between opacity-30 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-medium text-slate-400 italic">
          Target API: <span className="font-bold text-[#b66dff]">{serverUrl}</span> | 
          Env Base: <span className="font-bold">{process.env.NEXT_PUBLIC_SERVER_URL || 'NONE (Using Fallback)'}</span>
        </p>
        <p className="text-[10px] font-medium text-slate-400">Admin Panel v2.1.0</p>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
