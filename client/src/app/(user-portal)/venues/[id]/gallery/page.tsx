'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Maximize2, 
  X, 
  Filter,
  Camera,
  Image as ImageIcon,
  Heart
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

export default function VenueGalleryPage() {
  const params = useParams();
  const id = params.id as string;
  const [venue, setVenue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Photos");
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const categories = ["All Photos", "Interior", "Decoration", "Food & Dining", "Exterior", "Event Setups"];

  // Fetch venue data for gallery
  useEffect(() => {
    const fetchVenue = async () => {
      setIsLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://127.0.0.1:5005/api';
        const response = await fetch(`${baseUrl}/venues/${id}`);
        const result = await response.json();

        if (result.status === 'success') {
          const doc = result.data;
          const { getAppwriteImageUrl, parsePhotos } = await import('@/shared/utils/image');
          const photoIds = parsePhotos(doc.photos);
          
          const mappedVenue = {
            name: doc.venueName || "Unnamed Venue",
            images: photoIds.length > 0 
              ? photoIds.map((p: any, idx: number) => ({
                  id: p.id,
                  category: p.category,
                  url: getAppwriteImageUrl(p.id),
                  title: `Photo ${idx + 1}`
                }))
              : [
                  { id: '1', category: 'Interior', url: '/gallery/interior.png', title: 'Interior' },
                  { id: '2', category: 'Exterior', url: '/gallery/exterior.png', title: 'Exterior' }
                ]
          };
          setVenue(mappedVenue);
        }
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchVenue();
  }, [id]);

  const filteredImages = useMemo(() => {
    if (!venue) return [];
    if (activeCategory === "All Photos") return venue.images;
    return venue.images.filter((img: any) => img.category === activeCategory);
  }, [venue, activeCategory]);

  if (isLoading) {
    return (
       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
           <div className="flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-pd-red border-t-transparent rounded-full animate-spin"></div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Gallery...</p>
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
      
      {/* 1. COMPACT HEADER */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
             <Link href={`/venues/${params.id}`} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-pd-red">
                <ChevronLeft size={24} />
             </Link>
             <div>
               <h1 className="text-xl font-black text-slate-900 leading-none mb-1">{venue.name}</h1>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                 <Camera size={12} /> Venue Photo Gallery
               </p>
             </div>
          </div>
          <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
            {categories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white text-pd-red shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Mobile Filter Toggle placeholder */}
          <div className="md:hidden">
             <button className="p-3 bg-pd-red text-white rounded-xl">
                <Filter size={18} />
             </button>
          </div>
        </div>
      </nav>

      {/* 2. PREMIUM GALLERY GRID */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Mobile Filter Pills */}
        <div className="md:hidden flex gap-2 overflow-x-auto no-scrollbar pb-6 mb-2">
           {categories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-pd-red border-pd-red text-white' : 'bg-white border-slate-100 text-slate-400'}`}
              >
                {cat}
              </button>
            ))}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 auto-rows-[160px] md:auto-rows-[200px] grid-flow-dense"
        >
          <AnimatePresence>
            {filteredImages.map((img: any, i: number) => {
              // Bento Grid Span Logic
              const spanClass = 
                i % 12 === 0 ? "md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-3" : // Large Hero
                i % 12 === 1 ? "md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1" : // Horizontal Wide
                i % 12 === 2 ? "md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2" : // Square Big
                i % 12 === 3 ? "md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2" : // Vertical Tall
                i % 12 === 5 ? "md:col-span-2 md:row-span-1 lg:col-span-3 lg:row-span-1" : // Extra Wide
                "md:col-span-1 md:row-span-1"; // Standard Small

              return (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => setSelectedImage(img)}
                  className={`group relative bg-white rounded-2xl md:rounded-[32px] overflow-hidden shadow-pd-soft border border-slate-100 cursor-pointer hover:shadow-pd-strong transition-all duration-500 ${spanClass}`}
                >
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-pd-purple/5 transition-colors"></div>
                  
                  {/* Subtle Maximize Icon */}
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                    <Maximize2 size={16} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredImages.length === 0 && (
           <div className="text-center py-32 opacity-20">
              <ImageIcon size={100} className="mx-auto mb-4" />
              <p className="font-black uppercase tracking-widest">No photos in this category yet</p>
           </div>
        )}
      </main>

      {/* 3. PURE VISUAL LIGHTBOX */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-slate-950/98 backdrop-blur-sm"
            ></motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-7xl h-full flex items-center justify-center"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative w-full h-[85vh] md:h-full">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.title} 
                  className="absolute inset-0 w-full h-full object-contain" 
                  loading="eager"
                />
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 md:w-16 md:h-16 bg-white/5 hover:bg-pd-red rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all active:scale-95 z-[110]"
              >
                <X size={28} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
