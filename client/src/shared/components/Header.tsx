/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element, @typescript-eslint/no-explicit-any */
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
  Sparkles,
  Home,
  LayoutGrid
} from 'lucide-react';
import { useEffect, useState, useMemo, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth Modal State
  const [authModal, setAuthModal] = useState<{ isOpen: boolean, type: 'signin' | 'signup' | 'otp' | 'forgot_password' }>({ isOpen: false, type: 'signin' });
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(45);
  const [authUserId, setAuthUserId] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  
  // Inline Phone Verification State
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [inlineOtp, setInlineOtp] = useState('');

  // Sign Up Data
  const [signupData, setSignupData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', agreeTerms: false
  });

  // Auth State
  const [user, setUser] = useState<any>(null);
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
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      setAuthModal({ isOpen: true, type: 'signin' });
      router.replace(pathname);
    }
  }, [searchParams, pathname, router]);
  useEffect(() => {
    checkSession();
    window.addEventListener('auth-change', checkSession);
    return () => window.removeEventListener('auth-change', checkSession);
  }, []);

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



  if (pathname?.startsWith('/venues/') && pathname !== '/venues') return null;

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
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
        <nav className="max-w-7xl mx-auto h-16 sm:h-[72px] flex items-center justify-between px-4 sm:px-6 md:px-8">
          <Link href="/" className="flex items-center gap-2 md:gap-4 shrink-0">
             <div className="relative cursor-pointer hover:scale-105 transition-transform flex items-center">
                <img src="/logo-nav.png" alt="PartyDial" className="w-[120px] sm:w-[150px] h-auto object-contain" />
             </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">

              {user ? (
                <div className="hidden md:flex items-center gap-4">
                  <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#f43f5e]">Welcome</span>
                      <span className="text-sm font-extrabold text-slate-900">{user.name}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#fce7f3] text-[#e11d48] flex items-center justify-center shadow-sm border border-slate-100">
                       {user.prefs?.avatar ? (
                         <img src={user.prefs.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                       ) : (
                         <span className="text-lg font-black">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                       )}
                    </div>
                  </Link>
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
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                    <img src="/logo-nav.png" alt="PartyDial" className="w-[120px] h-auto object-contain" />
                  </Link>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-5 space-y-6 flex-1">
                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col gap-2">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:text-pd-red transition-all">
                       <Home size={18} className="text-slate-400 group-hover:text-pd-red transition-colors" /> Home
                    </Link>
                    <Link href="/venues" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:text-pd-red transition-all">
                       <Building2 size={18} className="text-slate-400 group-hover:text-pd-red transition-colors" /> Venues
                    </Link>
                    <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:text-pd-red transition-all">
                       <LayoutGrid size={18} className="text-slate-400 group-hover:text-pd-red transition-colors" /> Categories
                    </Link>
                  </div>
                  
                  {user ? (
                      <div className="col-span-2 p-5 bg-slate-50 rounded-2xl flex items-center justify-between mt-2 shadow-sm">
                         <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-[#f43f5e]/10 text-[#f43f5e] flex items-center justify-center shrink-0">
                               <User size={24} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                               <p className="text-[11px] font-bold uppercase tracking-widest text-[#f43f5e] mb-0.5">Profile</p>
                               <p className="text-base font-extrabold text-slate-900 line-clamp-1">{user.name}</p>
                            </div>
                         </Link>
                         <button 
                          onClick={async () => {
                            await account.deleteSession('current');
                            setUser(null);
                            setIsMobileMenuOpen(false);
                            window.dispatchEvent(new Event('auth-change'));
                          }}
                          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                         >
                           <LogOut size={22} strokeWidth={2.5} />
                         </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 w-full mt-2">
                        <button 
                          onClick={() => { setIsMobileMenuOpen(false); setAuthModal({ isOpen: true, type: 'signup' }); }}
                          className="w-full flex items-center justify-center gap-2 p-4 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-600 active:bg-slate-50"
                        >
                          <User size={16} /> <span>Signup</span>
                        </button>
                        <button 
                          onClick={() => { setIsMobileMenuOpen(false); setAuthModal({ isOpen: true, type: 'signup' }); }}
                          className="w-full flex items-center justify-center gap-2 p-4 bg-[#f43f5e] border border-[#f43f5e] rounded-xl text-xs font-bold uppercase tracking-widest text-white active:scale-95 transition-all"
                        >
                          <UserPlus size={16} /> <span>Join Now</span>
                        </button>
                      </div>
                    )}
                  
                  <div className="pt-6 border-t border-slate-100 mt-auto">
                    <button 
                      onClick={handleDownloadApp}
                      className="w-full bg-gradient-to-r from-[#f43f5e] to-purple-500 text-white rounded-2xl font-bold text-[15px] py-4 flex items-center justify-center gap-3 shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      <Download size={22} strokeWidth={2.5} />
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
              className="relative w-full max-w-[480px] bg-white rounded-xl md:rounded-2xl shadow-pd-strong overflow-hidden flex flex-col min-h-auto md:min-h-[500px] z-[110] transform-gpu"
              onClick={e => e.stopPropagation()}
            >
              {/* Right Form Side */}
              <div className="flex-1 p-5 md:p-10 overflow-y-auto no-scrollbar max-h-[90vh] relative">
                 <button 
                  onClick={() => setAuthModal({...authModal, isOpen: false})} 
                  className="absolute top-4 md:top-6 right-4 md:right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-20 text-slate-500"
                 >
                   <X size={20} />
                 </button>

                  <div className="max-w-md mx-auto mt-4">
                    <div className="text-center mb-8">
                       <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                         {authModal.type === 'signin' ? 'Welcome back' : (authModal.type === 'forgot_password' ? 'Reset Password' : 'Create account')}
                       </h3>
                       <p className="text-sm font-medium text-slate-500">
                         {authModal.type === 'signin' ? 'Enter your details to access your account.' : (authModal.type === 'forgot_password' ? 'Enter your email to receive a reset link.' : 'Start your journey with PartyDial today.')}
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
                              className="w-full h-14 md:h-16 text-center text-xl md:text-2xl font-semibold bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-pd-red focus:ring-4 focus:ring-pd-red/5 outline-none transition-all"
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
                    <form className="space-y-4 md:space-y-6" onSubmit={async (e) => { 
                      e.preventDefault(); 
                      try {
                        setIsAuthLoading(true);
                        setAuthError('');
                        
                        // Clear existing session
                        try { await account.deleteSession('current'); } catch (e) {}
                        
                        if (authModal.type === 'signup') {
                           if (!isPhoneVerified) {
                              throw new Error("Please verify your phone number first.");
                           }

                           // Complete Registration on Server (inline verification already confirmed Phone)
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

                           // Then login with email/password
                           await account.createEmailPasswordSession(signupData.email, signupData.password);
                           
                           window.dispatchEvent(new Event('auth-change'));
                           setAuthModal({...authModal, isOpen: false});
                        } else if (authModal.type === 'forgot_password') {
                           // Forgot Password
                           if (!signinData.email) throw new Error("Please enter your email.");
                           
                           // Strict Functionality: Ensure email doesn't belong to a vendor
                           const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
                           const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
                           
                           const checkRes = await fetch(`${baseUrl}/auth/check-email-role`, {
                             method: 'POST',
                             headers: { 'Content-Type': 'application/json' },
                             body: JSON.stringify({ email: signinData.email })
                           });
                           
                           if (checkRes.ok) {
                             const checkData = await checkRes.json();
                             if (checkData.isVendor) {
                               throw new Error("Vendors must reset their password from the Vendor Portal.");
                             }
                           }
                           
                           await account.createRecovery(signinData.email, window.location.origin + '/reset-password');
                           setAuthError('');
                           setAuthSuccess('A secure password reset link has been sent to your email. Please check your inbox.');
                           setTimeout(() => {
                             setAuthModal({ ...authModal, isOpen: false });
                             setAuthSuccess('');
                           }, 4000);
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
                      } catch (error: any) {
                        setAuthError(error.message || 'Authentication failed. Please check your details.');
                      } finally {
                        setIsAuthLoading(false);
                      }
                    }}>
                       {authModal.type === 'signup' && (
                         <div className="space-y-2 mb-6">
                           <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Full Name</label>
                           <div className="relative group">
                               <input 
                                 required 
                                 type="text" 
                                 placeholder="John Doe" 
                                 value={signupData.name}
                                 onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                                 className="w-full h-12 md:h-14 px-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400" 
                               />
                           </div>
                         </div>
                       )}

                       <div className="space-y-2 mb-4">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">
                            {authModal.type === 'forgot_password' ? 'Account Email' : 'Email Address'}
                          </label>
                          <div className="relative group">
                             <input 
                                required 
                                type="email" 
                                placeholder="name@example.com" 
                                value={authModal.type === 'signup' ? signupData.email : signinData.email}
                                onChange={(e) => authModal.type === 'signup' 
                                  ? setSignupData({...signupData, email: e.target.value})
                                  : setSigninData({...signinData, email: e.target.value})}
                                className="w-full h-12 md:h-14 px-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400" 
                             />
                          </div>
                       </div>

                       {authModal.type === 'signup' && (
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Phone Number</label>
                             <div className="relative group flex items-center">
                                <div className="absolute left-4 text-sm font-medium text-slate-500 border-r border-slate-200 pr-3">+91</div>
                                <input 
                                  required 
                                  type="tel" 
                                  placeholder="98765 00000" 
                                  value={signupData.phone}
                                  maxLength={11} // 10 digits + 1 space
                                  disabled={isPhoneVerified}
                                  onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
                                    if (val.length > 10) val = val.slice(0, 10);
                                    let formatted = val;
                                    if (val.length > 5) formatted = val.slice(0, 5) + ' ' + val.slice(5);
                                    setSignupData({...signupData, phone: formatted});
                                  }}
                                  className={`w-full h-12 md:h-14 pl-[72px] pr-[100px] bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400 ${isPhoneVerified ? 'opacity-70 bg-slate-50' : ''}`}
                                />
                                <div className="absolute right-2 flex items-center">
                                  {isPhoneVerified ? (
                                     <span className="text-green-600 font-bold text-xs uppercase px-2">Verified ✓</span>
                                  ) : (
                                     <button 
                                       type="button" 
                                       disabled={isAuthLoading || signupData.phone.replace(/\D/g, '').length !== 10}
                                       onClick={async () => {
                                          try {
                                            setIsAuthLoading(true);
                                            setAuthError('');
                                            const cleanPhone = signupData.phone.replace(/\D/g, '');
                                            const phone = '+91' + cleanPhone;
                                            
                                            const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
                                            const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
                                            const checkRes = await fetch(`${baseUrl}/auth/check-phone`, {
                                               method: 'POST',
                                               headers: { 'Content-Type': 'application/json' },
                                               body: JSON.stringify({ phone })
                                            });
                                            const checkData = await checkRes.json();
                                            if (!checkRes.ok) throw new Error(checkData.message || 'This number is already in use');
                                      
                                            const token = await account.createPhoneToken(ID.unique(), phone);
                                            setAuthUserId(token.userId);
                                            setShowPhoneOtp(true);
                                          } catch (e: any) {
                                            setAuthError(e.message || 'Failed to send OTP.');
                                          } finally {
                                            setIsAuthLoading(false);
                                          }
                                       }}
                                       className="px-3 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg uppercase hover:bg-slate-800 disabled:opacity-50"
                                     >
                                       Verify
                                     </button>
                                  )}
                                </div>
                             </div>
                             
                             {showPhoneOtp && !isPhoneVerified && (
                               <div className="mt-2 p-3 md:p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-3">
                                  <label className="text-xs font-semibold text-slate-600 flex-shrink-0">Verification Code</label>
                                  <div className="flex gap-2 flex-1">
                                     <input 
                                        type="text"
                                        placeholder="6-digit OTP"
                                        value={inlineOtp}
                                        maxLength={6}
                                        onChange={(e) => setInlineOtp(e.target.value.replace(/\D/g, ''))}
                                        className="flex-1 w-full min-w-0 h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-center tracking-[0.2em] font-bold outline-none focus:border-slate-400"
                                     />
                                     <button 
                                       type="button"
                                       disabled={inlineOtp.length !== 6 || isAuthLoading}
                                       onClick={async () => {
                                          try {
                                            setIsAuthLoading(true);
                                            setAuthError('');
                                            await account.updatePhoneSession(authUserId, inlineOtp);
                                            setIsPhoneVerified(true);
                                            setShowPhoneOtp(false);
                                          } catch (e: any) {
                                            setAuthError(e.message || 'Invalid OTP code.');
                                          } finally {
                                            setIsAuthLoading(false);
                                          }
                                       }}
                                       className="px-4 bg-slate-900 text-white font-bold text-[10px] uppercase rounded-lg disabled:opacity-50 flex-shrink-0"
                                     >
                                        Confirm
                                     </button>
                                  </div>
                               </div>
                             )}
                          </div>
                       )}

                       {authModal.type !== 'forgot_password' && (
                         <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                               <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
                               {authModal.type === 'signup' && signupData.password && <span className={`${pwStrength.color} text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase`}>{pwStrength.label}</span>}
                               {authModal.type === 'signin' && <button type="button" onClick={() => setAuthModal({...authModal, type: 'forgot_password'})} className="text-[#f43f5e] font-semibold text-sm hover:underline">Forgot password?</button>}
                            </div>
                            <div className="relative group">
                               <input 
                                required 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                value={authModal.type === 'signup' ? signupData.password : signinData.password}
                                onChange={(e) => authModal.type === 'signup' 
                                  ? setSignupData({...signupData, password: e.target.value})
                                  : setSigninData({...signinData, password: e.target.value})}
                                className="w-full h-12 md:h-14 px-4 pr-12 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400" 
                               />
                               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                               </button>
                            </div>
                         </div>
                       )}

                       {authError && (
                           <p className="text-[10px] text-center text-pd-red font-bold uppercase tracking-widest mt-4">{authError}</p>
                        )}
                        
                        {authSuccess && (
                           <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                             <p className="text-[11px] text-center text-emerald-600 font-bold uppercase tracking-wide leading-relaxed">{authSuccess}</p>
                           </div>
                        )}

                        <button 
                         type="submit" 
                         disabled={isAuthLoading}
                         className="w-full h-12 md:h-14 mt-2 bg-[#f43f5e] hover:bg-[#e11d48] text-white rounded-xl font-semibold text-base shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                          {isAuthLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{authModal.type === 'signin' ? 'Sign In' : (authModal.type === 'forgot_password' ? 'Send Reset Link' : 'Sign Up')}</>}
                        </button>

                        {authModal.type !== 'forgot_password' && (
                          <>
                            <div className="flex items-center gap-4 my-6">
                               <div className="flex-1 border-t border-slate-200"></div>
                               <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Or continue with</span>
                               <div className="flex-1 border-t border-slate-200"></div>
                            </div>

                            <button 
                             type="button" 
                             className="w-full h-14 md:h-16 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-[0.1em] shadow-sm flex items-center justify-center gap-3 transition-all hover:bg-slate-50 active:scale-95"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.73 17.57V20.34H19.29C21.37 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                                <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.73 17.57C14.74 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.7 5.82 14.1H2.15V16.94C3.96 20.54 7.69 23 12 23Z" fill="#34A853"/>
                                <path d="M5.82 14.1C5.59 13.44 5.46 12.73 5.46 12C5.46 11.27 5.59 10.56 5.82 9.9V7.06H2.15C1.4 8.56 1 10.24 1 12C1 13.76 1.4 15.44 2.15 16.94L5.82 14.1Z" fill="#FBBC05"/>
                                <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.38 3.84C17.45 2.04 14.96 1 12 1C7.69 1 3.96 3.46 2.15 7.06L5.82 9.9C6.7 7.3 9.13 5.38 12 5.38Z" fill="#EA4335"/>
                              </svg>
                              Continue with Google
                            </button>
                          </>
                        )}

                       <p className="text-center text-sm text-slate-500 mt-6">
                          {authModal.type === 'signin' ? "Don't have an account?" : (authModal.type === 'forgot_password' ? "Remember your password?" : "Already have an account?")}
                          <button 
                            type="button"
                            onClick={() => setAuthModal({...authModal, type: authModal.type === 'signin' ? 'signup' : 'signin'})}
                            className="text-slate-900 font-bold ml-2 hover:underline"
                          >
                             {authModal.type === 'signin' ? "Sign up" : "Sign in"}
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
