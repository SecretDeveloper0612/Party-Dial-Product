'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
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
    } catch (err: any) {
      console.error('Reset error:', err);
      setError('Connection error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[32px] flex flex-col items-center gap-4 text-emerald-600">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black uppercase tracking-tight">Password Reset Successful</h3>
            <p className="text-sm font-medium opacity-80">Your password has been updated. You can now login with your new credentials.</p>
          </div>
        </div>
        
        <Link href="/login" className="block">
          <button className="w-full h-14 pd-btn-primary !rounded-[16px] flex items-center justify-center gap-3 text-sm italic tracking-normal lowercase shadow-lg shadow-pd-pink/10">
            Go to Login
            <ArrowRight size={18} />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-100 p-3 rounded-[12px] flex items-center gap-2 text-red-600 text-[11px] font-bold">
          <ShieldCheck size={16} className="text-red-500" /> {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">New Password</label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
            <Lock size={16} />
          </div>
          <input
            required
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Confirm New Password</label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors">
            <Lock size={16} />
          </div>
          <input
            required
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-12 bg-slate-50 border border-slate-100 rounded-[16px] pl-11 pr-11 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !userId || !secret}
        className="w-full h-14 pd-btn-primary !rounded-[16px] flex items-center justify-center gap-3 text-sm italic tracking-normal lowercase group shadow-lg shadow-pd-pink/10 disabled:opacity-50"
      >
        {isSubmitting ? 'Updating Password...' : 'Reset Password'}
        {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
      </button>

      {(!userId || !secret) && (
        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2">
          Expired link? <Link href="/forgot-password" className="text-pd-pink hover:underline">Request new link</Link>
        </p>
      )}
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-pd selection:bg-pd-pink selection:text-white relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px]"
      >
        <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-pd-strong border border-slate-100 mb-8 relative overflow-hidden">
          <div className="mb-10 text-center">
            <div className="w-20 h-20 bg-slate-900 rounded-[24px] flex items-center justify-center text-white mx-auto mb-6 shadow-xl relative overflow-hidden">
              <Image
                src="/partner-icon.jpg"
                alt="Venue Partner"
                width={80}
                height={80}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center text-pd-pink">
                <ShieldCheck size={32} />
              </div>
            </div>
            <h2 className="text-3xl font-[900] text-slate-900 uppercase italic mb-2 tracking-tight">Set New Password</h2>
            <p className="text-sm text-slate-500 font-medium font-pd">Secure your account with a strong password.</p>
          </div>

          <Suspense fallback={<div className="text-center py-10 font-bold text-slate-400 animate-pulse lowercase italic">Loading reset form...</div>}>
            <ResetPasswordForm />
          </Suspense>

          <div className="mt-10 flex items-center justify-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Reset Process</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
