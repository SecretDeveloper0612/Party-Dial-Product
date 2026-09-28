import sys
import re

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

new_component = """
const GrowthJourneySection = () => {
  return (
   <section className="py-24 lg:py-32 bg-white relative overflow-clip font-pd border-b border-slate-100">
     <div className="absolute top-0 right-0 w-150 h-150 bg-linear-to-bl from-pd-pink/5 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none"/>
     <div className="absolute bottom-0 left-0 w-150 h-150 bg-linear-to-tr from-pd-blue/5 via-emerald-400/5 to-transparent rounded-full blur-3xl pointer-events-none"/>
     
     <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
      {/* Header */}
      <div className="mb-16 md:mb-20 text-center max-w-3xl mx-auto">
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

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-[400px]">
        
        {/* 01: Profile (Col Span 2) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="md:col-span-2 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group hover:border-pd-pink/40 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row"
        >
          <div className="p-8 md:p-10 flex-1 flex flex-col justify-center relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-pd-pink mb-6">
              <Building2 size={24} />
            </div>
            <div className="text-[11px] font-semibold font-pd uppercase tracking-widest text-slate-400 mb-2">01 — Build Your Digital Presence</div>
            <h3 className="text-2xl font-semibold font-pd text-slate-900 mb-3 group-hover:text-pd-pink transition-colors">Professional Online Identity</h3>
            <p className="text-sm font-normal font-pd text-slate-600 leading-relaxed max-w-sm">
              Create a dedicated venue profile where customers can discover your property, explore its details, and view images.
            </p>
          </div>
          {/* Light Mockup Visual */}
          <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center border-l border-slate-200/50">
            <div className="absolute inset-0 bg-linear-to-tr from-pd-pink/10 to-transparent" />
            <motion.div 
              whileHover={{ scale: 1.05 }} transition={{ type: "spring", bounce: 0.4 }}
              className="w-[80%] h-[70%] bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col overflow-hidden relative z-10"
            >
              <div className="h-24 bg-slate-200 relative w-full">
                <div className="absolute inset-0 bg-linear-to-r from-slate-200 to-slate-100" />
              </div>
              <div className="p-4 relative">
                <div className="w-12 h-12 rounded-lg bg-white shadow-md border-4 border-white flex items-center justify-center -mt-10 mb-3 absolute">
                  <Building2 size={16} className="text-slate-400" />
                </div>
                <div className="mt-6 h-3 w-1/2 bg-slate-200 rounded-full mb-2" />
                <div className="h-2 w-1/3 bg-slate-100 rounded-full mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-pd-pink/10 rounded-full border border-pd-pink/20" />
                  <div className="h-6 w-20 bg-slate-50 rounded-full border border-slate-200" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 02: Search (Col Span 1) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="md:col-span-1 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group hover:border-pd-blue/40 hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <div className="p-8 pb-0 flex flex-col relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-pd-blue mb-4">
              <Search size={20} />
            </div>
            <h3 className="text-xl font-semibold font-pd text-slate-900 mb-2 group-hover:text-pd-blue transition-colors">Get Discovered</h3>
            <p className="text-sm font-normal font-pd text-slate-600 leading-relaxed">
              Reach customers actively searching for venues based on their location and requirements.
            </p>
          </div>
          <div className="flex-1 mt-6 relative overflow-hidden bg-slate-100 flex flex-col items-center pt-6 px-6 border-t border-slate-200/50">
            <div className="w-full bg-white rounded-full px-4 py-2.5 border border-slate-200 flex items-center gap-3 mb-4 shadow-sm">
              <Search size={14} className="text-slate-400" />
              <div className="h-2 w-24 bg-slate-200 rounded-full" />
            </div>
            <div className="w-full space-y-3">
              {[1, 2].map(i => (
                <div key={i} className={`p-3 rounded-xl border flex gap-3 items-center ${i===1 ? 'bg-pd-blue/5 border-pd-blue/20 shadow-sm' : 'bg-white border-slate-200'}`}>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
                  <div className="flex-1">
                    <div className="h-2 w-2/3 bg-slate-200 rounded-full mb-1.5" />
                    <div className="h-1.5 w-1/3 bg-slate-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 03: Notifications (Col Span 1) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="md:col-span-1 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <div className="p-8 pb-0 flex flex-col relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-amber-500 mb-4">
              <Bell size={20} />
            </div>
            <h3 className="text-xl font-semibold font-pd text-slate-900 mb-2 group-hover:text-amber-500 transition-colors">Generate Leads</h3>
            <p className="text-sm font-normal font-pd text-slate-600 leading-relaxed">
              Turn customer searches into qualified enquiries with important event details.
            </p>
          </div>
          <div className="flex-1 mt-6 relative overflow-hidden bg-slate-100 flex items-center justify-center p-6 border-t border-slate-200/50">
             <div className="bg-white border border-slate-200 rounded-2xl p-5 w-full shadow-lg relative group-hover:-translate-y-2 transition-transform duration-500">
               <div className="font-semibold text-slate-800 mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center"><Bell size={12} className="text-amber-600"/></div> 
                   <span className="text-xs">New Enquiry</span>
                 </div>
               </div>
               <div className="text-slate-500 text-[10px] space-y-2 font-medium">
                 <div className="flex justify-between"><span>Event</span> <span className="text-slate-800">Wedding</span></div>
                 <div className="flex justify-between"><span>Guests</span> <span className="text-slate-800">250 Guests</span></div>
                 <div className="flex justify-between"><span>Budget</span> <span className="text-slate-800">₹50K – ₹75K</span></div>
               </div>
             </div>
          </div>
        </motion.div>

        {/* 04: Kanban (Col Span 2) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="md:col-span-2 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group hover:border-purple-500/40 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row-reverse"
        >
          <div className="p-8 md:p-10 flex-1 flex flex-col justify-center relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-purple-500 mb-6">
              <Kanban size={24} />
            </div>
            <div className="text-[11px] font-semibold font-pd uppercase tracking-widest text-slate-400 mb-2">04 — Manage Your Leads</div>
            <h3 className="text-2xl font-semibold font-pd text-slate-900 mb-3 group-hover:text-purple-500 transition-colors">Keep Every Enquiry Organized</h3>
            <p className="text-sm font-normal font-pd text-slate-600 leading-relaxed max-w-sm">
              Track your customer enquiries from a single partner dashboard instead of managing scattered messages.
            </p>
          </div>
          <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center border-r border-slate-200/50 p-6 md:p-8">
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent" />
            <div className="w-full h-full flex gap-3 overflow-hidden relative z-10">
              {/* Columns */}
              {['New', 'Contacted', 'Booked'].map((stage, i) => (
                <div key={i} className="flex-1 bg-white/60 border border-slate-200 rounded-xl p-2 flex flex-col gap-2 backdrop-blur-sm shadow-sm group-hover:-translate-y-1 transition-transform duration-500 delay-[${i * 100}ms]">
                  <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">{stage}</div>
                  {i === 0 && (
                    <div className="h-12 bg-white rounded border border-slate-200 shadow-sm p-1.5 flex flex-col justify-between">
                      <div className="h-1 w-2/3 bg-slate-200 rounded" />
                      <div className="h-1 w-1/3 bg-slate-100 rounded" />
                    </div>
                  )}
                  {i === 2 && (
                    <div className="h-12 bg-emerald-50 rounded border border-emerald-100 shadow-sm p-1.5 flex flex-col justify-between">
                      <div className="h-1 w-1/2 bg-emerald-200 rounded" />
                      <div className="flex justify-between items-end">
                        <div className="h-1 w-1/4 bg-emerald-100 rounded" />
                        <CheckCircle2 size={10} className="text-emerald-500" />
                      </div>
                    </div>
                  )}
                  <div className="h-12 bg-white/50 rounded border border-slate-200 border-dashed mt-auto flex items-center justify-center">
                    <span className="text-slate-300">+</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 05: Analytics (Col Span 2) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="md:col-span-2 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row"
        >
          <div className="p-8 md:p-10 flex-1 flex flex-col justify-center relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-emerald-500 mb-6">
              <BarChart3 size={24} />
            </div>
            <div className="text-[11px] font-semibold font-pd uppercase tracking-widest text-slate-400 mb-2">05 — Understand Your Business</div>
            <h3 className="text-2xl font-semibold font-pd text-slate-900 mb-3 group-hover:text-emerald-500 transition-colors">Turn Activity Into Insights</h3>
            <p className="text-sm font-normal font-pd text-slate-600 leading-relaxed max-w-sm">
              See how customers are interacting with your venue and understand important activity across your profile.
            </p>
          </div>
          <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-end justify-center border-l border-slate-200/50 p-6 md:p-10 pt-16">
            <div className="w-full bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-end justify-between gap-2 h-full relative group-hover:scale-105 transition-transform duration-700 origin-bottom">
              {[30, 45, 25, 60, 80, 50, 90].map((h, i) => (
                <div key={i} className="w-full flex flex-col justify-end items-center gap-1 h-full">
                  <div className={`w-full rounded-t-sm ${i === 6 ? 'bg-emerald-400' : 'bg-slate-200'}`} style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 06: Growth (Col Span 1) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
          className="md:col-span-1 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group hover:border-pd-pink/40 hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <div className="p-8 pb-0 flex flex-col relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-pd-pink mb-4">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-xl font-semibold font-pd text-slate-900 mb-2 group-hover:text-pd-pink transition-colors">Create Growth</h3>
            <p className="text-sm font-normal font-pd text-slate-600 leading-relaxed">
              Turn digital interest into real-world business and bookings.
            </p>
          </div>
          <div className="flex-1 mt-6 relative overflow-hidden bg-slate-100 flex items-center justify-center p-6 border-t border-slate-200/50">
            <div className="w-32 h-32 rounded-full border-4 border-slate-200 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-4 border-pd-pink border-t-transparent border-l-transparent rotate-45 group-hover:rotate-180 transition-transform duration-1000" />
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900">100%</div>
                <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Growth</div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Bottom CTA */}
      <div className="mt-16 md:mt-20 max-w-3xl mx-auto text-center bg-slate-50 p-10 rounded-3xl border border-slate-200 relative overflow-hidden group">
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

print("GrowthJourneySection redesigned into a Bento Grid.")
