'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Sparkles, Send, CheckCircle2, Ticket } from 'lucide-react';

const QuickSupport = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description) return;
    
    setIsSubmitting(true);
    // Simulate API call to create ticket
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setCategory('');
      setDescription('');
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }} 
      className="w-full max-w-5xl mx-auto space-y-8"
    >
       {/* Premium Header */}
       <div className="relative rounded-[2.5rem] p-10 md:p-14 overflow-hidden border border-white/10 shadow-2xl shadow-pd-purple/20">
          <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900" />
          
          <div className="absolute top-0 right-0 w-125 h-125 bg-linear-to-bl from-pd-pink/30 to-purple-600/30 blur-[100px] rounded-full pointer-events-none -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-100 h-100 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none -ml-40 -mb-40" />

          <div className="relative z-10 max-w-2xl">
             <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
               className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-pd-pink mb-8 backdrop-blur-md border border-white/20 shadow-inner"
             >
                <Headphones size={32} />
             </motion.div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white drop-shadow-sm flex items-center gap-3">
                Partner Support Center <Sparkles className="text-amber-400" size={28} />
             </h1>
             <p className="text-slate-300 font-medium text-lg max-w-lg leading-relaxed">
                Experience priority assistance. Raise a ticket describing your issue, and our team will resolve it promptly.
             </p>
          </div>
       </div>
       
       {/* Ticket System */}
       <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-pd-soft">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
             <div className="w-14 h-14 bg-pd-purple/5 text-pd-purple rounded-2xl flex items-center justify-center">
                <Ticket size={28} />
             </div>
             <div>
                <h3 className="text-2xl font-black text-slate-900">Raise a Ticket</h3>
                <p className="text-slate-500 font-medium mt-1">Submit your problem and track its resolution.</p>
             </div>
          </div>
          
          {isSuccess ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center justify-center py-12 text-center"
             >
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                   <CheckCircle2 size={40} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-2">Ticket Submitted!</h4>
                <p className="text-slate-500 max-w-md mx-auto">Your support ticket has been raised successfully. Our team will review the issue and contact you within 24 hours.</p>
             </motion.div>
          ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Issue Category</label>
                   <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pd-purple/20 focus:border-pd-purple/40 transition-all font-medium text-slate-700 appearance-none"
                   >
                      <option value="" disabled>Select the type of problem...</option>
                      <option value="profile">Profile & Listing Updates</option>
                      <option value="billing">Billing & Subscriptions</option>
                      <option value="leads">Lead Discrepancies</option>
                      <option value="technical">Technical Glitches</option>
                      <option value="other">Other Issues</option>
                   </select>
                </div>
                
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                   <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      placeholder="Please describe your issue in detail so we can help you faster..."
                      rows={5}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pd-purple/20 focus:border-pd-purple/40 transition-all font-medium text-slate-700 resize-none"
                   />
                </div>
                
                <div className="pt-2">
                   <button 
                      type="submit" 
                      disabled={isSubmitting || !category || !description}
                      className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-pd-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-slate-900/10"
                   >
                      {isSubmitting ? (
                         <>Processing...</>
                      ) : (
                         <>
                            Submit Ticket <Send size={18} />
                         </>
                      )}
                   </button>
                </div>
             </form>
          )}
       </div>

    </motion.div>
  );
};

export default React.memo(QuickSupport);
