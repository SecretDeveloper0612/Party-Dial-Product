const fs = require('fs');

let content = fs.readFileSync('vendor/src/app/(marketing)/page.tsx', 'utf8');

const targetArray = `                  {[
                     { title: "Venue profile page", desc: "Your own branded page with photos, videos, capacity, amenities, location, and pricing information.", icon: <LayoutDashboard size={24} strokeWidth={1.5} />, color: "text-rose-500", bg: "bg-rose-50" },
                     { title: "Dashboard & analytics", desc: "Understand profile views, enquiries, customer interest, and lead activity.", icon: <TrendingUp size={24} strokeWidth={1.5} />, color: "text-blue-500", bg: "bg-blue-50" },
                     { title: "Enquiry management", desc: "Receive customer booking enquiries in an organised way.", icon: <MessageSquare size={24} strokeWidth={1.5} />, color: "text-emerald-500", bg: "bg-emerald-50" },
                     
                     { title: "Smart search filters", desc: "Customers can find you by city, locality, event type, guest count, budget, food preference.", icon: <Filter size={24} strokeWidth={1.5} />, color: "text-amber-500", bg: "bg-amber-50" },
                     { title: "Mobile accessibility", desc: "Manage and review leads from mobile, wherever you are. Your entire venue business in your pocket.", icon: <Smartphone size={24} strokeWidth={1.5} />, color: "text-purple-500", bg: "bg-purple-50" },
                     { title: "Photo & video gallery", desc: "Showcase your ambience, décor possibilities, and real events.", icon: <ImageIcon size={24} strokeWidth={1.5} />, color: "text-pink-500", bg: "bg-pink-50" },
                     
                     { title: "Venue categories", desc: "List for weddings, receptions, birthdays, anniversaries, corporate events, and more.", icon: <UsersRound size={24} strokeWidth={1.5} />, color: "text-cyan-500", bg: "bg-cyan-50" },
                     { title: "Availability support", desc: "Help customers enquire for their preferred event date easily.", icon: <Calendar size={24} strokeWidth={1.5} />, color: "text-indigo-500", bg: "bg-indigo-50" },
                     { title: "Offers and packages", desc: "Promote special packages, seasonal offers, weekday deals, or complete wedding packages.", icon: <Gift size={24} strokeWidth={1.5} />, color: "text-orange-500", bg: "bg-orange-50" },
                     
                     { title: "Location & map", desc: "Make it easier for customers to find and visit your venue with integrated maps and directions.", icon: <MapPin size={24} strokeWidth={1.5} />, color: "text-teal-500", bg: "bg-teal-50" },
                     { title: "Customer reviews", desc: "Build trust through authentic feedback and venue experience sharing.", icon: <Star size={24} strokeWidth={1.5} />, color: "text-yellow-500", bg: "bg-yellow-50" },
                     
                     /* Empty 12th item to complete the 3-column grid elegantly */
                     { title: "Premium Support", desc: "Get priority assistance from our dedicated partner success team.", icon: <Shield size={24} strokeWidth={1.5} />, color: "text-slate-600", bg: "bg-slate-100" }
                  ].map((feature, i) => (`;

const extractedArray = `const platformFeatures = [
   { title: "Venue profile page", desc: "Your own branded page with photos, videos, capacity, amenities, location, and pricing information.", icon: <LayoutDashboard size={24} strokeWidth={1.5} />, color: "text-rose-500", bg: "bg-rose-50" },
   { title: "Dashboard & analytics", desc: "Understand profile views, enquiries, customer interest, and lead activity.", icon: <TrendingUp size={24} strokeWidth={1.5} />, color: "text-blue-500", bg: "bg-blue-50" },
   { title: "Enquiry management", desc: "Receive customer booking enquiries in an organised way.", icon: <MessageSquare size={24} strokeWidth={1.5} />, color: "text-emerald-500", bg: "bg-emerald-50" },
   
   { title: "Smart search filters", desc: "Customers can find you by city, locality, event type, guest count, budget, food preference.", icon: <Filter size={24} strokeWidth={1.5} />, color: "text-amber-500", bg: "bg-amber-50" },
   { title: "Mobile accessibility", desc: "Manage and review leads from mobile, wherever you are. Your entire venue business in your pocket.", icon: <Smartphone size={24} strokeWidth={1.5} />, color: "text-purple-500", bg: "bg-purple-50" },
   { title: "Photo & video gallery", desc: "Showcase your ambience, décor possibilities, and real events.", icon: <ImageIcon size={24} strokeWidth={1.5} />, color: "text-pink-500", bg: "bg-pink-50" },
   
   { title: "Venue categories", desc: "List for weddings, receptions, birthdays, anniversaries, corporate events, and more.", icon: <UsersRound size={24} strokeWidth={1.5} />, color: "text-cyan-500", bg: "bg-cyan-50" },
   { title: "Availability support", desc: "Help customers enquire for their preferred event date easily.", icon: <Calendar size={24} strokeWidth={1.5} />, color: "text-indigo-500", bg: "bg-indigo-50" },
   { title: "Offers and packages", desc: "Promote special packages, seasonal offers, weekday deals, or complete wedding packages.", icon: <Gift size={24} strokeWidth={1.5} />, color: "text-orange-500", bg: "bg-orange-50" },
   
   { title: "Location & map", desc: "Make it easier for customers to find and visit your venue with integrated maps and directions.", icon: <MapPin size={24} strokeWidth={1.5} />, color: "text-teal-500", bg: "bg-teal-50" },
   { title: "Customer reviews", desc: "Build trust through authentic feedback and venue experience sharing.", icon: <Star size={24} strokeWidth={1.5} />, color: "text-yellow-500", bg: "bg-yellow-50" },
   
   /* Empty 12th item to complete the 3-column grid elegantly */
   { title: "Premium Support", desc: "Get priority assistance from our dedicated partner success team.", icon: <Shield size={24} strokeWidth={1.5} />, color: "text-slate-600", bg: "bg-slate-100" }
];\n\n`;

if (content.indexOf(targetArray) === -1) {
  console.error("Target array not found!");
} else {
  // Replace the inline array with platformFeatures.map(...)
  content = content.replace(targetArray, "                  {platformFeatures.map((feature, i) => (");
  
  // Insert the array right before MarketingPage component
  const componentStart = "export default function MarketingPage() {";
  content = content.replace(componentStart, extractedArray + componentStart);
  
  fs.writeFileSync('vendor/src/app/(marketing)/page.tsx', content);
  console.log("Extracted!");
}
