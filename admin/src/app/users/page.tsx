"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  CheckCircle2, 
  XCircle,
  Shield,
  Mail,
  UserCheck,
  UserX,
  Key,
  LogOut,
  Globe,
  MapPin,
  Lock,
  Loader2,
  Save,
  Filter,
  Check,
  GitGraph,
  ChevronRight,
  ChevronDown,
  LayoutList,
  GitBranch
} from "lucide-react";
import { getUsers, User, SystemRole } from "@/lib/store";
import { cn } from "@/lib/utils";

const ROLES_LIST: SystemRole[] = [
  'Sales Head', 
  'Zonal Sales Head', 
  'State Sales Manager', 
  'Regional Sales Manager', 
  'BDM', 
  'BDE', 
  'Telecaller'
];

const MODULES = [
  { id: 'Dashboard', label: 'Intelligence Dashboard' },
  { id: 'Venues', label: 'Venue Hub' },
  { id: 'Users', label: 'Identity & Access' },
  { id: 'Leads', label: 'Lead Matrix Pipeline' }
];

const REGIONS = ["North", "South", "East", "West"];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Delhi"
];

export default function UserRoleManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "hierarchy">("table");

  // Form State
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "BDE",
    status: "Active",
    moduleAccess: ["Dashboard"],
    region: "",
    state: "",
    city: "",
    districts: [],
    reportingTo: ""
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(getUsers());
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (type: "create" | "edit", user?: User) => {
    setModalType(type);
    setSelectedUser(user || null);
    if (type === "edit" && user) {
      setFormData({ ...user });
    } else {
      setFormData({
        name: "", email: "", role: "BDE", status: "Active", moduleAccess: ["Dashboard"],
        region: "", state: "", city: "", districts: [], reportingTo: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "create") {
      const newUser: User = { ...formData as User, id: `u${users.length + 1}`, lastLogin: "Never" };
      setUsers([newUser, ...users]);
    } else if (modalType === "edit" && selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } as User : u));
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string, current: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: current === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  // Hierarchy Tree Logic
  const buildHierarchy = (parentId: string | null = null): any[] => {
    return users
      .filter(u => u.reportingTo === parentId || (!u.reportingTo && parentId === null && u.role === 'Super Admin' || u.role === 'Sales Head' && parentId === null))
      .map(user => ({
        ...user,
        children: users.filter(child => child.reportingTo === user.id).length > 0 ? buildHierarchy(user.id) : []
      }));
  };

  const HierarchyNode = ({ node, level = 0 }: { node: any, level?: number }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div className="ml-8 border-l border-slate-100 pl-8 relative">
        <div className="absolute left-0 top-6 w-8 h-[1px] bg-slate-100" />
        <div className="py-3">
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow inline-flex items-center gap-4 min-w-[300px]">
             <div className="w-10 h-10 rounded-full grad-purple text-white flex items-center justify-center font-black text-xs">
                {node.name.split(' ').map((n: string) => n[0]).join('')}
             </div>
             <div className="flex-1">
                <p className="text-sm font-black text-slate-800 m-0">{node.name}</p>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[9px] font-black uppercase text-[#b66dff] bg-purple-50 px-1.5 py-0.5 rounded leading-none">{node.role}</span>
                   {node.region && <span className="text-[9px] font-black text-slate-400 uppercase">({node.region})</span>}
                </div>
             </div>
             {node.children.length > 0 && (
               <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400">
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
               </button>
             )}
          </div>
        </div>
        {isOpen && node.children.length > 0 && (
          <div className="space-y-2">
            {node.children.map((child: any) => <HierarchyNode key={child.id} node={child} level={level + 1} />)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl grad-brand flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
               <Shield size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-black text-slate-800 m-0">User & Access Management</h1>
               <p className="text-sm text-slate-400 font-medium mt-1">Manage team roles, hierarchy, and system access</p>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="bg-slate-100 p-1 rounded-xl flex">
               <button onClick={() => setViewMode('table')} className={cn("px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2", viewMode === 'table' ? "bg-white text-[#b66dff] shadow-sm" : "text-slate-400")}>
                  <LayoutList size={14} /> Matrix
               </button>
               <button onClick={() => setViewMode('hierarchy')} className={cn("px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2", viewMode === 'hierarchy' ? "bg-white text-[#b66dff] shadow-sm" : "text-slate-400")}>
                  <GitBranch size={14} /> Hierarchy
               </button>
            </div>
            <button onClick={() => handleAction("create")} className="px-6 py-3 grad-brand text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-all flex items-center gap-2 active:scale-95">
               <Plus size={18} /> <span>Add New User</span>
            </button>
         </div>
      </div>

      {viewMode === 'table' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
             <div className="lg:col-span-8 relative group flex items-center">
                <input 
                  type="text" 
                  placeholder="Search by venue name, business, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-100 rounded-xl py-4 pr-12 pl-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#b66dff]/20 focus:border-[#b66dff] transition-all shadow-sm"
                />
                <div className="absolute right-4 pointer-events-none">
                   <Search className="text-slate-400 group-focus-within:text-[#b66dff] transition-colors" size={18} />
                </div>
             </div>
             <div className="lg:col-span-4 flex gap-4">
                <button className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                   <Filter size={18} /> <span>All Users</span>
                </button>
                <button className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                   <GitGraph size={18} /> <span>View Hierarchy</span>
                </button>
             </div>
          </div>

          <div className="purple-card overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-50">
             <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                   <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                         <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">System User</th>
                         <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Role</th>
                         <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Reporting To</th>
                         <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Territorial Scope</th>
                         <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {loading ? (
                        <tr><td colSpan={5} className="px-8 py-20 text-center"><Loader2 className="animate-spin text-[#b66dff] mx-auto" size={32} /></td></tr>
                      ) : (users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase().trim())).map((user) => (
                        <motion.tr key={user.id} layout className="group hover:bg-slate-50/80 transition-colors">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full grad-brand text-white flex items-center justify-center font-black text-xs shadow-lg shadow-purple-500/10">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-800 m-0">{user.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 mt-1">{user.email}</p>
                               </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className={cn("px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest", user.role === 'Sales Head' || user.role === 'Super Admin' ? 'bg-slate-900 text-white' : 'bg-purple-100 text-[#b66dff]')}>{user.role}</span>
                           </td>
                           <td className="px-8 py-6">
                              {user.reportingTo ? (
                                <div className="flex items-center gap-2">
                                   <div className="w-6 h-6 rounded-full bg-slate-100 text-[8px] font-black flex items-center justify-center">{users.find(u => u.id === user.reportingTo)?.name.charAt(0)}</div>
                                   <span className="text-[10px] font-black text-slate-500 uppercase">{users.find(u => u.id === user.reportingTo)?.name}</span>
                                </div>
                              ) : <span className="text-[10px] italic text-slate-300">Top Level</span>}
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                 <Globe size={12} className="text-slate-400" />
                                 <span className="text-[10px] font-bold text-slate-500 uppercase">{user.region || user.state || user.city || 'National'}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button onClick={() => handleAction("edit", user)} className="p-2.5 rounded-lg text-[#b66dff] bg-purple-50 hover:bg-[#b66dff] hover:text-white border border-purple-100 transition-all shadow-sm"><Edit2 size={16} /></button>
                             <button onClick={() => toggleStatus(user.id, user.status)} className={cn("p-2.5 rounded-lg transition-all border shadow-sm", user.status === 'Active' ? "text-rose-500 bg-rose-50 border-rose-100 hover:bg-rose-500 hover:text-white" : "text-emerald-500 bg-emerald-50 border-emerald-100 hover:bg-emerald-500 hover:text-white")}>
                                {user.status === 'Active' ? <UserX size={16} /> : <UserCheck size={16} />}
                             </button>
                          </div>
                       </td>
                        </motion.tr>
                      )))}
                   </tbody>
                </table>
             </div>
          </div>
        </>
      ) : (
        <div className="bg-slate-50/50 p-12 rounded-[2.5rem] min-h-[600px] border border-slate-100 overflow-x-auto">
           <div className="inline-block min-w-full">
              {buildHierarchy().map(root => <HierarchyNode key={root.id} node={root} />)}
           </div>
        </div>
      )}

      {/* Deployment Modal */}
      <AnimatePresence>
         {isModalOpen && (
            <>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" />
               <motion.div initial={{ opacity: 0, x: 200 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 200 }} className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white z-[101] shadow-2xl flex flex-col">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl grad-brand text-white flex items-center justify-center">
                           {modalType === 'create' ? <Plus size={20} /> : <Edit2 size={20} />}
                        </div>
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">{modalType === 'create' ? 'Add New User' : 'Edit User Profile'}</h2>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><XCircle size={24} className="text-slate-300" /></button>
                  </div>

                  <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                     <div className="space-y-6">
                        <div className="space-y-2"><label className="label">Full Name</label><input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="user-input" /></div>
                        <div className="space-y-2"><label className="label">Email Address</label><input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="user-input" /></div>
                     </div>

                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                        {/* Hierarchical Scope Logic */}
                        {(formData.role === 'Zonal Sales Head' || formData.role === 'Regional Sales Manager') && (
                           <div className="space-y-4 animate-in slide-in-from-top-2">
                              <label className="label">Assign Geographical Zone</label>
                               <div className="grid grid-cols-4 gap-2">
                                  {REGIONS.map(reg => (
                                     <button key={reg} type="button" onClick={() => setFormData({...formData, region: reg})} className={cn("py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all", formData.region === reg ? "grad-brand text-white border-transparent shadow-lg" : "bg-slate-50 text-slate-400 border-slate-100 hover:border-purple-200")}>{reg}</button>
                                  ))}
                               </div>
                           </div>
                        )}

                        {formData.role === 'State Sales Manager' && (
                           <div className="space-y-4 animate-in slide-in-from-top-2">
                              <label className="label">Assign State Ownership</label>
                              <select 
                                value={formData.state || ''} 
                                onChange={(e) => setFormData({...formData, state: e.target.value})} 
                                className="user-input appearance-none bg-no-repeat bg-[right_1rem_center]"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' %3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                              >
                                 <option value="">Select Operational State...</option>
                                 {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                           </div>
                        )}
                           <label className="label">System Role</label>
                           <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as any})} className="user-input">
                              {ROLES_LIST.map(r => <option key={r} value={r}>{r}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="label">Reporting Manager</label>
                           <select value={formData.reportingTo} onChange={(e) => setFormData({...formData, reportingTo: e.target.value})} className="user-input">
                              <option value="">No Manager (Top Node)</option>
                              {users.filter(u => u.id !== selectedUser?.id).map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                           </select>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <label className="label">Module Access Permissions</label>
                        <div className="grid grid-cols-2 gap-4">
                           {MODULES.map(mod => (
                              <button key={mod.id} type="button" onClick={() => {
                                 const current = formData.moduleAccess || [];
                                 setFormData({...formData, moduleAccess: current.includes(mod.id) ? current.filter(m => m !== mod.id) : [...current, mod.id]});
                              }} className={cn("p-4 rounded-xl border flex items-center justify-between transition-all", formData.moduleAccess?.includes(mod.id) ? "border-[#b66dff] bg-purple-50/20" : "border-slate-100 bg-slate-50")}>
                                 <span className={cn("text-[9px] font-black uppercase tracking-widest", formData.moduleAccess?.includes(mod.id) ? "text-[#b66dff]" : "text-slate-400")}>{mod.label}</span>
                                 <div className={cn("w-4 h-4 rounded-sm flex items-center justify-center border transition-all", formData.moduleAccess?.includes(mod.id) ? "bg-[#b66dff] border-transparent" : "bg-white border-slate-200 shadow-inner")}>
                                    {formData.moduleAccess?.includes(mod.id) && <Check size={10} className="text-white" strokeWidth={3} />}
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="pt-10">
                        <button type="submit" className="w-full py-4 grad-brand text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/10 hover:scale-[1.01] transition-all flex items-center justify-center gap-3">
                           <Save size={16} /> Save User Profile
                        </button>
                     </div>
                  </form>
               </motion.div>
            </>
         )}
      </AnimatePresence>

      <style jsx global>{`
        .user-input {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 0.75rem;
          padding: 1rem;
          font-size: 0.875rem;
          font-weight: 700;
          transition: all 0.3s;
          outline: none;
        }
        .user-input:focus {
          border-color: #9d50bb;
          background: #ffffff;
        }
        .label {
          display: block;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94a3b8;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
