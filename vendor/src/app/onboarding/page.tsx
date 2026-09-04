'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Upload, User, ShieldCheck, IndianRupee, LogOut } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, label: 'Create Account', desc: 'Login credentials & info' },
  { id: 2, label: 'Business Details', desc: 'Name & Location' },
  { id: 3, label: 'Property Info', desc: 'Type & Capacity' },
  { id: 4, label: 'Media Upload', desc: 'Photos of venue' },
  { id: 5, label: 'Amenities', desc: 'Facilities available' },
  { id: 6, label: 'Pricing', desc: 'Veg/Non-Veg Rates' }
];

export default function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [venueProfile, setVenueProfile] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    altPhone: '',
    termsAgreed: false,
    
    businessName: '',
    city: '',
    state: '',
    pincode: '',
    
    venueType: 'Banquet Hall',
    capacity: '100-200',
    
    photos: [] as any[], // eslint-disable-line @typescript-eslint/no-explicit-any
    
    amenities: [] as string[],
    
    perPlateVeg: '',
    perPlateNonVeg: ''
  });

  useEffect(() => {
    // Load initial venue data
    const loadData = async () => {
      try {
        const { account, databases, Query, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
        const user = await account.get();
        
        if (DATABASE_ID && VENUES_COLLECTION_ID) {
          const res = await databases.listDocuments(DATABASE_ID, VENUES_COLLECTION_ID, [Query.equal('userId', user.$id)]);
          if (res.documents.length > 0) {
            const profile = res.documents[0];
            setVenueProfile(profile);
            
            // If already complete, redirect away
            if (profile.onboardingComplete) {
              router.push('/dashboard');
              return;
            }

            // Pre-fill
            setFormData(prev => ({
              ...prev,
              email: profile.contactEmail || user.email || '',
              firstName: profile.ownerName?.split(' ')[0] || '',
              lastName: profile.ownerName?.split(' ').slice(1).join(' ') || '',
              businessName: (profile.venueName && profile.venueName !== 'Unnamed Venue') ? profile.venueName : '',
              city: profile.city || '',
              state: profile.state || '',
              pincode: profile.pincode || '',
              phone: profile.contactNumber || '',
              venueType: profile.venueType || 'Banquet Hall',
              capacity: profile.capacity ? String(profile.capacity) : '100-200',
              photos: typeof profile.photos === 'string' ? JSON.parse(profile.photos || '[]') : (profile.photos || []),
              amenities: typeof profile.amenities === 'string' ? JSON.parse(profile.amenities || '[]') : (profile.amenities || []),
              perPlateVeg: profile.perPlateVeg || '',
              perPlateNonVeg: profile.perPlateNonVeg || ''
            }));
          } else {
            // Pre-fill email and name from user account for brand new vendors
            setFormData(prev => ({
              ...prev,
              email: user.email || '',
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || ''
            }));
          }
        } else {
           // If DB variables aren't set, at least fill the email
           setFormData(prev => ({ ...prev, email: user.email || '' }));
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    loadData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
      const serverUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      await fetch(`${serverUrl}/auth/logout`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      }).catch(() => {});
    } catch (err) {
      console.warn('Backend logout call failed:', err);
    } finally {
      try {
        const { account } = await import('@/lib/appwrite');
        await account.deleteSession('current');
      } catch { }
      localStorage.removeItem('auth_session');
      localStorage.removeItem('user');
      localStorage.removeItem('onboardingComplete');
      router.push('/login');
    }
  };

  const saveProgressToDatabase = async (isFinal = false) => {
    try {
      const { databases, DATABASE_ID, VENUES_COLLECTION_ID, ID } = await import('@/lib/appwrite');
      const { Permission, Role } = await import('appwrite');
      
      if (!DATABASE_ID || !VENUES_COLLECTION_ID) return;

      const rawCap = String(formData.capacity || '100');
      let parsedCap = 100;
      if (rawCap.includes('-')) {
        parsedCap = parseInt(rawCap.split('-').pop() || '100') || 100;
      } else if (rawCap.includes('+')) {
        parsedCap = parseInt(rawCap.replace('+', '')) || 1000;
      } else {
        parsedCap = parseInt(rawCap) || 100;
      }

      const payload = {
        ownerName: `${formData.firstName} ${formData.lastName}`.trim() || 'Vendor Owner',
        contactEmail: formData.email || '',
        contactNumber: formData.phone || '',
        venueName: formData.businessName.trim() || 'My Venue',
        city: formData.city || '',
        state: formData.state.trim() || 'State',
        pincode: formData.pincode.trim() || '000000',
        venueType: formData.venueType || 'Banquet Hall',
        capacity: parsedCap,
        perPlateVeg: String(formData.perPlateVeg ? parseFloat(formData.perPlateVeg) : '0'),
        perPlateNonVeg: String(formData.perPlateNonVeg ? parseFloat(formData.perPlateNonVeg) : '0'),
        amenities: JSON.stringify(formData.amenities),
        photos: JSON.stringify(formData.photos),
        onboardingComplete: isFinal
      };

      if (!venueProfile?.$id) {
        const { account } = await import('@/lib/appwrite');
        const user = await account.get();
        const createdDoc = await databases.createDocument(
          DATABASE_ID, 
          VENUES_COLLECTION_ID, 
          ID.unique(), 
          {
            userId: user.$id,
            ...payload,
            isVerified: false,
            status: 'active',
            subscriptionPlan: 'None'
          },
          [
            Permission.read(Role.user(user.$id)),
            Permission.update(Role.user(user.$id)),
            Permission.delete(Role.user(user.$id)),
            Permission.read(Role.any())
          ]
        );
        setVenueProfile(createdDoc);
      } else {
        const updatedDoc = await databases.updateDocument(DATABASE_ID, VENUES_COLLECTION_ID, venueProfile.$id, payload);
        setVenueProfile(updatedDoc);
      }
    } catch (err) {
      console.error('Failed to save progress to database:', err);
    }
  };

  const handleNext = async () => {
    setIsSubmitting(true);
    await saveProgressToDatabase(false);
    setIsSubmitting(false);
    if (currentStep < STEPS.length) setCurrentStep(s => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: string, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingPhoto(true);

    try {
      const { storage, STORAGE_BUCKET_ID, ID } = await import('@/lib/appwrite');
      
      const newPhotos = [...formData.photos];
      for (let i = 0; i < files.length; i++) {
        try {
          const uploaded = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), files[i]);
          newPhotos.push({ id: uploaded.$id, category: 'Interior' });
        } catch (err) {
          console.error(`Failed to upload file ${files[i].name}:`, err);
        }
      }
      handleChange('photos', newPhotos);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { databases, DATABASE_ID, VENUES_COLLECTION_ID, ID } = await import('@/lib/appwrite');
      const { Permission, Role } = await import('appwrite');
      
      if (!DATABASE_ID || !VENUES_COLLECTION_ID) return;

      const rawCap = String(formData.capacity || '100');
      let parsedCap = 100;
      if (rawCap.includes('-')) {
        parsedCap = parseInt(rawCap.split('-').pop() || '100') || 100;
      } else if (rawCap.includes('+')) {
        parsedCap = parseInt(rawCap.replace('+', '')) || 1000;
      } else {
        parsedCap = parseInt(rawCap) || 100;
      }

      const payload = {
        ownerName: `${formData.firstName} ${formData.lastName}`.trim(),
        contactNumber: formData.phone,
        venueName: formData.businessName,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        venueType: formData.venueType,
        capacity: parsedCap,
        perPlateVeg: String(formData.perPlateVeg ? parseFloat(formData.perPlateVeg) : '0'),
        perPlateNonVeg: String(formData.perPlateNonVeg ? parseFloat(formData.perPlateNonVeg) : '0'),
        amenities: JSON.stringify(formData.amenities),
        // Assume photos are handled by a separate uploader that uploads directly to storage and updates state
        photos: JSON.stringify(formData.photos),
        onboardingComplete: true
      };

      if (!venueProfile?.$id) {
        const { account } = await import('@/lib/appwrite');
        const user = await account.get();
        await databases.createDocument(
          DATABASE_ID, 
          VENUES_COLLECTION_ID, 
          ID.unique(), 
          {
            userId: user.$id,
            ...payload,
            isVerified: false,
            status: 'active',
            subscriptionPlan: 'None'
          },
          [
            Permission.read(Role.user(user.$id)),
            Permission.update(Role.user(user.$id)),
            Permission.delete(Role.user(user.$id)),
            Permission.read(Role.any())
          ]
        );
      } else {
        await databases.updateDocument(DATABASE_ID, VENUES_COLLECTION_ID, venueProfile.$id, payload);
      }
      
      // Update cache
      localStorage.setItem('onboardingComplete', 'true');
      
      router.push('/dashboard');
    } catch (err) {
      console.error('Final submit failed', err);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPct = Math.round(((currentStep - 1) / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-white flex font-pd selection:bg-pd-pink selection:text-white overflow-hidden relative">

      {/* Sidebar Progress */}
      <div className="hidden lg:flex w-[320px] bg-slate-50 border-r border-slate-200 flex-col py-10 px-8 h-screen sticky top-0 z-10">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.png"
            alt="PartyDial Logo"
            width={120}
            height={120}
            className="opacity-90 mix-blend-multiply"
          />
        </div>
        <div className="mb-10">
          <h2 className="text-xl font-black text-slate-900">Registration</h2>
          <p className="text-xs text-slate-500 mt-2 font-medium">Get ready to welcome guests from around the globe.</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-10 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progress</span>
            <span className="text-[10px] font-black text-pd-pink">{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-linear-to-r from-pink-400 to-pd-pink"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="space-y-6 relative">
          <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200 z-0" />
          
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div key={step.id} className="relative z-10 flex items-start gap-4 group">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all duration-300",
                  isCompleted ? "bg-pd-pink text-white shadow-md shadow-pink-500/20" : 
                  isCurrent ? "bg-pink-50 border-2 border-pd-pink text-pd-pink" : 
                  "bg-white border border-slate-200 text-slate-400 group-hover:border-slate-300 group-hover:text-slate-500"
                )}>
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                </div>
                <div className={cn(
                  "pt-1 transition-all duration-300",
                  isCurrent ? "opacity-100 scale-100" : "opacity-75 scale-95 origin-left"
                )}>
                  <p className={cn(
                    "text-sm font-bold",
                    isCurrent ? "text-slate-900" : "text-slate-500"
                  )}>{step.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto pt-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-emerald-600">
            <ShieldCheck size={20} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest">Bank-level Security</p>
              <p className="text-[9px] font-medium text-slate-500">Your data is encrypted & secure</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-100 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative z-10 bg-white">
        <div className="max-w-2xl mx-auto py-12 px-6 lg:px-12">
          
          {/* Header */}
          <div className="mb-12 flex items-start justify-between">
            <div>
              <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pd-pink mb-6">
                <User size={20} strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                {STEPS[currentStep - 1]?.label}
              </h1>
              <p className="text-slate-500 font-medium">{STEPS[currentStep - 1]?.desc}</p>
            </div>

            <button
              onClick={handleLogout}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-100 transition-all cursor-pointer shadow-xs"
              title="Log out of account"
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* STEP 1: CREATE ACCOUNT */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">First Name</label>
                      <input 
                        type="text"
                        value={formData.firstName}
                        onChange={e => handleChange('firstName', e.target.value)}
                        className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                        placeholder="Jane"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">Last Name</label>
                      <input 
                        type="text"
                        value={formData.lastName}
                        onChange={e => handleChange('lastName', e.target.value)}
                        className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Email ID</label>
                    <input 
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Phone Number</label>
                    <input 
                      type="tel"
                      value={formData.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                      placeholder="9876543210"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Alternative Number</label>
                    <input 
                      type="tel"
                      value={formData.altPhone}
                      onChange={e => handleChange('altPhone', e.target.value)}
                      className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                      placeholder="9876543211"
                    />
                  </div>

                  <div className="mt-8 bg-pink-50 border border-pink-100 rounded-2xl p-5 flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="terms"
                      checked={formData.termsAgreed}
                      onChange={e => handleChange('termsAgreed', e.target.checked)}
                      className="mt-1 accent-pd-pink"
                    />
                    <label htmlFor="terms" className="text-xs font-medium text-slate-600 leading-relaxed cursor-pointer">
                      I agree to PartyDial&apos;s <span className="text-pd-pink font-bold">Terms of Service</span>, <span className="text-pd-pink font-bold">Privacy Policy</span>, and <span className="text-pd-pink font-bold">Partner Agreement</span>.
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 2: BUSINESS DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Business / Venue Name</label>
                    <input 
                      type="text"
                      value={formData.businessName}
                      onChange={e => handleChange('businessName', e.target.value)}
                      className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                      placeholder="e.g. The Grand Hotel"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">City</label>
                      <input 
                        type="text"
                        value={formData.city}
                        onChange={e => handleChange('city', e.target.value)}
                        className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                        placeholder="e.g. Mumbai"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">State</label>
                      <input 
                        type="text"
                        value={formData.state}
                        onChange={e => handleChange('state', e.target.value)}
                        className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                        placeholder="e.g. Maharashtra"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Pincode</label>
                    <input 
                      type="text"
                      value={formData.pincode}
                      onChange={e => handleChange('pincode', e.target.value)}
                      className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                      placeholder="e.g. 400001"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: PROPERTY INFO */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Venue Type</label>
                    <select 
                      value={formData.venueType}
                      onChange={e => handleChange('venueType', e.target.value)}
                      className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none shadow-sm"
                    >
                      <option value="Banquet Hall">Banquet Hall</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Resort">Resort</option>
                      <option value="Farmhouse">Farmhouse</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Lounge">Lounge</option>
                      <option value="Club">Club</option>
                      <option value="Party Lawn">Party Lawn</option>
                      <option value="Community Hall">Community Hall</option>
                      <option value="Convention Centre">Convention Centre</option>
                      <option value="Villa">Villa</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Guest Capacity</label>
                    <select 
                      value={formData.capacity}
                      onChange={e => handleChange('capacity', e.target.value)}
                      className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none shadow-sm"
                    >
                      <option value="2-50">2-50 Guests</option>
                      <option value="50-100">50-100 Guests</option>
                      <option value="100-200">100-200 Guests</option>
                      <option value="200-500">200-500 Guests</option>
                      <option value="500-1000">500-1000 Guests</option>
                      <option value="1000+">1000+ Guests</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 4: MEDIA UPLOAD */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <input type="file" hidden ref={fileInputRef} accept="image/png, image/jpeg" multiple onChange={handlePhotoUpload} />
                  <div 
                    onClick={() => !isUploadingPhoto && fileInputRef.current?.click()}
                    className={`bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${isUploadingPhoto ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-100'}`}
                  >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 mb-4 shadow-sm">
                      <Upload size={24} className={isUploadingPhoto ? 'animate-bounce' : ''} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">{isUploadingPhoto ? 'Uploading Photos...' : 'Upload Venue Photos'}</h3>
                    <p className="text-xs text-slate-500 font-medium">Click to browse files here.</p>
                    <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-black">Support for JPG, PNG</p>
                  </div>
                  
                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      {formData.photos.map((photo, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-slate-200 group bg-slate-100 flex items-center justify-center">
                          <Image
                            src={`https://sgp.cloud.appwrite.io/v1/storage/buckets/venues_photos/files/${photo.id}/preview?project=69ae84bc001ca4edf8c2&width=200&height=200&output=webp`}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-slate-500 italic text-center">Note: You can manage these photos later from the dashboard.</p>
                </div>
              )}

              {/* STEP 5: AMENITIES */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <p className="text-sm text-slate-500 mb-4 font-medium">Select all facilities available at your venue:</p>
                  <div className="flex flex-wrap gap-3">
                    {['Air Conditioning', 'Parking', 'WiFi', 'Bar', 'DJ Available', 'Catering', 'Decor', 'Rooms', 'Swimming Pool'].map(am => {
                      const selected = formData.amenities.includes(am);
                      return (
                        <button
                          key={am}
                          onClick={() => {
                            if (selected) {
                              handleChange('amenities', formData.amenities.filter(a => a !== am));
                            } else {
                              handleChange('amenities', [...formData.amenities, am]);
                            }
                          }}
                          className={cn(
                            "px-4 py-2.5 rounded-xl text-xs font-bold transition-all border",
                            selected 
                              ? "bg-pink-50 border-pink-200 text-pd-pink shadow-sm" 
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-600"
                          )}
                        >
                          {am}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 6: PRICING */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">Veg Price (per plate)</label>
                      <div className="relative">
                        <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="number"
                          value={formData.perPlateVeg}
                          onChange={e => handleChange('perPlateVeg', e.target.value)}
                          className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-10 pr-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                          placeholder="800"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">Non-Veg Price (per plate)</label>
                      <div className="relative">
                        <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="number"
                          value={formData.perPlateNonVeg}
                          onChange={e => handleChange('perPlateNonVeg', e.target.value)}
                          className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-10 pr-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                          placeholder="1200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Actions */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button 
                onClick={handleBack}
                className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Back
              </button>
            ) : <div />}
            
            <button 
              onClick={currentStep === STEPS.length ? handleSubmit : handleNext}
              disabled={
                isSubmitting || 
                (currentStep === 1 && (!formData.termsAgreed || !formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim() || !formData.altPhone.trim()))
              }
              className="px-8 py-3 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : currentStep === STEPS.length ? 'Complete Setup' : 'Continue'}
              {!isSubmitting && currentStep < STEPS.length && <ChevronRight size={16} />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
// force rebuild
