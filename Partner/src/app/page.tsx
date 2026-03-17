'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowUpRight,
  Shield,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

// --- DATA ---

const trustedStats = [
  { label: "Venues Listed", value: "500+", icon: <Building2 size={16} /> },
  { label: "Party Inquiries", value: "10,000+", icon: <Users size={16} /> },
  { label: "Cities Covered", value: "7 Major Cities", icon: <Globe size={16} /> }
];

const howItWorks = [
  { title: "Register", desc: "Submit basic details.", step: "1" },
  { title: "Profile", desc: "Add photos & prices.", step: "2" },
  { title: "Inquiries", desc: "Get verified leads.", step: "3" },
  { title: "Bookings", desc: "Close the deal.", step: "4" }
];

const venueTypes = [
  "Banquet Halls", "Hotels", "Restaurants", "Cafes", "Party Lawns", "Resorts", 
  "Farmhouses", "Rooftop Venues", "Clubs & Lounges", "Community Halls", 
  "Marriage Gardens", "Convention Centers"
];

const eventCategories = [
  { name: "Birthdays", icon: "🎂" },
  { name: "Weddings", icon: "💍" },
  { name: "Corporate", icon: "🏢" },
  { name: "Anniversaries", icon: "🥂" },
  { name: "Pre-Wedding", icon: "✨" },
  { name: "Kitty Party", icon: "👩‍🤝‍👩" },
  { name: "Baby Shower", icon: "🧸" },
  { name: "Engagement", icon: "💎" }
];

