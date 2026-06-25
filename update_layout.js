const fs = require('fs');
const file = '/Users/haldwani/Documents/Working/party_dial/client/src/app/(user-portal)/ai-search/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetContent = `               <motion.div 
                key="hero-text"
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
               >
                 
                 {/* LEFT SIDE: TEXT & SEARCH */}
                 <div className="w-full lg:w-[55%] flex flex-col items-start text-left z-20">`;

const replaceIndex = content.indexOf(`               <motion.div \n                key="hero-text"`);
const endIndex = content.indexOf(`            ) : (\n                <motion.div \n                  key="results"`);

if (replaceIndex !== -1 && endIndex !== -1) {
    const newContent = `               <motion.div 
                key="hero-text"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-3xl mx-auto flex flex-col items-center text-center z-20"
               >
                 <div className="inline-flex items-center gap-2 px-5 py-2 bg-white shadow-pd-soft border border-slate-100 rounded-full text-pd-purple mb-8">
                   <Sparkles size={16} className="text-pd-purple" />
                   <span className="text-[10px] font-extrabold uppercase tracking-[0.2em]">Next-Gen Venue Discovery</span>
                 </div>
                 
                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
                   What can I help you find?
                 </h1>
                 
                 <p className="text-slate-500 font-medium text-lg md:text-xl max-w-xl leading-relaxed mb-10">
                   Just tell us what you're looking for, and our AI will find the exact match from thousands of premium venues.
                 </p>

                 {/* SEARCH BAR */}
                 <div className="w-full relative group">
                   <form onSubmit={handleSearch} className="relative flex items-center">
                     <div className="absolute left-6 text-slate-400 group-focus-within:text-pd-purple transition-colors">
                       {isSearching ? (
                          <div className="w-6 h-6 border-2 border-pd-purple border-t-transparent rounded-full animate-spin" />
                       ) : (
                          <Zap size={24} className={query ? "text-pd-purple fill-pd-purple/10" : ""} />
                       )}
                     </div>
                     
                     <input
                       type="text"
                       value={query}
                       onChange={(e) => setQuery(e.target.value)}
                       placeholder="E.g. Banquet in Delhi for 300 guests..."
                       className="w-full pl-[4.5rem] pr-36 py-6 bg-white border border-slate-200 rounded-3xl text-lg font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:border-pd-purple focus:ring-8 focus:ring-pd-purple/5 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                     />

                     <div className="absolute right-3 flex items-center gap-2">
                       {hasRecognition && (
                         <button 
                           type="button"
                           onClick={toggleListening}
                           className={\`p-3 rounded-full transition-all \${isListening ? 'bg-pd-red text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-pd-purple'}\`}
                         >
                           <Mic size={20} />
                         </button>
                       )}
                       <button
                         type="submit"
                         disabled={!query.trim() || isSearching}
                         className="bg-slate-900 text-white rounded-2xl py-3 px-6 text-sm font-black flex items-center gap-2 hover:bg-pd-purple active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                       >
                         <ArrowRight size={18} />
                       </button>
                     </div>
                   </form>
                   
                   {/* Sub-suggestions */}
                   <div className="mt-6 flex flex-wrap justify-center gap-2">
                     {["Luxury banquet under ₹2 Lakhs", "Corporate event in Noida", "Birthday party space for 50 people"].map(s => (
                        <button 
                          key={s}
                          onClick={() => setQuery(s)}
                          className="px-4 py-2 bg-slate-50 hover:bg-pd-purple/5 border border-slate-100 hover:border-pd-purple/20 rounded-full text-[11px] font-bold text-slate-500 hover:text-pd-purple transition-colors"
                        >
                          {s}
                        </button>
                     ))}
                   </div>
                 </div>
               </motion.div>
`;
    content = content.substring(0, replaceIndex) + newContent + content.substring(endIndex);
    fs.writeFileSync(file, content);
    console.log('Successfully updated layout');
} else {
    console.log('Could not find replace markers');
}
