'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, animate } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Search, 
  ArrowRight, 
  Target, 
  Rocket, 
  Phone,
  Star,
  Users, 
  Building2, 
  ChevronRight,
  Award,
  CheckCircle2,
  Gem,
  Globe2,
  Quote,
  TrendingUp,
  Landmark,
  Building,
  Castle,
  Library,
  Waves,
  Cpu,
  GraduationCap,
  Compass,
  LayoutGrid,
  Eye
} from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';

const AnimatedCounter = ({ end, duration = 2, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (isInView && !started && ref.current) {
      setStarted(true);
      const node = ref.current;
      const controls = animate(0, end, {
        duration: duration,
        onUpdate: (value) => {
          node.textContent = Math.floor(value).toLocaleString() + suffix;
        },
        ease: "easeOut"
      });
      return () => controls.stop();
    }
  }, [isInView, end, duration, suffix, started]);

  return <span ref={ref}>0{suffix}</span>;
};

// --- ICON MAPPING FOR CITIES ---
const cityIcons: Record<string, React.ReactNode> = {
  "Mumbai": <Castle size={28} />,
  "Delhi": <Landmark size={28} />,
  "Bangalore": <Cpu size={28} />,
  "Hyderabad": <Compass size={28} />,
  "Chennai": <Waves size={28} />,
  "Kolkata": <Building size={28} />,
  "Pune": <GraduationCap size={28} />,
  "Gurgaon": <Building2 size={28} />,
  "Jaipur": <Gem size={28} />,
  "Lucknow": <Library size={28} />,
  "Chandigarh": <LayoutGrid size={28} />
};

// --- REDESIGNED INFINITE CITY MARQUEE WITH ICONS ---
const InfiniteMarquee = ({ items }: { items: string[] }) => {
  return (
    <div className="relative flex overflow-hidden py-8 bg-white border-y border-slate-100 group select-none">
       <div className="flex whitespace-nowrap">
          {/* First set of items */}
          <motion.div 
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ 
              duration: 50, 
              repeat: Infinity, 
              ease: "linear" 
            }} 
            className="flex flex-shrink-0 items-center"
          >
             {items.map((city, i) => (
               <div key={i} className="flex items-center gap-6 px-16 group/item">
                  <div className="text-slate-200 group-hover/item:text-pd-red transition-all duration-500 transform group-hover/item:scale-125 group-hover/item:-rotate-12">
                     {cityIcons[city] || <Building2 size={28} />}
                  </div>
                  <span className="text-xl md:text-3xl font-black text-slate-300 group-hover/item:text-slate-900 transition-all duration-300 cursor-default uppercase italic tracking-widest leading-none">
                    {city}
                  </span>
                  <div className="mx-6 w-1.5 h-1.5 rounded-full bg-pd-red/10 group-hover/item:bg-pd-red transition-all"></div>
               </div>
             ))}
          </motion.div>
          {/* Duplicate set for seamless looping */}
          <motion.div 
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ 
              duration: 50, 
              repeat: Infinity, 
              ease: "linear" 
            }} 
            className="flex flex-shrink-0 items-center"
          >
             {items.map((city, i) => (
               <div key={i} className="flex items-center gap-6 px-16 group/item">
                  <div className="text-slate-200 group-hover/item:text-pd-red transition-all duration-500 transform group-hover/item:scale-125 group-hover/item:-rotate-12">
                     {cityIcons[city] || <Building2 size={28} />}
                  </div>
                  <span className="text-xl md:text-3xl font-black text-slate-300 group-hover/item:text-slate-900 transition-all duration-300 cursor-default uppercase italic tracking-widest leading-none">
                    {city}
                  </span>
                  <div className="mx-6 w-1.5 h-1.5 rounded-full bg-pd-red/10 group-hover/item:bg-pd-red transition-all"></div>
               </div>
             ))}
          </motion.div>
       </div>
    </div>
  );
};

