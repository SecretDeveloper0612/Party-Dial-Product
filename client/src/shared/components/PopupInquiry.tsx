'use client';

import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Phone, Building2, Calendar, Users, MapPin, ChevronDown, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { databases, ID, DATABASE_ID, LEADS_COLLECTION_ID, account, client } from '@/lib/appwrite';
import { useSearchParams } from 'next/navigation';

type Step = 'inquiry' | 'signup' | 'otp' | 'login';

// Memoized Backdrop with lighter blur
const PopupBackdrop = memo(({ onClick }: { onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClick}
    className="fixed inset-0 bg-slate-950/60 backdrop-blur-[8px] cursor-pointer transition-transform"
    style={{ willChange: 'opacity, backdrop-filter', transform: 'translateZ(0)' }}
  />
));
PopupBackdrop.displayName = 'PopupBackdrop';

// Step Indicator Component
const StepIndicator = memo(({ currentStep }: { currentStep: Step }) => {
  const steps = [
    { id: 'inquiry', label: 'Details' },
    { id: 'auth', label: 'Account' },
    { id: 'otp', label: 'Verify' }
  ];

  const getStepIndex = (s: Step) => {
    if (s === 'inquiry') return 0;
    if (s === 'signup' || s === 'login') return 1;
    if (s === 'otp') return 2;
    return 0;
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="px-6 sm:px-10 py-5 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between shrink-0 overflow-x-auto no-scrollbar">
      <div className="flex items-center justify-between w-full min-w-[320px]">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3 group">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all duration-500 ${i <= currentIndex ? 'pd-gradient text-white shadow-lg shadow-pd-pink/20' : 'bg-slate-100 text-slate-400'
              }`}>
              {i < currentIndex ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <div className="flex flex-col">
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${i <= currentIndex ? 'text-slate-900' : 'text-slate-400'
                }`}>
                {s.label}
              </span>
              <div className={`h-0.5 w-full rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-pd-red' : 'bg-transparent'
                }`} />
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 h-px border-t-2 border-dashed mx-2 transition-colors duration-500 ${i < currentIndex ? 'border-pd-red/30' : 'border-slate-200'
                }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
StepIndicator.displayName = 'StepIndicator';

// Memoized Header Decoration
const PopupHeader = memo(({ onClose, step, onBack }: { onClose: () => void, step: Step, onBack?: () => void }) => (
  <div className="bg-slate-900 h-24 relative flex items-center px-6 lg:px-10 border-b border-white/5 rounded-t-[2.5rem] overflow-hidden shrink-0">
    <div className="absolute top-0 right-0 w-48 h-48 bg-pd-red/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" style={{ willChange: 'transform' }} />
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-pd-blue/5 rounded-full blur-[60px] -ml-16 -mb-16 pointer-events-none" style={{ willChange: 'transform' }} />

    <div className="relative z-10 flex items-center gap-5 w-full">
      {step !== 'inquiry' && onBack && (
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all group shrink-0">
          <ChevronDown className="rotate-90 group-hover:-translate-x-1 transition-transform" size={20} />
        </button>
      )}

      <div className="w-12 h-12 rounded-2xl pd-gradient flex items-center justify-center text-white shadow-xl shadow-pd-red/20 rotate-3 shrink-0">
        <Building2 size={24} />
      </div>

      <div className="flex-1 overflow-hidden">
        <h3 className="text-white font-black text-lg lg:text-xl leading-none uppercase italic tracking-tight truncate">
          {step === 'signup' ? 'Create Account' : step === 'login' ? 'Welcome Back' : step === 'otp' ? 'Verify Mobile' : 'Get Free Quotes'}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <p className="text-white/40 text-[9px] uppercase font-black tracking-[0.2em] truncate">
            {step === 'inquiry' ? 'Direct Venue Prices In Minutes' : 'Secure & Verified Access'}
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all shadow-lg active:scale-95 shrink-0"
        aria-label="Close"
      >
        <X size={20} />
      </button>
    </div>
  </div>
));
PopupHeader.displayName = 'PopupHeader';

// Signup Form Component
const SignupForm = memo(({
  signupData,
  onChange,
  onNext,
  isLoading
}: {
  signupData: any;
  onChange: (e: any) => void;
  onNext: () => void;
  isLoading: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
        <input
          type="text"
          name="name"
          required
          value={signupData.name}
          onChange={onChange}
          placeholder="Enter your full name"
          className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pd-red/5 focus:bg-white focus:border-pd-red transition-all"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
        <input
          type="email"
          name="email"
          required
          value={signupData.email}
          onChange={onChange}
          placeholder="yourname@email.com"
          className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pd-red/5 focus:bg-white focus:border-pd-red transition-all"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Mobile Number</label>
        <div className="relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
            <span className="text-sm font-bold text-slate-800 tracking-tighter shrink-0">+91</span>
          </div>
          <input
            type="tel"
            name="phone"
            required
            maxLength={10}
            value={signupData.phone}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              if (val.length <= 10) onChange({ target: { name: 'phone', value: val } });
            }}
            placeholder="10 Digit Number"
            className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl pl-16 pr-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pd-red/5 focus:bg-white focus:border-pd-red transition-all tracking-[0.1em]"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Set Password</label>
        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            value={signupData.password}
            onChange={onChange}
            placeholder="Create a strong password"
            className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pd-red/5 focus:bg-white focus:border-pd-red transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <button
        onClick={onNext}
        disabled={isLoading || !signupData.name || !signupData.email || signupData.phone.length < 10 || (signupData.password?.length || 0) < 6}
        className="w-full bg-slate-900 hover:bg-pd-red text-white py-5 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? 'Sending OTP...' : 'Send OTP Verification'}
        <ArrowRight size={18} />
      </button>
      <div className="text-center mt-4">
        <p className="text-xs font-medium text-slate-500">
          Already have an account? {' '}
          <button onClick={() => onChange({ target: { name: 'switchStep', value: 'login' } })} className="text-pd-red font-bold hover:underline">Login here</button>
        </p>
      </div>
    </div>
  );
});

