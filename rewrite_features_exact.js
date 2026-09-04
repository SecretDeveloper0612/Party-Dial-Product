const fs = require('fs');

let content = fs.readFileSync('vendor/src/app/(marketing)/page.tsx', 'utf8');

const oldArrayStart = 'const platformFeatures = [';
const oldArrayEnd = '];\n\nexport default function PartnerLandingPage() {';
const oldArrayRegex = new RegExp('const platformFeatures = \\[.*?\\];\\n\\nexport default function PartnerLandingPage\\(\\) \\{', 's');

const newArray = `const platformFeatures = [
   { title: "Venue profile page", desc: "Your own branded page with photos, videos, capacity, amenities, location, and pricing information.", icon: <LayoutDashboard size={20} strokeWidth={2} />, colorHex: "#F43F5E", colSpan: "col-span-6 md:col-span-3 lg:col-span-2", shape: "semi-right" },
   { title: "Dashboard & analytics", desc: "Understand profile views, enquiries, customer interest, and lead activity.", icon: <TrendingUp size={20} strokeWidth={2} />, colorHex: "#2563EB", colSpan: "col-span-6 md:col-span-3 lg:col-span-2", shape: "chevron" },
   { title: "Enquiry management", desc: "Receive customer booking enquiries in an organised way.", icon: <MessageSquare size={20} strokeWidth={2} />, colorHex: "#22C55E", colSpan: "col-span-6 md:col-span-3 lg:col-span-2", shape: "rounded-br" },
   
   { title: "Smart search filters", desc: "Customers can find you by city, locality, event type, guest count, budget, food preference.", icon: <Filter size={20} strokeWidth={2} />, colorHex: "#EAB308", colSpan: "col-span-6 md:col-span-3 lg:col-span-2", shape: "tag" },
   { title: "Mobile accessibility", desc: "Manage and review leads from mobile, wherever you are. Your entire venue business in your pocket.", icon: <Smartphone size={20} strokeWidth={2} />, colorHex: "#8B5CF6", colSpan: "col-span-6 md:col-span-3 lg:col-span-2", shape: "rect" },
   { title: "Photo & video gallery", desc: "Showcase your ambience, décor possibilities, and real events.", icon: <ImageIcon size={20} strokeWidth={2} />, colorHex: "#F43F5E", colSpan: "col-span-6 md:col-span-3 lg:col-span-2", shape: "circle" },
   
   { title: "Venue categories", desc: "List for weddings, receptions, birthdays, anniversaries, corporate events, and more.", icon: <UsersRound size={20} strokeWidth={2} />, colorHex: "#14B8A6", colSpan: "col-span-6 md:col-span-3 lg:col-span-2", shape: "circle" },
   { title: "Availability support", desc: "Help customers enquire for their preferred event date easily.", icon: <Calendar size={20} strokeWidth={2} />, colorHex: "#6366F1", colSpan: "col-span-6 md:col-span-3 lg:col-span-2", shape: "semi-right-large" },
   { title: "Offers and packages", desc: "Promote special packages, seasonal offers, weekday deals, or complete wedding packages.", icon: <Gift size={20} strokeWidth={2} />, colorHex: "#F97316", colSpan: "col-span-6 md:col-span-3 lg:col-span-2", shape: "square" },
   
   { title: "Location & map", desc: "Make it easier for customers to find and visit your venue with integrated maps and directions.", icon: <MapPin size={20} strokeWidth={2} />, colorHex: "#10B981", colSpan: "col-span-6 md:col-span-3 lg:col-span-3", shape: "map" },
   { title: "Customer reviews", desc: "Build trust through authentic feedback and venue experience sharing.", icon: <Star size={20} strokeWidth={2} />, colorHex: "#F59E0B", colSpan: "col-span-6 md:col-span-3 lg:col-span-3", shape: "star" }
];

export default function PartnerLandingPage() {`;

content = content.replace(oldArrayRegex, newArray);


const oldSectionRegex = /\{\/\* FEATURES OF PARTYDIAL - MINIMALIST GRID SECTION \*\/\}[\s\S]*?<\/section>/;

