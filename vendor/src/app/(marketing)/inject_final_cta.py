import re

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

new_cta = """
     {/* 12. FINAL CTA - PREMIUM DARK SHOWCASE (REDESIGNED) */}
     <section className="py-20 md:py-32 px-6 bg-[#0B0F19] relative overflow-hidden flex flex-col items-center">
      
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle Network Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* PartyDial Brand Gradients & Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pd-pink/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pd-blue/20 blur-[120px] rounded-full mix-blend-screen"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute rounded-full bg-white/10 animate-float-slow"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
        
        {/* Optional Visual Flow Diagram */}
        <div className="w-full max-w-2xl mx-auto mb-16 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
            {[
              { icon: MapPin, label: "Your Venue" },
              { icon: Search, label: "Get Discovered" },
              { icon: MessageSquare, label: "Receive Enquiry" },
              { icon: Users, label: "Connect" },
              { icon: CalendarCheck, label: "Booking" }
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-3 relative z-10 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-pd-pink/20 group-hover:border-pd-pink/30 transition-all duration-300">
                    <step.icon size={20} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold font-sf group-hover:text-slate-300 transition-colors hidden md:block whitespace-nowrap">{step.label}</span>
                </div>
                {i < 4 && (
                  <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent relative">
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-[#3B82F6] shadow-[0_0_10px_#3B82F6] opacity-0 animate-[travel-line_2.5s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.5}s` }}></div>
                  </div>
                )}
                {i < 4 && (
                  <div className="md:hidden w-px h-6 bg-gradient-to-b from-transparent via-white/20 to-transparent my-1"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F43F5E] w-max mb-8 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F43F5E] animate-ping"></div>
          Ready to Grow Your Venue?
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold font-sf tracking-tight leading-[1.1] mb-8 text-white max-w-3xl">
          Your Next Booking <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F43F5E] via-purple-400 to-[#3B82F6] relative inline-block pb-2">
            Could Start Here.
            <svg className="absolute w-full h-3 bottom-0 left-0 text-[#F43F5E]/40" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0,8 Q50,0 100,8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
        </h2>

        {/* Description */}
        <p className="text-slate-400 text-sm md:text-lg font-normal font-pd leading-relaxed max-w-2xl mx-auto mb-12">
          Put your venue in front of customers searching for the right space for their next event. Create your PartyDial partner profile, showcase your venue, receive customer enquiries, and manage your opportunities from one place.
        </p>

        {/* Actions */}
        <div className="w-full flex flex-col items-center space-y-8">
          
          <div className="w-full max-w-sm flex flex-col items-center">
            <Link href="/register" className="w-full group">
              <button className="w-full bg-white text-slate-900 font-semibold font-sf text-base md:text-lg py-4 md:py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(255,255,255,0.15)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.25)] hover:-translate-y-1 hover:bg-slate-50 relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">Become a PartyDial Partner <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#F43F5E]/10 to-[#3B82F6]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </Link>
            
            {/* Supporting Microcopy */}
            <p className="text-[11px] md:text-xs text-slate-500 font-medium font-sf mt-4 tracking-wide">
              Quick onboarding · Professional venue profile · Partner dashboard
            </p>
          </div>

          <div className="w-full max-w-xs h-px bg-white/10"></div>

          {/* Secondary CTA */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-sm text-slate-400 font-pd">
            <span>Already a PartyDial partner?</span>
            <Link href="/login" className="text-white hover:text-[#F43F5E] font-semibold transition-colors flex items-center gap-1 group">
              Login to Partner Portal <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

        </div>

        {/* Trust Message */}
        <div className="mt-20 pt-8 border-t border-white/5 w-full">
          <p className="text-slate-500 text-xs md:text-sm font-sf tracking-wide">
            Your venue. Your customers. Your growth journey — <span className="text-slate-300 font-semibold">powered by PartyDial.</span>
          </p>
        </div>

      </div>

      <style>{`
        @keyframes travel-line {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
     </section>
"""

# Replace the block up to `<AnimatePresence>`
pattern = re.compile(r'\{\/\* 12\. FINAL CTA - PREMIUM DARK SHOWCASE \*\/\}.*?(?=\s*<AnimatePresence>)', re.DOTALL)
content = re.sub(pattern, new_cta + '\n\n     ', content)

# ensure we import icons
icons_needed = ["MapPin", "Search", "MessageSquare", "Users", "CalendarCheck", "React"]
import_statement_match = re.search(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"]', content)
if import_statement_match:
    existing_icons = import_statement_match.group(1)
    for icon in ["MapPin", "Search", "MessageSquare", "Users", "CalendarCheck"]:
        if icon not in existing_icons:
            content = content.replace(existing_icons, existing_icons + f", {icon}")

if "import React" not in content:
    content = "import React from 'react';\n" + content

with open(file_path, 'w') as f:
    f.write(content)

print("Redesigned Final CTA Section Fixed.")