// Login Form Component
const LoginForm = memo(({
  loginData,
  onChange,
  onLogin,
  isLoading
}: {
  loginData: any;
  onChange: (e: any) => void;
  onLogin: () => void;
  isLoading: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
        <input
          type="email"
          name="email"
          required
          value={loginData.email}
          onChange={onChange}
          placeholder="yourname@email.com"
          className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pd-red/5 focus:bg-white focus:border-pd-red transition-all"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Password</label>
        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            value={loginData.password}
            onChange={onChange}
            placeholder="Enter your password"
            className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pd-red/5 focus:bg-white focus:border-pd-red transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <button
        onClick={onLogin}
        disabled={isLoading || !loginData.email || !loginData.password}
        className="w-full bg-slate-900 hover:bg-pd-red text-white py-5 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? 'Logging in...' : 'Login & Continue'}
        <ArrowRight size={18} />
      </button>
      <div className="text-center mt-4">
        <p className="text-xs font-medium text-slate-500">
          New here? {' '}
          <button onClick={() => onChange({ target: { name: 'switchStep', value: 'signup' } })} className="text-pd-red font-bold hover:underline">Create an account</button>
        </p>
      </div>
    </div>
  );
});
LoginForm.displayName = 'LoginForm';
SignupForm.displayName = 'SignupForm';

// OTP Form Component
const OtpForm = memo(({
  otp,
  onOtpChange,
  onVerify,
  onResend,
  resendTimer,
  isLoading
}: {
  otp: string[];
  onOtpChange: (idx: number, val: string) => void;
  onVerify: () => void;
  onResend: () => void;
  resendTimer: number;
  isLoading: boolean;
}) => {
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-slate-500 text-xs font-medium">Please enter the 6-digit code sent to your mobile.</p>
      </div>
      <div className="flex justify-between gap-2">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={refs[idx]}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              if (val) {
                onOtpChange(idx, val);
                if (idx < 5) refs[idx + 1].current?.focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                onOtpChange(idx - 1, '');
                refs[idx - 1].current?.focus();
              }
            }}
            className="w-full h-14 md:h-16 text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-pd-red outline-none transition-all"
          />
        ))}
      </div>
      <div className="space-y-4">
        <button
          onClick={onVerify}
          disabled={isLoading || otp.join('').length < 6}
          className="w-full bg-pd-red text-white py-5 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Verify & Continue'}
        </button>
        <div className="text-center">
          <button
            disabled={resendTimer > 0 || isLoading}
            onClick={onResend}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-pd-red transition-colors disabled:opacity-50"
          >
            {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code Now"}
          </button>
        </div>
      </div>
    </div>
  );
});
OtpForm.displayName = 'OtpForm';


