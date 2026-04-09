'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  Star, 
  CheckCircle2, 
  ParkingCircle, 
  Utensils, 
  Palette, 
  Wind, 
  Music, 
  Hotel,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Share2,
  Heart,
  MessageSquare,
  ArrowRight,
  Info,
  DollarSign,
  Calendar,
  Send,
  X,
  XCircle,
  Image as ImageIcon,
  Maximize2,
  Zap,
  Trees,
  ChefHat,
  Building,
  Wifi,
  Phone,
  MessageCircle
} from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Camera, Trash2, Edit3, Filter as FilterIcon } from 'lucide-react';

import { MOCK_VENUES } from '@/data/venues';
import { STORAGE_BUCKET_ID } from '@/lib/appwrite';

// Helper to map amenity IDs/names to icons and labels
const AMENITY_DATA: Record<string, { label: string, icon: React.ReactNode }> = {
  "ac": { label: "Air Conditioning", icon: <Wind size={20} /> },
  "parking": { label: "Parking Available", icon: <ParkingCircle size={20} /> },
  "power": { label: "Power Backup", icon: <Zap size={20} /> },
  "indoor": { label: "Indoor Hall", icon: <Building size={20} /> },
  "outdoor": { label: "Outdoor Lawn", icon: <Trees size={20} /> },
  "catering_in": { label: "In-House Catering", icon: <Utensils size={20} /> },
  "catering_out": { label: "Outside Catering Allowed", icon: <ChefHat size={20} /> },
  "dj": { label: "DJ Allowed", icon: <Music size={20} /> },
  "decoration": { label: "Decoration Available", icon: <Palette size={20} /> },
  "bridal": { label: "Bridal Room", icon: <Hotel size={20} /> },
  "security": { label: "Security Available", icon: <ShieldCheck size={20} /> },
  "wifi": { label: "Wi-Fi Available", icon: <Wifi size={20} /> },
  // Legacy/Label Fallbacks
  "Ample Parking": { label: "Ample Parking", icon: <ParkingCircle size={20} /> },
  "Valet Parking": { label: "Valet Parking", icon: <ParkingCircle size={20} /> },
  "In-house Catering": { label: "In-house Catering", icon: <Utensils size={20} /> },
  "Thematic Decoration": { label: "Thematic Decoration", icon: <Palette size={20} /> },
  "AC Main Hall": { label: "AC Main Hall", icon: <Wind size={20} /> },
  "Live DJ & Sound": { label: "Live DJ & Sound", icon: <Music size={20} /> },
  "Default": { label: "Service", icon: <CheckCircle2 size={20} /> }
};

// Helper to map capacity integer to range label
const getCapacityLabel = (capacity: any) => {
  const cap = parseInt(capacity);
  if (cap === 2000) return "2000-5000";
  if (cap === 1000) return "1000-2000";
  if (cap === 500) return "500-1000";
  if (cap === 200) return "200-500";
  if (cap === 100) return "100-200";
  if (cap === 50) return "50-100";
  if (cap === 0) return "0-50";
  if (cap === 5000) return "5000+";
  return capacity?.toString() || "0";
};

