'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Bell } from 'lucide-react';

interface Notification {
  id: string;
  name: string;
  event: string;
  guests: string;
  time: string;
  unread: boolean;
  rawDate: string;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onViewAll: () => void;
  lastClearedTime: number;
}

const NotificationDropdown = ({ 
  isOpen, 
  onClose, 
  notifications, 
  onViewAll,
  lastClearedTime 
}: NotificationDropdownProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Simple overlay without blur for performance */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/10" 
            onClick={onClose} 
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute right-[-40px] sm:right-0 mt-3 w-[280px] sm:w-80 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-50 overflow-hidden"
          >
            <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Recent Notifications</span>
              {notifications.some(n => n.unread && new Date(n.rawDate).getTime() > lastClearedTime) && (
                <span className="px-2 py-0.5 bg-pd-pink text-white text-[7px] font-black rounded-full uppercase italic animate-pulse">New Inquiries</span>
              )}
            </div>

            <div className="max-h-[350px] overflow-y-auto no-scrollbar py-2">
               {notifications.length > 0 ? (
                 notifications.slice(0, 5).map((notif, i) => {
                   const isNew = notif.unread && new Date(notif.rawDate).getTime() > lastClearedTime;
                   return (
                     <motion.div 
                       key={notif.id}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.05 }}
                       className="p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors cursor-pointer group"
                       onClick={() => { onViewAll(); onClose(); }}
                     >
                       <div className="flex items-start gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${isNew ? 'bg-pd-pink/10 text-pd-pink border border-pd-pink/10' : 'bg-slate-50 text-slate-300 border border-transparent'}`}>
                           <Zap size={16} />
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between gap-2 mb-1">
                             <p className="text-[11px] font-black text-slate-900 truncate uppercase italic">{notif.name}</p>
                             {isNew && <span className="w-1.5 h-1.5 bg-pd-pink rounded-full shadow-lg shadow-pd-pink/40"></span>}
                           </div>
                           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight opacity-80">{notif.event} • {notif.guests} PAX</p>
                           <p className="text-[8px] font-black text-slate-400/50 uppercase tracking-widest mt-1.5 italic group-hover:text-pd-pink transition-colors">{notif.time}</p>
                         </div>
                       </div>
                     </motion.div>
                   );
                 })
               ) : (
                 <div className="p-12 text-center">
                   <div className="w-14 h-14 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-200">
                     <Bell size={24} />
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">All caught up</p>
                 </div>
               )}
             </div>

            <button 
              onClick={() => { onViewAll(); onClose(); }}
              className="w-full py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-slate-900 transition-all bg-white border-t border-slate-50 italic"
            >
              Access Complete Pipeline
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(NotificationDropdown);
