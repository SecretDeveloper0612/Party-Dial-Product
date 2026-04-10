'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  X, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck,
  Zap,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PaymentReminderPopupProps {
  isOpen: boolean;
  onClose: () => void;
  venueName?: string;
}

const PaymentReminderPopup: React.FC<PaymentReminderPopupProps> = ({ isOpen, onClose, venueName }) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 p-12 -mt-20 -mr-20">
            <div className="w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-60" />
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all z-10"
          >
            <X size={20} />
          </button>

          <div className="p-10 relative z-10">
            <header className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-amber-50 rounded-[24px] flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm relative">
                  <AlertCircle size={32} />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 italic block mb-1">Action Required</span>
                  <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Payment Pending</h2>
                </div>
              </div>
              
              <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100/50 mb-4">
                <p className="text-slate-600 font-medium italic leading-relaxed sm:text-base text-sm">
                  Hey{venueName ? ` ${venueName}` : ''}! Your onboarding is complete, but your account is <span className="text-slate-900 font-bold underline decoration-pd-pink underline-offset-4">not yet active</span>. Complete the payment to start receiving leads.
                </p>
              </div>
            </header>

            <div className="space-y-6 mb-10">
              <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[35px] text-white shadow-xl relative overflow-hidden group">
                {/* Micro-animation sparkles */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                  <Sparkles className="absolute top-4 right-6 text-white" size={24} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Subscription Plan</p>
                      <h3 className="text-2xl font-black italic uppercase tracking-tight">Introductory Pack</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Due</p>
                      <p className="text-3xl font-black italic text-pd-pink">₹11.00</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                        <Zap size={16} className="text-pd-pink" />
                      </div>
                      <span className="text-xs font-bold italic text-white/80">Valid Until 30 April</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                        <ShieldCheck size={16} className="text-emerald-400" />
                      </div>
                      <span className="text-xs font-bold italic text-white/80">Full Platform</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
                <Clock size={16} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Purchase Deadline: 20 April. Plan valid until 30 April.</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  router.push('/dashboard/onboarding/subscription');
                  onClose();
                }}
                className="w-full h-16 bg-slate-900 text-white rounded-[22px] text-xs font-black uppercase tracking-[0.3em] italic hover:bg-pd-pink transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 group"
              >
                Pay Now & Activate
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={onClose}
                className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors italic"
              >
                Remind me later
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-4 text-slate-400">
              <div className="flex items-center gap-1.5 grayscale opacity-50">
                <CreditCard size={14} />
                <span className="text-[9px] font-black uppercase tracking-tighter italic">Secure Checkout</span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <div className="flex items-center gap-1.5 grayscale opacity-50">
                <ShieldCheck size={14} />
                <span className="text-[9px] font-black uppercase tracking-tighter italic">SSL Encrypted</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentReminderPopup;
