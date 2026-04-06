'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  ChevronRight, 
  Sparkles, 
  Building2, 
  Users, 
  Wind, 
  Car, 
  Wifi, 
  Utensils, 
  Music, 
  Image as ImageIcon,
  CheckCircle2,
  Smartphone,
  Key,
  Mail,
  FileText,
  Plus,
  Minus,
  Zap,
  Trees,
  ChefHat,
  Palette,
  Heart,
  ShieldCheck,
  Building
} from 'lucide-react';
import Image from 'next/image';

interface DashboardSettingsProps {
  settingsSection: string;
  setSettingsSection: (section: string) => void;
  venueProfile: any;
  handleProfileUpdate: (field: string, value: any) => void;
  handleAmenityToggle: (amenityId: string) => void;
  handleEventTypeToggle: (eventTypeId: string) => void;
  isUpdatingProfile: boolean;
  saveProfileSettings: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const DashboardSettings = ({
  settingsSection,
  setSettingsSection,
  venueProfile,
  handleProfileUpdate,
  handleAmenityToggle,
  handleEventTypeToggle,
  isUpdatingProfile,
  saveProfileSettings,
  showToast
}: DashboardSettingsProps) => {

  const eventTypesList = [
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

  const amenities = React.useMemo(() => {
    try {
       if (!venueProfile?.amenities) return [];
       return typeof venueProfile.amenities === 'string' ? JSON.parse(venueProfile.amenities) : (Array.isArray(venueProfile?.amenities) ? venueProfile.amenities : []); 
    } catch (e) { return []; } 
  }, [venueProfile?.amenities]); 

  const eventTypes = React.useMemo(() => {
    try {
       if (!venueProfile?.eventTypes) return [];
       return typeof venueProfile.eventTypes === 'string' ? JSON.parse(venueProfile.eventTypes) : (Array.isArray(venueProfile?.eventTypes) ? venueProfile.eventTypes : []); 
    } catch (e) { return []; } 
  }, [venueProfile?.eventTypes]); 

  const photoIds = React.useMemo(() => { 
     try { 
        if (!venueProfile?.photos) return []; 
        const parsed = typeof venueProfile.photos === 'string' ? JSON.parse(venueProfile.photos) : (Array.isArray(venueProfile?.photos) ? venueProfile.photos : []); 
        return parsed.map((p: any) => typeof p === 'string' ? { id: p, category: 'All Photos' } : p);
     } catch (e) { return []; } 
  }, [venueProfile?.photos]);

  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !venueProfile?.$id) return;

    setIsUploadingPhoto(true);
    try {
      const { storage, databases, DATABASE_ID, VENUES_COLLECTION_ID, STORAGE_BUCKET_ID, ID } = await import('@/lib/appwrite');
      
      const uploadedFile = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file
      );

      const newPhoto = { 
        id: uploadedFile.$id, 
        category: activeGalleryCategory === "All Photos" ? "Interior" : activeGalleryCategory 
      };
      
      const currentPhotos = [...photoIds, newPhoto];
      await databases.updateDocument(
        DATABASE_ID,
        VENUES_COLLECTION_ID,
        venueProfile.$id,
        {
          photos: JSON.stringify(currentPhotos)
        }
      );

      handleProfileUpdate('photos', JSON.stringify(currentPhotos));
      showToast(`Photo uploaded to ${newPhoto.category} category!`, 'success');
    } catch (err) {
      console.error('Photo upload failed:', err);
      showToast('Upload failed. Please try again.', 'error');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !venueProfile?.$id) return;

    setIsUploadingAvatar(true);
    try {
      const { storage, databases, DATABASE_ID, VENUES_COLLECTION_ID, STORAGE_BUCKET_ID, ID } = await import('@/lib/appwrite');
      
      const uploadedFile = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file
      );

      // Remove existing profile photo if any, and add new one
      const otherPhotos = photoIds.filter((p: any) => p.category !== 'Profile');
      const newProfilePhoto = { id: uploadedFile.$id, category: 'Profile' };
      const updatedPhotos = [newProfilePhoto, ...otherPhotos];

      await databases.updateDocument(
        DATABASE_ID,
        VENUES_COLLECTION_ID,
        venueProfile.$id,
        {
          photos: JSON.stringify(updatedPhotos)
        }
      );

