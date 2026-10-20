'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Script from 'next/script';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Lock, 
  CreditCard, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  MapPin, 
  Sparkle, 
  FileText,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Tag,
  CheckCircle2,
  RefreshCw,
  X
} from 'lucide-react';
import { account, databases, DATABASE_ID, VENUES_COLLECTION_ID, Query } from '@/lib/appwrite';

// Pricing plans configured for checkout
interface PlanOption {
  id: string;
  duration: 'monthly' | 'halfYearly' | 'annually';
  name: string;
  periodLabel: string;
  monthlyMrp: number;
  monthlyRate: number;
  baseTotalPrice: number;
  gstAmount: number;        // 18% GST
  totalWithGst: number;     // Final payable
  savingsPercent: number;
  features: string[];
}

const CHECKOUT_PLANS: Record<string, PlanOption> = {
  monthly: {
    id: 'monthly',
    duration: 'monthly',
    name: 'Monthly Plan',
    periodLabel: '1 Month',
    monthlyMrp: 7999,
    monthlyRate: 5999,
    baseTotalPrice: 5999,
    gstAmount: 1080,         // Math.round(5999 * 0.18) = 1080
    totalWithGst: 7079,     // 5999 + 1080 = 7079
    savingsPercent: 25,
    features: [
      'Unlimited Customer Inquiries',
      'Instant Email Lead Alerts',
      'Complete Venue Profile & Showcase',
      'Standard City Search Placement',
      'Lead CRM & Status Pipeline',
      'Quotation & Digital Invoice Maker'
    ]
  },
  halfYearly: {
    id: 'halfYearly',
    duration: 'halfYearly',
    name: 'Half-Yearly Plan',
    periodLabel: '6 Months',
    monthlyMrp: 7999,
    monthlyRate: 3500,
    baseTotalPrice: 21000,
    gstAmount: 3780,        // 21000 * 0.18
    totalWithGst: 24780,    // 21000 + 3780
    savingsPercent: 56,
    features: [
      'Unlimited Customer Inquiries',
      'Instant Email Lead Alerts',
      'Priority Lead Dispatch Algorithm',
      'High Category & City Search Placement',
      'Lead CRM & Status Pipeline',
      'Official Verified Partner Badge'
    ]
  },
  annually: {
    id: 'annually',
    duration: 'annually',
    name: 'Annual Plan',
    periodLabel: '12 Months',
    monthlyMrp: 7999,
    monthlyRate: 3000,
    baseTotalPrice: 36000,
    gstAmount: 6480,        // 36000 * 0.18
    totalWithGst: 42480,    // 36000 + 6480
    savingsPercent: 62,
    features: [
      'Everything in Half-Yearly Plan',
      'Guaranteed Lowest Rate (₹3,000/mo)',
      'Top-Tier Search Ranking & Featured Spotlight',
      'Dedicated Partner Growth Manager',
      'Citywide Venue & Social Media Promotion',
      '24/7 Priority VIP Phone & Email Support'
    ]
  }
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDurationParam = searchParams.get('plan') || 'annually';

  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(
    CHECKOUT_PLANS[selectedDurationParam] || CHECKOUT_PLANS.annually
  );

  // Auto-debit preference (enabled by default for monthly plan)
  const [isAutoDebit, setIsAutoDebit] = useState(selectedDurationParam === 'monthly');

  // Coupon code state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    amountSaved: number;
  } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [venue, setVenue] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate dynamic totals considering coupon discount
  const basePrice = selectedPlan.baseTotalPrice;
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((basePrice * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(basePrice, Math.round(appliedCoupon.discountValue));
    }
  }

  const discountedBasePrice = Math.max(0, basePrice - discountAmount);
  const calculatedGst = Math.round(discountedBasePrice * 0.18);
  const finalTotalWithGst = discountedBasePrice + calculatedGst;

  // Billing form state
  const [billing, setBilling] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: ''
  });

  // Verify authentication on mount
  useEffect(() => {
    const checkAuthAndVenue = async () => {
      setIsCheckingAuth(true);
      try {
        const currentUser = await account.get().catch(() => null);

        if (!currentUser) {
          // If not logged in, redirect to login with return redirect
          const currentPlan = searchParams.get('plan') || 'annually';
          router.push(`/login?redirect=/checkout?plan=${currentPlan}`);
          return;
        }

        setUser(currentUser);

        // Pre-fill user details
        setBilling(prev => ({
          ...prev,
          contactName: prev.contactName || currentUser.name || '',
          email: prev.email || currentUser.email || '',
          phone: prev.phone || currentUser.phone || ''
        }));

        // Try to fetch venue document if already created
        try {
          const vRes = await databases.listDocuments(DATABASE_ID, VENUES_COLLECTION_ID, [
            Query.equal('userId', currentUser.$id)
          ]);
          if (vRes.documents.length > 0) {
            const v = vRes.documents[0];
            setVenue(v);
            setBilling(prev => ({
              ...prev,
              businessName: prev.businessName || v.venueName || v.name || '',
              city: prev.city || v.city || '',
              state: prev.state || v.state || '',
              pincode: prev.pincode || v.pincode || '',
              phone: prev.phone || v.contactNumber || v.phone || currentUser.phone || '',
              gstNumber: prev.gstNumber || v.gstNumber || ''
            }));
          }
        } catch (e) {
          console.warn('Could not fetch existing venue profile:', e);
        }
      } catch (err) {
        console.error('Auth error:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthAndVenue();
  }, [router, searchParams]);

  // Update selected plan if URL param changes
  useEffect(() => {
    const p = searchParams.get('plan');
    if (p && CHECKOUT_PLANS[p]) {
      setSelectedPlan(CHECKOUT_PLANS[p]);
      if (p === 'monthly') {
        setIsAutoDebit(true);
      }
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setBilling(prev => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  // Validate and apply coupon code
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5005/api';
      const serverUrl = base.endsWith('/api') ? base : `${base}/api`;

      const res = await fetch(`${serverUrl}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim().toUpperCase() })
      });

      const data = await res.json();
      if (data.status === 'success' && data.data) {
        const c = data.data;
        let saved = 0;
        if (c.discountType === 'percentage') {
          saved = Math.round((basePrice * c.discountValue) / 100);
        } else {
          saved = Math.min(basePrice, Math.round(c.discountValue));
        }

        setAppliedCoupon({
          code: c.code,
          discountType: c.discountType,
          discountValue: c.discountValue,
          amountSaved: saved
        });
        setCouponError('');
      } else {
        setCouponError(data.message || 'Invalid or expired coupon code.');
      }
    } catch (err: any) {
      setCouponError('Could not validate coupon. Please try again.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const handleProceedPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Form validations
    if (!billing.contactName.trim()) {
      setErrorMessage('Please enter your contact / owner name.');
      return;
    }
    if (!billing.email.trim()) {
      setErrorMessage('Please enter your billing email address.');
      return;
    }
    if (!billing.phone.trim() || billing.phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsProcessing(true);

    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5005/api';
      const serverUrl = base.endsWith('/api') ? base : `${base}/api`;

      const totalPaise = Math.round(finalTotalWithGst * 100);
      const isRecurring = selectedPlan.duration === 'monthly' && isAutoDebit;

      let orderOrSub: any = null;

      if (isRecurring) {
        // Create Razorpay Subscription for Auto-Debit
        const subRes = await fetch(`${serverUrl}/payments/create-subscription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalPaise,
            planName: `Partner Pro ${selectedPlan.name}`,
            totalCycles: 12
          })
        });
        orderOrSub = await subRes.json();
      } else {
        // Create standard Razorpay Order
        const orderRes = await fetch(`${serverUrl}/payments/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalPaise,
            venueId: venue?.$id || null,
            receipt: `rcpt_${Date.now()}`
          })
        });
        orderOrSub = await orderRes.json();
      }

      if (orderOrSub.error || (!orderOrSub.id && !orderOrSub.subscription_id)) {
        setErrorMessage(orderOrSub.message || 'Failed to initialize payment with Razorpay.');
        setIsProcessing(false);
        return;
      }

      // Clean contact phone for Razorpay (must be 10 digits or empty/undefined)
      const cleanPhone = billing.phone.replace(/\D/g, '').slice(-10);

      // 2. Open Razorpay Checkout modal
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TpjqJRzx9lPYxh',
        name: 'PartyDial',
        description: isRecurring
          ? `Partner Pro Monthly (Auto-Debit ₹${finalTotalWithGst.toLocaleString()}/mo)`
          : `Partner Pro ${selectedPlan.name}`,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id?: string;
          razorpay_subscription_id?: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch(`${serverUrl}/payments/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                userId: user?.$id || null,
                venueId: venue?.$id || null,
                venueName: billing.businessName || billing.contactName || 'Partner Venue',
                ownerEmail: billing.email,
                planId: `pro_${selectedPlan.duration}`,
                planName: `Partner Pro (${selectedPlan.name})`,
                billingDuration: selectedPlan.duration,
                amount: finalTotalWithGst,
                basePrice: discountedBasePrice,
                gstAmount: calculatedGst,
                addons: [],
                discount: discountAmount,
                couponUsed: appliedCoupon?.code || '',
                billingDetails: {
                  name: billing.contactName,
                  businessName: billing.businessName,
                  email: billing.email,
                  mobile: billing.phone,
                  city: billing.city,
                  state: billing.state,
                  pincode: billing.pincode,
                  gstNumber: billing.gstNumber
                }
              })
            });

            const verifyResult = await verifyRes.json();

            if (verifyResult.status === 'success') {
              window.location.href = '/dashboard';
            } else {
              setErrorMessage('Payment verification failed. Please contact PartyDial support.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            setErrorMessage('Payment verification error. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: billing.contactName ? billing.contactName.trim() : undefined,
          email: billing.email ? billing.email.trim() : undefined,
          contact: cleanPhone.length === 10 ? cleanPhone : undefined
        },
        theme: {
          color: '#ec4899'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      if (isRecurring && orderOrSub.subscription_id) {
        options.subscription_id = orderOrSub.subscription_id;
      } else {
        options.order_id = orderOrSub.id;
        options.amount = Number(orderOrSub.amount);
        options.currency = orderOrSub.currency || 'INR';
      }

      const RazorpayConstructor = (window as unknown as { Razorpay: any }).Razorpay;
      if (!RazorpayConstructor) {
        setErrorMessage('Razorpay SDK failed to load. Please refresh the page and try again.');
        setIsProcessing(false);
        return;
      }

      const rzp = new RazorpayConstructor(options);
      rzp.on('payment.failed', function (resp: any) {
        setErrorMessage(resp?.error?.description || 'Payment was cancelled or failed. Please try again.');
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMessage('Something went wrong initiating the order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFD]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Securing your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-slate-900 selection:bg-pink-500 selection:text-white py-6 sm:py-12 px-3 sm:px-6 lg:px-8 font-pd antialiased">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="max-w-6xl mx-auto">
        {/* Navigation Bar */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link 
            href="/pricing"
            className="inline-flex items-center gap-2 text-xs font-semibold font-pd uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors w-fit"
          >
            <ChevronLeft size={16} />
            <span>Back to Pricing</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-semibold font-pd border border-emerald-200 w-fit">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: Billing Details Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-10 shadow-sm">
            <div className="mb-6 sm:mb-8">
              <span className="text-[10px] font-semibold font-pd uppercase tracking-widest text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                Partner Subscription
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold font-sf text-slate-900 tracking-tight mt-3">
                Complete Your Subscription
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-normal font-pd mt-1">
                Enter your business and billing information. Your invoice will be generated with these details.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-xs font-semibold">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleProceedPayment} className="space-y-5">
              {/* Business Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Venue / Business Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={billing.businessName}
                    onChange={e => handleInputChange('businessName', e.target.value)}
                    placeholder="e.g. Royal Palace Banquet & Lawn"
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-10 pr-4 text-sm font-medium text-slate-900 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Contact Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Contact Person Name <span className="text-pink-600">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={billing.contactName}
                      onChange={e => handleInputChange('contactName', e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-10 pr-4 text-sm font-medium text-slate-900 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Mobile Number <span className="text-pink-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={billing.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-10 pr-4 text-sm font-medium text-slate-900 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Billing Email Address <span className="text-pink-600">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={billing.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder="e.g. contact@royalpalace.com"
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-10 pr-4 text-sm font-medium text-slate-900 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* City, State & Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={billing.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    placeholder="e.g. Delhi"
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-normal text-slate-900 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={billing.state}
                    onChange={e => handleInputChange('state', e.target.value)}
                    placeholder="e.g. Delhi NCR"
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-normal text-slate-900 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={billing.pincode}
                    onChange={e => handleInputChange('pincode', e.target.value)}
                    placeholder="e.g. 110001"
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-normal text-slate-900 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* GSTIN (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  GSTIN <span className="text-slate-400 font-normal">(Optional for 18% Input Tax Credit)</span>
                </label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={billing.gstNumber}
                    onChange={e => handleInputChange('gstNumber', e.target.value.toUpperCase())}
                    placeholder="e.g. 07AAAAA0000A1Z5"
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-10 pr-4 text-sm font-medium text-slate-900 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none placeholder:text-slate-400 uppercase"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider text-white shadow-xl bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 hover:opacity-95 shadow-pink-500/25 cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Opening Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>
                        {selectedPlan.duration === 'monthly' && isAutoDebit 
                          ? `Start Auto-Debit • ₹${finalTotalWithGst.toLocaleString()}/mo`
                          : `Pay ₹${finalTotalWithGst.toLocaleString()} with Razorpay`
                        }
                      </span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-3 font-medium">
                  {selectedPlan.duration === 'monthly' && isAutoDebit
                    ? 'Recurring monthly renewal via UPI AutoPay or Cards. Powered by Razorpay.'
                    : 'Supports UPI, Credit/Debit Cards, NetBanking, and Wallets via Razorpay.'}
                </p>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: Order Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900">
                  Order Summary
                </h3>
                <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                  Save {selectedPlan.savingsPercent}%
                </span>
              </div>

              {/* Plan Switcher */}
              <div className="my-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Subscription Duration:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(['monthly', 'halfYearly', 'annually'] as const).map(key => {
                    const p = CHECKOUT_PLANS[key];
                    const isSelected = selectedPlan.duration === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedPlan(p);
                          if (key === 'monthly') {
                            setIsAutoDebit(true);
                          }
                        }}
                        className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-pink-50/80 border-pink-500 text-pink-900 font-extrabold shadow-xs'
                            : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100 font-semibold'
                        }`}
                      >
                        <div className="text-xs">{p.periodLabel}</div>
                        <div className="text-[11px] text-slate-500 font-bold mt-0.5">₹{p.monthlyRate.toLocaleString()}/mo</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Plan Details Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-900">{selectedPlan.name}</span>
                  <span className="text-xs font-semibold text-slate-400 line-through">
                    ₹{selectedPlan.monthlyMrp.toLocaleString()}/mo
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Billed rate: ₹{selectedPlan.monthlyRate.toLocaleString()}/month
                </div>
              </div>

              {/* Auto-Debit Option for Monthly Plan */}
              {selectedPlan.duration === 'monthly' && (
                <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-pink-50/90 to-purple-50/90 border border-pink-200/80">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-pink-500 text-white shrink-0 mt-0.5">
                        <RefreshCw size={13} className={isAutoDebit ? 'animate-spin-slow' : ''} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>Auto-Debit Monthly Subscription</span>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-pink-500 text-white tracking-wider">
                            Recommended
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          Hassle-free automatic monthly renewal via UPI Autopay / Card. Cancel anytime with 1-click in dashboard.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={isAutoDebit}
                        onChange={e => setIsAutoDebit(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* Coupon Code Input Section */}
              <div className="mb-5 pb-5 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Tag size={13} className="text-pink-600" />
                    <span>Have a Coupon Code?</span>
                  </span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-xs font-extrabold text-emerald-800 tracking-wider font-mono">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-medium ml-2">
                          (-₹{discountAmount.toLocaleString()} saved!)
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove coupon"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={e => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        placeholder="ENTER COUPON CODE"
                        className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold uppercase tracking-wider text-slate-900 focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all outline-none placeholder:text-slate-400 placeholder:normal-case font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                      {isApplyingCoupon ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[11px] font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{couponError}</span>
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pb-4 border-b border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Base Subscription ({selectedPlan.periodLabel})</span>
                  <span className="font-bold text-slate-900">₹{selectedPlan.baseTotalPrice.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>GST (18% Extra)</span>
                  <span className="font-bold text-slate-900">₹{calculatedGst.toLocaleString()}</span>
                </div>
              </div>

              {/* Total Payable */}
              <div className="pt-4 flex items-baseline justify-between mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {selectedPlan.duration === 'monthly' && isAutoDebit ? 'Recurring Monthly Total' : 'Total Payable'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {selectedPlan.duration === 'monthly' && isAutoDebit 
                      ? 'Auto-renews monthly • Cancel anytime'
                      : 'One-time payment • Incl. 18% GST'
                    }
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-950 tracking-tight">
                  ₹{finalTotalWithGst.toLocaleString()}
                </div>
              </div>

              {/* Key Features Included */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Included in this plan:
                </p>
                <div className="space-y-2">
                  {selectedPlan.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFD]">
        <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
