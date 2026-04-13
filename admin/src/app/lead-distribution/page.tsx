"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Upload,
  Search,
  Users,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  X,
  FileSpreadsheet,
  Plus,
  TrendingUp,
  History,
  Info,
  Loader2,
  ChevronRight,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  eventType: string;
  eventDate: string;
  pax: string;
  pincode: string;
  city: string;
  notes?: string;
}

interface DistributionLog {
  $id: string;
  name: string;
  phone: string;
  venueId: string;
  employeeName?: string;
  pincode: string;
  status: string;
  isBulk: boolean;
  distributedAt: string;
  $createdAt: string;
}

export default function LeadDistributionPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "logs">("upload");
  const [pincode, setPincode] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [logs, setLogs] = useState<DistributionLog[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for Manual Entry
  const [manualLead, setManualLead] = useState<Lead>({
    name: "",
    phone: "",
    email: "",
    eventType: "",
    eventDate: "",
    pax: "",
    pincode: "",
    city: ""
  });

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch(`${serverUrl}/users`);
      const result = await res.json();
      if (result.status === "success") {
        const staffRoles = ["Sales Head", "Zonal Sales Head", "State Sales Manager", "Regional Sales Manager", "BDM", "BDE", "Telecaller", "Super Admin"];
        const staff = (result.data || []).filter((u: any) => 
          u.prefs?.role && staffRoles.includes(u.prefs.role)
        );
        setEmployees(staff);
      }
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  }, [serverUrl]);

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await fetch(`${serverUrl}/leads/distribution-logs`);
      const result = await res.json();
      if (result.status === "success") {
        setLogs(result.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLogsLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    fetchEmployees();
    if (activeTab === "logs") {
      fetchLogs();
    }
  }, [activeTab, fetchLogs, fetchEmployees]);

  const handleManualAdd = () => {
    if (!manualLead.name || !manualLead.phone || !manualLead.pincode) {
      setMessage({ type: "error", text: "Name, Phone and Pincode are required" });
      return;
    }
    setLeads([...leads, { ...manualLead, id: Math.random().toString(36).substr(2, 9) }]);
    setManualLead({
      name: "",
      phone: "",
      email: "",
      eventType: "",
      eventDate: "",
      pax: "",
      pincode: manualLead.pincode, // Keep pincode for convenience
      city: manualLead.city
    });
    setMessage({ type: "success", text: "Lead added to list" });
    setTimeout(() => setMessage(null), 3000);
  };

  const removeLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split("\n").map(row => row.split(","));
      
      // Simple CSV parsing (Assuming header: Name, Phone, Email, EventType, EventDate, PAX, Pincode, City)
      const newLeads: Lead[] = rows.slice(1).map(row => ({
        id: Math.random().toString(36).substr(2, 9),
        name: row[0]?.trim() || "",
        phone: row[1]?.trim() || "",
        email: row[2]?.trim() || "",
        eventType: row[3]?.trim() || "",
        eventDate: row[4]?.trim() || "",
        pax: row[5]?.trim() || "",
        pincode: row[6]?.trim() || "",
        city: row[7]?.trim() || ""
      })).filter(l => l.name && l.phone);

      setLeads([...leads, ...newLeads]);
      if (newLeads.length > 0 && !pincode) {
        setPincode(newLeads[0].pincode);
      }
      
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  const distributeLeads = async () => {
    if (leads.length === 0) {
      setMessage({ type: "error", text: "No leads to distribute" });
      return;
    }
    if (!pincode && !selectedEmployeeId) {
      setMessage({ type: "error", text: "Please enter a target pincode or select an employee" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${serverUrl}/leads/distribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          leads, 
          pincode: selectedEmployeeId ? "" : pincode, 
          employeeId: selectedEmployeeId || undefined 
        })
      });

      const result = await res.json();
      if (result.status === "success") {
        setMessage({ type: "success", text: result.message });
        setLeads([]);
        setSelectedEmployeeId("");
      } else {
        setMessage({ type: "error", text: result.message || "Failed to distribute leads" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Connection error. Is the server running?" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
            <Target size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Lead Distribution</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Bulk upload and smart distribution logic</p>
          </div>
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("upload")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === "upload" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Upload Leads
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === "logs" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Distribution Logs
          </button>
        </div>
      </div>

      {activeTab === "upload" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Input & Config */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-4">Configure Distribution</h3>
              
               <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Distribution Pincode</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      disabled={!!selectedEmployeeId}
                      className={cn(
                        "w-full bg-slate-50 border-none rounded-2xl px-4 py-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-purple-500/20 outline-none transition-all",
                        selectedEmployeeId && "opacity-50 cursor-not-allowed"
                      )}
                    />
                  </div>
                </div>

                <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Target Employee (Manual)</label>
                   <div className="relative">
                     <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                     <select 
                       value={selectedEmployeeId}
                       onChange={(e) => {
                         setSelectedEmployeeId(e.target.value);
                         if(e.target.value) setPincode(""); 
                       }}
                       className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-purple-500/20 outline-none transition-all appearance-none cursor-pointer"
                     >
                       <option value="">-- Auto-Assign by Pincode --</option>
                       {employees.map(emp => (
                         <option key={emp.$id} value={emp.$id}>
                           {emp.name} ({emp.prefs?.role || 'Staff'})
                         </option>
                       ))}
                     </select>
                   </div>
                   <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <Info size={10} /> {selectedEmployeeId ? "All leads will go ONLY to this employee." : "Leads will be split among employees assigned to this area."}
                  </p>
                 </div>

                <div className="pt-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all group"
                  >
                    <FileSpreadsheet size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Bulk Upload CSV</span>
                  </button>
                  <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <button 
                  disabled={loading || leads.length === 0}
                  onClick={distributeLeads}
                  className={cn(
                    "w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg transition-all",
                    leads.length > 0 && !loading 
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.02] shadow-indigo-200" 
                      : "bg-slate-200 cursor-not-allowed shadow-none"
                  )}
                >
                  {loading ? (
                    <Loader2  size={20} />
                  ) : (
                    <>
                      <Target size={20} />
                      Distribute {leads.length} Leads
                    </>
                  )}
                </button>
              </div>

              {message && (
                <div className={cn(
                  "p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2",
                  message.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span className="text-xs font-bold">{message.text}</span>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Queue Status</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-4xl font-black">{leads.length}</h3>
                  <p className="text-xs font-bold opacity-80 mb-1.5">Leads ready</p>
                </div>
                <div className="mt-4 flex gap-2 overflow-hidden">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-1.5 w-full bg-white/20 rounded-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: leads.length > 0 ? "100%" : "0%" }}
                        transition={{ delay: i * 0.1 }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>
          </div>

          {/* Right: Lead List & Manual Entry */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Manual Entry Form */}
            <div className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Manual Entry</h3>
                <button 
                  onClick={handleManualAdd}
                  className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                   <input 
                    type="text" placeholder="Customer Name"
                    value={manualLead.name}
                    onChange={(e) => setManualLead({...manualLead, name: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-500/10 outline-none"
                   />
                   <input 
                    type="text" placeholder="Phone Number"
                    value={manualLead.phone}
                    onChange={(e) => setManualLead({...manualLead, phone: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-500/10 outline-none"
                   />
                   <input 
                    type="text" placeholder="Event Type (e.g. Wedding)"
                    value={manualLead.eventType}
                    onChange={(e) => setManualLead({...manualLead, eventType: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-500/10 outline-none"
                   />
                </div>
                <div className="space-y-4">
                  <input 
                    type="date"
                    value={manualLead.eventDate}
                    onChange={(e) => setManualLead({...manualLead, eventDate: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-500/10 outline-none"
                   />
                   <input 
                    type="number" placeholder="Guest Count (PAX)"
                    value={manualLead.pax}
                    onChange={(e) => setManualLead({...manualLead, pax: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-500/10 outline-none"
                   />
                   <div className="grid grid-cols-2 gap-2">
                     <input 
                      type="text" placeholder="Pincode"
                      value={manualLead.pincode}
                      onChange={(e) => setManualLead({...manualLead, pincode: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-500/10 outline-none"
                     />
                     <input 
                      type="text" placeholder="City"
                      value={manualLead.city}
                      onChange={(e) => setManualLead({...manualLead, city: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-500/10 outline-none"
                     />
                   </div>
                </div>
              </div>
            </div>

            {/* Lead Queue Table */}
            <div className="bg-white rounded-3xl border border-slate-50 shadow-sm overflow-hidden min-h-[400px]">
              <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Lead Queue</h3>
                 <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">{leads.length} Pending</span>
              </div>
              
              {leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-300">
                  <Upload size={48} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest opacity-40">No leads in queue</p>
                  <p className="text-[10px] font-medium mt-1">Upload CSV or use manual entry</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Number</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Event Type</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Guest Capacity</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-xs uppercase">
                                {lead.name.charAt(0)}
                              </div>
                              <span className="text-xs font-black text-slate-700">{lead.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-bold text-slate-600">{lead.phone}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-black uppercase tracking-widest">{lead.eventType || "Event"}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-black text-indigo-600">{lead.pax || "0"} PAX</span>
                          </td>
                          <td className="p-4 text-right">
                             <button 
                               onClick={() => lead.id && removeLead(lead.id)}
                               className="p-2 text-slate-200 hover:text-rose-500 transition-colors"
                             >
                               <Trash2 size={16} />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Logs Tab */
        <div className="bg-white rounded-3xl border border-slate-50 shadow-sm overflow-hidden min-h-[600px]">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <History size={18} className="text-indigo-500" />
              Distribution History
            </h3>
            <button 
              onClick={fetchLogs}
              className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
            >
              <RefreshCw size={16} className={cn(logsLoading && "")} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Distribution ID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Lead Detail</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned To (Employee)</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logsLoading ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <Loader2 className=" text-indigo-500 mx-auto mb-4" size={32} />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing with server...</p>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <History size={48} strokeWidth={1} className="mb-4 opacity-10 mx-auto" />
                      <p className="text-sm font-bold uppercase tracking-widest opacity-40">No distribution history found</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.$id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="text-[10px] font-mono font-black text-slate-400">#{log.$id.slice(-8).toUpperCase()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all",
                            "bg-indigo-50 text-indigo-600 shadow-sm"
                          )}>
                            {log.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-700">{log.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{log.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="p-1 px-3 rounded-lg bg-indigo-50 text-[10px] font-black text-indigo-600 uppercase">
                             {log.employeeName || log.venueId || 'Internal Staff'}
                           </div>
                           <ChevronRight size={12} className="text-slate-300" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">BDE Assigned</span>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-tighter flex items-center gap-1">
                          <MapPin size={10} /> AREA: {log.pincode}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-slate-600">
                          {new Date(log.distributedAt || log.$createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </div>
                        <span className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase border border-emerald-100">
                          <CheckCircle2 size={10} />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSS Utilities */}
      <style jsx global>{`
        .grad-purple {
           background: linear-gradient(135deg, #b66dff 0%, #8e44ad 100%);
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
