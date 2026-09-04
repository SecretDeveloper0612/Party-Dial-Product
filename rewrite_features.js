const fs = require('fs');

let content = fs.readFileSync('vendor/src/app/(marketing)/page.tsx', 'utf8');

const targetSection = `         {/* PREMIUM FEATURES OF PARTYDIAL SECTION */}
         <section id="features" className="relative py-24 md:py-32 px-6 bg-slate-50 overflow-hidden font-pd">
            {/* Ambient Soft Glows */}
            <div className="absolute top-0 right-0 w-150 h-150 bg-pd-pink/15 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-150 h-150 bg-pd-blue/15 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/4"></div>
            
            <div className="max-w-350 mx-auto relative z-10">
               <div className="text-center mb-16 md:mb-20">
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-800 text-xs font-semibold uppercase tracking-widest mb-6"
                  >
                     <Sparkles size={14} className="text-pd-pink" /> Professional Toolkit
                  </motion.div>
                  <motion.h2 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.1 }}
                     className="text-4xl md:text-5xl lg:text-7xl font-semibold text-slate-900 tracking-tight mb-6"
                  >
                     Features of <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink to-pd-blue">PartyDial</span>
                  </motion.h2>
                  <motion.p 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.2 }}
                     className="text-slate-500 text-base md:text-lg lg:text-xl font-normal max-w-2xl mx-auto leading-relaxed"
                  >
                     A complete ecosystem designed to showcase your venue, streamline bookings, and scale your operations seamlessly.
                  </motion.p>
               </div>

               {/* Bento-style Grid for Features */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
                  {[
                     { title: "Venue profile page", desc: "Your own branded page with photos, videos, capacity, amenities, location, and pricing information.", icon: <LayoutDashboard size={28} />, colSpan: "lg:col-span-2", bg: "bg-pd-pink/10", text: "text-pd-pink", border: "group-hover:border-pd-pink/50" },
                     { title: "Dashboard & analytics", desc: "Understand profile views, enquiries, customer interest, and lead activity.", icon: <TrendingUp size={28} />, colSpan: "lg:col-span-1", bg: "bg-blue-500/10", text: "text-blue-500", border: "group-hover:border-blue-500/50" },
                     { title: "Enquiry management", desc: "Receive customer booking enquiries in an organised way.", icon: <MessageSquare size={28} />, colSpan: "lg:col-span-1", bg: "bg-emerald-500/10", text: "text-emerald-500", border: "group-hover:border-emerald-500/50" },
                     
                     { title: "Smart search filters", desc: "Customers can find you by city, locality, event type, guest count, budget, food preference.", icon: <Filter size={28} />, colSpan: "lg:col-span-1", bg: "bg-amber-500/10", text: "text-amber-500", border: "group-hover:border-amber-500/50" },
                     { title: "Mobile accessibility", desc: "Manage and review leads from mobile, wherever you are. Your entire venue business in your pocket.", icon: <Smartphone size={28} />, colSpan: "lg:col-span-2", bg: "bg-purple-500/10", text: "text-purple-500", border: "group-hover:border-purple-500/50" },
                     { title: "Photo & video gallery", desc: "Showcase your ambience, décor possibilities, and real events.", icon: <ImageIcon size={28} />, colSpan: "lg:col-span-1", bg: "bg-rose-500/10", text: "text-rose-500", border: "group-hover:border-rose-500/50" },
                     
                     { title: "Venue categories", desc: "List for weddings, receptions, birthdays, anniversaries, corporate events, and more.", icon: <UsersRound size={28} />, colSpan: "lg:col-span-1", bg: "bg-cyan-500/10", text: "text-cyan-500", border: "group-hover:border-cyan-500/50" },
                     { title: "Availability support", desc: "Help customers enquire for their preferred event date easily.", icon: <Calendar size={28} />, colSpan: "lg:col-span-1", bg: "bg-indigo-500/10", text: "text-indigo-500", border: "group-hover:border-indigo-500/50" },
                     { title: "Offers and packages", desc: "Promote special packages, seasonal offers, weekday deals, or complete wedding packages.", icon: <Gift size={28} />, colSpan: "lg:col-span-2", bg: "bg-orange-500/10", text: "text-orange-500", border: "group-hover:border-orange-500/50" },
                     
                     { title: "Location & map", desc: "Make it easier for customers to find and visit your venue with integrated maps and directions.", icon: <MapPin size={28} />, colSpan: "lg:col-span-2", bg: "bg-teal-500/10", text: "text-teal-500", border: "group-hover:border-teal-500/50" },
                     { title: "Customer reviews", desc: "Build trust through authentic feedback and venue experience sharing.", icon: <Star size={28} />, colSpan: "lg:col-span-2", bg: "bg-yellow-500/10", text: "text-yellow-500", border: "group-hover:border-yellow-500/50" },
                  ].map((feature, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className={\`group relative p-6 md:p-8 rounded-4xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-transparent transition-all duration-500 flex flex-col justify-between \${feature.colSpan}\`}
                     >
                        {/* Hover Gradient Border Effect */}
                        <div className={\`absolute inset-0 rounded-4xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 \${feature.bg} pointer-events-none -z-10\`}></div>
                        
                        <div className={\`w-14 h-14 rounded-2xl \${feature.bg} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500 \${feature.text}\`}>
                           {feature.icon}
                        </div>
                        <div>
                           <h4 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">{feature.title}</h4>
                           <p className="text-slate-500 text-sm md:text-base font-normal leading-relaxed">{feature.desc}</p>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>`;