export default function VenueDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [venue, setVenue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'Wedding',
    eventDate: '',
    guests: '',
    budget: '',
    requirements: ''
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);

    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-server-koo2.onrender.com/api';
      const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
      const response = await fetch(`${baseUrl}/venues/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueId: id,
          pincode: venue?.pincode,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          eventType: formData.eventType,
          guests: formData.guests,
          notes: formData.requirements
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        showToast('Lead submitted successfully! Our team will contact you soon.', 'success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          eventType: 'Wedding',
          eventDate: '',
          guests: '',
          budget: '',
          requirements: ''
        });
      } else {
        showToast(result.message || 'Error submitting lead', 'error');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      showToast('Failed to submit lead. Please try again.', 'error');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Fetch venue data from backend or mock
  useEffect(() => {
    const fetchVenue = async () => {
      setIsLoading(true);
      try {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-server-koo2.onrender.com/api';
        const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
        const response = await fetch(`${baseUrl}/venues/${id}`);
        const result = await response.json();

        if (result.status === 'success') {
          const doc = result.data;
          
          // CRITICAL: Only allow approved venues on client-side
          if (!doc.isVerified) {
             setVenue(null);
             setIsLoading(false);
             return;
          }

          const { getAppwriteImageUrl, parsePhotos } = await import('@/shared/utils/image');
          const photoIds = parsePhotos(doc.photos);
          
          const mappedVenue: any = {
            id: doc.$id,
            name: doc.venueName || "Unnamed Venue",
            location: doc.landmark || doc.city || "India",
            city: doc.city || "Unknown",
            pincode: doc.pincode || "",
            type: doc.venueType || "Banquet Hall",
            verified: doc.isVerified || false,
            popular: doc.status === 'active',
            rating: 0.0, 
            reviewCount: 0,
            contactNumber: doc.contactNumber || "919058988455",
            pricePerPlate: doc.perPlateVeg || 1500,
            pricePerPlateNonVeg: doc.perPlateNonVeg || 1800,
            startingRental: "₹1,50,000",
            capacity: getCapacityLabel(doc.capacity),
            about: doc.description || "No description available for this venue.",
            images: photoIds.length > 0 
              ? photoIds.map((p: any) => getAppwriteImageUrl(p.id))
              : ["/gallery/interior.png", "/gallery/exterior.png", "/gallery/setup.png"],
            amenities: (doc.amenities ? (typeof doc.amenities === 'string' ? JSON.parse(doc.amenities) : doc.amenities) : []).map((a: string) => {
              const data = AMENITY_DATA[a] || AMENITY_DATA["Default"];
              return {
                name: data.label,
                icon: data.icon
              };
            }),
            halls: [
              { name: "Grand Imperial Hall", capacity: `${getCapacityLabel(doc.capacity)} Guests`, area: "12,000 sq ft" }
            ],
            policies: [
              "Advance Payment: 25% at the time of booking.",
              "Cancellation: Non-refundable if cancelled within 30 days of event.",
              "Outside Food: Not allowed.",
              "Alcohol: Allowed with valid license.",
              "Music: Allowed till 11:00 PM as per local guidelines."
            ],
            reviews: [],
            similarVenues: []
          };

          // Fetch Similar Venues based on Pincode/City
          try {
            const baseS = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-server-koo2.onrender.com/api';
            const baseUrl = baseS.endsWith('/api') ? baseS : `${baseS}/api`;
            const allResp = await fetch(`${baseUrl}/venues`);
            const allResult = await allResp.json();
            if (allResult.status === 'success') {
              const similar = allResult.data
                .filter((v: any) => v.$id !== doc.$id && (
                  (doc.pincode && v.pincode === doc.pincode) || 
                  (doc.city && v.city === doc.city)
                ))
                .slice(0, 3)
                .map((v: any) => {
                  const vPhotos = parsePhotos(v.photos);
                  return {
                    id: v.$id,
                    name: v.venueName || "Similar Venue",
                    location: v.landmark || v.city || "Nearby",
                    price: v.perPlateVeg || 1200,
                    rating: 4.5,
                    img: vPhotos.length > 0 ? getAppwriteImageUrl(vPhotos[0]) : "/gallery/interior.png"
                  };
                });
              mappedVenue.similarVenues = similar;
            }
          } catch (e) {
            console.warn('Failed to fetch similar venues:', e);
          }

          setVenue(mappedVenue);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('API Fetch failed, trying mock data:', err);
      }

      // Fallback to MOCK_VENUES
      const mock = MOCK_VENUES.find(v => v.id === id);
      if (mock) {
          const mappedMock = {
            ...mock,
            images: [mock.img, "/gallery/interior.png", "/gallery/exterior.png"],
            pricePerPlate: mock.price,
            pricePerPlateNonVeg: mock.price + 300,
            contactNumber: "919058988455",
            about: "This is a premium venue listed on PartyDial. Experience excellence in service and ambiance.",
            amenities: (mock.amenities || []).map(a => {
              const data = AMENITY_DATA[a] || AMENITY_DATA["Default"];
              return {
                name: data.label,
                icon: data.icon
              };
            }),
            halls: [
              { name: "Main Hall", capacity: `${mock.capacity} Guests`, area: "8,000 sq ft" }
            ],
            policies: [
              "Advance Payment: 25% at the time of booking.",
              "Cancellation: Non-refundable if cancelled within 30 days of event.",
              "Outside Food: Not allowed.",
              "Alcohol: Allowed with valid license."
            ],
            reviews: [],
            similarVenues: []
          };
          setVenue(mappedMock);
      }
      setIsLoading(false);
    };

    if (id) fetchVenue();
  }, [id]);

  const nextImage = () => venue && setActiveImage((prev) => (prev + 1) % venue.images.length);
  const prevImage = () => venue && setActiveImage((prev) => (prev - 1 + venue.images.length) % venue.images.length);

  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSort, setReviewSort] = useState("Most Recent");
  const [hoverRating, setHoverRating] = useState(0);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };
  const [newReview, setNewReview] = useState({
    name: '',
    email: '',
    rating: 0,
    comment: ''
  });

  const fetchReviews = async () => {
    if (!id) return;
    setIsLoadingReviews(true);
    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-server-koo2.onrender.com/api';
      const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
      const response = await fetch(`${baseUrl}/venues/${id}/reviews`);
      const result = await response.json();
      if (result.status === 'success') {
        setReviews(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const ratingStats = useMemo(() => {
    if (reviews.length === 0) return { avg: "0.0", total: 0, breakdown: [0, 0, 0, 0, 0] };
    const total = reviews.length;
    const avg = (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1);
    const counts = [0, 0, 0, 0, 0]; // 1-5 stars
    reviews.forEach(r => {
      const rIndex = Math.floor(r.rating) - 1;
      if (rIndex >= 0 && rIndex < 5) counts[rIndex]++;
    });
    return { avg, total: reviews.length, breakdown: [...counts].reverse() }; // 5 to 1
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    let rs = [...reviews];
    if (reviewSort === "Highest Rating") rs.sort((a, b) => b.rating - a.rating);
    else if (reviewSort === "Lowest Rating") rs.sort((a, b) => a.rating - b.rating);
    else rs.sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime());
    return rs;
  }, [reviews, reviewSort]);

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Auto-play reviews slider
  useEffect(() => {
    if (sortedReviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % sortedReviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sortedReviews.length]);

  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0) return showToast("Please select a rating", 'error');
    if (!newReview.name.trim()) return showToast("Please provide your name", 'error');
    
    setIsSubmittingReview(true);
    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-server-koo2.onrender.com/api';
      const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
      const response = await fetch(`${baseUrl}/venues/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueId: id,
          userName: newReview.name,
          userEmail: newReview.email,
          rating: newReview.rating,
          comment: newReview.comment
        }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        showToast('Review submitted successfully!', 'success');
        setReviews(prev => [result.data, ...prev]);
        setIsReviewModalOpen(false);
        setNewReview({ name: '', email: '', rating: 0, comment: '' });
      } else {
        showToast(result.message || 'Failed to submit review', 'error');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      showToast('Failed to submit review. Please try again.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleShare = async () => {
    if (!venue) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: venue.name,
          text: `Check out ${venue.name} on PartyDial!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard!", 'success');
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (isLoading) {
     return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-pd-red border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Venue Details...</p>
            </div>
        </div>
     );
  }

  if (!venue) {
     return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-black text-slate-900 mb-4">Venue Not Found</h1>
                <Link href="/venues" className="text-pd-red font-bold hover:underline">Back to Listings</Link>
            </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. IMAGE GALLERY HERO */}
      <section className="relative h-[45vh] md:h-[65vh] bg-slate-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img 
              src={venue.images[activeImage]} 
              alt={venue.name} 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40"></div>
        
        {/* Navigation Arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4 md:px-6 pointer-events-none z-20">
          <button onClick={prevImage} className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-90">
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <button onClick={nextImage} className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all active:scale-90">
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Top Actions */}
        <div className="absolute top-4 md:top-8 left-4 md:left-8 right-4 md:right-8 flex items-center justify-between z-30">
           <Link href="/venues" className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all">
             <ChevronLeft size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Back to Listings</span>
           </Link>
           <div className="flex gap-2 md:gap-3">
             <button 
               onClick={handleShare}
               className="p-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95 group"
               title="Share Venue"
             >
                <Share2 size={18} className="group-hover:rotate-12 transition-transform" />
             </button>
           </div>
        </div>

        {/* Gallery Counter & Button */}
        <Link href={`/venues/${id}/gallery`} className="absolute bottom-28 md:bottom-12 right-6 md:right-12 z-30">
          <button className="px-5 py-3 md:px-8 md:py-4 bg-black/50 backdrop-blur-xl rounded-2xl border border-white/20 text-white flex items-center gap-2 md:gap-3 hover:bg-pd-red transition-all group active:scale-95 shadow-2xl">
             <ImageIcon size={16} className="md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
             <div className="text-left">
                <span className="block text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">View Venue</span>
                <span className="block text-[8px] md:text-[9px] font-bold text-white/50 uppercase tracking-widest leading-none">{venue.images.length} Photos</span>
             </div>
          </button>
        </Link>
      </section>

      {/* 2. VENUE TITLE & HIGHLIGHTS */}
      <section className="px-4 md:px-6 -mt-16 md:-mt-20 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 md:p-12 rounded-[32px] md:rounded-[40px] shadow-pd-strong flex flex-col md:flex-row gap-8 md:gap-10 items-start md:items-center">
            <div className="flex-1 w-full">
               <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                  <div className="bg-green-50 text-green-600 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg flex items-center gap-1.5 border border-green-100 uppercase text-[8px] md:text-[10px] font-black tracking-widest">
                     <CheckCircle2 size={10} className="md:w-3 md:h-3" /> Verified Venue
                  </div>
                  {venue.popular && (
                    <div className="bg-pd-pink/10 text-pd-pink px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg flex items-center gap-1.5 border border-pd-pink/20 uppercase text-[8px] md:text-[10px] font-black tracking-widest">
                       <Star size={10} className="fill-pd-pink md:w-3 md:h-3" /> Popular Venue
                    </div>
                  )}
                  <div className="flex items-center gap-1 md:ml-0 bg-slate-50 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg border border-slate-100 font-black text-[10px] md:text-xs text-slate-800">
                     <Star size={12} className="text-yellow-400 fill-yellow-400 md:w-[14px] md:h-[14px]" /> {ratingStats.avg}
                     <span className="text-slate-400 font-bold opacity-70">({ratingStats.total} Reviews)</span>
                  </div>
               </div>
               <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-3">{venue.name}</h1>
               <div className="flex items-center gap-2 text-slate-500 font-bold text-xs md:text-sm">
                 <MapPin className="text-pd-red shrink-0" size={16} />
                 <span>{venue.location}</span>
               </div>
               
               <div className="mt-8 flex flex-col sm:flex-row gap-3">
                 <a 
                   href={`tel:${venue.contactNumber}`}
                   className="flex-1 px-4 py-4 bg-pd-red text-white text-[11px] md:text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-lg shadow-pd-red/20 active:scale-95 shadow-sm"
                 >
                   <Phone size={16} className="shrink-0" /> <span>Call Now</span>
                 </a>
                 <a 
                   href={`https://wa.me/${venue.contactNumber}?text=Hi, I am interested in ${venue.name} from PartyDial.`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex-1 px-4 py-4 bg-green-500 text-white text-[11px] md:text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/20 active:scale-95 shadow-sm"
                 >
                   <MessageCircle size={16} className="shrink-0" /> <span>WhatsApp</span>
                 </a>
               </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 w-full lg:w-auto gap-4 md:gap-8 lg:px-10 lg:border-l border-slate-100 pt-8 lg:pt-0 border-t lg:border-t-0 mt-8 lg:mt-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
               <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center px-1 py-3 sm:py-0">
                 <div className="flex items-center gap-2 mb-0 sm:mb-2">
                    <Users size={16} className="text-pd-purple" />
                    <p className="text-[10px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest">Guest Capacity</p>
                 </div>
                 <span className="text-sm md:text-lg font-black text-slate-900">{venue.capacity}</span>
               </div>
               <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center px-1 py-3 sm:py-0 sm:pl-6">
                 <div className="flex items-center gap-2 mb-0 sm:mb-2">
                    <Utensils size={16} className="text-emerald-500" />
                    <p className="text-[10px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest">Veg Plate</p>
                 </div>
                 <span className="text-sm md:text-lg font-black text-slate-900">₹{venue.pricePerPlate}</span>
               </div>
               <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center px-1 py-3 sm:py-0 sm:pl-6">
                 <div className="flex items-center gap-2 mb-0 sm:mb-2">
                    <Utensils size={16} className="text-pd-red" />
                    <p className="text-[10px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest">Non-Veg Plate</p>
                 </div>
                 <span className="text-sm md:text-lg font-black text-slate-900">₹{venue.pricePerPlateNonVeg}</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT AREA */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT CONTENT */}
          <div className="flex-1 space-y-16">
            
            {/* About Section */}
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-3">
                About the Venue <Info size={18} className="text-pd-red" />
              </h2>
              <p className="text-slate-500 font-semibold leading-relaxed text-base">
                {venue.about}
              </p>
            </div>

            {/* Amenities Grid */}
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-6 border-l-4 border-pd-purple pl-4">Key Amenities</h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                 {venue.amenities.map((amenity: any, i: number) => (
                   <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-3 hover:shadow-pd-soft transition-all group">
                      <div className="w-12 h-12 bg-pd-purple/5 text-pd-purple rounded-xl flex items-center justify-center group-hover:bg-pd-purple group-hover:text-white transition-colors">
                        {amenity.icon}
                      </div>
                      <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{amenity.name}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Hall / Capacity Details */}
            <div className="bg-slate-900 rounded-[32px] p-10 text-white">
               <h2 className="text-xl font-black mb-8 italic">Available Spaces</h2>
               <div className="space-y-6">
                 {venue.halls.map((hall: any, i: number) => (
                   <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                      <div>
                        <h4 className="text-lg font-black mb-1">{hall.name}</h4>
                        <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">{hall.area}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-4 md:mt-0">
                         <div className="flex items-center gap-2 text-pd-pink font-black text-sm">
                           <Users size={16} /> {hall.capacity}
                         </div>
                         <button className="px-5 py-2.5 bg-pd-red text-white text-[10px] font-black uppercase tracking-widest rounded-lg">View Rates</button>
                      </div>
                   </div>
                 ))}
               </div>
            </div>


             {/* Venue Gallery Section */}
             <div className="py-8">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-xl font-black text-slate-900 border-l-4 border-slate-900 pl-4 uppercase tracking-widest">Venue Gallery</h2>
                   <Link href={`/venues/${id}/gallery`} className="group flex items-center gap-2 text-[10px] font-black text-pd-purple uppercase tracking-widest hover:text-pd-red transition-all">
                      Explore All Photos <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                   {venue.images.slice(0, 3).map((img: string, i: number) => (
                      <Link 
                        key={i} 
                        href={`/venues/${id}/gallery`}
                        className="relative block aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-pd-strong transition-all duration-700 cursor-pointer group"
                      >
                         <Image 
                           src={img} 
                           alt="venue gallery" 
                           fill
                           className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                         />
                         <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-pd-purple/5 transition-colors"></div>
                         <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                            <Maximize2 size={14} />
                         </div>
                      </Link>
                   ))}
                </div>
             </div>

             {/* Small Location Map Placeholder */}
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-8 border-l-4 border-slate-900 pl-4">Location & Map</h2>
               <div className="w-full h-80 bg-slate-200 rounded-[32px] overflow-hidden relative shadow-xl">
                 <iframe 
                   src={`https://maps.google.com/maps?q=${encodeURIComponent(venue.name + ' ' + (venue.landmark || venue.location || venue.city))}&output=embed`}
                   className="w-full h-full border-0 rounded-[32px] shadow-sm hover:shadow-md transition-shadow"
                   allowFullScreen
                   loading="lazy"
                   referrerPolicy="no-referrer-when-downgrade"
                 ></iframe>
                 {/* Fallback Overlay if API key not provided */}
                 <div className="absolute inset-0 bg-slate-900/5 pointer-events-none"></div>
              </div>
            </div>

            {/* Reviews Section */}
            <div id="reviews" className="scroll-mt-32">
               <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-pd-soft mb-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Left: Overall Rating */}
                    <div className="text-center md:border-r border-slate-100 md:pr-10 min-w-[180px]">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Overall Rating</p>
                       <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{ratingStats.avg}</h3>
                       <div className="flex justify-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} className={i < Math.round(Number(ratingStats.avg)) ? "text-yellow-400 fill-yellow-400" : "text-slate-100 fill-slate-100"} />
                          ))}
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Based on {ratingStats.total} Reviews</p>
                    </div>
                    
                    {/* Middle: Rating Breakdown */}
                    <div className="flex-1 w-full space-y-2.5">
                       {ratingStats.breakdown.map((count, i) => (
                         <div key={i} className="flex items-center gap-4 group">
                           <span className="text-[10px] font-black text-slate-900 w-10 whitespace-nowrap">{5 - i} Star</span>
                           <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / ratingStats.total) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-yellow-400 rounded-full"
                              ></motion.div>
                           </div>
                           <span className="text-[10px] font-black text-slate-900 w-4">{count}</span>
                         </div>
                       ))}
                    </div>

                    {/* Right: Write Review Button */}
                    <div className="flex items-center justify-center md:pl-4">
                       <button 
                         onClick={() => setIsReviewModalOpen(true)}
                         className="px-8 py-4 bg-gradient-to-r from-[#FF3B6B] to-[#9F50E1] text-white text-[10px] font-black uppercase tracking-[0.2em] italic rounded-[20px] shadow-xl shadow-pd-pink/30 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                       >
                         Write a Review
                       </button>
                    </div>
                  </div>
               </div>

               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-slate-900">Guest Experiences</h2>
                 <div className="flex items-center gap-3">
                   <FilterIcon size={14} className="text-slate-400" />
                   <select 
                     value={reviewSort}
                     onChange={(e) => setReviewSort(e.target.value)}
                     className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none cursor-pointer"
                   >
                     <option>Most Recent</option>
                     <option>Highest Rating</option>
                     <option>Lowest Rating</option>
                   </select>
                 </div>
               </div>

                <div className="relative mb-12">
                   <AnimatePresence mode="wait">
                     {sortedReviews.length > 0 && (
                       <motion.div 
                        key={currentReviewIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                       >
                          {[currentReviewIndex, (currentReviewIndex + 1) % sortedReviews.length].map((idx, i) => (
                            <div 
                              key={`${idx}-${i}`} 
                              className={`bg-white p-7 md:p-8 rounded-[32px] border border-slate-100 shadow-pd-soft/50 relative flex flex-col h-full ${i === 1 ? 'hidden md:flex' : 'flex'}`}
                            >
                               <div className="flex gap-1 mb-4">
                                  {[...Array(5)].map((_, j) => (
                                    <Star key={j} size={14} className={j < sortedReviews[idx].rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"} />
                                  ))}
                               </div>
                               
                               <p className="text-sm md:text-base font-bold text-slate-700 leading-relaxed mb-6 italic">
                                 "{sortedReviews[idx].comment}"
                               </p>
  
                               <div className="flex items-center gap-3 mt-auto">
                                  <div className="w-10 h-10 rounded-full bg-pd-purple/10 flex items-center justify-center text-pd-purple text-[10px] font-black border-2 border-white shadow-md uppercase tracking-tighter">
                                     {(sortedReviews[idx].userName || 'A').charAt(0)}
                                  </div>
                                  <div>
                                     <h5 className="font-black text-slate-900 text-[11px] uppercase italic leading-tight tracking-tight">{sortedReviews[idx].userName}</h5>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(sortedReviews[idx].$createdAt).toLocaleDateString()}</p>
                                  </div>
                               </div>
                            </div>
                          ))}
                       </motion.div>
                     )}
                   </AnimatePresence>
  
                   {/* Slider Navigation */}
                   <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
                      {sortedReviews.map((_, i) => (
                        <button 
                          key={i} 
                          onClick={() => setCurrentReviewIndex(i)}
                          className={`h-1.5 rounded-full transition-all duration-500 ${currentReviewIndex === i ? 'w-8 bg-pd-red' : 'w-1.5 bg-slate-200 hover:bg-slate-300'}`}
                        />
                      ))}
                   </div>

                   {/* Side Controls */}
                   <div className="hidden md:block">
                      <button 
                        onClick={() => setCurrentReviewIndex((prev) => (prev - 1 + sortedReviews.length) % sortedReviews.length)}
                        className="absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full border border-slate-100 shadow-pd-strong flex items-center justify-center text-slate-400 hover:text-pd-red hover:scale-110 transition-all"
                      >
                         <ChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={() => setCurrentReviewIndex((prev) => (prev + 1) % sortedReviews.length)}
                        className="absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full border border-slate-100 shadow-pd-strong flex items-center justify-center text-slate-400 hover:text-pd-red hover:scale-110 transition-all"
                      >
                         <ChevronRight size={24} />
                      </button>
                   </div>
                </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR (Sticky Form) */}
          <aside className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-28 bg-white p-8 md:p-10 rounded-[32px] border border-slate-100 shadow-pd-strong">
               <div className="text-center mb-8 pb-8 border-b border-slate-50">
                  <div className="text-pd-red font-black text-[10px] uppercase tracking-[0.3em] mb-4 flex justify-center items-center gap-2">
                    <CheckCircle2 size={16} /> Direct Lead Contact
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Get Free Customized Quotes</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Zero Brokerage. Direct Rates.</p>
               </div>
               <form className="space-y-6" onSubmit={handleLeadSubmit}>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input 
                        required
                        type="text" 
                        placeholder="Enter your name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-pd-red transition-all" 
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Type</label>
                        <div className="relative">
                           <select 
                               value={formData.eventType}
                               onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                               className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer pr-10"
                           >
                               <option value="">Select Event</option>
                               <option value="Birthday Party">Birthday Party</option>
                               <option value="Wedding Events">Wedding Events</option>
                               <option value="Pre-Wedding Events">Pre-Wedding Events</option>
                               <option value="Anniversary Party">Anniversary Party</option>
                               <option value="Corporate Events">Corporate Events</option>
                               <option value="Kitty Party">Kitty Party</option>
                               <option value="Family Functions">Family Functions</option>
                               <option value="Festival Parties">Festival Parties</option>
                               <option value="Social Gatherings">Social Gatherings</option>
                               <option value="Kids Parties">Kids Parties</option>
                               <option value="Bachelor / Bachelorette Party">Bachelor / Bachelorette Party</option>
                               <option value="Housewarming Party">Housewarming Party</option>
                               <option value="Baby Shower">Baby Shower</option>
                               <option value="Engagement Ceremony">Engagement Ceremony</option>
                               <option value="Entertainment / Theme Parties">Entertainment / Theme Parties</option>
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest Count</label>
                        <div className="relative">
                           <select 
                               required
                               value={formData.guests}
                               onChange={(e) => setFormData({...formData, guests: e.target.value})}
                               className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer pr-10" 
                           >
                               <option value="">Select Capacity</option>
                               <option value="0-50">0-50 guests</option>
                               <option value="50-100">50-100 guests</option>
                               <option value="100-200">100-200 guests</option>
                               <option value="200-500">200-500 guests</option>
                               <option value="500-1000">500-1000 guests</option>
                               <option value="1000-2000">1000-2000 guests</option>
                               <option value="2000-5000">2000-5000 guests</option>
                               <option value="5000+">5000+ guests</option>
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                        </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone Number</label>
                    <div className="relative group flex items-center">
                        <div className="absolute left-5 text-sm font-bold text-slate-400 border-r border-slate-200 pr-3">+91</div>
                        <input 
                          required 
                          type="tel" 
                          placeholder="98765 00000" 
                          value={formData.phone}
                          maxLength={11} // 10 digits + 1 space
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
                            if (val.length > 10) val = val.slice(0, 10);
                            // Format as 5-5
                            let formatted = val;
                            if (val.length > 5) {
                              formatted = val.slice(0, 5) + ' ' + val.slice(5);
                            }
                            setFormData({...formData, phone: formatted});
                          }}
                          className="w-full h-14 pl-16 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-pd-red transition-all" 
                        />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirement Notes</label>
                    <textarea 
                        placeholder="e.g. Need rooms, catering required..." 
                        rows={3} 
                        value={formData.requirements}
                        onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                    ></textarea>
                 </div>

                 <button 
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full pd-btn-primary py-5 text-sm tracking-[0.2em] font-black uppercase italic shadow-2xl shadow-pd-pink/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                 >
                    {isSubmittingLead ? 'Sending...' : 'Get Best Rates'} <Send size={20} />
                 </button>

                 <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest px-4 leading-relaxed">
                   By submitting, you agree to receive quotes from the venue directly.
                 </p>
               </form>
            </div>
          </aside>

        </div>
      </section>

      {/* 4. SIMILAR VENUES */}
      <section className="bg-white py-20 px-6 border-t border-slate-100">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-10 flex items-center justify-between">
               Explore Similar Venues 
               <Link href="/venues" className="text-pd-red text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
                 View All <ArrowRight size={14} />
               </Link>
            </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {(venue.similarVenues && venue.similarVenues.length > 0 ? venue.similarVenues : []).map((v: any, i: number) => (
                 <Link 
                   key={i} 
                   href={`/venues/${v.id}`}
                   className="pd-card group bg-slate-50 overflow-hidden block hover:shadow-pd-strong transition-all"
                 >
                    <div className="relative h-56 overflow-hidden">
                       <img src={v.img} alt={v.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-6">
                       <h4 className="text-xl font-black text-slate-900 mb-1 line-clamp-1 italic">{v.name}</h4>
                       <p className="text-xs font-bold text-slate-500 mb-4">{v.location}</p>
                       <div className="flex items-center justify-between">
                          <span className="text-pd-pink font-black text-lg">₹{v.price} <span className="text-[10px] opacity-40 italic">/plate</span></span>
                          <div className="flex items-center gap-1 font-black text-xs text-slate-800">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" /> {v.rating}
                          </div>
                       </div>
                    </div>
                 </Link>
               ))}
            </div>
         </div>
      </section>

      {/* 5. REVIEW MODAL */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">Rate Your <span className="text-pd-red">Experience</span></h3>
                    <button onClick={() => setIsReviewModalOpen(false)} className="p-3 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl transition-all shadow-sm"><X size={20} /></button>
                 </div>

                 <form onSubmit={handleReviewSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                          <input 
                             required
                             type="text" 
                             placeholder="Enter your name" 
                             value={newReview.name}
                             onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                             className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black outline-none focus:border-pd-red transition-all shadow-pd-soft-inner" 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                          <input 
                             type="email" 
                             placeholder="your@email.com (Optional)" 
                             value={newReview.email}
                             onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                             className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-black outline-none focus:border-pd-red transition-all shadow-pd-soft-inner" 
                          />
                       </div>
                    </div>

                    <div className="text-center bg-slate-900 p-8 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-pd-red/10 rounded-full blur-3xl -mr-10 -mt-10" />
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4 relative z-10 italic">How was the venue?</p>
                       <div className="flex justify-center gap-4 relative z-10">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className="transition-transform active:scale-90"
                            >
                              <Star 
                                size={48} 
                                className={`transition-all duration-500 ${(hoverRating || newReview.rating) >= star ? "text-yellow-400 fill-yellow-400 scale-110" : "text-white/10"}`}
                              />
                            </button>
                          ))}
                       </div>
                       <p className="text-[9px] font-black uppercase text-white/30 tracking-widest mt-4">Tap to rate</p>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Detailed Feedback</label>
                       <textarea 
                          required
                          placeholder="Tell us about the food, staff, and overall ambiance..." 
                          rows={4} 
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[40px] text-sm font-bold italic outline-none focus:border-pd-red transition-all shadow-pd-soft-inner"
                       ></textarea>
                    </div>

                    <div className="flex gap-4">
                       <button 
                         type="button"
                         onClick={() => setIsReviewModalOpen(false)}
                         className="flex-1 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all italic"
                       >
                         Cancel
                       </button>
                       <button 
                          type="submit"
                          disabled={isSubmittingReview}
                          className="flex-1 pd-btn-primary py-5 rounded-[24px] uppercase text-[11px] font-black italic shadow-xl shadow-pd-pink/20 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                       >
                          {isSubmittingReview ? 'Syncing...' : 'Post Review'} <Send size={16} className="rotate-45" />
                       </button>
                    </div>
                 </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    <AnimatePresence>
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 100, x: '-50%', scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
          exit={{ opacity: 0, y: 20, x: '-50%', scale: 0.9 }}
          className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] px-8 py-5 rounded-[28px] shadow-2xl flex items-center gap-4 border border-white/5 backdrop-blur-xl ${
            toast.type === 'success' ? 'bg-slate-900/90 text-white' : 'bg-red-950/90 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={24} /> : <XCircle className="text-pd-red" size={24} />}
          <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 leading-none mb-1">Notification</span>
             <p className="text-sm font-black uppercase tracking-tight italic">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="ml-4 p-2 hover:bg-white/10 rounded-full transition-all">
             <X size={16} className="text-white/40" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
}
