'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { account, databases, DATABASE_ID, VENUES_COLLECTION_ID, Query } from '@/lib/appwrite';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X,
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
export type BillingDuration = 'monthly' | 'quarterly' | 'halfYearly' | 'annually';

export interface PlanDurationOption {
  id: string;
  duration: BillingDuration;
  name: string;
  subtitle: string;
  badge?: string;
  periodLabel: string;
  monthlyMrp: number;
  monthlyRate: number;      // Effective monthly price
  baseTotalPrice: number;   // Base total before GST
  gstAmount: number;        // 18% GST amount
  totalWithGst: number;     // Final payable amount (incl. GST)
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
    monthlyMrp: 8999,
    monthlyRate: 7000,
    baseTotalPrice: 5932,
    gstAmount: 1068,         // 5932 + 1068 = 7000
    totalWithGst: 7000,
    totalMrp: 8999,
    savingsPercent: 22,
    totalSavings: 1999,
    billedText: '₹7,000 / month (Including GST)',
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
    id: 'quarterly',
    duration: 'quarterly',
    name: 'Quarterly Plan',
    subtitle: 'Ideal for upcoming festive & seasonal celebrations',
    badge: 'Seasonal • 3 Months',
    periodLabel: '3 Months',
    monthlyMrp: 8999,
    monthlyRate: 5000,
    baseTotalPrice: 12712,
    gstAmount: 2288,        // 12712 + 2288 = 15000
    totalWithGst: 15000,
    totalMrp: 26997,
    savingsPercent: 44,
    totalSavings: 11997,
    billedText: '₹15,000 for 3 Mo (₹5,000/mo, Incl. GST)',
    ctaText: 'Choose Quarterly Plan',
    features: [
      'Unlimited Customer Inquiries',
      'Instant Email Lead Alerts',
      'Priority City Search Placement',
      'Direct WhatsApp & Phone Connect',
      'Lead CRM & Status Pipeline',
      'Quotation & Digital Invoice Maker',
      'Venue Event Booking Calendar',
      'Priority Email & Chat Support'
    ]
  },
  {
    id: 'halfYearly',
    duration: 'halfYearly',
    name: 'Half-Yearly Plan',
    subtitle: 'Prime wedding & peak celebration seasons',
    badge: '★ Most Popular • 6 Months',
    periodLabel: '6 Months',
    monthlyMrp: 8999,
    monthlyRate: 4000,
    baseTotalPrice: 20339,
    gstAmount: 3661,        // 20339 + 3661 = 24000
    totalWithGst: 24000,
    totalMrp: 53994,
    savingsPercent: 55,
    totalSavings: 29994,
    billedText: '₹24,000 for 6 Mo (₹4,000/mo, Incl. GST)',
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
    badge: '👑 Best Value • 12 Months',
    periodLabel: '12 Months',
    monthlyMrp: 8999,
    monthlyRate: 3500,
    baseTotalPrice: 35593,
    gstAmount: 6407,        // 35593 + 6407 = 42000
    totalWithGst: 42000,
    totalMrp: 107988,
    savingsPercent: 61,
    totalSavings: 65988,
    billedText: '₹42,000 for 12 Mo (₹3,500/mo, Incl. GST)',
    isVip: true,
    ctaText: 'Unlock Annual Access',
    features: [
      'Everything in Half-Yearly Plan',
      'Guaranteed Lowest Rate (₹3,500/mo)',
      'Top-Tier Search Ranking & Featured Spotlight',
      'Dedicated Partner Growth Manager',
      'Citywide Venue & Social Media Promotion',
      'Unlimited Photo & Video Uploads',
      'Custom Promotion Campaigns',
      '24/7 Priority VIP Phone & Email Support'
    ]
  }
];

interface ComparisonRow {
  name: string;
  desc?: string;
  free: string | boolean;
  monthly: string | boolean;
  quarterly: string | boolean;
  halfYearly: string | boolean;
  annually: string | boolean;
}

interface ComparisonCategory {
  title: string;
  rows: ComparisonRow[];
}

