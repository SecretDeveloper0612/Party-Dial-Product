const fs = require('fs');
const path = require('path');

const qmPath = path.join(__dirname, 'src/vendor/components/dashboard/QuotationManager.tsx');
let qm = fs.readFileSync(qmPath, 'utf-8');
qm = qm.replace(/import \{ Client, Account, Databases, Storage, ID, Query \} from 'appwrite';/, "import { Client, Account, Databases } from 'appwrite';");
qm = qm.replace(/export const storage = new Storage\(client\);/, "");
qm = qm.replace(/export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID \|\| '69c2305e000ecd6d04c1';/, "export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69c2305e000ecd6d04c1';"); // leave alone
qm = qm.replace(/export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID \|\| 'venues_photos';/, "");
qm = qm.replace(/export \{ client, ID, Query \};/, "export { client };");

// Removing unused icons
qm = qm.replace(/Building2, /, "");
qm = qm.replace(/Phone, /, "");
qm = qm.replace(/Mail, /, "");
qm = qm.replace(/Printer, /, "");
qm = qm.replace(/User, /, "");

qm = qm.replace(/handleDownload,\n\s*handleSend,/, ""); // remove from props

// page.tsx fixes
const dPagePath = path.join(__dirname, 'src/app/dashboard/page.tsx');
let dp = fs.readFileSync(dPagePath, 'utf-8');
dp = dp.replace(/h-\[100dvh\]/g, 'h-dvh');
dp = dp.replace(/h-\[1px\]/g, 'h-px');
dp = dp.replace(/w-\[1px\]/g, 'w-px');
dp = dp.replace(/min-w-\[340px\]/g, 'min-w-85');
dp = dp.replace(/w-\[38px\]/g, 'w-9.5');
dp = dp.replace(/h-\[38px\]/g, 'h-9.5');
dp = dp.replace(/w-\[18px\]/g, 'w-4.5');
dp = dp.replace(/h-\[18px\]/g, 'h-4.5');
dp = dp.replace(/font-\[900\]/g, 'font-black');
dp = dp.replace(/w-\[46px\]/g, 'w-11.5');
dp = dp.replace(/h-\[46px\]/g, 'h-11.5');
dp = dp.replace(/lg:w-\[50px\]/g, 'lg:w-12.5');
dp = dp.replace(/lg:h-\[50px\]/g, 'lg:h-12.5');
dp = dp.replace(/p-\[2px\]/g, 'p-0.5');
dp = dp.replace(/min-h-\[500px\]/g, 'min-h-125');

fs.writeFileSync(dPagePath, dp);

const pmPopup = path.join(__dirname, 'src/vendor/components/PaymentReminderPopup.tsx');
let pm = fs.readFileSync(pmPopup, 'utf-8');
pm = pm.replace(/flex-shrink-0/g, 'shrink-0');
fs.writeFileSync(pmPopup, pm);

console.log('Done again!');