export default function AboutUs() {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" as const }
  };

  const steps = [
    { title: "Search Venues", desc: "Browse thousands of verified party halls, banquets, and resorts in your city.", icon: <Search size={22} /> },
    { title: "Get Quick Quotes", desc: "Select your favorites and receive instant pricing directly from venue owners.", icon: <Rocket size={22} /> },
    { title: "Finalize & Party", desc: "Confirm your booking directly with the venue and host your perfect event.", icon: <Star size={22} /> }
  ];

  const values = [
    { title: "100% Verified", desc: "We personally visit and verify every venue listed on our platform.", icon: <ShieldCheck size={26} /> },
    { title: "Zero Brokerage", desc: "You talk directly to the venue owners. No hidden fees or commissions.", icon: <Zap size={26} /> },
    { title: "Direct Contact", desc: "Get direct phone numbers and manager access for every single venue.", icon: <Phone size={26} /> },
    { title: "Best Price", desc: "Our partners guarantee the best rates when booked through our platform.", icon: <Award size={26} /> }
  ];

  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Gurgaon", "Jaipur", "Lucknow", "Chandigarh"];

  const stories = [
    { name: "Rahul Sharma", role: "Wedding Planner", quote: "Finding a premium banquet during peak wedding season was a nightmare. PartyDial saved me 48 hours of calling.", icon: <Gem size={20}/> },
    { name: "Anita Kapoor", role: "Venue Owner", quote: "As a hotel manager, the direct leads we get here are of the highest quality. Zero commission is the real game-changer.", icon: <TrendingUp size={20}/> },
    { name: "Vikram Mehta", role: "Corporate Event Head", quote: "The transparency is refreshing. I could talk directly to the owners and negotiate the best package for our summit.", icon: <CheckCircle2 size={20}/> },
    { name: "Sanjay Gupta", role: "Business Owner", quote: "PartyDial&apos;s verified badge gives our venue immediate authority. We&apos;ve seen a 40% jump in inquiries.", icon: <Building2 size={20}/> },
    { name: "Meera Reddy", role: "Individual Host", quote: "I wanted a safe place for my daughter&apos;s first birthday. The direct owner contact made me feel so secure.", icon: <Users size={20}/> }
  ];

  return (
    <main className="bg-white min-h-screen text-slate-700 font-sans leading-relaxed selection:bg-pd-red/10 selection:text-pd-red">
      
      {/* 1. HERO */}
      <section className="pt-20 pb-10 px-6 lg:pt-36 lg:pb-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <span className="inline-block bg-pd-red/10 text-pd-red text-[10px] md:text-xs font-bold px-3 py-1 rounded-full mb-4 md:mb-6 uppercase tracking-wider">Est. 2026 • India&apos;s #1 Venue Finder</span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight md:leading-[1.15] mb-4 md:mb-8 tracking-tight">
              Finding the Perfect <br /> 
              <span className="text-pd-red">Venue</span> Just Got <br /> 
              A Whole Lot Easier.
            </h1>
            <p className="text-sm md:text-lg text-slate-500 font-medium mb-6 md:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed text-justify lg:text-left">
              PartyDial is India&apos;s most trusted discovery platform for finding wedding halls, banquet venues, and party resorts. We connect you directly with owners for transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/categories" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white px-8 py-3.5 md:py-4 rounded-xl font-bold text-sm md:text-base shadow-lg transition-all active:scale-95">Discover Venues</button>
              </Link>
              <button className="w-full sm:w-auto bg-white border border-slate-200 px-8 py-3.5 md:py-4 rounded-xl font-bold text-sm text-slate-600 transition-all active:scale-95 hover:border-slate-300">Learn More</button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full lg:w-1/2 relative h-[250px] md:h-[500px] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <Image src="/about/hero-bg.png" alt="Happy Event" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 p-4 md:p-6 bg-white/95 backdrop-blur-md rounded-xl md:rounded-2xl shadow-xl flex items-center gap-3 md:gap-4 border border-white/20">
               <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-pd-red flex items-center justify-center text-white shadow-lg"><CheckCircle2 size={16} className="md:w-6 md:h-6" /></div>
               <div>
                  <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Expert Transparency</p>
                  <p className="text-xs md:text-lg font-bold text-slate-900 whitespace-nowrap leading-none">100% Verified Venues</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS */}
      <section className="py-8 md:py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-16">
             {[
               { label: "Verified Venues", val: 5000, suffix: "+" },
               { label: "Monthly Users", val: 100000, suffix: "+" },
               { label: "Cities In India", val: 50, suffix: "+" },
               { label: "Partner Hosts", val: 8000, suffix: "+" }
             ].map((s, i) => (
                <div key={i} className="text-center group">
                   <h3 className="text-xl md:text-4xl font-black text-slate-900 mb-1 group-hover:text-pd-red transition-colors">
                     <AnimatedCounter end={s.val} suffix={s.suffix} />
                   </h3>
                   <p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                </div>
             ))}
           </div>
        </div>
      </section>

      {/* 3. CITY MARQUEE WITH BUILDING ICONS */}
      <section className="py-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-4 text-center flex flex-col md:flex-row items-center justify-center gap-3">
           <Globe2 size={14} className="text-pd-red" />
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Finding celebration spaces in your <span className="text-slate-900 italic opacity-80 border-b border-pd-red/20">favorite cities</span></p>
        </div>
        <InfiniteMarquee items={cities} />
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-10 md:py-16 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 mb-2">How It <span className="text-pd-red italic opacity-80">Works</span></h2>
            <p className="text-[10px] md:text-xs text-slate-500 max-w-xl mx-auto italic">Book your dream venue in three simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative">
             {steps.map((step, i) => (
               <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.2 }} className="relative bg-white p-6 md:p-8 rounded-xl md:rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 text-center group">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-pd-red/5 flex items-center justify-center text-pd-red mx-auto mb-4 group-hover:bg-pd-red group-hover:text-white transition-all">
                    {step.icon}
                  </div>
                  <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed italic">{step.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* 5. STORY */}
      <section className="py-12 md:py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
            <div className="w-full lg:w-1/2 relative group">
               <motion.div 
                 initial={{ opacity: 0, x: -30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="relative h-[250px] md:h-[500px] rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl"
               >
                 <Image src="/about/office.png" alt="Our Team" fill className="object-cover brightness-105" />
               </motion.div>
            </div>
            <div className="w-full lg:w-1/2 text-center lg:text-left">
               <motion.div {...fadeUp}>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4 md:mb-6 leading-tight">Expert Transparency <br /><span className="text-pd-purple italic">In Every Event.</span></h2>
                  <p className="text-xs md:text-base text-slate-500 font-medium leading-relaxed mb-4 md:mb-6 italic border-l-2 md:border-l-4 border-pd-purple pl-4 lg:pl-6 leading-relaxed text-justify lg:text-left">
                    Every grand celebration starts with a great space. We realized that finding that space was filled with hidden commissions and decided to change that forever.
                  </p>
                  <p className="text-xs md:text-base text-slate-600 font-medium mb-6 md:mb-8 text-justify lg:text-left transition-all">
                    Today, PartyDial helps millions across India discover high-quality venues directly. From corporate meetings to grand weddings.
                  </p>
                  <div className="grid grid-cols-2 gap-3 md:gap-8">
                     {["Verified First", "Best Rates"].map((item, i) => (
                       <div key={i} className="flex gap-2 items-center justify-center lg:justify-start">
                          <CheckCircle2 className="text-pd-red" size={16} />
                          <span className="text-[10px] md:text-sm font-bold text-slate-800 uppercase tracking-widest">{item}</span>
                       </div>
                     ))}
                  </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MISSION & VISION */}
      <section className="py-10 md:py-16 bg-slate-950 text-white rounded-3xl md:rounded-[3rem] mx-4 lg:mx-10 relative overflow-hidden mb-8 md:my-12">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-pd-red/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
           
           <div className="text-center mb-8 md:mb-10">
              <span className="inline-block bg-white/5 text-pd-red text-[8px] font-black px-3 py-1 rounded-full mb-3 uppercase tracking-widest border border-white/5">The North Star</span>
              <h2 className="text-xl md:text-4xl font-black tracking-tight leading-none italic uppercase">Democratizing Event <span className="text-pd-red">Discovery.</span></h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
              <motion.div {...fadeUp} className="group relative p-6 md:p-8 bg-white/[0.02] rounded-2xl border border-white/10 hover:border-pd-red/30 transition-all overflow-hidden flex flex-col justify-between min-h-[200px] md:min-h-[250px]">
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-1000 text-pd-red"><Target size={150} /></div>
                 <div>
                    <div className="w-8 h-8 rounded-lg bg-pd-red/10 flex items-center justify-center text-pd-red mb-4 border border-pd-red/20"><Target size={16} /></div>
                    <h3 className="text-base md:text-xl font-black mb-2 italic uppercase tracking-tighter">Our Mission</h3>
                    <p className="text-[10px] md:text-sm text-white/50 font-medium leading-relaxed pr-2">
                       Eliminate the broker-bottleneck in India via a high-tech platform for planners and hosts.
                    </p>
                 </div>
                 <div className="mt-4 flex items-center gap-2">
                    <div className="w-6 h-1 bg-pd-red rounded-full"></div>
                    <span className="text-[8px] uppercase font-black tracking-widest text-pd-red">Transparency</span>
                 </div>
              </motion.div>

              <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="group relative p-6 md:p-8 bg-white/[0.02] rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all overflow-hidden flex flex-col justify-between min-h-[200px] md:min-h-[250px]">
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-1000 text-emerald-400"><Eye size={150} /></div>
                 <div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-400/20"><Eye size={16} /></div>
                    <h3 className="text-base md:text-xl font-black mb-2 italic uppercase tracking-tighter text-emerald-400">Our Vision</h3>
                    <p className="text-[10px] md:text-sm text-white/50 font-medium leading-relaxed pr-2">
                       The search standard for celebrations in India—where every event finds its home through trust.
                    </p>
                 </div>
                 <div className="mt-4 flex items-center gap-2">
                    <div className="w-6 h-1 bg-emerald-400 rounded-full"></div>
                    <span className="text-[8px] uppercase font-black tracking-widest text-emerald-400">Total Trust</span>
                 </div>
              </motion.div>
           </div>

           <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="mt-6 p-4 md:p-8 bg-white/[0.01] rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
                 <div className="w-12 h-12 rounded-xl bg-pd-red flex-shrink-0 flex items-center justify-center text-white shadow-xl">
                    <Quote size={24} />
                 </div>
                 <div>
                    <p className="text-sm md:text-xl font-bold tracking-tight mb-2 text-white/90 italic leading-snug">"We curate trust for your most precious moments."</p>
                    <span className="text-[8px] font-black uppercase tracking-widest text-pd-red">The Founders Board</span>
                 </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* 7. SUCCESS STORIES (INFINITE CAROUSEL) */}
      <section className="py-12 md:py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto mb-10 text-center">
            <h2 className="text-xl md:text-4xl font-extrabold text-slate-900 mb-3 uppercase tracking-tight italic">Built for <span className="text-pd-red">Success.</span></h2>
            <p className="text-[10px] md:text-sm text-slate-500 font-semibold max-w-xl mx-auto italic">Hear from those who&apos;ve transformed their celebration journey.</p>
        </div>
        
        <div className="relative flex overflow-hidden py-10 group select-none">
           <div className="flex whitespace-nowrap group-hover:[animation-play-state:paused]">
              {/* Set 1 */}
              <motion.div 
                initial={{ x: 0 }}
                animate={{ x: "-100%" }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="flex flex-shrink-0 items-center gap-6 px-3 md:px-6"
              >
                 {stories.map((s, i) => (
                   <div key={i} className="w-[280px] md:w-[400px] whitespace-normal bg-slate-50 border border-slate-100 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:shadow-2xl hover:border-pd-red/20 transition-all group/card flex flex-col justify-between min-h-[180px] md:min-h-[240px]">
                      <div>
                         <Quote size={24} className="text-pd-red/20 mb-4 group-hover/card:text-pd-red transition-colors" />
                         <p className="text-[11px] md:text-sm text-slate-600 font-medium leading-relaxed italic mb-6 line-clamp-4">"{s.quote}"</p>
                      </div>
                      <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-900 border-2 border-white shadow-md text-white flex items-center justify-center text-xs font-bold uppercase">{s.name.charAt(0)}</div>
                            <div>
                               <h4 className="font-bold text-slate-900 text-[10px] md:text-xs leading-none mb-1">{s.name}</h4>
                               <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{s.role}</p>
                            </div>
                         </div>
                         <div className="text-pd-red/30 group-hover/card:text-pd-red transition-all transform group-hover/card:scale-110">
                            {s.icon}
                         </div>
                      </div>
                   </div>
                 ))}
              </motion.div>
              {/* Set 2 */}
              <motion.div 
                initial={{ x: 0 }}
                animate={{ x: "-100%" }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="flex flex-shrink-0 items-center gap-6 px-3 md:px-6"
              >
                 {stories.map((s, i) => (
                   <div key={i} className="w-[280px] md:w-[400px] whitespace-normal bg-slate-50 border border-slate-100 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:shadow-2xl hover:border-pd-red/20 transition-all group/card flex flex-col justify-between min-h-[180px] md:min-h-[240px]">
                      <div>
                         <Quote size={24} className="text-pd-red/20 mb-4 group-hover/card:text-pd-red transition-colors" />
                         <p className="text-[11px] md:text-sm text-slate-600 font-medium leading-relaxed italic mb-6 line-clamp-4">"{s.quote}"</p>
                      </div>
                      <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-900 border-2 border-white shadow-md text-white flex items-center justify-center text-xs font-bold uppercase">{s.name.charAt(0)}</div>
                            <div>
                               <h4 className="font-bold text-slate-900 text-[10px] md:text-xs leading-none mb-1">{s.name}</h4>
                               <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{s.role}</p>
                            </div>
                         </div>
                         <div className="text-pd-red/30 group-hover/card:text-pd-red transition-all transform group-hover/card:scale-110">
                            {s.icon}
                         </div>
                      </div>
                   </div>
                 ))}
              </motion.div>
           </div>
        </div>
      </section>

      {/* 8. VALUES */}
      <section className="py-10 md:py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center border p-6 md:p-10 rounded-2xl bg-slate-50 border-slate-100">
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-2xl font-extrabold mb-1 text-slate-900">Why thousands trust <span className="text-pd-red">Us</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all group">
                 <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-pd-red/5 flex items-center justify-center text-pd-red mb-2 mx-auto">{v.icon}</div>
                 <h3 className="text-[9px] md:text-xs font-bold mb-1 text-slate-800">{v.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORPORATE OWNERSHIP */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-100 px-6">
        <div className="max-w-4xl mx-auto text-center">
           <Building2 size={40} className="text-pd-red mx-auto mb-6" />
           <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-6">Corporate <span className="text-pd-red">Foundation</span></h2>
           <p className="text-sm md:text-lg text-slate-600 font-medium leading-relaxed mb-10 italic">
             PartyDial is a flagship discovery engine owned and operated by <strong>Preet Tech (OPC) Private Limited</strong>. 
             We are committed to building a transparent digital ecosystem for India's event industry. 
             All billing, compliance, and platform operations are managed exclusively by Preet Tech, ensuring a secure and reliable experience for all our users and partners.
           </p>
           <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="px-4 py-2 bg-white rounded-full border border-slate-200">Preet Tech (OPC) Pvt. Ltd.</span>
              <span className="px-4 py-2 bg-white rounded-full border border-slate-200">ISO Standard Tracking</span>
              <span className="px-4 py-2 bg-white rounded-full border border-slate-200">Corporate HQ: Dehradun</span>
           </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="py-10 md:py-16 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-lg md:text-2xl font-extrabold text-slate-900 italic opacity-80 underline decoration-pd-red/10">Common Questions</h2>
          </div>
          <div className="space-y-2">
             {[
               { q: "Is your platform free to use?", a: "Yes, PartyDial is 100% free for planners. No commissions." },
               { q: "How do you verify the venues?", a: "Our city relationship managers personally visit each venue for verification." },
               { q: "Can I manage my own profile?", a: "Absolutely. Venue owners get a dedicated dashboard to update details." }
             ].map((item, i) => (
               <details key={i} className="group p-3 md:p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer overflow-hidden transition-all">
                  <summary className="list-none flex items-center justify-between text-[10px] md:text-xs font-bold text-slate-950">
                     {item.q}
                     <ChevronRight size={14} className="group-open:rotate-90 transition-transform text-slate-300" />
                  </summary>
                  <p className="pt-2 text-[9px] md:text-xs text-slate-500 font-medium italic">{item.a}</p>
               </details>
             ))}
          </div>
        </div>
      </section>

      {/* 10. DUAL CTA */}
      <section className="pb-12 md:pb-16 px-4 md:px-6">
        <div className="max-w-[1280px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-100"
          >
             {/* Planner Side */}
             <div className="flex-1 p-6 md:p-10 relative overflow-hidden flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-50">
                <div className="relative z-10 text-center md:text-left">
                   <div className="w-8 h-8 rounded-xl bg-pd-red/10 flex items-center justify-center text-pd-red mb-4 mx-auto md:mx-0"><Users size={16} /></div>
                   <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-tight uppercase italic underline decoration-pd-red/10">Plan with <br /><span className="text-pd-red">Confidence.</span></h2>
                   <p className="text-[9px] md:text-xs text-slate-500 font-medium mb-6 max-w-sm mx-auto md:mx-0 italic">Verified venues with zero brokerage fees.</p>
                   <Link href="/categories" className="w-full sm:w-auto inline-block">
                    <button className="w-full sm:w-auto bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold text-[9px] md:text-xs flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 transition-all">Discover Venues <ArrowRight size={12}/></button>
                   </Link>
                </div>
             </div>

             {/* Partner Side */}
             <div className="flex-1 p-6 md:p-10 relative overflow-hidden flex flex-col justify-center bg-slate-900 text-white">
                <div className="relative z-10 text-center md:text-left">
                   <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-pd-red mb-4 mx-auto md:mx-0"><Building2 size={16} /></div>
                   <h2 className="text-xl md:text-3xl font-extrabold mb-2 leading-tight uppercase italic underline decoration-white/10">Grow Your <br /><span className="text-pd-red">Business.</span></h2>
                   <p className="text-[9px] md:text-xs text-white/50 font-medium mb-6 max-w-sm mx-auto md:mx-0 italic">List your venue for free today.</p>
                   <Link href="/register-venue" className="w-full sm:w-auto inline-block">
                    <button className="w-full sm:w-auto bg-pd-red text-white px-6 py-2.5 rounded-lg font-bold text-[9px] md:text-xs flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 transition-all">List Your Venue <ArrowRight size={12}/></button>
                   </Link>
                </div>
             </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
