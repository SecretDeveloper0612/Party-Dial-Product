'use client';
import Link from 'next/link';
import { MapPin, Star, Heart, IndianRupee, Users, Eye, ArrowRight, Car, Wind, Zap, Utensils, Music, Wine, Accessibility, Wifi, Shield, Bed, Tent, PartyPopper, CheckCircle } from 'lucide-react';
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

export default function MinimalVenueCard({ venue: v, isPremium }: VenueCardProps) {
  const venueSlug = `/venues/${v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${v.id}`;
  
  // Format amenities for pills
  const pillAmenities = v.amenities ? v.amenities.slice(0, 3) : [];
  const extraAmenitiesCount = v.amenities ? Math.max(0, v.amenities.length - 3) : 0;

  // Determine veg/non-veg status based on foodTypes
  const isVeg = v.foodTypes?.includes("Veg") ?? true;
  const isNonVeg = v.foodTypes?.includes("Non-Veg") ?? true;
  const hasTopReviews = v.rating >= 4.5 && v.reviews > 0;

  return (
    <div 
      className="group relative w-full h-full flex flex-col p-3 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_15px_rgb(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-video md:aspect-[4/3] lg:aspect-[1.5/1] w-full overflow-hidden rounded-xl bg-slate-100 group/swiper mb-4">
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
              '--swiper-navigation-size': '16px',
              '--swiper-navigation-color': '#fff',
              '--swiper-pagination-color': '#3b82f6',
              '--swiper-pagination-bullet-inactive-color': '#94a3b8',
              '--swiper-pagination-bullet-inactive-opacity': '0.7',
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
            <div className="swiper-button-prev !w-8 !h-8 !bg-black/20 hover:!bg-black/40 rounded-full !left-2 backdrop-blur-sm shadow-md opacity-0 group-hover/swiper:opacity-100 transition-all border border-white/20 text-white"></div>
            <div className="swiper-button-next !w-8 !h-8 !bg-black/20 hover:!bg-black/40 rounded-full !right-2 backdrop-blur-sm shadow-md opacity-0 group-hover/swiper:opacity-100 transition-all border border-white/20 text-white"></div>
          </Swiper>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-20">
            <span className="text-xs font-semibold text-slate-900">No Photo</span>
          </div>
        )}
        
        {/* Featured Badge */}
        {hasTopReviews && (
          <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
            Featured
          </div>
        )}

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform">
          <Heart size={16} className="text-slate-300 hover:fill-pd-pink hover:stroke-pd-pink transition-colors" />
        </button>

        {/* Location Pill */}
        <div className="absolute bottom-3 left-3 z-10 bg-[#E11D47] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg backdrop-blur-sm border border-white/20">
          <MapPin size={14} /> {v.city || v.location}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 px-2 pb-2">
        
        {/* Title Row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={venueSlug} className="flex-1">
            <h3 className="text-[20px] font-bold text-[#1a1f36] leading-tight line-clamp-1 hover:text-indigo-600 transition-colors">
              {v.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded-full shadow-sm">
              {isVeg && <div className="w-2 h-2 rounded-full bg-green-500" />}
              {isNonVeg && <div className="w-2 h-2 rounded-full bg-red-500" />}
            </div>
            {v.isNew && (
              <div className="bg-amber-500 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <Star size={10} className="fill-white" /> New
              </div>
            )}
          </div>
        </div>

        {/* Grid Stats (Price & Capacity) */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-2 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <IndianRupee size={14} className="text-indigo-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 truncate">Price / Plate</p>
              <p className="text-[14px] font-bold text-slate-900 truncate">
                {v.price && String(v.price).trim() !== "N/A" && String(v.price).trim() !== "0" && String(v.price).trim() !== "" 
                  ? (String(v.price).includes('₹') ? v.price : `₹${v.price}`) 
                  : "On Request"}
              </p>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-2 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Users size={14} className="text-indigo-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 truncate">Guest Capacity</p>
              <p className="text-[14px] font-bold text-slate-900 truncate">
                {v.capacity ? `Up to ${v.capacity}` : "Flexible"}
              </p>
            </div>
          </div>
        </div>

        {/* Amenities Icons */}
        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
          {pillAmenities.map((a, i) => (
            <div key={i} className="flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-lg shrink-0" title={a}>
              {getAmenityIcon(a)}
            </div>
          ))}
          {extraAmenitiesCount > 0 && (
            <div className="px-2 flex items-center justify-center bg-indigo-50 border border-indigo-200 text-indigo-600 text-[11px] font-bold rounded-lg shrink-0 h-8">
              +{extraAmenitiesCount}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full mt-auto">
            <Link 
              href={venueSlug}
              className="flex-1 h-10 bg-white border-2 border-indigo-100 hover:border-indigo-500 text-indigo-600 font-bold rounded-xl text-[12px] flex items-center justify-center gap-1.5 transition-all active:scale-95 px-2"
            >
              <Eye size={14} strokeWidth={2.5} /> View
            </Link>
            
            <button 
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open-inquiry-popup', { detail: { venueId: v.id } }));
                }}
                className="flex-1 h-10 bg-[#E11D47] hover:opacity-90 text-white font-bold rounded-xl text-[12px] flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 px-2"
            >
              Get Quote <ArrowRight size={14} strokeWidth={2.5} />
            </button>
        </div>
      </div>
    </div>
  );
}
