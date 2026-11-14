"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Ticket, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Percent,
  Banknote,
  RefreshCw,
  Copy,
  Check,
  Tag,
  ArrowRight,
  Sparkles
} from "lucide-react";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Coupon {
  $id: string;
  code: string;
  discountValue: number;
  discountType: 'fixed' | 'percentage';
  expiryDate: string;
  status: 'active' | 'inactive';
  $createdAt: string;
}

export default function CouponManagementPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "expiring">("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [formData, setFormData] = useState({
    code: "",
    discountValue: "",
    discountType: "percentage" as "percentage" | "fixed",
    expiryDate: "",
    status: "active" as "active" | "inactive"
  });

  const rawBase = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const base = rawBase.replace(/\/+$/, "");
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/coupons`);
      const result = await res.json();
      if (result.status === "success") {
        setCoupons(result.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch coupons", err);
      showToast("Failed to load coupons from server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountValue: coupon.discountValue.toString(),
        discountType: coupon.discountType,
        expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : "",
        status: coupon.status
      });
    } else {
      setEditingCoupon(null);
      // Default to 30 days from now
      const defaultExp = new Date();
      defaultExp.setDate(defaultExp.getDate() + 30);
      setFormData({
        code: "",
        discountValue: "",
        discountType: "percentage",
        expiryDate: defaultExp.toISOString().split('T')[0],
        status: "active"
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const method = editingCoupon ? 'PATCH' : 'POST';
    const url = editingCoupon ? `${serverUrl}/coupons/${editingCoupon.$id}` : `${serverUrl}/coupons`;

    try {
      const payload = {
        ...formData,
        discountValue: parseFloat(formData.discountValue)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.status === "success") {
        showToast(editingCoupon ? "✓ Coupon updated successfully" : "✓ Coupon created successfully", "success");
        fetchCoupons();
        setModalOpen(false);
      } else {
        showToast(result.message || "Failed to save coupon", "error");
      }
    } catch (err: any) {
      console.error("Error saving coupon", err);
      showToast("Network error while saving coupon", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteCoupon = async () => {
    if (!couponToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`${serverUrl}/coupons/${couponToDelete.$id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`✓ Coupon "${couponToDelete.code}" deleted`, "success");
        setCoupons(prev => prev.filter(c => c.$id !== couponToDelete.$id));
        setCouponToDelete(null);
      } else {
        showToast("Failed to delete coupon", "error");
      }
    } catch (err) {
      console.error("Error deleting coupon", err);
      showToast("Network error deleting coupon", "error");
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (coupon: Coupon) => {
    const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`${serverUrl}/coupons/${coupon.$id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setCoupons(prev => prev.map(c => c.$id === coupon.$id ? { ...c, status: newStatus } : c));
        showToast(`Coupon status set to ${newStatus}`, "success");
      }
    } catch (err) {
      console.error("Error toggling status", err);
      showToast("Could not update status", "error");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Stats computation
  const stats = useMemo(() => {
    const now = Date.now();
    const active = coupons.filter(c => c.status === 'active').length;
    const expiringSoon = coupons.filter(c => {
      if (!c.expiryDate) return false;
      const diff = new Date(c.expiryDate).getTime() - now;
      return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
    }).length;
    return {
      active,
      expiringSoon,
      total: coupons.length
    };
  }, [coupons]);

  const filteredCoupons = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const now = Date.now();

    return coupons.filter(c => {
      const matchesSearch = !q || c.code.toLowerCase().includes(q);
      if (!matchesSearch) return false;

      if (filterStatus === "active") return c.status === "active";
      if (filterStatus === "inactive") return c.status === "inactive";
      if (filterStatus === "expiring") {
        if (!c.expiryDate) return false;
        const diff = new Date(c.expiryDate).getTime() - now;
        return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
      }
      return true;
    });
  }, [coupons, searchQuery, filterStatus]);

  return (
    <div className="space-y-8 pb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-6 right-6 z-[200] px-5 py-3 rounded-2xl text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5",
              toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
            )}
          >
            {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9d50bb] to-[#b66dff] flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Ticket size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
              Coupon System
            </h1>
            <p className="text-xs font-light text-slate-400 mt-0.5">
              Manage promotional codes, percentage discounts, and marketing campaigns
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCoupons}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 hover:border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            title="Refresh Coupons"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#b66dff]" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button 
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl shadow-lg shadow-slate-900/15 transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer active:scale-95"
          >
            <Plus size={16} />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Modern KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Active Coupons Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-light text-slate-400 uppercase tracking-wider">
              Active Coupons
            </p>
            <h3 className="text-2xl font-semibold text-slate-800 mt-1">
              {stats.active}
            </h3>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
              Live & Redeemable
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Expiring Soon Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-light text-slate-400 uppercase tracking-wider">
              Expiring Soon
            </p>
            <h3 className="text-2xl font-semibold text-amber-500 mt-1">
              {stats.expiringSoon}
            </h3>
            <span className="text-[10px] font-light text-slate-400 inline-block mt-1">
              Within next 7 days
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100/60">
            <Calendar size={22} />
          </div>
        </div>

        {/* Total Codes Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-light text-slate-400 uppercase tracking-wider">
              Total Codes
            </p>
            <h3 className="text-2xl font-semibold text-[#b66dff] mt-1">
              {stats.total}
            </h3>
            <span className="text-[10px] font-light text-slate-400 inline-block mt-1">
              Created in system
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#b66dff] flex items-center justify-center border border-purple-100/60">
            <Ticket size={22} />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3.5 text-slate-400" size={17} />
          <input 
            type="text" 
            placeholder="Search coupon code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pl-10 pr-4 py-2 text-xs font-semibold text-slate-700 placeholder:text-slate-400 placeholder:font-light outline-none"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl shrink-0 self-start md:self-auto">
          {(["all", "active", "expiring", "inactive"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer",
                filterStatus === s 
                  ? "bg-white text-slate-800 shadow-sm font-bold" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Modern Coupon Card Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-[#b66dff]" />
            <p className="text-xs font-light text-slate-400">Loading coupons...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#b66dff] flex items-center justify-center">
              <Ticket size={28} />
            </div>
            <h3 className="text-base font-semibold text-slate-700">No coupons found</h3>
            <p className="text-xs font-light text-slate-400 max-w-xs">
              {searchQuery ? "No coupon matching your search query. Try another keyword." : "Get started by creating your first promotional coupon."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => handleOpenModal()}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
              >
                Create First Coupon
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCoupons.map((coupon) => {
              const isExpired = coupon.expiryDate && new Date(coupon.expiryDate).getTime() < Date.now();
              const isPercentage = coupon.discountType === 'percentage';

              return (
                <div 
                  key={coupon.$id}
                  className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Top Header: Code pill and status */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
                        <Tag size={13} className="text-[#b66dff]" />
                        <span className="text-sm font-semibold tracking-wider text-slate-800 uppercase font-mono">
                          {coupon.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(coupon.code)}
                          className="ml-1 text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedCode === coupon.code ? (
                            <Check size={13} className="text-emerald-600" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleStatus(coupon)}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider border transition-all cursor-pointer",
                          coupon.status === "active" && !isExpired
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                            : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                        )}
                        title="Click to toggle status"
                      >
                        {isExpired ? "Expired" : coupon.status}
                      </button>
                    </div>

                    {/* Discount Value Display */}
                    <div className="my-4 flex items-baseline gap-1.5">
                      <span className="text-3xl font-semibold text-slate-900 tracking-tight">
                        {isPercentage ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                      </span>
                      <span className="text-xs font-light text-slate-400 uppercase tracking-wider">
                        Discount Off
                      </span>
                    </div>

                    {/* Expiry Details */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-light mb-4">
                      <Calendar size={13} className="text-slate-400 shrink-0" />
                      <span>
                        Expires: <strong className={cn("font-semibold", isExpired ? "text-rose-500" : "text-slate-700")}>
                          {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "No expiry"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3.5 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-light text-slate-400">
                      Created {coupon.$createdAt ? new Date(coupon.$createdAt).toLocaleDateString() : ""}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(coupon)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-400 hover:text-[#b66dff] transition-all cursor-pointer"
                        title="Edit Coupon"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCouponToDelete(coupon)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                        title="Delete Coupon"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Coupon Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100"
            >
              <div className="bg-gradient-to-tr from-[#9d50bb] to-[#b66dff] p-6 text-white relative">
                <button 
                  onClick={() => !saving && setModalOpen(false)}
                  className="absolute right-5 top-5 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
                <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mb-3">
                  <Ticket size={24} />
                </div>
                <h2 className="text-xl font-semibold m-0 tracking-tight">
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
                <p className="text-white/80 text-xs font-light mt-0.5">
                  Set promotional coupon code and discount percentage
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                
                {/* Coupon Code Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Coupon Code
                  </label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. PARTY20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#b66dff] focus:bg-white transition-all uppercase font-mono tracking-wider"
                  />
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Type
                    </label>
                    <select 
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'fixed' | 'percentage' })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#b66dff] focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Flat (₹)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                    </label>
                    <input 
                      required
                      type="number"
                      min="1"
                      placeholder={formData.discountType === 'percentage' ? "20" : "500"}
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#b66dff] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <input 
                      required
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 pl-10 text-xs font-semibold text-slate-800 outline-none focus:border-[#b66dff] focus:bg-white transition-all"
                    />
                    <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: "active" })}
                      className={cn(
                        "py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                        formData.status === "active"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-slate-50 text-slate-500 border-slate-100"
                      )}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: "inactive" })}
                      className={cn(
                        "py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                        formData.status === "inactive"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-500 border-slate-100"
                      )}
                    >
                      Inactive
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex items-center gap-3">
                  <button 
                    type="button"
                    disabled={saving}
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md shadow-slate-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingCoupon ? 'Update Code' : 'Create Coupon'}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {couponToDelete && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setCouponToDelete(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 border border-slate-100 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100/60">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1.5">
                Delete Coupon?
              </h3>
              <p className="text-xs font-light text-slate-500 leading-relaxed mb-6">
                Are you sure you want to permanently delete coupon code{" "}
                <span className="font-semibold text-slate-700 uppercase">"{couponToDelete.code}"</span>? 
                This action cannot be undone.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setCouponToDelete(null)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={confirmDeleteCoupon}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Confirm Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
