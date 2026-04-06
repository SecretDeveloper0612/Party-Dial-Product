"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X, CheckCircle2, Loader2, Users, Plus, Download, IndianRupee, ShieldCheck, Zap, Target
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface SendQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  entityId: string;
}

export default function SendQuotationModal({ isOpen, onClose, entityName, entityId }: SendQuotationModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percent' | 'value'>('percent');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(entityId === 'QUICK-QUOTE' ? 0 : 1);
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  const accounts = [
    { id: "acc1", name: "Imperial Palace Resorts", city: "Gurgaon" },
    { id: "acc2", name: "Grand Hyatt Regency", city: "Mumbai" },
    { id: "acc3", name: "Mehta Wedding Group", city: "Delhi" },
    { id: "acc4", name: "The Oberoi Grand", city: "Kolkata" },
    { id: "acc5", name: "Zaffron Banquet & Lawns", city: "Ahmedabad" },
  ];

  const basePlans = [
    { id: 'bp50', name: '0-50 PAX Membership', mrp: 41, price: 33, mrpAnnual: 14965, annual: 12045, pax: 50 },
    { id: 'bp100', name: '50-100 PAX Membership', mrp: 55, price: 44, mrpAnnual: 20075, annual: 16060, pax: 100 },
    { id: 'bp200', name: '100-200 PAX Membership', mrp: 96, price: 77, mrpAnnual: 35040, annual: 28105, pax: 200 },
    { id: 'bp500', name: '200-500 PAX Membership', mrp: 156, price: 123, mrpAnnual: 56940, annual: 44895, pax: 500 },
    { id: 'bp1000', name: '500-1000 PAX Membership', mrp: 219, price: 178, mrpAnnual: 79935, annual: 64970, pax: 1000 },
    { id: 'bp2000', name: '1000-2000 PAX Membership', mrp: 301, price: 247, mrpAnnual: 109865, annual: 90155, pax: 2000 },
    { id: 'bp5000', name: '2000-5000 PAX Membership', mrp: 493, price: 384, mrpAnnual: 179945, annual: 140160, pax: 5000 },
    { id: 'bp9999', name: '5000+ PAX Membership', mrp: 822, price: 603, mrpAnnual: 300030, annual: 220095, pax: 9999 },
  ];

  const addons = [
    { id: 'a50', name: '50 PAX Membership', price: 1999, pax: 50 },
    { id: 'a100', name: '100 PAX Membership', price: 2999, pax: 100 },
    { id: 'a200', name: '200 PAX Membership', price: 3999, pax: 200 },
    { id: 'a500', name: '500 PAX Membership', price: 6999, pax: 500 },
    { id: 'a1000', name: '1000 PAX Membership', price: 9999, pax: 1000 },
    { id: 'a2000', name: '2000 PAX Membership', price: 14999, pax: 2000 },
  ];

  const activePlan = basePlans.find(p => p.id === selectedPlan);
  const availableAddons = activePlan ? addons.filter(a => a.pax < activePlan.pax) : [];
  
  const currentEntityName = (entityId === 'QUICK-QUOTE' ? (accounts.find(a => a.id === selectedAccount)?.name || "Manual Client") : entityName).toUpperCase();
  const currentEntityId = entityId === 'QUICK-QUOTE' ? selectedAccount : entityId;

  const baseValue = activePlan?.annual || 0;
  const totalAddonValue = selectedAddons.reduce((sum, id) => {
    const addon = addons.find(a => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);

  const totalBeforeDiscount = baseValue + totalAddonValue;
  const discountAmount = discountType === 'percent' ? (totalBeforeDiscount * discountValue) / 100 : discountValue;
  const grandTotal = totalBeforeDiscount - discountAmount;

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const downloadPDF = async () => {
    try {
      setLoading(true);
      const existingPdfBytes = await fetch('/template.pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();

      // Page 1: Template has "QUOTATION FOR" and "Issue Date:"
      if (pages.length >= 1) {
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        // Venue Name: Black, Size 45, Below "QUOTATION FOR"
        let venueFontSize = 45;
        const maxVenueWidth = width * 0.45;
        const currentWidth = font.widthOfTextAtSize(currentEntityName, venueFontSize);

        if (currentWidth > maxVenueWidth) {
          venueFontSize = Math.floor(venueFontSize * (maxVenueWidth / currentWidth));
        }

        // Position: Lowered from 0.28 to 0.21 to ensure it's completely below the purple text
        firstPage.drawText(currentEntityName, {
          x: 60,
          y: height * 0.21,
          size: venueFontSize,
          font,
          color: rgb(0, 0, 0)
        });

        // Date: Final-refined coordinates (X=185, Y=72)
        const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        firstPage.drawText(dateStr, { 
          x: 185, 
          y: 72, 
          size: 14, 
          font: normalFont, 
          color: rgb(0, 0, 0) 
        });
      }

      // Page 7: Commercial Proposal Page
      if (pages.length >= 7) {
        const p7 = pages[6];
        const { width, height } = p7.getSize();
        
        const startY = height * 0.72; 
        const rowHeight = 35;
        
        // 1. BASE PLAN (Standard vs Offer)
        const stdRateStr = `Rs. ${activePlan?.mrpAnnual?.toLocaleString() || '0'}`;
        p7.drawText(`${activePlan?.name || 'Standard Membership'} (Standard Rate)`, { x: width * 0.12, y: startY + 45, size: 16, font: normalFont, color: rgb(1, 1, 1) });
        p7.drawText(stdRateStr, { x: width * 0.88 - normalFont.widthOfTextAtSize(stdRateStr, 16), y: startY + 45, size: 16, font: normalFont, color: rgb(1, 1, 1) });

        // Highlight Offer Price with extra spacing
        p7.drawText(`Exclusive Partner Offer`, { x: width * 0.12, y: startY, size: 25, font, color: rgb(1, 1, 1) });
        const baseRateStr = `Rs. ${baseValue.toLocaleString()}`;
        p7.drawText(baseRateStr, { x: width * 0.88 - font.widthOfTextAtSize(baseRateStr, 25), y: startY, size: 25, font, color: rgb(1, 1, 1) });

        // 2. ADD-ONS BREAKDOWN
        let currentY = startY - rowHeight - 20;
        if (selectedAddons.length > 0) {
          selectedAddons.forEach((id) => {
            const a = addons.find(x => x.id === id);
            if (a) {
              p7.drawText(`+ ${a.name}`, { x: width * 0.12, y: currentY, size: 20, font: normalFont, color: rgb(1, 1, 1) });
              const addRateStr = `Rs. ${a.price.toLocaleString()}`;
              p7.drawText(addRateStr, { x: width * 0.88 - font.widthOfTextAtSize(addRateStr, 20), y: currentY, size: 20, font: normalFont, color: rgb(1, 1, 1) });
              currentY -= rowHeight;
            }
          });
        }

        // 3. DISCOUNT (IF ANY)
        if (discountAmount > 0) {
          currentY -= 10;
          p7.drawText(`- Special Discount`, { x: width * 0.12, y: currentY, size: 20, font: normalFont, color: rgb(1, 1, 1) });
          const discStr = `- Rs. ${discountAmount.toLocaleString()}`;
          p7.drawText(discStr, { x: width * 0.88 - font.widthOfTextAtSize(discStr, 20), y: currentY, size: 20, font: normalFont, color: rgb(1, 1, 1) });
          currentY -= rowHeight;
        }

        // 4. GRAND TOTAL
        currentY -= 30;
        p7.drawText(`GRAND TOTAL INVESTMENT`, { x: width * 0.12, y: currentY, size: 32, font, color: rgb(1, 1, 1) });
        const totalStr = `Rs. ${grandTotal.toLocaleString()}`;
        p7.drawText(totalStr, { x: width * 0.88 - font.widthOfTextAtSize(totalStr, 32), y: currentY, size: 32, font, color: rgb(1, 1, 1) });

        // 5. TOTAL SAVINGS LINE
        const totalSavings = ((activePlan?.mrpAnnual || 0) - (activePlan?.annual || 0)) + discountAmount;
        if (totalSavings > 0) {
          currentY -= 45;
          const savingsStr = `TOTAL PARTNER SAVINGS: Rs. ${Math.round(totalSavings).toLocaleString()}`;
          p7.drawText(savingsStr, { 
            x: width * 0.88 - font.widthOfTextAtSize(savingsStr, 14), 
            y: currentY, 
            size: 14, 
            font, 
            color: rgb(1, 1, 1) 
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Proposal_${currentEntityName.replace(/\s+/g, '_')}.pdf`;
      link.click();
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Error producing the Template-based Proposal.");
      setLoading(false);
    }
  };

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const resetForm = () => {
    setSelectedPlan(null);
    setSelectedAddons([]);
    setDiscountValue(0);
    setIsSuccess(false);
    setStep(entityId === 'QUICK-QUOTE' ? 0 : 1);
    setSelectedAccount("");
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="quotation-hub" className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.99, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className={cn("relative bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] transition-all", step === 0 ? "max-w-lg w-full" : "max-w-4xl w-full")}>

            {step === 0 ? (
              <div className="p-6 space-y-8 bg-white min-h-[300px]">
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-xl font-bold text-slate-900">Select Venue Partner</h2>
                  <button onClick={handleClose} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-900"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div className="relative group">
                    <select value={selectedAccount} onChange={(e) => { setSelectedAccount(e.target.value); if (e.target.value) setStep(1); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 text-base font-bold outline-none appearance-none cursor-pointer hover:border-slate-400 transition-all focus:bg-white focus:ring-2 focus:ring-slate-500/5">
                      <option value="">Search for a venue...</option>
                      {accounts.map(acc => (<option key={acc.id} value={acc.id}>{acc.name} — {acc.city}</option>))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><Users size={24} /></div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white"><IndianRupee size={20} /></div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Quotation Generator</h2>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{currentEntityName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entityId === 'QUICK-QUOTE' && <button onClick={() => setStep(0)} className="px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg transition-all mr-2">Change Partner</button>}
                    <button onClick={handleClose} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-900"><X size={20} /></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 custom-scrollbar bg-slate-50/5">
                  {isSuccess ? (
                    <div className="lg:col-span-12 py-16 text-center flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
                      <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-lg"><CheckCircle2 size={48} /></div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-950">Plan Ready</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 italic">Dossier Generated Successfully</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={downloadPDF} className="px-10 py-5 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                          {loading ? <Loader2 className="animate-spin" /> : <Download size={18} />} <span>Download Strategic Plan</span>
                        </button>
                        <button onClick={resetForm} className="px-8 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3">
                          <Plus size={18} /> <span>Create New</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="lg:col-span-7 space-y-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center"><Zap size={14} /></div>
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">01. Membership Plan</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {basePlans.map((plan) => (
                              <button key={plan.id} onClick={() => { setSelectedPlan(plan.id); setSelectedAddons([]); }} className={cn("p-4 rounded-xl border text-left transition-all relative bg-white", selectedPlan === plan.id ? "border-slate-900 ring-4 ring-slate-900/5 shadow-sm" : "border-slate-100 hover:border-slate-200 hover:shadow-sm")}>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">{plan.name}</p>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                     <span className="text-[10px] font-bold text-slate-400 line-through">₹{plan.mrp}</span>
                                     <span className="px-1.5 py-0.5 bg-pink-50 text-pink-500 text-[8px] font-bold rounded uppercase tracking-tighter">Save {Math.round((1 - plan.price/plan.mrp) * 100)}%</span>
                                  </div>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-slate-900">₹{plan.price}</span>
                                    <span className="text-[9px] font-bold text-slate-400">/DAY</span>
                                  </div>
                                </div>
                                {selectedPlan === plan.id && <div className="absolute top-3 right-3 text-slate-900"><CheckCircle2 size={18} fill="currentColor" className="text-white bg-slate-900 rounded-full" /></div>}
                              </button>
                            ))}
                          </div>
                        </div>

                        {selectedPlan && (
                          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center"><Target size={14} /></div>
                              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">02. Service Add-ons</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              {availableAddons.map((addon) => (
                                <button key={addon.id} onClick={() => toggleAddon(addon.id)} className={cn("p-4 rounded-xl border text-left transition-all flex items-center justify-between", selectedAddons.includes(addon.id) ? "border-emerald-500 bg-emerald-50/20" : "border-slate-100 bg-white hover:border-slate-300")}>
                                  <div>
                                    <p className="text-xs font-bold text-slate-900">{addon.name}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Capacity: {addon.pax} PAX</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs font-bold text-slate-900">₹{addon.price.toLocaleString()}</p>
                                    <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-tighter mt-0.5">{selectedAddons.includes(addon.id) ? "Selected" : "Add to plan"}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-5 h-fit lg:sticky lg:top-4 space-y-6">
                         {selectedPlan && (
                           <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                             <div className="flex items-center gap-2">
                               <div className="w-6 h-6 rounded bg-pink-50 text-pink-600 flex items-center justify-center"><Plus size={14} /></div>
                               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">03. Special Discount</h3>
                             </div>
                             <div className="flex items-center gap-2">
                               <div className="flex bg-slate-100 p-1 rounded-xl">
                                 <button onClick={() => { setDiscountValue(0); setDiscountType('percent'); }} className={cn("px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", discountType === 'percent' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}>%</button>
                                 <button onClick={() => { setDiscountValue(0); setDiscountType('value'); }} className={cn("px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", discountType === 'value' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}>₹</button>
                               </div>
                               <input 
                                 type="number" 
                                 value={discountValue || ""} 
                                 onChange={(e) => {
                                   const val = Number(e.target.value);
                                   if (discountType === 'percent') setDiscountValue(Math.min(val, 20));
                                   else setDiscountValue(Math.min(val, totalBeforeDiscount * 0.2));
                                 }} 
                                 className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-slate-300" 
                                 placeholder={discountType === 'percent' ? "Max 20%" : "Max 20% of total"} 
                               />
                             </div>
                           </div>
                         )}

                         <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="space-y-6 relative z-10">
                               <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><ShieldCheck size={16} /></div>
                                 <h4 className="text-[11px] font-bold uppercase tracking-widest">Investment Summary</h4>
                               </div>
                               <div className="space-y-4">
                                   <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span>Membership</span> <span>₹{baseValue.toLocaleString()}</span></div>
                                   {selectedAddons.length > 0 && <div className="flex justify-between text-[10px] font-bold text-emerald-400 uppercase tracking-widest"><span>Add-ons ({selectedAddons.length})</span> <span>+₹{totalAddonValue.toLocaleString()}</span></div>}
                                   {discountAmount > 0 && <div className="flex justify-between text-[10px] font-bold text-pink-500 uppercase tracking-widest"><span>Special Discount</span> <span>-₹{discountAmount.toLocaleString()}</span></div>}
                                   <div className="pt-6 border-t border-white/10 flex flex-col items-center gap-4">
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Net Yearly Amount (GST Inc)</p>
                                        <div className="text-5xl font-bold tracking-tighter italic">₹{grandTotal.toLocaleString()}</div>
                                   </div>
                               </div>
                            </div>
                            <button onClick={handleSend} disabled={!selectedPlan || loading} className={cn("w-full py-5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all mt-8", selectedPlan ? "bg-white text-slate-950 hover:bg-slate-50 hover:scale-[1.02]" : "bg-slate-800 text-slate-600 cursor-not-allowed")}>
                              {loading ? <Loader2 className="animate-spin inline mr-2" size={20} /> : <span>Activate Growth Plan</span>}
                            </button>
                         </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </AnimatePresence>
  );
}
