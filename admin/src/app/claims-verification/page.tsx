'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Building2, 
  User, 
  Eye, 
  Check, 
  AlertCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface ClaimItem {
  id: string;
  venueId: string;
  venueName: string;
  claimantName: string;
  claimantRole: string;
  phone: string;
  email: string;
  city: string;
  status: string;
  createdAt: string;
  notes: string;
  documents: string;
}

export default function ClaimsVerificationPage() {
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modal states
  const [selectedClaim, setSelectedClaim] = useState<ClaimItem | null>(null);
  const [coordinatorNotes, setCoordinatorNotes] = useState('');
  const [assignPassword, setAssignPassword] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      const baseServerUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5005';
      const serverUrl = baseServerUrl.endsWith('/api') ? baseServerUrl : `${baseServerUrl}/api`;
      const res = await fetch(`${serverUrl}/claims`);
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        setClaims(data.data);
      }
    } catch (err: any) {
      console.error('Failed to load claims:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleApprove = async () => {
    if (!selectedClaim) return;
    setIsActionLoading(true);
    try {
      const baseServerUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5005';
      const serverUrl = baseServerUrl.endsWith('/api') ? baseServerUrl : `${baseServerUrl}/api`;
      
      const res = await fetch(`${serverUrl}/claims/${selectedClaim.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: assignPassword || undefined
        })
      });
      const result = await res.json();

      if (res.ok) {
        setToast({ message: 'Claim approved! Venue has been transferred to this vendor.', type: 'success' });
        setSelectedClaim(null);
        setAssignPassword('');
        fetchClaims();
      } else {
        setToast({ message: result.message || 'Failed to approve claim.', type: 'error' });
      }
    } catch (e: any) {
      setToast({ message: e.message || 'Network error approving claim', type: 'error' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedClaim) return;
    setIsActionLoading(true);
    try {
      const baseServerUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5005';
      const serverUrl = baseServerUrl.endsWith('/api') ? baseServerUrl : `${baseServerUrl}/api`;
      
      const res = await fetch(`${serverUrl}/claims/${selectedClaim.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          coordinatorNotes
        })
      });
      const result = await res.json();

      if (res.ok) {
        setToast({ message: `Claim marked as ${newStatus}`, type: 'success' });
        setSelectedClaim(null);
        setCoordinatorNotes('');
        fetchClaims();
      } else {
        setToast({ message: result.message || 'Failed to update status', type: 'error' });
      }
    } catch (e: any) {
      setToast({ message: e.message || 'Network error', type: 'error' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredClaims = claims.filter(c => {
    const matchesSearch = 
      c.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'PENDING') return matchesSearch && (c.status === 'Pending Claim' || c.status === 'In Review');
    if (statusFilter === 'APPROVED') return matchesSearch && c.status === 'Approved';
    if (statusFilter === 'REJECTED') return matchesSearch && c.status === 'Rejected';
    return matchesSearch;
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 font-pd">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white font-medium text-sm ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">✕</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
              <ShieldCheck size={28} />
            </span>
            Claims & Verification
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Coordinate with owners wanting to claim their manually listed venue, verify documents, and grant ownership.
          </p>
        </div>
        <button 
          onClick={fetchClaims} 
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold text-sm transition-colors shadow-xs"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin text-rose-500' : ''} />
          Refresh Requests
        </button>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Claims</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{claims.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Pending Review</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            {claims.filter(c => c.status === 'Pending Claim' || c.status === 'In Review').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Approved & Transferred</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {claims.filter(c => c.status === 'Approved').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Rejected</p>
          <p className="text-2xl font-bold text-slate-500 mt-1">
            {claims.filter(c => c.status === 'Rejected').length}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search venue, claimant, email or phone..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 outline-none" 
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === tab ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw size={32} className="animate-spin text-rose-500 mb-3" />
            <p className="text-sm font-medium">Loading claim requests...</p>
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400">
            <Building2 size={40} className="text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Claim Requests Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
              When users view an unclaimed venue on PartyDial and click &apos;Claim Venue Now&apos;, their request will appear here for verification.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">Venue Details</th>
                  <th className="py-4 px-6">Claimant Person</th>
                  <th className="py-4 px-6">Contact & Verification</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-base">{claim.venueName}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} />
                        <span>{claim.city || 'City N/A'}</span>
                        <span className="text-slate-300">•</span>
                        <span>ID: {claim.venueId}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <User size={14} className="text-slate-400" />
                        <span>{claim.claimantName}</span>
                      </div>
                      <div className="text-xs text-rose-600 font-medium mt-0.5">{claim.claimantRole}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <a href={`tel:${claim.phone}`} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium hover:text-rose-600">
                          <Phone size={12} className="text-emerald-500" />
                          <span>{claim.phone}</span>
                        </a>
                        <a href={`mailto:${claim.email}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600">
                          <Mail size={12} className="text-blue-500" />
                          <span>{claim.email}</span>
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        claim.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        claim.status === 'In Review' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {claim.status === 'Approved' && <CheckCircle size={12} />}
                        {claim.status === 'Rejected' && <XCircle size={12} />}
                        {claim.status !== 'Approved' && claim.status !== 'Rejected' && <Clock size={12} />}
                        <span>{claim.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(claim.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => setSelectedClaim(claim)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Eye size={13} />
                        <span>Coordinate / Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Coordinate & Approve Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <ShieldCheck size={22} />
                </span>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Coordinate & Verify Claim</h3>
                  <p className="text-xs text-slate-500">{selectedClaim.venueName}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedClaim(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold block">Claimant Name</span>
                  <span className="font-bold text-slate-900 text-base">{selectedClaim.claimantName}</span>
                  <span className="text-xs text-rose-600 block font-medium">Role: {selectedClaim.claimantRole}</span>
                </div>
                <div>
                  <span className="text-xs uppercase text-slate-400 font-semibold block">Contact Details</span>
                  <span className="font-semibold text-slate-800 block">{selectedClaim.phone}</span>
                  <span className="text-xs text-slate-500 block">{selectedClaim.email}</span>
                </div>
              </div>

              {selectedClaim.notes && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">Claimant Notes / Proof Details</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 whitespace-pre-wrap">
                    {selectedClaim.notes}
                  </div>
                </div>
              )}

              {/* Password field for account creation if approving */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Assign Vendor Password <span className="text-slate-400 font-normal">(Optional, will auto-generate if empty)</span>
                </label>
                <input 
                  type="text" 
                  value={assignPassword} 
                  onChange={(e) => setAssignPassword(e.target.value)} 
                  placeholder="Set initial password for vendor login..." 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 outline-none" 
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  When you approve, an Appwrite Auth account with &apos;vendor&apos; permissions will be linked to this venue.
                </p>
              </div>

              {/* Internal Coordinator Note */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Team Coordination Notes</label>
                <textarea 
                  rows={2} 
                  value={coordinatorNotes} 
                  onChange={(e) => setCoordinatorNotes(e.target.value)} 
                  placeholder="e.g. Called owner on phone, verified electricity bill / GST document..." 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 outline-none" 
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus('In Review')}
                  disabled={isActionLoading}
                  className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-semibold disabled:opacity-50"
                >
                  Mark In-Review
                </button>
                <button
                  onClick={() => handleUpdateStatus('Rejected')}
                  disabled={isActionLoading}
                  className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl hover:bg-rose-100 text-xs font-semibold disabled:opacity-50"
                >
                  Reject Claim
                </button>
              </div>

              <button
                onClick={handleApprove}
                disabled={isActionLoading || selectedClaim.status === 'Approved'}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check size={16} />
                <span>{selectedClaim.status === 'Approved' ? 'Already Approved' : 'Verify & Give Ownership'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
