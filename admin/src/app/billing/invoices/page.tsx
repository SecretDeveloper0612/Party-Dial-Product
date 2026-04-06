"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Receipt, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download,
  Eye,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockInvoices = [
  { id: "INV-9021", client: "Grand Hyatt Regency", event: "Corporate Gala 2024", amount: 45000, date: "2024-03-20", status: "Paid", due: "2024-03-25" },
  { id: "INV-9022", client: "Mehta Wedding", event: "Sangeet & Wedding", amount: 125000, date: "2024-03-22", status: "Partial", due: "2024-03-30" },
  { id: "INV-9023", client: "Tech Mahindra", event: "Annual Tech Summit", amount: 85000, date: "2024-03-25", status: "Overdue", due: "2024-03-28" },
  { id: "INV-9024", client: "Oberoi International", event: "Foundation Day", amount: 32000, date: "2024-03-26", status: "Pending", due: "2024-04-05" },
];

export default function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredInvoices = mockInvoices.filter(i => 
    i.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
         <div className="overflow-x-auto">
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
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                         <Loader2 className="animate-spin text-[#b66dff] mx-auto mb-4" size={32} />
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
                            inv.status === 'Paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            inv.status === 'Partial' ? "bg-blue-50 text-blue-600 border-blue-100" :
                            inv.status === 'Pending' ? "bg-slate-50 text-slate-500 border-slate-100" :
                            "bg-rose-50 text-rose-600 border-rose-100"
                          )}>
                            {inv.status === 'Paid' ? <CheckCircle2 size={12} /> : 
                             inv.status === 'Partial' ? <Clock size={12} /> : 
                             inv.status === 'Pending' ? <Clock size={12} /> : <AlertCircle size={12} />}
                            {inv.status}
                          </span>
                       </td>
                       <td className="p-6">
                          <div className="flex items-center gap-2 justify-end opacity-0 group-hover/row:opacity-100 transition-opacity">
                             <button className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-[#b66dff]"><Eye size={18} /></button>
                             <button className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-blue-500"><Download size={18} /></button>
                             <button className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-300 hover:text-slate-600"><MoreHorizontal size={20} /></button>
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
