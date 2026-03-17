'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  User, 
  UserPlus,
  LogOut,
  Menu,
  X,
  Download,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  CheckCircle2,
  ChevronLeft,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';

const tickerTexts = [
  "India's #1 Event-Lead Generation Platform",
  "Dial into 5,000+ Verified Luxury Venues",
  "Get Direct Quotes within seconds. Zero Brokerage.",
  "Smart Matching for your Grand Celebrations."
];

const categories = [
  { name: "Birthday Party", icon: "🎂" },
  { name: "Wedding Events", icon: "💍" },
  { name: "Pre-Wedding Events", icon: "✨" },
  { name: "Anniversary Party", icon: "🥂" },
  { name: "Corporate Events", icon: "🏢" },
  { name: "Kitty Party", icon: "👩‍🤝‍👩" },
  { name: "Family Functions", icon: "🏠" },
  { name: "Festival Parties", icon: "🎭" },
  { name: "Social Gatherings", icon: "🎉" },
  { name: "Kids Parties", icon: "🎈" },
  { name: "Bachelor / Bachelorette Party", icon: "🕺" },
  { name: "Housewarming Party", icon: "🏡" },
  { name: "Baby Shower", icon: "🧸" },
  { name: "Engagement Ceremony", icon: "💎" },
  { name: "Entertainment / Theme Parties", icon: "🦁" }
];

