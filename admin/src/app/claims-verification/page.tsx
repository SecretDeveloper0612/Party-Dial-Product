import React from 'react';

export default function ClaimsVerificationPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 font-pd">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-sf tracking-tight mb-2">Claims & Verification</h1>
          <p className="text-slate-500">Manage venue claims and verify vendor accounts.</p>
        </div>
      </div>
      <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center">
        <h2 className="text-xl font-bold text-slate-700 mb-2">Coming Soon</h2>
        <p className="text-slate-500">The Claims & Verification module is currently under development.</p>
      </div>
    </div>
  );
}
