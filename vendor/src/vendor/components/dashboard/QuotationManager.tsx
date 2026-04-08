'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { storage, ID, STORAGE_BUCKET_ID, PROJECT_ID, ENDPOINT } from '@/lib/appwrite';
import { 
  FileText, 
  CheckCircle2, 
  X, 
  Download, 
  Send, 
  IndianRupee, 
  CalendarDays, 
  Users, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  MessageCircle, 
  Printer, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Image as ImageIcon,
  Wifi,
  Wind,
  Coffee,
  Music,
  Car,
  Utensils,
  User
} from 'lucide-react';
import Image from 'next/image';

interface LineItem {
  id: number;
  label: string;
  amount: number;
}

interface QuoteData {
  client: string;
  contact: string;
  email: string;
  event: string;
  eventDate: string;
  guestCount: string;
  specialRequests: string;
  gstRate: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  extraCharges: number;
  lineItems: LineItem[];
  selectedImages: string[];
  leadId?: string;
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
  venueProfile: any;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const AMENITY_ICONS: { [key: string]: any } = {
  'WIFI': <Wifi size={14} />,
  'AC': <Wind size={14} />,
  'Parking': <Car size={14} />,
  'Catering': <Utensils size={14} />,
  'Music': <Music size={14} />,
  'Coffee': <Coffee size={14} />,
  'Pool': <ShieldCheck size={14} />,
  'Garden': <Star size={14} />,
  'Bar': <Star size={14} />,
};

const QuotationManager = ({
  quoteData,
  setQuoteData,
  handleFinalize,
  isFinalizing,
  qtnSuccess,
  setActiveTab,
  logo,
  handleDownload,
  handleSend,
  venueProfile,
  showToast
}: QuotationManagerProps) => {


  // Automatically fetch lead details if leadId is provided
  useEffect(() => {
    const fetchLeadDetails = async () => {
      if (quoteData.leadId) {
        try {
          const { databases, DATABASE_ID, LEADS_COLLECTION_ID } = await import('@/lib/appwrite');
          const leadDoc = await databases.getDocument(DATABASE_ID, LEADS_COLLECTION_ID, quoteData.leadId);
          
          if (leadDoc) {
            setQuoteData((prev: any) => ({
              ...prev,
              client: leadDoc.name || prev.client,
              contact: leadDoc.phone || prev.contact,
              email: leadDoc.email || prev.email,
              guestCount: leadDoc.guests ? leadDoc.guests.toString() : prev.guestCount,
              // Only clear leadId after successful fetch to prevent infinite loop
              // but we want to keep it to know we already fetched for this ID
              // So we can check if data matches
            }));
          }
        } catch (err) {
          console.error('Failed to fetch lead details:', err);
        }
      }
    };

    fetchLeadDetails();
  }, [quoteData.leadId]);
  const calculateTotal = () => {
    const linesTotal = quoteData.lineItems.reduce((acc, item) => acc + item.amount, 0);
    const discountAmt = quoteData.discountType === 'percentage' 
      ? (linesTotal * quoteData.discountValue) / 100 
      : quoteData.discountValue;
    
    const taxableTotal = linesTotal - discountAmt + quoteData.extraCharges;
    const gstAmt = (taxableTotal * quoteData.gstRate) / 100;
    const total = taxableTotal + gstAmt;
    
    return {
      subtotal: linesTotal,
      discountAmt,
      taxableTotal,
      gstAmt,
      total
    };
  };

  const { subtotal, discountAmt, taxableTotal, gstAmt, total } = calculateTotal();

   const [isGenerating, setIsGenerating] = useState(false);
   const [isSharing, setIsSharing] = useState(false);
   const quotationRef = useRef<HTMLDivElement>(null);

    const generatePdfBlob = async (): Promise<Blob | null> => {
       if (!quotationRef.current) return null;
       
       const canvas = await html2canvas(quotationRef.current, {
          scale: 2, // High fidelity capture
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc) => {
             // 1. Find the preview element in the clone using its ID
             const el = clonedDoc.getElementById('quotation-preview-doc');
             if (el) {
                el.style.display = 'flex';
                el.style.visibility = 'visible';
                el.style.boxShadow = 'none';
                el.style.transform = 'none';
             }

             // 2. Sanitize all <style> tags in the head to prevent html2canvas parser crashes
             const styles = clonedDoc.getElementsByTagName('style');
             const colorRegex = /(oklch|oklab|lab|lch|color-mix|color)\s*\([^\)]+\)/gi;
             for (let i = 0; i < styles.length; i++) {
                if (styles[i].innerHTML) {
                   styles[i].innerHTML = styles[i].innerHTML.replace(colorRegex, '#94a3b8');
                }
             }

             // 3. Iterate through all elements to fix any inline styles or problematic attributes
             const allElements = clonedDoc.getElementsByTagName('*');
             for (let i = 0; i < allElements.length; i++) {
                const node = allElements[i] as HTMLElement;
                
                // Fix inline style attributes
                if (node.hasAttribute('style')) {
                   const styleStr = node.getAttribute('style') || '';
                   node.setAttribute('style', styleStr.replace(colorRegex, '#94a3b8'));
                }

                // Fix SVG-specific color attributes that often use modern colors
                if (node.nodeName.toLowerCase() === 'path' || node.nodeName.toLowerCase() === 'circle' || node.nodeName.toLowerCase() === 'svg') {
                   ['fill', 'stroke'].forEach(attr => {
                      const val = node.getAttribute(attr);
                      if (val) {
                         node.setAttribute(attr, val.replace(colorRegex, '#94a3b8'));
                      }
                   });
                }
             }
          }
       });
       
