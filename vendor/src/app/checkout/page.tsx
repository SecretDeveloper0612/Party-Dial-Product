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
  price: number;
  description: string;
  duration?: string;
}

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
  const preGst = searchParams.get('gst');
  const partnerDetailsEncoded = searchParams.get('partnerDetails');
  
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

    // 2. Check Session
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
  }, []);

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
        setStep(2); // Skip to billing if plan is pre-selected
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
    if (!selectedPlan) return { base: 0, discount: 0, gst: 0, total: 0 };
    const base = selectedPlan.price;
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = (base * appliedCoupon.discountValue) / 100;
      } else {
        discount = appliedCoupon.discountValue;
      }
    }
    const afterDiscount = Math.max(0, base - discount);
    
    return {
      base,
      discount,
      gst: 0,
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
                            amount: totals.total,
                            billingDetails: billingData,
                            couponUsed: appliedCoupon?.code || null
                        })
                    });
                    const result = await verifyRes.json();
                    if (result.status === 'success') {
                        setStep(4); // Success Step
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
        <div className="flex items-center justify-between mb-12 relative max-w-lg mx-auto">
           {[1, 2, 3].map((i) => (
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
                  {i === 1 ? 'Details' : i === 2 ? 'Billing' : 'Review'}
                </span>
             </div>
           ))}
           <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-0" />
           <motion.div 
             className="absolute top-5 left-0 h-0.5 grad-brand -z-0" 
             initial={{ width: "0%" }}
             animate={{ width: `${((step - 1) / 2) * 100}%` }}
           />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Account / Plan Selection */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                 <h2 className="text-3xl font-black text-slate-800 tracking-tight">Select Subscription Plan</h2>
                 <p className="text-slate-400 font-medium mt-2">Choose the best plan for your business growth</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((p) => (
                  <button 
                    key={p.$id}
                    onClick={() => setSelectedPlan(p)}
                    className={cn(
                      "p-8 bg-white border-2 rounded-[2rem] text-left transition-all relative overflow-hidden group",
                      selectedPlan?.$id === p.$id ? "border-[#b66dff] shadow-2xl shadow-purple-500/10" : "border-slate-100 hover:border-slate-300"
                    )}
                  >
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-[#b66dff] group-hover:scale-110 transition-transform">
                          <Zap size={24} />
                       </div>
                       {selectedPlan?.$id === p.$id && <CheckCircle2 className="text-[#b66dff]" size={24} />}
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">{p.name}</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">{p.description}</p>
                    <div className="flex items-baseline gap-1">
                       <span className="text-3xl font-black text-slate-900">₹{p.price}</span>
                       <span className="text-xs font-bold text-slate-400">/ {p.duration || 'Year'}</span>
                    </div>
                    {selectedPlan?.$id === p.$id && (
                      <div className="absolute top-0 right-0 grad-brand px-4 py-1 text-[9px] font-black text-white uppercase tracking-widest rounded-bl-xl shadow-lg">
                        Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-center mt-12">
                 <button 
                    disabled={!selectedPlan}
                    onClick={() => setStep(2)}
                    className="px-12 h-16 grad-brand text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-purple-500/20 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-30"
                 >
                    Next Session <ArrowRight size={20} />
                 </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Billing Details */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
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
                          onClick={() => setStep(1)}
                          className="flex-1 h-16 bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                       >
                          <ArrowLeft size={16} /> Back
                       </button>
                       <button 
                          onClick={() => validateBilling() && setStep(3)}
                          className="flex-[2] h-16 grad-brand text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                       >
                          Review Summary <ChevronRight size={18} />
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Order Summary & Review */}
          {step === 3 && (
            <motion.div 
              key="step3"
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
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="text-sm font-black text-slate-700">{selectedPlan?.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Plan Price</p>
                       </div>
                       <span className="text-sm font-black text-slate-800">₹{totals.base}</span>
                    </div>



                    {/* Breakdown */}
                    <div className="space-y-3 pt-6 border-t border-slate-50">
                       <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                          <span>Subtotal <span className="text-[8px] lowercase italic ml-1">(Include GST)</span></span>
                          <span>₹{totals.base}</span>
                       </div>
                       {totals.discount > 0 && (
                         <div className="flex items-center justify-between text-xs font-bold text-emerald-500">
                            <span>Discount ({appliedCoupon?.code})</span>
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
                       onClick={() => setStep(2)}
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

          {/* Step 4: Success Message */}
          {step === 4 && (
            <motion.div 
              key="step4"
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
