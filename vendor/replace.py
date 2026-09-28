import sys

def main():
    with open('/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx', 'r') as f:
        lines = f.readlines()
        
    start_idx = 380  # Line 381 is index 380
    end_idx = 753    # Line 754 is index 753
    
    # Verify we are replacing GrowthJourneySection
    if not 'const GrowthJourneySection' in lines[start_idx]:
        print("Error: Line 381 does not contain GrowthJourneySection")
        return
        
    new_content = """const GrowthJourneySection = () => {
   const containerRef = useRef<HTMLDivElement>(null);
   const [activeStep, setActiveStep] = useState(0);
   const [showFinal, setShowFinal] = useState(false);
   const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start start", "end end"]
   });

   useMotionValueEvent(scrollYProgress, "change", (latest) => {
      const totalStages = 8; // 7 steps + 1 final
      const progress = latest * totalStages;
      const current = Math.min(Math.floor(progress), 7);
      
      if (current === 7) {
         setShowFinal(true);
      } else {
         setShowFinal(false);
         setActiveStep(current);
      }
   });

   const steps = [
      { title: "Create Your Profile", desc: "Start Your PartyDial Journey", detail: "Register as a partner and create your business profile with your basic venue and contact information.", icon: <User size={16} /> },
      { title: "Add Your Venue", desc: "Show Customers What You Offer", detail: "Add your venue details, photos, facilities, spaces, packages, pricing, and other information.", icon: <Building2 size={16} /> },
      { title: "Get Discovered", desc: "Put Your Venue in Front", detail: "Once your listing is live, customers can discover your venue while searching for spaces.", icon: <Search size={16} /> },
      { title: "Receive Leads", desc: "Get Relevant Enquiries", detail: "Receive enquiries containing useful customer requirements such as event type, location, date.", icon: <Target size={16} /> },
      { title: "Connect", desc: "Respond and Build the Conversation", detail: "Review customer requirements, access enquiry details, and connect with potential customers.", icon: <MessageSquare size={16} /> },
      { title: "Convert Enquiries", desc: "Turn Opportunities Into Bookings", detail: "Follow up with interested customers, discuss packages, and move qualified enquiries toward bookings.", icon: <CheckCircle2 size={16} /> },
      { title: "Grow Your Business", desc: "Build More Opportunities Over Time", detail: "Use your dashboard to monitor enquiries, bookings, performance, and customer activity.", icon: <TrendingUp size={16} /> }
   ];

   return (
      <section ref={containerRef} className="h-[400vh] bg-slate-50 relative font-pd">
         <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden border-b border-slate-100">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
               <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-linear-to-bl from-pd-pink/5 via-purple-500/5 to-transparent rounded-full blur-3xl" />
               <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-linear-to-tr from-pd-blue/5 via-emerald-400/5 to-transparent rounded-full blur-3xl" />
               <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
            </div>

            <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col h-full py-16">
               
               {/* Header */}
               <div className="text-center max-w-3xl mx-auto mb-10 shrink-0">
                  <motion.div 
                     initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                     className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-[11px] font-semibold font-pd uppercase tracking-widest mb-6"
                  >
                     <Zap size={12} className="text-pd-blue" />
                     <span>SIMPLE. DIGITAL. BUILT FOR VENUE PARTNERS.</span>
                  </motion.div>
                  <h2 className="text-3xl lg:text-5xl font-semibold font-pd text-slate-900 tracking-tight leading-[1.15] mb-4">
                     From Listing to Booking — <br className="hidden lg:block" /> We Help You Along the Way
                  </h2>
                  <p className="text-slate-600 text-base lg:text-lg max-w-2xl mx-auto">
                     Getting started with PartyDial is simple. Create your profile, showcase your venue, connect with potential customers, and manage your opportunities — all through one partner platform.
                  </p>
               </div>

               <AnimatePresence mode="wait">
                  {!showFinal ? (
                     <motion.div 
                        key="journey"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col lg:flex-col-reverse flex-1 min-h-0 w-full"
                     >
                        {/* Animations Area */}
                        <div className="flex-1 w-full max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative mb-10 lg:mb-0 lg:mt-10 flex flex-col justify-center items-center">
                           <div className="absolute inset-0 bg-slate-50/50" />
                           <AnimatePresence mode="wait">
                              <motion.div
                                 key={activeStep}
                                 initial={{ opacity: 0, scale: 0.95 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 exit={{ opacity: 0, scale: 1.05 }}
                                 transition={{ duration: 0.3 }}
                                 className="relative z-10 w-full h-full flex items-center justify-center p-8"
                              >
                                 {/* 01 Profile Creation */}
                                 {activeStep === 0 && (
                                    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
                                       <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto mb-6 flex items-center justify-center text-slate-300">
                                          <User size={32} />
                                       </div>
                                       <div className="space-y-4">
                                          <div className="h-4 w-3/4 bg-slate-100 rounded mx-auto" />
                                          <div className="h-4 w-1/2 bg-slate-100 rounded mx-auto" />
                                          <div className="h-10 w-full bg-pd-blue/10 rounded-lg border border-pd-blue/20 mt-6 relative overflow-hidden">
                                             <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute left-0 top-0 bottom-0 bg-pd-blue/20" />
                                          </div>
                                       </div>
                                    </div>
                                 )}

                                 {/* 02 Add Venue */}
                                 {activeStep === 1 && (
                                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                                       <div className="h-40 w-full bg-slate-100 relative">
                                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80)' }} />
                                       </div>
                                       <div className="p-6">
                                          <div className="flex gap-4 mb-6">
                                             {[1, 2, 3].map(i => <div key={i} className="w-16 h-16 rounded-lg bg-slate-100 shrink-0" />)}
                                          </div>
                                          <div className="h-4 w-3/4 bg-slate-100 rounded mb-3" />
                                          <div className="h-4 w-1/2 bg-slate-100 rounded" />
                                       </div>
                                    </div>
                                 )}

                                 {/* 03 Get Discovered */}
                                 {activeStep === 2 && (
                                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4">
                                       <div className="h-12 w-full bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 gap-3">
                                          <Search size={16} className="text-slate-400" />
                                          <div className="h-4 w-1/3 bg-slate-200 rounded" />
                                       </div>
                                       <div className="grid grid-cols-2 gap-4">
                                          <div className="h-32 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-4">
                                             <div className="w-full h-full bg-white rounded-lg shadow-sm" />
                                          </div>
                                          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="h-32 bg-white rounded-xl border border-pd-blue/30 shadow-lg shadow-pd-blue/10 flex flex-col p-3">
                                             <div className="h-16 w-full bg-slate-100 rounded-lg mb-2 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80)' }} />
                                             <div className="h-3 w-3/4 bg-slate-200 rounded mb-1" />
                                             <div className="h-3 w-1/2 bg-slate-100 rounded" />
                                          </motion.div>
                                       </div>
                                    </div>
                                 )}

                                 {/* 04 Receive Leads */}
                                 {activeStep === 3 && (
                                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-4 bg-white rounded-2xl shadow-2xl border border-pd-blue/20 flex gap-4 w-full max-w-sm">
                                       <div className="w-12 h-12 rounded-full bg-pd-blue/10 flex items-center justify-center text-pd-blue shrink-0">
                                          <Target size={20} />
                                       </div>
                                       <div className="flex-1">
                                          <div className="flex justify-between items-center mb-1">
                                             <div className="text-sm font-bold text-slate-900">New Enquiry!</div>
                                             <div className="text-[10px] text-pd-blue font-bold">Just Now</div>
                                          </div>
                                          <div className="text-xs text-slate-500 mb-2">Wedding Reception • 350 Guests</div>
                                          <div className="w-full h-8 bg-pd-blue text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-md shadow-pd-blue/20">
                                             View Details
                                          </div>
                                       </div>
                                    </motion.div>
                                 )}

                                 {/* 05 Connect */}
                                 {activeStep === 4 && (
                                    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col h-64 overflow-hidden">
                                       <div className="h-14 border-b border-slate-100 px-4 flex items-center gap-3 bg-slate-50">
                                          <div className="w-8 h-8 rounded-full bg-slate-200" />
                                          <div>
                                             <div className="h-3 w-24 bg-slate-300 rounded mb-1" />
                                             <div className="h-2 w-16 bg-slate-200 rounded" />
                                          </div>
                                       </div>
                                       <div className="flex-1 p-4 flex flex-col gap-3">
                                          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-slate-100 p-3 rounded-2xl rounded-tl-sm w-3/4 self-start">
                                             <div className="h-3 w-full bg-slate-200 rounded mb-2" />
                                             <div className="h-3 w-2/3 bg-slate-200 rounded" />
                                          </motion.div>
                                          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-pd-blue text-white p-3 rounded-2xl rounded-tr-sm w-3/4 self-end shadow-md shadow-pd-blue/20">
                                             <div className="h-3 w-full bg-white/30 rounded mb-2" />
                                             <div className="h-3 w-1/2 bg-white/30 rounded" />
                                          </motion.div>
                                       </div>
                                    </div>
                                 )}

                                 {/* 06 Convert */}
                                 {activeStep === 5 && (
                                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-xs bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8 text-center flex flex-col items-center">
                                       <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 mb-4 flex items-center justify-center">
                                          <CheckCircle2 size={40} />
                                       </motion.div>
                                       <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
                                       <p className="text-xs text-slate-500">You've successfully converted this enquiry.</p>
                                    </motion.div>
                                 )}

                                 {/* 07 Grow */}
                                 {activeStep === 6 && (
                                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
                                       <div className="grid grid-cols-2 gap-4 mb-6">
                                          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                             <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Bookings</div>
                                             <div className="text-2xl font-bold text-slate-800">42 <span className="text-[10px] text-emerald-500">↑ 12%</span></div>
                                          </motion.div>
                                          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                             <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Revenue</div>
                                             <div className="text-2xl font-bold text-slate-800">₹8.5L <span className="text-[10px] text-emerald-500">↑ 24%</span></div>
                                          </motion.div>
                                       </div>
                                       <div className="w-full h-24 bg-pd-blue/5 rounded-xl border border-pd-blue/10 flex items-end p-2 gap-2">
                                          {[40, 60, 45, 80, 65, 100, 85].map((h, i) => (
                                             <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.3 + (i * 0.1) }} className="flex-1 bg-pd-blue rounded-t-sm" />
                                          ))}
                                       </div>
                                    </div>
                                 )}
                              </motion.div>
                           </AnimatePresence>
                        </div>

                        {/* Desktop Timeline */}
                        <div className="hidden lg:flex w-full justify-between relative shrink-0">
                           <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200 z-0 rounded-full overflow-hidden">
                              <motion.div 
                                 className="h-full bg-pd-blue"
                                 initial={{ width: "0%" }}
                                 animate={{ width: `${(activeStep / 6) * 100}%` }}
                                 transition={{ ease: "linear", duration: 0.2 }}
                              />
                           </div>
                           {steps.map((step, i) => (
                              <div key={i} className={`relative z-10 flex flex-col items-center flex-1 transition-all duration-300 ${activeStep >= i ? 'opacity-100' : 'opacity-40'} ${activeStep === i ? '-translate-y-2' : ''}`}>
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-300 mb-3 ${activeStep === i ? 'bg-pd-blue text-white shadow-pd-blue/30' : activeStep > i ? 'bg-white text-pd-blue border border-pd-blue/20' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                    {activeStep > i ? <Check size={20} /> : step.icon}
                                 </div>
                                 <div className={`text-[10px] font-bold mb-1 transition-colors ${activeStep === i ? 'text-pd-blue' : 'text-slate-400'}`}>0{i + 1}</div>
                                 <h4 className={`text-xs font-bold text-center px-2 transition-colors ${activeStep === i ? 'text-slate-900' : 'text-slate-500'}`}>{step.title}</h4>
                              </div>
                           ))}
                        </div>

                        {/* Mobile Timeline */}
                        <div className="lg:hidden flex flex-col w-full relative mb-10 pl-6">
                           <div className="absolute top-0 bottom-0 left-[38px] w-0.5 bg-slate-200 z-0">
                              <motion.div 
                                 className="w-full bg-pd-blue"
                                 initial={{ height: "0%" }}
                                 animate={{ height: `${(activeStep / 6) * 100}%` }}
                                 transition={{ ease: "linear", duration: 0.2 }}
                              />
                           </div>
                           {steps.map((step, i) => (
                              <div key={i} className={`relative z-10 flex gap-6 min-h-[80px] transition-all duration-300 ${activeStep >= i ? 'opacity-100' : 'opacity-40'}`}>
                                 <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-md transition-colors duration-300 mt-1 ${activeStep === i ? 'bg-pd-blue text-white shadow-pd-blue/30 scale-110' : activeStep > i ? 'bg-white text-pd-blue border border-pd-blue/20' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                    {activeStep > i ? <Check size={20} /> : step.icon}
                                 </div>
                                 <div className={`flex flex-col justify-center ${activeStep === i ? '-translate-y-1' : ''} transition-transform`}>
                                    <div className="text-[10px] font-bold text-pd-blue mb-0.5">STEP 0{i + 1}</div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">{step.title}</h4>
                                    <p className="text-[11px] text-slate-500 max-w-[200px] leading-snug">{step.detail}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </motion.div>
                  ) : (
                     <motion.div 
                        key="final"
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 w-full flex flex-col items-center justify-center"
                     >
                        <div className="text-center w-full max-w-2xl bg-white p-10 lg:p-16 rounded-3xl shadow-2xl border border-slate-100">
                           <div className="flex flex-col items-center gap-3 text-sm md:text-base font-bold font-pd text-slate-400 mb-10">
                              <div className="px-6 py-2 bg-slate-50 rounded-xl border border-slate-100 w-full sm:w-auto">YOUR VENUE</div>
                              <ArrowDown className="text-slate-300" size={16} />
                              <div className="px-6 py-2 bg-slate-50 rounded-xl border border-slate-100 w-full sm:w-auto">DIGITAL PRESENCE</div>
                              <ArrowDown className="text-slate-300" size={16} />
                              <div className="px-6 py-2 bg-slate-50 rounded-xl border border-slate-100 w-full sm:w-auto">CUSTOMER DISCOVERY</div>
                              <ArrowDown className="text-slate-300" size={16} />
                              <div className="px-6 py-2 bg-slate-50 rounded-xl border border-slate-100 w-full sm:w-auto">QUALIFIED ENQUIRIES</div>
                              <ArrowDown className="text-slate-300" size={16} />
                              <div className="px-6 py-2 bg-slate-50 rounded-xl border border-slate-100 w-full sm:w-auto">CUSTOMER CONNECTION</div>
                              <ArrowDown className="text-slate-300" size={16} />
                              <div className="px-6 py-2 bg-slate-50 rounded-xl border border-slate-100 w-full sm:w-auto">BOOKING OPPORTUNITIES</div>
                              <ArrowDown className="text-pd-blue mt-2" size={24} />
                              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1.05 }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }} className="px-8 py-4 bg-pd-blue text-white rounded-2xl shadow-xl shadow-pd-blue/30 text-xl md:text-2xl mt-4 w-full sm:w-auto tracking-widest">
                                 BUSINESS GROWTH
                              </motion.div>
                           </div>

                           <h3 className="text-2xl lg:text-4xl font-semibold font-pd text-slate-900 tracking-tight mb-4">
                              Ready to Get Started?
                           </h3>
                           <p className="text-slate-500 mb-8 max-w-md mx-auto">
                              Create your PartyDial partner profile and start putting your venue in front of potential customers.
                           </p>

                           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                              <Link href="/login" className="w-full sm:w-auto">
                                 <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto px-8 py-4 bg-pd-blue hover:bg-blue-600 text-white rounded-2xl font-semibold font-pd text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-pd-blue/20 group">
                                    <span>Become a PartyDial Partner →</span>
                                 </motion.button>
                              </Link>
                              <Link href="/login" className="w-full sm:w-auto">
                                 <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-semibold font-pd text-sm border border-slate-200 shadow-sm flex items-center justify-center transition-all">
                                    Explore the Partner Portal →
                                 </button>
                              </Link>
                           </div>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </section>
   );
};
"""
    lines[start_idx:end_idx + 1] = [new_content + '\n']
    
    with open('/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx', 'w') as f:
        f.writelines(lines)
    
    print("Successfully replaced GrowthJourneySection.")

if __name__ == '__main__':
    main()
