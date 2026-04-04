'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Clock, Star, X, Send, User } from 'lucide-react';

interface CalendarEvent {
  day: number;
  type: string;
  time: string;
  host: string;
  status: string;
  pax: number;
}

interface VenueCalendarProps {
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  calendarView: string;
  setCalendarView: (view: string) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  calendarEvents: CalendarEvent[];
  setIsBookingModalOpen: (open: boolean) => void;
  setNewBookingDay: (day: number) => void;
}

const VenueCalendar = ({
  currentMonth,
  setCurrentMonth,
  calendarView,
  setCalendarView,
  selectedDay,
  setSelectedDay,
  calendarEvents,
  setIsBookingModalOpen,
  setNewBookingDay
}: VenueCalendarProps) => {

  const selectedDayEvents = calendarEvents.filter(e => e.day === selectedDay);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col xl:flex-row gap-8 min-h-[800px]"
    >
       {/* LEFT: MASTER SCHEDULE */}
       <div className="flex-1 space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div>
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-pd-pink animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pd-pink">Live Venue Status</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-1">
                   {currentMonth} <span className="text-pd-pink">Schedule</span>
                </h1>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">Spring Ballroom • Grand Imperial Resort</p>
             </div>
             
             <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300">
                {['Monthly', 'Weekly', 'Blueprint'].map(view => (
                   <button 
                      key={view} 
                      onClick={() => setCalendarView(view)}
                      className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${calendarView === view ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'} ${view === 'Blueprint' && calendarView !== view ? 'border border-blue-500/20 text-blue-500' : ''}`}
                   >
                     {view}
                   </button>
                ))}
             </div>
          </header>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-pd-soft p-10 min-h-[600px] flex flex-col relative overflow-hidden transition-all duration-500">
              <div className="flex items-center justify-between mb-8 px-4 shrink-0">
                 <button onClick={() => setCurrentMonth(currentMonth === 'March' ? 'February' : 'March')} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                    <ChevronLeft size={18} />
                 </button>
                 <span className="text-sm font-black italic uppercase tracking-widest text-slate-900">{currentMonth} 2026</span>
                 <button onClick={() => setCurrentMonth(currentMonth === 'March' ? 'April' : 'March')} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                    <ChevronRight size={18} />
                 </button>
              </div>

              <AnimatePresence mode="wait">
                 {calendarView === 'Monthly' && (
                    <motion.div 
                      key="monthly"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-7 gap-px bg-slate-100 rounded-[28px] overflow-hidden border border-slate-100"
                    >
                       {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                          <div key={d} className="bg-slate-50 text-center text-[9px] font-black uppercase tracking-widest text-slate-400 py-6 border-b border-slate-100">{d}</div>
                       ))}
                       {Array.from({ length: 31 }).map((_, i) => {
                          const dayNum = i + 1;
                          const dayEvents = calendarEvents.filter(e => e.day === dayNum);
                          const isBooked = dayEvents.some(e => e.status === 'Confirmed' || e.status === 'In-Progress');
                          const isMaintenance = dayEvents.some(e => e.status === 'Maintenance');
                          const isToday = dayNum === 20;
                          const isSelected = selectedDay === dayNum;
                          
                          return (
                             <motion.div 
                                key={i} 
                                whileHover={{ scale: 1.02, zIndex: 10 }}
                                onClick={() => setSelectedDay(dayNum)}
                                className={`bg-white min-h-[120px] p-5 flex flex-col transition-all cursor-pointer relative group ${isSelected ? 'ring-2 ring-pd-pink ring-inset rounded-2xl z-20 shadow-2xl scale-105' : ''} ${isToday ? 'bg-slate-50 border-pd-pink/10' : ''}`}
                             >
                                <div className="flex justify-between items-start mb-4">
                                   <span className={`text-xs font-black italic ${isSelected || isToday ? 'text-pd-pink' : isBooked ? 'text-slate-900' : isMaintenance ? 'text-amber-500' : 'text-slate-300'}`}>
                                      {String(dayNum).padStart(2, '0')}
                                   </span>
                                   {isBooked && <div className="w-1.5 h-1.5 rounded-full bg-pd-pink"></div>}
                                </div>
                                
                                <div className="space-y-2 mt-auto">
                                   {isBooked && dayEvents.filter(e => e.status !== 'Maintenance').slice(0, 1).map((e, idx) => (
                                      <div key={idx} className="px-2.5 py-1.5 bg-pd-pink/10 rounded flex flex-col gap-0.5 border-l-2 border-pd-pink">
                                         <span className="text-[7px] font-black uppercase text-pd-pink leading-none truncate">{e.type}</span>
                                         <span className="text-[6px] font-bold text-pd-pink opacity-70 italic leading-none truncate">{e.host}</span>
                                      </div>
                                   ))}
                                </div>
                             </motion.div>
                          );
                       })}
                    </motion.div>
                 )}

                 {calendarView === 'Weekly' && (
                    <motion.div 
                      key="weekly"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide"
                    >
                       {[16, 17, 18, 19, 20, 21, 22].map(day => {
                          const events = calendarEvents.filter(e => e.day === day);
                          const isToday = day === 20;
                          return (
                             <motion.div 
                                key={day} 
                                whileHover={{ x: 5 }}
                                className={`p-10 rounded-[45px] border ${isToday ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/40 border-slate-900' : 'bg-white border-slate-50 shadow-sm'} flex items-center justify-between transition-all cursor-pointer group`}
                             >
                                <div className="flex items-center gap-10">
                                   <div className="flex flex-col items-center min-w-[60px]">
                                      <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${isToday ? 'text-pd-pink' : 'text-slate-300'}`}>MAR</span>
                                      <span className="text-5xl font-black italic leading-none tracking-tighter">{day}</span>
                                   </div>
                                   <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-pd-pink animate-pulse' : 'bg-slate-100'}`} />
                                   <div className="space-y-1">
                                      {events.length > 0 ? (
                                        events.map((e, idx) => (
                                           <div key={idx} className="flex flex-col">
                                              <h4 className={`text-xl font-black uppercase italic tracking-tight leading-none mb-1 ${isToday ? 'text-white' : 'text-slate-900'}`}>{e.type}</h4>
                                              <div className="flex items-center gap-3">
                                                 <span className={`text-[11px] font-black italic tracking-widest ${isToday ? 'text-pd-pink' : 'text-slate-400'}`}>{e.time}</span>
                                                 <span className={`text-[11px] font-medium italic opacity-40 ${isToday ? 'text-white' : 'text-slate-900'}`}>Host: {e.host}</span>
                                              </div>
                                           </div>
                                        ))
                                      ) : (
                                        <div className="flex flex-col">
                                           <span className="text-xl font-black italic uppercase text-slate-200 tracking-tighter">Available Blueprint Slot</span>
                                           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">Open for inquiries</span>
                                        </div>
                                      )}
                                   </div>
                                </div>
                                <div className="flex items-center gap-6">
                                   {events.length === 0 && (
                                      <button className="px-8 py-3.5 bg-pd-pink text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-pd-pink/20 hover:scale-105 transition-all">RESERVE SLOT</button>
                                   )}
                                   <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${isToday ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'} group-hover:bg-pd-pink group-hover:text-white group-hover:border-pd-pink`}>
                                      <ChevronRight size={20} />
                                   </div>
                                </div>
                             </motion.div>
                          );
                       })}
                    </motion.div>
                 )}

                 {calendarView === 'Blueprint' && (
                    <motion.div 
                      key="blueprint"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 flex flex-col gap-10"
                    >
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {[
                             { area: 'Imperial Ballroom', cap: '85', status: 'High Volume' },
                             { area: 'Royal Terrace', cap: '32', status: 'Available' },
                             { area: 'Executive Suites', cap: '94', status: 'Peak Occupancy' }
                          ].map((item, idx) => (
                             <div key={idx} className="p-10 bg-slate-50 rounded-[50px] border border-slate-100 shadow-inner group hover:bg-white hover:shadow-2xl transition-all duration-500">
                                <div className="flex justify-between items-start mb-8">
                                   <div className={`w-3 h-3 rounded-full ${parseInt(item.cap) > 90 ? 'bg-pd-pink animate-pulse' : 'bg-emerald-500'}`} />
                                   <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{item.status}</span>
                                </div>
                                <h4 className="text-xs font-black uppercase text-slate-400 mb-6">{item.area}</h4>
                                <div className="flex items-center gap-6">
                                   <span className="text-5xl font-black italic text-slate-900 leading-none tracking-tighter">{item.cap}<span className="text-xl text-pd-pink">%</span></span>
                                   <div className="flex-1 h-3 bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.cap}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className={`h-full ${parseInt(item.cap) > 90 ? 'bg-pd-pink' : 'bg-slate-900'}`} 
                                      />
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                       <div className="flex-1 bg-slate-900 rounded-[60px] p-16 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
                          <div className="absolute inset-0 bg-gradient-to-tr from-pd-pink/20 via-transparent to-blue-500/10 pointer-events-none" />
                          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pd-pink/10 rounded-full blur-[100px]" />
                          
                          <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mb-10 relative z-10 border border-white/10">
                             <Zap size={32} className="text-pd-pink" />
                          </div>
                          <h3 className="text-4xl font-black italic uppercase text-white mb-4 relative z-10 tracking-tighter leading-none">Inventory Intelligence <span className="text-pd-pink">Blueprint</span></h3>
                          <p className="text-[13px] font-medium text-white/40 italic mb-12 relative z-10 max-w-md mx-auto leading-relaxed">Optimize your venue utilization with advanced predictive modeling and real-time inventory tracking architecture.</p>
                          
                          <div className="flex gap-4 relative z-10">
                             <button className="px-12 py-5 bg-pd-pink text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-pd-pink/40 hover:scale-105 transition-all">OPTIMIZE YIELD</button>
                             <button className="px-12 py-5 bg-white/5 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">EXPORT ANALYSIS</button>
                          </div>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
          </div>
       </div>

       {/* RIGHT: DAILY AGENDA & CONTROLS */}
       <div className="w-full xl:w-[400px] flex flex-col gap-8">
          {/* Date Details */}
          <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group min-h-[500px]">
             <div className="absolute top-0 right-0 w-32 h-32 bg-pd-pink/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
             
             <div className="relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-pd-pink mb-8 italic">Agenda Detail</h4>
                <h2 className="text-6xl font-black italic tracking-tighter leading-none mb-2">{selectedDay} <span className="text-pd-pink">{currentMonth.slice(0, 3).toUpperCase()}</span></h2>
                <p className="text-sm font-medium text-slate-400 italic mb-10">
                   {selectedDayEvents.length > 0 ? `${selectedDayEvents.length} Scheduled Events` : 'No events for this date'}
                </p>
                
                <div className="space-y-6">
                   {selectedDayEvents.length > 0 ? selectedDayEvents.map((evt, i) => (
                      <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                      >
                         <div className={`w-1.5 h-12 rounded-full ${evt.status === 'Confirmed' ? 'bg-pd-pink' : evt.status === 'Maintenance' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                         <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1.5">{evt.time}</p>
                            <h5 className="text-sm font-black italic uppercase text-white leading-none mb-1 group-hover:text-pd-pink transition-colors">{evt.type}</h5>
                            <p className="text-[10px] text-slate-400 font-bold italic lowercase opacity-60">host: {evt.host} {evt.pax > 0 && `• ${evt.pax} Pax`}</p>
                         </div>
                      </motion.div>
                   )) : (
                      <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[32px] opacity-40">
                         <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Clock size={20} />
                          </div>
                         <p className="text-[10px] font-black uppercase tracking-[0.3em]">Pure White Space</p>
                      </div>
                   )}
                </div>
                
                <button 
                  onClick={() => { setIsBookingModalOpen(true); setNewBookingDay(selectedDay); }}
                  className="w-full py-5 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic mt-12 hover:bg-pd-pink hover:text-white transition-all shadow-xl"
                >
                   Schedule Intelligence
                </button>
             </div>
          </div>

          {/* Venue Utilization */}
          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-pd-soft h-full">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8">Venue Utilization</h4>
             <div className="space-y-8">
                {[
                   { label: 'Occupancy Rate', val: '84%', color: 'bg-pd-pink' },
                   { label: 'Booking Velocity', val: '+12%', color: 'bg-emerald-500' },
                   { label: 'Revenue/Day', val: '₹1.8L', color: 'bg-slate-900' }
                ].map((stat, i) => (
                   <div key={i}>
                      <div className="flex justify-between items-end mb-3">
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                         <span className="text-xl font-black italic text-slate-900 tracking-tight">{stat.val}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: stat.val.includes('₹') ? '70%' : stat.val }}
                            className={`h-full ${stat.color}`}
                         />
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>
      <AnimatePresence>
        {setIsBookingModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
             {/* High Performance Backdrop */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.15 }}
               onClick={() => setIsBookingModalOpen(false)}
               className="absolute inset-0 bg-slate-900/60" 
             />
             
             {/* Optimized Modal Window */}
             <motion.div 
               initial={{ scale: 0.98, opacity: 0, y: 10 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.98, opacity: 0, y: 10 }}
               transition={{ type: 'spring', stiffness: 450, damping: 35 }}
               style={{ willChange: 'transform, opacity' }}
               className="relative bg-white w-full max-w-lg rounded-[45px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden"
             >
                 <div className="bg-[#0F172A] p-10 md:p-12 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pd-pink/10 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="relative z-10">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-pd-pink mb-4">Venue Management</h4>
                       <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none mb-1">Schedule <span className="text-pd-pink">Availability</span></h3>
                       <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-60 italic">
                          Target Date: {selectedDay} {currentMonth} 2026
                       </p>
                    </div>
                 </div>
                 
                 <div className="p-10 md:p-12 space-y-8">
                    <div className="space-y-3">
                       <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Account / Client Name</label>
                       <input type="text" placeholder="e.g., Rohan Verma (Wedding Group)" className="w-full bg-slate-50 border-2 border-transparent focus:border-pd-pink/10 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-3">
                         <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Logic</label>
                         <select className="w-full bg-slate-50 border-2 border-transparent focus:border-pd-pink/10 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer">
                            <option>High Scale Wedding</option>
                            <option>Corporate Summit</option>
                            <option>Intimate Social</option>
                         </select>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Expected Pax</label>
                         <input type="number" placeholder="450" className="w-full bg-slate-50 border-2 border-transparent focus:border-pd-pink/10 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none" />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                       <button onClick={() => setIsBookingModalOpen(false)} className="flex-1 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Discard</button>
                       <button 
                          onClick={() => {
                             // This is a placeholder since we don't have the parent's setter directly for the list, 
                             // but we can at least close the modal.
                             setIsBookingModalOpen(false);
                          }}
                          className="flex-[2] py-5 bg-[#0F172A] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-pd-pink transition-all shadow-xl shadow-slate-900/10"
                       >
                          Secure Venue Slot
                       </button>
                    </div>
                 </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(VenueCalendar);
