'use client';
import React, { useEffect, useState } from 'react';
import { LifeBuoy, CheckCircle, Clock } from 'lucide-react';

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await fetch('http://localhost:5005/api/support/all');
      const data = await res.json();
      if (data.status === 'success') {
        setTickets(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch(`http://localhost:5005/api/support/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchTickets();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-100 text-red-600 rounded-xl">
          <LifeBuoy size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Support Tickets</h1>
          <p className="text-slate-500">Manage and resolve vendor inquiries</p>
        </div>
      </div>

      {loading ? (
        <div>Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500">No support tickets found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Recent Tickets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Ticket ID</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Subject</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">User</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Priority</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Last Updated</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tickets.map(ticket => (
                  <tr key={ticket.$id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 align-middle">
                      <span className="font-bold text-slate-800 text-sm">TKT-{ticket.$id.substring(0, 4).toUpperCase()}</span>
                    </td>
                    <td className="py-4 px-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{ticket.subject}</span>
                        <span className="text-xs text-slate-400 capitalize">{ticket.category.replace('-', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-middle">
                      <span className="text-sm text-slate-600 font-medium">Himanshu Verma</span>
                    </td>
                    <td className="py-4 px-4 align-middle">
                      <span className="inline-block px-3 py-1 bg-red-400 text-white text-[11px] font-bold rounded-full">
                        Medium
                      </span>
                    </td>
                    <td className="py-4 px-4 align-middle">
                      <div className="relative inline-block w-32">
                        <select 
                          value={ticket.status}
                          onChange={(e) => handleUpdateStatus(ticket.$id, e.target.value)}
                          className={`appearance-none w-full px-3 py-1.5 text-xs font-bold rounded-lg border focus:outline-none cursor-pointer pr-8 focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all ${
                            ticket.status === 'Open' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            ticket.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                            ticket.status === 'Closed' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                            'bg-emerald-50 text-emerald-600 border-emerald-200'
                          }`}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                            ticket.status === 'Open' ? 'text-amber-700' :
                            ticket.status === 'In Progress' ? 'text-blue-600' :
                            ticket.status === 'Resolved' ? 'text-emerald-600' :
                            ticket.status === 'Closed' ? 'text-slate-600' :
                            'text-emerald-600'
                        }`}>
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-middle text-sm text-slate-500">
                      {new Date(ticket.date || ticket.$createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 align-middle text-right">
                      <button className="text-sm font-bold text-slate-800 hover:text-red-500 transition-colors">
                        Respond
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
