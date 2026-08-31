'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  React.useEffect(() => {
    // Clear any stale errors on mode switch
    setError('');
  }, [mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.type === 'email' ? 'email' : 'password']: e.target.value }));
  };

  const handleSignIn = async () => {
    const { account } = await import('@/lib/appwrite');
    try {
      await account.deleteSession('current');
    } catch {
      // Ignore error if no session exists
    }

    const session = await account.createEmailPasswordSession(formData.email, formData.password);
    const user = await account.get();
    
    const labels = user.labels || [];
    let isVendor = labels.includes('vendor');
    const isMasterAdmin = user.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@partydial.com");

    if (!isVendor && !isMasterAdmin) {
      try {
        const { databases, Query } = await import('@/lib/appwrite');
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

    // Allow all authenticated users to proceed. If they lack a profile, dashboard will route them to onboarding.
    if (!isVendor && !isMasterAdmin) {
      console.log('User is new or client, proceeding to dashboard to allow onboarding if needed.');
    }

    localStorage.setItem('auth_session', JSON.stringify(session));
    localStorage.setItem('user', JSON.stringify(user));
    router.push('/dashboard');
  };

  const handleSignUp = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
    const serverUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
    
    const response = await fetch(`${serverUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        name: 'New Partner'
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // After registration, auto sign-in
    await handleSignIn();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (mode === 'signin') {
        await handleSignIn();
      } else {
        await handleSignUp();
      }
    } catch (err) {
      console.error('Auth error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex font-pd selection:bg-pd-pink selection:text-white bg-white">
      {/* Left Section - Marketing */}
      <div className="hidden lg:flex w-[55%] bg-[#0f1218] relative overflow-hidden flex-col justify-center p-16 xl:p-24">
        {/* Faint Grid Background */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-135">
          <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full w-fit mb-10 backdrop-blur-md">
            <span className="text-amber-400 text-sm">⭐</span>
            <span className="text-white/80 text-xs font-semibold tracking-wide">#1 Event Venue Platform</span>
          </div>

          <h2 className="text-[4rem] xl:text-[4.5rem] font-black text-white leading-[1.05] tracking-tighter mb-6">
            Fill your<br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-rose-400">calendar.</span>
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed mb-14 max-w-105 font-medium">
            Join India&apos;s top venues receiving verified leads and managing their events in one unified platform.
          </p>

          <div className="grid grid-cols-2 gap-5 mb-16">
            {/* Card 1 */}
            <div className="bg-white/2 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
              <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-5 border border-orange-500/20">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-white font-bold mb-1.5 text-base tracking-tight">Verified Leads</h3>
              <p className="text-slate-400 text-sm leading-relaxed">High-quality inquiries from serious customers.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/2 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-5 border border-blue-500/20">
                <ShieldCheck size={24} className="text-blue-400" />
              </div>
              <h3 className="text-white font-bold mb-1.5 text-base tracking-tight">Smart Dashboard</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Manage quotes and bookings effortlessly.</p>
            </div>
          </div>

          <div className="flex items-center gap-5 pt-8 border-t border-white/5">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#0f1218] overflow-hidden"><Image src="https://i.pravatar.cc/100?img=11" alt="User" width={40} height={40} /></div>
              <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-[#0f1218] overflow-hidden"><Image src="https://i.pravatar.cc/100?img=12" alt="User" width={40} height={40} /></div>
              <div className="w-10 h-10 rounded-full bg-slate-600 border-2 border-[#0f1218] overflow-hidden"><Image src="https://i.pravatar.cc/100?img=13" alt="User" width={40} height={40} /></div>
              <div className="w-10 h-10 rounded-full bg-rose-500 border-2 border-[#0f1218] flex items-center justify-center text-[10px] font-bold text-white tracking-tighter">+2k</div>
            </div>
            <div>
              <div className="flex items-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-400 text-xs font-medium">Trusted by top venue owners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 relative items-center">
        {/* Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-pd-pink to-rose-400 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm leading-none">P</span>
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">PartyDial</span>
        </div>

        <div className="w-full max-w-90">
          <div className="mb-8">
            <h1 className="text-[2rem] font-black text-slate-900 tracking-tight mb-2 leading-tight">
              Welcome to <span className="text-pd-pink">PartyDial</span>
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed pr-4">
              Log in to manage your bookings, or create an account to list your property.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center p-1 bg-slate-50 rounded-[14px] mb-8 border border-slate-100 shadow-inner">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={cn(
                "flex-1 py-2 text-sm font-bold rounded-xl transition-all",
                mode === 'signin' ? "bg-white text-slate-900 shadow-sm border border-slate-200/60" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={cn(
                "flex-1 py-2 text-sm font-bold rounded-xl transition-all",
                mode === 'signup' ? "bg-white text-slate-900 shadow-sm border border-slate-200/60" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -5 }}
                  className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold"
                >
                  <ShieldCheck size={16} className="text-red-500 shrink-0" /> 
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1">Email address</label>
              <div className="relative group">
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                  placeholder="hello@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                {mode === 'signin' && (
                  <Link href="/forgot-password" title="Forgot Password" className="text-[11px] font-bold text-slate-400 hover:text-pd-pink transition-colors">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative group">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 pr-11 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all mt-6 shadow-sm",
                mode === 'signin' 
                  ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md" 
                  : "bg-pd-pink text-white hover:bg-pink-500 hover:shadow-md"
              )}
            >
              {isSubmitting ? 'Please wait...' : (mode === 'signin' ? 'Sign In to Dashboard' : 'Create Account')}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-slate-100 flex-1"></div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Or continue with</span>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>

          {/* Social Auth */}
          <button 
            type="button"
            className="w-full h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-[11px] font-medium text-slate-400 mt-8 leading-relaxed">
            By continuing, you agree to PartyDial&apos;s <br/><a href="#" className="text-slate-500 hover:text-slate-800 transition-colors">Terms of Service</a> and <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
