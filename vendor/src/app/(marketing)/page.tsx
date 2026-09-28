'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView, useScroll, useMotionValueEvent } from 'framer-motion';
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
  ShieldCheck,
  LayoutDashboard,
  MessageSquare,
  Building2,
  Calendar,
  Phone,
  Mail,
  Clock,
  TrendingUp,
  Globe,
  Check,
  ArrowUpRight,
  Shield,
  PartyPopper,
  Heart,
  Wine,
  Sparkles,
  Baby,
  Gem,
  UsersRound,
  Search,
  Facebook,
  Instagram,
  ImageIcon,
  Gift,
  Filter,
  BadgeCheck,
  SendHorizontal,
  User,
  Flame,
  Award,
  Eye,
  Kanban,
  ReceiptIndianRupee,
  Headset,
  Settings,
  ArrowDown,
  Bell,
  BarChart3
, CalendarCheck} from 'lucide-react';

// --- DATA ---







const eventCategories = [
  { name:"Birthdays", icon: <PartyPopper size={28} />, accent:"#F43F5E", bg:"from-rose-500/20 to-pink-500/5", demand:"2.4K+ monthly"},
  { name:"Weddings", icon: <Heart size={28} />, accent:"#8B5CF6", bg:"from-violet-500/20 to-purple-500/5", demand:"3.1K+ monthly"},
  { name:"Corporate", icon: <Building2 size={28} />, accent:"#3B82F6", bg:"from-blue-500/20 to-sky-500/5", demand:"1.8K+ monthly"},
  { name:"Anniversaries", icon: <Wine size={28} />, accent:"#F59E0B", bg:"from-amber-500/20 to-yellow-500/5", demand:"900+ monthly"},
  { name:"Pre-Wedding", icon: <Sparkles size={28} />, accent:"#EC4899", bg:"from-pink-500/20 to-rose-500/5", demand:"1.2K+ monthly"},
  { name:"Kitty Party", icon: <UsersRound size={28} />, accent:"#10B981", bg:"from-emerald-500/20 to-teal-500/5", demand:"700+ monthly"},
  { name:"Baby Shower", icon: <Baby size={28} />, accent:"#F97316", bg:"from-orange-500/20 to-amber-500/5", demand:"600+ monthly"},
  { name:"Engagement", icon: <Gem size={28} />, accent:"#06B6D4", bg:"from-cyan-500/20 to-blue-500/5", demand:"1.0K+ monthly"}
];

const successStories = [
  { name:"Grand Imperial", location:"Delhi", text:"PartyDial helped us increase weekend bookings by 35% in 6 months. Their verified lead system is top-notch.", img:"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400"},
  { name:"The Sky Lawn", location:"Mumbai", text:"Their dashboard makes lead management effortless. We've closed more corporate events than ever before.", img:"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=400"},
  { name:"Royal Palms", location:"Bangalore", text:"The Real-time App Alerts are a game-changer. We respond to inquiries in minutes now.", img:"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400"},
  { name:"City View Banquet", location:"Chandigarh", text:"Being listed as a verified partner has boosted our credibility significantly. Leads are high-intent.", img:"https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400"},
  { name:"Emerald Resort", location:"Jaipur", text:"The seasonal demand analytics helped us price our weekend slots better. Highly recommended for owners.", img:"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400"}
];

