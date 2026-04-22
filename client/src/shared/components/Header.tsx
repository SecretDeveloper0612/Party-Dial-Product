'use client';
import { account, ID } from '@/lib/appwrite';

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
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';

const tickerTexts = [
  "India's #1 Event-Lead Generation Platform",
  "Dial into 5,000+ Verified Luxury Venues",
  "Get Direct Quotes within seconds. Zero Brokerage.",
  "Smart Matching for your Grand Celebrations."
];


export default function Header() {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth Modal State
  const [authModal, setAuthModal] = useState<{ isOpen: boolean, type: 'signin' | 'signup' | 'otp' }>({ isOpen: false, type: 'signin' });
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(45);
  const [authUserId, setAuthUserId] = useState('');
  const [authError, setAuthError] = useState('');
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  
  // Sign Up Data
  const [signupData, setSignupData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', agreeTerms: false
  });

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('✅ PWA Install Prompt Captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDownloadApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // Logic for iOS or desktop where beforeinstallprompt isn't triggered
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        alert('To install PartyDial on iPhone:\n\n1. Tap the Share button (square with arrow) at the bottom\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" at the top right');
      } else {
        alert('To install the PartyDial web app:\n\n1. Click the "Install" icon in your browser address bar\nOR\n2. Open browser menu (...) and select "Install App"');
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authModal.type === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authModal.type, resendTimer]);

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

  
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
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

      // Special Case for Haldwani (263139) and nearby areas
      if (locationInput === '263139') {
        const customSuggestions = [
          { display: 'Haldwani-263139', name: 'Haldwani', pincode: '263139' },
          { display: 'Kathgodam-263126', name: 'Kathgodam', pincode: '263126' },
          { display: 'Lalkuan-263131', name: 'Lalkuan', pincode: '263131' },
          { display: 'Mukhani-263139', name: 'Mukhani', pincode: '263139' },
          { display: 'Kaladhungi-263140', name: 'Kaladhungi', pincode: '263140' },
          { display: 'Bhowali-263132', name: 'Bhowali', pincode: '263132' },
          { display: 'Nainital-263001', name: 'Nainital', pincode: '263001' },
          { display: 'Damuadhunga-263126', name: 'Damuadhunga', pincode: '263126' },
          { display: 'Dahariya-263139', name: 'Dahariya', pincode: '263139' },
          { display: 'Lamachaur-263139', name: 'Lamachaur', pincode: '263139' },
          { display: 'Kamaluaganja-263139', name: 'Kamaluaganja', pincode: '263139' }
        ];
        setSuggestions(customSuggestions);
        setIsLoadingLocations(false);
        return;
      }

      setIsLoadingLocations(true);
      try {
        const isPincode = /^\d+$/.test(locationInput);
        const url = isPincode 
          ? `/api/pincode/${locationInput}`
          : `/api/postoffice/${locationInput}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data[0].Status === 'Success') {
          const offices = data[0].PostOffice || [];
          const filteredOffices = offices.filter((office: any) => 
            office.State && office.State.toLowerCase() === 'uttarakhand'
          );
          
          const formattedSuggestions = filteredOffices.map((office: any) => ({
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
          {/* Phone number removed */}
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
          <div className="flex items-center shrink-0">
            <Link href="https://partner.partydial.com/signup">
              <button className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg border border-white/30 backdrop-blur-sm transition-all flex items-center gap-1.5 text-[9px] md:text-[10px]">
                <Building2 size={12} />
                Register Your Venue
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 md:px-6 h-16 sm:h-24 flex items-center justify-between gap-4 md:gap-10">
          <Link href="/" className="flex items-center gap-2 md:gap-4 shrink-0">
             <div className="relative w-28 sm:w-36 h-10 sm:h-12 cursor-pointer hover:scale-105 transition-transform flex items-center">
                <img src="/logo.jpg" alt="PartyDial" width={140} height={48} className="object-contain" />
             </div>
          </Link>

          <div className="flex-1 max-w-3xl hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-[12px] p-1 gap-1 focus-within:border-pd-purple focus-within:bg-white focus-within:shadow-xl focus-within:shadow-pd-pink/5 transition-all">
            <div className="flex-1 flex items-center gap-3 px-3 relative" ref={locationRef}>
              <MapPin size={20} className="text-slate-400 shrink-0" />
              <div className="flex-1 flex flex-wrap gap-2 items-center py-2">
                {selectedLocations.map((loc, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-pd-red/10 text-pd-red px-3 py-1.5 rounded-xl border border-pd-red/20 animate-in fade-in zoom-in duration-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{loc}</span>
                    <button 
                      onClick={() => setSelectedLocations(selectedLocations.filter((_, idx) => idx !== i))}
                      className="hover:text-slate-900 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <input 
                  type="text" 
                  placeholder={selectedLocations.length === 0 ? "City-Pincode (e.g. Haldwani-263139)" : "Add more..."}
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="flex-1 min-w-[120px] bg-transparent border-none outline-none py-2 text-sm font-semibold text-slate-800 placeholder:text-slate-400" 
                />
              </div>
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
                            if (!selectedLocations.includes(s.display)) {
                              setSelectedLocations([...selectedLocations, s.display]);
                            }
                            setLocationInput("");
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
            <Link href={`/venues?location=${selectedLocations.join(',')}`}>
              <button className="pd-btn-primary !py-4.5 !px-6"><Search size={22} /></button>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
             <button 
                onClick={handleDownloadApp}
                className="hidden lg:flex items-center gap-3 pd-btn-primary !px-7 !py-3.5 !text-xs tracking-wider uppercase active:scale-95 shadow-pd-soft"
             >
               <Download size={18} /> <span>Download App</span>
             </button>
             <button 
               onClick={() => setAuthModal({ isOpen: true, type: 'signup' })}
               className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-pd-red transition-all px-4 py-2 hover:bg-slate-50 rounded-xl"
             >
                <User size={18} /> <span>Signup</span>
             </button>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2.5 text-slate-900 hover:bg-slate-50 rounded-xl border border-slate-100 shadow-sm active:scale-95 transition-all">
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden shadow-2xl"
            >
              <div className="p-5 space-y-5">
                {/* Mobile Search & Category */}
                <div className="space-y-3">
                  <div className="relative" ref={locationRef}>
                    <div className="flex flex-col gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
                        {selectedLocations.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-1">
                            {selectedLocations.map((loc, i) => (
                              <div key={i} className="flex items-center gap-1.5 bg-pd-red text-white pr-2 pl-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider animate-in fade-in zoom-in duration-200">
                                {loc}
                                <button onClick={() => setSelectedLocations(selectedLocations.filter((_, idx) => idx !== i))}>
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2 px-2">
                           <MapPin size={18} className="text-slate-400 shrink-0" />
                           <input 
                              type="text" 
                              placeholder={selectedLocations.length === 0 ? "City-Pincode" : "Add more..."} 
                              value={locationInput}
                              onChange={(e) => {
                                setLocationInput(e.target.value);
                                setShowSuggestions(true);
                              }}
                              onFocus={() => setShowSuggestions(true)}
                              className="bg-transparent border-none outline-none w-full py-4 text-sm font-bold text-slate-800 placeholder:text-slate-300" 
                           />
                           <Link href={`/venues?location=${selectedLocations.join(',')}`} onClick={() => setIsMobileMenuOpen(false)} className="shrink-0">
                              <button className="pd-btn-primary !p-3 rounded-xl">
                                <Search size={18} />
                              </button>
                           </Link>
                        </div>
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
                                if (!selectedLocations.includes(s.display)) {
                                  setSelectedLocations([...selectedLocations, s.display]);
                                }
                                setLocationInput("");
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

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); setAuthModal({ isOpen: true, type: 'signup' }); }}
                    className="w-full flex items-center justify-center gap-2 p-4 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-600 active:bg-slate-50"
                  >
                    <User size={16} /> <span>Signup</span>
                  </button>
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); setAuthModal({ isOpen: true, type: 'signup' }); }}
                    className="w-full flex items-center justify-center gap-2 p-4 bg-slate-900 border border-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest text-white active:scale-95 transition-all"
                  >
                    <UserPlus size={16} /> <span>Join Now</span>
                  </button>
                </div>
                
                <div className="pt-4 border-t border-slate-100 italic">
                  <button 
                    onClick={handleDownloadApp}
                    className="w-full pd-btn-primary py-4 flex items-center justify-center gap-3"
                  >
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
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md cursor-pointer"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              style={{ willChange: "transform, opacity" }}
              className="relative w-full max-w-5xl bg-white rounded-[32px] md:rounded-[40px] shadow-pd-strong overflow-hidden flex flex-col md:flex-row min-h-[500px] md:min-h-[600px] z-[1001]"
            >
              {/* Left Visual Side */}
              <div className="hidden lg:block w-[45%] relative bg-slate-900 border-r border-slate-100 p-12 text-white">
                <img 
                   src={authModal.type === 'signin' 
                     ? "/venues/royal-ballroom.png"
                     : "/categories/wedding.png"}
                   alt="Auth Banner"
                   className="absolute inset-0 w-full h-full object-cover opacity-50"
                   loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-pd-purple/20 to-transparent"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                   <div className="text-pd-red font-black text-2xl italic">PartyDial</div>
                   <div>
                     <h2 className="text-4xl font-bold mb-6 leading-tight">
                        {authModal.type === 'signin' 
                          ? <>Welcome Back – <br/><span className="text-pd-pink italic">Find Your perfect</span> Venue.</>
                          : <>Create Account <br/><span className="text-pd-pink italic">Plan Your perfect</span> Event.</>}
                     </h2>
                     <p className="text-white/60 font-semibold">Join thousands of planners making magic happen every day.</p>
                   </div>
                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">© 2026 PartyDial Platform</p>
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
                       <h3 className="text-3xl font-bold text-slate-900 mb-2">
                         {authModal.type === 'signup' ? "Join PartyDial" : authModal.type === 'signin' ? "Sign In" : "Verify Phone"}
                       </h3>
                       <p className="text-slate-400 font-semibold italic">
                         {authModal.type === 'signup' ? "Start your journey to a perfect event." : authModal.type === 'signin' ? "Welcome back to your events dashboard." : `Enter the 6-digit code sent to ${signupData.phone || '+91 98765 00000'}`}
                       </p>
                    </div>


                    {authModal.type === 'otp' ? (
                      <div className="space-y-8">
                        <div className="flex justify-between gap-2 md:gap-4">
                          {otp.map((digit, idx) => (
                            <input 
                              key={idx}
                              ref={otpRefs[idx]}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val) {
                                  const newOtp = [...otp];
                                  newOtp[idx] = val;
                                  setOtp(newOtp);
                                  if (idx < 5) otpRefs[idx + 1].current?.focus();
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                                  otpRefs[idx - 1].current?.focus();
                                }
                              }}
                              className="w-full h-14 md:h-16 text-center text-xl md:text-2xl font-semibold bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-pd-red focus:ring-4 focus:ring-pd-red/5 outline-none transition-all"
                            />
                          ))}
                        </div>

                        <button 
                          onClick={async () => {
                            try {
                              setIsAuthLoading(true);
                              setAuthError('');
                              await account.updatePhoneSession(authUserId, otp.join(''));
                              
                              // Update name if it was a signup
                              if (signupData.name) {
                                try { await account.updateName(signupData.name); } catch(e) {}
                              }
                              
                              setAuthModal({ ...authModal, isOpen: false });
                            } catch (error: any) {
                              setAuthError(error.message || 'Invalid OTP. Please try again.');
                            } finally {
                              setIsAuthLoading(false);
                            }
                          }}
                          className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/10 hover:bg-pd-red transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                          {isAuthLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Verify & Create Account <ArrowRight size={18}/></>}
                        </button>

                        {authError && (
                          <p className="text-[10px] text-center text-pd-red font-bold uppercase tracking-widest">{authError}</p>
                        )}

                        <div className="text-center">
                          <button 
                            disabled={resendTimer > 0 || isAuthLoading}
                            onClick={async () => {
                              try {
                                setIsAuthLoading(true);
                                setAuthError('');
                                const phone = '+91' + signupData.phone.replace(/\s/g, '');
                                const token = await account.createPhoneToken(ID.unique(), phone);
                                setAuthUserId(token.userId);
                                setResendTimer(45);
                              } catch(e: any) {
                                setAuthError(e.message || 'Failed to resend OTP.');
                              } finally {
                                setIsAuthLoading(false);
                              }
                            }}
                            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-pd-red transition-colors disabled:opacity-50"
                          >
                            {resendTimer > 0 ? `Didn't receive code? Resend in ${resendTimer}s` : "Didn't receive code? Resend Now"}
                          </button>
                        </div>
                      </div>
                    ) : (
                    <form className="space-y-6" onSubmit={async (e) => { 
                      e.preventDefault(); 
                      try {
                        setIsAuthLoading(true);
                        setAuthError('');
                        
                        const phone = '+91' + signupData.phone.replace(/\s/g, '');
                        
                        if (authModal.type === 'signup') {
                           // For Appwrite, we just create a phone token.
                           // If user already exists, it works fine too.
                           const token = await account.createPhoneToken(ID.unique(), phone);
                           setAuthUserId(token.userId);
                           setAuthModal({...authModal, type: 'otp'});
                        } else {
                           // Sign In - also uses phone token
                           const token = await account.createPhoneToken(ID.unique(), phone);
                           setAuthUserId(token.userId);
                           setAuthModal({...authModal, type: 'otp'});
                        }
                      } catch (error: any) {
                        setAuthError(error.message || 'Authentication failed. Please check your number.');
                      } finally {
                        setIsAuthLoading(false);
                      }
                    }}>
                       {authModal.type === 'signup' && (
                         <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                           <div className="relative group">
                              <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-red transition-colors" />
                              <input required type="text" placeholder="John Doe" className="w-full h-14 pl-14 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-pd-red transition-all" />
                           </div>
                         </div>
                       )}

                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Email</label>
                          <div className="relative group">
                             <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-red transition-all" />
                             <input required type="email" placeholder="name@email.com" className="w-full h-14 pl-14 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-pd-red transition-all" />
                          </div>
                       </div>

                       {authModal.type === 'signup' && (
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Phone Number</label>
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
                          <div className="flex justify-between items-center px-2 text-[10px] font-bold uppercase tracking-widest">
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

                       {authError && (
                           <p className="text-[10px] text-center text-pd-red font-bold uppercase tracking-widest mt-4">{authError}</p>
                        )}

                        <button 
                         type="submit" 
                         disabled={isAuthLoading}
                         className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
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
                    )}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
