/* eslint-disable @next/next/no-img-element, react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import {
  Search,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  Globe,
  
  Gift,
  GlassWater,
  PartyPopper,
  Music,
  Baby,
  Smile,
  Home as HomeIcon,
  Camera,
  Brush,
  Cake
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import VenueCard from '@/shared/components/VenueCard';
import MinimalVenueCard from '@/shared/components/MinimalVenueCard';
import CustomDatePicker from '@/shared/components/CustomDatePicker';
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
  const [activeTab, setActiveTab] = useState<'standard' | 'ai'>('standard');
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const [aiQuery, setAiQuery] = useState('');
  
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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const eventDropdownRef = useRef<HTMLDivElement>(null);
  const datePickerContainerRef = useRef<HTMLDivElement>(null);
  const guestDropdownRef = useRef<HTMLDivElement>(null);
  const venueScrollRef = useRef<any>(null);
  const haldwaniScrollRef = useRef<any>(null);
  const ramnagarScrollRef = useRef<any>(null);
  const categoriesScrollRef = useRef<any>(null);
  const [isHoveringVenues, setIsHoveringVenues] = useState(false);
  const [isHoveringCategories, setIsHoveringCategories] = useState(false);

  // Drag states for Categories
  const [isDraggingCats, setIsDraggingCats] = useState(false);
  const [startXCats, setStartXCats] = useState(0);
  const [scrollLeftCats, setScrollLeftCats] = useState(0);

  // Drag states for Venues
  const [isDraggingVenues, setIsDraggingVenues] = useState(false);
  const [startXVenues, setStartXVenues] = useState(0);
  const [scrollLeftVenues, setScrollLeftVenues] = useState(0);

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

  // Close dropdown on scroll (Removed scroll listener to fix scroll lag)
  useEffect(() => {
    // Click outside already handles closing the dropdown
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (eventDropdownRef.current && !eventDropdownRef.current.contains(event.target as Node)) {
        setIsEventDropdownOpen(false);
      }
      if (datePickerContainerRef.current && !datePickerContainerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target as Node)) {
        setIsGuestDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { name: "Birthday Party", icon: <Gift size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/birthday.png" },
    { name: "Wedding Events", icon: <Heart size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/wedding.png" },
    { name: "Pre-Wedding Events", icon: <PartyPopper size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/wedding.png" },
    { name: "Anniversary Party", icon: <GlassWater size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/festival.png" },
    { name: "Corporate Events", icon: <Building2 size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/corporate.png" },
    { name: "Kitty Party", icon: <Users size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/bachelor.png" },
    { name: "Family Functions", icon: <HomeIcon size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/kids.png" },
    { name: "Festival Parties", icon: <PartyPopper size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/festival.png" },
    { name: "Social Gatherings", icon: <Users size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/festival.png" },
    { name: "Kids Parties", icon: <Smile size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/kids.png" },
    { name: "Bachelor / Bachelorette Party", icon: <Music size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/bachelor.png" },
    { name: "Housewarming Party", icon: <HomeIcon size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/corporate.png" },
    { name: "Baby Shower", icon: <Baby size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/baby-shower.png" },
    { name: "Engagement Ceremony", icon: <Heart size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/wedding.png" },
    { name: "Entertainment / Theme Parties", icon: <Music size={16} strokeWidth={2.5} className="text-white" />, img: "/categories/kids.png" }
  ];

  const [liveVenues, setLiveVenues] = useState<any[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const displayVenues = liveVenues;
  const haldwaniVenues = displayVenues.filter((v: any) => v.city?.toLowerCase().includes('haldwani') || v.location?.city?.toLowerCase().includes('haldwani') || v.pincode === '263139' || v.location?.pincode === '263139' || v.pincode === 263139 || v.location?.pincode === 263139);
  const ramnagarVenues = displayVenues.filter((v: any) => v.city?.toLowerCase().includes('ramnagar') || v.location?.city?.toLowerCase().includes('ramnagar') || v.pincode === '244715' || v.location?.pincode === '244715' || v.pincode === 244715 || v.location?.pincode === 244715);

  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchTopVenues = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
        const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
        const response = await fetch(`${baseUrl}/venues`);
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
                } catch (e) { }
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
            rating: parseFloat(doc.rating) || 0,
            reviews: doc.totalReviews || 0,
            verified: doc.isVerified || false,
            popular: doc.status === 'active',
            bestValue: true,
            isNew: doc.$createdAt
              ? (Date.now() - new Date(doc.$createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000
              : false,
            amenities: (doc.amenities ? (typeof doc.amenities === 'string' ? JSON.parse(doc.amenities) : doc.amenities) : []),
            foodTypes: ["Veg", "Non-Veg"],
            isPaid: !!(doc.subscriptionPlan && doc.subscriptionPlan !== 'free' && doc.subscriptionPlan !== 'None' && doc.subscriptionPlan !== ''),
            // profileComplete = has real name + at least one photo + valid capacity
            profileComplete: (() => {
              const hasName = !!(doc.venueName && doc.venueName.trim() && doc.venueName.trim() !== 'Unnamed Venue');
              const hasCapacity = !!(doc.capacity && parseInt(doc.capacity) > 0);
              let hasPhotos = false;
              try {
                const photos = typeof doc.photos === 'string' ? JSON.parse(doc.photos || '[]') : (doc.photos || []);
                hasPhotos = Array.isArray(photos) && photos.length > 0;
              } catch { hasPhotos = false; }
              return hasName && hasPhotos && hasCapacity;
            })(),
            img: doc.photos ? (() => {
              try {
                const photos = JSON.parse(doc.photos);
                const firstId = typeof photos[0] === 'string' ? photos[0] : photos[0].id;
                const baseSrv = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
                const serverUrl = baseSrv.endsWith('/api') ? baseSrv : `${baseSrv}/api`;
                return `${serverUrl}/venues/proxy/image/venues_photos/${firstId}`;
              } catch (e) { return ""; }
            })() : ""
          }));

          // "Top Venues Near You" — only venues with COMPLETE PROFILES (name + photos + capacity)
          const weightedShuffle = (venues: any[]) =>
            [...venues]
              .map(v => ({ v, score: (v.rating || 0) + (v.reviews > 0 ? 100 : 0) + (v.isPaid ? 50 : 0) + Math.random() * 0.5 }))
              .sort((a, b) => b.score - a.score)
              .map(item => item.v);

          // profileComplete = has real name + has photos + has capacity
          let completeVenues = mapped.filter((v: any) => v.profileComplete === true);

          // Fallback: If no venues meet the strict criteria (common in dev/testing), show all venues
          if (completeVenues.length === 0) {
            completeVenues = mapped;
          }

          // Prioritize Paid venues, then shuffle the rest
          const finalVenues = weightedShuffle(completeVenues);
          setLiveVenues(finalVenues.slice(0, 15)); // Show up to 15 venues in the new carousel
        }
      } catch (err) {
        console.warn('Home: Failed to fetch live venues via backend:', err);
      } finally {
        setIsLoadingVenues(false);
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
      <section className="relative pt-32 md:pt-40 pb-16 px-4 md:px-6 overflow-hidden min-h-[90vh] flex flex-col justify-start">
        
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImages[currentSlide]})` }}
            />
          </AnimatePresence>
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-pd-pink/40 to-pd-purple/40 z-10 pointer-events-none" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 w-full text-center mt-0">
            {/* Hero Text */}
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
                <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">
                India&apos;s #1 Venue Booking Platform
                </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Find the Perfect Venue for Your Event
            </h1>

            <p className="text-base md:text-lg text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
                Get free customized quotes from top venues in minutes. Direct connections. Zero brokerage. Beautiful memories.
            </p>

            {/* HORIZONTAL SEARCH WIDGET */}
            <div className="max-w-5xl mx-auto bg-white rounded-[32px] p-2 md:p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 relative mt-8 z-50">
              
              {/* Tabs */}
              <div className="flex items-center gap-2 mb-2 px-2 pt-2 border-b border-slate-100 pb-2">
                 <button onClick={() => setActiveTab('standard')} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'standard' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>
                    <span className="flex items-center gap-2">
                       <MapPin size={16} /> Locations & Dates
                    </span>
                 </button>
                 <button onClick={() => setActiveTab('ai')} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'ai' ? 'bg-pd-pink/10 text-pd-pink' : 'text-slate-500 hover:text-slate-800'}`}>
                    <span className="flex items-center gap-2">
                       Ask AI
                    </span>
                 </button>
              </div>

              {/* Standard Search Fields */}
              {activeTab === 'standard' && (
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0 bg-slate-50 rounded-[24px] p-2">
                  
                  {/* Event Type */}
                  <div className="relative w-full md:w-[22%]" ref={eventDropdownRef}>
                    <button type="button" onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)} className="w-full text-left h-[60px] px-4 rounded-xl hover:bg-slate-100 transition-colors flex flex-col justify-center">
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Event Type</span>
                       <span className={`text-sm font-bold truncate ${formData.eventType ? 'text-slate-900' : 'text-slate-500'}`}>
                         {formData.eventType || "Any Event"}
                       </span>
                    </button>
                    <AnimatePresence>
                      {isEventDropdownOpen && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-64 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-40 py-2 max-h-64 overflow-y-auto custom-scrollbar text-left">
                          {categories.map((cat, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, eventType: cat.name });
                                setIsEventDropdownOpen(false);
                              }}
                              className={`w-full text-left px-5 py-3 text-sm font-bold transition-all flex items-center gap-3 hover:bg-slate-50 ${formData.eventType === cat.name ? 'text-pd-red bg-pd-red/[0.04]' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                              <span className="text-xl opacity-80">{cat.icon}</span>
                              {cat.name}
                              {formData.eventType === cat.name && <CheckCircle2 size={16} className="ml-auto text-pd-red" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="hidden md:block w-px h-10 bg-slate-200" />
                  
                  {/* City / Location */}
                  <div className="relative w-full md:w-[28%]" ref={locationRef}>
                    <div className="w-full h-[60px] px-4 rounded-xl hover:bg-slate-100 transition-colors flex flex-col justify-center cursor-text" onClick={() => {}}>
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider text-left">Location</span>
                       
                       <div className="flex items-center gap-1 w-full overflow-x-auto custom-scrollbar no-scrollbar py-0.5">
                         {formData.locations.map((loc, i) => (
                            <div key={i} className="flex items-center gap-1 bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
                              <span>{loc.display.split('-')[0]}</span>
                              <button onClick={(e) => { e.stopPropagation(); removeLocation(loc.display); }} className="text-slate-400 hover:text-pd-red">
                                <X size={12} />
                              </button>
                            </div>
                         ))}
                         <input
                           type="text"
                           placeholder={formData.locations.length === 0 ? "Where are you going?" : "Add..."}
                           value={locationInput}
                           onChange={(e) => {
                             setLocationInput(e.target.value);
                             setShowSuggestions(true);
                           }}
                           onFocus={() => setShowSuggestions(true)}
                           className="flex-1 bg-transparent border-none text-sm font-bold text-slate-800 outline-none min-w-[100px] placeholder:text-slate-500 placeholder:font-medium p-0 m-0 focus:ring-0 focus:outline-none"
                           style={{ boxShadow: 'none' }}
                         />
                       </div>
                    </div>

                    <AnimatePresence>
                      {showSuggestions && (locationInput.length >= 3) && (suggestions.length > 0 || isLoadingLocations) && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-40 max-h-64 overflow-y-auto custom-scrollbar text-left">
                          {isLoadingLocations ? (
                            <div className="p-6 flex justify-center items-center gap-3 text-sm text-slate-500 font-bold">
                              <div className="w-4 h-4 border-2 border-pd-purple border-t-transparent rounded-full animate-spin" /> Searching...
                            </div>
                          ) : (
                            suggestions.map((s, i) => (
                              s.isError ? (
                                <div key={i} className="p-4 text-center text-xs text-pd-red font-black uppercase tracking-widest bg-pd-red/5 m-2 rounded-xl">
                                  {s.message}
                                </div>
                              ) : (
                                <button
                                  key={i}
                                  onClick={() => addLocation(s)}
                                  className="w-full text-left px-5 py-3 hover:bg-slate-50 text-sm font-bold text-slate-800 transition-colors border-b border-slate-50 last:border-none flex items-center justify-between group"
                                >
                                  <span className="group-hover:text-pd-purple transition-colors">{s.display}</span>
                                  <span className="text-[10px] text-slate-400 uppercase font-black bg-slate-100 px-2 py-1 rounded-md">{s.state}</span>
                                </button>
                              )
                            ))
                          )}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="hidden md:block w-px h-10 bg-slate-200" />

                  {/* Event Date */}
                  <div className="relative w-full md:w-[15%]" ref={datePickerContainerRef}>
                     <div 
                        className="w-full h-[60px] px-4 rounded-xl hover:bg-slate-100 transition-colors flex flex-col justify-center relative cursor-pointer"
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                     >
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider text-left">Date</span>
                        <div className="relative w-full">
                          {/* Display Layer */}
                          <div className={`text-sm truncate text-left pointer-events-none ${formData.date ? 'text-slate-900 font-bold' : 'text-slate-800 font-bold'}`}>
                            {formData.date ? new Date(formData.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Add dates'}
                          </div>
                        </div>
                     </div>
                     
                     <AnimatePresence>
                       {isDatePickerOpen && (
                         <motion.div
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           transition={{ duration: 0.2 }}
                           className="absolute top-[100%] left-0 z-50"
                         >
                           <CustomDatePicker 
                             selectedDate={formData.date}
                             onChange={(date) => setFormData({ ...formData, date })}
                             onClose={() => setIsDatePickerOpen(false)}
                           />
                         </motion.div>
                       )}
                     </AnimatePresence>
                  </div>

                  <div className="hidden md:block w-px h-10 bg-slate-200" />

                  {/* Guest Count */}
                  <div className="relative w-full md:w-[15%]" ref={guestDropdownRef}>
                     <div 
                        className="w-full h-[60px] px-4 rounded-xl hover:bg-slate-100 transition-colors flex flex-col justify-center relative cursor-pointer"
                        onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                     >
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider text-left">Guests</span>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm truncate font-bold ${formData.guests ? 'text-slate-900' : 'text-slate-800'}`}>
                            {formData.guests || 'Capacity'}
                          </span>
                          <ChevronDown size={14} className="text-slate-400" />
                        </div>
                     </div>
                     
                     <AnimatePresence>
                       {isGuestDropdownOpen && (
                         <motion.div
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           transition={{ duration: 0.2 }}
                           className="absolute top-[100%] left-0 z-50 w-48 bg-white border border-slate-100 rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] py-4 flex flex-col"
                         >
                           {['0-50', '50-100', '100-200', '200-500', '500-1000', '1000-2000', '2000-5000', '5000+'].map(capacity => (
                             <button
                               key={capacity}
                               type="button"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setFormData({ ...formData, guests: capacity });
                                 setIsGuestDropdownOpen(false);
                               }}
                               className={`px-6 py-2.5 text-left text-sm font-bold transition-colors ${
                                 formData.guests === capacity ? 'text-pd-pink bg-pd-pink/5' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                               }`}
                             >
                               {capacity}
                             </button>
                           ))}
                         </motion.div>
                       )}
                     </AnimatePresence>
                  </div>

                  {/* Search Button */}
                  <div className="w-full md:w-[20%] p-1">
                    <button onClick={handleSearch} className="w-full h-[52px] bg-pd-pink text-white rounded-[16px] font-black text-sm uppercase tracking-wider hover:bg-pd-red transition-all flex items-center justify-center gap-2 shadow-lg shadow-pd-pink/30 hover:shadow-pd-pink/40 hover:-translate-y-0.5">
                      <Search size={18} /> Search
                    </button>
                  </div>

                </div>
              )}
              
              {/* AI Search Field */}
              {activeTab === 'ai' && (
                 <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0 bg-slate-50 rounded-[24px] p-2">
                   <div className="flex-1 w-full flex items-center gap-3 px-4 h-[60px]">
                      
                      <input 
                         type="text" 
                         value={aiQuery}
                         onChange={(e) => setAiQuery(e.target.value)}
                         placeholder="e.g. Find a wedding venue in Delhi for 500 guests under 20 lakhs" 
                         className="w-full bg-transparent border-none outline-none text-slate-800 text-sm md:text-base font-medium placeholder:text-slate-400 focus:ring-0"
                      />
                   </div>
                   <div className="w-full md:w-auto p-1 shrink-0">
                     <button 
                       onClick={() => {
                         if (aiQuery) {
                           window.location.href = `/venues?aiQuery=${encodeURIComponent(aiQuery)}`;
                         }
                       }}
                       className="w-full md:w-auto px-8 h-[52px] bg-linear-to-r from-pd-purple to-pd-blue text-white rounded-[16px] font-black text-sm uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pd-purple/30 hover:-translate-y-0.5"
                     >
                       Ask AI
                     </button>
                   </div>
                 </div>
              )}
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex justify-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-4 text-sm font-bold text-slate-700 bg-white/40 p-3 rounded-full border border-white/60 shadow-sm px-6">
                  <div className="flex -space-x-3 shrink-0">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} size={12} fill="currentColor" />)}
                    </div>
                    <span className="leading-tight text-slate-800">Trusted by <span className="text-pd-purple font-black">50,000+</span> happy hosts</span>
                  </div>
                </div>
            </div>
        </div>
      </section>




      {/* TOP VENUES NEAR YOU */}
      <section className="py-24 px-6 lg:px-12 bg-slate-50">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 md:mb-16 gap-8 text-center md:text-left">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4 leading-none tracking-tight">
                Top Venues <span className="pd-gradient-text block sm:inline px-1">Near You</span>
              </h2>
              <p className="text-slate-500 font-medium text-base md:text-lg">Personally verified luxury venues for your grand celebrations.</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
              <div className="flex items-center gap-2 mr-2">
                <button
                  onClick={() => venueScrollRef.current?.slidePrev()}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pd-red hover:border-pd-red/20 hover:shadow-lg transition-all active:scale-90"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => venueScrollRef.current?.slideNext()}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pd-red hover:border-pd-red/20 hover:shadow-lg transition-all active:scale-90"
                  aria-label="Scroll Right"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <Link href="/venues">
                <button className="group w-full sm:w-auto relative overflow-hidden rounded-2xl bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-800 transition-all hover:shadow-lg hover:shadow-pd-pink/10 border border-slate-200 hover:border-pd-pink/30">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    View All
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-pd-pink/5 to-pd-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </Link>
            </div>
          </div>

          <Swiper
            onSwiper={(swiper) => (venueScrollRef.current = swiper)}
            slidesPerView="auto"
            spaceBetween={32}
            grabCursor={true}
            className="pb-10 px-6"
          >
            {isLoadingVenues ? (
              [1,2,3,4,5].map(i => (
                <SwiperSlide key={i} className="!w-full sm:!w-[320px] md:!w-[340px] lg:!w-[340px] xl:!w-[360px] !h-[420px]">
                  <div className="w-full h-full bg-slate-200 animate-pulse rounded-[1.5rem]" />
                </SwiperSlide>
              ))
            ) : displayVenues.map((venue, i) => (
              <SwiperSlide key={venue.id} className="!w-full sm:!w-[320px] md:!w-[340px] lg:!w-[340px] xl:!w-[360px] !h-auto self-stretch flex flex-col">
                <VenueCard venue={venue} index={i} isPremium={venue.isPaid} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* FEATURED SERVICES / VENDORS */}
      <section className="py-24 px-6 lg:px-12 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        <div className="max-w-[1600px] mx-auto mb-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4 tracking-tight leading-none">
              Featured <span className="pd-gradient-text px-1">Services</span>
            </h2>
            <p className="text-slate-500 font-medium text-base md:text-lg">Discover top-rated decorators, caterers, and other premium vendors.</p>
          </div>
          <button onClick={() => window.dispatchEvent(new Event('open-coming-soon'))} className="hidden sm:block group relative overflow-hidden rounded-2xl bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-800 transition-all hover:shadow-lg hover:shadow-pd-pink/10 border border-slate-200 hover:border-pd-pink/30">
            <span className="relative z-10 flex items-center justify-center gap-2">
              All Services <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Premium Catering", desc: "Delight your guests with exquisite multi-cuisine menus.", img: "/categories/corporate.png" },
            { title: "Expert Decorators", desc: "Transform any space into a mesmerizing dreamscape.", img: "/categories/wedding.png" },
            { title: "Top Photographers", desc: "Capture every precious moment perfectly.", img: "/categories/birthday.png" },
            { title: "Makeup Artists", desc: "Look your absolute best for your special day.", img: "/categories/bachelor.png" },
          ].map((service, i) => (
            <div key={i} onClick={() => window.dispatchEvent(new Event('open-coming-soon'))} className="group bg-white rounded-[2rem] p-4 md:p-6 border border-slate-100 hover:border-pd-pink/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col">
              <div className="w-full h-48 md:h-56 rounded-2xl overflow-hidden mb-6 bg-slate-100 relative">
                <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="px-2 pb-2">
                <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-pd-pink transition-colors">{service.title}</h3>
                <p className="text-slate-500 font-medium mb-6 text-sm leading-relaxed">{service.desc}</p>
                <div className="flex items-center text-sm font-bold text-pd-pink group-hover:gap-2 transition-all mt-auto">
                  Explore <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEST VENUES IN HALDWANI */}
      {(isLoadingVenues || haldwaniVenues.length > 0) && (
        <section className="py-24 px-6 lg:px-12 bg-white">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 md:mb-16 gap-8 text-center md:text-left">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4 leading-none tracking-tight">
                  Best Venues in <span className="pd-gradient-text block sm:inline px-1">Haldwani</span>
                </h2>
                <p className="text-slate-500 font-medium text-base md:text-lg">Discover the most sought-after celebration spaces in the city of Haldwani.</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
                <div className="flex items-center gap-2 mr-2">
                  <button
                    onClick={() => haldwaniScrollRef.current?.slidePrev()}
                    className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pd-red hover:border-pd-red/20 hover:shadow-lg transition-all active:scale-90"
                    aria-label="Scroll Left"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => haldwaniScrollRef.current?.slideNext()}
                    className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pd-red hover:border-pd-red/20 hover:shadow-lg transition-all active:scale-90"
                    aria-label="Scroll Right"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <Link href="/venues?location=Haldwani">
                  <button className="group w-full sm:w-auto relative overflow-hidden rounded-2xl bg-slate-50 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-800 transition-all hover:shadow-lg hover:shadow-pd-pink/10 border border-slate-200 hover:border-pd-pink/30">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      View All
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-pd-pink/5 to-pd-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </Link>
              </div>
            </div>

            <Swiper
              onSwiper={(swiper) => (haldwaniScrollRef.current = swiper)}
              slidesPerView="auto"
              spaceBetween={32}
              grabCursor={true}
              className="pb-10 px-6"
            >
              {isLoadingVenues ? (
              [1,2,3,4,5].map(i => (
                <SwiperSlide key={i} className="!w-full sm:!w-[320px] md:!w-[340px] lg:!w-[340px] xl:!w-[360px] !h-[420px]">
                  <div className="w-full h-full bg-slate-200 animate-pulse rounded-[1.5rem]" />
                </SwiperSlide>
              ))
            ) : haldwaniVenues.map((venue: any, i: number) => (
                <SwiperSlide key={venue.id} className="!w-full sm:!w-[320px] md:!w-[340px] lg:!w-[340px] xl:!w-[360px] !h-auto self-stretch flex flex-col">
                  <MinimalVenueCard venue={venue} index={i} isPremium={venue.isPaid} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* BEST VENUES IN RAMNAGAR */}
      {(isLoadingVenues || ramnagarVenues.length > 0) && (<section className="py-24 px-6 lg:px-12 bg-slate-50">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 md:mb-16 gap-8 text-center md:text-left">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4 leading-none tracking-tight">
                Best Venues in <span className="pd-gradient-text block sm:inline px-1">Ramnagar</span>
              </h2>
              <p className="text-slate-500 font-medium text-base md:text-lg">Discover the most sought-after celebration spaces in the city of Ramnagar.</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
              <div className="flex items-center gap-2 mr-2">
                <button
                  onClick={() => ramnagarScrollRef.current?.slidePrev()}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pd-red hover:border-pd-red/20 hover:shadow-lg transition-all active:scale-90"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => ramnagarScrollRef.current?.slideNext()}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pd-red hover:border-pd-red/20 hover:shadow-lg transition-all active:scale-90"
                  aria-label="Scroll Right"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <Link href="/venues?location=Ramnagar">
                <button className="group w-full sm:w-auto relative overflow-hidden rounded-2xl bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-800 transition-all hover:shadow-lg hover:shadow-pd-pink/10 border border-slate-200 hover:border-pd-pink/30">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    View All
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-pd-pink/5 to-pd-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </Link>
            </div>
          </div>

          <Swiper
            onSwiper={(swiper) => (ramnagarScrollRef.current = swiper)}
            slidesPerView="auto"
            spaceBetween={32}
            grabCursor={true}
            className="pb-10 px-6"
          >
            {isLoadingVenues ? (
              [1,2,3,4,5].map(i => (
                <SwiperSlide key={i} className="!w-full sm:!w-[320px] md:!w-[340px] lg:!w-[340px] xl:!w-[360px] !h-[420px]">
                  <div className="w-full h-full bg-slate-200 animate-pulse rounded-[1.5rem]" />
                </SwiperSlide>
              ))
            ) : ramnagarVenues.map((venue: any, i: number) => (
              <SwiperSlide key={venue.id} className="!w-full sm:!w-[320px] md:!w-[340px] lg:!w-[340px] xl:!w-[360px] !h-auto self-stretch flex flex-col">
                <MinimalVenueCard venue={venue} index={i} isPremium={venue.isPaid} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>)}

      {/* HOW IT WORKS - PREMIUM LIGHT THEME */}
      <section className="py-24 md:py-32 px-6 bg-white relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(236,72,153,0.03)_0%,transparent_70%)] rounded-full transform-gpu pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.03)_0%,transparent_70%)] rounded-full transform-gpu pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4 tracking-tight">
                How it <span className="pd-gradient-text">Works</span>
              </h2>
              <p className="text-slate-500 font-bold tracking-[0.3em] text-[10px] md:text-xs">Your journey to the perfect event in 3 simple steps</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Horizontal Flow Line connecting them on Desktop */}
            <div className="hidden md:block absolute top-[48px] left-[15%] right-[15%] h-[2px] bg-slate-100 rounded-full z-0 overflow-hidden">
              <div className="w-1/3 h-full bg-linear-to-r from-transparent via-pd-pink to-pd-blue animate-[marquee_3s_linear_infinite]" />
            </div>

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                className="group relative z-10 h-full"
              >
                {/* Flow Arrow for Mobile */}
                {i < steps.length - 1 && (
                  <div className="md:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 w-4 h-4 text-slate-300 z-0">
                    <ArrowRight className="rotate-90 opacity-50" size={16} />
                  </div>
                )}

                <div className="h-full bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:shadow-pd-pink/10 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group-hover:-translate-y-2">

                  {/* Decorative background gradient on hover */}
                  <div className="absolute inset-0 bg-linear-to-b from-transparent to-pd-pink/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Big Number Watermark */}
                  <div className="absolute -top-4 -right-4 text-[140px] font-black text-slate-50 group-hover:text-pd-pink/[0.03] transition-colors duration-500 pointer-events-none select-none leading-none tracking-tighter">
                    0{i + 1}
                  </div>

                  {/* Icon Container */}
                  <div className="relative mb-10 mt-4">
                    {/* Pulsing ring on hover */}
                    <div className="absolute inset-0 border-2 border-pd-pink/20 rounded-full scale-100 opacity-0 group-hover:scale-[1.35] group-hover:opacity-100 transition-all duration-700 ease-out" />
                    <div className="absolute inset-0 bg-pd-pink/10 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="w-24 h-24 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center relative z-10 group-hover:border-pd-pink/30 transition-colors duration-500">
                      <div className="text-slate-400 group-hover:text-pd-pink transition-colors duration-500">
                        {React.isValidElement(step.icon) ? React.cloneElement(step.icon as React.ReactElement<any>, { size: 40, strokeWidth: 1.5, className: "group-hover:scale-110 transition-transform duration-500" }) : step.icon}
                      </div>
                    </div>
                  </div>

                  {/* Step Badge */}
                  <div className="mb-4 bg-slate-50 text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-slate-200 group-hover:bg-pd-pink group-hover:text-white group-hover:border-pd-pink transition-colors duration-300 relative z-10">
                    Step 0{i + 1}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3 tracking-tight group-hover:text-pd-pink transition-colors duration-300 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed relative z-10">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* TESTIMONIALS - PREMIUM WHITE EDITION */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        {/* Soft Background Blurs */}
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(236,72,153,0.05)_0%,transparent_70%)] rounded-full blur-3xl transform-gpu pointer-events-none" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.05)_0%,transparent_70%)] rounded-full blur-3xl transform-gpu pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 mb-24 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-semibold text-slate-900 mb-6 tracking-tighter leading-none">
              Happy <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink via-purple-500 to-pd-blue drop-shadow-sm px-2">
                Celebrators
              </span>
            </h2>
            <p className="text-slate-400 uppercase tracking-[0.4em] font-black text-[10px] md:text-xs">Real stories from our valued clients</p>
          </motion.div>
        </div>

        {/* Style to force linear smooth scrolling for CSS Marquee */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee-reverse {
            animation: marquee-reverse 30s linear infinite;
          }
          .testimonials-row:hover .animate-marquee,
          .testimonials-row:hover .animate-marquee-reverse {
            animation-play-state: paused;
          }
        `}} />

        {/* Marquee Container with Gradient Mask */}
        <div className="relative flex flex-col overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pb-10 gap-6 md:gap-8">

          {/* Row 1 - Scrolling Left */}
          <div className="w-full testimonials-row overflow-hidden flex">
            <div className="flex animate-marquee min-w-max gap-6 md:gap-8 pr-6 md:pr-8">
              {[...Array(2)].map((_, arrayIndex) => [
                { name: "Rahul Malhotra", text: "PartyDial made our wedding planning so much easier! We received 5 quotes within 2 hours and booked a beautiful palace.", avatar: "https://randomuser.me/api/portraits/men/18.jpg" },
                { name: "Sneha Kapoor", text: "As a corporate event planner, I need quick responses. PartyDial delivered! Found an amazing rooftop venue for our team's meet.", avatar: "https://randomuser.me/api/portraits/women/20.jpg" },
                { name: "Amit Verma", text: "Found the perfect banquet hall for my son's 1st birthday. The zero brokerage promise is real – we saved a lot!", avatar: "https://randomuser.me/api/portraits/men/24.jpg" },
                { name: "Priya Sharma", text: "The aesthetic of the venues I found through PartyDial was incredible. Perfect for my content and within budget!", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
                { name: "Vikram Singh", text: "Professional service and transparent pricing. No hidden costs. Best platform for premium venue discovery.", avatar: "https://randomuser.me/api/portraits/men/63.jpg" }
              ].map((t, i) => (
                <div key={`${arrayIndex}-${i}`} className="w-[320px] md:w-[420px] shrink-0">
                  <div className="w-full h-[300px] bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative group hover:-translate-y-2 transition-all duration-500 hover:shadow-xl hover:shadow-pd-pink/10 hover:border-pd-pink/20 whitespace-normal flex flex-col cursor-grab active:cursor-grabbing">
                    <div className="absolute top-6 right-8 opacity-20 group-hover:opacity-100 group-hover:text-pd-pink transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110 pointer-events-none">
                      <Quote size={48} fill="currentColor" className="text-slate-300 group-hover:text-pd-pink" />
                    </div>

                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:border-pd-pink transition-colors duration-500 relative shrink-0">
                        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover pointer-events-none" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-lg tracking-tight">{t.name}</h4>
                      </div>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed flex-1 text-sm md:text-base select-none relative z-10">
                      &quot;{t.text}&quot;
                    </p>
                  </div>
                </div>
              )))}
            </div>
          </div>

          {/* Row 2 - Scrolling Right */}
          <div className="w-full testimonials-row overflow-hidden flex">
            <div className="flex animate-marquee-reverse min-w-max gap-6 md:gap-8 pr-6 md:pr-8">
              {[...Array(2)].map((_, arrayIndex) => [
                { name: "Neha Gupta", role: "Anniversary Celebration", text: "Booked a resort for our 10th anniversary. The options provided were exactly what we had in mind. Flawless experience!", avatar: "6" },
                { name: "Karan Desai", role: "Event Organizer", text: "I regularly use PartyDial for my clients. The interface is smooth, and the venues listed are verified. It saves me days of research.", avatar: "7" },
                { name: "Anjali Rao", role: "Pre-Wedding Shoot", text: "Finding an aesthetic venue for our shoot was tough until we used PartyDial. Directly connected with the owner and booked it!", avatar: "8" },
                { name: "Sameer Khan", role: "Startup Founder", text: "Hosted our product launch party at a venue found here. The direct pricing feature helped us stay well within our bootstrap budget.", avatar: "9" },
                { name: "Pooja Mehta", role: "Baby Shower", text: "Everything from finding the venue to booking was completely hassle-free. Absolutely highly recommend PartyDial to anyone!", avatar: "10" }
              ].map((t, i) => (
                <div key={`${arrayIndex}-${i}`} className="w-[320px] md:w-[420px] shrink-0">
                  <div className="w-full h-[300px] bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative group hover:-translate-y-2 transition-all duration-500 hover:shadow-xl hover:shadow-pd-blue/10 hover:border-pd-blue/20 whitespace-normal flex flex-col cursor-grab active:cursor-grabbing">
                    <div className="absolute top-6 right-8 opacity-20 group-hover:opacity-100 group-hover:text-pd-blue transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110 pointer-events-none">
                      <Quote size={48} fill="currentColor" className="text-slate-300 group-hover:text-pd-blue" />
                    </div>

                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:border-pd-blue transition-colors duration-500 relative">
                        <img src={`https://i.pravatar.cc/150?u=user${t.avatar}`} alt={t.name} className="w-full h-full object-cover pointer-events-none" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-lg tracking-tight">{t.name}</h4>
                        <p className="text-[10px] font-bold text-pd-blue uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed flex-1 text-sm md:text-base select-none relative z-10">
                      &quot;{t.text}&quot;
                    </p>
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-slate-900 mb-4">Got <span className="pd-gradient-text px-1">Questions?</span></h2>
            <div className="w-20 h-1.5 bg-pd-red mx-auto rounded-full mb-6"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Everything you need to know about planning your next event</p>
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
                  <span className="font-semibold text-slate-700 text-base group-hover:text-pd-red transition-colors pr-8 leading-tight">{faq.q}</span>
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
                        <p className="text-slate-500 font-medium leading-relaxed  border-l-4 border-pd-red/20 pl-6">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>






    </main>
  );
}
