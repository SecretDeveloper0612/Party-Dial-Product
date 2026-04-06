"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckSquare, 
  Search, 
  MapPin, 
  MoreHorizontal, 
  ExternalLink, 
  CheckCircle2, 
  XSquare,
  ShieldCheck,
  CreditCard,
  Building2,
  Calendar,
  AlertCircle,
  FileCheck,
  Eye,
  Loader2,
  Filter,
  Check
} from "lucide-react";
import { getVenues, Venue } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function ApprovalsQueue() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Filter venues that are either not verified or have a pending subscription but not active status
      // For mock purposes: we'll show venues marked as 'isVerified: false'
      setVenues(getVenues().filter(v => !v.isVerified));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleApprove = (id: string) => {
    setIsProcessing(id);
    setTimeout(() => {
      setVenues(venues.filter(v => v.id !== id));
      setIsProcessing(null);
      // In real scenario: update store via API
    }, 1200);
  };

  const handleReject = (id: string) => {
     if(confirm("Are you sure you want to reject this listing?")) {
        setVenues(venues.filter(v => v.id !== id));
     }
  };

  const filteredVenues = venues.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
               <ShieldCheck size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Listing Approvals</h1>
               <p className="text-sm text-slate-400 font-medium mt-1">Verify partner payments and activate premium listings</p>
            </div>
         </div>
         <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Queue Status:</span>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
               <span className="text-xs font-black text-slate-800">{venues.length} Pending Actions</span>
            </div>
         </div>
      </div>

      {/* Verification Stats Overlay */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Pending Payment', val: '12', color: 'text-rose-500', bg: 'bg-rose-50' },
           { label: 'Document Review', val: '8', color: 'text-amber-500', bg: 'bg-amber-50' },
           { label: 'Renewal Queue', val: '4', color: 'text-[#b66dff]', bg: 'bg-purple-50' },
           { label: 'Avg Approval Time', val: '1.4h', color: 'text-emerald-500', bg: 'bg-emerald-50' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-slate-50 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">{stat.label}</p>
                 <h4 className={cn("text-2xl font-black", stat.color)}>{stat.val}</h4>
              </div>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                 <CheckSquare size={18} className={stat.color} />
              </div>
           </div>
         ))}
      </div>

      {/* Control Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         <div className="lg:col-span-8 relative group flex items-center">
            <input 
              type="text" 
              placeholder="Filter by venue name or business identifier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="user-input pr-12 pl-4 shadow-sm"
            />
            <div className="absolute right-4 pointer-events-none">
               <Search className="text-slate-400" size={18} />
            </div>
         </div>
         <div className="lg:col-span-4 flex gap-4">
            <button className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
               <Filter size={18} /> <span>All Tiers</span>
            </button>
            <button className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
               <Eye size={18} /> <span>Bulk Audit</span>
            </button>
         </div>
      </div>

      {/* Approvals Matrix */}
      <div className="space-y-4">
         {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
               <Loader2 className="animate-spin text-[#b66dff]" size={40} />
               <p className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Synchronizing Approval Queue...</p>
            </div>
         ) : filteredVenues.length === 0 ? (
            <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
               <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4 opacity-40" />
               <h3 className="text-xl font-bold text-slate-800">Clear Horizon</h3>
               <p className="text-sm text-slate-400 mt-2">All pending listings have been successfully verified.</p>
            </div>
         ) : filteredVenues.map((venue, i) => (
           <motion.div 
             key={venue.id}
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white rounded-[2rem] p-8 border border-slate-50 shadow-sm hover:shadow-xl hover:scale-[1.005] transition-all group overflow-hidden"
           >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                 
                 {/* Visual Identification */}
                 <div className="flex items-center gap-6">
                    <div className="relative">
                       <div className="w-20 h-20 rounded-3xl grad-brand text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-purple-500/10">
                          {venue.name.charAt(0)}
                       </div>
                       <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                          <img src="/logo.jpg" alt="Partner" className="w-full h-full object-cover" />
                       </div>
                    </div>
                    <div>
                       <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-slate-800 m-0">{venue.name}</h3>
                          <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-100">Pending Approval</span>
                       </div>
                       <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-2">
                          <MapPin size={12} className="text-[#b66dff]" /> {venue.location.address}, {venue.location.city}
                       </p>
                       <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-50 text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                             <CreditCard size={10} /> {venue.subscriptionPlan} Tier
                          </div>
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-50 text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                             <Calendar size={10} /> Joined {venue.joinedAt}
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Operational Data Bar */}
                 <div className="flex lg:flex-row flex-col items-center gap-10">
                    <div className="text-center">
                       <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Pricing Yield</p>
                       <p className="text-sm font-bold text-slate-700">₹{venue.startingRates.veg} - ₹{venue.startingRates.nonVeg}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-slate-100 hidden lg:block" />
                    <div className="text-center">
                       <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Document Status</p>
                       <div className="flex items-center gap-1.5 text-emerald-500 group">
                          <FileCheck size={14} className="group-hover:scale-125 transition-transform" />
                          <span className="text-[11px] font-black uppercase tracking-widest">Verified</span>
                       </div>
                    </div>
                 </div>

                 {/* Action Intelligence Sector */}
                 <div className="flex items-center gap-4">
                    <button 
                      className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                      onClick={() => handleReject(venue.id)}
                      title="Decline Infrastructure"
                    >
                       <XSquare size={22} />
                    </button>
                    <button 
                      onClick={() => handleApprove(venue.id)}
                      disabled={isProcessing === venue.id}
                      className="px-8 py-4 grad-purple text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/25 hover:scale-[1.02] transition-all relative overflow-hidden group/btn active:scale-95"
                    >
                       <span className={cn("transition-all", isProcessing === venue.id ? "opacity-0" : "opacity-100")}>
                          Authorize & Activate
                       </span>
                       {isProcessing === venue.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Loader2 size={18} className="animate-spin" />
                          </div>
                       )}
                       <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                    </button>
                    <button className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-[#b66dff] hover:bg-purple-50 transition-all border border-transparent hover:border-purple-100">
                       <ExternalLink size={20} />
                    </button>
                 </div>

              </div>
           </motion.div>
         ))}
      </div>

      <style jsx global>{`
        .user-input {
          width: 100%;
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 1.25rem;
          padding: 1.25rem;
          font-size: 0.875rem;
          font-weight: 700;
          transition: all 0.3s;
          outline: none;
        }
        .user-input:focus {
          border-color: #b66dff;
          box-shadow: 0 4px 20px rgba(182, 109, 255, 0.08);
        }
      `}</style>
    </div>
  );
}
