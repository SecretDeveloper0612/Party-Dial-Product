'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  TrendingUp, 
  Download, 
  Plus, 
  History, 
  Minus 
} from 'lucide-react';

interface FinanceHubProps {
  setActiveTab: (tab: string) => void;
}

const FinanceHub = ({ setActiveTab }: FinanceHubProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
       <header className="flex items-center justify-between">
          <div>
           <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tight mb-2">Financial Hub</h1>
           <p className="text-sm font-medium text-slate-500 italic">Manage your revenue stream and upcoming payouts.</p>
         </div>
         <div className="flex gap-4">
            <button className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all shadow-pd-soft">
               <Download size={14} />
               Export Report
            </button>
            <button className="pd-btn-primary flex items-center gap-2 px-8 py-4 rounded-2xl shadow-xl shadow-pd-pink/20">
               <Plus size={14} strokeWidth={3} />
               Withdraw
            </button>
         </div>
       </header>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Current Balance', value: '₹4,52,000', delta: '+12%', icon: <Wallet size={24} />, bg: 'bg-emerald-500', text: 'text-white' },
            { label: 'Pending Payouts', value: '₹85,000', delta: '-$200', icon: <ArrowUpRight size={24} />, bg: 'bg-slate-900', text: 'text-white' },
            { label: 'YTD Earning', value: '₹12.8L', delta: '+14%', icon: <TrendingUp size={24} />, bg: 'bg-white', text: 'text-slate-900 border border-slate-100' }
          ].map((item, idx) => (
             <div key={idx} className={`${item.bg === 'bg-white' ? item.bg : item.bg + ' ' + item.text} p-10 rounded-[50px] shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500`}>
                <div className="relative z-10">
                   <div className={`w-14 h-14 rounded-2xl ${item.bg === 'bg-white' ? 'bg-slate-50 text-slate-900' : 'bg-white/10 text-white'} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                   </div>
                   <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.bg === 'bg-white' ? 'text-slate-400' : 'text-white/60'} mb-2`}>{item.label}</h4>
                   <div className="flex items-baseline gap-3">
                      <p className="text-4xl font-black italic tracking-tighter">{item.value}</p>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${item.bg === 'bg-white' ? 'bg-emerald-50 text-emerald-500' : 'bg-white/20'}`}>{item.delta}</span>
                   </div>
                </div>
                {item.bg !== 'bg-white' && <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />}
             </div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 bg-white p-12 rounded-[50px] border border-slate-100 shadow-pd-soft relative overflow-hidden">
             <div className="flex items-center justify-between mb-12">
                <h3 className="text-xl font-black italic uppercase text-slate-900 tracking-tight">Recent Transactions</h3>
                 <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('history')} 
                    className="px-8 py-3 rounded-2xl bg-[#0F172A] text-white text-[9px] font-black uppercase tracking-[0.2em] italic hover:bg-pd-pink transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3 transition-colors group"
                 >
                    <History size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                    View All Records
                 </motion.button>
             </div>
             
             <div className="space-y-4">
                {[
                   { id: '#PD-9821', name: 'Wedding Booking', date: 'Oct 24, 2026', amt: '+₹45,000', status: 'Completed', type: 'Payout' },
                   { id: '#PD-9822', name: 'Profile Promotion', date: 'Oct 23, 2026', amt: '-₹1,500', status: 'Completed', type: 'Charge' },
                   { id: '#PD-9823', name: 'Silver Plan Renewal', date: 'Oct 22, 2026', amt: '-₹12,000', status: 'Pending', type: 'Charge' },
                   { id: '#PD-9824', name: 'Royal Suite Booking', date: 'Oct 21, 2026', amt: '+₹85,000', status: 'Completed', type: 'Payout' }
                ].map((t, i) => (
                   <div key={i} className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[40px] border border-slate-100 hover:border-pd-pink transition-all group cursor-default">
                      <div className="flex items-center gap-6">
                         <div className={`w-14 h-14 rounded-[22px] ${t.amt.startsWith('+') ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-900 text-white'} shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                            {t.amt.startsWith('+') ? <ArrowUpRight size={24} /> : <Minus size={24} />}
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h4 className="text-sm font-black italic text-slate-900 uppercase">{t.name}</h4>
                               <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-white border border-slate-100 rounded-full text-slate-400">{t.id}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold italic tracking-wider">{t.date}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`text-xl font-black italic mb-1 ${t.amt.startsWith('+') ? 'text-emerald-500' : 'text-slate-900'}`}>{t.amt}</p>
                         <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${t.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{t.status}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
             <div className="bg-slate-900 p-10 rounded-[50px] shadow-2xl relative overflow-hidden group h-full">
                <h3 className="text-lg font-black italic uppercase text-white mb-8 relative z-10">Revenue Goal</h3>
                <div className="relative z-10">
                   <div className="flex justify-between items-end mb-4">
                      <p className="text-4xl font-black italic text-white leading-none">₹2.4L<span className="text-sm font-black text-white/40 block mt-2 tracking-widest uppercase">Target for Oct</span></p>
                      <div className="text-right">
                         <p className="text-emerald-400 text-sm font-black italic">65%</p>
                      </div>
                   </div>
                   <div className="h-4 bg-white/10 rounded-full overflow-hidden mb-10 border border-white/5">
                      <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: '65%' }}
                         transition={{ duration: 1.5, ease: "circOut" }}
                         className="h-full bg-pd-pink relative"
                      >
                         <div className="absolute top-0 right-0 w-8 h-full bg-white/30 blur-md" />
                      </motion.div>
                   </div>
                   
                   <div className="p-6 bg-white/5 border border-white/10 rounded-[30px] group-hover:bg-white/10 transition-colors">
                      <p className="text-[10px] text-white/60 font-medium italic leading-relaxed">You are on track to exceed your goal by <span className="text-emerald-400 font-bold">12%</span> if booking velocity remains constant.</p>
                   </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-pd-pink/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
             </div>
          </div>
       </div>
    </motion.div>
  );
};

export default React.memo(FinanceHub);
