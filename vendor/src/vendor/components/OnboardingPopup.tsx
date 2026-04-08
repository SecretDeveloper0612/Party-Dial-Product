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

                <motion.h2 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1, duration: 0.6 }}
                   className="text-2xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 leading-tight"
                >
                   Welcome to <br />
                   <span className="pd-gradient-text italic">Your Legacy!</span>
                </motion.h2>
                <motion.p 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2, duration: 0.6 }}
                   className="text-[13px] md:text-sm font-medium text-slate-500 leading-relaxed mb-8 italic max-w-sm mx-auto"
                >
                   Your venue storefront is <span className="text-slate-900 font-black">90% ready</span>. Just a few finishing touches to start reaching over <span className="pd-gradient-text font-black">2,500+ local seekers</span> monthly.
                </motion.p>

                <div className="grid grid-cols-1 gap-3 mb-8">
                   {[
                      { label: 'Polish Your Story', sub: 'Venue description & amenities', icon: <Building2 size={18} />, href: '/dashboard/onboarding/profile', color: 'bg-rose-50 text-rose-500' },
                      { label: 'Curate Your Gallery', sub: 'High-definition venue photos', icon: <ImageIcon size={18} />, href: '/dashboard/onboarding/photos', color: 'bg-blue-50 text-blue-500' },
                      { label: 'Set Your Prestige', sub: 'Dynamic pricing for all events', icon: <IndianRupee size={18} />, href: '/dashboard/onboarding/pricing', color: 'bg-emerald-50 text-emerald-500' }
                   ].map((item, idx) => (
                      <Link 
                        key={idx} 
                        href={item.href}
                        onClick={onClose}
                        className="block group"
                      >
                        <motion.div 
                          whileHover={{ x: 5, backgroundColor: 'rgba(241, 245, 249, 0.8)' }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-[24px] border border-slate-100/60 hover:border-pd-pink/30 hover:shadow-lg hover:shadow-pd-pink/5 transition-all text-left"
                        >
                           <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                              {item.icon}
                           </div>
                           <div className="flex-1">
                              <h4 className="text-[11px] md:text-[12px] font-black uppercase tracking-widest text-slate-900 leading-none mb-1.5 group-hover:text-pd-pink transition-colors">{item.label}</h4>
                              <p className="text-[10px] md:text-[11px] font-bold text-slate-400 italic leading-none">{item.sub}</p>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-pd-pink group-hover:text-white transition-all transform group-hover:rotate-45">
                              <ChevronRight size={14} />
                           </div>
                        </motion.div>
                      </Link>
                   ))}
                </div>

                <div className="flex flex-col gap-3">
                   <Link href="/dashboard/onboarding/profile" onClick={onClose} className="w-full">
                      <button className="pd-btn-primary w-full py-5 rounded-[22px] text-[11px] font-black uppercase tracking-[0.2em] italic shadow-2xl shadow-pd-pink/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                         <Sparkle size={16} fill="white" />
                         Ignite My Storefront
                      </button>
                   </Link>

                   <button 
                      onClick={onClose}
                      className="py-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-all italic"
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
