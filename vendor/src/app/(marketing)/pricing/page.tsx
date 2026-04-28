'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronDown, 
  HelpCircle, 
  Zap, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Building2, 
  BarChart3, 
  MessageSquare,
  ArrowRight,
  Star,
  Plus,
  Sparkle,
  CheckCircle2,
  ChevronRight,
  Eye,
  Loader2,
  MapPin
} from 'lucide-react';

// --- STYLES ---

const gradientStyle = "bg-gradient-to-r from-red-500 via-pink-500 via-purple-500 to-blue-500";
const textGradientStyle = "bg-gradient-to-r from-red-500 via-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent";

// --- DATA ---

const pricingPlans = [
  {
    id: 1,
    name: "Upto 50 PAX",
    packName: "Starter Pack",
    mrp: 14965,
    price: 12045,
    leads: "Unlimited Leads",
    features: [
      "Basic listing visibility",
      "Standard search placement",
      "Lead notifications (App + Email)",
      "Upload up to 10 photos",
      "Basic customer support"
    ],
    popular: false,
    cta: "Get Started"
  },
  {
    id: 2,
    name: "50–100 PAX",
    packName: "Growth Pack",
    mrp: 20075,
    price: 16060,
    leads: "Unlimited Leads",
    features: [
      "Improved listing visibility",
      "WhatsApp lead alerts",
      "Standard placement in search",
      "Upload up to 20 photos",
      "Basic analytics dashboard"
    ],
    popular: false,
    cta: "Get Started"
  },
  {
    id: 3,
    name: "100–200 PAX",
    packName: "Priority Pack",
    mrp: 35040,
    price: 28105,
    leads: "Unlimited Leads",
    features: [
      "Priority listing in search results",
      "WhatsApp notifications",
      "Lead insights dashboard",
      "Faster lead delivery",
      "Upload up to 30 photos"
    ],
    popular: true,
    cta: "Get Started"
  },
  {
    id: 4,
    name: "200–500 PAX",
    packName: "Featured Pack",
    mrp: 56940,
    price: 44895,
    leads: "Unlimited Leads",
    features: [
      "Featured placement in listings",
      "Priority visibility in search",
      "Lead filtering system",
      "Priority customer support",
      "Upload up to 40 photos"
    ],
    popular: false,
    cta: "Get Started"
  },
  {
    id: 5,
    name: "500–1000 PAX",
    packName: "Premium Pack",
    mrp: 79935,
    price: 65335,
    leads: "Unlimited Leads",
    features: [
      "Premium placement in listings",
      "High visibility ranking",
      "Faster lead routing",
      "Advanced performance analytics",
      "Upload up to 50 photos"
    ],
    popular: false,
    cta: "Get Started"
  },
  {
    id: 6,
    name: "1000–2000 PAX",
    packName: "Elite Pack",
    mrp: 109865,
    price: 90885,
    leads: "Unlimited Leads",
    features: [
      "Top city visibility",
      "Premium ranking placement",
      "Advanced lead analytics",
      "Priority lead routing",
      "Upload up to 60 photos"
    ],
    popular: false,
    cta: "Get Started"
  },
  {
    id: 7,
    name: "2000–5000 PAX",
    packName: "Platinum Pack",
    mrp: 179945,
    price: 138335,
    leads: "Unlimited Leads",
    features: [
      "High priority ranking",
      "Dedicated support assistance",
      "Premium listing visibility",
      "Advanced reporting dashboard",
      "Upload up to 75 photos"
    ],
    popular: false,
    cta: "Get Started"
  },
  {
    id: 8,
    name: "5000+ PAX",
    packName: "Enterprise Pack",
    mrp: 300030,
    price: 218635,
    leads: "Unlimited Leads",
    features: [
      "Exclusive lead priority",
      "Dedicated account manager",
      "Highest platform visibility",
      "Custom promotional support",
      "Unlimited photo uploads"
    ],
    popular: false,
    cta: "Contact Sales"
  }
];

const addonRates = [
  { pax: "Upto 50", price: 1999 },
  { pax: "50–100", price: 2999 },
  { pax: "100–200", price: 3999 },
  { pax: "200–500", price: 6999 },
  { pax: "500–1000", price: 9999 },
  { pax: "1000–2000", price: 14999 },
  { pax: "2000–5000", price: 19999 }
];

