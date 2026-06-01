'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, LogIn, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('auth_session'));
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header suppressHydrationWarning className={`fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-500 ${scrolled ? 'py-4 px-4' : 'py-6 px-6'}`}>
      <nav className={`w-full max-w-[1200px] h-16 flex items-center justify-between transition-all duration-500 ${scrolled ? 'px-6 bg-white/70 backdrop-blur-2xl shadow-[0_20px_80px_-15px_rgba(0,0,0,0.1)] rounded-[2rem]' : 'bg-transparent px-2'}`}>
        
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-3 group relative">
          <Image 
            src="/logo.png" 
            alt="PartyDial" 
            width={130} 
            height={38} 
            className="h-8 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="h-5 w-[1px] bg-slate-200 hidden sm:block"></div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-pd-blue/5 border border-pd-blue/10 group-hover:bg-pd-blue/10 transition-colors">
            <ShieldCheck size={12} className="text-pd-blue" />
            <span className="text-pd-blue text-[9px] font-black uppercase tracking-widest leading-none">
              Partner Hub
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 pl-4">
          {[
            { label: 'Our Process', href: '/process' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Contact', href: '/contact' }
          ].map((item, i) => (
            <Link 
              key={i}
              href={item.href} 
              className="relative px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors group/link"
            >
              {item.label}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-pd-pink rounded-full transition-all duration-300 group-hover/link:w-1/2 opacity-0 group-hover/link:opacity-100"></div>
            </Link>
          ))}
          
          <div className="w-[1px] h-4 bg-slate-200 mx-2"></div>
          
          {!isLoggedIn ? (
            <div className="flex items-center gap-3 ml-2">
              <Link href="/login" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all flex items-center gap-2 group">
                <LogIn size={14} className="group-hover:-translate-y-0.5 transition-transform" /> Sign In
              </Link>
              <Link href="/signup" className="relative group/btn overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-slate-900 group-hover/btn:bg-pd-pink transition-colors duration-500"></div>
                <div className="relative z-10 px-6 py-2.5 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={12} className="text-amber-300" />
                  List Venue <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          ) : (
            <Link href="/dashboard" className="relative group/btn overflow-hidden rounded-full ml-2">
               <div className="absolute inset-0 bg-pd-blue group-hover/btn:bg-slate-900 transition-colors duration-500"></div>
               <div className="relative z-10 px-6 py-2.5 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <LayoutDashboard size={14} /> Partner Dashboard
               </div>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative z-50">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-[calc(100%+10px)] left-4 right-4 bg-white/90 backdrop-blur-2xl border border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] rounded-[2rem] overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-2">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-4">Navigation</div>
              {[
                { label: 'Our Process', href: '/process' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Contact', href: '/contact' }
              ].map((item, i) => (
                <Link key={i} href={item.href} onClick={() => setIsMenuOpen(false)} className="px-4 py-4 text-sm font-black uppercase tracking-widest text-slate-800 hover:bg-slate-50 rounded-2xl transition-colors flex justify-between items-center group">
                  {item.label}
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-pd-pink group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
              
              <div className="w-full h-[1px] bg-slate-100 my-4"></div>
              
              {!isLoggedIn ? (
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center text-[11px] font-black uppercase tracking-widest text-slate-700 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors">Sign In</Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="relative group w-full overflow-hidden rounded-2xl">
                     <div className="absolute inset-0 bg-slate-900 group-hover:bg-pd-pink transition-colors duration-500"></div>
                     <div className="relative z-10 py-4 w-full flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-white">
                        <Sparkles size={14} className="text-amber-300" /> List Your Venue
                     </div>
                  </Link>
                </div>
              ) : (
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="relative group w-full overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-pd-blue group-hover:bg-slate-900 transition-colors duration-500"></div>
                  <div className="relative z-10 py-4 w-full flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-white">
                     <LayoutDashboard size={16} /> Go to Dashboard
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
