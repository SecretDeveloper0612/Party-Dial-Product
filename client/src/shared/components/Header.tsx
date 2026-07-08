/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';
import { account, ID } from '@/lib/appwrite';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
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
  Phone,
  Building2,
  Sparkles
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';

const tickerTexts = [
  "India's #1 Event-Lead Generation Platform",
  "Dial into 5,000+ Verified Luxury Venues",
  "Get Direct Quotes within seconds. Zero Brokerage.",
  "Smart Matching for your Grand Celebrations."
];

const Ticker = () => {
  const [tickerIndex, setTickerIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerTexts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  
  return (
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
  );
};

export default function Header() {
  const pathname = usePathname();
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

  // Auth State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [signinData, setSigninData] = useState({ email: '', password: '' });

  const checkSession = async () => {
    try {
      const session = await account.get();
      const labels = session.labels || [];
      const isVendor = labels.includes('vendor');
      const isMasterAdmin = session.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@partydial.com");
      
      if (isVendor || isMasterAdmin) {
        setUser(null);
      } else {
        setUser(session);
      }
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkSession();
    window.addEventListener('auth-change', checkSession);
    return () => window.removeEventListener('auth-change', checkSession);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const filteredOffices = offices.filter((office: any) => 
            office.State && office.State.toLowerCase() === 'uttarakhand'
          );
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedSuggestions = filteredOffices.map((office: any) => ({
            display: `${office.Name}-${office.Pincode}`,
            name: office.Name,
            pincode: office.Pincode
          }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const uniqueSuggestions = Array.from(new Set(formattedSuggestions.map((s: any) => s.display)))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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



  return (
    <>
      {/* 1. TOP BAR */}
      {pathname !== '/ai-search' && (
        <div className="bg-gradient-to-r from-pd-pink to-pd-purple text-white py-2 px-4 md:px-6 relative z-[60]">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] md:text-xs font-semibold tracking-wider">
            <Link href="tel:+918679933302" className="flex items-center gap-2 hover:text-white/80 transition-colors shrink-0 group">
              <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors"><Phone size={12} className="text-white" /></div>
              <span className="tabular-nums">+91 86799 33302</span>
            </Link>
            <div className="hidden md:flex flex-1 justify-center overflow-hidden h-5 relative mx-10">
              <Ticker />
            </div>
            <div className="flex items-center shrink-0">
              <Link href="https://partner.partydial.com/signup">
                <button className="text-white/90 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] md:text-xs font-semibold">
                  <Building2 size={14} className="text-white" />
                  <span>Register Your Venue</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN HEADER */}
      <header className="sticky top-2 md:top-4 mt-2 md:mt-4 z-50 w-full h-0 px-4 md:px-8 transition-all duration-300">
        <nav className="mx-auto max-w-5xl h-14 sm:h-[68px] flex items-center justify-between px-4 sm:px-6 md:px-8 bg-white/95 backdrop-blur-xl rounded-full shadow-lg border border-slate-100">
          <Link href="/" className="flex items-center gap-2 md:gap-4 shrink-0">
             <div className="relative w-28 sm:w-36 h-10 sm:h-12 cursor-pointer hover:scale-105 transition-transform flex items-center">
                <img src="/logo-nav.png" alt="PartyDial" width={140} height={48} className="object-contain" />
             </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
             <Link href="/" className="hidden lg:flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-pd-pink transition-all px-4 py-2">
               <span>AI Search</span>
             </Link>
             
             <button 
                onClick={handleDownloadApp}
                className="hidden lg:flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-pd-pink transition-all px-4 py-2"
             >
               <Download size={18} /> <span>Download App</span>
             </button>

              {user ? (
                <div className="hidden md:flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-pd-red">Welcome</span>
                    <span className="text-xs font-bold text-slate-900">{user.name}</span>
                  </div>
                  <button 
                    onClick={async () => {
                      await account.deleteSession('current');
                      setUser(null);
                      window.dispatchEvent(new Event('auth-change'));
                    }}
                    className="p-2.5 bg-white text-slate-400 hover:text-pd-red hover:bg-pd-red/5 rounded-full shadow-sm transition-all"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setAuthModal({ isOpen: true, type: 'signup' })}
                  className="hidden md:flex items-center gap-2 text-sm font-bold bg-pd-pink text-white hover:bg-pd-red transition-all px-6 py-2.5 rounded-full shadow-md"
                >
                    <User size={18} /> <span>Sign in</span>
                </button>
              )}

             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-3 bg-white text-slate-900 hover:bg-slate-50 rounded-full shadow-sm active:scale-95 transition-all">
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Sidebar & Backdrop */}
      <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
              />
              
              {/* Sidebar */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-[110] flex flex-col overflow-y-auto"
              >
                <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="font-black text-2xl  text-pd-red">PartyDial</span>
                  </Link>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-5 space-y-6 flex-1">
                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col gap-2">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:text-pd-red transition-all">
                       Home
                    </Link>
                    <Link href="/venues" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:text-pd-red transition-all">
                       Venues
                    </Link>
                    <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:text-pd-red transition-all">
                       Categories
                    </Link>
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 bg-pd-pink/10 text-pd-pink rounded-xl font-bold">
                       AI Search
                    </Link>
                  </div>
                  
                  {user ? (
                      <div className="col-span-2 p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-pd-red/10 text-pd-red flex items-center justify-center">
                               <User size={20} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-pd-red">Profile</p>
                               <p className="text-xs font-bold text-slate-900">{user.name}</p>
                            </div>
                         </div>
                         <button 
                          onClick={async () => {
                            await account.deleteSession('current');
                            setUser(null);
                            setIsMobileMenuOpen(false);
                            window.dispatchEvent(new Event('auth-change'));
                          }}
                          className="p-2 text-slate-400 hover:text-pd-red"
                         >
                           <LogOut size={20} />
                         </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 w-full">
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
                    )}
                  
                  <div className="pt-4 border-t border-slate-100  mt-auto">
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
            </>
          )}
        </AnimatePresence>

      {/* 3. AUTH MODAL SYSTEM */}
      <AnimatePresence>
        {authModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto no-scrollbar">
            <motion.div 
              onClick={() => setAuthModal({ ...authModal, isOpen: false })}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-[4px] cursor-pointer"
              style={{ willChange: 'opacity, backdrop-filter', transform: 'translateZ(0)' }}
            ></motion.div>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "tween", duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              style={{ willChange: "transform, opacity", transform: 'translateZ(0)' }}
              className="relative w-full max-w-5xl bg-white rounded-4xl md:rounded-[40px] shadow-pd-strong overflow-hidden flex flex-col md:flex-row min-h-[500px] md:min-h-[600px] z-[110] transform-gpu"
              onClick={e => e.stopPropagation()}
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
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-pd-purple/20 to-transparent"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                   <div className="text-pd-red font-black text-2xl ">PartyDial</div>
                   <div>
                     <h2 className="text-4xl font-bold mb-6 leading-tight">
                        {authModal.type === 'signin' 
                          ? <>Welcome Back – <br/><span className="text-pd-pink ">Find Your perfect</span> Venue.</>
                          : <>Create Account <br/><span className="text-pd-pink ">Plan Your perfect</span> Event.</>}
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
                       <p className="text-slate-400 font-semibold ">
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
                              
                              // 1. Verify Phone Factor
                              await account.updatePhoneSession(authUserId, otp.join(''));
                              
                              // 2. Complete Registration on Server
                              const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
                              const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
                              
                              const regRes = await fetch(`${baseUrl}/auth/complete-registration`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  userId: authUserId,
                                  name: signupData.name,
                                  email: signupData.email,
                                  password: signupData.password
                                })
                              });

                              const regResult = await regRes.json();
                              if (!regRes.ok) throw new Error(regResult.message || 'Failed to complete registration');

                              // 3. Log in with Email/Password
                              try { await account.deleteSession('current'); } catch (e) {}
                              await account.createEmailPasswordSession(signupData.email, signupData.password);

                              window.dispatchEvent(new Event('auth-change'));
                              setAuthModal({ ...authModal, isOpen: false });
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                try { await account.deleteSession('current'); } catch (e) {}
                                const phone = '+91' + signupData.phone.replace(/\s/g, '');
                                const token = await account.createPhoneToken(ID.unique(), phone);
                                setAuthUserId(token.userId);
                                setResendTimer(45);
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                        
                        // Clear existing session
                        try { await account.deleteSession('current'); } catch (e) {}
                        
                        if (authModal.type === 'signup') {
                           const cleanPhone = signupData.phone.replace(/\D/g, '');
                           if (cleanPhone.length !== 10) throw new Error("Please enter a valid 10-digit mobile number.");
                           const phone = '+91' + cleanPhone;

                           // 0. Check if phone number is already in use
                           const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
                           const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
                           const checkRes = await fetch(`${baseUrl}/auth/check-phone`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ phone })
                           });
                           const checkData = await checkRes.json();
                           if (!checkRes.ok) {
                              throw new Error(checkData.message || 'This number is already in use, use a different one');
                           }

                           // 1. Send OTP first
                           const token = await account.createPhoneToken(ID.unique(), phone);
                           setAuthUserId(token.userId);
                           setAuthModal({...authModal, type: 'otp'});
                           setResendTimer(60);
                        } else {
                           // Sign In - Email/Password
                           await account.createEmailPasswordSession(signinData.email, signinData.password);
                           const user = await account.get();
                           
                           if (!user.phoneVerification) {
                              const cleanPhone = user.phone?.replace(/\D/g, '').replace('91', '');
                              if (cleanPhone && cleanPhone.length === 10) {
                                 try {
                                    const token = await account.createPhoneToken(user.$id, '+91' + cleanPhone);
                                    setAuthUserId(token.userId);
                                    setAuthModal({...authModal, type: 'otp'});
                                    return;
                                 } catch (tokenErr) {
                                    console.error('Header OTP Error:', tokenErr);
                                 }
                              }
                           }

                           window.dispatchEvent(new Event('auth-change'));
                           setAuthModal({...authModal, isOpen: false});
                        }
                       // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      } catch (error: any) {
                        setAuthError(error.message || 'Authentication failed. Please check your details.');
                      } finally {
                        setIsAuthLoading(false);
                      }
                    }}>
                       {authModal.type === 'signup' && (
                         <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                           <div className="relative group">
                              <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-red transition-colors" />
                               <input 
                                 required 
                                 type="text" 
                                 placeholder="John Doe" 
                                 value={signupData.name}
                                 onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                                 className="w-full h-14 pl-14 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-pd-red transition-all" 
                               />
                           </div>
                         </div>
                       )}

                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Email</label>
                          <div className="relative group">
                             <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-red transition-all" />
                             <input 
                                required 
                                type="email" 
                                placeholder="name@email.com" 
                                value={authModal.type === 'signup' ? signupData.email : signinData.email}
                                onChange={(e) => authModal.type === 'signup' 
                                  ? setSignupData({...signupData, email: e.target.value})
                                  : setSigninData({...signinData, email: e.target.value})}
                                className="w-full h-14 pl-14 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-pd-red transition-all" 
                             />
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
                             {authModal.type === 'signin' && <button type="button" className="text-pd-purple  hover:text-pd-red">Forgot?</button>}
                          </div>
                          <div className="relative group">
                             <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-red transition-all" />
                             <input 
                              required 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              value={authModal.type === 'signup' ? signupData.password : signinData.password}
                              onChange={(e) => authModal.type === 'signup' 
                                ? setSignupData({...signupData, password: e.target.value})
                                : setSigninData({...signinData, password: e.target.value})}
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
