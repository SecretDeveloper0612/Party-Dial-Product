const fs = require('fs');
const file = 'client/src/shared/components/Header.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `      if (isVendor || isMasterAdmin) {
        setUser(null);
      } else {`;
const replaceStr = `      if (isVendor || isMasterAdmin) {
        await account.deleteSession('current').catch(() => {});
        setUser(null);
        setAuthError('Venue Partners and Admins cannot login to the user portal.');
        if (!authModal.isOpen) {
          setAuthModal({ isOpen: true, type: 'signin' });
        }
      } else {`;
content = content.replace(targetStr, replaceStr);

fs.writeFileSync(file, content);
console.log('Fixed checkSession in Header');
