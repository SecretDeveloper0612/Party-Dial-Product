'use client';

import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { 
  Building2, 
  ChevronLeft, 
  Save, 
  Wifi, 
  Wind, 
  Car, 
  Utensils, 
  Music, 
  Camera,
  MapPin,
  Clock,
  Shield,
  Coffee,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Zap,
  Trees,
  ChefHat,
  Palette,
  Heart,
  ShieldCheck,
  Building
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const amenitiesList = [
  { id: 'ac', name: 'Air Conditioning', icon: <Wind size={18} /> },
  { id: 'parking', name: 'Parking Available', icon: <Car size={18} /> },
  { id: 'power', name: 'Power Backup', icon: <Zap size={18} /> },
  { id: 'indoor', name: 'Indoor Hall', icon: <Building size={18} /> },
  { id: 'outdoor', name: 'Outdoor Lawn', icon: <Trees size={18} /> },
  { id: 'catering_in', name: 'In-House Catering', icon: <Utensils size={18} /> },
  { id: 'catering_out', name: 'Outside Catering Allowed', icon: <ChefHat size={18} /> },
  { id: 'dj', name: 'DJ Allowed', icon: <Music size={18} /> },
  { id: 'decoration', name: 'Decoration Available', icon: <Palette size={18} /> },
  { id: 'bridal', name: 'Bridal Room', icon: <Heart size={18} /> },
  { id: 'security', name: 'Security Available', icon: <ShieldCheck size={18} /> },
  { id: 'wifi', name: 'Wi-Fi Available', icon: <Wifi size={18} /> },
];

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

export default function CompleteProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Get user from local storage or recover from Appwrite session
    const checkUser = async () => {
      let user = null;
      const userJson = localStorage.getItem('user');

      if (userJson) {
        user = JSON.parse(userJson);
      } else {
        // Try to recover session from Appwrite (e.g., after Google OAuth)
        try {
          const { account } = await import('@/lib/appwrite');
          const currentAccount = await account.get();
          if (currentAccount) {
            user = currentAccount;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('auth_session', 'recovered-from-google'); // Mark as logged in
          }
        } catch (err) {
          console.error('Session recovery failed:', err);
        }
      }

      if (!user) {
        router.push('/login');
        return;
      }

      setUserData(user);
      fetchProfile(user.$id);
    };

    // 2. Fetch current profile from backend
    const fetchProfile = async (userId: string) => {
      try {
        const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
        const { Query } = await import('appwrite');
        
        const result = await databases.listDocuments(
          DATABASE_ID,
          VENUES_COLLECTION_ID,
          [Query.equal('userId', userId)]
        );
        
        if (result.documents.length > 0) {
          const profile = result.documents[0];
          setDocId(profile.$id);
          setDescription(profile.description || '');
          setLandmark(profile.landmark || '');
          if (profile.amenities) {
             try {
                const amenities = Array.isArray(profile.amenities) ? profile.amenities : JSON.parse(profile.amenities);
                setSelectedAmenities(amenities);
             } catch (e) {
                console.warn('Failed to parse amenities:', e);
                setSelectedAmenities([]);
             }
          }
          if (profile.eventTypes) {
             try {
                const et = Array.isArray(profile.eventTypes) ? profile.eventTypes : JSON.parse(profile.eventTypes);
                setSelectedEventTypes(et);
             } catch (e) {
                console.warn('Failed to parse eventTypes:', e);
                setSelectedEventTypes([]);
             }
          }
        } else {
           console.log('No profile found for user:', userId);
           // We'll create it during first save if it doesn't exist
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleEventType = (id: string) => {
    setSelectedEventTypes(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = await import('@/lib/appwrite');
      const { ID } = await import('appwrite');
      
      const payload = {
        description,
        amenities: JSON.stringify(selectedAmenities),
        eventTypes: JSON.stringify(selectedEventTypes),
        landmark,
        contactNumber: userData?.phone || '',
        city: userData?.city || 'Haldwani',
        state: userData?.state || 'Uttarakhand',
        pincode: userData?.pincode || '263139',
        venueType: userData?.venueType || 'Banquet Hall',
        capacity: parseInt(userData?.capacity || '500', 10),
        // If creating new, add required defaults
        ...(docId ? {} : {
          userId: userData?.$id,
          venueName: userData?.name || 'My Venue',
          ownerName: userData?.name || 'Owner',
          contactEmail: userData?.email || '',
          onboardingComplete: false,
          isVerified: false,
          status: 'active',
        })
      };

      if (docId) {
        await databases.updateDocument(
          DATABASE_ID,
          VENUES_COLLECTION_ID,
          docId,
          payload
        );
      } else {
        const newDoc = await databases.createDocument(
          DATABASE_ID,
          VENUES_COLLECTION_ID,
          ID.unique(),
          payload
        );
        setDocId(newDoc.$id);
      }

      router.push('/dashboard/onboarding/photos');
    } catch (err: any) {
      console.error('Save error:', err);
      alert(`Error: ${err.message || 'Network error while saving profile.'}`);
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 font-pd py-12 px-6">
      <div className="max-w-3xl mx-auto">
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
                <div className="w-1/4 h-full bg-pd-pink"></div>
             </div>
             <span className="text-[10px] font-black uppercase text-slate-400">Step 1 of 4</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] border border-slate-100 shadow-pd-soft overflow-hidden mb-8"
        >
          <div className="p-8 lg:p-12">
            <header className="mb-10 text-center lg:text-left">
               <h1 className="text-3xl font-black text-slate-900 uppercase italic mb-3 tracking-tight">Complete Profile</h1>
               <p className="text-slate-500 font-medium">Add the finer details that make your venue stand out.</p>
            </header>

            <div className="space-y-10">
               {/* Description */}
               <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                       <Building2 size={18} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Venue Description</h2>
                  </div>
                  <textarea 
                    rows={5}
                    placeholder="Tell customers what makes your venue special. Mention the ambiance, suitability for different events, and unique features..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-[24px] p-6 text-sm font-medium text-slate-900 focus:bg-white focus:border-pd-pink focus:shadow-sm transition-all outline-none resize-none leading-relaxed"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className="text-[10px] text-slate-400 font-bold italic text-right italic">Recommended: Minimum 200 characters</p>
               </section>

               {/* Amenities */}
               <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center">
                       <Sparkles size={18} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Amenities & Services</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {amenitiesList.map(amenity => (
                      <button
                        key={amenity.id}
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`flex flex-col items-center justify-center gap-3 p-5 rounded-[24px] border transition-all ${
                          selectedAmenities.includes(amenity.id) 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-105' 
                          : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-pd-pink'
                        }`}
                      >
                        {amenity.icon}
                        <span className="text-[10px] font-black uppercase tracking-tighter">{amenity.name}</span>
                      </button>
                    ))}
                  </div>
               </section>

                {/* Event Types */}
                <section className="space-y-4">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-8 h-8 rounded-xl bg-pd-red/5 text-pd-red flex items-center justify-center">
                        <Sparkles size={18} />
                     </div>
                     <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Parties We Organize</h2>
                   </div>
                   <div className="flex flex-wrap gap-2.5">
                     {eventTypesList.map(type => (
                       <button
                         key={type}
                         onClick={() => toggleEventType(type)}
                         className={`px-5 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest border transition-all ${
                           selectedEventTypes.includes(type) 
                           ? 'bg-pd-red border-pd-red text-white shadow-lg' 
                           : 'bg-white border-slate-100 text-slate-500 hover:border-pd-red/30'
                         }`}
                       >
                         {type}
                       </button>
                     ))}
                   </div>
                   <p className="text-[10px] text-slate-400 font-bold italic">Select all events you can host at your venue.</p>
                </section>
               <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                       <MapPin size={18} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Key Landmark</h2>
                  </div>
                  <input 
                    type="text"
                    placeholder="e.g. Near City Center Mall or Opp. Gandhi Park"
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-[20px] px-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-pd-pink focus:shadow-sm transition-all outline-none"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                  />
                  {landmark && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 rounded-[20px] overflow-hidden border-2 border-slate-100 shadow-sm"
                    >
                      <iframe 
                        width="100%" 
                        height="200" 
                        style={{ border: 0 }} 
                        loading="lazy" 
                        allowFullScreen 
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(landmark + ' ' + (userData?.city || 'Haldwani'))}&output=embed`}
                      ></iframe>
                    </motion.div>
                  )}
               </section>

               {/* Operating Hours */}
               <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                       <Clock size={18} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Operating Hours</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Opening Time</label>
                       <input type="time" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-[16px] px-4 text-xs font-bold" defaultValue="09:00" />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Closing Time</label>
                       <input type="time" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-[16px] px-4 text-xs font-bold" defaultValue="23:00" />
                     </div>
                  </div>
               </section>
            </div>
          </div>

          <div className="bg-slate-50 p-6 lg:p-8 flex items-center justify-between border-t border-slate-100">
             <p className="text-xs text-slate-400 font-medium italic">Your progress is automatically saved as you type.</p>
             <button 
                onClick={handleSave}
                disabled={isSaving}
                className="pd-btn-primary flex items-center gap-2 min-w-[160px] justify-center"
             >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="italic">Save & Continue</span>
                    <ArrowRight size={18} />
                  </>
                )}
             </button>
          </div>
        </motion.div>

        {/* Pro Tip */}
        <div className="p-6 bg-amber-50 rounded-[30px] border border-amber-100 flex gap-4">
           <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
             <Sparkles size={20} />
           </div>
           <div>
              <p className="text-xs font-bold text-amber-900 italic mb-1 uppercase tracking-widest">Pro Tip:</p>
              <p className="text-xs text-amber-800/80 font-medium leading-relaxed">Adding a detailed description with keywords like &ldquo;wedding&rdquo;, &ldquo;birthday&rdquo;, or &ldquo;corporate event&rdquo; helps your venue show up higher in customer search results.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
