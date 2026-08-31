"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await account.get();
        setUser(session);
        setName(session.name || '');
      } catch (error) {
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await account.updateName(name);
      setSuccess('Profile updated successfully!');
      
      window.dispatchEvent(new Event('auth-change'));
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      window.dispatchEvent(new Event('auth-change'));
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#f5f5f7]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-24">
      {/* Navbar / Header */}
      <div className="sticky top-0 z-10 bg-[#f5f5f7]/80 backdrop-blur-xl border-b border-black/[0.05]">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center text-blue-500 hover:opacity-70 transition-opacity">
            <ArrowLeft size={22} strokeWidth={2} className="mr-1" />
            <span className="text-[17px] font-medium tracking-tight">Home</span>
          </Link>
          <span className="text-[17px] font-semibold tracking-tight text-slate-900 absolute left-1/2 -translate-x-1/2">Profile</span>
          <div className="w-[60px]" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-12">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex items-center justify-center mb-5 border border-white">
            <span className="text-4xl font-medium text-slate-700 tracking-tight">{name.charAt(0).toUpperCase()}</span>
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">{name}</h1>
          <p className="text-[15px] text-slate-500 mt-1">{user.email}</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleUpdateProfile}>
          <div className="bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden mb-8 border border-black/[0.02]">
            
            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="text-[15px] font-medium text-slate-900 w-32 shrink-0">Name</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-transparent text-[17px] text-slate-700 outline-none placeholder:text-slate-300"
                placeholder="Your full name"
              />
            </div>

            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="text-[15px] font-medium text-slate-900 w-32 shrink-0">Email</label>
              <input 
                type="email"
                value={user.email}
                disabled
                className="flex-1 bg-transparent text-[17px] text-slate-400 outline-none cursor-not-allowed"
              />
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="text-[15px] font-medium text-slate-900 w-32 shrink-0">Phone</label>
              <div className="flex-1 flex items-center justify-between">
                <input 
                  type="tel"
                  value={user.phone ? user.phone.replace('+91', '+91 ') : 'Not provided'}
                  disabled
                  className="w-full bg-transparent text-[17px] text-slate-400 outline-none cursor-not-allowed"
                />
                {user.phoneVerification && (
                  <span className="text-[13px] font-medium text-green-500 bg-green-50 px-2 py-0.5 rounded-md ml-2 shrink-0">Verified</span>
                )}
              </div>
            </div>

          </div>

          {error && <p className="text-[15px] text-red-500 text-center mb-6">{error}</p>}
          {success && <p className="text-[15px] text-green-600 text-center mb-6">{success}</p>}

          <div className="flex flex-col gap-4">
            <button 
              type="submit"
              disabled={isSaving || name === user.name}
              className="w-full bg-slate-900 hover:bg-black text-white rounded-2xl h-14 font-medium text-[17px] shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center"
            >
              {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Save Changes"}
            </button>

            <button 
              type="button"
              onClick={handleLogout}
              className="w-full bg-white text-red-500 hover:bg-red-50 border border-red-100 rounded-2xl h-14 font-medium text-[17px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all active:scale-[0.98]"
            >
              Log Out
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
}