const AnimatedCounter = ({ end, duration = 2000, suffix =""}: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin:"-10px 0px"});

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
   setTimeout(() => setMounted(true), 0);
   const interval = setInterval(() => {
     setSelected((prev) => (prev + 1) % features.length);
   }, 6000);
   return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="h-100 lg:h-125 bg-slate-900 rounded-4xl animate-pulse"/>;

  return (
   <div className="relative flex flex-col p-4 md:p-6 lg:p-8 bg-[#0B0F19] rounded-4xl lg:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 min-h-150 lg:min-h-125 max-w-300 mx-auto overflow-hidden group/hub">

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
         className={`flex items-center gap-2 md:gap-3 px-4 py-2 md:px-5 md:py-3 rounded-full transition-all duration-500 shrink-0 relative overflow-hidden snap-start ${selected === i
           ? 'bg-white/10 text-white shadow-lg border border-white/20 scale-100'
           : 'bg-white/2 text-slate-500 hover:text-white hover:bg-white/5 border border-transparent scale-[0.98]'
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
         <span className={`text-[10px] md:text-[11px] uppercase tracking-widest leading-none ${selected === i ? 'text-white' : 'text-slate-400'}`}>{f.title}</span>
        </button>
      ))}
     </div>

     {/* Main Content Area */}
     <div className="flex-1 relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-12 mt-2 md:mt-4">

      {/* Left Side: Text and Descriptions (Below UI on mobile) */}
      <div className="w-full lg:w-1/3 flex flex-col justify-center order-2 lg:order-1 mt-4 lg:mt-0">
        <div className="h-45 lg:h-65 relative">
         <AnimatePresence mode="wait"initial={false}>
           <motion.div
            key={selected}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease:"easeOut"}}
            className="absolute inset-0 flex flex-col justify-center"
           >
            <div
              className="inline-flex items-center self-start gap-1.5 px-3 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] uppercase tracking-widest mb-4 md:mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] border"
              style={{ backgroundColor: `${features[selected].accent}20`, color: features[selected].accent, borderColor: `${features[selected].accent}40` }}
            >
              <Zap size={10} className="md:w-3 md:h-3"/> Elite Feature
            </div>
            <h4 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-sf text-white tracking-tight leading-[1.1] mb-2 md:mb-4 drop-shadow-md">
              {features[selected].title}
            </h4>
            <p className="text-slate-400 md:text-slate-300 text-xs md:text-sm lg:text-base font-normal font-pd leading-relaxed mb-4 md:mb-8 max-w-sm">
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
      <div className="flex-1 relative w-full h-80 md:h-100 lg:h-auto order-1 lg:order-2">
        <AnimatePresence mode="wait"initial={false}>
         <motion.div
           key={selected + 'infographic'}
           initial={{ opacity: 0, scale: 0.95, y: 10 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 1.05, y: -10 }}
           transition={{ duration: 0.4, ease:"circOut"}}
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
                       <p className="text-[8px] md:text-[9px] text-slate-400 uppercase tracking-widest leading-relaxed mb-0.5 md:mb-1 truncate font-normal font-pd">{s.label}</p>
                       <p className="text-base md:text-xl text-slate-900 tracking-tight font-normal font-pd">{s.val}</p>
                       <p className="text-[7px] md:text-[8px] font-normal font-pd mt-0.5 md:mt-1 tracking-widest"style={{ color: s.color }}>{s.up}</p>
                     </div>
                    ))}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl md:rounded-[20px] p-3 md:p-4 border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                    <svg className="w-full h-24 md:h-32 overflow-visible"viewBox="0 0 100 40">
                     <motion.path d="M0,35 L20,10 L40,25 L60,5 L80,20 L100,2"fill="none"stroke={features[selected].accent} strokeWidth="3"initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
                     <motion.path d="M0,35 L20,30 L40,32 L60,25 L80,28 L100,10"fill="none"stroke="#CBD5E1"strokeWidth="1.5"strokeDasharray="2 2"/>
                    </svg>
                  </div>
                 </div>
               )}

               {features[selected].type === 'alerts' && (
                 <div className="h-full flex flex-col items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <MapPin size={200} className="md:w-60 md:h-60"strokeWidth={0.5} />
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
                        <MessageSquare size={16} className="md:w-5 md:h-5"/>
                       </div>
                       <div>
                        <p className="text-[10px] md:text-[11px] text-slate-800 uppercase tracking-tight mb-0.5 font-normal font-pd">New Lead Received</p>
                        <p className="text-[8px] md:text-[9px] font-normal font-pd text-slate-400 tracking-wide">Just now via App Alert</p>
                       </div>
                     </motion.div>
                    ))}
                  </div>
                 </div>
               )}

               {features[selected].type === 'verification' && (
                 <div className="h-full flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8 items-center justify-center">
                  <div className="bg-white shadow-sm p-4 md:p-6 rounded-[20px] md:rounded-3xl border border-slate-100 flex flex-col items-center justify-center w-full h-30 md:h-full">
                    <div className="relative w-24 h-24 md:w-40 md:h-40 flex items-center justify-center">
                     <svg className="w-full h-full -rotate-90 drop-shadow-md md:drop-shadow-xl"viewBox="0 0 144 144">
                       <circle cx="72"cy="72"r="60"fill="none"stroke="#F1F5F9"strokeWidth="8"className="md:stroke-[12px]"/>
                       <motion.circle cx="72"cy="72"r="60"fill="none"stroke={features[selected].accent} strokeWidth="8"className="md:stroke-[12px]"strokeDasharray="377"initial={{ strokeDashoffset: 377 }} animate={{ strokeDashoffset: 37 }} transition={{ duration: 2, ease:"easeOut"}} strokeLinecap="round"/>
                     </svg>
                     <div className="absolute text-center flex flex-col items-center justify-center">
                       <p className="text-2xl md:text-4xl text-slate-900 leading-none font-normal font-pd">99%</p>
                       <p className="text-[8px] md:text-[9px] text-slate-400 uppercase tracking-widest mt-0.5 md:mt-1 font-normal font-pd">Trust Score</p>
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
                       <div className="w-5 h-5 md:w-6 md:h-6 rounded-md md:rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0"><Check size={10} className="md:w-3 md:h-3"/></div>
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
                     { user: 'Amit K.', status: 'Sent 1st Follow-up', time: '10m ago', icon: <Mail size={14} className="md:w-4 md:h-4"/> },
                     { user: 'Sonal M.', status: 'Meeting Scheduled', time: '2h ago', icon: <Calendar size={14} className="md:w-4 md:h-4"/> },
                     { user: 'Rahul S.', status: 'Booking Confirmed', time: '5h ago', icon: <CheckCircle2 size={14} className="md:w-4 md:h-4"/> }
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
                          <Users size={16} className="md:w-5 md:h-5"/>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-slate-900 font-normal font-pd">{f.user}</p>
                          <p className="text-[9px] md:text-[10px] font-normal font-pd text-slate-400 uppercase tracking-widest mt-0.5">{f.status}</p>
                        </div>
                       </div>
                       <div className="text-right flex flex-col items-end">
                        <p className="text-[8px] md:text-[9px] text-pd-blue mb-1 md:mb-1.5 font-normal font-pd">{f.time}</p>
                        <div className="text-pd-blue bg-pd-blue/10 p-1 md:p-1.5 rounded-lg md:rounded-[10px]">{f.icon}</div>
                       </div>
                     </motion.div>
                    ))}
                  </div>
                 </div>
               )}

               {features[selected].type === 'support' && (
                 <div className="h-full flex flex-col justify-end p-0 sm:p-2 lg:p-4 pb-2 sm:pb-4">
                  <div className="space-y-2 sm:space-y-4 max-w-60 md:max-w-65 sm:max-w-sm ml-auto">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-[20px] rounded-br-sm border border-slate-100 shadow-sm">
                     <p className="text-[9px] md:text-[10px] sm:text-xs font-normal font-pd text-slate-600 leading-relaxed">I have a question about my monthly lead limit on the Elite plan.</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="bg-pd-pink text-white p-3 sm:p-4 rounded-2xl sm:rounded-[20px] rounded-bl-sm flex gap-2 sm:gap-3 shadow-xl shadow-pd-pink/20">
                     <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5"><Check size={8} className="sm:hidden"/><Check size={12} className="hidden sm:block"/></div>
                     <p className="text-[9px] md:text-[10px] sm:text-xs font-normal font-pd leading-relaxed">Hi! The Elite plan actually has zero limits on leads. You get 100% of the volume!</p>
                    </motion.div>
                  </div>
                  <div className="mt-4 sm:mt-8 flex items-center gap-3 sm:gap-4 p-2.5 md:p-3 sm:p-4 bg-white rounded-2xl sm:rounded-[20px] border border-slate-100 shadow-sm w-max max-w-full">
                    <div className="w-7 h-7 md:w-8 md:h-8 sm:w-10 sm:h-10 rounded-lg md:rounded-[10px] sm:rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-pulse shrink-0"><Clock size={14} className="sm:hidden"/><Clock size={20} className="hidden sm:block"/></div>
                    <div>
                     <p className="text-[11px] md:text-xs sm:text-sm text-slate-800 leading-none sm:leading-normal font-normal font-pd">2 min avg.</p>
                     <p className="text-[7px] md:text-[8px] sm:text-[10px] font-normal font-pd text-slate-400 uppercase tracking-widest mt-1 md:mt-0.5">Response time</p>
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






const GrowthJourneySection = () => {
  return (
   <section className="py-24 lg:py-32 bg-white relative overflow-clip font-pd border-b border-slate-100">
     <div className="absolute top-0 right-0 w-150 h-150 bg-linear-to-bl from-pd-pink/5 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none"/>
     <div className="absolute bottom-0 left-0 w-150 h-150 bg-linear-to-tr from-pd-blue/5 via-emerald-400/5 to-transparent rounded-full blur-3xl pointer-events-none"/>
     
     <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
      {/* Header */}
      <div className="mb-16 md:mb-20 text-center max-w-3xl mx-auto">
        <motion.div 
         initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
         className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm text-slate-600 text-[11px] font-semibold font-pd uppercase tracking-widest mb-6"
        >
         <TrendingUp size={12} className="text-pd-pink"/>
         <span>WHY PARTNER WITH PARTYDIAL</span>
        </motion.div>
        <motion.h2 
         initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
         className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[48px] font-semibold font-pd text-slate-900 tracking-tight leading-[1.12] mb-6"
        >
         More Visibility. More Enquiries. <br />
         <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink via-purple-600 to-pd-blue">More Opportunities.</span>
        </motion.h2>
        <motion.p 
         initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
         className="text-slate-600 text-sm sm:text-base lg:text-lg font-normal font-pd leading-relaxed"
        >
         Your venue deserves more than a listing. PartyDial gives you the digital tools to get discovered, manage customer enquiries, understand your performance, and turn opportunities into bookings.
        </motion.p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 auto-rows-[300px]">
        
        {/* 01: Profile (Col Span 2) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-slate-50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group hover:border-pd-pink/40 hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <div className="p-6 flex-1 flex flex-col justify-center relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-pd-pink mb-4">
              <Building2 size={20} />
            </div>
            <div className="text-[9px] font-semibold font-pd uppercase tracking-widest text-slate-400 mb-2">01 — Build Your Digital Presence</div>
            <h3 className="text-lg font-semibold font-sf text-slate-900 mb-2 group-hover:text-pd-pink transition-colors">Professional Online Identity</h3>
            <p className="text-xs font-normal font-pd text-slate-600 leading-relaxed max-w-sm">
              Create a dedicated venue profile where customers can discover your property, explore its details, and view images.
            </p>
          </div>
          {/* Light Mockup Visual */}
          <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center border-t border-slate-200/50 min-h-[140px] pt-4">
            <div className="absolute inset-0 bg-linear-to-tr from-pd-pink/10 to-transparent" />
            <motion.div 
              whileHover={{ scale: 1.05 }} transition={{ type: "spring", bounce: 0.4 }}
              className="w-[80%] h-[70%] bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col overflow-hidden relative z-10"
            >
              <div className="h-24 bg-slate-200 relative w-full">
                <div className="absolute inset-0 bg-linear-to-r from-slate-200 to-slate-100" />
              </div>
              <div className="p-4 relative">
                <div className="w-10 h-10 rounded-lg bg-white shadow-md border-4 border-white flex items-center justify-center -mt-10 mb-2 absolute">
                  <Building2 size={16} className="text-slate-400" />
                </div>
                <div className="mt-6 h-3 w-1/2 bg-slate-200 rounded-full mb-2" />
                <div className="h-2 w-1/3 bg-slate-100 rounded-full mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-pd-pink/10 rounded-full border border-pd-pink/20" />
                  <div className="h-6 w-20 bg-slate-50 rounded-full border border-slate-200" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 02: Search (Col Span 1) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="bg-slate-50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group hover:border-pd-blue/40 hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <div className="p-6 pb-0 flex flex-col relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-pd-blue mb-4">
              <Search size={20} />
            </div>
            <h3 className="text-lg font-semibold font-sf text-slate-900 mb-2 group-hover:text-pd-blue transition-colors">Get Discovered</h3>
            <p className="text-xs font-normal font-pd text-slate-600 leading-relaxed">
              Reach customers actively searching for venues based on their location and requirements.
            </p>
          </div>
          <div className="flex-1 mt-6 relative overflow-hidden bg-slate-100 flex flex-col items-center pt-6 px-6 border-t border-slate-200/50">
            <div className="w-full bg-white rounded-full px-4 py-2.5 border border-slate-200 flex items-center gap-3 mb-4 shadow-sm">
              <Search size={14} className="text-slate-400" />
              <div className="h-2 w-24 bg-slate-200 rounded-full" />
            </div>
            <div className="w-full space-y-3">
              {[1, 2].map(i => (
                <div key={i} className={`p-3 rounded-xl border flex gap-3 items-center ${i===1 ? 'bg-pd-blue/5 border-pd-blue/20 shadow-sm' : 'bg-white border-slate-200'}`}>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
                  <div className="flex-1">
                    <div className="h-2 w-2/3 bg-slate-200 rounded-full mb-1.5" />
                    <div className="h-1.5 w-1/3 bg-slate-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 03: Notifications (Col Span 1) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="bg-slate-50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <div className="p-6 pb-0 flex flex-col relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-amber-500 mb-4">
              <Bell size={20} />
            </div>
            <h3 className="text-lg font-semibold font-sf text-slate-900 mb-2 group-hover:text-amber-500 transition-colors">Generate Leads</h3>
            <p className="text-xs font-normal font-pd text-slate-600 leading-relaxed">
              Turn customer searches into qualified enquiries with important event details.
            </p>
          </div>
          <div className="flex-1 mt-6 relative overflow-hidden bg-slate-100 flex items-center justify-center p-6 border-t border-slate-200/50">
             <div className="bg-white border border-slate-200 rounded-2xl p-5 w-full shadow-lg relative group-hover:-translate-y-2 transition-transform duration-500">
               <div className="font-semibold text-slate-800 mb-2 flex items-center justify-between border-b border-slate-100 pb-3">
                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center"><Bell size={12} className="text-amber-600"/></div> 
                   <span className="text-xs">New Enquiry</span>
                 </div>
               </div>
               <div className="text-slate-500 text-[10px] space-y-2 font-medium">
                 <div className="flex justify-between"><span>Event</span> <span className="text-slate-800">Wedding</span></div>
                 <div className="flex justify-between"><span>Guests</span> <span className="text-slate-800">250 Guests</span></div>
                 <div className="flex justify-between"><span>Budget</span> <span className="text-slate-800">₹50K – ₹75K</span></div>
               </div>
             </div>
          </div>
        </motion.div>

        {/* 04: Kanban (Col Span 2) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="bg-slate-50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group hover:border-purple-500/40 hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <div className="p-6 flex-1 flex flex-col justify-center relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-purple-500 mb-4">
              <Kanban size={20} />
            </div>
            <div className="text-[9px] font-semibold font-pd uppercase tracking-widest text-slate-400 mb-2">04 — Manage Your Leads</div>
            <h3 className="text-lg font-semibold font-sf text-slate-900 mb-2 group-hover:text-purple-500 transition-colors">Keep Every Enquiry Organized</h3>
            <p className="text-xs font-normal font-pd text-slate-600 leading-relaxed max-w-sm">
              Track your customer enquiries from a single partner dashboard instead of managing scattered messages.
            </p>
          </div>
          <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center border-t border-slate-200/50 min-h-[140px] p-4 md:p-6">
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent" />
            <div className="w-full h-full flex gap-3 overflow-hidden relative z-10">
              {/* Columns */}
              {['New', 'Contacted', 'Booked'].map((stage, i) => (
                <div key={i} className="flex-1 bg-white/60 border border-slate-200 rounded-xl p-2 flex flex-col gap-2 backdrop-blur-sm shadow-sm group-hover:-translate-y-1 transition-transform duration-500 delay-[${i * 100}ms]">
                  <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">{stage}</div>
                  {i === 0 && (
                    <div className="h-12 bg-white rounded border border-slate-200 shadow-sm p-1.5 flex flex-col justify-between">
                      <div className="h-1 w-2/3 bg-slate-200 rounded" />
                      <div className="h-1 w-1/3 bg-slate-100 rounded" />
                    </div>
                  )}
                  {i === 2 && (
                    <div className="h-12 bg-emerald-50 rounded border border-emerald-100 shadow-sm p-1.5 flex flex-col justify-between">
                      <div className="h-1 w-1/2 bg-emerald-200 rounded" />
                      <div className="flex justify-between items-end">
                        <div className="h-1 w-1/4 bg-emerald-100 rounded" />
                        <CheckCircle2 size={10} className="text-emerald-500" />
                      </div>
                    </div>
                  )}
                  <div className="h-12 bg-white/50 rounded border border-slate-200 border-dashed mt-auto flex items-center justify-center">
                    <span className="text-slate-300">+</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 05: Analytics (Col Span 2) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="bg-slate-50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <div className="p-6 flex-1 flex flex-col justify-center relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-emerald-500 mb-4">
              <BarChart3 size={20} />
            </div>
            <div className="text-[9px] font-semibold font-pd uppercase tracking-widest text-slate-400 mb-2">05 — Understand Your Business</div>
            <h3 className="text-lg font-semibold font-sf text-slate-900 mb-2 group-hover:text-emerald-500 transition-colors">Turn Activity Into Insights</h3>
            <p className="text-xs font-normal font-pd text-slate-600 leading-relaxed max-w-sm">
              See how customers are interacting with your venue and understand important activity across your profile.
            </p>
          </div>
          <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-end justify-center border-t border-slate-200/50 min-h-[140px] p-4 md:p-6 pt-8">
            <div className="w-full bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-end justify-between gap-2 h-full relative group-hover:scale-105 transition-transform duration-700 origin-bottom">
              {[30, 45, 25, 60, 80, 50, 90].map((h, i) => (
                <div key={i} className="w-full flex flex-col justify-end items-center gap-1 h-full">
                  <div className={`w-full rounded-t-sm ${i === 6 ? 'bg-emerald-400' : 'bg-slate-200'}`} style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 06: Growth (Col Span 1) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
          className="bg-slate-50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group hover:border-pd-pink/40 hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <div className="p-6 pb-0 flex flex-col relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-pd-pink mb-4">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-lg font-semibold font-sf text-slate-900 mb-2 group-hover:text-pd-pink transition-colors">Create Growth</h3>
            <p className="text-xs font-normal font-pd text-slate-600 leading-relaxed">
              Turn digital interest into real-world business and bookings.
            </p>
          </div>
          <div className="flex-1 mt-6 relative overflow-hidden bg-slate-100 flex items-center justify-center p-6 border-t border-slate-200/50">
            <div className="w-32 h-32 rounded-full border-4 border-slate-200 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-4 border-pd-pink border-t-transparent border-l-transparent rotate-45 group-hover:rotate-180 transition-transform duration-1000" />
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">100%</div>
                <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Growth</div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Bottom CTA */}
      <div className="mt-16 md:mt-20 max-w-3xl mx-auto text-center bg-slate-50 p-10 rounded-3xl border border-slate-200 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-semibold font-sf text-slate-900 mb-4">Ready to Put Your Venue in Front of More Customers?</h3>
          <p className="text-slate-600 text-sm md:text-base mb-8">Join PartyDial and start building your digital presence, receiving enquiries, and creating new booking opportunities.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/register" className="w-full sm:w-auto">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto px-8 py-4 bg-[#F43F5E] hover:bg-[#e11d48] text-white rounded-2xl font-semibold font-pd text-sm shadow-xl shadow-[#F43F5E]/30 flex items-center justify-center transition-all">
                Become a PartyDial Partner →
              </motion.button>
            </Link>
            <button 
              onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-semibold font-pd text-sm border border-slate-200 shadow-sm flex items-center justify-center transition-all cursor-pointer"
            >
              Calculate Your Revenue
            </button>
          </div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Simple onboarding · Professional venue profile · Partner dashboard</p>
        </div>
      </div>
     </div>
   </section>
  );
};


const PartnerPortalSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
   { id:"01", title:"Overview", desc:"Your Business at a Glance", detail:"Track profile views, new enquiries, total bookings, and overall revenue performance in real-time.", icon: <LayoutDashboard size={20} /> },
   { id:"02", title:"Leads", desc:"Manage Every Opportunity", detail:"View, organize, and track new customer enquiries from one centralized lead dashboard.", icon: <Users size={20} /> },
   { id:"03", title:"Pipeline", desc:"Track Your Sales Funnel", detail:"Move leads through your custom pipeline stages from initial contact to successful booking.", icon: <Kanban size={20} /> },
   { id:"04", title:"Quotations", desc:"Send Professional Quotes", detail:"Create, send, and track professional quotations and pricing proposals for interested customers.", icon: <ReceiptIndianRupee size={20} /> },
   { id:"05", title:"Reviews", desc:"Manage Customer Feedback", detail:"Read, respond to, and manage customer reviews to build your venue's reputation.", icon: <Star size={20} /> },
   { id:"06", title:"Support", desc:"Get Help When You Need It", detail:"Access PartyDial partner support, helpful resources, and direct assistance for your venue.", icon: <Headset size={20} /> },
   { id:"07", title:"Settings", desc:"Configure Your Venue Profile", detail:"Manage your venue details, photos, pricing packages, availability calendar, and account settings.", icon: <Settings size={20} /> },
  ];

  return (
   <section className="py-24 lg:py-32 bg-slate-50 relative overflow-clip font-pd border-b border-slate-100">
     {/* Background Gradients */}
     <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute top-0 right-0 w-200 h-200 bg-linear-to-bl from-pd-pink/5 via-purple-500/5 to-transparent rounded-full blur-3xl"/>
      <div className="absolute bottom-0 left-0 w-150 h-150 bg-linear-to-tr from-pd-blue/5 via-emerald-400/5 to-transparent rounded-full blur-3xl"/>
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[32px_32px] opacity-50"/>
     </div>

     <div className="max-w-350 mx-auto px-6 lg:px-12 relative z-10">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-16 md:mb-20">
        <motion.div 
         initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
         className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-[11px] font-semibold font-pd uppercase tracking-widest mb-6"
        >
         <LayoutDashboard size={12} className="text-pd-blue"/>
         <span>The PartyDial Partner Portal</span>
        </motion.div>

        <motion.h2 
         initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
         className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[48px] font-semibold font-pd text-slate-900 tracking-tight leading-[1.12] mb-6"
        >
         Everything Your Venue Needs, <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-blue via-purple-600 to-pd-pink">In One Dashboard</span>
        </motion.h2>

        <motion.p 
         initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
         className="text-slate-600 text-base sm:text-lg lg:text-xl font-normal font-pd leading-relaxed max-w-3xl mx-auto"
        >
         Manage your entire venue business from a single, centralized partner platform.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        {/* Left Column: Interactive Dashboard Mockup (Sticky) */}
        <div className="lg:sticky lg:top-32 relative w-full h-150 lg:h-175 bg-white rounded-4xl border border-slate-200 shadow-2xl shadow-slate-900/5 overflow-hidden flex flex-col">
         {/* Browser/App Header */}
         <div className="h-14 bg-slate-50 border-b border-slate-100 flex items-center px-6 gap-4">
           <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
           </div>
           <div className="h-7 flex-1 bg-white rounded-md border border-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-400 font-mono tracking-widest shadow-sm">
            partner.partydial.com
           </div>
         </div>
         
         {/* Dashboard Content Area */}
         <div className="flex-1 flex overflow-hidden">
           {/* Sidebar */}
           <div className="w-16 md:w-56 bg-slate-50/50 border-r border-slate-100 p-4 flex flex-col gap-2 shrink-0">
            <div className="mb-6 px-2 hidden md:block">
              <div className="text-xs font-bold text-slate-800 mb-1">Grand Plaza Banquet</div>
              <div className="text-[9px] text-slate-400 uppercase tracking-widest">Haldwani • Active</div>
            </div>
            {features.map((f, i) => (
              <div key={i} className={`flex items-center gap-3 p-2 md:px-3 md:py-2.5 rounded-xl cursor-pointer transition-colors ${activeFeature === i ? 'bg-pd-blue/10 text-pd-blue shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'} ${i === 5 ? 'mt-auto' : ''}`} onClick={() => setActiveFeature(i)}>
               <div className="shrink-0">{f.icon}</div>
               <span className="text-[11px] font-semibold tracking-wide hidden md:block truncate">{f.title}</span>
              </div>
            ))}
           </div>
           
           {/* Main Dashboard Screen */}
           <div className="flex-1 bg-white p-6 md:p-8 overflow-y-auto relative custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
               key={activeFeature}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.3 }}
               className="w-full h-full"
              >
               {/* 0. Overview */}
               {activeFeature === 0 && (
                 <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">Dashboard Overview</h3>
                  <p className="text-xs text-slate-500 mb-6">Good Morning, Partner 👋 Here&apos;s what&apos;s happening today.</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-4 bg-white shadow-sm rounded-xl border border-slate-200">
                     <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Profile Views</div>
                     <div className="text-2xl font-bold text-slate-800 mb-1">486</div>
                     <div className="text-[10px] text-emerald-500 font-semibold">+24.8% ↗</div>
                    </div>
                    <div className="p-4 bg-white shadow-sm rounded-xl border border-slate-200">
                     <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">New Enquiries</div>
                     <div className="text-2xl font-bold text-slate-800 mb-1">28</div>
                     <div className="text-[10px] text-emerald-500 font-semibold">+18.4% ↗</div>
                    </div>
                    <div className="p-4 bg-white shadow-sm rounded-xl border border-slate-200">
                     <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Bookings</div>
                     <div className="text-2xl font-bold text-slate-800 mb-1">6</div>
                     <div className="text-[10px] text-emerald-500 font-semibold">+20.0% ↗</div>
                    </div>
                    <div className="p-4 bg-white shadow-sm rounded-xl border border-slate-200">
                     <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Revenue</div>
                     <div className="text-2xl font-bold text-slate-800 mb-1">₹1.8L</div>
                     <div className="text-[10px] text-emerald-500 font-semibold">+24.6% ↗</div>
                    </div>
                  </div>
                  <div className="w-full h-32 bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Performance Trend</div>
                    <svg className="w-full h-16"preserveAspectRatio="none"viewBox="0 0 100 100">
                     <path d="M 0 80 Q 20 70 30 50 T 60 40 T 100 20"fill="none"stroke="#2563EB"strokeWidth="3"/>
                    </svg>
                  </div>
                 </div>
               )}

               {/* 1. Leads, 2. Pipeline */}
               {(activeFeature === 1 || activeFeature === 2) && (
                 <div>
                  <div className="flex justify-between items-end mb-6">
                    <div>
                     <h3 className="text-xl font-semibold text-slate-900 mb-1">{activeFeature === 1 ? 'Recent Enquiries' : 'Sales Pipeline'}</h3>
                     <p className="text-xs text-slate-500">Track and manage your leads.</p>
                    </div>
                    <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100">2 New Leads</div>
                  </div>
                  <div className="space-y-3">
                    {['Wedding Event • 250 Pax', 'Corporate Event • 120 Pax', 'Birthday Party • 80 Pax'].map((lead, i) => (
                     <div key={i} className="p-4 bg-white shadow-sm border border-slate-200 rounded-xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><Users size={16} /></div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{lead}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Oct 18, 2026 • ₹50k-₹75k Budget</div>
                        </div>
                       </div>
                       <div className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${i === 0 ? 'bg-blue-50 text-blue-600 border border-blue-100' : i === 1 ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-pd-pink/10 text-pd-pink border border-pd-pink/20'}`}>
                        {i === 0 ? 'New' : i === 1 ? 'Contacted' : 'Interested'}
                       </div>
                     </div>
                    ))}
                  </div>
                 </div>
               )}

               {/* 3. Quotations */}
               {activeFeature === 3 && (
                 <div>
                  <div className="flex justify-between items-end mb-6">
                    <div>
                     <h3 className="text-xl font-semibold text-slate-900 mb-1">Quotations</h3>
                     <p className="text-xs text-slate-500">Manage pricing proposals.</p>
                    </div>
                    <div className="px-3 py-1.5 bg-pd-blue/10 text-pd-blue text-[10px] font-bold rounded-lg border border-pd-blue/20">Create New</div>
                  </div>
                  <div className="space-y-3">
                    {['Wedding Event • ₹1.2L', 'Corporate Meet • ₹45k'].map((quote, i) => (
                     <div key={i} className="p-4 bg-white shadow-sm border border-slate-200 rounded-xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><ReceiptIndianRupee size={16} /></div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{quote}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Sent 2 days ago</div>
                        </div>
                       </div>
                       <div className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${i === 0 ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                        {i === 0 ? 'Pending' : 'Accepted'}
                       </div>
                     </div>
                    ))}
                  </div>
                 </div>
               )}

               {/* 4. Reviews */}
               {activeFeature === 4 && (
                 <div>
                  <div className="flex justify-between items-end mb-6">
                    <div>
                     <h3 className="text-xl font-semibold text-slate-900 mb-1">Customer Reviews</h3>
                     <p className="text-xs text-slate-500">Manage your venue&apos;s reputation.</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                     <Star size={16} className="fill-current"/><Star size={16} className="fill-current"/><Star size={16} className="fill-current"/><Star size={16} className="fill-current"/><Star size={16} className="fill-current text-amber-200"/>
                     <span className="text-sm font-bold text-slate-800 ml-1">4.2</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white shadow-sm border border-slate-200 rounded-xl">
                     <div className="flex justify-between mb-2">
                       <div className="text-sm font-bold text-slate-800">Rahul Sharma</div>
                       <div className="flex text-amber-500 gap-0.5"><Star size={12} className="fill-current"/><Star size={12} className="fill-current"/><Star size={12} className="fill-current"/><Star size={12} className="fill-current"/><Star size={12} className="fill-current"/></div>
                     </div>
                     <p className="text-xs text-slate-500">&quot;Great venue for our corporate event. The staff was very helpful.&quot;</p>
                    </div>
                  </div>
                 </div>
               )}

               {/* 5. Support, 6. Settings */}
               {(activeFeature >= 5) && (
                 <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">{activeFeature === 5 ? 'Partner Support' : 'Venue Settings'}</h3>
                  <p className="text-xs text-slate-500 mb-6">{activeFeature === 5 ? 'Get help with your partner account.' : 'Manage your venue profile and packages.'}</p>
                  <div className="w-full h-40 bg-slate-100 rounded-2xl border border-slate-200 mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent animate-shimmer"/>
                    <div className="absolute bottom-4 left-4 w-16 h-16 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-300">
                     {activeFeature === 5 ? <Headset size={24} /> : <Settings size={24} />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-slate-50 rounded-xl border border-slate-100"></div>
                    <div className="h-12 bg-slate-50 rounded-xl border border-slate-100"></div>
                  </div>
                 </div>
               )}
              </motion.div>
            </AnimatePresence>

            {/* Floating Notifications */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-3 pointer-events-none z-20">
              {(activeFeature === 1 || activeFeature === 2) && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-3 bg-white rounded-xl shadow-xl border border-slate-200 flex items-center gap-3 max-w-55">
                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">🔔</div>
                 <div>
                  <div className="text-[10px] font-bold text-slate-900 leading-tight">New Enquiry</div>
                  <div className="text-[9px] text-slate-500 leading-tight">Wedding Event • 250 Guests</div>
                  <div className="text-[9px] font-semibold text-pd-blue mt-1">View Enquiry →</div>
                 </div>
               </motion.div>
              )}
              {activeFeature === 0 && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-3 bg-white rounded-xl shadow-xl border border-slate-200 flex items-center gap-3 max-w-55">
                 <div className="w-8 h-8 rounded-full bg-pd-pink/10 flex items-center justify-center text-pd-pink shrink-0"><TrendingUp size={14} /></div>
                 <div>
                  <div className="text-[10px] font-bold text-slate-900 leading-tight">Profile Views</div>
                  <div className="text-[9px] text-slate-500 leading-tight">486 • +24.8% this month</div>
                 </div>
               </motion.div>
              )}
            </div>

           </div>
         </div>
        </div>

        {/* Right Column: Scrollable Features List */}
        <div className="h-150 lg:h-175 overflow-y-auto pr-2 custom-scrollbar relative">
         <style>{`
           .custom-scrollbar::-webkit-scrollbar { width: 4px; }
           .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
           .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
           .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
         `}</style>
         
         <div className="space-y-4 pb-20">
           {features.map((feature, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveFeature(idx)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${activeFeature === idx ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50' : 'bg-transparent border-transparent hover:bg-slate-100/50'}`}
            >
              <div className="flex gap-4">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${activeFeature === idx ? 'bg-linear-to-br from-pd-blue to-blue-600 text-white shadow-md shadow-pd-blue/20' : 'bg-white text-slate-400 border border-slate-200 shadow-sm'}`}>
                 {feature.icon}
               </div>
               <div>
                 <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-semibold font-pd uppercase tracking-widest ${activeFeature === idx ? 'text-pd-blue' : 'text-slate-400'}`}>{feature.id}</span>
                  <h4 className={`text-base font-semibold font-sf transition-colors ${activeFeature === idx ? 'text-slate-900' : 'text-slate-700'}`}>{feature.title}</h4>
                 </div>
                 <p className={`text-sm font-semibold font-pd mb-2 transition-colors ${activeFeature === idx ? 'text-slate-700' : 'text-slate-500'}`}>{feature.desc}</p>
                 
                 <AnimatePresence>
                  {activeFeature === idx && (
                    <motion.div 
                     initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                     className="overflow-hidden"
                    >
                     <p className="text-[13px] font-normal font-pd text-slate-500 leading-relaxed mt-1">{feature.detail}</p>
                    </motion.div>
                  )}
                 </AnimatePresence>
               </div>
              </div>
            </div>
           ))}
         </div>
        </div>

      </div>

      {/* Bottom CTA Block */}
      <div className="mt-24 lg:mt-32 max-w-4xl mx-auto text-center relative overflow-hidden shadow-2xl bg-slate-900 rounded-3xl p-10 md:p-16">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pd-pink/20 blur-3xl rounded-full mix-blend-screen pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pd-blue/20 blur-3xl rounded-full mix-blend-screen pointer-events-none translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10">
         <h3 className="text-3xl md:text-5xl font-semibold font-sf text-white tracking-tight leading-[1.15] mb-6">
           Your Venue. Your Business. <br />
           <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-blue via-purple-500 to-pd-pink">One Powerful Partner Portal.</span>
         </h3>
         <p className="text-slate-300 text-base lg:text-lg font-normal font-pd mb-10 max-w-2xl mx-auto">
           From your first customer enquiry to your next confirmed booking, manage your venue business from one place with PartyDial.
         </p>
         
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
           <Link href="/login"className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }} whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 bg-[#F43F5E] hover:bg-[#e11d48] text-white rounded-2xl font-semibold font-pd text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#F43F5E]/20 group cursor-pointer"
            >
              <span>Explore Partner Dashboard</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </motion.button>
           </Link>
  
           <Link href="/login"className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold font-pd text-sm border border-white/20 shadow-sm flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm">
              Become a PartyDial Partner
            </button>
           </Link>
         </div>
         
         <div className="flex items-center justify-center gap-4 text-[11px] font-semibold font-pd text-slate-400 uppercase tracking-widest">
           <span>Manage smarter</span>
           <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
           <span>Respond faster</span>
           <span className="w-1.5 h-1.5 rounded-full bg-slate-600 hidden sm:block"></span>
           <span className="hidden sm:inline-block">Grow your opportunities</span>
         </div>
        </div>
      </div>
     </div>
   </section>
  );
};

