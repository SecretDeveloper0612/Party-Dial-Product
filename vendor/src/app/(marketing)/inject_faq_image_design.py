import re

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

new_faq_section = """
     {/* 11. FAQ - 2-COLUMN IMAGE DESIGN */}
     <section id="faq" suppressHydrationWarning className="py-20 md:py-24 px-4 sm:px-6 bg-[#f4f4f1] relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column - Dark Gradient Card */}
          <div className="lg:col-span-4 bg-linear-to-br from-[#2f395c] via-[#212b4d] to-[#161c36] rounded-[24px] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
            {/* Subtle radial glow inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b4b86] opacity-30 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-8 border border-white/5">
                <Shield className="text-amber-400" size={24} />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-semibold font-sf text-white leading-[1.2] mb-4">
                Frequently<br />Asked<br />Questions
              </h3>
              
              <p className="text-slate-300 text-sm md:text-base font-normal font-pd leading-relaxed mb-6 max-w-[90%]">
                Find answers to common questions about our services
              </p>
              
              <div className="w-16 h-0.5 bg-amber-400 mb-8"></div>
              
              <div className="space-y-4 mb-12">
                {[
                  "Expert Support Team",
                  "24/7 Assistance",
                  "Quick Response Time",
                  "Secure & Confidential Support",
                  "Dedicated Account Assistance"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-amber-400 shrink-0" />
                    <span className="text-slate-200 text-sm font-pd">{item}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/contact" className="block w-full">
                <button className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold font-pd py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20">
                  Contact Support <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column - Accordion List */}
          <div className="lg:col-span-8 flex flex-col space-y-3 lg:space-y-4">
            {[
              { q: "How do I list my venue?", a: "Registering is easy. Fill out our partner onboarding form with your basic venue details. Our verification team reviews all applications within 24-48 hours to ensure our quality standards are met." },
              { q: "How do I receive leads?", a: "Every inquiry is delivered instantly. We notify you via Real-time App Alerts and Email Alerts. You can also view, track, and manage all your conversations through the Partner Dashboard." },
              { q: "Can I update pricing?", a: "Yes, you have full control. Update your pricing, seasonal availability, event capacity, and high-quality photo gallery at any time through your dashboard." },
              { q: "Is there a listing fee?", a: "We offer several ways to grow. From organic free listings with standard visibility to premium growth plans that guarantee high-intent lead volume. Contact us to find your perfect fit." },
              { q: "Do you offer premium placements?", a: "Yes, we offer premium placements that give your venue top visibility in local search results and priority recommendations to high-intent clients." }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-[16px] transition-all duration-300 overflow-hidden ${activeFaq === i ? 'ring-2 ring-amber-400/20 shadow-md border-transparent' : 'border border-slate-100 shadow-sm hover:border-slate-200'}`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-5 md:p-6 flex items-center justify-between text-left group bg-white"
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors duration-300 ${activeFaq === i ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-600'}`}>
                      {i + 1}
                    </div>
                    <span className="text-base md:text-lg font-semibold font-sf text-slate-800 tracking-tight">
                      {f.q}
                    </span>
                  </div>
                  <div className={`shrink-0 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown size={20} className="text-amber-400" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden bg-white"
                    >
                      <div className="px-5 md:px-6 pb-6 pt-0 md:pl-[72px]">
                        <p className="text-sm text-slate-500 font-normal font-pd leading-relaxed max-w-2xl">
                          {f.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
     </section>
"""

# Replace the existing FAQ section. We need to match from {/* 11. FAQ... to the next section.
pattern = re.compile(r'\{\/\* 11\. FAQ.*?\*\/\}.*?(?=\{\/\* 12\. FINAL CTA - PREMIUM DARK SHOWCASE \*\/\})', re.DOTALL)
content = re.sub(pattern, new_faq_section + '\n\n     ', content)

with open(file_path, 'w') as f:
    f.write(content)

print("Redesigned FAQ to Image Layout.")
