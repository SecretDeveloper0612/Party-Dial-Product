'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  ArrowUpRight, 
  AlertCircle,
  Zap,
  Building2,
  Receipt,
  Headphones,
  Check
} from 'lucide-react';
import Link from 'next/link';

interface SubscriptionTabProps {
  venueProfile: any;
  userData: any;
  expiryInfo: {
    daysLeft: number;
    percent: number;
    label: string;
  } | null;
  hasActivePaidPlan: boolean;
  setShowInquiryPopup: (show: boolean) => void;
  setActiveTab: (tab: string) => void;
}

const planFeaturesMap: Record<string, string[]> = {
  default: [
    'Direct High-Intent Customer Inquiries',
    'Real-time WhatsApp & Phone Direct Connect',
    'Lead Pipeline & Instant CRM Status Manager',
    'Full Professional Quotation & Invoice Builder',
    'High Search Ranking & Category Spotlight',
    'Verified Partner Badge & Priority Support'
  ],
  trial: [
    'Complimentary Trial Direct Inquiries',
    'Lead Contact Details & Direct Call/WhatsApp',
    'Standard Search Listing in Your City',
    'Digital Quotation Manager Access'
  ],
  free: [
    'Basic Venue Listing Showcase',
    'Customer Review Display',
    'Direct Phone Inquiries Restricted',
    'Lead CRM & Quotations Restricted'
  ]
};

