const fs = require('fs');
const file = '/Users/haldwani/Documents/Working/party_dial/client/src/app/(user-portal)/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state for slideshow
const stateTarget = `  const [activeTab, setActiveTab] = useState<'standard' | 'ai'>('standard');`;
const stateReplacement = `  const [activeTab, setActiveTab] = useState<'standard' | 'ai'>('standard');
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);`;

content = content.replace(stateTarget, stateReplacement);

// 2. Replace Hero Section
const heroStartStr = `      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-24 pb-16 lg:pb-24 px-4 md:px-6 overflow-hidden bg-slate-50 min-h-screen flex items-center">`;
const heroEndStr = `            {/* Social Proof */}
            <div className="mt-12 flex justify-center">`;

const startIndex = content.indexOf(heroStartStr);
const endIndex = content.indexOf(heroEndStr);

if (startIndex === -1 || endIndex === -1) {
  console.log("Failed to find boundaries");
  process.exit(1);
}

const newHero = `      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-24 pb-16 lg:pb-24 px-4 md:px-6 overflow-hidden min-h-screen flex items-center">
        
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: \`url(\${heroImages[currentSlide]})\` }}
            />
          </AnimatePresence>
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 w-full text-center mt-12 md:mt-20">
            {/* Hero Text */}
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
                <span className="text-xs md:text-sm font-bold bg-linear-to-r from-pd-pink to-amber-300 bg-clip-text text-transparent uppercase tracking-wider">
                🎉 India's #1 Venue Booking Platform
                </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
                Find the Perfect Venue for Your Event
            </h1>

            <p className="text-base md:text-lg text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
                Get free customized quotes from top venues in minutes. Direct connections. Zero brokerage. Beautiful memories.
            </p>

            {/* HORIZONTAL SEARCH WIDGET */}
            <div className="max-w-5xl mx-auto bg-white rounded-[32px] p-2 md:p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 relative mt-8 z-50">
              
              {/* Tabs */}
              <div className="flex items-center gap-2 mb-2 px-2 pt-2 border-b border-slate-100 pb-2">
                 <button onClick={() => setActiveTab('standard')} className={\`px-5 py-2.5 rounded-full text-sm font-bold transition-all \${activeTab === 'standard' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800'}\`}>
                    <span className="flex items-center gap-2">
                       <MapPin size={16} /> Locations & Dates
                    </span>
                 </button>
                 <button onClick={() => setActiveTab('ai')} className={\`px-5 py-2.5 rounded-full text-sm font-bold transition-all \${activeTab === 'ai' ? 'bg-pd-pink/10 text-pd-pink' : 'text-slate-500 hover:text-slate-800'}\`}>
                    <span className="flex items-center gap-2">
                       <Sparkles size={16} /> Ask AI
                    </span>
                 </button>
              </div>

              {/* Standard Search Fields */}
              {activeTab === 'standard' && (
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0 bg-slate-50 rounded-[24px] p-2">
                  
                  {/* Event Type */}
                  <div className="relative w-full md:w-[22%]" ref={eventDropdownRef}>
                    <button type="button" onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)} className="w-full text-left h-[60px] px-4 rounded-xl hover:bg-slate-100 transition-colors flex flex-col justify-center">
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Event Type</span>
                       <span className={\`text-sm font-bold truncate \${formData.eventType ? 'text-slate-900' : 'text-slate-500'}\`}>
                         {formData.eventType || "Any Event"}
                       </span>
                    </button>
                    <AnimatePresence>
                      {isEventDropdownOpen && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-64 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-40 py-2 max-h-64 overflow-y-auto custom-scrollbar text-left">
                          {categories.map((cat, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, eventType: cat.name });
                                setIsEventDropdownOpen(false);
                              }}
                              className={\`w-full text-left px-5 py-3 text-sm font-bold transition-all flex items-center gap-3 hover:bg-slate-50 \${formData.eventType === cat.name ? 'text-pd-red bg-pd-red/[0.04]' : 'text-slate-600 hover:text-slate-900'}\`}
                            >
                              <span className="text-xl opacity-80">{cat.icon}</span>
                              {cat.name}
                              {formData.eventType === cat.name && <CheckCircle2 size={16} className="ml-auto text-pd-red" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="hidden md:block w-px h-10 bg-slate-200" />
                  
                  {/* City / Location */}
                  <div className="relative w-full md:w-[28%]" ref={locationRef}>
                    <div className="w-full h-[60px] px-4 rounded-xl hover:bg-slate-100 transition-colors flex flex-col justify-center cursor-text" onClick={() => {}}>
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider text-left">Location</span>
                       
                       <div className="flex items-center gap-1 w-full overflow-x-auto custom-scrollbar no-scrollbar py-0.5">
                         {formData.locations.map((loc, i) => (
                            <div key={i} className="flex items-center gap-1 bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
                              <span>{loc.display.split('-')[0]}</span>
                              <button onClick={(e) => { e.stopPropagation(); removeLocation(loc.display); }} className="text-slate-400 hover:text-pd-red">
                                <X size={12} />
                              </button>
                            </div>
                         ))}
                         <input
                           type="text"
                           placeholder={formData.locations.length === 0 ? "Where are you going?" : "Add..."}
                           value={locationInput}
                           onChange={(e) => {
                             setLocationInput(e.target.value);
                             setShowSuggestions(true);
                           }}
                           onFocus={() => setShowSuggestions(true)}
                           className="flex-1 bg-transparent border-none text-sm font-bold text-slate-800 outline-none min-w-[100px] placeholder:text-slate-500 placeholder:font-medium p-0 m-0 focus:ring-0 focus:outline-none"
                           style={{ boxShadow: 'none' }}
                         />
                       </div>
                    </div>

                    <AnimatePresence>
                      {showSuggestions && (locationInput.length >= 3) && (suggestions.length > 0 || isLoadingLocations) && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-40 max-h-64 overflow-y-auto custom-scrollbar text-left">
                          {isLoadingLocations ? (
                            <div className="p-6 flex justify-center items-center gap-3 text-sm text-slate-500 font-bold">
                              <div className="w-4 h-4 border-2 border-pd-purple border-t-transparent rounded-full animate-spin" /> Searching...
                            </div>
                          ) : (
                            suggestions.map((s, i) => (
                              s.isError ? (
                                <div key={i} className="p-4 text-center text-xs text-pd-red font-black uppercase tracking-widest bg-pd-red/5 m-2 rounded-xl">
                                  {s.message}
                                </div>
                              ) : (
                                <button
                                  key={i}
                                  onClick={() => addLocation(s)}
                                  className="w-full text-left px-5 py-3 hover:bg-slate-50 text-sm font-bold text-slate-800 transition-colors border-b border-slate-50 last:border-none flex items-center justify-between group"
                                >
                                  <span className="group-hover:text-pd-purple transition-colors">{s.display}</span>
                                  <span className="text-[10px] text-slate-400 uppercase font-black bg-slate-100 px-2 py-1 rounded-md">{s.state}</span>
                                </button>
                              )
                            ))
                          )}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="hidden md:block w-px h-10 bg-slate-200" />

                  {/* Event Date */}
                  <div className="relative w-full md:w-[15%]">
                     <div className="w-full h-[60px] px-4 rounded-xl hover:bg-slate-100 transition-colors flex flex-col justify-center relative">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider text-left">Date</span>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full bg-transparent border-none text-sm font-bold text-slate-800 outline-none p-0 m-0 focus:ring-0 focus:outline-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                     </div>
                  </div>

                  <div className="hidden md:block w-px h-10 bg-slate-200" />

                  {/* Guest Count */}
                  <div className="relative w-full md:w-[15%]">
                     <div className="w-full h-[60px] px-4 rounded-xl hover:bg-slate-100 transition-colors flex flex-col justify-center relative">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider text-left">Guests</span>
                        <select
                          className="w-full bg-transparent border-none text-sm font-bold text-slate-800 outline-none appearance-none cursor-pointer p-0 m-0 focus:ring-0 focus:outline-none pr-4"
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        >
                          <option value="">Capacity</option>
                          <option value="0-50">0-50</option>
                          <option value="50-100">50-100</option>
                          <option value="100-200">100-200</option>
                          <option value="200-500">200-500</option>
                          <option value="500-1000">500-1000</option>
                          <option value="1000-2000">1000-2000</option>
                          <option value="2000-5000">2000-5000</option>
                          <option value="5000+">5000+</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-[65%] -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                     </div>
                  </div>

                  {/* Search Button */}
                  <div className="w-full md:w-[20%] p-1">
                    <button onClick={handleSearch} className="w-full h-[52px] bg-pd-pink text-white rounded-[16px] font-black text-sm uppercase tracking-wider hover:bg-pd-red transition-all flex items-center justify-center gap-2 shadow-lg shadow-pd-pink/30 hover:shadow-pd-pink/40 hover:-translate-y-0.5">
                      <Search size={18} /> Search
                    </button>
                  </div>

                </div>
              )}
              
              {/* AI Search Field */}
              {activeTab === 'ai' && (
                 <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0 bg-slate-50 rounded-[24px] p-2">
                   <div className="flex-1 w-full flex items-center gap-3 px-4 h-[60px]">
                      <Sparkles className="text-pd-pink shrink-0" size={24} />
                      <input 
                         type="text" 
                         value={aiQuery}
                         onChange={(e) => setAiQuery(e.target.value)}
                         placeholder="e.g. Find a wedding venue in Delhi for 500 guests under 20 lakhs" 
                         className="w-full bg-transparent border-none outline-none text-slate-800 text-sm md:text-base font-medium placeholder:text-slate-400 focus:ring-0"
                      />
                   </div>
                   <div className="w-full md:w-auto p-1 shrink-0">
                     <button className="w-full md:w-auto px-8 h-[52px] bg-linear-to-r from-pd-purple to-pd-blue text-white rounded-[16px] font-black text-sm uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pd-purple/30 hover:-translate-y-0.5">
                       <Sparkles size={18} /> Ask AI
                     </button>
                   </div>
                 </div>
              )}
            </div>

`;

content = content.substring(0, startIndex) + newHero + content.substring(endIndex);
fs.writeFileSync(file, content, 'utf8');
console.log('Slideshow patched');
