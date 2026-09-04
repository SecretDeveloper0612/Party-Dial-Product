const fs = require('fs');
const file = 'client/src/app/(user-portal)/venues/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetBtn = `if (!isLoggedIn) {
                              window.history.pushState({}, '', '?login=true');
                              window.dispatchEvent(new Event('popstate'));
                              // Try changing URL directly if router approach is preferred, 
                              // but adding query param works best to trigger Header.
                              window.location.search = '?login=true';
                            } else {`;

const repBtn = `if (!isLoggedIn) {
                              window.dispatchEvent(new Event('open-auth-modal'));
                            } else {`;

content = content.replace(targetBtn, repBtn);
fs.writeFileSync(file, content);
console.log('Fixed review button to use custom event instead of reload');
