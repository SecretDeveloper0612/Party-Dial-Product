/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Users, ArrowRight, Building2, PartyPopper, PhoneCall,
  Sparkles, Zap, Mic, IndianRupee, X, Cake, Briefcase, Heart,
  TriangleAlert, RefreshCcw, TrendingUp
} from 'lucide-react';
import VenueCard from '@/shared/components/VenueCard';
import { getAppwriteImageUrl, parsePhotos } from '@/shared/utils/image';

// ─────────────────────────────────────────────────────────────────
// NLP INTENT ENGINE
// ─────────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  'birthday', 'wedding', 'reception', 'engagement', 'sangeet', 'mehndi',
  'anniversary', 'corporate', 'conference', 'seminar', 'meeting',
  'kitty party', 'kitty', 'bachelor', 'bachelorette', 'baby shower',
  'pre-wedding', 'pre wedding', 'retirement', 'farewell', 'prom',
  'festival', 'reunion', 'product launch', 'launch', 'award',
] as const;

const VENUE_TYPES = [
  'banquet', 'banquet hall', 'hotel', 'resort', 'farmhouse', 'farm house',
  'lawn', 'rooftop', 'rooftop venue', 'club', 'lounge', 'convention center',
  'hall', 'auditorium', 'studio', 'ballroom', 'garden', 'terrace',
] as const;

const AMENITY_KEYWORDS: Record<string, string[]> = {
  'Parking':      ['parking', 'car park', 'valet'],
  'DJ':           ['dj', 'disc jockey', 'music system', 'sound system'],
  'Decoration':   ['decoration', 'decor', 'decorations', 'theme'],
  'Catering':     ['catering', 'food', 'meals', 'buffet', 'dinner', 'lunch', 'breakfast'],
  'AC':           ['ac', 'air conditioning', 'air-conditioned', 'air conditioned'],
  'WiFi':         ['wifi', 'wi-fi', 'internet', 'wireless'],
  'Projector':    ['projector', 'screen', 'presentation', 'av'],
  'Dance Floor':  ['dance floor', 'dance', 'dancing'],
  'Bar':          ['bar', 'drinks', 'cocktail', 'beverages'],
  'Lawn':         ['lawn', 'garden', 'outdoor', 'open air', 'open-air'],
  'Stage':        ['stage', 'podium', 'performance'],
  'Swimming Pool':['pool', 'swimming'],
};

const INDIAN_CITIES = [
  'haldwani', 'nainital', 'dehradun', 'haridwar', 'rishikesh', 'kathgodam',
  'delhi', 'new delhi', 'noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad',
  'mumbai', 'pune', 'bangalore', 'bengaluru', 'chennai', 'hyderabad',
  'kolkata', 'ahmedabad', 'surat', 'jaipur', 'lucknow', 'chandigarh',
  'agra', 'varanasi', 'bhopal', 'indore', 'nagpur', 'patna',
  'kochi', 'coimbatore', 'visakhapatnam', 'vizag', 'goa',
];

export interface ParsedIntent {
  eventType: string;
  venueType: string;
  capacity: number;
  maxBudget: number | null;
  city: string;
  pincode: string;
  amenities: string[];
  rawQuery: string;
  isUnrelated: boolean;
}

export interface ScoredVenue {
  venue: any;
  score: number;
  matchedSignals: string[];
}

