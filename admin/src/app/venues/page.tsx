"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
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
  Mail,
  Save
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

const eventTypesList = [
  "Birthday Party",
  "Wedding Events",
  "Pre-Wedding Events",
  "Anniversary Party",
  "Corporate Events",
  "Kitty Party",
  "Family Functions",
  "Festival Parties",
  "Social Gatherings",
  "Kids Parties",
  "Bachelor / Bachelorette Party",
  "Housewarming Party",
  "Baby Shower",
  "Engagement Ceremony",
  "Entertainment / Theme Parties"
];

const amenitiesList = [
  { id: 'ac', name: 'Air Conditioning' },
  { id: 'parking', name: 'Parking Available' },
  { id: 'power', name: 'Power Backup' },
  { id: 'indoor', name: 'Indoor Hall' },
  { id: 'outdoor', name: 'Outdoor Lawn' },
  { id: 'catering_in', name: 'In-House Catering' },
  { id: 'catering_out', name: 'Outside Catering Allowed' },
  { id: 'dj', name: 'DJ Allowed' },
  { id: 'decoration', name: 'Decoration Available' },
  { id: 'bridal', name: 'Bridal Room' },
  { id: 'security', name: 'Security Available' },
  { id: 'wifi', name: 'Wi-Fi Available' },
];

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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [updating, setUpdating] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [listingFilter, setListingFilter] = useState<"All" | "Free" | "Paid">("All");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCurrentUser = useCallback(async () => {
    const sessionStr = localStorage.getItem("party_admin_session");
    if (!sessionStr) return;
    
    try {
      const session = JSON.parse(sessionStr);
      const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
      const serverUrl = base.endsWith("/api") ? base : `${base}/api`;
      
      const res = await fetch(`${serverUrl}/users/${session.user.$id}`);
      const result = await res.json();
      
      if (result.status === "success") {
        setCurrentUser(result.data);
        localStorage.setItem("party_admin_session", JSON.stringify({
          ...session,
          user: result.data
        }));
      } else {
        setCurrentUser(session.user);
      }
    } catch (e) {
      console.error("Failed to fetch fresh user data", e);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
      const serverUrl = base.endsWith("/api") ? base : `${base}/api`;
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVenue) return;
    setUpdating(true);
    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
      const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

      // Send arrays as real arrays — DO NOT JSON.stringify them.
      // Appwrite expects native array attributes, not JSON strings.
      const payload = {
        ...editForm,
        amenities: Array.isArray(editForm.amenities) ? editForm.amenities : [],
        eventTypes: Array.isArray(editForm.eventTypes) ? editForm.eventTypes : [],
        photos: Array.isArray(editForm.photos) ? editForm.photos : [],
        capacity: parseInt(editForm.capacity) || 0,
      };

      const res = await fetch(`${serverUrl}/venues/${selectedVenue.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.status === "success") {
        setVenues(prev => prev.map(v => v.id === selectedVenue.id ? mapDoc(result.data) : v));
        setSelectedVenue(mapDoc(result.data));
        setIsEditing(false);
        showToast("✓ Venue Profile Updated Successfully", "success");
      } else {
        showToast(`✗ Save failed: ${result.message || "Unknown error"}`, "error");
      }
    } catch (e: any) {
      console.error("Update failed", e);
      showToast(`✗ Save failed: ${e?.message || "Network error"}`, "error");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (selectedVenue) {
      const parseField = (val: any) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
          return val.split(",").map((s: string) => s.trim()).filter((s: string) => s !== "");
        }
      };

      setEditForm({
        venueName: selectedVenue.raw.venueName || selectedVenue.name,
        description: selectedVenue.raw.description || "",
        city: selectedVenue.city,
        state: selectedVenue.state,
        pincode: selectedVenue.pincode,
        capacity: selectedVenue.capacity,
        venueType: selectedVenue.venueType,
        contactNumber: selectedVenue.contactNumber,
        contactEmail: selectedVenue.ownerEmail,
        landmark: selectedVenue.raw.landmark || "",
        amenities: parseField(selectedVenue.raw.amenities),
        eventTypes: parseField(selectedVenue.raw.eventTypes),
        photos: parseField(selectedVenue.raw.photos),
      });
    }
  }, [selectedVenue]);

  useEffect(() => {
    fetchVenues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilter]);

  const filteredVenues = venues.filter(
    (v) => {
      const matchesSearch = 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesListing = 
        listingFilter === "All" ||
        (listingFilter === "Paid" && v.hasActivePlan) ||
        (listingFilter === "Free" && !v.hasActivePlan);

      if (!matchesSearch || !matchesListing) return false;

      // Role-based Access Logic
      const userRole = currentUser?.prefs?.role;
      if (userRole === "Super Admin") return true;

      const assignedVenues = JSON.parse(currentUser?.prefs?.assignedVenues || "[]");
      const hasDirectAccess = assignedVenues.includes(v.id);
      
      const userCity = currentUser?.prefs?.city;
      const userState = currentUser?.prefs?.state;
      const hasTerritorialAccess = (userCity && v.city === userCity) || (userState && v.state === userState);

      return hasDirectAccess || hasTerritorialAccess;
    }
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl text-white text-sm font-bold shadow-2xl flex items-center gap-3",
              toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"
            )}
          >
            {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className="lg:col-span-4 flex gap-3">
          <div className="flex-1 bg-white border border-slate-100 rounded-xl p-1 flex shadow-sm">
            {(["All", "Free", "Paid"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setListingFilter(f)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  listingFilter === f 
                    ? "bg-slate-900 text-white shadow-lg" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="w-[120px] bg-white border border-slate-100 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-3 shadow-sm">
            <Filter size={14} className="text-[#b66dff]" />
            <span>{filteredVenues.length}</span>
          </div>
        </div>
      </div>

      {/* Venue List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <Loader2 className="text-[#b66dff]" size={40} />
            <p className="text-xs font-black text-slate-400 tracking-widest uppercase">
              Partners Synchronized
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
                        />
                      ) : (
                        <ShieldAlert
                          size={16}
                          className="text-amber-400"
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
                      <span className="px-2 py-0.5 bg-violet-50 text-violet-600 border border-violet-100 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        <TrendingUp size={10} /> {venue.totalLeads} Leads
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
                    onClick={async (e) => {
                      e.stopPropagation();
                      const endpoint = venue.isVerified ? 'reject' : 'approve';
                      try {
                        const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
                        const serverUrl = base.endsWith("/api") ? base : `${base}/api`;
                        const res = await fetch(`${serverUrl}/venues/${venue.id}/${endpoint}`, { method: 'PATCH' });
                        if (res.ok) fetchVenues();
                      } catch (err) { console.error("Toggle failed", err); }
                    }}
                    className={cn(
                      "p-3 rounded-xl transition-all shadow-sm",
                      venue.isVerified 
                        ? "bg-emerald-50 text-emerald-600 hover:bg-rose-50 hover:text-rose-600" 
                        : "bg-amber-50 text-amber-600 hover:bg-emerald-50 hover:text-emerald-600"
                    )}
                    title={venue.isVerified ? "Deactivate / Hide Profile" : "Approve / Show Profile"}
                  >
                    {venue.isVerified ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                  </button>
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
                      {isEditing ? `Editing: ${selectedVenue.name}` : selectedVenue.name}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      {selectedVenue.city}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-purple-50 text-[#b66dff] rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#b66dff] hover:text-white transition-all"
                    >
                      Edit Profile
                    </button>
                  )}
                  <button
                    onClick={() => { setSelectedVenue(null); setIsEditing(false); }}
                    className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                  >
                    <XCircle size={22} className="text-slate-300" />
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="p-8 space-y-6">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="space-y-6 pb-20">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Venue Name</label>
                        <input 
                          type="text" 
                          value={editForm.venueName} 
                          onChange={e => setEditForm({...editForm, venueName: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#b66dff]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                        <textarea 
                          rows={4}
                          value={editForm.description} 
                          onChange={e => setEditForm({...editForm, description: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#b66dff]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Venue Type</label>
                          <input 
                            type="text" 
                            value={editForm.venueType} 
                            onChange={e => setEditForm({...editForm, venueType: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#b66dff]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Capacity (PAX)</label>
                          <input 
                            type="number" 
                            value={editForm.capacity} 
                            onChange={e => setEditForm({...editForm, capacity: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#b66dff]"
                          />
                        </div>
                      </div>


                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">City</label>
                          <input 
                            type="text" 
                            value={editForm.city} 
                            onChange={e => setEditForm({...editForm, city: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#b66dff]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">State</label>
                          <input 
                            type="text" 
                            value={editForm.state} 
                            onChange={e => setEditForm({...editForm, state: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#b66dff]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pincode</label>
                          <input 
                            type="text" 
                            value={editForm.pincode} 
                            onChange={e => setEditForm({...editForm, pincode: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#b66dff]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Key Landmark</label>
                        <input 
                          type="text" 
                          value={editForm.landmark} 
                          onChange={e => setEditForm({...editForm, landmark: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#b66dff]"
                          placeholder="e.g. Near City Center Mall"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Number</label>
                          <input 
                            type="text" 
                            value={editForm.contactNumber} 
                            onChange={e => setEditForm({...editForm, contactNumber: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#b66dff]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Email</label>
                          <input 
                            type="email" 
                            value={editForm.contactEmail} 
                            onChange={e => setEditForm({...editForm, contactEmail: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#b66dff]"
                          />
                        </div>
                      </div>


                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amenities & Services</label>
                        <div className="flex flex-wrap gap-2">
                          {amenitiesList.map(amenity => {
                            const isSelected = editForm.amenities.includes(amenity.id);
                            return (
                              <button
                                key={amenity.id}
                                type="button"
                                onClick={() => {
                                  const newAmenities = isSelected 
                                    ? editForm.amenities.filter((a: string) => a !== amenity.id)
                                    : [...editForm.amenities, amenity.id];
                                  setEditForm({ ...editForm, amenities: newAmenities });
                                }}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all",
                                  isSelected 
                                    ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                                    : "bg-white border-slate-100 text-slate-500 hover:border-purple-300"
                                )}
                              >
                                {amenity.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Event Types Hosted</label>
                        <div className="flex flex-wrap gap-2">
                          {eventTypesList.map(type => {
                            const isSelected = editForm.eventTypes.includes(type);
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  const newTypes = isSelected 
                                    ? editForm.eventTypes.filter((t: string) => t !== type)
                                    : [...editForm.eventTypes, type];
                                  setEditForm({ ...editForm, eventTypes: newTypes });
                                }}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all",
                                  isSelected 
                                    ? "bg-[#b66dff] border-[#b66dff] text-white shadow-md" 
                                    : "bg-white border-slate-100 text-slate-400 hover:border-purple-300"
                                )}
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image Gallery</label>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          {(editForm.photos || []).map((url: string, idx: number) => (
                            <div key={idx} className="relative group/img aspect-video rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                              <img src={url} alt={`Venue ${idx}`} className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => {
                                  const newPhotos = editForm.photos.filter((_: any, i: number) => i !== idx);
                                  setEditForm({ ...editForm, photos: newPhotos });
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-all shadow-lg"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            id="new_image_url"
                            placeholder="Paste image URL here..."
                            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#b66dff]"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                if (input.value) {
                                  setEditForm({ ...editForm, photos: [...(editForm.photos || []), input.value] });
                                  input.value = "";
                                }
                              }
                            }}
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('new_image_url') as HTMLInputElement;
                              if (input?.value) {
                                setEditForm({ ...editForm, photos: [...(editForm.photos || []), input.value] });
                                input.value = "";
                              }
                            }}
                            className="p-3 bg-purple-50 text-[#b66dff] rounded-xl font-black text-xs uppercase"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="fixed bottom-0 right-0 w-full max-w-xl p-6 bg-white border-t border-slate-100 flex gap-3 z-20">
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={updating}
                        className="flex-[2] py-4 grad-brand text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                      >
                        {updating ? <span className="opacity-50">Saving Profile...</span> : <><Save size={16} /> Save Venue Profile</>}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
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
                  <button
                    onClick={async () => {
                      const endpoint = selectedVenue.isVerified ? 'reject' : 'approve';
                      setUpdating(true);
                      try {
                        const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
                        const serverUrl = base.endsWith("/api") ? base : `${base}/api`;
                        const res = await fetch(`${serverUrl}/venues/${selectedVenue.id}/${endpoint}`, { method: 'PATCH' });
                        if (res.ok) {
                          const result = await res.json();
                          setVenues(prev => prev.map(v => v.id === selectedVenue.id ? mapDoc(result.data) : v));
                          setSelectedVenue(mapDoc(result.data));
                        }
                      } catch (err) { console.error("Toggle failed", err); }
                      finally { setUpdating(false); }
                    }}
                    disabled={updating}
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase border transition-all active:scale-95",
                      selectedVenue.isVerified
                        ? "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white"
                        : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                    )}
                  >
                    {updating ? "Processing..." : selectedVenue.isVerified ? "Remove Permission" : "Grant Approval"}
                  </button>
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
                    label="Leads"
                    value={`${selectedVenue.totalLeads} Total`}
                  />
                  {selectedVenue.raw.landmark && (
                    <DetailRow label="Landmark" value={selectedVenue.raw.landmark} />
                  )}
                  {selectedVenue.raw.pricing && (
                    <DetailRow label="Pricing" value={selectedVenue.raw.pricing} />
                  )}
                </div>

                {/* Amenities & Event Types Preview */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Amenities & Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {parseField(selectedVenue.raw.amenities).length > 0 ? (
                      parseField(selectedVenue.raw.amenities).map((a: string) => (
                        <span key={a} className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                          {amenitiesList.find(al => al.id === a)?.name || a}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs italic text-slate-300">None specified</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Events Hosted
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {parseField(selectedVenue.raw.eventTypes).length > 0 ? (
                      parseField(selectedVenue.raw.eventTypes).map((e: string) => (
                        <span key={e} className="px-2 py-1 bg-purple-50 text-[#b66dff] border border-purple-100 rounded-lg text-[10px] font-bold">
                          {e}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs italic text-slate-300">None specified</span>
                    )}
                  </div>
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
              </>
            )}
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

function parseField(val: any) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    if (typeof val === 'string') {
        return val.split(",").map((s: string) => s.trim()).filter((s: string) => s !== "");
    }
    return [];
  }
}

export default function VenueManagement() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className=" text-[#b66dff]" size={40} />
        </div>
      }
    >
      <VenueManagementContent />
    </Suspense>
  );
}
