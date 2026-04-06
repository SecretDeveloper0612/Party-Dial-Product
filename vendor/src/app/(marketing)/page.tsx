'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
  CircleDot
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
  { name: "Royal Palms", location: "Bangalore", text: "The real-time WhatsApp alerts are a game-changer. We respond to inquiries in minutes now.", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400" },
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
      className={`relative ${height} rounded-[32px] overflow-hidden shadow-2xl group cursor-none`}
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
  { title: 'Real-Time Alerts', type: 'alerts', desc: 'Never miss a lead. Instant WhatsApp and SMS push notifications for every query.', icon: <Zap size={24} />, accent: '#10B981', stats: '< 5s Latency', img: '/alerts-preview.png' },
  { title: 'Verified Contacts', type: 'verification', desc: 'Every inquiry is pre-qualified. We only deliver leads with high intent to book.', icon: <Phone size={24} />, accent: '#8B5CF6', stats: '99% Verified', img: '/dashboard-preview.png' },
  { title: 'Booking Calendar', type: 'calendar', desc: 'A dedicated digital space to visualize your events and availability smoothly.', icon: <Calendar size={24} />, accent: '#F59E0B', stats: 'Smart Sync', img: '/dashboard-preview.png' },
  { title: 'Smart Analytics', type: 'analytics', desc: 'Understand your market. Deep insights into conversion rates and peak traffic.', icon: <PieChart size={24} />, accent: '#3B82F6', stats: 'AI Insights', img: '/dashboard-preview.png' },
  { title: 'Elite Support', type: 'support', desc: 'Direct access to our senior partner success team whenever you need it.', icon: <Shield size={24} />, accent: '#EC4899', stats: '24/7 Priority', img: '/dashboard-preview.png' }
];

