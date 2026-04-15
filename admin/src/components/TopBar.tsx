"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  Search,
  Mail,
  Power,
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Building2,
  Clock,
  Loader2,
  LogOut,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  type: "approval" | "payment" | "signup" | "alert";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  approval: <AlertTriangle size={14} className="text-amber-500" />,
  payment: <CreditCard size={14} className="text-[#b66dff]" />,
  signup: <Building2 size={14} className="text-blue-500" />,
  alert: <AlertTriangle size={14} className="text-rose-500" />,
};

const TYPE_BG: Record<string, string> = {
  approval: "bg-amber-50",
  payment: "bg-purple-50",
  signup: "bg-blue-50",
  alert: "bg-rose-50",
};

export default function TopBar({ onMenuOpen }: { onMenuOpen?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const [bellOpen, setBellOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [user, setUser] = useState<any>(null);

  const bellRef = useRef<HTMLDivElement>(null);
  const mailRef = useRef<HTMLDivElement>(null);
  const logoutRef = useRef<HTMLDivElement>(null);

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  // ── Session ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const sessionStr = localStorage.getItem("party_admin_session");
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setUser(session.user);
      } catch (e) {
        console.error("TopBar session parse error", e);
      }
    }
  }, []);

  // ── Close dropdowns on outside click ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
      if (mailRef.current && !mailRef.current.contains(e.target as Node)) setMailOpen(false);
      if (logoutRef.current && !logoutRef.current.contains(e.target as Node)) setLogoutOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Fetch live notifications from server (venues needing attention) ──────────
  const fetchNotifications = useCallback(async () => {
    setLoadingNotifs(true);
    try {
      const res = await fetch(`${serverUrl}/venues`, { cache: "no-store" });
      const result = await res.json();
      if (result.status === "success") {
        const venues: any[] = result.data || [];
        const notifs: Notification[] = [];

        // Pending approval alerts
        venues
          .filter((v) => !v.isVerified && v.status !== "rejected" && v.onboardingComplete)
          .slice(0, 5)
          .forEach((v) => {
            notifs.push({
              id: `approval-${v.$id}`,
              type: "approval",
              title: "Pending Approval",
              body: `${v.venueName || "A venue"} in ${v.city || "—"} is awaiting verification.`,
              time: v.$updatedAt || v.$createdAt || new Date().toISOString(),
              read: false,
            });
          });

        // Payment notifications for subscribed venues
        venues
          .filter((v) => v.subscriptionPlan && v.subscriptionPlan !== "None")
          .slice(0, 3)
          .forEach((v) => {
            notifs.push({
              id: `payment-${v.$id}`,
              type: "payment",
              title: "Subscription Active",
              body: `${v.venueName || "Venue"} subscribed to ${v.subscriptionPlan} plan.`,
              time: v.$updatedAt || v.$createdAt || new Date().toISOString(),
              read: true,
            });
          });

        // New registrations
        venues
          .filter((v) => !v.onboardingComplete)
          .slice(0, 3)
          .forEach((v) => {
            notifs.push({
              id: `signup-${v.$id}`,
              type: "signup",
              title: "New Registration",
              body: `${v.venueName || "New venue"} registered — onboarding pending.`,
              time: v.$createdAt || new Date().toISOString(),
              read: true,
            });
          });

        // Sort newest first
        notifs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setNotifications(notifs.slice(0, 10));
      }
    } catch {
      // Silent fail — server might not be ready
    } finally {
      setLoadingNotifs(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ── Appwrite Realtime for instant bell updates ───────────────────────────────
  useEffect(() => {
    let unsub: (() => void) | null = null;
    const setup = async () => {
      try {
        const { client, DATABASE_ID, VENUES_COLLECTION_ID } = await import("@/lib/appwrite");
        const channel = `databases.${DATABASE_ID}.collections.${VENUES_COLLECTION_ID}.documents`;
        unsub = client.subscribe(channel, (response: any) => {
          const doc = response.payload as any;
          const events: string[] = response.events || [];

          if (events.some((e) => e.includes(".create"))) {
            const n: Notification = {
              id: `signup-rt-${doc.$id}-${Date.now()}`,
              type: "signup",
              title: "New Venue Registered",
              body: `${doc.venueName || "A new venue"} just registered on PartyDial.`,
              time: new Date().toISOString(),
              read: false,
            };
            setNotifications((prev) => [n, ...prev].slice(0, 10));
          } else if (events.some((e) => e.includes(".update"))) {
            if (doc.subscriptionPlan && doc.subscriptionPlan !== "None") {
              const n: Notification = {
                id: `payment-rt-${doc.$id}-${Date.now()}`,
                type: "payment",
                title: "Subscription Payment",
                body: `${doc.venueName || "Venue"} subscribed to ${doc.subscriptionPlan}.`,
                time: new Date().toISOString(),
                read: false,
              };
              setNotifications((prev) => [n, ...prev].slice(0, 10));
            } else if (doc.isVerified) {
              const n: Notification = {
                id: `approved-rt-${doc.$id}-${Date.now()}`,
                type: "signup",
                title: "Venue Approved",
                body: `${doc.venueName || "A venue"} has been verified and activated.`,
                time: new Date().toISOString(),
                read: false,
              };
              setNotifications((prev) => [n, ...prev].slice(0, 10));
            }
          }
        });
      } catch (err) {
        console.warn("TopBar realtime failed:", err);
      }
    };
    setup();
    return () => { if (unsub) unsub(); };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  // ── Logout ───────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("party_admin_session");
    router.push("/login");
  };

  if (pathname === "/login") return null;

  // Mail messages are derived from approval-type notifications
  const mailMessages = notifications.filter((n) => n.type === "approval" || n.type === "alert");
  const unreadMail = mailMessages.filter((n) => !n.read).length;

  const initials = user?.name ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "A";

  return (
    <header className="h-[var(--header-h)] border-b border-slate-100 bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50 shadow-sm">
      {/* Left: Hamburger (mobile) */}
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-all mr-2"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="flex items-center gap-8">
        {/* Admin Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
          <ShieldCheck size={14} className="text-[#b66dff]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            {user?.prefs?.role || "System User"}
          </span>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2 sm:gap-5 text-slate-400">

          {/* ── Mail Button ─────────────────────────────────────────────────── */}
          <div ref={mailRef} className="relative">
            <button
              onClick={() => { setMailOpen(!mailOpen); setBellOpen(false); setLogoutOpen(false); }}
              className="relative p-2 hover:text-[#b66dff] hover:bg-purple-50 rounded-xl transition-all bg-transparent border-none cursor-pointer group"
            >
              <Mail size={18} />
              {unreadMail > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 grad-purple rounded-full border-2 border-white flex items-center justify-center text-[7px] text-white font-black">
                  {unreadMail > 9 ? "9+" : unreadMail}
                </div>
              )}
            </button>

            <AnimatePresence>
              {mailOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden z-[200]"
                >
                  <div className="flex items-center justify-between p-4 border-b border-slate-50">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Action Alerts</h3>
                    <button onClick={() => setMailOpen(false)} className="text-slate-300 hover:text-slate-500"><X size={14} /></button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {loadingNotifs ? (
                      <div className="py-8 flex justify-center"><Loader2 size={20} className="animate-spin text-[#b66dff]" /></div>
                    ) : mailMessages.length === 0 ? (
                      <div className="py-8 text-center">
                        <CheckCircle2 size={28} className="mx-auto text-emerald-300 mb-2" />
                        <p className="text-xs font-bold text-slate-400">No pending alerts</p>
                      </div>
                    ) : mailMessages.map((m) => (
                      <div key={m.id} className={cn("p-4 hover:bg-slate-50 transition-colors cursor-pointer", !m.read && "bg-purple-50/30")}>
                        <div className="flex items-start gap-3">
                          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", TYPE_BG[m.type])}>
                            {TYPE_ICON[m.type]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-black text-slate-700 truncate">{m.title}</p>
                              {!m.read && <div className="w-2 h-2 rounded-full bg-[#b66dff] shrink-0" />}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{m.body}</p>
                            <p className="text-[10px] text-slate-300 mt-1 flex items-center gap-1">
                              <Clock size={9} />{timeAgo(m.time)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-50">
                    <button
                      onClick={() => { router.push("/approvals"); setMailOpen(false); }}
                      className="w-full text-center text-[10px] font-black uppercase tracking-widest text-[#b66dff] hover:text-purple-700 transition-colors py-1"
                    >
                      View All Approvals →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Bell Button ─────────────────────────────────────────────────── */}
          <div ref={bellRef} className="relative">
            <button
              onClick={() => { setBellOpen(!bellOpen); setMailOpen(false); setLogoutOpen(false); }}
              className="relative p-2 hover:text-[#b66dff] hover:bg-purple-50 rounded-xl transition-all bg-transparent border-none cursor-pointer"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#fe7096] rounded-full border-2 border-white animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {bellOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden z-[200]"
                >
                  <div className="flex items-center justify-between p-4 border-b border-slate-50">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-[#b66dff] text-white text-[9px] font-black rounded-full">{unreadCount} new</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={fetchNotifications} className="text-slate-300 hover:text-[#b66dff] transition-colors p-1" title="Refresh">
                        <RefreshCw size={13} />
                      </button>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-[10px] font-black text-[#b66dff] hover:text-purple-700 transition-colors">
                          Mark all read
                        </button>
                      )}
                      <button onClick={() => setBellOpen(false)} className="text-slate-300 hover:text-slate-500"><X size={14} /></button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {loadingNotifs ? (
                      <div className="py-8 flex justify-center"><Loader2 size={20} className="animate-spin text-[#b66dff]" /></div>
                    ) : notifications.length === 0 ? (
                      <div className="py-10 text-center">
                        <Bell size={28} className="mx-auto text-slate-200 mb-2" />
                        <p className="text-xs font-bold text-slate-400">All caught up!</p>
                        <p className="text-[10px] text-slate-300 mt-1">No new notifications</p>
                      </div>
                    ) : notifications.map((n) => (
                      <div key={n.id} className={cn("p-4 hover:bg-slate-50 transition-colors cursor-pointer", !n.read && "bg-purple-50/20")}>
                        <div className="flex items-start gap-3">
                          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", TYPE_BG[n.type])}>
                            {TYPE_ICON[n.type]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-black text-slate-700 truncate">{n.title}</p>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {!n.read && <div className="w-2 h-2 rounded-full bg-[#b66dff]" />}
                                <span className="text-[10px] text-slate-300">{timeAgo(n.time)}</span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-slate-50">
                    <button
                      onClick={() => { router.push("/venues"); setBellOpen(false); }}
                      className="w-full text-center text-[10px] font-black uppercase tracking-widest text-[#b66dff] hover:text-purple-700 transition-colors py-1"
                    >
                      View All Venues →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Power/Logout Button ──────────────────────────────────────────── */}
          <div ref={logoutRef} className="relative">
            <button
              onClick={() => { setLogoutOpen(!logoutOpen); setBellOpen(false); setMailOpen(false); }}
              className="p-2 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all bg-transparent border-none cursor-pointer"
            >
              <Power size={18} />
            </button>

            <AnimatePresence>
              {logoutOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden z-[200]"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 grad-brand rounded-full flex items-center justify-center text-white font-black text-sm">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{user?.name || "System User"}</p>
                        <p className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{user?.email || "admin@partydial.com"}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => { router.push("/users"); setLogoutOpen(false); }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                      >
                        <ShieldCheck size={15} className="text-[#b66dff]" />
                        <span className="text-xs font-bold text-slate-600">User Settings</span>
                      </button>

                      <div className="h-px bg-slate-100 my-2" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 transition-colors text-left group"
                      >
                        <LogOut size={15} className="text-rose-400 group-hover:text-rose-500" />
                        <span className="text-xs font-bold text-rose-400 group-hover:text-rose-500">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </header>
  );
}
