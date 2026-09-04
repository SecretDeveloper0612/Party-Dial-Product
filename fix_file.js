const fs = require('fs');
let content = fs.readFileSync('vendor/src/app/(marketing)/page.tsx', 'utf8');

// Replace exact class names
content = content.replace(/blur-\[40px\]/g, 'blur-2xl');
content = content.replace(/w-\[800px\]/g, 'w-200');
content = content.replace(/h-\[800px\]/g, 'h-200');
content = content.replace(/w-\[600px\]/g, 'w-150');
content = content.replace(/h-\[600px\]/g, 'h-150');
content = content.replace(/max-w-\[1400px\]/g, 'max-w-350');
content = content.replace(/rounded-\[32px\]/g, 'rounded-4xl');

// Delete features and FeatureHub
const featureHubStart = content.indexOf('const features = [');
const featureHubEndRegex = /\};\s*const/g;
featureHubEndRegex.lastIndex = featureHubStart;
const match = featureHubEndRegex.exec(content);
if (featureHubStart !== -1 && match) {
  content = content.substring(0, featureHubStart) + 'const' + content.substring(match.index + match[0].length);
}

fs.writeFileSync('vendor/src/app/(marketing)/page.tsx', content);
