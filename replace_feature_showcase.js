const fs = require('fs');

let content = fs.readFileSync('vendor/src/app/(marketing)/page.tsx', 'utf8');

const oldSectionRegex = /\{\/\* EXACT MATCH FEATURES OF PARTYDIAL \*\/\}.*?<\/section>/s;

const componentStart = "export default function PartnerLandingPage() {";

// Define the FeatureShowcase component
const showcaseComponent = `
const FeatureShowcase = () => {
   const [active, setActive] = useState(0);

   return (
      <section id="features" className="relative py-24 lg:py-32 px-4 md:px-8 bg-[#030712] overflow-hidden font-pd border-y border-white/5">
         
         <div className="absolute top-0 right-1/4 w-96 h-96 bg-pd-pink/10 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pd-blue/10 rounded-full blur-[100px] pointer-events-none"></div>

         <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="text-center mb-16 lg:mb-24">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-sm text-[10px] font-bold text-slate-300 tracking-[0.2em] uppercase mb-6">
                  <Star size={12} className="text-pd-pink" fill="currentColor" /> Platform Capabilities
               </div>
               
               <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight mb-6">
                  Everything to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pd-pink to-pd-blue">manage</span> & scale
               </h2>
               
               <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                  Select a module below to explore how PartyDial simplifies your entire venue operation from acquisition to revenue.
               </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-stretch h-auto lg:h-[700px]">
               {/* Left Menu - Scrollable on Desktop */}
               <div className="w-full lg:w-1/3 flex flex-col gap-2 overflow-y-auto pr-2 lg:pr-4 pb-4 lg:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <style>{\`
                     div::-webkit-scrollbar { display: none; }
                  \`}</style>
                  {platformFeatures.map((f, i) => (
                     <button 
                        key={i} 
                        onClick={() => setActive(i)}
                        className={\`text-left p-4 md:p-5 rounded-2xl transition-all duration-300 flex items-center gap-4 border shrink-0 \${active === i ? 'bg-white/10 shadow-xl border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'}\`}
                     >
                        <div className={\`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-white transition-transform duration-300 \${active === i ? 'scale-110 shadow-md' : 'scale-90 opacity-70'}\`} style={{ backgroundColor: f.colorHex }}>
                           {f.icon}
                        </div>
                        <h4 className={\`font-semibold text-sm md:text-base transition-colors \${active === i ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}\`}>{f.title}</h4>
                     </button>
                  ))}
               </div>

               {/* Right Showcase Area */}
               <div className="w-full lg:w-2/3 bg-[#0B0F19] rounded-4xl lg:rounded-[40px] p-8 md:p-12 lg:p-20 border border-white/5 relative overflow-hidden flex items-center justify-center min-h-[400px] shadow-2xl">
                  
                  {/* Ambient Interactive Glow */}
                  <div className="absolute inset-0 opacity-20 transition-all duration-1000 ease-in-out pointer-events-none" style={{ background: \`radial-gradient(circle at 50% 50%, \${platformFeatures[active].colorHex}, transparent 60%)\` }}></div>
                  
                  {/* Animated Content */}
                  <AnimatePresence mode="wait">
                     <motion.div 
                        key={active}
                        initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', y: 20 }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)', y: -20 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10 flex flex-col items-center text-center max-w-lg w-full"
                     >
                        {/* Dynamic Floating Shape */}
                        <motion.div 
                           initial={{ rotate: -10 }}
                           animate={{ rotate: [0, 5, -5, 0] }}
                           transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                           className="w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center text-white mb-8 shadow-2xl relative" 
                           style={{ backgroundColor: platformFeatures[active].colorHex }}
                        >
                           <div className="absolute inset-0 bg-white/20 rounded-3xl mix-blend-overlay"></div>
                           <div className="transform scale-150">
                              {platformFeatures[active].icon}
                           </div>
                        </motion.div>
                        
                        <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold text-white tracking-widest uppercase mb-6" style={{ color: platformFeatures[active].colorHex }}>
                           Module 0{active + 1}
                        </div>
                        
                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">{platformFeatures[active].title}</h3>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed">{platformFeatures[active].desc}</p>
                     </motion.div>
                  </AnimatePresence>
               </div>
            </div>
         </div>
      </section>
   );
};

`;

if (!content.includes('const FeatureShowcase')) {
   content = content.replace(componentStart, showcaseComponent + componentStart);
}

// Replace the old section invocation with the new component
content = content.replace(oldSectionRegex, '<FeatureShowcase />');

fs.writeFileSync('vendor/src/app/(marketing)/page.tsx', content);
console.log("Done");
