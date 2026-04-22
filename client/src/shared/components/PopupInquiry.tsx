'use client';

import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Phone, Building2, Calendar, Users, MapPin, ChevronDown } from 'lucide-react';
import { databases, ID, DATABASE_ID, LEADS_COLLECTION_ID, account } from '@/lib/appwrite';
import { useSearchParams } from 'next/navigation';

// Memoized Backdrop with lighter blur
const PopupBackdrop = memo(({ onClick }: { onClick: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClick}
    className="absolute inset-0 bg-slate-950/60"
  />
));
PopupBackdrop.displayName = 'PopupBackdrop';

// Memoized Header Decoration
const PopupHeader = memo(({ onClose }: { onClose: () => void }) => (
  <div className="bg-slate-900 h-20 lg:h-24 relative flex items-center px-6 lg:px-8 border-b border-white/5 rounded-t-[2rem] overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-pd-red/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
    
    <div className="relative z-10 flex items-center gap-4">
       <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-pd-red flex items-center justify-center text-white shadow-lg shadow-pd-red/20 rotate-3 scale-90 lg:scale-100">
          <Building2 size={20} />
       </div>
       <div>
          <h3 className="text-white font-bold text-sm lg:text-base leading-none uppercase italic tracking-tighter">Get Free <span className="text-pd-red">Quotes</span> Now</h3>
          <p className="text-white/50 text-[9px] uppercase font-bold tracking-[0.2em] mt-1 flex items-center gap-1.5">
              <CheckCircle2 size={10} className="text-pd-red" />
              Direct Venue Prices In Minutes
          </p>
       </div>
    </div>
    
    <button 
      onClick={onClose}
      className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 text-white hover:text-white transition-colors bg-white/10 p-2 rounded-xl border border-white/10 z-50 flex items-center justify-center shadow-lg active:scale-95"
      aria-label="Close"
    >
      <X size={20} />
    </button>
  </div>
));
PopupHeader.displayName = 'PopupHeader';

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
      const input = formData.pincode || '';
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

    const debounceTimer = setTimeout(fetchLocations, 400);
    return () => clearTimeout(debounceTimer);
  }, [formData.pincode]);

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
              value={formData.name}
              onChange={onChange}
              placeholder="Your Name" 
              className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pd-red/5 focus:bg-white focus:border-pd-red transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Phone Number</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                <span className="text-sm font-bold text-slate-800 tracking-tighter shrink-0">+91</span>
              </div>
              <input 
                type="tel" 
                name="phone"
                required
                maxLength={10}
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val.length <= 10) {
                    onChange({ ...e, target: { ...e.target, name: 'phone', value: val } } as any);
                  }
                }}
                placeholder="10 Digit Number" 
                className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl pl-16 pr-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-pd-red/5 focus:bg-white focus:border-pd-red transition-all placeholder:text-slate-300 tracking-[0.1em]"
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
                  value={formData.pincode}
                  onChange={(e) => {
                    onChange(e);
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
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venueId');
  const [formData, setFormData] = useState({
    name: '',
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

  useEffect(() => {
    // 1. Manual trigger via custom event (always works)
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-inquiry-popup', handleOpen);

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
      clearTimeout(initialTimer);
      clearInterval(recurringTimer);
    };
  }, [isSubmitted]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      // Ensure a valid session exists for Appwrite (Anonymous if needed)
      try {
        await account.get();
      } catch (e) {
        await account.createAnonymousSession();
      }

      // Call Server API for Distributed Leads
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

      // Store submission time in localStorage
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
      pincode: '', // Clear current input
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
            transition={{ 
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8
            }}
            style={{ willChange: "transform, opacity" }}
            className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl border border-slate-100 max-h-[92vh] sm:max-h-[95vh] flex flex-col overflow-hidden"
          >
            {/* Mobile Handle Bar */}
            <div className="sm:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-1 shrink-0" />
            
            <PopupHeader onClose={closePopup} />

            <div className="p-5 sm:p-10 overflow-y-auto no-scrollbar flex-1 pb-10 sm:pb-10">
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
