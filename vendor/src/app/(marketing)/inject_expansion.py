import re

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

new_component = """
     {/* 10. NATIONAL EXPANSION - BENTO GRID REDESIGN */}
     <section className="relative py-20 md:py-24 px-6 overflow-hidden bg-white border-y border-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#F43F5E05,transparent_50%)]"></div>
      
      <div className="max-w-360 mx-auto lg:px-12 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] uppercase tracking-[0.4em] mb-6 border border-emerald-100 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> 
            Live Operations: 13/13 Districts Active
          </div>
          <h3 className="text-4xl md:text-6xl font-semibold font-pd text-[#0F172A] tracking-tight uppercase leading-[1.1] mb-6">
            dominating <span className="pd-gradient-text not-">the hills</span> <br className="hidden md:block" />
            scaling india
          </h3>
          <p className="text-slate-500 text-base font-normal font-pd max-w-2xl mx-auto leading-relaxed">
            We’ve successfully digitized the entire venue ecosystem across all 13 districts of Uttarakhand. Our next phase? Activating the same elite power across India's major states.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[340px]">
          
          {/* Card 1: Local Dominance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="lg:col-span-1 bg-slate-50 rounded-3xl border border-slate-200 p-8 flex flex-col relative overflow-hidden group hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 blur-[50px] rounded-full group-hover:bg-emerald-400/20 transition-all duration-500" />
            
            <div className="flex-1 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-emerald-500 mb-6">
                <CheckCircle2 size={20} />
              </div>
              <h4 className="text-xl font-semibold font-pd text-slate-900 mb-2">Uttarakhand Core</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">100% saturation across all 13 districts. Fully operational and scaling.</p>
              
              <div className="flex items-end gap-3 mb-2">
                <div className="text-5xl font-pd font-semibold text-slate-900 tracking-tighter">13</div>
                <div className="text-sm font-pd text-slate-400 pb-1">/ 13 Live</div>
              </div>
            </div>
            
            {/* Progress Bar Visual */}
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-auto">
              <div className="h-full bg-emerald-400 rounded-full w-full relative">
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Upcoming Expansion Network */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-slate-50 rounded-3xl border border-slate-200 p-8 flex flex-col relative overflow-hidden group hover:shadow-xl hover:border-pd-blue/30 transition-all duration-300"
          >
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pd-blue/10 blur-[60px] rounded-full group-hover:bg-pd-blue/20 transition-all duration-500" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="max-w-xs">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-pd-blue mb-6">
                  <Zap size={20} />
                </div>
                <h4 className="text-xl font-semibold font-pd text-slate-900 mb-2">Phase 02 Expansion</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Launching hyper-localized discovery hubs in major metropolitan areas, connecting high-intent customers to premium venues.
                </p>
              </div>

              {/* Minimal Network Visualization */}
              <div className="w-full md:w-auto flex-1 h-[200px] bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                
                <div className="relative w-full max-w-[280px] h-[140px]">
                  {/* Central Node */}
                  <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-12 h-12 bg-emerald-50 rounded-full border border-emerald-200 flex items-center justify-center shadow-lg z-20">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute"></div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full relative z-10"></div>
                  </div>
                  
                  {/* Connecting Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ strokeDasharray: '4 4' }}>
                    <path d="M 65 70 C 120 70, 160 30, 220 30" fill="none" stroke="#e2e8f0" strokeWidth="1.5" className="group-hover:stroke-pd-blue transition-colors duration-700" />
                    <path d="M 65 70 C 120 70, 160 70, 220 70" fill="none" stroke="#e2e8f0" strokeWidth="1.5" className="group-hover:stroke-pd-blue transition-colors duration-700 delay-100" />
                    <path d="M 65 70 C 120 70, 160 110, 220 110" fill="none" stroke="#e2e8f0" strokeWidth="1.5" className="group-hover:stroke-pd-blue transition-colors duration-700 delay-200" />
                  </svg>

                  {/* Upcoming Nodes */}
                  <div className="absolute top-[30px] right-[40px] -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center z-20 group-hover:border-pd-blue group-hover:bg-blue-50 transition-all duration-300">
                    <span className="text-[7px] font-bold text-slate-400 group-hover:text-pd-blue">NCR</span>
                  </div>
                  <div className="absolute top-[70px] right-[40px] -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center z-20 group-hover:border-pd-blue group-hover:bg-blue-50 transition-all duration-300 delay-100">
                    <span className="text-[7px] font-bold text-slate-400 group-hover:text-pd-blue">MUM</span>
                  </div>
                  <div className="absolute top-[110px] right-[40px] -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center z-20 group-hover:border-pd-blue group-hover:bg-blue-50 transition-all duration-300 delay-200">
                    <span className="text-[7px] font-bold text-slate-400 group-hover:text-pd-blue">CHD</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
     </section>
"""

pattern = re.compile(r'\{\/\* 10\. NATIONAL EXPANSION - DISCOVERY HUB \*\/\}.*?(?=\{\/\* 11\. FAQ - MILLION DOLLAR SAAS REDESIGN \*\/\})', re.DOTALL)
content = re.sub(pattern, new_component + '\n\n     ', content)

with open(file_path, 'w') as f:
    f.write(content)

print("Redesigned National Expansion section.")
