'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
      const serverUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      
      const response = await fetch(`${serverUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSent(true);
      } else {
        setError(result.message || 'Failed to send recovery email. Please try again.');
      }
    } catch (err: any) {
      console.error('Recovery error:', err);
      setError('Connection error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-pd selection:bg-pd-pink selection:text-white relative">
      
      {/* Back to Login Link */}
      <div className="absolute top-8 left-8 z-20">
        <Link href="/login">
          <div className="flex items-center gap-2 group cursor-pointer bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <ArrowLeft size={16} className="text-slate-400 group-hover:text-pd-pink transition-colors" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Back to Login</span>
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
            <div className="w-20 h-20 bg-slate-900 rounded-[24px] flex items-center justify-center text-white mx-auto mb-6 shadow-xl relative overflow-hidden">
               <Image
                src="/partner-icon.jpg"
                alt="Venue Partner"
                width={80}
                height={80}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Lock size={32} className="text-pd-pink" />
              </div>
            </div>
            <h2 className="text-3xl font-[900] text-slate-900 uppercase italic mb-2 tracking-tight">Recover Password</h2>
            <p className="text-sm text-slate-500 font-medium font-pd">
              {isSent 
                ? "Check your email for the recovery link." 
                : "Enter your registered email to reset your password."}
            </p>
          </div>

          {!isSent ? (
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 bg-slate-50 border border-slate-100 rounded-[16px] pl-11 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-pd-pink transition-all outline-none"
                    placeholder="venue@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 pd-btn-primary !rounded-[16px] flex items-center justify-center gap-3 text-sm italic tracking-normal lowercase group shadow-lg shadow-pd-pink/10"
              >
                {isSubmitting ? 'Sending Request...' : 'Send reset link'}
                {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[24px] flex flex-col items-center gap-4 text-emerald-600">
                <CheckCircle2 size={40} className="text-emerald-500" />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest">Recovery Email Sent</p>
                  <p className="text-[11px] font-bold opacity-80">We have sent a password recovery link to <span className="text-emerald-700">{email}</span></p>
                </div>
              </div>
              
              <Link href="/login" className="block">
                <button className="w-full h-14 bg-slate-900 text-white rounded-[16px] flex items-center justify-center gap-3 text-sm italic font-bold tracking-normal lowercase hover:bg-slate-800 transition-all">
                  Return to Login
                </button>
              </Link>
              
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Didn't receive the email? <button onClick={() => setIsSent(false)} className="text-pd-pink hover:underline">Try again</button>
              </p>
            </div>
          )}

          <div className="mt-10 flex items-center justify-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Recovery Process</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
