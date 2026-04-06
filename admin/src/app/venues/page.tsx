"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Search, 
  Plus, 
  Edit2, 
  MoreHorizontal, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Filter,
  XCircle,
  MapPin,
  Phone,
  IndianRupee,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Trash2,
  Eye,
  Camera,
  Star,
  Users,
  LayoutDashboard,
  Box,
  Image as ImageIcon,
  Save,
  Check
} from "lucide-react";
import { getVenues, Venue, VenueSpace, GalleryItem } from "@/lib/store";
import { cn } from "@/lib/utils";

function VenueManagementContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter');

  const [venues, setVenues] = useState<Venue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [activeTab, setActiveTab] = useState<"basic" | "spaces" | "gallery" | "amenities">("basic");

  // Form State
  const [formData, setFormData] = useState<Partial<Venue>>({
    name: "",
    businessName: "",
    location: { address: "", city: "" },
    contactNumber: "",
    startingRates: { veg: 0, nonVeg: 0 },
    about: "",
    amenities: [],
    availableSpaces: [],
    coverPhotos: [],
    fullGallery: [],
    subscriptionPlan: "None"
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      let data = getVenues();
      if (initialFilter === 'subscribed') {
        data = data.filter(v => v.hasActivePlan);
      } else if (initialFilter === 'unsubscribed') {
        data = data.filter(v => !v.hasActivePlan);
      }
      setVenues(data);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [initialFilter]);

  const filteredVenues = venues.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (type: "create" | "edit", venue?: Venue) => {
    setModalType(type);
    setSelectedVenue(venue || null);
    
    if (type === "edit" && venue) {
      setFormData({ ...venue });
    } else {
      setFormData({
        name: "", 
        businessName: "", 
        location: { address: "", city: "" }, 
        contactNumber: "",
        startingRates: { veg: 0, nonVeg: 0 },
        about: "",
        amenities: [],
        availableSpaces: [],
        coverPhotos: [],
        fullGallery: [],
        subscriptionPlan: "None"
      });
    }
    setIsModalOpen(true);
  };

  const addSpace = () => {
    const newSpace: VenueSpace = { id: Date.now().toString(), name: "", maxCapacity: 0, photos: [] };
    setFormData({ ...formData, availableSpaces: [...(formData.availableSpaces || []), newSpace] });
  };

  const toggleAmenity = (amenity: string) => {
    const current = formData.amenities || [];
    setFormData({
        ...formData,
        amenities: current.includes(amenity) ? current.filter(a => a !== amenity) : [...current, amenity]
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "create") {
      const newV: Venue = { ...formData as Venue, id: `v${venues.length + 1}`, hasActivePlan: formData.subscriptionPlan !== 'None', isVerified: false, status: 'Active', totalLeads: 0, joinedAt: new Date().toISOString(), activity: { received: 0, contacted: 0, booked: 0, lost: 0 } };
      setVenues([newV, ...venues]);
    } else if (modalType === "edit" && selectedVenue) {
      setVenues(venues.map(v => v.id === selectedVenue.id ? { ...v, ...formData } as Venue : v));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl grad-purple flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
               <Building2 size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-black text-slate-800 m-0">Venue Management</h1>
               <p className="text-sm text-slate-400 font-medium mt-1">Manage and edit partner venue profiles</p>
            </div>
         </div>
         <button onClick={() => handleAction("create")} className="px-6 py-3 grad-purple text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-500/25 hover:scale-[1.02] transition-all flex items-center gap-2 active:scale-95">
            <Plus size={18} /> <span>Add New Venue</span>
         </button>
      </div>

      {/* Control Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
         <div className="lg:col-span-8 relative group flex items-center">
            <input type="text" placeholder="Search venues..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="user-input pr-12 pl-4 shadow-sm" />
            <div className="absolute right-4"><Search size={18} className="text-slate-400" /></div>
         </div>
         <div className="lg:col-span-4 flex gap-4">
            <button className="flex-1 bg-white border border-slate-100 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
               <Filter size={18} /> <span>Filters</span>
            </button>
            <button className="flex-1 bg-white border border-slate-100 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
               <TrendingUp size={18} /> <span>Performance</span>
            </button>
         </div>
      </div>

      {/* Venue List */}
      <div className="space-y-4">
         {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
               <Loader2 className="animate-spin text-[#b66dff]" size={40} />
               <p className="text-xs font-black text-slate-400 tracking-widest uppercase">Fetching Partners...</p>
            </div>
         ) : filteredVenues.map((venue, i) => (
           <motion.div key={venue.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-[2rem] p-8 border border-slate-50 shadow-sm hover:shadow-xl hover:scale-[1.005] transition-all group overflow-hidden">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl grad-brand text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-purple-500/10">{venue.name.charAt(0)}</div>
                    <div>
                       <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-slate-800 m-0">{venue.name}</h3>
                          {venue.isVerified ? <ShieldCheck size={18} className="text-[#b66dff]" /> : <ShieldAlert size={18} className="text-amber-500" />}
                       </div>
                       <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-2"><MapPin size={12} className="text-[#b66dff]" /> {venue.location.city}</p>
                       <div className="flex items-center gap-4 mt-3">
                          <span className={cn("px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest", venue.hasActivePlan ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-100")}>{venue.subscriptionPlan}</span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5"><Users size={12} /> {venue.totalLeads} Leads</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <button onClick={() => handleAction("edit", venue)} className="p-4 rounded-2xl bg-slate-50 text-[#b66dff] hover:bg-[#b66dff] hover:text-white transition-all shadow-sm"><Edit2 size={20} /></button>
                    <button className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm"><Trash2 size={20} /></button>
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Slide Modal */}
      <AnimatePresence>
         {isModalOpen && (
            <>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" />
               <motion.div initial={{ opacity: 0, x: 200 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 200 }} className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white z-[101] shadow-2xl flex flex-col">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#b66dff] flex items-center justify-center">{modalType === 'create' ? <Plus size={20} /> : <Edit2 size={20} />}</div>
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">{modalType === 'create' ? 'Onboard New Venue' : 'Edit Venue Profile'}</h2>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><XCircle size={24} className="text-slate-300" /></button>
                  </div>
                  
                  <div className="flex bg-slate-50/50 p-2 gap-2 border-b border-slate-50 px-8">
                     {["basic", "spaces", "gallery", "amenities"].map((t: any) => (
                        <button key={t} onClick={() => setActiveTab(t)} className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === t ? "bg-white text-[#b66dff] shadow-sm" : "text-slate-400 hover:text-slate-600")}>{t}</button>
                     ))}
                  </div>

                  <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                     {activeTab === 'basic' && (
                        <div className="space-y-6">
                           <div className="space-y-2"><label className="label">Venue Name</label><input required className="user-input" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} /></div>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2"><label className="label">Veg Rate</label><input type="number" className="user-input" value={formData.startingRates?.veg} onChange={(e)=>setFormData({...formData, startingRates: {...formData.startingRates!, veg: Number(e.target.value)}})} /></div>
                              <div className="space-y-2"><label className="label">Non-Veg Rate</label><input type="number" className="user-input" value={formData.startingRates?.nonVeg} onChange={(e)=>setFormData({...formData, startingRates: {...formData.startingRates!, nonVeg: Number(e.target.value)}})} /></div>
                           </div>
                        </div>
                     )}
                     <div className="pt-10 sticky bottom-0 bg-white">
                        <button type="submit" className="w-full py-4 grad-purple text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/10 hover:scale-[1.01] transition-all flex items-center justify-center gap-3"><Save size={16} /> Save Changes</button>
                     </div>
                  </form>
               </motion.div>
            </>
         )}
      </AnimatePresence>

      <style jsx global>{`
        .user-input { width: 100%; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 1rem; padding: 1rem; font-size: 0.875rem; font-weight: 700; transition: all 0.3s; outline: none; }
        .user-input:focus { border-color: #b66dff; background: #ffffff; }
        .label { display: block; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
}

export default function VenueManagement() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-[#b66dff]" size={40} /></div>}>
      <VenueManagementContent />
    </Suspense>
  );
}
