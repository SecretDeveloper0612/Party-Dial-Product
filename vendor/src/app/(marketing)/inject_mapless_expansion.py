import re

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

new_section = """
     {/* 10. NATIONAL EXPANSION - MAPLESS GRID DESIGN */}
     <section className="relative py-24 px-6 overflow-hidden bg-[#F7F9FB] border-y border-slate-100 font-pd">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-linear-to-bl from-[#3B82F6]/5 to-transparent rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3B82F6]/5 text-[#3B82F6] text-[10px] uppercase tracking-[0.4em] mb-6 border border-[#3B82F6]/10 w-max">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-ping"></span> 
              National Expansion
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sf text-slate-900 tracking-tight leading-[1.1] mb-6">
              Dominating <span className="text-transparent bg-clip-text bg-gradient-to-r from-pd-pink via-purple-600 to-pd-blue">The Hills,</span> <br className="hidden md:block" />
              Scaling India.
            </h3>
            
            <p className="text-slate-500 text-sm md:text-lg leading-relaxed font-normal font-pd">
              After successfully digitizing the venue ecosystem across 13 districts in Uttarakhand, we are launching hyper-localized discovery hubs in major metropolitan areas to connect high-intent customers to premium venues nationwide.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-4xl font-bold font-sf text-slate-900 tracking-tighter">13+</span>
              <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold font-sf mt-1">Districts Live</span>
            </div>
            <div className="w-px h-12 bg-slate-200 mx-2"></div>
            <div className="flex flex-col items-start">
              <span className="text-4xl font-bold font-sf text-[#F43F5E] tracking-tighter">6+</span>
              <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold font-sf mt-1">States Launching</span>
            </div>
          </div>
        </div>

        {/* Phase 02 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              state: "Delhi NCR",
              cities: "New Delhi · Gurugram · Noida",
              status: "Live",
              color: "#F43F5E" // Pink
            },
            {
              state: "Maharashtra",
              cities: "Mumbai · Pune",
              status: "Beta",
              color: "#A855F7" // Purple
            },
            {
              state: "Punjab",
              cities: "Chandigarh · Ludhiana",
              status: "Deploying",
              color: "#3B82F6" // Blue
            },
            {
              state: "Rajasthan",
              cities: "Jaipur · Udaipur",
              status: "Deploying",
              color: "#F59E0B" // Amber
            },
            {
              state: "Gujarat",
              cities: "Ahmedabad · Surat",
              status: "Planning",
              color: "#10B981" // Emerald
            },
            {
              state: "Uttar Pradesh",
              cities: "Lucknow · Agra",
              status: "Planning",
              color: "#6366F1" // Indigo
            }
          ].map((loc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-[20px] p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              <div 
                className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: loc.color }}
              ></div>
              
              <div className="flex justify-between items-start mb-12">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 shadow-sm transition-transform duration-500 group-hover:rotate-6"
                  style={{ color: loc.color }}
                >
                  <MapPin size={24} />
                </div>
                
                <div 
                  className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold font-sf rounded-full border bg-white shadow-sm"
                  style={{ 
                    borderColor: `${loc.color}30`, 
                    color: loc.color 
                  }}
                >
                  {loc.status}
                </div>
              </div>
              
              <h4 className="text-xl md:text-2xl font-bold font-sf text-slate-900 mb-2">{loc.state}</h4>
              <p className="text-sm font-pd text-slate-500">{loc.cities}</p>
            </motion.div>
          ))}
        </div>
        
      </div>
     </section>
"""

pattern = re.compile(r'\{\/\* 10\. NATIONAL EXPANSION - MAP DESIGN \*\/\}.*?(?=\s*\{\/\* 11\. FAQ - 2-COLUMN IMAGE DESIGN \*\/\})', re.DOTALL)
content = re.sub(pattern, new_section + '\n\n     ', content)

with open(file_path, 'w') as f:
    f.write(content)

print("Injected mapless expansion section.")
