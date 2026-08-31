const fs = require('fs');
const path = require('path');

const qsPath = path.join(__dirname, 'src/vendor/components/dashboard/QuickSupport.tsx');
let qs = fs.readFileSync(qsPath, 'utf-8');
qs = qs.replace(/bg-gradient-to-br/g, 'bg-linear-to-br');
qs = qs.replace(/bg-gradient-to-bl/g, 'bg-linear-to-bl');
qs = qs.replace(/w-\[500px\]/g, 'w-125');
qs = qs.replace(/h-\[500px\]/g, 'h-125');
qs = qs.replace(/w-\[400px\]/g, 'w-100');
qs = qs.replace(/h-\[400px\]/g, 'h-100');
fs.writeFileSync(qsPath, qs);

const qmPath = path.join(__dirname, 'src/vendor/components/dashboard/QuotationManager.tsx');
let qm = fs.readFileSync(qmPath, 'utf-8');
qm = qm.replace(/"Hi Karan, based on your requirements, here is our customised proposal for your upcoming event. "/g, '&quot;Hi Karan, based on your requirements, here is our customised proposal for your upcoming event. &quot;');
qm = qm.replace(/"\{quoteData.specialRequests\}"/g, '&quot;{quoteData.specialRequests}&quot;');

qm = qm.replace(/lg:w-\[460px\]/g, 'lg:w-115');
qm = qm.replace(/lg:top-\[80px\]/g, 'lg:top-20');
qm = qm.replace(/h-\[28px\]/g, 'h-7');
qm = qm.replace(/\[background-size:20px_20px\]/g, 'bg-size-[20px_20px]');
qm = qm.replace(/max-w-\[850px\]/g, 'max-w-[212.5rem]'); // Actually 850px is not a clean rem in tailwind unless configured. 850px / 4 = 212.5. Wait, 850px is 53.125rem. w-212.5 is correct for tailwind v4. Let's just use max-w-212.5
qm = qm.replace(/max-w-\[850px\]/g, 'max-w-212.5');
qm = qm.replace(/min-h-\[1056px\]/g, 'min-h-264');

qm = qm.replace(/<img\n/g, '/* eslint-disable-next-line @next/next/no-img-element */\n                                       <img\n');
qm = qm.replace(/<img crossOrigin/g, '/* eslint-disable-next-line @next/next/no-img-element */\n                                 <img crossOrigin');

// any types
qm = qm.replace(/: any\)/g, ': unknown)');
qm = qm.replace(/: any;/g, ': unknown;');
qm = qm.replace(/: any =/g, ': unknown =');
qm = qm.replace(/<any>/g, '<unknown>');

fs.writeFileSync(qmPath, qm);

console.log('Done!');
