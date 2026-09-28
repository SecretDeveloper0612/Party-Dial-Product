const fs = require('fs');
const path = require('path');

const targetPath = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx';
let content = fs.readFileSync(targetPath, 'utf8');

const newComponent = `
const GrowthJourneySection = () => {
   const [activeStep, setActiveStep] = useState(0);

   const steps = [
      {
         id: "01",
         eyebrow: "Build Your Digital Presence",
         title: "Give Your Venue a Professional Online Identity",
         desc: "Create a dedicated venue profile where customers can discover your property, explore its details, view images, understand your offerings, and learn why your venue is right for their event.",
         highlights: ["Professional venue profile", "Photos & venue information", "Services & facilities", "Location & contact details"],
         icon: <Building2 size={24} />
      },
      {
         id: "02",
         eyebrow: "Get Discovered",
         title: "Reach Customers Actively Searching for Venues",
         desc: "Put your venue in front of customers searching for event spaces based on their location, event requirements, guest capacity, budget, and other preferences.",
         highlights: ["Search visibility", "Location-based discovery", "Event-specific discovery", "Increased digital reach"],
         icon: <Search size={24} />
      },
      {
         id: "03",
         eyebrow: "Generate Qualified Leads",
         title: "Turn Customer Searches Into Real Enquiries",
         desc: "Receive customer enquiries containing useful requirements, helping you understand what the customer is looking for before you respond.",
         highlights: [],
         isNotification: true,
         icon: <Bell size={24} />
      },
      {
         id: "04",
         eyebrow: "Manage Your Leads",
         title: "Keep Every Enquiry Organized in One Place",
         desc: "Track your customer enquiries from a single partner dashboard instead of managing conversations across scattered messages, calls, and spreadsheets.",
         highlights: ["Centralized enquiries", "Lead status tracking", "Customer requirements", "Follow-up management", "Booking status"],
         isKanban: true,
         icon: <Kanban size={24} />
      },
      {
         id: "05",
         eyebrow: "Understand Your Business",
         title: "Turn Your Activity Into Useful Insights",
         desc: "See how customers are interacting with your venue and understand important activity across your PartyDial profile.",
         highlights: ["Profile views", "Enquiries", "Leads", "Bookings", "Customer activity"],
         isAnalytics: true,
         icon: <BarChart3 size={24} />
      },
      {
         id: "06",
         eyebrow: "Create More Growth Opportunities",
         title: "Turn Digital Interest Into Real-World Business",
         desc: "Use the visibility, enquiries, and insights generated through PartyDial to create more opportunities for your venue.",
         highlights: [],
         isGrowth: true,
         icon: <TrendingUp size={24} />
      }
   ];

   return (
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden font-pd border-b border-slate-100">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-linear-to-bl from-pd-pink/5 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
         
         <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
            {/* Header */}
            <div className="mb-16 md:mb-20 max-w-3xl">
               <motion.div 
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm text-slate-600 text-[11px] font-semibold font-pd uppercase tracking-widest mb-6"
               >
                  <TrendingUp size={12} className="text-pd-pink" />
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
               <div className="w-full lg:w-[45%] flex flex-col gap-4">
                  {steps.map((step, idx) => (
                     <div 
                        key={idx}
                        onClick={() => setActiveStep(idx)}
                        className={\`p-6 rounded-2xl cursor-pointer transition-all duration-300 border \${activeStep === idx ? 'bg-slate-50 border-slate-200 shadow-lg shadow-slate-200/50 scale-[1.02] opacity-100' : 'bg-transparent border-transparent hover:bg-slate-50/50 opacity-60 hover:opacity-100'}\`}
                     >
                        <div className="flex gap-4">
                           <div className={\`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors \${activeStep === idx ? 'bg-linear-to-br from-[#F43F5E] to-rose-600 text-white shadow-md shadow-[#F43F5E]/20' : 'bg-slate-100 text-slate-400 border border-slate-200'}\`}>
                              {step.icon}
                           </div>
                           <div>
                              <div className="text-[10px] font-semibold font-pd uppercase tracking-widest text-[#F43F5E] mb-1">{step.id} — {step.eyebrow}</div>
                              <h4 className={\`text-lg font-semibold font-pd mb-2 transition-colors \${activeStep === idx ? 'text-slate-900' : 'text-slate-700'}\`}>{step.title}</h4>
                              <AnimatePresence>
                                 {activeStep === idx && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                       <p className="text-sm font-normal font-pd text-slate-600 leading-relaxed mb-4">{step.desc}</p>
                                       {step.highlights.length > 0 && (
                                          <ul className="space-y-2">
                                             {step.highlights.map((highlight, hIdx) => (
                                                <li key={hIdx} className="flex items-center gap-2 text-[13px] font-semibold font-pd text-slate-700">
                                                   <CheckCircle2 size={14} className="text-emerald-500" /> {highlight}
                                                </li>
                                             ))}
                                          </ul>
                                       )}
                                       {step.isNotification && (
                                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4 text-sm font-pd">
                                             <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2"><Bell size={14} className="text-[#F43F5E]"/> New Enquiry</div>
                                             <div className="text-slate-600 text-xs space-y-1">
                                                <div>Wedding Event</div>
                                                <div>📍 Haldwani</div>
                                                <div>👥 250 Guests</div>
                                                <div>📅 18 October</div>
                                                <div>💰 ₹50K – ₹75K</div>
                                             </div>
                                          </div>
                                       )}
                                       {step.isKanban && (
                                          <div className="mt-4 flex flex-col gap-2">
                                             <div className="text-xs font-semibold text-slate-500">Lead Stages:</div>
                                             <div className="flex flex-col gap-1 text-[11px] font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                <div>New ↓</div>
                                                <div>Contacted ↓</div>
                                                <div>Interested ↓</div>
                                                <div>Negotiation ↓</div>
                                                <div className="text-emerald-600">Booked ✓</div>
                                             </div>
                                          </div>
                                       )}
                                       {step.isAnalytics && (
                                          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                                             <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2 border-b border-slate-200 pb-2"><span>Profile Views</span> <span>486</span></div>
                                             <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2 border-b border-slate-200 pb-2"><span>New Leads</span> <span>28</span></div>
                                             <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2 border-b border-slate-200 pb-2"><span>Enquiries</span> <span>17</span></div>
                                             <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2 border-b border-slate-200 pb-2"><span>Bookings</span> <span>6</span></div>
                                             <div className="flex justify-between items-center text-xs font-semibold text-emerald-600"><span>Conversion Rate</span> <span>21.4%</span></div>
                                          </div>
                                       )}
                                       {step.isGrowth && (
                                          <div className="mt-4 flex flex-col gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                             <div>Your Venue</div><div className="text-slate-400">↓</div>
                                             <div>More Visibility</div><div className="text-slate-400">↓</div>
                                             <div>Customer Discovery</div><div className="text-slate-400">↓</div>
                                             <div>Qualified Enquiries</div><div className="text-slate-400">↓</div>
                                             <div>Follow-ups</div><div className="text-slate-400">↓</div>
                                             <div>Confirmed Bookings</div><div className="text-slate-400">↓</div>
                                             <div className="text-[#F43F5E]">Business Growth</div>
                                          </div>
                                       )}
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Right Column: Visualizer */}
               <div className="w-full lg:w-[55%] sticky top-32">
                  <div className="w-full aspect-[4/3] bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 p-8 relative overflow-hidden flex items-center justify-center">
                     <AnimatePresence mode="wait">
                        <motion.div
                           key={activeStep}
                           initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                           animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                           exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                           transition={{ duration: 0.4 }}
                           className="w-full h-full flex flex-col items-center justify-center text-center"
                        >
                           <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-white mb-6">
                              {steps[activeStep].icon}
                           </div>
                           <h3 className="text-2xl font-bold text-white mb-2">{steps[activeStep].title}</h3>
                           <p className="text-slate-400 text-sm max-w-sm">{steps[activeStep].desc}</p>
                        </motion.div>
                     </AnimatePresence>
                  </div>
               </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-20 max-w-3xl mx-auto text-center bg-slate-50 p-10 rounded-3xl border border-slate-200">
               <h3 className="text-2xl md:text-3xl font-semibold font-pd text-slate-900 mb-4">Ready to Put Your Venue in Front of More Customers?</h3>
               <p className="text-slate-600 text-sm md:text-base mb-8">Join PartyDial and start building your digital presence, receiving enquiries, and creating new booking opportunities.</p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                  <Link href="/register" className="w-full sm:w-auto">
                     <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto px-8 py-4 bg-[#F43F5E] hover:bg-[#e11d48] text-white rounded-2xl font-semibold font-pd text-sm shadow-xl shadow-[#F43F5E]/30 flex items-center justify-center transition-all">
                        Become a PartyDial Partner →
                     </motion.button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                     <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl font-semibold font-pd text-sm border border-slate-200 shadow-sm flex items-center justify-center transition-all">
                        Calculate Your Revenue
                     </button>
                  </Link>
               </div>
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Simple onboarding · Professional venue profile · Partner dashboard</p>
            </div>
         </div>
      </section>
   );
};

`;

content = content.replace('const PartnerPortalSection = () => {', newComponent + 'const PartnerPortalSection = () => {');
content = content.replace('{/* 4. INTERACTIVE GROWTH JOURNEY */}', '{/* 4. INTERACTIVE GROWTH JOURNEY */}\n         <GrowthJourneySection />');

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully injected GrowthJourneySection');