const newSection = `{/* EXACT MATCH FEATURES OF PARTYDIAL */}
         <section id="features" className="relative py-20 px-4 md:px-8 bg-[#F8F9FC] overflow-hidden font-pd">
            {/* Background Subtle Dots/Gradients */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40" style={{ backgroundImage: 'radial-gradient(#E2E8F0 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="max-w-[1200px] mx-auto relative z-10">
               
               {/* Exact Header Layout */}
               <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm text-[10px] font-bold text-slate-700 tracking-[0.15em] uppercase mb-6">
                     <Star size={12} className="text-pd-pink" fill="currentColor" /> Professional Toolkit
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4 flex items-center justify-center gap-3 flex-wrap">
                     Features of <span className="text-transparent bg-clip-text bg-gradient-to-r from-pd-pink to-pd-blue">PartyDial</span>
                  </h2>
                  
                  <div className="w-12 h-1 bg-gradient-to-r from-pd-pink to-pd-blue mx-auto rounded-full mb-6"></div>
                  
                  <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                     A complete ecosystem designed to showcase your venue, streamline bookings, and scale your operations seamlessly.
                  </p>
               </div>

               {/* Exact Grid Layout */}
               <div className="grid grid-cols-1 md:grid-cols-6 gap-6 lg:gap-8">
                  {platformFeatures.map((f, i) => (
                     <div 
                        key={i} 
                        className={\`relative bg-white rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4 lg:gap-6 shadow-sm hover:shadow-md transition-shadow \${f.colSpan}\`}
                        style={{ borderBottom: \`3px solid \${f.colorHex}\`, borderRight: \`3px solid \${f.colorHex}\`, borderTop: '1px solid #f1f5f9', borderLeft: '1px solid #f1f5f9' }}
                     >
                        {/* Dynamic Background Shapes */}
                        {f.shape === 'semi-right' && <div className="absolute left-0 top-0 bottom-0 w-24 opacity-15 rounded-r-[50px] pointer-events-none" style={{ backgroundColor: f.colorHex }}></div>}
                        {f.shape === 'chevron' && <div className="absolute left-0 top-0 bottom-0 w-24 opacity-15 pointer-events-none" style={{ backgroundColor: f.colorHex, clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>}
                        {f.shape === 'rounded-br' && <div className="absolute left-0 top-0 bottom-0 w-24 opacity-15 rounded-br-[40px] pointer-events-none" style={{ backgroundColor: f.colorHex }}></div>}
                        {f.shape === 'tag' && <div className="absolute left-0 top-2 bottom-2 w-20 opacity-15 rounded-r-[30px] pointer-events-none" style={{ backgroundColor: f.colorHex }}></div>}
                        {f.shape === 'rect' && <div className="absolute left-0 top-0 bottom-0 w-24 opacity-15 rounded-xl scale-y-90 pointer-events-none" style={{ backgroundColor: f.colorHex }}></div>}
                        {f.shape === 'circle' && <div className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 opacity-15 rounded-full pointer-events-none" style={{ backgroundColor: f.colorHex }}></div>}
                        {f.shape === 'semi-right-large' && <div className="absolute left-0 top-0 bottom-0 w-28 opacity-15 rounded-r-full pointer-events-none" style={{ backgroundColor: f.colorHex }}></div>}
                        {f.shape === 'square' && <div className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 opacity-15 rounded-2xl pointer-events-none" style={{ backgroundColor: f.colorHex }}></div>}
                        
                        {f.shape === 'map' && (
                           <div className="absolute left-0 top-0 bottom-0 w-48 opacity-10 pointer-events-none overflow-hidden rounded-l-3xl" style={{ backgroundColor: f.colorHex }}>
                              <svg viewBox="0 0 100 100" className="w-full h-full opacity-50" fill="none" stroke={f.colorHex} strokeWidth="2" strokeDasharray="4 4">
                                 <path d="M 10 80 Q 40 40 90 20" />
                                 <circle cx="90" cy="20" r="4" fill={f.colorHex} />
                                 <circle cx="10" cy="80" r="4" fill={f.colorHex} />
                              </svg>
                           </div>
                        )}
                        
                        {f.shape === 'star' && (
                           <div className="absolute left-0 top-0 bottom-0 w-48 opacity-[0.08] flex items-center justify-center pointer-events-none overflow-hidden rounded-l-3xl" style={{ backgroundColor: f.colorHex }}>
                              <Star size={120} fill={f.colorHex} strokeWidth={0} className="-rotate-12 translate-x-4" />
                           </div>
                        )}

                        {/* Icon Block */}
                        <div className="relative z-10 shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: f.colorHex, boxShadow: \`0 4px 10px -2px \${f.colorHex}80\` }}>
                           {f.icon}
                        </div>
                        
                        {/* Text Block */}
                        <div className="relative z-10">
                           <h4 className="text-base md:text-lg font-bold text-slate-800 mb-1">{f.title}</h4>
                           <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-3">{f.desc}</p>
                           <div className="w-6 h-[3px] rounded-full" style={{ backgroundColor: f.colorHex }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>`;

if (!oldSectionRegex.test(content)) {
   console.log("Could not find old section to replace!");
} else {
   content = content.replace(oldSectionRegex, newSection);
   fs.writeFileSync('vendor/src/app/(marketing)/page.tsx', content);
   console.log("Replaced successfully!");
}
