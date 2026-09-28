'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Phone, Mail, LifeBuoy, Ticket, CheckCircle2 } from 'lucide-react';

const QuickSupport = () => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [tickets, setTickets] = useState<any[]>([]);

  // Fetch tickets on mount
  React.useEffect(() => {
    // We'll use a generic vendorId or get it from localStorage if it exists
    const vendorId = localStorage.getItem('vendorId') || 'vendor-123';
    fetch(`http://localhost:5005/api/support/vendor/${vendorId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setTickets(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !category || !description) return;
    
    setIsSubmitting(true);
    try {
      const vendorId = localStorage.getItem('vendorId') || 'vendor-123';
      const res = await fetch('http://localhost:5005/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, category, description, vendorId })
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        setIsSuccess(true);
        // Add new ticket to state from API response
        setTickets(prev => [data.data, ...prev]);
        setSubject('');
        setCategory('');
        setDescription('');
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }} 
      className="w-full max-w-6xl mx-auto space-y-8"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Help & Support</h1>
        <p className="text-slate-500 font-medium">Get assistance with your vendor account or contact the PartyDial team.</p>
      </div>

      {/* Top Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {/* Phone Support */}
        <div className="group bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Phone size={20} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900 mb-0.5">Phone Support</h3>
              <p className="text-xs text-slate-500 font-medium line-clamp-1 sm:line-clamp-none">
                Available 24/7 for premium vendors.
              </p>
            </div>
          </div>
          <button className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shrink-0 shadow-sm">
            Call Us
          </button>
        </div>

        {/* Email Support */}
        <div className="group bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Mail size={20} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900 mb-0.5">Email Support</h3>
              <p className="text-xs text-slate-500 font-medium line-clamp-1 sm:line-clamp-none">
                Responses within 24 hours.
              </p>
            </div>
          </div>
          <button className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shrink-0 shadow-sm">
            Send Email
          </button>
        </div>
      </div>

      {/* Ticket Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Submit Ticket */}
        <div className="bg-white p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shrink-0">
              <LifeBuoy size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Submit a Ticket</h3>
              <p className="text-sm text-slate-500 font-medium mt-0.5">Describe your issue in detail.</p>
            </div>
          </div>
          
          {isSuccess ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center justify-center py-12 text-center flex-1"
             >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Ticket Submitted!</h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">Your support ticket has been raised successfully. Our team will review the issue and contact you within 24 hours.</p>
             </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                 <input 
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    placeholder="E.g., Issue with payout for booking BKG-1234"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pd-pink/20 focus:border-pd-pink/40 transition-all text-sm font-medium text-slate-700 placeholder:font-normal"
                 />
              </div>

              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                 <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pd-pink/20 focus:border-pd-pink/40 transition-all text-sm font-medium text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:0.65rem_auto]"
                 >
                    <option value="" disabled>Select a category...</option>
                    <option value="billing">Billing & Payouts</option>
                    <option value="profile">Profile & Listing Updates</option>
                    <option value="leads">Lead Discrepancies</option>
                    <option value="technical">Technical Glitches</option>
                    <option value="other">Other Issues</option>
                 </select>
              </div>
              
              <div className="flex-1 flex flex-col">
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                 <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Please provide as much detail as possible..."
                    className="w-full flex-1 min-h-[120px] px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pd-pink/20 focus:border-pd-pink/40 transition-all text-sm font-medium text-slate-700 resize-none placeholder:font-normal"
                 />
              </div>
              
              <div className="pt-2">
                 <button 
                    type="submit" 
                    disabled={isSubmitting || !subject || !category || !description}
                    className="px-6 py-2.5 bg-red-400 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isSubmitting ? 'Processing...' : 'Submit Ticket'}
                 </button>
              </div>
            </form>
          )}
        </div>

        {/* My Tickets */}
        <div className="bg-white p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm flex flex-col h-full max-h-[600px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shrink-0">
              <Ticket size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">My Tickets</h3>
              <p className="text-sm text-slate-500 font-medium mt-0.5">Track your submitted requests.</p>
            </div>
          </div>
          
          {tickets.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <p className="text-slate-500 font-medium text-sm">No support tickets yet.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.$id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{ticket.subject}</h4>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0 ${
                      ticket.status === 'Open' ? 'bg-amber-100 text-amber-700' :
                      ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                      ticket.status === 'Closed' ? 'bg-slate-100 text-slate-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                    <span className="capitalize text-slate-600">{ticket.category.replace('-', ' ')}</span>
                    <span className="opacity-70">{new Date(ticket.date || ticket.$createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </motion.div>
  );
};

export default QuickSupport;

