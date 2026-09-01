"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  XCircle,
  X,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import SendQuotationModal from "@/components/SendQuotationModal";
import jsPDF from 'jspdf';

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewQuotation, setViewQuotation] = useState<any | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const fetchRealData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/payments`);
      const result = await res.json();
      if (result.status === "success") {
        const mapped = (result.data || [])
          .filter((p: any) => {
             if (p.method === 'quote') return true;
             const name = (p.planName || "").toLowerCase();
             return p.amount > 11 && !name.includes('introductory') && !name.includes('starter');
          })
          .map((p: any) => ({
          docId: p.$id,
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

  useEffect(() => {
    fetchRealData();
  }, [serverUrl]);

  const filteredQuotations = quotations.filter(q => 
    q.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadPDF = (q: any) => {
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("QUOTATION", 40, 80);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Quotation No: ${q.id}`, 40, 120);
    doc.text(`Client: ${q.client}`, 40, 140);
    doc.text(`Date: ${q.date}`, 40, 160);

    doc.setFont("helvetica", "bold");
    doc.text(`Service: ${q.event}`, 40, 200);
    
    doc.setFontSize(16);
    doc.text(`Total Amount: Rs. ${q.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 40, 240);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("This is an electronically generated quotation based on system records.", 40, 300);

    doc.save(`Quotation_${q.id}.pdf`);
  };

  const handleUpdateStatus = async (docId: string, newStatus: string) => {
    try {
      setMenuOpen(null);
      const res = await fetch(`${serverUrl}/payments/${docId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchRealData();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this quotation?")) return;
    try {
      setMenuOpen(null);
      const res = await fetch(`${serverUrl}/payments/${docId}`, { method: 'DELETE' });
      if (res.ok) fetchRealData();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

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
        onSuccess={() => {
          setIsModalOpen(false);
          fetchRealData();
        }}
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
      <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-visible">
         <div className="overflow-visible min-h-[400px]">
            <table className="w-full text-left border-collapse relative">
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
                            q.status === 'Accepted' || q.status === 'captured' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            q.status === 'Sent' ? "bg-blue-50 text-blue-600 border-blue-100" :
                            q.status === 'Draft' ? "bg-slate-50 text-slate-500 border-slate-100" :
                            "bg-rose-50 text-rose-600 border-rose-100"
                          )}>
                            {q.status === 'Accepted' || q.status === 'captured' ? <CheckCircle2 size={12} /> : 
                             q.status === 'Sent' ? <Send size={12} /> : 
                             q.status === 'Draft' ? <Clock size={12} /> : <XCircle size={12} />}
                            {q.status === 'captured' ? 'Accepted' : q.status}
                          </span>
                       </td>
                       <td className="p-6">
                          <div className="flex items-center gap-2 justify-end opacity-0 group-hover/row:opacity-100 transition-opacity relative">
                             <button onClick={() => setViewQuotation(q)} className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-[#b66dff]"><Eye size={18} /></button>
                             <button onClick={() => downloadPDF(q)} className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-blue-500"><Download size={18} /></button>
                             
                             <button onClick={() => setMenuOpen(menuOpen === q.docId ? null : q.docId)} className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>

                             {/* Dropdown Menu */}
                             <AnimatePresence>
                                {menuOpen === q.docId && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-12 right-0 z-10 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                                  >
                                    <div className="p-2 space-y-1">
                                       <button onClick={() => handleUpdateStatus(q.docId, 'captured')} className="w-full p-2 flex items-center gap-3 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors">
                                          <CheckCircle2 size={14} /> Mark as Accepted
                                       </button>
                                       <button onClick={() => handleUpdateStatus(q.docId, 'Sent')} className="w-full p-2 flex items-center gap-3 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                                          <Send size={14} /> Mark as Sent
                                       </button>
                                       <button onClick={() => handleUpdateStatus(q.docId, 'Draft')} className="w-full p-2 flex items-center gap-3 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors">
                                          <Clock size={14} /> Mark as Draft
                                       </button>
                                       <div className="h-px bg-slate-100 my-1" />
                                       <button onClick={() => handleDelete(q.docId)} className="w-full p-2 flex items-center gap-3 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                                          <Trash2 size={14} /> Delete Quote
                                       </button>
                                    </div>
                                  </motion.div>
                                )}
                             </AnimatePresence>
                          </div>
                       </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <AnimatePresence>
        {viewQuotation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewQuotation(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-[2.5rem] shadow-xl w-full max-w-md overflow-hidden flex flex-col p-8">
               <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-violet-100 text-[#b66dff] flex items-center justify-center">
                     <FileText size={24} />
                   </div>
                   <div>
                     <h2 className="text-xl font-black text-slate-900 tracking-tight">Quote Details</h2>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{viewQuotation.id}</p>
                   </div>
                 </div>
                 <button onClick={() => setViewQuotation(null)} className="p-3 bg-slate-50 hover:bg-rose-50 rounded-2xl transition-all text-slate-400 hover:text-rose-500"><X size={20} /></button>
               </div>
               
               <div className="space-y-3">
                 <div className="p-5 bg-slate-50/80 rounded-2xl flex justify-between items-center border border-slate-100/50">
                   <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Client Name</span>
                   <span className="text-sm font-bold text-slate-800">{viewQuotation.client}</span>
                 </div>
                 <div className="p-5 bg-slate-50/80 rounded-2xl flex justify-between items-center border border-slate-100/50">
                   <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Plan / Event</span>
                   <span className="text-sm font-bold text-slate-800 text-right max-w-[200px] truncate">{viewQuotation.event}</span>
                 </div>
                 <div className="p-5 bg-slate-50/80 rounded-2xl flex justify-between items-center border border-slate-100/50">
                   <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Total Amount</span>
                   <span className="text-lg font-black text-[#b66dff]">₹{viewQuotation.amount.toLocaleString()}</span>
                 </div>
                 <div className="p-5 bg-slate-50/80 rounded-2xl flex justify-between items-center border border-slate-100/50">
                   <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Issue Date</span>
                   <span className="text-sm font-bold text-slate-600">{viewQuotation.date}</span>
                 </div>
               </div>
               
               <div className="mt-8 flex gap-4">
                 <button onClick={() => { downloadPDF(viewQuotation); setViewQuotation(null); }} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                   <Download size={16} /> Download Copy
                 </button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .user-input { width: 100%; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 1.25rem; padding: 1.25rem; font-size: 0.875rem; font-weight: 700; transition: all 0.3s; outline: none; }
        .user-input:focus { border-color: #b66dff; background: #ffffff; box-shadow: 0 4px 20px rgba(182, 109, 255, 0.08); }
      `}</style>
    </div>
  );
}
