'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  ZapOff,
  X,
  CreditCard as CardIcon
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

const plans = [
  {
    id: 'trial_30',
    name: 'Introductory Offer',
    packName: 'LIMITED TIME',
    pax: 'EXPIRES 30 APRIL',
    mrp: '11',
    price: '11',
    save: '0%',
    desc: 'Special offer valid until April 30, 2026',
    features: ['Offer Purchase Till 20 April', 'Full Platform Access', 'Valid Until 30 April 2026', 'Direct Lead Alerts'],
    color: 'bg-white border-pd-pink/20 text-slate-900',
    btnColor: 'bg-pd-pink shadow-pd-pink/20',
    isTrial: true
  },
];


export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('trial_30');
  const [isSaving, setIsSaving] = useState(false);
  const [venueName, setVenueName] = useState('');
  const [venueId, setVenueId] = useState('');
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isOfferValid = new Date() < new Date('2026-04-20T23:59:59');

  React.useEffect(() => {
    const fetchConfig = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
        const serverUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
        const res = await fetch(`${serverUrl}/config`);
        const result = await res.json();
        if (result.status === 'success' && result.razorpayKeyId) {
          setRazorpayKeyId(result.razorpayKeyId);
        }
      } catch (err) {
        console.error('Fetch config error:', err);
      }
    };
    fetchConfig();

    const fetchVenue = async () => {
      const userJson = localStorage.getItem('user');
      if (!userJson) return;
      const user = JSON.parse(userJson);

      try {
        const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
        const { Query } = await import('appwrite');
        const result = await databases.listDocuments(DATABASE_ID, VENUES_COLLECTION_ID, [
          Query.equal('userId', user.$id)
        ]);
        if (result.documents.length > 0) {
          const doc = result.documents[0];
          setVenueName(doc.venueName || '');
          setVenueId(doc.$id);
          setCurrentPlan(doc.subscriptionPlan || null);

          // ── TRIGGER DAY 0 PAYMENT REMINDER ──
          // Triggered immediately when reaching this step
          const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
          const serverUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
          fetch(`${serverUrl}/venues/notify-onboarding`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ venueId: doc.$id })
          }).catch(e => console.error('Onboarding notify error:', e));
        }
      } catch (err) {
        console.error('Fetch venue error:', err);
      }
    };
    fetchVenue();
  }, []);

  const updateProfile = async () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return;
    const user = JSON.parse(userJson);

    setIsSaving(true);
    try {
      const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
      const { Query } = await import('appwrite');
      
      const result = await databases.listDocuments(
        DATABASE_ID,
        VENUES_COLLECTION_ID,
        [Query.equal('userId', user.$id)]
      );
      
      if (result.documents.length > 0) {
        const docId = result.documents[0].$id;
        await databases.updateDocument(
          DATABASE_ID,
          VENUES_COLLECTION_ID,
          docId,
          {
            subscriptionPlan: selectedPlan,
            onboardingComplete: true,
            status: 'pending',
            isVerified: false,
            isPaid: selectedPlan !== 'free'
          }
        );
      }

      localStorage.setItem('onboardingComplete', 'true');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Finalize error:', err);
      alert(`Error: ${err.message || 'Network error while finalizing account.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleActivate = async () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userJson);

    if (selectedPlan === 'free') {
       await updateProfile();
       return;
    }

    // Payment Logic
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    let totalAmount = 0;
    if (selectedPlan === 'trial_30') {
      totalAmount = 11; // Flat 11 rupee for introductory offer
    } else {
      totalAmount = parseInt(plan.price.replace(',', '')) * 365;
    }

    const amountInPaise = selectedPlan === 'trial_30' ? 1100 : Math.round(totalAmount * 1.18 * 100);

    try {
      setIsSaving(true);
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
      const serverUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      
      const orderRes = await fetch(`${serverUrl}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: amountInPaise, 
          venueId: venueId,
          receipt: `sub_${user.$id.slice(-6)}_${Date.now()}` 
        })
      });

      if (!orderRes.ok) throw new Error('Failed to create payment order');
      const order = await orderRes.json();

      const options = {
        key: razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Sb1MDU5xx48aKw',
        amount: order.amount,
        currency: order.currency,
        name: "PartyDial Partner",
        description: `${plan.name} - Valid until 30 April`,
        image: "https://partydial.com/logo.png",
        order_id: order.id,
        handler: async function (response: any) {
          if (response.razorpay_payment_id) {
            try {
              // Verify on server + store payment record
              await fetch(`${serverUrl}/payments/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  venueId: venueId,
                  venueName: venueName,
                  ownerEmail: user.email,
                  planId: selectedPlan,
                  planName: plan?.name || selectedPlan,
                  amount: totalAmount,
                }),
              });
            } catch (e) {
              console.warn('Payment record sync failed:', e);
            }
            await updateProfile();
          }
        },
        prefill: {
          name: venueName,
          email: user.email,
          contact: ""
        },
        theme: {
          color: "#FF1E56"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment Failed: " + response.error.description);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Razorpay Error:", err);
      alert(`Payment Error: ${err.message || "Could not initialize checkout."}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-pd py-12 px-6">
      <Script 
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 group-hover:border-slate-900 transition-all">
              <ChevronLeft size={18} />
            </div>
            <span className="text-sm font-bold italic">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
             <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="w-full h-full bg-pd-pink"></div>
             </div>
             <span className="text-[10px] font-black uppercase text-slate-400">Step 4 of 4</span>
          </div>
        </div>

        <header className="mb-16 text-center">
           {venueName && (
             <div className="mb-4 inline-block">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2 italic">Executive Briefing</span>
                <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter bg-blue-50 px-8 py-4 rounded-2xl border border-blue-100/50 shadow-sm">{venueName}</h2>
             </div>
           )}
           <h1 className="text-4xl font-extrabold text-slate-900 uppercase italic mb-4 tracking-tighter">Choose Your <span className="pd-gradient-text uppercase">Success Plan</span></h1>
           <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed italic">
             {isOfferValid 
               ? "Select a package that fits your business goals. You can upgrade or downgrade anytime."
               : "This introductory offer has expired. Please contact support for regular plans."
             }
           </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 max-w-lg mx-auto gap-8 mb-12">
           {plans.map((plan, i) => (
             <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-10 rounded-[45px] border cursor-pointer group transition-all duration-500 hover:scale-[1.03] ${plan.color} ${
                  selectedPlan === plan.id ? 'ring-2 ring-pd-pink ring-offset-8 ring-offset-slate-50 shadow-2xl' : 'shadow-pd-soft'
                }`}
             >


                {plan.save && plan.save !== '0%' && (
                  <div className="absolute top-6 right-6">
                     <span className="bg-[#6366F1] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                       Save {plan.save}
                     </span>
                  </div>
                )}

                <div className="mb-8 overflow-visible">
                   <div className="flex flex-col mb-4">
                      <h3 className="text-xl font-[900] text-slate-900 leading-tight tracking-tight uppercase italic mb-1">{plan.name}</h3>
                      {plan.packName && <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${plan.id === 'pax_100_200' ? 'text-white/60' : 'text-pd-purple'}`}>{plan.packName}</span>}
                   </div>
                   <p className={`text-xs font-medium leading-relaxed italic ${plan.id === 'free' ? 'text-slate-500' : 'text-white/60'}`}>{plan.desc}</p>
                </div>

                <div className="mb-10">
                   <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-black italic">₹{plan.price}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${plan.id === 'pax_100_200' ? 'text-white/40' : 'text-slate-400'}`}>/ {plan.id === 'trial_30' ? 'Package' : 'Day'}</span>
                   </div>
                   {plan.id !== 'free' && (
                     <p className={`text-[9px] font-black uppercase tracking-widest opacity-60 ${plan.id === 'pax_100_200' ? 'text-white' : 'text-slate-400'}`}>
                        Total: ₹{plan.id === 'trial_30' ? '11' : (parseInt(plan.price.replace(',', '')) * 365).toLocaleString('en-IN')} {plan.id === 'trial_30' ? 'Fixed' : '/ Year'}{plan.id !== 'trial_30' && <span className="text-[7px] italic"> (Incl. 18% GST)</span>}
                     </p>
                   )}
                </div>

                <div className={`mb-8 p-4 rounded-2xl border transition-colors ${plan.id === 'pax_100_200' ? 'bg-white/10 border-white/20' : 'bg-slate-50/50 border-slate-100 group-hover:bg-white'}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Zap size={14} className={plan.id === 'pax_100_200' ? 'text-white fill-white' : 'text-pink-500 fill-pink-500'} />
                    <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${plan.id === 'pax_100_200' ? 'text-white/60' : 'text-slate-400'}`}>
                       {plan.id === 'trial_30' ? 'Introductory Period' : 'Valid for 1 Year'}
                    </span>
                  </div>
                  <p className={`text-xl font-black italic leading-none ${plan.id === 'pax_100_200' ? 'text-white' : 'bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent'}`}>
                     {plan.id === 'trial_30' ? 'Offer Available Till 20 April' : 'Unlimited Leads'}
                  </p>
                </div>

                <ul className="space-y-5 mb-12">
                   {plan.features.map((feature, idx) => (
                     <li key={idx} className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-emerald-500" />
                        <span className={`text-xs font-bold italic tracking-tight ${
                          plan.id === 'pax_100_200' ? 'text-white/90' : 'text-slate-600'
                        }`}>{feature}</span>
                     </li>
                   ))}
                </ul>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentPlan === plan.id) {
                      router.push('/dashboard');
                      return;
                    }
                    if (isOfferValid) {
                      setShowConfirmModal(true);
                    } else {
                      alert("This offer has expired as of April 20th.");
                    }
                  }}
                  disabled={!isOfferValid && currentPlan !== plan.id}
                  className={`w-full py-5 rounded-[22px] text-[10px] font-black uppercase tracking-[0.25em] italic transition-all active:scale-95 ${
                    currentPlan === plan.id
                      ? 'bg-emerald-500 text-white'
                      : !isOfferValid 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-slate-900 text-white'
                  } shadow-xl`}
                >
                   {currentPlan === plan.id ? "Plan Active - Go to Dashboard" : (isOfferValid ? `Select ${plan.name}` : "OFFER EXPIRED")}
                </button>
             </motion.div>
           ))}
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfirmModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col pt-12"
              >
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="px-10 pb-10">
                  <header className="mb-10">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
                      <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Confirm Order</h2>
                    <p className="text-slate-500 font-medium italic">You are subscribing to the {plans[0].name}.</p>
                  </header>

                  <div className="space-y-6 mb-10">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Base Subscription Fee</span>
                        <span className="text-xl font-black italic text-slate-900">₹{plans[0].price}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest italic">{selectedPlan === 'trial_30' ? 'Tax' : 'GST (18%)'}</span>
                        <span className="text-sm font-bold italic">₹{selectedPlan === 'trial_30' ? '0.00' : (parseFloat(plans[0].price) * 0.18).toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-slate-200 mb-4" />
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Total Payable</span>
                        <span className="text-2xl font-black italic text-pd-pink">₹{selectedPlan === 'trial_30' ? '11.00' : (parseFloat(plans[0].price) * 1.18).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                        <CardIcon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-900 leading-none mb-1">Secure Checkout</p>
                        <p className="text-[9px] font-bold text-blue-700/60 uppercase tracking-widest leading-none">Powered by Razorpay</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setShowConfirmModal(false);
                      handleActivate();
                    }}
                    disabled={isSaving}
                    className="w-full h-16 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] italic hover:bg-pd-pink transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                  >
                    {isSaving ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Pay Now & Activate
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                  <p className="text-center mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Secure & SSL Encrypted Payment Process</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
