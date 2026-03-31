'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IndianRupee, 
  ChevronLeft, 
  Tag, 
  Plus, 
  Trash2, 
  Sparkles,
  ArrowRight,
  Info,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SetPricingPage() {
  const router = useRouter();
  const [perPlateVeg, setPerPlateVeg] = useState('');
  const [perPlateNonVeg, setPerPlateNonVeg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);
  const [packages, setPackages] = useState([
    { id: 1, name: 'Silver Package', price: '500', desc: 'Basic inclusions with food & decor.' },
    { id: 2, name: 'Gold Package', price: '750', desc: 'Premium food variety & basic lighting.' },
  ]);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        router.push('/login');
        return;
      }
      const user = JSON.parse(userJson);

      try {
        const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
        const { Query } = await import('appwrite');
        
        const result = await databases.listDocuments(
          DATABASE_ID,
          VENUES_COLLECTION_ID,
          [Query.equal('userId', user.$id)]
        );
        
        if (result.documents.length > 0) {
          const profile = result.documents[0];
          setDocId(profile.$id);
          setPerPlateVeg(profile.perPlateVeg || '');
          setPerPlateNonVeg(profile.perPlateNonVeg || '');
          if (profile.packages) {
             setPackages(JSON.parse(profile.packages));
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async () => {
    if (!docId) return alert('No profile document found for this user.');

    setIsSaving(true);
    try {
      const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
      
      await databases.updateDocument(
        DATABASE_ID,
        VENUES_COLLECTION_ID,
        docId,
        {
          perPlateVeg,
          perPlateNonVeg,
          packages: JSON.stringify(packages)
        }
      );

      router.push('/dashboard/onboarding/subscription');
    } catch (err: any) {
      console.error('Save error:', err);
      alert(`Error: ${err.message || 'Network error while saving pricing.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const addPackage = () => {
    setPackages(prev => [
      ...prev, 
      { id: Date.now(), name: 'New Package', price: '', desc: 'Brief description here...' }
    ]);
  };

  const removePackage = (id: number) => {
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  const updatePackage = (id: number, field: string, value: string) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-pd py-12 px-6">
      <div className="max-w-4xl mx-auto">
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
                <div className="w-3/4 h-full bg-pd-pink"></div>
             </div>
             <span className="text-[10px] font-black uppercase text-slate-400">Step 3 of 4</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[40px] border border-slate-100 shadow-pd-soft p-8 lg:p-12 mb-8"
              >
                 <header className="mb-12">
                   <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
                      <IndianRupee size={24} />
                   </div>
                   <h1 className="text-3xl font-black text-slate-900 uppercase italic mb-3 tracking-tight">Set Pricing</h1>
                   <p className="text-slate-500 font-medium leading-relaxed">Clearly defined pricing helps customers understand their potential budget.</p>
                 </header>

                 {/* Base Pricing */}
                 <section className="mb-12">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 pl-1 italic">Standard Plate Rates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-1.5 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group focus-within:border-emerald-500 transition-all">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                             Veg Plate Cost
                          </label>
                          <div className="relative">
                             <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400">
                                <IndianRupee size={20} />
                             </div>
                             <input 
                                type="number" 
                                value={perPlateVeg}
                                onChange={(e) => setPerPlateVeg(e.target.value)}
                                className="w-full bg-transparent pl-8 pr-4 h-10 text-2xl font-black text-slate-900 outline-none placeholder:text-slate-200" 
                                placeholder="500" 
                             />
                          </div>
                       </div>
                       <div className="space-y-1.5 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group focus-within:border-red-500 transition-all">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
                             <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                             Non-Veg Plate Cost
                          </label>
                          <div className="relative">
                             <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400">
                                <IndianRupee size={20} />
                             </div>
                             <input 
                                type="number" 
                                value={perPlateNonVeg}
                                onChange={(e) => setPerPlateNonVeg(e.target.value)}
                                className="w-full bg-transparent pl-8 pr-4 h-10 text-2xl font-black text-slate-900 outline-none placeholder:text-slate-200" 
                                placeholder="800" 
                             />
                          </div>
                       </div>
                    </div>
                 </section>

                 {/* Custom Packages */}
                 <section>
                    <div className="flex items-center justify-between mb-8 px-1">
                       <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Custom Packages</h2>
                       <button onClick={addPackage} className="text-[10px] font-black uppercase tracking-widest text-pd-pink hover:bg-pink-50 px-3 py-1 rounded-full transition-colors flex items-center gap-1">
                          <Plus size={12} /> Add Package
                       </button>
                    </div>
                    
                    <div className="space-y-4">
                       {packages.map(pkg => (
                         <div key={pkg.id} className="p-6 bg-slate-50/50 rounded-[28px] border border-slate-100 flex items-center justify-between group hover:border-pd-pink transition-all">
                            <div className="flex-1">
                               <input 
                                  className="text-sm font-black text-slate-900 uppercase italic bg-transparent outline-none mb-1 block w-full"
                                  value={pkg.name}
                                  onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                               />
                               <input 
                                  className="text-xs text-slate-400 font-medium bg-transparent outline-none block w-full"
                                  value={pkg.desc}
                                  onChange={(e) => updatePackage(pkg.id, 'desc', e.target.value)}
                               />
                            </div>
                            <div className="flex items-center gap-6">
                               <div className="flex items-center text-slate-900">
                                  <IndianRupee size={16} />
                                  <input 
                                     className="w-16 bg-transparent text-lg font-black italic outline-none text-right"
                                     value={pkg.price}
                                     onChange={(e) => updatePackage(pkg.id, 'price', e.target.value)}
                                  />
                               </div>
                               <button onClick={() => removePackage(pkg.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                  <Trash2 size={18} />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>

                 <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-50">
                    <p className="text-xs text-slate-400 font-medium italic">Customers will see &ldquo;Starting from ₹{perPlateVeg || '...'}&rdquo;</p>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="pd-btn-primary italic tracking-normal flex items-center gap-2 min-w-[160px] justify-center"
                    >
                      {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span className="italic">Save Pricing</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                 </div>
              </motion.div>
           </div>

           <div className="lg:col-span-1">
              <div className="sticky top-12 space-y-6">
                 {/* Preview Card */}
                 <div className="bg-slate-900 rounded-[35px] p-8 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                       <div className="flex items-center gap-2 mb-6">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                             <Sparkles className="text-pd-pink" size={16} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Market Insight</span>
                       </div>
                       <h3 className="text-lg font-bold italic mb-4">Competitive Pricing</h3>
                       <p className="text-slate-400 text-xs leading-relaxed mb-6">Venues in your area typically charge between <span className="text-white font-bold">₹450 - ₹900</span> per plate for similar capacities.</p>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px] italic text-slate-300">
                          Setting a fair price increases your booking conversion by up to <span className="text-pd-pink font-black">40%</span>.
                       </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-pd-pink/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                 </div>

                 {/* Tips Card */}
                 <div className="p-8 border border-slate-100 rounded-[35px] bg-white text-slate-600">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                       <Info size={14} className="text-blue-500" />
                       Quick Tips
                    </h4>
                    <ul className="space-y-5 text-xs font-medium">
                       <li className="flex gap-3">
                          <div className="mt-1 w-1.5 h-1.5 bg-pd-pink rounded-full shrink-0"></div>
                          <span>Be transparent about service taxes and hidden fees.</span>
                       </li>
                       <li className="flex gap-3">
                          <div className="mt-1 w-1.5 h-1.5 bg-pd-pink rounded-full shrink-0"></div>
                          <span>Include what&apos;s part of the standard package to avoid confusion.</span>
                       </li>
                       <li className="flex gap-3">
                          <div className="mt-1 w-1.5 h-1.5 bg-pd-pink rounded-full shrink-0"></div>
                          <span>Review your prices every quarter based on seasonal demand.</span>
                       </li>
                    </ul>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
