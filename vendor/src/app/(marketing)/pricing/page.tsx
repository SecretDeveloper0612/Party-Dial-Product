'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { account, databases, DATABASE_ID, VENUES_COLLECTION_ID, Query } from '@/lib/appwrite';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Zap, 
  Sparkle, 
  CheckCircle2, 
  Loader2, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  PhoneCall, 
  TrendingUp, 
  ArrowRight
} from 'lucide-react';

// --- SUBSCRIPTION MODEL ---
export type BillingDuration = 'monthly' | 'halfYearly' | 'annually';

export interface PlanDurationOption {
  id: string;
  duration: BillingDuration;
  name: string;
  subtitle: string;
  badge?: string;
  periodLabel: string;
  monthlyMrp: number;
  monthlyRate: number;      // Base price per month before GST
  baseTotalPrice: number;   // Base total before GST
  gstAmount: number;        // 18% GST amount
  totalWithGst: number;     // Final payable amount
  totalMrp: number;
  savingsPercent: number;
  totalSavings: number;
  billedText: string;
  isPopular?: boolean;
  isVip?: boolean;
  ctaText: string;
  features: string[];
}

const subscriptionTiers: PlanDurationOption[] = [
  {
    id: 'monthly',
    duration: 'monthly',
    name: 'Monthly Plan',
    subtitle: 'Flexible month-to-month listing commitment',
    badge: 'Flexible • 1 Month',
    periodLabel: '1 Month',
    monthlyMrp: 7999,
    monthlyRate: 5999,
    baseTotalPrice: 5999,
    gstAmount: 1080,         // Math.round(5999 * 0.18) = 1080
    totalWithGst: 7079,     // 5999 + 1080 = 7079
    totalMrp: 7999,
    savingsPercent: 25,
    totalSavings: 2000,
    billedText: 'Base ₹5,999 + 18% GST (₹1,080) = ₹7,079/mo',
    ctaText: 'Get Started Monthly',
    features: [
      'Unlimited Customer Inquiries',
      'Instant Email Lead Alerts',
      'Complete Venue Profile & Media Showcase',
      'Standard City Search Placement',
      'Lead CRM & Status Pipeline',
      'Quotation & Digital Invoice Maker',
      'Venue Event Booking Calendar',
      'Standard Email & Chat Support'
    ]
  },
  {
    id: 'halfYearly',
    duration: 'halfYearly',
    name: 'Half-Yearly Plan',
    subtitle: 'Prime wedding & peak celebration seasons',
    badge: '★ Most Popular • 6 Months',
    periodLabel: '6 Months',
    monthlyMrp: 7999,
    monthlyRate: 3500,
    baseTotalPrice: 21000,   // 3500 * 6
    gstAmount: 3780,        // 21000 * 0.18
    totalWithGst: 24780,    // 21000 + 3780
    totalMrp: 47994,
    savingsPercent: 56,
    totalSavings: 26994,
    billedText: 'Base ₹21,000 + 18% GST (₹3,780) = ₹24,780 for 6 Mo',
    isPopular: true,
    ctaText: 'Claim 6-Month Plan',
    features: [
      'Unlimited Customer Inquiries',
      'Instant Email Lead Alerts',
      'Priority Lead Dispatch Algorithm',
      'High Category & City Search Placement',
      'Lead CRM & Status Pipeline',
      'Quotation & PDF Invoice Generator',
      'Official Verified Partner Badge',
      'Priority Partner Phone Support'
    ]
  },
  {
    id: 'annually',
    duration: 'annually',
    name: 'Annual Plan',
    subtitle: 'Top city ranking & maximum yearly bookings',
    badge: '👑 Best Value • Save 62%',
    periodLabel: '12 Months',
    monthlyMrp: 7999,
    monthlyRate: 3000,
    baseTotalPrice: 36000,   // 3000 * 12
    gstAmount: 6480,        // 36000 * 0.18
    totalWithGst: 42480,    // 36000 + 6480
    totalMrp: 95988,
    savingsPercent: 62,
    totalSavings: 59988,
    billedText: 'Base ₹36,000 + 18% GST (₹6,480) = ₹42,480 / Year',
    isVip: true,
    ctaText: 'Unlock Annual Access',
    features: [
      'Everything in Half-Yearly Plan',
      'Guaranteed Lowest Rate (₹3,000/mo)',
      'Save ₹59,988 compared to Monthly MRP',
      'Top-Tier Search Ranking & Featured Spotlight',
      'Dedicated Partner Growth Manager',
      'Citywide Venue & Social Media Promotion',
      'Unlimited Photo & Video Uploads',
      '24/7 Priority VIP Phone & Email Support'
    ]
  }
];

