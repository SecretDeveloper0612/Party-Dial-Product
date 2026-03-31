'use client';

import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Phone, Building2, Calendar, Users, MapPin, ChevronDown } from 'lucide-react';

// Memoized Backdrop with lighter blur
const PopupBackdrop = memo(({ onClick }: { onClick: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClick}
    className="absolute inset-0 bg-slate-900/40 backdrop-blur-[6px]"
  />
));
PopupBackdrop.displayName = 'PopupBackdrop';

// Memoized Header Decoration - using radial gradients instead of heavy blur filters
const PopupHeader = memo(({ onClose }: { onClose: () => void }) => (
  <div className="bg-slate-900 h-24 relative flex items-center px-8 border-b border-white/5">
    <div 
      className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-40"
      style={{ 
         background: 'radial-gradient(circle at top right, rgba(239, 68, 68, 0.4), transparent 70%)' 
      }}
    />
    
    <div className="relative z-10 flex items-center gap-4">
       <div className="w-10 h-10 rounded-xl bg-pd-red flex items-center justify-center text-white shadow-lg shadow-pd-red/20 rotate-3">
          <Building2 size={22} />
       </div>
       <div>
          <h3 className="text-white font-black text-lg leading-none uppercase italic tracking-tighter">Get Free <span className="text-pd-red">Quotes</span> Now</h3>
          <p className="text-white/50 text-[9px] uppercase font-bold tracking-[0.2em] mt-1 flex items-center gap-1.5">
              <CheckCircle2 size={10} className="text-pd-red" />
              Direct Venue Prices In Minutes
          </p>
       </div>
    </div>
    
    <button 
      onClick={onClose}
      className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg border border-white/10"
      aria-label="Close"
    >
      <X size={18} />
    </button>
  </div>
));
PopupHeader.displayName = 'PopupHeader';

// Memoized Trust Badges
const PopupFooter = memo(() => (
  <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-8">
      <div className="flex items-center gap-1.5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
          <Phone size={10} className="text-pd-red" />
          <span className="text-[9px] font-black uppercase tracking-tighter">+91 98765 43210</span>
      </div>
      <div className="flex items-center gap-1.5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
          <MapPin size={10} className="text-pd-red" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Mumbai HQ</span>
      </div>
  </div>
));
PopupFooter.displayName = 'PopupFooter';

// Memoized Form Component
const InquiryForm = memo(({ 
  formData, 
  onChange, 
  onSubmit, 
  isSubmitted 
}: { 
  formData: any; 
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; 
  onSubmit: (e: React.FormEvent) => void;
  isSubmitted: boolean;
}) => {
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

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            <input 
              type="tel" 
              name="phone"
              required
              value={formData.phone}
              onChange={onChange}
              placeholder="+91 Number" 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pd-red/20 transition-colors placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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

        <button 
          type="submit" 
          className="w-full bg-pd-red hover:bg-pd-red/90 text-white py-4 mt-2 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-pd-red/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          Get Quotes Now
          <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventType: '',
    guests: '',
    date: '',
    message: ''
  });

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-inquiry-popup', handleOpen);

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => {
      window.removeEventListener('open-inquiry-popup', handleOpen);
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const closePopup = useCallback(() => setIsOpen(false), []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <PopupBackdrop onClick={closePopup} />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 400,
              mass: 0.8
            }}
            style={{ willChange: "transform, opacity" }}
            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-100"
          >
            <PopupHeader onClose={closePopup} />

            <div className="p-8 md:p-10">
              <InquiryForm 
                formData={formData} 
                onChange={handleChange} 
                onSubmit={handleSubmit} 
                isSubmitted={isSubmitted} 
              />
            </div>
            
            {!isSubmitted && <PopupFooter />}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
