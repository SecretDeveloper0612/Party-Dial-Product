'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowRight,
  
  PartyPopper,
  Users,
  Briefcase,
  Gem,
  Baby,
  Cake,
  Mic2,
  Presentation,
  Layout,
  Globe,
  Home,
  Music,
  Wine,
  Camera,
  Heart,
  Calendar,
  Zap,
  Gift,
  Award,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Wind,
  ChevronDown
} from 'lucide-react';
import { useState, useMemo } from 'react';

const CATEGORIES = [
  // 1. Birthday Party
  { id: 1, title: "Kids Birthday Party", slug: "kids-birthday", description: "Magical birthday celebrations for children with games and fun.", count: "450+ Venues", img: "/categories/birthday.png", icon: <Cake size={20} />, tag: "Birthday Party" },
  { id: 2, title: "Teen Birthday Party", slug: "teen-birthday", description: "Trendy and high-energy spots for being a teenager.", count: "320+ Venues", img: "/categories/birthday.png", icon: <Music size={20} />, tag: "Birthday Party" },
  { id: 3, title: "Adult Birthday Party", slug: "adult-birthday", description: "Chic lounges and rooftop bars for adult celebrations.", count: "400+ Venues", img: "/categories/birthday.png", icon: <Wine size={20} />, tag: "Birthday Party" },
  { id: 4, title: "Milestone Birthday", slug: "milestone-birthday", description: "Grand venues for 18th, 21st, 25th, 50th etc.", count: "280+ Venues", img: "/categories/birthday.png", icon: <Gem size={20} />, tag: "Birthday Party" },
  { id: 5, title: "Surprise Birthday Party", slug: "surprise-birthday", description: "Hidden gems and private rooms for the perfect surprise.", count: "220+ Venues", img: "/categories/birthday.png", icon: <Gift size={20} />, tag: "Birthday Party" },
  { id: 6, title: "Theme Birthday Party", slug: "theme-birthday", description: "Versatile spaces that can be transformed into any world.", count: "190+ Venues", img: "/categories/birthday.png", icon: <PartyPopper size={20} />, tag: "Birthday Party" },

  // 2. Wedding Events
  { id: 7, title: "Wedding Ceremony", slug: "wedding-ceremony", description: "Prestigious banquet halls and lush lawns for your Vows.", count: "850+ Venues", img: "/categories/wedding.png", icon: <Heart size={20} />, tag: "Wedding Events" },
  { id: 8, title: "Wedding Reception", slug: "wedding-reception", description: "Grand ballrooms for your first dinner as a married couple.", count: "780+ Venues", img: "/categories/wedding.png", icon: <Users size={20} />, tag: "Wedding Events" },
  { id: 9, title: "Destination Wedding", slug: "destination-wedding", description: "Exotic resorts and palaces for a memorable getaway.", count: "300+ Venues", img: "/categories/wedding.png", icon: <Globe size={20} />, tag: "Wedding Events" },
  { id: 10, title: "Court Marriage Celebration", slug: "court-marriage", description: "Intimate and elegant spaces for close group dinners.", count: "150+ Venues", img: "/categories/wedding.png", icon: <Briefcase size={20} />, tag: "Wedding Events" },
  { id: 11, title: "Traditional Wedding", slug: "traditional-wedding", description: "Culturally rich venues with traditional aesthetics.", count: "420+ Venues", img: "/categories/wedding.png", icon: <PartyPopper size={20} />, tag: "Wedding Events" },

  // 3. Pre-Wedding Events
  { id: 12, title: "Mehendi Ceremony", slug: "mehendi", description: "Vibrant and colorful festive spaces for heena ceremony.", count: "340+ Venues", img: "/categories/wedding.png", icon: <PartyPopper size={20} />, tag: "Pre-Wedding Events" },
  { id: 13, title: "Haldi Ceremony", slug: "haldi", description: "Bright and cheerful venues for the auspicious haldi.", count: "280+ Venues", img: "/categories/wedding.png", icon: <Zap size={20} />, tag: "Pre-Wedding Events" },
  { id: 14, title: "Sangeet Night", slug: "sangeet", description: "Lively venues with dance floors and great acoustics.", count: "500+ Venues", img: "/categories/wedding.png", icon: <Music size={20} />, tag: "Pre-Wedding Events" },
  { id: 15, title: "Cocktail Party", slug: "cocktail", description: "Sophisticated bars for pre-wedding drinks and fun.", count: "380+ Venues", img: "/categories/wedding.png", icon: <Wine size={20} />, tag: "Pre-Wedding Events" },
  { id: 16, title: "Pre-Wedding Dinner", slug: "pre-wedding-dinner", description: "Exclusive dining spaces for pre-wedding family meets.", count: "250+ Venues", img: "/categories/wedding.png", icon: <Users size={20} />, tag: "Pre-Wedding Events" },

  // 4. Anniversary Party
  { id: 17, title: "Wedding Anniversary", slug: "wedding-anniversary", description: "Romantic and cozy spots to celebrate your union.", count: "400+ Venues", img: "/categories/festival.png", icon: <Heart size={20} />, tag: "Anniversary Party" },
  { id: 18, title: "Silver Jubilee (25th)", slug: "silver-anniversary", description: "Elegant banquets for 25 years of togetherness.", count: "180+ Venues", img: "/categories/festival.png", icon: <Gem size={20} />, tag: "Anniversary Party" },
  { id: 19, title: "Golden Jubilee (50th)", slug: "golden-anniversary", description: "Grand venues for a legendary 50-year celebration.", count: "120+ Venues", img: "/categories/festival.png", icon: <Award size={20} />, tag: "Anniversary Party" },
  { id: 20, title: "Surprise Anniversary", slug: "surprise-anniversary", description: "Secret spots for a heartwarming surprise celebration.", count: "140+ Venues", img: "/categories/festival.png", icon: <Gift size={20} />, tag: "Anniversary Party" },

  // 5. Corporate Events
  { id: 21, title: "Corporate Party", slug: "corporate-party", description: "Mix business with pleasure at these premium spots.", count: "350+ Venues", img: "/categories/corporate.png", icon: <Briefcase size={20} />, tag: "Corporate Events" },
  { id: 22, title: "Office Party", slug: "office-party", description: "Relaxed venues for team bonding and rewards.", count: "290+ Venues", img: "/categories/corporate.png", icon: <Users size={20} />, tag: "Corporate Events" },
  { id: 23, title: "Annual Day", slug: "annual-day", description: "Large scale venues for organization's milestones.", count: "180+ Venues", img: "/categories/corporate.png", icon: <Award size={20} />, tag: "Corporate Events" },
  { id: 24, title: "Product Launch", slug: "product-launch", description: "Cutting-edge spaces to showcase your next big thing.", count: "120+ Venues", img: "/categories/corporate.png", icon: <Zap size={20} />, tag: "Corporate Events" },
  { id: 25, title: "Corporate Dinner", slug: "corporate-dinner", description: "Upscale dining for executive networking.", count: "240+ Venues", img: "/categories/corporate.png", icon: <Briefcase size={20} />, tag: "Corporate Events" },
  { id: 26, title: "Business Networking", slug: "business-networking", description: "Open halls designed for professional connections.", count: "160+ Venues", img: "/categories/corporate.png", icon: <Globe size={20} />, tag: "Corporate Events" },
  { id: 27, title: "Team Outing / Party", slug: "team-outing", description: "Resorts and activity centers for team spirit.", count: "130+ Venues", img: "/categories/corporate.png", icon: <Users size={20} />, tag: "Corporate Events" },

  // 6. Kitty Party
  { id: 28, title: "Ladies Kitty Party", slug: "ladies-kitty", description: "Private dining rooms for your monthly ladies meet.", count: "220+ Venues", img: "/categories/bachelor.png", icon: <Users size={20} />, tag: "Kitty Party" },
  { id: 29, title: "Couples Kitty Party", slug: "couples-kitty", description: "Trendy spots for social couple gatherings.", count: "160+ Venues", img: "/categories/bachelor.png", icon: <Users size={20} />, tag: "Kitty Party" },
  { id: 30, title: "Theme Kitty Party", slug: "theme-kitty", description: "Venues that help you bring your themes to life.", count: "140+ Venues", img: "/categories/bachelor.png", icon: <PartyPopper size={20} />, tag: "Kitty Party" },
  { id: 31, title: "Monthly Kitty Meet", slug: "monthly-kitty", description: "Consistent and reliable spots for your circle.", count: "210+ Venues", img: "/categories/bachelor.png", icon: <Calendar size={20} />, tag: "Kitty Party" },

  // 7. Family Functions
  { id: 32, title: "Family Get-Together", slug: "family-get-together", description: "Spacious halls for all generations to bond.", count: "550+ Venues", img: "/categories/kids.png", icon: <Users size={20} />, tag: "Family Functions" },
  { id: 33, title: "Retirement Party", slug: "retirement", description: "Honor long careers at these elegant venues.", count: "110+ Venues", img: "/categories/kids.png", icon: <Users size={20} />, tag: "Family Functions" },
  { id: 34, title: "Naming Ceremony", slug: "naamkaran", description: "Heartwarming spaces for the baby's naming.", count: "140+ Venues", img: "/categories/kids.png", icon: <Users size={20} />, tag: "Family Functions" },
  { id: 35, title: "Mundan Ceremony", slug: "mundan", description: "Traditional venues for auspicious childhood rituals.", count: "120+ Venues", img: "/categories/kids.png", icon: <Users size={20} />, tag: "Family Functions" },
  { id: 36, title: "Religious Ceremony", slug: "religious-ceremony", description: "Pure and serene spaces for soul-cleansing rituals.", count: "180+ Venues", img: "/categories/kids.png", icon: <PartyPopper size={20} />, tag: "Family Functions" },

  // 8. Festival Parties
  { id: 37, title: "Diwali Party", slug: "diwali", description: "Bright and festive venues for the festival of lights.", count: "400+ Venues", img: "/categories/festival.png", icon: <PartyPopper size={20} />, tag: "Festival Parties" },
  { id: 38, title: "Holi Party", slug: "holi", description: "Organic color friendly open lawn venues.", count: "300+ Venues", img: "/categories/festival.png", icon: <Wind size={20} />, tag: "Festival Parties" },
  { id: 39, title: "New Year Party", slug: "new-year", description: "Hottest spots for the ultimate countdown night.", count: "600+ Venues", img: "/categories/festival.png", icon: <PartyPopper size={20} />, tag: "Festival Parties" },
  { id: 40, title: "Christmas Party", slug: "christmas", description: "Cozy, snow-themed and festive venues.", count: "250+ Venues", img: "/categories/festival.png", icon: <Gift size={20} />, tag: "Festival Parties" },
  { id: 41, title: "Eid Celebration", slug: "eid", description: "Large banquet halls for community feasts.", count: "180+ Venues", img: "/categories/festival.png", icon: <Globe size={20} />, tag: "Festival Parties" },
  { id: 42, title: "Navratri / Garba", slug: "navratri", description: "Spacious areas with great music for dancing.", count: "140+ Venues", img: "/categories/festival.png", icon: <Music size={20} />, tag: "Festival Parties" },
  { id: 43, title: "Lohri Party", slug: "lohri", description: "Open spaces with bonfire setups.", count: "110+ Venues", img: "/categories/festival.png", icon: <Zap size={20} />, tag: "Festival Parties" },

  // 9. Social Gatherings
  { id: 44, title: "Friends Get-Together", slug: "friends-get-together", description: "Chill spots for some time with the buddies.", count: "480+ Venues", img: "/categories/bachelor.png", icon: <Users size={20} />, tag: "Social Gatherings" },
  { id: 45, title: "Reunion Party", slug: "reunion", description: "Nostalgic venues to relive old memories.", count: "320+ Venues", img: "/categories/bachelor.png", icon: <Users size={20} />, tag: "Social Gatherings" },
  { id: 46, title: "Dinner Party", slug: "dinner-party", description: "Private dining settings for fine nights.", count: "500+ Venues", img: "/categories/bachelor.png", icon: <Wine size={20} />, tag: "Social Gatherings" },
  { id: 47, title: "House Party", slug: "house-party", description: "Penthouse and villas that feel like home.", count: "180+ Venues", img: "/categories/bachelor.png", icon: <Home size={20} />, tag: "Social Gatherings" },

  // 10. Kids Parties
  { id: 48, title: "Kids Theme Party", slug: "kids-theme", description: "Specialized venues for fantasy world setups.", count: "160+ Venues", img: "/categories/kids.png", icon: <PartyPopper size={20} />, tag: "Kids Parties" },
  { id: 49, title: "School Party", slug: "school-party", description: "Safe and spacious fun spots for school circles.", count: "130+ Venues", img: "/categories/kids.png", icon: <Users size={20} />, tag: "Kids Parties" },
  { id: 50, title: "Playdate Party", slug: "playdate", description: "Cozy activity centers for little one's meets.", count: "100+ Venues", img: "/categories/kids.png", icon: <Users size={20} />, tag: "Kids Parties" },
  { id: 51, title: "Cartoon Theme", slug: "cartoon-theme", description: "Animated wonderlands for the kids.", count: "140+ Venues", img: "/categories/kids.png", icon: <PartyPopper size={20} />, tag: "Kids Parties" },

  // 11. Bachelor / Bachelorette Party
  { id: 52, title: "Bachelor Party", slug: "bachelor-party", description: "Wild and epic venues for the groom's team.", count: "170+ Venues", img: "/categories/bachelor.png", icon: <Wine size={20} />, tag: "Bachelor / Bachelorette Party" },
  { id: 53, title: "Bachelorette Party", slug: "bachelorette-party", description: "Trendy retreats for the bride and her girls.", count: "160+ Venues", img: "/categories/bachelor.png", icon: <PartyPopper size={20} />, tag: "Bachelor / Bachelorette Party" },
  { id: 54, title: "Bachelor Trip Party", slug: "bachelor-trip", description: "Large villas and resorts for the final trip.", count: "120+ Venues", img: "/categories/bachelor.png", icon: <Globe size={20} />, tag: "Bachelor / Bachelorette Party" },
  { id: 55, title: "Friends Pre-Wedding", slug: "friends-pre-wedding", description: "Cool party houses for the close friends circle.", count: "140+ Venues", img: "/categories/bachelor.png", icon: <Users size={20} />, tag: "Bachelor / Bachelorette Party" },

  // 12. Housewarming Party
  { id: 56, title: "Griha Pravesh", slug: "griha-pravesh", description: "Pure and auspicious venues for new home blessings.", count: "180+ Venues", img: "/categories/corporate.png", icon: <Home size={20} />, tag: "Housewarming Party" },
  { id: 57, title: "New House Celebration", slug: "house-celebration", description: "Vibrant spots to celebrate your new address.", count: "140+ Venues", img: "/categories/corporate.png", icon: <PartyPopper size={20} />, tag: "Housewarming Party" },
  { id: 58, title: "Housewarming Dinner", slug: "housewarming-dinner", description: "Executive dining for your first house group dinner.", count: "160+ Venues", img: "/categories/corporate.png", icon: <Wine size={20} />, tag: "Housewarming Party" },

  // 13. Baby Shower
  { id: 59, title: "Godh Bharai", slug: "godh-bharai", description: "Traditional venues for auspicious baby rituals.", count: "130+ Venues", img: "/categories/baby-shower.png", icon: <Baby size={20} />, tag: "Baby Shower" },
  { id: 60, title: "Baby Shower Party", slug: "baby-shower-party", description: "Cute and aesthetic venues for the mom-to-be.", count: "210+ Venues", img: "/categories/baby-shower.png", icon: <PartyPopper size={20} />, tag: "Baby Shower" },
  { id: 61, title: "Gender Reveal", slug: "gender-reveal", description: "Exciting spots to share the big news.", count: "120+ Venues", img: "/categories/baby-shower.png", icon: <PartyPopper size={20} />, tag: "Baby Shower" },
  { id: 62, title: "Welcome Baby", slug: "welcome-baby", description: "Warm settings to welcome the newest family member.", count: "150+ Venues", img: "/categories/baby-shower.png", icon: <Users size={20} />, tag: "Baby Shower" },

  // 14. Engagement Ceremony
  { id: 63, title: "Ring Ceremony", slug: "ring-ceremony", description: "Stunning venues for the exchange of vows.", count: "310+ Venues", img: "/categories/wedding.png", icon: <Gem size={20} />, tag: "Engagement Ceremony" },
  { id: 64, title: "Engagement Party", slug: "engagement-party", description: "Celebratory spots for your first join step.", count: "280+ Venues", img: "/categories/wedding.png", icon: <PartyPopper size={20} />, tag: "Engagement Ceremony" },
  { id: 65, title: "Engagement Dinner", slug: "engagement-dinner", description: "Sophisticated dining halls for a family toast.", count: "220+ Venues", img: "/categories/wedding.png", icon: <Wine size={20} />, tag: "Engagement Ceremony" },

  // 15. Entertainment / Theme Parties
  { id: 66, title: "DJ Night Party", slug: "dj-night-party", description: "Pulsating clubs and vibrant dance floors.", count: "420+ Venues", img: "/categories/festival.png", icon: <Music size={20} />, tag: "Entertainment / Theme Parties" },
  { id: 67, title: "Dance Party", slug: "dance-party", description: "High-energy spaces to groove and dance.", count: "360+ Venues", img: "/categories/festival.png", icon: <Music size={20} />, tag: "Entertainment / Theme Parties" },
  { id: 68, title: "Karaoke Party", slug: "karaoke-party", description: "Fun private pods and stages to sing tonight.", count: "120+ Venues", img: "/categories/festival.png", icon: <Mic2 size={20} />, tag: "Entertainment / Theme Parties" },
  { id: 69, title: "Pool Party", slug: "pool-party", description: "Cool decks and luxury poolsides.", count: "140+ Venues", img: "/categories/festival.png", icon: <Wind size={20} />, tag: "Entertainment / Theme Parties" },
  { id: 70, title: "Costume Party", slug: "costume-party", description: "Versatile spaces to transform into any theme.", count: "110+ Venues", img: "/categories/kids.png", icon: <PartyPopper size={20} />, tag: "Entertainment / Theme Parties" },
  { id: 71, title: "Retro Theme", slug: "retro-theme", description: "Classic settings for a nostalgic trip back.", count: "130+ Venues", img: "/categories/festival.png", icon: <PartyPopper size={20} />, tag: "Entertainment / Theme Parties" },
  { id: 72, title: "Bollywood Theme", slug: "bollywood-theme", description: "Dhamaka venues for a filmy celebration.", count: "150+ Venues", img: "/categories/festival.png", icon: <Music size={20} />, tag: "Entertainment / Theme Parties" },
];

