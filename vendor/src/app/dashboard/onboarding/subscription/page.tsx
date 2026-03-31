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

const plans = [
  {
    id: 'free',
    name: 'Free Starter',
    price: '0',
    desc: 'Perfect for small venues testing the platform.',
    features: ['Up to 5 Leads / Month', 'Standard Profile', 'Basic Phone Support', 'Limited Photos'],
    color: 'bg-slate-50 border-slate-100 text-slate-900',
    btnColor: 'bg-slate-900 shadow-slate-900/10'
  },
  {
    id: 'premium',
    name: 'Premium Partner',
    price: '1,499',
    desc: 'Ideal for hotels and halls looking for more business.',
    features: ['Unlimited Leads', 'Verified Badge', 'Featured in Search', 'Unlimited Photo Gallery', 'Priority Support'],
    popular: true,
    color: 'pd-gradient border-transparent text-white',
    btnColor: 'bg-white text-pd-pink shadow-white/20',
  },
  {
    id: 'platinum',
    name: 'Platinum Plus',
    price: '2,999',
    desc: 'For top-tier venues looking to dominate their city.',
    features: ['Priority Profile Boost', 'Social Media Promotions', 'Dedicated Account Manager', 'Advanced Analytics'],
    color: 'bg-slate-900 border-slate-900 text-white',
    btnColor: 'bg-pd-pink shadow-pd-pink/20'
  }
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [isSaving, setIsSaving] = useState(false);

  const handleActivate = async () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      router.push('/login');
      return;
    }
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
            status: 'active'
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

  return (
    <div className="min-h-screen bg-slate-50 font-pd py-12 px-6">
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
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-6 italic">
              <ShieldCheck size={14} /> 7-Day Free Trial on all Premium plans
           </div>
           <h1 className="text-4xl font-extrabold text-slate-900 uppercase italic mb-4 tracking-tighter">Choose Your <span className="pd-gradient-text uppercase">Success Plan</span></h1>
           <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed italic">Select a package that fits your business goals. You can upgrade or downgrade anytime.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
                  <div className="absolute -top-4 right-10 bg-pd-pink text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full shadow-lg italic">
                     Most Popular
                  </div>
                )}

                <div className="mb-8">
                   <h3 className="text-xl font-black italic tracking-tight mb-2 uppercase">{plan.name}</h3>
                   <p className={`text-xs font-medium leading-relaxed italic ${plan.id === 'free' ? 'text-slate-500' : 'text-white/60'}`}>{plan.desc}</p>
                </div>

                <div className="mb-10 flex items-baseline gap-1">
                   <span className="text-4xl font-black italic">₹{plan.price}</span>
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${plan.id === 'free' ? 'text-slate-400' : 'text-white/40'}`}>/ Month</span>
                </div>

                <ul className="space-y-5 mb-12">
                   {plan.features.map((feature, idx) => (
                     <li key={idx} className="flex items-center gap-3">
                        <CheckCircle2 size={18} className={plan.id === 'free' ? 'text-emerald-500' : 'text-emerald-400'} />
                        <span className={`text-xs font-bold italic tracking-tight ${plan.id === 'free' ? 'text-slate-600' : 'text-white/80'}`}>{feature}</span>
                     </li>
                   ))}
                </ul>

                <button className={`w-full py-5 rounded-[22px] text-[10px] font-black uppercase tracking-[0.25em] italic transition-all active:scale-95 ${plan.btnColor}`}>
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
               <div className="text-right hidden lg:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Due today</p>
                  <p className="text-2xl font-black italic tracking-tight text-slate-900">₹{selectedPlan === 'free' ? '0' : plans.find(p => p.id === selectedPlan)?.price}</p>
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