// Memoized Trust Badges
// Footer removed as requested

// Memoized Form Component
const InquiryForm = memo(({
  formData,
  onChange,
  onSubmit,
  isSubmitted,
  isSubmitting,
  error,
  selectedLocations,
  onAddLocation,
  onRemoveLocation
}: {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitted: boolean;
  isSubmitting: boolean;
  error?: string | null;
  selectedLocations: any[];
  onAddLocation: (loc: any) => void;
  onRemoveLocation: (display: string) => void;
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localPincode, setLocalPincode] = useState(formData.pincode || '');
  const pincodeRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pincodeRef.current && !pincodeRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      const input = localPincode;
      if (input.length < 3) {
        setSuggestions([]);
        return;
      }

      // Special Case for Haldwani (263139) and nearby areas
      if (input === '263139') {
        const customSuggestions = [
          { display: 'Haldwani-263139', pincode: '263139', state: 'Uttarakhand' },
          { display: 'Kathgodam-263126', pincode: '263126', state: 'Uttarakhand' },
          { display: 'Lalkuan-263131', pincode: '263131', state: 'Uttarakhand' },
          { display: 'Mukhani-263139', pincode: '263139', state: 'Uttarakhand' },
          { display: 'Kaladhungi-263140', pincode: '263140', state: 'Uttarakhand' },
          { display: 'Bhowali-263132', pincode: '263132', state: 'Uttarakhand' },
          { display: 'Nainital-263001', pincode: '263001', state: 'Uttarakhand' },
          { display: 'Lamachaur-263139', pincode: '263139', state: 'Uttarakhand' }
        ];
        setSuggestions(customSuggestions);
        setIsLoadingLocations(false);
        return;
      }

      // Check if it looks like a manual selection or full display already
      if (input.includes('-')) {
        setSuggestions([]);
        return;
      }

      setIsLoadingLocations(true);
      try {
        const isPincode = /^\d+$/.test(input);
        const url = isPincode
          ? `https://api.postalpincode.in/pincode/${input}`
          : `https://api.postalpincode.in/postoffice/${input}`;

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
          const uniqueSuggestions = Array.from(new Set(formattedSuggestions.map((s: any) => s.display)))
            .map(display => formattedSuggestions.find((s: any) => s.display === display));

          setSuggestions(uniqueSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        setSuggestions([]);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchLocations();
      // Sync with parent for non-location logic
      onChange({ target: { name: 'pincode', value: localPincode } } as any);
    }, 400);
    return () => clearTimeout(debounceTimer);
  }, [localPincode]);

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="text-center py-10"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50">
          <CheckCircle2 size={40} />
        </div>
        <h4 className="text-2xl font-bold text-slate-900 mb-2 uppercase italic tracking-tighter">Perfect!</h4>
        <p className="text-slate-500 text-xs font-medium">Sit back and relax. Our venue hosts are calculating your best quotes right now.</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <p className="text-slate-400 text-xs font-bold leading-relaxed italic border-l-4 border-pd-red/30 pl-4">
          Tell us your event details and get the best direct pricing from top-rated venues near you.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 lg:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
            <input
              type="text"
              name="name"
              required
              readOnly={!!formData.name}
              value={formData.name}
              onChange={onChange}
              placeholder="Your Name"
              className={`w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pd-red/5 focus:bg-white focus:border-pd-red transition-all ${formData.name ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
            <input
              type="email"
              name="email"
              required
              readOnly={!!formData.email}
              value={formData.email}
              onChange={onChange}
              placeholder="Your Email"
              className={`w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pd-red/5 focus:bg-white focus:border-pd-red transition-all ${formData.email ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Phone Number</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                <span className="text-sm font-bold text-slate-400 tracking-tighter shrink-0">+91</span>
              </div>
              <input
                type="tel"
                name="phone"
                required
                readOnly={!!formData.phone}
                value={formData.phone}
                onChange={onChange}
                className={`w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl pl-16 pr-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pd-red/5 focus:bg-white focus:border-pd-red transition-all tracking-[0.1em] ${formData.phone ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Approx Guests</label>
            <div className="relative">
              <select
                name="guests"
                required
                value={formData.guests}
                onChange={onChange}
                className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pd-red/5 focus:bg-white focus:border-pd-red transition-all appearance-none cursor-pointer"
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
              <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Event Type</label>
            <div className="relative">
              <select
                name="eventType"
                required
                value={formData.eventType}
                onChange={onChange}
                className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pd-red/5 focus:bg-white focus:border-pd-red transition-all appearance-none cursor-pointer"
              >
                <option value="">Select Event</option>
                <option value="Birthday Party">Birthday Party</option>
                <option value="Wedding Events">Wedding Events</option>
                <option value="Pre-Wedding Events">Pre-Wedding Events</option>
                <option value="Anniversary Party">Anniversary Party</option>
                <option value="Corporate Events">Corporate Events</option>
                <option value="Kitty Party">Kitty Party</option>
                <option value="Family Functions">Family Functions</option>
                <option value="Festival Parties">Festival Parties</option>
                <option value="Social Gatherings">Social Gatherings</option>
                <option value="Kids Parties">Kids Parties</option>
                <option value="Bachelor / Bachelorette Party">Bachelor / Bachelorette Party</option>
                <option value="Housewarming Party">Housewarming Party</option>
                <option value="Baby Shower">Baby Shower</option>
                <option value="Engagement Ceremony">Engagement Ceremony</option>
                <option value="Entertainment / Theme Parties">Entertainment / Theme Parties</option>
              </select>
              <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Proposed Event Date</label>
            <div className="relative">
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={onChange}
                className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pd-red/5 focus:bg-white focus:border-pd-red transition-all"
              />
              <Calendar size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2 relative" ref={pincodeRef}>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Pincode / Location</label>
            <div className={`w-full min-h-[4rem] bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 flex flex-wrap items-center gap-2 transition-all focus-within:ring-4 focus-within:ring-pd-red/5 focus-within:bg-white focus-within:border-pd-red`}>
              <MapPin size={18} className="text-slate-300 shrink-0 ml-1" />

              {/* Location Tags */}
              {selectedLocations.map((loc: any, i: number) => (
                <div key={i} className="flex items-center gap-1 bg-pd-red/10 text-pd-red px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider animate-in fade-in zoom-in duration-200 whitespace-nowrap shrink-0">
                  <span>{loc.display}</span>
                  <button type="button" onClick={() => onRemoveLocation(loc.display)} className="hover:text-slate-900 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              ))}

              <input
                type="text"
                name="pincode"
                autoComplete="off"
                value={localPincode}
                onChange={(e) => {
                  setLocalPincode(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={selectedLocations.length === 0 ? "Enter Pincode or City" : "Add more..."}
                className="flex-1 bg-transparent border-none text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-300 placeholder:font-semibold min-w-[120px] py-2"
              />
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && (formData.pincode?.length >= 3) && (suggestions.length > 0 || isLoadingLocations) && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute bottom-full left-0 w-full mb-2 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] max-h-48 overflow-y-auto"
                >
                  {isLoadingLocations ? (
                    <div className="p-3 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                      Searching...
                    </div>
                  ) : (
                    suggestions.map((s: any, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          onAddLocation(s);
                          setLocalPincode('');
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors border-b border-slate-50 last:border-none flex items-center justify-between"
                      >
                        <span>{s.display}</span>
                        <span className="text-[9px] text-slate-400 uppercase">{s.state}</span>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-pd-red/10 border border-pd-red/20 rounded-xl text-center"
          >
            <p className="text-pd-red text-xs font-bold leading-tight uppercase tracking-tight">
              {error}
            </p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !!error}
          className="w-full bg-pd-red hover:bg-pd-red/90 text-white py-4 mt-2 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-pd-red/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {isSubmitting ? 'Sending Request...' : 'Get Quotes Now'}
          {!isSubmitting && <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
        </button>

        <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
          <span className="text-emerald-500 font-bold">Zero Brokerage</span> • Verified First • Best Price Guarantee
        </p>
      </form>
    </>
  );
});
InquiryForm.displayName = 'InquiryForm';

export default function PopupInquiry() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New Step and Auth state
  const [step, setStep] = useState<Step>('inquiry');
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState({ name: '', email: '', phone: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '', phone: '' });
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [userId, setUserId] = useState('');

  const searchParams = useSearchParams();
  const venueId = searchParams.get('venueId');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    guests: '',
    date: '',
    pincode: '',
    message: '',
    selectedLocations: [] as any[]
  });

  // Check local rate limit on mount
  useEffect(() => {
    const lastSubmission = localStorage.getItem('last_inquiry_submission');
    if (lastSubmission) {
      const lastTime = new Date(lastSubmission).getTime();
      const currentTime = new Date().getTime();
      const hoursPassed = (currentTime - lastTime) / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        setError('You have already submitted an inquiry. Please wait 24 hours before sending another inquiry.');
      }
    }
  }, []);

  // Auth Check on Mount & Trigger
  const checkAuth = async () => {
    try {
      const user = await account.get();
      const labels = user.labels || [];
      const isVendor = labels.includes('vendor');
      const isMasterAdmin = user.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@partydial.com");

      if (isVendor || isMasterAdmin) {
        throw new Error("Vendor or Admin cannot use client portal");
      }

      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone?.replace('+91', '') || prev.phone || ''
      }));
      setStep('inquiry');
    } catch (e) {
      setStep('signup');
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  useEffect(() => {
    // 1. Manual trigger via custom event (always works)
    const handleOpen = () => setIsOpen(true);
    const handleAuthChange = () => {
      if (isOpen) checkAuth();
    };

    window.addEventListener('open-inquiry-popup', handleOpen);
    window.addEventListener('auth-change', handleAuthChange);

    // 2. Initial trigger (3 seconds after load)
    const initialTimer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    // 3. Recurring trigger (every 3 minutes)
    const recurringTimer = setInterval(() => {
      setIsOpen(prev => {
        if (!prev && !isSubmitted) return true;
        return prev;
      });
    }, 180000); // 180,000ms = 3 Minutes

    return () => {
      window.removeEventListener('open-inquiry-popup', handleOpen);
      window.removeEventListener('auth-change', handleAuthChange);
      clearTimeout(initialTimer);
      clearInterval(recurringTimer);
    };
  }, [isSubmitted]);

  // Auth Actions
  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      setError(null);

      try { await account.deleteSession('current'); } catch (e) { }

      const cleanPhone = signupData.phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) throw new Error("Please enter a valid 10-digit mobile number.");
      const phone = '+91' + cleanPhone;

      // 1. Send OTP first (Creates a 'ghost' user if not exists)
      // This ensures no Name/Email is in Auth until verification is complete
      const token = await account.createPhoneToken(ID.unique(), phone);
      setUserId(token.userId);
      setStep('otp');
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please check your number.');
      console.error('Signup Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const secret = otpArray.join('');

      // 1. Verify Phone Factor
      await account.updatePhoneSession(userId, secret);

      // 2. Complete Registration on Server (Sets Name, Email, Password)
      // This only happens if OTP was correct
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
      const baseUrl = base.endsWith('/api') ? base : `${base}/api`;

      const regRes = await fetch(`${baseUrl}/auth/complete-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: signupData.name,
          email: signupData.email,
          password: signupData.password
        })
      });

      const regResult = await regRes.json();
      if (!regRes.ok) throw new Error(regResult.message || 'Failed to complete registration');

      // 3. Log in with the now-complete Email/Password credentials
      try { await account.deleteSession('current'); } catch (e) { }
      await account.createEmailPasswordSession(signupData.email, signupData.password);

      setFormData(prev => ({
        ...prev,
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone
      }));
      setStep('inquiry');
      window.dispatchEvent(new Event('auth-change'));
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      try {
        await account.get();
      } catch (e) {
        await account.createAnonymousSession();
      }

      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
      const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
      const response = await fetch(`${baseUrl}/venues/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueId: venueId || 'BROADCAST',
          pincode: formData.selectedLocations.length > 0
            ? formData.selectedLocations.map(l => l.display).join(',')
            : formData.pincode,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          eventType: formData.eventType,
          guests: formData.guests,
          eventDate: formData.date,
          notes: formData.message || `Inquiry from Popup`
        }),
      });

      const result = await response.json();
      if (response.status === 429) {
        setError(result.message || 'You have already submitted an inquiry. Please wait 24 hours before sending another inquiry.');
        return;
      }

      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to submit inquiry');
      }

      localStorage.setItem('last_inquiry_submission', new Date().toISOString());

      setIsSubmitted(true);
      setError(null);
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (error: any) {
      console.error('Failed to submit inquiry:', error);
      setError(error.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, venueId, isSubmitting]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAddLocation = useCallback((loc: any) => {
    setFormData(prev => ({
      ...prev,
      pincode: '',
      selectedLocations: prev.selectedLocations.find(l => l.display === loc.display)
        ? prev.selectedLocations
        : [...prev.selectedLocations, loc]
    }));
  }, []);

  const handleRemoveLocation = useCallback((display: string) => {
    setFormData(prev => ({
      ...prev,
      selectedLocations: prev.selectedLocations.filter(l => l.display !== display)
    }));
  }, []);

  const closePopup = useCallback(() => setIsOpen(false), []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <PopupBackdrop onClick={closePopup} />

          <motion.div
            initial={{ opacity: 0, y: "100%", scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "100%", scale: 1 }}
            transition={{ type: "tween", duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            style={{ willChange: "transform, opacity", transform: 'translateZ(0)' }}
            className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl border border-slate-100 max-h-[92vh] sm:max-h-[95vh] flex flex-col overflow-hidden"
          >
            <div className="sm:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-1 shrink-0" />

            <PopupHeader onClose={closePopup} step={step} onBack={step === 'otp' ? () => setStep('signup') : undefined} />
            <StepIndicator currentStep={step} />

            <div className="p-5 sm:p-10 overflow-y-auto no-scrollbar flex-1 pb-10 sm:pb-10 bg-white relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="h-full"
                >
                  {step === 'signup' && (
                    <SignupForm
                      signupData={signupData}
                      onChange={(e) => {
                        if (e.target.name === 'switchStep') return setStep(e.target.value as Step);
                        setSignupData(prev => ({ ...prev, [e.target.name]: e.target.value }));
                      }}
                      onNext={handleSendOtp}
                      isLoading={isLoading}
                    />
                  )}
                  {step === 'login' && (
                    <LoginForm
                      loginData={loginData}
                      onChange={(e) => {
                        if (e.target.name === 'switchStep') return setStep(e.target.value as Step);
                        setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
                      }}
                      onLogin={async () => {
                        try {
                          setIsLoading(true);
                          setError(null);
                          try { await account.deleteSession('current'); } catch (e) { }

                          const session = await account.createEmailPasswordSession(loginData.email, loginData.password);
                          const user = await account.get();

                          if (!user.phoneVerification) {
                            const cleanPhone = user.phone?.replace(/\D/g, '').replace('91', '');
                            if (cleanPhone && cleanPhone.length === 10) {
                              try {
                                const token = await account.createPhoneToken(user.$id, '+91' + cleanPhone);
                                setUserId(token.userId);
                                setStep('otp');
                                setResendTimer(60);
                                return;
                              } catch (tokenErr: any) {
                                console.error('OTP Send Error:', tokenErr);
                              }
                            }
                          }

                          setFormData(prev => ({
                            ...prev,
                            name: user.name,
                            email: user.email,
                            phone: user.phone?.replace('+91', '') || ''
                          }));
                          setStep('inquiry');
                          window.dispatchEvent(new Event('auth-change'));
                        } catch (err: any) {
                          setError(err.message || 'Invalid email or password.');
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      isLoading={isLoading}
                    />
                  )}
                  {step === 'otp' && (
                    <OtpForm
                      otp={otpArray}
                      onOtpChange={(idx, val) => {
                        const newOtp = [...otpArray];
                        newOtp[idx] = val;
                        setOtpArray(newOtp);
                      }}
                      onVerify={handleVerifyOtp}
                      onResend={handleSendOtp}
                      resendTimer={resendTimer}
                      isLoading={isLoading}
                    />
                  )}
                  {step === 'inquiry' && (
                    <InquiryForm
                      formData={formData}
                      onChange={handleChange}
                      onSubmit={handleSubmit}
                      isSubmitted={isSubmitted}
                      isSubmitting={isSubmitting}
                      error={error}
                      selectedLocations={formData.selectedLocations}
                      onAddLocation={handleAddLocation}
                      onRemoveLocation={handleRemoveLocation}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
