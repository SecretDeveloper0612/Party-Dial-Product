const fs = require('fs');
const https = require('https');

const url = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/cities.json';

https.get(url, (res) => {
  const chunks = [];
  res.on('data', (chunk) => { chunks.push(chunk); });
  res.on('end', () => {
    try {
      const data = Buffer.concat(chunks).toString();
      const allCities = JSON.parse(data);
      const indiaCities = allCities
        .filter(c => c.country_code === 'IN')
        .map(c => c.name);
      
      const uniqueCities = [...new Set(indiaCities)].sort();
      
      const content = `export const SEO_CITIES = ${JSON.stringify(uniqueCities, null, 2)};\n\nexport const SEO_KEYWORDS = {\n  modifiers: ["Best", "Top", "Cheap", "Luxury", "Budget", "Verified", "Affordable", "Popular"],\n  longTail: [\n    "near me",\n    "with price",\n    "with photos",\n    "reviews and ratings",\n    "contact number",\n    "for wedding",\n    "for birthday party",\n    "under 500"\n  ]\n};\n\nexport const SEO_CATEGORIES = [\n  { slug: "banquet-halls", name: "Banquet Halls", title: "Banquet Halls" },\n  { slug: "wedding-venues", name: "Wedding Venues", title: "Wedding Venues" },\n  { slug: "birthday-party-venues", name: "Birthday Party Venues", title: "Birthday Party Venues" },\n  { slug: "corporate-event-venues", name: "Corporate Event Venues", title: "Corporate Event Venues" },\n  { slug: "party-lawns", name: "Party Lawns", title: "Party Lawns" },\n  { slug: "resorts", name: "Resorts", title: "Resorts" },\n  { slug: "catering-services", name: "Catering Services", title: "Caterers" },\n  { slug: "event-planners", name: "Event Planners", title: "Event Planners" },\n  { slug: "decorators", name: "Decorators", title: "Decorators" },\n  { slug: "djs", name: "DJs", title: "DJs" }\n];\n`;
      
      fs.writeFileSync('e:/PartyDial/src/config/seo-data.ts', content);
      console.log(`Success! Added ${uniqueCities.length} cities.`);
    } catch (e) {
      console.error('Error parsing JSON:', e);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching data:', err);
});
