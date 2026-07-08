'use client';
import Link from 'next/link';
import { MapPin, Star, Heart, Users, ArrowRight, Eye, Sparkles } from 'lucide-react';
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

export default function VenueCard({ venue: v, isPremium }: VenueCardProps) {
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
            {(isPremium || true) && (
              <div className="bg-[#f59e0b] px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-white shadow-md">
                <Star size={12} fill="white" className="text-white" />
                <span className="text-[11px] font-bold tracking-wide">Featured</span>
              </div>
            )}
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
        <div className="mb-5 mt-1">
           <div className="flex items-start justify-between gap-2 mb-1.5">
             <h3 className="text-[1.35rem] font-black text-slate-900 tracking-tight leading-tight line-clamp-1 flex-1" title={v.name}>
               {v.name}
             </h3>
             <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
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
           <p className="text-xs font-semibold text-slate-500 tracking-wide">
             {v.amenities && v.amenities.length >= 3 
                ? v.amenities.slice(0, 3).join(' • ') 
                : "Nature • Luxury • Comfort"}
           </p>
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Price Box */}
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/80">
            <div className="p-2 bg-pd-purple/10 rounded-xl shrink-0">
               <Sparkles size={16} className="text-pd-purple" />
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
        
        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(v.amenities || []).slice(0, 3).map((a: string) => (
            <span key={a} className="px-3 py-1.5 bg-white text-slate-600 rounded-lg text-[10px] font-bold border border-slate-200">
              {a}
            </span>
          ))}
          {(v.amenities || []).length > 3 && (
            <span className="px-3 py-1.5 bg-pd-purple/10 text-pd-purple rounded-lg text-[10px] font-bold border border-pd-purple/20">
              +{(v.amenities || []).length - 3} more
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full mt-auto">
          <Link href={`/venues/${v.id}`} className="flex-1">
            <button className="w-full py-3.5 rounded-xl text-[13px] font-bold text-pd-purple bg-white border border-pd-purple/30 hover:bg-pd-purple/5 transition-all flex items-center justify-center gap-2">
              <Eye size={16} className="text-pd-purple" /> View Details
            </button>
          </Link>
          <button 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-inquiry-popup', { detail: { venueId: v.id } }));
            }}
            className="flex-1 py-3.5 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-pd-pink to-pd-blue hover:shadow-lg hover:shadow-pd-pink/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Get Quote <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
