'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, User, MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface ReviewManagerProps {
  venueId?: string;
  setReplyTarget: (target: any) => void;
  replyTarget: any;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const ReviewManager = ({ venueId, setReplyTarget, replyTarget, showToast }: ReviewManagerProps) => {
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [replyText, setReplyText] = React.useState('');
  const [isSubmittingReply, setIsSubmittingReply] = React.useState(false);

  const fetchReviews = React.useCallback(async () => {
    if (!venueId) return;
    setIsLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
      const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
      const response = await fetch(`${baseUrl}/venues/${venueId}/reviews`);
      const result = await response.json();
      if (result.status === 'success') {
        setReviews(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setIsLoading(false);
    }
  }, [venueId]);

  React.useEffect(() => {
    fetchReviews();
    
    // REAL-TIME SUBSCRIPTION
    let unsubscribe: (() => void) | undefined;
    
    const setupRealtime = async () => {
      try {
        const { client, DATABASE_ID, REVIEWS_COLLECTION_ID } = await import('@/lib/appwrite');
        
        unsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.collections.${REVIEWS_COLLECTION_ID}.documents`,
          (response) => {
            const doc = response.payload as any;
            if (doc.venueId === venueId) {
              if (response.events.some(e => e.includes('create'))) {
                setReviews(prev => {
                  if (prev.some(r => r.$id === doc.$id)) return prev;
                  return [doc, ...prev];
                });
              } else if (response.events.some(e => e.includes('update'))) {
                setReviews(prev => prev.map(r => r.$id === doc.$id ? doc : r));
              } else if (response.events.some(e => e.includes('delete'))) {
                setReviews(prev => prev.filter(r => r.$id !== doc.$id));
              }
            }
          }
        );
      } catch (err) {
        console.error('Realtime setup failed:', err);
      }
    };

    if (venueId) {
      setupRealtime();
    }
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchReviews, venueId]);

  const handleReplySubmit = async () => {
    if (!replyTarget || !replyText.trim()) return;
    setIsSubmittingReply(true);
    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
      const baseUrl = base.endsWith('/api') ? base : `${base}/api`;
      const response = await fetch(`${baseUrl}/venues/reviews/${replyTarget.$id}/reply`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply: replyText }),
      });
      const result = await response.json();
      if (result.status === 'success') {
        setReviews(prev => prev.map(r => r.$id === replyTarget.$id ? { ...r, vendorReply: replyText } : r));
        setReplyTarget(null);
        setReplyText('');
        showToast('Reply submitted successfully!', 'success');
      }
    } catch (err) {
      console.error('Failed to submit reply:', err);
      showToast('Failed to submit reply. Please try again.', 'error');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Premium Header */}
      <div className="relative bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden group">
         {/* Subtle glowing accent */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-amber-400/10 via-pd-pink/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Customer Reviews</h1>
               <p className="text-sm font-medium text-slate-500">Manage your venue's reputation and engage with clients</p>
            </div>
            
            <div className="flex items-center gap-5 bg-white border border-slate-200/60 px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgba(245,158,11,0.08)] transition-all duration-500">
               <div className="flex flex-col items-end border-r border-slate-100 pr-5">
                  <span className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-[0.2em]">Overall Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 leading-none tracking-tighter">{avgRating}</span>
                    <span className="text-sm font-bold text-slate-400">/ 5.0</span>
                  </div>
               </div>
               <div className="flex items-center gap-1.5 text-amber-500">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={22} fill={s <= parseFloat(avgRating) ? "currentColor" : "none"} className={`${s <= parseFloat(avgRating) ? 'drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]' : 'text-slate-200'} transition-all`} />
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-pd-pink rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-400">Loading reviews...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {reviews.map((review, i) => (
             <motion.div 
               key={review.$id} 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm flex flex-col h-full hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all duration-300 relative group"
             >
                <div className="flex items-start justify-between gap-4 mb-5">
                   <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-50 overflow-hidden flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-300">
                         {review.userEmail ? (
                           <Image src={`https://www.gravatar.com/avatar/${review.userEmail.trim().toLowerCase()}?d=mp`} alt="User" width={44} height={44} className="object-cover" />
                         ) : (
                           <User size={20} />
                         )}
                      </div>
                      <div>
                         <h4 className="text-[15px] font-extrabold text-slate-900 leading-tight">{review.userName || 'Anonymous'}</h4>
                         <p className="text-[11px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">{new Date(review.$createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-0.5 text-amber-500 shrink-0 bg-amber-50 px-2 py-1 rounded-full border border-amber-100/50">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={10} fill={s <= review.rating ? "currentColor" : "none"} className={s > review.rating ? 'text-amber-200/50' : ''} />
                      ))}
                   </div>
                </div>
                
                <p className="text-sm text-slate-700 font-medium leading-relaxed mb-6 flex-1 pr-2">
                   "{review.comment}"
                </p>

                {review.vendorReply ? (
                  <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4 mt-auto relative overflow-hidden group/reply">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400" />
                    <div className="flex items-center gap-1.5 mb-2 pl-1">
                       <CheckCircle2 size={14} className="text-emerald-500" />
                       <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-700">Vendor Reply</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed pl-1">"{review.vendorReply}"</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                        setReplyTarget(review);
                        setReplyText('');
                    }}
                    className="mt-auto w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:text-white hover:border-pd-pink hover:bg-pd-pink shadow-sm hover:shadow-[0_8px_20px_rgba(236,72,153,0.25)] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                  >
                    <Send size={14} className="rotate-45 -translate-y-0.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-1 transition-transform" />
                    Write a Reply
                  </button>
                )}
             </motion.div>
           ))}

           {reviews.length === 0 && (
             <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-200/60 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                  <MessageSquareQuote size={28} />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1">No Reviews Yet</h3>
                <p className="text-sm font-medium text-slate-500 max-w-sm">When customers review your venue, their feedback will appear here in real-time.</p>
             </div>
           )}
        </div>
      )}

      {/* Reply Modal */}
      <AnimatePresence>
        {replyTarget && (
          <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setReplyTarget(null)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
             />
             
             <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden relative z-10 flex flex-col"
             >
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="text-lg font-extrabold text-slate-900">Reply to Review</h3>
                   <button 
                     onClick={() => setReplyTarget(null)} 
                     className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                   >
                      <X size={16} />
                   </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                   <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl mb-6">
                      <div className="flex items-center gap-3 mb-2">
                         <User size={16} className="text-slate-400" />
                         <span className="text-sm font-bold text-slate-900">{replyTarget.userName}</span>
                      </div>
                      <p className="text-sm text-slate-600 italic">"{replyTarget.comment}"</p>
                   </div>

                   <div className="space-y-3">
                      <label className="flex items-center justify-between">
                         <span className="text-xs font-bold text-slate-700">Your Public Response</span>
                      </label>
                      <textarea 
                         value={replyText}
                         onChange={(e) => setReplyText(e.target.value)}
                         placeholder="Acknowledge their feedback and thank them..."
                         className="w-full bg-white border border-slate-200/60 focus:border-pd-pink focus:ring-4 focus:ring-pd-pink/10 rounded-2xl p-4 min-h-[140px] text-sm font-medium outline-none transition-all placeholder:text-slate-400 resize-none"
                      />
                   </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 pt-0 flex gap-3">
                   <button 
                     onClick={() => setReplyTarget(null)} 
                     className="flex-1 py-2.5 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleReplySubmit}
                     disabled={isSubmittingReply || !replyText.trim()}
                     className="flex-1 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                   >
                     {isSubmittingReply ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                     ) : 'Post Reply'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
       </AnimatePresence>

    </motion.div>
  );
};

export default React.memo(ReviewManager);
