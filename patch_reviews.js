const fs = require('fs');
const file = 'client/src/app/(user-portal)/venues/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetBtn = `<button 
                         onClick={() => setIsReviewModalOpen(true)}
                         className="px-8 py-4 bg-[#f43f5e] text-white text-[10px] font-pd font-normal uppercase tracking-[0.2em]  rounded-[20px] shadow-xl shadow-[#f43f5e]/30 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                       >`;

const repBtn = `<button 
                         onClick={() => {
                            if (!isLoggedIn) {
                              window.history.pushState({}, '', '?login=true');
                              window.dispatchEvent(new Event('popstate'));
                              // Try changing URL directly if router approach is preferred, 
                              // but adding query param works best to trigger Header.
                              window.location.search = '?login=true';
                            } else {
                              setIsReviewModalOpen(true);
                            }
                         }}
                         className="px-8 py-4 bg-[#f43f5e] text-white text-[10px] font-pd font-normal uppercase tracking-[0.2em]  rounded-[20px] shadow-xl shadow-[#f43f5e]/30 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                       >`;

content = content.replace(targetBtn, repBtn);
fs.writeFileSync(file, content);
console.log('Fixed review button to prompt login if not authenticated');
