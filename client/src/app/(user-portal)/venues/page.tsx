'use client';

import { motion, AnimatePresence } from 'framer-motion';
import MinimalVenueCard from '@/shared/components/MinimalVenueCard';
import { 
  Search, 
  MapPin,
  Calendar,
  Building2, 
  Star, 
  Filter, 
  ChevronDown, 
  X, 
  ArrowRight,
  Check,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Users,
  LayoutGrid,
  Car,
  Utensils,
  PartyPopper,
  Music,
  Wind,
  Tent,
  Bed,
  Zap,
  Accessibility,
  CheckCircle,
  Wine,
  Wifi,
  Shield
} from 'lucide-react';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';


const getAmenityIcon = (amenity: string, active: boolean) => {
  const lower = amenity.toLowerCase();
  const cl = active ? "text-white" : "text-slate-400";
  if (lower.includes('parking') || lower.includes('valet')) return <Car size={16} className={cl} />;
  if (lower.includes('ac') || lower.includes('air condition') || lower.includes('hvac')) return <Wind size={16} className={cl} />;
  if (lower.includes('power') || lower.includes('generator') || lower.includes('backup')) return <Zap size={16} className={cl} />;
  if (lower.includes('cater') || lower.includes('food') || lower.includes('kitchen')) return <Utensils size={16} className={cl} />;
  if (lower.includes('dj') || lower.includes('music') || lower.includes('sound')) return <Music size={16} className={cl} />;
  if (lower.includes('bar') || lower.includes('alcohol') || lower.includes('drink')) return <Wine size={16} className={cl} />;
  if (lower.includes('wheelchair') || lower.includes('access')) return <Accessibility size={16} className={cl} />;
  if (lower.includes('wifi') || lower.includes('internet')) return <Wifi size={16} className={cl} />;
  if (lower.includes('secur')) return <Shield size={16} className={cl} />;
  if (lower.includes('room') || lower.includes('bed') || lower.includes('bridal')) return <Bed size={16} className={cl} />;
  if (lower.includes('lawn') || lower.includes('outdoor')) return <Tent size={16} className={cl} />;
  if (lower.includes('decor')) return <PartyPopper size={16} className={cl} />;
  return <CheckCircle size={16} className={cl} />;
};

