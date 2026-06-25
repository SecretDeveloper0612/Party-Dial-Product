const fs = require('fs');
const file = '/Users/haldwani/Documents/Working/party_dial/client/src/app/(user-portal)/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace main hero blobs
content = content.replace(/bg-pd-pink\/20 blur-\[120px\] mix-blend-multiply opacity-70/g, 'bg-[radial-gradient(circle,rgba(236,72,153,0.1)_0%,transparent_70%)] opacity-70 transform-gpu');
content = content.replace(/bg-pd-blue\/20 blur-\[120px\] mix-blend-multiply opacity-70/g, 'bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)] opacity-70 transform-gpu');
content = content.replace(/bg-pd-purple\/10 blur-\[120px\] mix-blend-multiply opacity-70/g, 'bg-[radial-gradient(circle,rgba(168,85,247,0.05)_0%,transparent_70%)] opacity-70 transform-gpu');

// Replace other background blurs
content = content.replace(/bg-pd-pink\/5 rounded-full blur-\[120px\]/g, 'bg-[radial-gradient(circle,rgba(236,72,153,0.03)_0%,transparent_70%)] rounded-full transform-gpu');
content = content.replace(/bg-pd-blue\/5 rounded-full blur-\[120px\]/g, 'bg-[radial-gradient(circle,rgba(59,130,246,0.03)_0%,transparent_70%)] rounded-full transform-gpu');

// Replace heavy backdrop blurs with md
content = content.replace(/backdrop-blur-2xl/g, 'backdrop-blur-md');
content = content.replace(/backdrop-blur-3xl/g, 'backdrop-blur-md');

// Replace the two complex gradients at the end
content = content.replace(/bg-gradient-to-br from-pd-pink\/30 via-purple-500\/20 to-pd-blue\/30 rounded-full blur-\[120px\] opacity-60 translate-x-1\/3 -translate-y-1\/3 mix-blend-screen/g, 'bg-[radial-gradient(circle,rgba(236,72,153,0.1)_0%,transparent_70%)] rounded-full opacity-60 translate-x-1/3 -translate-y-1/3 transform-gpu');
content = content.replace(/bg-gradient-to-tr from-pd-red\/20 to-pd-pink\/20 rounded-full blur-\[100px\] opacity-40 -translate-x-1\/4 translate-y-1\/4 mix-blend-screen/g, 'bg-[radial-gradient(circle,rgba(239,68,68,0.05)_0%,transparent_70%)] rounded-full opacity-40 -translate-x-1/4 translate-y-1/4 transform-gpu');

fs.writeFileSync(file, content);
console.log('Fixed blurs');
