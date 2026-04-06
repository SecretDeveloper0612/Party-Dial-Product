"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare, 
  Globe, 
  Share2, 
  User, 
  AlertCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  FileText,
  Paperclip,
  CheckCircle2,
  XCircle,
  Loader2,
  Save,
  Zap,
  PhoneCall,
  Layout,
  Edit2,
  Trash2,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { getLeads, getUsers, Lead, User as SystemUser, LeadStatus, LeadPriority, LeadSource, convertLead } from "@/lib/store";
import { cn } from "@/lib/utils";
import CRMDetailDrawer from "@/components/CRMDetailDrawer";

export default function CRMLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [team, setTeam] = useState<SystemUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Lead>>({
    customerName: "",
    email: "",
    phone: "",
    eventType: "Wedding",
    status: "New",
    priority: "Warm",
    source: "Manual",
    ownerId: "",
    city: "",
    notes: [],
    attachments: []
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeads(getLeads());
      setTeam(getUsers());
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (type: "create" | "edit", lead?: Lead) => {
    setModalType(type);
    setSelectedLead(lead || null);
    if (type === "edit" && lead) {
      setFormData({ ...lead });
    } else {
      setFormData({
        customerName: "",
        email: "",
        phone: "",
        eventType: "Wedding",
        status: "New",
        priority: "Warm",
        source: "Manual",
        ownerId: team[0]?.id || "",
        city: "",
        notes: [],
        attachments: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Duplicate Check Logic
    const isDuplicate = leads.some(l => 
        (l.phone === formData.phone || l.email === formData.email) && 
        l.id !== selectedLead?.id
    );

    if (isDuplicate) {
        alert("CRITICAL ALERT: Lead with this phone/email already exists in the infrastructure.");
        return;
    }

    if (modalType === "create") {
      const newLead: Lead = { 
        ...formData as Lead, 
        id: `l${leads.length + 1}`, 
        createdAt: new Date().toISOString() 
      };
      setLeads([newLead, ...leads]);
    } else {
      setLeads(leads.map(l => l.id === selectedLead?.id ? { ...l, ...formData } as Lead : l));
    }
    setIsModalOpen(false);
  };

  const filteredLeads = leads.filter(l => 
    l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.phone.includes(searchQuery) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* CRM Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
               <Target size={28} />
            </div>
             <div>
                <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Sales Leads</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">Manage your customer targets and sales inquiries</p>
             </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-white px-5 py-3 rounded-2xl border border-slate-100 items-center gap-6 shadow-sm">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400">Yield</span>
                  <span className="text-xs font-black text-emerald-500">+12%</span>
               </div>
               <div className="w-[1px] h-6 bg-slate-100" />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400">Total Leads</span>
                  <span className="text-xs font-black text-slate-800">{leads.length}</span>
               </div>
            </div>
            <button onClick={() => handleAction("create")} className="px-6 py-4 grad-purple text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
               <Plus size={18} /> <span>Add New Lead</span>
            </button>
         </div>
      </div>

      {/* Leads Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         <div className="lg:col-span-7 relative group flex items-center">
            <input 
              type="text" 
              placeholder="Search leads by name, phone or email identifier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="user-input pr-12 pl-4 shadow-sm"
            />
            <div className="absolute right-4 pointer-events-none">
               <Search className="text-slate-400" size={18} />
            </div>
         </div>
         <div className="lg:col-span-5 flex gap-4">
            <button className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
               <Filter size={18} /> <span>Filter Logistics</span>
            </button>
            <div className="flex bg-slate-100 p-1 rounded-xl">
               <button className="px-5 rounded-lg bg-white text-[#b66dff] shadow-sm text-xs font-black uppercase tracking-widest"><Layout size={14} /></button>
               <button className="px-5 rounded-lg text-slate-400 text-xs font-black uppercase tracking-widest"><TrendingUp size={14} /></button>
            </div>
         </div>
      </div>

      {/* Leads Table Infrastructure */}
      <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden group">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Name</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Lead Source</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned To</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                         <Loader2 className="animate-spin text-[#b66dff] mx-auto mb-4" size={32} />
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Lead Matrix...</p>
                      </td>
                    </tr>
                  ) : filteredLeads.map((lead, i) => (
                    <motion.tr 
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        setViewingLead(lead);
                        setIsDrawerOpen(true);
                      }}
                      className="hover:bg-slate-50/50 transition-colors group/row cursor-pointer"
                    >
                       <td className="p-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl grad-brand text-white flex items-center justify-center font-black text-sm">{lead.customerName.charAt(0)}</div>
                             <div>
                                <h4 className="text-sm font-bold text-slate-800">{lead.customerName}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                   <span className="text-[10px] text-slate-400 flex items-center gap-1"><Phone size={10} /> {lead.phone}</span>
                                   <span className="text-[10px] text-slate-400 flex items-center gap-1"><Mail size={10} /> {lead.email}</span>
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="p-6">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 w-fit">
                             {lead.source === 'WhatsApp' ? <MessageSquare size={12} className="text-emerald-500" /> : 
                              lead.source === 'Website' ? <Globe size={12} className="text-blue-500" /> : 
                              lead.source === 'Direct Call' ? <PhoneCall size={12} className="text-orange-500" /> : <Share2 size={12} />}
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{lead.source}</span>
                          </div>
                       </td>
                       <td className="p-6">
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                            lead.status === 'New' ? "bg-blue-50 text-blue-600 border-blue-100" :
                            lead.status === 'Won' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            lead.status === 'Lost' ? "bg-rose-50 text-rose-600 border-rose-100" :
                            lead.status === 'Qualified' ? "bg-purple-50 text-purple-600 border-purple-100" :
                            "bg-slate-50 text-slate-500 border-slate-100"
                          )}>{lead.status}</span>
                       </td>
                       <td className="p-6">
                          <div className={cn(
                            "flex items-center gap-2 font-black text-[10px] uppercase tracking-widest",
                            lead.priority === 'Urgent' ? "text-rose-500" : 
                            lead.priority === 'Hot' ? "text-orange-500" : "text-slate-400"
                          )}>
                             <Zap size={14} className={lead.priority === 'Urgent' ? 'fill-rose-500' : ''} />
                             {lead.priority}
                          </div>
                       </td>
                       <td className="p-6 text-sm font-bold text-slate-600">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-purple-100 text-[#b66dff] flex items-center justify-center text-[10px]"><User size={12} /></div>
                             <span className="text-xs uppercase tracking-tighter">{team.find(u => u.id === lead.ownerId)?.name || 'Unassigned'}</span>
                          </div>
                       </td>
                       <td className="p-6">
                          <div className="flex items-center gap-2 justify-end opacity-0 group-hover/row:opacity-100 transition-opacity">
                             <button 
                               onClick={() => {
                                 const res = convertLead(lead);
                                 alert(`SUCCESS: ${lead.customerName} has been converted into a structured Account, Contact, and Opportunity Deal!`);
                                 setLeads(leads.filter(l => l.id !== lead.id));
                               }}
                               className="px-4 py-2 rounded-xl bg-purple-50 text-[#b66dff] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#b66dff] hover:text-white transition-all shadow-sm"
                             >
                                <Sparkles size={14} /> <span>Convert to Deal</span>
                             </button>
                             <button onClick={() => handleAction("edit", lead)} className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-300 hover:text-[#b66dff]"><MoreHorizontal size={20} /></button>
                          </div>
                       </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* CRM Interaction Modal */}
      <AnimatePresence>
         {isModalOpen && (
            <>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]" />
               <motion.div initial={{ opacity: 0, x: 200 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 200 }} className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white z-[101] shadow-2xl flex flex-col p-10 overflow-y-auto">
                  
                  <div className="flex items-center justify-between mb-12">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#b66dff] flex items-center justify-center">
                           <Target size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{modalType === 'create' ? 'Onboard New Lead' : 'Edit Lead Hub'}</h2>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-600"><XCircle size={24} /></button>
                  </div>

                  <form onSubmit={handleSave} className="space-y-8">
                     <div className="space-y-2">
                        <label className="label">Contact Identity</label>
                        <input required className="user-input" placeholder="Full Name" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2"><label className="label">Contact Phone</label><input required className="user-input" placeholder="+91..." value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                        <div className="space-y-2"><label className="label">Access Email</label><input required className="user-input" placeholder="id@domain.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="label">Lead Lifecycle Phase</label>
                           <select className="user-input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})}>
                              {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'].map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="label">Mission Priority</label>
                           <select className="user-input" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value as any})}>
                              {['Hot', 'Warm', 'Cold', 'Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                           </select>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="label">Source Attribution</label>
                           <select className="user-input" value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value as any})}>
                              {['Manual', 'Website', 'WhatsApp', 'Facebook', 'Google', 'Direct Call'].map(src => <option key={src} value={src}>{src}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="label">Personnel Assignment</label>
                           <select className="user-input" value={formData.ownerId} onChange={(e) => setFormData({...formData, ownerId: e.target.value as any})}>
                              {team.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                           </select>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="label">Add Notes</label>
                        <textarea className="user-input min-h-[140px] resize-none" placeholder="Important details about this lead..." value={formData.notes?.[0] || ''} onChange={(e) => setFormData({...formData, notes: [e.target.value]})} />
                     </div>

                     <div className="space-y-4">
                        <label className="label">System Attachments</label>
                        <div className="border-2 border-dashed border-slate-100 rounded-[1.5rem] p-10 flex flex-col items-center gap-3 group cursor-pointer hover:border-[#b66dff]/30 hover:bg-purple-50/30 transition-all">
                           <Paperclip size={24} className="text-slate-300 group-hover:text-[#b66dff]" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Click or Drag Dossier Assets</span>
                        </div>
                     </div>

                     <div className="pt-10">
                        <button type="submit" className="w-full py-5 grad-purple text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3">
                           <Save size={18} /> {modalType === 'create' ? 'Add New Lead' : 'Save Changes'}
                        </button>
                     </div>

                  </form>
               </motion.div>
            </>
         )}
      </AnimatePresence>

      <CRMDetailDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        entity={viewingLead}
        type="Lead"
      />

      <style jsx global>{`
        .user-input { width: 100%; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 1.25rem; padding: 1.25rem; font-size: 0.875rem; font-weight: 700; transition: all 0.3s; outline: none; }
        .user-input:focus { border-color: #b66dff; background: #ffffff; box-shadow: 0 4px 20px rgba(182, 109, 255, 0.08); }
        .label { display: block; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #94a3b8; margin-bottom: 0.75rem; padding-left: 0.5rem; }
      `}</style>
    </div>
  );
}
