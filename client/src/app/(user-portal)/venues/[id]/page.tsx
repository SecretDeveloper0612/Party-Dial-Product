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
  Share2,
  Heart,
  MessageSquare,
  ArrowRight,
  Info,
  DollarSign,
  Calendar,
  Send,
  X,
  Image as ImageIcon,
  Maximize2
} from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Camera, Trash2, Edit3, Filter as FilterIcon } from 'lucide-react';

import { MOCK_VENUES } from '@/data/venues';
import { STORAGE_BUCKET_ID } from '@/lib/appwrite';

// Helper to map amenity names to icons
const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Ample Parking": <ParkingCircle size={20} />,
  "Parking Available": <ParkingCircle size={20} />,
  "In-house Catering": <Utensils size={20} />,
  "Catering Available": <Utensils size={20} />,
  "Thematic Decoration": <Palette size={20} />,
  "In-house Decoration": <Palette size={20} />,
  "AC Main Hall": <Wind size={20} />,
  "Air Conditioned Hall": <Wind size={20} />,
  "Live DJ & Sound": <Music size={20} />,
  "DJ or Music System": <Music size={20} />,
  "Bridal Room": <Hotel size={20} />,
  "Guest Rooms": <Hotel size={20} />,
  "Power Backup": <ShieldCheck size={20} />,
  "Outdoor Lawn": <Wind size={20} />,
  "Default": <CheckCircle2 size={20} />
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
      const response = await fetch(`http://127.0.0.1:5005/api/venues/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueId: id,
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
        alert('Lead submitted successfully! Our team will contact you soon.');
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
        alert(result.message || 'Error submitting lead');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('Failed to submit lead. Please try again.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Fetch venue data from backend or mock
  useEffect(() => {
    const fetchVenue = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:5005/api/venues/${id}`);
        const result = await response.json();

        if (result.status === 'success') {
          const doc = result.data;
          const photoIds = doc.photos ? (typeof doc.photos === 'string' ? JSON.parse(doc.photos) : doc.photos) : [];
          
          const mappedVenue = {
            id: doc.$id,
            name: doc.venueName || "Unnamed Venue",
            location: doc.landmark || doc.city || "India",
            city: doc.city || "Unknown",
            pincode: doc.pincode || "",
            type: doc.venueType || "Banquet Hall",
            verified: doc.isVerified || false,
            popular: doc.status === 'active',
            rating: 4.8, 
            reviewCount: 0,
            pricePerPlate: doc.perPlateVeg || 1500,
            pricePerPlateNonVeg: doc.perPlateNonVeg || 1800,
            startingRental: "₹1,50,000",
            capacity: getCapacityLabel(doc.capacity),
            about: doc.description || "No description available for this venue.",
            images: photoIds.map((pid: string) => 
               `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${pid}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
            ).concat(photoIds.length === 0 ? ["/gallery/interior.png"] : []),
            amenities: (doc.amenities ? (typeof doc.amenities === 'string' ? JSON.parse(doc.amenities) : doc.amenities) : []).map((a: string) => ({
              name: a,
              icon: AMENITY_ICONS[a] || AMENITY_ICONS["Default"]
            })),
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
            about: "This is a premium venue listed on PartyDial. Experience excellence in service and ambiance.",
            amenities: mock.amenities.map(a => ({
              name: a,
              icon: AMENITY_ICONS[a] || AMENITY_ICONS["Default"]
            })),
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

  // Review State Management
  const [reviews, setReviews] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSort, setReviewSort] = useState("Most Recent");
  const [hoverRating, setHoverRating] = useState(0);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    categories: {
      cleanliness: 0,
      food: 0,
      staff: 0,
      decor: 0,
      value: 0
    }
  });

  useEffect(() => {
    if (venue) setReviews(venue.reviews || []);
  }, [venue]);


  const ratingStats = useMemo(() => {
    const total = reviews.length || 1; // Avoid divide by zero
    const avg = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : "4.8";
    const counts = [0, 0, 0, 0, 0]; // 1-5 stars
    reviews.forEach(r => counts[Math.floor(r.rating) - 1]++);
    return { avg, total: reviews.length, breakdown: counts.reverse() }; // 5 to 1
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    let rs = [...reviews];
    if (reviewSort === "Highest Rating") rs.sort((a, b) => b.rating - a.rating);
    else if (reviewSort === "Lowest Rating") rs.sort((a, b) => a.rating - b.rating);
    else rs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0) return alert("Please select a rating");
    
    const reviewToAdd = {
      name: "Current User", // In real app, get from auth
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rating: newReview.rating,
      comment: newReview.comment
    };
    
    setReviews([reviewToAdd, ...reviews]);
    setIsReviewModalOpen(false);
    setNewReview({ rating: 0, comment: '', categories: { cleanliness: 0, food: 0, staff: 0, decor: 0, value: 0 } });
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
        alert("Link copied to clipboard!");
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
      <section className="relative h-[65vh] bg-slate-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image 
              src={venue.images[activeImage]} 
              alt={venue.name} 
              fill 
              className="object-cover opacity-80"
              priority
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
        <Link href={`/venues/${id}/gallery`} className="absolute bottom-6 md:bottom-12 right-6 md:right-12 z-30">
          <button className="px-5 py-3 md:px-8 md:py-4 bg-black/20 backdrop-blur-xl rounded-full border border-white/10 text-white flex items-center gap-2 md:gap-3 hover:bg-pd-red transition-all group active:scale-95 shadow-2xl">
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
            </div>
            
            <div className="flex w-full md:w-auto justify-between md:justify-start gap-4 md:gap-8 md:px-10 md:border-l border-slate-100 pt-6 md:pt-0 border-t md:border-t-0 mt-2 md:mt-0">
               <div className="text-center md:text-left flex-1 md:flex-none">
                 <p className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Guest Capacity</p>
                 <div className="flex flex-col items-center md:items-start gap-1">
                   <Users size={16} className="text-pd-purple md:w-5 md:h-5" />
                   <span className="text-sm md:text-lg font-black text-slate-900">{venue.capacity}</span>
                 </div>
               </div>
               <div className="text-center md:text-left flex-1 md:flex-none">
                 <p className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Veg Boarding</p>
                 <div className="flex flex-col items-center md:items-start gap-1">
                   <Utensils size={16} className="text-pd-pink md:w-5 md:h-5" />
                   <span className="text-sm md:text-lg font-black text-slate-900">₹{venue.pricePerPlate} <span className="text-[8px] md:text-[9px] opacity-40">/ plate</span></span>
                 </div>
               </div>
               <div className="text-center md:text-left flex-1 md:flex-none">
                 <p className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Non-Veg Boarding</p>
                 <div className="flex flex-col items-center md:items-start gap-1">
                   <Utensils size={16} className="text-pd-red md:w-5 md:h-5" />
                   <span className="text-sm md:text-lg font-black text-slate-900">₹{venue.pricePerPlateNonVeg} <span className="text-[8px] md:text-[9px] opacity-40">/ plate</span></span>
                 </div>
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
                <div className="columns-2 md:columns-3 gap-4 space-y-4">
                   {venue.images.slice(0, 5).map((img: string, i: number) => (
                      <Link 
                        key={i} 
                        href={`/venues/${id}/gallery`}
                        className="relative block break-inside-avoid rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-pd-strong transition-all duration-700 cursor-pointer group"
                      >
                         <Image 
                           src={img} 
                           alt="venue gallery" 
                           width={800}
                           height={1000}
                           className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000" 
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
                   src={`https://maps.google.com/maps?q=${encodeURIComponent(venue.name + ' ' + (venue.location || venue.city))}&output=embed`}
                   className="w-full h-full border-0 grayscale opacity-90 contrast-125"
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
                                  <div className="w-10 h-10 rounded-full bg-pd-purple/10 flex items-center justify-center text-pd-purple text-xs font-black border-2 border-white shadow-md">
                                     {sortedReviews[idx].name.charAt(0)}
                                  </div>
                                  <div>
                                     <h5 className="font-black text-slate-900 text-sm leading-tight">{sortedReviews[idx].name}</h5>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sortedReviews[idx].date}</p>
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
                        <select 
                            value={formData.eventType}
                            onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                        >
                            <option>Wedding</option>
                            <option>Engagement</option>
                            <option>Birthday</option>
                            <option>Corporate</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest Count</label>
                        <input 
                            required
                            type="number" 
                            placeholder="Eg. 200" 
                            value={formData.guests}
                            onChange={(e) => setFormData({...formData, guests: e.target.value})}
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none" 
                        />
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
                 <div key={i} className="pd-card group bg-slate-50 overflow-hidden">
                    <div className="relative h-56 overflow-hidden">
                       <Image src={v.img} alt={v.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                       <h4 className="text-xl font-black text-slate-900 mb-1">{v.name}</h4>
                       <p className="text-xs font-bold text-slate-500 mb-4">{v.location}</p>
                       <div className="flex items-center justify-between">
                          <span className="text-pd-pink font-black text-lg">{v.price} <span className="text-[10px] opacity-40">/plate</span></span>
                          <div className="flex items-center gap-1 font-black text-xs text-slate-800">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" /> {v.rating}
                          </div>
                       </div>
                    </div>
                 </div>
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
                   <h3 className="text-2xl font-black text-slate-900 italic">Share Your Experience</h3>
                   <button onClick={() => setIsReviewModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                 </div>

                 <form onSubmit={handleReviewSubmit} className="space-y-8">
                    {/* Main Star Selection */}
                    <div className="text-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Overall rating</p>
                       <div className="flex justify-center gap-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className="transition-transform active:scale-95"
                            >
                              <Star 
                                size={40} 
                                className={`transition-colors ${(hoverRating || newReview.rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`}
                              />
                            </button>
                          ))}
                       </div>
                    </div>

                    {/* Category Specific Ratings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {Object.keys(newReview.categories).map((cat) => (
                         <div key={cat} className="flex items-center justify-between px-2">
                           <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{cat}</span>
                           <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setNewReview({
                                    ...newReview,
                                    categories: { ...newReview.categories, [cat]: s }
                                  })}
                                  className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all ${newReview.categories[cat as keyof typeof newReview.categories] >= s ? 'bg-pd-red text-white' : 'bg-slate-50 text-slate-300'}`}
                                >
                                  {s}
                                </button>
                              ))}
                           </div>
                         </div>
                       ))}
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detailed Review</label>
                       <textarea 
                        required
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Tell others about your event, the food, and the service..." 
                        rows={4} 
                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-bold outline-none focus:border-pd-red transition-all"
                       ></textarea>
                    </div>

                    <div className="flex items-center justify-between">
                       <button type="button" className="flex items-center gap-3 px-6 py-4 bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-200 transition-all">
                          <Camera size={18} /> Add Photos
                       </button>
                       <button type="submit" className="pd-btn-primary !px-10 !py-4 text-[11px] font-black uppercase tracking-widest italic flex items-center gap-3">
                          Submit Review <Send size={18} />
                       </button>
                    </div>
                 </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
