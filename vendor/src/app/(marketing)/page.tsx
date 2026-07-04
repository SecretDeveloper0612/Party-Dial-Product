'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import {
   CheckCircle2,
   ArrowRight,
   Users,
   Zap,
   ChevronDown,
   Star,
   Smartphone,
   MapPin,
   Target,
   BarChart3,
   ShieldCheck,
   LayoutDashboard,
   MessageSquare,
   Building2,
   Calendar,
   Phone,
   Mail,
   PieChart,
   HelpCircle,
   Clock,
   Briefcase,
   TrendingUp,
   Globe,
   Plus,
   Check,
   ArrowUpRight,
   Shield,
   Layers,
   Image as ImageIcon,
   PartyPopper,
   Heart,
   Wine,
   Sparkles,
   Baby,
   Gem,
   UsersRound,
   CircleDot,
   Search,
   Facebook,
   Instagram
} from 'lucide-react';

// --- DATA ---

const trustedStats = [
   { label: "Venues Listed", value: 500, suffix: "+", icon: <Building2 size={16} /> },
   { label: "Party Inquiries", value: 10000, suffix: "+", icon: <Users size={16} /> },
   { label: "Cities Covered", value: 7, suffix: " Major Cities", icon: <Globe size={16} /> }
];

const howItWorks = [
   {
      title: "Register",
      desc: "Fill out your venue details in under 5 minutes. Our guided form makes the onboarding process quick and easy.",
      step: "01",
      icon: <Briefcase size={22} />,
      accent: "#E91E8C",
      tag: "Takes 5 min"
   },
   {
      title: "Build Profile",
      desc: "Showcase your venue with high-quality photos, pricing, capacity, and event types you host.",
      step: "02",
      icon: <ImageIcon size={22} />,
      accent: "#3B82F6",
      tag: "Stand Out"
   },
   {
      title: "Get Inquiries",
      desc: "Start receiving real-time, verified leads from customers actively searching for venues in your city.",
      step: "03",
      icon: <MessageSquare size={22} />,
      accent: "#10B981",
      tag: "Live Alerts"
   },
   {
      title: "Close Bookings",
      desc: "Connect with customers directly, discuss requirements, and convert inquiries into confirmed bookings.",
      step: "04",
      icon: <TrendingUp size={22} />,
      accent: "#F59E0B",
      tag: "More Revenue"
   }
];

const venueTypes = [
   { name: "Banquet Halls", icon: <Building2 size={20} />, desc: "Grand celebrations" },
   { name: "Luxury Hotels", icon: <Building2 size={20} />, desc: "Premium stays & events" },
   { name: "Restaurants", icon: <Wine size={20} />, desc: "Fine dining & parties" },
   { name: "Cafes & Bistros", icon: <Zap size={20} />, desc: "Cozy gatherings" },
   { name: "Party Lawns", icon: <Sparkles size={20} />, desc: "Outdoor festivities" },
   { name: "Resorts", icon: <Globe size={20} />, desc: "Destination events" },
   { name: "Farmhouses", icon: <Building2 size={20} />, desc: "Private getaways" },
   { name: "Rooftop Venues", icon: <Layers size={20} />, desc: "Skyline celebrations" },
   { name: "Clubs & Lounges", icon: <Zap size={20} />, desc: "Nightlife & music" },
   { name: "Community Halls", icon: <Users size={20} />, desc: "Social gatherings" },
   { name: "Marriage Gardens", icon: <Heart size={20} />, desc: "Timeless weddings" },
   { name: "Convention Centers", icon: <Building2 size={20} />, desc: "Large scale events" }
];

const eventCategories = [
   { name: "Birthdays", icon: <PartyPopper size={28} />, accent: "#F43F5E", bg: "from-rose-500/20 to-pink-500/5", demand: "2.4K+ monthly" },
   { name: "Weddings", icon: <Heart size={28} />, accent: "#8B5CF6", bg: "from-violet-500/20 to-purple-500/5", demand: "3.1K+ monthly" },
   { name: "Corporate", icon: <Building2 size={28} />, accent: "#3B82F6", bg: "from-blue-500/20 to-sky-500/5", demand: "1.8K+ monthly" },
   { name: "Anniversaries", icon: <Wine size={28} />, accent: "#F59E0B", bg: "from-amber-500/20 to-yellow-500/5", demand: "900+ monthly" },
   { name: "Pre-Wedding", icon: <Sparkles size={28} />, accent: "#EC4899", bg: "from-pink-500/20 to-rose-500/5", demand: "1.2K+ monthly" },
   { name: "Kitty Party", icon: <UsersRound size={28} />, accent: "#10B981", bg: "from-emerald-500/20 to-teal-500/5", demand: "700+ monthly" },
   { name: "Baby Shower", icon: <Baby size={28} />, accent: "#F97316", bg: "from-orange-500/20 to-amber-500/5", demand: "600+ monthly" },
   { name: "Engagement", icon: <Gem size={28} />, accent: "#06B6D4", bg: "from-cyan-500/20 to-blue-500/5", demand: "1.0K+ monthly" }
];

