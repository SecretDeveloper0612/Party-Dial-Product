const fs = require('fs');
const file = '/Users/haldwani/Documents/Working/party_dial/client/src/app/(user-portal)/ai-search/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace sliding animations with simple fade animations
content = content.replace(/initial={{ opacity: 0, y: 20 }}/g, 'initial={{ opacity: 0 }}');
content = content.replace(/animate={{ opacity: 1, y: 0 }}/g, 'animate={{ opacity: 1 }}');
content = content.replace(/exit={{ opacity: 0, y: -20 }}/g, 'exit={{ opacity: 0 }}');

content = content.replace(/initial={{ opacity: 0, y: 40 }}/g, 'initial={{ opacity: 0 }}');
content = content.replace(/animate={{ opacity: 1, y: 0 }}/g, 'animate={{ opacity: 1 }}');

content = content.replace(/initial={{ opacity: 0, scale: 0.95 }}/g, 'initial={{ opacity: 0 }}');
content = content.replace(/animate={{ opacity: 1, scale: 1 }}/g, 'animate={{ opacity: 1 }}');

content = content.replace(/initial={{ opacity: 0, x: -30 }}/g, 'initial={{ opacity: 0 }}');
content = content.replace(/animate={{ opacity: 1, x: 0 }}/g, 'animate={{ opacity: 1 }}');
content = content.replace(/exit={{ opacity: 0, x: 20 }}/g, 'exit={{ opacity: 0 }}');

fs.writeFileSync(file, content);
console.log('Fixed AI animations');
