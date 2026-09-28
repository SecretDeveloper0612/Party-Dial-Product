import re

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

new_component = """
     {/* 10. NATIONAL EXPANSION - MAP DESIGN */}
     <section className="relative py-24 px-6 overflow-hidden bg-white border-y border-slate-50 font-pd">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,#3B82F608,transparent_60%)]"></div>
      
      <div className="max-w-360 mx-auto lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column - Typography & Locations */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pd-blue/5 text-pd-blue text-[10px] uppercase tracking-[0.4em] mb-6 border border-pd-blue/10">
              <span className="w-1.5 h-1.5 rounded-full bg-pd-blue animate-ping"></span> 
              National Expansion
            </div>
            
            <h3 className="text-4xl md:text-6xl font-semibold font-sf text-[#0F172A] tracking-tight leading-[1.1] mb-6">
              Dominating <span className="pd-gradient-text not-">The Hills</span> <br className="hidden md:block" />
              Scaling India
            </h3>
            
            <p className="text-slate-500 text-base font-normal font-pd leading-relaxed mb-10">
              After successfully digitizing the venue ecosystem across 13 districts in Uttarakhand, we are launching hyper-localized discovery hubs in major metropolitan areas to connect high-intent customers to premium venues nationwide.
            </p>

            <div className="flex flex-col gap-6">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Phase 02 Expansion Locations</div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { state: "Delhi NCR", city: "Gurugram", color: "bg-blue-500" },
                  { state: "Maharashtra", city: "Mumbai", color: "bg-purple-500" },
                  { state: "Punjab", city: "Chandigarh", color: "bg-pink-500" },
                  { state: "Rajasthan", city: "Jaipur", color: "bg-amber-500" },
                  { state: "Gujarat", city: "Ahmedabad", color: "bg-orange-500" },
                  { state: "Uttar Pradesh", city: "Lucknow", color: "bg-indigo-500" },
                ].map((loc, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${loc.color} shadow-sm`}></div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{loc.state}</div>
                      <div className="text-[10px] text-slate-400">{loc.city}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Map Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 relative"
          >
            <div className="relative w-full aspect-square md:aspect-[4/3] bg-slate-50 rounded-[40px] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/50 flex items-center justify-center group">
              
              {/* Subtle Grid Background */}
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0F172A 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              
              {/* Map Glows */}
              <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-emerald-400/20 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-pd-blue/20 blur-[80px] rounded-full pointer-events-none"></div>

              {/* Connected Map Pins Container */}
              <div className="relative w-full max-w-[500px] h-full max-h-[500px]">
                
                <style>{`
                  @keyframes dash-flow {
                    to { stroke-dashoffset: -20; }
                  }
                  .animate-flow { animation: dash-flow 1s linear infinite; }
                `}</style>

                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ strokeDasharray: '4 4' }}>
                  {/* From Uttarakhand (x:350, y:120) to other pins */}
                  {[
                    "M 350 120 L 280 180", // To Delhi
                    "M 350 120 L 250 100", // To Punjab
                    "M 350 120 L 380 250", // To UP
                    "M 350 120 L 180 260", // To Rajasthan
                    "M 350 120 L 100 350", // To Gujarat
                    "M 350 120 L 150 450", // To Maharashtra
                  ].map((path, i) => (
                    <path key={i} d={path} fill="none" stroke="#cbd5e1" strokeWidth="1.5" className="animate-flow opacity-50 group-hover:stroke-pd-blue/50 transition-colors duration-700" />
                  ))}
                </svg>

                {/* Pin Points */}
                {[
                  { id: "UK", name: "Uttarakhand", status: "100% Live", x: 350, y: 120, color: "emerald", isCore: true },
                  { id: "PB", name: "Punjab", status: "Upcoming", x: 250, y: 100, color: "pink" },
                  { id: "DL", name: "Delhi NCR", status: "Scaling", x: 280, y: 180, color: "blue" },
                  { id: "UP", name: "Uttar Pradesh", status: "Upcoming", x: 380, y: 250, color: "indigo" },
                  { id: "RJ", name: "Rajasthan", status: "Upcoming", x: 180, y: 260, color: "amber" },
                  { id: "GJ", name: "Gujarat", status: "Upcoming", x: 100, y: 350, color: "orange" },
                  { id: "MH", name: "Maharashtra", status: "Phase 03", x: 150, y: 450, color: "purple" }
                ].map((pin, i) => (
                  <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin cursor-pointer" style={{ left: pin.x, top: pin.y }}>
                    {/* Pulsing Dot */}
                    <div className="relative flex items-center justify-center">
                      {pin.isCore ? (
                        <>
                          <div className={`absolute w-12 h-12 bg-${pin.color}-400/20 rounded-full animate-ping`}></div>
                          <div className={`w-4 h-4 bg-${pin.color}-500 rounded-full border-2 border-white shadow-lg relative z-10`}></div>
                        </>
                      ) : (
                        <div className={`w-3 h-3 bg-${pin.color}-500 rounded-full border-2 border-white shadow-md transition-transform group-hover/pin:scale-150`}></div>
                      )}
                    </div>
                    
                    {/* Tooltip Label */}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-white px-3 py-2 rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover/pin:opacity-100 group-hover/pin:-translate-y-1 transition-all duration-300 pointer-events-none z-30`}>
                      <div className="text-xs font-semibold text-slate-800">{pin.name}</div>
                      <div className={`text-[9px] font-bold text-${pin.color}-500 uppercase tracking-widest`}>{pin.status}</div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </motion.div>

        </div>
      </div>
     </section>
"""

pattern = re.compile(r'\{\/\* 10\. NATIONAL EXPANSION - BENTO GRID REDESIGN \*\/\}.*?(?=\{\/\* 11\. FAQ - MILLION DOLLAR SAAS REDESIGN \*\/\})', re.DOTALL)
content = re.sub(pattern, new_component + '\n\n     ', content)

with open(file_path, 'w') as f:
    f.write(content)

print("Redesigned Map Section.")