const coreHighlights = [
  {
    title: 'Zero Commission Fees',
    desc: 'Keep 100% of your booking revenues. We never charge commission on food or rentals.',
    icon: ShieldCheck
  },
  {
    title: 'Verified Phone Numbers',
    desc: 'Every client inquiry is validated with OTP verification to eliminate fake leads.',
    icon: PhoneCall
  },
  {
    title: 'Instant Email Lead Alerts',
    desc: 'Receive customer inquiries directly to your registered inbox the moment they are submitted.',
    icon: Zap
  },
  {
    title: 'Interactive Quotation Maker',
    desc: 'Send customized event quotes with menu packages and GST directly to clients.',
    icon: FileText
  }
];

// --- INQUIRY POPUP COMPONENT ---
const InquiryPopup = React.memo(({ 
  plan, 
  onClose 
}: { 
  plan: PlanDurationOption | null; 
  onClose: () => void; 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    venueName: '',
    city: '',
    pincode: '',
    selectedPlanId: plan?.id || 'annually'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [suggestions, setSuggestions] = useState<{display: string, city: string, district: string, pincode: string}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);

  useEffect(() => {
    if (plan) {
      setFormData(prev => ({ ...prev, selectedPlanId: plan.id }));
    }
  }, [plan]);

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

        if (data[0]?.Status === 'Success') {
          const offices = data[0].PostOffice || [];
          setSuggestions(offices.map((o: { Name: string, District: string, Pincode: string }) => ({
            display: `${o.Name}, ${o.District}`,
            city: o.Name,
            district: o.District,
            pincode: o.Pincode
          })).slice(0, 5));
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Pincode fetch error:', err);
      } finally {
        setIsLoadingPincode(false);
      }
    };

    const timer = setTimeout(fetchPincode, 400);
    return () => clearTimeout(timer);
  }, [formData.pincode]);

  const selectPincode = (suggestion: { city: string, district: string, pincode: string }) => {
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
      const selectedPlan = subscriptionTiers.find(p => p.id === formData.selectedPlanId) || plan;
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5005/api';
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
          plan: selectedPlan ? `Partner Pro (${selectedPlan.name}) - ${selectedPlan.billedText}` : 'Partner Pro Membership',
          venueName: formData.venueName,
          city: formData.city,
          pincode: formData.pincode,
          guestCapacity: 'All Capacities'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
        >
          ✕
        </button>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Inquiry Received!</h3>
            <p className="text-slate-500 text-sm mb-6">
              Our partner relationship manager will contact you within 2 hours to activate your venue account.
            </p>
            <button 
              onClick={onClose}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-slate-800 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-semibold font-pd uppercase tracking-widest text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                VENDOR CONSULTATION
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold font-sf text-slate-900 mt-2.5 tracking-tight">
                Partner Pro Consultation
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm font-normal font-pd mt-1">
                Interested in {plan?.name || 'Partner Pro'}? Send us your venue details and our growth team will connect with you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-pd">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Selected Duration
                </label>
                <select
                  value={formData.selectedPlanId}
                  onChange={(e) => setFormData(prev => ({ ...prev, selectedPlanId: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal text-slate-900 focus:outline-none focus:border-pink-500"
                >
                  {subscriptionTiers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.monthlyRate.toLocaleString()}/mo + 18% GST ({p.billedText})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contact@myvenue.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Venue / Banquet Name</label>
                <input
                  type="text"
                  required
                  value={formData.venueName}
                  onChange={(e) => setFormData(prev => ({ ...prev, venueName: e.target.value }))}
                  placeholder="e.g. Royal Greens Banquet & Lawn"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Pincode</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, pincode: e.target.value }));
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="e.g. 110001"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-pink-500"
                    />
                    {isLoadingPincode && (
                      <Loader2 size={16} className="animate-spin text-slate-400 absolute right-3 top-3" />
                    )}
                  </div>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                      {suggestions.map((s, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectPincode(s)}
                          className="px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer flex items-center gap-1.5 border-b border-slate-100 last:border-0"
                        >
                          <MapPin size={12} className="text-pink-500" />
                          <span>{s.display} ({s.pincode})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g. New Delhi"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl text-xs font-semibold font-pd uppercase tracking-wider text-white shadow-lg shadow-pink-500/25 bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
});

InquiryPopup.displayName = 'InquiryPopup';

// --- MAIN PRICING PAGE ---
export default function PricingPage() {
  const [inquiryPlan, setInquiryPlan] = useState<PlanDurationOption | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const router = useRouter();

  const handleBuyNow = (plan: PlanDurationOption) => {
    router.push(`/checkout?plan=${plan.duration}`);
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-slate-900 selection:bg-pink-500 selection:text-white font-pd antialiased">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <AnimatePresence>
        {inquiryPlan && (
          <InquiryPopup 
            plan={inquiryPlan} 
            onClose={() => setInquiryPlan(null)} 
          />
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="pt-32 pb-14 md:pt-40 md:pb-16 px-6 lg:px-12 relative overflow-hidden">
        {/* Soft Ambient Radiance */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-pink-500/10 via-purple-500/5 to-transparent blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm text-slate-600 text-[11px] font-semibold font-pd uppercase tracking-widest mb-6"
          >
            <Sparkle size={12} className="text-pd-pink fill-pd-pink" />
            <span>PARTYDIAL PARTNER PLANS</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[52px] font-semibold font-pd text-slate-900 tracking-tight leading-[1.12] max-w-4xl mx-auto"
          >
            Simple, Transparent Pricing. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-600 to-purple-600">
              Zero Booking Commission.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-slate-600 text-sm sm:text-base lg:text-lg font-normal font-pd max-w-2xl mx-auto leading-relaxed"
          >
            Connect with verified event hosts in your city. Direct email lead alerts, smart booking CRM, and zero commission on venue bookings.
          </motion.p>
        </div>
      </section>

      {/* 3 PRICING CARDS (SIDE BY SIDE - NO REDUNDANT TOGGLE) */}
      <section className="pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {subscriptionTiers.map((tier) => {
            return (
              <motion.div
                key={tier.id}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`relative rounded-3xl flex flex-col justify-between transition-all duration-300 bg-white text-slate-900 ${
                  tier.isVip 
                    ? 'border-2 border-purple-600 shadow-[0_20px_50px_-12px_rgba(147,51,234,0.22)] lg:-translate-y-2'
                    : tier.isPopular
                    ? 'border-2 border-pink-500 shadow-[0_20px_50px_-12px_rgba(236,72,153,0.22)] lg:-translate-y-2'
                    : 'border border-slate-200/90 shadow-xl'
                } p-7 sm:p-9`}
              >
                {/* Floating Top Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                    <span className={`text-[10px] font-semibold font-pd uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm ${
                      tier.isVip
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/25'
                        : tier.isPopular
                        ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white shadow-pink-500/25'
                        : 'bg-slate-800 text-white'
                    }`}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Card Header with Flawless Alignment */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-semibold font-pd uppercase tracking-widest text-slate-400">
                        {tier.periodLabel} Commitment
                      </span>
                      <span className={`text-[10px] font-semibold font-pd uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                        tier.isVip
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : tier.isPopular
                          ? 'bg-pink-50 text-pink-700 border-pink-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        Save {tier.savingsPercent}%
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl lg:text-[26px] font-semibold font-sf tracking-tight text-slate-900 leading-tight">
                      {tier.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-normal font-pd mt-1 leading-snug min-h-[20px]">
                      {tier.subtitle}
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className={`my-5 p-5 sm:p-6 rounded-2xl border transition-colors ${
                    tier.isVip 
                      ? 'bg-purple-50/40 border-purple-100' 
                      : tier.isPopular
                      ? 'bg-pink-50/40 border-pink-100'
                      : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-normal font-pd text-slate-400">
                        Base MRP:
                      </span>
                      <span className="text-xs font-normal font-pd line-through decoration-rose-500 decoration-2 text-slate-400">
                        ₹{tier.monthlyMrp.toLocaleString()}/mo
                      </span>
                    </div>

                    <div className="flex items-baseline flex-wrap gap-2">
                      <span className="text-3xl sm:text-4xl lg:text-[42px] font-semibold font-sf tracking-tight text-slate-950">
                        ₹{tier.monthlyRate.toLocaleString()}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold font-pd uppercase tracking-wider text-slate-500">
                          / month
                        </span>
                        <span className={`text-[10px] font-semibold font-pd uppercase tracking-wider ${
                          tier.isVip ? 'text-purple-600' : tier.isPopular ? 'text-pink-600' : 'text-slate-500'
                        }`}>
                          + 18% GST Extra
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Guaranteed Feature Callout */}
                  <div className={`mb-6 flex items-center gap-2.5 p-3 rounded-xl border ${
                    tier.isVip 
                      ? 'bg-purple-50 border-purple-200/70 text-purple-900' 
                      : tier.isPopular
                      ? 'bg-pink-50 border-pink-200/70 text-pink-900'
                      : 'bg-emerald-50 border-emerald-200/70 text-emerald-900'
                  }`}>
                    <Zap size={14} className={`shrink-0 fill-current ${
                      tier.isVip ? 'text-purple-600' : tier.isPopular ? 'text-pink-600' : 'text-emerald-600'
                    }`} />
                    <span className="text-xs font-semibold font-pd leading-tight">
                      Unlimited Verified Leads Included
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <p className="text-[10px] font-semibold font-pd uppercase tracking-widest text-slate-400">
                      What's Included:
                    </p>
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          tier.isVip 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span className="font-normal font-pd leading-snug text-slate-700">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="space-y-3 pt-5 border-t border-slate-100 mt-auto">
                  <button
                    onClick={() => handleBuyNow(tier)}
                    disabled={isProcessingOrder}
                    className={`w-full py-3.5 rounded-xl text-xs font-semibold font-pd uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-md text-white ${
                      tier.isVip
                        ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 shadow-purple-500/25'
                        : tier.isPopular
                        ? 'bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 hover:opacity-95 shadow-pink-500/25'
                        : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={() => setInquiryPlan(tier)}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold font-pd uppercase tracking-wider transition-colors cursor-pointer border bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Contact Sales
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="py-20 px-6 lg:px-12 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-semibold font-pd uppercase tracking-widest text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
              WHY VENUES CHOOSE PARTYDIAL
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-pd text-slate-900 tracking-tight leading-tight mt-3">
              Built for Every Venue — From Cafes & Lounges to Luxury Resorts
            </h2>
            <p className="mt-3 text-slate-600 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto font-normal font-pd leading-relaxed">
              Whether you host intimate café birthdays, corporate dinners, banquet weddings, or grand resort celebrations — get direct customer leads with zero commissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreHighlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div 
                  key={i} 
                  className="p-6 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 hover:border-pink-300 hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-5 group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-pink-600 group-hover:text-white transition-all shadow-xs">
                    <Icon size={22} />
                  </div>
                  <h4 className="text-base font-semibold font-sf text-slate-900 tracking-tight mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs font-normal font-pd text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ROI SHOWCASE BANNER (PREMIUM BENTO AESTHETIC MATCHING HOMEPAGE) */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-slate-50/70 border border-slate-200/90 p-5 sm:p-8 lg:p-14 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300">
          {/* Subtle Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-pink-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/10 via-emerald-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-slate-700 text-[9px] sm:text-[10px] font-semibold font-pd uppercase tracking-widest mb-4">
                <TrendingUp size={13} className="text-pd-pink" />
                <span>HIGH RETURN ON INVESTMENT</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-[32px] font-semibold font-sf text-slate-900 tracking-tight leading-[1.2] mb-3">
                One Single Booking Pays for <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pd-pink via-purple-600 to-pd-blue">
                  1 to 3 Years of Membership
                </span>
              </h3>

              <p className="text-xs sm:text-sm lg:text-[15px] text-slate-600 font-normal font-pd leading-relaxed max-w-xl">
                With typical event profits ranging from ₹15,000 for private parties to ₹1,50,000+ for grand celebrations, closing just one customer booking through PartyDial easily covers your entire subscription investment.
              </p>

              {/* Metric Highlights Pill Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-6 pt-6 border-t border-slate-200/70">
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
                  <p className="text-[9px] sm:text-[10px] font-semibold font-pd uppercase tracking-widest text-slate-400">Avg. Profit / Event</p>
                  <p className="text-sm sm:text-base lg:text-lg font-semibold font-sf text-slate-900 mt-0.5">₹25,000+</p>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
                  <p className="text-[9px] sm:text-[10px] font-semibold font-pd uppercase tracking-widest text-slate-400">Annual Base Rate</p>
                  <p className="text-sm sm:text-base lg:text-lg font-semibold font-sf text-emerald-600 mt-0.5">₹3,000/mo</p>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs col-span-2 sm:col-span-1">
                  <p className="text-[9px] sm:text-[10px] font-semibold font-pd uppercase tracking-widest text-slate-400">Platform Commission</p>
                  <p className="text-sm sm:text-base lg:text-lg font-semibold font-sf text-pink-600 mt-0.5">Zero (0%)</p>
                </div>
              </div>
            </div>

            {/* Right Card / CTA Action */}
            <div className="lg:col-span-5 flex flex-col items-stretch">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-md flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] font-semibold font-pd uppercase tracking-widest text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                    👑 Recommended Value
                  </span>
                  <span className="text-xs font-semibold font-pd text-emerald-600">
                    Save 62%
                  </span>
                </div>

                <div>
                  <div className="text-sm font-semibold font-sf text-slate-900">Partner Pro Annual Plan</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-semibold font-sf text-slate-950">₹3,000</span>
                    <span className="text-xs font-normal font-pd text-slate-400">/ month + 18% GST</span>
                  </div>
                  <p className="text-[11px] font-normal font-pd text-slate-500 mt-1">
                    Billed annually at ₹36,000 + 18% GST (₹6,480) = ₹42,480 / year
                  </p>
                </div>

                <button
                  onClick={() => handleBuyNow(subscriptionTiers[2])}
                  className="w-full bg-[#F43F5E] hover:bg-[#E11D48] text-white font-semibold font-sf text-sm sm:text-base py-3 sm:py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(244,63,94,0.3)] hover:shadow-[0_12px_35px_rgba(244,63,94,0.4)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Join Annual Plan</span>
                  <ArrowRight size={16} />
                </button>

                <p className="text-center text-[10px] font-normal font-pd text-slate-400">
                  ⚡ Fast Activation • 100% Tax Deductible (ITC)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="pb-28 px-6 lg:px-12 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-semibold font-pd text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm font-normal font-pd mt-1">
            Common questions from venue owners and event partners
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Is 18% GST included or extra?",
              a: "GST of 18% is extra on all membership plans. The base rates are ₹5,999/mo (Monthly), ₹3,500/mo (Half-Yearly), and ₹3,000/mo (Annual). Total amounts payable at checkout including 18% GST are ₹7,079 (Monthly), ₹24,780 (6 Months), and ₹42,480 (12 Months). A full GST tax invoice is instantly generated with your GSTIN for 100% Input Tax Credit (ITC) claim."
            },
            {
              q: "How does the subscription pricing work?",
              a: "PartyDial offers 3 flexible durations: Monthly (₹5,999/mo base), Half-Yearly (₹3,500/mo base billed as ₹21,000 for 6 months), and Annual (₹3,000/mo base billed as ₹36,000 for 12 months). Standard MRP is ₹7,999/month, saving you up to 62%."
            },
            {
              q: "Are there any guest capacity (PAX) restrictions?",
              a: "No! All plans under our Partner Pro model cover venues of all capacities (from 50 PAX intimate party halls to 5,000+ PAX destination resorts) with zero capacity limits."
            },
            {
              q: "How do I receive customer leads?",
              a: "Whenever a user searches for venues in your city and submits an inquiry, our automated system instantly notifies you via email, and logs the customer into your dashboard CRM."
            },
            {
              q: "Can I upgrade my plan duration later?",
              a: "Yes! You can switch from a Monthly Plan to a Half-Yearly or Annual Plan at any time directly from your dashboard to unlock the lower rate of ₹3,000/month."
            }
          ].map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <h4 className="text-sm sm:text-base font-semibold font-sf text-slate-900 mb-2">
                {faq.q}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-normal font-pd leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* JSON-LD STRUCTURED DATA FOR SEO (PRODUCT + FAQ RICH SNIPPETS) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Product",
                "name": "PartyDial Venue Partner Subscription",
                "description": "Subscription plans for banquet halls, party venues, and farmhouses to get verified event customer leads with zero commission.",
                "brand": {
                  "@type": "Brand",
                  "name": "PartyDial"
                },
                "offers": [
                  {
                    "@type": "Offer",
                    "name": "Monthly Plan",
                    "price": "5999",
                    "priceCurrency": "INR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "5999",
                      "priceCurrency": "INR",
                      "unitText": "MONTH",
                      "valueAddedTaxIncluded": "false"
                    },
                    "availability": "https://schema.org/InStock"
                  },
                  {
                    "@type": "Offer",
                    "name": "Half-Yearly Plan",
                    "price": "21000",
                    "priceCurrency": "INR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "21000",
                      "priceCurrency": "INR",
                      "unitText": "6 MONTHS",
                      "valueAddedTaxIncluded": "false"
                    },
                    "availability": "https://schema.org/InStock"
                  },
                  {
                    "@type": "Offer",
                    "name": "Annual Plan",
                    "price": "36000",
                    "priceCurrency": "INR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "36000",
                      "priceCurrency": "INR",
                      "unitText": "YEAR",
                      "valueAddedTaxIncluded": "false"
                    },
                    "availability": "https://schema.org/InStock"
                  }
                ]
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Is 18% GST included or extra?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "GST of 18% is extra on all membership plans. The base rates are ₹5,999/mo (Monthly), ₹3,500/mo (Half-Yearly), and ₹3,000/mo (Annual). Total amounts payable at checkout including 18% GST are ₹7,079 (Monthly), ₹24,780 (6 Months), and ₹42,480 (12 Months). A full GST tax invoice is instantly generated with your GSTIN for 100% Input Tax Credit (ITC) claim."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How does the subscription pricing work?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "PartyDial offers 3 flexible durations: Monthly (₹5,999/mo base), Half-Yearly (₹3,500/mo base billed as ₹21,000 for 6 months), and Annual (₹3,000/mo base billed as ₹36,000 for 12 months). Standard MRP is ₹7,999/month, saving you up to 62%."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Are there any guest capacity (PAX) restrictions?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "No! All plans under our Partner Pro model cover venues of all capacities (from 50 PAX intimate party halls to 5,000+ PAX destination resorts) with zero capacity limits."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How do I receive customer leads?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Whenever a user searches for venues in your city and submits an inquiry, our automated system instantly notifies you via email, and logs the customer into your dashboard CRM."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I upgrade my plan duration later?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! You can switch from a Monthly Plan to a Half-Yearly or Annual Plan at any time directly from your dashboard to unlock the lower rate of ₹3,000/month."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />
    </div>
  );
}
