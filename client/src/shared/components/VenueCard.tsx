/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import { MapPin, Star, Heart, Users, ArrowRight, Eye, IndianRupee, Car, Wind, Zap, Utensils, Music, Wine, Accessibility, Wifi, Shield, Bed, Tent, PartyPopper, CheckCircle } from 'lucide-react';
import { Venue } from '@/data/venues';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface VenueCardProps {
  venue: Venue;
  index: number;
  isPremium?: boolean;
}

const getCapacityLabel = (capacity: string | number) => {
  const cap = typeof capacity === 'string' ? parseInt(capacity) : capacity;
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
const getAmenityIcon = (amenity: string) => {
  const lower = amenity.toLowerCase();
  if (lower.includes('parking') || lower.includes('valet')) return <Car size={14} className="text-slate-700" />;
  if (lower.includes('ac') || lower.includes('air condition') || lower.includes('hvac')) return <Wind size={14} className="text-slate-700" />;
  if (lower.includes('power') || lower.includes('generator')) return <Zap size={14} className="text-slate-700" />;
  if (lower.includes('cater') || lower.includes('food') || lower.includes('kitchen')) return <Utensils size={14} className="text-slate-700" />;
  if (lower.includes('dj') || lower.includes('music') || lower.includes('sound')) return <Music size={14} className="text-slate-700" />;
  if (lower.includes('bar') || lower.includes('alcohol') || lower.includes('drink')) return <Wine size={14} className="text-slate-700" />;
  if (lower.includes('wheelchair') || lower.includes('access')) return <Accessibility size={14} className="text-slate-700" />;
  if (lower.includes('wifi') || lower.includes('internet')) return <Wifi size={14} className="text-slate-700" />;
  if (lower.includes('secur')) return <Shield size={14} className="text-slate-700" />;
  if (lower.includes('room') || lower.includes('bed')) return <Bed size={14} className="text-slate-700" />;
  if (lower.includes('lawn') || lower.includes('outdoor')) return <Tent size={14} className="text-slate-700" />;
  if (lower.includes('decor')) return <PartyPopper size={14} className="text-slate-700" />;
  return <CheckCircle size={14} className="text-slate-700" />;
};

export default function VenueCard({ venue: v }: VenueCardProps) {
  return (
    <div 
      key={v.id}
      className={`group relative w-full h-full flex-1 bg-white rounded-3xl overflow-hidden flex flex-col transition-all duration-300 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1`}
    >
      {/* Image Container */}
      <div className="relative h-56 md:h-64 w-full overflow-hidden bg-slate-100 group/swiper">
        {(v.images && v.images.length > 0) || v.img ? (
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            loop={true}
            className="w-full h-full"
            style={{ 
              '--swiper-navigation-size': '14px',
              '--swiper-navigation-color': '#fff',
            } as React.CSSProperties}
          >
            {((v.images && v.images.length > 0) ? v.images : (v.img ? [v.img] : [])).map((imgUrl, i) => (
              <SwiperSlide key={i} className="w-full h-full">
                <img 
                  src={imgUrl} 
                  alt={`${v.name} - ${i + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" 
                  loading="lazy" 
                />
              </SwiperSlide>
            ))}
            
            {/* Navigation Buttons (Always visible if multiple images) */}
            <div className="swiper-button-prev !w-6 !h-6 !font-bold !bg-black/50 backdrop-blur-sm rounded-full !left-2 shadow-lg border border-white/20"></div>
            <div className="swiper-button-next !w-6 !h-6 !font-bold !bg-black/50 backdrop-blur-sm rounded-full !right-2 shadow-lg border border-white/20"></div>
          </Swiper>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-20 transition-opacity">
            <span className="text-xs font-semibold text-slate-900">No Photo</span>
          </div>
        )}
        
        {/* Gradient Overlay at Bottom of Image for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        
        {/* Top Badges */}
        <div className="absolute top-4 inset-x-4 flex items-start justify-between z-10">
          <div className="flex flex-wrap gap-2">
          </div>
          
          {/* Favorite Button */}
          <button className="bg-white p-2.5 rounded-full shadow-md text-pd-purple/70 hover:text-pd-purple transition-colors">
            <Heart size={16} />
          </button>
        </div>

        {/* Bottom Overlay Items */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
          {/* Location Badge */}
          <div className="bg-gradient-to-r from-pd-pink to-pd-blue shadow-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-white">
            <MapPin size={12} className="text-white" /> 
            <span className="text-[11px] font-semibold tracking-wide truncate max-w-[100px]">{v.city}</span>
          </div>

          {/* Removed Mock Gallery Thumbnails */}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col bg-white">
        
        {/* Title & Subtitle */}
         <div className="mb-4">
           <div className="flex justify-between items-start">
             <h3 className="font-pd font-semibold text-[18px] text-[#1a1f36] leading-tight line-clamp-1">
               {v.name}
             </h3>
             <div className="flex items-center gap-1.5 shrink-0 pt-0.5 ml-2">
               {/* Food Type Badge */}
               {v.foodTypes && v.foodTypes.length > 0 && (
                 <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200" title={v.foodTypes.join(', ')}>
                   {v.foodTypes.includes('Veg') && <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_2px_rgba(34,197,94,0.5)]"></span>}
                   {v.foodTypes.includes('Non-Veg') && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_2px_rgba(239,68,68,0.5)]"></span>}
                 </div>
               )}
               {/* Rating Badge */}
               <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#f59e0b] text-white shadow-sm">
                 <Star size={10} fill="white" />
                 <span>{v.rating || "New"}</span>
               </div>
             </div>
           </div>
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Price Box */}
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/80">
            <div className="p-2 bg-pd-purple/10 rounded-xl shrink-0">
               <IndianRupee size={16} className="text-pd-purple" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-slate-500 truncate">Price / Plate</span>
              <span className="text-[13px] font-black text-slate-900 truncate">
                {v.price && String(v.price).trim() !== "N/A" && String(v.price).trim() !== "0" && String(v.price).trim() !== "" 
                  ? (String(v.price).includes('₹') ? v.price : `₹${v.price}`) 
                  : "On Request"}
              </span>
            </div>
          </div>
          
          {/* Capacity Box */}
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/80">
            <div className="p-2 bg-pd-purple/10 rounded-xl shrink-0">
               <Users size={16} className="text-pd-purple" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-slate-500 truncate">Guest Capacity</span>
              <span className="text-[13px] font-black text-slate-900 truncate">
                {getCapacityLabel(v.capacity)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Amenities Icons */}
        <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
          {(v.amenities || []).slice(0, 4).map((a: string, i: number) => (
            <div key={i} className="flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-lg shrink-0" title={a}>
              {getAmenityIcon(a)}
            </div>
          ))}
          {(v.amenities || []).length > 4 && (
            <div className="px-2 flex items-center justify-center bg-pd-purple/10 border border-pd-purple/20 text-pd-purple text-[11px] font-bold rounded-lg shrink-0 h-8">
              +{(v.amenities || []).length - 4}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full mt-auto">
          <Link href={`/venues/${v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${v.id}`} className="flex-1">
            <button className="w-full py-3.5 rounded-xl text-[13px] font-bold text-pd-purple bg-white border border-pd-purple/30 hover:bg-pd-purple/5 transition-all flex items-center justify-center gap-2">
              <Eye size={16} className="text-pd-purple" /> View Details
            </button>
          </Link>
          <button 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-inquiry-popup', { detail: { venueId: v.id } }));
            }}
            className="flex-1 py-3.5 rounded-xl text-[13px] font-bold text-white bg-pd-pink hover:shadow-lg hover:shadow-pd-pink/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Get Quote <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