const FILTERS = [
  "All", 
  "Birthday Party",
  "Wedding Events",
  "Pre-Wedding Events",
  "Anniversary Party",
  "Corporate Events",
  "Kitty Party",
  "Family Functions",
  "Festival Parties",
  "Social Gatherings",
  "Kids Parties",
  "Bachelor / Bachelorette Party",
  "Housewarming Party",
  "Baby Shower",
  "Engagement Ceremony",
  "Entertainment / Theme Parties"
];

export default function CategoriesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    return CATEGORIES.filter(cat => {
      const matchesSearch = cat.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "All" || cat.tag === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* PREMIUM HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-pd-pink/20 rounded-full blur-[120px] mix-blend-screen opacity-50 pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-pd-blue/20 rounded-full blur-[120px] mix-blend-screen opacity-50 pointer-events-none" />
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
              Explore <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink via-purple-400 to-pd-blue">Categories</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg md:text-xl max-w-2xl mx-auto mb-12">
              From intimate family functions to grand corporate summits, discover the perfect specialized venue for your next extraordinary event.
            </p>

            {/* Glowing Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute -inset-1 bg-linear-to-r from-pd-pink via-purple-500 to-pd-blue rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500 pointer-events-none"></div>
              <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                <Search className="text-slate-400 ml-4 mr-2" size={24} />
                <input 
                  type="text" 
                  placeholder="Find your perfect venue type (e.g. Sangeet...)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-slate-500 outline-none text-base md:text-lg py-4 px-2"
                />
                <div className="bg-linear-to-r from-pd-pink to-pd-blue p-[2px] rounded-xl ml-2 shrink-0">
                  <button className="bg-slate-900 text-white px-6 py-3 rounded-[10px] font-bold tracking-wider uppercase text-xs hover:bg-transparent transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FILTER STICKY BAR */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-200 shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto scrollbar-hide snap-x">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`snap-center whitespace-nowrap px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeFilter === filter 
                ? 'bg-slate-900 text-white shadow-lg scale-105 border border-slate-800' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* PREMIUM CARDS GRID */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCategories.map((cat, i) => (
                <motion.div 
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link 
                    href={`/venues?category=${cat.slug}`} 
                    className="group block h-full bg-white rounded-[2rem] p-3 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-pd-pink/20 transition-all duration-500 hover:-translate-y-2 relative"
                  >
                    {/* Glowing gradient hover background */}
                    <div className="absolute inset-0 bg-linear-to-br from-pd-pink/5 via-transparent to-pd-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] pointer-events-none" />
                    
                    <div className="aspect-4/3 relative rounded-[1.5rem] overflow-hidden mb-5">
                      <img 
                        src={cat.img} 
                        alt={cat.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                        loading="lazy" 
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity pointer-events-none" />
                      
                      {/* Top floating pill */}
                      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm pointer-events-none">
                        {cat.tag}
                      </div>

                      {/* Bottom icon & Title */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-pd-pink flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                          {cat.icon}
                        </div>
                        <h3 className="font-black text-white text-lg leading-tight drop-shadow-md">
                          {cat.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="px-3 pb-3 relative z-10 flex flex-col h-[calc(100%-14rem)] min-h-[100px]">
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                        {cat.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">{cat.count}</span>
                        <div className="flex items-center gap-1.5 text-[11px] font-black text-pd-pink uppercase tracking-widest bg-pd-pink/10 px-3 py-1.5 rounded-full group-hover:bg-pd-pink group-hover:text-white transition-colors duration-300">
                          Explore <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {filteredCategories.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm mt-8"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-slate-300" size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No categories found</h3>
              <p className="text-slate-500 font-medium mb-8">We couldn't find any category matching "{searchQuery}"</p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
                className="bg-slate-900 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-pd-pink transition-colors shadow-lg shadow-slate-900/20"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