const successStories = [
   { name: "Grand Imperial", location: "Delhi", text: "PartyDial helped us increase weekend bookings by 35% in 6 months. Their verified lead system is top-notch.", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400" },
   { name: "The Sky Lawn", location: "Mumbai", text: "Their dashboard makes lead management effortless. We've closed more corporate events than ever before.", img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=400" },
   { name: "Royal Palms", location: "Bangalore", text: "The Real-time App Alerts are a game-changer. We respond to inquiries in minutes now.", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400" },
   { name: "City View Banquet", location: "Chandigarh", text: "Being listed as a verified partner has boosted our credibility significantly. Leads are high-intent.", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400" },
   { name: "Emerald Resort", location: "Jaipur", text: "The seasonal demand analytics helped us price our weekend slots better. Highly recommended for owners.", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400" }
];

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
   const [count, setCount] = useState(0);
   const ref = useRef(null);
   const isInView = useInView(ref, { once: true, margin: "-10px 0px" });

   useEffect(() => {
      if (isInView) {
         let startTimestamp: number | null = null;
         const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
               window.requestAnimationFrame(step);
            }
         };
         window.requestAnimationFrame(step);
      }
   }, [isInView, end, duration]);

   return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const CursorZoomImage = ({ src, alt, height, priority = false }: { src: string, alt: string, height: string, priority?: boolean }) => {
   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
   const [isHovered, setIsHovered] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);

   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      setMousePos({ x, y });
   };

   return (
      <div
         ref={containerRef}
         onMouseMove={handleMouseMove}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         className={`relative ${height} rounded-4xl overflow-hidden shadow-2xl group cursor-none`}
      >
         <motion.div
            animate={{
               scale: isHovered ? 1.25 : 1,
               x: isHovered ? (0.5 - mousePos.x) * 60 : 0,
               y: isHovered ? (0.5 - mousePos.y) * 60 : 0,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.5 }}
            className="relative w-full h-full"
         >
            <Image
               src={src}
               alt={alt}
               fill
               className="object-cover"
               priority={priority}
            />
         </motion.div>

         {/* Lens effect / Cursor follower */}
         <AnimatePresence>
            {isHovered && (
               <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                     opacity: 1,
                     scale: 1,
                     left: `${mousePos.x * 100}%`,
                     top: `${mousePos.y * 100}%`,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.5 }}
                  className="absolute w-20 h-20 border-2 border-white/40 rounded-full pointer-events-none z-30 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-[2px]"
               >
                  <div className="w-1.5 h-1.5 bg-white rounded-full shadow-lg"></div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};

const features = [
   { title: 'Smart Dashboard', type: 'dashboard', desc: 'Centralized command for lead management, revenue tracking, and venue operations.', icon: <LayoutDashboard size={24} />, accent: '#F43F5E', stats: '200% Growth', img: '/dashboard-preview.png' },
   { title: 'Real-Time Alerts', type: 'alerts', desc: 'Never miss a lead. Instant App and Email alerts for every query.', icon: <Zap size={24} />, accent: '#10B981', stats: '< 5s Latency', img: '/alerts-preview.png' },
   { title: 'Verified Contacts', type: 'verification', desc: 'Every inquiry is pre-qualified. We only deliver leads with high intent to book.', icon: <Phone size={24} />, accent: '#8B5CF6', stats: '99% Verified', img: '/dashboard-preview.png' },
   { title: 'Followups', type: 'followups', desc: 'Stay top-of-mind with automated follow-ups. Nurture leads through scheduled messages and reminders.', icon: <MessageSquare size={24} />, accent: '#3B82F6', stats: '3x Conversion', img: '/dashboard-preview.png' },
   { title: 'Elite Support', type: 'support', desc: 'Direct access to our senior partner success team whenever you need it.', icon: <Shield size={24} />, accent: '#EC4899', stats: '24/7 Priority', img: '/dashboard-preview.png' }
];

const FeatureHub = () => {
   const [selected, setSelected] = useState(0);
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
      const interval = setInterval(() => {
         setSelected((prev) => (prev + 1) % features.length);
      }, 6000);
      return () => clearInterval(interval);
   }, []);

   if (!mounted) return <div className="h-[400px] lg:h-[500px] bg-slate-900 rounded-4xl animate-pulse" />;

   return (
      <div className="relative flex flex-col p-4 md:p-6 lg:p-8 bg-[#0B0F19] rounded-4xl lg:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 min-h-[600px] lg:min-h-[500px] max-w-[1200px] mx-auto overflow-hidden group/hub">

         {/* Background Decorative Glows */}
         <div
            className="absolute inset-0 opacity-40 transition-colors duration-1000 ease-in-out z-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at center 30%, ${features[selected].accent}40 0%, transparent 60%)` }}
         ></div>

         {/* Top Horizontal Tabs (Scrollable on mobile) */}
         <div className="flex w-full gap-2 md:gap-3 relative z-10 overflow-x-auto pb-4 md:pb-6 mb-4 md:mb-2 border-b border-white/5 no-scrollbar snap-x touch-pan-x">
            {features.map((f, i) => (
               <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`flex items-center gap-2 md:gap-3 px-4 py-2 md:px-5 md:py-3 rounded-full transition-all duration-500 flex-shrink-0 relative overflow-hidden snap-start ${selected === i
                     ? 'bg-white/10 text-white shadow-lg border border-white/20 scale-100'
                     : 'bg-white/[0.02] text-slate-500 hover:text-white hover:bg-white/5 border border-transparent scale-[0.98]'
                     }`}
               >
                  {selected === i && (
                     <motion.div
                        layoutId="activeFeatureIndicatorTop"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-t-full"
                        style={{ backgroundColor: f.accent }}
                     />
                  )}
                  <div
                     className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-500 shrink-0 ${selected === i ? 'bg-white/20 text-white shadow-inner' : 'bg-transparent text-slate-500'}`}
                     style={selected === i ? { color: f.accent } : {}}
                  >
                     <div className="scale-[0.8] md:scale-100 flex items-center justify-center">
                        {f.icon}
                     </div>
                  </div>
                  <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-none ${selected === i ? 'text-white' : 'text-slate-400'}`}>{f.title}</span>
               </button>
            ))}
         </div>

         {/* Main Content Area */}
         <div className="flex-1 relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-12 mt-2 md:mt-4">

            {/* Left Side: Text and Descriptions (Below UI on mobile) */}
            <div className="w-full lg:w-1/3 flex flex-col justify-center order-2 lg:order-1 mt-4 lg:mt-0">
               <div className="h-[180px] lg:h-[260px] relative">
                  <AnimatePresence mode="wait" initial={false}>
                     <motion.div
                        key={selected}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute inset-0 flex flex-col justify-center"
                     >
                        <div
                           className="inline-flex items-center self-start gap-1.5 px-3 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-4 md:mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] border"
                           style={{ backgroundColor: `${features[selected].accent}20`, color: features[selected].accent, borderColor: `${features[selected].accent}40` }}
                        >
                           <Zap size={10} className="md:w-3 md:h-3" /> Elite Feature
                        </div>
                        <h4 className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] mb-2 md:mb-4 drop-shadow-md">
                           {features[selected].title}
                        </h4>
                        <p className="text-slate-400 md:text-slate-300 text-xs md:text-sm lg:text-base font-medium leading-relaxed mb-4 md:mb-8 max-w-sm">
                           {features[selected].desc}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-auto">
                           {['Next-Gen', 'Sync', 'Cloud Enabled'].map((tag, i) => (
                              <div key={i} className="px-2 py-1 md:px-3 md:py-1.5 bg-white/5 border border-white/10 rounded-full text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                 {tag}
                              </div>
                           ))}
                        </div>
                     </motion.div>
                  </AnimatePresence>
               </div>
            </div>

            {/* Right Side: UI Showcase (Above text on mobile) */}
            <div className="flex-1 relative w-full h-[320px] md:h-[400px] lg:h-auto order-1 lg:order-2">
               <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                     key={selected + 'infographic'}
                     initial={{ opacity: 0, scale: 0.95, y: 10 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 1.05, y: -10 }}
                     transition={{ duration: 0.4, ease: "circOut" }}
                     className="absolute inset-0 w-full h-full"
                  >
                     {/* UI Frame with Dark Mode Outer, White Mode Inner */}
                     <div className="w-full h-full rounded-3xl md:rounded-4xl bg-white/5 border border-white/10 p-1.5 md:p-3 lg:p-4 shadow-2xl flex flex-col">
                        <motion.div
                           className="relative w-full h-full rounded-[18px] md:rounded-3xl overflow-hidden bg-white shadow-inner flex flex-col"
                        >
                           {/* INFOGRAPHIC DYNAMIC CONTENT ENGINE (Unchanged pristine white UI) */}
                           <div className="h-full w-full flex flex-col p-4 md:p-6 bg-slate-50/30">
                              {features[selected].type === 'dashboard' && (
                                 <div className="h-full flex flex-col">
                                    <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
                                       {[
                                          { label: 'Total Revenue', val: '₹1.2M', up: '+12%', color: '#F43F5E' },
                                          { label: 'Active Leads', val: '435', up: '+8%', color: '#10B981' },
                                          { label: 'Direct Bookings', val: '128', up: '+15%', color: '#3B82F6' },
                                          { label: 'Team Members', val: '12', up: 'Full Access', color: '#F59E0B' }
                                       ].map((s, i) => (
                                          <div key={i} className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                                             <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed mb-0.5 md:mb-1 truncate">{s.label}</p>
                                             <p className="text-base md:text-xl font-black text-slate-900 tracking-tight">{s.val}</p>
                                             <p className="text-[7px] md:text-[8px] font-bold mt-0.5 md:mt-1 tracking-widest" style={{ color: s.color }}>{s.up}</p>
                                          </div>
                                       ))}
                                    </div>
                                    <div className="flex-1 bg-white rounded-2xl md:rounded-[20px] p-3 md:p-4 border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                                       <svg className="w-full h-24 md:h-32 overflow-visible" viewBox="0 0 100 40">
                                          <motion.path d="M0,35 L20,10 L40,25 L60,5 L80,20 L100,2" fill="none" stroke={features[selected].accent} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
                                          <motion.path d="M0,35 L20,30 L40,32 L60,25 L80,28 L100,10" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="2 2" />
                                       </svg>
                                    </div>
                                 </div>
                              )}

                              {features[selected].type === 'alerts' && (
                                 <div className="h-full flex flex-col items-center justify-center relative">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                       <MapPin size={200} className="md:w-[240px] md:h-[240px]" strokeWidth={0.5} />
                                    </div>
                                    <div className="flex flex-col gap-3 md:gap-4 justify-center w-full max-w-sm relative z-10 px-2 md:px-0">
                                       {[1, 2, 3].map((i) => (
                                          <motion.div
                                             key={i}
                                             initial={{ scale: 0.9, opacity: 0 }}
                                             animate={{ scale: 1, opacity: 1 }}
                                             transition={{ delay: i * 0.15 }}
                                             className="bg-white p-3 md:p-4 rounded-2xl md:rounded-[20px] shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center gap-3 md:gap-4 w-full"
                                          >
                                             <div className="w-8 h-8 md:w-10 md:h-10 rounded-[10px] md:rounded-[14px] bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                                <MessageSquare size={16} className="md:w-5 md:h-5" />
                                             </div>
                                             <div>
                                                <p className="text-[10px] md:text-[11px] font-black text-slate-800 uppercase tracking-tight mb-0.5">New Lead Received</p>
                                                <p className="text-[8px] md:text-[9px] font-bold text-slate-400 tracking-wide">Just now via App Alert</p>
                                             </div>
                                          </motion.div>
                                       ))}
                                    </div>
                                 </div>
                              )}

                              {features[selected].type === 'verification' && (
                                 <div className="h-full flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8 items-center justify-center">
                                    <div className="bg-white shadow-sm p-4 md:p-6 rounded-[20px] md:rounded-3xl border border-slate-100 flex flex-col items-center justify-center w-full h-[120px] md:h-full">
                                       <div className="relative w-24 h-24 md:w-40 md:h-40 flex items-center justify-center">
                                          <svg className="w-full h-full -rotate-90 drop-shadow-md md:drop-shadow-xl" viewBox="0 0 144 144">
                                             <circle cx="72" cy="72" r="60" fill="none" stroke="#F1F5F9" strokeWidth="8" className="md:stroke-[12px]" />
                                             <motion.circle cx="72" cy="72" r="60" fill="none" stroke={features[selected].accent} strokeWidth="8" className="md:stroke-[12px]" strokeDasharray="377" initial={{ strokeDashoffset: 377 }} animate={{ strokeDashoffset: 37 }} transition={{ duration: 2, ease: "easeOut" }} strokeLinecap="round" />
                                          </svg>
                                          <div className="absolute text-center flex flex-col items-center justify-center">
                                             <p className="text-2xl md:text-4xl font-black text-slate-900 leading-none">99%</p>
                                             <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 md:mt-1">Trust Score</p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="space-y-2 md:space-y-3 w-full">
                                       {['Email OTP Verified', 'Phone Number Active', 'Identity Document Valid'].map((c, i) => (
                                          <motion.div
                                             key={i}
                                             initial={{ opacity: 0, x: 20 }}
                                             animate={{ opacity: 1, x: 0 }}
                                             transition={{ delay: i * 0.1 }}
                                             className="flex items-center gap-2 md:gap-3 p-2.5 md:p-4 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100"
                                          >
                                             <div className="w-5 h-5 md:w-6 md:h-6 rounded-[6px] md:rounded-[8px] bg-emerald-500 text-white flex items-center justify-center shrink-0"><Check size={10} className="md:w-3 md:h-3" /></div>
                                             <span className="text-[9px] md:text-[11px] font-bold text-slate-700">{c}</span>
                                          </motion.div>
                                       ))}
                                    </div>
                                 </div>
                              )}

                              {features[selected].type === 'followups' && (
                                 <div className="h-full flex flex-col justify-center items-center px-2 md:px-0">
                                    <div className="w-full max-w-sm space-y-3 md:space-y-4">
                                       {[
                                          { user: 'Amit K.', status: 'Sent 1st Follow-up', time: '10m ago', icon: <Mail size={14} className="md:w-4 md:h-4" /> },
                                          { user: 'Sonal M.', status: 'Meeting Scheduled', time: '2h ago', icon: <Calendar size={14} className="md:w-4 md:h-4" /> },
                                          { user: 'Rahul S.', status: 'Booking Confirmed', time: '5h ago', icon: <CheckCircle2 size={14} className="md:w-4 md:h-4" /> }
                                       ].map((f, i) => (
                                          <motion.div
                                             key={i}
                                             initial={{ opacity: 0, x: -20 }}
                                             animate={{ opacity: 1, x: 0 }}
                                             transition={{ delay: i * 0.2 }}
                                             className="bg-white p-3 md:p-4 rounded-2xl md:rounded-[20px] shadow-sm border border-slate-100 flex items-center justify-between"
                                          >
                                             <div className="flex items-center gap-3 md:gap-4">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-[10px] md:rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                   <Users size={16} className="md:w-5 md:h-5" />
                                                </div>
                                                <div>
                                                   <p className="text-xs md:text-sm font-black text-slate-900">{f.user}</p>
                                                   <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{f.status}</p>
                                                </div>
                                             </div>
                                             <div className="text-right flex flex-col items-end">
                                                <p className="text-[8px] md:text-[9px] font-black text-pd-blue mb-1 md:mb-1.5">{f.time}</p>
                                                <div className="text-pd-blue bg-pd-blue/10 p-1 md:p-1.5 rounded-[8px] md:rounded-[10px]">{f.icon}</div>
                                             </div>
                                          </motion.div>
                                       ))}
                                    </div>
                                 </div>
                              )}

                              {features[selected].type === 'support' && (
                                 <div className="h-full flex flex-col justify-end p-0 sm:p-2 lg:p-4 pb-2 sm:pb-4">
                                    <div className="space-y-2 sm:space-y-4 max-w-[240px] md:max-w-[260px] sm:max-w-sm ml-auto">
                                       <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-[20px] rounded-br-sm border border-slate-100 shadow-sm">
                                          <p className="text-[9px] md:text-[10px] sm:text-xs font-bold text-slate-600 leading-relaxed">I have a question about my monthly lead limit on the Elite plan.</p>
                                       </motion.div>
                                       <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="bg-pd-pink text-white p-3 sm:p-4 rounded-2xl sm:rounded-[20px] rounded-bl-sm flex gap-2 sm:gap-3 shadow-xl shadow-pd-pink/20">
                                          <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5"><Check size={8} className="sm:hidden" /><Check size={12} className="hidden sm:block" /></div>
                                          <p className="text-[9px] md:text-[10px] sm:text-xs font-bold leading-relaxed">Hi! The Elite plan actually has zero limits on leads. You get 100% of the volume!</p>
                                       </motion.div>
                                    </div>
                                    <div className="mt-4 sm:mt-8 flex items-center gap-3 sm:gap-4 p-2.5 md:p-3 sm:p-4 bg-white rounded-2xl sm:rounded-[20px] border border-slate-100 shadow-sm w-max max-w-full">
                                       <div className="w-7 h-7 md:w-8 md:h-8 sm:w-10 sm:h-10 rounded-[8px] md:rounded-[10px] sm:rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-pulse shrink-0"><Clock size={14} className="sm:hidden" /><Clock size={20} className="hidden sm:block" /></div>
                                       <div>
                                          <p className="text-[11px] md:text-xs sm:text-sm font-black text-slate-800 leading-none sm:leading-normal">2 min avg.</p>
                                          <p className="text-[7px] md:text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 md:mt-0.5">Response time</p>
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </motion.div>
                     </div>
                  </motion.div>
               </AnimatePresence>
            </div>
         </div>
      </div>
   );
};

