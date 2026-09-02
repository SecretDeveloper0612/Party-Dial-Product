"use client";

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `footer { display: none !important; }` }} />
      <main className="min-h-[calc(100vh-120px)] bg-white flex items-center justify-center p-6 relative overflow-hidden">
        {/* Soft Background Blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pd-pink/10 rounded-full blur-3xl transform-gpu pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pd-blue/10 rounded-full blur-3xl transform-gpu pointer-events-none translate-y-1/2 -translate-x-1/2" />
      
      <div className="text-center max-w-xl mx-auto relative z-10">
        <div className="mb-8 relative inline-block">
          <h1 className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-br from-pd-pink via-purple-500 to-pd-blue leading-none select-none drop-shadow-xl">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-sm pointer-events-none select-none">
             <h1 className="text-[150px] md:text-[200px] font-black text-slate-900 leading-none">
              404
            </h1>
          </div>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
          Page not <span className="pd-gradient-text">found</span>
        </h2>
        
        <p className="text-slate-500 text-lg md:text-xl mb-12 leading-relaxed">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            type="button"
            onClick={() => typeof window !== 'undefined' && window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-bold py-4 px-8 rounded-xl hover:bg-slate-50 transition-all border border-slate-200 shadow-sm hover:shadow"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          
          <Link 
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
          >
            <Home size={18} />
            Return Home
          </Link>
        </div>
      </div>
    </main>
    </>
  );
}
