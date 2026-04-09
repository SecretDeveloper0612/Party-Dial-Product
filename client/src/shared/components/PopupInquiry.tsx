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
          <h3 className="text-white font-black text-base lg:text-lg leading-none uppercase italic tracking-tighter">Get Free <span className="text-pd-red">Quotes</span> Now</h3>
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
  isSubmitting
}: { 
  formData: any; 
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; 
  onSubmit: (e: React.FormEvent) => void;
  isSubmitted: boolean;
  isSubmitting: boolean;
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
          const formattedSuggestions = offices.map((office: any) => ({
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
        <h4 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Perfect!</h4>
        <p className="text-slate-500 font-medium">Sit back and relax. Our venue hosts are calculating your best quotes right now.</p>
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

      <form onSubmit={onSubmit} className="space-y-4 lg:space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={onChange}
              placeholder="Your Name" 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pd-red/20 transition-colors placeholder:text-slate-300"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
            <div className="relative">
              <input 
                type="tel" 
                name="phone"
                required
                value={formData.phone}
                onChange={onChange}
                placeholder="91 Number" 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pd-red/20 transition-colors placeholder:text-slate-300"
              />
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Approx Guests</label>
            <div className="relative">
                <select 
                    name="guests"
                    required
                    value={formData.guests}
                    onChange={onChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pd-red/20 transition-colors appearance-none cursor-pointer"
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
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Type</label>
            <div className="relative">
                <select 
                  name="eventType"
                  required
                  value={formData.eventType}
                  onChange={onChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pd-red/20 transition-colors appearance-none cursor-pointer"
                >
              <option value="">Select Event</option>
              {/* options omitted for brevity in thought, but I will include them in final code */}
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
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
          </div>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Proposed Event Date</label>
            <div className="relative">
                <input 
                  type="date" 
                  name="date"
                  required
                  value={formData.date}
                  onChange={onChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pd-red/20 transition-colors"
                />
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1 relative" ref={pincodeRef}>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pincode / Location</label>
            <div className="relative">
                <input 
                  type="text" 
                  name="pincode"
                  autoComplete="off"
                  required
                  value={formData.pincode}
                  onChange={(e) => {
                    onChange(e);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="263139"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pd-red/20 transition-colors placeholder:text-slate-300"
                />
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
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
                                        const syntheticEvent = {
                                            target: { name: 'pincode', value: s.display }
                                        } as any;
                                        onChange(syntheticEvent);
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

        <button 
           type="submit" 
           disabled={isSubmitting}
           className="w-full bg-pd-red hover:bg-pd-red/90 text-white py-4 mt-2 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-pd-red/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {isSubmitting ? 'Sending Request...' : 'Get Quotes Now'}
          {!isSubmitting && <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
        </button>
        
        <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
          <span className="text-emerald-500 font-black">Zero Brokerage</span> • Verified First • Best Price Guarantee
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
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venueId');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventType: '',
    guests: '',
    date: '',
    pincode: '',
    message: ''
  });

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
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-server-koo2.onrender.com/api';
      const response = await fetch(`${baseUrl}/venues/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueId: venueId || 'BROADCAST',
          pincode: formData.pincode,
          name: formData.name,
          phone: formData.phone,
          eventType: formData.eventType,
          guests: formData.guests,
          notes: formData.message || `Inquiry from Popup`
        }),
      });

      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to submit inquiry');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      alert('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, venueId, isSubmitting]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
