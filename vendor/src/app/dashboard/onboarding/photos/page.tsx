'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ImageIcon, 
  ChevronLeft, 
  Upload, 
  Trash2, 
  Plus, 
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Info,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function UploadPhotosPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<{id: string, category: string}[]>([]);
  const [venueProfile, setVenueProfile] = useState<any>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("ALL PHOTOS");

  const categories = ["ALL PHOTOS", "INTERIOR", "DECORATION", "FOOD & DINING", "EXTERIOR", "EVENT SETUPS"];

  React.useEffect(() => {
    const fetchProfile = async () => {
      const userJson = localStorage.getItem('user');
      if (!userJson) return;
      const user = JSON.parse(userJson);

      try {
        const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
        const { Query } = await import('appwrite');
        
        const result = await databases.listDocuments(
          DATABASE_ID,
          VENUES_COLLECTION_ID,
          [Query.equal('userId', user.$id)]
        );
        
        if (result.documents.length > 0) {
          const profile = result.documents[0];
          setDocId(profile.$id);
          setVenueProfile(profile);
          if (profile.photos) {
            const parsed = JSON.parse(profile.photos);
            // Handle both old format (string[]) and new format ({id, category}[])
            const normalized = parsed.map((p: any) => {
              if (typeof p === 'string') return { id: p, category: 'ALL PHOTOS' };
              return p;
            });
            setPhotos(normalized);
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const { storage, STORAGE_BUCKET_ID, databases, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
      const { ID } = await import('appwrite');
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (!user) {
         router.push('/login');
         return;
      }

      const isTrial = venueProfile?.subscriptionPlan === 'trial_30';
      const availableSlots = isTrial ? 3 - photos.length : 1000;

      if (isTrial && photos.length >= 3) {
         alert('Your trial plan allows only 3 photos. Please upgrade to a PAX Pack for unlimited uploads.');
         setIsUploading(false);
         return;
      }

      const filesToUpload = Array.from(selectedFiles);
      if (isTrial && filesToUpload.length > availableSlots) {
         alert(`You can only upload ${availableSlots} more photos on this plan.`);
         setIsUploading(false);
         return;
      }

      const uploadedPhotos: {id: string, category: string}[] = [];
      const categoryToAssign = activeCategory === "ALL PHOTOS" ? "INTERIOR" : activeCategory;

      for (const file of Array.from(selectedFiles)) {
        const response = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file);
        uploadedPhotos.push({ id: response.$id, category: categoryToAssign });
      }

      const newPhotos = [...photos, ...uploadedPhotos];
      setPhotos(newPhotos);

      // Save to database
      const payload = {
        photos: JSON.stringify(newPhotos)
      };

      if (docId) {
        await databases.updateDocument(DATABASE_ID, VENUES_COLLECTION_ID, docId, payload);
      } else {
        // Create if doesn't exist
        const newDoc = await databases.createDocument(DATABASE_ID, VENUES_COLLECTION_ID, ID.unique(), {
          ...payload,
          userId: user.$id,
          venueName: user.name || 'My Venue',
          ownerName: user.name || 'Owner',
          contactEmail: user.email || '',
          contactNumber: user.phone || '',
          city: '',
          state: '',
          pincode: '',
          venueType: 'Banquet Hall',
          capacity: '0',
          onboardingComplete: false,
          isVerified: false,
          status: 'active',
        });
        setDocId(newDoc.$id);
      }

    } catch (err: any) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please ensure a storage bucket named "venues_photos" exists.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removePhoto = async (id: string) => {
    if (!docId) return;
    try {
      const { storage, STORAGE_BUCKET_ID, databases, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
      
      await storage.deleteFile(STORAGE_BUCKET_ID, id);
      const newPhotos = photos.filter(p => p.id !== id);
      setPhotos(newPhotos);

      await databases.updateDocument(DATABASE_ID, VENUES_COLLECTION_ID, docId, {
        photos: JSON.stringify(newPhotos)
      });
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const [appConfig, setAppConfig] = useState({
    endpoint: 'https://sgp.cloud.appwrite.io/v1',
    projectId: '69ae84bc001ca4edf8c2',
    bucketId: 'venues_photos'
  });

  const getFilePreview = (id: string) => {
    return `${appConfig.endpoint}/storage/buckets/${appConfig.bucketId}/files/${id}/view?project=${appConfig.projectId}`;
  };

  useEffect(() => {
    const loadConfig = async () => {
      const { ENDPOINT, PROJECT_ID, STORAGE_BUCKET_ID } = await import('@/lib/appwrite');
      setAppConfig({
        endpoint: ENDPOINT,
        projectId: PROJECT_ID,
        bucketId: STORAGE_BUCKET_ID
      });
    };
    loadConfig();
  }, []);

  const filteredPhotos = photos.filter(p => activeCategory === "ALL PHOTOS" || p.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 font-pd py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 group-hover:border-slate-900 transition-all">
              <ChevronLeft size={18} />
            </div>
            <span className="text-sm font-bold italic">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
             <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="w-2/4 h-full bg-pd-pink"></div>
             </div>
             <span className="text-[10px] font-black uppercase text-slate-400">Step 2 of 4</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] border border-slate-100 shadow-pd-soft overflow-hidden mb-8"
        >
          <div className="p-8 lg:p-12">
            <header className="mb-12 text-center">
               <div className="w-16 h-16 bg-pink-50 rounded-3xl flex items-center justify-center text-pink-500 mx-auto mb-6">
                  <ImageIcon size={32} />
               </div>
               <h1 className="text-3xl font-black text-slate-900 uppercase italic mb-3 tracking-tight">Upload Photos</h1>
               <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">High-quality photos are the #1 reason customers choose a venue. Showcase your space beautifully.</p>
            </header>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
               {categories.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     activeCategory === cat 
                       ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                       : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                   }`}
                 >
                   {cat}
                 </button>
               ))}
            </div>

            {/* Dropzone Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative border-2 border-dashed border-slate-200 rounded-[40px] p-16 text-center hover:border-pd-pink hover:bg-pink-50/10 transition-all cursor-pointer overflow-hidden mb-10"
            >
               <input
                 type="file"
                 ref={fileInputRef}
                 onChange={handleFileChange}
                 accept="image/*"
                 multiple
                 className="hidden"
               />
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-6 shadow-sm group-hover:scale-110 group-hover:text-pd-pink transition-all">
                    <Upload size={24} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 italic mb-2 tracking-tight uppercase">Upload to {activeCategory === "ALL PHOTOS" ? "Gallery" : activeCategory}</h3>
                  <p className="text-sm text-slate-400 font-medium">PNG, JPG or JPEG (Max 5MB each)</p>
               </div>
               {isUploading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                     <div className="w-10 h-10 border-4 border-pd-pink/20 border-t-pd-pink rounded-full animate-spin mb-4"></div>
                     <p className="text-xs font-black text-pd-pink uppercase tracking-widest italic animate-pulse">Uploading...</p>
                  </div>
               )}
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {filteredPhotos.map((photo) => (
                 <motion.div
                   key={photo.id}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="relative aspect-square rounded-[30px] overflow-hidden group shadow-sm border border-slate-100"
                 >
                    <Image src={getFilePreview(photo.id)} alt="Venue Photo" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-2 left-2">
                       <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[8px] font-black uppercase text-slate-800 tracking-tighter shadow-sm">{photo.category}</span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                       <button
                         onClick={(e) => { e.stopPropagation(); removePhoto(photo.id); }}
                         className="w-full h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                 </motion.div>
               ))}

               {/* Add More Slot */}
               {filteredPhotos.length > 0 && !(venueProfile?.subscriptionPlan === 'trial_30' && photos.length >= 3) && (
                 <button
                   onClick={() => fileInputRef.current?.click()}
                   className="aspect-square rounded-[30px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 text-slate-300 hover:text-pd-pink hover:border-pd-pink hover:bg-slate-50 transition-all"
                 >
                   <Plus size={32} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Add More</span>
                 </button>
               )}
            </div>

            {filteredPhotos.length === 0 && (
              <div className="text-center py-20 bg-slate-50/50 rounded-[40px] border border-slate-50">
                <ImageIcon size={48} className="text-slate-200 mx-auto mb-4" />
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">No photos in {activeCategory}</h3>
                <p className="text-xs text-slate-400 mt-2">Upload photos to this category to showcase your venue.</p>
                <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="mt-6 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                >
                   Upload to {activeCategory === "ALL PHOTOS" ? "Gallery" : activeCategory}
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-6 lg:p-8 flex items-center justify-between border-t border-slate-100">
             <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-slate-400 font-medium italic">We recommend at least 5 photos for a complete profile.</p>
             </div>
             <Link href="/dashboard/onboarding/pricing">
               <button 
                  className="pd-btn-primary flex items-center gap-2 min-w-[200px] justify-center italic tracking-normal"
               >
                  Verify & Next Step
                  <ArrowRight size={18} />
               </button>
             </Link>
          </div>
        </motion.div>

        {/* Quality Guide */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-pd-soft grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="flex flex-col gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                 <Sparkles size={20} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Daylight Shots</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed italic">Take photos during the day for natural, bright lighting that feels welcoming.</p>
           </div>
           <div className="flex flex-col gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                 <Building2 size={20} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Exterior & Interior</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed italic">Include shots of the entrance, main hall, and special amenities like the bar area.</p>
           </div>
           <div className="flex flex-col gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                 <ImageIcon size={20} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">No Blur</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed italic">Avoid blurry or dark images. Clear photos build trust with potential customers.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
