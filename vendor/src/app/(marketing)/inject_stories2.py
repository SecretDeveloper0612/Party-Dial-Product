import re

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

new_component = """
     {/* 9. SUCCESS STORIES */}
     <section id="stories" className="py-24 bg-slate-50 border-t border-slate-100 overflow-hidden relative font-pd">
      
      {/* Fade Gradients for Ticker */}
      <div className="absolute top-0 right-0 w-1/4 md:w-[15%] h-full bg-linear-to-l from-slate-50 to-transparent pointer-events-none z-20" />
      <div className="absolute top-0 left-0 w-1/4 md:w-[15%] h-full bg-linear-to-r from-slate-50 to-transparent pointer-events-none z-20" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin:"-50px"}} 
        transition={{ duration: 0.8 }}
        className="max-w-360 mx-auto mb-16 px-6 lg:px-12 text-center relative z-10"
      >
        <h3 className="text-3xl md:text-5xl font-semibold font-pd text-slate-900 tracking-tight leading-[1.1] mb-4">Real Success Stories</h3>
        <p className="text-slate-500 text-sm md:text-base font-normal font-pd leading-relaxed">Join hundreds of top-tier venues scaling with PartyDial</p>
      </motion.div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 45s linear infinite;
        }
        .ticker-row:hover .animate-marquee, .ticker-row:hover .animate-marquee-reverse {
          animation-play-state: paused;
        }
      `}</style>

      {/* Marquee Container */}
      <div className="flex flex-col gap-6 w-full relative z-10 ticker-row group">
        
        {/* Row 1: Left scrolling */}
        <div className="flex w-[max-content] animate-marquee gap-6">
          {[...successStories, ...successStories, ...successStories, ...successStories].map((t, i) => (
            <div key={i} className="w-[340px] md:w-[400px] shrink-0 bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
              <div>
                <div className="flex text-[#eab308] mb-5 gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-[13px] md:text-sm text-slate-500 font-normal leading-[1.6] mb-8">
                  {t.text}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                  <Image src={t.img} alt={t.name} width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Right scrolling (reverse) */}
        <div className="flex w-[max-content] animate-marquee-reverse gap-6 pl-12">
          {[...successStories].reverse().concat([...successStories].reverse()).concat([...successStories].reverse()).concat([...successStories].reverse()).map((t, i) => (
            <div key={i} className="w-[340px] md:w-[400px] shrink-0 bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
              <div>
                <div className="flex text-[#eab308] mb-5 gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-[13px] md:text-sm text-slate-500 font-normal leading-[1.6] mb-8">
                  {t.text}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                  <Image src={t.img} alt={t.name} width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
     </section>
"""


pattern = re.compile(r'\{\/\* 9\. SUCCESS STORIES \*\/\}.*?(?=\{\/\* 10\. NATIONAL EXPANSION - DISCOVERY HUB \*\/\})', re.DOTALL)
content = re.sub(pattern, new_component + '\n\n     ', content)

with open(file_path, 'w') as f:
    f.write(content)

print("Redesigned Success Stories to match screenshot exactly.")
