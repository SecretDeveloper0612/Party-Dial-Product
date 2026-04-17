"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Search, 
  Download, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Loader2,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Payment {
  $id: string;
  razorpayPaymentId: string;
  venueName: string;
  ownerEmail: string;
  planName: string;
  amount: number;
  status: string;
  paidAt: string;
  invoiceNumber?: string;
}

export default function PaymentLogsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/payments`);
      const result = await res.json();
      if (result.status === "success") {
        setPayments(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.venueName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.ownerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.razorpayPaymentId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === "ALL" || p.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/10">
            <CreditCard size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Payment Logs</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Audit trail for all platform transactions</p>
          </div>
        </div>
        <button 
          onClick={fetchPayments}
          className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-sm shadow-sm"
        >
          <Calendar size={18} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         <div className="lg:col-span-8 relative group">
            <input 
              type="text" 
              placeholder="Search by venue name, email or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 pl-14 text-sm font-semibold outline-none focus:border-indigo-400 transition-all shadow-sm group-hover:shadow-md"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" size={20} />
         </div>
         <div className="lg:col-span-4 relative group">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-600 outline-none focus:border-indigo-400 transition-all shadow-sm appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="captured">Captured / Success</option>
              <option value="failed">Failed</option>
            </select>
            <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
         </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
               <CheckCircle2 size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Success Rate</p>
               <h3 className="text-xl font-black text-slate-800">
                 {loading || payments.length === 0 ? "—" : `${((payments.filter(p => p.status === 'captured').length / payments.length) * 100).toFixed(1)}%`}
               </h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
               <CreditCard size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Revenue</p>
               <h3 className="text-xl font-black text-slate-800">
                 ₹{payments.reduce((acc, curr) => acc + (curr.status === 'captured' ? curr.amount : 0), 0).toLocaleString()}
               </h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
               <Filter size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Logged Transfers</p>
               <h3 className="text-xl font-black text-slate-800">{payments.length}</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
               <XCircle size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Failed Trans.</p>
               <h3 className="text-xl font-black text-slate-800">{loading ? "—" : payments.filter(p => p.status !== 'captured').length}</h3>
            </div>
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Details</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Venue / Partner</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Plan</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center"><Loader2 className="animate-spin text-slate-400 mx-auto" /></td>
                </tr>
              ) : filteredPayments.map((p) => (
                <tr key={p.$id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <CreditCard size={18} />
                       </div>
                       <div>
                          <h4 className="text-xs font-black text-slate-800 m-0">{p.razorpayPaymentId}</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{new Date(p.paidAt).toLocaleDateString('en-GB')}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <h4 className="text-xs font-black text-slate-700 m-0">{p.venueName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{p.ownerEmail}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                       {p.planName}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-800">₹{p.amount}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <div className={cn(
                         "w-2 h-2 rounded-full",
                         p.status === 'captured' ? "bg-emerald-500" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                       )} />
                       <span className={cn(
                         "text-[10px] font-black uppercase tracking-widest",
                         p.status === 'captured' ? "text-emerald-600" : "text-rose-500"
                       )}>
                         {p.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 shadow-sm transition-all group-hover:scale-105">
                       <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
