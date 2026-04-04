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
  FileText
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
}

const DashboardSettings = ({
  settingsSection,
  setSettingsSection,
  venueProfile,
  handleProfileUpdate,
  handleAmenityToggle,
  handleEventTypeToggle,
  isUpdatingProfile,
  saveProfileSettings
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

  const amenities = (() => {
    try {
       if (!venueProfile?.amenities) return [];
       return typeof venueProfile.amenities === 'string' ? JSON.parse(venueProfile.amenities) : (Array.isArray(venueProfile?.amenities) ? venueProfile.amenities : []); 
    } catch (e) { return []; } 
  })(); 

  const eventTypes = (() => {
    try {
       if (!venueProfile?.eventTypes) return [];
       return typeof venueProfile.eventTypes === 'string' ? JSON.parse(venueProfile.eventTypes) : (Array.isArray(venueProfile?.eventTypes) ? venueProfile.eventTypes : []); 
    } catch (e) { return []; } 
  })(); 

  const photoIds = (() => { 
     try { 
        if (!venueProfile?.photos) return []; 
        return typeof venueProfile.photos === 'string' ? JSON.parse(venueProfile.photos) : (Array.isArray(venueProfile?.photos) ? venueProfile.photos : []); 
     } catch (e) { return []; } 
  })();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
       <header>
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 leading-none">Console <span className="text-pd-pink">Settings</span></h1>
          <p className="text-sm font-medium text-slate-500 italic">Advanced control panel for your professional venue presence.</p>
       </header>

       <div className="flex flex-col lg:flex-row gap-10">
          {/* Settings Sidebar */}
          <aside className="w-full lg:w-80 flex flex-col gap-2">
             {[
                { id: 'profile', label: 'Public Profile', icon: <User size={18} />, color: 'text-blue-500' },
                { id: 'security', label: 'Security & Access', icon: <Shield size={18} />, color: 'text-purple-500' },
                { id: 'notifications', label: 'Smart Alerts', icon: <Bell size={18} />, color: 'text-amber-500' },
                { id: 'billing', label: 'Billing & Plans', icon: <CreditCard size={18} />, color: 'text-emerald-500' },
             ].map(section => (
                <button 
                  key={section.id}
                  onClick={() => setSettingsSection(section.id)}
                  className={`flex items-center justify-between p-5 rounded-[25px] transition-all group ${settingsSection === section.id ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' : 'bg-white border border-slate-50 hover:bg-slate-50'}`}
                >
                   <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${settingsSection === section.id ? 'bg-white/10 text-white' : 'bg-slate-50 ' + section.color} transition-all`}>
                         {section.icon}
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${settingsSection === section.id ? 'text-white' : 'text-slate-600'}`}>{section.label}</span>
                   </div>
                   <ChevronRight size={14} className={`transition-transform ${settingsSection === section.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                </button>
             ))}

             <div className="mt-10 p-8 bg-slate-900 rounded-[35px] text-white relative overflow-hidden group shadow-2xl shadow-slate-900/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pd-pink opacity-20 blur-3xl group-hover:opacity-40 transition-opacity"></div>
                <Sparkles className="text-pd-pink mb-4" size={24} />
                <h4 className="text-sm font-black italic uppercase mb-2">Pro Partner Status</h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-6">Valid until March 2026</p>
                <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-pd-pink hover:text-white transition-all shadow-xl">MANAGE PLAN</button>
             </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-[50px] border border-slate-100 shadow-pd-soft p-12 min-h-[700px] relative overflow-hidden">
             <AnimatePresence mode="wait">
                {settingsSection === 'profile' && (
                  <motion.div 
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-12">
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
                                 {eventTypesList.map((type, i) => {
                                    const isActive = eventTypes.includes(type);
                                    return (
                                       <button 
                                         key={i}
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
                                    { id: 'parking', label: 'Valet Parking', icon: <Car size={14} /> },
                                    { id: 'wifi', label: 'WiFi Access', icon: <Wifi size={14} /> },
                                    { id: 'catering', label: 'In-house Catering', icon: <Utensils size={14} /> },
                                    { id: 'dj', label: 'DJ & Sound', icon: <Music size={14} /> },
                                    { id: 'security', label: '24/7 Security', icon: <Shield size={14} /> }
                                 ].map((amenity, i) => {
                                    const isActive = amenities.includes(amenity.id);
                                    return (
                                       <button 
                                         key={i}
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
                                    const photoId = photoIds[idx];
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

                {settingsSection === 'security' && (
                   <motion.div 
                     key="security"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-10"
                   >
                      <section>
                         <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight mb-8">Access Control</h3>
                         <div className="space-y-6">
                            <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[35px] border border-slate-100 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                               <div className="flex items-center gap-6">
                                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-slate-50">
                                     <Smartphone size={24} />
                                  </div>
                                  <div>
                                     <h4 className="text-sm font-black italic uppercase text-slate-900 mb-1">Two-Factor Authentication</h4>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enhanced biometric login for mobile admin</p>
                                  </div>
                               </div>
                               <div className="w-12 h-7 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                                  <div className="w-5 h-5 bg-white rounded-full translate-x-5 shadow-md"></div>
                               </div>
                            </div>

                            <div className="p-8 bg-pd-pink/5 rounded-[40px] border border-pd-pink/10 relative overflow-hidden group">
                               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                  <Key size={80} />
                               </div>
                               <h4 className="text-sm font-black italic uppercase text-slate-900 mb-2">Emergency Lock</h4>
                               <p className="text-[10px] text-slate-500 italic mb-6 leading-relaxed max-w-[280px]">Instantly log out from all devices and pause active inquiries. Use only if you suspect unauthorized access.</p>
                               <button className="px-8 py-3 bg-pd-pink text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-pd-pink/20 hover:bg-slate-900 transition-colors">TERMINATE SESSIONS</button>
                            </div>
                         </div>
                      </section>

                      <section>
                         <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight mb-8">Password Update</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <input type="password" placeholder="Current Key" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-black outline-none focus:border-pd-pink transition-all" />
                            <input type="password" placeholder="New Secret" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-black outline-none focus:border-pd-pink transition-all" />
                            <button className="pd-btn-primary py-4">UPDATE SECURITY</button>
                         </div>
                      </section>
                   </motion.div>
                )}

                {settingsSection === 'notifications' && (
                   <motion.div 
                     key="notif"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-6"
                   >
                      <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight mb-8">Communication Flow</h3>
                      {[
                         { l: 'Instant Email Alerts', d: 'Get notified immediately on lead capture', active: true },
                         { l: 'Urgent SMS Priority', d: 'Direct phone alerts for fast-expiring inquiries', active: true },
                         { l: 'Weekly Insights Bloom', d: 'Monday morning performance visualizations', active: false },
                         { l: 'Chat Desktop Pings', d: 'Sound notifications for active customer chats', active: true },
                         { l: 'Marketing Campaigns', d: 'Updates on platform features and trends', active: false }
                      ].map((n, i) => (
                         <div key={i} className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[35px] border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                            <div className="flex items-center gap-6">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${n.active ? 'bg-pd-pink text-white shadow-xl shadow-pd-pink/20' : 'bg-slate-200 text-slate-400'}`}>
                                  {i % 2 === 0 ? <Mail size={20} /> : <Smartphone size={20} />}
                               </div>
                               <div>
                                  <h4 className="text-sm font-black italic uppercase text-slate-900 leading-none mb-1.5">{n.l}</h4>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{n.d}</p>
                               </div>
                            </div>
                            <div className={`w-12 h-7 rounded-full relative p-1 cursor-pointer transition-all duration-300 ${n.active ? 'bg-slate-900' : 'bg-slate-200'}`}>
                               <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md ${n.active ? 'translate-x-5' : ''}`} />
                            </div>
                         </div>
                      ))}
                   </motion.div>
                )}

                
                {settingsSection === 'billing' && (
                     <motion.div 
                       key="billing"
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
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
             </AnimatePresence>
          </div>
       </div>
    </motion.div>
  );
};

export default React.memo(DashboardSettings);
