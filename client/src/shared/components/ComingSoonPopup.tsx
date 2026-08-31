'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function ComingSoonPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-coming-soon', handleOpen);
    return () => window.removeEventListener('open-coming-soon', handleOpen);
  }, []);

  const closePopup = useCallback(() => setIsOpen(false), []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="fixed inset-0 bg-slate-950/70 cursor-pointer backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 w-full h-1.5 pd-gradient" />
            
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="p-8 text-center flex flex-col items-center">
              <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                Coming Soon
              </h3>
              
              <p className="text-slate-500 font-medium leading-relaxed">
                We&apos;re working hard to bring this feature to you. Stay tuned for exciting updates!
              </p>

              <button
                onClick={closePopup}
                className="mt-8 w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
