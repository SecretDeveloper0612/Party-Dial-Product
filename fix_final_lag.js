const fs = require('fs');
const file = '/Users/haldwani/Documents/Working/party_dial/client/src/app/(user-portal)/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove all backdrop-blur from large containers (Hero form, etc) to ensure absolutely zero compositing lag
content = content.replace(/className="bg-white\/95 backdrop-blur-md p-8/g, 'className="bg-white/95 p-8');
content = content.replace(/bg-white\/80 backdrop-blur-sm relative/g, 'bg-white relative');
content = content.replace(/backdrop-blur-md/g, ''); // Remove other instances of backdrop-blur-md which are often heavily nested

fs.writeFileSync(file, content);
console.log('Fixed final lag');
