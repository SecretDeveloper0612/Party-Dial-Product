'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Users,
  MapPin,
  PartyPopper,
  Phone,
  Mail,
  User,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  X,
  Search,
  ShieldCheck,
  Zap,
  Building2,
  Clock,
  Star,
  RefreshCw,
  AlertCircle,
  KeyRound,
  Check,
  Award,
  BadgePercent
} from 'lucide-react';
import { account, ID } from '@/lib/appwrite';

// Master Event Types List
const EVENT_TYPES = [
  'Wedding',
  'Engagement',
  'Reception',
  'Birthday Party',
  'Anniversary',
  'Corporate Event',
  'Conference',
  'Seminar',
  'Meeting',
  'Exhibition',
  'Product Launch',
  'Award Ceremony',
  'Farewell Party',
  'Retirement Party',
  'Baby Shower',
  'Naming Ceremony',
  'Bridal Shower',
  'Bachelor Party',
  'Bachelorette Party',
  'Graduation Party',
  'Family Function',
  'Religious Ceremony',
  'Festival Celebration',
  'School or College Event',
  'Private Party',
  'Social Gathering',
  'Other'
];

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  eventDate?: string;
  guests?: string;
  eventType?: string;
  otherEventType?: string;
  location?: string;
}

function EventInquiryContent() {
  const searchParams = useSearchParams();

  // Campaign Attribution capture
  const campaignData = useMemo(() => {
    const data: Record<string, string> = {};
    const supportedKeys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'gclid',
      'fbclid'
    ];

    supportedKeys.forEach((key) => {
      const val = searchParams.get(key);
      if (val) data[key] = val;
    });

    return data;
  }, [searchParams]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventDate: '',
    guests: '',
    eventType: '',
    otherEventType: '',
    location: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [distributionStatus, setDistributionStatus] = useState<string>('');
  const [matchedVenues, setMatchedVenues] = useState<any[]>([]);
  const [locationCapacityWarning, setLocationCapacityWarning] = useState<string | null>(null);
  const [isCheckingCapacity, setIsCheckingCapacity] = useState(false);

  // OTP Verification States
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpUserId, setOtpUserId] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Searchable Dropdown state for Event Types
  const [eventTypeOpen, setEventTypeOpen] = useState(false);
  const [eventTypeSearch, setEventTypeSearch] = useState('');
  const eventTypeRef = useRef<HTMLDivElement>(null);

  // Pincode & Location suggestions state
  const [suggestions, setSuggestions] = useState<Array<{ display: string; name: string; pincode: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  // Minimum allowed date is today
  const todayStr = useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Timer countdown for resending OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (eventTypeRef.current && !eventTypeRef.current.contains(e.target as Node)) {
        setEventTypeOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Location / Pincode Suggestions lookup with debounce
  useEffect(() => {
    const query = formData.location.trim();
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    if (query === '263139' || query.toLowerCase() === 'haldwani') {
      setSuggestions([
        { display: 'Haldwani, Nainital - 263139', name: 'Haldwani', pincode: '263139' },
        { display: 'Kathgodam, Nainital - 263126', name: 'Kathgodam', pincode: '263126' },
        { display: 'Mukhani, Haldwani - 263139', name: 'Mukhani', pincode: '263139' },
        { display: 'Kaladhungi, Nainital - 263140', name: 'Kaladhungi', pincode: '263140' },
        { display: 'Lalkuan, Nainital - 263131', name: 'Lalkuan', pincode: '263131' }
      ]);
      return;
    }

    if (/^\d{3,6}$/.test(query)) {
      const timer = setTimeout(async () => {
        setIsLoadingPincode(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${query}`);
          const data = await res.json();
          if (Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0]?.PostOffice)) {
            const mapped = data[0].PostOffice.slice(0, 6).map((po: any) => ({
              display: `${po.Name}, ${po.District} - ${po.Pincode}`,
              name: po.Name,
              pincode: po.Pincode
            }));
            setSuggestions(mapped);
          } else {
            setSuggestions([]);
          }
        } catch {
          setSuggestions([]);
        } finally {
          setIsLoadingPincode(false);
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [formData.location]);

  // Location-Specific Guest Capacity Analysis
  useEffect(() => {
    const rawGuests = parseInt(formData.guests, 10);
    const loc = formData.location.trim();

    // If no guests or invalid number, clear warning
    if (!formData.guests || isNaN(rawGuests) || rawGuests <= 0) {
      setLocationCapacityWarning(null);
      return;
    }

    // Immediate check for global platform max (7,000 guests)
    if (rawGuests > 7000) {
      setLocationCapacityWarning('Our platform does not have any venue with this much guest capacity (maximum platform capacity is 7,000 guests).');
      return;
    }

    // Known local capacity thresholds for immediate feedback
    const isHaldwani = /haldwani|263139/i.test(loc);
    if (isHaldwani && rawGuests > 2000) {
      setLocationCapacityWarning(`In Haldwani (263139), our platform does not have venues with a capacity of ${rawGuests.toLocaleString('en-IN')} guests (maximum available capacity in Haldwani is 2,000 guests).`);
      return;
    }

    // Debounced query to backend for dynamic locations
    const timer = setTimeout(async () => {
      try {
        setIsCheckingCapacity(true);
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5005/api';
        const url = `${baseUrl}/leads/check-capacity?location=${encodeURIComponent(loc)}&guests=${rawGuests}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data.hasCapacity === false) {
            setLocationCapacityWarning(data.message);
          } else {
            setLocationCapacityWarning(null);
          }
        }
      } catch (err) {
        // Fallback gracefully on network error
      } finally {
        setIsCheckingCapacity(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.guests, formData.location]);

  // Validation function
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';

      case 'phone': {
        const cleaned = value.replace(/[^0-9]/g, '');
        if (!cleaned) return 'Mobile number is required';
        if (cleaned.length !== 10) return 'Enter a valid 10-digit Indian mobile number';
        if (!/^[6-9]\d{9}$/.test(cleaned)) return 'Indian mobile numbers must start with 6, 7, 8, or 9';
        return '';
      }

      case 'email':
        if (!value.trim()) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address';
        return '';

      case 'eventDate': {
        if (!value) return 'Event date is required';
        const selected = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) return 'Event date cannot be in the past';
        return '';
      }

      case 'guests': {
        if (!value) return 'Guest count is required';
        const count = parseInt(value, 10);
        if (isNaN(count) || count < 1) return 'Please enter a positive guest count (minimum 1)';
        if (count > 7000) {
          return 'Our platform does not have venues with this much guest capacity (maximum available capacity is 7,000 guests). Please enter a lower guest count or contact support for mega-events.';
        }
        return '';
      }

      case 'eventType':
        if (!value) return 'Please select an event type';
        return '';

      case 'otherEventType':
        if (formData.eventType === 'Other' && !value.trim()) {
          return 'Please specify your event type';
        }
        return '';

      case 'location': {
        if (!value.trim()) return 'Please enter the city, area, or pincode where you want the venue';
        const isNumeric = /^\d+$/.test(value.trim());
        if (isNumeric && value.trim().length !== 6) {
          return 'Pincode must be exactly 6 digits';
        }
        return '';
      }

      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, (formData as any)[field] || '');
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  // SEND OTP HANDLER
  const handleSendOtp = async (cleanNum?: string) => {
    const numberToVerify = cleanNum || formData.phone.replace(/[^0-9]/g, '');
    if (numberToVerify.length !== 10 || !/^[6-9]\d{9}$/.test(numberToVerify)) {
      setErrors((prev) => ({ ...prev, phone: 'Enter a valid 10-digit Indian mobile number' }));
      return;
    }

    try {
      setIsSendingOtp(true);
      setOtpError(null);
      setSubmitError(null);

      try {
        await account.deleteSession('current');
      } catch {}

      const formattedPhone = '+91' + numberToVerify;
      const token = await account.createPhoneToken(ID.unique(), formattedPhone);
      setOtpUserId(token.userId);
      setIsOtpSent(true);
      setResendTimer(45);
      setTimeout(() => {
        otpRefs[0].current?.focus();
      }, 100);
    } catch (err: any) {
      console.error('Failed to send OTP:', err);
      setOtpError(err.message || 'Failed to send OTP. Please check your mobile number.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // VERIFY OTP HANDLER
  const handleVerifyOtp = async () => {
    const secret = otpArray.join('').trim();
    if (secret.length !== 6) {
      setOtpError('Please enter all 6 digits of the OTP');
      return;
    }

    try {
      setIsVerifyingOtp(true);
      setOtpError(null);

      await account.updatePhoneSession(otpUserId, secret);
      setIsPhoneVerified(true);
      setErrors((prev) => ({ ...prev, phone: undefined }));
    } catch (err: any) {
      console.error('Failed to verify OTP:', err);
      setOtpError(err.message || 'Invalid or expired OTP. Please try again or request a new code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }

    // Reset phone verification on change
    if (field === 'phone') {
      const cleaned = value.replace(/[^0-9]/g, '');
      if (isPhoneVerified) {
        setIsPhoneVerified(false);
        setIsOtpSent(false);
        setOtpArray(['', '', '', '', '', '']);
      }

      if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
        setErrors((prev) => ({ ...prev, phone: undefined }));
        if (!isOtpSent && !isPhoneVerified && !isSendingOtp) {
          handleSendOtp(cleaned);
        }
      } else if (cleaned.length < 10) {
        setIsOtpSent(false);
        setOtpArray(['', '', '', '', '', '']);
      }
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    newErrors.name = validateField('name', formData.name);
    newErrors.phone = validateField('phone', formData.phone);
    newErrors.email = validateField('email', formData.email);
    newErrors.eventDate = validateField('eventDate', formData.eventDate);
    newErrors.guests = locationCapacityWarning || validateField('guests', formData.guests);
    newErrors.eventType = validateField('eventType', formData.eventType);
    if (formData.eventType === 'Other') {
      newErrors.otherEventType = validateField('otherEventType', formData.otherEventType);
    }
    newErrors.location = validateField('location', formData.location);

    if (!isPhoneVerified) {
      newErrors.phone = 'Please verify your mobile number with the OTP before submitting';
    }

    setErrors(newErrors);
    setTouched({
      name: true,
      phone: true,
      email: true,
      eventDate: true,
      guests: true,
      eventType: true,
      otherEventType: true,
      location: true
    });

    return !Object.values(newErrors).some((e) => Boolean(e));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!isPhoneVerified) {
      setSubmitError('Please complete OTP verification for your contact number before sending your inquiry.');
      if (!isOtpSent && formData.phone.length === 10) {
        handleSendOtp();
      }
      return;
    }

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5005';
      const baseUrl = base.endsWith('/api') ? base : `${base}/api`;

      const finalEventType =
        formData.eventType === 'Other' && formData.otherEventType.trim()
          ? `Other: ${formData.otherEventType.trim()}`
          : formData.eventType;

      const cleanPhone = formData.phone.replace(/[^0-9]/g, '');

      const isPaid = Boolean(
        campaignData.utm_source ||
          campaignData.gclid ||
          campaignData.fbclid ||
          (campaignData.utm_medium && /cpc|paid|ads/i.test(campaignData.utm_medium))
      );
      const leadSource = isPaid ? 'Paid Ads' : 'Website Inquiry';

      const payload = {
        name: formData.name.trim(),
        phone: cleanPhone,
        number: cleanPhone,
        email: formData.email.trim().toLowerCase(),
        eventType: finalEventType,
        guests: parseInt(formData.guests, 10),
        guestCapacity: String(formData.guests),
        guestCount: parseInt(formData.guests, 10),
        eventDate: formData.eventDate,
        pincode: formData.location.trim(),
        location: formData.location.trim(),
        notes: `Landing Page Lead (Verified Phone) | Event Date: ${formData.eventDate} | Guests: ${formData.guests} | Location: ${formData.location.trim()}`,
        leadSource,
        campaignData,
        ...campaignData
      };

      const res = await fetch(`${baseUrl}/leads/public-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.status === 429) {
        setSubmitError(data.message || 'You have already submitted an inquiry recently. Our team will contact you shortly.');
        return;
      }

      if (!res.ok && data.status !== 'success') {
        throw new Error(data.message || 'Failed to submit inquiry. Please try again.');
      }

      setMatchCount(typeof data.matchCount === 'number' ? data.matchCount : 0);
      setDistributionStatus(data.distributionStatus || (data.matchCount > 0 ? 'Distributed' : 'Unmatched'));
      setMatchedVenues(Array.isArray(data.eligibleVenues) ? data.eligibleVenues : []);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);
      setSubmitError(err.message || 'Could not connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEventTypes = useMemo(() => {
    if (!eventTypeSearch.trim()) return EVENT_TYPES;
    return EVENT_TYPES.filter((type) =>
      type.toLowerCase().includes(eventTypeSearch.toLowerCase().trim())
    );
  }, [eventTypeSearch]);

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      eventDate: '',
      guests: '',
      eventType: '',
      otherEventType: '',
      location: ''
    });
    setErrors({});
    setTouched({});
    setSubmitError(null);
    setIsSubmitted(false);
    setIsPhoneVerified(false);
    setIsOtpSent(false);
    setOtpArray(['', '', '', '', '', '']);
    setOtpError(null);
  };

  return (
    <main className="bg-slate-50/50 sm:bg-white text-slate-900 font-inter antialiased flex flex-col justify-start relative overflow-hidden pt-2 sm:pt-4 pb-12 sm:pb-16 min-h-[calc(100vh-80px)]">
      {/* Subtle warm ambient glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-rose-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 pt-1 sm:pt-0 pb-0 relative z-10">
        
        {/* SUCCESS VIEW */}
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-white rounded-[32px] p-8 sm:p-12 shadow-2xl border border-slate-200 text-center relative overflow-hidden max-w-2xl mx-auto my-12"
            >
              <div className="absolute top-0 left-0 right-0 h-2 pd-gradient" />
              
              <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={44} className="text-emerald-500 animate-pulse" />
              </div>

              {matchCount === 0 ? (
                /* NO MATCH AT LOCATION MESSAGE VIEW */
                <>
                  <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/10">
                    <MapPin size={40} className="text-amber-500" />
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-4 font-['Poppins']">
                    <AlertCircle size={14} className="text-amber-600" /> Location Matching Notice
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-semibold font-['Poppins'] text-slate-900 tracking-tight mb-3">
                    No Matching Venues Found at This Location
                  </h1>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-['Poppins'] font-light">
                    On this location (<strong className="text-slate-800 font-semibold">{formData.location}</strong>), we do not currently have any partner venue that matches your specific event requirements for <strong className="text-pd-red font-semibold">{formData.eventType}</strong> with a capacity of <strong className="text-slate-800 font-semibold">{formData.guests} guests</strong>.
                  </p>

                  {/* Help & Assistance Card */}
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6 text-left mb-8 shadow-sm">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-amber-800 mb-3 flex items-center gap-2 font-['Poppins']">
                      <Clock size={14} className="text-amber-600" /> Don&apos;t Worry — Our Concierge Team is on it!
                    </h2>
                    <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-200/60 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                        <span>Your requirements have been securely recorded and sent to our <strong>Offline Venue Concierge Team</strong>.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-200/60 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                        <span>Our local specialists will personally explore nearby banquet halls and venues in neighboring areas that can accommodate your <strong>{formData.guests} guests</strong>.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-200/60 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                        <span>We will contact you directly on <strong>+91 {formData.phone}</strong> with customized recommendations and negotiated rates.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 text-center flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={16} /> Try Another Location or Date
                    </button>
                    <Link
                      href="/"
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm uppercase tracking-wider transition-all active:scale-95 text-center"
                    >
                      Return to Homepage
                    </Link>
                  </div>
                </>
              ) : (
                /* MATCHED VENUES VIEW */
                <>
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 size={44} className="text-emerald-500 animate-pulse" />
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
                    Inquiry Received & Verified
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-semibold font-['Poppins'] text-slate-900 tracking-tight mb-4">
                    Your Event Inquiry Has Been Received!
                  </h1>

                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 font-['Poppins'] font-light">
                    Thank you for choosing <span className="font-semibold text-pd-red">PartyDial</span>. We&apos;ve matched your requirements with <strong className="font-semibold text-slate-900">{matchCount} verified partner venue{matchCount && matchCount > 1 ? 's' : ''}</strong> in <strong className="font-semibold text-slate-900">{formData.location}</strong>.
                  </p>

                  {/* Next Steps */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left mb-8 shadow-sm">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                      <Clock size={14} className="text-pd-red" /> What Happens Next?
                    </h2>
                    <ul className="space-y-3 text-sm text-slate-700 font-medium">
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-pd-red/10 text-pd-red flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                        <span>Our matching partner venues have received your requirements for <strong>{formData.eventType}</strong>.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-pd-red/10 text-pd-red flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                        <span>Venues will review your date (<strong>{formData.eventDate || 'Flexible'}</strong>) and guest count (<strong>{formData.guests}</strong>) with guaranteed best pricing.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-pd-red/10 text-pd-red flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                        <span>You will receive calls/messages directly on <strong>+91 {formData.phone}</strong> with customized quotes.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/"
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 text-center"
                    >
                      Return to Homepage
                    </Link>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm uppercase tracking-wider transition-all active:scale-95 text-center flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={16} /> Submit Another Inquiry
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            /* SPLIT LAYOUT: LEFT SIDE IMAGE & VALUE PROPOSITION, RIGHT SIDE COMPLETE FORM */
            <div className="bg-white sm:bg-slate-50/80 rounded-2xl sm:rounded-[36px] shadow-sm sm:shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12)] overflow-hidden border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[800px]">
              
              {/* LEFT SIDE: CAMPAIGN VISUAL ONLY (Hidden on mobile responsive, visible on lg screens) */}
              <div className="hidden lg:flex lg:col-span-5 relative bg-pink-50/30 overflow-hidden lg:min-h-full items-center justify-center">
                <Image
                  src="/about/partydial-inquiry-girl.jpg"
                  alt="PartyDial Event Inquiry"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-top"
                />
              </div>

              {/* RIGHT SIDE: FULL FORM */}
              <div className="lg:col-span-7 p-4 sm:p-8 lg:p-12 pb-8 sm:pb-10 bg-white sm:bg-slate-50/60 lg:border-l border-slate-200/80 flex flex-col justify-center">
                {/* Form Heading */}
                <div className="mb-5 sm:mb-8">
                  <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-pd-red mb-1.5 sm:mb-2 font-['Poppins']">
                    Quick Event Inquiry
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-['Poppins'] text-slate-900 tracking-tight leading-tight">
                    Let&apos;s Plan Your <span className="pd-gradient-text font-semibold">Perfect Event!</span>
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm font-['Poppins'] font-light mt-1.5 leading-relaxed">
                    Tell us a little about your event, and discover the perfect venues for your special occasion with PartyDial.
                  </p>
                </div>

                {/* Submit Error Banner */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 mb-6"
                  >
                    <AlertCircle size={20} className="shrink-0 mt-0.5 text-rose-600" />
                    <div>
                      <h3 className="font-bold text-sm">Submission Notice</h3>
                      <p className="text-xs mt-0.5 leading-relaxed">{submitError}</p>
                    </div>
                  </motion.div>
                )}

                {/* The Form */}
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {/* FULL NAME */}
                    <div className="space-y-1.5">
                      <label htmlFor="inquiry-full-name" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        Full Name <span className="text-pd-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <User size={17} />
                        </div>
                        <input
                          id="inquiry-full-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          onBlur={() => handleBlur('name')}
                          placeholder="Enter your full name"
                          className={`w-full h-12 sm:h-13 bg-white border rounded-xl sm:rounded-2xl pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 transition-all shadow-sm ${
                            errors.name && touched.name
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
                              : 'border-slate-300 hover:border-slate-400 focus:border-pd-red focus:ring-pd-red/10'
                          }`}
                        />
                      </div>
                      {errors.name && touched.name && (
                        <p className="text-xs font-semibold text-rose-600 pl-1">{errors.name}</p>
                      )}
                    </div>

                    {/* CONTACT NUMBER */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label htmlFor="inquiry-phone" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                          Contact Number <span className="text-pd-red">*</span>
                        </label>
                        {isPhoneVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-in fade-in zoom-in">
                            <Check size={11} className="stroke-[3]" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-500 font-bold text-sm pointer-events-none">
                          <Phone size={15} className="text-slate-400" />
                          <span>+91</span>
                        </div>
                        <input
                          id="inquiry-phone"
                          type="tel"
                          required
                          disabled={isPhoneVerified}
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.length <= 10) handleChange('phone', val);
                          }}
                          onBlur={() => handleBlur('phone')}
                          placeholder="Enter 10-digit number"
                          className={`w-full h-12 sm:h-13 bg-white border rounded-xl sm:rounded-2xl pl-16 sm:pl-19 pr-22 sm:pr-24 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal tracking-wide focus:outline-none focus:ring-4 transition-all shadow-sm ${
                            isPhoneVerified
                              ? 'bg-emerald-50/40 border-emerald-300 text-slate-800 cursor-not-allowed'
                              : errors.phone && touched.phone
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
                              : 'border-slate-300 hover:border-slate-400 focus:border-pd-red focus:ring-pd-red/10'
                          }`}
                        />
                        {!isPhoneVerified && formData.phone.length === 10 && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <button
                              type="button"
                              onClick={() => handleSendOtp()}
                              disabled={isSendingOtp}
                              className="px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl bg-slate-900 hover:bg-pd-red active:scale-95 text-white text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1 shadow-sm"
                            >
                              {isSendingOtp ? (
                                <RefreshCw size={12} className="animate-spin" />
                              ) : isOtpSent ? (
                                'Resend'
                              ) : (
                                'Verify'
                              )}
                            </button>
                          </div>
                        )}
                        {isPhoneVerified && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsPhoneVerified(false);
                                setIsOtpSent(false);
                              }}
                              className="text-[11px] font-bold text-slate-400 hover:text-pd-red transition-colors underline"
                            >
                              Change
                            </button>
                          </div>
                        )}
                      </div>
                      {errors.phone && touched.phone && (
                        <p className="text-xs font-semibold text-rose-600 pl-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* OTP VERIFICATION SLIDE-DOWN */}
                  <AnimatePresence>
                    {isOtpSent && !isPhoneVerified && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-50/70 via-purple-50/40 to-slate-50 border border-pd-pink/20 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-pd-red/10 text-pd-red flex items-center justify-center shrink-0">
                                <KeyRound size={14} />
                              </div>
                              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                Enter 6-Digit OTP
                              </h3>
                            </div>
                            <p className="text-[11px] sm:text-xs font-medium text-slate-500">
                              Sent to <strong className="text-slate-800">+91 {formData.phone}</strong>
                            </p>
                          </div>

                          {/* 6 Digit Inputs - Responsive for mobile (no horizontal scroll or squishing) */}
                          <div className="flex justify-center items-center gap-1.5 sm:gap-2.5 w-full max-w-sm mx-auto py-1">
                            {otpArray.map((digit, idx) => (
                              <input
                                key={idx}
                                ref={otpRefs[idx]}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '');
                                  if (val) {
                                    const next = [...otpArray];
                                    next[idx] = val;
                                    setOtpArray(next);
                                    if (idx < 5) otpRefs[idx + 1].current?.focus();
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Backspace' && !otpArray[idx] && idx > 0) {
                                    const next = [...otpArray];
                                    next[idx - 1] = '';
                                    setOtpArray(next);
                                    otpRefs[idx - 1].current?.focus();
                                  }
                                }}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                                  if (pasted.length) {
                                    const next = [...otpArray];
                                    for (let i = 0; i < pasted.length; i++) {
                                      next[i] = pasted[i];
                                    }
                                    setOtpArray(next);
                                    const focusIndex = Math.min(pasted.length, 5);
                                    otpRefs[focusIndex].current?.focus();
                                  }
                                }}
                                className="w-10 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-white border border-slate-300 rounded-lg sm:rounded-xl focus:bg-white focus:border-pd-red focus:ring-4 focus:ring-pd-red/10 outline-none transition-all shadow-sm shrink"
                              />
                            ))}
                          </div>

                          {otpError && (
                            <p className="text-xs font-bold text-rose-600 text-center">{otpError}</p>
                          )}

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                            <button
                              type="button"
                              disabled={resendTimer > 0 || isSendingOtp}
                              onClick={() => handleSendOtp()}
                              className="text-xs font-bold text-slate-500 hover:text-pd-red transition-colors disabled:opacity-50 py-1"
                            >
                              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                            </button>

                            <button
                              type="button"
                              disabled={isVerifyingOtp || otpArray.join('').length < 6}
                              onClick={handleVerifyOtp}
                              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-pd-red text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                              {isVerifyingOtp ? (
                                <>
                                  <RefreshCw size={13} className="animate-spin" />
                                  <span>Verifying...</span>
                                </>
                              ) : (
                                <>
                                  <span>Verify & Confirm OTP</span>
                                  <CheckCircle2 size={14} />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {/* EMAIL ADDRESS */}
                    <div className="space-y-1.5">
                      <label htmlFor="inquiry-email" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        Email Address <span className="text-pd-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <Mail size={17} />
                        </div>
                        <input
                          id="inquiry-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          onBlur={() => handleBlur('email')}
                          placeholder="Enter your email address"
                          className={`w-full h-12 sm:h-13 bg-white border rounded-xl sm:rounded-2xl pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 transition-all shadow-sm ${
                            errors.email && touched.email
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
                              : 'border-slate-300 hover:border-slate-400 focus:border-pd-red focus:ring-pd-red/10'
                          }`}
                        />
                      </div>
                      {errors.email && touched.email && (
                        <p className="text-xs font-semibold text-rose-600 pl-1">{errors.email}</p>
                      )}
                    </div>

                    {/* EVENT DATE */}
                    <div className="space-y-1.5">
                      <label htmlFor="inquiry-event-date" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        Event Date <span className="text-pd-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <CalendarIcon size={17} />
                        </div>
                        <input
                          id="inquiry-event-date"
                          type="date"
                          required
                          min={todayStr}
                          value={formData.eventDate}
                          onChange={(e) => handleChange('eventDate', e.target.value)}
                          onBlur={() => handleBlur('eventDate')}
                          className={`w-full h-12 sm:h-13 bg-white border rounded-xl sm:rounded-2xl pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 transition-all shadow-sm ${
                            errors.eventDate && touched.eventDate
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
                              : 'border-slate-300 hover:border-slate-400 focus:border-pd-red focus:ring-pd-red/10'
                          }`}
                        />
                      </div>
                      {errors.eventDate && touched.eventDate && (
                        <p className="text-xs font-semibold text-rose-600 pl-1">{errors.eventDate}</p>
                      )}
                    </div>

                    {/* APPROXIMATE GUESTS */}
                    <div className="space-y-1.5">
                      <label htmlFor="inquiry-guests" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        Approximate Guests <span className="text-pd-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <Users size={17} />
                        </div>
                        <input
                          id="inquiry-guests"
                          type="number"
                          min={1}
                          step={1}
                          required
                          value={formData.guests}
                          onChange={(e) => {
                            handleChange('guests', e.target.value);
                            handleBlur('guests');
                          }}
                          onBlur={() => handleBlur('guests')}
                          placeholder="e.g. 150"
                          className={`w-full h-12 sm:h-13 bg-white border rounded-xl sm:rounded-2xl pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 transition-all shadow-sm ${
                            locationCapacityWarning || (errors.guests && touched.guests)
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
                              : 'border-slate-300 hover:border-slate-400 focus:border-pd-red focus:ring-pd-red/10'
                          }`}
                        />
                      </div>
                      {(locationCapacityWarning || (errors.guests && touched.guests)) && (
                        <div className="p-3 rounded-xl sm:rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 mt-2 animate-in fade-in">
                          <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                          <div className="leading-relaxed">
                            <span className="font-bold block text-rose-800 mb-0.5">Capacity Notice</span>
                            <span>{locationCapacityWarning || errors.guests}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* EVENT TYPE */}
                    <div className="space-y-1.5 relative" ref={eventTypeRef}>
                      <label htmlFor="inquiry-event-type-btn" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        Event Type <span className="text-pd-red">*</span>
                      </label>
                      <div className="relative">
                        <button
                          id="inquiry-event-type-btn"
                          type="button"
                          onClick={() => setEventTypeOpen((prev) => !prev)}
                          onBlur={() => handleBlur('eventType')}
                          className={`w-full h-12 sm:h-13 bg-white border rounded-xl sm:rounded-2xl pl-11 pr-10 text-left text-sm font-semibold transition-all shadow-sm flex items-center justify-between ${
                            formData.eventType ? 'text-slate-900' : 'text-slate-400 font-normal'
                          } ${
                            errors.eventType && touched.eventType
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
                              : 'border-slate-300 hover:border-slate-400 focus:border-pd-red focus:ring-pd-red/10'
                          }`}
                        >
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <PartyPopper size={17} />
                          </div>
                          <span className="truncate">
                            {formData.eventType || 'Select event type'}
                          </span>
                          <ChevronDown
                            size={17}
                            className={`text-slate-400 transition-transform ${
                              eventTypeOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {eventTypeOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden max-h-72 flex flex-col"
                          >
                            <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                              <Search size={16} className="text-slate-400 shrink-0" />
                              <input
                                type="text"
                                value={eventTypeSearch}
                                onChange={(e) => setEventTypeSearch(e.target.value)}
                                placeholder="Search event type..."
                                className="bg-transparent border-none text-xs font-semibold text-slate-900 focus:outline-none w-full"
                                autoFocus
                              />
                              {eventTypeSearch && (
                                <button
                                  type="button"
                                  onClick={() => setEventTypeSearch('')}
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>

                            <div className="overflow-y-auto divide-y divide-slate-50 flex-1">
                              {filteredEventTypes.length === 0 ? (
                                <div className="p-4 text-center text-xs text-slate-400 font-medium">
                                  No matching event type found.
                                </div>
                              ) : (
                                filteredEventTypes.map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() => {
                                      handleChange('eventType', type);
                                      setEventTypeOpen(false);
                                      setEventTypeSearch('');
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between ${
                                      formData.eventType === type
                                        ? 'bg-rose-50 text-pd-red'
                                        : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                  >
                                    <span>{type}</span>
                                    {formData.eventType === type && (
                                      <CheckCircle2 size={15} className="text-pd-red" />
                                    )}
                                  </button>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {errors.eventType && touched.eventType && (
                        <p className="text-xs font-semibold text-rose-600 pl-1">{errors.eventType}</p>
                      )}
                    </div>
                  </div>

                  {/* CONDITIONAL "OTHER" SPECIFICATION */}
                  <AnimatePresence>
                    {formData.eventType === 'Other' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5 overflow-hidden"
                      >
                        <label htmlFor="inquiry-other-type" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                          Specify Event Type <span className="text-pd-red">*</span>
                        </label>
                        <input
                          id="inquiry-other-type"
                          type="text"
                          value={formData.otherEventType}
                          onChange={(e) => handleChange('otherEventType', e.target.value)}
                          onBlur={() => handleBlur('otherEventType')}
                          placeholder="e.g. Sangeet, Pooja, Corporate Gala, Alumni Meet"
                          className={`w-full h-12 sm:h-13 bg-white border rounded-xl sm:rounded-2xl px-4 sm:px-5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 transition-all shadow-sm ${
                            errors.otherEventType && touched.otherEventType
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
                              : 'border-slate-300 hover:border-slate-400 focus:border-pd-red focus:ring-pd-red/10'
                          }`}
                        />
                        {errors.otherEventType && touched.otherEventType && (
                          <p className="text-xs font-semibold text-rose-600 pl-1">{errors.otherEventType}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* PREFERRED VENUE LOCATION / PINCODE */}
                  <div className="space-y-1.5 relative" ref={locationRef}>
                    <label htmlFor="inquiry-location" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Preferred Venue Location / Pincode <span className="text-pd-red">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <MapPin size={17} />
                      </div>
                      <input
                        id="inquiry-location"
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => {
                          handleChange('location', e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => handleBlur('location')}
                        placeholder="Where do you need the venue? (e.g. Haldwani or 263139)"
                        className={`w-full h-12 sm:h-13 bg-white border rounded-xl sm:rounded-2xl pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 transition-all shadow-sm ${
                          errors.location && touched.location
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
                            : 'border-slate-300 hover:border-slate-400 focus:border-pd-red focus:ring-pd-red/10'
                        }`}
                      />
                    </div>

                    {/* Suggestions */}
                    <AnimatePresence>
                      {showSuggestions && (suggestions.length > 0 || isLoadingPincode) && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden divide-y divide-slate-50"
                        >
                          {isLoadingPincode ? (
                            <div className="p-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                              Finding locations...
                            </div>
                          ) : (
                            suggestions.map((s, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  handleChange('location', s.display);
                                  setShowSuggestions(false);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors flex items-center justify-between"
                              >
                                <span>{s.display}</span>
                                <span className="text-[10px] uppercase font-bold text-pd-red bg-rose-50 px-2 py-0.5 rounded-md">
                                  {s.pincode}
                                </span>
                              </button>
                            ))
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {errors.location && touched.location && (
                      <p className="text-xs font-semibold text-rose-600 pl-1">{errors.location}</p>
                    )}
                  </div>

                  {/* CTA BUTTON */}
                  <div className="pt-3 pb-2 sm:pb-0">
                    <button
                      id="inquiry-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-13 sm:h-15 rounded-xl sm:rounded-2xl pd-btn-primary flex items-center justify-center gap-2.5 sm:gap-3 text-white font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-lg sm:shadow-xl shadow-pd-pink/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          <span>Matching Perfect Venues...</span>
                        </>
                      ) : !isPhoneVerified ? (
                        <>
                          <span>Verify Phone & Find Venues</span>
                          <ArrowRight size={18} />
                        </>
                      ) : (
                        <>
                          <span>Find My Perfect Venue</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function EventInquiryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-pd-red border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EventInquiryContent />
    </Suspense>
  );
}
