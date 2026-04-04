'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckCircle2, 
  X, 
  Download, 
  Send 
} from 'lucide-react';
import Image from 'next/image';

interface LineItem {
  id: number;
  label: string;
  amount: number;
}

interface QuoteData {
  client: string;
  event: string;
  gstRate: number;
  lineItems: LineItem[];
}

interface QuotationManagerProps {
  quoteData: QuoteData;
  setQuoteData: (data: any) => void;
  handleFinalize: () => void;
  isFinalizing: boolean;
  qtnSuccess: boolean;
  subtotal: number;
  gstAmount: number;
  totalWithTax: number;
  setActiveTab: (tab: string) => void;
  logo: any;
  handleDownload: () => void;
  handleSend: () => void;
}

const QuotationManager = ({
  quoteData,
  setQuoteData,
  handleFinalize,
  isFinalizing,
  qtnSuccess,
  subtotal,
  gstAmount,
  totalWithTax,
  setActiveTab,
  logo,
  handleDownload,
  handleSend
}: QuotationManagerProps) => {

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen -mt-10 -mx-4 md:-mx-10 bg-slate-50/50">
       {/* Executive Status Bar */}
       <div className="bg-[#0F172A] px-8 py-5 flex items-center justify-between sticky top-0 z-30 shadow-2xl no-print">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded bg-pd-pink flex items-center justify-center text-white">
                <FileText size={16} />
             </div>
             <div>
                <h1 className="text-sm font-black italic text-white uppercase tracking-wider leading-none">Quote Engine</h1>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">Active Session: #QTN-8821</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setActiveTab('overview')} className="text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all tracking-widest">Discard</button>
             <button 
               onClick={handleFinalize}
               disabled={isFinalizing || qtnSuccess}
               className={`px-8 py-2.5 rounded text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                 qtnSuccess 
                 ? 'bg-emerald-500 text-white' 
                 : isFinalizing 
                   ? 'bg-slate-700 text-slate-300' 
                   : 'bg-white text-slate-900 hover:bg-pd-pink hover:text-white'
               }`}
             >
                {isFinalizing ? (
                   <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : qtnSuccess ? (
                   <CheckCircle2 size={14} />
                ) : null}
                {isFinalizing ? 'Processing...' : qtnSuccess ? 'Finalized' : 'Submit & Finalize'}
             </button>
          </div>
       </div>

       <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden printable-container">
          {/* LEFT: FORM SECTION */}
          <div className="w-full lg:w-[480px] bg-white border-r border-slate-100 overflow-y-auto p-10 custom-scrollbar no-print">
             <div className="space-y-12">
                {/* Entity Section */}
                <section className="space-y-8">
                   <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-pd-pink"></span>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Entity Details</h3>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Identification</label>
                         <input 
                            type="text" 
                            value={quoteData.client}
                            onChange={(e) => setQuoteData({ ...quoteData, client: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:border-pd-pink focus:bg-white transition-all"
                            placeholder="e.g. Rahul Varma"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference Title</label>
                         <input 
                            type="text" 
                            value={quoteData.event}
                            onChange={(e) => setQuoteData({ ...quoteData, event: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:border-pd-pink focus:bg-white transition-all"
                            placeholder="e.g. Imperial Wedding Gala"
                         />
                      </div>
                   </div>
                </section>

                {/* Fiscal Section */}
                <section className="space-y-8">
                   <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Fiscal Configuration</h3>
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                      {[0, 5, 12, 18, 28].map(r => (
                         <button 
                            key={r}
                            onClick={() => setQuoteData({ ...quoteData, gstRate: r })}
                            className={`py-3 rounded-xl text-[10px] font-bold border transition-all ${quoteData.gstRate === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                         >
                            {r}% GST
                         </button>
                      ))}
                      <div className="relative">
                         <input 
                            type="number"
                            placeholder="Custom"
                            className="w-full h-full bg-slate-50 border border-slate-100 rounded-xl px-3 text-[10px] font-bold outline-none focus:border-pd-pink"
                            onChange={(e) => setQuoteData({ ...quoteData, gstRate: parseInt(e.target.value) || 0 })}
                         />
                      </div>
                   </div>
                </section>

                {/* Ledger Section */}
                <section className="space-y-8">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                         <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Document Ledger</h3>
                      </div>
                      <button 
                         onClick={() => setQuoteData({
                            ...quoteData,
                            lineItems: [...quoteData.lineItems, { id: Date.now(), label: 'New Line Item', amount: 0 }]
                         })}
                         className="text-[9px] font-black text-pd-pink uppercase tracking-widest hover:underline"
                      >
                         + Appended Item
                      </button>
                   </div>
                   <div className="space-y-4">
                      {quoteData.lineItems.map((item, idx) => (
                         <div key={item.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group hover:border-pd-pink transition-all">
                            <button 
                               onClick={() => {
                                  const newItems = quoteData.lineItems.filter((_, i) => i !== idx);
                                  setQuoteData({ ...quoteData, lineItems: newItems });
                               }}
                               className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                            >
                               <X size={12} />
                            </button>
                            <input 
                               type="text" 
                               value={item.label}
                               onChange={(e) => {
                                  const newItems = [...quoteData.lineItems];
                                  newItems[idx].label = e.target.value;
                                  setQuoteData({ ...quoteData, lineItems: newItems });
                               }}
                               className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 outline-none focus:border-pd-pink"
                               placeholder="Item Description"
                            />
                            <div className="flex items-center gap-3">
                               <span className="text-[9px] font-black text-slate-400">VALUATION</span>
                               <div className="flex-1 flex items-center bg-white border border-slate-100 rounded-xl px-4 py-3">
                                  <span className="text-[10px] font-black text-slate-300 mr-2">₹</span>
                                  <input 
                                     type="number" 
                                     value={item.amount}
                                     onChange={(e) => {
                                        const newItems = [...quoteData.lineItems];
                                        newItems[idx].amount = parseInt(e.target.value) || 0;
                                        setQuoteData({ ...quoteData, lineItems: newItems });
                                     }}
                                     className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none"
                                     placeholder="0.00"
                                  />
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </section>

                <div className="pt-8 border-t border-slate-100">
                   <div className="p-8 bg-[#0F172A] rounded-[32px] text-white space-y-6 shadow-2xl">
                      <div className="space-y-2">
                         <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500 tracking-widest">
                            <span>Base Valuation</span>
                            <span>₹{subtotal.toLocaleString('en-IN')}</span>
                         </div>
                         <div className="flex justify-between items-center text-[9px] font-black uppercase text-emerald-400 tracking-widest">
                            <span>Levy Charge ({quoteData.gstRate}%)</span>
                            <span>+₹{gstAmount.toLocaleString('en-IN')}</span>
                         </div>
                      </div>
                      <div className="h-[1px] bg-white/10" />
                      <div className="flex justify-between items-end">
                         <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-1">Final Total</span>
                            <span className="text-xs font-bold text-white/40 italic">In Indian Rupees</span>
                         </div>
                         <span className="text-3xl font-black italic text-pd-pink tracking-tight">₹{totalWithTax.toLocaleString('en-IN')}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* RIGHT: PREVIEW SECTION */}
          <div className="flex-1 bg-slate-100 p-8 lg:p-20 overflow-y-auto custom-scrollbar flex flex-col items-center">
             {/* Floating Action Menu for Preview */}
             <div className="mb-8 flex items-center gap-4 bg-[#0F172A] p-2 rounded-2xl shadow-xl no-print">
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-pd-pink hover:text-white transition-all"
                >
                   <Download size={14} />
                   Download PDF
                </button>
                <button 
                  onClick={handleSend}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest hover:bg-pd-pink transition-all"
                >
                   <Send size={14} />
                   Send to Client
                </button>
             </div>

             <motion.div 
                layout
                className="w-full max-w-[850px] bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-16 md:p-24 relative min-h-[1100px] flex flex-col print-only"
             >
                {/* Formal Document Header */}
                <div className="flex justify-between items-start mb-24 relative z-10">
                   <div className="flex items-center gap-6">
                    <div className="flex flex-col items-start">
                       <div className="w-48 h-12 relative -mb-1">
                          <Image src={logo} alt="Logo" fill className="object-contain object-left" />
                       </div>
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.5em] ml-1 opacity-70 italic">Official Partner</span>
                    </div>
                   </div>
                   <div className="text-right">
                      <h2 className="text-5xl font-black text-slate-900 mb-2 italic tracking-tighter">QTN</h2>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">#8821B-2026</p>
                   </div>
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-2 gap-24 mb-24 border-t border-slate-50 pt-16">
                   <div className="space-y-8">
                      <div>
                         <p className="text-[9px] font-black text-pd-pink uppercase tracking-widest mb-6">Issued By</p>
                         <p className="text-xl font-black text-slate-900 mb-2 uppercase italic tracking-tight">Grand Imperial Resort</p>
                         <p className="text-xs font-medium text-slate-500 leading-relaxed italic opacity-80">
                            Sector 44, Golf Course Extension<br />
                            Gurgaon, Haryana 122003<br />
                            GSTIN: 09AAFCP9821G1ZM
                         </p>
                      </div>
                   </div>
                   <div className="text-right space-y-8">
                      <div className="flex flex-col items-end">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">Recipient</p>
                         <p className="text-xl font-black text-slate-900 mb-2 uppercase italic tracking-tight">{quoteData.client}</p>
                         <p className="text-xs font-medium text-slate-500 leading-relaxed italic opacity-80">
                            Reference: {quoteData.event}<br />
                            Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                         </p>
                      </div>
                   </div>
                </div>

                {/* Table Ledger */}
                <div className="flex-1 mb-24">
                   <table className="w-full">
                      <thead>
                         <tr className="border-b-2 border-slate-900">
                            <th className="text-left font-black uppercase text-[10px] tracking-[0.3em] py-8 text-slate-400">Description of Deliverables</th>
                            <th className="text-right font-black uppercase text-[10px] tracking-[0.3em] py-8 text-slate-400">Amount (INR)</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {quoteData.lineItems.map((item, i) => (
                            <tr key={i} className="group">
                               <td className="py-10">
                                  <p className="text-sm font-black text-slate-800 mb-1 uppercase italic tracking-tight">{item.label}</p>
                                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic leading-none">Professional Service Allocation</p>
                               </td>
                               <td className="py-10 text-right">
                                  <p className="text-sm font-black text-slate-900 italic tracking-tight">₹{item.amount.toLocaleString('en-IN')}.00</p>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                {/* Mathematical Summations */}
                <div className="flex justify-end pt-12 border-t-2 border-slate-900">
                   <div className="w-full md:w-80 space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Gross Total</span>
                         <span className="text-sm font-black text-slate-900 italic">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-y border-slate-100 italic">
                         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Tax Provision ({quoteData.gstRate}%)</span>
                         <span className="text-sm font-black text-slate-900">+₹{gstAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center pt-6">
                         <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Total Amount Payable</span>
                         <span className="text-4xl font-black italic text-pd-pink tracking-tight">₹{totalWithTax.toLocaleString('en-IN')}</span>
                      </div>
                   </div>
                </div>

                {/* Legal Disclaimer */}
                <div className="mt-auto pt-32 flex justify-between items-end opacity-40 grayscale">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase text-slate-900 border-b border-slate-900 pb-1 w-fit">Terms of Business</p>
                      <ul className="text-[9px] font-bold text-slate-500 italic space-y-1">
                         <li>• Validity: 7 Working Days</li>
                         <li>• Execution contingent on 50% retainer</li>
                         <li>• E. & O. E.</li>
                      </ul>
                   </div>
                   <div className="text-right">
                      <div className="w-48 h-[1px] bg-slate-900 mb-6 ml-auto" />
                      <p className="text-[10px] font-black uppercase text-slate-900 italic tracking-widest">Authorized Executive</p>
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] mt-2">Digital Verification: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                   </div>
                </div>
             </motion.div>
          </div>
       </div>
    </motion.div>
  );
};

export default React.memo(QuotationManager);
