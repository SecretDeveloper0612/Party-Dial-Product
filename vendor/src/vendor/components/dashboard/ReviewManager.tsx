'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, User } from 'lucide-react';

interface ReviewManagerProps {
  setReplyTarget: (target: any) => void;
  replyTarget: any;
}

const ReviewManager = ({ setReplyTarget, replyTarget }: ReviewManagerProps) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 relative">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight mb-2">Customer Reviews</h1>
          <p className="text-sm font-medium text-slate-500">Manage your reputation and interact with your customers.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1 text-amber-500 font-black italic">
              <Star size={20} fill="currentColor" />
              <span className="text-2xl">4.8</span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1 mt-1">/ 5.0</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {[1,2,3].map(i => (
           <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-pd-soft hover:border-pd-pink transition-all">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=user${i}`} alt="User" />
                 </div>
                 <div>
                    <h4 className="text-sm font-black italic text-slate-900">Rahul Saxena</h4>
                    <p className="text-[10px] text-slate-400 font-bold">2 days ago</p>
                 </div>
                 <div className="ml-auto flex items-center gap-0.5 text-amber-500">
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                 </div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed italic mb-6">
                 &ldquo;The Imperial Grand hall was absolutely stunning for our wedding. The staff was incredibly professional...&rdquo;
              </p>
              <button 
                 onClick={() => setReplyTarget({ id: i, name: 'Rahul Saxena', text: 'The Imperial Grand hall was absolutely stunning for our wedding. The staff was incredibly professional...' })}
                 className="text-[10px] font-black uppercase tracking-[0.2em] text-pd-pink hover:underline"
              >
                 Reply to review
              </button>
           </div>
         ))}
      </div>

      <AnimatePresence>
        {replyTarget && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
             {/* Backdrop */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setReplyTarget(null)}
               className="absolute inset-0 bg-slate-900/40"
             />
             
             {/* Content Modal */}
             <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className="bg-white w-full max-w-xl rounded-[40px] md:rounded-[50px] shadow-xl overflow-hidden relative z-10"
                style={{ willChange: 'transform, opacity' }}
             >
                <div className="p-8 md:p-12">
                   <div className="flex items-center justify-between mb-8 md:mb-10">
                      <div>
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pd-pink mb-2 block">Vendor Portal</span>
                         <h3 className="text-2xl md:text-3xl font-black italic uppercase text-slate-900 leading-none">Review Response</h3>
                      </div>
                      <button 
                        onClick={() => setReplyTarget(null)} 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all border border-slate-100"
                      >
                         <X size={20} />
                      </button>
                   </div>

                   <div className="bg-slate-50/50 p-6 md:p-8 rounded-[30px] md:rounded-[40px] mb-8 md:mb-10 border border-slate-100 relative overflow-hidden group">
                      <div className="flex items-center gap-4 mb-4 relative z-10 font-pd">
                         <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300">
                           <User size={18} />
                         </div>
                         <span className="text-sm font-black italic text-slate-900 uppercase">{replyTarget.name}</span>
                      </div>
                      <p className="text-[11px] md:text-xs text-slate-500 italic font-medium leading-relaxed relative z-10">&ldquo;{replyTarget.text}&rdquo;</p>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100/30 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Draft</label>
                         <div className="flex items-center gap-1.5">
                           <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[9px] font-black uppercase text-emerald-500 italic">Auto-Saving</span>
                         </div>
                      </div>
                      <textarea 
                         placeholder="Acknowledge their feedback..."
                         className="w-full bg-slate-50 border-2 border-transparent focus:border-pd-pink rounded-[30px] md:rounded-[35px] p-6 md:p-8 min-h-[160px] md:min-h-[180px] text-sm font-medium italic outline-none transition-all placeholder:text-slate-300 shadow-inner"
                      />
                   </div>

                   <div className="flex gap-4 mt-10 md:mt-12">
                      <button onClick={() => setReplyTarget(null)} className="flex-1 py-4 md:py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Cancel</button>
                      <button onClick={() => setReplyTarget(null)} className="flex-1 pd-btn-primary py-4 md:py-5 rounded-2xl uppercase text-[11px] font-black italic shadow-xl shadow-pd-pink/20">Submit Reply</button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(ReviewManager);
