"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { account } from '@/lib/appwrite';
import Link from 'next/link';
import Image from 'next/image';

import { Suspense } from 'react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(!userId || !secret ? 'Invalid or expired password reset link.' : '');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !secret) return;
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await account.updateRecovery(userId, secret, password);
      // Success! Redirect to home with a flag to open the login modal
      router.push('/?login=true');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/logo-nav.png" alt="PartyDial" width={140} height={40} className="mx-auto mb-8 object-contain" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Set new password</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Please enter your new password below.
          </p>
        </div>

        {(!userId || !secret) ? (
          <div className="text-center">
            <p className="text-red-500 text-sm font-semibold mb-6">{error}</p>
            <Link href="/" className="text-blue-500 font-semibold hover:underline">
              Return to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">New Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 focus:bg-white transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Confirm Password</label>
              <input 
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 focus:bg-white transition-all"
              />
            </div>

            {error && <p className="text-xs text-red-500 font-bold text-center mt-2">{error}</p>}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-14 mt-4 bg-slate-900 hover:bg-black text-white rounded-xl font-semibold text-base shadow-md flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
