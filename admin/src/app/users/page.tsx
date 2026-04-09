"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Shield,
  UserCheck,
  UserX,
  Globe,
  Loader2,
  Save,
  Filter,
  Check,
  GitBranch,
  LayoutList,
  ChevronRight,
  ChevronDown,
  X,
  Trash2,
  RefreshCw,
  AlertCircle,
  Key,
  Mail,
  Lock,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────
type SystemRole =
  | "Super Admin"
  | "Sales Head"
  | "Zonal Sales Head"
  | "State Sales Manager"
  | "Regional Sales Manager"
  | "BDM"
  | "BDE"
  | "Telecaller";

interface LiveUser {
  $id: string;
  name: string;
  email: string;
  status: boolean; // Appwrite: true = active, false = blocked
  prefs: {
    role?: string;
    region?: string;
    state?: string;
    city?: string;
    pincode?: string;
    reportingTo?: string;
    moduleAccess?: string; // JSON string
    status?: string;
  };
  registration: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: SystemRole;
  region: string;
  state: string;
  city: string;
  pincode: string;
  reportingTo: string;
  moduleAccess: string[];
}

// ── Constants ─────────────────────────────────────────────────────────────────
const ROLES_LIST: SystemRole[] = [
  "Sales Head",
  "Zonal Sales Head",
  "State Sales Manager",
  "Regional Sales Manager",
  "BDM",
  "BDE",
  "Telecaller",
];

const MODULES = [
  { id: "Dashboard", label: "Intelligence Dashboard" },
  { id: "Venues", label: "Venue Hub" },
  { id: "Users", label: "Identity & Access" },
  { id: "Leads", label: "Lead Matrix" },
  { id: "Billing", label: "Billing & Payments" },
  { id: "Approvals", label: "Listing Approvals" },
];

const REGIONS = ["North", "South", "East", "West", "National"];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
];

const ROLE_COLORS: Record<string, string> = {
  "Super Admin": "bg-rose-600 text-white",
  "Sales Head": "bg-slate-900 text-white",
  "Zonal Sales Head": "bg-purple-100 text-[#b66dff]",
  "State Sales Manager": "bg-blue-50 text-blue-600",
  "Regional Sales Manager": "bg-emerald-50 text-emerald-600",
  "BDM": "bg-amber-50 text-amber-600",
  "BDE": "bg-pink-50 text-pink-600",
  "Telecaller": "bg-slate-50 text-slate-500",
};