      handleProfileUpdate('photos', JSON.stringify(updatedPhotos));
      showToast('Profile picture updated successfully!', 'success');
    } catch (err) {
      console.error('Avatar upload failed:', err);
      showToast('Failed to update profile picture.', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const removePhoto = async (idToRemove: string) => {
    if (!venueProfile?.$id) return;
    if (!confirm('Are you sure you want to remove this photo?')) return;

    try {
      const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
      const updatedPhotos = photoIds.filter((p: any) => p.id !== idToRemove);
      
      await databases.updateDocument(
        DATABASE_ID,
        VENUES_COLLECTION_ID,
        venueProfile.$id,
        {
          photos: JSON.stringify(updatedPhotos)
        }
      );
      handleProfileUpdate('photos', JSON.stringify(updatedPhotos));
    } catch (err) {
      console.error('Failed to remove photo:', err);
    }
  };

  const galleryCategories = ["All Photos", "Interior", "Decoration", "Food & Dining", "Exterior", "Event Setups"];
  const [activeGalleryCategory, setActiveGalleryCategory] = React.useState("All Photos");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 lg:space-y-10">
       <header className="px-2 lg:px-0">
          <h1 className="text-2xl lg:text-4xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 leading-none">Console <span className="text-pd-pink">Settings</span></h1>
          <p className="text-[10px] lg:text-sm font-medium text-slate-500 italic">Advanced control panel for your professional venue presence.</p>
       </header>

       <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Settings Sidebar */}
          <aside className="w-full lg:w-80 flex flex-col gap-2 px-2 lg:px-0">
             {[
                { id: 'profile', label: 'Public Profile', icon: <User size={18} />, color: 'text-blue-500' },
                { id: 'billing', label: 'Billing & Plans', icon: <CreditCard size={18} />, color: 'text-emerald-500' },
             ].map(section => (
                <button 
                  key={section.id}
                  onClick={() => setSettingsSection(section.id)}
                  className={`flex items-center justify-between p-4 lg:p-5 rounded-[20px] lg:rounded-[25px] transition-all group ${settingsSection === section.id ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' : 'bg-white border border-slate-50 hover:bg-slate-50'}`}
                >
                   <div className="flex items-center gap-3 lg:gap-4">
                      <div className={`p-2 rounded-xl scale-90 lg:scale-100 ${settingsSection === section.id ? 'bg-white/10 text-white' : 'bg-slate-50 ' + section.color} transition-all`}>
                         {section.icon}
                      </div>
                      <span className={`text-[10px] lg:text-[11px] font-black uppercase tracking-widest ${settingsSection === section.id ? 'text-white' : 'text-slate-600'}`}>{section.label}</span>
                   </div>
                   <ChevronRight size={14} className={`transition-transform ${settingsSection === section.id ? 'translate-x-1 opacity-100' : 'opacity-0 hidden lg:block'}`} />
                </button>
             ))}

             <div className="mt-4 lg:mt-10 p-6 lg:p-8 bg-slate-900 rounded-[30px] lg:rounded-[35px] text-white relative overflow-hidden group shadow-2xl shadow-slate-900/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pd-pink opacity-20 blur-3xl group-hover:opacity-40 transition-opacity"></div>
                <Sparkles className="text-pd-pink mb-3 lg:mb-4 scale-90 lg:scale-100" size={24} />
                <h4 className="text-xs lg:text-sm font-black italic uppercase mb-2">Pro Partner Status</h4>
                <p className="text-[9px] lg:text-[10px] text-slate-400 uppercase tracking-widest mb-4 lg:mb-6 leading-none">Valid until March 2026</p>
                <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-pd-pink hover:text-white transition-all shadow-xl">MANAGE PLAN</button>
             </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-[32px] lg:rounded-[50px] border border-slate-100 shadow-pd-soft p-6 lg:p-12 min-h-[500px] lg:min-h-[700px] relative overflow-hidden">
             <AnimatePresence mode="popLayout">
                {settingsSection === 'profile' && (
                   <motion.div 
                     key="profile"
                     layout
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.98 }}
                     transition={{ duration: 0.2 }}
                     className="space-y-12"
                   >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="space-y-12">
                            <section>
                               <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight mb-8">Brand Representative</h3>
                               <div className="flex items-center gap-8 mb-10">
                                  <div className="relative group">
                                     <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-3xl bg-gradient-to-tr from-pd-pink to-purple-500 p-[2px] shadow-2xl shadow-pd-pink/20">
                                        <div className="w-full h-full rounded-[22px] bg-white overflow-hidden flex items-center justify-center">
                                           {(photoIds.find((p: any) => p.category === 'Profile')) ? (
                                              <Image 
                                                src={`https://sgp.cloud.appwrite.io/v1/storage/buckets/venues_photos/files/${photoIds.find((p: any) => p.category === 'Profile').id}/view?project=69ae84bc001ca4edf8c2`} 
                                                alt="Profile" 
                                                width={112} 
                                                height={112} 
                                                className="object-cover w-full h-full"
                                              />
                                           ) : (
                                              <div className="flex flex-col items-center gap-1">
                                                 <User className="text-slate-200" size={32} />
                                              </div>
                                           )}
                                        </div>
                                     </div>
                                     <button 
                                       onClick={() => avatarInputRef.current?.click()}
                                       className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center text-slate-400 hover:text-pd-pink hover:scale-110 transition-all border border-slate-50"
                                     >
                                        <ImageIcon size={18} />
                                     </button>
                                     <input type="file" hidden ref={avatarInputRef} accept="image/*" onChange={handleAvatarUpload} />
                                  </div>
                                  <div className="flex-1">
                                     <p className="text-[11px] font-black italic uppercase text-slate-900 leading-none mb-2">Partner Avatar</p>
                                     <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">This image will represent the venue in the partner console and search results.</p>
                                  </div>
                               </div>
                            </section>

                            <section>
                               <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight mb-8">Venue Identity</h3>
                               <div className="space-y-6">
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Display Name</label>
                                     <div className="relative group">
                                        <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pd-pink transition-colors" size={18} />
                                        <input 
                                          type="text" 
                                          value={venueProfile?.venueName || ""} 
                                          onChange={(e) => handleProfileUpdate('venueName', e.target.value)}
                                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-16 pr-8 text-sm font-black italic outline-none focus:border-pd-pink focus:bg-white transition-all shadow-inner" 
                                        />
                                     </div>
                                  </div>
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Guest Capacity Range</label>
                                     <div className="relative group">
                                        <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pd-pink transition-colors" size={18} />
                                        <input 
                                          type="text" 
                                          value={venueProfile?.capacity || ""} 
                                          onChange={(e) => handleProfileUpdate('capacity', e.target.value)}
                                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-16 pr-8 text-sm font-black italic outline-none focus:border-pd-pink focus:bg-white transition-all shadow-inner" 
                                        />
                                     </div>
                                  </div>
                               </div>
                            </section>

                            <section>
                               <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight mb-8">Plate Pricing</h3>
                               <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1 italic">Veg Plate</label>
                                     <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" />
                                        <input 
                                          type="number" 
                                          value={venueProfile?.perPlateVeg || ""} 
                                          onChange={(e) => handleProfileUpdate('perPlateVeg', e.target.value)}
                                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-16 pr-8 text-sm font-black italic outline-none focus:border-pd-pink focus:bg-white transition-all shadow-inner" 
                                        />
                                     </div>
                                  </div>
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1 italic">Non-Veg Plate</label>
                                     <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500" />
                                        <input 
                                          type="number" 
                                          value={venueProfile?.perPlateNonVeg || ""} 
                                          onChange={(e) => handleProfileUpdate('perPlateNonVeg', e.target.value)}
                                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-16 pr-8 text-sm font-black italic outline-none focus:border-pd-pink focus:bg-white transition-all shadow-inner" 
                                        />
                                     </div>
                                  </div>
                               </div>
                            </section>

                            <section>
                               <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight mb-8">Parties We Organize</h3>
                               <div className="flex flex-wrap gap-2">
                                  {eventTypesList.map((type) => {
                                     const isActive = eventTypes.includes(type);
                                     return (
                                        <button 
                                          key={type}
                                          onClick={() => handleEventTypeToggle(type)}
                                          className={`px-4 py-2 rounded-full border transition-all text-[9px] font-black uppercase tracking-widest ${isActive ? 'bg-pd-red border-pd-red text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-pd-red/30'}`}
                                        >
                                           {type}
                                        </button>
                                     );
                                  })}
                               </div>
                            </section>
                         </div>

                         <div className="space-y-12">
                            <section>
                               <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight mb-8">Amenities & Features</h3>
                               <div className="grid grid-cols-2 gap-3">
                                  {[
                                     { id: 'ac', label: 'Air Conditioning', icon: <Wind size={14} /> },
                                     { id: 'parking', label: 'Parking Available', icon: <Car size={14} /> },
                                     { id: 'power', label: 'Power Backup', icon: <Zap size={14} /> },
                                     { id: 'indoor', label: 'Indoor Hall', icon: <Building size={14} /> },
                                     { id: 'outdoor', label: 'Outdoor Lawn', icon: <Trees size={14} /> },
                                     { id: 'catering_in', label: 'In-house Catering', icon: <Utensils size={14} /> },
                                     { id: 'catering_out', label: 'Outside Catering Allowed', icon: <ChefHat size={14} /> },
                                     { id: 'dj', label: 'DJ Allowed', icon: <Music size={14} /> },
                                     { id: 'decoration', label: 'Decoration Available', icon: <Palette size={14} /> },
                                     { id: 'bridal', label: 'Bridal Room', icon: <Heart size={14} /> },
                                     { id: 'security', label: 'Security Available', icon: <ShieldCheck size={14} /> },
                                     { id: 'wifi', label: 'Wi-Fi Available', icon: <Wifi size={14} /> }
                                  ].map((amenity) => {
                                     const isActive = amenities.includes(amenity.id);
                                     return (
                                        <button 
                                          key={amenity.id}
                                          onClick={() => handleAmenityToggle(amenity.id)}
                                          className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${isActive ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-pd-pink'}`}
                                        >
                                           <div className={isActive ? 'text-pd-pink' : 'text-slate-300'}>{amenity.icon}</div>
                                           <span className="text-[10px] font-black uppercase tracking-wider leading-tight">{amenity.label}</span>
                                        </button>
                                     );
                                  })}
                               </div>
                            </section>

                            <section>
                               <div className="flex items-center justify-between mb-8">
                                  <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight">Gallery Snapshot</h3>
                                  <button onClick={() => setSettingsSection('photos')} className="text-[9px] font-black uppercase text-pd-pink hover:text-slate-900 transition-colors tracking-widest">Update All</button>
                               </div>
                               <div className="grid grid-cols-3 gap-4">
                                  {[0, 1, 2].map(idx => {
                                      const photo = photoIds[idx];
                                      const photoId = typeof photo === 'object' ? photo?.id : photo;
                                      return (
                                         <div key={idx} className="aspect-square rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative group">
                                            {photoId ? (
                                               <Image 
                                                  src={`https://sgp.cloud.appwrite.io/v1/storage/buckets/venues_photos/files/${photoId}/view?project=69ae84bc001ca4edf8c2`} 
                                                 alt="Venue Gallery" 
                                                 fill 
                                                 className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                              />
                                           ) : (
                                              <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                                                 <ImageIcon className="text-slate-200" size={20} />
                                              </div>
                                           )}
                                           <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                              <ImageIcon className="text-white" size={20} />
                                           </div>
                                         </div>
                                      );
                                  })}
                               </div>
                            </section>
                         </div>
                      </div>

                      <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                               <CheckCircle2 size={20} />
                            </div>
                            <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">Last verified: Today at 02:30 PM <br/> All changes reflect instantly on the portal.</p>
                         </div>
                         <div className="flex gap-4">
                            <button 
                              onClick={saveProfileSettings}
                              disabled={isUpdatingProfile}
                              className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-pd-pink transition-all shadow-2xl shadow-slate-900/20 disabled:opacity-50"
                            >
                               {isUpdatingProfile ? 'SYNCHRONIZING...' : 'FORCE UPDATE PROFILE'}
                            </button>
                         </div>
                      </div>
                   </motion.div>
                )}

                {settingsSection === 'billing' && (
                     <motion.div 
                       key="billing"
                       layout
                       initial={{ opacity: 0, scale: 0.98 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.98 }}
                       transition={{ duration: 0.2 }}
                       className="space-y-10"
                     >
                        <div className="p-10 bg-slate-900 rounded-[50px] text-white relative overflow-hidden shadow-2xl shadow-slate-900/40">
                           <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-pd-pink opacity-20 blur-3xl rounded-full"></div>
                           <div className="relative z-10">
                              <div className="flex items-center gap-4 mb-10">
                                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                    <CreditCard size={24} className="text-pd-pink" />
                                 </div>
                                 <div>
                                    <h3 className="text-xl font-black italic uppercase leading-none mb-1">Elite Plan Active</h3>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Member Since Jan 2024</p>
                                 </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-10">
                                 <div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Next Charge</span>
                                    <p className="text-3xl font-black italic tracking-tighter leading-none mb-1">₹14,999</p>
                                    <p className="text-[10px] text-pd-pink font-bold uppercase tracking-widest italic">Jan 24, 2026</p>
                                 </div>
                                 <div className="flex flex-col justify-end">
                                    <button className="pd-btn-primary py-4 text-[10px]">UPGRADE TO ENTERPRISE</button>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <section>
                           <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight mb-8">Transaction Trail</h3>
                           <div className="space-y-4">
                              {[
                                 { date: 'Dec 24, 2025', amount: '₹14,999', status: 'Success' },
                                 { date: 'Nov 24, 2025', amount: '₹14,999', status: 'Success' },
                                 { date: 'Oct 24, 2025', amount: '₹14,999', status: 'Success' }
                              ].map((inv, i) => (
                                 <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl hover:bg-white border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-6">
                                       <FileText size={20} className="text-slate-300 group-hover:text-slate-900" />
                                       <div>
                                          <p className="text-xs font-black italic text-slate-900">{inv.date}</p>
                                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Elite Subscription Auto-Renewal</p>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-sm font-black italic text-slate-900 mb-1">{inv.amount}</p>
                                       <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full">{inv.status}</span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </section>
                     </motion.div>
                )}

                {settingsSection === 'photos' && (
                   <motion.div 
                     key="photos"
                     layout
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.98 }}
                     transition={{ duration: 0.2 }}
                     className="space-y-10"
                   >
                      <header className="flex items-center justify-between">
                         <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">Venue <span className="text-pd-pink">Gallery</span></h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Upload high-definition photos to showcase your venue.</p>
                         </div>
                         <button 
                           onClick={() => fileInputRef.current?.click()}
                           disabled={isUploadingPhoto}
                           className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-pd-pink transition-all flex items-center gap-2"
                         >
                            {isUploadingPhoto ? 'Uploading...' : 'Add New Photo'}
                            <Plus className="text-white" size={14} />
                         </button>
                         <input 
                           type="file" 
                           hidden 
                           ref={fileInputRef} 
                           accept="image/*"
                           onChange={handlePhotoUpload}
                         />
                      </header>

                      {/* Gallery Category Filter Bar */}
                      <div className="flex bg-slate-100/50 p-1 rounded-2xl w-fit overflow-x-auto no-scrollbar max-w-full">
                         {galleryCategories.map((cat: string) => (
                            <button
                               key={cat}
                               onClick={() => setActiveGalleryCategory(cat)}
                               className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeGalleryCategory === cat ? 'bg-white text-pd-pink shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                               {cat}
                            </button>
                         ))}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                         {photoIds
                           .filter((p: any) => activeGalleryCategory === "All Photos" || p.category === activeGalleryCategory)
                           .map((p: any) => (
                            <div key={p.id} className="aspect-video relative rounded-3xl overflow-hidden border border-slate-100 group shadow-lg">
                               <Image 
                                  src={`https://sgp.cloud.appwrite.io/v1/storage/buckets/venues_photos/files/${p.id}/view?project=69ae84bc001ca4edf8c2`} 
                                  alt="Gallery" 
                                  fill 
                                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                               />
                               <div className="absolute top-2 left-2">
                                  <span className="px-2 py-0.5 bg-white/90 backdrop-blur-md rounded-lg text-[7px] font-black uppercase tracking-widest text-slate-900 border border-slate-100">{p.category}</span>
                               </div>
                               <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                  <button 
                                    onClick={() => removePhoto(p.id)}
                                    className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-white hover:text-red-500 transition-all shadow-xl"
                                  >
                                     <Minus size={20} />
                                  </button>
                               </div>
                            </div>
                         ))}
                         
                         {(photoIds.filter((p: any) => activeGalleryCategory === "All Photos" || p.category === activeGalleryCategory).length === 0) && !isUploadingPhoto && (
                            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                               <ImageIcon className="mx-auto text-slate-300 mb-4" size={48} />
                               <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">No photos in {activeGalleryCategory}</h4>
                               <p className="text-[10px] font-medium text-slate-400 mt-2 mb-6">Upload photos to this category to showcase your venue.</p>
                               <button 
                                 onClick={() => fileInputRef.current?.click()}
                                 className="px-10 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-pd-pink transition-all"
                               >
                                  Upload to {activeGalleryCategory === "All Photos" ? "Gallery" : activeGalleryCategory}
                               </button>
                            </div>
                         )}

                         {isUploadingPhoto && (
                            <div className="aspect-video relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center animate-pulse">
                               <div className="w-8 h-8 border-4 border-pd-pink border-t-transparent rounded-full animate-spin" />
                            </div>
                         )}
                      </div>
                      
                      <div className="p-8 bg-slate-900 rounded-[35px] text-white flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-pd-pink">
                               <Sparkles size={24} />
                            </div>
                            <div>
                               <h4 className="text-sm font-black italic uppercase italic leading-none mb-1">HD Gallery optimization</h4>
                               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Our AI processes your photos for maximum brilliance.</p>
                            </div>
                         </div>
                         <button onClick={() => setSettingsSection('profile')} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Back to Profile</button>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
       </div>
    </motion.div>
  );
};

export default React.memo(DashboardSettings);
