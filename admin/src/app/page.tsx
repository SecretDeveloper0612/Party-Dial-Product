"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Activity,
  TrendingUp,
  Diamond,
  AlertTriangle,
  ChevronRight,
  Wifi,
  WifiOff,
  RefreshCw,
  Users,
  CreditCard,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  Crown,
  FileCheck2,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveVenue {
  $id: string;
  venueName: string;
  city: string;
  subscriptionPlan: string;
  isVerified: boolean;
  onboardingComplete: boolean;
  status: string;
  totalLeads: number;
  $createdAt: string;
}

interface RealtimeEvent {
  type: "Signup" | "Payment" | "Approved" | "Update";
  message: string;
  time: string;
  venueId?: string;
  detail?: string;
}

const PLAN_REVENUE: Record<string, number> = {
  monthly: 7000 * 12,
  quarterly: 15000 * 4,
  halfYearly: 24000 * 2,
  annually: 42000,
  trial_30: 11,
};

const PLAN_LABELS: Record<string, string> = {
  monthly: "Monthly Plan",
  quarterly: "Quarterly Plan",
  halfYearly: "Half-Yearly Plan",
  annually: "Annual Plan",
  trial_30: "30-Day Trial",
};

function normalizePlanKey(plan: string | undefined | null): string {
  if (!plan) return "free";
  const p = plan.toLowerCase().trim();
  if (p === "free" || p === "none" || p === "") return "free";
  if (p.includes("trial") || p === "trial_30") return "trial_30";
  if (p.includes("quarter") || p.includes("3 month") || p.includes("60 day") || p === "quarterly") return "quarterly";
  if (p.includes("half") || p.includes("6 month") || p === "halfyearly") return "halfYearly";
  if (p.includes("1 month") || p.includes("month") || p === "monthly") return "monthly";
  if (p.includes("annual") || p.includes("1 year") || p === "annually" || p === "pro_partner" || p.includes("partner pro")) {
    return "annually";
  }
  return "annually";
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 10) return "Just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("Lifetime");
  const [venues, setVenues] = useState<LiveVenue[]>([]);
  const [myLeads, setMyLeads] = useState<any[]>([]);
  const [userRole, setUserRole] = useState("Super Admin");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [feedFilter, setFeedFilter] = useState<string>("All");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  const rawBase = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const base = rawBase.replace(/\/+$/, "");
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const [payments, setPayments] = useState<any[]>([]);

  const fetchLeads = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`${serverUrl}/leads/user/${userId}`);
      const result = await res.json();
      if (result.status === "success") {
        setMyLeads(result.data || []);
      }
    } catch (e) {
      console.error("Error fetching employee leads:", e);
    }
  }, [serverUrl]);

  // ── Fetch metadata from server ──────────────────────────────────────────────
  const fetchData = useCallback(async (showRefreshingState = false) => {
    if (showRefreshingState) setIsRefreshing(true);
    try {
      const sessionStr = localStorage.getItem("party_admin_session");
      if (!sessionStr) return;

      const session = JSON.parse(sessionStr);
      const user = session.user;
      const role = user.prefs?.role || "Super Admin";
      setUserRole(role);

      if (role === "Super Admin") {
        const [venuesRes, paymentsRes] = await Promise.all([
          fetch(`${serverUrl}/venues`, { cache: "no-store" }).catch(() => null),
          fetch(`${serverUrl}/payments`, { cache: "no-store" }).catch(() => null),
        ]);

        if (venuesRes && venuesRes.ok) {
          const venuesResult = await venuesRes.json().catch(() => ({}));
          if (venuesResult.status === "success") {
            const mapped = (venuesResult.data || []).map((v: any) => {
              if (v.subscriptionPlan === "trial_30") {
                const createdAt = v.$createdAt ? new Date(v.$createdAt).getTime() : Date.now();
                if (Date.now() - createdAt > 30 * 24 * 60 * 60 * 1000) {
                  return { ...v, subscriptionPlan: "None" };
                }
              }
              return v;
            });
            setVenues(mapped);
          }
        }

        if (paymentsRes && paymentsRes.ok) {
          const paymentsResult = await paymentsRes.json().catch(() => ({}));
          if (paymentsResult.status === "success") {
            setPayments(paymentsResult.data || []);
          }
        }
      } else {
        await fetchLeads(user.$id);
      }
      setLastUpdated(new Date());
    } catch (e: any) {
      console.warn("Dashboard fetch error:", e?.message || e);
    } finally {
      setLoading(false);
      setMounted(true);
      if (showRefreshingState) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, [serverUrl, fetchLeads]);

  // ── Setup Appwrite Realtime Subscription ─────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const setupRealtime = async () => {
      await fetchData();

      try {
        const { client, DATABASE_ID, VENUES_COLLECTION_ID } = await import("@/lib/appwrite");

        const channel = `databases.${DATABASE_ID}.collections.${VENUES_COLLECTION_ID}.documents`;

        const unsub = client.subscribe(channel, (response: any) => {
          if (!isMounted) return;

          const events: string[] = response.events || [];
          const doc = response.payload as LiveVenue;

          if (events.some(e => e.includes(".create"))) {
            setVenues(prev => {
              const exists = prev.find(v => v.$id === doc.$id);
              return exists ? prev : [doc, ...prev];
            });
            setRealtimeEvents(prev => [
              {
                type: "Signup",
                message: `New venue registered: ${doc.venueName || "Unnamed"}`,
                detail: doc.city || "Location unspecified",
                time: new Date().toISOString(),
                venueId: doc.$id,
              },
              ...prev.slice(0, 19),
            ]);
          } else if (events.some(e => e.includes(".update"))) {
            setVenues(prev => prev.map(v => (v.$id === doc.$id ? { ...v, ...doc } : v)));

            let eventMsg = `Venue updated: ${doc.venueName || doc.$id}`;
            let eventDetail = doc.city || "Profile update";
            let eventType: "Signup" | "Payment" | "Approved" | "Update" = "Update";

            if (doc.isVerified) {
              eventMsg = `Partner Approved: ${doc.venueName || "Venue"}`;
              eventDetail = "KYC & Verification Approved";
              eventType = "Approved";
            } else if (doc.subscriptionPlan && doc.subscriptionPlan !== "None") {
              eventMsg = `Subscription Active: ${doc.venueName || "Venue"}`;
              eventDetail = PLAN_LABELS[doc.subscriptionPlan] || doc.subscriptionPlan;
              eventType = "Payment";
            } else if (doc.onboardingComplete) {
              eventMsg = `Onboarding Complete: ${doc.venueName || "Venue"}`;
              eventDetail = doc.city || "Ready for live listings";
              eventType = "Signup";
            }

            setRealtimeEvents(prev => [
              {
                type: eventType,
                message: eventMsg,
                detail: eventDetail,
                time: new Date().toISOString(),
                venueId: doc.$id,
              },
              ...prev.slice(0, 19),
            ]);
          } else if (events.some(e => e.includes(".delete"))) {
            setVenues(prev => prev.filter(v => v.$id !== doc.$id));
          }

          setLastUpdated(new Date());
        });

        unsubRef.current = unsub;
        setIsRealtimeConnected(true);
      } catch (err: any) {
        console.warn("Realtime setup failed:", err?.message || err);
        setIsRealtimeConnected(false);
        setTimeout(() => {
          if (isMounted) setupRealtime();
        }, 10000);
      }
    };

    setupRealtime();

    return () => {
      isMounted = false;
      if (unsubRef.current) unsubRef.current();
    };
  }, [fetchData]);

  // ── Derived Metrics ───────────────────────────────────────────────────────
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = startOfToday - 7 * 24 * 60 * 60 * 1000;
  const startOfMonth = startOfToday - 30 * 24 * 60 * 60 * 1000;
  const startOfYear = startOfToday - 365 * 24 * 60 * 60 * 1000;

  const filteredVenues = useMemo(() => {
    return venues.filter(v => {
      if (timeFilter === "Lifetime") return true;
      const createdAt = v.$createdAt ? new Date(v.$createdAt).getTime() : 0;
      if (timeFilter === "Today") return createdAt >= startOfToday;
      if (timeFilter === "Weekly") return createdAt >= startOfWeek;
      if (timeFilter === "Monthly") return createdAt >= startOfMonth;
      if (timeFilter === "Yearly") return createdAt >= startOfYear;
      return true;
    });
  }, [venues, timeFilter, startOfToday, startOfWeek, startOfMonth, startOfYear]);

  const filteredLeads = useMemo(() => {
    return myLeads.filter(l => {
      if (timeFilter === "Lifetime") return true;
      const createdAt = l.$createdAt ? new Date(l.$createdAt).getTime() : 0;
      if (timeFilter === "Today") return createdAt >= startOfToday;
      if (timeFilter === "Weekly") return createdAt >= startOfWeek;
      if (timeFilter === "Monthly") return createdAt >= startOfMonth;
      if (timeFilter === "Yearly") return createdAt >= startOfYear;
      return true;
    });
  }, [myLeads, timeFilter, startOfToday, startOfWeek, startOfMonth, startOfYear]);

  const totalVenues = filteredVenues.length;
  const subscribedVenues = filteredVenues.filter(v => v.subscriptionPlan && v.subscriptionPlan !== "None").length;
  const freeVenues = Math.max(0, totalVenues - subscribedVenues);
  const pendingVerification = filteredVenues.filter(v => !v.isVerified).length;

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      if (timeFilter === "Lifetime") return true;
      const createdAt = p.paidAt ? new Date(p.paidAt).getTime() : (p.$createdAt ? new Date(p.$createdAt).getTime() : 0);
      if (timeFilter === "Today") return createdAt >= startOfToday;
      if (timeFilter === "Weekly") return createdAt >= startOfWeek;
      if (timeFilter === "Monthly") return createdAt >= startOfMonth;
      if (timeFilter === "Yearly") return createdAt >= startOfYear;
      return true;
    });
  }, [payments, timeFilter, startOfToday, startOfWeek, startOfMonth, startOfYear]);

  const totalRevenue = useMemo(() => {
    return filteredPayments.reduce((sum, p) => {
      if (p.status === "captured" || p.status === "paid" || p.status === "Paid") {
        return sum + (Number(p.amount) || 0);
      }
      return sum;
    }, 0);
  }, [filteredPayments]);

  const conversionRate = totalVenues > 0 ? ((subscribedVenues / totalVenues) * 100).toFixed(1) : "0.0";

  // Subscription Plan Breakdown computations
  const tierBreakdown = useMemo(() => {
    const plans = [
      {
        plan: "monthly",
        label: "Monthly Plan",
        duration: "1 Month",
        rate: "₹7,000 / mo",
        billed: "Billed Monthly",
        color: "from-blue-600 to-indigo-600",
        badge: "Flexible",
        features: "Unlimited leads • CRM access",
      },
      {
        plan: "quarterly",
        label: "Quarterly Plan",
        duration: "3 Months",
        rate: "₹5,000 / mo",
        billed: "₹15,000 for 3 Mo",
        color: "from-sky-500 to-blue-600",
        badge: "Seasonal",
        features: "Priority search • Direct WhatsApp",
      },
      {
        plan: "halfYearly",
        label: "Half-Yearly Plan",
        duration: "6 Months",
        rate: "₹4,000 / mo",
        billed: "₹24,000 for 6 Mo",
        color: "from-purple-600 to-violet-600",
        popular: true,
        badge: "Most Popular",
        features: "Priority dispatch • Verified partner",
      },
      {
        plan: "annually",
        label: "Annual Pro Plan",
        duration: "12 Months",
        rate: "₹3,500 / mo",
        billed: "₹42,000 for 12 Mo",
        color: "from-emerald-500 to-teal-600",
        badge: "Best Value",
        features: "Top city ranking • VIP support",
      },
    ];

    let topPlan = plans[2];
    let maxCount = -1;
    let totalProjectedPipeline = 0;

    const list = plans.map(p => {
      const count = filteredVenues.filter(v => normalizePlanKey(v.subscriptionPlan) === p.plan).length;
      const denominator = subscribedVenues > 0 ? subscribedVenues : totalVenues;
      const share = denominator > 0 ? Math.round((count / denominator) * 100) : 0;
      const revenueVal = count * (PLAN_REVENUE[p.plan] || 0);
      totalProjectedPipeline += revenueVal;

      if (count > maxCount) {
        maxCount = count;
        topPlan = p;
      }

      return {
        ...p,
        count,
        share,
        revenueVal,
      };
    });

    return {
      list,
      topPlan: maxCount > 0 ? topPlan.label : "Quarterly Plan",
      totalProjectedPipeline,
    };
  }, [filteredVenues, totalVenues, subscribedVenues]);

  const filteredFeedEvents = useMemo(() => {
    if (feedFilter === "All") return realtimeEvents;
    return realtimeEvents.filter(e => e.type === feedFilter);
  }, [realtimeEvents, feedFilter]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[65vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 border-3 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* ── Top Executive Control Bar ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25 shrink-0">
            <Building2 size={20} className="stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight m-0">
                Intelligence Dashboard
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                v2.4
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light m-0 mt-0.5">
              Live enterprise telemetry, venue subscription dynamics & revenue health
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Live indicator badge */}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold tracking-wide transition-all shadow-xs",
              isRealtimeConnected
                ? "bg-emerald-50 border-emerald-200/80 text-emerald-700"
                : "bg-amber-50 border-amber-200/80 text-amber-700"
            )}
          >
            {isRealtimeConnected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-semibold">Live Stream</span>
              </>
            ) : (
              <>
                <WifiOff size={12} className="text-amber-500" />
                <span className="font-semibold">Connecting...</span>
              </>
            )}
          </div>

          {/* Sync Button & Last Updated */}
          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 text-xs font-medium transition-all active:scale-95 disabled:opacity-60 cursor-pointer shadow-xs"
            title="Refresh Telemetry"
          >
            <RefreshCw size={12} className={cn("text-purple-600", isRefreshing && "animate-spin")} />
            <span className="hidden sm:inline">
              {lastUpdated ? timeAgo(lastUpdated.toISOString()) : "Sync"}
            </span>
          </button>

          {/* Time Filter Segmented Select */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl p-1 shadow-xs">
            <Calendar size={13} className="text-slate-400 ml-2" />
            <select
              value={timeFilter}
              onChange={e => setTimeFilter(e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-semibold rounded-lg pr-2 py-0.5 outline-none cursor-pointer hover:text-purple-700 transition-colors"
            >
              <option value="Today">Today</option>
              <option value="Weekly">This Week</option>
              <option value="Monthly">This Month</option>
              <option value="Yearly">This Year</option>
              <option value="Lifetime">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Executive KPI Metric Cards (6 Cards) ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
        
        {/* Card 1: Total Revenue / Assigned Leads */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs">
                <Activity size={18} className="stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/60">
                {userRole === "Super Admin" ? "Yield" : "Quota"}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {userRole === "Super Admin" ? "Total Revenue" : "Assigned Leads"}
            </p>
            <h2 className="text-2xl lg:text-[26px] font-extrabold text-slate-900 tracking-tight m-0">
              {loading ? "—" : userRole === "Super Admin" ? `₹${totalRevenue.toLocaleString("en-IN")}` : filteredLeads.length}
            </h2>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-medium text-slate-400">
              {userRole === "Super Admin" ? "Gross Captured" : "Active Allocation"}
            </span>
            <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
              Live <ArrowUpRight size={12} />
            </span>
          </div>
        </div>

        {/* Card 2: Pending Approvals / In-Progress Leads */}
        <Link href={userRole === "Super Admin" ? "/approvals" : "/crm/leads"} className="block outline-none group">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-xs">
                  <FileCheck2 size={18} className="stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100/60">
                  {pendingVerification > 0 ? "Action" : "Clear"}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {userRole === "Super Admin" ? "Pending Approvals" : "In-Progress Leads"}
              </p>
              <h2 className="text-2xl lg:text-[26px] font-extrabold text-slate-900 tracking-tight m-0">
                {loading ? "—" : userRole === "Super Admin" ? pendingVerification : filteredLeads.filter(l => l.status === "Contacted" || l.status === "Qualified").length}
              </h2>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium text-slate-400">
                {userRole === "Super Admin" ? "Partner Verification" : "Follow-ups"}
              </span>
              <span className="font-semibold text-amber-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Review <ChevronRight size={13} />
              </span>
            </div>
          </div>
        </Link>

        {/* Card 3: Subscribed Venues / Conversions */}
        <Link href={userRole === "Super Admin" ? "/venues?filter=subscribed" : "/crm/leads"} className="block outline-none group">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-400" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shadow-xs">
                  <Crown size={18} className="stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100/60">
                  {conversionRate}% Rate
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {userRole === "Super Admin" ? "Subscribed Venues" : "Total Conversions"}
              </p>
              <h2 className="text-2xl lg:text-[26px] font-extrabold text-slate-900 tracking-tight m-0">
                {loading ? "—" : userRole === "Super Admin" ? subscribedVenues : filteredLeads.filter(l => l.status === "Won").length}
              </h2>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium text-slate-400">
                {userRole === "Super Admin" ? "Paid Directory" : "Won Deals"}
              </span>
              <span className="font-semibold text-purple-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Manage <ChevronRight size={13} />
              </span>
            </div>
          </div>
        </Link>

        {/* Card 4: Free Listings */}
        <Link href="/venues?filter=unsubscribed" className="block outline-none group">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shadow-xs">
                  <Layers size={18} className="stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100/60">
                  Organic
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Free Listings
              </p>
              <h2 className="text-2xl lg:text-[26px] font-extrabold text-slate-900 tracking-tight m-0">
                {loading ? "—" : freeVenues}
              </h2>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium text-slate-400">Unsubscribed Base</span>
              <span className="font-semibold text-sky-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Upsell <ChevronRight size={13} />
              </span>
            </div>
          </div>
        </Link>

        {/* Card 5: Total Venues */}
        <Link href="/venues" className="block outline-none group">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shadow-xs">
                  <Building2 size={18} className="stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
                  Ecosystem
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Total Venues
              </p>
              <h2 className="text-2xl lg:text-[26px] font-extrabold text-slate-900 tracking-tight m-0">
                {loading ? "—" : totalVenues}
              </h2>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium text-slate-400">Total Entities</span>
              <span className="font-semibold text-slate-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Directory <ChevronRight size={13} />
              </span>
            </div>
          </div>
        </Link>

        {/* Card 6: Pending KYC */}
        <Link href="/approvals" className="block outline-none group">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-pink-500" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shadow-xs">
                  <AlertTriangle size={18} className="stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100/60">
                  {pendingVerification > 0 ? "Pending" : "Verified"}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Pending KYC
              </p>
              <h2 className="text-2xl lg:text-[26px] font-extrabold text-slate-900 tracking-tight m-0">
                {loading ? "—" : pendingVerification}
              </h2>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium text-slate-400">Compliance</span>
              <span className="font-semibold text-rose-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Audit <ChevronRight size={13} />
              </span>
            </div>
          </div>
        </Link>

      </div>

      {/* ── Mid Section: Ecosystem Ratio & Live Telemetry Feed ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left: Subscribed vs Free Listing (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight m-0">
                  Venue Ecosystem Ratio
                </h3>
                <p className="text-xs text-slate-500 font-light mt-0.5">
                  Monetized partners vs free unclaimed listings
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100/80">
                <TrendingUp size={12} className="text-purple-600" />
                {conversionRate}% Paid
              </span>
            </div>

            {/* Circular Gauge / Donut */}
            <div className="flex flex-col items-center justify-center my-4 sm:my-6">
              <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  {/* Background Track */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="11"
                  />
                  {/* Subscribed Gradient Arc */}
                  {totalVenues > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="url(#purpleGrad)"
                      strokeWidth="11"
                      strokeDasharray={`${(subscribedVenues / totalVenues) * 301.6} 301.6`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  )}
                  <defs>
                    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="50%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Paid Ratio
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight my-0.5">
                    {loading ? "—" : subscribedVenues}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    of {loading ? "—" : totalVenues} total venues
                  </span>
                </div>
              </div>

              {/* Comparative Split Bar */}
              <div className="w-full max-w-sm mt-3">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${totalVenues > 0 ? (subscribedVenues / totalVenues) * 100 : 0}%` }}
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-700"
                  />
                  <div
                    style={{ width: `${totalVenues > 0 ? (freeVenues / totalVenues) * 100 : 100}%` }}
                    className="h-full bg-slate-200 transition-all duration-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown KPI Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-slate-100">
            <div className="p-3.5 sm:p-4 rounded-xl bg-purple-50/50 border border-purple-100/70 flex flex-col">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900">
                  Active Paid
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-purple-950">
                {loading ? "—" : subscribedVenues}
              </span>
              <span className="text-[11px] text-purple-700 font-medium mt-0.5">
                {conversionRate}% of directory
              </span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Free Listings
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-800">
                {loading ? "—" : freeVenues}
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                {totalVenues > 0 ? (100 - Number(conversionRate)).toFixed(1) : "0"}% unconverted
              </span>
            </div>
          </div>
        </div>

        {/* Right: Live Activity Stream (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight m-0">
                    Live Telemetry Stream
                  </h3>
                  {isRealtimeConnected && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-light mt-0.5">
                  Real-time vendor registrations, verification & subscription events
                </p>
              </div>

              {/* Feed Category Filter Chips */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-xl p-1 self-start sm:self-auto">
                {["All", "Signup", "Payment", "Approved"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFeedFilter(cat)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer",
                      feedFilter === cat
                        ? "bg-white text-purple-700 shadow-xs border border-slate-200/50"
                        : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Event List / Empty State */}
            <div className="space-y-3 min-h-[300px]">
              {filteredFeedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
                  <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-purple-100 opacity-60 animate-ping" />
                    <div className="relative w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                      <Wifi size={22} className="stroke-[2.2]" />
                    </div>
                  </div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-1">
                    {isRealtimeConnected ? "Telemetry Online & Listening" : "Initializing Stream..."}
                  </h4>
                  <p className="text-xs text-slate-400 font-light max-w-xs leading-relaxed">
                    Live events from partner registrations, plan upgrades, and approvals will stream here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                  <AnimatePresence initial={false}>
                    {filteredFeedEvents.map((event, i) => (
                      <motion.div
                        key={`${event.time}-${i}`}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:bg-white hover:shadow-xs hover:border-slate-300 transition-all"
                      >
                        <div
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-xs",
                            event.type === "Approved"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : event.type === "Payment"
                              ? "bg-purple-50 text-purple-600 border-purple-100"
                              : event.type === "Signup"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                          )}
                        >
                          {event.type === "Approved" ? (
                            <ShieldCheck size={16} />
                          ) : event.type === "Payment" ? (
                            <CreditCard size={16} />
                          ) : event.type === "Signup" ? (
                            <Users size={16} />
                          ) : (
                            <Activity size={16} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                "text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md",
                                event.type === "Approved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : event.type === "Payment"
                                  ? "bg-purple-100 text-purple-800"
                                  : event.type === "Signup"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-slate-200 text-slate-700"
                              )}
                            >
                              {event.type}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                              {timeAgo(event.time)}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 mt-1 truncate">
                            {event.message}
                          </p>
                          {event.detail && (
                            <p className="text-[11px] text-slate-500 font-normal truncate">
                              {event.detail}
                            </p>
                          )}
                        </div>

                        {event.venueId && (
                          <Link
                            href={`/venues`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                            title="Inspect in directory"
                          >
                            <ChevronRight size={15} />
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Appwrite Realtime Engine</span>
            <span className="font-semibold text-purple-600 flex items-center gap-1">
              Active Connection <Zap size={12} />
            </span>
          </div>
        </div>

      </div>

      {/* ── Revenue Intelligence & Plan Breakdown ────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.03)] space-y-6">
        
        {/* Section Header */}
        <div className="pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight m-0">
              Subscription Plans Intelligence
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
              Live Distribution
            </span>
          </div>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Live breakdown of active partner subscription plans & monetization pipeline
          </p>
        </div>

        {/* Grid of Subscription Plan Cards (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {tierBreakdown.list.map(sub => {
            return (
              <div
                key={sub.plan}
                className={cn(
                  "p-5 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between group",
                  sub.popular
                    ? "bg-gradient-to-b from-purple-50/50 to-white border-purple-200 shadow-sm hover:shadow-md hover:border-purple-300"
                    : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm"
                )}
              >
                {/* Popular Pill */}
                {sub.popular && (
                  <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 tracking-tight m-0">
                        {sub.label}
                      </h4>
                      <p className="text-[11px] font-light text-slate-400 mt-0.5">
                        {sub.duration}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {sub.badge}
                    </span>
                  </div>

                  <div className="my-3">
                    <div className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {sub.rate}
                    </div>
                    <p className="text-[10px] font-light text-slate-400 mt-0.5">
                      {sub.billed}
                    </p>
                  </div>

                  {/* Market Share Progress Bar */}
                  <div className="my-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1.5">
                      <span>Share of Paid</span>
                      <span className="font-bold text-slate-800">{sub.share}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sub.share}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={cn("h-full rounded-full bg-gradient-to-r", sub.color)}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Subscribers
                    </span>
                    <span className="text-sm font-extrabold text-slate-800">
                      {sub.count} {sub.count === 1 ? "venue" : "venues"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Annual Yield
                    </span>
                    <span className="text-sm font-extrabold text-purple-700">
                      ₹{sub.revenueVal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
