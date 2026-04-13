"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Upload,
  Search,
  Building2,
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
  Trash2,
  Link2
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
  venueName?: string;
  pincode: string;
  status: string;
  isBulk: boolean;
  distributedAt: string;
  $createdAt: string;
  notes?: string;
}

export default function LeadDistributionVenuesPage() {
  const [activeTab, setActiveTab] = useState<"gsync" | "logs">("gsync");
  const [pincodeFilter, setPincodeFilter] = useState("");
  const [sheetUrl, setSheetUrl] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [logs, setLogs] = useState<DistributionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await fetch(`${serverUrl}/leads/distribution-logs`);
      const result = await res.json();
      if (result.status === "success") {
        // Filter logs to show only those distributed to venues or marked as GSheet Sync
        const venueLogs = (result.data || []).filter((l: any) => 
            l.venueId !== "BROADCAST" || l.notes?.includes("GSheet")
        );
        setLogs(venueLogs);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLogsLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    if (activeTab === "logs") {
      fetchLogs();
    }
  }, [activeTab, fetchLogs]);

  const handleSyncGSheet = async () => {
    if (!sheetUrl) {
      setMessage({ type: "error", text: "Please enter a Google Sheet URL or ID" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${serverUrl}/leads/sync-gsheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sheetUrl,
          pincodeFilter: pincodeFilter || undefined
        })
      });

      const result = await res.json();
      if (result.status === "success") {
        setMessage({ type: "success", text: result.message });
        setLeads([]); // Clear any manual leads
        if (activeTab === "logs") fetchLogs();
      } else {
        setMessage({ type: "error", text: result.message || "Failed to sync leads" });
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
            <Building2 size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Lead Distribution (Venues)</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Automated Google Sheets to Venue distribution</p>
          </div>
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("gsync")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === "gsync" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Google Sheet Sync
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === "logs" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Distribution Logs
          </button>
        </div>
      </div>

      {activeTab === "gsync" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Input & Config */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-4">G-Sheet Configuration</h3>
              
               <div className="space-y-4">
                <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Google Sheet URL / ID</label>
                   <div className="relative">
                     <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                     <input 
                       type="text" 
                       placeholder="Paste Sheet URL here"
                       value={sheetUrl}
                       onChange={(e) => setSheetUrl(e.target.value)}
                       className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                     />
                   </div>
                   <p className="text-[10px] text-slate-400 mt-2">
                     <strong>Important:</strong> For best results, use <strong>File &rarr; Share &rarr; Publish to web</strong>, select <strong>CSV</strong>, and paste that link here. Standard sharing links may require login and fail.
                   </p>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Filter by Pincode (Optional)</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      placeholder="e.g. 263139"
                      value={pincodeFilter}
                      onChange={(e) => setPincodeFilter(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <Info size={10} /> If empty, all leads from the sheet will be processed.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <button 
                  disabled={loading || !sheetUrl}
                  onClick={handleSyncGSheet}
                  className={cn(
                    "w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg transition-all",
                    sheetUrl && !loading 
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-[1.02] shadow-emerald-200" 
                      : "bg-slate-200 cursor-not-allowed shadow-none"
                  )}
                >
                  {loading ? (
                    <Loader2  size={20} />
                  ) : (
                    <>
                      <RefreshCw size={20} />
                      Sync & Distribute Now
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

            {/* Distribution Rules */}
            <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Active Rules</p>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span>Match by Pincode</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span>Skip Free Plan Venues</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span>Equal Round-Robin Distribution</span>
                    </div>
                </div>
              </div>
              <Target className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>
          </div>

          {/* Right: Info & Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-50 shadow-sm">
                <h3 className="text-lg font-black text-slate-800 mb-4">How it works</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">1</div>
                        <h4 className="font-bold text-slate-700">Connect Google Sheet</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Paste your Google Sheet URL. Ensure the headers match our template (Lead Name, Phone, Pincode, etc.).
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">2</div>
                        <h4 className="font-bold text-slate-700">Automatic Filtering</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            The system reads each lead's pincode and finds venues registered with the exact same pincode.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">3</div>
                        <h4 className="font-bold text-slate-700">Fair Distribution</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Leads are distributed one-by-one to matching venues. If multiple venues match, they get leads in sequence.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">4</div>
                        <h4 className="font-bold text-slate-700">Paid Venues Only</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            System automatically skips venues on the 'Free' plan. Only active, paid partners receive these Leads.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl">
                <div className="flex gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-emerald-600">
                        <Info size={24} />
                    </div>
                    <div>
                        <h4 className="font-black text-emerald-800 text-sm uppercase tracking-wider">Pro Tip: Auto-Sync</h4>
                        <p className="text-xs text-emerald-700 mt-1 font-medium leading-relaxed">
                            You can trigger a manual sync anytime. The system is also being configured to automatically poll this sheet every 5 minutes to keep your venues stocked with fresh leads!
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      ) : (
        /* Logs Tab */
        <div className="bg-white rounded-3xl border border-slate-50 shadow-sm overflow-hidden min-h-[600px]">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <History size={18} className="text-emerald-500" />
              Venue Distribution History
            </h3>
            <button 
              onClick={fetchLogs}
              className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 transition-all shadow-sm"
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
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Distributed To (Venue)</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logsLoading ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <Loader2 className=" text-emerald-500 mx-auto mb-4" size={32} />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing logs...</p>
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
                            "bg-emerald-50 text-emerald-600 shadow-sm"
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
                           <div className="p-1 px-3 rounded-lg bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase">
                             {log.venueId === 'BROADCAST' ? 'BROADCAST' : (log.notes?.split('|').pop()?.replace('Distributed to ', '')?.trim() || 'Partner Assigned')}
                           </div>
                           <ChevronRight size={12} className="text-slate-300" />
                           <span className={cn(
                               "text-[10px] font-black uppercase tracking-widest italic font-mono",
                               log.venueId === 'BROADCAST' ? "text-rose-500" : "text-emerald-500"
                           )}>
                             {log.venueId === 'BROADCAST' ? 'NO MATCH FOUND' : 'SUCCESS / DISTRIBUTED'}
                           </span>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-tighter flex items-center gap-1">
                          <MapPin size={10} /> PINCODE: {log.pincode || log.notes?.match(/Pin:?\s*(\d{6})/)?.[1] || log.notes?.match(/Pincode:?\s*(\d{6})/)?.[1] || 'N/A'}
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
                          {log.status || 'Success'}
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
