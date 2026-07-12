/* eslint-disable @next/next/no-img-element, react-hooks/exhaustive-deps, react/no-unescaped-entities */
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
  Sparkles
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
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
  const venueScrollRef = useRef<any>(null);
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
            rating: parseFloat(doc.rating) || 4.5,
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
              .map(v => ({ v, score: (v.rating || 0) + Math.random() * 0.5 }))
              .sort((a, b) => b.score - a.score)
              .map(item => item.v);

          // profileComplete = has real name + has photos + has capacity
          const completeVenues = mapped.filter((v: any) => v.profileComplete === true);

          // Prioritize Paid venues, then shuffle the rest
          const paidVenues = weightedShuffle(completeVenues.filter((v: any) => v.isPaid));
          const otherVenues = weightedShuffle(completeVenues.filter((v: any) => !v.isPaid));

          const finalVenues = [...paidVenues, ...otherVenues];
          setLiveVenues(finalVenues.slice(0, 15)); // Show up to 15 venues in the new carousel
        }
      } catch (err) {
        console.warn('Home: Failed to fetch live venues via backend:', err);
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
      <section className="relative pt-12 lg:pt-24 pb-16 lg:pb-24 px-4 md:px-6 overflow-hidden bg-slate-50 min-h-[90vh] flex items-center">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Main gradient blobs */}
          <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.1)_0%,transparent_70%)] opacity-70" />
          <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)] opacity-70" />
          <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.05)_0%,transparent_70%)] opacity-70" />

          {/* subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] bg-repeat" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Hero Text */}
            <div className="w-full lg:w-[55%] text-left">
              <div>
                <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/60  border border-slate-200/50 shadow-sm">
                  <span className="text-xs md:text-sm font-bold bg-linear-to-r from-pd-pink to-pd-purple bg-clip-text text-transparent uppercase tracking-wider">
                    🎉 India&apos;s #1 Venue Booking Platform
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-[72px] font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-8">
                  Find the <br className="hidden md:block" />
                  <span className="relative inline-block mt-2">
                    <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-pd-pink via-pd-purple to-pd-blue pr-4 pb-2">
                      Perfect Venue
                    </span>
                    {/* Highlight swoop below text */}
                    <svg className="absolute w-full h-4 -bottom-2 left-0 -z-10 text-pd-pink/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 0" stroke="currentColor" strokeWidth="3" fill="none" />
                    </svg>
                  </span>
                  <br className="hidden md:block" /> for Your Event
                </h1>

                <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl leading-relaxed font-medium">
                  Get free customized quotes from top venues in minutes. Direct connections. Zero brokerage. Beautiful memories.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-sm font-bold text-slate-700 bg-white/40 p-4 rounded-2xl  border border-white/60 shadow-sm">
                  <div className="flex -space-x-3 shrink-0">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-[3px] border-white bg-slate-200 overflow-hidden shadow-sm transition-transform hover:scale-110 hover:z-10">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-amber-400 mb-1">
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill="currentColor" />)}
                    </div>
                    <span className="leading-tight text-slate-800">Trusted by <span className="text-pd-purple font-black">50,000+</span> happy hosts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Form */}
            <div className="w-full lg:w-[45%] relative">
              {/* Decorative background for the form */}
              <div className="absolute -inset-4 bg-linear-to-r from-pd-pink to-pd-blue opacity-30 blur-xl rounded-[40px] -z-10 transform-gpu transition-transform" />

              <div className="bg-white/95 p-8 md:p-10 rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white relative overflow-visible">
                {/* Floating Badge */}
                <div className="absolute -top-5 -right-5 bg-linear-to-r from-amber-400 to-orange-500 text-white w-20 h-20 rounded-full flex flex-col items-center justify-center font-black shadow-lg transform rotate-12 z-20 border-4 border-white">
                  <span className="text-2xl leading-none">FREE</span>
                  <span className="text-[10px] tracking-wider uppercase">Quotes</span>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Check Availability</h3>
                  <p className="text-slate-500 text-sm font-medium">Find the best prices for your dates instantly.</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2 relative" ref={eventDropdownRef}>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Event Type</label>
                    <button
                      type="button"
                      onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                      className={`w-full h-14 bg-slate-50/80 border ${isEventDropdownOpen ? 'border-pd-purple ring-4 ring-pd-purple/10' : 'border-slate-200 hover:border-slate-300'} rounded-2xl px-5 text-sm font-bold text-slate-800 outline-none transition-all flex items-center justify-between group shadow-inner shadow-slate-100/50`}
                    >
                      <span className={formData.eventType ? 'text-slate-900' : 'text-slate-400'}>
                        {formData.eventType || "What are you celebrating?"}
                      </span>
                      <ChevronDown className={`text-slate-400 transition-transform duration-300 ${isEventDropdownOpen ? 'rotate-180' : ''}`} size={18} />
                    </button>

                    <AnimatePresence>
                      {isEventDropdownOpen && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-40 py-2 max-h-64 overflow-y-auto custom-scrollbar">
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

                  <div className="space-y-2 relative" ref={locationRef}>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">City / Location</label>
                    <div className={`w-full min-h-14 bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-2 flex flex-wrap items-center gap-2 transition-all focus-within:border-pd-purple focus-within:ring-4 focus-within:ring-pd-purple/10 shadow-inner shadow-slate-100/50`}>
                      <MapPin className="text-pd-red shrink-0 ml-1" size={18} />

                      {formData.locations.map((loc, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm">
                          <span>{loc.display}</span>
                          <button onClick={() => removeLocation(loc.display)} className="text-slate-400 hover:text-pd-red transition-colors bg-slate-50 rounded-full p-0.5">
                            <X size={12} />
                          </button>
                        </div>
                      ))}

                      <input
                        type="text"
                        placeholder={formData.locations.length === 0 ? "Enter Pincode or City" : "Add another..."}
                        value={locationInput}
                        onChange={(e) => {
                          setLocationInput(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="flex-1 bg-transparent border-none text-sm font-bold text-slate-800 outline-none min-w-[140px] ml-1 placeholder:font-medium placeholder:text-slate-400"
                      />
                    </div>

                    <AnimatePresence>
                      {showSuggestions && (locationInput.length >= 3) && (suggestions.length > 0 || isLoadingLocations) && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-40 max-h-64 overflow-y-auto custom-scrollbar">
                          {isLoadingLocations ? (
                            <div className="p-6 flex justify-center items-center gap-3 text-sm text-slate-500 font-bold">
                              <div className="w-4 h-4 border-2 border-pd-purple border-t-transparent rounded-full animate-spin" /> Searching...
                            </div>
                          ) : (
                            suggestions.map((s: any, i) => (
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Event Date</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-pd-purple transition-colors" size={18} />
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full h-14 bg-slate-50/80 border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-800 outline-none focus:border-pd-purple focus:ring-4 focus:ring-pd-purple/10 transition-all shadow-inner shadow-slate-100/50 hover:border-slate-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Guest Count</label>
                      <div className="relative group">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-pd-blue transition-colors" size={18} />
                        <select
                          className="w-full h-14 bg-slate-50/80 border border-slate-200 rounded-2xl pl-12 pr-10 text-sm font-bold text-slate-800 outline-none focus:border-pd-purple focus:ring-4 focus:ring-pd-purple/10 transition-all appearance-none cursor-pointer shadow-inner shadow-slate-100/50 hover:border-slate-300"
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        >
                          <option value="">Capacity</option>
                          <option value="0-50">0-50</option>
                          <option value="50-100">50-100</option>
                          <option value="100-200">100-200</option>
                          <option value="200-500">200-500</option>
                          <option value="500-1000">500-1000</option>
                          <option value="1000-2000">1000-2000</option>
                          <option value="2000-5000">2000-5000</option>
                          <option value="5000+">5000+</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  className="group relative w-full h-16 mt-8 rounded-2xl overflow-hidden shadow-xl shadow-pd-pink/30 hover:shadow-pd-pink/40 transition-all duration-300 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-pd-pink via-pd-purple to-pd-blue transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.15em] text-sm h-full">
                    <span>Show Me Venues</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </div>
                </button>

                <p className="text-center mt-5 text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" /> No booking fees. 100% genuine reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPACT STATS BAR - Optimized for single-screen visibility */}
      <section className="pb-10 pt-4 px-4 md:px-6 relative z-20">
        <div className="max-w-6xl mx-auto bg-white rounded-[2rem] md:rounded-full p-4 md:py-4 md:px-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100">
          <div className="flex flex-col md:flex-row items-center justify-between divide-y md:divide-y-0 md:divide-x divide-slate-100">

            {/* Stat Item 1 */}
            <div className="flex-1 w-full md:w-auto flex items-center justify-center md:justify-start gap-4 px-4 py-3 md:py-0">
              <div className="w-12 h-12 rounded-full bg-pd-red/10 flex items-center justify-center text-pd-red shrink-0">
                <Building2 size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none mb-1">
                  <AnimatedCounter end={500} suffix="+" />
                </h3>
                <p className="text-[10px] md:text-xs font-bold text-slate-500">
                  Premium Venues
                </p>
              </div>
            </div>

            {/* Stat Item 2 */}
            <div className="flex-1 w-full md:w-auto flex items-center justify-center md:justify-start gap-4 px-4 py-3 md:py-0">
              <div className="w-12 h-12 rounded-full bg-pd-purple/10 flex items-center justify-center text-pd-purple shrink-0">
                <Users size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none mb-1">
                  <AnimatedCounter end={10000} suffix="+" />
                </h3>
                <p className="text-[10px] md:text-xs font-bold text-slate-500">
                  Happy Inquiries
                </p>
              </div>
            </div>

            {/* Stat Item 3 */}
            <div className="flex-1 w-full md:w-auto flex items-center justify-center md:justify-start gap-4 px-4 py-3 md:py-0">
              <div className="w-12 h-12 rounded-full bg-pd-blue/10 flex items-center justify-center text-pd-blue shrink-0">
                <Globe size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none mb-1">
                  <AnimatedCounter end={7} suffix="" />
                </h3>
                <p className="text-[10px] md:text-xs font-bold text-slate-500">
                  Cities Covered
                </p>
              </div>
            </div>

            {/* Stat Item 4 */}
            <div className="flex-1 w-full md:w-auto flex items-center justify-center md:justify-start gap-4 px-4 py-3 md:py-0">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <ShieldCheck size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none mb-1">
                  <AnimatedCounter end={98} suffix="%" />
                </h3>
                <p className="text-[10px] md:text-xs font-bold text-slate-500">
                  Customer Satisfaction
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 text-center md:text-left">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-none uppercase tracking-tight">
                Explore <span className="pd-gradient-text px-1">Categories</span>
              </h2>
              <p className="text-slate-500 font-medium text-base md:text-lg">Find the perfect setting for every occasion, from grand weddings to intimate parties.</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
              <div className="flex items-center gap-2 mr-2">
                <button
                  onClick={() => categoriesScrollRef.current?.slidePrev()}
                  className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pd-red hover:border-pd-red/20 hover:shadow-lg transition-all active:scale-90"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => categoriesScrollRef.current?.slideNext()}
                  className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pd-red hover:border-pd-red/20 hover:shadow-lg transition-all active:scale-90"
                  aria-label="Scroll Right"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <Link href="/categories" className="hidden sm:block">
                <button className="group w-full sm:w-auto relative overflow-hidden rounded-2xl bg-slate-50 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-800 transition-all hover:shadow-lg hover:shadow-pd-pink/10 border border-slate-200 hover:border-pd-pink/30">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    All Categories
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-pd-pink/5 to-pd-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Draggable Carousel Container */}
        <div className="relative w-full pb-10">
          {/* Gradient Edges for smooth fading */}
          <div className="absolute inset-y-0 left-0 w-8 md:w-24 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 md:w-24 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

          <Swiper
            onSwiper={(swiper) => (categoriesScrollRef.current = swiper)}
            slidesPerView="auto"
            spaceBetween={24}
            grabCursor={true}
            className="px-6"
          >
            {categories.map((cat, i) => (
              <SwiperSlide key={i} className="!w-[260px] md:!w-[320px] !h-auto self-stretch flex flex-col">
                <Link href={`/venues?type=${cat.name.toLowerCase().replace(/\s+/g, '-')}`} draggable="false" className="group block relative w-full h-[325px] md:h-[400px] rounded-[28px] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:shadow-pd-pink/20 transition-all duration-500 bg-slate-100 ring-1 ring-black/5">
                  {/* Background Image with Scale Effect */}
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 pointer-events-none"
                    loading="lazy"
                  />

                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

                  {/* Subtle Color Overlay on Hover */}
                  <div className="absolute inset-0 bg-pd-purple/10  opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-5 right-5 bg-white/10  border border-white/20 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                    {categoryCounts[cat.name] || 0} Venues
                  </div>

                  {/* Content Area */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end pointer-events-none">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      {/* Icon Circle */}
                      <div className="w-10 h-10 rounded-full bg-white/20  border border-white/30 flex items-center justify-center text-xl mb-4 shadow-sm group-hover:bg-pd-pink transition-colors duration-500">
                        {cat.icon}
                      </div>

                      <h3 className="text-white font-extrabold text-lg md:text-xl uppercase tracking-wider leading-tight mb-2 drop-shadow-md">
                        {cat.name}
                      </h3>

                      {/* Decorative Line */}
                      <div className="w-8 h-1 bg-pd-pink rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out origin-left scale-x-0 group-hover:scale-x-100" />
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* TOP VENUES NEAR YOU */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 md:mb-16 gap-8 text-center md:text-left">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-none uppercase tracking-tight">
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
              <Link href="/venues" className="hidden sm:block">
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
            spaceBetween={24}
            grabCursor={true}
            className="pb-10 px-6"
          >
            {displayVenues.map((venue, i) => (
              <SwiperSlide key={venue.id} className="!w-full sm:!w-[320px] md:!w-[340px] lg:!w-[295px] !h-auto self-stretch flex flex-col">
                <VenueCard venue={venue} index={i} isPremium={venue.isPaid} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

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
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tight">
                How it <span className="pd-gradient-text">Works</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">Your journey to the perfect event in 3 simple steps</p>
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
                  <div className="mb-4 bg-slate-50 text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 group-hover:bg-pd-pink group-hover:text-white group-hover:border-pd-pink transition-colors duration-300 relative z-10">
                    Step 0{i + 1}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-pd-pink transition-colors duration-300 relative z-10">
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

      {/* WHY CHOOSE PARTYDIAL - BENTO GRID EDITION */}
      <section className="py-24 md:py-32 px-4 sm:px-6 bg-[#FDFDFF] relative overflow-hidden border-t border-slate-100">
        {/* Soft Background Blurs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(236,72,153,0.03)_0%,transparent_70%)] rounded-full transform-gpu pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(59,130,246,0.03)_0%,transparent_70%)] rounded-full transform-gpu pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-none">
                Why Choose <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink via-purple-500 to-pd-blue drop-shadow-sm px-1">PartyDial?</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] md:text-sm">The smartest way to book your next celebration</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Bento Block 1: AI Search (Spans 2 columns on Desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group shadow-[0_20px_50px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(159,80,225,0.2)] transition-shadow duration-500"
            >
              <div className="absolute inset-0 bg-linear-to-br from-pd-purple/20 to-transparent opacity-50 "></div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-pd-pink/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center  mb-8 border border-white/20">
                    <Sparkles size={28} className="text-pd-pink" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                    AI-Powered Venue Matching
                  </h3>
                  <p className="text-slate-300 font-medium text-lg max-w-md leading-relaxed">
                    Skip the endless scrolling and filters. Just type exactly what you&apos;re imagining, and our AI instantly finds the perfect venues tailored for you.
                  </p>
                </div>
                <div className="mt-8">
                  <Link href="/ai-search" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-black text-sm uppercase tracking-wider hover:bg-pd-pink hover:text-white transition-colors duration-300">
                    Try AI Search <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Bento Block 2: Zero Brokerage */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group shadow-[0_15px_40px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-pd-blue/30 transition-colors duration-300"
            >
              <div className="w-14 h-14 bg-pd-blue/10 rounded-2xl flex items-center justify-center mb-8">
                <ShieldCheck size={28} className="text-pd-blue" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Zero Brokerage</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Connect directly with venue owners. No middlemen, no hidden fees, and complete transparency in every transaction.
              </p>
            </motion.div>

            {/* Bento Block 3: Best Price Guarantee */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-pd-pink rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group shadow-[0_15px_40px_rgba(255,59,107,0.2)] text-white"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8 ">
                  <IndianRupee size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Best Price Guarantee</h3>
                <p className="text-white/90 font-medium leading-relaxed">
                  We negotiate the best rates for you. Find a lower price for the exact same package elsewhere, and we will match it.
                </p>
              </div>
            </motion.div>

            {/* Bento Block 4: Verified Venues (Spans 2 columns on Desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group shadow-[0_15px_40px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row items-center gap-10"
            >
              <div className="flex-1">
                <div className="w-14 h-14 bg-pd-purple/10 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle2 size={28} className="text-pd-purple" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">100% Verified Venues</h3>
                <p className="text-slate-500 font-medium text-lg leading-relaxed mb-6">
                  Every venue listed on PartyDial goes through a rigorous physical verification process. What you see in our high-quality photos is exactly what you get.
                </p>
                <div className="flex gap-2 flex-wrap">
                  {['Quality Checked', 'Safe & Secure', 'Authentic Photos'].map(tag => (
                    <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-100">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="hidden md:block w-48 h-48 rounded-full border-[8px] border-slate-50 relative overflow-hidden shrink-0 shadow-[inset_0_10px_20px_rgba(0,0,0,0.1)]">
                <Image src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400" alt="Verified Venue" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-pd-purple/20 "></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white text-pd-purple w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 size={24} />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* TESTIMONIALS - DUAL MARQUEE EDITION */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        {/* Soft Background Blurs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(236,72,153,0.03)_0%,transparent_70%)] rounded-full transform-gpu pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(59,130,246,0.03)_0%,transparent_70%)] rounded-full transform-gpu pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 mb-24 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">
              Happy <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink via-purple-500 to-pd-blue drop-shadow-sm px-2">
                Celebrators
              </span>
            </h2>
            <p className="text-slate-400 uppercase tracking-[0.4em] font-black text-[10px] md:text-xs">Real stories from our valued clients</p>
          </motion.div>
        </div>

        {/* Style to force linear smooth scrolling for Swiper */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .testimonials-swiper .swiper-wrapper {
            transition-timing-function: linear !important;
          }
        `}} />

        {/* Marquee Container with Gradient Mask */}
        <div className="relative flex flex-col overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pb-10 gap-6 md:gap-8">

          {/* Row 1 - Scrolling Left */}
          <div className="w-full">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={32}
              slidesPerView="auto"
              loop={true}
              speed={6000}
              allowTouchMove={false}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              className="testimonials-swiper"
            >
              {[
                { name: "Rahul Malhotra", role: "Wedding Host", text: "PartyDial made our wedding planning so much easier! We received 5 quotes within 2 hours and booked a beautiful palace.", avatar: "1" },
                { name: "Sneha Kapoor", role: "Corporate Planner", text: "As a corporate event planner, I need quick responses. PartyDial delivered! Found an amazing rooftop venue for our team's meet.", avatar: "2" },
                { name: "Amit Verma", role: "Birthday Host", text: "Found the perfect banquet hall for my son's 1st birthday. The zero brokerage promise is real – we saved a lot!", avatar: "3" },
                { name: "Priya Sharma", role: "Social Media Influencer", text: "The aesthetic of the venues I found through PartyDial was incredible. Perfect for my content and within budget!", avatar: "4" },
                { name: "Vikram Singh", role: "Business Owner", text: "Professional service and transparent pricing. No hidden costs. Best platform for premium venue discovery.", avatar: "5" }
              ].map((t, i) => (
                <SwiperSlide key={i} className="!w-[320px] md:!w-[420px]">
                  <div className="w-full h-full bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative group hover:-translate-y-2 transition-all duration-500 hover:shadow-xl hover:shadow-pd-pink/10 hover:border-pd-pink/20 whitespace-normal flex flex-col cursor-grab active:cursor-grabbing">
                    <div className="absolute top-6 right-8 opacity-20 group-hover:opacity-100 group-hover:text-pd-pink transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110 pointer-events-none">
                      <Quote size={48} fill="currentColor" className="text-slate-300" />
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:border-pd-pink transition-colors duration-500 relative">
                        <img src={`https://i.pravatar.cc/150?u=user${t.avatar}`} alt={t.name} className="w-full h-full object-cover pointer-events-none" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">{t.name}</h4>
                        <p className="text-[10px] font-bold text-pd-pink uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed flex-1 text-sm md:text-base select-none">
                      &quot;{t.text}&quot;
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Row 2 - Scrolling Right */}
          <div className="w-full">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={32}
              slidesPerView="auto"
              loop={true}
              speed={6000}
              allowTouchMove={false}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: true
              }}
              className="testimonials-swiper"
            >
              {[
                { name: "Neha Gupta", role: "Anniversary Celebration", text: "Booked a resort for our 10th anniversary. The options provided were exactly what we had in mind. Flawless experience!", avatar: "6" },
                { name: "Karan Desai", role: "Event Organizer", text: "I regularly use PartyDial for my clients. The interface is smooth, and the venues listed are verified. It saves me days of research.", avatar: "7" },
                { name: "Anjali Rao", role: "Pre-Wedding Shoot", text: "Finding an aesthetic venue for our shoot was tough until we used PartyDial. Directly connected with the owner and booked it!", avatar: "8" },
                { name: "Sameer Khan", role: "Startup Founder", text: "Hosted our product launch party at a venue found here. The direct pricing feature helped us stay well within our bootstrap budget.", avatar: "9" },
                { name: "Pooja Mehta", role: "Baby Shower", text: "Everything from finding the venue to booking was completely hassle-free. Absolutely highly recommend PartyDial to anyone!", avatar: "10" }
              ].map((t, i) => (
                <SwiperSlide key={i} className="!w-[320px] md:!w-[420px]">
                  <div className="w-full h-full bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative group hover:-translate-y-2 transition-all duration-500 hover:shadow-xl hover:shadow-pd-blue/10 hover:border-pd-blue/20 whitespace-normal flex flex-col cursor-grab active:cursor-grabbing">
                    <div className="absolute top-6 right-8 opacity-20 group-hover:opacity-100 group-hover:text-pd-blue transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110 pointer-events-none">
                      <Quote size={48} fill="currentColor" className="text-slate-300" />
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:border-pd-blue transition-colors duration-500 relative">
                        <img src={`https://i.pravatar.cc/150?u=user${t.avatar}`} alt={t.name} className="w-full h-full object-cover pointer-events-none" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">{t.name}</h4>
                        <p className="text-[10px] font-bold text-pd-blue uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed flex-1 text-sm md:text-base select-none">
                      &quot;{t.text}&quot;
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 uppercase">Got <span className="pd-gradient-text px-1">Questions?</span></h2>
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


      {/* FINAL CTA - IMMERSIVE PREMIUM EDITION */}
      <section className="py-32 px-6 md:px-8 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] md:rounded-[4rem] border border-slate-800 shadow-2xl">

            {/* Mesh Gradient Atmospheric Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(236,72,153,0.1)_0%,transparent_70%)] rounded-full opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(239,68,68,0.05)_0%,transparent_70%)] rounded-full opacity-40 -translate-x-1/4 translate-y-1/4 pointer-events-none" />

            {/* Subtle Noise Texture */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]  pointer-events-none" />

            <div className="relative z-10 px-8 py-16 md:px-20 md:py-28 flex flex-col lg:flex-row items-center justify-between gap-16">

              {/* Text Content */}
              <div className="text-center lg:text-left flex-1 max-w-2xl">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 uppercase tracking-tighter">
                  Ready for the <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink via-purple-400 to-pd-blue drop-shadow-sm">
                    Grand Event?
                  </span>
                </h2>
                <p className="text-slate-400 font-medium text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                  Join thousands of happy celebrators. Submit your requirements and get free quotes from 5,000+ luxury venues instantly.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-inquiry-popup'))}
                    className="group relative inline-flex items-center justify-center px-10 py-5 font-black text-sm uppercase tracking-widest text-white bg-slate-900 overflow-hidden rounded-2xl border border-white/10 hover:border-pd-pink/50 transition-all duration-300 shadow-2xl hover:shadow-pd-pink/20 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-pd-red via-pd-pink to-pd-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10 flex items-center gap-3">
                      Submit Requirement
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                    </span>
                  </button>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Average Response: <span className="text-pd-pink">15 Mins</span>
                  </p>
                </div>
              </div>

              {/* Decorative Visual Element - Floating Glass Cards */}
              <div className="hidden lg:flex relative w-[450px] h-[450px] shrink-0 items-center justify-center perspective-[1200px]">

                {/* Background Card */}
                <motion.div
                  animate={{ y: [-15, 15, -15], rotateY: [-8, 8, -8], rotateZ: [-12, -12, -12] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-64 h-80 bg-white/5  rounded-[2rem] border border-white/10 shadow-2xl translate-x-12 -translate-y-8 flex flex-col justify-between p-8"
                >
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-pd-pink/20 to-transparent border border-white/10 mb-6 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-pd-pink/50 animate-pulse" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-3 w-full bg-white/10 rounded-full" />
                    <div className="h-3 w-3/4 bg-white/10 rounded-full" />
                    <div className="h-3 w-1/2 bg-white/5 rounded-full" />
                  </div>
                </motion.div>

                {/* Foreground Card */}
                <motion.div
                  animate={{ y: [15, -15, 15], rotateY: [8, -8, 8], rotateZ: [5, 5, 5] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-72 h-[340px] bg-linear-to-br from-pd-pink/90 to-pd-blue/90  rounded-[2.5rem] border border-white/30 shadow-[0_32px_80px_-16px_rgba(239,68,68,0.4)] z-10 flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="relative w-28 h-28 rounded-full bg-white/20 flex items-center justify-center  mb-8 shadow-inner border border-white/30">
                    <div className="absolute inset-0 rounded-full bg-white/20 opacity-10" />
                    <Heart className="text-white fill-white relative z-10" size={48} />
                  </div>
                  <h3 className="text-white font-black text-2xl uppercase tracking-widest mb-2">Venue Booked!</h3>
                  <p className="text-white/70 font-medium text-xs uppercase tracking-widest">Get ready to party</p>
                </motion.div>

              </div>

            </div>
          </div>
        </div>
      </section>



    </main>
  );
}
