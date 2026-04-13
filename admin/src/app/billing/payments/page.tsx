"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Search,
  TrendingUp,
  TrendingDown,
  Wallet,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  X,
  IndianRupee,
  CalendarDays,
  Building2,
  Mail,
  Tag,
  Hash,
  Smartphone,
  BadgeCheck,
  ChevronDown,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Payment {
  $id: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  venueName: string;
  ownerEmail: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  paidAt: string;
  source?: string;
}

const METHOD_ICONS: Record<string, string> = {
  card: "💳",
  upi: "📱",
  netbanking: "🏦",
  wallet: "👛",
  emi: "📅",
  razorpay: "🔷",
};

const PLAN_COLORS: Record<string, string> = {
  trial_30: "bg-pink-50 text-pink-600 border-pink-100",
  pax_0_50: "bg-slate-50 text-slate-600 border-slate-200",
  pax_50_100: "bg-blue-50 text-blue-600 border-blue-100",
  pax_100_200: "bg-purple-50 text-purple-600 border-purple-100",
  pax_200_500: "bg-emerald-50 text-emerald-600 border-emerald-100",
  pax_500_1000: "bg-amber-50 text-amber-600 border-amber-100",
  pax_1000_2000: "bg-orange-50 text-orange-600 border-orange-100",
  pax_2000_5000: "bg-rose-50 text-rose-600 border-rose-100",
  pax_5000: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [dataSource, setDataSource] = useState<string>("");

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${serverUrl}/payments`, { cache: "no-store" });
      const result = await res.json();
      if (result.status === "success") {
        setPayments(result.data || []);
        setDataSource(result.source || "");
      } else {
        setError(result.message || "Failed to fetch payments");
      }
    } catch {
      setError("Cannot connect to server. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  // Derived stats
  const captured = payments.filter(p => p.status === "captured");
  const totalRevenue = captured.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pending = payments.filter(p => p.status === "created" || p.status === "authorized");
  const failed = payments.filter(p => p.status === "failed");

  const filtered = payments.filter(p => {
    const matchSearch =
      (p.venueName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.ownerEmail || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.razorpayPaymentId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.planName || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === "all" || p.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    } catch { return iso; }
  };

  const statusStyle = (status: string) => {
    if (status === "captured") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (status === "failed") return "bg-rose-50 text-rose-600 border-rose-100";
    if (status === "created" || status === "authorized") return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-slate-50 text-slate-400 border-slate-100";
  };

  const statusIcon = (status: string) => {
    if (status === "captured") return <CheckCircle2 size={11} />;
    if (status === "failed") return <AlertCircle size={11} />;
    return <Clock size={11} />;
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
            <CreditCard size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Subscription Payments</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Live partner payment records
              {dataSource && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                  via {dataSource}
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={fetchPayments}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#b66dff] hover:border-purple-100 transition-all shadow-sm font-bold text-sm"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-2xl border border-slate-50 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-800">
              ₹{loading ? "—" : totalRevenue.toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] text-emerald-500 font-bold mt-0.5">{captured.length} successful payments</p>
          </div>
        </div>
        <div className="bg-white p-7 rounded-2xl border border-slate-50 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pending</p>
            <h3 className="text-2xl font-black text-slate-800">{loading ? "—" : pending.length}</h3>
            <p className="text-[10px] text-amber-500 font-bold mt-0.5">Awaiting capture</p>
          </div>
        </div>
        <div className="bg-white p-7 rounded-2xl border border-slate-50 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Failed</p>
            <h3 className="text-2xl font-black text-slate-800">{loading ? "—" : failed.length}</h3>
            <p className="text-[10px] text-rose-500 font-bold mt-0.5">Declined transactions</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            placeholder="Search by venue, email, plan or payment ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 pl-12 text-sm font-semibold shadow-sm outline-none focus:border-[#b66dff] transition-all"
          />
          <Search size={18} className="absolute left-4 text-slate-400" />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-4"><X size={16} className="text-slate-400" /></button>}
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          {["all", "captured", "created", "failed"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                statusFilter === s
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
              )}
            >
              {s === "all" ? "All" : s === "captured" ? "✓ Paid" : s === "created" ? "⏳ Pending" : "✗ Failed"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Payment ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Venue / Email</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Plan</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Method</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Time</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <Loader2 className=" text-[#b66dff] mx-auto mb-3" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading payment records...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-3 text-rose-400">
                      <AlertCircle size={28} />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-3">{error}</p>
                    <button onClick={fetchPayments} className="px-5 py-2 bg-[#b66dff] text-white rounded-xl text-xs font-bold">Try Again</button>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-300">
                      <CreditCard size={28} />
                    </div>
                    <p className="text-sm font-bold text-slate-400">
                      {payments.length === 0 ? "No subscription payments yet." : "No payments match your filters."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((pay, idx) => (
                  <motion.tr
                    key={pay.$id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => setSelectedPayment(pay)}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                  >
                    {/* Payment ID */}
                    <td className="px-6 py-4">
                      <div className="text-[10px] font-mono text-slate-500 font-bold">
                        {(pay.razorpayPaymentId || pay.$id || "").slice(0, 16)}...
                      </div>
                      {pay.razorpayOrderId && (
                        <div className="text-[9px] font-mono text-slate-300 mt-0.5">
                          {pay.razorpayOrderId.slice(0, 14)}...
                        </div>
                      )}
                    </td>

                    {/* Venue / Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl grad-brand text-white flex items-center justify-center text-sm font-black shrink-0">
                          {(pay.venueName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{pay.venueName || "—"}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{pay.ownerEmail || "—"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        PLAN_COLORS[pay.planId] || "bg-slate-50 text-slate-400 border-slate-100"
                      )}>
                        {pay.planName || pay.planId || "—"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <span className="text-base font-black text-emerald-600">
                        ₹{(pay.amount || 0).toLocaleString("en-IN")}
                      </span>
                      <p className="text-[9px] text-slate-300 font-bold">{pay.currency || "INR"}</p>
                    </td>

                    {/* Method */}
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 capitalize">
                        <span>{METHOD_ICONS[pay.method] || "💰"}</span>
                        {pay.method || "Razorpay"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-600">{formatDate(pay.paidAt)}</div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit",
                        statusStyle(pay.status)
                      )}>
                        {statusIcon(pay.status)}
                        {pay.status === "captured" ? "Paid" : pay.status === "created" ? "Pending" : pay.status}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && !error && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {filtered.length} of {payments.length} records
          </div>
        )}
      </div>

      {/* Payment Detail Drawer */}
      <AnimatePresence>
        {selectedPayment && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedPayment(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, x: 200 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 200 }}
              className="fixed right-0 top-0 h-screen w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl grad-brand text-white flex items-center justify-center font-black text-xl">
                    {(selectedPayment.venueName || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-800">{selectedPayment.venueName || "Payment Detail"}</h2>
                    <p className="text-xs text-slate-400">{formatDate(selectedPayment.paidAt)}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPayment(null)} className="p-2 hover:bg-slate-50 rounded-full">
                  <X size={20} className="text-slate-300" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Big Amount */}
                <div className={cn(
                  "rounded-2xl p-6 text-center",
                  selectedPayment.status === "captured" ? "bg-emerald-50" : "bg-rose-50"
                )}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Transaction Amount</p>
                  <p className={cn("text-4xl font-black", selectedPayment.status === "captured" ? "text-emerald-600" : "text-rose-500")}>
                    ₹{(selectedPayment.amount || 0).toLocaleString("en-IN")}
                  </p>
                  <span className={cn(
                    "mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                    statusStyle(selectedPayment.status)
                  )}>
                    {statusIcon(selectedPayment.status)}
                    {selectedPayment.status === "captured" ? "Payment Successful" : selectedPayment.status}
                  </span>
                </div>

                {/* Detail Rows */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Details</p>
                  {[
                    { icon: <Hash size={14} />, label: "Payment ID", val: selectedPayment.razorpayPaymentId },
                    { icon: <Hash size={14} />, label: "Order ID", val: selectedPayment.razorpayOrderId },
                    { icon: <Building2 size={14} />, label: "Venue", val: selectedPayment.venueName },
                    { icon: <Mail size={14} />, label: "Email", val: selectedPayment.ownerEmail },
                    { icon: <Tag size={14} />, label: "Plan", val: selectedPayment.planName || selectedPayment.planId },
                    { icon: <Smartphone size={14} />, label: "Method", val: `${METHOD_ICONS[selectedPayment.method] || "💰"} ${selectedPayment.method || "Razorpay"}` },
                    { icon: <IndianRupee size={14} />, label: "Currency", val: selectedPayment.currency || "INR" },
                    { icon: <CalendarDays size={14} />, label: "Paid At", val: formatDate(selectedPayment.paidAt) },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0">
                        {icon} {label}
                      </span>
                      <span className="text-xs font-bold text-slate-700 text-right truncate max-w-[55%] font-mono">
                        {val || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
