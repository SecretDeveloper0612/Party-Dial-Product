const fs = require('fs');
const file = 'client/src/shared/components/Header.tsx';
let content = fs.readFileSync(file, 'utf8');

const loginFunc = `
  const handleGoogleLogin = async () => {
    try {
      const { account } = await import('@/lib/appwrite');
      const { OAuthProvider } = await import('appwrite');
      
      const currentUrl = window.location.origin;
      await account.createOAuth2Session(
        OAuthProvider.Google,
        \`\${currentUrl}/\`, 
        \`\${currentUrl}/login\` 
      );
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Google login failed. Please try again.');
    }
  };

  const handleDownloadApp = async () => {`;

content = content.replace('  const handleDownloadApp = async () => {', loginFunc);

const btnStr = `<button 
                             type="button" 
                             className="w-full h-14 md:h-16 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-[0.1em] shadow-sm flex items-center justify-center gap-3 transition-all hover:bg-slate-50 active:scale-95"
                            >`;
const repBtnStr = `<button 
                             type="button" 
                             onClick={handleGoogleLogin}
                             className="w-full h-14 md:h-16 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-[0.1em] shadow-sm flex items-center justify-center gap-3 transition-all hover:bg-slate-50 active:scale-95"
                            >`;
content = content.replace(btnStr, repBtnStr);

fs.writeFileSync(file, content);
console.log('Fixed Google Login button in Header');
