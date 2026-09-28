import re

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'
svg_path_file = '/Users/haldwani/Documents/Working/party_dial/vendor/public/india.svg'

with open(file_path, 'r') as f:
    content = f.read()

with open(svg_path_file, 'r') as f:
    svg_content = f.read()

# Extract path from svg_content
path_match = re.search(r'<path d="(.*?)"', svg_content, re.DOTALL)
if path_match:
    svg_path_d = path_match.group(1).replace('\n', ' ')
else:
    print("Could not find path in SVG")
    exit(1)


new_map_section = """
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
              <div className="relative w-full h-full max-w-[500px] max-h-[500px] flex items-center justify-center pt-8">
                
                {/* Animated India SVG */}
                <div className="absolute inset-0 w-full h-full p-4 pointer-events-none flex items-center justify-center">
                  <svg viewBox="0 0 1024 1024" className="w-[85%] h-[85%] drop-shadow-xl" style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                    <defs>
                      <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e2e8f0" />
                        <stop offset="100%" stopColor="#cbd5e1" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)">
                      <path 
                        d=""" + f'"{svg_path_d}"' + """
                        fill="url(#mapGradient)" 
                        stroke="#94a3b8" 
                        strokeWidth="10" 
                        className="opacity-70 group-hover:opacity-100 transition-opacity duration-1000"
                      />
                    </g>
                  </svg>
                </div>
                
                <style>{`
                  @keyframes dash-flow {
                    to { stroke-dashoffset: -20; }
                  }
                  .animate-flow { animation: dash-flow 1s linear infinite; }
                  @keyframes pin-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                  }
                  .animate-pin { animation: pin-bounce 2s ease-in-out infinite; }
                `}</style>

                {/* SVG Connections (Adjusted for SVG layout) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ strokeDasharray: '4 4' }}>
                  {[
                    "M 320 160 L 250 140", // To Punjab
                    "M 320 160 L 260 210", // To Delhi
                    "M 320 160 L 360 270", // To UP
                    "M 320 160 L 170 260", // To Rajasthan
                    "M 320 160 L 100 320", // To Gujarat
                    "M 320 160 L 150 410", // To Maharashtra
                  ].map((path, i) => (
                    <path key={i} d={path} fill="none" stroke="#94a3b8" strokeWidth="1.5" className="animate-flow opacity-60 group-hover:stroke-pd-blue/60 transition-colors duration-700" />
                  ))}
                </svg>

                {/* Pin Points & Permanent Names */}
                {[
                  { id: "UK", name: "Uttarakhand", x: 320, y: 160, color: "emerald", isCore: true, align: "right", offset: 12 },
                  { id: "PB", name: "Punjab", x: 250, y: 140, color: "pink", align: "left", offset: -12 },
                  { id: "DL", name: "Delhi", x: 260, y: 210, color: "blue", align: "left", offset: -12 },
                  { id: "UP", name: "UP", x: 360, y: 270, color: "indigo", align: "right", offset: 12 },
                  { id: "RJ", name: "Rajasthan", x: 170, y: 260, color: "amber", align: "left", offset: -12 },
                  { id: "GJ", name: "Gujarat", x: 100, y: 320, color: "orange", align: "left", offset: -12 },
                  { id: "MH", name: "Maharashtra", x: 150, y: 410, color: "purple", align: "left", offset: -12 }
                ].map((pin, i) => (
                  <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin" style={{ left: pin.x, top: pin.y }}>
                    {/* Pulsing Dot */}
                    <div className="relative flex items-center justify-center animate-pin" style={{ animationDelay: `${i * 0.2}s` }}>
                      {pin.isCore ? (
                        <>
                          <div className={`absolute w-12 h-12 bg-${pin.color}-400/30 rounded-full animate-ping`}></div>
                          <div className={`w-4 h-4 bg-${pin.color}-500 rounded-full border-[3px] border-white shadow-[0_0_15px_rgba(16,185,129,0.5)] relative z-10`}></div>
                        </>
                      ) : (
                        <div className={`w-3 h-3 bg-${pin.color}-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.2)]`}></div>
                      )}
                    </div>
                    
                    {/* Permanent Label (Visible at all times) */}
                    <div className={`absolute top-1/2 -translate-y-1/2 ${pin.align === 'right' ? 'left-full ml-2' : 'right-full mr-2'} w-max`}>
                      <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${pin.color}-500`}></div>
                        <span className="text-[10px] font-semibold text-slate-800 tracking-wide font-sf">{pin.name}</span>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </motion.div>
"""

# Replace everything from {/* Right Column - Map Visual */} to the end of the motion.div
pattern = re.compile(r'\{\/\* Right Column - Map Visual \*\/\}.*?<\/motion\.div>', re.DOTALL)
content = re.sub(pattern, new_map_section, content)

with open(file_path, 'w') as f:
    f.write(content)

print("Injected animated India SVG map.")