const FeatureHub = () => {
  const [selected, setSelected] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setSelected((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="h-[500px] bg-white rounded-[40px] animate-pulse" />;

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-auto lg:min-h-[500px]">
      {/* Vertical Navigation Sidebar */}
      <div className="w-full lg:w-72 flex flex-row lg:flex-col gap-2 p-2 bg-slate-50/50 rounded-[40px] border border-slate-100/50 overflow-x-auto lg:overflow-visible no-scrollbar">
        {features.map((f, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`flex flex-row lg:flex-col items-center lg:items-start gap-3 lg:gap-2 p-3 lg:p-4 rounded-[30px] text-left transition-all duration-500 flex-shrink-0 group ${
              selected === i 
                ? 'bg-white text-slate-900 shadow-xl border border-slate-100 scale-[1.02] z-10' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <div 
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${selected === i ? 'shadow-lg rotate-0' : 'rotate-3 grayscale opacity-60'}`}
              style={{ backgroundColor: selected === i ? `${f.accent}15` : 'transparent', color: selected === i ? f.accent : 'inherit' }}
            >
              {f.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-normal leading-relaxed mb-1">{f.title}</span>
              <span className={`text-[8px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block ${selected === i ? 'text-pd-pink opacity-100' : 'text-slate-400'}`}>
                 {f.stats}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Flagship Showcase Area */}
      <div className="flex-1 bg-white rounded-[24px] md:rounded-[40px] border border-slate-100/30 shadow-sm relative overflow-hidden flex flex-col justify-center p-4 sm:p-5 md:p-8 lg:p-12">
        
        {/* Animated Background Pulse */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected + 'bg'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0"
            style={{ backgroundColor: features[selected].accent }}
          ></motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex flex-col gap-4 sm:gap-6 md:gap-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <div 
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[6px] md:text-[8px] font-black uppercase tracking-widest mb-2 md:mb-4 shadow-sm border"
                style={{ backgroundColor: `${features[selected].accent}08`, color: features[selected].accent, borderColor: `${features[selected].accent}15` }}
              >
                <Zap size={8} className="md:w-2.5 md:h-2.5" /> Global Priority Performance
              </div>
              <h4 className="text-[1.1rem] sm:text-2xl md:text-5xl font-black text-[#0F172A] uppercase tracking-normal leading-snug mb-2 md:mb-4 italic">
                {features[selected].title}
              </h4>
              <p className="text-slate-500 text-[10px] sm:text-xs md:text-base font-medium leading-relaxed max-w-xl lg:mx-0 mx-auto mb-4 md:mb-6">
                {features[selected].desc}
              </p>
              <div className="flex flex-wrap gap-2 md:gap-6 justify-center lg:justify-start">
                 {['Next-Gen', 'Sync', 'Cloud Enabled'].map((tag, i) => (
                    <div key={i} className="flex items-center gap-1 md:gap-2 text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                       <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full" style={{ backgroundColor: features[selected].accent }}></div>
                       {tag}
                    </div>
                 ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative w-full group">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selected + 'infographic'}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -30 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="w-full h-full"
              >
                 <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-full min-h-[320px] md:aspect-[21/10] rounded-[20px] md:rounded-[40px] overflow-hidden bg-white/50 backdrop-blur-xl border border-white shadow-2xl p-3 md:p-10 flex flex-col"
                 >
                    {/* INFOGRAPHIC DYNAMIC CONTENT ENGINE */}
                    <div className="h-full w-full flex flex-col pt-4">
                       {features[selected].type === 'dashboard' && (
                          <div className="h-full flex flex-col">
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {[
                                   { label: 'Total Revenue', val: '₹1.2M', up: '+12%', color: '#F43F5E' },
                                   { label: 'Active Leads', val: '435', up: '+8%', color: '#10B981' },
                                   { label: 'Direct Bookings', val: '128', up: '+15%', color: '#3B82F6' },
                                   { label: 'Team Members', val: '12', up: 'Full Access', color: '#F59E0B' }
                                ].map((s, i) => (
                                   <div key={i} className="bg-white/80 p-4 rounded-2xl shadow-sm border border-slate-100">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed mb-2">{s.label}</p>
                                      <p className="text-xl font-black text-slate-900 tracking-normal">{s.val}</p>
                                   </div>
                                ))}
                             </div>
                             <div className="flex-1 bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex items-center justify-center">
                                <svg className="w-full h-40 overflow-visible" viewBox="0 0 100 40">
                                   <motion.path d="M0,35 L20,10 L40,25 L60,5 L80,20 L100,2" fill="none" stroke={features[selected].accent} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
                                   <motion.path d="M0,35 L20,30 L40,32 L60,25 L80,28 L100,10" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" />
                                </svg>
                             </div>
                          </div>
                       )}

                       {features[selected].type === 'alerts' && (
                          <div className="h-full flex flex-col items-center justify-center relative">
                             <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                <MapPin size={300} strokeWidth={0.5} />
                             </div>
                             <div className="flex flex-wrap gap-6 justify-center max-w-2xl relative z-10">
                                {[1, 2, 3].map((i) => (
                                   <motion.div 
                                      key={i}
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{ delay: i * 0.2 }}
                                      className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 min-w-[240px]"
                                   >
                                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-pulse">
                                         <MessageSquare size={20} />
                                      </div>
                                      <div>
                                         <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">New Lead Received</p>
                                         <p className="text-[9px] font-bold text-slate-400">Just now via WhatsApp</p>
                                      </div>
                                   </motion.div>
                                ))}
                             </div>
                             <motion.div 
                               animate={{ scale: [1, 1.2, 1] }} 
                               transition={{ duration: 2, repeat: Infinity }}
                               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-emerald-500/20" 
                             />
                          </div>
                       )}

                        {features[selected].type === 'verification' && (
                           <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                              <div className="bg-white/80 p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center">
                                 <div className="relative w-40 h-40 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                       <circle cx="80" cy="80" r="70" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                                       <motion.circle cx="80" cy="80" r="70" fill="none" stroke={features[selected].accent} strokeWidth="12" strokeDasharray="440" initial={{ strokeDashoffset: 440 }} animate={{ strokeDashoffset: 44 }} transition={{ duration: 2, ease: "easeOut" }} />
                                    </svg>
                                    <div className="absolute text-center">
                                       <p className="text-4xl font-black text-slate-900 leading-none">99%</p>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Trust Score</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 {['Email OTP Verified', 'Phone Number Active', 'Previous Host Ranking', 'Identity Document Valid'].map((c, i) => (
                                    <motion.div 
                                       key={i}
                                       initial={{ opacity: 0, x: 20 }}
                                       animate={{ opacity: 1, x: 0 }}
                                       transition={{ delay: i * 0.1 }}
                                       className="flex items-center gap-3 p-4 bg-white/60 rounded-2xl border border-slate-50"
                                    >
                                       <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check size={12} /></div>
                                       <span className="text-[11px] font-bold text-slate-600">{c}</span>
                                    </motion.div>
                                 ))}
                              </div>
                           </div>
                        )}

                       {features[selected].type === 'calendar' && (
                          <div className="h-full flex flex-col">
                             <div className="grid grid-cols-7 gap-2 mb-4">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => <div key={d + idx} className="text-center text-[10px] font-black text-slate-300">{d}</div>)}
                                {Array.from({ length: 28 }).map((_, i) => (
                                   <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold ${i % 5 === 0 ? 'bg-orange-500 text-white' : 'bg-slate-50 text-slate-400 opacity-40'}`}>
                                      {i + 1}
                                   </div>
                                ))}
                             </div>
                             <div className="flex-1 bg-white/80 rounded-3xl p-6 border border-slate-100 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                   <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">Upcoming Events</p>
                                   <Plus size={14} className="text-slate-400" />
                                </div>
                                {[
                                   { t: 'Wedding Anniversary', d: '12:00 PM', c: '#8B5CF6' },
                                   { t: 'Corporate Gala', d: '06:30 PM', c: '#3B82F6' }
                                ].map((ev, i) => (
                                   <div key={i} className="p-4 rounded-2xl bg-slate-50 border-l-4 border-l-orange-500 flex justify-between items-center" style={{ borderLeftColor: ev.c }}>
                                      <div>
                                         <p className="text-xs font-black text-slate-900">{ev.t}</p>
                                         <p className="text-[9px] font-bold text-slate-400">{ev.d}</p>
                                      </div>
                                      <Users size={14} className="text-slate-300" />
                                   </div>
                                ))}
                             </div>
                          </div>
                       )}

                       {features[selected].type === 'analytics' && (
                          <div className="h-full flex flex-col gap-4 md:gap-6">
                             <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                <div className="bg-white/80 p-4 md:p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center group/donut">
                                   <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-[6px] md:border-[10px] border-pd-pink relative flex items-center justify-center">
                                      <div className="absolute inset-0 rotate-45 border-[6px] md:border-[10px] border-slate-100 rounded-full border-t-transparent border-r-transparent"></div>
                                      <span className="text-[10px] md:text-sm font-black text-slate-900">84%</span>
                                   </div>
                                   <p className="mt-2 md:mt-4 text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Market Share</p>
                                </div>
                                <div className="md:col-span-2 bg-slate-100/50 rounded-3xl p-4 md:p-6 flex flex-col justify-end space-y-4">
                                   <div className="flex items-end gap-1.5 md:gap-2 h-20 md:h-32">
                                      {[40, 65, 45, 90, 55, 80, 70, 95].map((h, i) => (
                                         <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.05 }} className="flex-1 bg-blue-500/20 rounded-t-sm md:rounded-t-lg group relative">
                                            <div className="absolute inset-x-0 top-0 h-1 md:h-2 bg-blue-500 rounded-lg scale-y-0 group-hover:scale-y-100 transition-transform"></div>
                                         </motion.div>
                                      ))}
                                   </div>
                                   <div className="flex justify-between text-[7px] md:text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                                      <span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span>
                                   </div>
                                </div>
                             </div>
                             <div className="p-3 md:p-5 bg-pd-blue/5 rounded-xl md:rounded-2xl flex items-center justify-between border border-pd-blue/10">
                                <div className="flex items-center gap-2 md:gap-3">
                                   <TrendingUp size={16} className="text-pd-blue" />
                                   <span className="text-[8px] md:text-[10px] font-black text-pd-blue uppercase tracking-widest leading-none">Growth Velocity Optimized</span>
                                </div>
                                <ArrowRight size={12} className="text-pd-blue" />
                             </div>
                          </div>
                       )}

                       {features[selected].type === 'support' && (
                          <div className="h-full flex flex-col justify-end p-4">
                             <div className="space-y-4 max-w-sm ml-auto">
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-100 p-4 rounded-2xl rounded-br-none">
                                   <p className="text-xs font-bold text-slate-600 leading-relaxed">I have a question about my monthly lead limit on the Elite plan.</p>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="bg-pd-pink text-white p-4 rounded-2xl rounded-bl-none flex gap-3 shadow-xl shadow-pd-pink/20">
                                   <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Check size={12} /></div>
                                   <p className="text-xs font-bold leading-relaxed">Hi Rajesh! The Elite plan actually has zero limits on leads. You get 100% of the volume in your area!</p>
                                </motion.div>
                             </div>
                             <div className="mt-8 flex items-center gap-4 p-4 bg-white/80 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-pulse"><Clock size={20} /></div>
                                <div>
                                   <p className="text-sm font-black text-slate-800">2 min avg.</p>
                                   <p className="text-[10px] font-bold text-slate-400">Response time</p>
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                 </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/40 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default function PartnerLandingPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('auth_session')) {
      router.push('/dashboard');
    }
  }, [router]);


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
      <section className="relative py-12 md:py-16 overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="relative z-10 py-4 lg:py-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Shield size={12} className="text-pd-blue" /> Verified Partner Program
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#0F172A] leading-snug mb-8 tracking-normal italic px-1">
              Get More <span className="pd-gradient-text uppercase">Party Bookings</span> <br /> 
              for Your Venue
            </h1>
            <p className="text-base md:text-lg text-slate-500 font-medium mb-12 max-w-xl leading-relaxed">
              List your venue on PartyDial and receive verified, high-intent party inquiries from customers in your city daily.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link href="/signup" className="pd-btn-primary !text-sm !px-12 !py-4 bg-pd-red lowercase italic tracking-normal">
                list your venue
              </Link>
            </div>
            
            <div className="mt-16 flex gap-10 items-center flex-wrap">
               <div className="flex items-center gap-3">
                 <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm"><Image src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="user" width={32} height={32} /></div>)}
                 </div>
                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">Trusted by 500+ Owners</span>
               </div>
               <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">
                  {[1,2,3,4,5].map(s => <Star key={s} size={12} className="fill-pd-pink text-pd-pink" />)}
                  <span className="ml-1">4.8/5 Rating</span>
               </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="relative"
          >
             <div className="grid grid-cols-2 gap-6 origin-center">
               <div className="space-y-6">
                 <CursorZoomImage 
                   src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800" 
                   alt="Venue" 
                   height="h-56" 
                   priority 
                 />
                 <CursorZoomImage 
                   src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" 
                   alt="Party" 
                   height="h-72" 
                   priority 
                 />
               </div>
               <div className="space-y-6 pt-16">
                 <CursorZoomImage 
                   src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800" 
                   alt="Event" 
                   height="h-72" 
                   priority 
                 />
                 <CursorZoomImage 
                   src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=2000" 
                   alt="Gala" 
                   height="h-56" 
                   priority 
                 />
               </div>
             </div>

          </motion.div>
        </div>
      </section>


      {/* 5. EVENT CATEGORIES - INFINITE MOSAIC CAROUSEL */}
      <section id="categories" className="relative py-12 md:py-16 px-6 bg-slate-50 overflow-hidden">
        {/* Abstract Background Accents */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-active-blue/10 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pd-pink/10 rounded-full blur-[100px] opacity-20"></div>

        <div className="max-w-[1440px] mx-auto lg:px-12 relative z-10">
          <div className="text-center mb-16">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-pd-pink text-[11px] font-black uppercase tracking-[0.4em] mb-6">
                <Target size={12} className="fill-pd-pink/10" /> Market Segments
             </div>
             <h3 className="text-3xl md:text-5xl font-black text-[#0F172A] tracking-normal leading-snug mb-6">
                Most Popular <span className="pd-gradient-text italic">Searches</span>
             </h3>
             <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
                Connect with thousands of customers actively searching for these high-demand event types in your city every month.
             </p>
          </div>
        </div>

        {/* Infinite Carousel Container */}
        <div className="relative group/carousel">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            className="flex gap-6 w-max px-6 py-10"
            style={{ willChange: "transform" }}
          >
            {[...eventCategories, ...eventCategories].map((evt, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative w-[280px] md:w-[320px] p-8 rounded-[48px] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer flex flex-col items-center justify-center text-center group"
              >
                  {/* Background Gradient Flash */}
                  <div 
                    className="absolute inset-x-0 bottom-0 h-1.5 group-hover:h-full transition-all duration-500 opacity-10 group-hover:opacity-100" 
                    style={{ background: `linear-gradient(to top, ${evt.accent}20, transparent)` }}
                  ></div>
                  
                  <div 
                    className="w-20 h-20 rounded-[32px] flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-[10deg] shadow-lg border-2 border-slate-50 group-hover:bg-white" 
                    style={{ color: evt.accent, backgroundColor: `${evt.accent}08` }}
                  >
                    {evt.icon}
                  </div>
                  
                  <h4 className="text-lg font-black uppercase tracking-normal text-slate-900 mb-2 leading-snug">
                    {evt.name}
                  </h4>
                  
                  <div className="flex flex-col items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{evt.demand}</span>
                      <div className="px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[9px] font-black text-emerald-500 uppercase tracking-widest group-hover:bg-pd-pink group-hover:text-white group-hover:border-pd-pink transition-colors">
                        Trending Hot
                      </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={20} style={{ color: evt.accent }} />
                  </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Side Fading Edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent pointer-events-none z-20"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent pointer-events-none z-20"></div>
        </div>
      </section>

      {/* 6. MERCHANT FEATURES - COMPACT INTERACTIVE HUB */}
      <section id="features" className="relative py-12 md:py-16 px-6 bg-slate-50 overflow-hidden">
        <div className="max-w-[1440px] mx-auto lg:px-12 relative z-10">
          
          <div className="text-center mb-10">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-slate-100 text-pd-pink text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                <ShieldCheck size={12} className="fill-pd-pink/10" /> Venue Operating System
             </div>
             <h3 className="text-3xl md:text-5xl font-black text-[#0F172A] tracking-normal leading-snug py-2 mb-4">
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
      <section className="py-12 md:py-16 px-6 bg-slate-900 overflow-hidden relative">
        {/* Background visual noise */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#F43F5E15,transparent_50%)]"></div>
        
        <div className="max-w-[1440px] mx-auto lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Infographic Illustration */}
            <div className="relative aspect-[4/3] w-full max-w-2xl mx-auto order-2 lg:order-1">
               <div className="absolute inset-0 bg-pd-blue/10 rounded-full blur-[100px] animate-pulse"></div>
               
               {/* THE ENGINE HUB */}
               <div className="relative w-full h-full flex items-center justify-center">
                  <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
                     <defs>
                        <linearGradient id="engGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                           <stop offset="0%" stopColor="#F43F5E" />
                           <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                     </defs>

                     {/* Outer Ring */}
                     <motion.circle 
                        cx="200" cy="200" r="180" 
                        fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 8" 
                        className="opacity-20"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                     />

                     {/* Central Core */}
                     <motion.rect 
                        x="150" y="150" width="100" height="100" 
                        rx="24" fill="url(#engGradient)" 
                        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="shadow-2xl"
                     />
                     <Globe className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={40} style={{ x: 180, y: 180 }} />
                     
                     {/* Input Nodes (Ad Platforms) */}
                     {[
                        { name: 'Google Ads', pos: [60, 100], color: '#4285F4' },
                        { name: 'Meta / FB', pos: [340, 100], color: '#1877F2' },
                        { name: 'Instagram', pos: [200, 40], color: '#E4405F' }
                     ].map((node, i) => (
                        <g key={i}>
                           <motion.path 
                              d={`M${node.pos[0]},${node.pos[1]} Q200,${node.pos[1]} 200,150`} 
                              fill="none" stroke={node.color} strokeWidth="1.5" strokeDasharray="4 4" 
                              className="opacity-40"
                              initial={{ pathLength: 0 }}
                              whileInView={{ pathLength: 1 }}
                              transition={{ duration: 1.5, delay: i * 0.3 }}
                           />
                           <motion.circle 
                              cx={node.pos[0]} cy={node.pos[1]} r="24" fill={node.color} className="opacity-10"
                              whileHover={{ scale: 1.2 }}
                           />
                           <circle cx={node.pos[0]} cy={node.pos[1]} r="4" fill={node.color} />
                           <text x={node.pos[0]} y={node.pos[1] + 35} textAnchor="middle" className="text-[8px] font-black fill-slate-500 uppercase tracking-widest">{node.name}</text>
                        </g>
                     ))}

                     {/* Output Nodes (Partners) */}
                     {[
                        { name: 'Smart Filtering', pos: [100, 320] },
                        { name: 'Instant Delivery', pos: [300, 320] }
                     ].map((node, i) => (
                        <g key={i + 10}>
                           <motion.path 
                              d={`M200,250 Q200,${node.pos[1]} ${node.pos[0]},${node.pos[1]}`} 
                              fill="none" stroke="#10b981" strokeWidth="2" 
                              className="opacity-40"
                              initial={{ pathLength: 0 }}
                              whileInView={{ pathLength: 1 }}
                              transition={{ duration: 1.5, delay: i * 0.3 + 1 }}
                           />
                           <motion.circle 
                              cx={node.pos[0]} cy={node.pos[1]} r="24" fill="#10b981" className="opacity-20"
                              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}
                           />
                           <circle cx={node.pos[0]} cy={node.pos[1]} r="6" fill="#10b981" />
                           <text x={node.pos[0]} y={node.pos[1] + 45} textAnchor="middle" className="text-[10px] font-black fill-emerald-500 uppercase tracking-widest">{node.name}</text>
                        </g>
                     ))}
                  </svg>
               </div>
            </div>

            {/* Content Left */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-pd-pink animate-pulse"></div>
                Acquisition Engine v4.0
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white leading-snug tracking-normal mb-8 uppercase italic">
                we run <span className="pd-gradient-text not-italic">the ads</span> <br />
                you close <br />
                the revenue
              </h3>
              
              <div className="space-y-12">
                <div className="relative pl-10">
                   <div className="absolute left-0 top-0 w-6 h-6 rounded-lg bg-pd-blue/20 text-pd-blue flex items-center justify-center">
                      <Target size={14} />
                   </div>
                   <h4 className="text-white text-sm font-black uppercase tracking-widest mb-3 italic">Omnichannel Reach</h4>
                   <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
                      We invest heavily in Google Search, Meta Ads, and Local SEO to pull high-intent customers. Your venue gets discovered exactly when users are looking to book.
                   </p>
                </div>

                <div className="relative pl-10 border-l border-white/10 ml-3">
                   <div className="absolute -left-3 top-0 w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                      <ShieldCheck size={14} />
                   </div>
                   <h4 className="text-white text-sm font-black uppercase tracking-widest mb-3 italic">Elite Filtering</h4>
                   <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
                      Only verified enquiries reach you. We filter out the noise, ensuring you only spend time on customers ready to talk numbers.
                   </p>
                </div>

                <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 group hover:bg-white/[0.08] transition-colors cursor-pointer">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-pd-pink text-white flex items-center justify-center">
                         <Smartphone size={24} />
                      </div>
                      <h4 className="text-white text-lg font-black italic uppercase">Digital HQ Feature</h4>
                   </div>
                   <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-6">
                      Your listing on PartyDial acts as your professional micro-site. <br />
                      <span className="text-emerald-400 font-bold italic block my-2">Verified Review System included.</span>
                      <span className="text-emerald-400 font-bold">Exclusive Bonus:</span> Direct calls from your page go ONLY to you—never distributed to others.
                   </p>
                   <Link href="/process" className="text-[10px] font-black text-pd-pink uppercase tracking-widest group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                     Explore Full Process <ArrowRight size={12} />
                   </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. SUCCESS STORIES */}
      <section className="py-24 bg-white border-t border-slate-50 overflow-hidden">
        <div className="max-w-[1440px] mx-auto mb-16 px-6 lg:px-12 text-center">
            <h3 className="text-2xl font-black italic uppercase tracking-widest text-[#0F172A]">Real Success Stories</h3>
        </div>
        <div className="relative">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="flex gap-8 w-max px-6"
            style={{ willChange: "transform" }}
          >
             {[...successStories, ...successStories].map((t, i) => (
               <div 
                 key={i}
                 className="w-[400px] p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex-shrink-0"
               >
                  <div className="flex gap-4 items-center mb-6">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                       <Image src={t.img} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                       <div className="text-sm font-bold text-slate-900">{t.name}</div>
                       <div className="text-[10px] text-slate-400 uppercase">{t.location}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 italic">&quot;{t.text}&quot;</p>
               </div>
             ))}
          </motion.div>
          {/* Gradient Overlays */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
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
              <h3 className="text-3xl md:text-5xl font-black text-[#0F172A] leading-snug tracking-normal mb-8 uppercase italic">
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
                 <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>

                 <div className="relative w-full h-full rounded-[48px] overflow-hidden border border-slate-100/50 bg-white shadow-[0_32px_80px_-16px_rgba(15,23,42,0.1)] p-4 md:p-8 flex items-center justify-center">
                    
                    {/* Live Status Badge */}
                    <div className="absolute top-8 left-8 flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 z-30">
                       <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10B981]"></div>
                       <span className="text-[11px] font-black text-slate-800 uppercase tracking-[0.3em]">Network expansion map</span>
                    </div>

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
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                             </filter>
                          </defs>

                          {/* HUB CORE */}
                          <motion.circle 
                             cx="250" cy="180" r="140" 
                             fill="url(#mapHubGradient)" 
                             className="opacity-5"
                             initial={{ scale: 0.8, opacity: 0 }}
                             whileInView={{ scale: 1, opacity: 0.1 }}
                          />

                          {/* CONNECTIVITY BRAIN */}
                          <g className="opacity-30">
                             {[
                                { from: [250, 180], to: [150, 100], color: "#10b981" }, // Hub to Dehradun
                                { from: [250, 180], to: [320, 240], color: "#10b981" }, // Hub to Haridwar
                                { from: [250, 180], to: [400, 120], color: "#10b981" }, // Hub to Rishikesh
                                { from: [250, 180], to: [180, 480], color: "#cbd5e1" }, // Hub to Delhi
                                { from: [250, 180], to: [420, 450], color: "#cbd5e1" }, // Hub to Mumbai
                             ].map((line, i) => (
                                <motion.path
                                   key={i}
                                   d={`M250,180 C250,180 ${line.to[0]},180 ${line.to[0]},${line.to[1]}`}
                                   fill="none"
                                   stroke={line.color}
                                   strokeWidth="2"
                                   strokeDasharray="6 6"
                                   initial={{ pathLength: 0 }}
                                   whileInView={{ pathLength: 1 }}
                                   transition={{ duration: 2, delay: 1, repeat: Infinity }}
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
                                <motion.circle 
                                   cx={city.pos[0]} cy={city.pos[1]} r="10" 
                                   fill={city.color} 
                                   className="opacity-20"
                                   animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0.4, 0.2] }}
                                   transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                                />
                                <circle cx={city.pos[0]} cy={city.pos[1]} r="4" fill={city.color} filter="url(#svgGlow)" />
                                
                                <motion.g 
                                   initial={{ opacity: 0, y: 10 }}
                                   whileInView={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 1.5 + i * 0.1 }}
                                >
                                   <rect x={city.pos[0] - 60} y={city.pos[1] + 15} width="120" height="42" rx="14" fill="white" className="shadow-2xl shadow-slate-900/5" stroke="#f1f5f9" />
                                   <text x={city.pos[0]} y={city.pos[1] + 30} textAnchor="middle" className="text-[10px] font-black uppercase tracking-tight fill-slate-900 font-sans">
                                      {city.name}
                                   </text>
                                   <text x={city.pos[0]} y={city.pos[1] + 46} textAnchor="middle" className="text-[8px] font-bold uppercase tracking-widest fill-slate-400 font-sans">
                                      <tspan fill={city.val === 'LIVE' ? '#10b981' : '#94a3b8'}>{city.val}</tspan> | {city.desc}
                                   </text>
                                </motion.g>
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

      {/* 11. FAQ - PREMIUM REDESIGN */}
      <section suppressHydrationWarning className="py-12 md:py-16 px-6 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
        <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] bg-pd-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Left Column: Heading */}
            <div className="lg:col-span-5 space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-pd-blue animate-pulse"></div>
                Knowledge Base
              </div>
              <h3 className="text-3xl md:text-5xl font-black italic text-[#0F172A] tracking-normal uppercase leading-snug">
                Curious <br />
                about <span className="pd-gradient-text not-italic">growth?</span>
              </h3>
              <p className="text-slate-500 text-lg font-medium max-w-sm leading-relaxed">
                Everything you need to know about the most powerful event engine in the country.
              </p>
              
              <div className="pt-12 hidden lg:block">
                 <div className="p-8 bg-slate-900 rounded-[32px] text-white relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10">
                       <h4 className="text-sm font-black italic uppercase tracking-widest mb-4">Still have doubts?</h4>
                       <p className="text-slate-400 text-xs mb-8">Our partner success team is available 24/7 to help you dominate your city.</p>
                       <button className="px-8 py-3 bg-pd-pink text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform">Get Expert Help</button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pd-pink/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                 </div>
              </div>
            </div>

            {/* Right Column: Accordion */}
            <div className="lg:col-span-7 space-y-4">
               {[
                 { q: "How do I list my venue?", a: "Registering is easy. Fill out our partner onboarding form with your basic venue details. Our verification team reviews all applications within 24-48 hours to ensure our quality standards are met." },
                 { q: "How do I receive leads?", a: "Every inquiry is delivered instantly. We notify you via real-time WhatsApp alerts, SMS, and email. You can also view, track, and manage all your conversations through the Partner Dashboard." },
                 { q: "Can I update pricing?", a: "Yes, you have full control. Update your pricing, seasonal availability, event capacity, and high-quality photo gallery at any time through your dashboard." },
                 { q: "Is there a listing fee?", a: "We offer several ways to grow. From organic free listings with standard visibility to premium growth plans that guarantee high-intent lead volume. Contact us to find your perfect fit." }
               ].map((f, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className={`rounded-[32px] border transition-all duration-500 overflow-hidden ${activeFaq === i ? 'bg-slate-50/50 border-pd-blue/30 shadow-2xl' : 'bg-white border-slate-100 hover:border-pd-blue/20 shadow-sm'}`}
                 >
                   <button 
                     onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                     className="w-full p-8 flex items-center justify-between text-left group"
                   >
                     <div className="flex items-center gap-6">
                        <span className={`text-[10px] font-black tracking-[0.2em] transition-colors ${activeFaq === i ? 'text-pd-blue' : 'text-slate-300'}`}>0{i + 1}</span>
                        <span className={`text-lg md:text-xl font-bold tracking-normal transition-all duration-500 ${activeFaq === i ? 'text-pd-blue translate-x-1' : 'text-slate-900 group-hover:text-pd-blue group-hover:translate-x-1'}`}>{f.q}</span>
                     </div>
                     <div className={`flex-shrink-0 w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-700 ${activeFaq === i ? 'bg-[#0F172A] border-[#0F172A] text-white rotate-180' : 'bg-slate-50 border-slate-100 text-slate-400 rotate-0 group-hover:bg-pd-blue group-hover:border-pd-blue group-hover:text-white'}`}>
                        <ChevronDown size={20} strokeWidth={2.5} />
                     </div>
                   </button>

                   <AnimatePresence initial={false}>
                      {activeFaq === i && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                           className="overflow-hidden"
                         >
                           <div className="px-8 pb-10 pl-[4.5rem] lg:pl-[4.5rem]">
                              <div className="h-[2px] w-12 bg-pd-blue mb-8 rounded-full"></div>
                              <p className="text-base md:text-lg text-slate-500 leading-relaxed font-medium max-w-2xl">
                                 {f.a}
                              </p>
                              <div className="mt-8 flex gap-4">
                                 <button className="text-[10px] font-black uppercase tracking-widest text-pd-blue hover:underline">Learn More</button>
                                 <div className="w-1 h-1 rounded-full bg-slate-300 self-center"></div>
                                 <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:underline">Related Topics</button>
                              </div>
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

      {/* 12. FINAL CTA - SPLIT VISUAL SHOWCASE */}
      <section className="py-12 md:py-16 px-6 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto lg:px-12">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
             className="bg-slate-50 border border-white rounded-[64px] p-12 md:p-20 relative overflow-hidden shadow-perfect-pd flex flex-col lg:flex-row items-center gap-16"
           >
              {/* Left Content */}
              <div className="flex-1 text-left relative z-10">
                 <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-pd-blue/10 text-pd-blue text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                    <Shield size={14} /> Global Priority Partner
                 </div>
                 <h3 className="text-3xl md:text-5xl font-black italic text-[#0F172A] uppercase tracking-normal leading-snug mb-8">
                    Ready to join <br />
                    the <span className="pd-gradient-text not-italic">Leaders?</span>
                 </h3>
                 <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-xl mb-12">
                    India's most powerful venue growth engine. Stop waiting for leads and start <span className="text-pd-pink font-bold italic">commanding them.</span>
                 </p>
                 <div className="flex flex-wrap gap-6 items-center">
                    <Link href="/signup" className="px-14 py-6 bg-[#0F172A] text-white rounded-[24px] text-xs font-black uppercase tracking-[0.3em] italic hover:bg-pd-pink transition-all duration-500 shadow-2xl shadow-pd-pink/10 hover:shadow-pd-pink/30 hover:scale-105 active:scale-95">
                       List Your Venue
                    </Link>
                    <div className="flex flex-col">
                       <span className="text-xs font-black text-slate-900 leading-none">500+ Active Venues</span>
                       <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">National verification</span>
                    </div>
                 </div>
              </div>

              {/* Right Visual: Floating Success Badge */}
              <div className="flex-1 relative w-full max-w-[500px] aspect-square flex items-center justify-center">
                 <div className="absolute inset-0 bg-pd-pink/5 rounded-full blur-[100px] animate-pulse"></div>
                 
                 {/* The "Elite Achievement" Card */}
                 <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative w-80 h-[400px] bg-white rounded-[40px] shadow-strong-pd border border-white p-8 overflow-hidden group/card"
                 >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pd-blue/5 rounded-full blur-3xl group-hover/card:bg-pd-blue/10 transition-colors"></div>
                    
                    <div className="relative z-10 flex flex-col h-full justify-between">
                       <div>
                          <div className="w-14 h-14 rounded-2xl bg-pd-pink flex items-center justify-center text-white shadow-xl shadow-pd-pink/20 mb-6">
                             <TrendingUp size={28} />
                          </div>
                          <div className="text-[10px] font-black text-pd-pink uppercase tracking-widest leading-none mb-2">Verified Growth</div>
                          <div className="text-3xl font-black italic text-slate-900">140% <span className="text-sm font-bold opacity-30 not-italic">YoY</span></div>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="h-[2px] w-full bg-slate-50 overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                transition={{ duration: 2, delay: 0.5 }}
                                className="h-full bg-pd-blue"
                             ></motion.div>
                          </div>
                          <div className="flex justify-between items-end">
                             <div>
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</div>
                                <div className="text-sm font-black text-emerald-500 uppercase tracking-tight italic">Elite Tier</div>
                             </div>
                             <div className="w-12 h-12 rounded-full border-4 border-slate-50 p-1">
                                <Image src="/india-map-preview.png" alt="Region" width={40} height={40} className="rounded-full object-cover" />
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-pd-blue/5 to-transparent pointer-events-none"></div>
                 </motion.div>

                 {/* Secondary Floating Elements */}
                 <motion.div 
                    animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-10 right-0 w-40 p-4 bg-slate-900 shadow-2xl rounded-2xl border border-white/10 text-white z-20"
                 >
                    <div className="flex items-center gap-3">
                       <div className="w-6 h-6 rounded-full bg-pd-blue flex items-center justify-center"><CheckCircle2 size={12} /></div>
                       <span className="text-[9px] font-black uppercase tracking-widest">Instant Live</span>
                    </div>
                 </motion.div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* 13. REGISTRATION - SMART HUB */}
      <section id="register" suppressHydrationWarning className="py-12 md:py-16 px-6 bg-slate-50/50 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pd-blue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pd-pink/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-white rounded-[60px] p-8 md:p-16 border border-slate-100 shadow-perfect-pd relative z-10"
        >
           <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
              {/* Left Column: Benefits */}
              <div className="flex-1">
                 <div className="mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] uppercase italic leading-snug tracking-normal mb-6">
                       Start your <br />
                       <span className="pd-gradient-text not-italic">Legacy.</span>
                    </h2>
                    <p className="text-slate-500 font-medium max-w-sm">Complete this form and our partner success team will reach out within 24 hours.</p>
                 </div>

                 <div className="space-y-6">
                    {[
                       { icon: <ShieldCheck className="text-emerald-500" />, title: "Instant Verification", desc: "Fast-track onboarding for premium venues." },
                       { icon: <Zap className="text-amber-500" />, title: "Live in 24h", desc: "Get your first inquiry by this time tomorrow." },
                       { icon: <Globe className="text-blue-500" />, title: "National Footprint", desc: "Showcase your venue to a PAN India audience." }
                    ].map((item, i) => (
                       <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-4 p-4 rounded-3xl bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group"
                       >
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">{item.icon}</div>
                          <div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-[#0F172A]">{item.title}</div>
                             <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase leading-tight">{item.desc}</div>
                          </div>
                       </motion.div>
                    ))}
                 </div>
              </div>

              {/* Right Column: The Form */}
              <div className="flex-1 bg-slate-50/30 rounded-[40px] p-8 md:p-12 border border-slate-100">
                 <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Application Sent!"); }}>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">VENUE DETAILS</label>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input required className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-6 text-sm font-bold focus:border-pd-pink focus:shadow-lg focus:shadow-pd-pink/5 transition-all outline-none" placeholder="Venue Name" />
                          <input required className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-6 text-sm font-bold focus:border-pd-pink focus:shadow-lg focus:shadow-pd-pink/5 transition-all outline-none" placeholder="Owner Name" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">CONTACT INFO</label>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input required className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-6 text-sm font-bold focus:border-pd-pink focus:shadow-lg focus:shadow-pd-pink/5 transition-all outline-none" placeholder="City" />
                          <input required className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-6 text-sm font-bold focus:border-pd-pink focus:shadow-lg focus:shadow-pd-pink/5 transition-all outline-none" placeholder="Phone Number" />
                       </div>
                    </div>
                    <motion.button 
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                       className="w-full h-16 bg-pd-red text-white rounded-3xl text-sm font-black uppercase tracking-[0.4em] italic shadow-2xl shadow-pd-red/30 hover:bg-active-red transition-all"
                    >
                       Submit Application
                    </motion.button>
                    <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest mt-6">Secure Partner Verification System</p>
                 </form>
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
