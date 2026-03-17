'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { Venue } from '@/data/venues';

interface VenueCardProps {
  venue: Venue;
  index: number;
}

export default function VenueCard({ venue: v, index: i }: VenueCardProps) {
  return (
    <motion.div 
      layout
      key={v.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: i * 0.05 }}
      className="pd-card group bg-white border border-slate-100 shadow-pd-soft overflow-hidden h-full flex flex-col"
    >
       <div className="relative h-52 md:h-56 overflow-hidden">
          <Image src={v.img} alt={v.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute top-4 left-4 flex gap-2">
             {v.verified && (
               <div className="bg-white/95 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xl border border-slate-100">
                  <CheckCircle2 size={12} className="text-green-500" />
                  <span className="text-[9px] font-black uppercase text-slate-800 tracking-widest">Verified</span>
               </div>
             )}
             {v.isNew && (
               <div className="bg-pd-purple px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-white shadow-xl">
                  <Zap size={12} fill="white" />
                  <span className="text-[9px] font-black uppercase tracking-widest">New</span>
                </div>
             )}
          </div>
          
          {/* Rating Badge - Top Right */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/20 shadow-xl flex items-center gap-1">
             <Star size={10} className="text-yellow-400 fill-yellow-400" />
             <span className="text-[10px] md:text-xs font-black text-slate-900">{v.rating}</span>
          </div>
       </div>

       <div className="p-5 md:p-6 flex-1 flex flex-col items-start">
          <div className="flex items-center justify-between w-full mb-3">
             <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <MapPin size={10} className="text-pd-red" /> {v.location}, {v.city}
             </div>
             <div className="flex gap-1">
                {v.foodTypes.map(f => (
                  <div key={f} className={`w-2 h-2 rounded-full ${f === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`} title={f}></div>
                ))}
             </div>
          </div>
          
          <h3 className="text-lg md:text-xl font-black text-slate-900 mb-4 group-hover:text-pd-red transition-colors leading-tight italic">{v.name}</h3>

          {/* Price and Capacity - Always Visible */}
          <div className="flex gap-6 mb-5 w-full border-b border-slate-50 pb-4">
             <div className="flex flex-col">
                <span className="text-[7px] md:text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Price / Plate</span>
                <span className="text-sm md:text-lg font-black text-slate-900 italic">₹{v.price}</span>
             </div>
             <div className="flex flex-col border-l border-slate-100 pl-6">
                <span className="text-[7px] md:text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Guest Cap.</span>
                <span className="text-sm md:text-lg font-black text-slate-900 italic">{v.capacity}+</span>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 mb-6">
             {v.amenities.slice(0, 3).map(a => (
               <span key={a} className="px-2.5 py-1 bg-slate-50 rounded-lg text-[8px] font-bold text-slate-500 border border-slate-100">{a}</span>
             ))}
             {v.amenities.length > 3 && <span className="px-1.5 py-1 bg-slate-50 rounded-lg text-[8px] font-bold text-slate-400">+{v.amenities.length - 3}</span>}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full mt-auto">
             <Link href={`/venues/${v.id}`} className="flex-1 order-2 sm:order-1">
                <button className="w-full py-3 border-2 border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all italic active:scale-95">
                   View Gallery
                </button>
             </Link>
             <button className="flex-1 order-1 sm:order-2 pd-btn-primary !py-3 !text-[9px] tracking-widest uppercase italic shadow-lg shadow-pd-pink/10 flex items-center justify-center gap-2 active:scale-95">
                Get Quote <ArrowRight size={12} />
             </button>
          </div>
       </div>
    </motion.div>
  );
}