function extractIntent(query: string): ParsedIntent {
  const q = query.toLowerCase().trim();

  // ── Pincode ─────────────────────────────────
  const pincodeMatch = q.match(/\b(\d{6})\b/);
  const pincode = pincodeMatch ? pincodeMatch[1] : '';

  // ── Capacity ─────────────────────────────────
  // "50 pax", "50 guests", "50 people", "for 50", "upto 50", "50+", "50-60"
  let capacity = 0;
  const capPatterns = [
    /(\d+)\s*(?:pax|guests?|people|persons?|heads?|attendees?)/i,
    /(?:for|of|upto|up to|atleast|at least|minimum)\s*(\d+)/i,
    /(\d+)\s*[-–to]+\s*\d+\s*(?:pax|guests?|people)?/i,
  ];
  for (const pat of capPatterns) {
    const m = q.match(pat);
    if (m && parseInt(m[1]) > 5) { capacity = parseInt(m[1]); break; }
  }

  // ── Budget ───────────────────────────────────
  let maxBudget: number | null = null;
  const lakhMatch = q.match(/(?:under|below|within|upto|budget\s*of)?\s*₹?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lac|l\b)/i);
  if (lakhMatch) {
    maxBudget = parseFloat(lakhMatch[1]) * 100000;
  } else {
    const kMatch = q.match(/(?:under|below|within|upto|budget\s*of)?\s*₹?\s*(\d+)\s*k\b/i);
    if (kMatch) {
      maxBudget = parseInt(kMatch[1]) * 1000;
    } else {
      const rsMatch = q.match(/(?:under|below|within|upto|budget\s*of)?\s*(?:₹|rs\.?|inr)\s*([\d,]+)/i);
      if (rsMatch) maxBudget = parseInt(rsMatch[1].replace(/,/g, ''));
      else {
        const pureUnder = q.match(/(?:under|below|within|budget of)\s*([\d,]+)/i);
        if (pureUnder) maxBudget = parseInt(pureUnder[1].replace(/,/g, ''));
      }
    }
  }

  // ── City ─────────────────────────────────────
  let city = '';
  for (const c of INDIAN_CITIES) {
    if (q.includes(c)) { city = c; break; }
  }

  // ── Event Type ───────────────────────────────
  let eventType = '';
  for (const e of EVENT_TYPES) {
    if (q.includes(e)) { eventType = e; break; }
  }

  // ── Venue Type ───────────────────────────────
  let venueType = '';
  for (const v of VENUE_TYPES) {
    if (q.includes(v)) { venueType = v; break; }
  }

  // ── Amenities ────────────────────────────────
  const amenities: string[] = [];
  for (const [amenityName, keywords] of Object.entries(AMENITY_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) amenities.push(amenityName);
  }

  // ── Unrelated query detection ─────────────────
  const venueRelatedWords = [
    'venue', 'hall', 'event', 'party', 'wedding', 'birthday', 'function',
    'book', 'celebrate', 'celebration', 'marriage', 'find', 'search',
    'banquet', 'hotel', 'resort', 'farmhouse', 'pax', 'guests', 'people',
    ...EVENT_TYPES, ...VENUE_TYPES, ...INDIAN_CITIES,
  ];
  const hasVenueContext = venueRelatedWords.some(w => q.includes(w))
    || capacity > 0 || maxBudget !== null || pincode !== '';

  return {
    eventType,
    venueType,
    capacity,
    maxBudget,
    city,
    pincode,
    amenities,
    rawQuery: query,
    isUnrelated: !hasVenueContext,
  };
}

// ─────────────────────────────────────────────────────────────────
// RELEVANCE SCORING + FILTERING
// ─────────────────────────────────────────────────────────────────