const faqs = [
  { 
    id: "01",
    question: "How do I list my venue?", 
    answer: "Listing is simple. Create your partner account, upload high-quality photos of your space, define your PAX capacity, and set your base pricing. Our team will verify your listing within 24 hours." 
  },
  { 
    id: "02",
    question: "How do I receive leads?", 
    answer: "Once listed, your venue appears in searches. When a customer shows interest, you'll get an instant WhatsApp notification and the lead will appear in your real-time dashboard." 
  },
  { 
    id: "03",
    question: "Can I update pricing?", 
    answer: "Yes, you have full control. You can update your pricing, seasonal rates, and availability at any time through your dedicated partner portal." 
  },
  { 
    id: "04",
    question: "Is there a listing fee?", 
    answer: "We offer various subscription plans. While there are premium visibility tiers, we ensure every partner gets value with verified leads and dedicated support." 
  }
];

const valueProps = [
  { title: "Verified customer leads", desc: "No more junk queries. Every lead is pre-filtered for quality.", icon: <ShieldCheck size={28} /> },
  { title: "Location-based targeting", desc: "Get inquiries from customers looking specifically in your city area.", icon: <Target size={28} /> },
  { title: "High conversion potential", desc: "Connect with high-intent users actively ready to book venues.", icon: <TrendingUp size={28} /> },
  { title: "Easy lead management", desc: "A sleek dashboard to track, manage, and close every event deal.", icon: <BarChart3 size={28} /> },
  { title: "Dedicated support", desc: "Our success team is here to help you grow your venue revenue.", icon: <Users size={28} /> }
];

// --- COMPONENTS ---

const GridBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
    <div 
      className="absolute inset-0 opacity-[0.03]" 
      style={{ 
        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}
    ></div>
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent"></div>
  </div>
);

