'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Mic, MapPin, Users, IndianRupee, ArrowRight, Sparkles, X, PartyPopper, ArrowUp, PhoneCall, Building2 } from 'lucide-react';
import VenueCard from '@/shared/components/VenueCard';
import { getAppwriteImageUrl, parsePhotos } from '@/shared/utils/image';

function levenshtein(a: string, b: string) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function fuzzyExtract(query: string, wordsList: string[], maxDistance = 2) {
  const queryWords = query.replace(/[^ws]/g, '').split(/\s+/);
  for (const target of wordsList) {
    if (query.includes(target)) return target;
    const targetWords = target.split(/\s+/);
    if (targetWords.length === 1) {
      for (const qWord of queryWords) {
        if (qWord.length >= 4 && Math.abs(qWord.length - target.length) <= maxDistance) {
           if (levenshtein(qWord, target) <= maxDistance) return target;
        }
      }
    } else {
      // For multi-word targets like "pre-wedding", just checking direct includes is usually enough
      // or we can just ignore fuzzy for them
    }
  }
  return "";
}

const parseAIQuery = (query: string) => {
  const q = query.toLowerCase();
  
  const pincodeMatch = q.match(/\b\d{6}\b/);
  const pincode = pincodeMatch ? pincodeMatch[0] : null;

  let maxBudget = null;
  const lakhMatch = q.match(/(under|below|for)?\s*₹?\s*(\d+(\.\d+)?)\s*lakh/);
  if (lakhMatch) maxBudget = parseFloat(lakhMatch[2]) * 100000;
  else {
    const kMatch = q.match(/(under|below|for)?\s*₹?\s*(\d+)\s*k/);
    if (kMatch) maxBudget = parseInt(kMatch[2]) * 1000;
    else {
      const rsMatch = q.match(/(under|below|for)?\s*(?:₹|rs\.?)\s*(\d+(?:,\d+)*)/);
      if (rsMatch) maxBudget = parseInt(rsMatch[2].replace(/,/g, ''));
      else {
        const pureNumMatch = q.match(/(under|below)\s*(\d+(?:,\d+)*)/);
        if (pureNumMatch) maxBudget = parseInt(pureNumMatch[2].replace(/,/g, ''));
      }
    }
  }

  let capacity = 0;
  const capMatch = q.match(/(\d+)\s*(guests|people|pax|persons)/);
  if (capMatch) capacity = parseInt(capMatch[1]);
  else {
    const forMatch = q.match(/for\s*(\d+)/);
    if (forMatch && parseInt(forMatch[1]) > 10) capacity = parseInt(forMatch[1]);
  }

  const eventTypes = ["birthday", "wedding", "pre-wedding", "anniversary", "corporate", "kitty party", "bachelor", "baby shower", "engagement"];
  let eventType = fuzzyExtract(q, eventTypes, 2);

  const venueTypes = ["banquet", "hotel", "resort", "lawn", "farmhouse", "rooftop", "hall", "party"];
  let venueType = fuzzyExtract(q, venueTypes, 2);

  const cities = ["haldwani", "delhi", "noida", "gurgaon", "mumbai", "bangalore", "kathgodam", "lalkuan"];
  let city = fuzzyExtract(q, cities, 2);

  const generalKeywords = ["venue", "book", "search", "find", "party", "event", "marriage", "function", "celebrate", "celebration"];
  const hasGeneralKeyword = generalKeywords.some(kw => q.includes(kw));

  const isUnrelated = !pincode && !maxBudget && !capacity && !eventType && !venueType && !city && !hasGeneralKeyword;

  return { pincode, maxBudget, capacity, eventType, venueType, city, isUnrelated };
};

