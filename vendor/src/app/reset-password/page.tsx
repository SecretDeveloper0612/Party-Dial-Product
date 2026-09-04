'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Key
} from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret') || searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!userId || !secret) {
      setError('Invalid or expired reset link. Please request a new one.');
    }
  }, [userId, secret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
      const serverUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

      const response = await fetch(`${serverUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token: secret, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(result.message || 'Failed to reset password. The link might be expired.');
      }
    } catch (err: unknown) {
      console.error('Reset error:', err);
      setError('Connection error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={32} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">
            Password Reset Successful
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            Your password has been securely updated. You can now login with your new credentials.
          </p>
        </div>
        <Link href="/login" className="block mt-6">
          <button className="w-full h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-bold transition-all shadow-sm cursor-pointer">
            Go to Login
          </button>
        </Link>
      </div>
    );
  }

  return (
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
        <label className="text-xs font-bold text-slate-700 ml-1">New Password</label>
        <div className="relative group">
          <input
            required
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 pr-11 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none shadow-sm placeholder:text-slate-400"
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

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 ml-1">Confirm New Password</label>
        <div className="relative group">
          <input
            required
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 pr-11 text-sm font-medium text-slate-900 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 transition-all outline-none shadow-sm placeholder:text-slate-400"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !userId || !secret}
        className="w-full h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-2 text-sm font-bold transition-all mt-6 shadow-sm disabled:opacity-50"
      >
        {isSubmitting ? 'Updating Password...' : 'Reset Password'}
      </button>

      {(!userId || !secret) && (
        <p className="text-center text-[11px] font-medium text-slate-400 mt-4 leading-relaxed">
          Expired link? <Link href="/login" className="text-pd-pink hover:underline">Go to Login</Link>
        </p>
      )}
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex font-pd selection:bg-pd-pink selection:text-white bg-white">
      {/* Left Section - Marketing */}
      <div className="hidden lg:flex w-[55%] bg-[#0f1218] relative overflow-hidden flex-col justify-center p-16 xl:p-24">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-135">
          <h2 className="text-[4rem] xl:text-[4.5rem] font-black text-white leading-[1.05] tracking-tighter mb-6">
            Secure your<br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400">account.</span>
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed mb-14 max-w-105 font-medium">
            Keep your venue&apos;s data protected with a strong password. We use industry-standard encryption to ensure your peace of mind.
          </p>

          <div className="grid grid-cols-2 gap-5 mb-16">
            <div className="bg-white/2 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-5 border border-emerald-500/20">
                <ShieldCheck size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-white font-bold mb-1.5 text-base tracking-tight">Encrypted Storage</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Your data is always encrypted and secure.</p>
            </div>

            <div className="bg-white/2 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-5 border border-blue-500/20">
                <Key size={24} className="text-blue-400" />
              </div>
              <h3 className="text-white font-bold mb-1.5 text-base tracking-tight">Full Control</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Manage your credentials with ease.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 relative items-center">
        {/* Logo */}
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-pd-pink to-rose-400 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm leading-none">P</span>
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">PartyDial</span>
        </Link>

        <div className="w-full max-w-90">
          <div className="mb-8">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <Key size={24} />
            </div>
            <h1 className="text-[2rem] font-black text-slate-900 tracking-tight mb-2 leading-tight">
              Reset Password
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed pr-4">
              Enter a new password below to regain access to your PartyDial partner account.
            </p>
          </div>

          <Suspense fallback={<div className="h-40 flex items-center justify-center text-sm font-medium text-slate-400 animate-pulse">Loading reset form...</div>}>
            <ResetPasswordForm />
          </Suspense>

          <p className="text-center text-[11px] font-medium text-slate-400 mt-8 leading-relaxed">
            Need help? Contact <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors">Partner Support</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
