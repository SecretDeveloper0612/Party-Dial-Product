'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Zap, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  Send, 
  Mail, 
  Phone, 
  Upload, 
  X,
  FileText,
  BadgeCheck,
  TrendingUp,
  Camera,
  Play,
  Quote,
  User,
  Plus,
  Minus,
  HelpCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ImageIcon = ({ size }: { size?: number }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);

export default function FreeListingLanding() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    ownerName: '',
    venueName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    venueType: '',
    capacity: '',
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (photos.length + files.length > 5) {
        alert("Maximum 5 photos allowed");
        return;
      }
      setPhotos([...photos, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    const updatedPreviews = [...previews];
    updatedPhotos.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setPhotos(updatedPhotos);
    setPreviews(updatedPreviews);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.ownerName) newErrors.ownerName = "Required";
    if (!formData.venueName) newErrors.venueName = "Required";
    if (!formData.email) newErrors.email = "Required";
    if (!formData.phone) newErrors.phone = "Required";
    if (!formData.address) newErrors.address = "Required";
    if (!formData.pincode) newErrors.pincode = "Required";
    if (photos.length === 0) newErrors.photos = "At least one photo required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
      
      const randomPass = Math.random().toString(36).slice(-8) + 'pd24';
      
      const response = await fetch(`${serverUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: randomPass,
          name: formData.ownerName,
          venueName: formData.venueName,
          ownerName: formData.ownerName,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          venueType: formData.venueType,
          capacity: formData.capacity,
          subscriptionPlan: 'free',
          accessLevel: 'limited'
        }),
      });

      const result = await response.json();
      if (response.ok) {
         setSuccess(true);
         setTimeout(() => router.push('/login?message=check-email'), 3000);
      } else {
         setErrors({ general: result.message || "Registration failed" });
      }
    } catch (err) {
      setErrors({ general: "Connection error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { title: "Boost Local Visibility", desc: "Rank higher in local searches when customers look for wedding venues, party halls, or banquet spaces in your city.", icon: <Building2 /> },
    { title: "Targeted Customer Base", desc: "Reach thousands of active event planners and hosts searching for the perfect location for weddings, birthdays, and corporate events.", icon: <Users /> },
    { title: "Establish Credibility", desc: "Gain customer trust with a verified business profile on PartyDial, India's growing venue discovery platform.", icon: <ShieldCheck /> },
    { title: "Showcase Your Space", desc: "Display high-quality photos, detailed amenities, and capacity info to help customers make an immediate decision.", icon: <Camera /> },
    { title: "Zero Setup Cost", desc: "Start with a 100% free listing. No hidden fees or initial investment required to get your business online.", icon: <TrendingUp /> }
  ];

  const features = [
    { title: "Verified Profile", desc: "Get a dedicated page for your venue with SEO-optimized content.", icon: <FileText /> },
    { title: "HD Photo Gallery", desc: "Upload up to 5 professional photos to highlight your venue's beauty.", icon: <ImageIcon /> },
    { title: "Direct Inquiries", desc: "Receive basic inquiries and let customers find your contact details.", icon: <Phone /> },
    { title: "Amenity List", desc: "Listing of all services like AC, Parking, Catering, and Decor.", icon: <BadgeCheck /> },
    { title: "Lead Dashboard", desc: "Access a basic dashboard to track your profile performance.", icon: <Zap /> }
  ];

  const testimonials = [
    { name: "Rahul Sharma", venue: "The Grand Regency", text: "Starting with a free listing helped us understand the platform's potential. Within weeks, our visibility increased dramatically!", rating: 5 },
    { name: "Anjali Gupta", venue: "Rose Petals Banquet", text: "Simple and professional. It's the best way to get your banquet hall online and start reaching local customers.", rating: 5 },
    { name: "Vikram Singh", venue: "Mountain Resorts", text: "The profile looks premium and it was incredibly easy to set up. A must-have for every venue owner in India.", rating: 4 }
  ];

  const faqs = [
    {
      q: "Is the venue listing really free?",
      a: "Yes! Our basic listing plan is 100% free forever. It includes a basic profile, contact details, and a photo gallery to help you get discovered by customers online."
    },
    {
      q: "How long does it take for my listing to go live?",
      a: "Once you submit your details, our team verifies the information. Usually, your listing becomes active within 24-48 hours."
    },
    {
      q: "Can I update my venue details later?",
      a: "Absolutely! You will receive login credentials for your Vendor Dashboard where you can update photos, capacity, amenities, and contact information anytime."
    },
    {
      q: "What types of venues can I list?",
      a: "You can list Banquet Halls, Hotels, Resorts, Party Lawns, Restaurants, Farmhouses, and any other space that can host events."
    },
    {
      q: "How will I receive leads?",
      a: "With a free listing, customers can see your contact details and contact you directly. For premium lead generation and direct inquiries, you can explore our paid plans."
    }
  ];

  // Schema Markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "PartyDial Free Venue Listing",
    "provider": {
      "@type": "Organization",
      "name": "PartyDial",
      "url": "https://partydial.com"
    },
    "description": "Register your venue for free on PartyDial and reach thousands of customers searching for banquet halls and event spaces.",
    "areaServed": "India",
    "serviceType": "Venue Marketing and Lead Generation"
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* SECTION 1: HERO */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-pd-red/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/4"></div>
           <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-pd-blue/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-block px-4 py-1.5 rounded-full bg-pd-red/10 text-pd-red text-[10px] font-black uppercase tracking-[0.2em] mb-6">Venue Partner Program</span>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
                  List Your <span className="text-pd-red italic">Banquet Hall</span> & Venue for Free
                </h1>
                <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium max-w-lg mx-auto lg:mx-0">
                  Grow your business by reaching thousands of customers searching for wedding venues and party halls on PartyDial every single day.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={scrollToForm}
                    className="bg-slate-900 text-white h-16 px-10 rounded-2xl text-[11px] uppercase tracking-[0.2em] italic font-black shadow-2xl flex items-center justify-center gap-4 hover:bg-pd-pink transition-all"
                  >
                    Start Free Listing <ArrowRight size={20} />
                  </button>
                  <div className="flex items-center gap-3 px-6 py-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                           <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                         </div>
                       ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Joined by 1000+ Partners</span>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="lg:w-1/2 relative">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} 
                 animate={{ opacity: 1, scale: 1 }} 
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl"
               >
                 <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80" alt="Professional Banquet Hall Listing" className="w-full h-auto aspect-video object-cover" />
               </motion.div>
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pd-pink blur-3xl opacity-20 -z-10 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SEO CONTENT SECTION */}
      <section className="py-20 px-6 bg-white border-y border-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 uppercase italic leading-tight">
                Why List Your <span className="text-pd-red">Venue Business</span> on PartyDial?
              </h2>
              <div className="space-y-6 text-slate-600 font-medium italic leading-relaxed">
                <p>
                  In today's digital age, presence is everything. Thousands of people in your city are searching for <b>"wedding venues near me"</b> or <b>"best banquet halls"</b> right now. If your venue isn't online, you're losing significant business to competitors.
                </p>
                <p>
                  PartyDial provides a premium platform for venue owners to showcase their properties. Whether you own a luxury hotel, a cozy restaurant, a majestic resort, or a sprawling party lawn, our platform is designed to put you in front of high-intent customers.
                </p>
                <p>
                  Our <b>Free Venue Listing</b> plan is designed to help small and medium businesses start their digital journey without any upfront cost. You get a professional profile, photo gallery, and direct visibility.
                </p>
              </div>
            </div>
            <div className="bg-slate-50 p-8 md:p-12 rounded-[40px] border border-slate-100">
               <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-4xl font-black text-pd-red mb-2 italic">100%</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Free Registration</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-pd-blue mb-2 italic">50k+</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Monthly Visitors</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-pd-pink mb-2 italic">1k+</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Active Partners</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-emerald-500 mb-2 italic">24/7</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Support Access</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: BENEFITS */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 italic uppercase tracking-tighter">
              The Power of <span className="text-pd-red">Free Listing</span>
            </h2>
            <p className="text-slate-500 font-medium italic mb-8 max-w-2xl mx-auto">Discover how listing your banquet hall or party space for free can transform your lead generation process.</p>
            <div className="w-20 h-1.5 bg-pd-red mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
             {benefits.map((benefit, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-10 rounded-[32px] border border-slate-100 hover:border-pd-red/30 transition-all group shadow-sm"
                >
                   <div className="w-14 h-14 rounded-2xl bg-pd-red/5 flex items-center justify-center text-pd-red mb-8 group-hover:scale-110 transition-transform">
                      {React.cloneElement(benefit.icon as React.ReactElement, { size: 28 })}
                   </div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">{benefit.title}</h3>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium italic">{benefit.desc}</p>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURES */}
      <section className="py-24 px-6 bg-white">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-16">
               <div className="md:w-1/2">
                  <h2 className="text-4xl font-black text-slate-900 mb-8 uppercase italic leading-none">
                     Everything You Need <br /> To <span className="text-pd-pink">Grow Online</span>
                  </h2>
                  <p className="text-slate-500 font-medium italic mb-12 leading-relaxed">
                     Our venue registration platform is built to provide maximum value from day one. List your property, add your details, and let our SEO-friendly profiles do the work for you.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {features.map((feature, i) => (
                        <div key={i} className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-pd-pink/30 hover:shadow-xl transition-all group">
                           <div className="text-pd-pink group-hover:scale-110 transition-transform">{React.cloneElement(feature.icon as React.ReactElement, { size: 20 })}</div>
                           <div>
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-1">{feature.title}</h4>
                              <p className="text-[9px] text-slate-400 font-bold uppercase">{feature.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="md:w-1/2 grid grid-cols-2 gap-4">
                  <div className="space-y-4 translate-y-8">
                     <div className="h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                        <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80" alt="Beautiful Wedding Venue" className="w-full h-full object-cover" />
                     </div>
                     <div className="h-40 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                        <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80" alt="Elegant Reception Hall" className="w-full h-full object-cover" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="h-40 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                        <img src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80" alt="Banquet Table Setting" className="w-full h-full object-cover" />
                     </div>
                     <div className="h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                        <img src="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80" alt="Luxury Party Lawn" className="w-full h-full object-cover" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 5: TESTIMONIALS */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
           <Quote size={200} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
           <div className="text-center mb-20 px-4">
              <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase italic tracking-tighter">Real Success Stories from <span className="text-pd-pink">Our Partners</span></h2>
              <p className="text-slate-400 uppercase tracking-widest font-bold text-xs">Join thousands of venues already benefiting from PartyDial</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                 <div key={i} className="bg-white/5 backdrop-blur-md p-10 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all duration-500 group">
                    <div className="flex items-center gap-2 mb-6">
                       {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} className="fill-pd-pink text-pd-pink" />)}
                    </div>
                    <p className="text-lg font-medium italic text-slate-300 leading-relaxed mb-10 group-hover:text-white">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-black italic text-pd-pink uppercase">
                          {t.name.charAt(0)}
                       </div>
                       <div>
                          <h4 className="font-black italic text-sm">{t.name}</h4>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.venue}</p>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* SECTION 5.5: ABOUT US STORY - VIDEO */}
      <section className="py-24 px-6 bg-white overflow-hidden border-t border-slate-50">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
               <span className="text-pd-red text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Our Story</span>
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-8">
                  Redefining <span className="text-pd-red">Event Planning</span> Together
               </h2>
               <p className="text-slate-500 font-medium italic leading-relaxed mb-8">
                  PartyDial was founded with a single mission: to bridge the gap between stunning venues and the hosts looking for them. We believe every celebration deserves the perfect backdrop, and every venue owner deserves a platform to shine.
               </p>
               <div className="space-y-4">
                  {[
                     "Trusted by 1000+ venue partners across India",
                     "Seamless digital onboarding process",
                     "Direct connection with high-intent hosts",
                     "Transparent, data-driven lead management"
                  ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700 italic">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                           <CheckCircle2 size={12} />
                        </div>
                        {item}
                     </div>
                  ))}
               </div>
            </div>
            <div className="lg:w-1/2">
               <div className="relative aspect-video rounded-[40px] overflow-hidden shadow-2xl group cursor-pointer border-8 border-slate-50">
                  <img src="https://images.unsplash.com/photo-1540575861501-7ad058df328d?auto=format&fit=crop&q=80" alt="About Us Story" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-all duration-500 flex items-center justify-center">
                     <div className="w-24 h-24 rounded-full bg-white text-pd-pink flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play size={32} className="ml-2 fill-pd-pink" />
                     </div>
                  </div>
                  {/* Floating Stat */}
                  <div className="absolute bottom-10 left-10 p-6 bg-white rounded-3xl shadow-xl flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-pd-red/5 text-pd-red flex items-center justify-center">
                        <TrendingUp size={24} />
                     </div>
                     <div>
                        <div className="text-xl font-black text-slate-900 italic leading-none">25k+</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Leads Generated</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 6: FAQ SECTION */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-pd-red text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Information Center</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-4">
              Frequently Asked <span className="text-pd-red">Questions</span>
            </h2>
            <p className="text-slate-500 font-medium italic">Everything you need to know about listing your venue for free on our platform.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-[32px] transition-all overflow-hidden ${openFaq === index ? 'bg-slate-50 border-pd-red/20' : 'bg-white border-slate-100'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left gap-4"
                >
                  <span className="text-sm md:text-base font-black italic text-slate-900">{faq.q}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${openFaq === index ? 'bg-pd-red text-white rotate-45' : 'bg-slate-100 text-slate-400'}`}>
                    <Plus size={18} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-6"
                    >
                      <p className="text-sm text-slate-500 font-medium italic leading-relaxed border-t border-slate-200 pt-4">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-pd-blue/5 rounded-[40px] border border-pd-blue/10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-pd-blue text-white flex items-center justify-center">
                   <HelpCircle size={32} />
                </div>
                <div>
                   <h4 className="text-sm font-black italic text-slate-900">Still have questions?</h4>
                   <p className="text-[11px] text-slate-500 font-medium italic">Our venue experts are here to help you get started.</p>
                </div>
             </div>
             <Link href="/contact" className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest italic hover:bg-pd-blue transition-colors">
                Contact Support
             </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: FORM SECTION */}
      <section ref={formRef} className="py-24 px-6 bg-slate-50 border-t border-slate-100 relative">
         <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[40px] shadow-2xl border border-white p-8 md:p-16 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-pd-pink/10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full"></div>
               
               <div className="text-center mb-12">
                  <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase italic">Create <span className="text-pd-red">Free Listing</span></h2>
                  <p className="text-xs text-slate-400 font-black uppercase tracking-widest italic leading-relaxed">Join India's premiere venue booking network today.</p>
               </div>

               {success ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-16 text-center">
                     <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-8 animate-bounce">
                        <CheckCircle2 size={48} />
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 mb-4 italic">Registration Successful!</h3>
                     <p className="text-slate-500 font-medium italic max-w-md mx-auto leading-relaxed">
                        Your free venue account has been created. <br /> Check your email (<b>{formData.email}</b>) for your login credentials.
                     </p>
                     <p className="mt-8 text-pd-red text-[10px] font-black uppercase tracking-widest animate-pulse">Redirecting to login...</p>
                  </motion.div>
               ) : (
                  <form onSubmit={handleSubmit} className="space-y-10">
                     {errors.general && (
                        <div className="p-4 bg-red-50 text-red-500 text-xs font-black uppercase tracking-widest italic rounded-2xl border border-red-100 flex items-center gap-3">
                           <X size={16} /> {errors.general}
                        </div>
                     )}

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Fields */}
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Owner Name*</label>
                              <div className="relative group">
                                 <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors" />
                                 <input 
                                    type="text" 
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-3xl pl-14 pr-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none" 
                                    placeholder="Enter full name"
                                    value={formData.ownerName}
                                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Venue Name*</label>
                              <div className="relative group">
                                 <Building2 size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors" />
                                 <input 
                                    type="text" 
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-3xl pl-14 pr-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none" 
                                    placeholder="e.g. Sapphire Gardens"
                                    value={formData.venueName}
                                    onChange={(e) => setFormData({...formData, venueName: e.target.value})}
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Email Address*</label>
                              <div className="relative group">
                                 <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors" />
                                 <input 
                                    type="email" 
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-3xl pl-14 pr-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none" 
                                    placeholder="business@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Phone Number*</label>
                              <div className="relative group">
                                 <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors" />
                                 <input 
                                    type="tel" 
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-3xl pl-14 pr-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none" 
                                    placeholder="+91 9876543210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Location / Address*</label>
                              <div className="relative group">
                                 <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors" />
                                 <input 
                                    type="text" 
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-3xl pl-14 pr-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none" 
                                    placeholder="Venue full address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                 />
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">City</label>
                                 <input 
                                    type="text" 
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-3xl px-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none" 
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Pincode*</label>
                                 <input 
                                    type="text" 
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-3xl px-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none" 
                                    placeholder="Pincode"
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Venue Type</label>
                              <select 
                                 className="w-full h-14 bg-slate-50 border border-slate-100 rounded-3xl px-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none appearance-none cursor-pointer"
                                 value={formData.venueType}
                                 onChange={(e) => setFormData({...formData, venueType: e.target.value})}
                              >
                                 <option value="">Select Venue Type</option>
                                 <option value="Banquet Hall">Banquet Hall</option>
                                 <option value="Hotel">Hotel</option>
                                 <option value="Resort">Resort</option>
                                 <option value="Party Lawn">Party Lawn</option>
                                 <option value="Restaurant">Restaurant</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Guest Capacity</label>
                              <select 
                                 className="w-full h-14 bg-slate-50 border border-slate-100 rounded-3xl px-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none appearance-none cursor-pointer"
                                 value={formData.capacity}
                                 onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                              >
                                 <option value="">Select Range</option>
                                 <option value="0-50">0-50 guests</option>
                                 <option value="50-100">50-100 guests</option>
                                 <option value="100-200">100-200 guests</option>
                                 <option value="200-500">200-500 guests</option>
                                 <option value="500-1000">500-1000 guests</option>
                                 <option value="1000+">1000+ guests</option>
                              </select>
                           </div>
                        </div>
                     </div>

                     {/* Image Upload */}
                     <div className="pt-8 border-t border-slate-100">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4 mb-4 block">Upload Venue Photos (Max 5)*</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                           {previews.map((src, i) => (
                              <div key={i} className="relative aspect-square rounded-3xl overflow-hidden border-2 border-slate-100 group">
                                 <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                 <button 
                                    type="button"
                                    onClick={() => removePhoto(i)}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                    <X size={14} />
                                 </button>
                              </div>
                           ))}
                           {photos.length < 5 && (
                              <label className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-pd-pink hover:bg-pd-pink/[0.02] transition-all">
                                 <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                 <Upload size={24} className="text-slate-300" />
                                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Add Photo</span>
                              </label>
                           )}
                        </div>
                        {errors.photos && <p className="mt-3 text-[10px] text-red-500 font-bold uppercase tracking-widest italic">{errors.photos}</p>}
                     </div>

                     <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-16 bg-slate-900 text-white !rounded-[30px] flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.2em] font-black italic shadow-2xl active:scale-[0.98] transition-transform hover:bg-pd-pink"
                     >
                        {isSubmitting ? (
                          <div className="flex items-center gap-3">
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             <span>Creating Account...</span>
                          </div>
                        ) : (
                          <>Submit Free Listing <Send size={18} /></>
                        )}
                     </button>
                  </form>
               )}
            </div>
         </div>
      </section>

      <style jsx global>{`
        .shadow-pd-soft { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); }
        .shadow-pd-strong { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04); }
      `}</style>
    </main>
  );
}
