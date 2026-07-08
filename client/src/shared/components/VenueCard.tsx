'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, CheckCircle2, Zap, ArrowRight, IndianRupee, Users } from 'lucide-react';
import { Venue } from '@/data/venues';

interface VenueCardProps {
  venue: any;
  index: number;
  isPremium?: boolean;
}

const getCapacityLabel = (capacity: any) => {
  const cap = parseInt(capacity);
  if (isNaN(cap)) return "0";
  if (cap >= 5001) return "5000+";
  if (cap >= 2001) return "2000-5000";
  if (cap >= 1001) return "1000-2000";
  if (cap >= 501)  return "500-1000";
  if (cap >= 201)  return "200-500";
  if (cap >= 101)  return "100-200";
  if (cap >= 51)   return "50-100";
  if (cap >= 1)    return "0-50";
  return "0-50";
};

export default function VenueCard({ venue: v, index: i, isPremium }: VenueCardProps) {
  return (
    <div 
      key={v.id}
      className={`group relative w-full h-full flex-1 bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${
        isPremium
          ? 'border border-amber-200/50 shadow-xl shadow-amber-500/5 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1'
          : 'border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/80 hover:-translate-y-1'
      }`}
    >
      {/* Image Container */}
      <div className="relative h-56 md:h-64 w-full overflow-hidden bg-slate-100">
        {v.img ? (
          <img 
            src={v.img} 
            alt={v.name} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
            loading="lazy" 
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-20 group-hover:opacity-30 transition-opacity">
            <img src="/logo.jpg" alt="PartyDial" className="w-24 grayscale" />
            <span className="text-xs font-semibold text-slate-900">No Photos Uploaded</span>
          </div>
        )}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80" />
        {isPremium && (
          <div className="absolute inset-0 bg-linear-to-br from-amber-500/20 to-transparent mix-blend-overlay" />
        )}
        
        {/* Top Badges */}
        <div className="absolute top-4 inset-x-4 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {isPremium && (
              <div className="bg-linear-to-r from-amber-400 to-orange-500 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white shadow-lg border border-white/20">
                <Star size={10} fill="white" />
                <span className="text-xs font-bold">Featured</span>
              </div>
            )}
            {!isPremium && v.verified && (
              <div className="bg-slate-900/60 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/10 text-white">
                <CheckCircle2 size={12} className="text-green-400" />
                <span className="text-xs font-bold">Verified</span>
              </div>
            )}
            {v.isNew && !isPremium && (
              <div className="bg-pd-purple px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white shadow-lg border border-white/20">
                <Zap size={12} fill="white" />
                <span className="text-xs font-bold">New</span>
              </div>
            )}
          </div>
          
          {/* Rating Badge */}
          <div className="bg-slate-900/60 px-3 py-1.5 rounded-full border border-white/10 shadow-lg flex items-center gap-1.5 text-white">
            <Star size={12} className="text-yellow-400 fill-yellow-400 drop-shadow-sm" />
            <span className="text-xs font-bold">{v.rating}</span>
          </div>
        </div>

        {/* Location & Name overlapping the image */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center justify-between w-full mb-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 line-clamp-1">
              <MapPin size={12} className="text-pd-pink shrink-0" /> 
              <span className="truncate">{v.city}</span>
            </div>
            <div className="flex gap-1 shrink-0 bg-slate-900/60 px-2 py-1 rounded-full border border-white/10">
              {(v.foodTypes || []).map((f: string) => (
                <div key={f} className={`w-2 h-2 rounded-full ${f === 'Veg' ? 'bg-green-400' : 'bg-pd-red'}`} title={f}></div>
              ))}
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight leading-tight group-hover:text-amber-100 transition-colors drop-shadow-md line-clamp-2 min-h-[3.5rem] flex items-end">
            {v.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 md:p-6 flex-1 flex flex-col bg-white">
        {/* Price and Capacity */}
        <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-slate-100">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <IndianRupee size={12} />
              <span className="text-xs font-bold">Price / Plate</span>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              {v.price && String(v.price).trim() !== "N/A" && String(v.price).trim() !== "0" && String(v.price).trim() !== "" 
                ? (String(v.price).includes('₹') ? v.price : `₹${v.price}`) 
                : "Pricing on request"}
            </span>
          </div>
          
          <div className="flex flex-col gap-1 border-l border-slate-100 pl-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users size={12} />
              <span className="text-xs font-bold">Guest Cap.</span>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              {getCapacityLabel(v.capacity)}
            </span>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(v.amenities || []).slice(0, 3).map((a: string) => (
            <span key={a} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100">
              {a}
            </span>
          ))}
          {(v.amenities || []).length > 3 && (
            <span className="px-3 py-1.5 bg-pd-pink/5 text-pd-pink rounded-lg text-xs font-bold border border-pd-pink/10">
              +{(v.amenities || []).length - 3} more
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full mt-auto">
          <Link href={`/venues/${v.id}`} className="flex-1">
            <button className="w-full py-4 rounded-xl text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all active:scale-95">
              Details
            </button>
          </Link>
          <button 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-inquiry-popup', { detail: { venueId: v.id } }));
            }}
            className="flex-[1.5] py-4 rounded-xl text-xs font-semibold text-white bg-linear-to-r from-pd-pink to-pd-blue hover:shadow-lg hover:shadow-pd-pink/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Get Quote <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
