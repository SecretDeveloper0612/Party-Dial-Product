const fs = require('fs');
const file = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/onboarding/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Sidebar improvements
content = content.replace('bg-slate-50 border-r border-slate-100', 'bg-[#0f1218] border-r border-white/5');
content = content.replace('text-slate-800', 'text-white');
content = content.replace('text-slate-500 mt-2', 'text-slate-400 mt-2');
content = content.replace('bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-10', 'bg-white/5 rounded-2xl p-4 border border-white/5 shadow-none mb-10');
content = content.replace('text-slate-400', 'text-slate-400/80');
content = content.replace('bg-slate-100 h-2', 'bg-white/10 h-2');

// Sidebar steps logic
content = content.replace(
  'isCurrent ? "bg-white border-2 border-[#f472b6] text-[#f472b6] shadow-sm" :',
  'isCurrent ? "bg-pd-pink/20 border-2 border-pd-pink text-pd-pink shadow-[0_0_15px_rgba(244,114,182,0.2)]" :'
);
content = content.replace(
  'bg-white border border-slate-200 text-slate-400',
  'bg-white/5 border border-white/10 text-slate-500'
);
content = content.replace(
  'isCurrent ? "text-[#f472b6]" : "text-slate-600"',
  'isCurrent ? "text-pd-pink" : "text-slate-500"'
);
content = content.replace('absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100', 'absolute left-4 top-4 bottom-4 w-[1px] bg-white/10');

// Main content header icon
content = content.replace('bg-pink-50 rounded-2xl flex items-center justify-center text-[#f472b6]', 'bg-gradient-to-br from-pd-pink to-rose-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pd-pink/20');

// Submit buttons
content = content.replace(
  'bg-slate-800 text-white hover:bg-slate-800 transition-colors shadow-md',
  'bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm hover:shadow-md'
);

// All inputs generally
content = content.replace(/bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-pink-400 outline-none transition-all/g, 'w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none placeholder:text-slate-400 shadow-sm');
content = content.replace(/bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-pink-400 outline-none transition-all/g, 'w-full h-11 bg-white border border-slate-200 rounded-xl pl-10 pr-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none placeholder:text-slate-400 shadow-sm');


fs.writeFileSync(file, content);
