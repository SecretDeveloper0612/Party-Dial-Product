'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Chrome,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      
      {/* LEFT SIDE: VISUAL BANNER (HIDDEN ON MOBILE) */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-1/2 relative bg-slate-900 border-r border-slate-100"
      >
        <Image 
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200"
          alt="Luxury Venue"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-pd-purple/40 to-pd-pink/40 mix-blend-multiply"></div>
        
        <div className="relative z-10 w-full p-16 flex flex-col justify-between text-white">
          <Link href="/" className="flex items-center gap-2 group text-white/80 hover:text-white transition-colors">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest italic">Partydial</span>
          </Link>

          <div>
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-6xl font-black mb-8 leading-[1.1]"
             >
               Welcome Back – <br/>
               <span className="text-pd-pink italic">Find the Perfect</span><br/>
               Venue for Your Event.
             </motion.h1>
             
             <div className="flex gap-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex-1 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                    <CheckCircle2 size={24} className="text-pd-red mb-4" />
                    <p className="text-xs font-black uppercase tracking-wider opacity-80">
                      {i === 1 ? '1000+ Venues' : i === 2 ? 'Direct Rates' : 'Instant Booking'}
                    </p>
                 </div>
               ))}
             </div>
          </div>

          <p className="text-sm font-bold opacity-60">© 2026 PartyDial. All rights reserved.</p>
        </div>
      </motion.div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-12 relative">
        <div className="lg:hidden absolute top-8 left-8">
           <Link href="/" className="text-pd-red font-black text-xl italic italic">PartyDial</Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Sign In</h2>
            <p className="text-slate-500 font-semibold tracking-tight">Access your dashboard to manage bookings and enquiries.</p>
          </div>

          {/* SOCIAL LOGIN */}
          <button className="w-full h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-black text-slate-700 text-xs uppercase tracking-widest mb-8 active:scale-95">
             <Chrome size={20} className="text-pd-purple" />
             Continue with Google
          </button>

          <div className="relative mb-8">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
             <div className="relative flex justify-center text-xs uppercase font-black text-slate-300 tracking-[0.2em]">
                <span className="bg-white px-4 italic">Or use email instead</span>
             </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-purple transition-colors">
                   <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-pd-purple transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                 <Link href="/forgot-password" className="text-[10px] font-black text-pd-purple uppercase tracking-widest hover:text-pd-red">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-purple transition-colors">
                   <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full h-14 pl-14 pr-14 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-pd-purple transition-all"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-2">
               <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-pd-purple focus:ring-pd-purple" id="remember" />
               <label htmlFor="remember" className="text-xs font-bold text-slate-500 cursor-pointer">Remember me for 30 days</label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-16 bg-gradient-to-r from-pd-purple to-pd-pink text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-pd-purple/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
            >
               {isLoading ? (
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                   className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                 />
               ) : (
                 <>Sign In <ArrowRight size={18} /></>
               )}
            </button>
          </form>

          <p className="mt-12 text-center text-sm font-semibold text-slate-400">
            Don't have an account? {' '}
            <Link href="/signup" className="text-pd-red font-black uppercase tracking-widest text-[11px] ml-2 hover:underline">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
