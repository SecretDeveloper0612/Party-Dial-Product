'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, User, MessageSquareQuote } from 'lucide-react';
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
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-server-koo2.onrender.com/api';
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
            // Filter by venueId
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
      const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-server-koo2.onrender.com/api';
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 relative">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight mb-2">Customer <span className="text-pd-pink">Reviews</span></h1>
          <p className="text-sm font-medium text-slate-500 italic">Manage your reputation and interact with your customers.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
              <Star size={20} className="text-amber-500 fill-amber-500" />
              <span className="text-2xl font-black text-slate-900 italic">{avgRating}</span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">/ 5.0</span>
           </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-pd-pink border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase text-slate-400 italic">Syncing reviews...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {reviews.map(review => (
             <div key={review.$id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-pd-soft hover:border-pd-pink/30 hover:shadow-pd-strong transition-all group">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center text-slate-400 border border-slate-50">
                      {review.userEmail ? (
                        <Image src={`https://www.gravatar.com/avatar/${review.userEmail.trim().toLowerCase()}?d=mp`} alt="User" width={48} height={48} />
                      ) : (
                        <User size={24} />
                      )}
                   </div>
                   <div>
                      <h4 className="text-sm font-black italic text-slate-900 leading-none mb-1.5 uppercase">{review.userName || 'Anonymous'}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] italic">{new Date(review.$createdAt).toLocaleDateString()}</p>
                   </div>
                    <div className="ml-auto flex items-center gap-3">
                       <div className="flex items-center gap-0.5 text-amber-500 mr-2">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={10} fill={s <= review.rating ? "currentColor" : "none"} className={s > review.rating ? 'text-slate-200' : ''} />
                          ))}
                       </div>

                    </div>
                 </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed italic mb-8 min-h-[48px]">
                   &ldquo;{review.comment}&rdquo;
                </p>

                {review.vendorReply ? (
                  <div className="bg-slate-900 rounded-[25px] p-5 text-white italic relative overflow-hidden group/reply">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-pd-pink mb-2 block">Your Reply</span>
                    <p className="text-[10px] text-slate-300 leading-relaxed font-medium">&ldquo;{review.vendorReply}&rdquo;</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                        setReplyTarget(review);
                        setReplyText('');
                    }}
                    className="flex items-center gap-2 group/btn"
                  >
                    <div className="w-8 h-8 rounded-lg bg-pd-pink/5 text-pd-pink flex items-center justify-center group-hover/btn:bg-pd-pink group-hover/btn:text-white transition-all">
                      <Send size={12} className="rotate-45 -translate-y-0.5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/btn:text-slate-900 transition-colors italic">Reply to Review</span>
                  </button>
                )}
             </div>
           ))}

           {reviews.length === 0 && (
             <div className="col-span-full py-32 text-center bg-slate-100/50 rounded-[50px] border-2 border-dashed border-slate-200">
                <MessageSquareQuote size={60} className="mx-auto text-slate-300 mb-6" />
                <h3 className="text-lg font-black uppercase italic text-slate-500">No reviews yet</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">When customers review your venue, they will appear here in real-time.</p>
             </div>
           )}
        </div>
      )}

      <AnimatePresence>
        {replyTarget && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setReplyTarget(null)}
               className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
             />
             
             <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden relative z-10 p-8 md:p-12"
             >
                <div className="flex items-center justify-between mb-8 md:mb-10">
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pd-pink mb-2 block italic">Response Terminal</span>
                      <h3 className="text-2xl md:text-3xl font-black italic uppercase text-slate-900 leading-none">Review Reply</h3>
                   </div>
                   <button 
                     onClick={() => setReplyTarget(null)} 
                     className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all border border-slate-100"
                   >
                      <X size={20} />
                   </button>
                </div>

                <div className="bg-slate-50/50 p-6 md:p-8 rounded-[40px] mb-8 md:mb-10 border border-slate-100 relative overflow-hidden group">
                   <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-300 border border-slate-100">
                        <User size={18} />
                      </div>
                      <span className="text-xs font-black italic text-slate-900 uppercase">{replyTarget.userName}</span>
                   </div>
                   <p className="text-xs text-slate-500 italic font-bold leading-relaxed relative z-10">&ldquo;{replyTarget.comment}&rdquo;</p>
                   <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100/30 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Your Response</label>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-emerald-500 italic">Public Message</span>
                      </div>
                   </div>
                   <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Acknowledge their feedback and thank them..."
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-pd-pink rounded-[35px] p-8 min-h-[180px] text-sm font-bold italic outline-none transition-all placeholder:text-slate-300 shadow-inner"
                   />
                </div>

                <div className="flex gap-4 mt-10 md:mt-12">
                   <button onClick={() => setReplyTarget(null)} className="flex-1 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all italic">Cancel</button>
                   <button 
                     onClick={handleReplySubmit}
                     disabled={isSubmittingReply || !replyText.trim()}
                     className="flex-1 px-8 py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest italic rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-pd-pink hover:scale-[1.02] transition-all disabled:opacity-50"
                   >
                     {isSubmittingReply ? 'Sending Response...' : 'Post Reply Now'}
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
