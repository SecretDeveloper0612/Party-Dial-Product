"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  CheckCircle2, 
  Ticket, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Zap,
  Loader2,
  Percent,
  ChevronRight,
  Pencil
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface Plan {
  $id: string;
  name: string;
  price: number | { quarterly: number; halfYearly: number; annually: number };
  description: string;
  duration?: string;
}

const addonsList = [
  { id: 'a50', name: '50 PAX Membership', price: 1999 },
  { id: 'a100', name: '100 PAX Membership', price: 2999 },
  { id: 'a200', name: '200 PAX Membership', price: 3999 },
  { id: 'a500', name: '500 PAX Membership', price: 6999 },
  { id: 'a1000', name: '1000 PAX Membership', price: 9999 },
  { id: 'a2000', name: '2000 PAX Membership', price: 14999 },
];

function CheckoutContent() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  const searchParams = useSearchParams();
  const prePlanId = searchParams.get('planId');
  const preVenueId = searchParams.get('venueId');
  const preAddonId = searchParams.get('addonId');
  const preDiscount = searchParams.get('discount');
  const preDiscountType = searchParams.get('discountType') || 'value';
  const preGst = searchParams.get('gst');
  const partnerDetailsEncoded = searchParams.get('partnerDetails');
  const preBillingDuration = searchParams.get('billingDuration') || 'annually';
  
  // States
  const [user, setUser] = useState<any>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  
  const [billingData, setBillingData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: preGst || ""
  });
  const [isLocked, setIsLocked] = useState(false);

  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
  const serverUrl = base.endsWith("/api") ? base : `${base}/api`;

  const fetchPlans = async () => {
    const professionalPlans = [
      { $id: 'bp10', name: 'Starter 10 PAX Membership', price: { quarterly: 1, halfYearly: 1, annually: 1 }, description: 'Micro-plan for small intimate gatherings' },
      { $id: 'bp50', name: '0-50 PAX Membership', price: { quarterly: 3780, halfYearly: 6660, annually: 12045 }, description: 'Starter exposure for boutique venues' },
      { $id: 'bp100', name: '50-100 PAX Membership', price: { quarterly: 5040, halfYearly: 9000, annually: 16060 }, description: 'Growth plan for rising banquet halls' },
      { $id: 'bp200', name: '100-200 PAX Membership', price: { quarterly: 8910, halfYearly: 15840, annually: 28105 }, description: 'Premium tier for professional venues' },
      { $id: 'bp500', name: '200-500 PAX Membership', price: { quarterly: 13500, halfYearly: 24300, annually: 44895 }, description: 'Elite membership for major venues' },
      { $id: 'bp1000', name: '500-1000 PAX Membership', price: { quarterly: 18900, halfYearly: 34920, annually: 65335 }, description: 'Ultimate exposure for large halls' },
      { $id: 'bp2000', name: '1000-2000 PAX Membership', price: { quarterly: 26100, halfYearly: 48600, annually: 90885 }, description: 'Grand membership for mega venues' },
      { $id: 'bp5000', name: '2000-5000 PAX Membership', price: { quarterly: 40500, halfYearly: 75600, annually: 138335 }, description: 'Titan membership for destination resorts' },
      { $id: 'bp9999', name: '5000+ PAX Membership', price: { quarterly: 63000, halfYearly: 117000, annually: 218635 }, description: 'Universal membership for group owners' },
    ];

    try {
      // Set initial plans immediately so they show up even if fetch is slow
      setPlans(professionalPlans);

      const res = await fetch(`${serverUrl}/plans`);
      const result = await res.json();
      if (result.status === "success") {
        const dbPlans = result.data || [];
        const merged = [...professionalPlans];
        dbPlans.forEach((dp: any) => {
          if (!merged.find(p => p.$id === dp.$id)) {
            merged.push(dp);
          }
        });
        setPlans(merged);
      }
    } catch (e) {
      console.error("Failed to fetch plans, using professional defaults.");
      // plans state is already set to professionalPlans as fallback
    }
  };

  useEffect(() => {
    fetchPlans();

    if (preVenueId) {
      if (preVenueId !== 'MANUAL') {
        fetchVenueDetails(preVenueId, partnerDetailsEncoded || undefined);
      } else if (partnerDetailsEncoded) {
        try {
          const decoded = JSON.parse(decodeURIComponent(escape(atob(partnerDetailsEncoded))));
          setBillingData(prev => ({
            ...prev,
            name: decoded.name || decoded.owner || prev.name,
            email: decoded.email || prev.email,
            mobile: decoded.phone || prev.mobile,
            address: decoded.address || prev.address,
            city: decoded.city || prev.city,
            state: decoded.state || prev.state,
            pincode: decoded.pincode || prev.pincode,
          }));
        } catch (e) {
          console.error("Failed to decode partner details", e);
        }
      }
      setIsLocked(true);
    }

    const sessionStr = localStorage.getItem("party_partner_session");
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setUser(session.user);
        const vid = session.user.prefs?.venueId;
        if (vid) {
           fetchVenueDetails(vid);
        } else {
           setBillingData(prev => ({
             ...prev,
             name: session.user.name || "",
             email: session.user.email || "",
             mobile: session.user.prefs?.mobile || ""
           }));
        }
      } catch (e) {}
    }
  }, [preVenueId, partnerDetailsEncoded]);

  const fetchVenueDetails = async (id: string, overrideData?: string) => {
    try {
      const res = await fetch(`${serverUrl}/venues/${id}`);
      const result = await res.json();
      if (result.status === 'success') {
        const v = result.data;
        
        let overrides: any = {};
        if (overrideData) {
          try {
            overrides = JSON.parse(decodeURIComponent(escape(atob(overrideData))));
          } catch (e) {}
        }

        setBillingData({
          name: overrides.name || overrides.owner || v.venueName || v.name || "",
          email: overrides.email || v.contactEmail || v.ownerEmail || v.email || "",
          mobile: overrides.phone || v.contactNumber || v.phoneNumber || v.phone || "",
          address: overrides.address || v.address || "",
          city: overrides.city || v.city || "",
          state: overrides.state || v.state || "",
          pincode: overrides.pincode || v.pincode || "",
          gstNumber: v.gstNumber || ""
        });
      }
    } catch (err) {
      console.error("Failed to fetch venue details for pre-fill:", err);
    }
  };

  // 3. Handle Pre-selected Plan
  useEffect(() => {
    if (prePlanId && plans.length > 0) {
      const p = plans.find(pl => pl.$id === prePlanId);
      if (p) {
        setSelectedPlan(p);
        // We are already at step 1 (Billing) now
      }
    }
  }, [prePlanId, plans]);

  const validateBilling = () => {
    if (!billingData.name || !billingData.email || !billingData.mobile || !billingData.address || !billingData.city || !billingData.state || !billingData.pincode) {
      alert("Please fill all required billing fields.");
      return false;
    }
    if (billingData.mobile.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return false;
    }
    return true;
  };

  const applyCoupon = async () => {
    if (!couponCode) return;
    setLoading(true);
    setCouponError("");
    try {
      const res = await fetch(`${serverUrl}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      });
      const result = await res.json();
      if (result.status === "success") {
        setAppliedCoupon(result.data);
      } else {
        setCouponError(result.message || "Invalid coupon code");
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedPlan) return { base: 0, addons: [], totalAddonPrice: 0, discount: 0, manualDiscount: 0, total: 0 };
    
    let base = 0;
    if (typeof selectedPlan.price === 'object') {
      const durationKey = preBillingDuration as 'quarterly' | 'halfYearly' | 'annually';
      base = selectedPlan.price[durationKey] || selectedPlan.price.annually || 0;
    } else {
      base = Number(selectedPlan.price) || 0;
    }

    const preAddonIds = preAddonId ? preAddonId.split(',') : [];
    const selectedAddons = addonsList.filter(a => preAddonIds.includes(a.id));
    const totalAddonPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    
    const subtotal = base + totalAddonPrice;

    const manualDiscountValue = preDiscount ? parseInt(preDiscount) : 0;
    
    let manualDiscountAmount = 0;
    if (preDiscountType === 'percent') {
        manualDiscountAmount = (subtotal * manualDiscountValue) / 100;
    } else {
        manualDiscountAmount = manualDiscountValue;
    }
    
    let couponDiscount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        couponDiscount = (subtotal * appliedCoupon.discountValue) / 100;
      } else {
        couponDiscount = appliedCoupon.discountValue;
      }
    }
    
    const totalDiscount = manualDiscountAmount + couponDiscount;
    const afterDiscount = Math.max(0, subtotal - totalDiscount);
    
    return {
      base,
      addons: selectedAddons,
      totalAddonPrice,
      discount: couponDiscount,
      manualDiscount: manualDiscountAmount,
      manualDiscountDisplay: preDiscountType === 'percent' ? `${manualDiscountValue}% off` : `Flat ₹${manualDiscountValue} off`,
      total: afterDiscount
    };
  };

  const totals = calculateTotal();

  const handlePayment = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    try {
        // 1. Create Order
        const orderRes = await fetch(`${serverUrl}/payments/create-order`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
              amount: Math.round(totals.total * 100), // convert to paise
              venueId: user?.prefs?.venueId || null,
              receipt: `rcpt_${Date.now()}`
           })
        });
        const order = await orderRes.json();
        
        if (order.error) {
           alert(order.message || "Order creation failed");
           setLoading(false);
           return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "PartyDial",
            description: `Payment for ${selectedPlan.name}`,
            order_id: order.id,
            handler: async (response: any) => {
                // Verify Payment
                try {
                    const verifyRes = await fetch(`${serverUrl}/payments/verify-payment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...response,
                            venueId: user?.prefs?.venueId,
                            venueName: user?.name || billingData.name,
                            ownerEmail: billingData.email,
                            planId: selectedPlan.$id,
                            planName: selectedPlan.name,
                            billingDuration: preBillingDuration,
                            amount: totals.total,
                            basePrice: totals.base,
                            addons: totals.addons,
                            discount: (totals.discount || 0) + (totals.manualDiscount || 0),
                            billingDetails: billingData,
                            couponUsed: appliedCoupon?.code || null
                        })
                    });
                    const result = await verifyRes.json();
                    if (result.status === 'success') {
                        setStep(3); // Success Step
                    } else {
                        alert("Payment verification failed. Contact support.");
                    }
                } catch (e) {
                    alert("Verification error.");
                }
            },
            prefill: {
                name: billingData.name,
                email: billingData.email,
                contact: billingData.mobile
            },
            theme: { color: "#b66dff" }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative max-w-xs mx-auto">
           {[1, 2].map((i) => (
             <div key={i} className="flex flex-col items-center z-10">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                  step >= i ? "grad-brand text-white shadow-lg" : "bg-white border-2 border-slate-200 text-slate-300"
                )}>
                  {step > i ? <CheckCircle2 size={20} /> : i}
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest mt-2",
                  step >= i ? "text-[#b66dff]" : "text-slate-300"
                )}>
                  {i === 1 ? 'Billing' : 'Review'}
                </span>
             </div>
           ))}
           <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-0" />
           <motion.div 
             className="absolute top-5 left-0 h-0.5 grad-brand -z-0" 
             initial={{ width: "0%" }}
             animate={{ width: `${((step - 1) / 1) * 100}%` }}
           />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Billing Details */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              {!selectedPlan && (
                <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl mb-8 flex items-center gap-4 text-rose-600">
                   <ShieldCheck size={24} />
                   <p className="text-sm font-bold uppercase tracking-tight">No plan selected. Please use a valid quotation link.</p>
                </div>
              )}
              <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                 <div className="bg-slate-900 p-8 text-white relative">
                    <div className="relative z-10">
                       <h2 className="text-2xl font-black tracking-tight">Billing Information</h2>
                       <p className="text-white/40 text-sm font-medium mt-1">Details for your tax-compliant invoice</p>
                    </div>
                    <MapPin size={60} className="absolute right-[-10px] top-[-10px] text-white/5 rotate-12" />
                 </div>                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                          <div className="relative">
                            <input 
                              type="text"
                              readOnly={isLocked}
                              value={billingData.name}
                              onChange={(e) => setBillingData({...billingData, name: e.target.value})}
                              className={cn("w-full h-14 border border-slate-200 rounded-xl px-5 pl-12 text-sm font-bold outline-none focus:border-[#b66dff] focus:bg-white transition-all", isLocked ? "bg-slate-100 text-slate-500" : "bg-slate-50 text-slate-800")}
                            />
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                          <div className="relative">
                            <input 
                              type="email"
                              readOnly={isLocked}
                              value={billingData.email}
                              onChange={(e) => setBillingData({...billingData, email: e.target.value})}
                              className={cn("w-full h-14 border border-slate-200 rounded-xl px-5 pl-12 text-sm font-bold outline-none focus:border-[#b66dff] focus:bg-white transition-all", isLocked ? "bg-slate-100 text-slate-500" : "bg-slate-50 text-slate-800")}
                            />
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile number</label>
                          <div className="relative">
                            <input 
                              type="tel"
                              maxLength={10}
                              readOnly={isLocked}
                              value={billingData.mobile}
                              onChange={(e) => setBillingData({...billingData, mobile: e.target.value})}
                              className={cn("w-full h-14 border border-slate-200 rounded-xl px-5 pl-12 text-sm font-bold outline-none focus:border-[#b66dff] focus:bg-white transition-all", isLocked ? "bg-slate-100 text-slate-500" : "bg-slate-50 text-slate-800")}
                            />
                            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">GST Number (Optional)</label>
                          <div className="relative">
                            <input 
                              type="text"
                              readOnly={isLocked}
                              value={billingData.gstNumber}
                              onChange={(e) => setBillingData({...billingData, gstNumber: e.target.value.toUpperCase()})}
                              className={cn("w-full h-14 border border-slate-200 rounded-xl px-5 pl-12 text-sm font-bold outline-none focus:border-[#b66dff] focus:bg-white transition-all uppercase", isLocked ? "bg-slate-100 text-slate-500" : "bg-slate-50 text-slate-800")}
                            />
                            <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Billing Address</label>
                       <textarea 
                          rows={2}
                          readOnly={isLocked}
                          value={billingData.address}
                          onChange={(e) => setBillingData({...billingData, address: e.target.value})}
                          className={cn("w-full border border-slate-200 rounded-xl p-5 text-sm font-bold outline-none focus:border-[#b66dff] focus:bg-white transition-all resize-none", isLocked ? "bg-slate-100 text-slate-500" : "bg-slate-50 text-slate-800")}
                       />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">City</label>
                          <input 
                            type="text"
                            readOnly={isLocked}
                            value={billingData.city}
                            onChange={(e) => setBillingData({...billingData, city: e.target.value})}
                            className={cn("w-full h-14 border border-slate-200 rounded-xl px-5 text-sm font-bold", isLocked ? "bg-slate-100 text-slate-500" : "bg-slate-50 text-slate-800")}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">State</label>
                          <input 
                            type="text"
                            readOnly={isLocked}
                            value={billingData.state}
                            onChange={(e) => setBillingData({...billingData, state: e.target.value})}
                            className={cn("w-full h-14 border border-slate-200 rounded-xl px-5 text-sm font-bold", isLocked ? "bg-slate-100 text-slate-500" : "bg-slate-50 text-slate-800")}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pincode</label>
                          <input 
                            type="text"
                            readOnly={isLocked}
                            value={billingData.pincode}
                            onChange={(e) => setBillingData({...billingData, pincode: e.target.value})}
                            className={cn("w-full h-14 border border-slate-200 rounded-xl px-5 text-sm font-bold", isLocked ? "bg-slate-100 text-slate-500" : "bg-slate-50 text-slate-800")}
                          />
                       </div>
                    </div>

                    <div className="pt-8 flex gap-4">
                       <button 
                          onClick={() => validateBilling() && setStep(2)}
                          disabled={!selectedPlan}
                          className="flex-1 h-16 grad-brand text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                       >
                          Review Summary <ChevronRight size={18} />
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Order Summary & Review */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 mb-8">
                 <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-800">Order Summary</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Verify and Pay</p>
                 </div>

                 <div className="p-8 space-y-6">
                    {/* Partner Review Section */}
                    <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4 mb-2 relative group">
                       <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-violet-500 shadow-sm">
                             <Building2 size={18} />
                          </div>
                          <div className="pr-8">
                             <p className="text-[11px] font-black uppercase tracking-widest text-slate-800">{billingData.name || "Venue Partner"}</p>
                             <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Verified Account</p>
                          </div>
                       </div>

                       <div className="space-y-3">
                          <div className="flex items-start gap-3">
                             <MapPin size={14} className="text-slate-300 mt-0.5" />
                             <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-600 leading-relaxed italic">{billingData.address || "No address provided"}</p>
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{billingData.city}, {billingData.state} - {billingData.pincode}</p>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100/50">
                             <div className="flex items-center gap-2 text-slate-500">
                                <Phone size={12} className="text-slate-300" />
                                <span className="text-[10px] font-black">{billingData.mobile}</span>
                             </div>
                             <div className="flex items-center gap-2 text-slate-500">
                                <Mail size={12} className="text-slate-300" />
                                <span className="text-[10px] font-black truncate">{billingData.email}</span>
                             </div>
                          </div>

                          {billingData.gstNumber && (
                            <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl w-fit border border-indigo-100">
                               <ShieldCheck size={12} />
                               <span className="text-[9px] font-black uppercase tracking-widest">GST: {billingData.gstNumber}</span>
                            </div>
                          )}
                       </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-sm font-black text-slate-700">{selectedPlan?.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                Plan Price • {preBillingDuration === 'quarterly' ? 'Quarterly' : preBillingDuration === 'halfYearly' ? 'Half-Yearly' : 'Annually'} 
                                 ({preBillingDuration === 'quarterly' ? '3 Months' : preBillingDuration === 'halfYearly' ? '6 Months' : '12 Months'})
                              </p>
                           </div>
                           <span className="text-sm font-black text-slate-800">₹{totals.base}</span>
                        </div>

                        {totals.addons?.map((addon: any) => (
                          <div key={addon.id} className="flex items-center justify-between animate-in fade-in slide-in-from-right-2">
                             <div>
                                <p className="text-sm font-black text-slate-700">{addon.name}</p>
                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Add-on Service</p>
                             </div>
                             <span className="text-sm font-black text-slate-800">₹{addon.price}</span>
                          </div>
                        ))}
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-3 pt-6 border-t border-slate-50">
                       <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                          <span>Subtotal <span className="text-[8px] lowercase italic ml-1">(Include GST)</span></span>
                          <span>₹{(totals.base + (totals.totalAddonPrice || 0)).toFixed(2)}</span>
                       </div>
                       {totals.manualDiscount > 0 && (
                         <div className="flex items-center justify-between text-xs font-bold text-rose-500">
                            <span>Quotation Discount ({totals.manualDiscountDisplay})</span>
                            <span>-₹{totals.manualDiscount.toFixed(2)}</span>
                         </div>
                       )}
                       {totals.discount > 0 && (
                         <div className="flex items-center justify-between text-xs font-bold text-emerald-500">
                            <span>Coupon ({appliedCoupon?.code})</span>
                            <span>-₹{totals.discount}</span>
                         </div>
                       )}

                       <div className="pt-4 flex items-center justify-between">
                          <span className="text-base font-black text-slate-800">Amount Due</span>
                          <span className="text-2xl font-black text-[#b66dff]">₹{totals.total.toFixed(2)}</span>
                       </div>
                    </div>

                    <button 
                       disabled={loading}
                       onClick={handlePayment}
                       className="w-full h-16 grad-brand text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                    >
                       {loading ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
                       Complete Safe Payment
                    </button>
                    
                    <button 
                       onClick={() => setStep(1)}
                       className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors py-2"
                    >
                       Edit Billing Details
                    </button>
                 </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-slate-400">
                 <ShieldCheck size={20} />
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Secure 256-bit Encrypted Checkout</p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success Message */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                 <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-4">Payment Successful!</h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Your subscription has been activated. A tax invoice has been sent to 
                <span className="font-bold text-slate-700"> {billingData.email}</span>.
              </p>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl mb-8">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Recipient</span>
                    <span className="text-xs font-black text-slate-700">{billingData.name}</span>
                 </div>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Transaction ID</span>
                    <span className="text-xs font-black text-slate-700">TXN-{Date.now().toString().slice(-6)}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Activation</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-black uppercase">Instant</span>
                 </div>
              </div>
              <button 
                onClick={() => window.location.href = "/dashboard"}
                className="w-full h-16 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Enter Dashboard <ArrowRight size={18} className="inline ml-2" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .grad-brand {
          background: linear-gradient(135deg, #b66dff 0%, #fe7096 100%);
        }
      `}</style>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