const comparisonCategories: ComparisonCategory[] = [
  {
    title: "Key Plan Features & Inquiries",
    rows: [
      {
        name: "Monthly Verified Leads",
        desc: "Direct inquiries from event hosts in your city",
        free: false,
        monthly: "Unlimited",
        quarterly: "Unlimited",
        halfYearly: "Unlimited",
        annually: "Unlimited"
      },
      {
        name: "Instant Email Lead Alerts",
        desc: "Instant notification when a customer submits an inquiry",
        free: false,
        monthly: true,
        quarterly: true,
        halfYearly: true,
        annually: true
      },
      {
        name: "Direct WhatsApp & Phone Connect",
        desc: "Direct connection with verified customer phone numbers",
        free: false,
        monthly: true,
        quarterly: true,
        halfYearly: true,
        annually: true
      },
      {
        name: "OTP Verified Client Leads",
        desc: "100% spam protection with mobile OTP verification",
        free: false,
        monthly: true,
        quarterly: true,
        halfYearly: true,
        annually: true
      },
      {
        name: "Lead Dispatch Algorithm Priority",
        desc: "Speed of matching and dispatching prospective leads",
        free: false,
        monthly: "Standard",
        quarterly: "High Priority",
        halfYearly: "Priority (2x Fast)",
        annually: "Instant VIP Routing"
      },
      {
        name: "Platform Booking Commission",
        desc: "Fee charged by PartyDial on your confirmed event bookings",
        free: false,
        monthly: "Zero (0%)",
        quarterly: "Zero (0%)",
        halfYearly: "Zero (0%)",
        annually: "Zero (0%)"
      }
    ]
  },
  {
    title: "City Listing & Search Visibility",
    rows: [
      {
        name: "City Directory Search Placement",
        desc: "Visibility ranking in your city's venue listing page",
        free: false,
        monthly: "Standard Placement",
        quarterly: "High Placement",
        halfYearly: "Top Category Rank",
        annually: "Featured Spotlight #1"
      }
    ]
  },
  {
    title: "Lead CRM & Quotation Tools",
    rows: [
      {
        name: "Visual Lead CRM Pipeline",
        desc: "Track inquiries from New to Contacted and Booked",
        free: false,
        monthly: true,
        quarterly: true,
        halfYearly: true,
        annually: true
      },
      {
        name: "Interactive Quotation Maker",
        desc: "Create tailored quotes with menu packages and GST",
        free: false,
        monthly: true,
        quarterly: true,
        halfYearly: true,
        annually: true
      },
      {
        name: "Client Call Remarks & Notes",
        desc: "Log conversations and customer preferences per lead",
        free: false,
        monthly: true,
        quarterly: true,
        halfYearly: true,
        annually: true
      },
      {
        name: "Follow-up Reminders",
        desc: "Schedule reminders for pending client inquiries",
        free: false,
        monthly: "Standard",
        quarterly: "Standard",
        halfYearly: "Standard",
        annually: "Standard"
      }
    ]
  },
  {
    title: "Services, Capacity & Support",
    rows: [
      {
        name: "Guest Capacity (PAX) Restrictions",
        desc: "Venue capacity size limits on your profile",
        free: "Standard",
        monthly: "None (Any PAX)",
        quarterly: "None (Any PAX)",
        halfYearly: "None (Any PAX)",
        annually: "None (Any PAX)"
      },
      {
        name: "Dedicated Partner Growth Manager",
        desc: "Personal 1-on-1 account manager for conversion guidance",
        free: false,
        monthly: false,
        quarterly: false,
        halfYearly: "Dedicated Specialist",
        annually: "1-on-1 VIP Senior Manager"
      },
      {
        name: "Customer Support Access",
        desc: "Assistance channels for technical & listing queries",
        free: "Email",
        monthly: "Standard Email & Chat",
        quarterly: "Priority Email & Chat",
        halfYearly: "Priority Phone & Email",
        annually: "24/7 Priority VIP Phone & Chat"
      },
      {
        name: "Venue Onboarding Assistance",
        desc: "Help setting up your profile, photos, and packages",
        free: "Self-Service",
        monthly: "Self-Service",
        quarterly: "Assisted Setup",
        halfYearly: "1-on-1 Guided Setup",
        annually: "White-Glove VIP Setup"
      }
    ]
  }
];