       const imgData = canvas.toDataURL('image/png', 1.0);
       const pdf = new jsPDF('p', 'mm', 'a4');
       
       const pdfWidth = pdf.internal.pageSize.getWidth();
       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
       
       // Multi-page handling logic
       const pageHeight = pdf.internal.pageSize.getHeight();
       let heightLeft = pdfHeight;
       let position = 0;

       // Add first page
       pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
       heightLeft -= pageHeight;

       // Add subsequent pages if content is longer than one page
       while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
       }
       
       return pdf.output('blob');
    };

   const downloadAsPDF = async () => {
      try {
         setIsGenerating(true);
         showToast('Preparing PDF for download...', 'success');
         const blob = await generatePdfBlob();
         if (!blob) return;
         
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = `Quotation_${quoteData.client.replace(/\s+/g, '_')}.pdf`;
         link.click();
         URL.revokeObjectURL(url);
         showToast('Quotation downloaded successfully!', 'success');
      } catch (error: any) {
         console.error('PDF Generation Error:', error);
         showToast(`Generation failed: ${error.message || 'Please try again'}`, 'error');
      } finally {
         setIsGenerating(false);
      }
   };

    const handleWhatsAppShare = async () => {
       setIsSharing(true);
       try {
          if (!quotationRef.current) {
             throw new Error('Quotation preview not found');
          }

          showToast('Preparing your shareable proposal...', 'success');
          
          const blob = await generatePdfBlob();
          if (!blob) throw new Error('Failed to generate PDF');
          
          // Upload to Appwrite Storage
          const fileName = `Quotation_${quoteData.client.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
          const file = new File([blob], fileName, { type: 'application/pdf' });
          const uploadedFile = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file);
          
          // Get View URL
          const fileUrl = `${ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${PROJECT_ID}`;
          
          // Format phone number (ensure country code for India if missing)
          let phone = quoteData.contact.replace(/\D/g, '');
          if (phone.length === 10) phone = '91' + phone;

          const message = `*PROPOSAL FROM ${venueProfile?.venueName || 'Our Venue'}*\n\n` +
                          `Hello ${quoteData.client},\n` +
                          `We are pleased to share the proposal for your event.\n\n` +
                          `📄 *View Quotation:* ${fileUrl}\n\n` +
                          `*Details:*\n` +
                          `• Guest Count: ${quoteData.guestCount}\n` +
                          `• Grand Total: ₹${total.toLocaleString('en-IN')}\n\n` +
                          `_Generated via Party Dial AI Engine_`;

          const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
          
          window.open(waUrl, '_blank', 'noopener,noreferrer');
          
          showToast('Quotation shared successfully!', 'success');
       } catch (error: any) {
          console.error('WhatsApp Share Error:', error);
          showToast(`Sharing failed: ${error.message || 'Please try again'}`, 'error');
       } finally {
          setIsSharing(false);
       }
    };

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="min-h-screen -mt-10 -mx-4 md:-mx-10 bg-[#F8FAFC]/50 flex flex-col printable-container"
    >
       {/* Executive Status Bar */}
       <div className="bg-[#0F172A] px-4 lg:px-10 py-4 lg:py-6 flex items-center justify-between sticky top-0 z-40 shadow-xl no-print">
          <div className="flex items-center gap-3 lg:gap-6">
             <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 scale-90 lg:scale-100">
                <FileText size={20} className="opacity-90" />
             </div>
             <div>
                <h1 className="text-[11px] lg:text-base font-black italic text-white uppercase tracking-wider leading-none">Executive <span className="text-pink-500">Proposal</span></h1>
                <div className="flex items-center gap-2 lg:gap-3 mt-1.5 lg:mt-2">
                   <p className="hidden sm:block text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-700 pr-3">Session: #QTN-{new Date().getTime().toString().slice(-4)}</p>
                   <p className="text-[8px] lg:text-[10px] font-black text-emerald-500 uppercase tracking-widest">Authenticated</p>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-3 lg:gap-6">
             <button 
                onClick={() => setActiveTab('overview')} 
                className="hidden lg:block text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all tracking-widest px-4 py-2 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10"
             >
                Discard Draft
             </button>
             <button 
               onClick={handleFinalize}
               disabled={isFinalizing || qtnSuccess}
               className={`px-6 lg:px-10 py-3 lg:py-3.5 rounded-xl lg:rounded-2xl text-[9px] lg:text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 lg:gap-3 shadow-2xl relative group ${
                 qtnSuccess 
                 ? 'bg-emerald-500 text-white' 
                 : isFinalizing 
                   ? 'bg-slate-800 text-slate-400' 
                   : 'bg-white text-slate-900 hover:scale-105 active:scale-95'
               }`}
             >
                {isFinalizing ? (
                   <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                ) : qtnSuccess ? (
                   <CheckCircle2 size={16} />
                 ) : <FileText size={14} className="text-pink-500 group-hover:rotate-12" />}
                {isFinalizing ? '...' : qtnSuccess ? 'Finalized' : 'Finalize'}
             </button>
          </div>
       </div>

       <div className="flex-1 flex flex-col lg:flex-row printable-container relative">
          {/* LEFT: ADVANCED FORM SECTION - STICKY */}
          <div className="w-full lg:w-[500px] bg-white border-r border-slate-200/50 p-6 lg:p-10 no-print lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] lg:overflow-y-auto custom-scrollbar shadow-sm z-10">
             <div className="space-y-12">
                

                {/* Section: Customer Details */}
                <section className="space-y-10">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
                         <Users size={20} />
                      </div>
                      <div>
                         <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Client Profile</h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Identification & Outreach</p>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                         <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Entity Name</label>
                            <div className="relative group">
                               <input 
                                  type="text" 
                                  value={quoteData.client}
                                  onChange={(e) => setQuoteData({ ...quoteData, client: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl py-4 px-6 text-[13px] font-bold text-slate-900 outline-none focus:border-pink-500 focus:bg-white transition-all shadow-sm"
                                  placeholder="e.g. Suman Saxena"
                               />
                               <User size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-500 transition-colors" />
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2.5">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact No.</label>
                               <div className="relative group">
                                  <input 
                                     type="text" 
                                     value={quoteData.contact}
                                     onChange={(e) => setQuoteData({ ...quoteData, contact: e.target.value })}
                                     className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl py-4 px-6 text-[13px] font-bold text-slate-900 outline-none focus:border-pink-500 focus:bg-white transition-all shadow-sm"
                                     placeholder="9876543210"
                                  />
                                  <Phone size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" />
                               </div>
                            </div>
                            <div className="space-y-2.5">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Hash</label>
                               <div className="relative group">
                                  <input 
                                     type="email" 
                                     value={quoteData.email}
                                     onChange={(e) => setQuoteData({ ...quoteData, email: e.target.value })}
                                     className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl py-4 px-6 text-[13px] font-bold text-slate-900 outline-none focus:border-pink-500 focus:bg-white transition-all shadow-sm"
                                     placeholder="client@mail.com"
                                  />
                                  <Mail size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </section>

                {/* Section: Event Specifications */}
                <section className="space-y-10">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                         <CalendarDays size={20} />
                      </div>
                      <div>
                         <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Event Matrix</h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Timeline & Volume</p>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nature of Celebration</label>
                         <select 
                            value={quoteData.event}
                            onChange={(e) => setQuoteData({ ...quoteData, event: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl py-4 px-6 text-[13px] font-bold text-slate-900 outline-none focus:border-pink-500 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
                         >
                            <option>Wedding Ceremony</option>
                            <option>Corporate Gala</option>
                            <option>Cocktail Party</option>
                            <option>Birthday Bash</option>
                            <option>Anniversary Celebration</option>
                         </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Date</label>
                            <input 
                               type="date" 
                               value={quoteData.eventDate}
                               onChange={(e) => setQuoteData({ ...quoteData, eventDate: e.target.value })}
                               className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl py-4 px-6 text-[13px] font-bold text-slate-900 outline-none focus:border-pink-500 focus:bg-white transition-all shadow-sm"
                            />
                         </div>
                         <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pax Count</label>
                            <div className="relative">
                               <input 
                                  type="number" 
                                  value={quoteData.guestCount}
                                  onChange={(e) => setQuoteData({ ...quoteData, guestCount: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl py-4 px-6 text-[13px] font-bold text-slate-900 outline-none focus:border-pink-500 focus:bg-white transition-all shadow-sm"
                                  placeholder="500"
                               />
                               <Users size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" />
                            </div>
                         </div>
                      </div>
                      <div className="space-y-2.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Directives</label>
                         <textarea 
                            rows={4}
                            value={quoteData.specialRequests}
                            onChange={(e) => setQuoteData({ ...quoteData, specialRequests: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl py-4 px-6 text-[13px] font-bold text-slate-900 outline-none focus:border-pink-500 focus:bg-white transition-all shadow-sm resize-none"
                            placeholder="Add specific requirements or project notes..."
                         />
                      </div>
                   </div>
                </section>

                {/* Section: Fiscal Architecture */}
                <section className="space-y-10">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                            <IndianRupee size={20} />
                         </div>
                         <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Fiscal Structure</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Levy & Discounts</p>
                         </div>
                      </div>
                      <button 
                         onClick={() => setQuoteData({
                            ...quoteData,
                            lineItems: [...quoteData.lineItems, { id: Date.now(), label: 'New Revenue Stream', amount: 0 }]
                         })}
                         className="flex items-center gap-2 text-[10px] font-black text-pink-500 uppercase tracking-widest bg-pink-50 px-4 py-2 rounded-xl border border-pink-100 hover:bg-pink-500 hover:text-white transition-all"
                      >
                         <Plus size={12} />
                         Stream
                      </button>
                   </div>

                   {/* Line Items */}
                   <div className="space-y-4">
                      <AnimatePresence>
                         {quoteData.lineItems.map((item, idx) => (
                            <motion.div 
                               layout
                               initial={{ opacity: 0, x: -20 }}
                               animate={{ opacity: 1, x: 0 }}
                               exit={{ opacity: 0, scale: 0.95 }}
                               key={item.id} 
                               className="p-8 bg-white rounded-3xl border border-slate-200/60 space-y-6 relative group hover:border-pink-500/50 hover:shadow-xl transition-all duration-500"
                            >
                               <button 
                                  onClick={() => {
                                     const newItems = quoteData.lineItems.filter((_, i) => i !== idx);
                                     setQuoteData({ ...quoteData, lineItems: newItems });
                                  }}
                                  className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                               >
                                  <Trash2 size={16} />
                               </button>
                               
                               <div className="space-y-2">
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue Allocation</label>
                                  <input 
                                     type="text" 
                                     value={item.label}
                                     onChange={(e) => {
                                        const newItems = [...quoteData.lineItems];
                                        newItems[idx].label = e.target.value;
                                        setQuoteData({ ...quoteData, lineItems: newItems });
                                     }}
                                     className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-slate-900 outline-none focus:ring-1 ring-pink-500 transition-all"
                                     placeholder="e.g. Wedding Catering Layer"
                                  />
                               </div>
                               
                               <div className="flex items-center gap-4">
                                  <div className="flex-1 space-y-2">
                                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount (INR)</label>
                                     <div className="relative">
                                        <input 
                                           type="number" 
                                           value={item.amount}
                                           onChange={(e) => {
                                              const newItems = [...quoteData.lineItems];
                                              newItems[idx].amount = parseInt(e.target.value) || 0;
                                              setQuoteData({ ...quoteData, lineItems: newItems });
                                           }}
                                           className="w-full bg-slate-50 border-none rounded-xl py-3 pl-8 pr-4 text-xs font-black text-slate-900 outline-none focus:ring-1 ring-pink-500 transition-all"
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-300">₹</span>
                                     </div>
                                  </div>
                               </div>
                            </motion.div>
                         ))}
                      </AnimatePresence>
                   </div>

                   {/* Discount & Extras - Reduced Size */}
                   <div className="grid grid-cols-2 gap-4 bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
                      <div className="space-y-3">
                         <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Discount Engine</label>
                         <div className="flex items-center bg-white/5 rounded-xl p-1">
                            <button 
                               onClick={() => setQuoteData({ ...quoteData, discountType: 'percentage' })}
                               className={`flex-1 py-1.5 text-[9px] font-black transition-all rounded-lg ${quoteData.discountType === 'percentage' ? 'bg-pink-500 text-white' : 'text-slate-400'}`}
                            >
                               %
                            </button>
                            <button 
                               onClick={() => setQuoteData({ ...quoteData, discountType: 'fixed' })}
                               className={`flex-1 py-1.5 text-[9px] font-black transition-all rounded-lg ${quoteData.discountType === 'fixed' ? 'bg-pink-500 text-white' : 'text-slate-400'}`}
                            >
                               FIX
                            </button>
                         </div>
                         <div className="relative">
                            <input 
                               type="number"
                               value={quoteData.discountValue}
                               onChange={(e) => setQuoteData({...quoteData, discountValue: parseFloat(e.target.value) || 0})}
                               className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs font-black text-white outline-none focus:border-pink-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500 uppercase">{quoteData.discountType === 'percentage' ? '%' : 'INR'}</span>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Surcharge Addons</label>
                         <div className="h-7" /> {/* Spacer */}
                         <div className="relative">
                            <input 
                               type="number"
                               value={quoteData.extraCharges}
                               onChange={(e) => setQuoteData({...quoteData, extraCharges: parseFloat(e.target.value) || 0})}
                               className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs font-black text-white outline-none focus:border-pink-500"
                               placeholder="Addon Costs"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500 uppercase">INR</span>
                         </div>
                      </div>
                   </div>

                   {/* GST Control - Reduced Size */}
                   <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Levy Percentage (Tax)</label>
                      <div className="grid grid-cols-4 gap-2">
                         {[0, 5, 12, 18].map(r => (
                            <button 
                               key={r}
                               onClick={() => setQuoteData({ ...quoteData, gstRate: r })}
                               className={`py-3 rounded-xl text-[10px] font-black border transition-all ${quoteData.gstRate === r ? 'bg-pink-500 text-white border-pink-500 shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:border-pink-500'}`}
                            >
                               {r}%
                            </button>
                         ))}
                      </div>
                   </div>
                </section>

                {/* Section: Proposal Gallery Selection */}
                <section className="space-y-10">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                         <ImageIcon size={20} />
                      </div>
                      <div>
                         <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Proposal Gallery</h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Select visual assets to showcase</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-3">
                      {(() => {
                         let photos = [];
                         try {
                            photos = typeof venueProfile?.photos === 'string' ? JSON.parse(venueProfile.photos) : (Array.isArray(venueProfile?.photos) ? venueProfile.photos : []);
                         } catch (e) { photos = []; }
                         
                         const galleryPhotos = photos.filter((p: any) => p.category !== 'Profile');

                         if (galleryPhotos.length === 0) {
                            return (
                               <div className="col-span-3 p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No gallery photos found in profile</p>
                                  <button 
                                     onClick={() => setActiveTab('settings')}
                                     className="mt-2 text-[10px] font-black text-pink-500 uppercase tracking-widest hover:underline"
                                  >
                                     Upload Photos First
                                  </button>
                               </div>
                            );
                         }

                         return galleryPhotos.map((photo: any) => {
                            const isSelected = quoteData.selectedImages?.includes(photo.id);
                            return (
                               <button
                                  key={photo.id}
                                  onClick={() => {
                                     const current = quoteData.selectedImages || [];
                                     const updated = isSelected 
                                        ? current.filter(id => id !== photo.id)
                                        : [...current, photo.id].slice(0, 6); // Max 6 images
                                     setQuoteData({ ...quoteData, selectedImages: updated });
                                     
                                     if (!isSelected && current.length >= 6) {
                                        showToast('Maximum 6 images allowed per proposal', 'error');
                                     }
                                  }}
                                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all relative group ${
                                     isSelected ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-transparent hover:border-slate-200'
                                  }`}
                               >
                                  <Image 
                                     src={`https://sgp.cloud.appwrite.io/v1/storage/buckets/venues_photos/files/${photo.id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69ae84bc001ca4edf8c2'}`}
                                     alt="Gallery"
                                     fill
                                     className={`object-cover transition-all duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
                                  />
                                  {isSelected && (
                                     <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-pink-500 shadow-lg">
                                           <CheckCircle2 size={14} />
                                        </div>
                                     </div>
                                  )}
                                  {!isSelected && (
                                     <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus size={12} />
                                     </div>
                                  )}
                               </button>
                            );
                         });
                      })()}
                   </div>
                   <p className="text-[9px] font-bold text-slate-400 italic">Tip: Select up to 6 images to include in your visual proposal.</p>
                </section>

                {/* Final Accumulation Card - Reduced Size */}
                <div className="pt-6">
                   <div className="p-8 bg-white rounded-3xl border-2 border-slate-100 space-y-6 shadow-xl relative overflow-hidden">
                      <div className="space-y-3 relative z-10">
                         <div className="flex justify-between items-center text-[9px] font-bold uppercase text-slate-400 tracking-widest">
                            <span>Gross Valuation</span>
                            <span className="text-slate-900 border-b border-slate-100 pb-0.5">₹{subtotal.toLocaleString('en-IN')}</span>
                         </div>
                         <div className="flex justify-between items-center text-[9px] font-bold uppercase text-rose-500 tracking-widest">
                            <span>Strategic Discount</span>
                            <span className="bg-rose-50 px-2 py-0.5 rounded-lg">-₹{discountAmt.toLocaleString('en-IN')}</span>
                         </div>
                         <div className="flex justify-between items-center text-[9px] font-bold uppercase text-emerald-500 tracking-widest">
                            <span>Levy Charge ({quoteData.gstRate}%)</span>
                            <span className="bg-emerald-50 px-2 py-0.5 rounded-lg">+₹{gstAmt.toLocaleString('en-IN')}</span>
                         </div>
                      </div>
                      <div className="h-[1px] bg-slate-100" />
                      <div className="flex justify-between items-end relative z-10">
                         <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 block mb-1">Aggregate Total</span>
                            <div className="flex items-center gap-2">
                               <ShieldCheck size={12} className="text-emerald-500" />
                               <span className="text-[8px] font-black text-emerald-500/60 uppercase tracking-widest">Verified</span>
                            </div>
                         </div>
                         <div className="text-right">
                           <span className="text-4xl font-black italic text-slate-900 tracking-tighter block -mb-1">₹{total.toLocaleString('en-IN')}</span>
                           <span className="text-[9px] font-bold text-slate-300 italic tracking-tight">Incl. statutory levies</span>
                         </div>
                      </div>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full translate-x-8 -translate-y-8"></div>
                    </div>
                  </div>
             </div>
          </div>
 
           {/* RIGHT: PREMIUM PREVIEW SECTION - SCROLLABLE */}
          <div className="flex-1 bg-slate-100/80 p-8 lg:p-16 flex flex-col items-center printable-container min-h-screen">
             
             {/* Floating Premium Controls */}
             <div className="mb-10 flex items-center gap-4 bg-white/80 backdrop-blur-3xl p-4 rounded-[32px] shadow-2xl border border-white no-print">
                <button 
                   onClick={handleWhatsAppShare}
                   disabled={isSharing}
                   className="w-14 h-14 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all shadow-sm group disabled:opacity-50 disabled:cursor-wait"
                >
                   {isSharing ? (
                      <div className="w-6 h-6 border-2 border-[#25D366] border-t-transparent rounded-full animate-spin" />
                   ) : (
                      <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
                   )}
                </button>

                <button 
                  onClick={downloadAsPDF}
                  disabled={isGenerating}
                  className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all shadow-sm group disabled:opacity-50 disabled:cursor-wait"
                >
                   {isGenerating ? (
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                   ) : (
                      <Download size={22} className="group-hover:translate-y-0.5 transition-transform" />
                   )}
                </button>
                
                <button 
                  onClick={handleSend}
                  className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm group"
                >
                   <Send size={22} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* PREVIEW DOCUMENT (Visual-First Proposal Format) */}
              <motion.div 
                 layout
                 ref={quotationRef}
                 id="quotation-preview-doc"
                 className="w-full max-w-[900px] bg-white shadow-[0_60px_100px_-20px_rgba(15,23,42,0.12)] rounded-[32px] relative min-h-[1100px] flex flex-col overflow-hidden border border-slate-200 print:shadow-none print:rounded-none print-only"
              >
                      <div className="p-12 lg:p-16 space-y-12">
                         
                         {/* Header: Venue Identity */}
                         <div className="flex justify-between items-start">
                            <div className="space-y-2">
                               <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{venueProfile?.venueName || "Henry's Imperial Ballroom"}</h1>
                               <div className="flex items-center gap-2 text-slate-400">
                                  <MapPin size={12} className="text-pink-500" />
                                  <p className="text-[10px] font-bold uppercase tracking-widest">{venueProfile?.location || "Nainital Road, Haldwani"}</p>
                               </div>
                            </div>
                            <div className="w-16 h-16 bg-white rounded-xl border border-slate-100 p-2 shadow-sm flex items-center justify-center overflow-hidden">
                               {(() => {
                                  const photos = typeof venueProfile?.photos === 'string' ? JSON.parse(venueProfile.photos) : venueProfile?.photos;
                                  const avatar = Array.isArray(photos) ? photos.find((p: any) => p.category === 'Profile') : null;
                                  if (avatar) {
                                     return (
                                        <Image 
                                           src={`https://sgp.cloud.appwrite.io/v1/storage/buckets/venues_photos/files/${avatar.id}/view?project=69ae84bc001ca4edf8c2`} 
                                           alt="Logo" 
                                           width={60}
                                           height={60}
                                           className="object-cover w-full h-full" 
                                        />
                                     );
                                  }
                                  return <Image src={logo} alt="Logo" className="object-contain w-10 h-10" />;
                               })()}
                            </div>
                         </div>

                         <div className="h-[1px] bg-slate-100 w-full" />

                         {/* Personalized Intro */}
                         <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Quotation for {quoteData.client}</h3>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                               Hi {quoteData.client.split(' ')[0]} , based on your requirement of "{quoteData.guestCount || 200} pax", here is our customized proposal for your event.
                            </p>
                         </div>

                         {/* About Our Venue */}
                         <div className="space-y-6">
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-blue-500 pl-4 py-1">About Our Venue</h4>
                            <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 space-y-6">
                               <p className="text-xs font-semibold text-slate-500 leading-relaxed italic">A premium luxury event space designed for grand celebrations.</p>
                               <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                                  {Object.entries(AMENITY_ICONS).slice(0, 6).map(([key, icon]) => (
                                     <div key={key} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm">
                                           {icon}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{key}</span>
                                     </div>
                                  ))}
                               </div>
                            </div>
                          </div>

                          {/* Venue Gallery */}
                          {(() => {
                             const photos = typeof venueProfile?.photos === 'string' ? JSON.parse(venueProfile.photos) : venueProfile?.photos;
                             const gallery = Array.isArray(photos) ? photos.filter(p => quoteData.selectedImages?.includes(p.id)) : [];
                             
                             if (gallery.length === 0) return null;

                             return (
                                <div className="space-y-6">
                                   <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-blue-500 pl-4 py-1">Venue Gallery</h4>
                                   <div className="grid grid-cols-3 gap-4">
                                      {gallery.map((photo, i) => (
                                         <div key={photo.id} className="aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden relative border border-slate-100 shadow-sm">
                                            <Image 
                                              src={`https://sgp.cloud.appwrite.io/v1/storage/buckets/venues_photos/files/${photo.id}/view?project=69ae84bc001ca4edf8c2`} 
                                              alt={`View ${i}`} 
                                              fill 
                                              className="object-cover" 
                                            />
                                         </div>
                                      ))}
                                   </div>
                                </div>
                             );
                          })()}
 
                          {/* Financial Ledger Table */}
                         <div className="pt-8">
                            <div className="overflow-hidden rounded-xl border border-slate-200">
                               <table className="w-full border-collapse">
                                  <thead>
                                     <tr className="bg-[#0F172A]">
                                        <th className="text-left text-[9px] font-black text-slate-400 uppercase tracking-widest p-4 pb-3">Description</th>
                                        <th className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest p-4 pb-3 w-32">Qty</th>
                                        <th className="text-right text-[9px] font-black text-slate-400 uppercase tracking-widest p-4 pb-3 w-40">Amount (₹)</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                     {quoteData.lineItems.map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                           <td className="p-4 py-5">
                                              <p className="text-xs font-bold text-slate-800 tracking-tight">{item.label}</p>
                                           </td>
                                           <td className="p-4 py-5 text-center">
                                              <p className="text-xs font-bold text-slate-800">1</p>
                                           </td>
                                           <td className="p-4 py-5 text-right">
                                              <p className="text-xs font-black text-slate-900">₹{item.amount.toLocaleString('en-IN')}</p>
                                           </td>
                                        </tr>
                                     ))}
                                  </tbody>
                               </table>
                            </div>

                            {/* Totals Floating Card */}
                            <div className="flex justify-end pt-10">
                               <div className="w-full max-w-[340px] bg-slate-50/50 rounded-3xl p-8 border border-slate-200/50 space-y-4 shadow-sm">
                                  <div className="flex justify-between items-center">
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</span>
                                     <span className="text-sm font-black text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                  </div>
                                  {discountAmt > 0 && (
                                     <div className="flex justify-between items-center text-rose-500">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Discount</span>
                                        <span className="text-sm font-black">-₹{discountAmt.toLocaleString('en-IN')}</span>
                                     </div>
                                  )}
                                  <div className="flex justify-between items-center">
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taxes ({quoteData.gstRate}%)</span>
                                     <span className="text-sm font-black text-slate-900">₹{gstAmt.toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="h-[1px] bg-slate-200 my-2" />
                                  <div className="flex justify-between items-center pb-2">
                                     <div>
                                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Grand Total</span>
                                     </div>
                                     <span className="text-3xl font-black text-pink-500 tracking-tighter">₹{total.toLocaleString('en-IN')}</span>
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* Signature Section */}
                          <div className="flex justify-end pt-8">
                             <div className="text-right space-y-4">
                                <div className="w-48 h-[1px] bg-slate-300 ml-auto" />
                                <div>
                                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Authorized Signatory</p>
                                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{venueProfile?.venueName || "Henry's Imperial Ballroom"}</p>
                                </div>
                             </div>
                          </div>

                          {/* Visual-First Footer */}
                          <div className="mt-auto p-12 bg-white">
                             <div className="border-2 border-dashed border-slate-100 rounded-[32px] p-6 text-center">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center justify-center gap-2">
                                   ✨ This document is a visual-first proposal created by Party Dial AI Engine for {venueProfile?.venueName || "Henry's Imperial Ballroom"}
                                </p>
                             </div>
                          </div>
                       </div>
                     </motion.div>
                 </div>
              </div>
           </motion.div>
 
           <style jsx global>{`
             .custom-scrollbar::-webkit-scrollbar {
               width: 6px;
             }
             .custom-scrollbar::-webkit-scrollbar-track {
               background: transparent;
             }
             .custom-scrollbar::-webkit-scrollbar-thumb {
               background: #E2E8F0;
               border-radius: 10px;
             }
             .custom-scrollbar::-webkit-scrollbar-thumb:hover {
               background: #CBD5E1;
             }
             
             @media print {
               .print-only {
                 display: block !important;
                 visibility: visible !important;
                 width: 100% !important;
                 border: none !important;
                 box-shadow: none !important;
                 -webkit-print-color-adjust: exact !important;
                 print-color-adjust: exact !important;
                 min-height: auto !important;
                 margin: 0 !important;
                 padding: 0 !important;
                 background: white !important;
               }
               
               .print-only * {
                 visibility: visible !important;
               }
               
               .no-print {
                 display: none !important;
               }
 
               body {
                 background: white !important;
               }
 
               .printable-main {
                 overflow: visible !important;
                 height: auto !important;
               }
             }
           `}</style>
    </>
  );
};

export default React.memo(QuotationManager);
