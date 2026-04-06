"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockPayments = [
  { id: "PAY-5001", client: "Mehta Wedding", method: "Razorpay (Credit Card)", amount: 50000, date: "2024-03-22", status: "Success", ref: "rzp_test_12345" },
  { id: "PAY-5002", client: "Grand Hyatt Regency", method: "Bank Transfer (NEFT)", amount: 45000, date: "2024-03-24", status: "Success", ref: "UTRN-00982-HB" },
  { id: "PAY-5003", client: "Tech Mahindra", method: "Corporate Card", amount: 12000, date: "2024-03-26", status: "Failed", ref: "ERR-CARD-DECLINE" },
  { id: "PAY-5004", client: "Oberoi International", method: "UPI (GPay)", amount: 32000, date: "2024-03-27", status: "Pending", ref: "UPI-4491-PEND" },
];

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredPayments = mockPayments.filter(p => 
    p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
               <CreditCard size={28} />
            </div>
             <div>
                <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Financial Ledger</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">Transaction history and cashflow verification</p>
             </div>
         </div>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
               <TrendingUp size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Revenue</p>
               <h3 className="text-xl font-black text-slate-800">₹9,45,000</h3>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#b66dff] flex items-center justify-center">
               <Wallet size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pending Payouts</p>
               <h3 className="text-xl font-black text-slate-800">₹1,22,000</h3>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
               <TrendingDown size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Return volume</p>
               <h3 className="text-xl font-black text-slate-800">₹14,500</h3>
            </div>
         </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         <div className="lg:col-span-12 relative group flex items-center">
            <input 
              type="text" 
              placeholder="Search by Payment ID, Transaction Ref or Client name..."
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
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Payment ID</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Client / Gateway</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Ref ID</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                         <Loader2 className="animate-spin text-[#b66dff] mx-auto mb-4" size={32} />
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Querying Financial Cluster...</p>
                      </td>
                    </tr>
                  ) : filteredPayments.map((pay, idx) => (
                    <motion.tr 
                      key={pay.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group/row"
                    >
                       <td className="p-6">
                          <div className="text-xs font-black text-slate-800">{pay.id}</div>
                       </td>
                       <td className="p-6">
                          <h4 className="text-sm font-bold text-slate-800">{pay.client}</h4>
                          <p className="text-[11px] text-slate-400 font-medium">{pay.method}</p>
                       </td>
                       <td className="p-6 text-sm font-black text-emerald-600">
                          ₹{pay.amount.toLocaleString()}
                       </td>
                       <td className="p-6">
                          <div className="text-xs text-slate-500 font-bold">{pay.date}</div>
                       </td>
                       <td className="p-6">
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit",
                            pay.status === 'Success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            pay.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                            "bg-rose-50 text-rose-600 border-rose-100"
                          )}>
                            {pay.status === 'Success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                            {pay.status}
                          </span>
                       </td>
                       <td className="p-6">
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{pay.ref}</div>
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
