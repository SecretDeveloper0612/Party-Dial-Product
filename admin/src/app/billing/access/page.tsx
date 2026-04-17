"use client";

import React, { useState, useEffect } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const [formData, setFormData] = useState({
    days: "30",
    startDate: new Date().toISOString().split('T')[0],
    planName: "Super Admin Override"
  });

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
        alert(result.message);
        fetchVenues();
        setSelectedVenue(null);
      } else {
        alert(result.message || "Failed to grant access");
      }
    } catch (err) {
      console.error("Error granting access", err);
    } finally {
      setGranting(false);
    }
  };

  const filteredVenues = venues.filter(v => 
    v.venueName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.ownerEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <button 
                  key={v.$id}
                  onClick={() => setSelectedVenue(v)}
                  className={cn(
                    "w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-all text-left group",
                    selectedVenue?.$id === v.$id && "bg-slate-50 ring-2 ring-inset ring-slate-900"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center font-black group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      {v.venueName?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 m-0">{v.venueName}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{v.ownerEmail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Status</p>
                    <div className="flex items-center gap-2">
                       <span className={cn(
                         "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                         v.subscriptionPlan ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-500"
                       )}>
                         {v.subscriptionPlan || 'No Active Plan'}
                       </span>
                    </div>
                  </div>
                </button>
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
                     disabled={granting}
                     type="submit"
                     className="w-full h-16 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     {granting ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                     Execute Manual Override
                   </button>
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
    </div>
  );
}