const newSection = `         {/* FEATURES OF PARTYDIAL - MINIMALIST GRID SECTION */}
         <section id="features" className="relative py-24 md:py-32 bg-white overflow-hidden font-pd border-y border-slate-100">
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
               
               {/* Left/Right Split Header */}
               <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 md:mb-24">
                  <div className="max-w-2xl">
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold uppercase tracking-widest mb-6"
                     >
                        <Sparkles size={14} className="text-pd-pink" /> Professional Toolkit
                     </motion.div>
                     <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6"
                     >
                        Everything you need to <span className="text-transparent bg-clip-text bg-linear-to-r from-pd-pink to-pd-blue">scale</span>
                     </motion.h2>
                  </div>
                  <motion.p 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.2 }}
                     className="text-slate-500 text-lg md:text-xl font-normal max-w-md leading-relaxed pb-2"
                  >
                     A complete ecosystem designed to showcase your venue, streamline bookings, and scale your operations effortlessly.
                  </motion.p>
               </div>

               {/* Clean Grid Layout */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-slate-200">
                  {[
                     { title: "Venue profile page", desc: "Your own branded page with photos, videos, capacity, amenities, location, and pricing information.", icon: <LayoutDashboard size={24} strokeWidth={1.5} />, color: "text-rose-500", bg: "bg-rose-50" },
                     { title: "Dashboard & analytics", desc: "Understand profile views, enquiries, customer interest, and lead activity.", icon: <TrendingUp size={24} strokeWidth={1.5} />, color: "text-blue-500", bg: "bg-blue-50" },
                     { title: "Enquiry management", desc: "Receive customer booking enquiries in an organised way.", icon: <MessageSquare size={24} strokeWidth={1.5} />, color: "text-emerald-500", bg: "bg-emerald-50" },
                     
                     { title: "Smart search filters", desc: "Customers can find you by city, locality, event type, guest count, budget, food preference.", icon: <Filter size={24} strokeWidth={1.5} />, color: "text-amber-500", bg: "bg-amber-50" },
                     { title: "Mobile accessibility", desc: "Manage and review leads from mobile, wherever you are. Your entire venue business in your pocket.", icon: <Smartphone size={24} strokeWidth={1.5} />, color: "text-purple-500", bg: "bg-purple-50" },
                     { title: "Photo & video gallery", desc: "Showcase your ambience, décor possibilities, and real events.", icon: <ImageIcon size={24} strokeWidth={1.5} />, color: "text-pink-500", bg: "bg-pink-50" },
                     
                     { title: "Venue categories", desc: "List for weddings, receptions, birthdays, anniversaries, corporate events, and more.", icon: <UsersRound size={24} strokeWidth={1.5} />, color: "text-cyan-500", bg: "bg-cyan-50" },
                     { title: "Availability support", desc: "Help customers enquire for their preferred event date easily.", icon: <Calendar size={24} strokeWidth={1.5} />, color: "text-indigo-500", bg: "bg-indigo-50" },
                     { title: "Offers and packages", desc: "Promote special packages, seasonal offers, weekday deals, or complete wedding packages.", icon: <Gift size={24} strokeWidth={1.5} />, color: "text-orange-500", bg: "bg-orange-50" },
                     
                     { title: "Location & map", desc: "Make it easier for customers to find and visit your venue with integrated maps and directions.", icon: <MapPin size={24} strokeWidth={1.5} />, color: "text-teal-500", bg: "bg-teal-50" },
                     { title: "Customer reviews", desc: "Build trust through authentic feedback and venue experience sharing.", icon: <Star size={24} strokeWidth={1.5} />, color: "text-yellow-500", bg: "bg-yellow-50" },
                     
                     /* Empty 12th item to complete the 3-column grid elegantly */
                     { title: "Premium Support", desc: "Get priority assistance from our dedicated partner success team.", icon: <Shield size={24} strokeWidth={1.5} />, color: "text-slate-600", bg: "bg-slate-100" }
                  ].map((feature, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="group relative p-8 md:p-10 border-r border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors duration-300 flex flex-col"
                     >
                        <div className={\`w-12 h-12 rounded-xl flex items-center justify-center mb-6 \${feature.bg} \${feature.color} shadow-sm group-hover:scale-110 transition-transform duration-300\`}>
                           {feature.icon}
                        </div>
                        <h4 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h4>
                        <p className="text-slate-500 text-sm font-normal leading-relaxed">{feature.desc}</p>
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>`;

if (content.indexOf(targetSection) === -1) {
  console.error("Target section not found!");
} else {
  content = content.replace(targetSection, newSection);
  fs.writeFileSync('vendor/src/app/(marketing)/page.tsx', content);
  console.log("Updated!");
}
