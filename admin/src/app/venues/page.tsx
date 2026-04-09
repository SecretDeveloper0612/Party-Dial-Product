"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Search,
  Plus,
  Edit2,
  TrendingUp,
  Filter,
  XCircle,
  MapPin,
  Phone,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Trash2,
  Users,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

// Shape of a venue document coming from Appwrite via the server
interface LiveVenue {
  id: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
  contactNumber: string;
  ownerEmail: string;
  subscriptionPlan: string;
  hasActivePlan: boolean;
  isVerified: boolean;
  status: string;
  totalLeads: number;
  onboardingComplete: boolean;
  venueType: string;
  capacity: number;
  raw: any;
}

// Map raw Appwrite doc → LiveVenue
function mapDoc(doc: any): LiveVenue {
  const sub = doc.subscriptionPlan || "";
  return {
    id: doc.$id,
    name: doc.venueName || doc.businessName || "Unnamed Venue",
    city: doc.city || "—",
    state: doc.state || "",
    pincode: doc.pincode || "",
    contactNumber: doc.contactNumber || "—",
    ownerEmail: doc.contactEmail || doc.ownerEmail || "—",
    subscriptionPlan: sub || "None",
    hasActivePlan: !!(sub && sub !== "None"),
    isVerified: doc.isVerified === true,
    status: doc.status || "active",
    totalLeads: doc.totalLeads || 0,
    onboardingComplete: doc.onboardingComplete === true,
    venueType: doc.venueType || "Venue",
    capacity: parseInt(doc.capacity) || 0,
    raw: doc,
  };
}

function VenueManagementContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter");

  const [venues, setVenues] = useState<LiveVenue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<LiveVenue | null>(null);

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
      const res = await fetch(`${serverUrl}/venues`, { cache: "no-store" });
      const result = await res.json();

      if (result.status === "success") {
        let data: LiveVenue[] = (result.data || []).map(mapDoc);

        // Apply dashboard quick-filter if navigated from stats cards
        if (initialFilter === "subscribed") {
          data = data.filter((v) => v.hasActivePlan);
        } else if (initialFilter === "unsubscribed") {
          data = data.filter((v) => !v.hasActivePlan);
        }

        setVenues(data);
      } else {
        setError("Failed to load venues from server.");
      }
    } catch {
      setError("Could not connect to server. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilter]);

  const filteredVenues = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 m-0">
              Venue Management
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Live partner venues registered on the platform
            </p>
          </div>
        </div>
        <button
          onClick={fetchVenues}
          className="px-6 py-3 grad-purple text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-500/25 hover:scale-[1.02] transition-all flex items-center gap-2 active:scale-95"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 relative flex items-center">
          <input
            type="text"
            placeholder="Search by venue name, city, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 pl-12 text-sm font-semibold shadow-sm outline-none focus:border-[#b66dff] transition-all"
          />
          <Search
            size={18}
            className="absolute left-4 text-slate-400"
          />
        </div>
        <div className="lg:col-span-4 flex gap-4">
          <div className="flex-1 bg-white border border-slate-100 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-slate-500 px-4 py-3 shadow-sm">
            <Filter size={16} />
            <span>{filteredVenues.length} Venues</span>
          </div>
          <div className="flex-1 bg-white border border-slate-100 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-slate-500 px-4 py-3 shadow-sm">
            <TrendingUp size={16} />
            <span>{venues.filter((v) => v.hasActivePlan).length} Paid</span>
          </div>
        </div>
      </div>

      {/* Venue List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-[#b66dff]" size={40} />
            <p className="text-xs font-black text-slate-400 tracking-widest uppercase">
              Fetching Live Partners...
            </p>
          </div>
        ) : error ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400">
              <AlertCircle size={32} />
            </div>
            <p className="text-sm font-bold text-slate-500">{error}</p>
            <button
              onClick={fetchVenues}
              className="px-6 py-3 bg-[#b66dff] text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
              <Building2 size={32} />
            </div>
            <p className="text-sm font-bold text-slate-400">
              {searchQuery
                ? "No venues match your search."
                : "No venues have completed onboarding yet."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#b66dff] text-xs font-bold underline"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredVenues.map((venue, i) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-slate-50 shadow-sm hover:shadow-lg hover:scale-[1.002] transition-all group"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Avatar + Info */}
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl grad-brand text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-purple-500/10 shrink-0">
                    {venue.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-800 m-0">
                        {venue.name}
                      </h3>
                      {venue.isVerified ? (
                        <ShieldCheck
                          size={16}
                          className="text-[#b66dff]"
                          title="Verified"
                        />
                      ) : (
                        <ShieldAlert
                          size={16}
                          className="text-amber-400"
                          title="Unverified"
                        />
                      )}
                      {venue.onboardingComplete ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest rounded">
                          Onboarded
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 text-[9px] font-black uppercase tracking-widest rounded flex items-center gap-1">
                          <Clock size={9} /> Pending
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                        <MapPin size={12} className="text-[#b66dff]" />
                        {venue.city}
                        {venue.state && `, ${venue.state}`}
                        {venue.pincode && ` - ${venue.pincode}`}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                        <Phone size={12} />
                        {venue.contactNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                        <Mail size={12} />
                        {venue.ownerEmail}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                          venue.hasActivePlan
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-slate-50 text-slate-400 border-slate-100"
                        )}
                      >
                        {venue.subscriptionPlan === "None" ||
                        !venue.subscriptionPlan
                          ? "Free"
                          : venue.subscriptionPlan}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                        <Users size={11} />
                        {venue.totalLeads} Leads
                      </span>
                      {venue.venueType && (
                        <span className="text-[10px] font-bold text-slate-400">
                          · {venue.venueType}
                        </span>
                      )}
                      {venue.capacity > 0 && (
                        <span className="text-[10px] font-bold text-slate-400">
                          · {venue.capacity} PAX
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setSelectedVenue(venue)}
                    className="p-3 rounded-xl bg-slate-50 text-[#b66dff] hover:bg-[#b66dff] hover:text-white transition-all shadow-sm"
                    title="View Details"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Venue Detail Drawer */}
      <AnimatePresence>
        {selectedVenue && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVenue(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200 }}
              className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white z-[101] shadow-2xl flex flex-col overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="p-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl grad-brand text-white flex items-center justify-center font-black text-xl">
                    {selectedVenue.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-800">
                      {selectedVenue.name}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      {selectedVenue.city}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVenue(null)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <XCircle size={22} className="text-slate-300" />
                </button>
              </div>

              {/* Drawer Body: raw fields */}
              <div className="p-8 space-y-6">
                {/* Status badges */}
                <div className="flex flex-wrap gap-2">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                      selectedVenue.isVerified
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    )}
                  >
                    {selectedVenue.isVerified ? "✓ Verified" : "⚠ Unverified"}
                  </span>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                      selectedVenue.hasActivePlan
                        ? "bg-purple-50 text-[#b66dff] border-purple-100"
                        : "bg-slate-50 text-slate-400 border-slate-100"
                    )}
                  >
                    {selectedVenue.hasActivePlan
                      ? selectedVenue.subscriptionPlan
                      : "Free Plan"}
                  </span>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                      selectedVenue.onboardingComplete
                        ? "bg-blue-50 text-blue-600 border-blue-100"
                        : "bg-orange-50 text-orange-600 border-orange-100"
                    )}
                  >
                    {selectedVenue.onboardingComplete
                      ? "✓ Onboarded"
                      : "⏳ Onboarding Pending"}
                  </span>
                </div>

                {/* Key Details */}
                <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Venue Details
                  </h4>
                  <DetailRow label="City" value={selectedVenue.city} />
                  {selectedVenue.state && (
                    <DetailRow label="State" value={selectedVenue.state} />
                  )}
                  {selectedVenue.pincode && (
                    <DetailRow label="Pincode" value={selectedVenue.pincode} />
                  )}
                  <DetailRow
                    label="Venue Type"
                    value={selectedVenue.venueType}
                  />
                  {selectedVenue.capacity > 0 && (
                    <DetailRow
                      label="Capacity"
                      value={`${selectedVenue.capacity} PAX`}
                    />
                  )}
                  <DetailRow
                    label="Contact"
                    value={selectedVenue.contactNumber}
                  />
                  <DetailRow label="Email" value={selectedVenue.ownerEmail} />
                  <DetailRow
                    label="Total Leads"
                    value={`${selectedVenue.totalLeads}`}
                  />
                </div>

                {/* Raw Data Accordion */}
                <details className="bg-slate-900 rounded-2xl p-6 text-white">
                  <summary className="text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer">
                    Raw Appwrite Document
                  </summary>
                  <pre className="text-[10px] text-emerald-400 mt-4 overflow-auto max-h-80 leading-relaxed">
                    {JSON.stringify(selectedVenue.raw, null, 2)}
                  </pre>
                </details>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <span className="text-sm font-bold text-slate-700 text-right max-w-[60%] truncate">
        {value || "—"}
      </span>
    </div>
  );
}

export default function VenueManagement() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#b66dff]" size={40} />
        </div>
      }
    >
      <VenueManagementContent />
    </Suspense>
  );
}