export default function PartnerLandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 selection:bg-pd-pink selection:text-white">
      
      {/* 1. HERO SECTION (Wider & Taller) */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 py-8 lg:py-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-8">
              <Shield size={12} className="text-pd-blue" /> Verified Partner Program
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#0F172A] leading-tight mb-8 tracking-tight italic">
              Get More <span className="pd-gradient-text uppercase">Party Bookings</span> <br /> 
              for Your Venue
            </h1>
            <p className="text-base md:text-lg text-slate-500 font-medium mb-12 max-w-xl leading-relaxed">
              List your venue on PartyDial and receive verified, high-intent party inquiries from customers in your city daily.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link href="#register" className="pd-btn-primary !text-sm !px-12 !py-4 bg-pd-red lowercase italic tracking-normal">
                list your venue
              </Link>
              <Link href="#how-it-works" className="px-12 py-4 bg-white border border-slate-200 text-slate-700 rounded-[12px] text-sm font-bold hover:bg-slate-50 transition-all">
                Get Started
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
          </div>
          
          <div className="relative">
             <div className="grid grid-cols-2 gap-6 scale-105 lg:scale-110 origin-center">
               <div className="space-y-6">
                 <div className="relative h-56 rounded-[32px] overflow-hidden shadow-2xl hover:scale-[1.02] transition-all duration-500 group">
                   <Image src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800" alt="Venue" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                 </div>
                 <div className="relative h-72 rounded-[32px] overflow-hidden shadow-2xl hover:scale-[1.02] transition-all duration-500 group">
                   <Image src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" alt="Party" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                 </div>
               </div>
               <div className="space-y-6 pt-16">
                 <div className="relative h-72 rounded-[32px] overflow-hidden shadow-2xl hover:scale-[1.02] transition-all duration-500 group">
                   <Image src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800" alt="Event" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                 </div>
                 <div className="relative h-56 rounded-[32px] overflow-hidden shadow-2xl hover:scale-[1.02] transition-all duration-500 group">
                   <Image src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800" alt="Gala" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                 </div>
               </div>
             </div>
             {/* Dynamic Badge (Larger) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xl p-6 rounded-[32px] shadow-strong-pd border border-white/50 flex items-center gap-4 group hover:scale-105 transition-all cursor-default z-20">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20"><Zap size={24} /></div>
               <div className="text-[12px] font-black text-slate-800 leading-tight italic uppercase tracking-tighter">REAL-TIME <br /> <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Verified Inquiries</span></div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED BY SECTION */}
      <section className="py-12 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-y border-slate-50 py-10">
            {trustedStats.map((stat, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-pd-pink transition-colors">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 leading-none mb-1">{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-[1440px] mx-auto lg:px-12">
          <div className="text-center mb-16">
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-pd-pink mb-4">Onboarding Process</h2>
             <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">Simple 4-Step Registration</h3>
             <div className="w-12 h-1 bg-pd-pink mx-auto rounded-full opacity-30"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <div key={i} className="p-6 pd-card group hover:-translate-y-1">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 font-bold text-lg mb-6 group-hover:bg-pd-pink group-hover:text-white transition-all">
                  {item.step}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-tight">{item.title}</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHO CAN JOIN */}
      <section className="py-20 px-6 bg-[#0F172A] text-white">
        <div className="max-w-[1440px] mx-auto lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-8 tracking-tight italic">Who Can Join <br /><span className="text-pd-blue">Our Platform?</span></h2>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                   {venueTypes.map((type, i) => (
                     <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-pd-pink">
                           <CheckCircle2 size={12} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">{type}</span>
                     </div>
                   ))}
                </div>
             </div>
             <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
               <Image src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200" alt="Banquets" fill className="object-cover" />
               <div className="absolute inset-0 bg-pd-blue/20 mix-blend-overlay"></div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. EVENT CATEGORIES */}
      <section className="py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto lg:px-12">
           <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-pd-pink mb-2">Demand Categories</h2>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-none italic uppercase">Events Customers Search For</h3>
              </div>
              <p className="text-xs text-slate-400 font-medium max-w-xs">High demand event leads generated daily across India.</p>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {eventCategories.map((evt, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center group cursor-pointer hover:bg-white hover:shadow-lg transition-all">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{evt.icon}</div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-700 leading-none">{evt.name}</h4>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. MERCHANT FEATURES (Laptop UI) */}
      <section className="py-24 px-6">
        <div className="max-w-[1440px] mx-auto lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div>
              <h3 className="text-2xl md:text-4xl font-extrabold text-[#0F172A] mb-10 leading-snug tracking-tighter italic">Professional <br /> Venue Tools</h3>
              <div className="space-y-6">
                 {[
                   { title: "Dashboard", desc: "Manage leads, gallery & profile.", icon: <LayoutDashboard size={14} /> },
                   { title: "Notifications", desc: "Real-time SMS & WhatsApp alerts.", icon: <Zap size={14} /> },
                   { title: "Verified Contacts", desc: "Access direct customer details.", icon: <Phone size={14} /> },
                   { title: "Booking Calendar", desc: "Track event dates digitally.", icon: <Calendar size={14} /> },
                   { title: "Smart Analytics", desc: "Monitor view & lead conversion.", icon: <PieChart size={14} /> }
                 ].map((f, i) => (
                   <div key={i} className="flex gap-4 items-start group">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-pd-pink group-hover:text-white transition-all">
                         {f.icon}
                      </div>
                      <div>
                         <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest leading-none mb-1 italic">{f.title}</h5>
                         <p className="text-[10px] text-slate-400 font-medium leading-none leading-relaxed">{f.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="relative perspective-1000">
              <div className="p-4 bg-slate-200 rounded-[32px] shadow-2xl relative overflow-hidden group">
                 <div className="bg-slate-900 rounded-[20px] aspect-video flex flex-col items-center justify-center border-4 border-slate-800 relative z-10">
                    <div className="p-6 text-white w-full h-full flex flex-col">
                       <div className="h-4 w-24 bg-white/10 rounded mb-8"></div>
                       <div className="grid grid-cols-3 gap-3 mb-8">
                          {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl border border-white/5"></div>)}
                       </div>
                       <div className="flex-1 bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col justify-end">
                          <div className="h-3 w-1/2 bg-pd-pink rounded mb-2"></div>
                          <div className="h-3 w-1/3 bg-white/10 rounded"></div>
                       </div>
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-pd-pink/10 blur-[100px]"></div>
              </div>
           </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE (Feature Grid) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1440px] mx-auto lg:px-12">
          <div className="text-center mb-16">
            <h3 className="text-2xl font-black text-slate-900 italic uppercase">Why Choose PartyDial?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "More Bookings", desc: "Fill your calendar consistently.", icon: <TrendingUp /> },
              { title: "Local Inquiries", desc: "Leads from your specific city.", icon: <MapPin /> },
              { title: "Verified Leads", desc: "Authentic customer requirements.", icon: <ShieldCheck /> },
              { title: "Higher Visibility", desc: "Rank top on search results.", icon: <Star /> },
              { title: "Simplified Tech", desc: "No complex software involved.", icon: <Smartphone /> },
              { title: "Partner Support", desc: "Dedicated merchant handlers.", icon: <Users /> }
            ].map((f, i) => (
              <div key={i} className="p-8 pd-card hover:border-pd-blue hover:border-opacity-30 transition-all cursor-default">
                 <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-pd-blue mb-4">
                    {React.cloneElement(f.icon as React.ReactElement, { size: 14 })}
                 </div>
                 <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-2 italic leading-none">{f.title}</h4>
                 <p className="text-[10px] text-slate-400 font-medium leading-relaxed leading-none">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. HIGH QUALITY LEADS (Process) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
           <div className="text-center mb-16">
             <h3 className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase mb-2 leading-none">High Quality Lead Flow</h3>
             <p className="text-xs text-slate-400 font-medium">Filtered, verified, and sent directly to you.</p>
           </div>
           
           <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-white p-12 rounded-[40px] shadow-sm border border-slate-100">
              <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-2xl shadow-sm">👤</div>
                 <span className="text-[9px] font-black uppercase text-slate-400">Customer</span>
              </div>
              <ArrowRight size={20} className="text-pd-pink hidden md:block" />
              <div className="flex flex-col items-center gap-2">
                 <div className="px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl italic">PartyDial</div>
                 <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Verification</span>
              </div>
              <ArrowRight size={20} className="text-pd-blue hidden md:block" />
              <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-2xl shadow-sm">🏨</div>
                 <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Venue</span>
              </div>
           </div>
        </div>
      </section>

      {/* 9. SUCCESS STORIES (Photos) */}
      <section className="py-20 px-6">
        <div className="max-w-[1440px] mx-auto lg:px-12">
          <div className="text-center mb-16">
             <h3 className="text-2xl font-black text-slate-900 italic uppercase leading-none">Success Stories</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {[
               { name: "Grand Imperial", text: "PartyDial helped us increase weekend bookings by 35% in 6 months.", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=200" },
               { name: "The Sky Lawn", text: "Their dashboard makes lead management effortless for our sales team.", img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=200" }
             ].map((t, i) => (
               <div key={i} className="flex gap-8 items-center bg-white p-8 rounded-[32px] border border-slate-100">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg grayscale">
                    <Image src={t.img} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold italic text-slate-700 leading-relaxed mb-4 ">“{t.text}”</p>
                    <div className="text-[10px] font-black uppercase text-pd-pink italic tracking-widest">— {t.name}</div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 10. EXPANSION (Compact) */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-[1440px] mx-auto lg:px-12 flex flex-col lg:flex-row items-center gap-16">
           <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 italic uppercase mb-8 leading-none">Expanding Nationally</h3>
              <div className="flex flex-wrap gap-3">
                 {["Delhi", "Mumbai", "Bangalore", "Dehradun", "Chandigarh", "Jaipur", "Lucknow"].map((c, i) => (
                   <div key={i} className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 hover:border-pd-blue hover:text-pd-blue transition-colors">
                      <MapPin size={10} /> {c}
                   </div>
                 ))}
              </div>
           </div>
           <div className="flex-1 relative aspect-video rounded-3xl overflow-hidden bg-slate-200 shadow-xl opacity-80 group">
              <Image src="https://images.unsplash.com/photo-1524492459426-ed409f58d047?auto=format&fit=crop&q=80&w=1200" alt="Map" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
           </div>
        </div>
      </section>

      {/* 11. FAQ (Smaller Accordion) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-widest">Common Questions</h3>
          </div>
          <div className="space-y-3">
             {[
               { q: "How do I list my venue?", a: "Fill the form below and verify details." },
               { q: "How do I receive inquiries?", a: "Direct alerts on WhatsApp & your Partner dashboard." },
               { q: "Is my number visible?", a: "Only once verified and confirmed by your business." },
               { q: "Can I update details anytime?", a: "Yes, full access to merchant profile management." }
             ].map((f, i) => (
               <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
                  <button 
                   onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                   className="w-full flex items-center justify-between p-5 text-left hover:bg-white transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-800 italic uppercase tracking-tight">{f.q}</span>
                    <ChevronDown size={14} className={`text-slate-300 transition-transform ${activeFaq === i ? 'rotate-180 text-pd-pink' : ''}`} />
                  </button>
                  {activeFaq === i && <div className="p-5 pt-0 text-[10px] text-slate-400 font-medium leading-relaxed leading-none">{f.a}</div>}
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 12. FINAL CALL TO ACTION */}
      <section className="py-16 px-6">
        <div className="max-w-[1440px] mx-auto lg:px-12">
           <div className="relative rounded-[40px] overflow-hidden p-16 md:p-32 text-center bg-slate-900 shadow-2xl">
              <Image src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=2000" fill alt="Hall" className="object-cover opacity-20" />
              <div className="relative z-10">
                 <h3 className="text-3xl md:text-5xl font-black text-white italic mb-10 leading-tight tracking-tight uppercase">Start Receiving <br /> Bookings Now</h3>
                 <div className="flex flex-wrap justify-center gap-6">
                    <Link href="#register" className="pd-btn-primary !text-[11px] !px-12 !py-4 shadow-xl">List Your Venue</Link>
                    <Link href="#register" className="px-12 py-4 bg-white/5 border border-white/10 rounded-[10px] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md">Register Now</Link>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 13. REGISTRATION FORM (Small & Professional) */}
      <section id="register" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto bg-white rounded-[40px] border border-slate-100 p-12 md:p-20 shadow-sm">
           <div className="text-center mb-16">
              <h2 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase leading-none">Partner Onboarding</h2>
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest italic">Join India's Most Trusted Network</p>
           </div>
           
           <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Form Submitted!"); }}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-2">Venue Business Name</label>
                   <input required className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold focus:bg-white focus:border-pd-blue outline-none transition-all shadow-sm" placeholder="e.g. Grand Banquet Hall" />
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-2">Owner Full Name</label>
                   <input required className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold focus:bg-white focus:border-pd-blue outline-none transition-all shadow-sm" placeholder="e.g. Rahul Verma" />
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-2">City / Location</label>
                   <input required className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold focus:bg-white focus:border-pd-blue outline-none transition-all shadow-sm" placeholder="e.g. New Delhi" />
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-2">Venue Type</label>
                   <select className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold focus:bg-white focus:border-pd-blue outline-none transition-all shadow-sm appearance-none cursor-pointer">
                      <option>Select Option</option>
                      {venueTypes.map((v, i) => <option key={i}>{v}</option>)}
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-2">Guest Capacity</label>
                   <input required type="number" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold focus:bg-white focus:border-pd-blue outline-none transition-all shadow-sm" placeholder="e.g. 500" />
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-2">Phone Number</label>
                   <input required type="tel" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold focus:bg-white focus:border-pd-blue outline-none transition-all shadow-sm" placeholder="+91 XXXX XXXX" />
                </div>
                <div className="space-y-1 md:col-span-2">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-2">Email Address</label>
                   <input required type="email" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold focus:bg-white focus:border-pd-blue outline-none transition-all shadow-sm" placeholder="example@venue.com" />
                </div>
             </div>
             <button className="w-full pd-btn-primary !h-14 !text-[10px] !uppercase !tracking-[0.4em] !italic !rounded-xl">Submit Application <ArrowUpRight className="inline ml-1" size={12} /></button>
           </form>
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer className="py-12 px-6 bg-white border-t border-slate-50">
        <div className="max-w-[1440px] mx-auto lg:px-12 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="relative border-r border-slate-100 pr-10">
              <Image src="/logo.jpg" alt="PartyDial" width={140} height={35} />
              <div className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300 ml-1 mt-1">Merchant Division</div>
           </div>
           <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-slate-400">
             <Link href="#" className="hover:text-pd-pink">Terms</Link>
             <Link href="#" className="hover:text-pd-pink">Privacy</Link>
             <Link href="#" className="hover:text-pd-pink">Support</Link>
           </div>
           <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-200">© 2026 PARTYDIAL TECHNOLOGIES</p>
        </div>
      </footer>

      {/* Sticky Mobile Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 z-50 lg:hidden pointer-events-none">
         <Link href="#register" className="w-full pd-btn-primary block text-center !py-4 shadow-2xl pointer-events-auto">
            LIST YOUR VENUE
         </Link>
      </div>

    </div>
  );
}
