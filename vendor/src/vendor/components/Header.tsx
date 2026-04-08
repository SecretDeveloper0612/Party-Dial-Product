'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, UserPlus, LogIn, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('auth_session'));
  }, []);

  return (
    <header suppressHydrationWarning className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <nav className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="PartyDial" 
            width={140} 
            height={42} 
            className="h-10 w-auto object-contain" 
          />
          <div className="h-6 w-[1.5px] bg-slate-200 ml-1"></div>
          <span className="text-pd-red text-xs font-black uppercase tracking-widest leading-none">
            Partner
          </span>
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/process" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-pd-red transition-colors">Our Process</Link>
          <Link href="/pricing" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-pd-red transition-colors">Pricing</Link>
          <Link href="/contact" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-pd-red transition-colors">Contact</Link>
          <div className="w-[1px] h-4 bg-slate-200 ml-2 mr-2"></div>
          
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-700 hover:text-pd-red transition-all">
                <LogIn size={16} /> Sign In
              </Link>
              <Link href="/signup" className="pd-btn-primary !py-3 !px-6 !text-[10px] uppercase tracking-widest italic flex items-center gap-2">
                Register Venue
              </Link>
            </>
          ) : (
            <Link href="/dashboard" className="pd-btn-primary !py-3 !px-8 !text-[10px] uppercase tracking-widest italic flex items-center gap-2 bg-[#0F172A] border-[#0F172A] shadow-xl shadow-slate-900/10">
               <LayoutDashboard size={16} /> Partner Dashboard
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <Link href="/process" onClick={() => setIsMenuOpen(false)} className="block text-sm font-black uppercase tracking-widest text-slate-700">Our Process</Link>
              <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="block text-sm font-black uppercase tracking-widest text-slate-700">Pricing</Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="block text-sm font-black uppercase tracking-widest text-slate-700">Contact</Link>
              <div className="pt-6 border-t border-slate-100 space-y-4">
                {!isLoggedIn ? (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full block py-4 text-center font-black uppercase tracking-widest text-slate-700 bg-slate-50 rounded-xl">Sign In</Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="w-full block pd-btn-primary py-4 text-center">Register Venue</Link>
                  </>
                ) : (
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="w-full block bg-[#0F172A] text-white py-5 text-center font-black uppercase tracking-widest rounded-2xl italic text-xs shadow-xl">
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
