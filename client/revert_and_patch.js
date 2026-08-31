const fs = require('fs');
const file = 'src/app/(user-portal)/venues/[id]/page.tsx.old';
let content = fs.readFileSync(file, 'utf8');

// 1. URL Slug Fix
content = content.replace(
  'const id = params.id as string;',
  'const paramId = params.id as string;\n  const id = paramId.includes(\'-\') ? paramId.split(\'-\').pop() as string : paramId;'
);

// 2. Hide Available Spaces if empty
// Looking for the Available Spaces section in the old code
content = content.replace(
  /{?\/\* 2\. Available Spaces \*\//,
  '{venue.halls && venue.halls.length > 0 && (\n          <>\n          {/* 2. Available Spaces */'
);
// We need to close it. Let's find the next section to close it before.
content = content.replace(
  /{?\/\* 3\. About the Venue \*\//,
  '          </>\n        )}\n\n        {/* 3. About the Venue */'
);

// 3. Hide amenities button if <= 6
content = content.replace(
  '<button \n                onClick={() => setIsAmenitiesModalOpen(true)}',
  '{venue.amenities && venue.amenities.length > 6 && (\n              <button \n                onClick={() => setIsAmenitiesModalOpen(true)}'
);
// Close it
content = content.replace(
  '</button>\n            </div>\n\n            {/* 6.',
  '</button>\n              )}\n            </div>\n\n            {/* 6.'
);
// In case the spacing is different, let's use regex
content = content.replace(
  /(<button[^>]*onClick={\(\) => setIsAmenitiesModalOpen\(true\)}[\s\S]*?<\/button>)/,
  '{venue.amenities && venue.amenities.length > 6 && (\n              $1\n            )}'
);

// 4. Logo Extraction
content = content.replace(
  'const photoIds = parsePhotos(doc.photos);',
  `let logoUrl = null;
          try {
             const rawPhotos = typeof doc.photos === 'string' ? JSON.parse(doc.photos) : doc.photos;
             if (Array.isArray(rawPhotos)) {
                const logoObj = rawPhotos.find((p: any) => p.category === 'Profile');
                if (logoObj) logoUrl = getAppwriteImageUrl(logoObj.id || logoObj.$id);
             }
          } catch(e) {}
          const photoIds = parsePhotos(doc.photos);`
);

content = content.replace(
  'capacity: getCapacityLabel(doc.capacity),',
  'capacity: getCapacityLabel(doc.capacity),\n            logo: logoUrl,'
);

// Save to the actual file
fs.writeFileSync('src/app/(user-portal)/venues/[id]/page.tsx', content, 'utf8');
console.log('Reverted to old design and applied logic fixes.');
