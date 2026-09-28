import re

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

new_cta = """
     {/* 12. FINAL CTA - LIGHT CLEAN SHOWCASE */}
     <section className="py-24 md:py-32 px-6 bg-white relative overflow-hidden flex flex-col items-center border-t border-slate-100">
      
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F43F5E]/5 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#3B82F6]/5 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
        
        {/* Clean Flow Diagram */}
        <div className="w-full max-w-3xl mx-auto mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-200 -translate-y-1/2 -z-10"></div>
            
            {[
              { icon: MapPin, label: "Your Venue" },
              { icon: Search, label: "Get Discovered" },
              { icon: MessageSquare, label: "Receive Enquiry" },
              { icon: Users, label: "Connect" },
              { icon: CalendarCheck, label: "Booking" }
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-3 relative bg-white px-2 md:px-0">
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#F43F5E] relative z-10 hover:scale-110 hover:shadow-md transition-all duration-300">
                    <step.icon size={20} />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.1em] text-slate-500 font-semibold font-sf hidden md:block whitespace-nowrap">{step.label}</span>
                </div>
                {i < 4 && (
                  <div className="md:hidden w-px h-6 bg-slate-200 my-1"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F43F5E]/10 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F43F5E] w-max mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]"></div>
          Ready to Grow Your Venue?
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sf tracking-tight leading-[1.1] mb-6 text-slate-900 max-w-3xl">
          Your Next Booking <br className="hidden md:block"/>
          Could <span className="text-[#F43F5E] relative inline-block">Start Here.
            <svg className="absolute w-full h-2 -bottom-1 left-0 text-[#F43F5E]/30" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0,8 Q50,0 100,8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </span>
        </h2>

        {/* Description */}
        <p className="text-slate-500 text-base md:text-lg font-normal font-pd leading-relaxed max-w-2xl mx-auto mb-10">
          Put your venue in front of customers searching for the right space for their next event. Create your PartyDial partner profile, showcase your venue, receive customer enquiries, and manage your opportunities from one place.
        </p>

        {/* Actions */}
        <div className="w-full flex flex-col items-center space-y-8">
          
          <div className="w-full max-w-sm flex flex-col items-center">
            <Link href="/register" className="w-full group">
              <button className="w-full bg-[#F43F5E] hover:bg-[#E11D48] text-white font-semibold font-sf text-base md:text-lg py-4 md:py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(244,63,94,0.3)] hover:shadow-[0_12px_40px_rgba(244,63,94,0.4)] hover:-translate-y-1">
                <span>Become a PartyDial Partner</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            {/* Supporting Microcopy */}
            <p className="text-[11px] md:text-xs text-slate-500 font-medium font-pd mt-4 tracking-wide">
              Quick onboarding · Professional venue profile · Partner dashboard
            </p>
          </div>

          <div className="w-full max-w-xs h-px bg-slate-200"></div>

          {/* Secondary CTA */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-sm text-slate-500 font-pd">
            <span>Already a PartyDial partner?</span>
            <Link href="/login" className="text-[#3B82F6] hover:text-[#2563EB] font-semibold transition-colors flex items-center gap-1 group">
              Login to Partner Portal <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

        </div>

        {/* Trust Message */}
        <div className="mt-20 pt-8 border-t border-slate-100 w-full">
          <p className="text-slate-400 text-xs md:text-sm font-sf tracking-wide uppercase">
            Your venue. Your customers. Your growth journey — <span className="text-slate-600 font-bold">powered by PartyDial.</span>
          </p>
        </div>

      </div>
     </section>
"""

pattern = re.compile(r'\{\/\* 12\. FINAL CTA.*?(?=\s*<AnimatePresence>)', re.DOTALL)
content = re.sub(pattern, new_cta + '\n\n     ', content)

with open(file_path, 'w') as f:
    f.write(content)

print("Redesigned Final CTA Section to Light Clean Theme.")
