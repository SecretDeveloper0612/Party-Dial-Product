'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkle, 
  Star, 
  Building2, 
  ImageIcon, 
  IndianRupee, 
  ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

interface OnboardingPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingPopup = ({ isOpen, onClose }: OnboardingPopupProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 isolation-isolate"
          style={{ isolation: 'isolate' }}
        >
          {/* Backdrop - NO BLUR for maximum performance */}
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 bg-[#0F172ACC] pointer-events-auto"
             onClick={onClose}
             style={{ willChange: 'opacity' }}
          />
          
          {/* Modal Container */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98, y: 10 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.98, y: 5 }}
             transition={{ 
                duration: 0.25, 
                ease: [0.23, 1, 0.32, 1] // Power4.easeOut equivalent
             }}
             className="relative w-full max-w-[560px] bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto z-10"
             style={{ 
                willChange: 'transform, opacity', 
                transform: 'translate3d(0,0,0)', 
                backfaceVisibility: 'hidden',
                contain: 'content'
             }}
          >
             {/* Simple Gradient Bar */}
             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pd-pink via-purple-500 to-pd-pink" />
             
             <button 
                onClick={onClose}
                className="absolute top-5 right-5 md:top-7 md:right-7 w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all z-20 border border-slate-100"
             >
                <X size={20} />
             </button>

             <div className="p-8 md:p-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-pd-pink/10 rounded-[28px] flex items-center justify-center text-pd-pink mx-auto mb-6 md:mb-8 relative group">
                   {/* Static decoration instead of ping for performance */}
                   <div className="absolute inset-0 rounded-[28px] border border-pd-pink/20 scale-110"></div>
                   <Sparkle size={32} fill="currentColor" />
                   <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-lg shadow-md border border-slate-50 flex items-center justify-center">
                      <Star size={10} fill="#FF5DA4" className="text-pd-pink" />
                   </div>
                </div>

                <h2 className="text-2xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 leading-tight">
                   Welcome to <br />
                   <span className="pd-gradient-text italic">Your Legacy!</span>
                </h2>
                <p className="text-[13px] md:text-sm font-medium text-slate-500 leading-relaxed mb-8 italic max-w-sm mx-auto">
                   Your venue storefront is <span className="text-slate-900 font-black">90% ready</span>. Just a few finishing touches to start reaching over <span className="pd-gradient-text font-black">2,500+ local seekers</span> monthly.
                </p>

                <div className="grid grid-cols-1 gap-2.5 mb-8">
                   {[
                      { label: 'Polish Your Story', sub: 'Venue description & amenities', icon: <Building2 className="text-pd-pink" size={16} /> },
                      { label: 'Curate Your Gallery', sub: 'High-definition venue photos', icon: <ImageIcon className="text-blue-500" size={16} /> },
                      { label: 'Set Your Prestige', sub: 'Dynamic pricing for all events', icon: <IndianRupee className="text-emerald-500" size={16} /> }
                   ].map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-4 p-3.5 bg-slate-50/50 rounded-[24px] border border-slate-100/60 hover:border-pd-pink/20 transition-all text-left group cursor-pointer"
                      >
                         <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-pd-pink group-hover:text-white transition-all">
                            {item.icon}
                         </div>
                         <div className="flex-1">
                            <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-900 leading-none mb-1 group-hover:text-pd-pink transition-colors">{item.label}</h4>
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 italic">{item.sub}</p>
                         </div>
                         <ChevronRight size={14} className="text-slate-300 group-hover:text-pd-pink group-hover:translate-x-1 transition-all" />
                      </div>
                   ))}
                </div>

                <div className="flex flex-col gap-3">
                   <Link href="/dashboard/onboarding/profile" onClick={onClose} className="w-full">
                      <button className="pd-btn-primary w-full py-4.5 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] italic shadow-xl shadow-pd-pink/20 hover:scale-[1.01] active:scale-95 transition-all">
                         Ignite My Storefront
                      </button>
                   </Link>

                   <button 
                      onClick={onClose}
                      className="py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all italic"
                   >
                      Skip for later
                   </button>
                </div>
             </div>

             {/* Optimized Progress Bar using scaleX (Hardware Accelerated) */}
             <div className="h-1.5 w-full bg-slate-50 relative overflow-hidden">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 0.35 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="absolute inset-0 bg-pd-pink shadow-[0_0_10px_rgba(255,93,164,0.3)] origin-left"
                  style={{ willChange: 'transform' }}
                 />
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(OnboardingPopup);
