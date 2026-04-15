'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  ChevronRight, 
  MapPin,
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
  IndianRupee,
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
  Building,
  Trash2,
  Target
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
  const [uploadProgress, setUploadProgress] = React.useState({ current: 0, total: 0 });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !venueProfile?.$id) return;

    setIsUploadingPhoto(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      const { storage, databases, DATABASE_ID, VENUES_COLLECTION_ID, STORAGE_BUCKET_ID, ID } = await import('@/lib/appwrite');
      const category = activeGalleryCategory === 'All Photos' ? 'Interior' : activeGalleryCategory;

      // Upload all files sequentially and collect results
      const newPhotos: { id: string; category: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        setUploadProgress({ current: i + 1, total: files.length });
        try {
          const uploaded = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), files[i]);
          newPhotos.push({ id: uploaded.$id, category });
        } catch (err) {
          console.error(`Failed to upload file ${i + 1}:`, err);
          showToast(`Failed to upload ${files[i].name}. Skipping.`, 'error');
        }
      }

      if (newPhotos.length === 0) {
        showToast('No photos were uploaded successfully.', 'error');
        return;
      }

      // Single document update after all uploads
      const updatedPhotos = [...photoIds, ...newPhotos];
      await databases.updateDocument(
        DATABASE_ID,
        VENUES_COLLECTION_ID,
        venueProfile.$id,
        { photos: JSON.stringify(updatedPhotos) }
      );

      handleProfileUpdate('photos', JSON.stringify(updatedPhotos));
      showToast(
        newPhotos.length === files.length
          ? `${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''} uploaded to ${category}!`
          : `${newPhotos.length} of ${files.length} photos uploaded.`,
        'success'
      );
    } catch (err) {
      console.error('Bulk photo upload failed:', err);
      showToast('Upload failed. Please try again.', 'error');
    } finally {
      setIsUploadingPhoto(false);
      setUploadProgress({ current: 0, total: 0 });
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
    setDeleteConfirm({ show: true, photoId: idToRemove });
  };

  const confirmDeletePhoto = async () => {
    const idToRemove = deleteConfirm.photoId;
    setDeleteConfirm({ show: false, photoId: '' });
    if (!idToRemove || !venueProfile?.$id) return;

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
      showToast('Photo removed successfully.', 'success');
    } catch (err) {
      console.error('Failed to remove photo:', err);
      showToast('Failed to remove photo. Try again.', 'error');
    }
  };

  const galleryCategories = ["All Photos", "Interior", "Decoration", "Food & Dining", "Exterior", "Event Setups"];
  const [activeGalleryCategory, setActiveGalleryCategory] = React.useState("All Photos");
  const [deleteConfirm, setDeleteConfirm] = React.useState({ show: false, photoId: '' });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 lg:space-y-10">

      {/* ── Custom Delete Confirmation Popup ── */}
      {deleteConfirm.show && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(15,23,42,0.55)' }}
          onClick={() => setDeleteConfirm({ show: false, photoId: '' })}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[28px] p-8 shadow-2xl border border-slate-100 max-w-sm w-full text-center"
            style={{ willChange: 'transform', animation: 'popIn 0.15s ease-out forwards' }}
          >
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-50 flex items-center justify-center">
              <Trash2 size={26} className="text-red-500" />
            </div>
            <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight mb-2">
              Remove Photo?
            </h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-7">
              This photo will be permanently removed from your gallery.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, photoId: '' })}
                className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePhoto}
                className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
          <style>{`@keyframes popIn { from { transform: scale(0.92) translateY(8px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }`}</style>
        </div>
      )}
       <header className="px-2 lg:px-0">
          <h1 className="text-2xl lg:text-4xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 leading-none">Console <span className="text-pd-pink">Settings</span></h1>
          <p className="text-[10px] lg:text-sm font-medium text-slate-500 italic">Advanced control panel for your professional venue presence.</p>
       </header>

       <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Settings Sidebar */}
          <aside className="w-full lg:w-80 flex flex-col gap-2 px-2 lg:px-0">
             {[
                { id: 'profile', label: 'Venue Identity', icon: <Building2 size={18} />, color: 'text-blue-500', sub: 'Branding & Details' },
                { id: 'photos', label: 'Media Gallery', icon: <ImageIcon size={18} />, color: 'text-purple-500', sub: 'Photos & Videos' },
                { id: 'halls_section', label: 'Venue Spaces', icon: <Building size={18} />, color: 'text-emerald-500', sub: 'Halls & Lawns' },
                { id: 'pricing_section', label: 'Event Pricing', icon: <IndianRupee size={18} />, color: 'text-rose-500', sub: 'Plate rates & Fees' },

             ].map(section => (
                <button 
                  key={section.id}
                  onClick={() => setSettingsSection(section.id)}
                  className={`flex items-center justify-between p-4 rounded-[22px] transition-all group ${settingsSection === section.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-white border border-slate-50 hover:bg-slate-50'}`}
                >
                   <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${settingsSection === section.id ? 'bg-white/10 text-white' : 'bg-slate-50 ' + section.color} transition-all`}>
                         {section.icon}
                      </div>
                      <div className="text-left">
                         <p className={`text-[10px] font-black uppercase tracking-widest ${settingsSection === section.id ? 'text-white' : 'text-slate-900'}`}>{section.label}</p>
                         <p className={`text-[8px] font-bold uppercase tracking-widest ${settingsSection === section.id ? 'text-slate-400' : 'text-slate-400'}`}>{section.sub}</p>
                      </div>
                   </div>
                   <ChevronRight size={14} className={`transition-transform ${settingsSection === section.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                </button>
             ))}


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
                                     <p className="text-[11px] font-black italic uppercase text-slate-900 leading-none mb-2">Change Logo</p>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">This image will represent your venue across the platform.</p>
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
                                        <select 
                                          value={(() => {
                                             const cap = parseInt(venueProfile?.capacity);
                                             if (cap >= 5001) return '5000+';
                                             if (cap >= 2001) return '2000-5000';
                                             if (cap >= 1001) return '1000-2000';
                                             if (cap >= 501)  return '500-1000';
                                             if (cap >= 201)  return '200-500';
                                             if (cap >= 101)  return '100-200';
                                             if (cap >= 51)   return '50-100';
                                             if (cap >= 1)    return '0-50';
                                             return '';
                                          })()} 
                                          onChange={(e) => {
                                             const val = e.target.value;
                                             if (!val) {
                                                handleProfileUpdate('capacity', 0);
                                                return;
                                             }
                                             let numericCap = 0;
                                             if (val === '5000+') {
                                                numericCap = 10000;
                                             } else if (val.includes('-')) {
                                                const parts = val.split('-');
                                                numericCap = parseInt(parts[parts.length - 1]) || 0;
                                             }
                                             handleProfileUpdate('capacity', numericCap);
                                          }}
                                          className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-8 text-sm font-black italic outline-none focus:border-pd-pink focus:bg-white transition-all shadow-inner appearance-none"
                                        >
                                           <option value="">Select Capacity</option>
                                           <option value="0-50">0-50 Guests</option>
                                           <option value="50-100">50-100 Guests</option>
                                           <option value="100-200">100-200 Guests</option>
                                           <option value="200-500">200-500 Guests</option>
                                           <option value="500-1000">500-1000 Guests</option>
                                           <option value="1000-2000">1000-2000 Guests</option>
                                           <option value="2000-5000">2000-5000 Guests</option>
                                           <option value="5000+">5000+ Guests</option>
                                        </select>
                                     </div>
                                  </div>
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Key Landmark</label>
                                      <div className="relative group">
                                         <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pd-pink transition-colors" size={18} />
                                         <input 
                                           type="text" 
                                           placeholder="e.g. Near City Center Mall"
                                           value={venueProfile?.landmark || ""} 
                                           onChange={(e) => handleProfileUpdate('landmark', e.target.value)}
                                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-16 pr-8 text-sm font-black italic outline-none focus:border-pd-pink focus:bg-white transition-all shadow-inner" 
                                         />
                                      </div>
                                      {venueProfile?.landmark && (
                                        <div className="mt-4 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                                          <iframe 
                                            width="100%" 
                                            height="150" 
                                            style={{ border: 0 }} 
                                            loading="lazy" 
                                            allowFullScreen 
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(venueProfile.landmark + ' ' + (venueProfile?.city || 'Haldwani'))}&output=embed`}
                                          ></iframe>
                                        </div>
                                      )}
                                   </div>
                               </div>
                            </section>

                             <section>
                                <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight mb-8">Parties We Organize</h3>
                                <div className="flex flex-wrap gap-2 text-wrap">
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

                             <section>
                                <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight mb-8">Venue Bio / Description</h3>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">About Your Venue</label>
                                   <textarea 
                                     rows={6}
                                     value={venueProfile?.description || ""} 
                                     onChange={(e) => handleProfileUpdate('description', e.target.value)}
                                     placeholder="Tell customers about your venue's ambiance, specialties, and unique features..."
                                     className="w-full bg-slate-50 border border-slate-100 rounded-[24px] p-6 text-sm font-medium text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none resize-none leading-relaxed shadow-inner" 
                                   />
                                   <p className="text-[9px] text-slate-400 font-bold italic text-right uppercase tracking-[0.2em]">Minimum 200 characters recommended</p>
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
                                       const galleryPhotos = photoIds.filter((p: any) => p.category !== 'Profile');
                                       const photo = galleryPhotos[idx];
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

                {settingsSection === 'halls_section' && (
                   <motion.div 
                     key="halls"
                     layout
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.98 }}
                     transition={{ duration: 0.2 }}
                     className="space-y-10"
                   >
                      <header className="flex items-center justify-between">
                         <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">Available <span className="text-emerald-500">Spaces</span></h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">List all individual halls, lawns, or dining areas available at your venue.</p>
                         </div>
                         <button 
                           onClick={() => {
                              const current = Array.isArray(venueProfile?.halls) ? venueProfile.halls : [];
                              const updated = [...current, { id: Date.now(), name: 'Main Banquet Hall', capacity: venueProfile.capacity || '500', area: '5000 SQ FT' }];
                              handleProfileUpdate('halls', updated);
                           }}
                           className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2"
                         >
                            Add New Hall/Space
                            <Plus className="text-white" size={14} />
                         </button>
                      </header>
 
                      <div className="space-y-4">
                         {(() => {
                            const halls = Array.isArray(venueProfile?.halls) ? venueProfile.halls : [];
                            
                            if (halls.length === 0) {
                               return (
                                  <div className="py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                                     <Building className="mx-auto text-slate-300 mb-4" size={48} />
                                     <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">No spaces defined yet</h4>
                                     <p className="text-[10px] font-medium text-slate-400 mt-2 mb-6">Add your banquet halls, lawns, or poolside areas here.</p>
                                  </div>
                               );
                            }
 
                            return halls.map((hall: any) => (
                               <div key={hall.id} className="p-8 bg-white border border-slate-100 rounded-[30px] flex flex-col md:flex-row md:items-center justify-between group hover:border-emerald-500 shadow-sm transition-all gap-6">
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                                     <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Space Name</label>
                                        <input 
                                           value={hall.name}
                                           onChange={(e) => {
                                              const updated = halls.map((h: any) => h.id === hall.id ? { ...h, name: e.target.value } : h);
                                              handleProfileUpdate('halls', updated);
                                           }}
                                           className="text-sm font-black text-slate-900 uppercase italic bg-slate-50 rounded-xl px-4 py-3 outline-none w-full focus:bg-white border border-transparent focus:border-emerald-500/20"
                                           placeholder="e.g. Royal Ballroom"
                                        />
                                     </div>
                                     <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Capacity (Guests)</label>
                                        <div className="relative">
                                           <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                           <input 
                                              value={hall.capacity}
                                              onChange={(e) => {
                                                 const updated = halls.map((h: any) => h.id === hall.id ? { ...h, capacity: e.target.value } : h);
                                                 handleProfileUpdate('halls', updated);
                                              }}
                                              className="text-sm font-black text-slate-900 bg-slate-50 rounded-xl pl-10 pr-4 py-3 outline-none w-full focus:bg-white border border-transparent focus:border-emerald-500/20"
                                              placeholder="500"
                                           />
                                        </div>
                                     </div>
                                     <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Area (SQ FT/Size)</label>
                                        <input 
                                           value={hall.area}
                                           onChange={(e) => {
                                              const updated = halls.map((h: any) => h.id === hall.id ? { ...h, area: e.target.value } : h);
                                              handleProfileUpdate('halls', updated);
                                           }}
                                           className="text-sm font-black text-slate-900 bg-slate-50 rounded-xl px-4 py-3 outline-none w-full focus:bg-white border border-transparent focus:border-emerald-500/20"
                                           placeholder="12,000 SQ FT"
                                        />
                                     </div>
                                  </div>
                                  <button 
                                     onClick={() => {
                                        const updated = halls.filter((h: any) => h.id !== hall.id);
                                        handleProfileUpdate('halls', updated);
                                     }}
                                     className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all shrink-0"
                                  >
                                     <Trash2 size={20} />
                                  </button>
                               </div>
                            ));
                         })()}
                      </div>
 
                      <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
                         <p className="text-[10px] font-medium text-slate-400 italic">Define each space so clients can estimate fit for their guest list.</p>
                         <button 
                           onClick={saveProfileSettings}
                           disabled={isUpdatingProfile}
                           className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-900/10 disabled:opacity-50"
                         >
                            {isUpdatingProfile ? 'SYNCHRONIZING...' : 'SAVE ALL SPACES'}
                         </button>
                      </div>
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
                         <div className="flex items-center gap-3">
                           <button 
                             onClick={() => fileInputRef.current?.click()}
                             disabled={isUploadingPhoto}
                             className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-pd-pink transition-all flex items-center gap-2 disabled:opacity-60"
                           >
                             {isUploadingPhoto ? (
                               <>
                                 <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                 {uploadProgress.total > 0 ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...` : 'Uploading...'}
                               </>
                             ) : (
                               <>Upload Photos <Plus className="text-white" size={14} /></>
                             )}
                           </button>
                           {!isUploadingPhoto && (
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Select multiple</span>
                           )}
                         </div>
                         <input type="file" hidden ref={fileInputRef} accept="image/*" multiple onChange={handlePhotoUpload} />
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
                           .filter((p: any) => p.category !== 'Profile')
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
                               <h4 className="text-sm font-black italic uppercase leading-none mb-1">HD Gallery optimization</h4>
                               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Our AI processes your photos for maximum brilliance.</p>
                            </div>
                         </div>
                         <button onClick={() => setSettingsSection('profile')} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Back to Profile</button>
                      </div>
                   </motion.div>
                )}

                 {settingsSection === 'pricing_section' && (
                    <motion.div 
                      key="pricing"
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-12"
                    >
                       <section className="max-w-2xl">
                          <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-2">Standard Plate Rates</h3>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-10">Define your base pricing for vegetarian and non-vegetarian offerings.</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                             <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block ml-1">Pure Veg Rate</label>
                                <div className="relative group">
                                   <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                      <div className="w-4 h-4 rounded-sm border-2 border-emerald-500 flex items-center justify-center">
                                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      </div>
                                   </div>
                                   <input 
                                     type="number" 
                                     value={venueProfile?.perPlateVeg || ""} 
                                     onChange={(e) => handleProfileUpdate('perPlateVeg', e.target.value)}
                                     placeholder="000"
                                     className="w-full bg-slate-50 border border-slate-100 rounded-[24px] py-6 pl-16 pr-8 text-lg font-black italic outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner" 
                                   />
                                   <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">/ PLATE</span>
                                </div>
                             </div>

                             <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block ml-1">Non-Veg Rate</label>
                                <div className="relative group">
                                   <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                      <div className="w-4 h-4 rounded-sm border-2 border-red-500 flex items-center justify-center">
                                         <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                      </div>
                                   </div>
                                   <input 
                                     type="number" 
                                     value={venueProfile?.perPlateNonVeg || ""} 
                                     onChange={(e) => handleProfileUpdate('perPlateNonVeg', e.target.value)}
                                     placeholder="000"
                                     className="w-full bg-slate-50 border border-slate-100 rounded-[24px] py-6 pl-16 pr-8 text-lg font-black italic outline-none focus:border-red-500 focus:bg-white transition-all shadow-inner" 
                                   />
                                   <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">/ PLATE</span>
                                </div>
                             </div>
                          </div>

                          <div className="p-8 bg-slate-900 rounded-[35px] text-white flex items-center justify-between border border-pd-pink/20 shadow-2xl shadow-pd-pink/10">
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-pd-pink">
                                   <Sparkles size={24} />
                                </div>
                                <div>
                                   <h4 className="text-sm font-black italic uppercase leading-none mb-1 text-pd-pink">Smart Pricing Insight</h4>
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Dynamic rates help you appear in more sorted searches.</p>
                                </div>
                             </div>
                          </div>
                       </section>

                       <section className="p-8 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-center">
                          <Target className="mx-auto text-slate-300 mb-4" size={48} />
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Subscription Managed</h4>
                          <p className="text-[10px] font-medium text-slate-400 mt-2">
                             Your pricing is currently managed via your platform subscription. <br/>
                             Individual package definitions are currently disabled.
                          </p>
                       </section>

                       <div className="pt-10 border-t border-slate-100 flex items-center justify-end">

                          <button 
                            onClick={saveProfileSettings}
                            disabled={isUpdatingProfile}
                            className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-pd-pink transition-all shadow-2xl shadow-slate-900/20 disabled:opacity-50"
                          >
                             {isUpdatingProfile ? 'SAVING CHANGES...' : 'UPDATE PRICING'}
                          </button>
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
