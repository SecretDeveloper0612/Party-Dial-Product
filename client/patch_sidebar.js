const fs = require('fs');
let file = 'src/app/(user-portal)/venues/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The mobile drawer content starts around 698
const startToken = '{/* Mobile Location Search */}';
const endToken = '{/* Custom Mobile Venue Type Dropdown */}';

// We need to extract the whole block
// Actually, it's easier to just use regex to grab the block from startToken up to the closing div before the "Reset" buttons.
const startIndex = content.indexOf(startToken);
// The reset buttons are here:
// <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-4 shrink-0">
const resetIndex = content.indexOf('<div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-4 shrink-0">');

if (startIndex !== -1 && resetIndex !== -1) {
    const filtersBlock = content.substring(startIndex, resetIndex);
    
    // Now replace that block in the mobile drawer with {filterFormUI}
    content = content.substring(0, startIndex) + '{filterFormUI}\n                  ' + content.substring(resetIndex);
    
    // Now we insert the filterFormUI definition right before the main return statement:
    // return (
    //   <main className="min-h-screen bg-slate-50 relative pb-16">
    const returnIndex = content.indexOf('return (\n    <main className="min-h-screen');
    
    if (returnIndex !== -1) {
        const uiDef = `
  const filterFormUI = (
    <div className="space-y-8">
      ${filtersBlock}
    </div>
  );\n\n  `;
        content = content.substring(0, returnIndex) + uiDef + content.substring(returnIndex);
    }
}

// Now we insert the Left Sidebar
const mainListingsStr = '{/* MAIN LISTINGS */}';
const sidebarStr = `
          {/* LEFT SIDEBAR FILTERS (DESKTOP) */}
          <aside className="hidden lg:block w-80 shrink-0">
             <div className="sticky top-28 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar flex flex-col gap-8">
                <div>
                   <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2">Filters</h3>
                   <button onClick={clearFilters} className="text-xs font-semibold text-pd-red hover:underline">Clear all</button>
                </div>
                {filterFormUI}
             </div>
          </aside>\n\n          `;

content = content.replace(mainListingsStr, sidebarStr + mainListingsStr);

fs.writeFileSync(file, content, 'utf8');
console.log('Sidebar injected.');
