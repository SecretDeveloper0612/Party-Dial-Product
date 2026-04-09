'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';

// Static lists for simple fields
const states = [
  "Delhi (NCR)", "Maharashtra", "Karnataka", "Rajasthan", "Chandigarh", "Uttarakhand", "Uttar Pradesh", "Gujarat", "Punjab", "Haryana", "Telangana"
];

const venueTypes = [
  "Banquet Hall", "Hotel", "Resort", "Party Lawn", "Restaurant", "Farmhouse", "Rooftop"
];

const capacityRanges = [
  "0-50", "50-100", "100-200", "200-500", "500-1000", "1000-2000", "2000-5000", "5000+"
];

export default function VenueSignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    pincode: '',
    venueType: '',
    capacity: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPincodeLoading, setIsPincodeLoading] = React.useState(false);

  // No auto-redirect from localStorage, as we want to use the live SDK for checks.
  React.useEffect(() => {
    // We no longer clear stale data here to avoid logging out users who visit this page while logged in
  }, []);


  // Auto-fill City/State based on Pincode
  React.useEffect(() => {
    const fetchLocation = async (pincode: string) => {
      if (pincode.length === 6 && /^\d+$/.test(pincode)) {
        setIsPincodeLoading(true);
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = await response.json();

          if (data?.[0]?.Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: postOffice.Block && postOffice.Block !== "NA" ? postOffice.Block : postOffice.District,
              state: postOffice.State
            }));
            // Clear errors for city/state if any
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.city;
              delete newErrors.state;
              return newErrors;
            });
          } else {
            setErrors(prev => ({ ...prev, pincode: 'Invalid pincode' }));
          }
        } catch (error) {
          console.error("Error fetching pincode data:", error);
        } finally {
          setIsPincodeLoading(false);
        }
      }
    };

    fetchLocation(formData.pincode);
  }, [formData.pincode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.businessName) newErrors.businessName = 'Venue name is required';
    if (!formData.ownerName) newErrors.ownerName = 'Owner name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    if (!formData.venueType) newErrors.venueType = 'Venue type is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept terms & conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-server-koo2.onrender.com/api';
      const serverUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      const response = await fetch(`${serverUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.businessName,
          venueName: formData.businessName,
          ownerName: formData.ownerName,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          venueType: formData.venueType,
          capacity: formData.capacity
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Automatically log in on frontend to establish session cookie
        try {
          const { account } = await import('@/lib/appwrite');
          
          // Clear any existing stale sessions
          try { await account.deleteSession('current'); } catch (_) {}
          
          // Create new session
          const session = await account.createEmailPasswordSession(formData.email, formData.password);
          const user = await account.get();
          
          localStorage.setItem('auth_session', JSON.stringify(session));
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('fresh_signup', 'true');
          
          console.log('Registration & Auto-login success');
          router.push('/dashboard');
        } catch (loginErr: any) {
          console.error('Auto-login failed:', loginErr);
          // Fallback: Use server-provided session if possible, but the dashboard might redirect
          localStorage.setItem('auth_session', JSON.stringify(result.session));
          localStorage.setItem('user', JSON.stringify(result.user));
          router.push('/dashboard');
        }
      } else {
        setErrors({ submit: result.message || 'Registration failed. Please try again.' });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Connection error. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to the backend Google auth endpoint
    const successUrl = `${window.location.origin}/dashboard/onboarding/profile`;

    const failureUrl = `${window.location.origin}/signup`;
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-server-koo2.onrender.com/api';
    window.location.href = `${serverUrl}/auth/google?successUrl=${encodeURIComponent(successUrl)}&failureUrl=${encodeURIComponent(failureUrl)}`;
  };


  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-pd selection:bg-pd-pink selection:text-white">
      
      {/* LEFT COLUMN: VISUAL SECTION */}
      <section className="relative w-full lg:w-1/2 min-h-[400px] lg:h-screen overflow-hidden lg:sticky lg:top-0">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/images/signup-bg.png" 
            alt="Wedding Venue" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/90 via-slate-900/60 to-slate-900/20"></div>
        </div>

        {/* Content Over Image */}
        <div className="relative h-full flex flex-col justify-end p-6 sm:p-10 lg:p-16 text-white z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl pt-20"
          >

            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-4 sm:mb-6 tracking-tight">
              Register Your <span className="text-pd-pink">Venue</span> <br className="hidden sm:block" />
              & Start Receiving <br className="hidden sm:block" />
              <span className="pd-gradient-text uppercase">Event Leads</span>
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-medium leading-relaxed mb-6 sm:mb-10 max-w-lg">
              Unlock a world of opportunities. Connect with thousands of customers searching for the perfect banquet halls, hotels, and resorts for their special celebrations.
            </p>

            <div className="grid grid-cols-2 gap-8 mb-12">
               <div className="space-y-1 sm:space-y-2">
                 <div className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-400 sm:w-6 sm:h-6" size={20} />
                    <span>Verified</span>
                 </div>
                 <p className="text-[9px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">Inquiry System</p>
               </div>
               <div className="space-y-1 sm:space-y-2">
                 <div className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                    <Zap className="text-amber-400 sm:w-6 sm:h-6" size={20} />
                    <span>Instant</span>
                 </div>
                 <p className="text-[9px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">Lead Delivery</p>
               </div>
            </div>

            <div className="flex items-center gap-4 pt-10 border-t border-white/10">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-slate-800 overflow-hidden shadow-2xl">
                       <Image src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="Partner" width={40} height={40} />
                    </div>
                  ))}
               </div>
               <div className="text-[12px] font-bold text-slate-400 italic">
                  Join 500+ successful venue owners
               </div>
            </div>
          </motion.div>
        </div>

        {/* Logo Overlay */}
        <div className="absolute top-6 left-6 lg:top-12 lg:left-12 z-20 flex items-center gap-3">
           <Link href="/">
             <div className="flex items-center gap-2 group cursor-pointer bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                <div className="w-8 h-8 rounded-lg bg-pd-pink flex items-center justify-center text-white font-black italic shadow-lg group-hover:scale-110 transition-transform">P</div>
               <span className="text-sm font-black text-white italic tracking-tighter uppercase group-hover:tracking-widest transition-all">PARTYDIAL</span>
             </div>
           </Link>
           <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
             <span className="text-[10px] font-black text-white italic tracking-[0.2em] uppercase">Partner</span>
           </div>
        </div>
      </section>

      {/* RIGHT COLUMN: FORM SECTION */}
      <section className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-12 min-h-screen relative">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-[520px]"
        >
          <div className="mb-6">
            <div className="mb-6 lg:mb-10 text-center lg:text-left">
               <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic mb-2 tracking-tight">Venue Registration</h2>
               <p className="text-xs sm:text-sm text-slate-500 font-medium">Get started with PartyDial & grow your venue business.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               {errors.submit && (
                 <div className="bg-red-50 border border-red-100 p-3 rounded-[12px] flex items-center gap-2 text-red-600 text-[11px] font-bold">
                   <ShieldCheck size={16} className="text-red-500" /> {errors.submit}
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Business Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Venue Name*</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                        <Building2 size={16} />
                      </div>
                      <input 
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        className={`w-full h-12 bg-slate-50 border ${errors.businessName ? 'border-red-500' : 'border-slate-100'} rounded-[16px] pl-11 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink focus:shadow-sm transition-all outline-none`}
                        placeholder="e.g. Grand Imperial Banquet"
                      />
                    </div>
                    {errors.businessName && <p className="text-[9px] text-red-500 font-bold pl-1">{errors.businessName}</p>}
                  </div>

                  {/* Owner Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Owner Name*</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                        <User size={16} />
                      </div>
                      <input 
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        className={`w-full h-12 bg-slate-50 border ${errors.ownerName ? 'border-red-500' : 'border-slate-100'} rounded-[16px] pl-11 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink focus:shadow-sm transition-all outline-none`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.ownerName && <p className="text-[9px] text-red-500 font-bold pl-1">{errors.ownerName}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Email Address*</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                        <Mail size={16} />
                      </div>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full h-12 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-100'} rounded-[16px] pl-11 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink focus:shadow-sm transition-all outline-none`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-[9px] text-red-500 font-bold pl-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Phone Number*</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                        <Phone size={16} />
                      </div>
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full h-12 bg-slate-50 border ${errors.phone ? 'border-red-500' : 'border-slate-100'} rounded-[16px] pl-11 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink focus:shadow-sm transition-all outline-none`}
                        placeholder="+91 9876543210"
                      />
                    </div>
                    {errors.phone && <p className="text-[9px] text-red-500 font-bold pl-1">{errors.phone}</p>}
                  </div>

                  {/* Pincode */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Pincode*</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                        <MapPin size={16} />
                      </div>
                      <input 
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        maxLength={6}
                        className={`w-full h-12 bg-slate-50 border ${errors.pincode ? 'border-red-500' : 'border-slate-100'} rounded-[16px] pl-11 pr-11 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink focus:shadow-sm transition-all outline-none`}
                        placeholder="6-digit Pincode"
                      />
                      {isPincodeLoading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <svg className="animate-spin h-4 w-4 text-pd-pink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.pincode && <p className="text-[9px] text-red-500 font-bold pl-1">{errors.pincode}</p>}
                  </div>

                  {/* City Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">City*</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                        <MapPin size={16} />
                      </div>
                      <input 
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full h-12 bg-slate-50 border ${errors.city ? 'border-red-500' : 'border-slate-100'} rounded-[16px] pl-11 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink focus:shadow-sm transition-all outline-none`}
                        placeholder="Enter City"
                      />
                    </div>
                    {errors.city && <p className="text-[9px] text-red-500 font-bold pl-1">{errors.city}</p>}
                  </div>

                  {/* State Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">State*</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                        <MapPin size={16} />
                      </div>
                      <select 
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full h-12 bg-slate-50 border ${errors.state ? 'border-red-500' : 'border-slate-100'} rounded-[16px] pl-11 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink focus:shadow-sm transition-all outline-none appearance-none cursor-pointer`}
                      >
                        <option value="">{formData.state || "Select State"}</option>
                        {formData.state && <option value={formData.state}>{formData.state}</option>}
                        {states.filter(s => s !== formData.state).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    {errors.state && <p className="text-[9px] text-red-500 font-bold pl-1">{errors.state}</p>}
                  </div>

                  {/* Venue Type Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Venue Type*</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                        <Building2 size={16} />
                      </div>
                      <select 
                        name="venueType"
                        value={formData.venueType}
                        onChange={handleChange}
                        className={`w-full h-12 bg-slate-50 border ${errors.venueType ? 'border-red-500' : 'border-slate-100'} rounded-[16px] pl-11 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink focus:shadow-sm transition-all outline-none appearance-none cursor-pointer`}
                      >
                        <option value="">Select Type</option>
                        {venueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    {errors.venueType && <p className="text-[9px] text-red-500 font-bold pl-1">{errors.venueType}</p>}
                  </div>

                  {/* Capacity Range */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Guest Capacity Range</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                        <Users size={16} />
                      </div>
                      <select 
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-[16px] pl-11 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink focus:shadow-sm transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Select Capacity</option>
                        {capacityRanges.map(r => <option key={r} value={r}>{r} guests</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Dummy spacer for grid balance if needed */}
                  <div className="hidden md:block"></div>
               </div>

               {/* Password Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Password*</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                        <Lock size={16} />
                      </div>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full h-12 bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-100'} rounded-[16px] pl-11 pr-11 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink focus:shadow-sm transition-all outline-none`}
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-[9px] text-red-500 font-bold pl-1">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Confirm Password*</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                        <Lock size={16} />
                      </div>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full h-12 bg-slate-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-100'} rounded-[16px] pl-11 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink focus:shadow-sm transition-all outline-none`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-[9px] text-red-500 font-bold pl-1">{errors.confirmPassword}</p>}
                  </div>
               </div>

               {/* Terms and Conditions */}
               <div className="flex items-start gap-3 py-2">
                 <div className="relative flex items-center h-5">
                    <input 
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-slate-200 text-pd-pink focus:ring-pd-pink cursor-pointer"
                    />
                 </div>
                 <div className="text-[11px] text-slate-500 leading-tight">
                    I accept the platform’s <Link href="#" className="text-pd-pink font-bold hover:underline">Terms & Conditions</Link> and <Link href="#" className="text-pd-pink font-bold hover:underline">Privacy Policy</Link> before submitting.
                    {errors.acceptTerms && <p className="text-[9px] text-red-500 font-bold mt-1">{errors.acceptTerms}</p>}
                 </div>
               </div>

               {/* Submit Button */}
               <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 pd-btn-primary !rounded-[16px] flex items-center justify-center gap-3 text-sm italic tracking-normal lowercase disabled:opacity-70 disabled:cursor-not-allowed group"
               >
                 {isSubmitting ? (
                   <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                   </span>
                 ) : (
                   <>
                     register your venue
                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </button>

               {/* Quick Registration Option */}
               <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-white px-4 text-slate-400">or quick signup</span></div>
               </div>

               <button 
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-14 bg-white border border-slate-100 rounded-[16px] flex items-center justify-center gap-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
               >
                 <Image src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google" width={18} height={18} />
                 Continue with Google
               </button>

            </form>
          </div>

          <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            Already have an account? <Link href="/login" className="text-pd-pink hover:underline">Venue Login</Link>
          </p>
        </motion.div>
      </section>

    </div>
  );
}