function filterAndRank(
  venues: any[],
  intent: ParsedIntent,
  options: { relaxCapacity?: boolean; relaxBudget?: boolean } = {}
): ScoredVenue[] {
  const results: ScoredVenue[] = [];

  for (const venue of venues) {
    if (!venue.verified) continue;
    if (venue.subscriptionPlan === 'free' || !venue.subscriptionPlan) continue;

    const venueCap = parseInt(venue.capacity) || 0;
    const matchedSignals: string[] = [];
    let score = 0;

    // ── Hard Filter: Capacity ─────────────────────
    if (intent.capacity > 0) {
      const minCap = options.relaxCapacity ? intent.capacity * 0.7 : intent.capacity;
      const maxCap = options.relaxCapacity ? intent.capacity * 1.4 : Infinity;
      if (venueCap < minCap) continue;
      if (venueCap > maxCap) continue;
      score += 30;
      matchedSignals.push(`${venueCap} PAX capacity`);
    }

    // ── Hard Filter: Budget ───────────────────────
    if (!options.relaxBudget && intent.maxBudget !== null && venue.price !== null && venue.price > 0) {
      const pax = intent.capacity > 0 ? intent.capacity : 100;
      const maxPerPlate = intent.maxBudget / pax;
      if (venue.price > maxPerPlate * 1.3) continue; // 30% tolerance
      score += 15;
      matchedSignals.push(`within ₹${intent.maxBudget.toLocaleString('en-IN')} budget`);
    }

    // ── Soft Score: Event Type ────────────────────
    if (intent.eventType) {
      const cats: string[] = venue.categories || [];
      const hasMatch = cats.some(c => c.toLowerCase().includes(intent.eventType) || intent.eventType.includes(c.toLowerCase()));
      if (hasMatch) { score += 25; matchedSignals.push(intent.eventType); }
    }

    // ── Soft Score: Venue Type ────────────────────
    if (intent.venueType) {
      const venueTypeLower = (venue.type || '').toLowerCase();
      if (venueTypeLower.includes(intent.venueType) || intent.venueType.includes(venueTypeLower)) {
        score += 20;
        matchedSignals.push(intent.venueType);
      }
    }

    // ── Hard Filter: City ──────────────────────────
    if (intent.city) {
      const venueCity = (venue.city || '').toLowerCase();
      if (!venueCity.includes(intent.city) && !intent.city.includes(venueCity)) continue;
      score += 20;
      matchedSignals.push(venue.city);
    }

    // ── Hard Filter: Pincode ───────────────────────
    if (intent.pincode) {
      if (!(venue.pincode || '').startsWith(intent.pincode.slice(0, 4))) continue;
      score += 15;
      matchedSignals.push(`near ${intent.pincode}`);
    }

    // ── Soft Score: Amenities ─────────────────────
    if (intent.amenities.length > 0) {
      const venueAmenities: string[] = venue.amenities || [];
      const venueAmenitiesLower = venueAmenities.map(a => a.toLowerCase());
      for (const reqAmenity of intent.amenities) {
        const matched = venueAmenitiesLower.some(a => a.includes(reqAmenity.toLowerCase()) || reqAmenity.toLowerCase().includes(a));
        if (matched) { score += 5; matchedSignals.push(reqAmenity); }
      }
    }

    // ── Bonus: Paid Plan ──────────────────────────
    if (venue.subscriptionPlan && venue.subscriptionPlan !== 'free') score += 10;

    // ── Bonus: Rating ─────────────────────────────
    score += (parseFloat(venue.rating) || 0) * 3;

    results.push({ venue, score, matchedSignals });
  }

  return results.sort((a, b) => b.score - a.score);
}

// ─────────────────────────────────────────────────────────────────
// VENUE DATA MAPPER
// ─────────────────────────────────────────────────────────────────
function mapVenueDoc(doc: any) {
  const photos = parsePhotos(doc.photos);
  const hasPaidPlan = doc.subscriptionPlan &&
    doc.subscriptionPlan !== 'free' &&
    doc.subscriptionPlan !== 'None' &&
    doc.subscriptionPlan !== '';

  return {
    id: doc.$id,
    name: doc.venueName || 'Unnamed Venue',
    location: doc.landmark || doc.city || 'India',
    city: doc.city || 'India',
    type: doc.venueType || 'Banquet Hall',
    capacity: parseInt(doc.capacity) || 0,
    price: doc.perPlateVeg ? parseFloat(doc.perPlateVeg) : null,
    pincode: doc.pincode?.toString() || '',
    rating: parseFloat(doc.rating) || 0,
    reviews: doc.totalReviews || 0,
    img: photos.length > 0 ? getAppwriteImageUrl(photos[0]) : '',
    verified: doc.isVerified || false,
    popular: doc.status === 'active',
    isPaid: !!hasPaidPlan,
    amenities: doc.amenities
      ? typeof doc.amenities === 'string' ? JSON.parse(doc.amenities) : doc.amenities
      : [],
    categories: doc.eventTypes
      ? typeof doc.eventTypes === 'string' ? JSON.parse(doc.eventTypes) : doc.eventTypes
      : [],
    subscriptionPlan: doc.subscriptionPlan || 'free',
    foodTypes: doc.foodTypes
      ? typeof doc.foodTypes === 'string' ? JSON.parse(doc.foodTypes) : doc.foodTypes
      : [],
  };
}

