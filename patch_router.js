const fs = require('fs');
const file = 'client/src/app/(user-portal)/venues/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import { useParams } from 'next/navigation';", "import { useParams, useRouter } from 'next/navigation';");
content = content.replace("export default function VenueDetailPage() {\n  const params = useParams();", "export default function VenueDetailPage() {\n  const params = useParams();\n  const router = useRouter();");

const targetBtn = `if (!isLoggedIn) {
                              window.dispatchEvent(new Event('open-auth-modal'));
                            } else {`;
const repBtn = `if (!isLoggedIn) {
                              router.push('?login=true', { scroll: false });
                            } else {`;

content = content.replace(targetBtn, repBtn);
fs.writeFileSync(file, content);
console.log('Fixed review button to use router push');
