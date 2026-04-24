"use client";

import React, { useState, useEffect } from "react";
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
  Banknote
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
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    discountValue: "",
    discountType: "percentage",
    expiryDate: "",
    status: "active"
  });

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/coupons`);
      const result = await res.json();
      if (result.status === "success") {
        setCoupons(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch coupons", err);
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
        expiryDate: coupon.expiryDate.split('T')[0],
        status: coupon.status
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: "",
        discountValue: "",
        discountType: "percentage",
        expiryDate: "",
        status: "active"
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCoupon ? 'PATCH' : 'POST';
    const url = editingCoupon ? `${serverUrl}/coupons/${editingCoupon.$id}` : `${serverUrl}/coupons`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (result.status === "success") {
        fetchCoupons();
        setModalOpen(false);
      } else {
        alert(result.message || "Failed to save coupon");
      }
    } catch (err) {
      console.error("Error saving coupon", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`${serverUrl}/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCoupons();
    } catch (err) {
      console.error("Error deleting coupon", err);
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
      if (res.ok) fetchCoupons();
    } catch (err) {
      console.error("Error toggling status", err);
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl grad-brand flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
            <Ticket size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Coupon System</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Manage marketing discounts and promotional codes</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center gap-2 font-bold text-sm"
        >
          <Plus size={18} /> Internal Coupon
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Active Coupons</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-slate-800">{coupons.filter(c => c.status === 'active').length}</h3>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Expiring Soon</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-amber-500">
              {coupons.filter(c => {
                const diff = new Date(c.expiryDate).getTime() - new Date().getTime();
                return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
              }).length}
            </h3>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
              <Calendar size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Total Codes</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-[#b66dff]">{coupons.length}</h3>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-[#b66dff]">
              <Ticket size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="relative group">
        <input 
          type="text" 
          placeholder="Search by coupon code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 pl-14 text-sm font-semibold outline-none focus:border-[#b66dff] focus:ring-4 focus:ring-purple-500/5 transition-all shadow-sm group-hover:shadow-md"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#b66dff] transition-colors" size={20} />
      </div>

      {/* Coupon List */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Coupon Details</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Value</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Expiry</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Coupons...</p>
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Ticket size={28} className="text-slate-200" />
                    </div>
                    <p className="text-sm font-bold text-slate-400">No coupons found matching your search</p>
                  </td>
                </tr>
              ) : filteredCoupons.map((coupon) => (
                <tr key={coupon.$id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-black text-lg shadow-sm">
                        {coupon.discountType === 'percentage' ? '%' : '₹'}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800 m-0 flex items-center gap-2">
                          {coupon.code}
                          <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black rounded uppercase text-slate-500">System</span>
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5 italic">Added on {new Date(coupon.$createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5",
                        coupon.discountType === 'percentage' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {coupon.discountType === 'percentage' ? <Percent size={12} /> : <Banknote size={12} />}
                        {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : ''} OFF
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-xs font-black",
                        new Date(coupon.expiryDate) < new Date() ? "text-rose-500" : "text-slate-700"
                      )}>
                        {new Date(coupon.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">at 11:59 PM</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => toggleStatus(coupon)}
                      className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                        coupon.status === 'active' 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" 
                          : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                      )}
                    >
                      {coupon.status}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(coupon)}
                        className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#b66dff] hover:border-purple-200 shadow-sm transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(coupon.$id)}
                        className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-200 shadow-sm transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
            >
              <div className="grad-brand p-8 text-white relative">
                <button 
                  onClick={() => setModalOpen(false)}
                  className="absolute right-6 top-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                  <Ticket size={32} />
                </div>
                <h2 className="text-2xl font-black m-0">{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
                <p className="text-white/60 text-sm font-medium mt-1">Configure your discount parameters</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Coupon Code</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. PARTY20"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-sm font-black text-slate-800 outline-none focus:border-[#b66dff] focus:bg-white transition-all uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Discount Type</label>
                    <select 
                      value={formData.discountType}
                      onChange={(e) => setFormData({...formData, discountType: e.target.value as 'fixed' | 'percentage'})}
                      className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-sm font-bold text-slate-800 outline-none focus:border-[#b66dff] focus:bg-white transition-all appearance-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Value</label>
                    <input 
                      required
                      type="number"
                      placeholder={formData.discountType === 'percentage' ? "20" : "500"}
                      value={formData.discountValue}
                      onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                      className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-sm font-black text-slate-800 outline-none focus:border-[#b66dff] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Expiry Date</label>
                  <div className="relative">
                    <input 
                      required
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 pl-14 text-sm font-black text-slate-800 outline-none focus:border-[#b66dff] focus:bg-white transition-all"
                    />
                    <Calendar size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 h-14 bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 h-14 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all"
                  >
                    {editingCoupon ? 'Update Code' : 'Create Coupon'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
