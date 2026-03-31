'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import VenueCard from '@/shared/components/VenueCard';
import { 
  Search, 
  MapPin, 
  Users, 
  Star, 
  Filter, 
  ChevronDown, 
  X, 
  CheckCircle2,
  ArrowRight,
  Flame,
  Zap,
  Tag,
  Navigation,
  Check
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

import { MOCK_VENUES } from '@/data/venues';

const FILTER_CONFIG = {
  eventTypes: [
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
  ],
  venueTypes: ["Banquet Hall", "Hotel", "Resort", "Party Lawn", "Farmhouse", "Conference Hall", "Rooftop Venue", "Restaurant", "Club Lounge"],
  amenities: ["Parking Available", "Catering Available", "In-house Decoration", "DJ or Music System", "Air Conditioned Hall", "Outdoor Lawn", "Bridal Room", "Guest Rooms", "Power Backup", "Wheelchair Accessible"],
  capacities: [
    { label: "Under 50 guests", min: 0, max: 50 },
    { label: "50–100 guests", min: 50, max: 100 },
    { label: "100–200 guests", min: 100, max: 200 },
    { label: "200–500 guests", min: 200, max: 500 },
    { label: "500–1000 guests", min: 500, max: 1000 },
    { label: "1000+ guests", min: 1000, max: 100000 }
  ],
  foodTypes: ["Veg", "Non-Veg", "Both"]
};

export default function VenuesPage() {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 10000 });
  const [selectedCapacity, setSelectedCapacity] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [foodPreference, setFoodPreference] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [quickFilters, setQuickFilters] = useState({
    verified: false,
    popular: false,
    bestValue: false,
    newlyAdded: false
  });
  const [sortBy, setSortBy] = useState("Popularity");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isMobileEventOpen, setIsMobileEventOpen] = useState(false);
  const [isMobileVenueOpen, setIsMobileVenueOpen] = useState(false);
  const [showAmenitiesDropdown, setShowAmenitiesDropdown] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Indian Post API search
  useEffect(() => {
    const fetchCities = async () => {
      if (locationSearchQuery.length < 3) {
        setCitySuggestions([]);
        return;
      }

      setIsLoadingCities(true);
      try {
        const type = /^\d+$/.test(locationSearchQuery) ? 'pincode' : 'postoffice';
        const response = await fetch(`https://api.postalpincode.in/${type}/${locationSearchQuery}`);
        const data = await response.json();

        if (data[0].Status === "Success") {
          const suggestions = data[0].PostOffice.map((po: any) => `${po.Name}-${po.Pincode}`);
          // Remove duplicates
          setCitySuggestions(Array.from(new Set(suggestions as string[])));
        } else {
          setCitySuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoadingCities(false);
      }
    };

    const debounceTimer = setTimeout(fetchCities, 500);
    return () => clearTimeout(debounceTimer);
  }, [locationSearchQuery]);

  const [liveVenues, setLiveVenues] = useState<any[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState(true);

  // --- FETCH LIVE VENUES & REALTIME SYNC ---
  useEffect(() => {
    let unsubscribe: () => void;

    const setupLiveVenues = async () => {
      try {
        const { client, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
        
        const fetchVenues = async () => {
          try {
            const response = await fetch('http://127.0.0.1:5000/api/venues');
            const result = await response.json();
            
            if (result.status === 'success') {
              const mapped = result.data.map((doc: any) => ({
                id: doc.$id,
                name: doc.venueName || "Unnamed Venue",
                location: doc.landmark || doc.city || "India",
                city: doc.city || "Unknown",
                type: doc.venueType || "Banquet Hall",
                capacity: parseInt(doc.capacity?.toString().match(/\d+/)?.[0] || '0'),
                price: doc.perPlateVeg || 1500,
                rating: 4.5,
                reviews: 0,
                img: (doc.photos && JSON.parse(doc.photos).length > 0) 
                  ? `https://sgp.cloud.appwrite.io/v1/storage/buckets/venues_photos/files/${JSON.parse(doc.photos)[0]}/view?project=69ae84bc001ca4edf8c2`
                  : "/venues/palace-hotel.png",
                verified: false,
                popular: false,
                isNew: true,
                bestValue: false,
                amenities: doc.amenities ? (typeof doc.amenities === 'string' ? JSON.parse(doc.amenities) : doc.amenities) : [],
                categories: ["Wedding Events", "Engagement Ceremony"],
                foodTypes: ["Veg", "Non-Veg", "Both"]
              }));
              setLiveVenues(mapped);
            }
          } catch (err) {
            console.error('Fetch error:', err);
          }
        };

        await fetchVenues();

        // Realtime Subscription
        unsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.collections.${VENUES_COLLECTION_ID}.documents`,
          () => {
            // Re-fetch everything to ensure consistent mapping and order
            fetchVenues();
          }
        );
      } catch (err) {
        console.error('Failed to setup live venues:', err);
      } finally {
        setIsLiveLoading(false);
      }
    };

    setupLiveVenues();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // --- FILTER LOGIC ---
  const allVenues = useMemo(() => [...liveVenues, ...MOCK_VENUES], [liveVenues]);

  const filteredVenues = useMemo(() => {
    return allVenues.filter(venue => {
      // Adjusted City Filtering for higher default visibility
      if (selectedCity && selectedCity !== "All Cities") {
        const cityOnly = selectedCity.split('-')[0].toLowerCase();
        const venueCity = venue.city.toLowerCase();
        const venueLocality = venue.location.toLowerCase();
        
        // Match if selected city is in venue city/locality OR venue city is in selected string
        if (!venueCity.includes(cityOnly) && !cityOnly.includes(venueCity) && !venueLocality.includes(cityOnly)) {
          return false;
        }
      }
      
      if (selectedEvent && !venue.categories.includes(selectedEvent)) return false;
      if (selectedVenueTypes.length > 0 && !selectedVenueTypes.includes(venue.type)) return false;
      if (venue.price < budgetRange.min || venue.price > budgetRange.max) return false;
      if (venue.capacity < selectedCapacity) return false;
      if (selectedAmenities.length > 0 && !selectedAmenities.every(a => venue.amenities.includes(a))) return false;
      if (foodPreference && foodPreference !== "Both" && !venue.foodTypes.includes(foodPreference)) return false;
      if (venue.rating < minRating) return false;
      if (quickFilters.verified && !venue.verified) return false;
      if (quickFilters.popular && !venue.popular) return false;
      if (quickFilters.bestValue && !venue.bestValue) return false;
      if (quickFilters.newlyAdded && !venue.isNew) return false;
      
      return true;
    }).sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Top Rated") return b.rating - a.rating;
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });
  }, [allVenues, selectedCity, selectedEvent, selectedVenueTypes, budgetRange, selectedCapacity, selectedAmenities, foodPreference, minRating, quickFilters, sortBy]);

  const clearFilters = () => {
    setSelectedCity("All Cities");
    setSelectedEvent("");
    setSelectedVenueTypes([]);
    setBudgetRange({ min: 0, max: 10000 });
    setSelectedCapacity(0);
    setSelectedAmenities([]);
    setFoodPreference(null);
    setMinRating(0);
    setLocationSearchQuery("");
    setQuickFilters({ verified: false, popular: false, bestValue: false, newlyAdded: false });
  };

  const handleToggle = (list: string[], setList: any, item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block w-[320px] shrink-0">
             <div className="sticky top-6 space-y-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-pd-soft overflow-y-auto max-h-[calc(100vh-100px)] no-scrollbar">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-xl font-black text-slate-900 italic">Filters</h3>
                   <button onClick={clearFilters} className="text-[10px] font-black text-pd-red uppercase tracking-widest hover:underline">Clear All</button>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Location</label>
                   <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="City or Pincode..." 
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold transition-all focus:border-pd-red outline-none"
                        value={locationSearchQuery}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                        onChange={(e) => {
                          setLocationSearchQuery(e.target.value);
                          if (e.target.value.length < 3) setCitySuggestions([]);
                        }}
                      />
                      {isLoadingCities && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-pd-red border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}

                       <AnimatePresence>
                        {(isInputFocused && citySuggestions.length > 0) && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[250] max-h-60 overflow-y-auto no-scrollbar overflow-x-hidden"
                          >
                             {citySuggestions.map((city, idx) => (
                               <button 
                                 key={idx}
                                 onClick={() => {
                                   setSelectedCity(city);
                                   setLocationSearchQuery("");
                                   setCitySuggestions([]);
                                 }}
                                 className="w-full text-left px-5 py-4 hover:bg-slate-50 text-[11px] font-black text-slate-700 uppercase tracking-widest border-b border-slate-50 last:border-0"
                               >
                                 {city}
                               </button>
                             ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                                {/* Event Type Custom Dropdown */}
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Event Type</label>
                   <div className="relative">
                      <button 
                        onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                        className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black flex items-center justify-between hover:border-pd-red transition-all"
                      >
                         <span className={selectedEvent ? "text-slate-900" : "text-slate-400"}>
                            {selectedEvent || "All Events"}
                         </span>
                         <ChevronDown className={`text-slate-400 transition-transform ${isEventDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                      </button>

                      <AnimatePresence>
                        {isEventDropdownOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[200] max-h-60 overflow-y-auto p-2 space-y-1 no-scrollbar"
                          >
                             <button 
                               onClick={() => { setSelectedEvent(""); setIsEventDropdownOpen(false); }}
                               className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-xs font-black text-slate-500 hover:text-pd-red transition-colors"
                             >
                               All Events
                             </button>
                             {FILTER_CONFIG.eventTypes.map(e => (
                               <button 
                                 key={e}
                                 onClick={() => { setSelectedEvent(e); setIsEventDropdownOpen(false); }}
                                 className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-colors ${
                                   selectedEvent === e ? 'bg-pd-red/5 text-pd-red' : 'hover:bg-slate-50 text-slate-500'
                                 }`}
                               >
                                 {e}
                               </button>
                             ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>  </div>

                {/* Venue Types */}
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Venue Type</label>
                   <div className="flex flex-wrap gap-2">
                      {FILTER_CONFIG.venueTypes.map(t => (
                        <button 
                          key={t} 
                          onClick={() => handleToggle(selectedVenueTypes, setSelectedVenueTypes, t)}
                          className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                            selectedVenueTypes.includes(t) ? 'bg-pd-red border-pd-red text-white' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Venue Rating</label>
                   <div className="flex flex-col gap-2">
                      {[4, 3, 2].map(star => (
                        <button 
                          key={star}
                          onClick={() => setMinRating(minRating === star ? 0 : star)}
                          className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-between ${
                            minRating === star ? 'bg-yellow-400/5 border-yellow-400 text-yellow-600' : 'bg-slate-50 border-slate-50 text-slate-500'
                          }`}
                        >
                          <span className="flex items-center gap-1">
                             <Star size={14} className={minRating === star ? "fill-yellow-400" : ""} /> {star} Stars & Above
                          </span>
                          {minRating === star && <Check size={14} />}
                        </button>
                      ))}
                   </div>
                </div>




                {/* Budget Text Inputs */}
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price Per Plate</label>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-1">Min Price</span>
                         <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                            <input 
                              type="number" 
                              value={budgetRange.min}
                              onChange={(e) => setBudgetRange({ ...budgetRange, min: parseInt(e.target.value) || 0 })}
                              className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black outline-none focus:border-pd-red transition-all"
                              placeholder="0"
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-1">Max Price</span>
                         <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                            <input 
                              type="number" 
                              value={budgetRange.max}
                              onChange={(e) => setBudgetRange({ ...budgetRange, max: parseInt(e.target.value) || 0 })}
                              className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black outline-none focus:border-pd-red transition-all"
                              placeholder="10000"
                            />
                         </div>
                      </div>

                   </div>
                </div>

                {/* Capacity Slider */}
                <div className="space-y-4 italic">
                   <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Min. Capacity</label>
                      <span className="text-xs font-black text-pd-purple">{selectedCapacity}+ Guests</span>
                   </div>
                   <input 
                      type="range" min="0" max="10000" step="100" 
                      value={selectedCapacity} 
                      onChange={(e) => setSelectedCapacity(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pd-purple"
                   />
                   <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-widest pt-1">
                      <span>Min: 0</span>
                      <span>Max: 10,000</span>
                   </div>
                </div>

                {/* Amenities Multi-Select Dropdown */}
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amenities</label>
                   <div className="relative">
                      <button 
                        onClick={() => setShowAmenitiesDropdown(!showAmenitiesDropdown)}
                        className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black flex items-center justify-between hover:border-pd-red transition-all"
                      >
                         <span className={selectedAmenities.length > 0 ? "text-pd-purple" : "text-slate-400"}>
                            {selectedAmenities.length > 0 ? `${selectedAmenities.length} Selected` : "Select Amenities"}
                         </span>
                         <ChevronDown className={`text-slate-400 transition-transform ${showAmenitiesDropdown ? 'rotate-180' : ''}`} size={16} />
                      </button>

                      <AnimatePresence>
                        {showAmenitiesDropdown && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="relative mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-[200] max-h-60 overflow-y-auto p-4 space-y-2 no-scrollbar"
                          >
                             {FILTER_CONFIG.amenities.map(a => (
                               <label key={a} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                    selectedAmenities.includes(a) ? 'bg-pd-purple border-pd-purple' : 'bg-white border-slate-200'
                                  }`}>
                                    {selectedAmenities.includes(a) && <Check size={12} className="text-white" />}
                                  </div>
                                  <input 
                                     type="checkbox" className="hidden" 
                                     checked={selectedAmenities.includes(a)}
                                     onChange={() => handleToggle(selectedAmenities, setSelectedAmenities, a)}
                                  />
                                  <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                                    selectedAmenities.includes(a) ? 'text-pd-purple' : 'text-slate-500 group-hover:text-slate-700'
                                  }`}>{a}</span>
                               </label>
                             ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>

                {/* Food Preference */}
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Food Preference</label>
                   <div className="flex gap-2">
                      {FILTER_CONFIG.foodTypes.map(f => (
                        <button 
                          key={f}
                          onClick={() => setFoodPreference(foodPreference === f ? null : f)}
                          className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            foodPreference === f ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
          </aside>

          {/* MAIN LISTINGS */}
          <main className="flex-1 min-w-0">
             <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                <div className="flex gap-2 items-center overflow-x-auto no-scrollbar flex-nowrap md:flex-wrap pb-2 md:pb-0">
                    {selectedCity !== "All Cities" && (
                      <div className="shrink-0 px-3 py-1.5 bg-pd-red/10 border border-pd-red/20 rounded-full text-[9px] font-black text-pd-red uppercase flex items-center gap-2">
                        {selectedCity} <button onClick={() => setSelectedCity("All Cities")}><X size={10} /></button>
                      </div>
                    )}
                    {selectedEvent && (
                      <div className="shrink-0 px-3 py-1.5 bg-pd-purple/10 border border-pd-purple/20 rounded-full text-[9px] font-black text-pd-purple uppercase flex items-center gap-2">
                        {selectedEvent} <button onClick={() => setSelectedEvent("")}><X size={10} /></button>
                      </div>
                    )}
                    {selectedCapacity > 0 && (
                     <div className="shrink-0 px-3 py-1.5 bg-pd-pink/10 border border-pd-pink/20 rounded-full text-[9px] font-black text-pd-pink uppercase flex items-center gap-2">
                       {selectedCapacity}+ Guests <button onClick={() => setSelectedCapacity(0)}><X size={10} /></button>
                     </div>
                    )}
                    {selectedAmenities.length > 0 && selectedAmenities.map(a => (
                      <div key={a} className="shrink-0 px-3 py-1.5 bg-pd-blue/10 border border-pd-blue/20 rounded-full text-[9px] font-black text-pd-blue uppercase flex items-center gap-2">
                        {a} <button onClick={() => handleToggle(selectedAmenities, setSelectedAmenities, a)}><X size={10} /></button>
                      </div>
                    ))}
                </div>
                
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort:</span>
                   <div className="relative">
                      <button 
                        onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                        className="flex items-center gap-2 text-sm font-black text-slate-900 group"
                      >
                         {sortBy}
                         <ChevronDown className={`text-slate-400 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                      </button>

                      <AnimatePresence>
                        {isSortDropdownOpen && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute top-full right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[300] p-2 space-y-1 w-48"
                          >
                             {["Popularity", "Top Rated", "Price: Low to High", "Price: High to Low"].map(opt => (
                               <button 
                                 key={opt}
                                 onClick={() => { setSortBy(opt); setIsSortDropdownOpen(false); }}
                                 className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-colors ${
                                   sortBy === opt ? 'bg-pd-red/5 text-pd-red' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                 }`}
                               >
                                 {opt}
                               </button>
                             ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                {filteredVenues.length > 0 ? (
                  filteredVenues.map((v, i) => (
                    <VenueCard key={v.id} venue={v} index={i} />
                  ))
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-24 text-center">
                     <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Filter size={40} />
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 mb-2">No venues match those requirements</h3>
                     <p className="text-slate-500 font-medium mb-8">Try adjusting your filters or search criteria.</p>
                     <button onClick={clearFilters} className="pd-btn-primary !px-10 !py-4 text-[10px] font-black tracking-widest uppercase italic">Reset All Filters</button>
                  </motion.div>
                )}
                </AnimatePresence>
             </div>
          </main>
        </div>
      </div>

      {/* MOBILE TRIGGER & DRAWER */}
      <div className="lg:hidden fixed bottom-10 left-6 z-[200]">
         <button 
           onClick={() => setShowMobileFilters(true)}
           className="bg-white text-slate-900 w-16 h-16 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-center active:scale-90 transition-all border border-slate-100"
         >
            <Filter size={24} />
         </button>
      </div>

      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowMobileFilters(false)}
               className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[300]"
            />
            <motion.div 
               initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[48px] z-[310] max-h-[92vh] flex flex-col shadow-2xl"
            >
               <div className="p-10 flex flex-col h-full overflow-hidden">
                  <div className="flex items-center justify-between mb-8 shrink-0">
                     <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Refine Results</h3>
                     <button onClick={() => setShowMobileFilters(false)} className="p-3 bg-slate-100 rounded-full"><X size={20} /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto no-scrollbar pb-10 space-y-8">
                     {/* Mobile Location Search */}
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                        <div className="relative">
                           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                           <input 
                             type="text" 
                             placeholder="City or Pincode..." 
                             className="w-full pl-14 pr-12 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-[11px] font-black outline-none focus:border-pd-red transition-all"
                             value={locationSearchQuery}
                             onFocus={() => setIsInputFocused(true)}
                             onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                             onChange={(e) => {
                               setLocationSearchQuery(e.target.value);
                               if (e.target.value.length < 3) setCitySuggestions([]);
                             }}
                           />
                           {isLoadingCities && (
                             <div className="absolute right-6 top-1/2 -translate-y-1/2">
                               <div className="w-5 h-5 border-2 border-pd-red border-t-transparent rounded-full animate-spin"></div>
                             </div>
                           )}

                           <AnimatePresence>
                             {(isInputFocused && citySuggestions.length > 0) && (
                               <motion.div 
                                 initial={{ opacity: 0, scale: 0.95 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 exit={{ opacity: 0, scale: 0.95 }}
                                 className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-3xl shadow-2xl z-[400] max-h-60 overflow-y-auto p-2 space-y-1 no-scrollbar"
                               >
                                  {citySuggestions.map((city, idx) => (
                                    <button 
                                      key={idx}
                                      onClick={() => {
                                        setSelectedCity(city);
                                        setLocationSearchQuery("");
                                        setCitySuggestions([]);
                                      }}
                                      className="w-full text-left px-5 py-4 hover:bg-slate-50 text-[10px] font-black text-slate-700 uppercase tracking-widest rounded-2xl active:bg-slate-100"
                                    >
                                      {city}
                                    </button>
                                  ))}
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>
                     </div>

                     {/* Custom Mobile Event Dropdown */}
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Type</label>
                        <div className="relative">
                           <button 
                             onClick={() => setIsMobileEventOpen(!isMobileEventOpen)}
                             className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-[11px] font-black flex items-center justify-between"
                           >
                             <span className={selectedEvent ? "text-slate-900" : "text-slate-400"}>
                               {selectedEvent || "All Events"}
                             </span>
                             <ChevronDown className={`text-slate-400 transition-transform ${isMobileEventOpen ? 'rotate-180' : ''}`} size={20} />
                           </button>
                           <AnimatePresence>
                             {isMobileEventOpen && (
                               <motion.div 
                                 initial={{ opacity: 0, y: -10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: -10 }}
                                 className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-3xl shadow-xl z-[400] max-h-60 overflow-y-auto p-2 space-y-1 no-scrollbar"
                               >
                                 <button 
                                   onClick={() => { setSelectedEvent(""); setIsMobileEventOpen(false); }}
                                   className="w-full text-left px-5 py-4 hover:bg-slate-50 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest"
                                 >
                                   All Events
                                 </button>
                                 {FILTER_CONFIG.eventTypes.map(e => (
                                   <button 
                                     key={e}
                                     onClick={() => { setSelectedEvent(e); setIsMobileEventOpen(false); }}
                                     className={`w-full text-left px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                                       selectedEvent === e ? 'bg-pd-red/5 text-pd-red' : 'text-slate-500 hover:bg-slate-50'
                                     }`}
                                   >
                                     {e}
                                   </button>
                                 ))}
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Per Plate</label>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Min Price</span>
                              <input 
                                 type="number" 
                                 value={budgetRange.min}
                                 onChange={(e) => setBudgetRange({ ...budgetRange, min: parseInt(e.target.value) || 0 })}
                                 className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black outline-none focus:border-pd-red"
                                 placeholder="Min"
                              />
                           </div>
                           <div className="space-y-2">
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Max Price</span>
                              <input 
                                 type="number" 
                                 value={budgetRange.max}
                                 onChange={(e) => setBudgetRange({ ...budgetRange, max: parseInt(e.target.value) || 0 })}
                                 className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black outline-none focus:border-pd-red"
                                 placeholder="Max"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest Capacity</label>
                        <div className="italic">
                           <div className="flex justify-between items-center mb-4">
                              <span className="text-[10px] font-black text-pd-purple">{selectedCapacity}+ Guests</span>
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Max: 10,000</span>
                           </div>
                           <input 
                              type="range" min="0" max="10000" step="100" 
                              value={selectedCapacity} 
                              onChange={(e) => setSelectedCapacity(parseInt(e.target.value))}
                              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pd-purple"
                           />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amenities</label>
                        <div className="grid grid-cols-2 gap-2">
                           {FILTER_CONFIG.amenities.map(a => (
                             <button 
                               key={a}
                               onClick={() => handleToggle(selectedAmenities, setSelectedAmenities, a)}
                               className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase transition-all border text-left flex items-center justify-between ${
                                 selectedAmenities.includes(a) ? 'bg-pd-red border-pd-red text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500'
                               }`}
                             >
                                <span className="truncate">{a}</span>
                                {selectedAmenities.includes(a) && <Check size={10} />}
                             </button>
                           ))}
                        </div>
                     </div>

                     {/* Custom Mobile Venue Type Dropdown */}
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue Type</label>
                        <div className="relative">
                           <button 
                             onClick={() => setIsMobileVenueOpen(!isMobileVenueOpen)}
                             className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-[11px] font-black flex items-center justify-between"
                           >
                             <span className={selectedVenueTypes.length > 0 ? "text-slate-900" : "text-slate-400"}>
                               {selectedVenueTypes.length > 1 ? `${selectedVenueTypes.length} Types` : (selectedVenueTypes[0] || "All Venue Types")}
                             </span>
                             <ChevronDown className={`text-slate-400 transition-transform ${isMobileVenueOpen ? 'rotate-180' : ''}`} size={20} />
                           </button>
                           <AnimatePresence>
                             {isMobileVenueOpen && (
                               <motion.div 
                                 initial={{ opacity: 0, y: -10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: -10 }}
                                 className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-3xl shadow-xl z-[400] max-h-60 overflow-y-auto p-2 space-y-1 no-scrollbar"
                               >
                                 <button 
                                   onClick={() => { setSelectedVenueTypes([]); setIsMobileVenueOpen(false); }}
                                   className="w-full text-left px-5 py-4 hover:bg-slate-50 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest"
                                 >
                                   All Venue Types
                                 </button>
                                 {FILTER_CONFIG.venueTypes.map(t => (
                                   <button 
                                     key={t}
                                     onClick={() => { handleToggle(selectedVenueTypes, setSelectedVenueTypes, t); }}
                                     className={`w-full text-left px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                                       selectedVenueTypes.includes(t) ? 'bg-pd-red/5 text-pd-red' : 'text-slate-500 hover:bg-slate-50'
                                     }`}
                                   >
                                     {t}
                                   </button>
                                 ))}
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-4 shrink-0">
                     <button onClick={clearFilters} className="py-5 bg-slate-50 rounded-3xl text-[10px] font-black uppercase text-slate-400 tracking-widest">Reset</button>
                     <button onClick={() => setShowMobileFilters(false)} className="pd-btn-primary py-5 text-[10px] font-black uppercase tracking-widest italic">Show Results</button>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
