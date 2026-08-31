const fs = require('fs');

const pageFile = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx';
let pageContent = fs.readFileSync(pageFile, 'utf8');

// Fix unused imports
pageContent = pageContent.replace(/BarChart3,\n\s*/g, '');
pageContent = pageContent.replace(/PieChart,\n\s*/g, '');
pageContent = pageContent.replace(/HelpCircle,\n\s*/g, '');
pageContent = pageContent.replace(/Briefcase,\n\s*/g, '');
pageContent = pageContent.replace(/Plus,\n\s*/g, '');
pageContent = pageContent.replace(/Layers,\n\s*/g, '');
pageContent = pageContent.replace(/Image as ImageIcon,\n\s*/g, '');
pageContent = pageContent.replace(/CircleDot,\n\s*/g, '');
pageContent = pageContent.replace(/const router = useRouter\(\);\n\s*/g, '');

// Fix quotes
pageContent = pageContent.replace(/Scale Your Venue's/g, 'Scale Your Venue&apos;s');
pageContent = pageContent.replace(/We don't just/g, 'We don&apos;t just');
pageContent = pageContent.replace(/India's most/g, 'India&apos;s most');
pageContent = pageContent.replace(/Join India's/g, 'Join India&apos;s');

// Fix setState warning
pageContent = pageContent.replace(/setMounted\(true\);/g, 'setTimeout(() => setMounted(true), 0);');

// Fix Tailwind classes in page.tsx
pageContent = pageContent.replace(/h-\[460px\]/g, 'h-115');
pageContent = pageContent.replace(/w-\[240px\]/g, 'w-60');
pageContent = pageContent.replace(/w-\[260px\]/g, 'w-65');
pageContent = pageContent.replace(/h-\[280px\]/g, 'h-70');
pageContent = pageContent.replace(/!pb-16/g, 'pb-16!');
pageContent = pageContent.replace(/!w-70/g, 'w-70!');
pageContent = pageContent.replace(/md:!w-85/g, 'md:w-85!');
pageContent = pageContent.replace(/!px-6/g, 'px-6!');
pageContent = pageContent.replace(/!w-\[320px\]/g, 'w-[320px]!');
pageContent = pageContent.replace(/md:!w-\[420px\]/g, 'md:w-105!');

fs.writeFileSync(pageFile, pageContent);

const dashboardFile = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/dashboard/page.tsx';
let dashboardContent = fs.readFileSync(dashboardFile, 'utf8');

// Fix Tailwind classes in dashboard/page.tsx
dashboardContent = dashboardContent.replace(/h-\[100dvh\]/g, 'h-dvh');
dashboardContent = dashboardContent.replace(/h-\[1px\]/g, 'h-px');
dashboardContent = dashboardContent.replace(/min-w-\[340px\]/g, 'min-w-85');
dashboardContent = dashboardContent.replace(/w-\[1px\]/g, 'w-px');
dashboardContent = dashboardContent.replace(/w-\[38px\]/g, 'w-9.5');
dashboardContent = dashboardContent.replace(/h-\[38px\]/g, 'h-9.5');
dashboardContent = dashboardContent.replace(/w-\[18px\]/g, 'w-4.5');
dashboardContent = dashboardContent.replace(/h-\[18px\]/g, 'h-4.5');
dashboardContent = dashboardContent.replace(/font-\[900\]/g, 'font-black');
dashboardContent = dashboardContent.replace(/w-\[46px\]/g, 'w-11.5');
dashboardContent = dashboardContent.replace(/h-\[46px\]/g, 'h-11.5');
dashboardContent = dashboardContent.replace(/lg:w-\[50px\]/g, 'lg:w-12.5');
dashboardContent = dashboardContent.replace(/lg:h-\[50px\]/g, 'lg:h-12.5');
dashboardContent = dashboardContent.replace(/p-\[2px\]/g, 'p-0.5');
dashboardContent = dashboardContent.replace(/min-h-\[500px\]/g, 'min-h-125');

fs.writeFileSync(dashboardFile, dashboardContent);

const popupFile = '/Users/haldwani/Documents/Working/party_dial/vendor/src/vendor/components/PaymentReminderPopup.tsx';
let popupContent = fs.readFileSync(popupFile, 'utf8');
popupContent = popupContent.replace(/flex-shrink-0/g, 'shrink-0');
fs.writeFileSync(popupFile, popupContent);

console.log("All fixes applied!");