// ── Hierarchy Node (recursive) ────────────────────────────────────────────────
function HierarchyNode({ node, allUsers }: { node: any; allUsers: LiveUser[] }) {
  const [open, setOpen] = useState(true);
  const initials = node.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const role = node.prefs?.role || "—";
  const region = node.prefs?.region || node.prefs?.state || "";

  return (
    <div className="ml-8 border-l border-slate-200 pl-8 relative">
      <div className="absolute left-0 top-7 w-8 h-px bg-slate-200" />
      <div className="py-3">
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow inline-flex items-center gap-4 min-w-[280px]">
          <div className="w-10 h-10 rounded-full grad-purple text-white flex items-center justify-center font-black text-xs">
            {initials}
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-slate-800 m-0">{node.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-[9px] font-black uppercase px-1.5 py-0.5 rounded", ROLE_COLORS[role] || "bg-slate-100 text-slate-500")}>
                {role}
              </span>
              {region && <span className="text-[9px] font-bold text-slate-400">({region})</span>}
            </div>
          </div>
          {node.children?.length > 0 && (
            <button onClick={() => setOpen(!open)} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400">
              {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
        </div>
      </div>
      {open && node.children?.length > 0 && (
        <div className="space-y-0">
          {node.children.map((child: any) => (
            <HierarchyNode key={child.$id} node={child} allUsers={allUsers} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function UserRoleManagement() {
  const [users, setUsers] = useState<LiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "hierarchy">("table");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<LiveUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<LiveUser | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState<FormData>({
    name: "", email: "", password: "",
    role: "BDE", region: "", state: "", city: "", pincode: "",
    reportingTo: "", moduleAccess: ["Dashboard"],
  });

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch users ──────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${serverUrl}/users`, { cache: "no-store" });
      const result = await res.json();
      if (result.status === "success") {
        setUsers(result.data || []);
      } else {
        setError(result.message || "Failed to fetch users");
      }
    } catch {
      setError("Cannot connect to server. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Open modal ───────────────────────────────────────────────────────────────
  const openModal = (type: "create" | "edit", user?: LiveUser) => {
    setModalType(type);
    setSelectedUser(user || null);
    if (type === "edit" && user) {
      let mods: string[] = ["Dashboard"];
      try { mods = JSON.parse(user.prefs?.moduleAccess || "[]"); } catch {}
      setForm({
        name: user.name,
        email: user.email,
        password: "",
        role: (user.prefs?.role as SystemRole) || "BDE",
        region: user.prefs?.region || "",
        state: user.prefs?.state || "",
        city: user.prefs?.city || "",
        pincode: user.prefs?.pincode || "",
        reportingTo: user.prefs?.reportingTo || "",
        moduleAccess: mods,
      });
    } else {
      setForm({ name: "", email: "", password: "", role: "BDE", region: "", state: "", city: "", pincode: "", reportingTo: "", moduleAccess: ["Dashboard"] });
    }
    setIsModalOpen(true);
  };

  // ── Save (create or update) ──────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = modalType === "create"
        ? `${serverUrl}/users`
        : `${serverUrl}/users/${selectedUser?.$id}`;

      const body: any = { ...form };
      if (modalType === "edit" && !body.password) delete body.password;

      const res = await fetch(url, {
        method: modalType === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (result.status === "success") {
        setIsModalOpen(false);
        showToast(modalType === "create" ? "✓ User created successfully" : "✓ User updated successfully", "success");
        await fetchUsers();
      } else {
        showToast(result.message || "Operation failed", "error");
      }
    } catch {
      showToast("Server error. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle user status ────────────────────────────────────────────────────────
  const handleToggleStatus = async (user: LiveUser) => {
    setProcessingId(user.$id);
    try {
      const res = await fetch(`${serverUrl}/users/${user.$id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked: user.status }), // true means currently active → block it
      });
      const result = await res.json();
      if (result.status === "success") {
        setUsers(prev => prev.map(u => u.$id === user.$id ? { ...u, status: !u.status } : u));
        showToast(user.status ? "User blocked" : "User activated", user.status ? "error" : "success");
      } else {
        showToast(result.message || "Failed", "error");
      }
    } catch {
      showToast("Server error", "error");
    } finally {
      setProcessingId(null);
    }
  };

  // ── Delete user ───────────────────────────────────────────────────────────────
  const handleDelete = async (user: LiveUser) => {
    setDeleteConfirm(null);
    setProcessingId(user.$id);
    try {
      const res = await fetch(`${serverUrl}/users/${user.$id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.status === "success") {
        setUsers(prev => prev.filter(u => u.$id !== user.$id));
        showToast("✓ User deleted", "success");
      } else {
        showToast(result.message || "Delete failed", "error");
      }
    } catch {
      showToast("Server error", "error");
    } finally {
      setProcessingId(null);
    }
  };

  // ── Hierarchy Builder ─────────────────────────────────────────────────────────
  const buildHierarchy = (parentId: string | null = null): any[] => {
    return users
      .filter(u => {
        const rTo = u.prefs?.reportingTo || "";
        return parentId === null ? !rTo : rTo === parentId;
      })
      .map(u => ({ ...u, children: buildHierarchy(u.$id) }));
  };

  // ── Filter ────────────────────────────────────────────────────────────────────
  const filtered = users.filter(u => {
    const role = u.prefs?.role;
    const isEmployee = role && (ROLES_LIST.includes(role as any) || role === "Super Admin");
    
    // If not an employee, hide them from this specific management portal
    if (!isEmployee) return false;

    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (role || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const reportingUser = (id: string) => users.find(u => u.$id === id);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl text-white text-sm font-bold shadow-2xl flex items-center gap-3",
              toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"
            )}
          >
            {toast.type === "success" ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className="flex gap-3">
          {/* View Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex">
            <button onClick={() => setViewMode("table")} className={cn("px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2", viewMode === "table" ? "bg-white text-[#b66dff] shadow-sm" : "text-slate-400")}>
              <LayoutList size={14} /> Matrix
            </button>
            <button onClick={() => setViewMode("hierarchy")} className={cn("px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2", viewMode === "hierarchy" ? "bg-white text-[#b66dff] shadow-sm" : "text-slate-400")}>
              <GitBranch size={14} /> Hierarchy
            </button>
          </div>

          {/* Refresh */}
          <button onClick={fetchUsers} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#b66dff] hover:border-purple-100 transition-all shadow-sm" title="Refresh">
            <RefreshCw size={18} />
          </button>

          {/* Add User */}
          <button onClick={() => openModal("create")} className="px-5 py-3 grad-brand text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-all flex items-center gap-2 active:scale-95">
            <Plus size={18} /> Add New User
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold shadow-sm outline-none focus:border-[#b66dff] transition-all"
        />
        <Search size={18} className="absolute left-4 text-slate-400" />
        {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-4"><X size={16} className="text-slate-400" /></button>}
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <div className="purple-card overflow-hidden shadow-sm border border-slate-50">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">System User</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Role</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporting To</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Territorial Scope</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={6} className="py-20 text-center"><Loader2 className="animate-spin text-[#b66dff] mx-auto mb-3" size={32} /></td></tr>
                ) : error ? (
                  <tr><td colSpan={6} className="py-16 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 mx-auto flex items-center justify-center text-rose-400 mb-3"><AlertCircle size={24} /></div>
                    <p className="text-sm font-bold text-slate-500 mb-3">{error}</p>
                    <button onClick={fetchUsers} className="px-5 py-2 bg-[#b66dff] text-white rounded-xl text-xs font-bold">Try Again</button>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-20 text-center">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center text-slate-300 mb-3"><Users size={24} /></div>
                    <p className="text-sm font-bold text-slate-400">{searchQuery ? "No users match your search." : "No users yet. Add one to get started."}</p>
                  </td></tr>
                ) : filtered.map((user, i) => {
                  const role = user.prefs?.role || "—";
                  const territory = user.prefs?.region || user.prefs?.state || user.prefs?.city || "National";
                  const manager = user.prefs?.reportingTo ? reportingUser(user.prefs.reportingTo) : null;
                  const isActive = user.status === true;
                  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

                  return (
                    <motion.tr key={user.$id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="group hover:bg-slate-50/60 transition-colors">
                      {/* User */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full grad-brand text-white flex items-center justify-center font-black text-xs shadow-sm">{initials}</div>
                          <div>
                            <p className="text-sm font-black text-slate-800 m-0">{user.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5 flex items-center gap-1"><Mail size={10} />{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-5">
                        <span className={cn("px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest", ROLE_COLORS[role] || "bg-slate-100 text-slate-500")}>{role}</span>
                      </td>

                      {/* Reporting To */}
                      <td className="px-6 py-5">
                        {manager ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-[9px] font-black flex items-center justify-center text-slate-500">{manager.name.charAt(0)}</div>
                            <span className="text-[10px] font-black text-slate-500 uppercase">{manager.name}</span>
                          </div>
                        ) : <span className="text-[10px] italic text-slate-300">Top Level</span>}
                      </td>

                      {/* Territory */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Globe size={12} className="text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{territory}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span className={cn("px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-500 border-rose-100")}>
                          {isActive ? "Active" : "Blocked"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit */}
                          <button onClick={() => openModal("edit", user)} className="p-2.5 rounded-lg text-[#b66dff] bg-purple-50 hover:bg-[#b66dff] hover:text-white border border-purple-100 transition-all">
                            <Edit2 size={15} />
                          </button>

                          {/* Toggle Status */}
                          <button
                            onClick={() => handleToggleStatus(user)}
                            disabled={processingId === user.$id}
                            className={cn("p-2.5 rounded-lg transition-all border", isActive ? "text-rose-500 bg-rose-50 border-rose-100 hover:bg-rose-500 hover:text-white" : "text-emerald-500 bg-emerald-50 border-emerald-100 hover:bg-emerald-500 hover:text-white", "disabled:opacity-50")}
                          >
                            {processingId === user.$id ? <Loader2 size={15} className="animate-spin" /> : isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                          </button>

                          {/* Delete */}
                          <button onClick={() => setDeleteConfirm(user)} className="p-2.5 rounded-lg text-slate-400 bg-slate-50 border border-slate-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          {!loading && !error && filtered.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {filtered.length} of {users.length} users
            </div>
          )}
        </div>
      ) : (
        // ── Hierarchy View ──────────────────────────────────────────────────────
        <div className="bg-white rounded-2xl p-10 border border-slate-100 min-h-[400px] overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-[#b66dff]" size={32} /></div>
          ) : buildHierarchy().length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center text-slate-300 mb-3"><GitBranch size={24} /></div>
              <p className="text-sm font-bold text-slate-400">No hierarchy to display yet.</p>
            </div>
          ) : (
            <div className="inline-block min-w-full">
              {buildHierarchy().map(root => <HierarchyNode key={root.$id} node={root} allUsers={users} />)}
            </div>
          )}
        </div>
      )}

      {/* ── Create/Edit Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ opacity: 0, x: 200 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 200 }} className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white z-[101] shadow-2xl flex flex-col">

              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl grad-brand text-white flex items-center justify-center">
                    {modalType === "create" ? <Plus size={20} /> : <Edit2 size={20} />}
                  </div>
                  <h2 className="text-base font-black text-slate-800 uppercase tracking-widest">
                    {modalType === "create" ? "Add New User" : "Edit User"}
                  </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full">
                  <X size={20} className="text-slate-300" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Basic Info */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Basic Information</p>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name *</label>
                    <input required type="text" placeholder="e.g. Vikram Malhotra" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white border border-slate-100 rounded-xl p-3 text-sm font-semibold outline-none focus:border-[#b66dff] transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address *</label>
                    <input required type="email" placeholder="email@partydial.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      disabled={modalType === "edit"}
                      className="w-full bg-white border border-slate-100 rounded-xl p-3 text-sm font-semibold outline-none focus:border-[#b66dff] transition-all disabled:opacity-50"
                    />
                  </div>
                  {modalType === "create" && (
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1"><Lock size={10} /> Password *</label>
                      <input required type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                        className="w-full bg-white border border-slate-100 rounded-xl p-3 text-sm font-semibold outline-none focus:border-[#b66dff] transition-all" />
                    </div>
                  )}
                </div>

                {/* Role & Hierarchy */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role & Reporting</p>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">System Role</label>
                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as SystemRole })}
                      className="w-full bg-white border border-slate-100 rounded-xl p-3 text-sm font-semibold outline-none focus:border-[#b66dff] transition-all">
                      {ROLES_LIST.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Reporting To</label>
                    <select value={form.reportingTo} onChange={e => setForm({ ...form, reportingTo: e.target.value })}
                      className="w-full bg-white border border-slate-100 rounded-xl p-3 text-sm font-semibold outline-none focus:border-[#b66dff] transition-all">
                      <option value="">No Manager (Top Level)</option>
                      {users.filter(u => u.$id !== selectedUser?.$id).map(u => (
                        <option key={u.$id} value={u.$id}>{u.name} ({u.prefs?.role || "—"})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Territorial Scope */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Territorial Scope</p>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Region</label>
                    <div className="grid grid-cols-5 gap-2">
                      {REGIONS.map(r => (
                        <button key={r} type="button" onClick={() => setForm({ ...form, region: r })}
                          className={cn("py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all", form.region === r ? "grad-brand text-white border-transparent shadow-md" : "bg-white text-slate-400 border-slate-100 hover:border-purple-200")}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">State</label>
                    <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
                      className="w-full bg-white border border-slate-100 rounded-xl p-3 text-sm font-semibold outline-none focus:border-[#b66dff] transition-all">
                      <option value="">Select State (Optional)</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">City</label>
                      <input type="text" placeholder="e.g. Haldwani" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                        className="w-full bg-white border border-slate-100 rounded-xl p-3 text-sm font-semibold outline-none focus:border-[#b66dff] transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Pincode</label>
                      <input type="text" placeholder="6-digit Pin" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })}
                        className="w-full bg-white border border-slate-100 rounded-xl p-3 text-sm font-semibold outline-none focus:border-[#b66dff] transition-all" />
                    </div>
                  </div>
                </div>

                {/* Module Access */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Module Access Permissions</p>
                  <div className="grid grid-cols-2 gap-3">
                    {MODULES.map(mod => {
                      const active = form.moduleAccess.includes(mod.id);
                      return (
                        <button key={mod.id} type="button"
                          onClick={() => setForm({ ...form, moduleAccess: active ? form.moduleAccess.filter(m => m !== mod.id) : [...form.moduleAccess, mod.id] })}
                          className={cn("p-3 rounded-xl border flex items-center justify-between transition-all text-left", active ? "border-[#b66dff] bg-purple-50" : "border-slate-100 bg-white hover:border-purple-200")}
                        >
                          <span className={cn("text-[9px] font-black uppercase tracking-widest", active ? "text-[#b66dff]" : "text-slate-400")}>{mod.label}</span>
                          <div className={cn("w-4 h-4 rounded-sm flex items-center justify-center border", active ? "bg-[#b66dff] border-transparent" : "bg-white border-slate-200")}>
                            {active && <Check size={10} className="text-white" strokeWidth={3} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={saving}
                  className="w-full py-4 grad-brand text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-60">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Saving..." : modalType === "create" ? "Create User" : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[110]" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-[111] flex items-center justify-center p-6">
              <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mx-auto mb-5">
                  <Trash2 size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-800 text-center mb-2">Delete User?</h3>
                <p className="text-sm text-slate-400 text-center mb-6">
                  <strong>{deleteConfirm.name}</strong> will be permanently removed from the system.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl border border-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
                  <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-all">Delete</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
