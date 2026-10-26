'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, LogIn, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // 1. Instant check from localStorage
    const localUser = typeof window !== 'undefined' ? (localStorage.getItem('user') || localStorage.getItem('auth_session')) : null;
    if (localUser) {
      setIsLoggedIn(true);
    }

    // 2. Validate/sync with Appwrite active account session
    let isMounted = true;
    import('@/lib/appwrite').then(({ account }) => {
      account.get()
        .then((user) => {
          if (isMounted && user) {
            setIsLoggedIn(true);
            try {
              localStorage.setItem('user', JSON.stringify(user));
            } catch {}
          }
        })
        .catch(() => {
          if (isMounted && !localUser) {
            setIsLoggedIn(false);
          }
        });
    }).catch(() => {});

    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => {
      isMounted = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Our Process', href: '/process' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <header 
      suppressHydrationWarning 
      className={`fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-300 ${
        scrolled ? 'py-3 px-3 sm:px-6' : 'py-5 px-4 sm:px-8'
      }`}
    >
      <nav 
        className={`w-full max-w-6xl h-14 sm:h-16 flex items-center justify-between transition-all duration-300 rounded-2xl sm:rounded-full ${
          scrolled 
            ? 'px-4 sm:px-6 bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)]' 
            : 'px-3 sm:px-4 bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]'
        }`}
      >
        
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <Image 
            src="/logo.png" 
            alt="PartyDial" 
            width={130} 
            height={38} 
            priority
            className="h-7 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
          />
          <div className="h-4 w-px bg-slate-200/80 hidden sm:block"></div>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200/60 text-slate-700">
            <ShieldCheck size={12} className="text-pd-pink" />
            <span className="text-[10px] font-semibold font-poppins uppercase tracking-wider leading-none">
              Partner Hub
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`group relative px-4 py-2 text-xs font-poppins rounded-full transition-all duration-200 ${
                  isActive 
                    ? 'text-pd-pink font-semibold bg-pink-50/80 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-normal'
                }`}
              >
                <span>{item.label}</span>
                {/* Active indicator dot or animated bottom bar */}
                {isActive ? (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-300 group-hover:w-4 opacity-0 group-hover:opacity-100" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right CTA */}
        <div className="hidden md:flex items-center gap-2.5">
          {!isLoggedIn ? (
            <>
              <Link 
                href="/login" 
                className="px-4 py-2 text-xs font-semibold font-poppins text-slate-700 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </Link>
              
              <Link 
                href="/login" 
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold font-poppins text-white shadow-md shadow-pink-500/20 bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 hover:opacity-95 active:scale-98 transition-all cursor-pointer"
              >
                <span>List Venue</span>
                <ArrowRight size={13} />
              </Link>
            </>
          ) : (
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold font-poppins text-white shadow-md bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <LayoutDashboard size={14} className="text-pd-pink" />
              <span>Partner Dashboard</span>
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          aria-label="Toggle navigation menu"
          className="md:hidden w-9 h-9 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 flex items-center justify-center text-slate-700 transition-colors"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-[calc(100%+8px)] left-3 right-3 bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-2xl rounded-3xl overflow-hidden p-5"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold font-poppins text-slate-400 uppercase tracking-widest px-3 mb-1">
                Navigation
              </span>
              
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`px-4 py-3 rounded-2xl text-sm font-poppins flex justify-between items-center transition-colors ${
                      isActive 
                        ? 'bg-pink-50/90 font-semibold text-pd-pink border border-pink-100/80' 
                        : 'text-slate-700 hover:bg-slate-50 font-normal'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={14} className={isActive ? 'text-pd-pink' : 'text-slate-400'} />
                  </Link>
                );
              })}
              
              <div className="w-full h-px bg-slate-100 my-3"></div>
              
              {!isLoggedIn ? (
                <div className="flex flex-col gap-2.5">
                  <Link 
                    href="/login" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="w-full py-3 text-center text-xs font-semibold font-poppins text-slate-700 bg-slate-50 rounded-2xl border border-slate-200/80 hover:bg-slate-100 transition-colors"
                  >
                    Sign In to Portal
                  </Link>
                  <Link 
                    href="/login" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="w-full py-3 flex items-center justify-center gap-2 text-xs font-semibold font-poppins text-white rounded-2xl shadow-md bg-gradient-to-r from-red-500 via-pink-600 to-purple-600"
                  >
                    <span>List Your Venue</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="w-full py-3 flex items-center justify-center gap-2 text-xs font-semibold font-poppins text-white rounded-2xl bg-slate-900"
                >
                  <LayoutDashboard size={15} className="text-pd-pink" />
                  <span>Go to Partner Dashboard</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

