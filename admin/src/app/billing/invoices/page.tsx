"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Receipt, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Trash2,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewInvoice, setViewInvoice] = useState<any | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const rawBase = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const base = rawBase.replace(/\/+$/, "");
  const serverUrl = base.endsWith("/api") ? base : \`\$\{base\}/api\`;

  const fetchRealData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/payments`);
      const result = await res.json();
      if (result.status === "success") {
        const mapped = (result.data || [])
          .filter((p: any) => p.method !== 'quote' && p.invoiceNumber)
          .map((p: any) => ({
            docId: p.$id,
            id: p.invoiceNumber,
            client: p.venueName || p.ownerEmail || "Private Client",
            event: p.planName || "Venue Subscription",
            amount: p.amount || 0,
            date: p.paidAt ? new Date(p.paidAt).toISOString().split('T')[0] : "—",
            status: p.status === 'captured' ? 'Paid' : p.status === 'failed' ? 'Failed' : 'Pending',
            due: p.paidAt ? new Date(new Date(p.paidAt).setDate(new Date(p.paidAt).getDate() + 5)).toISOString().split('T')[0] : "—",
            fileId: p.invoiceFileId || null,
          }));
        setInvoices(mapped);
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

  const filteredInvoices = invoices.filter(i => 
    i.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadPDF = async (inv: any) => {
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // 1. Fetch and add Logo
    try {
      const res = await fetch('/logo-nav.png');
      const blob = await res.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      doc.addImage(base64, 'PNG', 40, 30, 80, 80);
    } catch (e) {
      console.log("Could not load logo", e);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(236, 72, 153);
      doc.text("PartyDial", 40, 65);
    }

    // 2. Invoice Title & Meta Box
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("TAX INVOICE", 40, 120);

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(pageWidth - 220, 40, 180, 50, 5, 5, "F");
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Invoice No :", pageWidth - 210, 60);
    doc.setFont("helvetica", "bold");
    doc.text(inv.id, pageWidth - 130, 60);
    
    doc.setFont("helvetica", "normal");
    doc.text("Date :", pageWidth - 210, 80);
    doc.setFont("helvetica", "bold");
    doc.text(inv.date, pageWidth - 130, 80);

    // 3. To Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("To,", 40, 160);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Client : ${inv.client}`, 40, 180);

    // 4. Project Details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Details", pageWidth - 220, 160);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Service : Subscription`, pageWidth - 220, 180);
    doc.text(`Status : ${inv.status}`, pageWidth - 220, 195);

    // 5. Table Data
    const tableData = [
      [1, inv.event, "-", `Rs. ${inv.amount.toLocaleString()}`, `Rs. ${inv.amount.toLocaleString()}`]
    ];

    autoTable(doc, {
      startY: 220,
      head: [['Sr No.', 'Description', 'Duration', 'Rate (INR)', 'Amount (INR)']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [168, 85, 247],
        textColor: 255, 
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: { 
        fontSize: 10,
        cellPadding: 8,
        lineColor: [226, 232, 240],
        lineWidth: 1,
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 50 },
        1: { halign: 'left' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center', fontStyle: 'bold' }
      }
    });

    // 6. Footer
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY || 250;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Total Amount :", pageWidth - 140, finalY + 40);
    doc.setTextColor(168, 85, 247);
    doc.text(`Rs. ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - 40, finalY + 40, { align: 'right' });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text("This is an electronically generated tax invoice based on system records.", 40, finalY + 120);

    doc.save(`Invoice_${inv.id}.pdf`);
  };

  const updateStatus = async (docId: string, newStatus: string) => {
    try {
      const res = await fetch(`${serverUrl}/payments/${docId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus.toLowerCase() })
      });
      if (res.ok) {
        setInvoices(prev => prev.map(inv => inv.docId === docId ? { ...inv, status: newStatus } : inv));
      }
    } catch (err) {
      console.error(err);
    }
    setMenuOpen(null);
  };

  const deleteInvoice = async (docId: string) => {
    try {
      const res = await fetch(`${serverUrl}/payments/${docId}`, { method: 'DELETE' });
      if (res.ok) {
        setInvoices(prev => prev.filter(inv => inv.docId !== docId));
      }
    } catch (err) {
      console.error(err);
    }
    setMenuOpen(null);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
               <Receipt size={28} />
            </div>
             <div>
                <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Tax Invoices</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">Official billing documents and fiscal reporting</p>
             </div>
         </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         <div className="lg:col-span-7 relative group flex items-center">
            <input 
              type="text" 
              placeholder="Search by Invoice ID or Client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="user-input pr-12 pl-4 shadow-sm"
            />
            <div className="absolute right-4 pointer-events-none">
               <Search className="text-slate-400" size={18} />
            </div>
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
         <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Invoice ID</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Client / Event</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Due Date</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 relative">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Retrieving Tax Matrix...</p>
                      </td>
                    </tr>
                  ) : filteredInvoices.map((inv, idx) => (
                    <motion.tr 
                      key={inv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group/row"
                    >
                       <td className="p-6">
                          <div className="text-sm font-black text-[#b66dff] bg-purple-50 px-3 py-1.5 rounded-lg w-fit">{inv.id}</div>
                       </td>
                       <td className="p-6">
                          <h4 className="text-sm font-bold text-slate-800">{inv.client}</h4>
                          <p className="text-[11px] text-slate-400 font-medium">{inv.event}</p>
                       </td>
                       <td className="p-6 text-sm font-black text-slate-800">
                          ₹{inv.amount.toLocaleString()}
                       </td>
                       <td className="p-6">
                          <div className="text-xs text-slate-500 font-bold">{inv.due}</div>
                       </td>
                       <td className="p-6">
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit",
                            inv.status === 'Paid' || inv.status === 'captured' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            inv.status === 'Partial' ? "bg-blue-50 text-blue-600 border-blue-100" :
                            inv.status === 'Pending' ? "bg-slate-50 text-slate-500 border-slate-100" :
                            "bg-rose-50 text-rose-600 border-rose-100"
                          )}>
                            {inv.status === 'Paid' || inv.status === 'captured' ? <CheckCircle2 size={12} /> : 
                             inv.status === 'Partial' ? <Clock size={12} /> : 
                             inv.status === 'Pending' ? <Clock size={12} /> : <AlertCircle size={12} />}
                            {inv.status}
                          </span>
                       </td>
                       <td className="p-6 relative">
                          <div className="flex items-center gap-2 justify-end opacity-0 group-hover/row:opacity-100 transition-opacity">
                             <button onClick={() => setViewInvoice(inv)} className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-[#b66dff]"><Eye size={18} /></button>
                             <button onClick={() => downloadPDF(inv)} className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-blue-500"><Download size={18} /></button>
                             <div className="relative">
                               <button onClick={() => setMenuOpen(menuOpen === inv.id ? null : inv.id)} className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-300 hover:text-slate-600"><MoreHorizontal size={20} /></button>
                               {menuOpen === inv.id && (
                                 <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 z-50">
                                   <button onClick={() => updateStatus(inv.docId, 'Paid')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors">
                                      <Check size={16} /> Mark as Paid
                                   </button>
                                   <button onClick={() => deleteInvoice(inv.docId)} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors mt-1">
                                      <Trash2 size={16} /> Delete
                                   </button>
                                 </div>
                               )}
                             </div>
                          </div>
                       </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <AnimatePresence>
        {viewInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewInvoice(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center"><Receipt size={20} /></div>
                  <div><h3 className="font-black text-slate-800">Invoice Details</h3><p className="text-xs font-bold text-slate-400">{viewInvoice.id}</p></div>
                </div>
                <button onClick={() => setViewInvoice(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Client</p>
                    <p className="text-sm font-bold text-slate-800">{viewInvoice.client}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                    <p className="text-sm font-bold text-slate-800">{viewInvoice.status}</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Description / Plan</p>
                  <p className="text-sm font-bold text-slate-800">{viewInvoice.event}</p>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70 mb-2">Total Amount</p>
                  <p className="text-3xl font-black text-emerald-600">₹{viewInvoice.amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button onClick={() => setViewInvoice(null)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Close</button>
                <button onClick={() => { downloadPDF(viewInvoice); setViewInvoice(null); }} className="px-5 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all shadow-lg flex items-center gap-2"><Download size={16} /> Download PDF</button>
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
