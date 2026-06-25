const fs = require('fs');
const file = '/Users/haldwani/Documents/Working/party_dial/client/src/app/(user-portal)/ai-search/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const newParser = `function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function fuzzyExtract(query, wordsList, maxDistance = 2) {
  const queryWords = query.replace(/[^\w\s]/g, '').split(/\\s+/);
  for (const target of wordsList) {
    if (query.includes(target)) return target;
    const targetWords = target.split(/\\s+/);
    if (targetWords.length === 1) {
      for (const qWord of queryWords) {
        if (qWord.length >= 4 && Math.abs(qWord.length - target.length) <= maxDistance) {
           if (levenshtein(qWord, target) <= maxDistance) return target;
        }
      }
    } else {
      // For multi-word targets like "pre-wedding", just checking direct includes is usually enough
      // or we can just ignore fuzzy for them
    }
  }
  return "";
}

const parseAIQuery = (query: string) => {
  const q = query.toLowerCase();
  
  const pincodeMatch = q.match(/\\b\\d{6}\\b/);
  const pincode = pincodeMatch ? pincodeMatch[0] : null;

  let maxBudget = null;
  const lakhMatch = q.match(/(under|below|for)?\\s*₹?\\s*(\\d+(\\.\\d+)?)\\s*lakh/);
  if (lakhMatch) maxBudget = parseFloat(lakhMatch[2]) * 100000;
  else {
    const kMatch = q.match(/(under|below|for)?\\s*₹?\\s*(\\d+)\\s*k/);
    if (kMatch) maxBudget = parseInt(kMatch[2]) * 1000;
    else {
      const rsMatch = q.match(/(under|below|for)?\\s*(?:₹|rs\\.?)\\s*(\\d+(?:,\\d+)*)/);
      if (rsMatch) maxBudget = parseInt(rsMatch[2].replace(/,/g, ''));
      else {
        const pureNumMatch = q.match(/(under|below)\\s*(\\d+(?:,\\d+)*)/);
        if (pureNumMatch) maxBudget = parseInt(pureNumMatch[2].replace(/,/g, ''));
      }
    }
  }

  let capacity = 0;
  const capMatch = q.match(/(\\d+)\\s*(guests|people|pax|persons)/);
  if (capMatch) capacity = parseInt(capMatch[1]);
  else {
    const forMatch = q.match(/for\\s*(\\d+)/);
    if (forMatch && parseInt(forMatch[1]) > 10) capacity = parseInt(forMatch[1]);
  }

  const eventTypes = ["birthday", "wedding", "pre-wedding", "anniversary", "corporate", "kitty party", "bachelor", "baby shower", "engagement"];
  let eventType = fuzzyExtract(q, eventTypes, 2);

  const venueTypes = ["banquet", "hotel", "resort", "lawn", "farmhouse", "rooftop", "hall", "party"];
  let venueType = fuzzyExtract(q, venueTypes, 2);

  const cities = ["haldwani", "delhi", "noida", "gurgaon", "mumbai", "bangalore", "kathgodam", "lalkuan"];
  let city = fuzzyExtract(q, cities, 2);

  const generalKeywords = ["venue", "book", "search", "find", "party", "event", "marriage", "function", "celebrate", "celebration"];
  const hasGeneralKeyword = generalKeywords.some(kw => q.includes(kw));

  const isUnrelated = !pincode && !maxBudget && !capacity && !eventType && !venueType && !city && !hasGeneralKeyword;

  return { pincode, maxBudget, capacity, eventType, venueType, city, isUnrelated };
};`;

// Replace from `const parseAIQuery` to the end of the function
const startIdx = content.indexOf('const parseAIQuery = (query: string) => {');
const endIdx = content.indexOf('export default function AISearchPage() {');

if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + newParser + '\n\n' + content.substring(endIdx);
} else {
    console.log("Could not find parser function.");
}

// Now replace the "No matching venues found" block with a conditional for unrelated queries
const noResultsBlock = `                 <div className="text-center py-24 bg-white rounded-[48px] border border-slate-100 shadow-pd-soft">
                   <div className="inline-flex justify-center items-center w-24 h-24 bg-slate-50 rounded-full text-slate-200 mb-8">
                     <Search size={40} />
                   </div>
                   <h2 className="text-3xl font-black text-slate-900 mb-3 italic">No matching venues found</h2>
                   <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto px-6">
                     Try broadening your search criteria or removing specific constraints like budget or capacity.
                   </p>
                   <button 
                     onClick={() => {
                       setQuery("");
                       setHasSearched(false);
                     }}
                     className="pd-btn-primary !rounded-2xl"
                   >
                     Reset AI Search
                   </button>
                 </div>`;

const unrelatedBlock = `                 <div className="text-center py-24 bg-white rounded-[48px] border border-slate-100 shadow-pd-soft">
                   {extractedFilters?.isUnrelated ? (
                     <>
                       <div className="inline-flex justify-center items-center w-24 h-24 bg-red-50 rounded-full text-pd-red mb-8">
                         <X size={40} />
                       </div>
                       <h2 className="text-3xl font-black text-slate-900 mb-3 italic">I can only help with venues</h2>
                       <p className="text-slate-500 font-medium mb-10 max-w-lg mx-auto px-6">
                         I am an AI assistant specifically designed to help you discover and book premium venues. Please ask me to find a banquet, resort, or party hall!
                       </p>
                     </>
                   ) : (
                     <>
                       <div className="inline-flex justify-center items-center w-24 h-24 bg-slate-50 rounded-full text-slate-200 mb-8">
                         <Search size={40} />
                       </div>
                       <h2 className="text-3xl font-black text-slate-900 mb-3 italic">No matching venues found</h2>
                       <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto px-6">
                         Try broadening your search criteria or removing specific constraints like budget or capacity.
                       </p>
                     </>
                   )}
                   <button 
                     onClick={() => {
                       setQuery("");
                       setHasSearched(false);
                     }}
                     className="pd-btn-primary !rounded-2xl"
                   >
                     Reset AI Search
                   </button>
                 </div>`;

content = content.replace(noResultsBlock, unrelatedBlock);

fs.writeFileSync(file, content);
console.log('Fixed AI parser');
