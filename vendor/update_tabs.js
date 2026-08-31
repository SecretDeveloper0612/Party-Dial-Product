const fs = require('fs');

const pageFile = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/dashboard/page.tsx';
let pageContent = fs.readFileSync(pageFile, 'utf8');

// 1. Add hasActivePaidPlan
const defineActivePlan = `  const hasActivePaidPlan = venueProfile?.subscriptionPlan && venueProfile.subscriptionPlan !== 'free' && (!expiryInfo || expiryInfo.daysLeft > 0);\n\n  // Unified Activity History Generation`;
pageContent = pageContent.replace('  // Unified Activity History Generation', defineActivePlan);

// 2. Update leads tab
pageContent = pageContent.replace(
  `{activeTab === 'leads' && (\n              (venueProfile?.subscriptionPlan && venueProfile?.subscriptionPlan !== 'free') ? (`,
  `{activeTab === 'leads' && (\n              hasActivePaidPlan ? (`
);

// 3. Update pipeline tab
pageContent = pageContent.replace(
  `{activeTab === 'pipeline' && (\n              (venueProfile?.subscriptionPlan && venueProfile?.subscriptionPlan !== 'free') ? (`,
  `{activeTab === 'pipeline' && (\n              hasActivePaidPlan ? (`
);

// 4. Update quotations tab
const quotationsTarget = `{activeTab === 'quotations' && (\n              <QuotationManager`;
const quotationsReplacement = `{activeTab === 'quotations' && (\n              hasActivePaidPlan ? (\n              <QuotationManager`;
pageContent = pageContent.replace(quotationsTarget, quotationsReplacement);

// Need to close the quotations ternary
const quotationsEndTarget = `              />\n            )}`;
const quotationsEndReplacement = `              />\n              ) : (\n                <motion.div \n                  initial={{ opacity: 0, scale: 0.95 }}\n                  animate={{ opacity: 1, scale: 1 }}\n                  className="flex flex-col items-center justify-center min-h-125 bg-white rounded-[40px] border border-white shadow-pd-soft p-12 text-center"\n                >\n                   <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-8 mx-auto">\n                      <FileText size={45} className="animate-pulse" />\n                   </div>\n                   <h3 className="text-3xl font-black text-slate-900 uppercase  tracking-tighter mb-4">Quotations Locked</h3>\n                   <p className="text-slate-500 font-medium  max-w-md mx-auto mb-12 leading-relaxed">\n                      Sending professional quotations and tracking their status requires an active subscription. Upgrade your plan to use this feature.\n                   </p>\n                </motion.div>\n              )\n            )}`;
// careful! There are multiple `              />\n            )}` in the file.
// So I will use regex with context for quotations.
const quotationsBlockRegex = /({activeTab === 'quotations' && \(\s*hasActivePaidPlan \? \(\s*<QuotationManager[\s\S]*?totalWithTax={totalWithTax}\s*\/>)\s*\n\s*\)}/m;
pageContent = pageContent.replace(quotationsBlockRegex, `$1\n              ) : (\n                <motion.div \n                  initial={{ opacity: 0, scale: 0.95 }}\n                  animate={{ opacity: 1, scale: 1 }}\n                  className="flex flex-col items-center justify-center min-h-125 bg-white rounded-[40px] border border-white shadow-pd-soft p-12 text-center"\n                >\n                   <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-8 mx-auto">\n                      <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="animate-pulse"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>\n                   </div>\n                   <h3 className="text-3xl font-black text-slate-900 uppercase  tracking-tighter mb-4">Quotations Locked</h3>\n                   <p className="text-slate-500 font-medium  max-w-md mx-auto mb-12 leading-relaxed">\n                      Sending professional quotations and tracking their status requires an active subscription. Upgrade your plan to use this feature.\n                   </p>\n                </motion.div>\n              )\n            )}`);


// 5. Update reviews tab
const reviewsTarget = `{activeTab === 'reviews' && (\n              <ReviewManager`;
const reviewsReplacement = `{activeTab === 'reviews' && (\n              hasActivePaidPlan ? (\n              <ReviewManager`;
pageContent = pageContent.replace(reviewsTarget, reviewsReplacement);

const reviewsBlockRegex = /({activeTab === 'reviews' && \(\s*hasActivePaidPlan \? \(\s*<ReviewManager[\s\S]*?showToast={showToast}\s*\/>)\s*\n\s*\)}/m;
pageContent = pageContent.replace(reviewsBlockRegex, `$1\n              ) : (\n                <motion.div \n                  initial={{ opacity: 0, scale: 0.95 }}\n                  animate={{ opacity: 1, scale: 1 }}\n                  className="flex flex-col items-center justify-center min-h-125 bg-white rounded-[40px] border border-white shadow-pd-soft p-12 text-center"\n                >\n                   <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-8 mx-auto">\n                      <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="animate-pulse"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>\n                   </div>\n                   <h3 className="text-3xl font-black text-slate-900 uppercase  tracking-tighter mb-4">Reviews Locked</h3>\n                   <p className="text-slate-500 font-medium  max-w-md mx-auto mb-12 leading-relaxed">\n                      Responding to customer reviews and managing your reputation requires an active subscription. Upgrade your plan to use this feature.\n                   </p>\n                </motion.div>\n              )\n            )}`);


fs.writeFileSync(pageFile, pageContent);
console.log("Updated!");
