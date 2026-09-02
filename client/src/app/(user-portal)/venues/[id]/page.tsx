/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  MessageCircle,
  User,
  Mail,
  PartyPopper
} from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Camera, Trash2, Edit3, Filter as FilterIcon, IndianRupee, Search } from 'lucide-react';

import Footer from '@/shared/components/Footer';

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
  if (isNaN(cap)) return "Flexible";
  return `Up to ${cap}`;
};

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const paramId = params.id as string;
  const id = paramId.includes('-') ? paramId.split('-').pop() as string : paramId;
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  // Sync user details if logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { account } = await import('@/lib/appwrite');
        const user = await account.get();
        const labels = user.labels || [];
        const isVendor = labels.includes('vendor');
        const isMasterAdmin = user.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@partydial.com");

        if (user && !isVendor && !isMasterAdmin) {
          setIsLoggedIn(true);
          setCurrentUserEmail(user.email || '');
          setFormData(prev => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email,
            phone: user.phone?.replace('+91', '') || prev.phone
          }));
          setNewReview(prev => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email
          }));
        }
      } catch (err) {
        setIsLoggedIn(false);
        setCurrentUserEmail('');
      }
    };

    checkAuth();
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);

    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
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
          eventDate: formData.eventDate,
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
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
        const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
        const fetchUrl = `${baseUrl}/venues/${id}`;
        const response = await fetch(fetchUrl);
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
          let logoUrl = null;
          try {
             const rawPhotos = typeof doc.photos === 'string' ? JSON.parse(doc.photos) : doc.photos;
             if (Array.isArray(rawPhotos)) {
                let firstPhoto = null;
                for (const p of rawPhotos) {
                   if (typeof p === 'object' && p !== null) {
                      if (!firstPhoto) firstPhoto = p;
                      if (p.category === 'Profile') {
                         logoUrl = getAppwriteImageUrl(p.id || p.$id);
                         break;
                      }
                   }
                   if (typeof p === 'string') {
                      try {
                         const obj = JSON.parse(p);
                         if (!firstPhoto && obj) firstPhoto = obj;
                         if (obj && obj.category === 'Profile') {
                            logoUrl = getAppwriteImageUrl(obj.id || obj.$id);
                            break;
                         }
                      } catch(e) {
                         if (!firstPhoto) firstPhoto = { id: p };
                      }
                   }
                }
                if (!logoUrl && firstPhoto) {
                    logoUrl = getAppwriteImageUrl(firstPhoto.id || firstPhoto.$id);
                }
             }
          } catch(e) {}
          const photoIds = parsePhotos(doc.photos);
          
          // Unified storage parsing
          let p_data: any = { packages: [], halls: [], videos: [] };
          try {
             if (doc.packages) {
                const parsed = JSON.parse(doc.packages);
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                   p_data = parsed;
                } else {
                   p_data.packages = Array.isArray(parsed) ? parsed : [];
                }
             }
          } catch(e) {}

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
            pricePerPlate: doc.perPlateVeg || "N/A",
            pricePerPlateNonVeg: doc.perPlateNonVeg || "N/A",
            startingRental: "₹1,50,000",
            capacity: getCapacityLabel(doc.capacity),
            logo: logoUrl,
            about: doc.description || "No description available for this venue.",
            images: photoIds.length > 0 
              ? photoIds.map((p: any) => getAppwriteImageUrl(p.id))
              : [],
            amenities: (doc.amenities ? (typeof doc.amenities === 'string' ? JSON.parse(doc.amenities) : doc.amenities) : []).map((a: string) => {
              const data = AMENITY_DATA[a] || AMENITY_DATA["Default"];
              return {
                name: data.label,
                icon: data.icon
              };
            }),
            halls: p_data.halls && p_data.halls.length > 0 ? p_data.halls : [{ name: "Primary Event Space", capacity: `${getCapacityLabel(doc.capacity)} Guests`, area: "Main Hall" }],
            policies: [
              "Advance Payment: 25% at the time of booking.",
              "Cancellation: Non-refundable if cancelled within 30 days of event.",
              "Outside Food: Not allowed.",
              "Alcohol: Allowed with valid license.",
              "Music: Allowed till 11:00 PM as per local guidelines."
            ],
            reviews: [],
            similarVenues: [],
            packages: p_data.packages || [],
            videos: p_data.videos || [],
            isPaid: (() => {
              const plan = doc.subscriptionPlan;
              if (!plan || plan === 'free' || plan === 'None') return false;
              if (plan === 'trial_30') {
                if (doc.subscriptionExpiry) return new Date(doc.subscriptionExpiry).getTime() > Date.now();
                const createdAt = doc.$createdAt ? new Date(doc.$createdAt).getTime() : Date.now();
                return (Date.now() - createdAt) <= (30 * 24 * 60 * 60 * 1000);
              }
              return (!doc.subscriptionExpiry || new Date(doc.subscriptionExpiry).getTime() > Date.now());
            })(),
          };

          // Fetch Similar Venues based on Pincode/City
          try {
            const baseS = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
            const baseUrl = baseS.endsWith('/api') ? baseS : `${baseS}/api`;
            const allResp = await fetch(`${baseUrl}/venues?verified=true`);
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
                    img: vPhotos.length > 0 ? getAppwriteImageUrl(vPhotos[0]) : ""
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
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
        const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
        console.warn(`API Fetch failed from ${baseUrl}/venues/${id}, trying mock data:`, err);
      }

      // Fallback to MOCK_VENUES
      const mock = MOCK_VENUES.find(v => v.id === id);
      if (mock) {
          const mappedMock = {
            ...mock,
            images: [],
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
            similarVenues: [],
            isPaid: true // Mock venues are treated as paid for demo purposes
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
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
  const [isSpaceGalleryOpen, setIsSpaceGalleryOpen] = useState(false);
  const [activeSpaceImageIndex, setActiveSpaceImageIndex] = useState(0);
  const [reviewSort, setReviewSort] = useState("Most Recent");
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).isOtherModalOpen = isReviewModalOpen || isAboutModalOpen || isAmenitiesModalOpen || isAllReviewsModalOpen || isSpaceGalleryOpen;
    }
  }, [isReviewModalOpen, isAboutModalOpen, isAmenitiesModalOpen, isAllReviewsModalOpen, isSpaceGalleryOpen]);

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
  const [hoverRating, setHoverRating] = useState(0);

  const fetchReviews = async () => {
    if (!id) return;
    setIsLoadingReviews(true);
    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
      const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
      const fetchUrl = `${baseUrl}/venues/${id}/reviews`;
      const response = await fetch(fetchUrl, { cache: 'no-store' });
      const result = await response.json();
      if (result.status === 'success') {
        setReviews(result.data || []);
      }
    } catch (err) {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
      const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
      console.error(`Failed to fetch reviews from ${baseUrl}/venues/${id}/reviews:`, err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const rs = [...reviews];
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
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
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
        setReviews(prev => {
          const index = prev.findIndex(r => r.$id === result.data.$id);
          if (index !== -1) {
            const newReviews = [...prev];
            newReviews[index] = result.data;
            return newReviews;
          }
          return [result.data, ...prev];
        });
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
        <div className="min-h-screen bg-slate-50 font-['Poppins'] overflow-hidden">

          {/* SKELETON: Hero Image */}
          <div className="h-[45vh] md:h-[65vh] bg-slate-200 animate-pulse w-full"></div>
          
          {/* SKELETON: Main Content Area */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:-mt-32 relative z-10 flex flex-col lg:flex-row gap-8">
            
            {/* Left Col */}
            <div className="flex-1 space-y-6">
              {/* Header Box */}
              <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-slate-100 space-y-4">
                <div className="h-4 w-24 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-10 w-3/4 bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="h-5 w-1/2 bg-slate-200 rounded-xl animate-pulse"></div>
                
                <div className="flex gap-4 pt-4 border-t border-slate-100 mt-6">
                  <div className="h-12 w-24 bg-slate-200 rounded-xl animate-pulse"></div>
                  <div className="h-12 w-24 bg-slate-200 rounded-xl animate-pulse"></div>
                  <div className="h-12 w-24 bg-slate-200 rounded-xl animate-pulse"></div>
                </div>
              </div>

              {/* About Box */}
              <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-slate-100 space-y-4 mt-8">
                <div className="h-8 w-40 bg-slate-200 rounded-xl animate-pulse mb-6"></div>
                <div className="h-4 w-full bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-4 w-full bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-4 w-3/4 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Right Col / Sidebar */}
            <div className="w-full lg:w-[400px]">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 sticky top-24 space-y-6">
                <div className="h-8 w-48 bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-12 w-full bg-slate-200 rounded-xl animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded-xl animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded-xl animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded-xl animate-pulse"></div>
                </div>
                <div className="h-14 w-full bg-pd-red/20 rounded-xl animate-pulse mt-4"></div>
              </div>
            </div>
          </div>
        </div>
     );
  }

  if (!venue) {
     return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">

            <div className="text-center mt-20">
                <h1 className="text-2xl font-pd font-semibold text-slate-900 mb-4">Venue Not Found</h1>
                <Link href="/venues" className="text-pd-red font-pd font-normal hover:underline">Back to Listings</Link>
            </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Poppins']">

      
      {/* 1. IMAGE GALLERY HERO (REDESIGNED) */}
      <section className="px-4 pt-6 md:px-8 bg-white relative">
        <div className="w-full h-[45vh] md:h-[55vh] bg-slate-900 rounded-[40px] relative overflow-hidden shadow-sm">
           
           {/* FULL WIDTH IMAGE PANEL */}
           <div className="absolute inset-0 z-0">
             <AnimatePresence mode="wait">
               {venue.images.length > 0 ? (
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
                     alt="" 
                     className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-60 scale-110"
                     loading="lazy"
                   />
                   <img 
                     src={venue.images[activeImage]} 
                     alt={venue.name} 
                     className="absolute inset-0 w-full h-full object-contain z-10 drop-shadow-2xl"
                     loading="lazy"
                   />
                 </motion.div>
               ) : (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-100 lg:rounded-l-[40px]"
                 >
                   <img src="/logo.jpg" alt="PartyDial" className="w-32 md:w-48 grayscale opacity-20" />
                   <p className="text-slate-900/40 font-pd font-normal uppercase tracking-[0.3em] text-[10px] md:text-sm">No Photos Available</p>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
           
           {/* ARROWS */}
           {venue.images.length > 1 && (
             <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-20">
               <button onClick={prevImage} className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:scale-105 transition-all">
                 <ChevronLeft size={20} />
               </button>
               <button onClick={nextImage} className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:scale-105 transition-all">
                 <ChevronRight size={20} />
               </button>
             </div>
           )}

           {/* Top Actions (Back Button / Share) */}
           <div className="absolute top-4 md:top-8 left-4 md:left-8 right-4 md:right-8 flex items-center justify-between z-30">
              <Link href="/venues" className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 text-slate-700 text-[10px] md:text-xs font-pd font-semibold uppercase tracking-widest hover:bg-white transition-all shadow-sm">
                <ChevronLeft size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="flex gap-2 md:gap-3">
                <button 
                  onClick={handleShare}
                  className="p-2.5 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 text-slate-700 hover:bg-white transition-all active:scale-95 group shadow-sm"
                  title="Share Venue"
                >
                   <Share2 size={18} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>
           </div>
        </div>
        

      </section>

      {/* 2. VENUE TITLE & HIGHLIGHTS */}
      <section className="px-4 md:px-6 relative z-20">
        <div className="max-w-7xl mx-auto -mt-2 md:-mt-4">
          <div className="bg-white/95 p-4 md:p-6 rounded-[28px] md:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row gap-6 lg:gap-10 items-center justify-between border border-slate-100 backdrop-blur-xl">
            
            {/* LEFT SIDE: Image + Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 w-full lg:w-auto">
               {/* Image Box */}
               {venue.images && venue.images.length > 0 && (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-[120px] md:h-[120px] rounded-3xl overflow-hidden shrink-0 shadow-sm border border-slate-100/50 p-2 bg-white">
                     <div className="relative w-full h-full rounded-2xl overflow-hidden">
                       <Image src={venue.images[0]} alt={venue.name} fill className="object-cover" />
                     </div>
                  </div>
               )}
               
               <div className="flex flex-col justify-center py-2 text-center sm:text-left">
                  {/* Pills */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                     <div className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full flex items-center gap-1 uppercase text-[8px] md:text-[9px] font-pd font-bold tracking-widest border border-emerald-100">
                        <CheckCircle2 size={10} /> VERIFIED
                     </div>
                     {venue.popular && (
                        <div className="bg-rose-50 text-rose-500 px-2.5 py-1 rounded-full flex items-center gap-1 uppercase text-[8px] md:text-[9px] font-pd font-bold tracking-widest border border-rose-100">
                           <Star size={10} className="fill-rose-500" /> POPULAR
                        </div>
                     )}
                     <div className="bg-slate-900 text-white px-2.5 py-1 rounded-full flex items-center gap-1 text-[9px] md:text-[10px] font-pd font-bold">
                        <Star size={10} className="text-yellow-400 fill-yellow-400" /> {ratingStats.avg} <span className="text-white/60 font-pd font-normal">({ratingStats.total})</span>
                     </div>
                  </div>
                  
                  {/* Title & Location */}
                  <h1 className="text-2xl sm:text-3xl md:text-[38px] font-pd font-bold text-slate-900 mb-1 tracking-tight leading-tight">{venue.name}</h1>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-500 font-pd font-medium text-xs md:text-sm">
                     <MapPin className="text-rose-400 shrink-0" size={14} />
                     <span className="leading-relaxed">{venue.location}</span>
                  </div>
               </div>
            </div>
            
            {/* RIGHT SIDE: Stats + Buttons */}
            <div className="flex flex-col gap-4 w-full lg:w-auto relative z-10 lg:pl-10">
               {/* Stats Row */}
               <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8 lg:gap-12 pb-4 lg:pb-0 border-b border-slate-100 lg:border-b-0">
                   <div className="flex flex-col gap-1 items-center sm:items-start">
                       <div className="flex items-center gap-1.5">
                          <Users size={12} className="text-indigo-400" />
                          <span className="text-[8px] md:text-[9px] font-pd font-bold uppercase text-slate-400 tracking-widest">Guest Capacity</span>
                       </div>
                       <span className="text-xs sm:text-sm md:text-[15px] font-black text-slate-800">
                          {venue.capacity_min ? `Up to ${venue.capacity_max}` : venue.capacity}
                       </span>
                   </div>
                   
                   <div className="flex flex-col gap-1 items-center sm:items-start">
                       <div className="flex items-center gap-1.5">
                          <Utensils size={12} className="text-emerald-400" />
                          <span className="text-[8px] md:text-[9px] font-pd font-bold uppercase text-slate-400 tracking-widest">Veg Plate</span>
                       </div>
                       <span className="text-xs sm:text-sm md:text-[15px] font-black text-slate-800">
                         {venue.price_per_plate_veg ? `₹${venue.price_per_plate_veg}` : (venue.pricePerPlate !== "N/A" ? `₹${venue.pricePerPlate}` : "N/A")}
                       </span>
                   </div>
                   
                   <div className="flex flex-col gap-1 items-center sm:items-start">
                       <div className="flex items-center gap-1.5">
                          <Utensils size={12} className="text-rose-400" />
                          <span className="text-[8px] md:text-[9px] font-pd font-bold uppercase text-slate-400 tracking-widest">Non-Veg Plate</span>
                       </div>
                       <span className="text-xs sm:text-sm md:text-[15px] font-black text-slate-800">
                         {venue.price_per_plate_nonveg ? `₹${venue.price_per_plate_nonveg}` : (venue.pricePerPlateNonVeg !== "N/A" ? `₹${venue.pricePerPlateNonVeg}` : "N/A")}
                       </span>
                   </div>
               </div>
               
               {/* Buttons Row */}
               {venue.isPaid && (
                   <div className="flex flex-row items-center gap-2 md:gap-3">
                      <button 
                         onClick={() => window.dispatchEvent(new CustomEvent('open-inquiry-popup', { detail: { venueId: id } }))}
                         className="flex-1 lg:w-[140px] px-3 py-2.5 sm:py-3 bg-[#f43f5e] text-white text-[9px] sm:text-[10px] md:text-xs font-pd font-bold uppercase tracking-widest rounded-xl hover:bg-rose-600 transition-all flex items-center justify-center gap-1.5 md:gap-2 active:scale-95 shadow-sm"
                      >
                         <MessageSquare size={14} fill="white" /> <span>Get Quote</span>
                      </button>
                      <a 
                         href={`tel:${venue.contactNumber}`}
                         className="flex-1 lg:w-[110px] px-3 py-2.5 sm:py-3 bg-white border border-slate-200 text-slate-700 text-[9px] sm:text-[10px] md:text-xs font-pd font-bold uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 md:gap-2 active:scale-95 shadow-sm"
                      >
                         <Phone size={14} className="shrink-0" /> <span>Call</span>
                      </a>
                      <a 
                         href={`https://wa.me/${venue.contactNumber}?text=Hi, I am interested in ${venue.name} from PartyDial.`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex-1 lg:w-[140px] px-3 py-2.5 sm:py-3 bg-[#25D366] text-white text-[9px] sm:text-[10px] md:text-xs font-pd font-bold uppercase tracking-widest rounded-xl hover:bg-[#20b858] transition-all flex items-center justify-center gap-1.5 md:gap-2 active:scale-95 shadow-sm"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="shrink-0"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg> <span>WhatsApp</span>
                      </a>
                   </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT AREA */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT CONTENT */}
          <div className="flex-1 min-w-0 space-y-16">
            
            {/* About Section */}
            <div>
              <p className="text-slate-800 font-pd font-normal leading-relaxed text-base line-clamp-5 whitespace-pre-line">
                {venue.about}
              </p>
              {venue.about && venue.about.length > 250 && (
                <>
                  <p className="mt-4 font-pd font-semibold text-slate-900 text-base">The space...</p>
                  <button 
                    onClick={() => setIsAboutModalOpen(true)}
                    className="mt-4 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-pd font-semibold text-slate-900 transition-colors"
                  >
                    Show more
                  </button>
                </>
              )}
            </div>

            {/* Amenities Section */}
            <div className="border-t border-slate-200 pt-12">
              <h2 className="text-[22px] font-pd font-semibold text-slate-900 mb-6">What this place offers</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-8">
                 {venue.amenities.slice(0, 6).map((amenity: any, i: number) => (
                   <div key={i} className="flex items-center gap-4 py-2 text-slate-800">
                      <div className="text-slate-700 shrink-0 [&>svg]:w-[26px] [&>svg]:h-[26px] [&>svg]:stroke-[1.5]">
                        {amenity.icon}
                      </div>
                      <span className="text-base font-pd font-normal">{amenity.name}</span>
                   </div>
                 ))}
              </div>
              {venue.amenities.length > 6 && (
                 <button 
                   onClick={() => setIsAmenitiesModalOpen(true)}
                   className="px-6 py-3 bg-white border border-slate-900 hover:bg-slate-50 rounded-xl text-[15px] font-pd font-semibold text-slate-900 transition-colors"
                 >
                   Show all {venue.amenities.length} amenities
                 </button>
              )}
            </div>

            {/* Hall / Capacity Details */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 md:p-8">
               <div className="flex items-center justify-between mb-4 md:mb-6">
                 <h2 className="text-xl md:text-2xl font-pd font-semibold text-slate-900">Available Spaces</h2>
                 {venue.halls?.filter((h: any) => h.image).length > 0 && (
                   <button 
                     onClick={() => {
                       setActiveSpaceImageIndex(0);
                       setIsSpaceGalleryOpen(true);
                     }} 
                     className="text-xs md:text-sm text-pd-pink font-pd font-semibold hover:underline flex items-center gap-1 bg-pd-pink/10 px-3 py-1.5 rounded-full"
                   >
                     <ImageIcon size={14} /> View All Images
                   </button>
                 )}
               </div>
               <div className="space-y-3">
                 {venue.halls.map((hall: any, i: number) => (
                   <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 px-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all">
                      <div className="flex flex-1 items-start gap-4 mb-3 sm:mb-0">
                        {hall.image ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200 shadow-sm">
                             <img src={hall.image} alt={hall.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl shrink-0 bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
                             <ImageIcon size={24} className="text-slate-300" />
                          </div>
                        )}
                        <div className="flex-1 pr-4">
                          <h4 className="text-[17px] font-pd font-bold text-slate-900 mb-0.5 leading-tight">{hall.name}</h4>
                          <p className="text-slate-500 text-[10px] font-pd font-bold uppercase tracking-widest mb-1.5">{hall.area}</p>
                          {hall.description && (
                            <p className="text-slate-500 text-xs leading-relaxed max-w-md line-clamp-2">
                               {hall.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-pd-pink font-pd font-bold text-sm border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 mt-2 sm:mt-0 shrink-0">
                        <Users size={18} /> <span>{hall.capacity}</span>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
 
            {/* Custom Packages Section */}
            {venue.packages && venue.packages.length > 0 && (
               <div>
                  <h2 className="text-2xl font-pd font-semibold text-slate-900 mb-8 border-l-4 border-pd-pink pl-5 uppercase tracking-widest ">Special Packages</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {venue.packages.map((pkg: any, i: number) => (
                        <motion.div 
                           key={i}
                           whileHover={{ y: -5 }}
                           className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] relative overflow-hidden group transition-all"
                        >
                           <div className="absolute top-0 right-0 w-32 h-32 bg-pd-pink/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-125"></div>
                           
                           <div className="relative z-10">
                              <div className="flex justify-between items-start mb-6">
                                 <h4 className="text-xl font-pd font-semibold text-slate-900 uppercase  tracking-tighter leading-none">{pkg.name}</h4>
                                 <div className="flex items-center text-pd-pink font-pd font-normal text-2xl  leading-none drop-shadow-sm">
                                    <span className="text-sm mr-0.5">₹</span>{pkg.price}
                                 </div>
                              </div>
                              <p className="text-[11px] font-pd font-normal text-slate-400 uppercase tracking-widest leading-relaxed">
                                 {pkg.desc}
                              </p>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            )}



             {/* Venue Gallery Section */}
             <div className="py-8">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-xl font-pd font-semibold text-slate-900 border-l-4 border-slate-900 pl-4 uppercase tracking-widest">Venue Gallery</h2>
                   <Link href={`/venues/${id}/gallery`} className="group flex items-center gap-2 text-[10px] font-pd font-normal text-pd-purple uppercase tracking-widest hover:text-pd-red transition-all">
                      Explore All Photos <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                   {venue.images.slice(0, 3).map((img: string, i: number) => (
                      <Link 
                        key={i} 
                        href={`/venues/${id}/gallery`}
                        className="relative block aspect-4/3 rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-pd-strong transition-all duration-700 cursor-pointer group"
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

             {/* Venue Videos Section */}
             {venue.videos && venue.videos.length > 0 && (
               <div className="py-8 border-t border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between mb-8 pr-4">
                     <h2 className="text-xl font-pd font-semibold text-slate-900 border-l-4 border-slate-900 pl-4 uppercase tracking-widest">Venue Videos</h2>
                     <Link href={`/venues/${id}/videos`} className="group flex items-center gap-2 text-[10px] font-pd font-normal text-pd-purple uppercase tracking-widest hover:text-pd-red transition-all">
                        Explore All Videos <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {venue.videos.slice(0, 2).map((vid: string, i: number) => {
                        let videoId = "";
                        try {
                          const url = new URL(vid);
                          if (url.hostname.includes('youtube.com')) {
                            videoId = url.searchParams.get('v') || "";
                          } else if (url.hostname.includes('youtu.be')) {
                            videoId = url.pathname.slice(1);
                          }
                        } catch(e) {}
                        
                        if (!videoId) return null;

                        return (
                          <div key={i} className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-900">
                            <iframe 
                              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                              className="absolute top-0 left-0 w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        )
                     })}
                  </div>
               </div>
             )}


             {/* Small Location Map Placeholder */}
            <div>
              <h2 className="text-xl font-pd font-semibold text-slate-900 mb-8 border-l-4 border-slate-900 pl-4">Location & Map</h2>
               <div className="w-full h-80 bg-slate-200 rounded-xl overflow-hidden relative shadow-xl">
                 <iframe 
                   src={`https://maps.google.com/maps?q=${encodeURIComponent(venue.name + ' ' + (venue.landmark || venue.location || venue.city))}&output=embed`}
                   className="w-full h-full border-0 rounded-xl shadow-sm hover:shadow-md transition-shadow"
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
               <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-100 shadow-pd-soft mb-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Left: Overall Rating */}
                    <div className="text-center md:border-r border-slate-100 md:pr-10 min-w-[180px]">
                       <p className="text-[10px] font-pd font-normal text-slate-400 uppercase tracking-[0.2em] mb-2">Overall Rating</p>
                       <h3 className="text-5xl font-pd font-semibold text-slate-900 mb-2 tracking-tighter">{ratingStats.avg}</h3>
                       <div className="flex justify-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} className={i < Math.round(Number(ratingStats.avg)) ? "text-yellow-400 fill-yellow-400" : "text-slate-100 fill-slate-100"} />
                          ))}
                       </div>
                       <p className="text-[10px] font-pd font-normal text-slate-400 uppercase tracking-wider">Based on {ratingStats.total} Reviews</p>
                    </div>
                    
                    {/* Middle: Rating Breakdown */}
                    <div className="flex-1 w-full space-y-2.5">
                       {ratingStats.breakdown.map((count, i) => (
                         <div key={i} className="flex items-center gap-4 group">
                           <span className="text-[10px] font-pd font-normal text-slate-900 w-10 whitespace-nowrap">{5 - i} Star</span>
                           <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / ratingStats.total) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-yellow-400 rounded-full"
                              ></motion.div>
                           </div>
                           <span className="text-[10px] font-pd font-normal text-slate-900 w-4">{count}</span>
                         </div>
                       ))}
                    </div>

                    {/* Right: Write Review Button */}
                    <div className="flex items-center justify-center md:pl-4">
                       <button 
                         type="button"
                         onClick={(e) => {
                            e.preventDefault();
                            if (!isLoggedIn) {
                               router.push('?login=true', { scroll: false });
                            } else {
                               const existingReview = reviews.find((r: any) => r.userEmail === currentUserEmail);
                               if (existingReview) {
                                  setNewReview({
                                    name: existingReview.userName,
                                    email: existingReview.userEmail,
                                    rating: existingReview.rating,
                                    comment: existingReview.comment
                                  });
                               }
                               setIsReviewModalOpen(true);
                            }
                         }}
                         className="px-8 py-4 bg-[#f43f5e] text-white text-[10px] font-pd font-normal uppercase tracking-[0.2em]  rounded-[20px] shadow-xl shadow-[#f43f5e]/30 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                       >
                         {reviews.some((r: any) => r.userEmail === currentUserEmail) ? 'Edit Review' : 'Write a Review'}
                       </button>
                    </div>
                  </div>
               </div>

               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-[22px] font-pd font-semibold text-slate-900 flex items-center gap-2">
                   <Star className="fill-slate-900 text-slate-900" size={20} />
                   {ratingStats.avg} · {ratingStats.total} reviews
                 </h2>
               </div>

                <div className="mb-8">
                   {sortedReviews.length > 0 && (
                     <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {sortedReviews.slice(0, 6).map((review, i) => (
                           <div key={i} className="flex flex-col shrink-0 w-[85vw] md:w-[400px] border border-slate-200 rounded-[24px] p-6 snap-start shadow-sm bg-white">
                              <div className="flex items-center gap-4 mb-3">
                                 <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white text-lg font-pd font-semibold uppercase shrink-0 shadow-sm">
                                    {(review.userName || 'A').charAt(0)}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-base font-pd font-semibold text-slate-900 leading-tight">{review.userName}</span>
                                    <span className="text-sm font-pd font-normal text-slate-500">{new Date(review.$createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                 </div>
                              </div>
                              
                              <div className="flex items-center gap-1 mb-3">
                                 {[...Array(5)].map((_, j) => (
                                   <Star key={j} size={10} className={j < review.rating ? "text-slate-900 fill-slate-900" : "text-slate-200"} />
                                 ))}
                              </div>
                              
                              <p className="text-base font-pd font-normal text-slate-700 leading-relaxed line-clamp-3">
                                &quot;{review.comment}&quot;
                              </p>

                              {review.comment && review.comment.length > 120 && (
                                <button 
                                  onClick={() => setIsAllReviewsModalOpen(true)}
                                  className="text-slate-900 font-pd font-semibold text-sm underline mt-2 self-start hover:text-slate-600 transition-colors"
                                >
                                  Show more
                                </button>
                              )}
                              
                              {review.vendorReply && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1.5 relative overflow-hidden">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[11px] font-pd font-semibold text-slate-900 uppercase tracking-widest">Host&apos;s reply</span>
                                  </div>
                                  <p className="text-[13px] font-pd font-medium text-slate-600 leading-relaxed italic relative z-10">
                                    &quot;{review.vendorReply}&quot;
                                  </p>
                                </div>
                              )}
                           </div>
                        ))}
                     </div>
                   )}
                </div>
                
                {sortedReviews.length > 0 && (
                   <div className="mt-4">
                      <button 
                        onClick={() => setIsAllReviewsModalOpen(true)}
                        className="px-6 py-3 bg-white border border-slate-900 hover:bg-slate-50 rounded-xl text-[15px] font-pd font-semibold text-slate-900 transition-colors inline-block"
                      >
                        Show all {sortedReviews.length} reviews
                      </button>
                   </div>
                )}
            </div>
          </div>

          {/* RIGHT SIDEBAR (Sticky Form) */}
          <aside className="w-full lg:w-[480px] shrink-0">
            <div className="sticky top-28 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">
               {/* Premium Top Line Glow effect for form */}
               <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-pd-pink via-purple-400 to-pd-blue"></div>
               
               <div className="text-center mb-6 pb-6 border-b border-slate-50">
                  <div className="text-pd-pink font-pd font-normal text-[10px] uppercase tracking-[0.3em] mb-4 flex justify-center items-center gap-2 bg-pd-pink/5 px-4 py-1.5 rounded-full mx-auto">
                    <CheckCircle2 size={16} /> Direct Lead Contact
                  </div>
                  <h3 className="text-3xl font-pd font-semibold text-slate-900 mb-3 tracking-tight leading-none">Get Free Customized Quotes</h3>
                  <p className="text-slate-400 text-[10px] md:text-xs font-pd font-normal uppercase tracking-widest">Zero Brokerage. Direct Rates.</p>
               </div>
               <form className="space-y-4" onSubmit={handleLeadSubmit}>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-pd font-normal text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                     <div className="relative group">
                       <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                         <User size={18} />
                       </div>
                       <input 
                           required
                           type="text" 
                           placeholder="Enter your name" 
                           value={formData.name}
                           readOnly={isLoggedIn && !!formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className={`w-full h-12 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-pd font-normal text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-pd-pink/10 focus:border-pd-pink transition-all placeholder:text-slate-300 ${isLoggedIn && formData.name ? 'opacity-60 cursor-not-allowed' : ''}`} 
                       />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-pd font-normal text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                     <div className="relative group">
                       <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                         <Mail size={18} />
                       </div>
                       <input 
                           required
                           type="email" 
                           placeholder="your@email.com" 
                           value={formData.email}
                           readOnly={isLoggedIn && !!formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className={`w-full h-12 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-pd font-normal text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-pd-pink/10 focus:border-pd-pink transition-all placeholder:text-slate-300 ${isLoggedIn && formData.email ? 'opacity-60 cursor-not-allowed' : ''}`} 
                       />
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                         <label className="text-[10px] font-pd font-normal text-slate-400 uppercase tracking-widest ml-2">Event Type</label>
                         <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                              <PartyPopper size={16} />
                            </div>
                            <select 
                                required
                                value={formData.eventType}
                                onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                                className="w-full h-12 pl-11 pr-10 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-pd font-normal text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-pd-pink/10 focus:border-pd-pink transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Select Event</option>
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
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                         </div>
                     </div>
                     <div className="space-y-1.5">
                         <label className="text-[10px] font-pd font-normal text-slate-400 uppercase tracking-widest ml-2">Guest Count</label>
                         <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                              <Users size={16} />
                            </div>
                            <select 
                                required
                                value={formData.guests}
                                onChange={(e) => setFormData({...formData, guests: e.target.value})}
                                className="w-full h-12 pl-11 pr-10 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-pd font-normal text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-pd-pink/10 focus:border-pd-pink transition-all appearance-none cursor-pointer" 
                            >
                                <option value="" disabled>Select Size</option>
                                <option value="0-50">0-50 guests</option>
                                <option value="50-100">50-100 guests</option>
                                <option value="100-200">100-200 guests</option>
                                <option value="200-500">200-500 guests</option>
                                <option value="500-1000">500-1000 guests</option>
                                <option value="1000-2000">1000-2000 guests</option>
                                <option value="2000-5000">2000-5000 guests</option>
                                <option value="5000+">5000+ guests</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                         </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                         <label className="text-[10px] font-pd font-normal text-slate-400 uppercase tracking-widest ml-2">Event Date</label>
                         <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors z-10 pointer-events-none">
                              <Calendar size={16} />
                            </div>
                            <input 
                                required
                                type="date" 
                                value={formData.eventDate}
                                onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                                min={new Date().toISOString().split('T')[0]} // Prevents selecting past dates
                                className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-pd font-normal text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-pd-pink/10 focus:border-pd-pink transition-all appearance-none cursor-pointer" 
                            />
                         </div>
                     </div>

                     <div className="space-y-1.5">
                         <label className="text-[10px] font-pd font-normal text-slate-400 uppercase tracking-widest ml-2">Phone</label>
                         <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                               <span className="text-sm font-pd font-normal text-slate-800 tracking-tighter shrink-0">+91</span>
                               <div className="w-px h-4 bg-slate-300 mx-2"></div>
                            </div>
                            <input 
                              required 
                              type="tel" 
                              name="phone"
                              value={formData.phone}
                              readOnly={isLoggedIn && !!formData.phone}
                              maxLength={11} // 10 digits + 1 space
                              onChange={(e) => {
                                if (isLoggedIn && formData.phone) return;
                                let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
                                if (val.length > 10) val = val.slice(0, 10);
                                // Format as 5-5
                                let formatted = val;
                                if (val.length > 5) {
                                   formatted = val.slice(0, 5) + ' ' + val.slice(5);
                                }
                                setFormData({...formData, phone: formatted});
                              }}
                              placeholder="10 Digits" 
                              className={`w-full h-12 pl-[4.5rem] pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-pd font-normal text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-pd-pink/10 focus:border-pd-pink transition-all placeholder:text-slate-300 tracking-[0.05em] ${isLoggedIn && formData.phone ? 'opacity-60 cursor-not-allowed' : ''}`} 
                            />
                         </div>
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-pd font-normal text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-1.5">
                       <MessageSquare size={12} /> Requirement Notes
                     </label>
                     <textarea 
                         placeholder="e.g. Need rooms, catering required..." 
                         rows={3} 
                         value={formData.requirements}
                         onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                         className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-sm font-pd font-normal text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-pd-pink/10 focus:border-pd-pink transition-all resize-none placeholder:text-slate-300"
                     ></textarea>
                  </div>

                 <button 
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full bg-[#f43f5e] hover:bg-[#e11d48] text-white py-4 text-sm tracking-[0.2em] font-pd font-normal uppercase  rounded-2xl shadow-[0_10px_30px_rgba(244,63,94,0.3)] hover:shadow-[0_15px_40px_rgba(244,63,94,0.4)] flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
                 >
                    {isSubmittingLead ? 'Sending...' : 'Get Best Rates'} <Send size={18} />
                 </button>

                 <p className="text-center text-[9px] font-pd font-normal text-slate-400 uppercase tracking-widest px-4 leading-relaxed">
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
            <h2 className="text-2xl font-pd font-semibold text-slate-900 mb-10 flex items-center justify-between">
               Explore Similar Venues 
               <Link href="/venues" className="text-pd-red text-[10px] font-pd font-normal uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
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
                    <div className="relative h-56 overflow-hidden bg-white flex items-center justify-center">
                       {v.img ? (
                         <img src={v.img} alt={v.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                       ) : (
                         <div className="flex flex-col items-center gap-2 opacity-20 group-hover:opacity-30 transition-opacity">
                            <img src="/logo.jpg" alt="PartyDial" className="w-20 grayscale" />
                            <span className="text-[8px] font-pd font-normal uppercase tracking-widest text-slate-900">No Photos Uploaded</span>
                         </div>
                       )}
                    </div>
                    <div className="p-6">
                       <h4 className="text-xl font-pd font-semibold text-slate-900 mb-1 line-clamp-1 ">{v.name}</h4>
                       <p className="text-xs font-pd font-normal text-slate-500 mb-4">{v.location}</p>
                       <div className="flex items-center justify-between">
                          <span className="text-pd-pink font-pd font-normal text-lg">₹{v.price} <span className="text-[10px] opacity-40 ">/plate</span></span>
                          <div className="flex items-center gap-1 font-pd font-normal text-xs text-slate-800">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" /> {v.rating}
                          </div>
                       </div>
                    </div>
                 </Link>
               ))}
            </div>
         </div>
      </section>

      {/* About Modal */}
      <AnimatePresence>
        {isAboutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 md:p-8 shrink-0">
                 <button onClick={() => setIsAboutModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors -ml-2">
                    <X size={20} className="text-slate-900" />
                 </button>
              </div>
              <div className="px-6 md:px-8 pb-10 overflow-y-auto">
                 <h2 className="text-[28px] font-pd font-semibold text-slate-900 mb-8">About this space</h2>
                 <p className="text-slate-800 font-pd font-normal leading-relaxed text-base whitespace-pre-line">
                   {venue.about}
                 </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />

      {/* Amenities Modal */}
      <AnimatePresence>
        {isAmenitiesModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAmenitiesModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 md:p-8 shrink-0">
                 <button onClick={() => setIsAmenitiesModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors -ml-2">
                    <X size={20} className="text-slate-900" />
                 </button>
              </div>
              <div className="px-6 md:px-8 pb-10 overflow-y-auto">
                 <h2 className="text-[28px] font-pd font-semibold text-slate-900 mb-8">What this place offers</h2>
                 <div className="flex flex-col gap-6">
                   {venue.amenities.map((amenity: any, i: number) => (
                     <div key={i} className="flex items-center gap-4 text-slate-800 border-b border-slate-100 pb-6 last:border-0">
                        <div className="text-slate-700 shrink-0 [&>svg]:w-[26px] [&>svg]:h-[26px] [&>svg]:stroke-[1.5]">
                          {amenity.icon}
                        </div>
                        <span className="text-base font-pd font-normal">{amenity.name}</span>
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* All Reviews Modal */}
      <AnimatePresence>
        {isAllReviewsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAllReviewsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 md:p-8 shrink-0">
                 <h2 className="text-2xl font-pd font-semibold text-slate-900">All reviews</h2>
                 <button onClick={() => setIsAllReviewsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors -mr-2">
                    <X size={20} className="text-slate-900" />
                 </button>
              </div>
              <div className="px-6 md:px-8 pb-10 overflow-y-auto">
                 <div className="flex flex-col gap-10">
                   {sortedReviews.map((review, i) => (
                     <div key={i} className="flex flex-col bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center gap-4 mb-5">
                           <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white text-lg font-pd font-semibold uppercase shrink-0 shadow-sm">
                              {(review.userName || 'A').charAt(0)}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-base font-pd font-semibold text-slate-900 leading-tight">{review.userName}</span>
                              <span className="text-sm font-pd font-normal text-slate-500">{new Date(review.$createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-1 mb-4">
                           {[...Array(5)].map((_, j) => (
                             <Star key={j} size={14} className={j < review.rating ? "text-slate-900 fill-slate-900" : "text-slate-200"} />
                           ))}
                        </div>
                        
                        <p className="text-[15px] font-pd font-normal text-slate-700 leading-relaxed">
                          &quot;{review.comment}&quot;
                        </p>

                        {review.vendorReply && (
                          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1.5 relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[11px] font-pd font-semibold text-slate-900 uppercase tracking-widest">Host&apos;s reply</span>
                            </div>
                            <p className="text-[13px] font-pd font-medium text-slate-600 leading-relaxed italic relative z-10">
                              &quot;{review.vendorReply}&quot;
                            </p>
                          </div>
                        )}
                     </div>
                   ))}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. REVIEW MODAL */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-[8px]"
              style={{ willChange: 'opacity, backdrop-filter', transform: 'translateZ(0)' }}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "tween", duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              style={{ willChange: "transform, opacity", transform: 'translateZ(0)' }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-10">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl md:text-3xl font-pd font-bold text-slate-900 tracking-tight">Rate Your <span className="pd-gradient-text">Experience</span></h3>
                    <button onClick={() => setIsReviewModalOpen(false)} className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-full transition-all shadow-sm"><X size={20} /></button>
                 </div>

                 <form onSubmit={handleReviewSubmit} className="space-y-6">
                    {/* Rating Section - Light & Airy */}
                    <div className="text-center bg-gradient-to-b from-pd-pink/5 to-transparent p-6 rounded-3xl border border-pd-pink/10 relative overflow-hidden">
                       <p className="text-xs font-pd font-semibold uppercase text-slate-500 tracking-[0.2em] mb-4">How was the venue?</p>
                       <div className="flex justify-center gap-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className="transition-transform active:scale-90 hover:scale-110"
                            >
                              <Star 
                                size={40} 
                                className={`transition-all duration-300 ${(hoverRating || newReview.rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-100"}`}
                              />
                            </button>
                          ))}
                       </div>
                       <p className="text-[10px] font-pd font-medium uppercase text-slate-400 tracking-widest mt-4">Select a star rating</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div className="space-y-2">
                          <label className="text-[11px] font-pd font-semibold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                          <input 
                             required
                             type="text" 
                             placeholder="Enter your name" 
                              value={newReview.name}
                              readOnly={isLoggedIn && !!newReview.name}
                              onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                              className={`w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-pd outline-none focus:bg-white focus:ring-4 focus:ring-pd-pink/10 focus:border-pd-pink transition-all placeholder:text-slate-300 ${isLoggedIn && newReview.name ? 'opacity-60 cursor-not-allowed' : ''}`}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[11px] font-pd font-semibold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                          <input 
                             type="email" 
                             placeholder="your@email.com (Optional)" 
                             value={newReview.email}
                             readOnly={isLoggedIn && !!newReview.email}
                             onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                             className={`w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-pd outline-none focus:bg-white focus:ring-4 focus:ring-pd-pink/10 focus:border-pd-pink transition-all placeholder:text-slate-300 ${isLoggedIn && newReview.email ? 'opacity-60 cursor-not-allowed' : ''}`}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[11px] font-pd font-semibold text-slate-500 uppercase tracking-widest ml-1">Detailed Feedback</label>
                       <textarea 
                          required
                          placeholder="Tell us about the food, staff, and overall ambiance..." 
                          rows={4} 
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-pd outline-none focus:bg-white focus:ring-4 focus:ring-pd-pink/10 focus:border-pd-pink transition-all resize-none placeholder:text-slate-300"
                       ></textarea>
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button 
                         type="button"
                         onClick={() => setIsReviewModalOpen(false)}
                         className="flex-1 py-4 text-xs font-pd font-semibold uppercase tracking-widest text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl transition-all"
                       >
                         Cancel
                       </button>
                       <button 
                          type="submit"
                          disabled={isSubmittingReview}
                          className="flex-1 pd-btn-primary py-4 rounded-2xl uppercase text-xs font-pd font-semibold tracking-widest shadow-xl shadow-pd-pink/20 flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
                       >
                          {isSubmittingReview ? 'Syncing...' : 'Post Review'} <Send size={16} />
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
          style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
          className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] px-8 py-5 rounded-[28px] shadow-2xl flex items-center gap-4 border border-white/5 backdrop-blur-xl ${
            toast.type === 'success' ? 'bg-slate-900/90 text-white' : 'bg-red-950/90 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={24} /> : <XCircle className="text-pd-red" size={24} />}
          <div className="flex flex-col">
             <span className="text-[10px] font-pd font-normal uppercase tracking-[0.2em] text-white/30 leading-none mb-1">Notification</span>
             <p className="text-sm font-pd font-normal uppercase tracking-tight ">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="ml-4 p-2 hover:bg-white/10 rounded-full transition-all">
             <X size={16} className="text-white/40" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>

      {/* SPACE IMAGES GALLERY MODAL */}
      <AnimatePresence>
        {isSpaceGalleryOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-900/95 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-black w-full max-w-5xl h-[80vh] sm:h-[90vh] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-black/50 absolute top-0 inset-x-0 z-20 backdrop-blur-md border-b border-white/10">
                <h3 className="text-white font-pd font-semibold text-lg md:text-xl">
                  {venue.halls.filter((h: any) => h.image)[activeSpaceImageIndex]?.name} Space
                </h3>
                <button 
                  onClick={() => setIsSpaceGalleryOpen(false)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Main Image View */}
              <div className="flex-1 relative flex items-center justify-center p-4 pt-20 pb-24 bg-black">
                 {venue.halls.filter((h: any) => h.image).length > 0 ? (
                    <img 
                      src={venue.halls.filter((h: any) => h.image)[activeSpaceImageIndex].image} 
                      alt="Space" 
                      className="max-w-full max-h-full object-contain rounded-xl"
                    />
                 ) : null}
                 
                 {/* Arrows */}
                 {venue.halls.filter((h: any) => h.image).length > 1 && (
                   <>
                     <button 
                       onClick={() => setActiveSpaceImageIndex((prev) => prev === 0 ? venue.halls.filter((h: any) => h.image).length - 1 : prev - 1)}
                       className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-lg border border-white/10"
                     >
                       <ChevronLeft size={24} />
                     </button>
                     <button 
                       onClick={() => setActiveSpaceImageIndex((prev) => prev === venue.halls.filter((h: any) => h.image).length - 1 ? 0 : prev + 1)}
                       className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-lg border border-white/10"
                     >
                       <ChevronRight size={24} />
                     </button>
                   </>
                 )}
              </div>

              {/* Thumbnails Row */}
              <div className="absolute bottom-0 inset-x-0 bg-black/50 backdrop-blur-md border-t border-white/10 p-4 overflow-x-auto whitespace-nowrap hidden-scrollbar">
                 <div className="flex gap-3 justify-center min-w-max mx-auto">
                    {venue.halls.filter((h: any) => h.image).map((hall: any, idx: number) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveSpaceImageIndex(idx)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeSpaceImageIndex === idx ? 'border-pd-pink scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                      >
                         <img src={hall.image} alt={hall.name} className="w-full h-full object-cover" />
                         <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1">
                            <p className="text-white text-[8px] font-pd font-semibold text-center truncate">{hall.name}</p>
                         </div>
                      </button>
                    ))}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
