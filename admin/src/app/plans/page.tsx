"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Plus,
  Search,
  RefreshCw,
  X,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  Layers,
  ShieldCheck,
  ChevronRight,
  Loader2,
  AlertCircle,
  TrendingUp,
  Target,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  $id: string;
  name: string;
  price: number;
  duration: number; // in days
  leadLimit: number;
  features: string[];
  status: "active" | "inactive";
  $createdAt?: string;
}

export default function PlanManagementPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: 11,
    duration: 30,
    leadLimit: 5,
    features: ["Access to Dashboard", "Real-time Lead Notifications"],
    status: "active" as "active" | "inactive"
  });

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // We'll try to fetch from a mock endpoint or Appwrite via server
      // For now, let's use some sophisticated mock data if the server doesn't have it
      const res = await fetch(`${serverUrl}/plans`, { cache: "no-store" });
      const result = await res.json();
      if (result.status === "success") {
        setPlans(result.data || []);
      } else {
        // Fallback to initial mock if endpoint not found (to show UI)
        setPlans([]);
      }
    } catch (e) {
      // Mock data for first-time setup
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleOpenModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        leadLimit: plan.leadLimit,
        features: plan.features,
        status: plan.status
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "",
        price: 11,
        duration: 30,
        leadLimit: 5,
        features: ["Dashboard Access", "Real-time Lead Notifications"],
        status: "active"
      });
    }
    setIsModalOpen(true);
  };

  const handleSavePlan = async () => {
    setIsSaving(true);
    try {
      const endpoint = editingPlan ? `${serverUrl}/plans/${editingPlan.$id}` : `${serverUrl}/plans`;
      const method = editingPlan ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      
      if (result.status === "success") {
        await fetchPlans(); // Refresh list to get real IDs and state
        setIsModalOpen(false);
      } else {
        alert("Action failed: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Save failed", err);
      alert("Network error occurred while synchronizing.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (plan: Plan) => {
    try {
      const newStatus = plan.status === "active" ? "inactive" : "active";
      const res = await fetch(`${serverUrl}/plans/${plan.$id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await res.json();
      if (result.status === "success") {
        setPlans(prev => prev.map(p => p.$id === plan.$id ? { ...p, status: newStatus } : p));
      } else {
        alert("Toggle failed: " + (result.message || "Please check if your Appwrite 'plans' collection exists."));
      }
    } catch (err) {
      console.error("Status toggle failed", err);
      alert("Network error: Could not synchronize status.");
    }
  };

  const deletePlan = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this plan?")) {
      try {
        const res = await fetch(`${serverUrl}/plans/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.status === "success") {
          setPlans(prev => prev.filter(p => p.$id !== id));
        }
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
            <Zap size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Subscription Plan Management</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Manage vendor subscription packs and lead access limits</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <button
              onClick={fetchPlans}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-orange-500 hover:border-orange-100 transition-all shadow-sm font-bold text-sm"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-orange-500 transition-all shadow-xl shadow-slate-900/10 font-bold text-sm"
            >
              <Plus size={18} />
              Create New Plan
            </button>
        </div>
      </div>



      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
             Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-[32px] p-8 border border-slate-50 h-[300px] animate-pulse flex flex-col justify-between">
                   <div className="w-1/2 h-6 bg-slate-100 rounded-lg" />
                   <div className="space-y-3">
                      <div className="w-full h-4 bg-slate-50 rounded" />
                      <div className="w-3/4 h-4 bg-slate-50 rounded" />
                   </div>
                   <div className="w-full h-12 bg-slate-100 rounded-xl" />
                </div>
             ))
        ) : plans.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
               <Layers className="mx-auto text-slate-200 mb-4" size={64} />
               <h2 className="text-xl font-black text-slate-800 uppercase italic mb-2">No Plans Configured</h2>
               <p className="text-sm text-slate-400 font-medium mb-8 uppercase tracking-widest">Start by creating your first subscription package</p>
               <button onClick={() => handleOpenModal()} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-orange-500 transition-all">Enable Strategy</button>
            </div>
        ) : (
          plans.map((plan) => (
            <motion.div
              key={plan.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-white rounded-[40px] p-8 border hover:shadow-2xl transition-all duration-500 group relative overflow-hidden",
                plan.status === "inactive" ? "opacity-60 grayscale-[0.5] border-slate-100" : "border-slate-50 shadow-pd-soft"
              )}
            >
              {/* Background Accent */}
              <div className={cn(
                "absolute -right-20 -top-20 w-48 h-48 rounded-full blur-[80px] opacity-20 transition-all duration-500 group-hover:scale-110",
                plan.status === "inactive" ? "bg-slate-500" : "bg-orange-500"
              )} />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    plan.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                  )}>
                    {plan.status === "active" ? "✓ Publicly visible" : "✗ Hidden from users"}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleOpenModal(plan)}
                      className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:text-orange-500 flex items-center justify-center transition-all border border-transparent hover:border-orange-100"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => deletePlan(plan.$id)}
                      className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all border border-transparent hover:border-rose-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter m-0 group-hover:text-orange-500 transition-colors">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-3xl font-black text-slate-900 italic tracking-tighter">₹{plan.price}</span>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">/ {plan.duration} Days</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                   {/* Limits */}
                   <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Lead Access</p>
                         <p className="text-sm font-black text-slate-700">{plan.leadLimit} Units</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Validation</p>
                         <p className="text-sm font-black text-slate-700">{plan.duration} Days</p>
                      </div>
                   </div>

                   {/* Features */}
                   <div className="space-y-2 pt-2">
                     {plan.features.map((feature, idx) => (
                       <div key={idx} className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{feature}</span>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <button 
                     onClick={() => toggleStatus(plan)}
                     className={cn(
                       "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg",
                       plan.status === "active" 
                        ? "bg-slate-900 text-white hover:bg-rose-500" 
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                     )}
                   >
                     {plan.status === "active" ? "Deactivate Plan" : "Activate Plan"}
                   </button>
                   <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300">
                      <ChevronRight size={20} />
                   </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {[
            { label: 'Active Strategy', val: plans.filter(p => p.status === 'active').length, icon: <Zap size={20} />, col: 'text-orange-500 bg-orange-50' },
            { label: 'Total Packs', val: plans.length, icon: <Layers size={20} />, col: 'text-blue-500 bg-blue-50' },
            { label: 'Core Integrity', val: 'Active', icon: <ShieldCheck size={20} />, col: 'text-emerald-500 bg-emerald-50' },
            { label: 'Market Ready', val: '100%', icon: <TrendingUp size={20} />, col: 'text-purple-500 bg-purple-50' },
         ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm flex items-center gap-4">
               <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.col)}>
                  {stat.icon}
               </div>
               <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
                  <h4 className="text-lg font-black text-slate-800 m-0">{stat.val}</h4>
               </div>
            </div>
         ))}
      </div>



      {/* Plan Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                       <Zap size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter m-0">
                        {editingPlan ? "Edit Strategy" : "Define New Strategy"}
                      </h2>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Configure plan parameters & visibility</p>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors">
                    <X size={20} className="text-slate-300" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Name & Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Name</label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black italic shadow-inner outline-none focus:bg-white focus:border-orange-500 transition-all"
                        placeholder="e.g. ₹11 Special Offer"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                       <div className="relative">
                          <IndianRupee size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input 
                             type="number"
                             className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-black italic shadow-inner outline-none focus:bg-white focus:border-orange-500 transition-all"
                             value={formData.price}
                             onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                          />
                       </div>
                    </div>
                  </div>

                  {/* Duration & Lead Limit */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Days)</label>
                      <div className="relative">
                         <Clock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                         <input 
                           type="number"
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-black italic shadow-inner outline-none focus:bg-white focus:border-orange-500 transition-all"
                           value={formData.duration}
                           onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
                         />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Access Limit</label>
                       <div className="relative">
                          <Target size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input 
                             type="number"
                             className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-black italic shadow-inner outline-none focus:bg-white focus:border-orange-500 transition-all"
                             value={formData.leadLimit}
                             onChange={(e) => setFormData({...formData, leadLimit: parseInt(e.target.value) || 0})}
                          />
                       </div>
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deployment Status</label>
                     <div className="flex gap-4">
                        <button 
                          onClick={() => setFormData({...formData, status: 'active'})}
                          className={cn(
                            "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                            formData.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-500 shadow-sm" : "bg-slate-50 text-slate-300 border-slate-100"
                          )}
                        >
                           Active & Live
                        </button>
                        <button 
                           onClick={() => setFormData({...formData, status: 'inactive'})}
                           className={cn(
                             "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                             formData.status === 'inactive' ? "bg-rose-50 text-rose-600 border-rose-500 shadow-sm" : "bg-slate-50 text-slate-300 border-slate-100"
                           )}
                        >
                           Hidden / Draft
                        </button>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-6">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-5 rounded-[22px] bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-slate-100 transition-all"
                    >
                      Cancel Action
                    </button>
                    <button
                      onClick={handleSavePlan}
                      disabled={isSaving || !formData.name}
                      className="flex-[2] py-5 rounded-[22px] bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.25em] hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <div className="flex items-center justify-center gap-2">
                           <Loader2 size={16} className="animate-spin" />
                           Synchronizing...
                        </div>
                      ) : (
                        editingPlan ? "Force Update Plan" : "Deploy Strategy"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