// ─────────────────────────────────────────────────────────────────
// FOLLOW-UP SUGGESTION CHIPS
// ─────────────────────────────────────────────────────────────────
function FollowUpSuggestions({
  intent,
  onSuggest,
}: {
  intent: ParsedIntent;
  onSuggest: (query: string) => void;
}) {
  const suggestions: { label: string; query: string; icon: React.ReactNode }[] = [];

  if (intent.capacity > 0) {
    const lo = Math.round(intent.capacity * 0.7);
    const hi = Math.round(intent.capacity * 1.4);
    suggestions.push({
      label: `Show venues for ${lo}–${hi} guests`,
      query: `${intent.eventType || 'event'} venue for ${lo}-${hi} guests${intent.city ? ` in ${intent.city}` : ''}`,
      icon: <Users size={14} />,
    });
  }

  if (intent.maxBudget !== null) {
    const relaxed = intent.maxBudget * 1.5;
    suggestions.push({
      label: `Increase budget to ₹${(relaxed / 100000).toFixed(1)}L`,
      query: `${intent.eventType || 'event'} venue${intent.capacity > 0 ? ` for ${intent.capacity} guests` : ''}${intent.city ? ` in ${intent.city}` : ''} under ₹${relaxed.toLocaleString('en-IN')}`,
      icon: <IndianRupee size={14} />,
    });
  }

  if (intent.city) {
    suggestions.push({
      label: `Show all venues in ${intent.city}`,
      query: `venue in ${intent.city}`,
      icon: <MapPin size={14} />,
    });
  } else {
    suggestions.push({
      label: 'Show all available venues',
      query: `${intent.eventType || 'event'} venue`,
      icon: <Building2 size={14} />,
    });
  }

  if (intent.eventType) {
    suggestions.push({
      label: `Any ${intent.eventType} venue`,
      query: `${intent.eventType} venue`,
      icon: <PartyPopper size={14} />,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-6 bg-amber-50 border border-amber-100 rounded-3xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <TriangleAlert size={16} className="text-amber-500" />
        <p className="text-sm font-bold text-amber-700">
          No exact matches — try one of these:
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggest(s.query)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 text-amber-800 rounded-full text-xs font-bold hover:bg-amber-100 hover:border-amber-300 transition-all"
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SIGNAL TAGS — compact chips for matched intent signals
// ─────────────────────────────────────────────────────────────────
function SignalTag({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${color}`}>
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
export default function AISearchPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [liveVenues, setLiveVenues] = useState<any[]>([]);
  const [intent, setIntent] = useState<ParsedIntent | null>(null);
  const [scoredResults, setScoredResults] = useState<ScoredVenue[]>([]);
  const [fallbackMode, setFallbackMode] = useState<'none' | 'relaxCapacity' | 'relaxBudget' | 'noMatch'>('none');

  const [isListening, setIsListening] = useState(false);
  const [hasRecognition, setHasRecognition] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // We need a ref to the latest runSearch to call it from the speech recognition callback
  const runSearchRef = useRef<any>(null);

  // ── Speech Recognition ────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      setTimeout(() => setHasRecognition(true), 0);
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        
        // Auto-trigger search when speaking stops
        if (runSearchRef.current) {
          runSearchRef.current(transcript);
        }
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); }
    else { setQuery(''); recognitionRef.current?.start(); setIsListening(true); }
  };

  // ── Fetch Venues ──────────────────────────────
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
        const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
        const response = await fetch(`${baseUrl}/venues?verified=true`);
        const result = await response.json();
        if (result.status === 'success') {
          setLiveVenues(result.data.map(mapVenueDoc));
        }
      } catch (err) {
        console.warn('Could not fetch venues:', err);
      }
    };
    fetchVenues();
  }, []);


  // ── Core Search Logic ─────────────────────────
  const runSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setHasSearched(false);

    setTimeout(() => {
      const parsed = extractIntent(searchQuery);
      setIntent(parsed);

      if (parsed.isUnrelated) {
        setScoredResults([]);
        setFallbackMode('none');
        setHasSearched(true);
        setIsSearching(false);
        return;
      }

      // Pass 1: strict
      let results = filterAndRank(liveVenues, parsed, {});
      let mode: 'none' | 'relaxCapacity' | 'relaxBudget' | 'noMatch' = 'none';

      // Pass 2: relax capacity ±30%
      if (results.length === 0 && parsed.capacity > 0) {
        results = filterAndRank(liveVenues, parsed, { relaxCapacity: true });
        if (results.length > 0) mode = 'relaxCapacity';
      }

      // Pass 3: relax budget
      if (results.length === 0 && parsed.maxBudget !== null) {
        results = filterAndRank(liveVenues, parsed, { relaxBudget: true });
        if (results.length > 0) mode = 'relaxBudget';
      }

      // Pass 4: no match → show follow-ups
      if (results.length === 0) mode = 'noMatch';

      setScoredResults(results);
      setFallbackMode(mode);
      setHasSearched(true);
      setIsSearching(false);
    }, 1000);
  }, [liveVenues]);

  // Update the runSearchRef whenever runSearch changes (or on mount)
  useEffect(() => {
    runSearchRef.current = runSearch;
  });

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    runSearch(query);
  };

  const handleFollowUp = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
    runSearch(suggestedQuery);
  };

  // ── Summary Text ──────────────────────────────
  const getSummaryText = () => {
    if (!intent) return '';
    const parts: string[] = [];
    if (intent.venueType) parts.push(`**${intent.venueType}s**`);
    else parts.push('venues');
    if (intent.eventType) parts.push(`for a **${intent.eventType}**`);
    if (intent.capacity > 0) parts.push(`for **${intent.capacity}+ guests**`);
    if (intent.city) parts.push(`in **${intent.city.charAt(0).toUpperCase() + intent.city.slice(1)}**`);
    else if (intent.pincode) parts.push(`near **${intent.pincode}**`);
    if (intent.maxBudget) parts.push(`under **₹${intent.maxBudget.toLocaleString('en-IN')}**`);
    const n = scoredResults.length;
    const prefix = fallbackMode === 'relaxCapacity'
      ? `Showing **${n}** nearby-capacity`
      : fallbackMode === 'relaxBudget'
        ? `Showing **${n}** (budget relaxed)`
        : `Found **${n}**`;
    return `${prefix} ${parts.join(' ')}.`;
  };

  // ── Signal Tags for Summary Card ──────────────
  const signalTags = useMemo(() => {
    if (!intent) return [];
    const tags: { label: string; color: string }[] = [];
    if (intent.eventType) tags.push({ label: intent.eventType, color: 'bg-pd-pink/10 text-pd-pink border-pd-pink/20' });
    if (intent.venueType) tags.push({ label: intent.venueType, color: 'bg-pd-purple/10 text-pd-purple border-pd-purple/20' });
    if (intent.capacity > 0) tags.push({ label: `${intent.capacity} PAX`, color: 'bg-blue-50 text-blue-600 border-blue-100' });
    if (intent.city) tags.push({ label: intent.city, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' });
    if (intent.pincode) tags.push({ label: `PIN ${intent.pincode}`, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' });
    if (intent.maxBudget) tags.push({ label: `₹${intent.maxBudget >= 100000 ? `${intent.maxBudget / 100000}L` : `${intent.maxBudget / 1000}K`}`, color: 'bg-amber-50 text-amber-600 border-amber-100' });
    intent.amenities.forEach(a => tags.push({ label: a, color: 'bg-slate-50 text-slate-600 border-slate-100' }));
    return tags;
  }, [intent]);

  return (
    <div className={`bg-white flex flex-col selection:bg-pd-purple/10 relative min-h-[calc(100vh-100px)] pt-20 overflow-x-hidden`}>

      {/* ── HERO / SEARCH SECTION ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          minHeight: hasSearched ? 'auto' : 'auto',
          paddingTop: hasSearched ? '2rem' : '1rem',
          paddingBottom: '4rem',
        }}
        className="w-full px-4 md:px-12 lg:px-24 relative z-10 flex flex-col justify-start"
      >
        <div className={`w-full max-w-350 mx-auto ${hasSearched ? 'mb-12' : ''}`}>
          <AnimatePresence mode="wait">
            {!hasSearched ? (
              isSearching ? (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 w-full flex flex-col items-center justify-center min-h-[calc(100vh-250px)] z-20"
                >
                  <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                    <div className="relative flex items-center justify-center w-64 md:w-80 h-28 md:h-36 mb-10 md:mb-12 perspective-1000">
                      {/* Glow effect behind logo */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 md:w-72 h-24 md:h-32 bg-pd-purple/20 blur-[40px] rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
                      
                      {/* Floating and rotating logo */}
                      <motion.div 
                        animate={{ 
                          y: [0, -12, 0],
                          rotateY: [0, 8, -8, 0]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="relative z-10 w-full h-full flex items-center justify-center"
                      >
                        <img src="/logo-nav.png" alt="PartyDial AI" className="w-full h-full object-contain drop-shadow-2xl drop-shadow-pd-pink" />
                      </motion.div>

                      {/* Sci-fi Scanning Laser */}
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pd-pink to-transparent z-20 shadow-[0_0_12px_4px_rgba(236,72,153,0.7)]"
                      />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pd-pink to-pd-purple mb-4">
                      AI is finding your perfect venue...
                    </h3>
                    <p className="text-base md:text-lg text-slate-500 font-medium max-w-lg text-center">
                      Scanning through thousands of luxury locations, checking capacities, and matching your vibe.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="hero-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-4xl mx-auto flex flex-col items-center text-center z-20"
                >
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-white shadow-sm border border-slate-100 rounded-full text-pd-purple mb-8">
                  <Sparkles size={16} className="text-pd-purple" />
                  <span className="text-[11px] font-bold text-pd-purple">AI-Powered Venue Search — Type naturally</span>
                </div>

                <h1 className="text-[2rem] leading-none md:text-5xl lg:text-6xl font-black tracking-tighter mb-4">
                  <span className="text-slate-900">What kind of<br /></span>
                  <span className="text-pd-pink">venue are </span>
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-cyan-400">you looking for?</span>
                </h1>

                <p className="text-slate-500 font-medium text-base md:text-xl max-w-xl leading-relaxed mb-8 md:mb-12">
                  Describe your event in plain English — I&apos;ll find the best matching venues for you.
                </p>

                {/* ACTION CARDS */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-3xl mx-auto mb-10 md:mb-12">
                  <Link
                    href="/venues"
                    className="flex-1 bg-pd-pink/5 border border-pd-pink/10 rounded-[2rem] p-5 md:p-6 flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                      <Search className="text-pd-pink w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-bold text-slate-900 text-base md:text-lg">Manual Search</h3>
                      <p className="text-xs md:text-sm text-slate-500">Filter venues your way</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 border border-pd-pink/20 rounded-full flex items-center justify-center group-hover:bg-pd-pink transition-colors">
                      <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px] text-pd-pink group-hover:text-white transition-colors" />
                    </div>
                  </Link>

                  <a href="tel:+918679933302" className="flex-1 bg-blue-50 border border-blue-100 rounded-[2rem] p-5 md:p-6 flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                      <PhoneCall className="text-blue-500 w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-bold text-slate-900 text-base md:text-lg">Call Our Team</h3>
                      <p className="text-xs md:text-sm font-semibold text-slate-600">+91 86799 33302</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 border border-blue-200 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                      <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px] text-blue-500 group-hover:text-white transition-colors" />
                    </div>
                  </a>
                </div>

                {/* SEARCH BAR */}
                <div className="w-full max-w-5xl mx-auto mb-12 relative group">
                  {/* Subtle ambient glow behind the search bar */}
                  <div className="absolute -inset-1 bg-linear-to-r from-pd-pink via-pd-purple to-pd-blue rounded-[32px] blur-xl opacity-20 group-hover:opacity-40 transition duration-700 pointer-events-none"></div>
                  
                  <form onSubmit={handleSearch} className="relative flex items-end w-full bg-white shadow-[0_8px_40px_rgb(0,0,0,0.08)] rounded-[32px] transition-all duration-500 p-2 md:p-3 outline-none border-none ring-0">
                    {/* Left Icon */}
                    <div className="pl-4 md:pl-5 pr-2 pb-[10px] md:pb-[12px] flex items-center justify-center pointer-events-none">
                      <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-pd-purple animate-pulse" />
                    </div>

                    {/* Input */}
                    <textarea
                      id="ai-search-input"
                      rows={1}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (query.trim() && !isSearching) {
                            const form = e.currentTarget.closest('form');
                            if (form) form.requestSubmit();
                          }
                        }
                      }}
                      placeholder="Describe your perfect event and we'll find the best venues"
                      className="flex-1 bg-transparent border-none outline-none ring-0 text-base md:text-lg font-medium text-slate-800 placeholder:text-slate-400 py-2 md:py-[10px] min-w-0 resize-none overflow-y-auto max-h-[120px]"
                    />

                    {/* Right Actions */}
                    <div className="flex-shrink-0 flex items-center gap-1 md:gap-2 pr-1 md:pr-2">
                      {hasRecognition && (
                        <button
                          type="button"
                          onClick={toggleListening}
                          className={`p-2 rounded-full transition-all duration-300 ${isListening ? 'bg-pd-red/10 text-pd-red shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' : 'text-slate-400 hover:text-pd-purple hover:bg-slate-50'}`}
                        >
                          <Mic className="w-5 h-5" />
                        </button>
                      )}
                      
                      <button
                        type="submit"
                        disabled={!query.trim() || isSearching}
                        className="w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 disabled:pointer-events-none transition-all"
                      >
                        {isSearching ? (
                          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Example queries */}
                <div className="w-full max-w-3xl mx-auto text-center relative z-30 mt-2 animate-in fade-in duration-500">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Try These Examples</h4>
                  <div className="flex flex-nowrap md:justify-center overflow-x-auto gap-3 pb-6 w-full snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {[
                      { text: 'Birthday party for 50 pax', icon: <Cake size={13} className="text-pd-purple" /> },
                      { text: 'Corporate event in Noida', icon: <Briefcase size={13} className="text-pd-pink" /> },
                      { text: 'Wedding venue for 300 guests with parking', icon: <Heart size={13} className="text-rose-500" /> },
                      { text: 'Rooftop venue under ₹2 Lakhs', icon: <Building2 size={13} className="text-blue-500" /> },
                    ].map(({ text, icon }, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(text)}
                        className="snap-start px-4 py-2 bg-white border border-slate-100 shadow-sm rounded-full flex items-center gap-2 hover:border-pd-purple/30 transition-all shrink-0 whitespace-nowrap"
                      >
                        {icon}
                        <span className="text-xs font-medium text-slate-700">{text}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </motion.div>
              )
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full pb-36"
              >
                {/* SEARCH BAR (RESULTS VIEW) - FIXED AT BOTTOM */}
                <div className="fixed bottom-6 md:bottom-10 left-0 right-0 mx-auto z-50 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-5xl group shadow-2xl shadow-slate-900/10 rounded-[32px]">
                  <div className="absolute -inset-1 bg-linear-to-r from-pd-pink via-pd-purple to-pd-blue rounded-[32px] blur-xl opacity-20 group-hover:opacity-40 transition duration-700 pointer-events-none"></div>
                  
                  <form onSubmit={handleSearch} className="relative flex items-end w-full bg-white rounded-[32px] transition-all duration-500 p-2 md:p-3 outline-none border-none ring-0">
                    <div className="pl-4 md:pl-5 pr-2 pb-[10px] md:pb-[12px] flex items-center justify-center pointer-events-none">
                      {isSearching ? (
                        <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-pd-purple border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-pd-purple animate-pulse" />
                      )}
                    </div>

                    <textarea
                      id="ai-search-results-input"
                      rows={1}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (query.trim() && !isSearching) {
                            const form = e.currentTarget.closest('form');
                            if (form) form.requestSubmit();
                          }
                        }
                      }}
                      placeholder="Describe your perfect event and we'll find the best venues"
                      className="flex-1 bg-transparent border-none outline-none ring-0 text-base md:text-lg font-medium text-slate-800 placeholder:text-slate-400 py-2 md:py-[10px] min-w-0 resize-none overflow-y-auto max-h-[120px]"
                    />

                    <div className="flex-shrink-0 flex items-center gap-1 md:gap-2 pr-1 md:pr-2">
                      {hasRecognition && (
                        <button
                          type="button"
                          onClick={toggleListening}
                          className={`p-2 rounded-full transition-all duration-300 ${isListening ? 'bg-pd-red/10 text-pd-red shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' : 'text-slate-400 hover:text-pd-purple hover:bg-slate-50'}`}
                        >
                          <Mic className="w-5 h-5" />
                        </button>
                      )}
                      
                      <button
                        type="submit"
                        disabled={!query.trim() || isSearching}
                        className="w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 disabled:pointer-events-none transition-all"
                      >
                        {isSearching ? (
                          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* UNRELATED QUERY */}
                {intent?.isUnrelated ? (
                  <div className="text-center py-24 bg-white rounded-[48px] border border-slate-100 shadow-pd-soft">
                    <div className="inline-flex justify-center items-center w-24 h-24 bg-red-50 rounded-full text-pd-red mb-8">
                      <X size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-3 italic">I can only help with venues</h2>
                    <p className="text-slate-500 font-medium mb-10 max-w-lg mx-auto px-6">
                      I&apos;m an AI assistant specifically designed to help you discover and book premium venues. Please describe what kind of event or venue you&apos;re looking for!
                    </p>
                    <button
                      onClick={() => { setQuery(''); setHasSearched(false); setIntent(null); }}
                      className="pd-btn-primary rounded-2xl!"
                    >
                      Start New Search
                    </button>
                  </div>
                ) : (
                  <>
                    {/* AI SUMMARY CARD */}
                    <div className="mb-8 p-6 md:p-8 bg-white border border-slate-100 rounded-[32px] shadow-pd-soft relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-pd-purple/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                      {/* Fallback badge */}
                      {fallbackMode !== 'none' && fallbackMode !== 'noMatch' && (
                        <div className="flex items-center gap-2 mb-4 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full w-fit">
                          <RefreshCcw size={12} className="text-amber-500" />
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                            {fallbackMode === 'relaxCapacity' ? 'Showing nearby capacity matches' : 'Budget relaxed to show results'}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-start gap-5">
                          <div className="p-4 bg-pd-purple/10 text-pd-purple rounded-2xl shrink-0">
                            <Zap size={28} className="fill-pd-purple/20" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-pd-purple uppercase tracking-[0.3em] mb-1">AI MATCH SUMMARY</p>
                            <p
                              className="text-xl md:text-2xl font-bold text-slate-800 leading-tight"
                              dangerouslySetInnerHTML={{
                                __html: getSummaryText().replace(/\*\*(.*?)\*\*/g, '<span class="pd-gradient-text">$1</span>')
                              }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => { setHasSearched(false); setIntent(null); setScoredResults([]); }}
                          className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-pd-red transition-colors shrink-0"
                          title="Clear Search"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {/* Signal Tags */}
                      {signalTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-5 relative z-10">
                          {signalTags.map((tag, i) => (
                            <SignalTag key={i} label={tag.label} color={tag.color} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* RESULTS GRID */}
                    {scoredResults.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {scoredResults.map(({ venue, matchedSignals }, idx) => (
                          <motion.div
                            key={venue.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04, duration: 0.35 }}
                          >
                            <div className="relative h-full">
                              {/* Relevance indicator */}
                              {idx === 0 && (
                                <div className="absolute -top-3 left-4 z-10 flex items-center gap-1.5 px-3 py-1 bg-pd-purple rounded-full shadow-lg">
                                  <TrendingUp size={11} className="text-white" />
                                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Best Match</span>
                                </div>
                              )}
                              <VenueCard venue={venue} index={idx} isPremium={idx < 3} />
                              {/* Matched signals under card */}
                              {matchedSignals.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2 px-1">
                                  {matchedSignals.slice(0, 3).map((s, si) => (
                                    <span key={si} className="text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                                      ✓ {s}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : fallbackMode === 'noMatch' ? (
                      // FOLLOW-UP SUGGESTIONS
                      <div className="text-center py-16 bg-white rounded-[48px] border border-slate-100 shadow-pd-soft">
                        <div className="inline-flex justify-center items-center w-20 h-20 bg-slate-50 rounded-full text-slate-300 mb-6">
                          <Search size={36} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">No exact matches found</h2>
                        <p className="text-slate-500 font-medium max-w-md mx-auto mb-2 px-6">
                          The AI couldn&apos;t find venues matching all your criteria exactly.
                        </p>
                        {intent && (
                          <FollowUpSuggestions intent={intent} onSuggest={handleFollowUp} />
                        )}
                      </div>
                    ) : null}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
