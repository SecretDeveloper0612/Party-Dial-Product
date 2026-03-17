'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutDashboard, UserPlus, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <nav className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-black text-slate-900 italic">
            PartyDial <span className="text-pd-red text-sm uppercase tracking-widest not-italic ml-1">Partner</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="#benefits" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-pd-red transition-colors">Benefits</Link>
          <Link href="#how-it-works" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-pd-red transition-colors">How it Works</Link>
          <Link href="#plans" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-pd-red transition-colors">Pricing</Link>
          <div className="w-[1px] h-4 bg-slate-200"></div>
          <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-700 hover:text-pd-red transition-all">
            <LogIn size={16} /> Sign In
          </button>
          <button className="pd-btn-primary !py-3 !px-6 !text-[10px] uppercase tracking-widest italic flex items-center gap-2">
            <UserPlus size={16} /> Register Venue
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
        >
          <div className="p-6 space-y-6">
            <Link href="#benefits" onClick={() => setIsMenuOpen(false)} className="block text-sm font-black uppercase tracking-widest text-slate-700">Benefits</Link>
            <Link href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="block text-sm font-black uppercase tracking-widest text-slate-700">How it Works</Link>
            <Link href="#plans" onClick={() => setIsMenuOpen(false)} className="block text-sm font-black uppercase tracking-widest text-slate-700">Pricing</Link>
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <button className="w-full py-4 text-center font-black uppercase tracking-widest text-slate-700 bg-slate-50 rounded-xl">Sign In</button>
              <button className="w-full pd-btn-primary py-4">Register Venue</button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