export default function AISearchPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [liveVenues, setLiveVenues] = useState<any[]>([]);
  const [extractedFilters, setExtractedFilters] = useState<any>(null);
  
  const [isListening, setIsListening] = useState(false);
  const [hasRecognition, setHasRecognition] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      setTimeout(() => setHasRecognition(true), 0);

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setQuery('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
        const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
        const response = await fetch(`${baseUrl}/venues?verified=true`);
        const result = await response.json();
        
        if (result.status === 'success') {
          const mapped = result.data.map((doc: any) => {
            const photos = parsePhotos(doc.photos);
            const hasPaidPlan = doc.subscriptionPlan && doc.subscriptionPlan !== 'free' && doc.subscriptionPlan !== 'None' && doc.subscriptionPlan !== '';
            return {
              id: doc.$id,
              name: doc.venueName || "Unnamed Venue",
              location: doc.landmark || doc.city || "India",
              city: doc.city || "Delhi",
              type: doc.venueType || "Banquet Hall",
              capacity: parseInt(doc.capacity) || 500,
              price: doc.perPlateVeg ? parseFloat(doc.perPlateVeg) : null,
              pincode: doc.pincode?.toString() || "",
              rating: parseFloat(doc.rating) || 0,
              reviews: doc.totalReviews || 0,
              img: photos.length > 0 ? getAppwriteImageUrl(photos[0]) : "",
              verified: doc.isVerified || false,
              popular: doc.status === 'active',
              isPaid: !!hasPaidPlan,
              amenities: (doc.amenities ? (typeof doc.amenities === 'string' ? JSON.parse(doc.amenities) : doc.amenities) : []),
              categories: (doc.eventTypes ? (typeof doc.eventTypes === 'string' ? JSON.parse(doc.eventTypes) : doc.eventTypes) : []),
              subscriptionPlan: doc.subscriptionPlan || 'free',
            };
          });
          setLiveVenues(mapped);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchVenues();
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      const filters = parseAIQuery(query);
      setExtractedFilters(filters);
      setHasSearched(true);
      setIsSearching(false);
    }, 1200);
  };

  const filteredVenues = useMemo(() => {
    if (!hasSearched || !extractedFilters || extractedFilters.isUnrelated) return [];

    return liveVenues.filter(venue => {
      if (!venue.verified) return false;
      if (venue.subscriptionPlan === 'free') return false;

      if (extractedFilters.pincode && venue.pincode !== extractedFilters.pincode) {
        if (!venue.pincode.includes(extractedFilters.pincode)) return false;
      }
      if (extractedFilters.city && !venue.city.toLowerCase().includes(extractedFilters.city)) {
         if (!extractedFilters.pincode) return false;
      }

      if (extractedFilters.maxBudget && venue.price !== null) {
        let maxPerPlate = extractedFilters.maxBudget;
        if (extractedFilters.capacity > 0) {
           maxPerPlate = extractedFilters.maxBudget / extractedFilters.capacity;
        } else {
           maxPerPlate = extractedFilters.maxBudget / 100;
        }
        if (venue.price > maxPerPlate * 1.2) return false;
      }

      if (extractedFilters.capacity > 0 && venue.capacity < extractedFilters.capacity) {
        return false;
      }

      if (extractedFilters.eventType) {
        const hasMatch = venue.categories?.some((c: string) => 
          c.toLowerCase().includes(extractedFilters.eventType)
        );
        if (venue.categories && venue.categories.length > 0 && !hasMatch) return false;
      }

      if (extractedFilters.venueType) {
        if (!venue.type.toLowerCase().includes(extractedFilters.venueType)) return false;
      }

      return true;
    }).sort((a, b) => {
      const scoreA = a.rating + (a.isPaid ? 2 : 0);
      const scoreB = b.rating + (b.isPaid ? 2 : 0);
      return scoreB - scoreA;
    });
  }, [liveVenues, hasSearched, extractedFilters]);

  const getSummaryText = () => {
    if (!extractedFilters) return "";
    const parts = [];
    if (extractedFilters.venueType) parts.push(`**${extractedFilters.venueType}s**`);
    else parts.push("venues");
    
    if (extractedFilters.eventType) parts.push(`for a **${extractedFilters.eventType}**`);
    if (extractedFilters.capacity) parts.push(`hosting **${extractedFilters.capacity}+ guests**`);
    if (extractedFilters.city) parts.push(`in **${extractedFilters.city.charAt(0).toUpperCase() + extractedFilters.city.slice(1)}**`);
    else if (extractedFilters.pincode) parts.push(`near **${extractedFilters.pincode}**`);
    
    if (extractedFilters.maxBudget) parts.push(`under **₹${extractedFilters.maxBudget.toLocaleString('en-IN')}**`);
    
    return `We found ${filteredVenues.length} ${parts.join(" ")}.`;
  };

  return (
    <div className={`bg-white flex flex-col selection:bg-pd-purple/10 relative ${!hasSearched ? 'h-[calc(100vh-90px)] overflow-hidden' : 'min-h-screen overflow-x-hidden'}`}>

      {/* HERO / SEARCH SECTION */}
      <motion.div 
        layout
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          minHeight: hasSearched ? 'auto' : '100%',
          paddingTop: hasSearched ? '4rem' : '2rem'
        }}
        className="w-full px-4 md:px-12 lg:px-24 relative z-10 flex flex-col justify-center h-full"
      >
        <div className={`w-full max-w-350 mx-auto ${hasSearched ? 'mb-12' : ''}`}>
          <AnimatePresence mode="wait">
            {!hasSearched ? (
               <motion.div 
                key="hero-text"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-4xl mx-auto flex flex-col items-center text-center z-20"
               >
                 <div className="inline-flex items-center gap-2 px-5 py-2 bg-white shadow-sm border border-slate-100 rounded-full text-pd-purple mb-8">
                   <Sparkles size={16} className="text-pd-purple" />
                   <span className="text-[11px] font-bold text-pd-purple">Find the perfect venue, effortlessly</span>
                 </div>
                 
                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight mb-4">
                   <span className="text-slate-900">How can<br /></span>
                   <span className="text-pd-pink">I help you </span>
                   <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-cyan-400">today?</span>
                 </h1>
                 
                 <p className="text-slate-500 font-medium text-lg md:text-xl max-w-xl leading-relaxed mb-12">
                   Search manually or call our team to get instant help.
                 </p>

                 {/* ACTION CARDS */}
                 <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl mx-auto mb-12">
                   {/* Manual Search Card */}
                   <div 
                     className="flex-1 bg-pd-pink/5 border border-pd-pink/10 rounded-4xl p-6 flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer group"
                     onClick={() => {
                        const input = document.getElementById('ai-search-input');
                        if (input) input.focus();
                     }}
                   >
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                       <Search className="text-pd-pink" size={28} />
                     </div>
                     <div className="text-left flex-1">
                       <h3 className="font-bold text-slate-900 text-lg">Manual Search</h3>
                       <p className="text-sm text-slate-500">Search venues your way</p>
                     </div>
                     <div className="w-10 h-10 border border-pd-pink/20 rounded-full flex items-center justify-center group-hover:bg-pd-pink transition-colors">
                       <ArrowRight size={18} className="text-pd-pink group-hover:text-white transition-colors" />
                     </div>
                   </div>

                   {/* Call Our Team Card */}
                   <Link href="/contact" className="flex-1 bg-blue-50 border border-blue-100 rounded-4xl p-6 flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer group">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                       <PhoneCall className="text-blue-500" size={28} />
                     </div>
                     <div className="text-left flex-1">
                       <h3 className="font-bold text-slate-900 text-lg">Call Our Team</h3>
                       <p className="text-sm text-slate-500">Speak with our experts</p>
                     </div>
                     <div className="w-10 h-10 border border-blue-200 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                       <ArrowRight size={18} className="text-blue-500 group-hover:text-white transition-colors" />
                     </div>
                   </Link>
                 </div>

                 {/* SEARCH BAR */}
                 <div className="w-full max-w-3xl mx-auto relative group mb-8">
                   <form onSubmit={handleSearch} className="relative flex items-center shadow-lg rounded-[40px]">
                     <div className="absolute left-6 text-slate-400">
                        {isSearching ? (
                           <div className="w-6 h-6 border-2 border-pd-purple border-t-transparent rounded-full animate-spin" />
                        ) : (
                           <Search size={22} className={query ? "text-pd-purple" : ""} />
                        )}
                     </div>
                     
                     <input
                       id="ai-search-input"
                       type="text"
                       value={query}
                       onChange={(e) => setQuery(e.target.value)}
                       placeholder="E.g. Birthday party space for 50 people, Corporate event in Noida"
                       className="w-full pl-14 pr-36 py-6 bg-white border border-slate-100 rounded-[40px] text-base font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-pd-purple focus:ring-4 focus:ring-pd-purple/5 transition-all"
                     />

                     <div className="absolute right-3 flex items-center gap-2">
                       <button
                         type="submit"
                         disabled={!query.trim() || isSearching}
                         className="bg-linear-to-r from-pd-pink to-pd-purple text-white rounded-full py-3 px-8 font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
                       >
                         Search
                       </button>
                     </div>
                   </form>
                 </div>

                 {/* Popular Searches */}
                 <div className="w-full max-w-3xl mx-auto text-left relative z-30 mt-4">
                   <h4 className="text-sm font-bold text-slate-800 mb-4 pl-1">Popular Searches</h4>
                   <div className="flex flex-nowrap justify-start overflow-x-auto gap-4 pb-6 w-full snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                     <button onClick={() => setQuery("Birthday party space for 50 people")} className="snap-start ml-1 px-5 py-3 bg-white border border-slate-100 shadow-sm rounded-full flex items-center gap-3 hover:border-pd-purple/30 transition-all shrink-0 whitespace-nowrap">
                       <PartyPopper size={16} className="text-pd-purple" />
                       <span className="text-sm font-medium text-slate-700">Birthday party space for 50 people</span>
                     </button>
                     <button onClick={() => setQuery("Corporate event in Noida")} className="snap-start px-5 py-3 bg-white border border-slate-100 shadow-sm rounded-full flex items-center gap-3 hover:border-pd-purple/30 transition-all shrink-0 whitespace-nowrap">
                       <MapPin size={16} className="text-pd-pink" />
                       <span className="text-sm font-medium text-slate-700">Corporate event in Noida</span>
                     </button>
                     <button onClick={() => setQuery("Luxury banquet under ₹2 Lakhs")} className="snap-start mr-1 px-5 py-3 bg-white border border-slate-100 shadow-sm rounded-full flex items-center gap-3 hover:border-pd-purple/30 transition-all shrink-0 whitespace-nowrap">
                       <Building2 size={16} className="text-blue-500" />
                       <span className="text-sm font-medium text-slate-700">Luxury banquet under ₹2 Lakhs</span>
                     </button>
                   </div>
                 </div>

               </motion.div>
            ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full"
                >
                  {/* SEARCH BAR (WHEN RESULTS SHOW) */}
                  <div className="w-full max-w-4xl mx-auto mb-16 mt-8">
                      <form onSubmit={handleSearch} className="relative flex items-center">
                        <div className="absolute left-6 text-slate-400 group-focus-within:text-pd-purple transition-colors">
                          {isSearching ? (
                             <div className="w-6 h-6 border-2 border-pd-purple border-t-transparent rounded-full animate-spin" />
                          ) : (
                             <Zap size={24} className={query ? "text-pd-purple fill-pd-purple/10" : ""} />
                          )}
                        </div>
                        
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="E.g. Banquet in Delhi for 300 guests..."
                          className="w-full pl-[4.5rem] pr-36 py-6 bg-white border border-slate-200 rounded-[2rem] text-lg font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:border-pd-purple focus:ring-8 focus:ring-pd-purple/5 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                        />

                        <div className="absolute right-3 flex items-center gap-2">
                          {hasRecognition && (
                            <button 
                              type="button"
                              onClick={toggleListening}
                              className={`p-3 rounded-full transition-all ${isListening ? 'bg-pd-red text-white animate-pulse shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-pd-purple'}`}
                            >
                              <Mic size={20} />
                            </button>
                          )}
                          <button
                            type="submit"
                            disabled={!query.trim() || isSearching}
                            className="bg-slate-900 text-white rounded-xl py-3 px-6 text-sm font-black flex items-center gap-2 hover:bg-pd-purple active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          >
                            <ArrowRight size={18} />
                          </button>
                        </div>
                      </form>
                  </div>

              {/* AI Summary Card */}
              {!extractedFilters?.isUnrelated && (
              <div className="mb-12 p-8 bg-white border border-slate-100 rounded-[40px] shadow-pd-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-pd-purple/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                 
                 <div className="flex items-start gap-6 relative z-10">
                    <div className="p-4 bg-pd-purple/10 text-pd-purple rounded-[24px] shrink-0 shadow-inner">
                       <Zap size={32} className="fill-pd-purple/20" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black text-pd-purple uppercase tracking-[0.3em] mb-2">AI MATCHING SUMMARY</h3>
                      <p className="text-xl md:text-2xl font-bold text-slate-800 leading-tight" dangerouslySetInnerHTML={{ 
                        __html: getSummaryText().replace(/\*\*(.*?)\*\*/g, '<span class="pd-gradient-text">$1</span>') 
                      }} />
                    </div>
                 </div>

                 {/* Quick Action Chips */}
                 <div className="flex flex-wrap gap-2.5 relative z-10">
                    {extractedFilters?.city && (
                      <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-widest">
                        <MapPin size={14} className="text-pd-red" /> {extractedFilters.city}
                      </div>
                    )}
                    {extractedFilters?.capacity > 0 && (
                      <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-widest">
                        <Users size={14} className="text-pd-purple" /> {extractedFilters.capacity}+ PAX
                      </div>
                    )}
                    {extractedFilters?.maxBudget && (
                      <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-widest">
                        <IndianRupee size={14} className="text-pd-pink" /> ₹{extractedFilters.maxBudget >= 100000 ? `${extractedFilters.maxBudget/100000}L` : `${extractedFilters.maxBudget/1000}K`}
                      </div>
                    )}
                    <button 
                      onClick={() => { setHasSearched(false); setExtractedFilters(null); }}
                      className="p-2 bg-slate-900 text-white rounded-2xl hover:bg-pd-red transition-colors"
                      title="Clear Search"
                    >
                      <X size={18} />
                    </button>
                 </div>
              </div>
              )}

              {filteredVenues.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                   {filteredVenues.map((venue, idx) => (
                     <motion.div
                       key={venue.id}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ delay: idx * 0.05, duration: 0.4 }}
                     >
                       <VenueCard venue={venue} index={idx} />
                     </motion.div>
                   ))}
                 </div>
              ) : (
                 <div className="text-center py-24 bg-white rounded-[48px] border border-slate-100 shadow-pd-soft">
                   {extractedFilters?.isUnrelated ? (
                     <>
                       <div className="inline-flex justify-center items-center w-24 h-24 bg-red-50 rounded-full text-pd-red mb-8">
                         <X size={40} />
                       </div>
                       <h2 className="text-3xl font-black text-slate-900 mb-3 italic">I can only help with venues</h2>
                       <p className="text-slate-500 font-medium mb-10 max-w-lg mx-auto px-6">
                         I am an AI assistant specifically designed to help you discover and book premium venues. Please ask me to find a banquet, resort, or party hall!
                       </p>
                     </>
                   ) : (
                     <>
                       <div className="inline-flex justify-center items-center w-24 h-24 bg-slate-50 rounded-full text-slate-200 mb-8">
                         <Search size={40} />
                       </div>
                       <h2 className="text-3xl font-black text-slate-900 mb-3 italic">No matching venues found</h2>
                       <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto px-6">
                         Try broadening your search criteria or removing specific constraints like budget or capacity.
                       </p>
                     </>
                   )}
                   <button 
                     onClick={() => {
                       setQuery("");
                       setHasSearched(false);
                     }}
                     className="pd-btn-primary !rounded-2xl"
                   >
                     Reset AI Search
                   </button>
                 </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
