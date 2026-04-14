'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  Download, 
  User, 
  LogOut,
  Smartphone,
  Menu,
  X,
  Users,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Star,
  Quote,
  ShieldCheck,
  Zap,
  Tag,
  Clock,
  ArrowRight,
  Send,
  Building2,
  LayoutDashboard,
  Heart,
  Globe
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import VenueCard from '@/shared/components/VenueCard';
import { Venue } from '@/data/venues';

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10px 0px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// Helper to map capacity integer to range label
const getCapacityLabel = (capacity: any) => {
  const cap = parseInt(capacity);
  if (cap === 2000) return "2000-5000";
  if (cap === 1000) return "1000-2000";
  if (cap === 500) return "500-1000";
  if (cap === 200) return "200-500";
  if (cap === 100) return "100-200";
  if (cap === 50) return "50-100";
  if (cap === 0) return "0-50";
  if (cap === 5000) return "5000+";
  return capacity?.toString() || "0";
};

export default function Home() {
  const locationRef = useRef<HTMLDivElement>(null);

  // Form States
  const [formData, setFormData] = useState({
    eventType: '',
    locations: [] as any[], // Changed from city: ''
    date: '',
    guests: ''
  });

  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const eventDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch Location from Indian Post API
  useEffect(() => {
    const fetchLocations = async () => {
      if (locationInput.length < 3) {
        setSuggestions([]);
        return;
      }

      // Special Case for Haldwani (263139) and nearby areas
      if (locationInput === '263139') {
        const customSuggestions = [
          { display: 'Haldwani-263139', name: 'Haldwani', pincode: '263139', state: 'Uttarakhand' },
          { display: 'Kathgodam-263126', name: 'Kathgodam', pincode: '263126', state: 'Uttarakhand' },
          { display: 'Lalkuan-263131', name: 'Lalkuan', pincode: '263131', state: 'Uttarakhand' },
          { display: 'Mukhani-263139', name: 'Mukhani', pincode: '263139', state: 'Uttarakhand' },
          { display: 'Kaladhungi-263140', name: 'Kaladhungi', pincode: '263140', state: 'Uttarakhand' },
          { display: 'Bhowali-263132', name: 'Bhowali', pincode: '263132', state: 'Uttarakhand' },
          { display: 'Nainital-263001', name: 'Nainital', pincode: '263001', state: 'Uttarakhand' },
          { display: 'Damuadhunga-263126', name: 'Damuadhunga', pincode: '263126', state: 'Uttarakhand' },
          { display: 'Lamachaur-263139', name: 'Lamachaur', pincode: '263139', state: 'Uttarakhand' },
          { display: 'Dahariya-263139', name: 'Dahariya', pincode: '263139', state: 'Uttarakhand' },
          { display: 'Kamaluaganja-263139', name: 'Kamaluaganja', pincode: '263139', state: 'Uttarakhand' }
        ];
        setSuggestions(customSuggestions);
        setIsLoadingLocations(false);
        return;
      }

      setIsLoadingLocations(true);
      try {
        const isPincode = /^\d+$/.test(locationInput);
        const url = isPincode 
          ? `https://api.postalpincode.in/pincode/${locationInput}`
          : `https://api.postalpincode.in/postoffice/${locationInput}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data[0].Status === 'Success') {
          const offices = data[0].PostOffice;
          const formattedSuggestions = offices
            .filter((office: any) => office.State === 'Uttarakhand')
            .map((office: any) => ({
              display: `${office.Name}-${office.Pincode}`,
              name: office.Name,
              pincode: office.Pincode,
              district: office.District,
              state: office.State
            }));
          
          if (formattedSuggestions.length === 0 && offices.length > 0) {
            setSuggestions([{ isError: true, message: 'Only Uttarakhand Pincodes allowed' }]);
          } else {
            const uniqueSuggestions = Array.from(new Set(formattedSuggestions.map((s: any) => s.display)))
              .map(display => formattedSuggestions.find((s: any) => s.display === display));
            setSuggestions(uniqueSuggestions);
          }
        } else {
          setSuggestions([{ isError: true, message: 'No matching pincode found' }]);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setSuggestions([]);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    const debounceTimer = setTimeout(fetchLocations, 500);
    return () => clearTimeout(debounceTimer);
  }, [locationInput]);

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => setIsEventDropdownOpen(false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (eventDropdownRef.current && !eventDropdownRef.current.contains(event.target as Node)) {
        setIsEventDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { name: "Birthday Party", icon: "🎂", img: "/categories/birthday.png" },
    { name: "Wedding Events", icon: "💍", img: "/categories/wedding.png" },
    { name: "Pre-Wedding Events", icon: "✨", img: "/categories/wedding.png" },
    { name: "Anniversary Party", icon: "🥂", img: "/categories/festival.png" },
    { name: "Corporate Events", icon: "🏢", img: "/categories/corporate.png" },
    { name: "Kitty Party", icon: "👩‍🤝‍👩", img: "/categories/bachelor.png" },
    { name: "Family Functions", icon: "🏠", img: "/categories/kids.png" },
    { name: "Festival Parties", icon: "🎭", img: "/categories/festival.png" },
    { name: "Social Gatherings", icon: "🎉", img: "/categories/festival.png" },
    { name: "Kids Parties", icon: "🎈", img: "/categories/kids.png" },
    { name: "Bachelor / Bachelorette Party", icon: "🕺", img: "/categories/bachelor.png" },
    { name: "Housewarming Party", icon: "🏡", img: "/categories/corporate.png" },
    { name: "Baby Shower", icon: "🧸", img: "/categories/baby-shower.png" },
    { name: "Engagement Ceremony", icon: "💎", img: "/categories/wedding.png" },
    { name: "Entertainment / Theme Parties", icon: "🦁", img: "/categories/kids.png" }
  ];

  const [liveVenues, setLiveVenues] = useState<any[]>([]);
  const displayVenues = liveVenues;

  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchTopVenues = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
        const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
        const response = await fetch(`${baseUrl}/venues?verified=true`);
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
          const allDocs = result.data;
          
          // Calculate counts per category (for now using venueType as a proxy or just randomizing for demo if field missing)
          const counts: Record<string, number> = {};
          categories.forEach(cat => {
            const matchCount = allDocs.filter((v: any) => {
               // 1. Try to check the specific eventTypes field first (now that we have it from onboarding)
               if (v.eventTypes) {
                  try {
                     const types = typeof v.eventTypes === 'string' ? JSON.parse(v.eventTypes) : v.eventTypes;
                     if (Array.isArray(types) && types.includes(cat.name)) return true;
                  } catch (e) {}
               }
               
               // 2. Fallback to name or description (legacy or if not filled)
               return v.venueType === cat.name || 
                  (v.description && v.description.toLowerCase().includes(cat.name.toLowerCase()));
            }).length;
            counts[cat.name] = matchCount;
          });
          setCategoryCounts(counts);

          const mapped = allDocs.map((doc: any) => ({
            id: doc.$id,
            name: doc.venueName || "Unnamed Venue",
            location: doc.landmark || doc.city || "India",
            city: doc.city || "Unknown",
            type: doc.venueType || "Banquet Hall",
            capacity: getCapacityLabel(doc.capacity),
            price: doc.perPlateVeg ? `₹${doc.perPlateVeg}` : "N/A",
            rating: 4.8,
            reviews: 0,
            verified: doc.isVerified || false,
            popular: doc.status === 'active',
            bestValue: true,
            isNew: true,
            amenities: (doc.amenities ? (typeof doc.amenities === 'string' ? JSON.parse(doc.amenities) : doc.amenities) : []),
            foodTypes: ["Veg", "Non-Veg"],
            img: doc.photos ? (() => {
               try {
                  const photos = JSON.parse(doc.photos);
                  const firstId = typeof photos[0] === 'string' ? photos[0] : photos[0].id;
                  const baseSrv = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
                  const serverUrl = baseSrv.endsWith('/api') ? baseSrv : `${baseSrv}/api`;
                  return `${serverUrl}/venues/proxy/image/venues_photos/${firstId}`;
               } catch(e) { return ""; }
            })() : ""
          }));

          setLiveVenues(mapped.slice(0, 3)); // Take top 3 for home page
        }
      } catch (err) {
        console.error('Home: Failed to fetch live venues via backend:', err);
      }
    };

    fetchTopVenues();
  }, []);

  const steps = [
    { title: "Submit Requirement", desc: "Tell us about your event type, guest count, and budget.", icon: <Send className="text-white" size={24} /> },
    { title: "Receive Quotes", desc: "Top venues will send you customized quotes in minutes.", icon: <Tag className="text-white" size={24} /> },
    { title: "Book Venue", desc: "Compare venues, check availability, and book your favorite.", icon: <CheckCircle2 className="text-white" size={24} /> }
  ];

  const benefits = [
    { name: "Verified Venues", desc: "Every venue on our list is personally verified.", icon: <ShieldCheck size={32} /> },
    { name: "Instant Quotes", desc: "No more long wait times for price sheets.", icon: <Zap size={32} /> },
    { name: "Best Price Guarantee", desc: "We ensure you get the most competitive rates.", icon: <IndianRupee size={32} /> },
    { name: "Free Assistance", desc: "Our expert planners help you decide for free.", icon: <Star size={32} /> }
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (formData.eventType) params.set('type', formData.eventType.toLowerCase().replace(/\s+/g, '-'));
    
    if (formData.locations.length > 0) {
      const locationString = formData.locations.map(l => l.display).join(',');
      params.set('location', locationString);
    } else if (locationInput) {
      params.set('location', locationInput);
    }
    
    if (formData.guests) params.set('capacity', formData.guests);
    
    window.location.href = `/venues?${params.toString()}`;
  };

  const addLocation = (loc: any) => {
    if (!formData.locations.find(l => l.display === loc.display)) {
      setFormData({
        ...formData,
        locations: [...formData.locations, loc]
      });
    }
    setLocationInput('');
    setShowSuggestions(false);
  };

  const removeLocation = (display: string) => {
    setFormData({
      ...formData,
      locations: formData.locations.filter(l => l.display !== display)
    });
  };

  return (
    <main className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-8 lg:pt-16 pb-8 lg:pb-16 px-4 md:px-6 bg-white border-b border-slate-50">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Hero Text */}
            <div className="w-full lg:w-1/2 text-left">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-4 lg:mb-6">
                   Find the <span className="text-pd-red">Perfect Venue</span> for Your Event
                </h1>
                <p className="text-base md:text-lg text-slate-500 mb-6 lg:mb-8 leading-relaxed">
                   Get free customized quotes from top venues in minutes. 
                   Direct connections. Zero brokerage.
                </p>
                <div className="flex items-center gap-4 text-xs md:text-sm font-bold text-slate-800">
                  <div className="flex -space-x-2 shrink-0">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <span className="leading-tight">Trusted by 50,000+ happy hosts</span>
                </div>
              </motion.div>
            </div>

            {/* Lead Form */}
            <div className="w-full lg:w-1/2">
               <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 md:p-10 rounded-[20px] shadow-pd-strong border border-slate-50">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6 lg:mb-8 border-l-4 border-pd-red pl-4">Get Free Quotes Now</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Event Type</label>
                      <div className="relative" ref={eventDropdownRef}>
                        <button 
                             type="button"
                             onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                             className={`w-full h-14 bg-slate-50 border ${isEventDropdownOpen ? 'border-pd-purple ring-2 ring-pd-purple/10' : 'border-slate-200'} rounded-xl px-4 text-sm font-bold text-slate-800 outline-none transition-all flex items-center justify-between group`}
                          >
                             <span className={formData.eventType ? 'text-slate-800' : 'text-slate-400'}>
                                {formData.eventType || "Select Event"}
                             </span>
                             <ChevronDown className={`text-slate-400 transition-transform duration-300 ${isEventDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                          </button>

                          <AnimatePresence>
                             {isEventDropdownOpen && (
                                <motion.div 
                                   initial={{ opacity: 0, y: 5, scale: 0.98 }}
                                   animate={{ opacity: 1, y: 0, scale: 1 }}
                                   exit={{ opacity: 0, y: 5, scale: 0.98 }}
                                   className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-pd-strong z-[60] py-2 max-h-80 overflow-y-auto"
                                >
                                   {categories.map((cat, i) => (
                                      <button
                                         key={i}
                                         type="button"
                                         onClick={() => {
                                            setFormData({ ...formData, eventType: cat.name });
                                            setIsEventDropdownOpen(false);
                                         }}
                                         className={`w-full text-left px-5 py-3 text-sm font-bold transition-all flex items-center gap-3 hover:bg-slate-50 ${formData.eventType === cat.name ? 'text-pd-red bg-pd-red/[0.03]' : 'text-slate-600 hover:text-slate-900'}`}
                                      >
                                         <span className="text-lg">{cat.icon}</span>
                                         {cat.name}
                                         {formData.eventType === cat.name && <CheckCircle2 size={14} className="ml-auto" />}
                                      </button>
                                   ))}
                                </motion.div>
                             )}
                          </AnimatePresence>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">City / Location</label>
                      <div className="relative" ref={locationRef}>
                        <div className={`w-full min-h-14 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex flex-wrap items-center gap-2 transition-all focus-within:border-pd-purple`}>
                          <MapPin className="text-pd-red shrink-0" size={16} />
                          
                          {/* Location Chips */}
                          {formData.locations.map((loc, i) => (
                            <div key={i} className="flex items-center gap-1 bg-pd-red/10 text-pd-red px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                              <span>{loc.display}</span>
                              <button onClick={() => removeLocation(loc.display)} className="hover:text-slate-900 transition-colors">
                                <X size={10} />
                              </button>
                            </div>
                          ))}

                          <input 
                            type="text" 
                            placeholder={formData.locations.length === 0 ? "Enter Pincode or City" : ""} 
                            value={locationInput}
                            onChange={(e) => {
                              setLocationInput(e.target.value);
                              setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            className="flex-1 bg-transparent border-none text-sm font-bold text-slate-800 outline-none min-w-[120px]" 
                          />
                        </div>
                        
                        {/* Suggestions Dropdown */}
                        <AnimatePresence>
                          {showSuggestions && (locationInput.length >= 3) && (suggestions.length > 0 || isLoadingLocations) && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-pd-strong z-50 max-h-60 overflow-y-auto"
                            >
                              {isLoadingLocations ? (
                                <div className="p-4 text-center text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                                  Searching...
                                </div>
                              ) : (
                                suggestions.map((s: any, i) => (
                                  s.isError ? (
                                    <div key={i} className="p-4 text-center text-[10px] text-pd-red font-black uppercase tracking-widest italic">
                                      {s.message}
                                    </div>
                                  ) : (
                                    <button
                                      key={i}
                                      onClick={() => addLocation(s)}
                                      className="w-full text-left px-5 py-3.5 hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors border-b border-slate-50 last:border-none flex items-center justify-between"
                                    >
                                      <span>{s.display}</span>
                                      <span className="text-[10px] text-slate-400 uppercase">{s.state}</span>
                                    </button>
                                  )
                                ))
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Event Date</label>
                       <div className="relative">
                         <Calendar className="absolute left-4 top-5 text-pd-purple" size={16} />
                         <input 
                            type="date" 
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-800 outline-none focus:border-pd-purple transition-all" 
                         />
                       </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Guest Count</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-5 text-pd-blue" size={16} />
                        <select 
                          className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-10 text-sm font-bold text-slate-800 outline-none focus:border-pd-purple transition-all appearance-none cursor-pointer"
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        >
                          <option value="">Select Capacity</option>
                          <option value="0-50">0-50 guests</option>
                          <option value="50-100">50-100 guests</option>
                          <option value="100-200">100-200 guests</option>
                          <option value="200-500">200-500 guests</option>
                          <option value="500-1000">500-1000 guests</option>
                          <option value="1000-2000">1000-2000 guests</option>
                          <option value="2000-5000">2000-5000 guests</option>
                          <option value="5000+">5000+ guests</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-5 text-slate-400" size={16} />
                      </div>
                    </div>

                  </div>
                  <button 
                    onClick={handleSearch}
                    className="w-full pd-btn-primary h-16 mt-8 shadow-xl shadow-pd-pink/20 uppercase tracking-[0.2em] font-black italic"
                  >
                    Get Free Quotes <ArrowRight className="inline ml-2" size={18} />
                  </button>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPACT STATS BAR - Optimized for single-screen visibility */}
      <section className="py-6 border-y border-slate-50 bg-white/80 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-wrap md:grid md:grid-cols-3 divide-x divide-slate-100 md:divide-x">
            
            {/* Stat Item 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 min-w-[33%] md:min-w-0 flex flex-col items-center justify-center text-center gap-1 px-1"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-pd-red/5 flex items-center justify-center text-pd-red shrink-0 mb-0.5">
                 <Building2 size={16} className="md:size-[18px]" />
              </div>
              <div className="flex flex-col items-center">
                 <h3 className="text-xs md:text-xl font-black text-slate-900 tracking-tight leading-none mb-0.5">
                   <AnimatedCounter end={500} suffix="+" />
                 </h3>
                 <p className="text-[6px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">Venues</p>
              </div>
            </motion.div>
            
            {/* Stat Item 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex-1 min-w-[33%] md:min-w-0 border-l border-slate-100 md:border-none flex flex-col items-center justify-center text-center gap-1 px-1"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-pd-purple/5 flex items-center justify-center text-pd-purple shrink-0 mb-0.5">
                 <Users size={16} className="md:size-[18px]" />
              </div>
              <div className="flex flex-col items-center">
                 <h3 className="text-xs md:text-xl font-black text-slate-900 tracking-tight leading-none mb-0.5">
                   <AnimatedCounter end={10000} suffix="+" />
                 </h3>
                 <p className="text-[6px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">Inquiries</p>
              </div>
            </motion.div>
            
            {/* Stat Item 3 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex-1 min-w-[33%] md:min-w-0 border-l border-slate-100 md:border-none flex flex-col items-center justify-center text-center gap-1 px-1"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-pd-blue/5 flex items-center justify-center text-pd-blue shrink-0 mb-0.5">
                 <Globe size={16} className="md:size-[18px]" />
              </div>
              <div className="flex flex-col items-center">
                 <h3 className="text-xs md:text-xl font-black text-slate-900 tracking-tight leading-none mb-0.5">
                   <AnimatedCounter end={7} suffix="" />
                 </h3>
                 <p className="text-[6px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">Cities</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="py-16 px-6 bg-white border-t border-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Popular Event Categories</h2>
              <div className="w-12 h-1 bg-pd-red rounded-full"></div>
            </div>
            <Link href="/categories">
              <button className="pd-btn-primary !py-3 !px-8 text-xs italic uppercase tracking-[0.2em] shadow-lg shadow-pd-pink/10">
                Explore More <ArrowRight className="inline ml-2" size={16} />
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories
              .filter(cat => (categoryCounts[cat.name] || 0) > 0)
              .map((cat, i) => (
              <Link href={`/venues?type=${cat.name.toLowerCase().replace(/\s+/g, '-')}`} key={i}>
                <div className="border border-slate-100 rounded-lg overflow-hidden h-64 relative group cursor-pointer">
                  <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy" />
                  <div className="absolute inset-0 bg-black/40"></div>
                  {/* Realtime Count Badge */}
                  <div className="absolute top-4 right-4 bg-pd-red text-white px-3 py-1 rounded-full text-[10px] font-black group-hover:scale-110 transition-transform">
                    {categoryCounts[cat.name] || 0} Venues
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-bold text-xs uppercase tracking-wider">{cat.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TOP VENUES NEAR YOU */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 text-center md:text-left">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Top Venues <span className="pd-gradient-text">Near You</span></h2>
              <p className="text-slate-500 font-medium">Personally verified luxury venues for your grand celebrations.</p>
            </div>
            <Link href="/venues">
              <button className="bg-white px-8 py-3 rounded-xl font-bold text-sm border border-slate-200 hover:shadow-pd-soft transition-all uppercase tracking-widest text-slate-600">
                View All Venues
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayVenues.map((venue, i) => (
              <VenueCard key={venue.id} venue={venue as unknown as Venue} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-20 uppercase">How it <span className="pd-gradient-text">Works</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
             <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-slate-100 border-dashed border-b-2"></div>
             {steps.map((step, i) => (
               <div key={i} className="flex flex-col items-center relative z-10">
                  <div className="w-24 h-24 rounded-full pd-gradient flex items-center justify-center mb-10 shadow-xl shadow-pd-pink/20 scale-110 active:scale-95 transition-transform">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-4">{step.title}</h3>
                  <p className="text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">{step.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 px-6 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="mb-8 text-pd-pink group-hover:scale-110 transition-transform duration-500">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest mb-4 group-hover:text-pd-blue transition-colors">{benefit.name}</h3>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-[#0F172A] mb-4">Happy <span className="pd-gradient-text">Celebrators</span></h2>
            <p className="text-slate-400 uppercase tracking-widest font-black text-[10px]">Real stories from our valued clients</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Rahul Malhotra",
                role: "Wedding Host",
                text: "PartyDial made our wedding planning so much easier! We received 5 quotes within 2 hours and booked a beautiful palace hotel that was right in our budget. Highly recommended!",
                avatar: "1"
              },
              {
                name: "Sneha Kapoor",
                role: "Corporate Planner",
                text: "As a corporate event planner, I need quick responses. PartyDial delivered! Found an amazing rooftop venue for our team's annual meet in just a day. Incredible service.",
                avatar: "2"
              },
              {
                name: "Amit Verma",
                role: "Birthday Host",
                text: "Found the perfect banquet hall for my son's 1st birthday. The zero brokerage promise is real – we saved a lot and got better deals than booking directly!",
                avatar: "3"
              }
            ].map((t, i) => (
              <div key={i} className="pd-card p-10 bg-slate-50 relative group hover:bg-white transition-colors duration-500">
                <Quote className="absolute top-6 right-8 text-slate-200 group-hover:text-pd-red/10 group-hover:rotate-12 transition-all duration-500" size={40} />
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden ring-4 ring-white shadow-sm group-hover:ring-pd-red/10 transition-all duration-500">
                    <img src={`https://i.pravatar.cc/150?u=user${t.avatar}`} alt={t.name} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm italic">{t.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest underline decoration-pd-red decoration-2">{t.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed italic relative z-10">
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase italic">Got <span className="pd-gradient-text">Questions?</span></h2>
            <div className="w-20 h-1.5 bg-pd-red mx-auto rounded-full mb-6"></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Everything you need to know about planning your next event</p>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "How does PartyDial help me find the right venue?", a: "We match you with the best venues based on your event type, guest count, and budget. You receive real-time quotes and can compare amenities and pricing instantly." },
              { q: "Is there any charge for using PartyDial services?", a: "No, PartyDial is completely free for event organizers. We connect you directly with venues without any brokerage or hidden convenience fees." },
              { q: "Are the venues on PartyDial personally verified?", a: "Yes, our team personally visits and verifies each venue for quality standards, amenities, and credibility before listing them on our platform." },
              { q: "How soon will I receive quotes for my requirement?", a: "Most users receive their first set of personalized quotes within 30-60 minutes of submitting their requirements." },
              { q: "Can I book a site visit through the platform?", a: "Absolutely! Once you receive a quote you like, you can directly message the venue manager or request a free site visit through our 'Help Desk'." }
            ].map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-pd-soft transition-shadow"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                  className="w-full text-left px-8 py-7 flex items-center justify-between group"
                >
                  <span className="font-black text-slate-700 text-lg group-hover:text-pd-red transition-colors pr-8 leading-tight">{faq.q}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${openFaq === i ? 'bg-pd-red text-white -rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-pd-red group-hover:text-white'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-8 pb-7 border-t border-slate-50 pt-6">
                        <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-pd-red/20 pl-6">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* FINAL CTA - Compact version */}
      <section className="py-12 px-6 md:px-0 bg-slate-50">
        <div className="max-w-6xl mx-auto overflow-hidden">
          <div className="pd-gradient p-8 md:p-16 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 shadow-[0_32px_80px_-16px_rgba(239,68,68,0.3)] relative">
             <div className="text-center md:text-left relative z-10 w-full md:w-auto">
                <h2 className="text-3xl md:text-6xl font-black leading-tight mb-4 md:mb-6 uppercase italic tracking-tighter">Ready to Plan the <br className="hidden md:block" /> Grand <span className="text-white">Celebration?</span></h2>
                <p className="text-sm md:text-xl font-medium text-white/80 max-w-xl mb-8 md:mb-10">Submit your requirements and get free quotes from 5,000+ luxury venues near you.</p>
                <div className="flex flex-col items-center md:items-start gap-4">
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-inquiry-popup'))}
                    className="w-full md:w-auto bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95"
                  >
                    Submit Requirement <ChevronDown className="inline ml-2 -rotate-90" size={20} />
                  </button>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Average Response Time: 15 Mins</p>
                </div>
             </div>
             
             {/* Optimized decorative cluster for mobile */}
             <div className="relative w-48 h-48 md:w-96 md:h-96 opacity-20 md:opacity-100 group shrink-0">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl" />
                <LayoutDashboard size={200} className="md:size-[300px] text-white group-hover:rotate-12 transition-transform duration-700" strokeWidth={1} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart size={50} className="md:size-[80px] text-white fill-white animate-bounce" />
                </div>
             </div>
          </div>
        </div>
      </section>



    </main>
  );
}
