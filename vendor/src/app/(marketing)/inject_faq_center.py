import re

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

new_faq_section = """
     {/* 11. FAQ - MILLION DOLLAR SAAS REDESIGN */}
     <section id="faq" suppressHydrationWarning className="py-20 md:py-32 px-6 bg-white relative overflow-hidden">
      <div className="max-w-3xl mx-auto lg:px-6 flex flex-col items-center">
        
        {/* Heading Section - Centered */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[8px] uppercase tracking-[0.2em] text-slate-400 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"></div>
            Knowledge Base
          </div>
          
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-semibold font-sf text-[#0F172A] tracking-tight uppercase leading-[1.1] mb-6">
            CURIOUS ABOUT <span className="text-transparent bg-clip-text bg-linear-to-r from-[#F43F5E] via-[#D946EF] to-[#3B82F6]">GROWTH?</span>
          </h3>
          
          <p className="text-slate-500 text-sm md:text-base font-normal font-pd max-w-xl leading-relaxed">
            Everything you need to know about the most powerful event engine in the country.
          </p>
        </div>

        {/* Accordion List - Centered */}
        <div className="w-full flex flex-col space-y-4 mb-16">
          {[
            { q: "How do I list my venue?", a: "Registering is easy. Fill out our partner onboarding form with your basic venue details. Our verification team reviews all applications within 24-48 hours to ensure our quality standards are met." },
            { q: "How do I receive leads?", a: "Every inquiry is delivered instantly. We notify you via Real-time App Alerts and Email Alerts. You can also view, track, and manage all your conversations through the Partner Dashboard." },
            { q: "Can I update pricing?", a: "Yes, you have full control. Update your pricing, seasonal availability, event capacity, and high-quality photo gallery at any time through your dashboard." },
            { q: "Is there a listing fee?", a: "We offer several ways to grow. From organic free listings with standard visibility to premium growth plans that guarantee high-intent lead volume. Contact us to find your perfect fit." }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-[20px] border transition-all duration-300 overflow-hidden ${activeFaq === i ? 'bg-white border-[#3B82F6] shadow-[0_8px_30px_rgba(59,130,246,0.12)] ring-1 ring-[#3B82F6]/20 z-10 relative' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm z-0 relative'}`}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left group bg-white"
              >
                <div className="flex items-center gap-6">
                  <span className={`text-[9px] tracking-[0.2em] transition-colors ${activeFaq === i ? 'text-[#3B82F6]' : 'text-slate-300'}`}>0{i + 1}</span>
                  <span className={`text-sm md:text-[15px] tracking-tight transition-colors duration-300 ${activeFaq === i ? 'text-[#0F172A]' : 'text-[#0F172A] group-hover:text-[#3B82F6]'}`}>{f.q}</span>
                </div>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeFaq === i ? 'bg-blue-50 text-[#3B82F6] rotate-180' : 'bg-slate-50 text-slate-400 rotate-0 group-hover:bg-slate-100'}`}>
                  <ChevronDown size={14} strokeWidth={2.5} />
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
                    <div className="px-6 pb-7 pl-18">
                      <p className="text-[13px] md:text-sm text-slate-500 font-normal font-pd leading-[1.8] max-w-125">
                        {f.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner - Centered below FAQs */}
        <div className="w-full bg-[#16161F] rounded-3xl text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pd-pink/10 blur-[60px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <h4 className="text-[10px] font-semibold font-sf uppercase tracking-[0.2em] mb-2 text-white">Still have doubts?</h4>
            <p className="text-slate-400 text-sm font-normal font-pd leading-relaxed max-w-md">Our partner success team is available 24/7 to help you dominate your city.</p>
          </div>
          <Link href="/contact" className="relative z-10 w-full sm:w-auto shrink-0">
            <button className="w-full sm:w-auto px-8 py-4 bg-[#FA3E63] text-[10px] font-semibold uppercase tracking-[0.2em] rounded-xl hover:bg-[#E11D48] transition-all shadow-[0_4px_20px_rgba(250,62,99,0.3)] hover:shadow-[0_8px_30px_rgba(250,62,99,0.5)] hover:-translate-y-0.5 whitespace-nowrap">
              Get Expert Help
            </button>
          </Link>
        </div>

      </div>
     </section>
"""

pattern = re.compile(r'\{\/\* 11\. FAQ - MILLION DOLLAR SAAS REDESIGN \*\/\}.*?(?=\{\/\* 12\. FINAL CTA - PREMIUM DARK SHOWCASE \*\/\})', re.DOTALL)
content = re.sub(pattern, new_faq_section + '\n\n     ', content)

with open(file_path, 'w') as f:
    f.write(content)

print("Redesigned FAQ Section.")
