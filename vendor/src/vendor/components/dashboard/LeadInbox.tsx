'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ChevronDown, 
  CalendarDays, 
  Users, 
  Sparkles, 
  Phone, 
  MessageCircle,
  Search,
  MoreVertical,
  MessageSquareQuote,
  Pencil,
  Check,
  X,
  Bell,
  Calendar,
  Clock,
  ExternalLink,
  Trash2
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  event: string;
  guests: string;
  date: string;
  time: string;
  eventDate: string | null;
  location?: string;
  status: string;
  email: string;
  color: string;
  remark?: string;
  reminder?: string;
  rawNotes?: string;
}

interface LeadInboxProps {
  filteredAdvancedLeads: Lead[];
  leadFilter: string;
  setLeadFilter: (filter: string) => void;
  updateLeadStatus: (leadId: string, newStatus: string) => void;
  updateLeadRemark?: (leadId: string, remark: string) => void;
  updateLeadReminder?: (leadId: string, reminderTime: string) => void;
  vendorEmail?: string;
  setActiveTab: (tab: string) => void;
}

const LeadInbox = ({
  filteredAdvancedLeads,
  leadFilter,
  setLeadFilter,
  updateLeadStatus,
  updateLeadRemark,
  updateLeadReminder,
  vendorEmail,
  setActiveTab
}: LeadInboxProps) => {
  const [editingRemarkId, setEditingRemarkId] = useState<string | null>(null);
  const [remarkDraft, setRemarkDraft] = useState<string>('');

  const [schedulingReminderLead, setSchedulingReminderLead] = useState<Lead | null>(null);
  const [reminderDate, setReminderDate] = useState<string>('');
  const [reminderTime, setReminderTime] = useState<string>('11:00');
  const [reminderNote, setReminderNote] = useState<string>('');

  const handleStartEditRemark = (lead: Lead) => {
    setEditingRemarkId(lead.id);
    setRemarkDraft(lead.remark || '');
  };

  const handleSaveRemark = (leadId: string) => {
    if (updateLeadRemark) {
      updateLeadRemark(leadId, remarkDraft);
    }
    setEditingRemarkId(null);
  };

  const handleCancelRemark = () => {
    setEditingRemarkId(null);
    setRemarkDraft('');
  };

  const [syncToGoogle, setSyncToGoogle] = useState(true);

  const getGoogleCalendarUrl = (lead: Lead, dateTimeStr: string, noteStr?: string) => {
    try {
      const start = new Date(dateTimeStr);
      if (isNaN(start.getTime())) return null;
      const end = new Date(start.getTime() + 30 * 60 * 1000); // 30 min duration

      const formatIsoForGCal = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const dates = `${formatIsoForGCal(start)}/${formatIsoForGCal(end)}`;

      const title = encodeURIComponent(`PartyDial Follow-up: ${lead.name} (${lead.event})`);
      const details = encodeURIComponent(
        `Lead Name: ${lead.name}\nPhone: ${lead.phone}\nEvent: ${lead.event} (${lead.guests} guests)\nLead Status: ${lead.status}\n\nNote: ${noteStr || lead.remark || 'Client follow-up scheduled via PartyDial'}`
      );
      const userParam = vendorEmail ? `&authuser=${encodeURIComponent(vendorEmail)}` : '';
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}${userParam}`;
    } catch {
      return null;
    }
  };

  const handleOpenReminderModal = (lead: Lead) => {
    setSchedulingReminderLead(lead);
    if (lead.reminder) {
      try {
        const d = new Date(lead.reminder);
        if (!isNaN(d.getTime())) {
          setReminderDate(d.toISOString().split('T')[0]);
          setReminderTime(d.toTimeString().slice(0, 5));
        } else {
          setReminderDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
          setReminderTime('11:00');
        }
      } catch {
        setReminderDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
        setReminderTime('11:00');
      }
    } else {
      // Default to tomorrow 11:00 AM
      const tomorrow = new Date(Date.now() + 86400000);
      setReminderDate(tomorrow.toISOString().split('T')[0]);
      setReminderTime('11:00');
    }
    setReminderNote(lead.remark ? `Follow-up note: ${lead.remark}` : `Follow-up with client regarding ${lead.event}`);
  };

  const handleSaveReminder = () => {
    if (!schedulingReminderLead) return;
    if (!reminderDate) {
      alert('Please pick a date for the reminder');
      return;
    }

    const reminderDateTime = `${reminderDate}T${reminderTime || '11:00'}:00`;
    if (updateLeadReminder) {
      updateLeadReminder(schedulingReminderLead.id, reminderDateTime);
    }

    // If sync to Google Calendar is checked, open Google Calendar in new tab so user's Google Calendar records it
    if (syncToGoogle) {
      const gcalUrl = getGoogleCalendarUrl(schedulingReminderLead, reminderDateTime, reminderNote);
      if (gcalUrl) {
        window.open(gcalUrl, '_blank', 'noopener,noreferrer');
      }
    }

    setSchedulingReminderLead(null);
  };

  const handleClearReminder = (leadId: string) => {
    if (updateLeadReminder) {
      updateLeadReminder(leadId, '');
    }
  };

  const filters = ['All', 'New', 'Contacted', 'Followups', 'Quotation Send', 'Booked', 'Lost Leads', 'All Expired Leads'];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/60 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">Lead Inbox</h1>
            <p className="text-sm font-normal text-slate-500 mt-1">Manage and respond to your venue inquiries</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-pink transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search leads..." 
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-sm font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-pd-pink/20 focus:border-pd-pink transition-all w-full md:w-64"
                />
             </div>
             <button className="p-2.5 bg-white border border-slate-200/60 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={18} />
             </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2 w-max max-w-full">
           {filters.map(filter => (
             <button 
               key={filter} 
               onClick={() => setLeadFilter(filter)}
               className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                 leadFilter === filter 
                 ? 'bg-slate-900 text-white shadow-md' 
                 : 'bg-white border border-slate-200/60 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
               }`}
             >
               {filter}
             </button>
           ))}
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        
        {/* Table Header (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50/50 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
           <div className="col-span-4 pl-4">Lead Info</div>
           <div className="col-span-3">Event Details</div>
           <div className="col-span-3">Contact</div>
           <div className="col-span-2 text-right pr-4">Status & Action</div>
        </div>

        <div className="divide-y divide-slate-100">
          <AnimatePresence>
            {filteredAdvancedLeads.length > 0 ? filteredAdvancedLeads.map((lead, i) => {
              const isExpired = lead.eventDate && new Date(lead.eventDate) < new Date(new Date().setHours(0, 0, 0, 0)) && lead.status !== 'Booked';
              const displayStatus = isExpired ? 'Expired' : lead.status;
              
              return (
              <motion.div 
                key={lead.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col md:grid md:grid-cols-12 gap-4 p-4 lg:p-5 hover:bg-slate-50/50 transition-all items-start md:items-center relative"
              >
                 {/* Lead Info */}
                 <div className="col-span-4 flex gap-4 items-center w-full md:w-auto md:pl-2">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-linear-to-tr from-pd-pink/10 to-pd-purple/10 text-pd-pink flex items-center justify-center font-bold text-sm lg:text-base shrink-0 border border-pd-pink/20">
                       {lead.name ? lead.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                       <div className="flex items-center gap-2">
                         <h4 className="text-sm font-semibold text-slate-900 truncate">{lead.name}</h4>
                         {lead.status === 'New' && (
                           <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[9px] font-bold tracking-wide uppercase shrink-0">
                             New
                           </span>
                         )}
                       </div>
                       <div className="flex items-center gap-1 text-xs font-normal text-slate-500 mt-0.5">
                         <span className="truncate">{lead.email || 'No email provided'}</span>
                       </div>
                       <div className="md:hidden mt-2 flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${isExpired ? 'bg-slate-100 text-slate-500' : lead.color} border border-current/10`}>
                            {displayStatus}
                          </span>
                       </div>
                    </div>
                 </div>

                 {/* Event Details */}
                 <div className="col-span-3 flex flex-col gap-1.5 w-full md:w-auto text-sm">
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                       <Sparkles size={14} className="text-pd-purple shrink-0" />
                       <span className="truncate">{lead.event}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-normal text-slate-500">
                       <span className="flex items-center gap-1.5 whitespace-nowrap">
                         <Users size={12} className="opacity-70" /> {lead.guests || '0'} Guests
                       </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                       <CalendarDays size={12} className="text-amber-500 shrink-0" />
                       {lead.eventDate ? (
                         <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50 whitespace-nowrap">
                           {new Date(lead.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                         </span>
                       ) : (
                         <span className="text-[10px] text-slate-400 ">Date unconfirmed</span>
                       )}
                    </div>
                    {lead.location && (
                       <div className="flex items-center gap-2 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          <span className="text-[10px] font-normal text-slate-500 truncate">{lead.location}</span>
                       </div>
                    )}
                 </div>

                 {/* Contact Actions */}
                 <div className="col-span-3 flex md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <p className="text-sm font-semibold text-slate-900 hidden md:block">{lead.phone || '+91 98765 43210'}</p>
                    <div className="flex gap-2 w-full md:w-auto">
                       <button 
                         onClick={() => window.location.href = `tel:${lead.phone ? lead.phone.replace(/[^\d+]/g, '') : ''}`}
                         className="flex-1 md:flex-none h-8 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center text-blue-600 text-xs font-bold gap-1.5 border border-blue-200/50"
                       >
                          <Phone size={12} /> <span className="md:hidden">Call</span>
                       </button>
                       <button 
                         onClick={() => window.open(`https://wa.me/${lead.phone ? lead.phone.replace(/[^\d+]/g, '').replace('+', '') : ''}`, '_blank')}
                         className="flex-1 md:flex-none h-8 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center text-emerald-600 text-xs font-bold gap-1.5 border border-emerald-200/50"
                       >
                          <MessageCircle size={12} /> <span className="md:hidden">WhatsApp</span>
                       </button>
                    </div>
                 </div>

                 {/* Status & Action */}
                 <div className="col-span-2 flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-4 md:mt-0 md:pr-2">
                    <div className="relative hidden md:block group/select w-full max-w-35">
                       <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400 group-hover/select:text-slate-600">
                         <ChevronDown size={14} />
                       </div>
                       <select 
                          className={`w-full appearance-none pr-8 pl-3 py-1.5 rounded-lg text-xs font-bold border transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
                            isExpired ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' :
                            lead.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200/50 cursor-pointer' :
                            lead.status === 'Booked' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 cursor-pointer' :
                            lead.status === 'Lost Leads' ? 'bg-rose-50 text-rose-700 border-rose-200/50 cursor-pointer' :
                            'bg-slate-50 text-slate-700 border-slate-200/60 cursor-pointer'
                          }`}
                          value={displayStatus}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          disabled={!!isExpired}
                       >
                          {isExpired ? (
                             <option value="Expired">Expired</option>
                          ) : (
                             ['New', 'Contacted', 'Followups', 'Quotation Send', 'Booked', 'Lost Leads'].map(s => (
                                <option key={s} value={s} className="bg-white text-slate-900">{s}</option>
                             ))
                          )}
                       </select>
                    </div>

                    <button 
                      onClick={() => setActiveTab('pipeline')}
                      className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                      title="View in Pipeline"
                    >
                       <MoreVertical size={16} />
                    </button>
                 </div>

                 {/* VENDOR REMARKS & REMINDERS SECTION */}
                 <div className="col-span-12 w-full mt-2 pt-2 border-t border-slate-100/80 space-y-2">
                   {/* Remark Line */}
                   {editingRemarkId === lead.id ? (
                     <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                       <MessageSquareQuote size={14} className="text-pd-pink shrink-0" />
                       <input
                         type="text"
                         value={remarkDraft}
                         onChange={(e) => setRemarkDraft(e.target.value)}
                         placeholder="Enter vendor remark (e.g., Client requested catering menu, call back at 5 PM...)"
                         className="flex-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-normal text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-pd-pink"
                         autoFocus
                         onKeyDown={(e) => {
                           if (e.key === 'Enter') handleSaveRemark(lead.id);
                           if (e.key === 'Escape') handleCancelRemark();
                         }}
                       />
                       <button
                         onClick={() => handleSaveRemark(lead.id)}
                         className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                         title="Save remark"
                       >
                         <Check size={12} /> Save
                       </button>
                       <button
                         onClick={handleCancelRemark}
                         className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-colors"
                         title="Cancel"
                       >
                         <X size={12} />
                       </button>
                     </div>
                   ) : (
                     <div className="flex flex-wrap items-center justify-between gap-3 group/remark">
                       <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                         <div className="w-5 h-5 rounded-md bg-purple-50 text-pd-purple flex items-center justify-center shrink-0">
                           <MessageSquareQuote size={12} />
                         </div>
                         {lead.remark ? (
                           <div className="flex items-center gap-1.5 min-w-0">
                             <span className="text-[11px] font-semibold text-slate-500 shrink-0">Remark:</span>
                             <span className="text-xs text-slate-700 font-normal truncate bg-purple-50/60 px-2 py-0.5 rounded-md border border-purple-100">
                               {lead.remark}
                             </span>
                           </div>
                         ) : (
                           <span className="text-xs text-slate-400 font-light italic">
                             No remark added yet
                           </span>
                         )}

                         {/* Scheduled Follow-up Reminder Pill */}
                         {lead.reminder && (
                           <div className="flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/70 text-xs font-medium shrink-0">
                             <Bell size={11} className="text-amber-600 animate-pulse" />
                             <span>Reminder: {new Date(lead.reminder).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                             {getGoogleCalendarUrl(lead, lead.reminder, lead.remark) && (
                               <a
                                 href={getGoogleCalendarUrl(lead, lead.reminder, lead.remark)!}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="ml-1 text-amber-700 hover:text-amber-900 flex items-center gap-1 text-[10px] bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-300 font-semibold"
                                 title="Add or view in Google Calendar"
                               >
                                 <ExternalLink size={9} /> Google Cal
                               </a>
                             )}
                             <button
                               onClick={() => handleClearReminder(lead.id)}
                               className="ml-1 text-slate-400 hover:text-rose-600 transition-colors"
                               title="Clear reminder"
                             >
                               <X size={10} />
                             </button>
                           </div>
                         )}
                       </div>

                       <div className="flex items-center gap-2 shrink-0">
                         {/* Set Reminder Button */}
                         <button
                           onClick={() => handleOpenReminderModal(lead)}
                           className={`text-[11px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                             lead.reminder 
                               ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
                               : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70'
                           }`}
                           title="Set date & time reminder with Google Calendar"
                         >
                           <Bell size={11} className={lead.reminder ? 'text-amber-600' : 'text-slate-500'} />
                           <span>{lead.reminder ? 'Reschedule Reminder' : '+ Set Reminder'}</span>
                         </button>

                         {/* Edit Remark Button */}
                         <button
                           onClick={() => handleStartEditRemark(lead)}
                           className="text-[11px] font-semibold text-pd-purple hover:text-purple-700 hover:underline flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-purple-50"
                         >
                           <Pencil size={11} />
                           <span>{lead.remark ? 'Edit Remark' : '+ Add Remark'}</span>
                         </button>
                       </div>
                     </div>
                   )}
                 </div>
                 
                 {/* Mobile divider */}
                 <div className="md:hidden w-full h-px bg-slate-100 mt-2"></div>
              </motion.div>
              );
            }) : (
              <div className="p-12 flex flex-col items-center justify-center text-center bg-slate-50/30">
                 <div className="w-16 h-16 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                   <Users size={24} />
                 </div>
                 <h3 className="text-base font-bold text-slate-900 mb-1">No Leads Found</h3>
                 <p className="text-sm font-medium text-slate-500 max-w-sm">No inquiries match the current filter. Try selecting a different category or wait for new leads.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SCHEDULE REMINDER & GOOGLE CALENDAR MODAL */}
      <AnimatePresence>
        {schedulingReminderLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
                    <Bell size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">Schedule Follow-up Reminder</h3>
                    <p className="text-xs text-slate-500 leading-none mt-0.5">Client: {schedulingReminderLead.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSchedulingReminderLead(null)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Date & Time Selectors */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-500" /> Reminder Date
                    </label>
                    <input
                      type="date"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-500" /> Reminder Time
                    </label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Follow-up Note */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Follow-up Agenda / Note
                  </label>
                  <textarea
                    rows={2}
                    value={reminderNote}
                    onChange={(e) => setReminderNote(e.target.value)}
                    placeholder="e.g. Call client regarding catering menu quote and final guest headcount..."
                    className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Google Calendar Sync Option */}
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 cursor-pointer hover:bg-amber-100/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={syncToGoogle}
                    onChange={(e) => setSyncToGoogle(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="text-xs text-amber-950 leading-relaxed">
                    <span className="font-semibold block text-amber-900">Add to Google Calendar ({vendorEmail || "Vendor Account"})</span>
                    <span className="text-[11px] text-amber-800/80 font-normal">
                      When checked, opens a new tab to confirm this follow-up event in your Google Calendar without navigating away from PartyDial.
                    </span>
                  </div>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <button
                  onClick={() => setSchedulingReminderLead(null)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReminder}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 active:scale-95 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Bell size={13} /> Save Reminder
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(LeadInbox);
