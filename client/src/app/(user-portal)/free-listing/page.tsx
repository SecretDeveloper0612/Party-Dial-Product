'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
} from 'lucide-react';
import Link from 'next/link';
import VenueCard from '@/shared/components/VenueCard';

export default function FreeVenuesDiscoveryPage() {
  return (
    <main className="min-h-screen bg-white pb-32">
      {/* HERO SECTION FOR CUSTOMERS */}
      <section className="relative pt-24 pb-20 px-6 bg-slate-900 overflow-hidden">
         <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-pd-red/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/4"></div>
         </div>
         
         <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
               <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">Discovery</span>
               <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 italic uppercase tracking-tighter">
                  Explore <span className="text-pd-red">Value</span> Venues
               </h1>
               <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
                  High quality, budget-friendly venues offering exceptional services for your wedding, birthday, or corporate event.
               </p>
            </motion.div>
         </div>
      </section>

      {/* DISCOVERY SECTION FOR CUSTOMERS */}
      <FreeDiscoverySection />

      <style jsx global>{`
        .shadow-pd-soft { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); }
        .shadow-pd-strong { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04); }
      `}</style>
    </main>
  );
}

function FreeDiscoverySection() {
  const [freeVenues, setFreeVenues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFreeVenues = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
        const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
        const response = await fetch(`${baseUrl}/venues?verified=true`);
        const result = await response.json();
        
        if (result.status === 'success') {
          const { getAppwriteImageUrl, parsePhotos } = await import('@/shared/utils/image');
          const mapped = result.data
            .filter((doc: any) => doc.subscriptionPlan === 'free')
            .map((doc: any) => {
               const photos = parsePhotos(doc.photos);
               return {
                  id: doc.$id,
                  name: doc.venueName || "Unnamed Venue",
                  location: doc.landmark || doc.city || "India",
                  city: doc.city || "Delhi",
                  type: doc.venueType || "Banquet Hall",
                  capacity: parseInt(doc.capacity) || 500,
                  price: doc.perPlateVeg ? parseFloat(doc.perPlateVeg) : null,
                  img: photos.length > 0 ? getAppwriteImageUrl(photos[0]) : "",
                  verified: doc.isVerified || false,
                  rating: parseFloat(doc.rating) || 5.0,
                  amenities: (doc.amenities ? (typeof doc.amenities === 'string' ? JSON.parse(doc.amenities) : doc.amenities) : ["AC Hall"]),
                  foodTypes: ["Veg", "Non-Veg"],
               };
            });
          setFreeVenues(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch free venues:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFreeVenues();
  }, []);

  return (
    <section className="py-24 px-6 bg-white border-t border-slate-100">
       <div className="max-w-7xl mx-auto">
          {!isLoading && freeVenues.length === 0 ? (
             <div className="py-20 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">No venues found in your city yet.</p>
                <Link href="/venues" className="text-pd-red text-xs font-bold uppercase underline">Explore All Venues</Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {isLoading ? (
                  [1, 2, 3].map(i => (
                     <div key={i} className="aspect-[4/5] bg-slate-50 rounded-[40px] animate-pulse"></div>
                  ))
               ) : (
                  freeVenues.map((v, i) => (
                     <VenueCard key={v.id} venue={v} index={i} />
                  ))
               )}
            </div>
          )}
       </div>
    </section>
  );
}