export default function PartnerLandingPage() {
   const router = useRouter();
   const [activeFaq, setActiveFaq] = useState<number | null>(null);
   const [showSticky, setShowSticky] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         setShowSticky(window.scrollY > 400);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   return (
      <div suppressHydrationWarning className="bg-slate-50 min-h-screen text-slate-800 selection:bg-pd-pink selection:text-white">

         {/* 1. HERO SECTION */}
         <section className="relative min-h-[90vh] flex items-center py-20 lg:py-0 overflow-hidden bg-white border-b border-slate-100">
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
               <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} 
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
                  className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full pointer-events-none bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-pd-pink/40 to-transparent"
               ></motion.div>
               <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
                  className="absolute left-1/2 right-0 bottom-0 -z-10 m-auto h-[400px] w-[400px] rounded-full pointer-events-none bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-pd-blue/40 to-transparent"
               ></motion.div>
            </div>

            <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-10">
               {/* Left Side: Information */}
               <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="relative py-4 lg:py-6"
               >
                  <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.2, duration: 0.5 }}
                     className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8"
                  >
                     <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                     <span className="text-xs font-semibold text-slate-700 tracking-wide">New: Verified Partner Program</span>
                     <ArrowRight size={14} className="text-slate-400" />
                  </motion.div>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#0F172A] tracking-tight uppercase leading-[1.1] mb-6">
                     Scale Your Venue's <br />
                     <span className="relative inline-block mt-2">
                        <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-pd-pink via-purple-500 to-pd-blue">
                           Party Bookings
                        </span>
                        <span className="absolute -bottom-2 left-0 w-full h-3 bg-pd-pink/10 -z-0 rounded-full blur-sm"></span>
                     </span>
                  </h1>

                  <p className="text-lg md:text-xl text-slate-500 font-medium mb-10 max-w-lg leading-relaxed">
                     Transform empty slots into guaranteed revenue. Connect with thousands of verified, high-intent customers actively searching for venues in your city.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                     <Link href="/signup">
                        <motion.button
                           whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(233,30,140,0.3)" }}
                           whileTap={{ scale: 0.98 }}
                           className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold tracking-wide flex items-center gap-3 transition-all hover:bg-slate-800"
                        >
                           Start Receiving Leads
                           <ArrowRight size={18} />
                        </motion.button>
                     </Link>
                     <div className="flex items-center gap-4 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex -space-x-2">
                           {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><Image src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="user" width={32} height={32} /></div>)}
                        </div>
                        <div className="flex flex-col">
                           <div className="flex items-center gap-1 text-amber-400">
                              {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="fill-current" />)}
                           </div>
                           <span className="text-[10px] font-bold text-slate-500">Trusted by 500+ Owners</span>
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* Right Side: Animated Floating Images (SaaS Style) */}
               <style>{`
                  @keyframes float-y { 0%, 100% { transform: translateY(-10px); } 50% { transform: translateY(10px); } }
                  @keyframes float-r1 { 0%, 100% { transform: translateY(10px) rotate(-2deg); } 50% { transform: translateY(-15px) rotate(2deg); } }
                  @keyframes float-r2 { 0%, 100% { transform: translateY(-15px) rotate(2deg); } 50% { transform: translateY(15px) rotate(-2deg); } }
                  @keyframes pulse-s1 { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 0.8; } }
                  @keyframes pulse-s2 { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.2); opacity: 0.6; } }
               `}</style>
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="relative h-[600px] w-full hidden lg:block"
               >
                  {/* Central Image Card */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[460px] z-20">
                     <div className="w-full h-full rounded-4xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100" style={{ animation: 'float-y 6s ease-in-out infinite' }}>
                        <Image src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800" alt="Venue" fill className="object-cover" priority />
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/80 to-transparent flex items-end p-6">
                           <div className="flex items-center gap-3 w-full backdrop-blur-md bg-white/20 p-3 rounded-2xl border border-white/30">
                              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white"><CheckCircle2 size={20} /></div>
                              <div className="flex-1">
                                 <p className="text-xs font-bold text-white">New Booking Request</p>
                                 <p className="text-[10px] text-white/80">Wedding Reception • 250 Guests</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Floating Card 1 */}
                  <div
                     className="absolute top-12 left-0 w-[240px] h-[300px] rounded-3xl overflow-hidden shadow-xl border-4 border-white z-10 bg-slate-100 opacity-90"
                     style={{ animation: 'float-r1 8s ease-in-out infinite 1s' }}
                  >
                     <Image src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800" alt="Party" fill className="object-cover" />
                  </div>

                  {/* Floating Card 2 */}
                  <div
                     className="absolute bottom-12 right-0 w-[260px] h-[280px] rounded-3xl overflow-hidden shadow-xl border-4 border-white z-10 bg-slate-100"
                     style={{ animation: 'float-r2 7s ease-in-out infinite 2s' }}
                  >
                     <Image src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=800" alt="Banquet" fill className="object-cover" />
                     <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-2">
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span></span>
                        <span className="text-[10px] font-bold text-slate-800">Live Demand</span>
                     </div>
                  </div>

                  {/* Decorative Elements */}
                  <div
                     className="absolute top-1/4 right-12 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-pd-blue/40 to-transparent z-0 pointer-events-none"
                     style={{ animation: 'pulse-s1 4s ease-in-out infinite' }}
                  ></div>
                  <div
                     className="absolute bottom-1/4 left-12 w-40 h-40 -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-pd-pink/40 to-transparent z-0 pointer-events-none"
                     style={{ animation: 'pulse-s2 5s ease-in-out infinite 2s' }}
                  ></div>
               </motion.div>

               {/* Mobile Images Grid */}
               <div className="grid grid-cols-2 gap-4 lg:hidden mt-12">
                  <div className="h-48 rounded-3xl overflow-hidden relative shadow-lg"><Image src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800" alt="Venue" fill className="object-cover" /></div>
                  <div className="h-48 rounded-3xl overflow-hidden relative mt-8 shadow-lg"><Image src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800" alt="Party" fill className="object-cover" /></div>
               </div>
            </div>
         </section>


         {/* 5. EVENT CATEGORIES - INFINITE MOSAIC CAROUSEL */}
         <section id="categories" className="relative py-12 md:py-16 px-6 bg-slate-50 overflow-hidden">
            {/* Abstract Background Accents */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] opacity-20 pointer-events-none bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-active-blue/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-20 pointer-events-none bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-pd-pink/30 to-transparent"></div>

            <div className="max-w-[1440px] mx-auto lg:px-12 relative z-10">
               <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-pd-pink text-[11px] font-black uppercase tracking-[0.4em] mb-6">
                     <Target size={12} className="fill-pd-pink/10" /> Market Segments
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black text-[#0F172A] tracking-tight uppercase leading-[1.1] mb-6">
                     Most Popular <span className="pd-gradient-text italic">Searches</span>
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
                     Connect with thousands of customers actively searching for these high-demand event types in your city every month.
                  </p>
               </div>
            </div>

            {/* Swiper Carousel Container */}
            <div 
               className="relative w-full max-w-[1440px] mx-auto px-4 lg:px-12 py-10"
               style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
            >
               <style jsx global>{`
            .swiper-pagination-bullet {
              background: #cbd5e1;
              opacity: 1;
            }
            .swiper-pagination-bullet-active {
              background: #0f172a;
              width: 24px;
              border-radius: 12px;
              transition: width 0.3s ease;
            }
          `}</style>
               <Swiper
                  effect={'coverflow'}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={'auto'}
                  loop={true}
                  autoplay={{
                     delay: 2500,
                     disableOnInteraction: false,
                  }}
                  coverflowEffect={{
                     rotate: 0,
                     stretch: 0,
                     depth: 100,
                     modifier: 2.5,
                     slideShadows: false,
                  }}
                  pagination={{ clickable: true }}
                  modules={[EffectCoverflow, Pagination, Autoplay]}
                  className="w-full !pb-16"
               >
                  {eventCategories.map((evt, i) => (
                     <SwiperSlide key={i} className="!w-[280px] md:!w-[340px]">
                        <motion.div
                           whileHover={{ y: -10, scale: 1.02, boxShadow: `0 20px 40px -10px ${evt.accent}40` }}
                           className="relative p-8 rounded-[40px] bg-white border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer flex flex-col items-center justify-center text-center group h-full mx-2"
                        >
                           {/* Background Gradient Flash */}
                           <div
                              className="absolute inset-x-0 bottom-0 h-1.5 group-hover:h-full transition-all duration-500 opacity-10 group-hover:opacity-100"
                              style={{ background: `linear-gradient(to top, ${evt.accent}20, transparent)` }}
                           ></div>

                           <div
                              className="w-20 h-20 rounded-4xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-[10deg] shadow-lg border-2 border-slate-50 group-hover:bg-white"
                              style={{ color: evt.accent, backgroundColor: `${evt.accent}08` }}
                           >
                              {evt.icon}
                           </div>

                           <h4 className="text-xl font-black text-[#0F172A] tracking-tight uppercase leading-[1.1] mb-2">
                              {evt.name}
                           </h4>

                           <div className="flex flex-col items-center gap-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{evt.demand}</span>
                              <div className="px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[9px] font-black text-emerald-500 uppercase tracking-widest group-hover:bg-pd-pink group-hover:text-white group-hover:border-pd-pink transition-colors shadow-sm">
                                 Trending Hot
                              </div>
                           </div>

                           {/* Corner Accent */}
                           <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowUpRight size={20} style={{ color: evt.accent }} />
                           </div>
                        </motion.div>
                     </SwiperSlide>
                  ))}
               </Swiper>
            </div>
         </section>

         {/* 5.5 BENEFITS - WHY PARTNER WITH US */}
         <section className="py-20 md:py-32 px-6 bg-white relative overflow-hidden border-t border-slate-100">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pd-blue/5 via-white to-white pointer-events-none"></div>
            
            <div className="max-w-[1440px] mx-auto lg:px-12 relative z-10">
               <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-end mb-20">
                  <div className="flex-1">
                     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pd-blue/5 text-pd-blue text-xs font-black uppercase tracking-[0.4em] mb-6 border border-pd-blue/10">
                        <Sparkles size={14} className="animate-pulse" /> Partner Benefits
                     </div>
                     <h3 className="text-4xl md:text-6xl font-black text-[#0F172A] tracking-tight uppercase leading-[1.1]">
                        Unfair <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-blue to-pd-pink italic">Advantage</span>
                     </h3>
                  </div>
                  <div className="flex-1 md:pb-4">
                     <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed max-w-lg">
                        We don't just list your venue. We equip you with a high-performance growth engine designed to dominate your local market.
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  {[
                     {
                        title: "Zero Setup Cost",
                        desc: "Launch your verified profile instantly without any upfront investment. We only succeed when you close bookings.",
                        icon: <Building2 size={28} />,
                        iconColor: "text-blue-500",
                        gradient: "from-blue-500/5 to-cyan-500/5",
                        glow: "group-hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)]"
                     },
                     {
                        title: "Verified High-Intent Leads",
                        desc: "Say goodbye to window shoppers. Every inquiry is strictly phone-verified and actively looking for a venue.",
                        icon: <ShieldCheck size={28} />,
                        iconColor: "text-emerald-500",
                        gradient: "from-emerald-500/5 to-teal-500/5",
                        glow: "group-hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)]"
                     },
                     {
                        title: "Dedicated Success Manager",
                        desc: "Get 1-on-1 strategic support from industry experts who help optimize your listing and pricing strategy for maximum ROI.",
                        icon: <Users size={28} />,
                        iconColor: "text-purple-500",
                        gradient: "from-purple-500/5 to-pink-500/5",
                        glow: "group-hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.15)]"
                     }
                  ].map((benefit, i) => (
                     <motion.div
                        key={i}
                        whileHover={{ y: -10 }}
                        className={`group relative p-8 lg:p-10 rounded-4xl bg-slate-50 border border-slate-100 overflow-hidden transition-all duration-500 ${benefit.glow} hover:bg-white`}
                     >
                        {/* Hover Gradient Background */}
                        <div className={`absolute inset-0 bg-linear-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
                        
                        <div className="relative z-10">
                           <div className={`w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-500 ${benefit.iconColor}`}>
                              {benefit.icon}
                           </div>
                           
                           <h4 className="text-2xl font-black text-[#0F172A] tracking-tight uppercase leading-[1.1] mb-4">{benefit.title}</h4>
                           <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed transition-colors">
                              {benefit.desc}
                           </p>
                        </div>

                        {/* Decorative top right icon removed for a cleaner look */}
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>

         {/* 6. MERCHANT FEATURES - COMPACT INTERACTIVE HUB */}
         <section id="features" className="relative py-12 md:py-16 px-6 bg-slate-50 overflow-hidden">
            <div className="max-w-[1440px] mx-auto lg:px-12 relative z-10">

               <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-slate-100 text-pd-pink text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                     <ShieldCheck size={12} className="fill-pd-pink/10" /> Venue Operating System
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black text-[#0F172A] tracking-tight uppercase leading-[1.1] py-2 mb-4">
                     Elite Partner <span className="pd-gradient-text italic">Success Hub</span>
                  </h3>
               </div>

               {/* Interactive Feature Hub */}
               <div className="bg-white rounded-[48px] p-3 shadow-xl border border-slate-100/50">
                  <FeatureHub />
               </div>

            </div>
         </section>

         {/* 8.5 THE LEAD ENGINE - ACQUISITION TO REVENUE */}
         <section className="py-12 md:py-20 px-6 bg-[#030712] overflow-hidden relative border-y border-white/5">
            {/* Background Visuals - High performance gradients */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.05)_0%,transparent_60%)] pointer-events-none"></div>
            <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_60%)] pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto relative z-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                  {/* Left Content - Sleek Typography and Cards */}
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.6, ease: "easeOut" }}
                     className="order-2 lg:order-1"
                  >
                     <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-slate-300 text-[9px] font-black uppercase tracking-[0.3em] mb-4 border border-white/10 shadow-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-pd-pink animate-pulse"></div>
                        Acquisition Engine v4.0
                     </div>
                     <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-[1.1] mb-6">
                        we run <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink to-pd-blue">the ads</span> <br />
                        you close <br />
                        the revenue
                     </h3>

                     <div className="space-y-4">
                        {/* Feature Card 1 */}
                        <motion.div whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)", boxShadow: "0 10px 30px rgba(59,130,246,0.15)" }} className="relative p-5 rounded-3xl bg-white/[0.02] border border-white/[0.05] transition-colors group">
                           <div className="absolute top-5 left-5 w-8 h-8 rounded-[10px] bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Target size={16} />
                           </div>
                           <div className="pl-12">
                              <h4 className="text-white text-xs font-black uppercase tracking-widest mb-1">Omnichannel Reach</h4>
                              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                                 We invest heavily in Google Search, Meta Ads, and Local SEO to pull high-intent customers. Your venue gets discovered exactly when users are looking to book.
                              </p>
                           </div>
                        </motion.div>

                        {/* Feature Card 2 */}
                        <motion.div whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)", boxShadow: "0 10px 30px rgba(16,185,129,0.15)" }} className="relative p-5 rounded-3xl bg-white/[0.02] border border-white/[0.05] transition-colors group">
                           <div className="absolute top-5 left-5 w-8 h-8 rounded-[10px] bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <ShieldCheck size={16} />
                           </div>
                           <div className="pl-12">
                              <h4 className="text-white text-xs font-black uppercase tracking-widest mb-1">Elite Filtering</h4>
                              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                                 Only verified enquiries reach you. We filter out the noise, ensuring you only spend time on customers ready to talk numbers.
                              </p>
                           </div>
                        </motion.div>

                        {/* Highlight Card */}
                        <div className="p-5 mt-2 rounded-3xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-pd-pink/20 blur-[50px] group-hover:bg-pd-pink/30 transition-colors"></div>
                           <div className="flex items-center gap-3 mb-2 relative z-10">
                              <div className="w-6 h-6 rounded-full bg-pd-pink text-white flex items-center justify-center shadow-lg shadow-pd-pink/20">
                                 <Smartphone size={12} />
                              </div>
                              <h4 className="text-white text-xs font-black uppercase tracking-widest">Digital HQ Feature</h4>
                           </div>
                           <p className="text-slate-300 text-xs font-medium leading-relaxed mb-3 relative z-10">
                              Your listing on PartyDial acts as your professional micro-site with a <span className="text-emerald-400 font-bold">Verified Review System</span>.
                              Direct calls from your page go ONLY to you.
                           </p>
                           <Link href="/process" className="text-[9px] font-black text-white uppercase tracking-widest group-hover:translate-x-2 transition-transform inline-flex items-center gap-2 relative z-10">
                              Explore Full Process <ArrowRight size={12} className="text-pd-pink" />
                           </Link>
                        </div>
                     </div>
                  </motion.div>

                  {/* Right Content - Smooth High-Tech Data Engine Animation */}
                  <div className="relative w-full aspect-square max-w-[400px] mx-auto order-1 lg:order-2 flex items-center justify-center mt-10 lg:mt-0">
                     <style>{`
                        @keyframes map-float { 0%, 100% { transform: translateY(-8px); } 50% { transform: translateY(8px); } }
                        @keyframes scan-line { 0% { left: -100%; } 100% { left: 100%; } }
                     `}</style>

                     {/* Decorative Background Rings */}
                     <div
                        className="absolute w-[90%] h-[90%] rounded-full border border-slate-700/30 border-dashed animate-[spin_40s_linear_infinite]"
                     />
                     <div
                        className="absolute w-[65%] h-[65%] rounded-full border border-blue-500/10 animate-[spin_60s_linear_infinite_reverse]"
                     />

                     {/* Native SVG for lag-free data flow animation */}
                     <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Paths */}
                        <path id="flow-google" d="M 15 25 Q 50 25 50 50" fill="none" stroke="#334155" strokeWidth="0.2" strokeDasharray="1 1" />
                        <path id="flow-meta" d="M 50 10 L 50 50" fill="none" stroke="#334155" strokeWidth="0.2" strokeDasharray="1 1" />
                        <path id="flow-insta" d="M 85 25 Q 50 25 50 50" fill="none" stroke="#334155" strokeWidth="0.2" strokeDasharray="1 1" />
                        <path id="flow-output" d="M 50 50 L 50 90" fill="none" stroke="#059669" strokeWidth="0.4" strokeDasharray="1 1" />

                        {/* Hardware Accelerated SVG Particles */}
                        <circle r="1" fill="#3B82F6">
                           <animateMotion dur="2.2s" repeatCount="indefinite" path="M 15 25 Q 50 25 50 50" />
                        </circle>
                        <circle r="1" fill="#8B5CF6">
                           <animateMotion dur="2.8s" repeatCount="indefinite" path="M 50 10 L 50 50" />
                        </circle>
                        <circle r="1" fill="#EC4899">
                           <animateMotion dur="1.9s" repeatCount="indefinite" path="M 85 25 Q 50 25 50 50" />
                        </circle>

                        {/* Output verified leads (faster, bolder) */}
                        <circle r="1.5" fill="#10B981">
                           <animateMotion dur="1.4s" repeatCount="indefinite" path="M 50 50 L 50 90" />
                        </circle>
                        <circle r="1.5" fill="#10B981">
                           <animateMotion dur="1.4s" begin="0.7s" repeatCount="indefinite" path="M 50 50 L 50 90" />
                        </circle>
                     </svg>

                     {/* HTML Overlay Nodes */}
                     <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
                        {/* Central Hub */}
                        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 z-30">
                           <div
                              className="w-full h-full rounded-3xl bg-linear-to-br from-pd-pink via-purple-500 to-pd-blue p-[1px] shadow-[0_0_50px_rgba(139,92,246,0.3)]"
                              style={{ animation: 'map-float 5s ease-in-out infinite' }}
                           >
                              <div className="w-full h-full bg-[#030712] rounded-[23px] flex flex-col items-center justify-center relative overflow-hidden">
                                 <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent"></div>
                                 <Image src="/apple-icon.jpg" alt="PartyDial Logo" width={60} height={60} className="mb-2 relative z-10 rounded-[10px]" />
                                 <span className="text-[8px] font-black text-white tracking-widest uppercase relative z-10">PARTYDIAL</span>

                                 {/* Scanning effect */}
                                 <div
                                    className="absolute bottom-0 h-1 bg-linear-to-r from-transparent via-emerald-400 to-transparent w-[200%]"
                                    style={{ animation: 'scan-line 2s linear infinite' }}
                                 />
                              </div>
                           </div>
                        </div>

                        {/* Input Node: Google */}
                        <motion.div
                           initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                           className="absolute top-[25%] left-[15%] -translate-x-1/2 -translate-y-1/2 bg-[#0B0F19] border border-slate-700/50 p-2 rounded-2xl flex flex-col items-center shadow-lg"
                        >
                           <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1"><Search size={12} /></div>
                           <p className="text-white text-[7px] font-black uppercase tracking-widest">Google Ads</p>
                        </motion.div>

                        {/* Input Node: Meta */}
                        <motion.div
                           initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                           className="absolute top-[10%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-[#0B0F19] border border-slate-700/50 p-2 rounded-2xl flex flex-col items-center shadow-lg"
                        >
                           <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center mb-1"><Facebook size={12} /></div>
                           <p className="text-white text-[7px] font-black uppercase tracking-widest">Facebook</p>
                        </motion.div>

                        {/* Input Node: Insta */}
                        <motion.div
                           initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
                           className="absolute top-[25%] left-[85%] -translate-x-1/2 -translate-y-1/2 bg-[#0B0F19] border border-slate-700/50 p-2 rounded-2xl flex flex-col items-center shadow-lg"
                        >
                           <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mb-1"><Instagram size={12} /></div>
                           <p className="text-white text-[7px] font-black uppercase tracking-widest">Instagram</p>
                        </motion.div>

                        {/* Output Node: Verified Leads */}
                        <motion.div
                           initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
                           className="absolute top-[90%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-3xl flex flex-col items-center shadow-[0_0_30px_rgba(16,185,129,0.15)] backdrop-blur-md min-w-[140px]"
                        >
                           <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1.5 shadow-lg shadow-emerald-500/20">
                              <ShieldCheck size={16} />
                           </div>
                           <p className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">Verified Leads</p>
                           <p className="text-slate-300 text-[7px] font-bold tracking-widest uppercase">Direct to your Dashboard</p>
                        </motion.div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 9. SUCCESS STORIES */}
         <section id="stories" className="py-24 bg-slate-50 border-t border-slate-100 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/4 h-full bg-linear-to-l from-slate-50 to-transparent pointer-events-none z-10 hidden md:block" />
            <div className="absolute top-0 left-0 w-1/4 h-full bg-linear-to-r from-slate-50 to-transparent pointer-events-none z-10 hidden md:block" />

            <motion.div 
               initial={{ opacity: 0, y: 30 }} 
               whileInView={{ opacity: 1, y: 0 }} 
               viewport={{ once: true, margin: "-50px" }} 
               transition={{ duration: 0.8 }}
               className="max-w-[1440px] mx-auto mb-16 px-6 lg:px-12 text-center"
            >
               <h3 className="text-3xl md:text-5xl font-black text-[#0F172A] tracking-tight uppercase leading-[1.1] mb-4">Real Success Stories</h3>
               <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">Join hundreds of top-tier venues scaling with PartyDial</p>
            </motion.div>

            <style>{`
               .ticker-swiper .swiper-wrapper {
                  transition-timing-function: linear !important;
               }
            `}</style>

            <div className="w-full">
               <Swiper
                  slidesPerView={'auto'}
                  spaceBetween={24}
                  centeredSlides={false}
                  loop={true}
                  grabCursor={true}
                  speed={6000}
                  autoplay={{
                     delay: 0,
                     disableOnInteraction: false,
                     pauseOnMouseEnter: true,
                  }}
                  modules={[Autoplay]}
                  className="w-full !px-6 !pb-16 ticker-swiper"
               >
                  {/* Duplicate array to ensure enough slides exist for seamless linear looping */}
                  {[...successStories, ...successStories, ...successStories, ...successStories].map((t, i) => (
                     <SwiperSlide key={i} className="!w-[320px] md:!w-[420px] h-auto">
                        <div className="relative p-8 md:p-10 bg-white rounded-4xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-slate-100 h-full flex flex-col group transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden cursor-grab active:cursor-grabbing">
                           <div className="flex text-amber-400 mb-6 gap-1 relative z-10">
                              {[...Array(5)].map((_, j) => (
                                 <Star key={j} size={16} fill="currentColor" />
                              ))}
                           </div>
                           <p className="text-sm md:text-base text-slate-700 font-medium italic leading-relaxed mb-8 flex-1 relative z-10">
                              &quot;{t.text}&quot;
                           </p>
                           <div className="flex gap-4 items-center pt-6 border-t border-slate-50 relative z-10">
                              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shadow-sm">
                                 <Image src={t.img} alt={t.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                              </div>
                              <div>
                                 <div className="text-sm md:text-base font-black text-slate-900 tracking-tight">{t.name}</div>
                                 <div className="text-[10px] md:text-xs font-bold text-pd-pink uppercase tracking-widest mt-0.5">{t.location}</div>
                              </div>
                           </div>

                           {/* Quote decoration */}
                           <div className="absolute top-6 right-6 opacity-[0.03] text-slate-900 group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-500 pointer-events-none">
                              <MessageSquare size={80} fill="currentColor" />
                           </div>
                        </div>
                     </SwiperSlide>
                  ))}
               </Swiper>
            </div>
         </section>

         {/* 10. NATIONAL EXPANSION - DISCOVERY HUB */}
         <section className="relative py-12 md:py-16 px-6 overflow-hidden bg-white border-y border-slate-50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,#F43F5E08,transparent_50%)]"></div>
            <div className="max-w-[1440px] mx-auto lg:px-12 relative z-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  {/* Left Content */}
                  <motion.div
                     initial={{ opacity: 0, x: -50 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.8 }}
                  >
                     <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.4em] mb-8 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span> Live Operations: 13/13 Districts Active
                     </div>
                     <h3 className="text-3xl md:text-5xl font-black text-[#0F172A] tracking-tight uppercase leading-[1.1] mb-8">
                        dominating <br />
                        <span className="pd-gradient-text not-italic">the hills</span> <br />
                        scaling india
                     </h3>
                     <p className="text-slate-500 text-sm md:text-base font-medium max-w-sm leading-relaxed mb-12">
                        We’ve successfully digitized the entire venue ecosystem across all 13 districts of Uttarakhand. Our next phase? Activating the same elite power across India&apos;s major states.
                     </p>

                     <div className="space-y-8">
                        <div className="flex flex-col gap-4">
                           <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic flex items-center gap-2">
                              <CheckCircle2 size={12} /> Live Hubs (Uttarakhand)
                           </div>
                           <div suppressHydrationWarning className="flex flex-wrap gap-2">
                              {[
                                 "Dehradun", "Haridwar", "Rishikesh", "Mussoorie",
                                 "Nainital", "Haldwani", "Rudrapur", "Roorkee",
                                 "Kashipur", "Almora", "Pauri", "Tehri", "Chamoli",
                                 "Pithoragarh", "Uttarkashi"
                              ].map((city, i) => (
                                 <div key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 text-[9px] font-black uppercase tracking-widest shadow-sm">
                                    {city}
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="flex flex-col gap-4">
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                              <Zap size={12} className="opacity-40" /> Upcoming Expansion (Phase 02)
                           </div>
                           <div suppressHydrationWarning className="flex flex-wrap gap-2">
                              {[
                                 { s: "UP", c: "Lucknow" }, { s: "Delhi NCR", c: "Gurugram" },
                                 { s: "Maharashtra", c: "Mumbai" }, { s: "Punjab", c: "Chandigarh" },
                                 { s: "Rajasthan", c: "Jaipur" }, { s: "Gujarat", c: "Ahmedabad" }
                              ].map((state, i) => (
                                 <div key={i} className="group relative px-3 py-1.5 bg-slate-50 text-slate-400 rounded-lg border border-slate-100 text-[9px] font-black uppercase tracking-widest transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900">
                                    {state.s}
                                    <span className="inline-block ml-1 opacity-40 group-hover:opacity-100 italic">({state.c})</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>

                  {/* Right Infographic */}
                  <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.8 }}
                     className="relative lg:pl-10"
                  >
                     <div className="relative aspect-square w-full max-w-[650px] mx-auto group">
                        {/* Premium Background Glows */}
                        <div className="absolute inset-0 rounded-full animate-pulse bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-emerald-500/20 to-transparent pointer-events-none"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full pointer-events-none bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-blue-500/10 to-transparent"></div>

                        <div className="relative w-full h-full rounded-[48px] overflow-hidden border border-slate-100/50 bg-white shadow-[0_32px_80px_-16px_rgba(15,23,42,0.1)] p-4 md:p-8 flex items-center justify-center">

                           {/* Live Status Badge */}
                           <div className="absolute top-8 left-8 flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 z-30">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10B981]"></div>
                              <span className="text-[11px] font-black text-slate-800 uppercase tracking-[0.3em]">Network expansion map</span>
                           </div>

                           {/* PURE CSS ANIMATION STYLES */}
                           <style>{`
                              @keyframes map-dash {
                                 to {
                                    stroke-dashoffset: -24;
                                 }
                              }
                              .animate-map-dash {
                                 animation: map-dash 1.5s linear infinite;
                              }
                           `}</style>

                           {/* INFOGRAPHIC ENGINE */}
                           <div className="w-full h-full relative z-10 p-4">
                              <svg viewBox="0 0 500 600" className="w-full h-full drop-shadow-2xl">
                                 {/* PREMIUM DATA GRID BACKGROUND */}
                                 <g className="opacity-10">
                                    {Array.from({ length: 14 }).map((_, i) => (
                                       <line key={`h-${i}`} x1="0" y1={i * 45} x2="500" y2={i * 45} stroke="#cbd5e1" strokeWidth="0.5" />
                                    ))}
                                    {Array.from({ length: 12 }).map((_, i) => (
                                       <line key={`v-${i}`} x1={i * 45} y1="0" x2={i * 45} y2="600" stroke="#cbd5e1" strokeWidth="0.5" />
                                    ))}
                                 </g>

                                 <defs>
                                    <radialGradient id="mapHubGradient">
                                       <stop offset="0%" stopColor="#10b981" />
                                       <stop offset="100%" stopColor="transparent" />
                                    </radialGradient>
                                    <filter id="svgGlow">
                                       <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                       <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                    </filter>
                                 </defs>

                                 {/* HUB CORE (Pure CSS Pulsing) */}
                                 <circle
                                    cx="250" cy="180" r="140"
                                    fill="url(#mapHubGradient)"
                                    className="opacity-10 animate-pulse"
                                    style={{ animationDuration: '4s' }}
                                 />

                                 {/* CONNECTIVITY BRAIN (Pure CSS Flowing Lines) */}
                                 <g className="opacity-40">
                                    {[
                                       { from: [250, 180], to: [150, 100], color: "#10b981" }, // Hub to Garhwal
                                       { from: [250, 180], to: [380, 240], color: "#10b981" }, // Hub to Kumaon
                                       { from: [250, 180], to: [180, 180], color: "#10b981" }, // Hub to Dehradun
                                       { from: [250, 180], to: [130, 380], color: "#cbd5e1" }, // Hub to UP West
                                       { from: [250, 180], to: [220, 500], color: "#cbd5e1" }, // Hub to Delhi
                                       { from: [250, 180], to: [450, 480], color: "#cbd5e1" }, // Hub to Maharashtra
                                    ].map((line, i) => (
                                       <path
                                          key={i}
                                          d={`M250,180 C250,180 ${line.to[0]},180 ${line.to[0]},${line.to[1]}`}
                                          fill="none"
                                          stroke={line.color}
                                          strokeWidth="2"
                                          strokeDasharray="6 6"
                                          className="animate-map-dash"
                                       />
                                    ))}
                                 </g>

                                 {/* CITY NODES & STATUS CARDS */}
                                 {[
                                    { name: "Garhwal", pos: [120, 100], val: "LIVE", desc: "Region Hub", color: "#10B981" },
                                    { name: "Kumaon", pos: [380, 240], val: "LIVE", desc: "Active Hub", color: "#10B981" },
                                    { name: "Dehradun", pos: [180, 180], val: "LIVE", desc: "Core Hub", color: "#10B981" },
                                    { name: "UP West", pos: [130, 380], val: "UPCOMING", desc: "Phase 02", color: "#94a3b8" },
                                    { name: "Delhi", pos: [220, 500], val: "UPCOMING", desc: "Scaling", color: "#94a3b8" },
                                    { name: "Maharashtra", pos: [450, 480], val: "UPCOMING", desc: "Phase 03", color: "#94a3b8" }
                                 ].map((city, i) => (
                                    <g key={i}>
                                       {/* Pure CSS Node Ping for Live cities */}
                                       <circle
                                          cx={city.pos[0]} cy={city.pos[1]} r="10"
                                          fill={city.color}
                                          className={`opacity-30 ${city.val === 'LIVE' ? 'animate-ping' : ''}`}
                                          style={{ animationDuration: '2s' }}
                                       />
                                       <circle cx={city.pos[0]} cy={city.pos[1]} r="4" fill={city.color} filter="url(#svgGlow)" />

                                       {/* Node Labels */}
                                       <g className="transition-transform hover:-translate-y-1 cursor-default">
                                          <rect x={city.pos[0] - 60} y={city.pos[1] + 15} width="120" height="42" rx="14" fill="white" className="shadow-xl" stroke="#f1f5f9" />
                                          <text x={city.pos[0]} y={city.pos[1] + 30} textAnchor="middle" className="text-[10px] font-black uppercase tracking-tight fill-slate-900 font-sans">
                                             {city.name}
                                          </text>
                                          <text x={city.pos[0]} y={city.pos[1] + 46} textAnchor="middle" className="text-[8px] font-bold uppercase tracking-widest fill-slate-400 font-sans">
                                             <tspan fill={city.val === 'LIVE' ? '#10b981' : '#94a3b8'}>{city.val}</tspan> | {city.desc}
                                          </text>
                                       </g>
                                    </g>
                                 ))}
                              </svg>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </div>
         </section>

         {/* 11. FAQ - MILLION DOLLAR SAAS REDESIGN */}
         <section id="faq" suppressHydrationWarning className="py-20 md:py-32 px-6 bg-white relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto lg:px-6">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24">

                  {/* Left Column: Heading */}
                  <div className="lg:col-span-5 flex flex-col justify-center">
                     <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 w-max mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"></div>
                        Knowledge Base
                     </div>
                     
                     <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight uppercase leading-[1.1] mb-6">
                        CURIOUS ABOUT <span className="text-transparent bg-clip-text bg-linear-to-r from-[#F43F5E] via-[#D946EF] to-[#3B82F6]">GROWTH?</span>
                     </h3>
                     
                     <p className="text-slate-500 text-sm md:text-base font-medium max-w-[400px] leading-relaxed mb-8 lg:mb-12">
                        Everything you need to know about the most powerful event engine in the country.
                     </p>

                     <div className="hidden lg:block">
                        <div className="p-8 bg-[#16161F] rounded-3xl text-white w-full max-w-[340px] shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-white">Still have doubts?</h4>
                           <p className="text-slate-400 text-xs font-medium leading-[1.8] mb-8 pr-6">Our partner success team is available 24/7 to help you dominate your city.</p>
                           <Link href="/contact">
                              <button className="px-6 py-3.5 bg-[#FA3E63] text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#E11D48] transition-all shadow-[0_4px_20px_rgba(250,62,99,0.3)] hover:shadow-[0_8px_30px_rgba(250,62,99,0.5)] hover:-translate-y-0.5">Get Expert Help</button>
                           </Link>
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Accordion */}
                  <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
                     {[
                        { q: "How do I list my venue?", a: "Registering is easy. Fill out our partner onboarding form with your basic venue details. Our verification team reviews all applications within 24-48 hours to ensure our quality standards are met." },
                        { q: "How do I receive leads?", a: "Every inquiry is delivered instantly. We notify you via Real-time App Alerts and Email Alerts. You can also view, track, and manage all your conversations through the Partner Dashboard." },
                        { q: "Can I update pricing?", a: "Yes, you have full control. Update your pricing, seasonal availability, event capacity, and high-quality photo gallery at any time through your dashboard." },
                        { q: "Is there a listing fee?", a: "We offer several ways to grow. From organic free listings with standard visibility to premium growth plans that guarantee high-intent lead volume. Contact us to find your perfect fit." }
                     ].map((f, i) => (
                        <motion.div
                           key={i}
                           initial={{ opacity: 0, y: 10 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: i * 0.05 }}
                           className={`rounded-[20px] border transition-all duration-300 overflow-hidden ${activeFaq === i ? 'bg-white border-[#3B82F6] shadow-[0_8px_30px_rgba(59,130,246,0.12)] ring-1 ring-[#3B82F6]/20 z-10 relative' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm z-0 relative'}`}
                        >
                           <button
                              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                              className="w-full p-6 flex items-center justify-between text-left group bg-white"
                           >
                              <div className="flex items-center gap-6">
                                 <span className={`text-[9px] font-black tracking-[0.2em] transition-colors ${activeFaq === i ? 'text-[#3B82F6]' : 'text-slate-300'}`}>0{i + 1}</span>
                                 <span className={`text-sm md:text-[15px] font-[900] tracking-tight transition-colors duration-300 ${activeFaq === i ? 'text-[#0F172A]' : 'text-[#0F172A] group-hover:text-[#3B82F6]'}`}>{f.q}</span>
                              </div>
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeFaq === i ? 'bg-blue-50 text-[#3B82F6] rotate-180' : 'bg-slate-50 text-slate-400 rotate-0 group-hover:bg-slate-100'}`}>
                                 <ChevronDown size={14} strokeWidth={2.5} />
                              </div>
                           </button>

                           <AnimatePresence initial={false}>
                              {activeFaq === i && (
                                 <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="overflow-hidden bg-white"
                                 >
                                    <div className="px-6 pb-7 pl-[4.5rem]">
                                       <p className="text-[13px] md:text-sm text-slate-500 font-medium leading-[1.8] max-w-125">
                                          {f.a}
                                       </p>
                                    </div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* 12. FINAL CTA - PREMIUM DARK SHOWCASE */}
         <section className="py-12 md:py-16 px-6 bg-white overflow-hidden relative">
            <style>{`
               @keyframes float-slow {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-15px); }
               }
               .animate-float-slow {
                  animation: float-slow 6s ease-in-out infinite;
                  will-change: transform;
               }
               @keyframes float-fast {
                  0%, 100% { transform: translateY(0px) translateX(0px); }
                  50% { transform: translateY(-10px) translateX(5px); }
               }
               .animate-float-fast {
                  animation: float-fast 4s ease-in-out infinite;
                  will-change: transform;
               }
            `}</style>

            <div className="max-w-[1440px] mx-auto lg:px-12">
               <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#0F172A] border border-slate-800/50 rounded-4xl md:rounded-[40px] p-10 md:p-20 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(15,23,42,0.4)] flex flex-col lg:flex-row items-center gap-16"
               >
                  {/* Dynamic Dark Mode Background Gradients */}
                  <motion.div 
                     animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }} 
                     transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
                     className="absolute top-0 right-0 w-125 h-[500px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-pd-blue/30 to-transparent"
                  ></motion.div>
                  <motion.div 
                     animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }} 
                     transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} 
                     className="absolute bottom-0 left-0 w-125 h-[500px] rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-pd-pink/30 to-transparent"
                  ></motion.div>

                  {/* Dot Grid Overlay */}
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

                  {/* Left Content */}
                  <div className="flex-1 text-left relative z-10 w-full">
                     <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 text-white backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/10 shadow-xl">
                        <Shield size={14} className="text-emerald-400" /> Global Priority Partner
                     </div>
                     <h3 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-[1.1] mb-8">
                        Ready to join <br />
                        the <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink to-pd-blue not-italic">Leaders?</span>
                     </h3>
                     <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed max-w-xl mb-12">
                        India's most powerful venue growth engine. Stop waiting for leads and start <span className="text-white font-bold italic border-b border-pd-pink">commanding them.</span>
                     </p>
                     <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        <Link href="/signup" className="px-14 py-5 bg-white text-slate-900 rounded-[20px] text-xs font-black uppercase tracking-[0.3em] italic hover:bg-pd-pink hover:text-white transition-all duration-500 shadow-2xl shadow-white/5 hover:shadow-pd-pink/30 hover:-translate-y-1 w-full sm:w-auto text-center">
                           List Your Venue
                        </Link>
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#FBBF24" className="text-amber-400" />)}
                           </div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1"><AnimatedCounter end={500} suffix="+" /> Active Venues</span>
                        </div>
                     </div>
                  </div>

                  {/* Right Visual: Floating Success Badge (Pure CSS Animation) */}
                  <div className="flex-1 relative w-full max-w-[450px] aspect-square flex items-center justify-center mt-10 lg:mt-0">
                     <div className="absolute inset-0 rounded-full animate-pulse pointer-events-none bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-white/10 to-transparent"></div>

                     {/* The "Elite Achievement" Card */}
                     <div className="relative w-[280px] md:w-80 h-[380px] md:h-[400px] bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.3)] border border-slate-100 p-8 overflow-hidden group/card animate-float-slow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pd-blue/10 rounded-full blur-3xl group-hover/card:bg-pd-pink/10 transition-colors duration-700"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                           <div>
                              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-pd-pink to-rose-500 flex items-center justify-center text-white shadow-xl shadow-pd-pink/30 mb-6 group-hover/card:scale-110 transition-transform duration-500">
                                 <TrendingUp size={28} />
                              </div>
                              <div className="text-[10px] font-black text-pd-pink uppercase tracking-widest leading-none mb-2">Verified Growth</div>
                              <div className="text-4xl font-black italic text-slate-900"><AnimatedCounter end={140} suffix="%" /> <span className="text-sm font-bold opacity-30 not-italic uppercase tracking-widest">YoY</span></div>
                           </div>

                           <div className="space-y-4">
                              <div className="h-[3px] w-full bg-slate-100 overflow-hidden rounded-full">
                                 {/* Pure CSS Progress Bar Fill */}
                                 <div className="h-full bg-linear-to-r from-pd-blue to-pd-pink rounded-full w-[85%] relative overflow-hidden transition-all duration-1000 group-hover/card:w-[100%]">
                                    <div className="absolute top-0 left-0 w-full h-full bg-white/30 animate-[pulse_2s_ease-in-out_infinite]"></div>
                                 </div>
                              </div>
                              <div className="flex justify-between items-end">
                                 <div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</div>
                                    <div className="text-sm font-black text-emerald-500 uppercase tracking-tight italic flex items-center gap-1.5">
                                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                                       Elite Tier
                                    </div>
                                 </div>
                                 <div className="w-12 h-12 rounded-full border-[3px] border-white shadow-lg overflow-hidden group-hover/card:scale-110 transition-transform duration-500">
                                    <Image src="/india-map-preview.png" alt="Region" width={48} height={48} className="w-full h-full object-cover" />
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full h-[60%] bg-linear-to-t from-slate-50 to-transparent pointer-events-none"></div>
                     </div>

                     {/* Secondary Floating Elements (Pure CSS) */}
                     <div className="absolute -top-4 right-2 md:top-10 md:-right-6 px-4 py-3 bg-[#0F172A] shadow-2xl rounded-2xl border border-white/10 text-white z-20 animate-float-fast backdrop-blur-md">
                        <div className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full bg-pd-blue flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                              <CheckCircle2 size={12} strokeWidth={3} />
                           </div>
                           <span className="text-[9px] font-black uppercase tracking-widest">Instant Live</span>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </section>

         {/* 13. REGISTRATION - SMART HUB (PREMIUM REDESIGN) */}
         <section id="register" suppressHydrationWarning className="py-20 md:py-32 px-6 bg-slate-50 relative overflow-hidden flex justify-center">

            {/* Ambient background glows (Static for perfect performance) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-60">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-pd-blue/40 to-transparent"></div>
               <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-pd-pink/40 to-transparent"></div>
               <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-emerald-400/30 to-transparent"></div>
            </div>

            <motion.div
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="max-w-[1200px] w-full bg-white/95 rounded-3xl md:rounded-[40px] p-4 sm:p-8 md:p-16 border border-white shadow-[0_40px_100px_rgba(0,0,0,0.05)] relative z-10"
            >
               <div className="flex flex-col lg:flex-row gap-10 lg:gap-24 items-center">
                  {/* Left Column: Benefits & Copy */}
                  <div className="flex-1 w-full">
                     <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-pd-pink/10 text-pd-pink text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8 border border-pd-pink/20">
                        <span className="w-2 h-2 rounded-full bg-pd-pink animate-pulse"></span> Partner Application
                     </div>
                     <h2 className="text-4xl md:text-6xl font-black text-[#0F172A] tracking-tight uppercase leading-[1.1] mb-4 md:mb-6">
                        Start your <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink to-pd-blue not-italic">Legacy.</span>
                     </h2>
                     <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed max-w-sm mb-8 md:mb-12">
                        Join India's most exclusive venue network. Apply now and our partner success team will review your application within 24 hours.
                     </p>

                     <div className="space-y-3 md:space-y-4">
                        {[
                           { icon: <ShieldCheck size={20} className="text-emerald-500 md:w-5 md:h-5 w-4 h-4" />, title: "Instant Verification", desc: "Fast-track onboarding for premium venues." },
                           { icon: <Zap size={20} className="text-amber-500 md:w-5 md:h-5 w-4 h-4" />, title: "Live in 24h", desc: "Get your first inquiry by this time tomorrow." },
                           { icon: <Globe size={20} className="text-pd-blue md:w-5 md:h-5 w-4 h-4" />, title: "National Footprint", desc: "Showcase your venue to a PAN India audience." }
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-[20px] md:rounded-3xl bg-white/50 border border-white shadow-sm hover:shadow-md transition-all group cursor-default">
                              <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-[14px] md:rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                 {item.icon}
                              </div>
                              <div>
                                 <div className="text-[11px] md:text-xs font-black uppercase tracking-widest text-slate-900 mb-0.5 md:mb-1">{item.title}</div>
                                 <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-snug">{item.desc}</div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Right Column: The Form */}
                  <div className="flex-1 w-full max-w-125">
                     <div className="bg-white rounded-3xl md:rounded-4xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group/form">
                        {/* Static Border Glow on Form (Reveals on focus) */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-pd-blue via-pd-pink to-emerald-400 opacity-20 group-focus-within/form:opacity-100 transition-opacity duration-500"></div>

                        <form className="space-y-5 md:space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Application Sent!"); }}>

                           {/* Venue Details */}
                           <div className="space-y-3 md:space-y-4">
                              <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                                 <Building2 size={12} /> Venue Information
                              </label>
                              <div className="space-y-3">
                                 <div className="relative">
                                    <input required className="w-full h-12 md:h-14 bg-slate-50 border border-slate-100 rounded-[14px] md:rounded-2xl px-4 md:px-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-blue focus:ring-4 focus:ring-pd-blue/10 transition-all outline-none" placeholder="Venue Name" />
                                 </div>
                                 <div className="relative">
                                    <input required className="w-full h-12 md:h-14 bg-slate-50 border border-slate-100 rounded-[14px] md:rounded-2xl px-4 md:px-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-blue focus:ring-4 focus:ring-pd-blue/10 transition-all outline-none" placeholder="Owner Name" />
                                 </div>
                              </div>
                           </div>

                           {/* Contact Details */}
                           <div className="space-y-3 md:space-y-4 pt-4 border-t border-slate-100">
                              <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                                 <Phone size={12} /> Contact Details
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 <input required className="w-full h-12 md:h-14 bg-slate-50 border border-slate-100 rounded-[14px] md:rounded-2xl px-4 md:px-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none" placeholder="City" />
                                 <input required className="w-full h-12 md:h-14 bg-slate-50 border border-slate-100 rounded-[14px] md:rounded-2xl px-4 md:px-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none" placeholder="Phone" />
                              </div>
                           </div>

                           <button
                              type="submit"
                              className="w-full h-14 md:h-16 mt-2 md:mt-4 relative group/btn rounded-[14px] md:rounded-2xl overflow-hidden"
                           >
                              <div className="absolute inset-0 bg-linear-to-r from-pd-pink to-pd-red group-hover/btn:opacity-90 transition-opacity"></div>
                              <div className="relative w-full h-full flex items-center justify-center text-white text-xs md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] italic gap-2 md:gap-3 group-hover/btn:scale-[1.02] transition-transform duration-300">
                                 Submit Application <ArrowRight size={14} className="md:w-4 md:h-4" />
                              </div>
                           </button>

                           <div className="flex items-center justify-center gap-1.5 md:gap-2 pt-2">
                              <ShieldCheck size={12} className="text-emerald-500" />
                              <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">256-bit Secure Partner Verification</p>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </motion.div>
         </section>


         <AnimatePresence>
            {showSticky && (
               <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="fixed bottom-0 left-0 right-0 p-3 z-50 lg:hidden pointer-events-none"
               >
                  <Link href="/signup" className="w-full block text-center py-4 bg-pd-red text-white text-sm font-black rounded-xl shadow-2xl pointer-events-auto">
                     LIST YOUR VENUE
                  </Link>
               </motion.div>
            )}
         </AnimatePresence>

      </div>
   );
}
