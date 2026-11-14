"use client";

import React, { useState, useEffect, useMemo, memo } from "react";
import { 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Mail,
  Zap,
  Flame,
  Check,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Venue {
  $id: string;
  venueName: string;
  contactEmail: string;
  subscriptionPlan: string;
  subscriptionExpiry: string;
  isVerified?: boolean;
  status?: string;
  $createdAt: string;
}

export default function ManualAccessPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [granting, setGranting] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "active" | "free">("all");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const [formData, setFormData] = useState({
    days: "30",
    startDate: new Date().toISOString().split('T')[0],
    planName: "Partner Pro (Quarterly Plan)"
  });

  const [notification, setNotification] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'confirm';
    onConfirm?: () => void;
  }>({
    show: false,
    title: "",
    message: "",
    type: 'success'
  });

  const showPopup = (title: string, message: string, type: 'success' | 'error' | 'confirm' = 'success', onConfirm?: () => void) => {
    setNotification({ show: true, title, message, type, onConfirm });
  };

  const rawBase = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const base = rawBase.replace(/\/+$/, '');
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/access/eligible-users`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const result = await res.json();
      if (result.status === "success") {
        setVenues(result.data);
      } else {
        throw new Error(result.message || "Failed to load");
      }
    } catch (err: any) {
      console.error("Failed to fetch eligible venues", err);
      showPopup("Fetch Error", err.message || "Unknown error", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVenue) return;

    setGranting(true);
    try {
      const res = await fetch(`${serverUrl}/access/grant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId: selectedVenue.$id,
          ...formData
        })
      });
      const result = await res.json();
      if (result.status === "success") {
        showPopup("Access Granted", result.message, 'success');
        fetchVenues();
        setSelectedVenue(null);
      } else {
        showPopup("Operation Failed", result.message || "Failed to grant access", 'error');
      }
    } catch (err) {
      console.error("Error granting access", err);
    } finally {
      setGranting(false);
    }
  };

  const handleRevokeAccess = async () => {
    if (!selectedVenue) return;
    
    showPopup(
      "Deactivate Access?", 
      `Are you sure you want to revoke manual platform access for "${selectedVenue.venueName}"? This will return the partner to a free listing and revoke active entitlements.`,
      'confirm',
      executeRevoke
    );
  };

  const executeRevoke = async () => {
    if (!selectedVenue) return;

    setRevoking(true);
    try {
      const res = await fetch(`${serverUrl}/access/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId: selectedVenue.$id
        })
      });
      const result = await res.json();
      if (result.status === "success") {
        showPopup("Access Revoked", result.message, 'success');
        fetchVenues();
        setSelectedVenue(null);
      } else {
        showPopup("Revoke Failed", result.message || "Failed to revoke access", 'error');
      }
    } catch (err) {
      console.error("Error revoking access", err);
    } finally {
      setRevoking(false);
    }
  };

  const filteredVenues = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return venues.filter(v => {
      const matchesSearch = !q || 
        v.venueName?.toLowerCase().includes(q) ||
        v.contactEmail?.toLowerCase().includes(q);

      const hasPaid = !!(v.subscriptionPlan && v.subscriptionPlan !== 'free' && v.subscriptionPlan !== 'None');
      const matchesFilter = 
        filterType === "all" ||
        (filterType === "active" && hasPaid) ||
        (filterType === "free" && !hasPaid);

      return matchesSearch && matchesFilter;
    });
  }, [venues, searchQuery, filterType]);

  // Expiry calculation
  const calculatedExpiryDate = useMemo(() => {
    try {
      const start = new Date(formData.startDate || new Date());
      const days = parseInt(formData.days || "0", 10);
      const exp = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
      return exp.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return "—";
    }
  }, [formData.startDate, formData.days]);

  // Quick preset plans
  const planPresets = [
    "Partner Pro (Quarterly Plan)",
    "Partner Pro (Annual Plan)",
    "Super Admin Override",
    "Trial Partner Access"
  ];

  return (
    <div className="space-y-8 pb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9d50bb] to-[#b66dff] flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
              Manual Access Control
            </h1>
            <p className="text-xs font-light text-slate-400 mt-0.5">
              Super Admin override for vendor subscription days and platform privileges
            </p>
          </div>
        </div>

        <button
          onClick={fetchVenues}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white border border-slate-100 hover:border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-[#b66dff]" : ""} />
          <span>Sync Partners</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Left Column: Partner Directory */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-2.5 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 text-slate-400" size={17} />
              <input 
                type="text" 
                placeholder="Search venue or contact email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-10 pr-4 py-2 text-xs font-semibold text-slate-700 placeholder:text-slate-400 placeholder:font-light outline-none"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl shrink-0">
              {(["all", "active", "free"] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all",
                    filterType === t 
                      ? "bg-white text-slate-800 shadow-sm font-bold" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Partner List Container */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#b66dff] animate-pulse" />
                <h3 className="text-xs font-semibold text-slate-700">Available Venues</h3>
              </div>
              <span className="text-[11px] font-light text-slate-400">
                {filteredVenues.length} partners found
              </span>
            </div>

            <div className="max-h-[560px] overflow-y-auto divide-y divide-slate-50">
              {loading ? (
                <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
                  <RefreshCw size={24} className="animate-spin text-[#b66dff]" />
                  <p className="text-xs font-light text-slate-400">Loading partner database...</p>
                </div>
              ) : filteredVenues.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
                  <Building2 size={32} className="text-slate-200" />
                  <p className="text-sm font-semibold text-slate-700">No matching partners</p>
                  <p className="text-xs font-light text-slate-400">Try adjusting your search query or filter</p>
                </div>
              ) : (
                filteredVenues.map((v) => {
                  const isSelected = selectedVenue?.$id === v.$id;
                  const hasPaid = !!(v.subscriptionPlan && v.subscriptionPlan !== 'free' && v.subscriptionPlan !== 'None');

                  return (
                    <button
                      key={v.$id}
                      onClick={() => setSelectedVenue(v)}
                      className={cn(
                        "w-full px-5 py-4 flex items-center justify-between text-left transition-all cursor-pointer group",
                        isSelected 
                          ? "bg-purple-50/60 border-l-4 border-[#b66dff]" 
                          : "hover:bg-slate-50/70 border-l-4 border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-4">
                        <div className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all",
                          isSelected
                            ? "bg-gradient-to-tr from-[#9d50bb] to-[#b66dff] text-white shadow-md shadow-purple-500/20"
                            : "bg-slate-100 text-slate-500 group-hover:bg-[#b66dff] group-hover:text-white"
                        )}>
                          {v.venueName?.charAt(0).toUpperCase() || "V"}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-slate-800 truncate m-0 group-hover:text-[#9d50bb] transition-colors">
                            {v.venueName}
                          </h4>
                          <p className="text-xs font-light text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                            <Mail size={11} className="shrink-0 text-slate-300" />
                            <span>{v.contactEmail || "No email available"}</span>
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider border",
                          hasPaid 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          {hasPaid ? v.subscriptionPlan : "Free"}
                        </span>
                        
                        {v.subscriptionExpiry && hasPaid && (
                          <span className="text-[10px] font-light text-slate-400">
                            Exp: {new Date(v.subscriptionExpiry).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Access Configuration Panel */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {selectedVenue ? (
              <motion.div 
                key={selectedVenue.$id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden sticky top-6"
              >
                {/* Active Partner Banner */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-[#b66dff]/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/10 text-white/90 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md">
                      Target Partner
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedVenue(null)}
                      className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      title="Clear Selection"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold text-white tracking-tight truncate">
                    {selectedVenue.venueName}
                  </h3>
                  <p className="text-xs font-light text-white/70 mt-1 truncate">
                    {selectedVenue.contactEmail || "Email not available"}
                  </p>

                  <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-light text-white/60">Current Status</span>
                    <span className="font-semibold text-white">
                      {selectedVenue.subscriptionPlan || "Free Listing"}
                    </span>
                  </div>
                </div>

                {/* Form Controls */}
                <form onSubmit={handleGrantAccess} className="p-6 space-y-5">
                  
                  {/* Duration Selector */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Access Duration
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["3", "7", "15", "30"].map((d) => (
                        <button 
                          key={d}
                          type="button"
                          onClick={() => setFormData({ ...formData, days: d })}
                          className={cn(
                            "py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer",
                            formData.days === d 
                              ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10" 
                              : "bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-300"
                          )}
                        >
                          {d} Days
                        </button>
                      ))}
                    </div>

                    <div className="relative mt-2">
                      <input 
                        type="number"
                        min="1"
                        placeholder="Or enter custom number of days..."
                        value={formData.days}
                        onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#b66dff] focus:bg-white transition-all pr-10"
                      />
                      <Clock size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Activation Start Date
                    </label>
                    <div className="relative">
                      <input 
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 pl-10 text-xs font-semibold text-slate-800 outline-none focus:border-[#b66dff] focus:bg-white transition-all"
                      />
                      <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                    
                    <div className="bg-purple-50/70 border border-purple-100/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <span className="font-light text-slate-500">Calculated Expiry</span>
                      <span className="font-semibold text-[#9d50bb]">{calculatedExpiryDate}</span>
                    </div>
                  </div>

                  {/* Plan Label */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Subscription Plan Label
                    </label>
                    <input 
                      type="text"
                      value={formData.planName}
                      onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#b66dff] focus:bg-white transition-all"
                      placeholder="e.g. Partner Pro (Quarterly Plan)"
                    />
                    
                    {/* Quick Presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {planPresets.map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setFormData({ ...formData, planName: preset })}
                          className={cn(
                            "text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer",
                            formData.planName === preset
                              ? "bg-slate-900 text-white border-slate-900 font-semibold"
                              : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200 font-light"
                          )}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2.5">
                    <button 
                      disabled={granting || revoking}
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg shadow-slate-900/15 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
                    >
                      {granting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Applying Access Override...</span>
                        </>
                      ) : (
                        <span>Execute Manual Override</span>
                      )}
                    </button>

                    <button 
                      type="button"
                      onClick={handleRevokeAccess}
                      disabled={granting || revoking || !selectedVenue.subscriptionPlan || selectedVenue.subscriptionPlan === 'free'}
                      className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <AlertTriangle size={13} />
                      <span>Deactivate / Revoke Platform Access</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-dashed border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[460px]"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-base font-semibold text-slate-700">
                  Select a Partner
                </h3>
                <p className="text-xs font-light text-slate-400 mt-1 max-w-xs leading-relaxed">
                  Choose a venue partner from the directory on the left to configure custom access days, plan labels, and verification overrides.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Confirmation & Notification Popup */}
      <AnimatePresence>
        {notification.show && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => notification.type !== 'confirm' && setNotification({ ...notification, show: false })}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10"
            >
              <div className={cn(
                "h-1.5 w-full",
                notification.type === 'success' ? "bg-emerald-500" : 
                notification.type === 'error' ? "bg-rose-500" : "bg-amber-500"
              )} />
              
              <div className="p-7 text-center">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm",
                  notification.type === 'success' ? "bg-emerald-50 text-emerald-500" : 
                  notification.type === 'error' ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-500"
                )}>
                  {notification.type === 'success' ? <CheckCircle2 size={28} /> : <AlertTriangle size={28} />}
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {notification.title}
                </h3>
                <p className="text-xs font-light text-slate-500 leading-relaxed max-w-sm mx-auto">
                  {notification.message}
                </p>

                <div className="mt-7 flex items-center gap-3">
                  {notification.type === 'confirm' ? (
                    <>
                      <button 
                        type="button"
                        onClick={() => setNotification({ ...notification, show: false })}
                        className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          notification.onConfirm?.();
                          setNotification({ ...notification, show: false });
                        }}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg shadow-rose-500/25 transition-all cursor-pointer"
                      >
                        Yes, Execute
                      </button>
                    </>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setNotification({ ...notification, show: false })}
                      className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
