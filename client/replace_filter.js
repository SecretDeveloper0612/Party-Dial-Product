const fs = require('fs');
const path = '/Users/haldwani/Documents/Working/party_dial/client/src/app/(user-portal)/venues/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update imports
if (!content.includes('Settings2')) {
  content = content.replace('Search,', 'Search,\n  Settings2,\n  RotateCcw,');
}

// Extract filterFormUI
const startMarker = 'const filterFormUI = (';
const endMarker = '    </div>\n  );';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex) + endMarker.length;

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find filterFormUI");
  process.exit(1);
}

const newUI = `const filterFormUI = (
    <div className="w-full max-w-7xl mx-auto mb-12 z-20 relative px-4">
      {/* --- TOP MAIN SEARCH BAR --- */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center p-3 lg:p-4 gap-4 relative z-20">
        
        {/* Left Side: Text */}
        <div className="flex flex-col flex-1 pl-4 shrink-0 hidden lg:flex">
           <h2 className="text-xl font-bold text-slate-900">Find the Perfect Venue</h2>
           <p className="text-sm font-medium text-slate-500">Search and filter by your preferences</p>
        </div>

        {/* Center Side: Search Input */}
        <div className="flex-[2] w-full relative">
           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pd-red">
             <Search size={20} />
           </div>
           <input 
             type="text"
             value={locationSearchQuery}
             onChange={(e) => setLocationSearchQuery(e.target.value)}
             placeholder="Search venues, locations, or events..."
             className="w-full h-12 bg-white border border-slate-200 rounded-full pl-12 pr-6 text-sm font-medium text-slate-700 outline-none focus:border-pd-red focus:ring-4 focus:ring-pd-red/10 transition-all shadow-sm placeholder:text-slate-400"
           />
        </div>

        {/* Right Side: Filters Button */}
        <div className="flex-1 w-full lg:w-auto flex justify-end pr-2 shrink-0">
           <button 
             onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
             className="bg-pd-red/10 text-pd-red px-6 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-pd-red/20 transition-colors w-full lg:w-auto"
           >
             <Settings2 size={18} />
             Filters
             <ChevronDown size={16} className={\`ml-1 transition-transform \${showAdvancedFilters ? 'rotate-180' : ''}\`} />
           </button>
        </div>
      </div>

      {/* --- BOTTOM DROPDOWN FILTERS --- */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-100 mt-4 p-6 relative z-10 hidden lg:block"
          >
             {/* Header */}
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-pd-red/10 text-pd-red rounded-xl flex items-center justify-center">
                   <Settings2 size={20} />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-slate-900">Filter Venues</h3>
                   <p className="text-xs text-slate-500 font-medium">Refine your search to find the perfect venue</p>
                 </div>
               </div>
               <button 
                 onClick={clearFilters}
                 className="text-pd-red text-sm font-bold flex items-center gap-2 hover:opacity-80 transition-opacity"
               >
                 Clear All <RotateCcw size={16} />
               </button>
             </div>

             {/* Grid */}
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
               
               {/* 1. Location */}
               <div className="space-y-2 relative">
                 <label className="text-[11px] font-bold text-slate-900 pl-2">Location</label>
                 <div 
                   className="h-12 border border-slate-200 rounded-full px-4 flex items-center justify-between cursor-pointer hover:border-pd-red transition-colors"
                   onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'location' ? null : 'location')}
                 >
                   <div className="flex items-center gap-2 text-slate-700 font-semibold text-[13px]">
                     <MapPin size={16} className="text-pd-red shrink-0" />
                     <span className="truncate max-w-[80px]">{selectedCities[0] || 'Any Location'}</span>
                   </div>
                   <ChevronDown size={14} className="text-slate-400 shrink-0" />
                 </div>
                 
                 {activeFilterDropdown === 'location' && (
                    <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-slate-100 rounded-3xl shadow-xl z-50 p-4 max-h-60 overflow-y-auto no-scrollbar">
                       <div onClick={() => { setSelectedCities([]); setActiveFilterDropdown(null); }} className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm font-medium rounded-xl">Any Location</div>
                       {DEFAULT_UK_CITIES.map(c => (
                         <div key={c} onClick={() => { handleToggle(selectedCities, setSelectedCities, c); setActiveFilterDropdown(null); }} className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm font-medium rounded-xl flex items-center justify-between">
                           {c}
                           {selectedCities.includes(c) && <Check size={14} className="text-pd-red" />}
                         </div>
                       ))}
                    </div>
                 )}
               </div>

               {/* 2. Event Type */}
               <div className="space-y-2 relative">
                 <label className="text-[11px] font-bold text-slate-900 pl-2">Event Type</label>
                 <div 
                   className="h-12 border border-slate-200 rounded-full px-4 flex items-center justify-between cursor-pointer hover:border-pd-red transition-colors"
                   onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'event' ? null : 'event')}
                 >
                   <div className="flex items-center gap-2 text-slate-700 font-semibold text-[13px]">
                     <Calendar size={16} className="text-pd-red shrink-0" />
                     <span className="truncate max-w-[80px]">{selectedEvent || 'All Events'}</span>
                   </div>
                   <ChevronDown size={14} className="text-slate-400 shrink-0" />
                 </div>
                 
                 {activeFilterDropdown === 'event' && (
                    <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-slate-100 rounded-3xl shadow-xl z-50 p-4 max-h-60 overflow-y-auto no-scrollbar">
                       <div onClick={() => { setSelectedEvent(''); setActiveFilterDropdown(null); }} className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm font-medium rounded-xl">All Events</div>
                       {FILTER_CONFIG.eventTypes.map(c => (
                         <div key={c} onClick={() => { setSelectedEvent(c); setActiveFilterDropdown(null); }} className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm font-medium rounded-xl flex items-center justify-between">
                           {c}
                           {selectedEvent === c && <Check size={14} className="text-pd-red" />}
                         </div>
                       ))}
                    </div>
                 )}
               </div>

               {/* 3. Venue Type */}
               <div className="space-y-2 relative">
                 <label className="text-[11px] font-bold text-slate-900 pl-2">Venue Type</label>
                 <div 
                   className="h-12 border border-slate-200 rounded-full px-4 flex items-center justify-between cursor-pointer hover:border-pd-red transition-colors"
                   onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'venue' ? null : 'venue')}
                 >
                   <div className="flex items-center gap-2 text-slate-700 font-semibold text-[13px]">
                     <Building2 size={16} className="text-pd-red shrink-0" />
                     <span className="truncate max-w-[80px]">{selectedVenueTypes.length > 0 ? \`\${selectedVenueTypes.length} Types\` : 'All Types'}</span>
                   </div>
                   <ChevronDown size={14} className="text-slate-400 shrink-0" />
                 </div>
                 {activeFilterDropdown === 'venue' && (
                    <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-slate-100 rounded-3xl shadow-xl z-50 p-4 max-h-60 overflow-y-auto no-scrollbar">
                       {FILTER_CONFIG.venueTypes.map(c => (
                         <div key={c} onClick={() => { handleToggle(selectedVenueTypes, setSelectedVenueTypes, c); }} className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm font-medium rounded-xl flex items-center justify-between">
                           {c} 
                           {selectedVenueTypes.includes(c) && <Check size={14} className="text-pd-red" />}
                         </div>
                       ))}
                    </div>
                 )}
               </div>

               {/* 4. Price Range */}
               <div className="space-y-2 relative">
                 <label className="text-[11px] font-bold text-slate-900 pl-2">Price Range</label>
                 <div 
                   className="h-12 border border-slate-200 rounded-full px-4 flex items-center justify-between cursor-pointer hover:border-pd-red transition-colors"
                   onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'price' ? null : 'price')}
                 >
                   <div className="flex items-center gap-2 text-slate-700 font-semibold text-[13px]">
                     <IndianRupee size={16} className="text-pd-red shrink-0" />
                     <span className="truncate max-w-[80px]">{budgetRange.max < 10000 ? \`₹\${budgetRange.min} - ₹\${budgetRange.max}\` : 'Any Budget'}</span>
                   </div>
                   <ChevronDown size={14} className="text-slate-400 shrink-0" />
                 </div>
                 {activeFilterDropdown === 'price' && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-white border border-slate-100 rounded-3xl shadow-xl z-50 p-6">
                       <input 
                         type="range" min="0" max="10000" step="500" 
                         value={budgetRange.max} 
                         onChange={(e) => setBudgetRange({ min: 0, max: parseInt(e.target.value) })}
                         className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pd-red mb-4"
                       />
                       <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>₹0</span>
                          <span>{budgetRange.max === 10000 ? 'Any' : \`₹\${budgetRange.max}\`}</span>
                       </div>
                    </div>
                 )}
               </div>

               {/* 5. Guest Capacity */}
               <div className="space-y-2 relative">
                 <label className="text-[11px] font-bold text-slate-900 pl-2">Guest Capacity</label>
                 <div 
                   className="h-12 border border-slate-200 rounded-full px-4 flex items-center justify-between cursor-pointer hover:border-pd-red transition-colors"
                   onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'capacity' ? null : 'capacity')}
                 >
                   <div className="flex items-center gap-2 text-slate-700 font-semibold text-[13px]">
                     <Users size={16} className="text-pd-red shrink-0" />
                     <span className="truncate max-w-[80px]">{selectedCapacity > 0 ? \`\${selectedCapacity}+ Guests\` : 'Any Capacity'}</span>
                   </div>
                   <ChevronDown size={14} className="text-slate-400 shrink-0" />
                 </div>
                 {activeFilterDropdown === 'capacity' && (
                    <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-slate-100 rounded-3xl shadow-xl z-50 p-6">
                       <input 
                         type="range" min="0" max="5000" step="100" 
                         value={selectedCapacity} 
                         onChange={(e) => setSelectedCapacity(parseInt(e.target.value))}
                         className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pd-red mb-4"
                       />
                       <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>0</span>
                          <span>{selectedCapacity > 0 ? \`\${selectedCapacity}+\` : 'Any'}</span>
                       </div>
                    </div>
                 )}
               </div>

               {/* 6. Amenities */}
               <div className="space-y-2 relative">
                 <label className="text-[11px] font-bold text-slate-900 pl-2">Amenities</label>
                 <div 
                   className="h-12 border border-slate-200 rounded-full px-4 flex items-center justify-between cursor-pointer hover:border-pd-red transition-colors"
                   onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'amenities' ? null : 'amenities')}
                 >
                   <div className="flex items-center gap-2 text-slate-700 font-semibold text-[13px]">
                     <Star size={16} className="text-pd-red shrink-0" />
                     <span className="truncate max-w-[80px]">{selectedAmenities.length > 0 ? \`\${selectedAmenities.length} Amenities\` : 'Select Amenities'}</span>
                   </div>
                   <ChevronDown size={14} className="text-slate-400 shrink-0" />
                 </div>
                 {activeFilterDropdown === 'amenities' && (
                    <div className="absolute top-full mt-2 right-0 w-72 bg-white border border-slate-100 rounded-3xl shadow-xl z-50 p-4 max-h-80 overflow-y-auto no-scrollbar">
                       <div className="flex flex-wrap gap-2">
                         {FILTER_CONFIG.amenities.map(a => (
                            <button 
                              key={a}
                              onClick={() => handleToggle(selectedAmenities, setSelectedAmenities, a)}
                              className={\`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border \${
                                selectedAmenities.includes(a) ? 'border-pd-red bg-pd-red text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-900'
                              }\`}
                            >
                              {a}
                            </button>
                         ))}
                       </div>
                    </div>
                 )}
               </div>
             </div>

             {/* Bottom Button */}
             <div className="flex justify-center mt-6">
                <button 
                  onClick={() => setShowAdvancedFilters(false)}
                  className="bg-pd-red text-white px-10 py-3.5 rounded-full text-sm font-bold shadow-md hover:bg-rose-600 hover:shadow-pd-red/30 transition-all flex items-center gap-2"
                >
                  <Search size={16} strokeWidth={2.5} />
                  Search Venues
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );`;

content = content.substring(0, startIndex) + newUI + content.substring(endIndex);
fs.writeFileSync(path, content, 'utf8');
console.log("Replaced successfully!");
