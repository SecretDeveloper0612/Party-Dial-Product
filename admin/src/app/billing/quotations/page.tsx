"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download,
  Eye,
  Send,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import SendQuotationModal from "@/components/SendQuotationModal";

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  useEffect(() => {
    const fetchRealData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${serverUrl}/payments`);
        const result = await res.json();
        if (result.status === "success") {
          // Map payments to quotations structure for the UI
          const mapped = (result.data || [])
            .filter((p: any) => {
               const name = (p.planName || "").toLowerCase();
               return p.amount > 11 && !name.includes('introductory') && !name.includes('starter');
            })
            .map((p: any) => ({
            id: (p.razorpayPaymentId || p.$id || "").slice(-8).toUpperCase(),
            client: p.venueName || p.ownerEmail || "Private Client",
            event: p.planName || "Venue Subscription",
            amount: p.amount || 0,
            date: p.paidAt ? new Date(p.paidAt).toISOString().split('T')[0] : "—",
            status: p.status === 'captured' ? 'Accepted' : p.status === 'failed' ? 'Expired' : 'Sent',
            items: p.planId?.includes('pax') ? p.planId.replace('pax_', '').replace('_', '-') : "PRO"
          }));
          setQuotations(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch billing data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRealData();
  }, [serverUrl]);

  const filteredQuotations = quotations.filter(q => 
    q.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
               <FileText size={28} />
            </div>
             <div>
                <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Quotations</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">Generate and manage event service estimates</p>
             </div>
         </div>
         <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-4 grad-purple text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
               <Plus size={18} /> <span>New Quotation</span>
            </button>
         </div>
      </div>

      <SendQuotationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        entityId="QUICK-QUOTE" 
        entityName="Manual Client / Venue" 
      />

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         <div className="lg:col-span-7 relative group flex items-center">
            <input 
              type="text" 
              placeholder="Search by ID or Client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="user-input pr-12 pl-4 shadow-sm"
            />
            <div className="absolute right-4 pointer-events-none">
               <Search className="text-slate-400" size={18} />
            </div>
         </div>
         <div className="lg:col-span-5 flex gap-4">
            <button className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
               <Filter size={18} /> <span>Advanced Filter</span>
            </button>
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">ID & Client</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Event Details</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Billing Data...</p>
                      </td>
                    </tr>
                  ) : filteredQuotations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No matching records found</p>
                      </td>
                    </tr>
                  ) : filteredQuotations.map((q, i) => (
                    <motion.tr 
                      key={q.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.4) }}
                      className="hover:bg-slate-50/50 transition-colors group/row"
                    >
                       <td className="p-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#b66dff] flex items-center justify-center font-black text-xs uppercase">QO</div>
                             <div>
                                <h4 className="text-sm font-bold text-slate-800">{q.id}</h4>
                                <p className="text-[11px] text-slate-400 font-medium">{q.client}</p>
                             </div>
                          </div>
                       </td>
                       <td className="p-6">
                          <div className="text-sm font-semibold text-slate-700">{q.event}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-black tracking-tight mt-0.5">{q.items} Services Listed</div>
                       </td>
                       <td className="p-6 text-sm font-black text-slate-800">
                          ₹{q.amount.toLocaleString()}
                       </td>
                       <td className="p-6 text-xs text-slate-500 font-bold">
                          {q.date}
                       </td>
                       <td className="p-6">
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit",
                            q.status === 'Accepted' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            q.status === 'Sent' ? "bg-blue-50 text-blue-600 border-blue-100" :
                            q.status === 'Draft' ? "bg-slate-50 text-slate-500 border-slate-100" :
                            "bg-rose-50 text-rose-600 border-rose-100"
                          )}>
                            {q.status === 'Accepted' ? <CheckCircle2 size={12} /> : 
                             q.status === 'Sent' ? <Send size={12} /> : 
                             q.status === 'Draft' ? <Clock size={12} /> : <XCircle size={12} />}
                            {q.status}
                          </span>
                       </td>
                       <td className="p-6">
                          <div className="flex items-center gap-2 justify-end opacity-0 group-hover/row:opacity-100 transition-opacity">
                             <button className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-[#b66dff]"><Eye size={18} /></button>
                             <button className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-blue-500"><Download size={18} /></button>
                             <button className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
                          </div>
                       </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <style jsx global>{`
        .user-input { width: 100%; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 1.25rem; padding: 1.25rem; font-size: 0.875rem; font-weight: 700; transition: all 0.3s; outline: none; }
        .user-input:focus { border-color: #b66dff; background: #ffffff; box-shadow: 0 4px 20px rgba(182, 109, 255, 0.08); }
      `}</style>
    </div>
  );
}
