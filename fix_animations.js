const fs = require('fs');
const file = '/Users/haldwani/Documents/Working/party_dial/client/src/app/(user-portal)/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix animate-pulse on heavy blur element
content = content.replace(/className="absolute -inset-4 bg-gradient-to-r from-pd-pink to-pd-blue opacity-30 blur-2xl rounded-\[40px\] -z-10 animate-pulse"/g, 'className="absolute -inset-4 bg-gradient-to-r from-pd-pink to-pd-blue opacity-30 blur-xl rounded-[40px] -z-10 transform-gpu transition-transform"');

// Fix continuous Swiper autoplay that causes massive scroll lag
// Replaces delay: 0 with delay: 3000 and speed: 6000 with speed: 1000
content = content.replace(/delay:\s*0,/g, 'delay: 3000,');
content = content.replace(/speed=\{4000\}/g, 'speed={800}');
content = content.replace(/speed=\{6000\}/g, 'speed={800}');
content = content.replace(/speed=\{6500\}/g, 'speed={800}');

// Fix animate-ping which can be heavy
content = content.replace(/animate-ping opacity-20/g, 'opacity-10');

fs.writeFileSync(file, content);
console.log('Fixed animations');
