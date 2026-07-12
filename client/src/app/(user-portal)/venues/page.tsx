'use client';

import { motion, AnimatePresence } from 'framer-motion';
import VenueCard from '@/shared/components/VenueCard';
import { 
  Search, 
  MapPin, 
  Star, 
  Filter, 
  ChevronDown, 
  X, 
  ArrowRight,
  Check
} from 'lucide-react';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';



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
  venueTypes: ["Banquet Hall", "Hotel", "Resort", "Party Lawn", "Restaurant", "Farmhouse", "Rooftop Venue", "Conference Hall", "Club Lounge", "Marriage Garden", "Heritage Hotel", "Villa", "Boutique Resort"],
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

 

function VenuesContent() {
  const searchParams = useSearchParams();
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      // Find the event type that matches the URL slug
      const matched = FILTER_CONFIG.eventTypes.find(e => 
        e.toLowerCase().replace(/\s+/g, '-') === typeParam.toLowerCase()
      );
      if (matched) setSelectedEvent(matched);
    }
    
    const locationParam = searchParams.get('location');
    if (locationParam) {
      setSelectedCities(locationParam.split(','));
    }
  }, [searchParams]);

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
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCities, selectedEvent, selectedVenueTypes, budgetRange, selectedCapacity, selectedAmenities, foodPreference, minRating, quickFilters, sortBy]);

  // Indian Post API search
  useEffect(() => {
    const fetchCities = async () => {
      if (locationSearchQuery.length < 3) {
        setCitySuggestions([]);
        return;
      }

      // Special Case for Haldwani (263139) and nearby areas
      if (locationSearchQuery === '263139') {
        setCitySuggestions([
          'Haldwani-263139',
          'Kathgodam-263126',
          'Lalkuan-263131',
          'Mukhani-263139',
          'Kaladhungi-263140',
          'Bhowali-263132',
          'Nainital-263001',
          'Damuadhunga-263126',
          'Dahariya-263139',
          'Lamachaur-263139',
          'Kamaluaganja-263139'
        ]);
        setIsLoadingCities(false);
        return;
      }

      setIsLoadingCities(true);
      try {
        const type = /^\d+$/.test(locationSearchQuery) ? 'pincode' : 'postoffice';
        const response = await fetch(`https://api.postalpincode.in/${type}/${locationSearchQuery}`);
        const data = await response.json();

        if (data[0].Status === "Success") {
          const offices = data[0].PostOffice;
          const filtered = offices
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((po: any) => po.State === 'Uttarakhand')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((po: any) => `${po.Name}-${po.Pincode}`);
          
          if (filtered.length === 0 && offices.length > 0) {
            setCitySuggestions(['ERROR: Only Uttarakhand Pincodes allowed']);
          } else {
            setCitySuggestions(Array.from(new Set(filtered as string[])));
          }
        } else {
          setCitySuggestions(['ERROR: No results found']);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [liveVenues, setLiveVenues] = useState<any[]>([]);

  // --- FETCH LIVE VENUES & REALTIME SYNC ---
  useEffect(() => {
    let unsubscribe: () => void;
    let isMounted = true;

    const setupLiveVenues = async () => {
      try {
        const { client, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
        
        const fetchVenues = async () => {
          try {
            const envBase = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
            const base = typeof window !== 'undefined' && envBase.includes('localhost') ? envBase.replace('localhost', window.location.hostname) : envBase;
            const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
            const response = await fetch(`${baseUrl}/venues?verified=true`);
            const result = await response.json();
            
            if (result.status === 'success' && isMounted) {
              const { getAppwriteImageUrl, parsePhotos } = await import('@/shared/utils/image');
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const mapped = result.data.map((doc: any) => {
                const photos = parsePhotos(doc.photos);
                // Is venue on a paid subscription plan?
                const hasPaidPlan = doc.subscriptionPlan &&
                  doc.subscriptionPlan !== 'free' &&
                  doc.subscriptionPlan !== 'None' &&
                  doc.subscriptionPlan !== '';

                // Verify the subscription hasn't expired
                const isSubscriptionActive = hasPaidPlan && (!doc.subscriptionExpiry || new Date(doc.subscriptionExpiry) > new Date());

                // Profile completeness: check ACTUAL CONTENT only.
                // We do NOT require onboardingComplete because:
                //   - Free venues never go through paid onboarding flow
                //   - The flag is unreliable; what matters is visible content
                // A venue is "complete" if it has all three of:
                //   1. A real venue name
                //   2. At least one photo uploaded
                //   3. A valid capacity set
                const hasName = !!(doc.venueName && doc.venueName.trim() && doc.venueName.trim() !== 'Unnamed Venue');
                const hasPhotos = photos.length > 0;
                const hasCapacity = !!(doc.capacity && parseInt(doc.capacity) > 0);
                const profileComplete = hasName && hasPhotos && hasCapacity;

                // Rating (from Appwrite field if stored, else 0)
                const venueRating = parseFloat(doc.rating) || 0;

                return {
                  id: doc.$id,
                  name: doc.venueName || "Unnamed Venue",
                  location: doc.landmark || doc.city || "India",
                  city: doc.city || "Delhi",
                  type: doc.venueType || "Banquet Hall",
                  capacity: parseInt(doc.capacity) || 500,
                  price: doc.perPlateVeg ? parseFloat(doc.perPlateVeg) : null,  // null = no price set
                  pincode: doc.pincode?.toString() || "",
                  rating: venueRating,
                  reviews: doc.totalReviews || 0,
                  img: photos.length > 0 ? getAppwriteImageUrl(photos[0]?.id || photos[0]) : "",
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  images: photos.map((p: any) => getAppwriteImageUrl(p?.id || p)),
                  verified: doc.isVerified || false,
                  popular: doc.status === 'active',
                  isNew: doc.$createdAt
                    ? (Date.now() - new Date(doc.$createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000
                    : false,
                  bestValue: true,
                  amenities: (doc.amenities ? (typeof doc.amenities === 'string' ? JSON.parse(doc.amenities) : doc.amenities) : ["AC Hall", "Parking"]),
                  categories: (doc.eventTypes ? (typeof doc.eventTypes === 'string' ? JSON.parse(doc.eventTypes) : doc.eventTypes) : ["Wedding"]),
                  foodTypes: (() => {
                    let parsed = doc.foodTypes ? (typeof doc.foodTypes === 'string' ? JSON.parse(doc.foodTypes) : doc.foodTypes) : [];
                    if (!Array.isArray(parsed) || parsed.length === 0) {
                      parsed = [];
                      if (doc.perPlateVeg) parsed.push('Veg');
                      if (doc.perPlateNonVeg) parsed.push('Non-Veg');
                      if (parsed.length === 0) parsed.push('Veg');
                    }
                    return parsed;
                  })(),
                  // Smart ranking fields
                  isPaid: !!isSubscriptionActive,
                  profileComplete,
                  subscriptionPlan: doc.subscriptionPlan || 'free',
                  createdAt: doc.$createdAt || '',
                };
              });
              setLiveVenues(mapped);
            }
          } catch (err) {
            console.error('Fetch error:', err);
          }
        };

        await fetchVenues();

        // Realtime Subscription (Delayed)
        setTimeout(() => {
          if (!isMounted) return;
          const sub = client.subscribe(
            `databases.${DATABASE_ID}.collections.${VENUES_COLLECTION_ID}.documents`,
            () => {
              fetchVenues();
            }
          );
          unsubscribe = () => sub();
        }, 100);

      } catch (err) {
        console.error('Failed to setup live venues:', err);
      } finally {
        // cleanup
      }
    };

    setupLiveVenues();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // --- FILTER LOGIC ---
  const allVenues = liveVenues;

  const filteredVenues = useMemo(() => {
    return allVenues.filter(venue => {
      // 0. Only show verified (approved) venues to visitors
      if (!venue.verified) return false;
      
      
      // 1. Pincode/Location Filtering
      if (selectedCities.length > 0) {
        const venuePincode = (venue.pincode || "").toLowerCase();
        const venueCity = (venue.city || "").toLowerCase();
        
        const hasMatch = selectedCities.some(searchQuery => {
          const query = searchQuery.toLowerCase();
          const parts = query.split('-');
          const pincodeInQuery = parts.length > 1 ? parts[1] : (/\d{6}/.test(query) ? query : null);
          const cityInQuery = parts[0];

          if (pincodeInQuery && venuePincode === pincodeInQuery) return true;
          if (venueCity.includes(cityInQuery) || venuePincode.includes(query)) return true;
          return false;
        });
        
        if (!hasMatch) return false;
      }
      
      // 2. Event Type Filtering (The core fix)
      if (selectedEvent) {
        if (!venue.categories || !Array.isArray(venue.categories) || venue.categories.length === 0) {
           return false; // Or should we show if no categories? Usually hide.
        }
        const hasMatch = venue.categories.some((c: string) => 
          c.toLowerCase().includes(selectedEvent.toLowerCase()) || 
          selectedEvent.toLowerCase().includes(c.toLowerCase())
        );
        if (!hasMatch) return false;
      }
      
      // 3. Other Filters
      if (selectedVenueTypes.length > 0 && !selectedVenueTypes.includes(venue.type)) return false;
      // Budget filter: skip venues with no price (null) — only filter if price is known
      if (venue.price !== null) {
        if (venue.price < budgetRange.min || venue.price > budgetRange.max) return false;
      }
      if (venue.capacity < selectedCapacity) return false;
      
      const venueAmenities = Array.isArray(venue.amenities) ? venue.amenities : [];
      if (selectedAmenities.length > 0 && !selectedAmenities.every(a => venueAmenities.includes(a))) return false;
      
      const venueFoodTypes = Array.isArray(venue.foodTypes) ? venue.foodTypes : [];
      if (foodPreference && foodPreference !== "Both" && !venueFoodTypes.includes(foodPreference)) return false;
      
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
  }, [allVenues, selectedCities, selectedEvent, selectedVenueTypes, budgetRange, selectedCapacity, selectedAmenities, foodPreference, minRating, quickFilters, sortBy]);

  // ── Smart Ranking: Paid → Free ──
  const rankedVenues = useMemo(() => {
    // PAID venues: only appear at top if they have complete content
    // (name + at least one photo + capacity set)
    const premium = filteredVenues.filter(v =>
      v.isPaid === true && v.profileComplete === true
    );

    // others: Everything that is NOT in premium (this includes free venues AND paid venues with incomplete profiles)
    const others = filteredVenues.filter(v => 
      !(v.isPaid === true && v.profileComplete === true)
    );

    // Weighted shuffle: higher rating = better position, with slight randomness
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const weightedShuffle = (venues: any[]) => {
      if (venues.length <= 1) return venues;
      return [...venues]
        .map(v => ({ v, score: (v.rating || 0) + Math.random() * 0.5 }))
        .sort((a, b) => b.score - a.score)
        .map(item => item.v);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortGroup = (venues: any[]) => {
      if (sortBy === 'Price: Low to High') return [...venues].sort((a, b) => (a.price || 0) - (b.price || 0));
      if (sortBy === 'Price: High to Low') return [...venues].sort((a, b) => (b.price || 0) - (a.price || 0));
      if (sortBy === 'Top Rated') return [...venues].sort((a, b) => b.rating - a.rating);
      return weightedShuffle(venues);
    };

    return {
      premium: sortGroup(premium),
      others: sortGroup(others),
    };
  }, [filteredVenues, sortBy]);

  const resultsByLocation = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applyLocation = (venues: any[]) => {
      if (selectedCities.length === 0) return venues;
      return venues.filter(v => {
        return selectedCities.some(searchQuery => {
          const query = searchQuery.toLowerCase();
          const parts = query.split('-');
          const pincodeInQuery = parts.length > 1 ? parts[1] : (/\d{6}/.test(query) ? query : null);
          const cityInQuery = parts[0];
          if (pincodeInQuery && v.pincode === pincodeInQuery) return true;
          if (v.city.toLowerCase().includes(cityInQuery) || v.pincode === query) return true;
          return false;
        });
      });
    };
    return {
      premium: applyLocation(rankedVenues.premium),
      others: applyLocation(rankedVenues.others),
    };
  }, [selectedCities, rankedVenues]);

  const clearFilters = () => {
    setSelectedCities([]);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleToggle = (list: string[], setList: any, item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const totalPages = Math.ceil(resultsByLocation.others.length / ITEMS_PER_PAGE);
  const paginatedOthers = resultsByLocation.others.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-slate-50 relative pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 pt-24 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block w-[320px] shrink-0">
             <div className="sticky top-6 space-y-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-y-auto max-h-[calc(100vh-40px)] no-scrollbar">
                <div className="flex items-center justify-between mb-4 pb-6 border-b border-slate-50">
                   <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Filters</h3>
                   <button onClick={clearFilters} className="text-xs font-semibold text-pd-pink hover:text-white transition-colors bg-pd-pink/10 hover:bg-pd-pink px-4 py-2 rounded-full">Clear All</button>
                </div>

                <div className="space-y-4">
                   <label className="text-xs font-semibold text-slate-400 ">Location</label>
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
                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-40 max-h-60 overflow-y-auto no-scrollbar overflow-x-hidden"
                          >
                             {citySuggestions.map((city, idx) => (
                               <button 
                                 key={idx}
                                 onClick={() => {
                                   if (!selectedCities.includes(city)) {
                                     setSelectedCities([...selectedCities, city]);
                                   }
                                   setLocationSearchQuery("");
                                   setCitySuggestions([]);
                                 }}
                                 className="w-full text-left px-5 py-4 hover:bg-slate-50 text-sm font-medium text-slate-700 border-b border-slate-50 last:border-0"
                               >
                                 {city}
                               </button>
                             ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>

                   {/* Selected Cities Chips */}
                   <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCities.map((city, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-pd-red/5 text-pd-red px-3 py-1.5 rounded-xl border border-pd-red/10">
                          <span className="text-xs font-semibold">{city}</span>
                          <button 
                            onClick={() => setSelectedCities(selectedCities.filter(c => c !== city))}
                            className="hover:text-slate-900 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                   </div>
                                {/* Event Type Custom Dropdown */}
                <div className="space-y-4">
                   <label className="text-xs font-semibold text-slate-400 ">Event Type</label>
                   <div className="relative">
                      <button 
                        onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                        className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium flex items-center justify-between hover:border-pd-red transition-all"
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
                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-40 max-h-60 overflow-y-auto p-2 space-y-1 no-scrollbar"
                          >
                             <button 
                               onClick={() => { setSelectedEvent(""); setIsEventDropdownOpen(false); }}
                               className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-xs font-medium text-slate-500 hover:text-pd-red transition-colors"
                             >
                               All Events
                             </button>
                             {FILTER_CONFIG.eventTypes.map(e => (
                               <button 
                                 key={e}
                                 onClick={() => { setSelectedEvent(e); setIsEventDropdownOpen(false); }}
                                 className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-colors ${
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
                   <label className="text-xs font-semibold text-slate-400 ">Venue Type</label>
                   <div className="flex flex-wrap gap-2">
                      {FILTER_CONFIG.venueTypes.map(t => (
                        <button 
                          key={t} 
                          onClick={() => handleToggle(selectedVenueTypes, setSelectedVenueTypes, t)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
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
                   <label className="text-xs font-semibold text-slate-400 ">Venue Rating</label>
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
                   <label className="text-xs font-semibold text-slate-400 ">Price Per Plate</label>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <span className="text-xs font-medium text-slate-400 pl-1">Min Price</span>
                         <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                            <input 
                              type="number" 
                              value={budgetRange.min}
                              onChange={(e) => setBudgetRange({ ...budgetRange, min: parseInt(e.target.value) || 0 })}
                              className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium outline-none focus:border-pd-red transition-all"
                              placeholder="0"
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <span className="text-xs font-medium text-slate-400 pl-1">Max Price</span>
                         <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                            <input 
                              type="number" 
                              value={budgetRange.max}
                              onChange={(e) => setBudgetRange({ ...budgetRange, max: parseInt(e.target.value) || 0 })}
                              className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium outline-none focus:border-pd-red transition-all"
                              placeholder="10000"
                            />
                         </div>
                      </div>

                   </div>
                </div>

                {/* Capacity Slider */}
                <div className="space-y-4 ">
                   <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-400 ">Min. Capacity</label>
                      <span className="text-xs font-medium text-pd-purple">{selectedCapacity}+ Guests</span>
                   </div>
                   <input 
                      type="range" min="0" max="10000" step="100" 
                      value={selectedCapacity} 
                      onChange={(e) => setSelectedCapacity(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pd-purple"
                   />
                   <div className="flex justify-between text-xs font-medium text-slate-300 pt-1">
                      <span>Min: 0</span>
                      <span>Max: 10,000</span>
                   </div>
                </div>

                {/* Amenities Multi-Select Dropdown */}
                <div className="space-y-4">
                   <label className="text-xs font-semibold text-slate-400 ">Amenities</label>
                   <div className="relative">
                      <button 
                        onClick={() => setShowAmenitiesDropdown(!showAmenitiesDropdown)}
                        className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium flex items-center justify-between hover:border-pd-red transition-all"
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
                            className="relative mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-40 max-h-60 overflow-y-auto p-4 space-y-2 no-scrollbar"
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
                                  <span className={`text-sm font-medium transition-colors ${
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
                   <label className="text-xs font-semibold text-slate-400 ">Food Preference</label>
                   <div className="flex gap-2">
                      {FILTER_CONFIG.foodTypes.map(f => (
                        <button 
                          key={f}
                          onClick={() => setFoodPreference(foodPreference === f ? null : f)}
                          className={`flex-1 py-3 rounded-2xl text-xs font-semibold border transition-all ${
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
             <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">Discover Venues</h2>
                  <p className="text-[10px] md:text-xs font-bold text-slate-500 bg-slate-50 inline-block px-3 py-1.5 rounded-lg border border-slate-100">
                    {resultsByLocation.premium.length + resultsByLocation.others.length} Results
                    {resultsByLocation.premium.length > 0 && <span className="text-amber-500 ml-1">· {resultsByLocation.premium.length} Premium</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-nowrap pb-2 md:pb-0">
                    {selectedCities.length > 0 && selectedCities.map((city, i) => (
                      <div key={i} className="shrink-0 px-3 py-1.5 bg-pd-red/10 border border-pd-red/20 rounded-full text-xs font-medium text-pd-red flex items-center gap-2">
                        {city} <button onClick={() => setSelectedCities(selectedCities.filter(c => c !== city))}><X size={10} /></button>
                      </div>
                    ))}
                    {selectedEvent && (
                      <div className="shrink-0 px-3 py-1.5 bg-pd-purple/10 border border-pd-purple/20 rounded-full text-xs font-medium text-pd-purple flex items-center gap-2">
                        {selectedEvent} <button onClick={() => setSelectedEvent("")}><X size={10} /></button>
                      </div>
                    )}
                    {selectedCapacity > 0 && (
                     <div className="shrink-0 px-3 py-1.5 bg-pd-pink/10 border border-pd-pink/20 rounded-full text-xs font-medium text-pd-pink flex items-center gap-2">
                       {selectedCapacity}+ Guests <button onClick={() => setSelectedCapacity(0)}><X size={10} /></button>
                     </div>
                    )}
                    {selectedAmenities.length > 0 && selectedAmenities.map(a => (
                      <div key={a} className="shrink-0 px-3 py-1.5 bg-pd-blue/10 border border-pd-blue/20 rounded-full text-xs font-medium text-pd-blue flex items-center gap-2">
                        {a} <button onClick={() => handleToggle(selectedAmenities, setSelectedAmenities, a)}><X size={10} /></button>
                      </div>
                    ))}
                </div>
                
                <div className="flex items-center gap-3">
                   <span className="text-xs font-semibold text-slate-400">Sort:</span>
                   <div className="relative">
                      <button 
                        onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                        className="flex items-center gap-2 text-lg font-bold text-slate-900 group"
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
                            className="absolute top-full right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-40 p-2 space-y-1 w-48"
                          >
                             {["Popularity", "Top Rated", "Price: Low to High", "Price: High to Low"].map(opt => (
                               <button 
                                 key={opt}
                                 onClick={() => { setSortBy(opt); setIsSortDropdownOpen(false); }}
                                 className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-colors ${
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

             {/* ── VENUE SECTIONS ── */}
             <div className="space-y-14">

               {/* ── PREMIUM VENUES ── */}
               {resultsByLocation.premium.length > 0 && (
                 <div className="mb-16">
                   <div className="flex items-center gap-4 mb-8">
                     <div className="flex items-center gap-3 bg-linear-to-r from-amber-500/10 to-transparent p-2 pr-6 rounded-2xl border border-amber-500/20">
                       <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                         <Star size={20} className="fill-white" />
                       </div>
                       <div>
                         <h2 className="text-lg font-bold text-slate-900">Premium Venues</h2>
                         <p className="text-xs font-semibold text-amber-600">Handpicked & Verified</p>
                       </div>
                     </div>
                     <div className="h-px bg-linear-to-r from-amber-200 to-transparent flex-1" />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {resultsByLocation.premium.map((v, i) => (
                       <VenueCard key={v.id} venue={v} index={i} isPremium />
                     ))}
                   </div>
                 </div>
               )}

               {/* ── DIVIDER ── */}
               {resultsByLocation.premium.length > 0 && resultsByLocation.others.length > 0 && (
                 <div className="flex items-center gap-4 py-8">
                   <div className="h-px bg-slate-200 flex-1" />
                   <span className="text-xs font-semibold text-slate-400 px-4 py-2 bg-slate-50 rounded-full border border-slate-200">Other Available Venues</span>
                   <div className="h-px bg-slate-200 flex-1" />
                 </div>
               )}

               {/* ── FREE / OTHER VENUES ── */}
               {resultsByLocation.others.length > 0 && (
                 <div>
                   {resultsByLocation.premium.length === 0 && (
                     <div className="flex items-center gap-4 mb-8">
                       <div className="flex items-center gap-3 bg-slate-100/80 p-2 pr-6 rounded-2xl border border-slate-200">
                         <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-lg shadow-slate-900/10">
                           <MapPin size={20} />
                         </div>
                         <div>
                           <h2 className="text-lg font-bold text-slate-900">Available Venues</h2>
                           <p className="text-xs font-semibold text-slate-500">{resultsByLocation.others.length} Matches Found</p>
                         </div>
                       </div>
                       <div className="h-px bg-slate-200 flex-1" />
                     </div>
                   )}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {paginatedOthers.map((v, i) => (
                       <VenueCard key={v.id} venue={v} index={i} />
                     ))}
                   </div>

                   {/* Pagination Controls */}
                   {totalPages > 1 && (
                     <div className="mt-16 flex items-center justify-center gap-2">
                       <button 
                         disabled={currentPage === 1}
                         onClick={() => {
                           setCurrentPage(prev => Math.max(1, prev - 1));
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                         }}
                         className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-pd-red hover:border-pd-red transition-all disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-100"
                       >
                         <ArrowRight size={20} className="rotate-180" />
                       </button>
                       
                       <div className="flex items-center gap-2 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
                         {[...Array(totalPages)].map((_, i) => {
                           const pageNum = i + 1;
                           if (
                             pageNum === 1 || 
                             pageNum === totalPages || 
                             (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                           ) {
                             return (
                               <button
                                 key={pageNum}
                                 onClick={() => {
                                   setCurrentPage(pageNum);
                                   window.scrollTo({ top: 0, behavior: 'smooth' });
                                 }}
                                 className={`w-10 h-10 rounded-xl text-xs font-medium transition-all ${
                                   currentPage === pageNum 
                                     ? 'bg-slate-900 text-white shadow-lg' 
                                     : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                                 }`}
                                >
                                 {pageNum}
                               </button>
                             );
                           } else if (
                             pageNum === currentPage - 2 || 
                             pageNum === currentPage + 2
                           ) {
                             return <span key={pageNum} className="px-1 text-slate-300">...</span>;
                           }
                           return null;
                         })}
                       </div>

                       <button 
                         disabled={currentPage === totalPages}
                         onClick={() => {
                           setCurrentPage(prev => Math.min(totalPages, prev + 1));
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                         }}
                         className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-pd-red hover:border-pd-red transition-all disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-100"
                       >
                         <ArrowRight size={20} />
                       </button>
                     </div>
                   )}
                 </div>
               )}

               {/* ── EMPTY STATE ── */}
               {resultsByLocation.premium.length === 0 && resultsByLocation.others.length === 0 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-8">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                       <Filter size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No venues found</h3>
                    <p className="text-slate-500 font-medium mb-8">We couldn&apos;t find any venues matching those filters.</p>
                    <button onClick={clearFilters} className="bg-slate-900 text-white px-8 py-4 rounded-xl text-sm font-medium hover:bg-pd-pink transition-colors shadow-lg shadow-slate-900/20">
                      Reset Filters
                    </button>
                 </motion.div>
               )}

             </div>
          </main>
        </div>
      </div>

      {/* MOBILE TRIGGER & DRAWER */}
      <div className="lg:hidden fixed bottom-6 right-6 z-30">
         <button 
           onClick={() => setShowMobileFilters(true)}
           className="bg-slate-900 text-white px-6 py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-3 active:scale-95 transition-all border border-white/10"
         >
            <Filter size={20} />
            <span className="text-xs font-medium ">Filters</span>
            {/* Show filter count if active */}
            {(selectedCities.length > 0 || selectedEvent || selectedCapacity > 0) && (
              <span className="bg-pd-red w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                {(selectedCities.length > 0 ? 1 : 0) + (selectedEvent ? 1 : 0) + (selectedCapacity > 0 ? 1 : 0)}
              </span>
            )}
         </button>
      </div>

      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowMobileFilters(false)}
               className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100]"
               style={{ willChange: 'opacity, backdrop-filter', transform: 'translateZ(0)' }}
            />
            <motion.div 
               initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
               className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[110] max-h-[90vh] flex flex-col shadow-2xl"
            >
               <div className="p-6 md:p-10 flex flex-col h-full overflow-hidden">
                  <div className="flex items-center justify-between mb-6 shrink-0">
                     <h3 className="text-xl font-medium text-slate-900  tracking-tight">Refine Results</h3>
                     <button onClick={() => setShowMobileFilters(false)} className="p-2.5 bg-slate-100 rounded-full transition-transform active:scale-90"><X size={18} /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto no-scrollbar pb-10 space-y-8">
                     {/* Mobile Location Search */}
                     <div className="space-y-4">
                        <label className="text-xs font-semibold text-slate-400">Location</label>
                        <div className="relative">
                           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                           <input 
                             type="text" 
                             placeholder="City or Pincode..." 
                             className="w-full pl-14 pr-12 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium outline-none focus:border-pd-red transition-all"
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
                                 className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-3xl shadow-2xl z-[120] max-h-60 overflow-y-auto p-2 space-y-1 no-scrollbar"
                               >
                                  {citySuggestions.map((city, idx) => (
                                    <button 
                                      key={idx}
                                      onClick={() => {
                                        if (!selectedCities.includes(city)) {
                                          setSelectedCities([...selectedCities, city]);
                                        }
                                        setLocationSearchQuery("");
                                        setCitySuggestions([]);
                                      }}
                                      className="w-full text-left px-5 py-4 hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-2xl active:bg-slate-100"
                                    >
                                      {city}
                                    </button>
                                  ))}
                               </motion.div>
                             )}
                           </AnimatePresence>

                           {/* Mobile Selected Cities Chips */}
                           <div className="flex flex-wrap gap-2 mt-3">
                              {selectedCities.map((city, i) => (
                                <div key={i} className="flex items-center gap-2 bg-pd-red text-white px-4 py-2 rounded-2xl shadow-lg shadow-pd-red/20 border border-pd-red/10">
                                  <span className="text-xs font-semibold">{city}</span>
                                  <button 
                                    onClick={() => setSelectedCities(selectedCities.filter(c => c !== city))}
                                    className="hover:scale-110 transition-transform"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     {/* Custom Mobile Event Dropdown */}
                     <div className="space-y-4">
                        <label className="text-xs font-semibold text-slate-400">Event Type</label>
                        <div className="relative">
                           <button 
                             onClick={() => setIsMobileEventOpen(!isMobileEventOpen)}
                             className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium flex items-center justify-between"
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
                                 className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-3xl shadow-xl z-[120] max-h-60 overflow-y-auto p-2 space-y-1 no-scrollbar"
                               >
                                 <button 
                                   onClick={() => { setSelectedEvent(""); setIsMobileEventOpen(false); }}
                                   className="w-full text-left px-5 py-4 hover:bg-slate-50 rounded-2xl text-xs font-semibold text-slate-500"
                                 >
                                   All Events
                                 </button>
                                 {FILTER_CONFIG.eventTypes.map(e => (
                                   <button 
                                     key={e}
                                     onClick={() => { setSelectedEvent(e); setIsMobileEventOpen(false); }}
                                     className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-semibold ${
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
                        <label className="text-xs font-semibold text-slate-400">Price Per Plate</label>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <span className="text-xs font-medium text-slate-300">Min Price</span>
                              <input 
                                 type="number" 
                                 value={budgetRange.min}
                                 onChange={(e) => setBudgetRange({ ...budgetRange, min: parseInt(e.target.value) || 0 })}
                                 className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-pd-red"
                                 placeholder="Min"
                              />
                           </div>
                           <div className="space-y-2">
                              <span className="text-xs font-medium text-slate-300">Max Price</span>
                              <input 
                                 type="number" 
                                 value={budgetRange.max}
                                 onChange={(e) => setBudgetRange({ ...budgetRange, max: parseInt(e.target.value) || 0 })}
                                 className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-pd-red"
                                 placeholder="Max"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-xs font-semibold text-slate-400">Guest Capacity</label>
                        <div className="">
                           <div className="flex justify-between items-center mb-4">
                              <span className="text-xs font-semibold text-pd-purple">{selectedCapacity}+ Guests</span>
                              <span className="text-xs font-medium text-slate-300">Max: 10,000</span>
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
                        <label className="text-xs font-semibold text-slate-400">Amenities</label>
                        <div className="grid grid-cols-2 gap-2">
                           {FILTER_CONFIG.amenities.map(a => (
                             <button 
                               key={a}
                               onClick={() => handleToggle(selectedAmenities, setSelectedAmenities, a)}
                               className={`px-4 py-3 rounded-2xl text-xs font-medium transition-all border text-left flex items-center justify-between ${
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
                        <label className="text-xs font-semibold text-slate-400">Venue Type</label>
                        <div className="relative">
                           <button 
                             onClick={() => setIsMobileVenueOpen(!isMobileVenueOpen)}
                             className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium flex items-center justify-between"
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
                                 className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-3xl shadow-xl z-[120] max-h-60 overflow-y-auto p-2 space-y-1 no-scrollbar"
                               >
                                 <button 
                                   onClick={() => { setSelectedVenueTypes([]); setIsMobileVenueOpen(false); }}
                                   className="w-full text-left px-5 py-4 hover:bg-slate-50 rounded-2xl text-xs font-semibold text-slate-500"
                                 >
                                   All Venue Types
                                 </button>
                                 {FILTER_CONFIG.venueTypes.map(t => (
                                   <button 
                                     key={t}
                                     onClick={() => { handleToggle(selectedVenueTypes, setSelectedVenueTypes, t); }}
                                     className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-semibold ${
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
                     <button onClick={clearFilters} className="py-5 bg-slate-50 rounded-3xl text-xs font-semibold text-slate-400">Reset</button>
                     <button onClick={() => setShowMobileFilters(false)} className="pd-btn-primary py-5 text-xs font-semibold ">Show Results</button>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function VenuesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    }>
      <VenuesContent />
    </Suspense>
  );
}