const InquiryPopup = React.memo(({ plan, isOpen, onClose }: { plan: typeof pricingPlans[0] | null, isOpen: boolean, onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    venueName: '',
    city: '',
    pincode: '',
    selectedPlanId: plan?.id || pricingPlans[0].id
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Pincode/Location states
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);

  useEffect(() => {
    if (plan) {
      setFormData(prev => ({ ...prev, selectedPlanId: plan.id }));
    }
  }, [plan]);

  // Indian Post API Auto-suggest
  useEffect(() => {
    const fetchPincode = async () => {
      const input = formData.pincode.trim();
      if (input.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoadingPincode(true);
      try {
        const url = /^\d+$/.test(input) 
          ? `https://api.postalpincode.in/pincode/${input}`
          : `https://api.postalpincode.in/postoffice/${input}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data[0].Status === 'Success') {
          const offices = data[0].PostOffice;
          setSuggestions(offices.map((o: any) => ({
            display: `${o.Name}, ${o.District}`,
            city: o.Name,
            district: o.District,
            pincode: o.Pincode
          })).slice(0, 5));
        } else {
          setSuggestions([]);
        }
      } catch (e) {
        console.error('Pincode fetch error:', e);
      } finally {
        setIsLoadingPincode(false);
      }
    };

    const timer = setTimeout(fetchPincode, 400);
    return () => clearTimeout(timer);
  }, [formData.pincode]);

  const selectPincode = (suggestion: any) => {
    setFormData(prev => ({ 
      ...prev, 
      pincode: suggestion.pincode, 
      city: `${suggestion.city}, ${suggestion.district}` 
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const selectedPlan = pricingPlans.find(p => p.id === formData.selectedPlanId);
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
      const serverUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

      const response = await fetch(`${serverUrl}/leads/partner-enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          plan: selectedPlan ? `${selectedPlan.name} (${selectedPlan.packName})` : 'Custom',
          venueName: formData.venueName,
          city: formData.city,
          pincode: formData.pincode,
          guestCapacity: selectedPlan?.name.split(' ')[0] || '0'
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Internal error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0 }}
        className="relative w-full max-w-lg bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl will-change-transform"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        
        <button 
           onClick={onClose} 
           className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all z-20"
        >
          <Plus className="rotate-45" size={20} />
        </button>

        {!isSubmitted ? (
          <div className="relative z-10 text-left">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 rounded-full text-pink-500 text-[10px] font-black uppercase tracking-widest mb-3 border border-pink-100">
                <Sparkle size={10} fill="currentColor" /> Quick Enquiry
              </div>
              <h2 className="text-2xl font-[900] text-slate-900 tracking-tight leading-none uppercase italic">Partner <span className="text-pd-purple">Enquiry</span></h2>
              <p className="mt-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest leading-none">Complete the form to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                  <input 
                    required 
                    type="tel" 
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <input 
                  required 
                  type="email" 
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Preferred Plan</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none appearance-none cursor-pointer pr-10"
                    value={formData.selectedPlanId}
                    onChange={(e) => setFormData(prev => ({ ...prev, selectedPlanId: parseInt(e.target.value) }))}
                  >
                    {pricingPlans.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.packName})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Venue Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Orchid Grand"
                    value={formData.venueName}
                    onChange={(e) => setFormData(prev => ({ ...prev, venueName: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none"
                  />
                </div>

                <div className="group space-y-1 relative">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Pincode</label>
                  <div className="relative">
                    <input 
                      required 
                      type="text" 
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, pincode: e.target.value }));
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      autoComplete="off"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none"
                    />
                    {isLoadingPincode && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-pd-pink" size={14} />}
                    
                    <AnimatePresence>
                      {showSuggestions && suggestions.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 right-0 top-[110%] bg-white border border-slate-100 rounded-2xl shadow-2xl z-[120] max-h-60 overflow-y-auto p-1 custom-scrollbar"
                        >
                          {suggestions.map((s, idx) => (
                            <button 
                              key={idx}
                              type="button"
                              onClick={() => selectPincode(s)}
                              className="w-full text-left px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-pd-pink transition-all rounded-xl flex items-center gap-2"
                            >
                              <MapPin size={10} /> {s.display} ({s.pincode})
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">City / Area</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Select area from pincode"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none"
                />
              </div>

              <button 
                disabled={isSubmitting}
                className={`w-full mt-4 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg text-white ${gradientStyle} hover:translate-y-[-2px] active:translate-y-[0] disabled:opacity-70 disabled:grayscale`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic mb-2">Success!</h2>
            <p className="text-slate-500 text-xs font-bold leading-relaxed px-4">
              Our team will reach out to you within <span className="text-pink-600">4 working hours</span>.
            </p>
            <button 
              onClick={onClose}
              className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
});

InquiryPopup.displayName = 'InquiryPopup';

const PricingCard = React.memo(({ plan, onSelect }: { plan: typeof pricingPlans[0], onSelect: (plan: typeof pricingPlans[0]) => void }) => {
  const discount = Math.round(((plan.mrp - plan.price) / plan.mrp) * 100);
  
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`relative h-full ${plan.popular ? 'scale-105 z-10' : ''}`}
    >
      <div className={`h-full flex flex-col p-8 rounded-[32px] bg-white relative ${plan.popular ? 'shadow-2xl shadow-pink-500/20' : 'border border-slate-100 shadow-sm hover:shadow-xl'}`}>
        {plan.popular && (
          <div className={`absolute -inset-[2px] rounded-[34px] -z-10 ${gradientStyle}`}></div>
        )}

        <div className="absolute top-6 right-6">
          <span className={`${gradientStyle} text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg`}>
            Save {discount}%
          </span>
        </div>

        <div className="mb-8 overflow-visible">
          {plan.popular && (
            <div className="flex items-center gap-1.5 text-pink-600 font-bold text-[10px] uppercase tracking-widest mb-3">
               <Star size={12} fill="currentColor" /> MOST POPULAR
            </div>
          )}
            <div className="flex flex-col mb-4">
               <h3 className="text-xl font-[900] text-slate-900 leading-tight tracking-tight uppercase italic">{plan.name}</h3>
               <span className="text-[10px] font-black text-pd-purple uppercase tracking-[0.2em] mt-1">{plan.packName}</span>
            </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-400 line-through font-medium leading-none">₹{Math.round(plan.mrp / 365).toLocaleString()}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tighter">₹{Math.round(plan.price / 365).toLocaleString()}</span>
              <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">/ day</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Billed Annually</p>
          </div>
        </div>

        <div className="mb-8 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap size={14} className="text-pink-500 fill-pink-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Lead Capacity</span>
          </div>
          <p className="text-xl font-black bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">{plan.leads}</p>
        </div>

        <div className="flex-grow space-y-4 mb-10">
          {plan.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-pink-50 text-pink-500' : 'bg-slate-50 text-slate-400'}`}>
                <Check size={12} strokeWidth={3} />
              </div>
              <span className="text-sm font-medium text-slate-600 leading-tight">{feature}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => onSelect(plan)}
          className={`w-full py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
            plan.popular 
              ? `${gradientStyle} text-white shadow-lg shadow-pink-500/20 hover:scale-[1.02] hover:shadow-pink-500/40`
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {plan.cta}
        </button>
      </div>
    </motion.div>
  );
});

PricingCard.displayName = 'PricingCard';

const FaqItem = React.memo(({ item }: { item: typeof faqs[0] }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`border border-slate-100 rounded-[32px] overflow-hidden bg-white transition-all duration-300 ${isOpen ? 'shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100' : 'hover:shadow-lg'}`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 md:p-9 text-left flex items-center justify-between group"
      >
        <div className="flex items-center gap-4 md:gap-8">
          <span className="text-slate-300 font-bold text-[10px] md:text-xs tracking-tighter shrink-0">{item.id}</span>
          <span className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-tight group-hover:text-pink-600 transition-colors">
            {item.question}
          </span>
        </div>
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${isOpen ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
          <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-9 pb-8 md:pb-12 pt-0 ml-11 md:ml-20 text-slate-500 text-base md:text-xl font-medium leading-relaxed max-w-2xl">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

FaqItem.displayName = 'FaqItem';

export default function PricingPage() {
  const [selectedAddon, setSelectedAddon] = useState<number | null>(null);
  const [inquiryPlan, setInquiryPlan] = useState<typeof pricingPlans[0] | null>(null);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 selection:bg-pink-500 selection:text-white font-sans antialiased">
      
      <AnimatePresence>
        {inquiryPlan && (
          <InquiryPopup 
            plan={inquiryPlan} 
            isOpen={!!inquiryPlan} 
            onClose={() => setInquiryPlan(null)} 
          />
        )}
      </AnimatePresence>

      {/* 1. BRAND-ALIGNED COMPARE HERO */}
      <section className="relative py-8 bg-white overflow-hidden border-b border-slate-50">
        <GridBackground />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex flex-col items-center justify-center gap-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 rounded-full text-pink-500 text-[10px] font-black uppercase tracking-[0.2em] border border-pink-100">
                  <Zap size={12} className="fill-current text-pink-500" /> Grow Your Wedding & Event Business
               </div>
               
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-[900] text-[#0F172A] flex flex-col items-center justify-center gap-2 md:gap-4 mb-8 tracking-tighter uppercase leading-[1.1]">
               <span className="text-center">Advertise Your Venue</span>
               <div className="flex items-center justify-center gap-3 md:gap-6 mt-2">
                  <span className="text-xl md:text-4xl font-black text-slate-300 italic lowercase tracking-tight">on</span> 
                  <span className="pd-logo text-3xl md:text-6xl lg:text-8xl">PartyDial</span>
               </div>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 font-bold mb-8 max-w-4xl mx-auto leading-relaxed">
              India&apos;s No.1 Local Search Engine for Event Venues. Join thousands of partners getting direct leads and high-quality inquiries every day.
            </p>

            <div className="flex justify-center">
               <button 
                 onClick={() => setInquiryPlan(pricingPlans[2])}
                 className={`${gradientStyle} text-white px-14 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl shadow-pink-500/20 hover:scale-[1.05] active:scale-95`}
               >
                  Start Getting Enquiries
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. PRICING SECTION (MAIN) */}
      <section className="py-24 px-6 lg:px-12 relative overflow-hidden bg-slate-50">
        {/* Decorative elements from image */}
        <div className="absolute top-10 left-10 opacity-40 transform -rotate-12">
          <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20C10 10 20 10 30 20C40 30 50 30 60 20C70 10 80 10 90 20" stroke="#f43f5e" strokeWidth="4" />
            <path d="M0 30C10 20 20 20 30 30C40 40 50 40 60 30C70 20 80 20 90 30" stroke="#8b5cf6" strokeWidth="4" />
          </svg>
        </div>
        <div className="absolute bottom-10 right-10 opacity-40">
           <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20C10 10 20 10 30 20C40 30 50 30 60 20C70 10 80 10 90 20" stroke="#f43f5e" strokeWidth="4" />
            <path d="M0 30C10 20 20 20 30 30C40 40 50 40 60 30C70 20 80 20 90 30" stroke="#8b5cf6" strokeWidth="4" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight uppercase italic">Pricing</h2>
          <p className="text-slate-500 font-bold text-lg">(According to Pax, you serve)</p>
        </div>

        <div className="max-w-[1440px] mx-auto relative px-4">
          {/* Side Arrows from image */}
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 hidden xl:block text-slate-200">
             <ChevronRight className="rotate-180" size={48} strokeWidth={3} />
             <ChevronRight className="rotate-180 -mt-8" size={48} strokeWidth={3} />
          </div>
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden xl:block text-slate-200">
             <ChevronRight size={48} strokeWidth={3} />
             <ChevronRight className="-mt-8" size={48} strokeWidth={3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} onSelect={setInquiryPlan} />
            ))}
          </div>
        </div>

        {/* ADD-ON RATES SECTION */}
        <div className="max-w-4xl mx-auto mt-24 italic">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="bg-slate-950 rounded-[40px] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-pd-pink/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full -translate-x-1/4 translate-y-1/4"></div>

               <div className="relative z-10 text-center mb-12">
                  <span className="text-pink-500 text-[10px] font-black tracking-[0.3em] uppercase block mb-4">Extra Coverage</span>
                  <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">Add-On <span className={textGradientStyle}>Rates</span></h2>
                  <p className="mt-4 text-slate-400 font-bold max-w-lg mx-auto text-sm md:text-base italic">Boost your visibility with specialized expansion packs tailored to your pax capacity.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  {addonRates.map((addon, i) => (
                     <button 
                        key={i} 
                        onClick={() => setSelectedAddon(selectedAddon === i ? null : i)}
                        className={`flex items-center justify-between p-6 rounded-2xl transition-all group text-left relative overflow-hidden ${
                           selectedAddon === i 
                              ? 'bg-white/10 border-2 border-pd-pink shadow-[0_0_30px_rgba(255,65,94,0.1)]' 
                              : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                     >
                        {selectedAddon === i && (
                           <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 text-pd-pink"
                           >
                              <CheckCircle2 size={16} fill="currentColor" className="text-white" />
                           </motion.div>
                        )}
                        <div className="flex flex-col">
                           <span className={`text-[10px] font-black uppercase tracking-widest mb-1 transition-colors ${selectedAddon === i ? 'text-pd-pink' : 'text-slate-500'}`}>PAX Capacity</span>
                           <span className="text-base font-black text-white italic">{addon.pax} Guests</span>
                        </div>
                        <div className="text-right">
                           <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-1 block">Price</span>
                           <span className="text-2xl font-black text-white italic tracking-tight">₹{addon.price.toLocaleString()}</span>
                        </div>
                     </button>
                  ))}
               </div>
               <button className={`w-full mt-10 p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  selectedAddon !== null 
                     ? `${gradientStyle} text-white shadow-xl shadow-pink-500/20 hover:scale-[1.02]` 
                     : 'bg-white text-slate-950 hover:bg-slate-50'
               }`}>
                  {selectedAddon !== null 
                     ? `Activate ${addonRates[selectedAddon].pax} Add-on` 
                     : 'Select An Add-on Extension'
                  }
               </button>
            </motion.div>
        </div>
      </section>

      {/* 3. GOALS SECTION: HELP YOU ACHIEVE YOUR GOALS */}
      <section className="py-16 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-12">
             <h2 className="text-4xl md:text-5xl font-[900] text-[#0F172A] uppercase tracking-tighter mb-4 flex items-center justify-center gap-4">
                Help You Achieve 
                <span className="pd-logo text-3xl md:text-5xl">PartyDial</span> 
                Goals
             </h2>
             <p className="text-lg text-slate-500 font-bold max-w-2xl mx-auto">
                Our platform is designed with one mission: to transform your venue into a lead-generation machine.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {[
                {
                   icon: <Eye size={32} className="text-pink-500" />,
                   title: "Dominant Visibility",
                   desc: "Get seen by 1.8Cr+ active buyers specifically searching for premium venues in your city."
                },
                {
                   icon: <Zap size={32} className="text-purple-500" />,
                   title: "Instant Conversion",
                   desc: "Verified high-intent inquiries delivered via SMS & Dashboard for immediate response."
                },
                {
                   icon: <ShieldCheck size={32} className="text-blue-500" />,
                   title: "Elite Brand Trust",
                   desc: "Earn the official 'Verified Partner' badge to build instant credibility with every search."
                }
             ].map((goal, idx) => (
                <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                   className="p-10 bg-white rounded-[40px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group"
                >
                   <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
                      {goal.icon}
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{goal.title}</h3>
                   <p className="text-slate-500 font-bold leading-relaxed">{goal.desc}</p>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. PLATFORM FEATURES SECTION */}
      <section className="py-16 bg-white border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12 uppercase">
             <span className="text-blue-500 text-[11px] font-black tracking-[0.4em] block mb-2">Capabilities</span>
             <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight tracking-tight">Platform Features</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 1, title: "Unlimited Leads", desc: "No caps or limits. Receive every single inquiry that matches your venue's capacity and location.", icon: <Zap className="text-yellow-500" /> },
              { id: 2, title: "WhatsApp Direct", desc: "Get instantly notified on WhatsApp the moment a customer submits an inquiry. Connect in seconds.", icon: <MessageSquare className="text-emerald-500" /> },
              { id: 3, title: "Advanced Analytics", desc: "Monitor profile views, lead conversion rates, and seasonal trends with our comprehensive dashboard.", icon: <BarChart3 className="text-blue-500" /> },
              { id: 4, title: "Priority Verification", desc: "Every inquiry is pre-verified with OTP and intent checks to ensure you only speak with serious bookers.", icon: <ShieldCheck className="text-pink-500" /> },
              { id: 5, title: "Featured Listings", desc: "Appear at the top of search results in your city area to capture the maximum volume of customer traffic.", icon: <Target className="text-purple-500" /> },
              { id: 6, title: "Dedicated Support", desc: "Premium plans include a dedicated success manager to help optimize your profile and boost your closure rates.", icon: <Users className="text-orange-500" /> },
            ].map((feature, i) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 hover:border-pink-200 hover:bg-white hover:shadow-2xl hover:shadow-pink-500/5 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {React.cloneElement(feature.icon as React.ReactElement<any>, { size: 28 })}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VALUE SECTION */}
      <section className="py-16 md:py-24 px-6 lg:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 uppercase flex flex-col md:flex-row items-center justify-center gap-4">
             <h2 className="text-3xl md:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-none italic uppercase">Why Choose</h2>
             <span className="pd-logo text-4xl md:text-7xl">PartyDial</span>
             <span className="text-3xl md:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-none italic uppercase">?</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {valueProps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-xl transition-all"
              >
                <div className={`${gradientStyle} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-4">{item.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION (OPTIMIZED) */}
      <section className="py-24 md:py-40 px-6 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -z-10 translate-x-1/2 rounded-full blur-3xl opacity-50"></div>
        
         <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.5fr] gap-16 md:gap-24 items-start">
               
               {/* Left Column: Info & CTA */}
               <div className="lg:sticky lg:top-24">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-50 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-slate-100">
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></span>
                       Knowledge Base
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-[900] text-[#0F172A] leading-[1.0] tracking-[-0.04em] uppercase mb-8">
                       Curious <br /> About <br /> <span className={textGradientStyle}>Growth?</span>
                    </h2>
                    
                    <p className="text-base md:text-lg text-slate-500 font-bold max-w-sm mb-12 leading-relaxed">
                       Everything you need to know about the most powerful event engine in the country.
                    </p>

                    {/* Doubts Card */}
                    <div className="max-w-md relative group">
                       <div className="absolute -inset-1 bg-gradient-to-r from-slate-900 to-slate-800 rounded-[36px] blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
                       <div className="relative bg-slate-950 rounded-[24px] p-8 overflow-hidden shadow-2xl">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[60px] rounded-full -translate-y-12 translate-x-12"></div>
                          
                          <h4 className="text-white text-[9px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2 opacity-80">
                             Still Have Doubts?
                          </h4>
                          
                          <p className="text-slate-400 text-xs md:text-sm font-bold leading-relaxed mb-8 pr-4">
                             Our partner success team is available 24/7 to help you dominate your city.
                          </p>
                          
                          <Link href="/contact">
                             <button className="bg-[#FF415E] text-white px-8 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#E63955] transition-all hover:scale-[1.03] active:scale-[0.98] shadow-xl shadow-pink-500/30">
                                Get Expert Help
                             </button>
                          </Link>
                       </div>
                    </div>
                  </motion.div>
               </div>

               {/* Right Column: FAQ Items */}
               <div className="space-y-6 md:space-y-8">
                  {faqs.map((faq, i) => (
                    <FaqItem key={i} item={faq} />
                  ))}
               </div>

            </div>
         </div>
      </section>

    </div>
  );
}
