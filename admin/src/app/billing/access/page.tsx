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
  Loader2,
  Building2,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Venue {
  $id: string;
  venueName: string;
  ownerEmail: string;
  subscriptionPlan: string;
  subscriptionExpiry: string;
  $createdAt: string;
}

export default function ManualAccessPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [granting, setGranting] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const [formData, setFormData] = useState({
    days: "30",
    startDate: new Date().toISOString().split('T')[0],
    planName: "Super Admin Override"
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

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/access/eligible-users`);
      const result = await res.json();
      if (result.status === "success") {
        setVenues(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch eligible venues", err);
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
      `Are you absolutely sure you want to deactivate ${selectedVenue.venueName}? This will immediately terminate their platform visibility and features.`,
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
    const q = searchQuery.toLowerCase();
    if (!q) return venues;
    return venues.filter(v => 
      v.venueName?.toLowerCase().includes(q) ||
      v.ownerEmail?.toLowerCase().includes(q)
    );
  }, [venues, searchQuery]);

  // Memoized Venue Item for lag-free list rendering
  const VenueItem = memo(({ venue, isSelected, onSelect }: { venue: Venue, isSelected: boolean, onSelect: (v: Venue) => void }) => (
    <button 
      onClick={() => onSelect(venue)}
      className={cn(
        "w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-all text-left group",
        isSelected && "bg-slate-50 ring-2 ring-inset ring-slate-900"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors",
          isSelected ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white"
        )}>
          {venue.venueName?.charAt(0) || 'P'}
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-800 m-0">{venue.venueName}</h4>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{venue.ownerEmail}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Status</p>
        <div className="flex items-center gap-2">
           <span className={cn(
             "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
             venue.subscriptionPlan ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-500"
           )}>
             {venue.subscriptionPlan || 'No Active Plan'}
           </span>
        </div>
      </div>
    </button>
  ));
  VenueItem.displayName = "VenueItem";

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Manual Access Control</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Super Admin override for platform access days</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: User Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search partner by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 pl-14 text-sm font-semibold outline-none focus:border-slate-900 transition-all shadow-sm group-hover:shadow-md"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Eligible Partners</h3>
               <span className="text-[10px] font-bold text-slate-400">{filteredVenues.length} available</span>
            </div>
            <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-50">
              {loading ? (
                <div className="py-20 text-center"><Loader2 className="animate-spin text-slate-400 mx-auto" /></div>
              ) : filteredVenues.map((v) => (
                <VenueItem 
                  key={v.$id} 
                  venue={v} 
                  isSelected={selectedVenue?.$id === v.$id} 
                  onSelect={setSelectedVenue} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Grant Access Form */}
        <div className="lg:col-span-5">
           <AnimatePresence mode="wait">
             {selectedVenue ? (
               <motion.div 
                 key="form"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden sticky top-24"
               >
                 <div className="bg-slate-900 p-8 text-white">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Granting Access To</p>
                   <h3 className="text-xl font-black m-0">{selectedVenue.venueName}</h3>
                   <div className="flex items-center gap-3 mt-4 text-white/60">
                     <Building2 size={16} />
                     <span className="text-xs font-bold">{selectedVenue.ownerEmail}</span>
                   </div>
                 </div>

                 <form onSubmit={handleGrantAccess} className="p-8 space-y-6">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Duration</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['3', '7', '15', '30'].map(d => (
                          <button 
                            key={d}
                            type="button"
                            onClick={() => setFormData({...formData, days: d})}
                            className={cn(
                              "h-12 rounded-xl text-xs font-black border transition-all",
                              formData.days === d ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                            )}
                          >
                            {d} Days
                          </button>
                        ))}
                      </div>
                      <div className="relative">
                         <input 
                           type="number"
                           placeholder="Custom Days..."
                           value={formData.days}
                           onChange={(e) => setFormData({...formData, days: e.target.value})}
                           className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-sm font-black text-slate-800 outline-none focus:border-slate-900 transition-all"
                         />
                         <Clock size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
                      <div className="relative">
                        <input 
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 pl-14 text-sm font-black text-slate-800 outline-none focus:border-slate-900 transition-all"
                        />
                        <Calendar size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold ml-1 italic">
                        Access will expire on: {new Date(new Date(formData.startDate).getTime() + parseInt(formData.days || '0') * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Plan Label</label>
                      <input 
                        type="text"
                        value={formData.planName}
                        onChange={(e) => setFormData({...formData, planName: e.target.value})}
                        className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-sm font-bold text-slate-800 outline-none focus:border-slate-900 transition-all"
                      />
                   </div>

                   <button 
                     disabled={granting || revoking}
                     type="submit"
                     className="w-full h-16 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     {granting ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                     Execute Manual Override
                   </button>

                    <div className="pt-4 border-t border-slate-100">
                        <button 
                            type="button"
                            onClick={handleRevokeAccess}
                            disabled={granting || revoking || !selectedVenue.subscriptionPlan}
                            className="w-full h-12 bg-white text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:grayscale"
                        >
                            {revoking ? <Loader2 className="animate-spin" size={14} /> : <AlertTriangle size={14} />}
                            Deactivate Platform Access
                        </button>
                    </div>
                 </form>
               </motion.div>
             ) : (
               <motion.div 
                 key="empty"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center"
               >
                 <ShieldCheck size={48} className="mx-auto text-slate-100 mb-4" />
                 <h3 className="text-lg font-black text-slate-300 uppercase tracking-tighter">Selection Required</h3>
                 <p className="text-xs font-bold text-slate-400 mt-2">Select a partner from the left list to begin the manual access flow</p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Premium custom Popup */}
      <AnimatePresence>
        {notification.show && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => notification.type !== 'confirm' && setNotification({ ...notification, show: false })}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden"
            >
              <div className={cn(
                "h-2 w-full",
                notification.type === 'success' ? "bg-emerald-500" : 
                notification.type === 'error' ? "bg-rose-500" : "bg-amber-500"
              )} />
              
              <div className="p-10 text-center">
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg",
                  notification.type === 'success' ? "bg-emerald-50 text-emerald-500 shadow-emerald-500/10" : 
                  notification.type === 'error' ? "bg-rose-50 text-rose-500 shadow-rose-500/10" : "bg-amber-50 text-amber-500 shadow-amber-500/10"
                )}>
                  {notification.type === 'success' ? <CheckCircle2 size={32} /> : 
                   notification.type === 'error' ? <AlertTriangle size={32} /> : <AlertTriangle size={32} />}
                </div>

                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
                  {notification.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                  {notification.message}
                </p>

                <div className="mt-10 flex flex-col gap-3">
                  {notification.type === 'confirm' ? (
                    <>
                      <button 
                        onClick={() => {
                          notification.onConfirm?.();
                          setNotification({ ...notification, show: false });
                        }}
                        className="w-full h-14 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                      >
                        Yes, Execute Action
                      </button>
                      <button 
                        onClick={() => setNotification({ ...notification, show: false })}
                        className="w-full h-14 bg-slate-50 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all font-bold"
                      >
                        Cancel Transaction
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setNotification({ ...notification, show: false })}
                      className="w-full h-14 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
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