const SubscriptionTab: React.FC<SubscriptionTabProps> = ({
  venueProfile,
  userData,
  expiryInfo,
  hasActivePaidPlan,
  setShowInquiryPopup,
  setActiveTab
}) => {
  const plan = venueProfile?.subscriptionPlan || 'free';
  const isFree = !hasActivePaidPlan || plan === 'free' || plan === 'None' || plan === '';
  const isTrial = plan === 'trial_30';

  // Parse billing details
  let billingData: any = {};
  try {
    billingData = typeof venueProfile?.billingDetails === 'string'
      ? JSON.parse(venueProfile.billingDetails)
      : (venueProfile?.billingDetails || {});
  } catch {
    billingData = {};
  }

  // Format dates
  const startDate = billingData?.paidSince || venueProfile?.createdAt || venueProfile?.$createdAt;
  const formattedStart = startDate 
    ? new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A';

  const expiryDate = venueProfile?.subscriptionExpiry;
  const formattedExpiry = expiryDate
    ? new Date(expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : (expiryInfo?.daysLeft && expiryInfo.daysLeft > 0 
        ? `${expiryInfo.daysLeft} days remaining` 
        : 'N/A');

  const planName = expiryInfo?.label || (isFree ? 'Free Starter Listing' : 'Active Partner Plan');
  const features = isFree ? planFeaturesMap.free : (isTrial ? planFeaturesMap.trial : planFeaturesMap.default);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }} 
      className="w-full max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pd-pink/10 to-pd-purple/10 text-pd-pink flex items-center justify-center border border-pd-pink/20">
              <CreditCard size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Vendor Subscription</h1>
              <p className="text-xs font-normal text-slate-500">Manage your active plan, membership validity, and billing details</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-pd-pink text-white text-xs font-semibold transition-all shadow-md active:scale-95 flex items-center justify-center"
          >
            {isFree ? 'Upgrade to Pro' : 'Change / Renew Plan'}
          </Link>
          <button
            onClick={() => setActiveTab('support')}
            className="px-4 py-2.5 rounded-xl border border-slate-200/60 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all"
          >
            Billing Help
          </button>
        </div>
      </div>

      {/* Main Grid: Active Plan Card + Validity & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Plan Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 lg:p-8 border border-slate-200/60 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 opacity-30 ${hasActivePaidPlan ? 'bg-emerald-300' : 'bg-amber-300'}`} />

          <div>
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  hasActivePaidPlan 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${hasActivePaidPlan ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {hasActivePaidPlan ? 'Active Membership' : 'Free / Inactive'}
                </span>
                {venueProfile?.isVerified && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified Venue
                  </span>
                )}
              </div>

              <span className="text-xs font-medium text-slate-400">ID: {venueProfile?.$id ? venueProfile.$id.slice(0, 10) + '...' : 'N/A'}</span>
            </div>

            {/* Plan Title & Venue Info */}
            <div className="mb-6 relative z-10">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                {planName}
              </h2>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Building2 size={16} className="text-slate-400" />
                <span className="font-medium text-slate-700">{venueProfile?.venueName || userData?.name || 'Your Venue'}</span>
                <span>•</span>
                <span>{venueProfile?.city || 'Haldwani'}</span>
              </p>
            </div>

            {/* Validity Progress Bar (if active) */}
            {hasActivePaidPlan && expiryInfo && expiryInfo.daysLeft > 0 && (
              <div className="mb-8 p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-2 relative z-10">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Clock size={13} className="text-pd-pink" /> Membership Validity Remaining
                  </span>
                  <span className={`font-bold ${expiryInfo.daysLeft < 7 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {expiryInfo.daysLeft} days left
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200/70 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${expiryInfo.percent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      expiryInfo.daysLeft < 7 
                        ? 'bg-gradient-to-r from-rose-500 to-red-500' 
                        : 'bg-gradient-to-r from-pd-pink via-purple-500 to-emerald-400'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>Activated: {formattedStart}</span>
                  <span>Expires: {formattedExpiry}</span>
                </div>
              </div>
            )}

            {/* Included Plan Features */}
            <div className="space-y-3 relative z-10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Plan Inclusions & Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="text-xs text-slate-500">
              Need to change your billing info or upgrade PAX limit?
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInquiryPopup(true)}
                className="px-4 py-2 rounded-lg bg-pd-pink/10 hover:bg-pd-pink/20 text-pd-pink text-xs font-bold transition-colors"
              >
                Inquire Special Custom Plan
              </button>
              <Link
                href="/pricing"
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                View Plans <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Side Summary Card */}
        <div className="space-y-6">
          
          {/* Quick Status Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Subscription Overview</h3>
            
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Plan Status</span>
                <span className={`font-bold ${hasActivePaidPlan ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {hasActivePaidPlan ? 'Active' : 'Unsubscribed'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Current Plan</span>
                <span className="font-semibold text-slate-800 truncate max-w-[150px]">{planName}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Start Date</span>
                <span className="font-semibold text-slate-800">{formattedStart}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Expiry Date</span>
                <span className="font-semibold text-slate-800">{formattedExpiry}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Capacity Allowed</span>
                <span className="font-semibold text-slate-800">{venueProfile?.maxCapacity ? `Up to ${venueProfile.maxCapacity} Guests` : 'Standard'}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Billing Entity</span>
                <span className="font-semibold text-slate-800 truncate max-w-[140px]">{billingData?.businessName || venueProfile?.venueName || 'N/A'}</span>
              </div>
            </div>

            {!hasActivePaidPlan && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-800 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle size={14} className="text-amber-600 shrink-0" />
                  Direct Inquiries Inactive
                </div>
                <p className="text-[11px] leading-relaxed text-amber-700">
                  Upgrade your plan to unlock customer phone numbers, direct WhatsApp connect, and real-time lead dispatch.
                </p>
                <Link
                  href="/pricing"
                  className="block text-center w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-pd-pink transition-colors mt-2"
                >
                  Activate Live Pack
                </Link>
              </div>
            )}
          </div>

          {/* Need Assistance */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-pd-pink">
              <Headphones size={18} />
            </div>
            <h4 className="text-sm font-bold font-heading tracking-tight">Dedicated Partner Manager</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Need assistance renewing your package, customizing PAX capacity, or adjusting invoice GST details?
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('support')}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-all border border-white/15"
              >
                Contact Partner Support
              </button>
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default React.memo(SubscriptionTab);
