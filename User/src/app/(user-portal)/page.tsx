'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  Heart
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const locationRef = useRef<HTMLDivElement>(null);

  // Form States
  const [formData, setFormData] = useState({
    eventType: '',
    city: '',
    date: '',
    guests: ''
  });

  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch Location from Indian Post API
  useEffect(() => {
    const fetchLocations = async () => {
      if (locationInput.length < 3) {
        setSuggestions([]);
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
          const formattedSuggestions = offices.map((office: any) => ({
            display: `${office.Name}-${office.Pincode}`,
            name: office.Name,
            pincode: office.Pincode,
            district: office.District,
            state: office.State
          }));
          // Remove duplicates
          const uniqueSuggestions = Array.from(new Set(formattedSuggestions.map((s: any) => s.display)))
            .map(display => formattedSuggestions.find((s: any) => s.display === display));
          
          setSuggestions(uniqueSuggestions);
        } else {
          setSuggestions([]);
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { name: "Birthday Party", icon: "🎂", img: "https://images.unsplash.com/photo-1530103043871-3e58da0039E9?auto=format&fit=crop&q=80&w=800" },
    { name: "Wedding Events", icon: "💍", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" },
    { name: "Pre-Wedding Events", icon: "✨", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" },
    { name: "Anniversary Party", icon: "🥂", img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800" },
    { name: "Corporate Events", icon: "🏢", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800" },
    { name: "Kitty Party", icon: "👩‍🤝‍👩", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800" },
    { name: "Family Functions", icon: "🏠", img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800" },
    { name: "Festival Parties", icon: "🎭", img: "https://images.unsplash.com/photo-1514525253361-bee8a197c0c5?auto=format&fit=crop&q=80&w=800" },
    { name: "Social Gatherings", icon: "🎉", img: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800" },
    { name: "Kids Parties", icon: "🎈", img: "https://images.unsplash.com/photo-1471960617625-f537482c31e9?auto=format&fit=crop&q=80&w=800" },
    { name: "Bachelor / Bachelorette Party", icon: "🕺", img: "https://images.unsplash.com/photo-1519225421980-64273398495c?auto=format&fit=crop&q=80&w=800" },
    { name: "Housewarming Party", icon: "🏡", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800" },
    { name: "Baby Shower", icon: "🧸", img: "https://images.unsplash.com/photo-1544126592-807daa2b565b?auto=format&fit=crop&q=80&w=800" },
    { name: "Engagement Ceremony", icon: "💎", img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800" },
    { name: "Entertainment / Theme Parties", icon: "🦁", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800" }
  ];

  const venues = [
    {
      name: "The Royal Ballroom",
      location: "South Delhi",
      capacity: "500-800",
      price: "₹1,800",
      rating: 4.8,
      reviews: 124,
      img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Grand Palace Hotel",
      location: "Dwarka, Delhi",
      capacity: "200-500",
      price: "₹2,500",
      rating: 4.9,
      reviews: 89,
      img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Oceanic Resort",
      location: "Goa (NCR Office)",
      capacity: "1000+",
      price: "₹3,200",
      rating: 4.7,
      reviews: 210,
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
    }
  ];

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


  return (
    <main className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-16 px-6 bg-white border-b border-slate-50">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Hero Text */}
            <div className="w-full lg:w-1/2 text-left">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                  Find the <span className="text-pd-red">Perfect Venue</span> for Your Event
                </h1>
                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                  Get free customized quotes from top venues in minutes. 
                  Direct connections. Zero brokerage.
                </p>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-800">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <span>Trusted by 50,000+ happy hosts</span>
                </div>
              </motion.div>
            </div>

            {/* Lead Form */}
            <div className="w-full lg:w-1/2">
               <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-10 rounded-[20px] shadow-pd-strong border border-slate-50">
                  <h3 className="text-xl font-black text-slate-900 mb-8 border-l-4 border-pd-red pl-4">Get Free Quotes Now</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Event Type</label>
                      <div className="relative">
                        <select className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none focus:border-pd-purple transition-all appearance-none cursor-pointer">
                          {categories.map((cat, i) => (
                            <option key={i}>{cat.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-5 text-slate-400" size={16} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">City / Location</label>
                      <div className="relative" ref={locationRef}>
                        <MapPin className="absolute left-4 top-5 text-pd-red" size={16} />
                        <input 
                          type="text" 
                          placeholder="Enter Pincode or City" 
                          value={locationInput}
                          onChange={(e) => {
                            setLocationInput(e.target.value);
                            setShowSuggestions(true);
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-800 outline-none focus:border-pd-purple transition-all" 
                        />
                        
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
                                  <button
                                    key={i}
                                    onClick={() => {
                                      setLocationInput(s.display);
                                      setShowSuggestions(false);
                                      setFormData({ ...formData, city: s.display });
                                    }}
                                    className="w-full text-left px-5 py-3.5 hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors border-b border-slate-50 last:border-none flex items-center justify-between"
                                  >
                                    <span>{s.display}</span>
                                    <span className="text-[10px] text-slate-400 uppercase">{s.state}</span>
                                  </button>
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
                        <input type="date" className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-800 outline-none focus:border-pd-purple transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Guest Count</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-5 text-pd-blue" size={16} />
                        <input type="number" placeholder="e.g. 200" className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-800 outline-none focus:border-pd-purple transition-all" />
                      </div>
                    </div>

                  </div>
                  <button className="w-full pd-btn-primary h-16 mt-8 shadow-xl shadow-pd-pink/20 uppercase tracking-[0.2em] font-black italic">
                    Get Free Quotes <ArrowRight className="inline ml-2" size={18} />
                  </button>
               </motion.div>
            </div>
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
            {categories.map((cat, i) => (
              <Link href={`/categories?type=${cat.name.toLowerCase().replace(/\s+/g, '-')}`} key={i}>
                <div className="border border-slate-100 rounded-lg overflow-hidden h-64 relative group cursor-pointer">
                  <Image src={cat.img} alt={cat.name} fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-black/40"></div>
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
            {venues.map((venue, i) => (
              <motion.div key={i} className="pd-card group overflow-hidden bg-white">
                <div className="h-56 relative overflow-hidden">
                  <Image src={venue.img} alt={venue.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className="text-xs font-black text-slate-800">{venue.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <MapPin size={12} className="text-pd-red" /> {venue.location}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-4">{venue.name}</h3>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                      <p className="text-sm font-black text-slate-700">{venue.capacity} Pax</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Veg Price</p>
                      <p className="text-sm font-black text-pd-pink">{venue.price} <span className="text-[10px] text-slate-400">/plate</span></p>
                    </div>
                  </div>
                  <button className="w-full mt-6 py-3 border border-pd-purple/20 rounded-xl text-pd-purple font-black text-[11px] uppercase tracking-widest hover:bg-pd-purple hover:text-white transition-all">
                    Show Phone Number
                  </button>
                </div>
              </motion.div>
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
            {[1,2,3].map(i => (
              <div key={i} className="pd-card p-10 bg-slate-50 relative">
                <Quote className="absolute top-6 right-8 text-slate-200" size={40} />
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full bg-slate-300 overflow-hidden ring-4 ring-white shadow-sm">
                    <img src={`https://i.pravatar.cc/150?u=user${i}`} alt="user" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm italic">Rahul Malhotra</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest underline decoration-pd-red decoration-2">Wedding Host</p>
                  </div>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed italic">
                  "PartyDial made our wedding planning so much easier! We received 5 quotes within 2 hours and booked a beautiful palace hotel that was right in our budget. Highly recommended!"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR CITIES DIRECTORY (pSEO Hub) */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase italic">Browse by City</h2>
            <div className="w-20 h-1.5 bg-pd-red mx-auto rounded-full mb-4"></div>
            <p className="text-slate-500 font-medium">Find the best event services in your city</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-6">
            {["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Gurgaon", "Noida", "Jaipur", "Lucknow", "Chandigarh", "Indore", "Surat", "Patna", "Nagpur", "Vadodara"].map(city => (
              <div key={city} className="space-y-3">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{city}</h4>
                <div className="flex flex-col gap-2">
                  <Link href={`/${city.toLowerCase()}/banquet-halls`} className="text-[10px] font-bold text-slate-400 hover:text-pd-red transition-colors uppercase tracking-widest">Banquet Halls</Link>
                  <Link href={`/${city.toLowerCase()}/wedding-venues`} className="text-[10px] font-bold text-slate-400 hover:text-pd-red transition-colors uppercase tracking-widest">Wedding Venues</Link>
                  <Link href={`/${city.toLowerCase()}/party-lawns`} className="text-[10px] font-bold text-slate-400 hover:text-pd-red transition-colors uppercase tracking-widest">Party Lawns</Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 p-8 bg-slate-50 rounded-[40px] border border-slate-100 text-center">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-loose">
              Serving 1000+ Locations including Kanpur, Bhopal, Visakhapatnam, Pimpri-Chinchwad, Ghaziabad, Ludhiana, Agra, Nashik, Faridabad, Meerut, Rajkot, Varanasi, Srinagar, Aurangabad, Dhanbad, Amritsar, Navi Mumbai, Allahabad, Ranchi, Howrah, Coimbatore, Jabalpur, Gwalior, Vijayawada, Jodhpur, Madurai, Raipur, Kota, Guwahati, Solapur, Bareilly, Moradabad, Mysore, Gurgaon, Aligarh, Jalandhar, Bhubaneswar, Salem, Warangal, and many more.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 md:px-0 bg-slate-50">
        <div className="max-w-6xl mx-auto overflow-hidden">
          <div className="pd-gradient p-12 md:p-24 rounded-[30px] text-white flex flex-col md:flex-row items-center justify-between gap-16 shadow-2xl relative">
             <div className="text-center md:text-left">
                <h2 className="text-4xl md:text-6xl font-black leading-tight mb-6">Ready to Plan the <br /> Grand Celebration?</h2>
                <p className="text-xl font-medium text-white/80 max-w-xl mb-10">Submit your event requirements now and get free quotes from 5,000+ luxury venues near you.</p>
                <button className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95">
                  Submit Requirement <ChevronDown className="inline ml-2 -rotate-90" size={20} />
                </button>
             </div>
             <div className="relative w-64 h-64 md:w-96 md:h-96 opacity-30 md:opacity-100 group">
                <LayoutDashboard size={300} className="text-white group-hover:rotate-12 transition-transform duration-700" strokeWidth={1} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart size={80} className="text-white fill-white animate-bounce" />
                </div>
             </div>
          </div>
        </div>
      </section>

    </main>
  );
}
