'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function VenueLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // No auto-redirect from localStorage, as we want to use the live SDK for checks.
  React.useEffect(() => {
    // We no longer clear stale data here to avoid logging out users who visit this page while logged in
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.type === 'email' ? 'email' : 'password']: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { account } = await import('@/lib/appwrite');

      // Delete any existing session first to avoid "session already active" error
      try {
        await account.deleteSession('current');
      } catch (_) {
        // No active session — that's fine, continue
      }

      // 1. Create the session directly on frontend (required for browser cookies)
      const session = await account.createEmailPasswordSession(formData.email, formData.password);

      // 2. Get user details
      const user = await account.get();
      
      // 3. --- Added: Role-Based Access Control ---
      // Distinguish between Vendors and regular Clients (who might share localhost cookies)
      const labels = user.labels || [];
      let isVendor = labels.includes('vendor');
      const isMasterAdmin = user.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@partydial.com");

      // Fallback: If no label, check if they exist in the venues collection
      if (!isVendor && !isMasterAdmin) {
        try {
          const { databases } = await import('@/lib/appwrite');
          const { Query } = await import('appwrite');
          const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
          const VENUES_COL_ID = process.env.NEXT_PUBLIC_APPWRITE_VENUES_COLLECTION_ID;
          
          if (DATABASE_ID && VENUES_COL_ID) {
            const venueCheck = await databases.listDocuments(DATABASE_ID, VENUES_COL_ID, [
              Query.equal('userId', user.$id)
            ]);
            if (venueCheck.documents.length > 0) {
              isVendor = true;
            }
          }
        } catch (fallbackError) {
          console.warn('Venue fallback check failed:', fallbackError);
        }
      }

      if (!isVendor && !isMasterAdmin) {
        // This is a Client user trying to log into the Vendor portal
        await account.deleteSession('current');
        localStorage.clear();
        setError('Access Denied: This portal is reserved for Venue Partners only.');
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem('auth_session', JSON.stringify(session));
      localStorage.setItem('user', JSON.stringify(user));

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-pd selection:bg-pd-pink selection:text-white relative">

      {/* Home Link */}
      <div className="absolute top-8 left-8 z-20">
        <Link href="/">
          <div className="flex items-center gap-3 group cursor-pointer">
            <Image
              src="/logo.png"
              alt="PartyDial"
              width={120}
              height={36}
              className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
            <span className="text-[10px] font-black text-pd-red italic tracking-widest uppercase">PARTNER</span>
          </div>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px]"
      >
        <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-pd-strong border border-slate-100 mb-8 relative overflow-hidden">
          <div className="mb-10 text-center">
            <div className="w-20 h-20 bg-slate-900 rounded-[24px] flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform overflow-hidden shadow-xl">
              <Image
                src="/partner-icon.jpg"
                alt="Venue Partner"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-3xl font-[900] text-slate-900 uppercase italic mb-2 tracking-tight">Venue Login</h2>
            <p className="text-sm text-slate-500 font-medium font-pd">Manage your venue and tracking leads.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-[12px] flex items-center gap-2 text-red-600 text-[11px] font-bold">
                <ShieldCheck size={16} className="text-red-500" /> {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-12 bg-slate-50 border border-slate-100 rounded-[16px] pl-11 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none"
                  placeholder="venue@example.com"
                />

              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center pr-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                <Link href="/forgot-password" title="Forgot Password" className="text-[10px] font-black uppercase text-pd-pink hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 bg-slate-50 border border-slate-100 rounded-[16px] pl-11 pr-11 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 pd-btn-primary !rounded-[16px] flex items-center justify-center gap-3 text-sm italic tracking-normal lowercase group shadow-lg shadow-pd-pink/10"
            >
              {isSubmitting ? 'Signing in...' : 'secure login'}
              {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>



          </form>

          <div className="mt-10 flex items-center justify-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Partner Access</span>
          </div>
        </div>

        <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
          Don&apos;t have an account? <Link href="/signup" className="text-pd-pink hover:underline">Register Venue</Link>
        </p>
      </motion.div>
    </div>
  );
}