const DEFAULT_UK_CITIES = [
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
  'Kamaluaganja-263139',
  'Ramnagar-244715',
  'Rudrapur-263153',
  'Kashipur-244713'
];



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
  const ITEMS_PER_PAGE = 12;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCities, selectedEvent, selectedVenueTypes, budgetRange, selectedCapacity, selectedAmenities, foodPreference, minRating, quickFilters, sortBy]);

  // Indian Post API search
  useEffect(() => {
    const fetchCities = async () => {
      if (locationSearchQuery.length < 3) {
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
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);

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
            const response = await fetch(`${baseUrl}/venues`);
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
          } finally {
            if (isMounted) setIsLoadingVenues(false);
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
        .map(v => ({ v, score: (v.rating || 0) + (v.reviews > 0 ? 100 : 0) + (v.isPaid ? 50 : 0) + Math.random() * 0.5 }))
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

  const allCombinedVenues = useMemo(() => {
    const premiumWithFlag = resultsByLocation.premium.map(v => ({...v, isPremium: true}));
    const othersWithFlag = resultsByLocation.others.map(v => ({...v, isPremium: false}));
    return [...premiumWithFlag, ...othersWithFlag];
  }, [resultsByLocation]);

  const totalPages = Math.ceil(allCombinedVenues.length / ITEMS_PER_PAGE);
  const paginatedVenues = allCombinedVenues.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);

  const filterFormUI = (
    <div className="w-full max-w-7xl mx-auto mb-12 z-20 relative px-4">
      {/* --- TOP MAIN SEARCH BAR --- */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col lg:flex-row items-stretch p-3 lg:h-[88px] relative z-20">
        
        {/* 1. Where */}
        <div className="flex-1 px-4 lg:px-6 py-3 lg:py-0 flex items-center gap-4 hover:bg-slate-50 rounded-2xl h-full transition-colors relative cursor-text group">
          <div className="w-10 h-10 rounded-xl bg-pd-red/5 flex items-center justify-center shrink-0">
            <MapPin size={20} className="text-pd-red" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <label className="text-[11px] font-bold text-slate-800 mb-0.5 cursor-text">Where</label>
            <input 
              type="text" 
              placeholder="City or Pincode" 
              className="w-full bg-transparent text-sm font-black text-slate-900 outline-none truncate placeholder:text-slate-400 placeholder:font-medium"
              value={locationSearchQuery}
              onFocus={() => {
                setIsInputFocused(true);
                if (locationSearchQuery.length === 0) setCitySuggestions(DEFAULT_UK_CITIES);
                else if (locationSearchQuery.length < 3) setCitySuggestions(DEFAULT_UK_CITIES.filter(c => c.toLowerCase().includes(locationSearchQuery.toLowerCase())));
              }}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
              onChange={(e) => {
                const val = e.target.value;
                setLocationSearchQuery(val);
                if (val.length === 0) setCitySuggestions(DEFAULT_UK_CITIES);
                else if (val.length < 3) setCitySuggestions(DEFAULT_UK_CITIES.filter(c => c.toLowerCase().includes(val.toLowerCase())));
              }}
            />
          </div>
          <ChevronDown size={14} className="text-slate-400 shrink-0" />
          
          {isLoadingCities && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-pd-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <AnimatePresence>
            {(isInputFocused && citySuggestions.length > 0) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-4 bg-white border border-slate-100 rounded-3xl shadow-2xl z-[120] max-h-60 overflow-y-auto p-2 space-y-1 no-scrollbar"
              >
                {citySuggestions.map((city, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      if (!selectedCities.includes(city)) setSelectedCities([...selectedCities, city]);
                      setLocationSearchQuery("");
                      setCitySuggestions([]);
                    }}
                    className="w-full text-left px-5 py-4 hover:bg-slate-50 text-sm font-medium text-slate-700 rounded-2xl active:bg-slate-100 flex items-center gap-3"
                  >
                    <MapPin size={16} className="text-slate-400" />
                    {city}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden lg:block w-px h-10 bg-slate-200 shrink-0 self-center mx-2" />

        {/* 2. Event Type */}
        <div 
          className="flex-1 px-4 lg:px-6 py-3 lg:py-0 flex items-center gap-4 hover:bg-slate-50 rounded-2xl h-full transition-colors relative cursor-pointer"
          onClick={() => { setIsMobileEventOpen(!isMobileEventOpen); setIsMobileVenueOpen(false); setShowAdvancedFilters(false); }}
        >
          <div className="w-10 h-10 rounded-xl bg-pd-red/5 flex items-center justify-center shrink-0">
            <Calendar size={20} className="text-pd-red" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-slate-800 mb-0.5">Event Type</span>
            <span className="text-sm font-black text-slate-900 truncate">
              {selectedEvent || "All Events"}
            </span>
          </div>
          <ChevronDown size={14} className="text-slate-400 shrink-0" />
          
          <AnimatePresence>
            {isMobileEventOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 lg:-left-12 lg:-right-12 mt-4 bg-white border border-slate-100 rounded-3xl shadow-2xl z-[120] max-h-80 overflow-y-auto p-2 space-y-1 no-scrollbar"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => { setSelectedEvent(""); setIsMobileEventOpen(false); }}
                  className="w-full text-left px-5 py-3.5 hover:bg-slate-50 rounded-2xl text-sm font-medium text-slate-500"
                >
                  All Events
                </button>
                {FILTER_CONFIG.eventTypes.map(e => (
                  <button 
                    key={e}
                    onClick={() => { setSelectedEvent(e); setIsMobileEventOpen(false); }}
                    className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-medium ${
                      selectedEvent === e ? 'bg-pd-red/5 text-pd-red' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden lg:block w-px h-10 bg-slate-200 shrink-0 self-center mx-2" />

        {/* 3. Venue Type */}
        <div 
          className="flex-1 px-4 lg:px-6 py-3 lg:py-0 flex items-center gap-4 hover:bg-slate-50 rounded-2xl h-full transition-colors relative cursor-pointer"
          onClick={() => { setIsMobileVenueOpen(!isMobileVenueOpen); setIsMobileEventOpen(false); setShowAdvancedFilters(false); }}
        >
          <div className="w-10 h-10 rounded-xl bg-pd-red/5 flex items-center justify-center shrink-0">
            <Building2 size={20} className="text-pd-red" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-slate-800 mb-0.5">Venue Type</span>
            <span className="text-sm font-black text-slate-900 truncate">
              {selectedVenueTypes.length > 1 ? `${selectedVenueTypes.length} Types` : (selectedVenueTypes[0] || "All Venue Types")}
            </span>
          </div>
          <ChevronDown size={14} className="text-slate-400 shrink-0" />

          <AnimatePresence>
            {isMobileVenueOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 lg:-left-12 lg:-right-12 mt-4 bg-white border border-slate-100 rounded-3xl shadow-2xl z-[120] max-h-80 overflow-y-auto p-2 space-y-1 no-scrollbar"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => { setSelectedVenueTypes([]); setIsMobileVenueOpen(false); }}
                  className="w-full text-left px-5 py-3.5 hover:bg-slate-50 rounded-2xl text-sm font-medium text-slate-500"
                >
                  All Venue Types
                </button>
                {FILTER_CONFIG.venueTypes.map(t => (
                  <button 
                    key={t}
                    onClick={() => handleToggle(selectedVenueTypes, setSelectedVenueTypes, t)}
                    className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-medium flex items-center justify-between ${
                      selectedVenueTypes.includes(t) ? 'bg-pd-red/5 text-pd-red' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                    {selectedVenueTypes.includes(t) && <Check size={16} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden lg:block w-px h-10 bg-slate-200 shrink-0 self-center mx-4" />

        {/* Action Buttons */}
        <div className="px-2 py-3 lg:py-0 flex items-center justify-between lg:justify-end gap-2 shrink-0">
          <button 
            className="h-12 lg:h-14 px-8 rounded-full bg-pd-red text-white flex items-center justify-center gap-2.5 hover:bg-rose-600 shadow-md hover:shadow-pd-red/30 transition-all font-bold text-[15px]"
            onClick={() => {
              setIsMobileEventOpen(false);
              setIsMobileVenueOpen(false);
              setShowAdvancedFilters(false);
            }}
          >
            <Search size={18} strokeWidth={2.5} /> 
            Search Venues
          </button>
        </div>
      </div>

      {/* --- BOTTOM SECONDARY BAR (Popular Filters) --- */}
      <div className="bg-white rounded-b-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 border-t-0 mx-6 px-6 py-5 relative z-10 -mt-6 pt-10 hidden lg:block">
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-4">Popular Filters</span>
         <div className="flex flex-wrap items-center gap-3">
            
            {/* Price Filter */}
            <div className="relative">
              <button 
                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'price' ? null : 'price')}
                className={`h-10 px-4 rounded-xl border text-xs font-bold flex items-center gap-2 transition-colors ${activeFilterDropdown === 'price' ? 'border-pd-red text-pd-red bg-red-50' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <IndianRupee size={16} className={activeFilterDropdown === 'price' ? "text-pd-red" : "text-slate-400"} /> 
                Price 
                <ChevronDown size={14} className={`ml-1 transition-transform ${activeFilterDropdown === 'price' ? 'rotate-180 text-pd-red' : 'text-slate-400'}`} />
              </button>
              
              <AnimatePresence>
                {activeFilterDropdown === 'price' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-100 rounded-3xl shadow-xl z-[120] p-6"
                  >
                    <label className="block text-sm font-bold text-slate-800 mb-4">Price Per Plate</label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                        <input 
                          type="number" 
                          value={budgetRange.min || ''}
                          onChange={(e) => setBudgetRange({ ...budgetRange, min: parseInt(e.target.value) || 0 })}
                          className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-slate-400 transition-colors"
                          placeholder="Min"
                        />
                      </div>
                      <span className="text-slate-300">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                        <input 
                          type="number" 
                          value={budgetRange.max || ''}
                          onChange={(e) => setBudgetRange({ ...budgetRange, max: parseInt(e.target.value) || 0 })}
                          className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-slate-400 transition-colors"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Guest Capacity Filter */}
            <div className="relative">
              <button 
                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'capacity' ? null : 'capacity')}
                className={`h-10 px-4 rounded-xl border text-xs font-bold flex items-center gap-2 transition-colors ${activeFilterDropdown === 'capacity' ? 'border-pd-red text-pd-red bg-red-50' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <Users size={16} className={activeFilterDropdown === 'capacity' ? "text-pd-red" : "text-slate-400"} /> 
                Guest Capacity 
                <ChevronDown size={14} className={`ml-1 transition-transform ${activeFilterDropdown === 'capacity' ? 'rotate-180 text-pd-red' : 'text-slate-400'}`} />
              </button>
              
              <AnimatePresence>
                {activeFilterDropdown === 'capacity' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-100 rounded-3xl shadow-xl z-[120] p-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-bold text-slate-800">Guest Capacity</label>
                      <span className="text-xs font-bold text-pd-purple bg-pd-purple/10 px-3 py-1 rounded-full">{selectedCapacity}+ Guests</span>
                    </div>
                    <input 
                      type="range" min="0" max="10000" step="100" 
                      value={selectedCapacity} 
                      onChange={(e) => setSelectedCapacity(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pd-purple mt-4"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Amenities Filter */}
            <div className="relative">
              <button 
                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'amenities' ? null : 'amenities')}
                className={`h-10 px-4 rounded-xl border text-xs font-bold flex items-center gap-2 transition-colors ${activeFilterDropdown === 'amenities' ? 'border-pd-red text-pd-red bg-red-50' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <Building2 size={16} className={activeFilterDropdown === 'amenities' ? "text-pd-red" : "text-slate-400"} /> 
                Amenities 
                <ChevronDown size={14} className={`ml-1 transition-transform ${activeFilterDropdown === 'amenities' ? 'rotate-180 text-pd-red' : 'text-slate-400'}`} />
              </button>

              <AnimatePresence>
                {activeFilterDropdown === 'amenities' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-[480px] bg-white border border-slate-100 rounded-3xl shadow-xl z-[120] p-6"
                  >
                    <label className="block text-sm font-bold text-slate-800 mb-4">Select Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_CONFIG.amenities.map(a => (
    <button 
      key={a}
      onClick={() => handleToggle(selectedAmenities, setSelectedAmenities, a)}
      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border flex items-center gap-2 ${
        selectedAmenities.includes(a) ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-900'
      }`}
    >
      {getAmenityIcon(a, selectedAmenities.includes(a))}
      <span>{a}</span>
    </button>
  ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Parking Toggle */}
            <button 
              onClick={() => handleToggle(selectedAmenities, setSelectedAmenities, 'Parking Available')}
              className={`h-10 px-4 rounded-xl border text-xs font-bold flex items-center gap-2 transition-colors ${selectedAmenities.includes('Parking Available') ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              <Car size={16} className={selectedAmenities.includes('Parking Available') ? 'text-white' : 'text-slate-400'} /> Parking
            </button>
            
            <button 
               onClick={() => handleToggle(selectedAmenities, setSelectedAmenities, 'Catering Available')}
               className={`h-10 px-4 rounded-xl border text-xs font-bold flex items-center gap-2 transition-colors ${selectedAmenities.includes('Catering Available') ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              <Utensils size={16} className={selectedAmenities.includes('Catering Available') ? 'text-white' : 'text-slate-400'} /> Catering
            </button>
            
            <div className="ml-auto text-right flex flex-col justify-center pr-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Available Venues</span>
              <span className="text-sm font-black text-slate-900">{allCombinedVenues?.length || 0} Matches Found</span>
            </div>
         </div>
      </div>


    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 relative pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 pt-8 pb-20">
        <div className="flex flex-col gap-8">
          
          <div className="hidden lg:block w-full">
            {filterFormUI}
          </div>

          {/* MAIN LISTINGS */}
          <main className="w-full">


{/* ── VENUE SECTIONS ── */}
             <div className="space-y-14">

               {/* ── COMBINED VENUES ── */}
               {!isLoadingVenues && allCombinedVenues.length > 0 && (
                 <div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                     {paginatedVenues.map((v, i) => (
                       <MinimalVenueCard key={v.id} venue={v} index={i} isPremium={v.isPremium} />
                     ))}
                   </div>

                   {/* Pagination Controls */}
                   {totalPages > 1 && (
                     <div className="mt-16 flex items-center justify-center">
                       <div className="flex flex-wrap justify-center md:flex-nowrap items-center bg-white px-2 py-2 md:px-4 md:py-3 rounded-[2rem] md:rounded-full shadow-[0_4px_24px_rgb(0,0,0,0.06)] border border-slate-50 gap-2 md:gap-4">
                         
                         {/* Previous Button */}
                         <button 
                           disabled={currentPage === 1}
                           onClick={() => {
                             setCurrentPage(prev => Math.max(1, prev - 1));
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                           }}
                           className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-40 disabled:hover:text-slate-500"
                         >
                           <ChevronLeft size={18} strokeWidth={2.5} />
                           Previous
                         </button>
                         
                         {/* Page Numbers */}
                         <div className="flex items-center gap-1 mx-1 md:mx-2">
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
                                   className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                                     currentPage === pageNum 
                                       ? 'bg-[#F43F5E] text-white ring-[4px] ring-[#F43F5E]/20' 
                                       : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 bg-transparent'
                                   }`}
                                  >
                                   {pageNum}
                                 </button>
                               );
                             } else if (
                               pageNum === currentPage - 2 || 
                               pageNum === currentPage + 2
                             ) {
                               return <span key={pageNum} className="px-1 text-slate-400 font-bold tracking-widest">...</span>;
                             }
                             return null;
                           })}
                         </div>

                         {/* Next Button */}
                         <button 
                           disabled={currentPage === totalPages}
                           onClick={() => {
                             setCurrentPage(prev => Math.min(totalPages, prev + 1));
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                           }}
                           className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-40 disabled:hover:text-slate-500"
                         >
                           Next
                           <ChevronRight size={18} strokeWidth={2.5} />
                         </button>

                         {/* Results Count */}
                         <div className="hidden xl:block pl-6 border-l border-slate-200 text-sm font-medium text-slate-500 mr-2">
                           Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, allCombinedVenues.length)} of {allCombinedVenues.length} results
                         </div>
                       </div>
                    </div>
                    )}
                  </div>
                )}

               {/* ── EMPTY STATE ── */}
               
               {/* ── LOADING STATE ── */}
               {isLoadingVenues && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                   {[1,2,3,4,5,6,7,8].map(i => (
                     <div key={i} className="w-full aspect-[4/3] bg-slate-100 animate-pulse rounded-3xl" />
                   ))}
                 </div>
               )}

               {/* ── EMPTY STATE ── */}
               {!isLoadingVenues && allCombinedVenues.length === 0 && (
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
                     {filterFormUI}
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
