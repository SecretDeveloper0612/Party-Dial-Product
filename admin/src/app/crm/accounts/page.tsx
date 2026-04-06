"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Search, 
  Plus, 
  MapPin, 
  Phone, 
  Globe, 
  ExternalLink,
  Users,
  Briefcase,
  TrendingUp,
  Loader2,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { getAccounts, Account } from "@/lib/store";
import { cn } from "@/lib/utils";
import CRMDetailDrawer from "@/components/CRMDetailDrawer";

export default function CRMAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewingAccount, setViewingAccount] = useState<Account | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAccounts(getAccounts());
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-200">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
               <Building2 size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Accounts</h1>
               <p className="text-sm text-slate-400 font-medium mt-1">Manage partner companies and venue groups</p>
            </div>
         </div>
         <button className="px-6 py-4 grad-purple text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
            <Plus size={18} /> <span>Add New Account</span>
         </button>
      </div>

      {/* Search & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         <div className="lg:col-span-8 relative group flex items-center">
            <input 
              type="text" 
              placeholder="Search by company name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="user-input pr-12 pl-4 shadow-sm"
            />
            <div className="absolute right-4 pointer-events-none">
               <Search className="text-slate-400" size={18} />
            </div>
         </div>
         <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center">
               <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Active Accounts</p>
               <p className="text-lg font-black text-slate-800">{accounts.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center">
               <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Global Reach</p>
               <p className="text-lg font-black text-emerald-500">2 Cities</p>
            </div>
         </div>
      </div>

      {/* Accounts Ledger */}
      <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden group">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Company Name</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Business Type</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">City / Location</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Related Items</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined Date</th>
                     <th className="p-6 text-[10px) font-black uppercase tracking-widest text-slate-400"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                         <Loader2 className="animate-spin text-[#b66dff] mx-auto mb-4" size={32} />
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Account Matrix...</p>
                      </td>
                    </tr>
                  ) : filteredAccounts.map((acc, i) => (
                    <motion.tr 
                      key={acc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        setViewingAccount(acc);
                        setIsDrawerOpen(true);
                      }}
                      className="hover:bg-slate-50/50 transition-colors group/row cursor-pointer"
                    >
                       <td className="p-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl grad-brand text-white flex items-center justify-center font-black text-sm">{acc.name.charAt(0)}</div>
                             <div>
                                <h4 className="text-sm font-bold text-slate-800">{acc.name}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                   <span className="text-[10px] text-slate-400 flex items-center gap-1"><Globe size={10} /> {acc.website}</span>
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="p-6"><span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">{acc.industry}</span></td>
                       <td className="p-6"><div className="flex items-center gap-2 text-xs font-bold text-slate-600"><MapPin size={12} className="text-[#b66dff]" /> {acc.city}</div></td>
                       <td className="p-6">
                          <div className="flex gap-1 text-slate-300">
                             <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center" title="Contacts"><Users size={12} /></div>
                             <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center" title="Deals"><Briefcase size={12} /></div>
                          </div>
                       </td>
                       <td className="p-6 text-xs font-bold text-slate-400">{acc.createdAt}</td>
                       <td className="p-6 text-right"><MoreHorizontal className="text-slate-300 hover:text-[#b66dff] cursor-pointer inline-block" /></td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <CRMDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        entity={viewingAccount as any} 
        type="Account" 
      />

      <style jsx global>{`
        .user-input { width: 100%; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 1.25rem; padding: 1.25rem; font-size: 0.875rem; font-weight: 700; transition: all 0.3s; outline: none; }
        .user-input:focus { border-color: #b66dff; background: #ffffff; box-shadow: 0 4px 20px rgba(182, 109, 255, 0.08); }
      `}</style>
    </div>
  );
}
