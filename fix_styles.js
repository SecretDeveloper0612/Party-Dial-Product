const fs = require('fs');
let content = fs.readFileSync('vendor/src/app/(marketing)/page.tsx', 'utf8');

content = content.replace(/<style>\{`([\s\S]*?)`\}<\/style>/g, '<style dangerouslySetInnerHTML={{ __html: `$1` }} />');

fs.writeFileSync('vendor/src/app/(marketing)/page.tsx', content);
