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
  ZapOff
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

const plans = [
  {
    id: 'trial_30',
    name: '1-Month Trial',
    packName: 'INTRO PACK',
    pax: '30-DAY ACCESS',
    mrp: '11',
    price: '11',
    save: '0%',
    desc: 'One month introductory offer',
    features: ['Valid for 30 Days', 'Full Platform Access', 'Direct Lead Alerts', 'Max 3 Photos'],
    color: 'bg-white border-pd-pink/20 text-slate-900',
    btnColor: 'bg-pd-pink shadow-pd-pink/20',
    isTrial: true
  },
  {
    id: 'pax_0_50',
    name: 'UPTO 50 PAX',
    packName: 'STARTER PACK',
    pax: 'UPTO 50 PAX',
    mrp: '41',
    price: '33',
    save: '20%',
    desc: 'Billed annually',
    features: ['Basic listing visibility', 'Standard search placement', 'Lead notifications (App + Email)', 'Upload up to 10 photos', 'Basic customer support'],
    color: 'bg-white border-slate-100 text-slate-900',
    btnColor: 'bg-slate-900 shadow-slate-900/10'
  },
  {
    id: 'pax_50_100',
    name: '50–100 PAX',
    packName: 'GROWTH PACK',
    pax: '50–100 PAX',
    mrp: '55',
    price: '44',
    save: '20%',
    desc: 'Billed annually',
    features: ['Improved listing visibility', 'WhatsApp lead alerts', 'Standard placement in search', 'Upload up to 20 photos', 'Basic analytics dashboard'],
    color: 'bg-white border-slate-100 text-slate-900',
    btnColor: 'bg-slate-900 shadow-slate-900/10'
  },
  {
    id: 'pax_100_200',
    name: '100–200 PAX',
    packName: 'PRIORITY PACK',
    pax: '100–200 PAX',
    mrp: '96',
    price: '77',
    save: '20%',
    desc: 'Billed annually',
    features: ['Priority listing in search results', 'WhatsApp notifications', 'Lead insights dashboard', 'Faster lead delivery', 'Upload up to 30 photos'],
    popular: true,
    color: 'pd-gradient border-transparent text-white',
    btnColor: 'bg-white text-pd-pink shadow-white/20',
  },
  {
    id: 'pax_200_500',
    name: '200–500 PAX',
    packName: 'FEATURED PACK',
    pax: '200–500 PAX',
    mrp: '156',
    price: '123',
    save: '21%',
    desc: 'Billed annually',
    features: ['Featured placement in listings', 'Priority visibility in search', 'Lead filtering system', 'Priority customer support', 'Upload up to 40 photos'],
    color: 'bg-white border-slate-100 text-slate-900',
    btnColor: 'bg-slate-900 shadow-slate-900/10'
  },
  {
    id: 'pax_500_1000',
    name: '500–1000 PAX',
    packName: 'PREMIUM PACK',
    pax: '500–1000 PAX',
    mrp: '219',
    price: '179',
    save: '18%',
    desc: 'Billed annually',
    features: ['Premium placement in listings', 'High visibility ranking', 'Faster lead routing', 'Advanced analytics', 'Upload up to 50 photos'],
    color: 'bg-white border-slate-100 text-slate-900',
    btnColor: 'bg-slate-900 shadow-slate-900/10'
  },
  {
    id: 'pax_1000_2000',
    name: '1000–2000 PAX',
    packName: 'ELITE PACK',
    pax: '1000–2000 PAX',
    mrp: '301',
    price: '249',
    save: '17%',
    desc: 'Billed annually',
    features: ['Top city visibility', 'Premium ranking placement', 'Advanced lead analytics', 'Priority lead routing', 'Upload up to 60 photos'],
    color: 'bg-white border-slate-100 text-slate-900',
    btnColor: 'bg-slate-900 shadow-slate-900/10'
  },
  {
    id: 'pax_2000_5000',
    name: '2000–5000 PAX',
    packName: 'PLATINUM PACK',
    pax: '2000–5000 PAX',
    mrp: '493',
    price: '379',
    save: '23%',
    desc: 'Billed annually',
    features: ['High priority ranking', 'Dedicated support assistance', 'Premium listing visibility', 'Advanced reporting dashboard', 'Upload up to 75 photos'],
    color: 'bg-white border-slate-100 text-slate-900',
    btnColor: 'bg-slate-900 shadow-slate-900/10'
  },
  {
    id: 'pax_5000',
    name: '5000+ PAX',
    packName: 'ENTERPRISE PACK',
    pax: '5000+ PAX',
    mrp: '822',
    price: '599',
    save: '27%',
    desc: 'Billed annually',
    features: ['Exclusive lead priority', 'Dedicated account manager', 'Highest visibility ranking', 'Custom promotional support', 'Unlimited photo uploads'],
    color: 'bg-white border-slate-100 text-slate-900',
    btnColor: 'bg-slate-900 shadow-slate-900/10'
  }
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('trial_30');
  const [isSaving, setIsSaving] = useState(false);
  const [venueName, setVenueName] = useState('');
  const [razorpayKeyId, setRazorpayKeyId] = useState('');

  React.useEffect(() => {
    const fetchConfig = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-server-koo2.onrender.com/api';
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
          setVenueName(result.documents[0].venueName || '');
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
      totalAmount = 11; // Flat 11 rupee for 1 month trial
    } else {
      totalAmount = parseInt(plan.price.replace(',', '')) * 365;
    }

    const amountInPaise = Math.round(totalAmount * (selectedPlan === 'trial_30' ? 1 : 1.18) * 100);

    try {
      setIsSaving(true);
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-server-koo2.onrender.com/api';
      
      const orderRes = await fetch(`${serverUrl}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: amountInPaise, 
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
        description: `${plan.name} - Annual Subscription`,
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
                  venueId: '', // filled server-side via updateProfile
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
           <div className="mt-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-6 italic">
              <ShieldCheck size={14} /> 1-Month Trial & Annual Premium plans available
           </div>
           <h1 className="text-4xl font-extrabold text-slate-900 uppercase italic mb-4 tracking-tighter">Choose Your <span className="pd-gradient-text uppercase">Success Plan</span></h1>
           <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed italic">Select a package that fits your business goals. You can upgrade or downgrade anytime.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                {plan.popular && (
                  <div className="absolute -top-4 left-10 bg-pd-pink text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full shadow-lg italic z-10">
                     <Star size={12} fill="currentColor" className="inline mr-1" /> Most Popular
                  </div>
                )}

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
                   {plan.mrp !== '0' && <p className="text-sm text-slate-400 line-through font-medium leading-none mb-1">₹{plan.mrp}</p>}
                   <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-black italic">₹{plan.price}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${plan.id === 'pax_100_200' ? 'text-white/40' : 'text-slate-400'}`}>/ {plan.id === 'trial_30' ? 'Month' : 'Day'}</span>
                   </div>
                   {plan.id !== 'free' && (
                     <p className={`text-[9px] font-black uppercase tracking-widest opacity-60 ${plan.id === 'pax_100_200' ? 'text-white' : 'text-slate-400'}`}>
                        Total: ₹{plan.id === 'trial_30' ? '11' : (parseInt(plan.price.replace(',', '')) * 365).toLocaleString('en-IN')} {plan.id === 'trial_30' ? '/ Month' : '/ Year'} <span className="text-[7px] italic">(Excl. GST)</span>
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
                     {plan.id === 'trial_30' ? '30 Full Days' : 'Unlimited Leads'}
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

                <button className={`w-full py-5 rounded-[22px] text-[10px] font-black uppercase tracking-[0.25em] italic transition-all active:scale-95 ${
                  plan.id === 'pax_100_200' ? 'bg-white text-pd-pink' : 'bg-slate-900 text-white'
                } shadow-xl`}>
                   Select {plan.name}
                </button>
             </motion.div>
           ))}
        </div>

        {/* Comparison Summary / Bottom CTA */}
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-pd-soft">
           <div className="flex items-center gap-8">
              <div className="flex -space-x-4">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white bg-slate-100 overflow-hidden shadow-pd-soft">
                       <img src={`https://i.pravatar.cc/100?u=${i + 60}`} alt="User" />
                    </div>
                 ))}
              </div>
              <div>
                 <p className="text-sm font-black text-slate-900 italic mb-1 uppercase tracking-tighter">Secured with SSL Encryption</p>
                 <p className="text-xs text-slate-500 font-medium italic">Payments are processed through a 100% secure gateway.</p>
              </div>
           </div>
           
            <div className="flex items-center gap-6">
                 <div className="flex flex-col items-end">
                    {selectedPlan !== 'trial_30' && (
                      <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-60">
                        <span>Daily: ₹{plans.find(p => p.id === selectedPlan)?.price}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        <span>Annual Total: ₹{(parseInt(plans.find(p => p.id === selectedPlan)?.price.replace(',', '') || '0') * 365).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                       <span className="text-4xl font-black italic text-slate-900">
                          ₹{selectedPlan === 'trial_30' ? '11' : Math.round(parseInt(plans.find(p => p.id === selectedPlan)?.price.replace(',', '') || '0') * 365 * 1.18).toLocaleString('en-IN')}
                       </span>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPlan === 'trial_30' ? 'text-slate-400' : 'text-emerald-500'}`}>
                          {selectedPlan === 'trial_30' ? 'Flat Fee (No GST)' : 'Incl. 18% GST (Annual)'}
                       </span>
                    </div>
                 </div>
               <button 
                  onClick={handleActivate}
                  disabled={isSaving}
                  className="pd-btn-primary min-w-[240px] flex items-center justify-center gap-3 italic tracking-normal uppercase text-[11px] font-black h-14"
               >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Activate Account
                      <Zap size={18} />
                    </>
                  )}
               </button>
            </div>

        </div>
      </div>
    </div>
  );
}
