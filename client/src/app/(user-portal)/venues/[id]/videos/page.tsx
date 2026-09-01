'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Video
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function VenueVideosPage() {
  const params = useParams();
  const id = params.id as string;
  const [venue, setVenue] = useState<{name: string, videos: string[]} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch venue data for videos
  useEffect(() => {
    const fetchVenue = async () => {
      setIsLoading(true);
      try {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
        const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
        const response = await fetch(`${baseUrl}/venues/${id}`);
        const result = await response.json();

        if (result.status === 'success') {
          const doc = result.data;

          if (!doc.isVerified) {
             setVenue(null);
             setIsLoading(false);
             return;
          }

          let videos = [];
          try {
             if (doc.packages) {
                const parsed = JSON.parse(doc.packages);
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                   videos = parsed.videos || [];
                }
             }
          } catch (e) {
             console.error('Error parsing packages:', e);
          }
          
          const mappedVenue = {
            name: doc.venueName || "Unnamed Venue",
            videos: videos
          };
          setVenue(mappedVenue);
        }
      } catch (err) {
        console.error('Failed to fetch videos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchVenue();
  }, [id]);

  if (isLoading) {
    return (
       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
           <div className="flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-pd-red border-t-transparent rounded-full animate-spin"></div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Videos...</p>
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
    <div className="min-h-screen bg-slate-50 pt-[104px] md:pt-[120px]">
      
      {/* 1. COMPACT HEADER */}
      <nav className="bg-white border-b border-slate-100 sticky top-[104px] md:top-[120px] z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
             <Link href={`/venues/${params.id}`} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-pd-red">
                <ChevronLeft size={24} />
             </Link>
             <div>
               <h1 className="text-xl font-black text-slate-900 leading-none mb-1">{venue.name}</h1>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                 <Video size={12} /> Venue Videos
               </p>
             </div>
          </div>
        </div>
      </nav>

      {/* 2. VIDEOS GRID */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {venue.videos.map((vid: string, i: number) => {
              let videoId = "";
              try {
                const url = new URL(vid);
                if (url.hostname.includes('youtube.com')) {
                  videoId = url.searchParams.get('v') || "";
                } else if (url.hostname.includes('youtu.be')) {
                  videoId = url.pathname.slice(1);
                }
              } catch(e) {
                 console.error('Error parsing video URL:', e);
              }
              
              if (!videoId) return null;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: i * 0.05 
                  }}
                  className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-900"
                >
                  <iframe 
                    src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {(!venue.videos || venue.videos.length === 0) && (
           <div className="text-center py-32 opacity-20">
              <Video size={100} className="mx-auto mb-4" />
              <p className="font-black uppercase tracking-widest">No videos available yet</p>
           </div>
        )}
      </main>

    </div>
  );
}
