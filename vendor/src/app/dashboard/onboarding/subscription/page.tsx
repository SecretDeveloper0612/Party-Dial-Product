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
    packName: '1-MONTH TRIAL',
    pax: 'LIMITED TIME OFFER',
    mrp: '14,999',
    price: '11',
    save: '99%',
    desc: 'Unlock full platform access and start receiving live event leads instantly.',
    features: [
      'Unlimited Lead Access',
      'Direct WhatsApp Alerts',
      'Verified Customer Inquiries',
      'Priority Support',
      'Valid for 30 Days'
    ],
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

  const isOfferValid = true; // Hardcoded to true as this is the primary plan now

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
            isVerified: false
          }
        );
      }

      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('onboardingCompletedAt', new Date().toISOString());
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

    // Payment Logic
    const plan = plans[0];
    const totalAmount = 11;
    const amountInPaise = 1100;

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
        description: `${plan.name} Activation`,
        image: "https://partydial.com/logo.png",
        order_id: order.id,
        handler: async function (response: any) {
          if (response.razorpay_payment_id) {
            try {
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
                  planName: plan.name,
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
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2 italic">Official Partner</span>
                <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter bg-blue-50 px-8 py-4 rounded-2xl border border-blue-100/50 shadow-sm">{venueName}</h2>
             </div>
           )}
           <h1 className="text-4xl font-extrabold text-slate-900 uppercase italic mb-4 tracking-tighter">Activate Your <span className="pd-gradient-text uppercase">Storefront</span></h1>
           <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed italic">
             Get listed on India&apos;s fastest growing venue platform. Start receiving verified event leads for just ₹11.
           </p>
        </header>

        <div className="max-w-xl mx-auto mb-12">
           {plans.map((plan, i) => (
             <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-10 rounded-[45px] border cursor-pointer group transition-all duration-500 hover:scale-[1.03] ${plan.color} ${
                  selectedPlan === plan.id ? 'ring-2 ring-pd-pink ring-offset-8 ring-offset-slate-50 shadow-2xl shadow-pd-pink/10' : 'shadow-pd-soft'
                }`}
             >
                <div className="absolute top-6 right-6">
                   <span className="bg-pd-pink text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                     Save {plan.save}
                   </span>
                </div>

                <div className="mb-8">
                   <div className="flex flex-col mb-4">
                      <h3 className="text-2xl font-[900] text-slate-900 leading-tight tracking-tight uppercase italic mb-1">{plan.name}</h3>
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-pd-purple">{plan.packName}</span>
                   </div>
                   <p className="text-xs font-medium leading-relaxed italic text-slate-500">{plan.desc}</p>
                </div>

                <div className="mb-10">
                   <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-5xl font-black italic tracking-tighter text-slate-900">₹{plan.price}</span>
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">/ Activation</span>
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60">
                      Standard Price: <span className="line-through">₹{plan.mrp}</span> · One-time fee for 30 days
                   </p>
                </div>

                <div className="mb-8 p-6 rounded-[30px] bg-slate-50 border border-slate-100 group-hover:bg-white transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-pd-pink fill-pd-pink" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Benefits Included</span>
                  </div>
                  <p className="text-2xl font-black italic bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
                     Unlimited Direct Leads
                  </p>
                </div>

                <ul className="space-y-4 mb-12">
                   {plan.features.map((feature, idx) => (
                     <li key={idx} className="flex items-center gap-3">
                        <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                        <span className="text-xs font-bold italic tracking-tight text-slate-600">{feature}</span>
                     </li>
                   ))}
                </ul>

                <button 
                  disabled={currentPlan === plan.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentPlan === plan.id) return;
                    setShowConfirmModal(true);
                  }}
                  className={`w-full py-6 rounded-3xl text-sm font-black uppercase tracking-[0.2em] italic transition-all active:scale-95 flex items-center justify-center gap-3 ${
                    currentPlan === plan.id 
                      ? 'bg-emerald-500 text-white cursor-default shadow-emerald-200/50 shadow-lg' 
                      : 'bg-slate-900 text-white shadow-xl hover:bg-pd-pink group'
                  }`}
                >
                   {currentPlan === plan.id ? (
                      <>
                        <ShieldCheck size={18} /> Plan Already Active
                      </>
                   ) : (
                      <>
                        Activate My Venue
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                   )}
                </button>
             </motion.div>
           ))}
        </div>

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
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 border border-emerald-100 shadow-sm">
                      <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Secure Activation</h2>
                    <p className="text-slate-500 font-medium italic">Finalize your {plans[0].name} activation.</p>
                  </header>

                  <div className="space-y-6 mb-10">
                    <div className="p-8 bg-slate-50 rounded-[35px] border border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">One-Time Fee</span>
                        <span className="text-xl font-black italic text-slate-900">₹11.00</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Gateway Processing</span>
                        <span className="text-sm font-bold italic">FREE</span>
                      </div>
                      <div className="h-px bg-slate-200 mb-4" />
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 italic">Total Amount</span>
                        <span className="text-3xl font-black italic text-pd-pink">₹11.00</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                        <CardIcon size={24} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-blue-900 leading-none mb-1.5">Razorpay Secure</p>
                        <p className="text-[9px] font-bold text-blue-700/60 uppercase tracking-widest leading-none">Instant Activation Guaranteed</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setShowConfirmModal(false);
                      handleActivate();
                    }}
                    disabled={isSaving}
                    className="w-full h-16 bg-slate-900 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] italic hover:bg-pd-pink transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 group"
                  >
                    {isSaving ? (
                       <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Pay Now & Launch
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-center mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Encrypted Payment Processing</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
