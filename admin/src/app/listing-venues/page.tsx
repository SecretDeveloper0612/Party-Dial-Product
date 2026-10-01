'use client';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, CheckCircle, AlertTriangle, ShieldAlert, Plus, Filter, Download } from 'lucide-react';
import { storage, ID, STORAGE_BUCKET_ID } from '../../lib/appwrite';

export default function ListingVenuesPage() {
  

  const [searchTerm, setSearchTerm] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingVenueId, setEditingVenueId] = useState<string | null>(null);
  // Form state

  const [newVenue, setNewVenue] = useState({ 
    name: '', category: 'Banquet Hall', city: '', address: '', phone: '',
    email: '', password: '', description: '', state: '', pincode: '', mapLink: '',
    capacity: '', vegPrice: '', nonVegPrice: '',
    amenities: [] as string[], eventTypes: [] as string[], existingPhotos: [] as string[],
    claimStatus: 'Unclaimed'
  });
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedPhotos(Array.from(e.target.files));
    }
  };

  const handleCreateVenue = async () => {
    setIsSubmitting(true);
    try {
      const baseServerUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5005' : (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5005');
      const serverUrl = baseServerUrl.endsWith('/api') ? baseServerUrl : `${baseServerUrl}/api`;
      
      const url = editingVenueId ? `${serverUrl}/venues/${editingVenueId}` : `${serverUrl}/venues`;
      const method = editingVenueId ? 'PUT' : 'POST';

      let photoString = '';
      const finalPhotos = [...newVenue.existingPhotos];
      if (selectedPhotos.length > 0) {
        const uploadedPhotos = await Promise.all(
          selectedPhotos.map(async (file) => {
            const uploadedFile = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file);
            return uploadedFile.$id;
          })
        );
        finalPhotos.push(...uploadedPhotos);
      }
      photoString = JSON.stringify(finalPhotos);

      const payload: any = {
          venueName: newVenue.name,
          category: newVenue.category,
          city: newVenue.city,
          address: newVenue.address,
          phone: newVenue.phone,
          contactEmail: newVenue.email,
          description: newVenue.description,
          state: newVenue.state,
          pincode: newVenue.pincode,
          capacity: newVenue.capacity ? parseInt(newVenue.capacity) : 500,
          perPlateVeg: newVenue.vegPrice,
          perPlateNonVeg: newVenue.nonVegPrice,
          amenities: JSON.stringify(newVenue.amenities),
          eventTypes: JSON.stringify(newVenue.eventTypes),
          listingStatus: 'Published',
          claimStatus: newVenue.claimStatus,
          vendorId: newVenue.claimStatus === 'Claimed' ? 'admin_claimed' : 'admin_import',
          source: 'Admin Import'
      };

      if (photoString) {
        payload.photos = photoString;
      }

      if (editingVenueId) {
         // for PUT we map back to schema exactly
         payload.venueType = newVenue.category;
         payload.landmark = newVenue.address;
         payload.contactNumber = newVenue.phone;
         delete payload.category;
         delete payload.address;
         delete payload.phone;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const responseText = await res.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server returned invalid format (${res.status}): ${responseText.substring(0, 50)}`);
      }

      if (res.ok) {
        setToast({ message: editingVenueId ? 'Venue updated successfully!' : 'Venue created successfully!', type: 'success' });
        setIsImportModalOpen(false);
        setEditingVenueId(null);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setToast({ message: 'Failed to save: ' + (result.message || res.statusText), type: 'error' });
      }
    } catch (err: any) {
      setToast({ message: 'Error: ' + (err.message || 'Network error connecting to backend.'), type: 'error' });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };




  // Realtime Data State
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        // Wire to the backend URL for venues
        const baseServerUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5005' : (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5005');
      const serverUrl = baseServerUrl.endsWith('/api') ? baseServerUrl : `${baseServerUrl}/api`;
        const res = await fetch(`${serverUrl}/venues?limit=50`);
        const data = await res.json();
        
        if (data.status === 'success' && data.data) {
          // Only show venues that were manually imported/created by the Admin
          const adminCreatedVenues = data.data.filter((v: any) => v.userId === 'admin_import' || v.userId === 'admin_claimed' || v.ownerName === 'PartyDial Admin');
          // Map backend Appwrite data to the table format
          const mappedVenues = adminCreatedVenues.map((v: any) => ({
            ...v,
            id: v.$id || v.id,
            name: v.venueName || v.name || 'Unknown Venue',
            category: v.category || 'Banquet',
            city: v.city || 'Unknown City',
            listingStatus: v.listingStatus || 'Published',
            claimStatus: v.userId === 'admin_claimed' ? 'Claimed' : (v.claimStatus || 'Unclaimed'),
          }));
          setVenues(mappedVenues);
        } else {
          setVenues([]);
        }
      } catch (err) {
        console.error('Failed to fetch venues:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 font-pd">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-sf tracking-tight mb-2">Listing Venues</h1>
          <p className="text-slate-500">Discover, import, and manage venue listings across PartyDial.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium shadow-sm">
            <Download size={18} /> Export
          </button>
          <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 font-medium shadow-sm shadow-rose-500/20">
            <Plus size={18} /> Import Venue
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Venues', value: venues.length.toString(), color: 'blue' },
          { label: 'Published', value: venues.filter(v => v.listingStatus === 'Published').length.toString(), color: 'emerald' },
          { label: 'Unclaimed', value: venues.filter(v => v.claimStatus === 'Unclaimed').length.toString(), color: 'slate' },
          { label: 'Pending Claims', value: venues.filter(v => v.claimStatus === 'Claim Pending' || v.claimStatus === 'Pending Review').length.toString(), color: 'amber' },
          { label: 'Claimed & Verified', value: venues.filter(v => v.claimStatus === 'Claimed').length.toString(), color: 'rose' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-slate-500 text-sm font-medium mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by venue name or location..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pd-blue/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none">
            <option>All Statuses</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
          <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none">
            <option>All Claim States</option>
            <option>Unclaimed</option>
            <option>Claim Pending</option>
            <option>Claimed</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium">
            <Filter size={18} /> More Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Venue</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Listing Status</th>
                <th className="px-6 py-4">Claim Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      Loading realtime venue data...
                    </div>
                  </td>
                </tr>
              ) : venues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No venues found in the database.
                  </td>
                </tr>
              ) : venues.map((venue) => (
                <tr key={venue.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{venue.name}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{venue.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin size={14} className="text-slate-400" /> {venue.city}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      venue.listingStatus === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {venue.listingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      venue.claimStatus === 'Claimed' ? 'bg-blue-50 text-blue-700' :
                      venue.claimStatus === 'Claim Pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {venue.claimStatus === 'Claimed' ? <CheckCircle size={12} /> : 
                       venue.claimStatus === 'Claim Pending' ? <AlertTriangle size={12} /> : <ShieldAlert size={12} />}
                      {venue.claimStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => {
            setEditingVenueId(venue.id);
            setNewVenue({ 
              name: venue.name || '', category: venue.type || 'Banquet Hall', city: venue.city || 'Haldwani', address: venue.location || '', phone: venue.contactNumber || '',
              email: venue.contactEmail || '', password: '', description: venue.description || '', state: venue.state || '', pincode: venue.pincode || '', mapLink: venue.mapLink || '',
              capacity: venue.capacity ? venue.capacity.toString() : '', vegPrice: venue.perPlateVeg ? venue.perPlateVeg.toString() : '', nonVegPrice: venue.perPlateNonVeg ? venue.perPlateNonVeg.toString() : '',
              amenities: (() => { try { return JSON.parse(venue.amenities || '[]') } catch { return [] } })(),
              eventTypes: (() => { try { return JSON.parse(venue.eventTypes || '[]') } catch { return [] } })(),
              existingPhotos: (() => { try { return JSON.parse(venue.photos || '[]') } catch { return [] } })(),
              claimStatus: venue.claimStatus || 'Unclaimed'
            });
            setIsImportModalOpen(true);
          }} className="text-pd-red hover:text-red-700 font-medium text-sm mr-4">Edit</button><a href={`http://localhost:3001/venues/${venue.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium text-sm">View Listing</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

            {/* Import/Create Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-[24px] shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] transition-all duration-300`}>
            
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold font-sf text-slate-900">Create / Import Venue</h3>
                <p className="text-sm text-slate-500 font-pd mt-1">Add a new venue listing to the PartyDial database.</p>
              </div>
              <button onClick={() => { setIsImportModalOpen(false); setEditingVenueId(null); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto font-pd">
              
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex gap-3 mb-8">
                    <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-800 leading-relaxed">
                      You are creating a fully <strong>Claimed & Verified</strong> venue. 
                      You have full access to fill out the entire vendor onboarding profile directly from the Admin panel.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Basic Info */}
                    <div className="col-span-3 pb-2 border-b border-slate-100"><h4 className="font-bold text-slate-900">1. Basic Information</h4></div>
                    
                    <div className="col-span-3 md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Venue Name <span className="text-rose-500">*</span></label>
                      <input type="text" value={newVenue.name} onChange={(e) => setNewVenue({...newVenue, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Assign to Partner Account</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none">
                        <option>Create new vendor profile...</option>
                        <option>Search existing vendors...</option>
                      </select>
                    </div>

                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Business Email <span className="text-rose-500">*</span></label>
                      <input type="email" value={newVenue.email} onChange={(e) => setNewVenue({...newVenue, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Business Phone <span className="text-rose-500">*</span></label>
                      <input type="text" value={newVenue.phone} onChange={(e) => setNewVenue({...newVenue, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">New Account Password <span className="text-rose-500">*</span></label>
                      <input type="password" value={newVenue.password} onChange={(e) => setNewVenue({...newVenue, password: e.target.value})} placeholder="Create vendor password..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>

                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Venue Category <span className="text-rose-500">*</span></label>
                      <select value={newVenue.category} onChange={(e) => setNewVenue({...newVenue, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none">
                        <option>Banquet Hall</option>
                        <option>Resort</option>
                        <option>Lawn</option>
                        <option>Hotel</option>
                        <option>Restaurant</option>
                      </select>
                    </div>

                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Claim Status</label>
                      <select value={newVenue.claimStatus} onChange={(e) => setNewVenue({...newVenue, claimStatus: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none">
                        <option value="Unclaimed">Unclaimed</option>
                        <option value="Claimed">Claimed</option>
                      </select>
                    </div>

                    <div className="col-span-3">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Venue Description <span className="text-rose-500">*</span></label>
                      <textarea rows={4} value={newVenue.description} onChange={(e) => setNewVenue({...newVenue, description: e.target.value})} placeholder="Describe the venue..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"></textarea>
                    </div>

                    {/* Location */}
                    <div className="col-span-3 pb-2 border-b border-slate-100 mt-4"><h4 className="font-bold text-slate-900">2. Location Details</h4></div>
                    
                    <div className="col-span-3 md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Complete Address <span className="text-rose-500">*</span></label>
                      <input type="text" value={newVenue.address} onChange={(e) => setNewVenue({...newVenue, address: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">City <span className="text-rose-500">*</span></label>
                      <input type="text" value={newVenue.city} onChange={(e) => setNewVenue({...newVenue, city: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">State <span className="text-rose-500">*</span></label>
                      <input type="text" value={newVenue.state} onChange={(e) => setNewVenue({...newVenue, state: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Pincode <span className="text-rose-500">*</span></label>
                      <input type="text" value={newVenue.pincode} onChange={(e) => setNewVenue({...newVenue, pincode: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Google Maps Link</label>
                      <input type="url" value={newVenue.mapLink} onChange={(e) => setNewVenue({...newVenue, mapLink: e.target.value})} placeholder="https://maps.google.com/..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>

                    {/* Capacity & Pricing */}
                    <div className="col-span-3 pb-2 border-b border-slate-100 mt-4"><h4 className="font-bold text-slate-900">3. Capacity & Pricing</h4></div>
                    
                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Guest Capacity <span className="text-rose-500">*</span></label>
                      <input type="number" value={newVenue.capacity} onChange={(e) => setNewVenue({...newVenue, capacity: e.target.value})} placeholder="e.g. 500" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Veg Price (per plate) <span className="text-rose-500">*</span></label>
                      <input type="number" value={newVenue.vegPrice} onChange={(e) => setNewVenue({...newVenue, vegPrice: e.target.value})} placeholder="₹" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Non-Veg Price (per plate)</label>
                      <input type="number" value={newVenue.nonVegPrice} onChange={(e) => setNewVenue({...newVenue, nonVegPrice: e.target.value})} placeholder="₹" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>

                    {/* Facilities & Event Types */}
                    <div className="col-span-3 pb-2 border-b border-slate-100 mt-4"><h4 className="font-bold text-slate-900">4. Facilities & Event Types</h4></div>
                    
                    <div className="col-span-3 md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Amenities / Facilities</label>
                      <div className="flex flex-wrap gap-3">
                        {['Air Conditioned', 'Ample Parking', 'Wi-Fi', 'DJ Provided', 'Liquor Allowed', 'Wheelchair Access', 'Power Backup', 'Decor Provided'].map((f, i) => (
                          <label key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                            <input 
                              type="checkbox" 
                              checked={newVenue.amenities.includes(f)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewVenue({...newVenue, amenities: [...newVenue.amenities, f]});
                                } else {
                                  setNewVenue({...newVenue, amenities: newVenue.amenities.filter(a => a !== f)});
                                }
                              }}
                              className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500" 
                            />
                            <span className="text-sm font-medium text-slate-700">{f}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Event Types Allowed</label>
                      <div className="flex flex-col gap-2">
                        {['Wedding', 'Pre-Wedding', 'Birthday Party', 'Corporate Event'].map((f, i) => (
                          <label key={i} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={newVenue.eventTypes.includes(f)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewVenue({...newVenue, eventTypes: [...newVenue.eventTypes, f]});
                                } else {
                                  setNewVenue({...newVenue, eventTypes: newVenue.eventTypes.filter(t => t !== f)});
                                }
                              }}
                              className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500" 
                            />
                            <span className="text-sm font-medium text-slate-700">{f}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Media */}
                    <div className="col-span-3 pb-2 border-b border-slate-100 mt-4"><h4 className="font-bold text-slate-900">5. Media & Assets</h4></div>
                    <div className="col-span-3">
                      <label htmlFor="venue-photos" className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-200 text-rose-500 pointer-events-none">
                          <Plus size={32} />
                        </div>
                        <span className="font-semibold text-lg text-slate-700 pointer-events-none">Upload High-Quality Photos</span>
                        <span className="text-sm mt-1 text-slate-500 pointer-events-none">Drag & drop or click to browse (Min 5 photos required for verification)</span>
                        <input type="file" id="venue-photos" multiple accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                      </label>

                      {/* Image Previews */}
                      {(newVenue.existingPhotos.length > 0 || selectedPhotos.length > 0) && (
                        <div className="mt-6">
                          <p className="text-sm font-semibold text-slate-800 mb-3">Photo Previews</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {/* Existing Photos */}
                            {newVenue.existingPhotos.map((photoId, idx) => {
                              const baseServerUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5005';
                              const serverUrl = baseServerUrl.endsWith('/api') ? baseServerUrl : `${baseServerUrl}/api`;
                              return (
                              <div key={`existing-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                                <img 
                                  src={`${serverUrl}/venues/proxy/image/${STORAGE_BUCKET_ID}/${photoId}`} 
                                  alt={`Venue photo ${idx + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setNewVenue({...newVenue, existingPhotos: newVenue.existingPhotos.filter(id => id !== photoId)});
                                  }}
                                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50"
                                >
                                  ✕
                                </button>
                              </div>
                            )})}
                            
                            {/* Newly Selected Photos */}
                            {selectedPhotos.map((file, idx) => (
                              <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-emerald-500/50 group bg-slate-100">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={`New upload ${idx + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-1 truncate text-center">
                                  New Upload
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedPhotos(selectedPhotos.filter((_, i) => i !== idx));
                                  }}
                                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              
            </div>
            
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 font-pd">
              <button onClick={() => { setIsImportModalOpen(false); setEditingVenueId(null); }} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold">
                Cancel
              </button>
              <button 
                onClick={handleCreateVenue} 
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 font-semibold shadow-md shadow-rose-500/20 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving to Database...' : 'Save Full Venue Profile'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none p-4">
          <div className={`animate-in zoom-in-95 fade-in duration-200 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-3 ${toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {toast.type === 'success' ? <CheckCircle size={24} className="text-emerald-400" /> : <AlertTriangle size={24} />}
            <span className="font-semibold text-lg">{toast.message}</span>
            {toast.type === 'error' && (
              <button onClick={() => setToast(null)} className="ml-2 pointer-events-auto hover:opacity-70">
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}