"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X, CheckCircle2, Loader2, Users, Plus, Download, IndianRupee, ShieldCheck, Zap, Target, Send, ArrowRight, FileText, MapPin, Search, ChevronRight, Home, Pencil
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { PDFDocument, rgb, StandardFonts, PDFName, PDFString, PDFArray } from 'pdf-lib';

interface SendQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  entityId: string;
}

// Optimization: Global cache to prevent redundant fetching on every modal open
let cachedVenues: any[] | null = null;

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

export default function SendQuotationModal({ isOpen, onClose, entityName, entityId }: SendQuotationModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percent' | 'value'>('percent');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [emailTo, setEmailTo] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualData, setManualData] = useState({ name: "", city: "", email: "", ownerName: "", phone: "", address: "", pincode: "", state: "" });
  const [venueSearch, setVenueSearch] = useState("");
  const [inlineEditing, setInlineEditing] = useState(false);

  const [venueDetails, setVenueDetails] = useState<any>(null);
  useEffect(() => {
    if (isOpen) {
      setStep(entityId === 'QUICK-QUOTE' ? 0 : 1);
      setManualMode(false);
      setManualData({ name: "", city: "", email: "", ownerName: "", phone: "", address: "", pincode: "", state: "" });
      setGstNumber("");
      setVenueSearch("");
    }
  }, [isOpen, entityId]);

  const [accounts, setAccounts] = useState<any[]>(cachedVenues || []);

  useEffect(() => {
    const fetchVenues = async () => {
      if (cachedVenues) return; // Skip if already loaded
      try {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
        const serverUrl = base.endsWith("/api") ? base : `${base}/api`;
        const res = await fetch(`${serverUrl}/venues`);
        const result = await res.json();
        if (result.status === 'success') {
          cachedVenues = result.data;
          setAccounts(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch venues for quotation:", err);
      }
    };
    if (isOpen) fetchVenues();
  }, [isOpen]);

  useEffect(() => {
    if (selectedAccount) {
      const acc = accounts.find(a => a.$id === selectedAccount);
      if (acc) {
         setVenueDetails(acc);
         setEmailTo(acc.contactEmail || acc.ownerEmail || acc.email || "");
      }
    } else if (entityId !== 'QUICK-QUOTE') {
       const acc = accounts.find(a => a.$id === entityId);
       if (acc) {
          setVenueDetails(acc);
          setEmailTo(acc.contactEmail || acc.ownerEmail || acc.email || "");
       }
    }
  }, [selectedAccount, accounts, entityId]);

  const activePlan = useMemo(() => basePlans.find(p => p.id === selectedPlan), [selectedPlan]);
  const availableAddons = useMemo(() => activePlan ? addons.filter(a => a.pax < activePlan.pax) : [], [activePlan]);
  
  const currentEntityName = useMemo(() => 
    manualMode ? manualData.name.toUpperCase() : (venueDetails?.venueName || entityName).toUpperCase(),
    [manualMode, manualData.name, venueDetails, entityName]
  );

  const currentEntityId = useMemo(() => 
    manualMode ? "MANUAL" : (venueDetails?.$id || entityId),
    [manualMode, venueDetails, entityId]
  );

  const baseValue = useMemo(() => activePlan?.annual || 0, [activePlan]);

  const totalAddonValue = useMemo(() => 
    selectedAddons.reduce((sum, id) => {
      const addon = addons.find(a => a.id === id);
      return sum + (addon?.price || 0);
    }, 0),
    [selectedAddons]
  );

  const totalBeforeDiscount = useMemo(() => baseValue + totalAddonValue, [baseValue, totalAddonValue]);

  const discountAmount = useMemo(() => 
    discountType === 'percent' ? (totalBeforeDiscount * discountValue) / 100 : discountValue,
    [discountType, totalBeforeDiscount, discountValue]
  );

  const grandTotal = useMemo(() => totalBeforeDiscount - discountAmount, [totalBeforeDiscount, discountAmount]);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleEditPartner = () => {
    // Sync current details to manualData to allow editing inline
    if (!manualMode && !inlineEditing) {
      const current = venueDetails || {};
      setManualData({
        name: current.venueName || current.name || "",
        city: current.city || "",
        state: current.state || "",
        email: current.contactEmail || current.ownerEmail || current.email || "",
        ownerName: current.ownerName || "",
        phone: current.contactNumber || current.phoneNumber || current.phone || "",
        address: current.address || "",
        pincode: current.pincode || ""
      });
    }
    setInlineEditing(true);
  };

  const generatePDFBytes = async () => {
    const existingPdfBytes = await fetch('/template.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    if (pages.length >= 1) {
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      let venueFontSize = 45;
      const maxVenueWidth = width * 0.45;
      const currentWidth = font.widthOfTextAtSize(currentEntityName, venueFontSize);
      if (currentWidth > maxVenueWidth) {
        venueFontSize = Math.floor(venueFontSize * (maxVenueWidth / currentWidth));
      }
      firstPage.drawText(currentEntityName, { x: 60, y: height * 0.21, size: venueFontSize, font, color: rgb(0, 0, 0) });
      const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      firstPage.drawText(dateStr, { x: 185, y: 72, size: 14, font: normalFont, color: rgb(0, 0, 0) });
    }

    if (pages.length >= 7) {
      const p7 = pages[6];
      const { width, height } = p7.getSize();
      const startY = height * 0.72; 
      const rowHeight = 35;
      const stdRateStr = `Rs. ${activePlan?.mrpAnnual?.toLocaleString() || '0'}`;
      p7.drawText(`${activePlan?.name || 'Standard Membership'} (Standard Rate)`, { x: width * 0.12, y: startY + 45, size: 16, font: normalFont, color: rgb(1, 1, 1) });
      p7.drawText(stdRateStr, { x: width * 0.88 - normalFont.widthOfTextAtSize(stdRateStr, 16), y: startY + 45, size: 16, font: normalFont, color: rgb(1, 1, 1) });
      p7.drawText(`Exclusive Partner Offer`, { x: width * 0.12, y: startY, size: 25, font, color: rgb(1, 1, 1) });
      const baseRateStr = `Rs. ${baseValue.toLocaleString()}`;
      p7.drawText(baseRateStr, { x: width * 0.88 - font.widthOfTextAtSize(baseRateStr, 25), y: startY, size: 25, font, color: rgb(1, 1, 1) });
      let currentY = startY - rowHeight - 20;
      selectedAddons.forEach((id) => {
        const a = addons.find(x => x.id === id);
        if (a) {
          p7.drawText(`+ ${a.name}`, { x: width * 0.12, y: currentY, size: 20, font: normalFont, color: rgb(1, 1, 1) });
          const addRateStr = `Rs. ${a.price.toLocaleString()}`;
          p7.drawText(addRateStr, { x: width * 0.88 - font.widthOfTextAtSize(addRateStr, 20), y: currentY, size: 20, font: normalFont, color: rgb(1, 1, 1) });
          currentY -= rowHeight;
        }
      });
      if (discountAmount > 0) {
        currentY -= 10;
        p7.drawText(`- Special Discount`, { x: width * 0.12, y: currentY, size: 20, font: normalFont, color: rgb(1, 1, 1) });
        const discStr = `- Rs. ${discountAmount.toLocaleString()}`;
        p7.drawText(discStr, { x: width * 0.88 - font.widthOfTextAtSize(discStr, 20), y: currentY, size: 20, font: normalFont, color: rgb(1, 1, 1) });
        currentY -= rowHeight;
      }
      currentY -= 30;
      p7.drawText(`GRAND TOTAL INVESTMENT`, { x: width * 0.12, y: currentY, size: 32, font, color: rgb(1, 1, 1) });
      const totalStr = `Rs. ${grandTotal.toLocaleString()}`;
      p7.drawText(totalStr, { x: width * 0.88 - font.widthOfTextAtSize(totalStr, 32), y: currentY, size: 32, font, color: rgb(1, 1, 1) });
      
      currentY -= 80;
      const btnX = width * 0.12;
      const btnY = currentY - 15;
      const btnWidth = 180;
      const btnHeight = 45;

      // Draw ENROLL NOW Button
      p7.drawRectangle({
        x: btnX,
        y: btnY,
        width: btnWidth,
        height: btnHeight,
        color: rgb(1, 1, 1),
        opacity: 0.9
      });
      p7.drawText(`ENROLL NOW`, {
        x: btnX + 40,
        y: currentY,
        size: 15,
        font,
        color: rgb(0, 0, 0)
      });

      // Add clickable link to the button area
      const linkAnnotation = pdfDoc.context.obj({
        Type: 'Annot',
        Subtype: 'Link',
        Rect: [btnX, btnY, btnX + btnWidth, btnY + btnHeight],
        Border: [0, 0, 0],
        A: {
          Type: 'Action',
          S: 'URI',
          URI: PDFString.of(checkoutLink),
        },
      });

      const annots = p7.node.get(PDFName.of('Annots')) as PDFArray | undefined;
      if (annots) {
        annots.push(linkAnnotation);
      } else {
        p7.node.set(PDFName.of('Annots'), pdfDoc.context.obj([linkAnnotation]));
      }

      const payStr = `Secure Link: ${checkoutLink}`;
      p7.drawText(payStr, { x: width * 0.12, y: currentY - 30, size: 7, font: normalFont, color: rgb(1, 1, 1) });
    }
    return await pdfDoc.save();
  };

  const downloadPDF = async () => {
    try {
      setLoading(true);
      const pdfBytes = await generatePDFBytes();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Proposal_${currentEntityName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      setLoading(false);
    } catch (error) {
      console.error("PDF Production Error:", error);
      setLoading(false);
    }
  };

  const [origin, setOrigin] = useState("");
  useEffect(() => { setOrigin(window.location.origin); }, []);

  const checkoutLink = useMemo(() => {
    let link = `${origin}/checkout?venueId=${currentEntityId}&planId=${selectedPlan}`;
    if (selectedAddons.length > 0) link += `&addonId=${selectedAddons[0]}`;
    if (discountType === 'percent' && discountValue > 0) link += `&discount=${discountValue}`;
    if (gstNumber) link += `&gst=${gstNumber}`;
    
    // Add manual details if in manual mode OR if details were edited inline
    if (manualMode || inlineEditing) {
      const pData = {
        name: manualData.name,
        owner: manualData.ownerName,
        phone: manualData.phone,
        email: manualData.email,
        address: manualData.address,
        city: manualData.city,
        state: manualData.state,
        pincode: manualData.pincode
      };
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(pData))));
      link += `&partnerDetails=${encoded}`;
    }
    return link;
  }, [origin, currentEntityId, selectedPlan, selectedAddons, discountType, discountValue, gstNumber, manualMode, inlineEditing, manualData]);


  const handleSend = () => {
    setLoading(true);
    // Here we can also call a server-side route to save the quotation record
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleSendEmail = async () => {
    if (!emailTo) return alert("Please enter a valid email address.");
    setEmailLoading(true);
    try {
      const pdfBytes = await generatePDFBytes();
      
      const base64Pdf = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(new Blob([pdfBytes]));
      });

      const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5005/api";
      const serverUrl = base.endsWith("/api") ? base : `${base}/api`;
      const res = await fetch(`${serverUrl}/quotations/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           email: emailTo,
           venueName: currentEntityName,
           planName: activePlan?.name,
           amount: grandTotal,
           checkoutLink,
           pdfData: base64Pdf
        })
      });
      const result = await res.json();
      if (result.status === 'success') {
        alert("Success! Proposal has been delivered to " + emailTo);
      } else {
        alert(result.message || "Email delivery failed.");
      }
     } catch (e: any) {
      console.error("Email send technical error:", e);
      alert("Error: " + (e.message || "Could not send email. Check console for details."));
    } finally {
      setEmailLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedPlan(null);
    setSelectedAddons([]);
    setDiscountValue(0);
    setIsSuccess(false);
    setStep(entityId === 'QUICK-QUOTE' ? 0 : 1);
    setSelectedAccount("");
    setManualMode(false);
    setManualData({ name: "", city: "", email: "", ownerName: "", phone: "", address: "", pincode: "", state: "" });
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
              <div className="p-8 space-y-8 bg-white min-h-[400px]">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Select Venue Partner</h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">Select existing or create manual quote</p>
                  </div>
                  <button onClick={handleClose} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-900"><X size={20} /></button>
                </div>

                {!manualMode ? (
                  <div className="space-y-6">
                    <div className="relative group">
                       <input 
                         type="text" 
                         placeholder="Type to search venue..."
                         value={venueSearch}
                         onChange={(e) => setVenueSearch(e.target.value)}
                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 pl-14 text-sm font-black text-slate-700 outline-none focus:bg-white focus:border-violet-500 transition-all shadow-sm"
                       />
                       <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2 pr-2">
                       {accounts
                         .filter(acc => 
                           !venueSearch || 
                           (acc.venueName || acc.name || "").toLowerCase().includes(venueSearch.toLowerCase()) ||
                           (acc.city || "").toLowerCase().includes(venueSearch.toLowerCase())
                         )
                         .slice(0, 50)
                         .map(acc => (
                           <button 
                             key={acc.$id} 
                             onClick={() => { setSelectedAccount(acc.$id); setStep(1); }}
                             className="w-full p-4 rounded-2xl border-2 border-slate-50 hover:border-violet-200 hover:bg-violet-50/50 transition-all text-left flex items-center justify-between group bg-white shadow-sm"
                           >
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-violet-500 transition-colors">
                                   <Home size={18} />
                                </div>
                                <div>
                                   <p className="text-sm font-black text-slate-700 group-hover:text-violet-600 transition-colors uppercase tracking-tight">{acc.venueName || acc.name}</p>
                                   <div className="flex items-center gap-2 mt-0.5">
                                      <MapPin size={10} className="text-slate-300" />
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{acc.city} — {acc.pincode}</p>
                                   </div>
                                </div>
                             </div>
                             <ChevronRight size={18} className="text-slate-200 group-hover:text-violet-500 transition-all translate-x-0 group-hover:translate-x-1" />
                           </button>
                         ))}
                       {accounts.filter(acc => !venueSearch || (acc.venueName || acc.name || "").toLowerCase().includes(venueSearch.toLowerCase())).length === 0 && (
                          <div className="py-12 text-center">
                             <p className="text-xs font-black uppercase tracking-widest text-slate-300 italic">No venues match your search</p>
                          </div>
                       )}
                    </div>
                    
                    <div className="flex items-center gap-4 py-2">
                       <div className="flex-1 h-px bg-slate-100" />
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</span>
                       <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <button 
                      onClick={() => setManualMode(true)}
                      className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                    >
                      New Prospect (Manual Entry)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">New Venue Name</label>
                        <input 
                           type="text" 
                           placeholder="e.g. Grand Empire Hall"
                           value={manualData.name}
                           onChange={(e) => setManualData({...manualData, name: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none focus:border-violet-500"
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-1">City</label>
                           <input 
                              type="text" 
                              placeholder="e.g. Delhi"
                              value={manualData.city}
                              onChange={(e) => setManualData({...manualData, city: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none focus:border-violet-500"
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-1">State</label>
                           <input 
                              type="text" 
                              placeholder="e.g. Haryana"
                              value={manualData.state}
                              onChange={(e) => setManualData({...manualData, state: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none focus:border-violet-500"
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email</label>
                           <input 
                              type="email" 
                              placeholder="contact@venue.com"
                              value={manualData.email}
                              onChange={(e) => {
                                setManualData({...manualData, email: e.target.value});
                                setEmailTo(e.target.value);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none focus:border-violet-500"
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Owner Name</label>
                           <input 
                              type="text" 
                              placeholder="Owner Name"
                              value={manualData.ownerName}
                              onChange={(e) => setManualData({...manualData, ownerName: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none focus:border-violet-500"
                           />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Contact Phone</label>
                        <input 
                           type="text" 
                           placeholder="Phone Number"
                           value={manualData.phone}
                           onChange={(e) => setManualData({...manualData, phone: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none focus:border-violet-500"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Billing Address</label>
                        <textarea 
                           placeholder="Enter full address..."
                           value={manualData.address}
                           onChange={(e) => setManualData({...manualData, address: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none focus:border-violet-500 min-h-[80px] resize-none"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Pincode</label>
                        <input 
                           type="text" 
                           placeholder="Pincode"
                           value={manualData.pincode}
                           onChange={(e) => setManualData({...manualData, pincode: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none focus:border-violet-500"
                        />
                     </div>

                     <div className="pt-4 flex gap-3">
                        <button onClick={() => setManualMode(false)} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100">Cancel</button>
                        <button 
                           disabled={!manualData.name || !manualData.city}
                           onClick={() => setStep(1)} 
                           className="flex-[2] py-4 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-700 disabled:opacity-50 shadow-lg shadow-violet-600/20 transition-all"
                        >
                           Continue Configuration
                        </button>
                     </div>
                  </div>
                )}
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
                    {step === 1 && <button onClick={() => setStep(0)} className="px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg transition-all mr-2">Change Partner</button>}
                    {step === 2 && <button onClick={() => setStep(1)} className="px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg transition-all mr-2">Back to Details</button>}
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
                      <div className="flex flex-col items-center gap-4 w-full max-w-md">
                        <button onClick={downloadPDF} disabled={loading} className="w-full px-10 py-5 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                          {loading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} <span>Download PDF Proposal</span>
                        </button>
                        
                        <div className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-2">
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-left ml-1">Share One-Click Payment Link</p>
                           <div className="flex gap-2">
                              <input 
                                readOnly 
                                value={checkoutLink} 
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-bold text-slate-500 outline-none"
                              />
                              <button 
                                onClick={() => { navigator.clipboard.writeText(checkoutLink); alert("Link copied to clipboard!"); }}
                                className="px-4 py-3 bg-violet-100 text-violet-600 rounded-xl text-[10px] font-black uppercase hover:bg-violet-200 transition-all font-black"
                              >
                                Copy
                              </button>
                           </div>
                        </div>

                        <div className="w-full p-6 bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl flex flex-col gap-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center"><Send size={14} /></div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deploy via Email</p>
                           </div>
                           <div className="space-y-3">
                              <input 
                                placeholder="partner@email.com"
                                value={emailTo}
                                onChange={(e) => setEmailTo(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-violet-500 transition-all"
                              />
                              <button 
                                onClick={handleSendEmail}
                                disabled={emailLoading || !emailTo}
                                className="w-full h-14 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                              >
                                {emailLoading ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
                                Deliver Interactive Proposal
                              </button>
                           </div>
                        </div>

                        <button onClick={resetForm} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors py-4">
                           Create Another Quotation
                        </button>
                      </div>
                    </div>
                  ) : step === 1 ? (
                    <div className="lg:col-span-12 max-w-2xl mx-auto w-full space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
                          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                             <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center"><Users size={20} /></div>
                             <div>
                                <h3 className="text-base font-black text-slate-800 uppercase tracking-widest">Review Partner Details</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Auto-populated from venue profile</p>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 relative group/card">
                                 <div className="flex items-center justify-between">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Venue Owner name</label>
                                    {!inlineEditing && (
                                       <button onClick={handleEditPartner} className="text-violet-400 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                          <Pencil size={10} />
                                       </button>
                                    )}
                                 </div>
                                 {inlineEditing ? (
                                    <input 
                                       type="text"
                                       value={manualData.ownerName}
                                       onChange={(e) => setManualData({...manualData, ownerName: e.target.value})}
                                       className="w-full bg-white border border-violet-100 rounded-lg px-2 py-1 text-xs font-black text-slate-700 outline-none focus:border-violet-500"
                                       autoFocus
                                    />
                                 ) : (
                                    <div className="text-xs font-black text-slate-700">{manualMode ? manualData.ownerName : (venueDetails?.ownerName || "—")}</div>
                                 )}
                              </div>
                              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 relative group/card">
                                 <div className="flex items-center justify-between">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Venue name</label>
                                    {!inlineEditing && (
                                       <button onClick={handleEditPartner} className="text-violet-400 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                          <Pencil size={10} />
                                       </button>
                                    )}
                                 </div>
                                 {inlineEditing ? (
                                    <input 
                                       type="text"
                                       value={manualData.name}
                                       onChange={(e) => setManualData({...manualData, name: e.target.value})}
                                       className="w-full bg-white border border-violet-100 rounded-lg px-2 py-1 text-xs font-black text-slate-700 outline-none focus:border-violet-500"
                                    />
                                 ) : (
                                    <div className="text-xs font-black text-slate-700">{manualMode ? manualData.name : currentEntityName}</div>
                                 )}
                              </div>
                              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                 <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Contact Number</label>
                                 <div className="text-xs font-black text-slate-700">{manualMode ? manualData.phone : (venueDetails?.contactNumber || "—")}</div>
                              </div>
                              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                 <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Email address</label>
                                 <div className="text-xs font-black text-slate-700 truncate">{emailTo}</div>
                              </div>
                              
                              <div className="space-y-1.5 p-4 rounded-2xl bg-white border-2 border-slate-100 shadow-sm col-span-2 relative group/card">
                                 <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                       <MapPin size={12} className="text-violet-500" />
                                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Billing Address Details</label>
                                    </div>
                                    {!inlineEditing && (
                                       <button onClick={handleEditPartner} className="text-violet-400 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                          <Pencil size={12} />
                                       </button>
                                    )}
                                 </div>
                                 <div className="space-y-3">
                                    <div className="text-[11px] font-bold text-slate-600 leading-relaxed min-h-[40px] border-b border-slate-50 pb-2">
                                       {inlineEditing ? (
                                          <textarea 
                                             value={manualData.address}
                                             onChange={(e) => setManualData({...manualData, address: e.target.value})}
                                             className="w-full bg-white border border-violet-100 rounded-lg p-2 text-[10px] font-bold text-slate-700 outline-none focus:border-violet-500 min-h-[60px] resize-none"
                                             placeholder="Enter full address..."
                                          />
                                       ) : (
                                          manualMode ? (manualData.address || "Street address not provided") : (venueDetails?.address || "Street address not provided in profile")
                                       )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                       <div>
                                          <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">City / State</p>
                                          {inlineEditing ? (
                                             <div className="flex gap-1 mt-1">
                                                <input 
                                                   type="text" placeholder="City"
                                                   value={manualData.city}
                                                   onChange={(e) => setManualData({...manualData, city: e.target.value})}
                                                   className="w-full bg-white border border-violet-100 rounded-md px-1 py-0.5 text-[8px] font-bold outline-none"
                                                />
                                                <input 
                                                   type="text" placeholder="State"
                                                   value={manualData.state}
                                                   onChange={(e) => setManualData({...manualData, state: e.target.value})}
                                                   className="w-full bg-white border border-violet-100 rounded-md px-1 py-0.5 text-[8px] font-bold outline-none"
                                                />
                                             </div>
                                          ) : (
                                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                {manualMode ? `${manualData.city || "—"} / ${manualData.state || "—"}` : `${venueDetails?.city || "—"} / ${venueDetails?.state || "—"}`}
                                             </p>
                                          )}
                                       </div>
                                       <div>
                                          <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Zip Code</p>
                                          {inlineEditing ? (
                                             <input 
                                                type="text" placeholder="Pincode"
                                                value={manualData.pincode}
                                                onChange={(e) => setManualData({...manualData, pincode: e.target.value})}
                                                className="w-full bg-white border border-violet-100 rounded-md px-1 py-1 mt-1 text-[8px] font-bold outline-none"
                                             />
                                          ) : (
                                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                {manualMode ? (manualData.pincode || "—") : (venueDetails?.pincode || "—")}
                                             </p>
                                          )}
                                       </div>
                                    </div>
                                    {inlineEditing && (
                                       <button 
                                          onClick={() => { setInlineEditing(false); setManualMode(true); }}
                                          className="w-full py-2 bg-violet-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-violet-700 transition-all mt-2"
                                       >
                                          Save Changes
                                       </button>
                                    )}
                                 </div>
                              </div>
                          </div>

                          <div className="pt-4 border-t border-slate-50">
                             <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-900 ml-1 flex items-center gap-2 italic">
                                   <Plus size={12} strokeWidth={3} /> GST Number 
                                </label>
                                <input 
                                   type="text" 
                                   placeholder="Admin manual entry if applicable..."
                                   value={gstNumber}
                                   onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                                   className="w-full bg-white border-2 border-slate-200 rounded-xl p-4 text-sm font-black text-slate-800 outline-none focus:border-violet-500 transition-all shadow-sm" 
                                />
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-1 mt-1">This will be reflected in the professional dossier</p>
                             </div>
                          </div>
                          
                          <button 
                             onClick={() => setStep(2)}
                             className="w-full py-5 grad-brand text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-500/10 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 mt-4"
                          >
                             Verify & Select Plan <ArrowRight size={18} />
                          </button>
                       </div>
                    </div>
                  ) : (
                    <>
                      <div className="lg:col-span-7 space-y-8 animate-in fade-in duration-500">
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

                      <div className="lg:col-span-5 h-fit lg:sticky lg:top-4 space-y-6 animate-in fade-in duration-500">
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
