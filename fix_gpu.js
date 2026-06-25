const fs = require('fs');
const file = '/Users/haldwani/Documents/Working/party_dial/client/src/app/(user-portal)/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove transform-gpu from large elements to prevent VRAM exhaustion
content = content.replace(/ opacity-70 transform-gpu/g, ' opacity-70');
content = content.replace(/ rounded-full pointer-events-none transform-gpu/g, ' rounded-full pointer-events-none');
content = content.replace(/ rounded-full opacity-60 translate-x-1\/3 -translate-y-1\/3 transform-gpu/g, ' rounded-full opacity-60 translate-x-1/3 -translate-y-1/3');
content = content.replace(/ rounded-full opacity-40 -translate-x-1\/4 translate-y-1\/4 transform-gpu/g, ' rounded-full opacity-40 -translate-x-1/4 translate-y-1/4');

fs.writeFileSync(file, content);
console.log('Fixed GPU');
