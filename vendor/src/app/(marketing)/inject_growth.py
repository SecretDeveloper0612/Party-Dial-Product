import sys
import re

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

new_component = """
const GrowthJourneySection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
   {
     id:"01",
     eyebrow:"Build Your Digital Presence",
     title:"Give Your Venue a Professional Online Identity",
     desc:"Create a dedicated venue profile where customers can discover your property, explore its details, view images, understand your offerings, and learn why your venue is right for their event.",
     highlights: ["Professional venue profile","Photos & venue information","Services & facilities","Location & contact details"],
     isProfile: true,
     icon: <Building2 size={24} />
   },
   {
     id:"02",
     eyebrow:"Get Discovered",
     title:"Reach Customers Actively Searching for Venues",
     desc:"Put your venue in front of customers searching for event spaces based on their location, event requirements, guest capacity, budget, and other preferences.",
     highlights: ["Search visibility","Location-based discovery","Event-specific discovery","Increased digital reach"],
     isSearch: true,
     icon: <Search size={24} />
   },
   {
     id:"03",
     eyebrow:"Generate Qualified Leads",
     title:"Turn Customer Searches Into Real Enquiries",
     desc:"Receive customer enquiries containing useful requirements, helping you understand what the customer is looking for before you respond.",
     highlights: [],
     isNotification: true,
     icon: <Bell size={24} />
   },
   {
     id:"04",
     eyebrow:"Manage Your Leads",
     title:"Keep Every Enquiry Organized in One Place",
     desc:"Track your customer enquiries from a single partner dashboard instead of managing conversations across scattered messages, calls, and spreadsheets.",
     highlights: ["Centralized enquiries","Lead status tracking","Customer requirements","Follow-up management","Booking status"],
     isKanban: true,
     icon: <Kanban size={24} />
   },
   {
     id:"05",
     eyebrow:"Understand Your Business",
     title:"Turn Your Activity Into Useful Insights",
     desc:"See how customers are interacting with your venue and understand important activity across your PartyDial profile.",
     highlights: ["Profile views","Enquiries","Leads","Bookings","Customer activity"],
     isAnalytics: true,
     icon: <BarChart3 size={24} />
   },
   {
     id:"06",
     eyebrow:"Create More Growth Opportunities",
     title:"Turn Digital Interest Into Real-World Business",
     desc:"Use the visibility, enquiries, and insights generated through PartyDial to create more opportunities for your venue.",
     highlights: [],
     isGrowth: true,
     icon: <TrendingUp size={24} />
   }
  ];

  return (
   <section className="py-24 lg:py-32 bg-white relative overflow-hidden font-pd border-b border-slate-100">
     <div className="absolute top-0 right-0 w-150 h-150 bg-linear-to-bl from-pd-pink/5 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none"/>
     
     <div className="max-w-350 mx-auto px-6 lg:px-12 relative z-10">
      {/* Header */}
      <div className="mb-16 md:mb-20 max-w-3xl">
        <motion.div 
         initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
         className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm text-slate-600 text-[11px] font-semibold font-pd uppercase tracking-widest mb-6"
        >
         <TrendingUp size={12} className="text-pd-pink"/>
         <span>WHY PARTNER WITH PARTYDIAL</span>
        </motion.div>
        <motion.h2 
         initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
         className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[48px] font-semibold font-pd text-slate-900 tracking-tight leading-[1.12] mb-6"
        >
         More Visibility. More Enquiries. <br />
         <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink via-purple-600 to-pd-blue">More Opportunities.</span>
        </motion.h2>
        <motion.p 
         initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
         className="text-slate-600 text-sm sm:text-base lg:text-lg font-normal font-pd leading-relaxed"
        >
         Your venue deserves more than a listing. PartyDial gives you the digital tools to get discovered, manage customer enquiries, understand your performance, and turn opportunities into bookings.
        </motion.p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Left Column: Timeline */}
        <div className="w-full lg:w-[45%] flex flex-col relative">
         <div className="absolute left-10 top-10 bottom-10 w-0.5 bg-slate-100 hidden md:block">
           <motion.div 
             className="absolute top-0 w-full bg-pd-pink" 
             initial={{ height: 0 }}
             animate={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
             transition={{ duration: 0.5 }}
           />
         </div>
         
         <div className="flex flex-col gap-2 relative z-10">
           {steps.map((step, idx) => (
             <div 
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${activeStep === idx ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50 opacity-100' : 'bg-transparent border-transparent hover:bg-slate-50/50 opacity-60 hover:opacity-100'}`}
             >
              <div className="flex gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${activeStep === idx ? 'bg-linear-to-br from-[#F43F5E] to-rose-600 text-white shadow-md shadow-[#F43F5E]/20 ring-4 ring-white' : 'bg-slate-50 text-slate-400 border border-slate-200 ring-4 ring-white'}`}>
                 {step.icon}
                </div>
                <div className="pt-1">
                 <div className={`text-[10px] font-semibold font-pd uppercase tracking-widest mb-1 transition-colors ${activeStep === idx ? 'text-[#F43F5E]' : 'text-slate-400'}`}>{step.id} — {step.eyebrow}</div>
                 <h4 className={`text-lg font-semibold font-pd transition-colors ${activeStep === idx ? 'text-slate-900' : 'text-slate-600'}`}>{step.title}</h4>
                 <AnimatePresence>
                   {activeStep === idx && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <p className="text-sm font-normal font-pd text-slate-500 leading-relaxed mt-3 mb-4">{step.desc}</p>
                      {step.highlights.length > 0 && (
                       <ul className="space-y-2">
                         {step.highlights.map((highlight, hIdx) => (
                          <li key={hIdx} className="flex items-center gap-2 text-[13px] font-semibold font-pd text-slate-700">
                            <CheckCircle2 size={14} className="text-emerald-500"/> {highlight}
                          </li>
                         ))}
                       </ul>
                      )}
                    </motion.div>
                   )}
                 </AnimatePresence>
                </div>
              </div>
             </div>
           ))}
         </div>
        </div>

        {/* Right Column: Premium Visualizer */}
        <div className="w-full lg:w-[55%] sticky top-32">
         <div className="w-full aspect-[4/3] bg-slate-900 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-800 p-2 md:p-4 relative overflow-hidden flex flex-col">
           {/* Browser Chrome */}
           <div className="h-8 md:h-10 mb-4 flex items-center gap-2 px-2">
             <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
           </div>
           
           {/* Inner Screen */}
           <div className="flex-1 bg-slate-950/50 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center p-6 md:p-10">
             
             {/* Dynamic Glows */}
             <div className={`absolute inset-0 bg-linear-to-br transition-colors duration-1000 opacity-20 blur-3xl ${activeStep % 2 === 0 ? 'from-pd-pink via-transparent to-pd-blue' : 'from-pd-blue via-transparent to-pd-pink'}`} />

             <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -10 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex flex-col items-center justify-center relative z-10"
              >
                
                {/* 1. Profile Visual */}
                {steps[activeStep].isProfile && (
                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden w-full max-w-sm shadow-2xl flex flex-col">
                    <motion.div 
                      initial={{ height: 0 }} animate={{ height: 120 }} transition={{ duration: 0.8, delay: 0.2 }}
                      className="bg-slate-800 w-full relative"
                    >
                      <div className="absolute inset-0 bg-linear-to-tr from-pd-blue/40 to-pd-pink/40" />
                    </motion.div>
                    <div className="p-5 pt-0 relative">
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.8 }}
                        className="w-16 h-16 rounded-xl bg-white shadow-lg -mt-8 mb-3 border-4 border-slate-900 flex items-center justify-center"
                      >
                        <Building2 className="text-slate-400" size={24} />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="h-4 w-3/4 bg-white/20 rounded mb-2" />
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }} className="h-3 w-1/2 bg-white/10 rounded mb-4" />
                      
                      <div className="flex gap-2">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="h-6 w-16 bg-pd-pink/20 rounded-full border border-pd-pink/30" />
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="h-6 w-20 bg-white/5 rounded-full border border-white/10" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Search Visual */}
                {steps[activeStep].isSearch && (
                  <div className="w-full max-w-sm flex flex-col gap-3">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-md rounded-full px-4 py-3 border border-white/10 flex items-center gap-3 mb-2 shadow-lg">
                      <Search size={16} className="text-slate-400" />
                      <div className="h-2 w-32 bg-white/20 rounded-full" />
                    </motion.div>
                    
                    {[1, 2, 3].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className={`p-3 rounded-xl border backdrop-blur-md flex gap-3 items-center ${i === 1 ? 'bg-pd-pink/10 border-pd-pink/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'bg-white/5 border-white/5'}`}
                      >
                        <div className="w-12 h-12 rounded-lg bg-slate-800 shrink-0" />
                        <div className="flex-1">
                          <div className={`h-2.5 w-2/3 rounded-full mb-2 ${i === 1 ? 'bg-pd-pink/50' : 'bg-white/20'}`} />
                          <div className="h-2 w-1/3 bg-white/10 rounded-full" />
                        </div>
                        {i === 1 && (
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }}
                            className="w-6 h-6 rounded-full bg-pd-pink flex items-center justify-center text-white"
                          >
                            <Check size={12} />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {/* 3. Notification Visual */}
                {steps[activeStep].isNotification && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.9 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                  >
                    <div className="font-semibold text-white mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pd-pink flex items-center justify-center shadow-lg shadow-pd-pink/30 animate-pulse"><Bell size={14} className="text-white"/></div> 
                        New Enquiry
                      </div>
                      <span className="text-xs text-slate-400">Just now</span>
                    </div>
                    <div className="text-slate-300 text-sm space-y-3 font-medium mb-6">
                      <div className="flex justify-between"><span>Event</span> <span className="text-white">Wedding Event</span></div>
                      <div className="flex justify-between"><span>Location</span> <span className="text-white">📍 Haldwani</span></div>
                      <div className="flex justify-between"><span>Guests</span> <span className="text-white">👥 250 Guests</span></div>
                      <div className="flex justify-between"><span>Date</span> <span className="text-white">📅 18 October</span></div>
                      <div className="flex justify-between"><span>Budget</span> <span className="text-white">💰 ₹50K – ₹75K</span></div>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-pd-blue hover:bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-pd-blue/30 transition-all">
                      View Enquiry
                    </motion.button>
                  </motion.div>
                )}
                
                {/* 4. Kanban Visual */}
                {steps[activeStep].isKanban && (
                  <div className="w-full h-full flex flex-col pt-4">
                    <div className="flex justify-between gap-3 overflow-x-auto pb-4 scrollbar-hide flex-1">
                      {['New', 'Contacted', 'Interested', 'Negotiation', 'Booked'].map((stage, sIdx) => (
                        <div key={sIdx} className="min-w-[130px] w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col">
                          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex justify-between items-center">
                            {stage}
                            <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px]">{sIdx === 0 ? 2 : sIdx === 4 ? 5 : 1}</span>
                          </div>
                          
                          {sIdx === 0 && (
                            <>
                              <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="h-16 bg-white/10 rounded-lg border border-pd-pink/40 mb-2 p-2 shadow-[0_0_15px_rgba(244,63,94,0.15)] flex flex-col justify-between cursor-grab">
                                <div className="h-1.5 w-1/2 bg-white/30 rounded-full" />
                                <div className="h-1.5 w-1/3 bg-white/10 rounded-full" />
                              </motion.div>
                              <div className="h-16 bg-white/5 rounded-lg border border-white/10 mb-2 p-2 opacity-50 flex flex-col justify-between">
                                <div className="h-1.5 w-2/3 bg-white/20 rounded-full" />
                                <div className="h-1.5 w-1/3 bg-white/10 rounded-full" />
                              </div>
                            </>
                          )}

                          {sIdx === 2 && (
                            <div className="h-16 bg-white/10 rounded-lg border border-white/20 mb-2 p-2 flex flex-col justify-between cursor-grab hover:bg-white/15 transition-colors">
                              <div className="h-1.5 w-2/3 bg-white/30 rounded-full" />
                              <div className="h-1.5 w-1/3 bg-white/10 rounded-full" />
                            </div>
                          )}
                          
                          {sIdx === 4 && (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }} className="h-16 bg-emerald-500/10 rounded-lg border border-emerald-500/30 mb-2 p-2 flex flex-col justify-between shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                              <div className="h-1.5 w-1/2 bg-emerald-400/50 rounded-full" />
                              <div className="flex justify-between items-end">
                                <div className="h-1.5 w-1/3 bg-emerald-400/30 rounded-full" />
                                <CheckCircle2 size={12} className="text-emerald-400"/>
                              </div>
                            </motion.div>
                          )}
                          
                          <div className="h-16 bg-white/5 rounded-lg border border-white/5 border-dashed mt-auto flex items-center justify-center">
                            <span className="text-white/20 text-lg">+</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Analytics Visual */}
                {steps[activeStep].isAnalytics && (
                  <div className="w-full max-w-lg flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { l: "Profile Views", v: "486", c: "text-white" },
                        { l: "New Leads", v: "28", c: "text-white" },
                        { l: "Enquiries", v: "17", c: "text-white" },
                        { l: "Conversion Rate", v: "21.4%", c: "text-emerald-400" }
                      ].map((m, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 20 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: i * 0.1 }}
                          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-center items-center text-center relative overflow-hidden"
                        >
                          <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-2 relative z-10">{m.l}</div>
                          <div className={`text-3xl font-bold ${m.c} relative z-10`}>{m.v}</div>
                          {i === 0 && <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-pd-pink/20 blur-xl rounded-full" />}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Animated Bar Chart */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 h-40 flex items-end justify-between gap-2 px-6"
                    >
                      {[30, 45, 25, 60, 80, 50, 90].map((h, i) => (
                        <div key={i} className="w-8 flex flex-col justify-end items-center gap-2 h-full">
                          <motion.div 
                            initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.5 + (i * 0.1), duration: 0.6, type: "spring" }}
                            className={`w-full rounded-t-sm ${i === 6 ? 'bg-pd-pink shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-white/20'}`}
                          />
                          <span className="text-[9px] text-slate-500 font-mono">D{i+1}</span>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                )}

                {/* 6. Growth Visual */}
                {steps[activeStep].isGrowth && (
                  <div className="w-full max-w-sm flex flex-col items-center">
                    <div className="flex flex-col items-center gap-2 w-full">
                      {[
                        { label: 'Your Venue', color: 'text-slate-400' },
                        { label: 'More Visibility', color: 'text-slate-300' },
                        { label: 'Customer Discovery', color: 'text-slate-200' },
                        { label: 'Qualified Enquiries', color: 'text-white' },
                        { label: 'Confirmed Bookings', color: 'text-emerald-400' },
                      ].map((step, i) => (
                        <React.Fragment key={i}>
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                            className={`px-4 py-2 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-semibold ${step.color} w-48 text-center`}
                          >
                            {step.label}
                          </motion.div>
                          {i < 4 && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 16 }} transition={{ delay: (i * 0.15) + 0.1 }}
                              className="w-0.5 bg-white/20"
                            />
                          )}
                        </React.Fragment>
                      ))}
                      
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 24 }} transition={{ delay: 0.8 }}
                        className="w-0.5 bg-linear-to-b from-white/20 to-pd-pink"
                      />
                      
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, type: "spring", bounce: 0.6 }}
                        className="px-6 py-4 rounded-xl border border-pd-pink/50 bg-pd-pink/20 backdrop-blur-md shadow-[0_0_30px_rgba(244,63,94,0.3)] text-white font-bold text-lg text-center relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                        Business Growth
                      </motion.div>
                    </div>
                  </div>
                )}

              </motion.div>
             </AnimatePresence>
           </div>
         </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 max-w-3xl mx-auto text-center bg-slate-50 p-10 rounded-3xl border border-slate-200 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-semibold font-pd text-slate-900 mb-4">Ready to Put Your Venue in Front of More Customers?</h3>
          <p className="text-slate-600 text-sm md:text-base mb-8">Join PartyDial and start building your digital presence, receiving enquiries, and creating new booking opportunities.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/register" className="w-full sm:w-auto">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto px-8 py-4 bg-[#F43F5E] hover:bg-[#e11d48] text-white rounded-2xl font-semibold font-pd text-sm shadow-xl shadow-[#F43F5E]/30 flex items-center justify-center transition-all">
                Become a PartyDial Partner →
              </motion.button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-semibold font-pd text-sm border border-slate-200 shadow-sm flex items-center justify-center transition-all">
                Calculate Your Revenue
              </button>
            </Link>
          </div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Simple onboarding · Professional venue profile · Partner dashboard</p>
        </div>
      </div>
     </div>
   </section>
  );
};
"""

pattern = re.compile(r'const GrowthJourneySection = \(\) => \{.*?(?=const PartnerPortalSection = \(\) => \{)', re.DOTALL)
content = re.sub(pattern, new_component + '\n\n', content)

with open(file_path, 'w') as f:
    f.write(content)

print("GrowthJourneySection fully visually updated.")