const RevenueCalculatorSection = () => {
  const [venueType, setVenueType] = useState('Banquet Hall');
  const [monthlyLeads, setMonthlyLeads] = useState(25);
  const [conversionRate, setConversionRate] = useState(10);
  const [avgBookingValue, setAvgBookingValue] = useState(25000);

  const potentialBookings = (monthlyLeads * conversionRate) / 100;
  const estimatedRevenue = potentialBookings * avgBookingValue;

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const venueTypes = ['Banquet Hall', 'Hotel', 'Resort', 'Lawn', 'Restaurant', 'Café', 'Farmhouse', 'Party Hall'];

  return (
   <section id="calculator" className="py-10 lg:py-12 bg-white relative overflow-hidden font-pd border-b border-slate-100">
     {/* Background */}
     <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute top-0 right-0 w-150 h-150 bg-linear-to-bl from-pd-blue/5 via-emerald-400/5 to-transparent rounded-full blur-3xl"/>
      <div className="absolute bottom-0 left-0 w-200 h-200 bg-linear-to-tr from-pd-pink/5 via-purple-500/5 to-transparent rounded-full blur-3xl"/>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[40px_40px] opacity-20"style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black, transparent)' }} />
     </div>

     <div className="max-w-300 mx-auto px-6 lg:px-12 relative z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <motion.div 
         initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
         className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm text-slate-600 text-[11px] font-semibold font-pd uppercase tracking-widest mb-6"
        >
         <TrendingUp size={12} className="text-emerald-500"/>
         <span>ESTIMATE YOUR BUSINESS OPPORTUNITY</span>
        </motion.div>
        <motion.h2 
         initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
         className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[48px] font-semibold font-pd text-slate-900 tracking-tight leading-[1.12] mb-4 lg:whitespace-nowrap"
        >
         See Your Potential <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-blue via-purple-500 to-pd-pink">With PartyDial</span>
        </motion.h2>
        <motion.p 
         initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
         className="text-slate-600 text-sm sm:text-base lg:text-lg font-normal font-pd leading-relaxed max-w-2xl mx-auto"
        >
         Explore how customer enquiries, conversion rates, and average booking values can translate into potential business opportunities for your venue.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left side: Inputs */}
        <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-5 sm:p-8">
         {/* Step 1: Venue Type */}
         <div className="mb-6">
           <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">01</div>
            <h3 className="text-base font-semibold text-slate-900">What type of venue do you operate?</h3>
           </div>
           <div className="relative">
            <select 
              value={venueType} 
              onChange={(e) => setVenueType(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-pd-blue/20 focus:border-pd-blue transition-all cursor-pointer"
            >
              {venueTypes.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"size={20} />
           </div>
         </div>

         {/* Step 2: Leads */}
         <div className="mb-6">
           <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">02</div>
            <h3 className="text-base font-semibold text-slate-900">How many enquiries could you receive each month?</h3>
           </div>
           <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div className="flex justify-between items-end mb-4">
              <div className="text-2xl font-bold text-pd-blue">{monthlyLeads} <span className="text-xs text-slate-500 font-semibold">Enquiries / Month</span></div>
            </div>
            <input type="range"min="10"max="200"step="5"value={monthlyLeads} onChange={(e) => setMonthlyLeads(parseInt(e.target.value))} className="w-full accent-pd-blue h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer mb-4"/>
            <div className="flex flex-wrap gap-2">
              {[10, 25, 50, 75, 100].map(v => (
               <button key={v} onClick={() => setMonthlyLeads(v)} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors ${monthlyLeads === v ? 'bg-pd-blue text-white border-pd-blue' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}>{v}</button>
              ))}
            </div>
           </div>
         </div>

         {/* Step 3: Conversion Rate */}
         <div className="mb-6">
           <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">03</div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">What percentage of enquiries could convert?</h3>
            </div>
           </div>
           <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div className="flex justify-between items-end mb-4">
              <div className="text-2xl font-bold text-emerald-500">{conversionRate}% <span className="text-xs text-slate-500 font-semibold">Conversion Rate</span></div>
            </div>
            <input type="range"min="1"max="50"step="1"value={conversionRate} onChange={(e) => setConversionRate(parseInt(e.target.value))} className="w-full accent-emerald-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer mb-4"/>
            <div className="flex justify-between text-xs font-bold text-slate-400"><span>1%</span><span>50%</span></div>
           </div>
         </div>

         {/* Step 4: Average Booking Value */}
         <div>
           <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">04</div>
            <h3 className="text-base font-semibold text-slate-900">What is your average booking value?</h3>
           </div>
           <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</div>
              <input type="number"value={avgBookingValue} onChange={(e) => setAvgBookingValue(parseInt(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-lg font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pd-blue/20 focus:border-pd-blue"/>
            </div>
            <div className="flex flex-wrap gap-2">
              {[25000, 50000, 75000, 100000, 200000].map(v => (
               <button key={v} onClick={() => setAvgBookingValue(v)} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors ${avgBookingValue === v ? 'bg-pd-blue text-white border-pd-blue' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}>₹{v / 1000}K</button>
              ))}
            </div>
           </div>
         </div>
        </div>

        {/* Right side: Results */}
        <div className="lg:col-span-5 flex flex-col gap-4">
         {/* Result Card */}
         <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative border border-slate-800">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full mix-blend-screen pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-pd-blue/20 blur-3xl rounded-full mix-blend-screen pointer-events-none translate-y-1/2 -translate-x-1/2"></div>
           
           <div className="p-6 sm:p-8 relative z-10">
            <div className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase mb-6 flex items-center gap-2">
              <TrendingUp size={14} /> YOUR ESTIMATED OPPORTUNITY
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
               <AnimatePresence mode="popLayout">
                 <motion.div key={monthlyLeads} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl sm:text-4xl font-bold text-white mb-1">{monthlyLeads}</motion.div>
               </AnimatePresence>
               <div className="text-xs font-semibold text-slate-400">Potential Leads</div>
              </div>
              <div>
               <AnimatePresence mode="popLayout">
                 <motion.div key={potentialBookings} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {potentialBookings < 1 ? '<1' : Math.floor(potentialBookings)}
                  {Math.floor(potentialBookings) !== Math.ceil(potentialBookings) && `–${Math.ceil(potentialBookings)}`}
                 </motion.div>
               </AnimatePresence>
               <div className="text-xs font-semibold text-slate-400">Potential Bookings</div>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <div className="text-xs font-semibold text-slate-400 mb-2">Estimated Business Opportunity</div>
              <AnimatePresence mode="popLayout">
               <motion.div key={estimatedRevenue} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pd-blue via-purple-500 to-pd-pink tracking-tight">
                 {formatCurrency(estimatedRevenue)}
               </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5"><Users size={12} className="text-slate-300"/></div>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
               At {monthlyLeads} enquiries per month and a {conversionRate}% conversion rate, your inputs indicate approximately {Math.max(1, Math.floor(potentialBookings))}–{Math.max(1, Math.ceil(potentialBookings))} potential bookings for a <span className="text-white">{venueType}</span>.
              </p>
            </div>
           </div>
         </div>

         {/* Funnel Vis */}
         <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6">
           <div className="text-center font-bold text-xs text-slate-900 mb-4">Opportunity Visualization</div>
           <div className="flex flex-col items-center gap-1.5">
            <div className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-200 text-xs font-semibold w-full text-center">Customer Searches</div>
            <ArrowDown size={14} className="text-slate-300"/>
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 text-xs font-bold w-[90%] text-center">{monthlyLeads} Enquiries</div>
            <ArrowDown size={14} className="text-blue-300"/>
            <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 text-xs font-bold w-[80%] text-center">{Math.max(1, Math.floor(potentialBookings))}–{Math.max(1, Math.ceil(potentialBookings))} Bookings</div>
            <ArrowDown size={14} className="text-emerald-300"/>
            <div className="px-4 py-2.5 bg-[#F43F5E] text-white rounded-lg shadow-md shadow-[#F43F5E]/20 text-sm font-bold w-[70%] text-center">
              {formatCurrency(estimatedRevenue)}
            </div>
           </div>
         </div>

         <p className="text-[10px] text-slate-400 text-center leading-relaxed px-4">
           <strong>Illustrative estimate only.</strong> Actual results may vary based on venue type, location, pricing, customer demand, availability, enquiry quality, and conversion rate. PartyDial does not guarantee a specific number of leads, bookings, or revenue.
         </p>
        </div>
      </div>
      
      {/* CTA */}
      <div className="mt-12 lg:mt-16 max-w-3xl mx-auto text-center">
        <h3 className="text-xl md:text-3xl font-semibold font-sf text-slate-900 mb-3">Ready to Explore Your Opportunity?</h3>
        <p className="text-slate-500 text-sm mb-6">Create your partner profile and start showcasing your venue to potential customers.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
         <Link href="/register"className="w-full sm:w-auto">
           <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto px-6 py-3 bg-[#F43F5E] hover:bg-[#e11d48] text-white rounded-xl font-semibold font-pd text-sm shadow-lg shadow-[#F43F5E]/20 flex items-center justify-center transition-all">
            Become a PartyDial Partner →
           </motion.button>
         </Link>
         <Link href="/login"className="w-full sm:w-auto">
           <button className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold font-pd text-sm border border-slate-200 shadow-sm flex items-center justify-center transition-all">
            Explore Partner Dashboard →
           </button>
         </Link>
        </div>
      </div>

     </div>
   </section>
  );
};

export default function PartnerLandingPage() {
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

     {/* 1. NEW SAAS-STYLE HERO SECTION */}
     <section className="relative min-h-screen flex items-center pt-28 pb-16 lg:py-24 overflow-hidden bg-slate-50 border-b border-slate-100">
      {/* Premium SaaS Background Gradients & Grids */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-0 w-200 h-200 rounded-full bg-linear-to-bl from-pd-pink/15 via-purple-500/10 to-transparent blur-3xl"/>
        <div className="absolute top-1/4 -left-32 w-150 h-150 rounded-full bg-linear-to-tr from-pd-blue/15 via-emerald-400/10 to-transparent blur-3xl"/>
        
        {/* Floating Abstract Shapes */}
        <motion.div 
          animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[45%] w-40 h-40 bg-linear-to-tr from-pd-pink/20 to-purple-500/20 rounded-full blur-2xl"
        />
        <motion.div 
          animate={{ y: [0, 40, 0], scale: [1, 1.05, 1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[25%] w-64 h-64 bg-linear-to-bl from-pd-blue/20 to-cyan-400/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ x: [0, 25, 0], rotate: [0, -15, 0] }} 
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[10%] left-[10%] w-32 h-32 bg-linear-to-tr from-amber-400/10 to-rose-400/10 rounded-full blur-2xl"
        />

        {/* Subtle background tech grid */}
        <div 
         className="absolute inset-0 opacity-[0.03]"
         style={{ backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#f8fafc_80%)]"/>
      </div>

      <div className="max-w-360 w-full mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-8 relative z-10">
        
        {/* Left Column: Messaging (45%) */}
        <motion.div
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
         className="w-full lg:w-[45%] flex flex-col items-start lg:pr-8"
        >
         <h1 className="text-4xl sm:text-5xl md:text-[56px] font-semibold font-sf text-slate-900 tracking-tight leading-[1.1] mb-6">
           Turn Your Venue Into a <br />
           <span className="relative inline-block mt-2">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink via-purple-600 to-pd-blue">
              High-Visibility
            </span> Business
           </span>
         </h1>

         <p className="text-base sm:text-lg text-slate-600 font-normal font-pd mb-8 max-w-lg leading-relaxed">
           Get discovered by customers looking for venues, receive qualified enquiries, and manage your business through PartyDial’s powerful partner platform.
         </p>

         <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4">
           <Link href="/login"className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 bg-pd-pink hover:bg-rose-600 text-white rounded-2xl font-semibold font-pd text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-pd-pink/20 hover:shadow-pd-pink/40 group cursor-pointer"
            >
              <span>Become a PartyDial Partner</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </motion.button>
           </Link>

           <button 
            onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-semibold font-pd text-sm border border-slate-200 shadow-sm flex items-center justify-center transition-all hover:border-slate-300 cursor-pointer"
           >
            Calculate Your Revenue
           </button>
         </div>
         
         <p className="text-xs text-slate-500 font-normal font-pd">
           Start growing your venue with PartyDial.
         </p>
        </motion.div>

        {/* Right Column: Interactive SaaS Dashboard (55%) */}
        <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
         className="w-full lg:w-[55%] relative mt-8 lg:mt-0"
        >
         {/* Floating Storytelling Cards */}
         
         {/* Card 1: New Enquiry (Top Left) */}
         <motion.div 
           initial={{ opacity: 0, x: -20, y: 10 }}
           animate={{ opacity: 1, x: 0, y: 0 }}
           transition={{ delay: 1, duration: 0.5 }}
           className="absolute -left-4 md:-left-12 -top-6 md:-top-10 z-20 bg-white p-3 md:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-3 w-48 md:w-56 animate-float-slow"
         >
           <div className="w-8 h-8 rounded-full bg-pd-pink/10 text-pd-pink flex items-center justify-center shrink-0">
            <Heart size={14} fill="currentColor"/>
           </div>
           <div>
            <p className="text-[10px] md:text-xs font-semibold font-pd text-slate-900 leading-tight">New Enquiry</p>
            <p className="text-[9px] md:text-[10px] font-normal font-pd text-slate-500 mt-0.5">Wedding · 250 Guests</p>
            <p className="text-[9px] md:text-[10px] font-semibold font-pd text-pd-pink mt-1 cursor-pointer">View Enquiry →</p>
           </div>
         </motion.div>

         {/* Card 2: New Booking (Bottom Left) */}
         <motion.div 
           initial={{ opacity: 0, x: -20, y: -10 }}
           animate={{ opacity: 1, x: 0, y: 0 }}
           transition={{ delay: 1.5, duration: 0.5 }}
           className="absolute -left-2 md:-left-8 bottom-12 md:bottom-20 z-20 bg-white p-3 md:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float-fast"
         >
           <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} />
           </div>
           <div>
            <p className="text-[10px] md:text-xs font-semibold font-pd text-slate-900 leading-tight">Booking Confirmed</p>
            <p className="text-[9px] md:text-[10px] font-normal font-pd text-slate-500 mt-0.5">18 Oct · 250 Pax</p>
           </div>
         </motion.div>

         {/* Card 3: Profile Visibility (Top Right) */}
         <motion.div 
           initial={{ opacity: 0, x: 20, y: 10 }}
           animate={{ opacity: 1, x: 0, y: 0 }}
           transition={{ delay: 1.2, duration: 0.5 }}
           className="absolute -right-4 md:-right-8 top-1/4 z-20 bg-white p-3 md:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float-slow"
           style={{ animationDelay: '1s' }}
         >
           <div className="w-8 h-8 rounded-full bg-pd-blue/10 text-pd-blue flex items-center justify-center shrink-0">
            <Eye size={14} />
           </div>
           <div>
            <p className="text-[10px] md:text-xs font-normal font-pd text-slate-500 leading-tight">Profile Views</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm md:text-base font-semibold font-pd text-slate-900">
               <AnimatedCounter end={486} />
              </span>
              <span className="text-[9px] md:text-[10px] font-semibold font-pd text-emerald-500">+24.8%</span>
            </div>
           </div>
         </motion.div>

         {/* Card 4: Revenue (Bottom Right) */}
         <motion.div 
           initial={{ opacity: 0, x: 20, y: -10 }}
           animate={{ opacity: 1, x: 0, y: 0 }}
           transition={{ delay: 1.8, duration: 0.5 }}
           className="absolute -right-2 md:-right-10 bottom-0 md:-bottom-6 z-20 bg-white p-3 md:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-3 animate-float-fast"
           style={{ animationDelay: '2s' }}
         >
           <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <TrendingUp size={14} />
           </div>
           <div>
            <p className="text-[10px] md:text-xs font-normal font-pd text-slate-500 leading-tight">Booking Value</p>
            <p className="text-sm md:text-base font-semibold font-pd text-slate-900 mt-0.5">₹42,500</p>
           </div>
         </motion.div>

         {/* Main Dashboard Mockup */}
         <div className="w-full bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden relative">
           {/* Window Header */}
           <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200"/>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200"/>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200"/>
            </div>
            <div className="text-[10px] font-semibold font-pd text-slate-400">PartyDial Partner</div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping absolute"/>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative"/>
              <span className="text-[8px] font-semibold font-pd text-emerald-600 uppercase tracking-widest">Live</span>
            </div>
           </div>

           {/* Dashboard Content */}
           <div className="p-6 md:p-8 bg-slate-50/50">
            <div className="mb-6">
              <h3 className="text-lg md:text-xl font-semibold font-sf text-slate-900">Good Morning, Partner 👋</h3>
              <p className="text-xs md:text-sm text-slate-500 font-normal font-pd">Here&apos;s your business overview</p>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Leads */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group/metric">
               <div className="absolute top-0 right-0 w-16 h-16 bg-pd-pink/5 rounded-bl-full transition-transform group-hover/metric:scale-110"/>
               <p className="text-[10px] md:text-xs font-normal font-pd text-slate-500 mb-1">New Leads</p>
               <div className="flex items-end gap-2">
                 <span className="text-2xl md:text-3xl font-semibold font-pd text-slate-900"><AnimatedCounter end={28} /></span>
                 <span className="text-[9px] md:text-[10px] font-semibold font-pd text-emerald-500 mb-1">+18.4%</span>
               </div>
              </div>
              
              {/* Views */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group/metric">
               <div className="absolute top-0 right-0 w-16 h-16 bg-pd-blue/5 rounded-bl-full transition-transform group-hover/metric:scale-110"/>
               <p className="text-[10px] md:text-xs font-normal font-pd text-slate-500 mb-1">Profile Views</p>
               <div className="flex items-end gap-2">
                 <span className="text-2xl md:text-3xl font-semibold font-pd text-slate-900"><AnimatedCounter end={486} /></span>
                 <span className="text-[9px] md:text-[10px] font-semibold font-pd text-emerald-500 mb-1">+24.8%</span>
               </div>
              </div>

              {/* Enquiries */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group/metric">
               <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-full transition-transform group-hover/metric:scale-110"/>
               <p className="text-[10px] md:text-xs font-normal font-pd text-slate-500 mb-1">Enquiries</p>
               <div className="flex items-end gap-2">
                 <span className="text-2xl md:text-3xl font-semibold font-pd text-slate-900"><AnimatedCounter end={17} /></span>
                 <span className="text-[9px] md:text-[10px] font-semibold font-pd text-emerald-500 mb-1">+12.5%</span>
               </div>
              </div>

              {/* Bookings */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group/metric">
               <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full transition-transform group-hover/metric:scale-110"/>
               <p className="text-[10px] md:text-xs font-normal font-pd text-slate-500 mb-1">Bookings</p>
               <div className="flex items-end gap-2">
                 <span className="text-2xl md:text-3xl font-semibold font-pd text-slate-900"><AnimatedCounter end={6} /></span>
                 <span className="text-[9px] md:text-[10px] font-semibold font-pd text-emerald-500 mb-1">+20.0%</span>
               </div>
              </div>
            </div>

            {/* Revenue Section */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
               <div>
                 <p className="text-[10px] md:text-xs font-normal font-pd text-slate-500 mb-1">Estimated Revenue</p>
                 <p className="text-xl md:text-2xl font-semibold font-pd text-slate-900">₹<AnimatedCounter end={180000} duration={2500} /></p>
               </div>
               <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[9px] md:text-[10px] font-semibold font-pd flex items-center gap-1">
                 <TrendingUp size={10} /> +24.6% this month
               </div>
              </div>
              
              {/* Revenue Chart Animation */}
              <div className="w-full h-24 mt-2 relative">
               <svg className="w-full h-full overflow-visible"preserveAspectRatio="none"viewBox="0 0 400 100">
                 <defs>
                  <linearGradient id="chartGradient"x1="0"y1="0"x2="0"y2="1">
                    <stop offset="0%"stopColor="#f43f5e"stopOpacity="0.2"/>
                    <stop offset="100%"stopColor="#f43f5e"stopOpacity="0"/>
                  </linearGradient>
                 </defs>
                 {/* Grid lines */}
                 <line x1="0"y1="25"x2="400"y2="25"stroke="#f1f5f9"strokeWidth="1"strokeDasharray="4 4"/>
                 <line x1="0"y1="50"x2="400"y2="50"stroke="#f1f5f9"strokeWidth="1"strokeDasharray="4 4"/>
                 <line x1="0"y1="75"x2="400"y2="75"stroke="#f1f5f9"strokeWidth="1"strokeDasharray="4 4"/>
                 
                 {/* Area under line */}
                 <motion.path 
                  d="M0,80 C50,70 100,90 150,60 C200,30 250,50 300,20 C350,-10 400,10 400,10 L400,100 L0,100 Z"
                  fill="url(#chartGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                 />
                 
                 {/* Line chart */}
                 <motion.path 
                  d="M0,80 C50,70 100,90 150,60 C200,30 250,50 300,20 C350,-10 400,10 400,10"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease:"easeOut", delay: 0.2 }}
                 />
                 
                 {/* Points */}
                 <motion.circle cx="150"cy="60"r="4"fill="white"stroke="#f43f5e"strokeWidth="2"initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
                 <motion.circle cx="300"cy="20"r="4"fill="white"stroke="#f43f5e"strokeWidth="2"initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }} />
                 <motion.circle cx="400"cy="10"r="4"fill="white"stroke="#f43f5e"strokeWidth="2"initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6 }} />
               </svg>
              </div>
            </div>
           </div>
         </div>
        </motion.div>
      </div>
     </section>


     {/* 2. WHAT IS PARTYDIAL SECTION */}
     <section className="py-12 lg:py-16 px-6 lg:px-12 bg-white relative overflow-hidden border-b border-slate-100">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-linear-to-bl from-pd-pink/10 via-purple-500/5 to-transparent rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none"/>
      <div className="absolute bottom-0 left-0 w-150 h-150 bg-linear-to-tr from-pd-blue/10 via-emerald-400/5 to-transparent rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none"/>

      <div className="max-w-360 mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
         <motion.div 
           initial={{ opacity: 0, y: 15 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-pd-pink/10 to-pd-blue/10 border border-pd-pink/20 text-pd-pink text-[11px] font-semibold font-pd uppercase tracking-widest mb-6"
         >
           <span>Why Partners Choose PartyDial</span>
         </motion.div>

         <motion.h2 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.1 }}
           className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[48px] font-semibold font-pd text-slate-900 tracking-tight leading-[1.12] mb-4"
         >
           Everything You Need to <br />
           <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink via-purple-600 to-pd-blue">Grow Your Venue Business</span>
         </motion.h2>

         <motion.p 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
           className="text-slate-600 text-sm sm:text-base lg:text-lg font-normal font-pd leading-relaxed mx-auto"
         >
           Attract customers, manage your enquiries, and secure more bookings—all from one powerful partner platform.
         </motion.p>
        </div>

        {/* Core Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
         
         {/* Card 1: Get Discovered */}
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="group relative p-8 rounded-3xl bg-slate-50/50 border border-slate-200/80 hover:border-pd-pink/40 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
         >
           <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-pd-pink/20 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"/>
           
           <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-pd-pink mb-6 group-hover:scale-110 transition-transform">
            <Search size={24} />
           </div>
           
           <div className="mb-6 grow">
            <div className="text-[11px] font-semibold font-pd uppercase tracking-widest text-slate-400 mb-3">01 — Get Discovered</div>
            <h3 className="text-xl font-semibold font-sf text-slate-900 mb-3 group-hover:text-pd-pink transition-colors">
              Put Your Venue Where Customers Are Looking
            </h3>
            <p className="text-sm font-normal font-pd text-slate-600 leading-relaxed">
              Showcase your venue to customers searching for event spaces based on their specific location and event requirements.
            </p>
           </div>

           <div className="flex items-center text-sm font-semibold font-pd text-slate-900 group-hover:text-pd-pink transition-colors mt-auto cursor-pointer">
            Explore Visibility <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform"/>
           </div>
         </motion.div>

         {/* Card 2: Get Qualified Leads */}
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.1 }}
           className="group relative p-8 rounded-3xl bg-slate-50/50 border border-slate-200/80 hover:border-pd-blue/40 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
         >
           <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-pd-blue/20 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"/>
           
           <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-pd-blue mb-6 group-hover:scale-110 transition-transform">
            <Target size={24} />
           </div>
           
           <div className="mb-6 grow">
            <div className="text-[11px] font-semibold font-pd uppercase tracking-widest text-slate-400 mb-3">02 — Get Qualified Leads</div>
            <h3 className="text-xl font-semibold font-sf text-slate-900 mb-3 group-hover:text-pd-blue transition-colors">
              Connect With Customers Who Match Your Venue
            </h3>
            <p className="text-sm font-normal font-pd text-slate-600 leading-relaxed">
              Receive relevant, high-quality enquiries containing important customer details like guest capacity and budget.
            </p>
           </div>

           <div className="flex items-center text-sm font-semibold font-pd text-slate-900 group-hover:text-pd-blue transition-colors mt-auto cursor-pointer">
            See How Leads Work <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform"/>
           </div>
         </motion.div>

         {/* Card 3: Get More Bookings */}
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="group relative p-8 rounded-3xl bg-slate-50/50 border border-slate-200/80 hover:border-emerald-500/40 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
         >
           <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-emerald-500/20 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"/>
           
           <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
            <TrendingUp size={24} />
           </div>
           
           <div className="mb-6 grow">
            <div className="text-[11px] font-semibold font-pd uppercase tracking-widest text-slate-400 mb-3">03 — Get More Bookings</div>
            <h3 className="text-xl font-semibold font-sf text-slate-900 mb-3 group-hover:text-emerald-500 transition-colors">
              Turn Enquiries Into Confirmed Events
            </h3>
            <p className="text-sm font-normal font-pd text-slate-600 leading-relaxed">
              Manage incoming enquiries, follow up with customers, and turn genuine opportunities into confirmed bookings.
            </p>
           </div>

           <div className="flex items-center text-sm font-semibold font-pd text-slate-900 group-hover:text-emerald-500 transition-colors mt-auto cursor-pointer">
            Grow Your Bookings <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform"/>
           </div>
         </motion.div>
        </div>

        {/* Section Visual — The PartyDial Growth Loop */}
        <motion.div 
         initial={{ opacity: 0, scale: 0.98 }}
         whileInView={{ opacity: 1, scale: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 0.8 }}
         className="w-full max-w-5xl mx-auto mt-12 md:mt-16 bg-slate-900 rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden shadow-2xl"
        >
         {/* Subtle Grid and Glow in dark container */}
         <div className="absolute inset-0 opacity-10 pointer-events-none"style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-pd-pink/20 blur-3xl rounded-full"/>
         
         <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
           
           <div className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]">
              <Building2 size={20} />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold font-pd text-slate-300 group-hover:text-white text-center">Your Venue</span>
           </div>

           <div className="hidden md:block flex-1 h-px bg-slate-700 relative overflow-hidden">
            <motion.div 
              initial={{ left:"-20%"}}
              animate={{ left:"120%"}}
              transition={{ duration: 1.5, repeat: Infinity, ease:"linear"}}
              className="absolute top-0 w-1/2 h-full bg-linear-to-r from-transparent via-pd-pink to-transparent"
            />
           </div>
           <div className="block md:hidden h-6 w-px bg-slate-700"/>

           <div className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:bg-pd-pink group-hover:text-white transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(244,63,94,0.5)]">
              <Search size={20} />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold font-pd text-slate-300 group-hover:text-white text-center">Discovery</span>
           </div>

           <div className="hidden md:block flex-1 h-px bg-slate-700 relative overflow-hidden">
            <motion.div 
              initial={{ left:"-20%"}}
              animate={{ left:"120%"}}
              transition={{ duration: 1.5, delay: 0.3, repeat: Infinity, ease:"linear"}}
              className="absolute top-0 w-1/2 h-full bg-linear-to-r from-transparent via-pd-blue to-transparent"
            />
           </div>
           <div className="block md:hidden h-6 w-px bg-slate-700"/>

           <div className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:bg-pd-blue group-hover:text-white transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]">
              <MessageSquare size={20} />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold font-pd text-slate-300 group-hover:text-white text-center">Enquiry</span>
           </div>

           <div className="hidden md:block flex-1 h-px bg-slate-700 relative overflow-hidden">
            <motion.div 
              initial={{ left:"-20%"}}
              animate={{ left:"120%"}}
              transition={{ duration: 1.5, delay: 0.6, repeat: Infinity, ease:"linear"}}
              className="absolute top-0 w-1/2 h-full bg-linear-to-r from-transparent via-purple-500 to-transparent"
            />
           </div>
           <div className="block md:hidden h-6 w-px bg-slate-700"/>

           <div className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold font-pd text-slate-300 group-hover:text-white text-center">Booking</span>
           </div>

           <div className="hidden md:block flex-1 h-px bg-slate-700 relative overflow-hidden">
            <motion.div 
              initial={{ left:"-20%"}}
              animate={{ left:"120%"}}
              transition={{ duration: 1.5, delay: 0.9, repeat: Infinity, ease:"linear"}}
              className="absolute top-0 w-1/2 h-full bg-linear-to-r from-transparent via-amber-400 to-transparent"
            />
           </div>
           <div className="block md:hidden h-6 w-px bg-slate-700"/>

           <div className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-900 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold font-pd text-slate-300 group-hover:text-white text-center">Growth</span>
           </div>
         </div>
        </motion.div>

        {/* Closing Message */}
        <div className="text-center max-w-3xl mx-auto">
         <h3 className="text-2xl sm:text-3xl font-semibold font-sf text-slate-900 tracking-tight mb-4">
           One Platform. More Visibility. Better Opportunities.
         </h3>
         <p className="text-slate-600 text-sm sm:text-base font-normal font-pd mb-8">
           List your venue, connect with potential customers, manage your enquiries, and grow your business — all through PartyDial.
         </p>
         
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <Link href="/login"className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 bg-[#F43F5E] hover:bg-[#e11d48] text-white rounded-2xl font-semibold font-pd text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#F43F5E]/20 group cursor-pointer"
            >
              <span>Become a PartyDial Partner</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </motion.button>
           </Link>

           <button 
            onClick={() => {
              const el = document.getElementById('features');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-semibold font-pd text-sm border border-slate-200 shadow-sm flex items-center justify-center transition-all hover:border-slate-300 cursor-pointer"
           >
            Explore Partner Platform
           </button>
         </div>
        </div>
      </div>
     </section>

     {/* 4. INTERACTIVE GROWTH JOURNEY */}
     <GrowthJourneySection />

     <PartnerPortalSection />

     <RevenueCalculatorSection />

     
     {/* 9. SUCCESS STORIES */}
     <section id="stories" className="py-24 bg-slate-50 border-t border-slate-100 overflow-hidden relative font-pd">
      
      {/* Fade Gradients for Ticker */}
      <div className="absolute top-0 right-0 w-1/4 md:w-[15%] h-full bg-linear-to-l from-slate-50 to-transparent pointer-events-none z-20" />
      <div className="absolute top-0 left-0 w-1/4 md:w-[15%] h-full bg-linear-to-r from-slate-50 to-transparent pointer-events-none z-20" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin:"-50px"}} 
        transition={{ duration: 0.8 }}
        className="max-w-360 mx-auto mb-16 px-6 lg:px-12 text-center relative z-10"
      >
        <h3 className="text-3xl md:text-5xl font-semibold font-sf text-slate-900 tracking-tight leading-[1.1] mb-4">Real Success <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-blue via-purple-600 to-pd-pink">Stories</span></h3>
        <p className="text-slate-500 text-sm md:text-base font-normal font-pd leading-relaxed">Join hundreds of top-tier venues scaling with PartyDial</p>
      </motion.div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 80s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 90s linear infinite;
        }
        .ticker-row:hover .animate-marquee, .ticker-row:hover .animate-marquee-reverse {
          animation-play-state: paused;
        }
      `}</style>

      {/* Marquee Container */}
      <div className="flex flex-col gap-6 w-full relative z-10 ticker-row group">
        
        {/* Row 1: Left scrolling */}
        <div className="flex w-[max-content] animate-marquee gap-6">
          {[...successStories, ...successStories, ...successStories, ...successStories].map((t, i) => (
            <div key={i} className="w-[340px] md:w-[400px] shrink-0 bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-5 gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-[13px] md:text-sm text-slate-500 font-normal leading-[1.6] mb-8">
                  {t.text}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Right scrolling (reverse) */}
        <div className="flex w-[max-content] animate-marquee-reverse gap-6 pl-12">
          {[...successStories].reverse().concat([...successStories].reverse()).concat([...successStories].reverse()).concat([...successStories].reverse()).map((t, i) => (
            <div key={i} className="w-[340px] md:w-[400px] shrink-0 bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-5 gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-[13px] md:text-sm text-slate-500 font-normal leading-[1.6] mb-8">
                  {t.text}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
     </section>


     
     
     
     
     {/* 10. NATIONAL EXPANSION - MAPLESS GRID DESIGN */}
     <section className="relative py-24 px-6 overflow-hidden bg-[#F7F9FB] border-y border-slate-100 font-pd">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-linear-to-bl from-[#3B82F6]/5 to-transparent rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3B82F6]/5 text-[#3B82F6] text-[10px] uppercase tracking-[0.4em] mb-6 border border-[#3B82F6]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-ping"></span> 
            National Expansion
          </div>
          
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sf text-slate-900 tracking-tight leading-[1.1] mb-6">
            Dominating <span className="text-transparent bg-clip-text bg-gradient-to-r from-pd-pink via-purple-600 to-pd-blue">The Hills,</span> <br className="hidden md:block" />
            Scaling India.
          </h3>
          
          <p className="text-slate-500 text-sm md:text-base leading-relaxed font-normal font-pd">
            After successfully digitizing the venue ecosystem in Uttarakhand, we are launching discovery hubs in major metropolitan areas to connect customers to premium venues nationwide.
          </p>
        </div>

        {/* Phase 02 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              state: "Delhi NCR",
              cities: "New Delhi · Gurugram · Noida",
              status: "Live",
              color: "#F43F5E" // Pink
            },
            {
              state: "Maharashtra",
              cities: "Mumbai · Pune",
              status: "Beta",
              color: "#A855F7" // Purple
            },
            {
              state: "Punjab",
              cities: "Chandigarh · Ludhiana",
              status: "Deploying",
              color: "#3B82F6" // Blue
            },
            {
              state: "Rajasthan",
              cities: "Jaipur · Udaipur",
              status: "Deploying",
              color: "#F59E0B" // Amber
            },
            {
              state: "Gujarat",
              cities: "Ahmedabad · Surat",
              status: "Planning",
              color: "#10B981" // Emerald
            },
            {
              state: "Uttar Pradesh",
              cities: "Lucknow · Agra",
              status: "Planning",
              color: "#6366F1" // Indigo
            }
          ].map((loc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-[20px] p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              <div 
                className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: loc.color }}
              ></div>
              
              <div className="flex justify-between items-start mb-12">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 shadow-sm transition-transform duration-500 group-hover:rotate-6"
                  style={{ color: loc.color }}
                >
                  <MapPin size={24} />
                </div>
                
                <div 
                  className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold font-sf rounded-full border bg-white shadow-sm"
                  style={{ 
                    borderColor: `${loc.color}30`, 
                    color: loc.color 
                  }}
                >
                  {loc.status}
                </div>
              </div>
              
              <h4 className="text-xl md:text-2xl font-bold font-sf text-slate-900 mb-2">{loc.state}</h4>
              <p className="text-sm font-pd text-slate-500">{loc.cities}</p>
            </motion.div>
          ))}
        </div>
        
      </div>
     </section>


     


     


     
     
     {/* 11. FAQ - 2-COLUMN IMAGE DESIGN */}
     <section id="faq" suppressHydrationWarning className="py-20 md:py-24 px-4 sm:px-6 bg-[#F7F9FB] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column - Dark Gradient Card */}
          <div className="lg:col-span-5 bg-[#16161F] rounded-[24px] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
            {/* Subtle radial glow inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b4b86] opacity-30 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-8 border border-white/5">
                <Shield className="text-[#F43F5E]" size={24} />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-semibold font-sf text-white leading-[1.2] mb-4">
                Frequently<br />Asked<br />Questions
              </h3>
              
              <p className="text-slate-300 text-sm md:text-base font-normal font-pd leading-relaxed mb-6 max-w-[90%]">
                Find answers to common questions about our services
              </p>
              
              <div className="w-16 h-0.5 bg-[#F43F5E] mb-8"></div>
              
              <div className="space-y-4 mb-12">
                {[
                  "Expert Support Team",
                  "24/7 Assistance",
                  "Quick Response Time",
                  "Secure & Confidential Support",
                  "Dedicated Account Assistance"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#F43F5E] shrink-0" />
                    <span className="text-slate-200 text-sm font-pd">{item}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/contact" className="block w-full">
                <button className="w-full bg-[#F43F5E] hover:bg-[#E11D48] text-white font-semibold font-pd py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F43F5E]/20">
                  Contact Support <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column - Accordion List */}
          <div className="lg:col-span-7 flex flex-col space-y-3 lg:space-y-4">
            {[
              { q: "How do I list my venue?", a: "Registering is easy. Fill out our partner onboarding form with your basic venue details. Our verification team reviews all applications within 24-48 hours to ensure our quality standards are met." },
              { q: "How do I receive leads?", a: "Every inquiry is delivered instantly. We notify you via Real-time App Alerts and Email Alerts. You can also view, track, and manage all your conversations through the Partner Dashboard." },
              { q: "Can I update pricing?", a: "Yes, you have full control. Update your pricing, seasonal availability, event capacity, and high-quality photo gallery at any time through your dashboard." },
              { q: "Is there a listing fee?", a: "We offer several ways to grow. From organic free listings with standard visibility to premium growth plans that guarantee high-intent lead volume. Contact us to find your perfect fit." },
              { q: "Do you offer premium placements?", a: "Yes, we offer premium placements that give your venue top visibility in local search results and priority recommendations to high-intent clients." },
              { q: "How do I get paid for bookings?", a: "Payments are processed securely and sent directly to your linked bank account within 2-3 business days after the event takes place." },
              { q: "What kind of support is available?", a: "You have access to our 24/7 partner support team via chat, email, and phone, plus a dedicated account manager for premium partners." }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-[16px] transition-all duration-150 overflow-hidden ${activeFaq === i ? 'ring-2 ring-[#F43F5E]/20 shadow-md border-transparent' : 'border border-slate-100 shadow-sm hover:border-slate-200'}`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-5 md:p-6 flex items-center justify-between text-left group bg-white"
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors duration-150 ${activeFaq === i ? 'bg-[#F43F5E] text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {i + 1}
                    </div>
                    <span className="text-base md:text-lg font-semibold font-sf text-slate-800 tracking-tight">
                      {f.q}
                    </span>
                  </div>
                  <div className={`shrink-0 transition-transform duration-150 ${activeFaq === i ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown size={20} className="text-[#F43F5E]" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="overflow-hidden bg-white"
                    >
                      <div className="px-5 md:px-6 pb-6 pt-0 md:pl-[72px]">
                        <p className="text-sm text-slate-500 font-normal font-pd leading-relaxed max-w-2xl">
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


     
     
     {/* 12. FINAL CTA - LIGHT CLEAN SHOWCASE */}
     <section className="py-24 md:py-32 px-6 bg-white relative overflow-hidden flex flex-col items-center border-t border-slate-100">
      
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F43F5E]/5 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#3B82F6]/5 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
        
        {/* Clean Flow Diagram */}
        <div className="w-full max-w-3xl mx-auto mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-200 -translate-y-1/2 -z-10"></div>
            
            {[
              { icon: MapPin, label: "Your Venue" },
              { icon: Search, label: "Get Discovered" },
              { icon: MessageSquare, label: "Receive Enquiry" },
              { icon: Users, label: "Connect" },
              { icon: CalendarCheck, label: "Booking" }
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-3 relative bg-white px-2 md:px-0">
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#F43F5E] relative z-10 hover:scale-110 hover:shadow-md transition-all duration-300">
                    <step.icon size={20} />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.1em] text-slate-500 font-semibold font-sf hidden md:block whitespace-nowrap">{step.label}</span>
                </div>
                {i < 4 && (
                  <div className="md:hidden w-px h-6 bg-slate-200 my-1"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F43F5E]/10 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F43F5E] w-max mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]"></div>
          Ready to Grow Your Venue?
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sf tracking-tight leading-[1.1] mb-6 text-slate-900 max-w-3xl">
          Your Next Booking <br className="hidden md:block"/>
          Could <span className="relative inline-block text-[#F43F5E]">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink via-purple-600 to-pd-blue">
              Start Here.
            </span>
            <svg className="absolute w-full h-2 -bottom-1 left-0 text-[#F43F5E]/30" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0,8 Q50,0 100,8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </span>
        </h2>

        {/* Description */}
        <p className="text-slate-500 text-base md:text-lg font-normal font-pd leading-relaxed max-w-2xl mx-auto mb-10">
          Put your venue in front of customers searching for the right space for their next event. Create your PartyDial partner profile, showcase your venue, receive customer enquiries, and manage your opportunities from one place.
        </p>

        {/* Actions */}
        <div className="w-full flex flex-col items-center space-y-8">
          
          <div className="w-full max-w-sm flex flex-col items-center">
            <Link href="/login" className="w-full group">
              <button className="w-full bg-[#F43F5E] hover:bg-[#E11D48] text-white font-semibold font-sf text-base md:text-lg py-4 md:py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(244,63,94,0.3)] hover:shadow-[0_12px_40px_rgba(244,63,94,0.4)] hover:-translate-y-1">
                <span>Become a PartyDial Partner</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            {/* Supporting Microcopy */}
            <p className="text-[11px] md:text-xs text-slate-500 font-medium font-pd mt-4 tracking-wide">
              Quick onboarding · Professional venue profile · Partner dashboard
            </p>
          </div>

        </div>

      </div>
     </section>


     


     


     <AnimatePresence>
      {showSticky && (
        <motion.div
         initial={{ y: 100, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         exit={{ y: 100, opacity: 0 }}
         className="fixed bottom-0 left-0 right-0 p-3 z-50 lg:hidden pointer-events-none"
        >
         <Link href="/signup"className="w-full block text-center py-4 bg-pd-red text-white text-sm rounded-xl shadow-2xl pointer-events-auto">
           LIST YOUR VENUE
         </Link>
        </motion.div>
      )}
     </AnimatePresence>

   </div>
  );
}
