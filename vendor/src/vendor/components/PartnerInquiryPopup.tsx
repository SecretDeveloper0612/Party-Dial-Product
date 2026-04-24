'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  User, 
  Users,
  Phone, 
  Mail, 
  Building2, 
  MapPin, 
  ChevronDown,
  Sparkles,
  CheckCircle2,
  LayoutGrid
} from 'lucide-react';

interface PartnerInquiryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  venueProfile?: any;
}

const PLANS = [
  { id: 'starter', label: 'Upto 50 PAX (Starter Pack)' },
  { id: 'growth', label: '50–100 PAX (Growth Pack)' },
  { id: 'priority', label: '100–200 PAX (Priority Pack)' },
  { id: 'featured', label: '200–500 PAX (Featured Pack)' },
  { id: 'premium', label: '500–1000 PAX (Premium Pack)' },
  { id: 'elite', label: '1000–2000 PAX (Elite Pack)' },
  { id: 'platinum', label: '2000–5000 PAX (Platinum Pack)' },
  { id: 'enterprise', label: '5000+ PAX (Enterprise Pack)' },
];

const PartnerInquiryPopup = ({ isOpen, onClose, venueProfile }: PartnerInquiryPopupProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    plan: '',
    venueName: '',
    pincode: '',
    city: ''
  });

  const getPlanByCapacity = (cap: number | string) => {
    const c = parseInt(String(cap));
    if (!c) return '100–200 PAX (Priority Pack)';
    if (c <= 50) return 'Upto 50 PAX (Starter Pack)';
    if (c <= 100) return '50–100 PAX (Growth Pack)';
    if (c <= 200) return '100–200 PAX (Priority Pack)';
    if (c <= 500) return '200–500 PAX (Featured Pack)';
    if (c <= 1000) return '500–1000 PAX (Premium Pack)';
    if (c <= 2000) return '1000–2000 PAX (Elite Pack)';
    if (c <= 5000) return '2000–5000 PAX (Platinum Pack)';
    return '5000+ PAX (Enterprise Pack)';
  };

  // Automatically sync form data when venueProfile is loaded or changes
  React.useEffect(() => {
    if (venueProfile) {
      setFormData(prev => ({
        ...prev,
        name: venueProfile.ownerName || prev.name || '',
        phone: venueProfile.contactNumber || prev.phone || '',
        email: venueProfile.contactEmail || prev.email || '',
        venueName: venueProfile.venueName || prev.venueName || '',
        pincode: venueProfile.pincode || prev.pincode || '',
        city: venueProfile.city || prev.city || '',
        plan: venueProfile.capacity ? getPlanByCapacity(venueProfile.capacity) : (prev.plan || '100–200 PAX (Priority Pack)')
      }));
    }
  }, [venueProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com';
      const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
      
      const response = await fetch(`${baseUrl}/leads/partner-enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Inquiry submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[500px] bg-white rounded-[40px] shadow-2xl overflow-hidden z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all z-20"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10">
              {isSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase italic">Inquiry Sent!</h3>
                  <p className="text-slate-500 font-bold italic">Our partnership team will contact you shortly.</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pd-pink/5 text-pd-pink rounded-full mb-4">
                      <Sparkles size={14} className="animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Quick Enquiry</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-1 leading-none italic uppercase">
                      Partner <span className="text-pd-purple">Enquiry</span>
                    </h2>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Complete the form to get started</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Full Name</label>
                        <div className="relative group">
                          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors" />
                          <input 
                            type="text" 
                            required
                            className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none italic"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Phone Number</label>
                        <div className="relative group">
                          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors" />
                          <input 
                            type="tel" 
                            required
                            className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none italic"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Email Address</label>
                      <div className="relative group">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors" />
                        <input 
                          type="email" 
                          required
                          className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none italic"
                          placeholder="Email"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Preferred Plan</label>
                      <div className="relative group">
                        <LayoutGrid size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors" />
                        <select 
                          className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl pl-12 pr-10 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none appearance-none cursor-pointer italic"
                          value={formData.plan}
                          onChange={e => setFormData({...formData, plan: e.target.value})}
                        >
                          {PLANS.map(p => (
                            <option key={p.id} value={p.label}>{p.label}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-pd-pink transition-colors" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Venue Name</label>
                        <div className="relative group">
                          <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors" />
                          <input 
                            type="text" 
                            className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none italic"
                            placeholder="Venue"
                            value={formData.venueName}
                            onChange={e => setFormData({...formData, venueName: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Pincode</label>
                        <div className="relative group">
                          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors" />
                          <input 
                            type="text" 
                            className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none italic"
                            placeholder="Pincode"
                            value={formData.pincode}
                            onChange={e => setFormData({...formData, pincode: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">City / Area</label>
                      <div className="relative group">
                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors" />
                        <input 
                          type="text" 
                          className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none italic"
                          placeholder="Select Area"
                          value={formData.city}
                          onChange={e => setFormData({...formData, city: e.target.value})}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-16 bg-gradient-to-r from-pd-pink to-blue-500 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] italic shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 mt-6 hover:shadow-pd-pink/20"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Submit Inquiry <Send size={18} /></>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(PartnerInquiryPopup);