export default function Header() {
  const [selectedCategory, setSelectedCategory] = useState('Select Event');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth Modal State
  const [authModal, setAuthModal] = useState<{ isOpen: boolean, type: 'signin' | 'signup' }>({ isOpen: false, type: 'signin' });
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  // Sign Up Data
  const [signupData, setSignupData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', agreeTerms: false
  });

  const pwStrength = useMemo(() => {
    const pass = signupData.password;
    if (!pass) return { label: 'None', color: 'bg-slate-100' };
    let score = pass.length > 8 ? 1 : 0;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score < 2) return { label: 'Weak', color: 'bg-red-400' };
    if (score < 4) return { label: 'Medium', color: 'bg-yellow-400' };
    return { label: 'Strong', color: 'bg-green-400' };
  }, [signupData.password]);
  
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

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
            pincode: office.Pincode
          }));
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerTexts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* 1. TOP BAR */}
      <div className="pd-gradient text-white py-2 md:py-2.5 px-4 md:px-6 shadow-lg relative z-[60]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[9px] md:text-[11px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em]">
          <a href="tel:+919876543210" className="flex items-center gap-1.5 md:gap-2 hover:text-white/80 transition-colors shrink-0">
            <Phone size={12} className="text-white md:size-[14px]" />
            <span className="font-black text-[10px] md:text-sm shadow-sm tracking-widest">+91 98765 43210</span>
          </a>
          <div className="hidden md:flex flex-1 justify-center overflow-hidden h-4 relative mx-10">
            <AnimatePresence mode="wait">
              <motion.span
                key={tickerIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="text-white absolute w-full text-center font-bold drop-shadow-sm"
              >
                {tickerTexts[tickerIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            <button 
              onClick={() => setAuthModal({ isOpen: true, type: 'signin' })}
              className="flex items-center gap-1.5 md:gap-2 hover:text-white/80 transition-opacity cursor-pointer text-[8px] sm:text-xs"
            >
              <User size={12} className="md:size-[14px]" /> <span>Sign In</span>
            </button>
            <div className="w-[1px] h-3 bg-white/20"></div>
            <button 
              onClick={() => setAuthModal({ isOpen: true, type: 'signup' })}
              className="flex items-center gap-1.5 md:gap-2 hover:text-white/80 transition-opacity cursor-pointer text-[8px] sm:text-xs"
            >
              <UserPlus size={12} className="md:size-[14px]" /> <span>Sign Up</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 h-20 sm:h-24 flex items-center justify-between gap-10">
          <Link href="/" className="flex items-center gap-4 shrink-0">
             <div className="relative w-36 h-12 cursor-pointer hover:scale-105 transition-transform flex items-center">
                <Image src="/logo.jpg" alt="PartyDial" width={140} height={48} className="object-contain" priority />
             </div>
          </Link>

          <div className="flex-1 max-w-3xl hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-[12px] p-1 gap-1 focus-within:border-pd-purple focus-within:bg-white focus-within:shadow-xl focus-within:shadow-pd-pink/5 transition-all">
            <div className="relative group">
              <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center justify-between px-6 py-3.5 bg-white rounded-[10px] shadow-sm border border-slate-100 text-sm font-bold text-slate-800 hover:border-slate-300 transition-all min-w-[200px]"
              >
                <span className="truncate">{selectedCategory}</span>
                <ChevronDown size={18} className={`text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute top-[115%] left-0 w-full bg-white border border-slate-100 rounded-[12px] shadow-pd-strong py-3 z-[100] max-h-[400px] overflow-y-auto no-scrollbar"
                  >
                    {categories.map((cat, i) => (
                      <button 
                        key={i}
                        onClick={() => { setSelectedCategory(cat.name); setIsCategoryOpen(false); }}
                        className="w-full text-left px-6 py-3 hover:bg-slate-50 text-sm font-semibold text-slate-600 hover:text-pd-red transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
            <div className="flex-1 flex items-center gap-3 px-3 relative" ref={locationRef}>
              <MapPin size={20} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="City-Pincode (e.g. Haldwani-263139)" 
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="bg-transparent border-none outline-none w-full text-sm font-semibold text-slate-800 placeholder:text-slate-300" 
              />
              <AnimatePresence>
                {showSuggestions && locationInput.length >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-pd-strong z-[110] max-h-60 overflow-y-auto no-scrollbar"
                  >
                    {isLoadingLocations ? (
                      <div className="p-4 text-center text-[10px] text-slate-400 font-bold uppercase animate-pulse">Searching...</div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setLocationInput(s.display);
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors border-b border-slate-50 last:border-0"
                        >
                          {s.display}
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-[10px] text-slate-400 font-bold uppercase">No locations found</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/venues">
              <button className="pd-btn-primary !py-3.5 !px-5"><Search size={22} /></button>
            </Link>
          </div>

          <div className="flex items-center gap-4 shrink-0">
             <button className="hidden lg:flex items-center gap-3 pd-btn-primary !px-7 !py-3.5 !text-xs tracking-wider uppercase active:scale-95 shadow-pd-soft">
               <Download size={18} /> <span>Download App</span>
             </button>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
             </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="p-6 space-y-6">
                {/* Mobile Search & Category */}
                <div className="space-y-3">
                  <div className="relative">
                    <button 
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                    >
                      <span>{selectedCategory}</span>
                      <ChevronDown size={18} className={`text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isCategoryOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 w-full bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-[110] mt-2 max-h-[300px] overflow-y-auto"
                        >
                          {categories.map((cat, i) => (
                            <button 
                              key={i}
                              onClick={() => { setSelectedCategory(cat.name); setIsCategoryOpen(false); }}
                              className="w-full text-left px-5 py-3.5 hover:bg-slate-50 text-sm font-semibold text-slate-600 active:text-pd-red transition-colors border-b border-slate-50 last:border-0"
                            >
                              {cat.icon} <span className="ml-2">{cat.name}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative" ref={locationRef}>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-1">
                      <MapPin size={18} className="text-slate-400 mr-3" />
                      <input 
                        type="text" 
                        placeholder="City-Pincode" 
                        value={locationInput}
                        onChange={(e) => {
                          setLocationInput(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="bg-transparent border-none outline-none w-full py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-300" 
                      />
                    </div>
                    <AnimatePresence>
                      {showSuggestions && locationInput.length >= 3 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-[120] max-h-40 overflow-y-auto"
                        >
                          {suggestions.map((s, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setLocationInput(s.display);
                                setShowSuggestions(false);
                              }}
                              className="w-full text-left px-5 py-4 text-sm font-bold text-slate-600 border-b border-slate-50 last:border-0"
                            >
                              {s.display}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center p-4 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:bg-pd-red/5 hover:text-pd-red transition-all">Home</Link>
                  <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center p-4 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:bg-pd-red/5 hover:text-pd-red transition-all">Categories</Link>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <button className="w-full pd-btn-primary py-4 flex items-center justify-center gap-3">
                    <Download size={20} />
                    <span>Download App</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. AUTH MODAL SYSTEM */}
      <AnimatePresence>
        {authModal.isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 overflow-y-auto no-scrollbar">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthModal({ ...authModal, isOpen: false })}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
            >
              {/* Left Visual Side */}
              <div className="hidden lg:block w-[45%] relative bg-slate-900 border-r border-slate-100 p-12 text-white">
                <Image 
                   src={authModal.type === 'signin' 
                     ? "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200"
                     : "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200"}
                   alt="Auth Banner"
                   fill
                   className="object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-pd-purple/20 to-transparent"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                   <div className="text-pd-red font-black text-2xl italic">PartyDial</div>
                   <div>
                     <h2 className="text-4xl font-black mb-6 leading-tight">
                        {authModal.type === 'signin' 
                          ? <>Welcome Back – <br/><span className="text-pd-pink italic">Find Your perfect</span> Venue.</>
                          : <>Create Account <br/><span className="text-pd-pink italic">Plan Your perfect</span> Event.</>}
                     </h2>
                     <p className="text-white/60 font-semibold">Join thousands of planners making magic happen every day.</p>
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-40">© 2026 PartyDial Platform</p>
                </div>
              </div>

              {/* Right Form Side */}
              <div className="flex-1 p-8 md:p-14 overflow-y-auto no-scrollbar max-h-[90vh] md:max-h-none">
                 <button 
                  onClick={() => setAuthModal({...authModal, isOpen: false})} 
                  className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors z-20"
                 >
                   <X size={24} />
                 </button>

                 <div className="max-w-md mx-auto">
                    <div className="mb-10">
                       <h3 className="text-3xl font-black text-slate-900 mb-2">
                         {authModal.type === 'signin' ? "Sign In" : "Join PartyDial"}
                       </h3>
                       <p className="text-slate-400 font-semibold italic">
                         {authModal.type === 'signin' ? "Welcome back to your events dashboard." : "Start your journey to a perfect event."}
                       </p>
                    </div>

                    <button className="w-full h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest mb-8">
                       <svg width="18" height="18" viewBox="0 0 18 18">
                         <path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.56 2.69-3.86 2.69-6.62z" fill="#4285F4"/>
                         <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.33-1.58-5.04-3.7H.95v2.32A8.99 8.99 0 0 0 9 18z" fill="#34A853"/>
                         <path d="M3.96 10.72A5.41 5.41 0 0 1 3.6 9c0-.6.1-1.17.27-1.72V4.96H.95A8.99 8.99 0 0 0 0 9c0 1.45.35 2.82.95 4.04l3.01-2.32z" fill="#FBBC05"/>
                         <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.47C13.46.99 11.43 0 9 0 5.48 0 2.44 2.02.95 4.96L3.96 7.28C4.67 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/>
                       </svg>
                       Continue with Google
                    </button>

                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAuthLoading(true); setTimeout(() => { setIsAuthLoading(false); setAuthModal({...authModal, isOpen: false}); }, 1500); }}>
                       {authModal.type === 'signup' && (
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                           <div className="relative group">
                              <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-red transition-colors" />
                              <input required type="text" placeholder="John Doe" className="w-full h-14 pl-14 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-pd-red transition-all" />
                           </div>
                         </div>
                       )}

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email</label>
                          <div className="relative group">
                             <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-red transition-all" />
                             <input required type="email" placeholder="name@email.com" className="w-full h-14 pl-14 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-pd-red transition-all" />
                          </div>
                       </div>

                       {authModal.type === 'signup' && (
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone Number</label>
                             <div className="relative group flex items-center">
                                <Phone size={18} className="absolute left-5 text-slate-400 group-focus-within:text-pd-red transition-all" />
                                <div className="absolute left-12 text-sm font-bold text-slate-400 border-r border-slate-200 pr-3">+91</div>
                                <input 
                                  required 
                                  type="tel" 
                                  placeholder="98765 00000" 
                                  value={signupData.phone}
                                  maxLength={11} // 10 digits + 1 space
                                  onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
                                    if (val.length > 10) val = val.slice(0, 10);
                                    // Format as 5-5
                                    let formatted = val;
                                    if (val.length > 5) {
                                      formatted = val.slice(0, 5) + ' ' + val.slice(5);
                                    }
                                    setSignupData({...signupData, phone: formatted});
                                  }}
                                  className="w-full h-14 pl-24 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-pd-red transition-all" 
                                />
                             </div>
                          </div>
                       )}

                       <div className="space-y-2">
                          <div className="flex justify-between items-center px-2 text-[10px] font-black uppercase tracking-widest">
                             <label className="text-slate-400">Password</label>
                             {authModal.type === 'signup' && signupData.password && <span className={`${pwStrength.color} text-white px-2 py-0.5 rounded`}>{pwStrength.label}</span>}
                             {authModal.type === 'signin' && <button type="button" className="text-pd-purple italic hover:text-pd-red">Forgot?</button>}
                          </div>
                          <div className="relative group">
                             <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-red transition-all" />
                             <input 
                              required 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              onChange={(e) => authModal.type === 'signup' && setSignupData({...signupData, password: e.target.value})}
                              className="w-full h-14 pl-14 pr-14 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-pd-red transition-all" 
                             />
                             <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                             </button>
                          </div>
                       </div>

                       <button 
                        type="submit" 
                        disabled={isAuthLoading}
                        className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                       >
                          {isAuthLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{authModal.type === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight size={18}/></>}
                       </button>

                       <p className="text-center text-sm font-bold text-slate-400">
                          {authModal.type === 'signin' ? "Don't have an account?" : "Already have an account?"}
                          <button 
                            type="button"
                            onClick={() => setAuthModal({...authModal, type: authModal.type === 'signin' ? 'signup' : 'signin'})}
                            className="text-pd-red font-black uppercase tracking-widest text-[11px] ml-2 hover:underline"
                          >
                             {authModal.type === 'signin' ? "Sign Up Now" : "Sign In Now"}
                          </button>
                       </p>
                    </form>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