const renderComparisonValue = (val: string | boolean) => {
  if (val === true) {
    return (
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 shadow-2xs">
        <Check size={14} strokeWidth={3} />
      </div>
    );
  }
  if (val === false) {
    return (
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300">
        <X size={12} strokeWidth={2.5} />
      </div>
    );
  }
  if (typeof val === 'string') {
    if (val.includes('VIP') || val.includes('Spotlight') || val.includes('Gold')) {
      return (
        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 shadow-2xs">
          {val}
        </span>
      );
    }
    if (val.includes('Verified Badge') || val.includes('Top Category')) {
      return (
        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-pink-100 text-pink-800 border border-pink-200 shadow-2xs">
          {val}
        </span>
      );
    }
    if (val.includes('High') || val.includes('Priority')) {
      return (
        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
          {val}
        </span>
      );
    }
    return (
      <span className="text-xs sm:text-[13px] font-semibold text-slate-800">
        {val}
      </span>
    );
  }
  return null;
};

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
                      {p.name} — ₹{p.monthlyRate.toLocaleString()}/mo ({p.billedText})
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
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'quarterly' | 'halfYearly' | 'annually'>('monthly');
  const [chartDuration, setChartDuration] = useState<'free' | 'monthly' | 'quarterly' | 'halfYearly' | 'annually'>('monthly');
  const router = useRouter();

  const handleBuyNow = (plan: PlanDurationOption) => {
    router.push(`/checkout?plan=${plan.duration}`);
  };

  const durationButtons: { id: 'monthly' | 'quarterly' | 'halfYearly' | 'annually'; label: string; sublabel: string }[] = [
    { id: 'monthly', label: '1 Month', sublabel: '₹7,000' },
    { id: 'quarterly', label: '3 Months', sublabel: '₹5,000/mo' },
    { id: 'halfYearly', label: '6 Months', sublabel: '₹4,000/mo' },
    { id: 'annually', label: '12 Months', sublabel: '₹3,500/mo' }
  ];

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
      <section className="pt-32 pb-10 md:pt-40 md:pb-16 px-6 lg:px-12 relative overflow-hidden">
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

          {/* MOBILE 4-BUTTON PLAN SELECTOR */}
          <div className="mt-8 md:hidden px-1">
            <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-xs">
              {durationButtons.map((btn) => {
                const isActive = selectedDuration === btn.id;
                return (
                  <button
                    key={btn.id}
                    onClick={() => setSelectedDuration(btn.id)}
                    className={`py-2.5 px-1 rounded-xl text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                      isActive
                        ? 'bg-white text-slate-950 font-bold shadow-sm border border-slate-200/60 ring-2 ring-pink-500/20'
                        : 'text-slate-500 font-medium hover:text-slate-800 hover:bg-slate-50/50'
                    }`}
                  >
                    <span className="text-[12px] font-semibold tracking-tight leading-tight">
                      {btn.label}
                    </span>
                    <span className={`text-[10px] mt-0.5 tracking-tight font-medium ${
                      isActive ? 'text-pink-600 font-semibold' : 'text-slate-400'
                    }`}>
                      {btn.sublabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4 PRICING CARDS */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {subscriptionTiers.map((tier) => {
            const isVisibleOnMobile = selectedDuration === tier.duration;
            return (
              <motion.div
                key={tier.id}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`relative rounded-3xl flex flex-col justify-between transition-all duration-300 bg-white text-slate-900 ${
                  !isVisibleOnMobile ? 'hidden md:flex' : 'flex'
                } ${
                  tier.isVip 
                    ? 'border-2 border-purple-600 shadow-[0_20px_50px_-12px_rgba(147,51,234,0.22)] xl:-translate-y-2'
                    : tier.isPopular
                    ? 'border-2 border-pink-500 shadow-[0_20px_50px_-12px_rgba(236,72,153,0.22)] xl:-translate-y-2'
                    : tier.duration === 'quarterly'
                    ? 'border-2 border-blue-500/80 shadow-[0_20px_50px_-12px_rgba(59,130,246,0.18)]'
                    : 'border border-slate-200/90 shadow-xl'
                } p-6 sm:p-7`}
              >
                {/* Floating Top Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                    <span className={`text-[10px] font-semibold font-pd uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm ${
                      tier.isVip
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/25'
                        : tier.isPopular
                        ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white shadow-pink-500/25'
                        : tier.duration === 'quarterly'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/25'
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
                          : tier.duration === 'quarterly'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        Save {tier.savingsPercent}%
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-semibold font-sf tracking-tight text-slate-900 leading-tight">
                      {tier.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-normal font-pd mt-1 leading-snug min-h-[36px]">
                      {tier.subtitle}
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className={`my-5 p-4 sm:p-5 rounded-2xl border transition-colors ${
                    tier.isVip 
                      ? 'bg-purple-50/40 border-purple-100' 
                      : tier.isPopular
                      ? 'bg-pink-50/40 border-pink-100'
                      : tier.duration === 'quarterly'
                      ? 'bg-blue-50/40 border-blue-100'
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

                    <div>
                      <div className="text-3xl sm:text-4xl font-semibold font-sf tracking-tight text-slate-950 mb-1">
                        ₹{tier.monthlyRate.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1.5 flex-nowrap">
                        <span className="text-xs font-semibold font-pd uppercase tracking-wider text-slate-500 whitespace-nowrap">
                          / Month
                        </span>
                        <span className="text-[10px] font-bold font-pd uppercase tracking-wider text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300/60 whitespace-nowrap inline-flex items-center">
                          Including GST
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Guaranteed Feature Callout */}
                  <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${
                    tier.isVip 
                      ? 'bg-purple-50 border-purple-200/70 text-purple-900' 
                      : tier.isPopular
                      ? 'bg-pink-50 border-pink-200/70 text-pink-900'
                      : tier.duration === 'quarterly'
                      ? 'bg-blue-50 border-blue-200/70 text-blue-900'
                      : 'bg-emerald-50 border-emerald-200/70 text-emerald-900'
                  }`}>
                    <Zap size={14} className={`shrink-0 fill-current ${
                      tier.isVip 
                        ? 'text-purple-600' 
                        : tier.isPopular 
                        ? 'text-pink-600' 
                        : tier.duration === 'quarterly'
                        ? 'text-blue-600'
                        : 'text-emerald-600'
                    }`} />
                    <span className="text-xs font-semibold font-pd leading-tight">
                      Unlimited Verified Leads Included
                    </span>
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
                        : tier.duration === 'quarterly'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 shadow-blue-500/25'
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

      {/* FEATURE COMPARISON MATRIX (CHART) */}
      <section className="pb-28 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] font-semibold font-pd uppercase tracking-widest text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
            COMPREHENSIVE PLAN COMPARISON
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-pd text-slate-900 tracking-tight leading-tight mt-3">
            Compare All Plan Features & Inclusions
          </h2>
          <p className="mt-3 text-slate-600 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto font-normal font-pd leading-relaxed">
            Detailed feature-by-feature breakdown across all 4 membership tiers. Every plan includes zero booking commissions.
          </p>
        </div>

        {/* Mobile Plan Selector for Matrix View */}
        <div className="block md:hidden mb-6">
          <div className="grid grid-cols-5 gap-1 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-xs max-w-md mx-auto">
            {[
              { id: 'free' as const, label: 'Free' },
              { id: 'monthly' as const, label: '1 Mo' },
              { id: 'quarterly' as const, label: '3 Mo' },
              { id: 'halfYearly' as const, label: '6 Mo' },
              { id: 'annually' as const, label: '12 Mo' }
            ].map((btn) => {
              const isActive = (chartDuration as string) === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setChartDuration(btn.id)}
                  className={`py-2 px-1 rounded-xl text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                    isActive
                      ? 'bg-white text-slate-950 font-bold shadow-sm border border-slate-200/60 ring-2 ring-pink-500/20'
                      : 'text-slate-500 font-medium hover:text-slate-800'
                  }`}
                >
                  <span className="text-[11px] font-semibold tracking-tight leading-tight">
                    {btn.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MOBILE SINGLE-PLAN COMPARISON VIEW (Visible on < md) */}
        <div className="block md:hidden">
          {(() => {
            const isFree = chartDuration === 'free';
            const currentPlan = subscriptionTiers.find(t => t.duration === chartDuration) || subscriptionTiers[0];
            return (
              <div className="rounded-3xl border border-slate-200 shadow-xl bg-white overflow-hidden mb-6">
                <div className={`p-5 text-white ${
                  isFree
                    ? 'bg-slate-800'
                    : currentPlan.isVip
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600'
                    : currentPlan.isPopular
                    ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600'
                    : currentPlan.duration === 'quarterly'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    : 'bg-slate-900'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-85">
                      {isFree ? 'Free Starter' : `${currentPlan.periodLabel} Commitment`}
                    </span>
                    {!isFree && (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                        Save {currentPlan.savingsPercent}%
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold font-sf">{isFree ? 'Free Listing' : currentPlan.name}</h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold font-sf">
                      {isFree ? '₹0' : `₹${currentPlan.monthlyRate.toLocaleString()}`}
                    </span>
                    <span className="text-xs opacity-90">
                      {isFree ? 'Forever Free' : '/ Month (Including GST)'}
                    </span>
                  </div>
                  <button
                    onClick={() => isFree ? router.push('/login') : handleBuyNow(currentPlan)}
                    className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer shadow-sm"
                  >
                    {isFree ? 'Get Started Free' : `Get Started with ${currentPlan.name}`}
                  </button>
                </div>

                {/* Categorized Features List for this specific plan */}
                <div className="divide-y divide-slate-100">
                  {comparisonCategories.map((cat, catIdx) => (
                    <div key={catIdx} className="p-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                        {cat.title}
                      </div>
                      <div className="space-y-3">
                        {cat.rows.map((row, rowIdx) => {
                          const val = row[chartDuration];
                          return (
                            <div key={rowIdx} className="flex items-start justify-between gap-3 text-xs py-1 border-b border-slate-50 last:border-b-0">
                              <div className="flex-1 pr-2">
                                <div className="font-semibold text-slate-900">{row.name}</div>
                                {row.desc && (
                                  <div className="text-[10px] text-slate-500 leading-snug mt-0.5">
                                    {row.desc}
                                  </div>
                                )}
                              </div>
                              <div className="shrink-0 text-right">
                                {renderComparisonValue(val)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() => isFree ? router.push('/login') : handleBuyNow(currentPlan)}
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer shadow-md ${
                      isFree
                        ? 'bg-slate-900'
                        : currentPlan.isVip
                        ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600'
                        : currentPlan.isPopular
                        ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600'
                        : currentPlan.duration === 'quarterly'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                        : 'bg-slate-900'
                    }`}
                  >
                    {isFree ? 'Activate Free Listing' : `Select ${currentPlan.periodLabel} Plan`}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Desktop / Tablet Scroll Hint */}
        <div className="hidden md:flex xl:hidden items-center justify-end gap-1.5 text-xs text-slate-500 font-medium mb-3 pr-2">
          <span>← Swipe horizontally to compare all 4 plans →</span>
        </div>

        {/* Table Wrapper (Hidden on mobile < md, visible on tablet & desktop) */}
        <div className="hidden md:block overflow-x-auto rounded-3xl border border-slate-200/90 shadow-xl bg-white">
          <table className="w-full min-w-[1050px] border-collapse text-left table-fixed">
            {/* Table Header: Plan Summary & CTA Top Bar */}
            <thead>
              <tr className="border-b border-slate-200">
                {/* Column 1: Matrix Label */}
                <th className="w-[25%] p-6 align-bottom bg-slate-50/60 pb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Features Matrix
                  </div>
                  <div className="text-xl font-bold font-sf text-slate-900 leading-tight">
                    Plan Specifications
                  </div>
                  <div className="text-xs font-normal text-slate-500 mt-1">
                    All plans include zero booking commissions.
                  </div>
                </th>

                {/* Column 2: Free Tier */}
                <th className="w-[15%] p-4 text-center align-bottom border-l border-slate-200/70 bg-slate-50/40">
                  <div className="text-[10px] font-bold font-pd uppercase tracking-wider text-slate-400 mb-0.5">
                    Free
                  </div>
                  <div className="text-sm font-bold font-sf text-slate-900 mb-1">
                    Free Plan
                  </div>
                  <div className="mb-3">
                    <span className="text-lg font-bold font-sf text-slate-950">₹0</span>
                    <span className="text-[11px] text-slate-500 block">Forever Free</span>
                  </div>
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full py-2 px-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer shadow-2xs"
                  >
                    Get Free
                  </button>
                </th>

                {/* Column 3: Monthly */}
                <th className="w-[15%] p-4 text-center align-bottom border-l border-slate-200/70">
                  <div className="text-[10px] font-bold font-pd uppercase tracking-wider text-slate-400 mb-0.5">
                    1 Month
                  </div>
                  <div className="text-sm font-bold font-sf text-slate-900 mb-1">
                    Monthly Plan
                  </div>
                  <div className="mb-3">
                    <span className="text-lg font-bold font-sf text-slate-950">₹7,000</span>
                    <span className="text-[11px] text-slate-500 block">/ mo (Incl. GST)</span>
                  </div>
                  <button
                    onClick={() => handleBuyNow(subscriptionTiers[0])}
                    className="w-full py-2 px-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
                  >
                    Buy Now
                  </button>
                </th>

                {/* Column 4: Quarterly */}
                <th className="w-[15%] p-4 text-center align-bottom border-l border-slate-200/70">
                  <div className="text-[10px] font-bold font-pd uppercase tracking-wider text-blue-600 mb-0.5">
                    3 Months
                  </div>
                  <div className="text-sm font-bold font-sf text-slate-900 mb-1">
                    Quarterly Plan
                  </div>
                  <div className="mb-3">
                    <span className="text-lg font-bold font-sf text-slate-950">₹5,000</span>
                    <span className="text-[11px] text-slate-500 block">/ mo (₹15k total)</span>
                  </div>
                  <button
                    onClick={() => handleBuyNow(subscriptionTiers[1])}
                    className="w-full py-2 px-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 transition-all cursor-pointer shadow-xs"
                  >
                    Buy Now
                  </button>
                </th>

                {/* Column 5: Half-Yearly (Most Popular) */}
                <th className="w-[15%] p-4 text-center align-bottom border-l border-slate-200/70 bg-pink-50/20 relative">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-pink-600 mb-1 inline-flex items-center gap-1 bg-pink-100/80 px-2 py-0.5 rounded-full border border-pink-200">
                    ★ Popular (6 Mo)
                  </div>
                  <div className="text-sm font-bold font-sf text-slate-900 mb-1">
                    Half-Yearly
                  </div>
                  <div className="mb-3">
                    <span className="text-lg font-bold font-sf text-slate-950">₹4,000</span>
                    <span className="text-[11px] text-slate-500 block">/ mo (₹24k total)</span>
                  </div>
                  <button
                    onClick={() => handleBuyNow(subscriptionTiers[2])}
                    className="w-full py-2 px-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 hover:opacity-95 transition-all cursor-pointer shadow-sm shadow-pink-500/25"
                  >
                    Buy Now
                  </button>
                </th>

                {/* Column 6: Annual (Best Value) */}
                <th className="w-[15%] p-4 text-center align-bottom border-l border-slate-200/70 bg-purple-50/20 relative">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-purple-600 mb-1 inline-flex items-center gap-1 bg-purple-100/80 px-2 py-0.5 rounded-full border border-purple-200">
                    👑 Save 61% (12 Mo)
                  </div>
                  <div className="text-sm font-bold font-sf text-slate-900 mb-1">
                    Annual Plan
                  </div>
                  <div className="mb-3">
                    <span className="text-lg font-bold font-sf text-slate-950">₹3,500</span>
                    <span className="text-[11px] text-slate-500 block">/ mo (₹42k total)</span>
                  </div>
                  <button
                    onClick={() => handleBuyNow(subscriptionTiers[3])}
                    className="w-full py-2.5 px-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 transition-all cursor-pointer shadow-sm shadow-purple-500/25"
                  >
                    Buy Now
                  </button>
                </th>
              </tr>
            </thead>

            {/* Categorized Rows Body */}
            <tbody>
              {comparisonCategories.map((cat, catIdx) => (
                <React.Fragment key={catIdx}>
                  {/* Category Header Row */}
                  <tr className="bg-slate-100/90 border-y border-slate-200">
                    <th
                      colSpan={6}
                      className="py-3 px-6 text-xs sm:text-[13px] font-bold font-sf uppercase tracking-wider text-slate-800"
                    >
                      {cat.title}
                    </th>
                  </tr>

                  {/* Feature Rows */}
                  {cat.rows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Feature Name & Description */}
                      <td className="p-4 sm:p-5 align-middle">
                        <div className="font-semibold text-xs sm:text-[13px] text-slate-900">
                          {row.name}
                        </div>
                        {row.desc && (
                          <div className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                            {row.desc}
                          </div>
                        )}
                      </td>

                      {/* Free Value */}
                      <td className="p-4 sm:p-5 text-center align-middle border-l border-slate-100 bg-slate-50/20">
                        {renderComparisonValue(row.free)}
                      </td>

                      {/* Monthly Value */}
                      <td className="p-4 sm:p-5 text-center align-middle border-l border-slate-100">
                        {renderComparisonValue(row.monthly)}
                      </td>

                      {/* Quarterly Value */}
                      <td className="p-4 sm:p-5 text-center align-middle border-l border-slate-100">
                        {renderComparisonValue(row.quarterly)}
                      </td>

                      {/* Half-Yearly Value */}
                      <td className="p-4 sm:p-5 text-center align-middle border-l border-slate-100 bg-pink-50/10">
                        {renderComparisonValue(row.halfYearly)}
                      </td>

                      {/* Annual Value */}
                      <td className="p-4 sm:p-5 text-center align-middle border-l border-slate-100 bg-purple-50/10">
                        {renderComparisonValue(row.annually)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}

              {/* Bottom Summary CTA Row */}
              <tr className="border-t-2 border-slate-200 bg-slate-50/60">
                <td className="p-5 font-bold text-xs sm:text-sm text-slate-800">
                  Ready to activate customer inquiries?
                </td>
                <td className="p-4 text-center border-l border-slate-200">
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full py-2.5 px-2 rounded-xl text-xs font-semibold text-slate-800 bg-slate-200 hover:bg-slate-300 transition-all cursor-pointer"
                  >
                    Select Free
                  </button>
                </td>
                <td className="p-4 text-center border-l border-slate-200">
                  <button
                    onClick={() => handleBuyNow(subscriptionTiers[0])}
                    className="w-full py-2.5 px-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Select 1 Mo
                  </button>
                </td>
                <td className="p-4 text-center border-l border-slate-200">
                  <button
                    onClick={() => handleBuyNow(subscriptionTiers[1])}
                    className="w-full py-2.5 px-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    Select 3 Mo
                  </button>
                </td>
                <td className="p-4 text-center border-l border-slate-200 bg-pink-50/20">
                  <button
                    onClick={() => handleBuyNow(subscriptionTiers[2])}
                    className="w-full py-2.5 px-2 rounded-xl text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 transition-all cursor-pointer"
                  >
                    Select 6 Mo
                  </button>
                </td>
                <td className="p-4 text-center border-l border-slate-200 bg-purple-50/20">
                  <button
                    onClick={() => handleBuyNow(subscriptionTiers[3])}
                    className="w-full py-2.5 px-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all cursor-pointer"
                  >
                    Select 12 Mo
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
                  <p className="text-sm sm:text-base lg:text-lg font-semibold font-sf text-emerald-600 mt-0.5">₹3,500/mo</p>
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
                    Save 61%
                  </span>
                </div>

                <div>
                  <div className="text-sm font-semibold font-sf text-slate-900">Partner Pro Annual Plan</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-semibold font-sf text-slate-950">₹3,500</span>
                    <span className="text-xs font-semibold font-pd text-emerald-600">/ month (Incl. GST)</span>
                  </div>
                  <p className="text-[11px] font-normal font-pd text-slate-500 mt-1">
                    Billed annually at ₹42,000 / year (₹3,500/mo, Including GST)
                  </p>
                </div>

                <button
                  onClick={() => handleBuyNow(subscriptionTiers[3])}
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
              a: "All prices are fully inclusive of 18% GST: Monthly Plan is ₹7,000/mo, Quarterly Plan is ₹5,000/mo (₹15,000 for 3 months), Half-Yearly Plan is ₹4,000/mo (₹24,000 for 6 months), and Annual Plan is ₹3,500/mo (₹42,000 for 12 months). A complete GST invoice is generated with your GSTIN for 100% Input Tax Credit (ITC)."
            },
            {
              q: "How does the subscription pricing work?",
              a: "PartyDial offers 4 flexible durations: Monthly (₹7,000/mo), Quarterly (₹5,000/mo billed as ₹15,000 for 3 months), Half-Yearly (₹4,000/mo billed as ₹24,000 for 6 months), and Annual (₹3,500/mo billed as ₹42,000 for 12 months), all with 18% GST included."
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
              a: "Yes! You can switch from a Monthly or Quarterly Plan to a Half-Yearly or Annual Plan at any time directly from your dashboard to unlock the lower rate of ₹3,500/month."
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

      {/* BOTTOM CTA: BECOME A PARTYDIAL PARTNER */}
      <section className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
        <div className="rounded-[28px] sm:rounded-[36px] bg-gradient-to-b sm:bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 sm:p-10 md:p-16 relative overflow-hidden shadow-2xl border border-white/10">
          {/* Ambient colorful glow */}
          <div className="absolute top-0 right-0 w-72 sm:w-[450px] h-72 sm:h-[450px] bg-pd-pink/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 sm:w-[450px] h-72 sm:h-[450px] bg-pd-blue/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-pink-200 text-[10px] sm:text-xs font-semibold font-poppins uppercase tracking-wider shadow-sm max-w-full">
              <Sparkle size={12} className="text-pd-pink shrink-0" />
              <span className="truncate">Zero Commission • 100% Direct Payouts</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-5xl font-semibold font-poppins text-white tracking-tight leading-tight">
              Ready to Fill Your Venue Calendar? <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pd-pink via-purple-300 to-pd-blue">
                Become a PartyDial Partner
              </span>
            </h3>

            <p className="text-slate-300 font-normal font-poppins text-xs sm:text-base leading-relaxed max-w-xl mx-auto px-2">
              Join top banquet halls and premium resorts across India. Start receiving exclusive, OTP-verified event host inquiries directly to your phone.
            </p>

            {/* Micro Stats Strip: Responsive Grid / Wrap */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-6 pt-1 sm:pt-2 text-left sm:text-center text-xs font-poppins text-slate-300 max-w-md sm:max-w-none mx-auto bg-white/[0.03] sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-white/5 sm:border-none">
              <div className="flex items-center sm:justify-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span className="text-xs">0% Commission on Advance</span>
              </div>
              <div className="flex items-center sm:justify-center gap-2">
                <CheckCircle2 size={15} className="text-pd-pink shrink-0" />
                <span className="text-xs">1:1 Exclusive Direct Leads</span>
              </div>
              <div className="flex items-center sm:justify-center gap-2">
                <CheckCircle2 size={15} className="text-pd-blue shrink-0" />
                <span className="text-xs">Verified in 24 Hours</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
              <Link href="/login" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-pd-pink hover:bg-rose-600 text-white rounded-full font-semibold font-poppins text-xs uppercase tracking-wider shadow-lg shadow-pd-pink/30 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Become a PartyDial Partner</span>
                  <ArrowRight size={15} />
                </motion.button>
              </Link>

              <Link href="/contact" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 bg-white/10 hover:bg-white/15 text-white rounded-full font-semibold font-poppins text-xs uppercase tracking-wider border border-white/20 backdrop-blur-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <PhoneCall size={14} className="text-pd-pink shrink-0" />
                  <span>Talk to Growth Expert</span>
                </button>
              </Link>
            </div>

            <div className="text-[10px] sm:text-[11px] font-poppins text-slate-400 pt-1">
              No long-term contracts. No setup fees. Cancel or upgrade anytime.
            </div>
          </div>
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
                    "price": "7000",
                    "priceCurrency": "INR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "7000",
                      "priceCurrency": "INR",
                      "unitText": "MONTH",
                      "valueAddedTaxIncluded": "true"
                    },
                    "availability": "https://schema.org/InStock"
                  },
                  {
                    "@type": "Offer",
                    "name": "Quarterly Plan",
                    "price": "15000",
                    "priceCurrency": "INR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "15000",
                      "priceCurrency": "INR",
                      "unitText": "3 MONTHS",
                      "valueAddedTaxIncluded": "true"
                    },
                    "availability": "https://schema.org/InStock"
                  },
                  {
                    "@type": "Offer",
                    "name": "Half-Yearly Plan",
                    "price": "24000",
                    "priceCurrency": "INR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "24000",
                      "priceCurrency": "INR",
                      "unitText": "6 MONTHS",
                      "valueAddedTaxIncluded": "true"
                    },
                    "availability": "https://schema.org/InStock"
                  },
                  {
                    "@type": "Offer",
                    "name": "Annual Plan",
                    "price": "42000",
                    "priceCurrency": "INR",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "42000",
                      "priceCurrency": "INR",
                      "unitText": "YEAR",
                      "valueAddedTaxIncluded": "true"
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
                    "name": "Is 18% GST included in the prices?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! All prices shown on this page are inclusive of 18% GST: Monthly Plan is ₹7,000/mo, Quarterly Plan is ₹5,000/mo (₹15,000 for 3 months), Half-Yearly Plan is ₹4,000/mo (₹24,000 for 6 months), and Annual Plan is ₹3,500/mo (₹42,000 for 12 months)."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How does the subscription pricing work?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "PartyDial offers 4 flexible durations: Monthly (₹7,000/mo), Quarterly (₹5,000/mo billed as ₹15,000 for 3 months), Half-Yearly (₹4,000/mo billed as ₹24,000 for 6 months), and Annual (₹3,500/mo billed as ₹42,000 for 12 months)."
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
