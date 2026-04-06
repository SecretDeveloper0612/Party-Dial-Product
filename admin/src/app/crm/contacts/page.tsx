"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Building2, 
  MoreHorizontal,
  Loader2,
  Trash2,
  Edit2
} from "lucide-react";
import { getContacts, getAccounts, Contact, Account } from "@/lib/store";
import { cn } from "@/lib/utils";
import CRMDetailDrawer from "@/components/CRMDetailDrawer";

export default function CRMContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContacts(getContacts());
      setAccounts(getAccounts());
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredContacts = contacts.filter(con => 
    `${con.firstName} ${con.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    con.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-200">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
               <Users size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Contacts</h1>
               <p className="text-sm text-slate-400 font-medium mt-1">Manage venue owners, managers, and key personnel</p>
            </div>
         </div>
         <button className="px-6 py-4 grad-purple text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
            <Plus size={18} /> <span>Add New Person</span>
         </button>
      </div>

      {/* Control Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         <div className="lg:col-span-8 relative group flex items-center">
            <input 
              type="text" 
              placeholder="Search by name or email address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="user-input pr-12 pl-4 shadow-sm"
            />
            <div className="absolute right-4 pointer-events-none">
               <Search className="text-slate-400" size={18} />
            </div>
         </div>
         <div className="lg:col-span-4 bg-white border border-slate-100 rounded-xl px-6 flex items-center justify-between shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Contacts</p>
            <p className="text-sm font-black text-slate-800">{contacts.length}</p>
         </div>
      </div>

      {/* Contacts Matrix */}
      <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden group">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Related Company</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Job Title</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Details</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned To</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                         <Loader2 className="animate-spin text-[#b66dff] mx-auto mb-4" size={32} />
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Contacts...</p>
                      </td>
                    </tr>
                  ) : filteredContacts.map((con, i) => (
                    <motion.tr 
                      key={con.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        setViewingContact(con);
                        setIsDrawerOpen(true);
                      }}
                      className="hover:bg-slate-50/50 transition-colors group/row cursor-pointer"
                    >
                       <td className="p-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl grad-brand text-white flex items-center justify-center font-black text-sm">{con.firstName.charAt(0)}</div>
                             <div>
                                <h4 className="text-sm font-bold text-slate-800">{con.firstName} {con.lastName}</h4>
                             </div>
                          </div>
                       </td>
                       <td className="p-6 text-xs font-bold text-slate-400 flex items-center gap-2">
                          <Building2 size={12} className="text-[#b66dff]" />
                          {accounts.find(a => a.id === con.accountId)?.name || 'Direct Contact'}
                       </td>
                       <td className="p-6"><span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">{con.designation}</span></td>
                       <td className="p-6 space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><Phone size={12} className="text-slate-300" /> {con.phone}</div>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><Mail size={12} className="text-slate-300" /> {con.email}</div>
                       </td>
                       <td className="p-6 text-xs font-bold text-slate-400">System Admin</td>
                       <td className="p-6">
                          <div className="flex gap-2">
                             <button className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-[#b66dff] hover:bg-purple-50 transition-all"><Edit2 size={16} /></button>
                             <button className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"><MoreHorizontal size={16} /></button>
                          </div>
                       </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <CRMDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        entity={viewingContact as any} 
        type="Contact" 
      />

      <style jsx global>{`
        .user-input { width: 100%; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 1.25rem; padding: 1.25rem; font-size: 0.875rem; font-weight: 700; transition: all 0.3s; outline: none; }
        .user-input:focus { border-color: #b66dff; background: #ffffff; box-shadow: 0 4px 20px rgba(182, 109, 255, 0.08); }
      `}</style>
    </div>
  );
}
