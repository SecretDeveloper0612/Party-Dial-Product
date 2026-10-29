/* eslint-disable */
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
   signatory?: string;
}

interface QuotationManagerProps {
   quoteData: QuoteData;
   setQuoteData: any;
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
   const [isSendingEmail, setIsSendingEmail] = useState(false);
   const quotationRef = useRef<HTMLDivElement>(null);

   const generatePdfBlob = async (): Promise<Blob | null> => {
      if (!quotationRef.current) return null;

      // Temporarily override getComputedStyle to prevent html2canvas from reading modern colors
      const origGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = function(element, pseudoElt) {
         const style = origGetComputedStyle.call(window, element, pseudoElt);
         return new Proxy(style, {
            get(target, prop) {
               const val = target[prop as keyof CSSStyleDeclaration];
               if (typeof val === 'string' && val.match(/(oklch|oklab|lab|lch|color-mix|color)\s*\(/i)) {
                  return 'rgb(148, 163, 184)'; // Safe fallback
               }
               if (typeof val === 'function') {
                  return val.bind(target);
               }
               return val;
            }
         }) as CSSStyleDeclaration;
      };

      let combinedStyles = '';
      try {
         const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
         for (const link of links) {
            try {
               const res = await fetch(link.href);
               const text = await res.text();
               const safeText = text.replace(/([a-zA-Z0-9-]+)\s*:\s*([^;{}]+)([;}])/gi, (match, prop, value, endChar) => {
                  if (value.match(/(oklch|oklab|lab|lch|color-mix|color)\s*\(/i)) {
                     return `${prop}: rgb(148, 163, 184)${endChar}`;
                  }
                  return match;
               });
               combinedStyles += safeText + '\n';
            } catch (e) {
               console.warn("Failed to fetch stylesheet", link.href, e);
            }
         }
         
         const inlineStyles = Array.from(document.querySelectorAll('style'));
         for (const style of inlineStyles) {
             const text = style.innerHTML;
             const safeText = text.replace(/([a-zA-Z0-9-]+)\s*:\s*([^;{}]+)([;}])/gi, (match, prop, value, endChar) => {
                  if (value.match(/(oklch|oklab|lab|lch|color-mix|color)\s*\(/i)) {
                     return `${prop}: rgb(148, 163, 184)${endChar}`;
                  }
                  return match;
             });
             combinedStyles += safeText + '\n';
         }
      } catch (e) {
         console.warn("Style fetch error", e);
      }

      try {
         const canvas = await html2canvas(quotationRef.current, {
            scale: 2, // High fidelity capture
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
            ignoreElements: (node) => {
               // Block original styles so html2canvas doesn't crash on them
               if (node.nodeName === 'STYLE' || node.nodeName === 'LINK') return true;
               return false;
            },
         onclone: async (clonedDoc) => {
               // Inject sanitized styles safely
               const styleNode = clonedDoc.createElement('style');
               styleNode.innerHTML = combinedStyles;
               clonedDoc.head.appendChild(styleNode);

               // 1. Find the preview element in the clone using its ID
               const el = clonedDoc.getElementById('quotation-preview-doc');
               if (el) {
                  el.style.display = 'flex';
                  el.style.visibility = 'visible';
                  el.style.boxShadow = 'none';
                  el.style.transform = 'none';
               }

               // 2. Convert all images to base64 so html2canvas can render them
               const imageElements = Array.from(clonedDoc.querySelectorAll('img'));
               await Promise.all(imageElements.map(async (img) => {
                  const originalSrc = img.src;
                  if (!originalSrc || originalSrc.startsWith('data:')) return;

                  // Determine actual URL - Next.js proxies images via /_next/image
                  let fetchUrl = originalSrc;
                  if (originalSrc.includes('/_next/image')) {
                     try {
                        const urlParams = new URL(originalSrc).searchParams;
                        fetchUrl = decodeURIComponent(urlParams.get('url') || originalSrc);
                     } catch {}
                  }

                  try {
                     const res = await fetch(fetchUrl, { mode: 'cors' });
                     const blob = await res.blob();
                     const dataUrl = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(blob);
                     });
                     img.src = dataUrl;
                  } catch (e) {
                     console.warn('Failed to convert image to base64:', fetchUrl, e);
                  }
               }));

               // Clean SVGs since they often use currentColor which resolves to lab()
               const svgs = clonedDoc.getElementsByTagName('svg');
               for (let i=0; i<svgs.length; i++) {
                  svgs[i].style.color = 'rgb(148, 163, 184)';
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
      } finally {
         window.getComputedStyle = origGetComputedStyle;
      }
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
      } catch (error: unknown) {
         console.error('PDF Generation Error:', error);
         showToast(`Generation failed: ${(error as any).message || 'Please try again'}`, 'error');
      } finally {
         setIsGenerating(false);
      }
   };

   const handleWhatsAppShare = async () => {
      setIsSharing(true);
      try {
         if (!quoteData.contact) {
            showToast('Please add a contact number first!', 'error');
            return;
         }

         showToast('Opening WhatsApp...', 'success');

         // Format phone number (ensure country code for India if missing)
         let phone = quoteData.contact.replace(/\D/g, '');
         if (phone.length === 10) phone = '91' + phone;

         // Build rich proposal message
         const venueName = (venueProfile as any)?.venueName || 'Our Venue';
         const lineItemsSummary = quoteData.lineItems
            .filter(item => item.label && item.amount > 0)
            .map(item => `  • ${item.label}: ₹${item.amount.toLocaleString('en-IN')}`)
            .join('\n');

         const message =
            `🎉 *QUOTATION FROM ${venueName.toUpperCase()}* 🎉\n\n` +
            `Dear ${quoteData.client || 'Valued Client'},\n\n` +
            `We are delighted to present your personalized event proposal!\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━\n` +
            `📋 *EVENT DETAILS*\n` +
            `━━━━━━━━━━━━━━━━━━━━━\n` +
            `👤 Client: ${quoteData.client}\n` +
            (quoteData.event ? `🎊 Event Type: ${quoteData.event}\n` : '') +
            (quoteData.eventDate ? `📅 Date: ${quoteData.eventDate}\n` : '') +
            (quoteData.guestCount ? `👥 Guests: ${quoteData.guestCount} Pax\n` : '') +
            `\n━━━━━━━━━━━━━━━━━━━━━\n` +
            `💼 *SERVICES INCLUDED*\n` +
            `━━━━━━━━━━━━━━━━━━━━━\n` +
            (lineItemsSummary ? `${lineItemsSummary}\n` : '  • As discussed\n') +
            `\n━━━━━━━━━━━━━━━━━━━━━\n` +
            `💰 *FINANCIAL SUMMARY*\n` +
            `━━━━━━━━━━━━━━━━━━━━━\n` +
            `Subtotal: ₹${subtotal.toLocaleString('en-IN')}\n` +
            (quoteData.gstRate > 0 ? `GST (${quoteData.gstRate}%): ₹${gstAmt.toLocaleString('en-IN')}\n` : '') +
            `*Grand Total: ₹${total.toLocaleString('en-IN')}*\n\n` +
            (quoteData.specialRequests ? `📝 *Special Notes:*\n${quoteData.specialRequests}\n\n` : '') +
            `━━━━━━━━━━━━━━━━━━━━━\n` +
            `To confirm your booking or for any queries, please reply to this message.\n\n` +
            `_Generated via Party Dial_ ✨`;

         const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
         window.open(waUrl, '_blank', 'noopener,noreferrer');

         showToast('WhatsApp opened successfully!', 'success');
      } catch (error: unknown) {
         console.error('WhatsApp Share Error:', error);
         showToast(`Sharing failed: ${(error as any).message || 'Please try again'}`, 'error');
      } finally {
         setIsSharing(false);
      }
   };

   const sendEmailToClient = async () => {
      setIsSendingEmail(true);
      try {
         if (!quoteData.email) {
            showToast('Please add a client email address first!', 'error');
            return;
         }

         showToast('Generating PDF and sending email...', 'success');

         const blob = await generatePdfBlob();
         if (!blob) throw new Error('Failed to generate PDF');

         // Convert blob to base64
         const pdfBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
               const result = reader.result as string;
               resolve(result.split(',')[1]);
            };
            reader.readAsDataURL(blob);
         });

         const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://party-dial-product-server.onrender.com/api';
         const apiUrl = serverUrl.endsWith('/api') ? serverUrl : `${serverUrl}/api`;

         const res = await fetch(`${apiUrl}/quotation/send-client-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               clientEmail: quoteData.email,
               pdfData: pdfBase64,
               clientName: quoteData.client,
               venueName: venueProfile?.venueName || 'Our Venue',
               venueEmail: venueProfile?.email || '',
               eventType: quoteData.event,
               eventDate: quoteData.eventDate,
               guestCount: quoteData.guestCount,
               lineItems: quoteData.lineItems,
               subtotal,
               gstRate: quoteData.gstRate,
               gstAmount: gstAmt,
               total,
               specialRequests: quoteData.specialRequests,
               signatory: quoteData.signatory,
            }),
         });

         const data = await res.json();
         if (data.status === 'success') {
            showToast(`Quotation emailed to ${quoteData.email} successfully! ✉️`, 'success');
         } else {
            throw new Error(data.message || 'Email sending failed');
         }
      } catch (error: unknown) {
         console.error('Email Send Error:', error);
         showToast(`Email failed: ${(error as any).message || 'Please try again'}`, 'error');
      } finally {
         setIsSendingEmail(false);
      }
   };

   return (
      <>
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen -mt-10 -mx-4 md:-mx-10 bg-[#FAFAFA] flex flex-col printable-container font-sans"
         >
            {/* Executive Status Bar */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 lg:px-10 py-4 lg:py-5 flex items-center justify-between sticky top-0 z-40 no-print">
               <div className="flex items-center gap-3 lg:gap-5">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                     <FileText size={18} className="opacity-90" />
                  </div>
                  <div>
                     <h1 className="text-[13px] lg:text-sm font-bold text-slate-900 tracking-wide">Executive Proposal</h1>
                     <div className="flex items-center gap-2 mt-0.5">
                        <p className="hidden sm:block text-[10px] font-medium text-slate-400 tracking-wider border-r border-slate-200 pr-2">Session: #QTN-{new Date().getTime().toString().slice(-4)}</p>
                        <p className="text-[10px] font-bold text-emerald-500 tracking-wider">Authenticated</p>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-3 lg:gap-4">
                  <button
                     onClick={() => setActiveTab('overview')}
                     className="hidden lg:block text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors px-4 py-2"
                  >
                     Discard Draft
                  </button>
                  <button
                     onClick={handleFinalize}
                     disabled={isFinalizing || qtnSuccess}
                     className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${qtnSuccess
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                        : isFinalizing
                           ? 'bg-slate-100 text-slate-400'
                           : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/10'
                        }`}
                  >
                     {isFinalizing ? (
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                     ) : qtnSuccess ? (
                        <CheckCircle2 size={16} />
                     ) : <FileText size={14} className="opacity-80" />}
                     {isFinalizing ? 'Finalizing...' : qtnSuccess ? 'Finalized' : 'Finalize Proposal'}
                  </button>
               </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row printable-container relative">
               {/* LEFT: ADVANCED FORM SECTION - STICKY */}
               <div className="w-full lg:w-115 bg-white/60 backdrop-blur-3xl border-r border-slate-200/60 p-6 lg:p-8 no-print lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] lg:overflow-y-auto custom-scrollbar z-10">
                  <div className="space-y-10">
                     {/* Section: Customer Details */}
                     <section className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">
                              <Users size={16} />
                           </div>
                           <div>
                              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Client Profile</h3>
                              <p className="text-[11px] text-slate-500">Identification & Outreach</p>
                           </div>
                        </div>
                        <div className="space-y-5">
                           <div className="space-y-1.5">
                              <label className="text-[11px] font-semibold text-slate-600 ml-1">Legal Entity Name</label>
                              <input
                                 type="text"
                                 value={quoteData.client}
                                 onChange={(e) => setQuoteData({ ...quoteData, client: e.target.value })}
                                 className="w-full bg-white border border-slate-200/80 rounded-xl py-2.5 px-4 text-[13px] font-medium text-slate-900 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm placeholder:text-slate-400"
                                 placeholder="e.g. Suman Saxena"
                              />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                 <label className="text-[11px] font-semibold text-slate-600 ml-1">Contact No.</label>
                                 <input
                                    type="text"
                                    value={quoteData.contact}
                                    onChange={(e) => setQuoteData({ ...quoteData, contact: e.target.value })}
                                    className="w-full bg-white border border-slate-200/80 rounded-xl py-2.5 px-4 text-[13px] font-medium text-slate-900 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm placeholder:text-slate-400"
                                    placeholder="9876543210"
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[11px] font-semibold text-slate-600 ml-1">Email Address</label>
                                 <input
                                    type="email"
                                    value={quoteData.email}
                                    onChange={(e) => setQuoteData({ ...quoteData, email: e.target.value })}
                                    className="w-full bg-white border border-slate-200/80 rounded-xl py-2.5 px-4 text-[13px] font-medium text-slate-900 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm placeholder:text-slate-400"
                                    placeholder="client@mail.com"
                                 />
                              </div>
                           </div>
                        </div>
                     </section>

                     <div className="h-px w-full bg-slate-200/60" />

                     {/* Section: Event Specifications */}
                     <section className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                              <CalendarDays size={16} />
                           </div>
                           <div>
                              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Event Details</h3>
                              <p className="text-[11px] text-slate-500">Timeline & Volume</p>
                           </div>
                        </div>
                        <div className="space-y-5">
                           <div className="space-y-1.5">
                              <label className="text-[11px] font-semibold text-slate-600 ml-1">Nature of Celebration</label>
                              <select
                                 value={quoteData.event}
                                 onChange={(e) => setQuoteData({ ...quoteData, event: e.target.value })}
                                 className="w-full bg-white border border-slate-200/80 rounded-xl py-2.5 px-4 text-[13px] font-medium text-slate-900 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm appearance-none"
                              >
                                 <option>Wedding Ceremony</option>
                                 <option>Engagement Party</option>
                                 <option>Reception</option>
                                 <option>Haldi / Mehndi Ceremony</option>
                                 <option>Corporate Gala</option>
                                 <option>Cocktail Party</option>
                                 <option>Birthday Bash</option>
                                 <option>Anniversary Celebration</option>
                                 <option>Baby Shower</option>
                                 <option>Bridal Shower</option>
                                 <option>Farewell Party</option>
                                 <option>Reunion</option>
                                 <option>Product Launch</option>
                                 <option>Private Dinner</option>
                                 <option>Festive Event</option>
                                 <option>Other / Custom Event</option>
                              </select>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                 <label className="text-[11px] font-semibold text-slate-600 ml-1">Session Date</label>
                                 <input
                                    type="date"
                                    value={quoteData.eventDate}
                                    onChange={(e) => setQuoteData({ ...quoteData, eventDate: e.target.value })}
                                    className="w-full bg-white border border-slate-200/80 rounded-xl py-2.5 px-4 text-[13px] font-medium text-slate-900 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[11px] font-semibold text-slate-600 ml-1">Pax Count</label>
                                 <input
                                    type="number"
                                    value={quoteData.guestCount}
                                    onChange={(e) => setQuoteData({ ...quoteData, guestCount: e.target.value })}
                                    className="w-full bg-white border border-slate-200/80 rounded-xl py-2.5 px-4 text-[13px] font-medium text-slate-900 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm placeholder:text-slate-400"
                                    placeholder="Guests Pax"
                                 />
                              </div>
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-[11px] font-semibold text-slate-600 ml-1">Special Directives</label>
                              <textarea
                                 rows={3}
                                 value={quoteData.specialRequests}
                                 onChange={(e) => setQuoteData({ ...quoteData, specialRequests: e.target.value })}
                                 className="w-full bg-white border border-slate-200/80 rounded-xl py-3 px-4 text-[13px] font-medium text-slate-900 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm resize-none placeholder:text-slate-400"
                                 placeholder="Add specific requirements or project notes..."
                              />
                           </div>
                        </div>
                     </section>

                     <div className="h-px w-full bg-slate-200/60" />
                     <section className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                                 <IndianRupee size={16} />
                              </div>
                              <div>
                                 <h3 className="text-sm font-bold text-slate-900 tracking-tight">Fiscal Structure</h3>
                                 <p className="text-[11px] text-slate-500">Revenue & Discounts</p>
                              </div>
                           </div>
                           <button
                              onClick={() => setQuoteData({
                                 ...quoteData,
                                 lineItems: [...quoteData.lineItems, { id: Date.now(), label: 'New Revenue Stream', amount: 0 }]
                              })}
                              className="flex items-center gap-1.5 text-[11px] font-bold text-pink-500 bg-pink-50/50 hover:bg-pink-100 px-3 py-1.5 rounded-lg transition-colors"
                           >
                              <Plus size={14} />
                              Add Item
                           </button>
                        </div>

                        {/* Line Items */}
                        <div className="space-y-3">
                           <AnimatePresence>
                              {quoteData.lineItems.map((item, idx) => (
                                 <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={item.id}
                                    className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-4 relative group hover:border-pink-500/30 hover:shadow-sm transition-all"
                                 >
                                    <button
                                       onClick={() => {
                                          const newItems = quoteData.lineItems.filter((_, i) => i !== idx);
                                          setQuoteData({ ...quoteData, lineItems: newItems });
                                       }}
                                       className="absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                       <Trash2 size={14} />
                                    </button>

                                    <div className="grid grid-cols-[1fr,120px] gap-3 pr-8">
                                       <div className="space-y-1.5">
                                          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Item Name</label>
                                          <input
                                             type="text"
                                             value={item.label}
                                             onChange={(e) => {
                                                const newItems = [...quoteData.lineItems];
                                                newItems[idx].label = e.target.value;
                                                setQuoteData({ ...quoteData, lineItems: newItems });
                                             }}
                                             className="w-full bg-slate-50/50 border border-slate-200/60 rounded-lg py-2 px-3 text-[13px] font-medium text-slate-900 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all"
                                             placeholder="e.g. Venue Rental"
                                          />
                                       </div>
                                       <div className="space-y-1.5">
                                          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Amount (₹)</label>
                                          <input
                                             type="number"
                                             value={item.amount}
                                             onChange={(e) => {
                                                const newItems = [...quoteData.lineItems];
                                                newItems[idx].amount = parseInt(e.target.value) || 0;
                                                setQuoteData({ ...quoteData, lineItems: newItems });
                                             }}
                                             className="w-full bg-slate-50/50 border border-slate-200/60 rounded-lg py-2 px-3 text-[13px] font-medium text-slate-900 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all"
                                          />
                                       </div>
                                    </div>
                                 </motion.div>
                              ))}
                           </AnimatePresence>
                        </div>

                        {/* Discount & Extras */}
                        <div className="grid grid-cols-2 gap-4 bg-[#0F172A] p-5 rounded-lg text-white shadow-lg">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discount Setup</label>
                              <div className="flex items-center bg-slate-800 rounded-lg p-0.5">
                                 <button
                                    onClick={() => setQuoteData({ ...quoteData, discountType: 'percentage' })}
                                    className={`flex-1 py-1 text-[11px] font-bold transition-all rounded-md ${quoteData.discountType === 'percentage' ? 'bg-pink-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                 >
                                    %
                                 </button>
                                 <button
                                    onClick={() => setQuoteData({ ...quoteData, discountType: 'fixed' })}
                                    className={`flex-1 py-1 text-[11px] font-bold transition-all rounded-md ${quoteData.discountType === 'fixed' ? 'bg-pink-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                 >
                                    FIXED
                                 </button>
                              </div>
                              <div className="relative mt-2">
                                 <input
                                    type="number"
                                    value={quoteData.discountValue}
                                    onChange={(e) => setQuoteData({ ...quoteData, discountValue: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-[13px] font-bold text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 transition-all"
                                 />
                                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">{quoteData.discountType === 'percentage' ? '%' : '₹'}</span>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Extra Charges</label>
                              <div className="h-7" /> {/* Spacer to align with discount buttons */}
                              <div className="relative mt-2">
                                 <input
                                    type="number"
                                    value={quoteData.extraCharges}
                                    onChange={(e) => setQuoteData({ ...quoteData, extraCharges: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-[13px] font-bold text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 transition-all"
                                    placeholder="0"
                                 />
                                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₹</span>
                              </div>
                           </div>
                        </div>

                        {/* GST Control */}
                        <div className="space-y-2">
                           <label className="text-[11px] font-semibold text-slate-600 ml-1">GST Tax Rate</label>
                           <div className="grid grid-cols-4 gap-2">
                              {[0, 5, 12, 18].map(r => (
                                 <button
                                    key={r}
                                    onClick={() => setQuoteData({ ...quoteData, gstRate: r })}
                                    className={`py-2 rounded-lg text-[12px] font-bold border transition-all ${quoteData.gstRate === r ? 'bg-pink-500 text-white border-pink-500 shadow-sm shadow-pink-500/20' : 'bg-white text-slate-500 border-slate-200 hover:border-pink-500 hover:text-pink-500'}`}
                                 >
                                    {r}%
                                 </button>
                              ))}
                           </div>
                        </div>
                     </section>

                     <div className="h-px w-full bg-slate-200/60" />

                     {/* Section: Proposal Gallery Selection */}
                     <section className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                              <ImageIcon size={16} />
                           </div>
                           <div>
                              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Proposal Gallery</h3>
                              <p className="text-[11px] text-slate-500">Select visuals to showcase</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                           {(() => {
                              let photos = [];
                              try {
                                 const rawPhotos = typeof venueProfile?.photos === 'string' ? JSON.parse(venueProfile.photos) : (Array.isArray(venueProfile?.photos) ? venueProfile.photos : []);
                                 photos = rawPhotos.map((p: any) => typeof p === 'string' ? { id: p, category: 'All Photos' } : p);
                              } catch (e) { photos = []; }

                              const galleryPhotos = photos.filter((p: any) => p.category !== 'Profile');

                              if (galleryPhotos.length === 0) {
                                 return (
                                    <div className="col-span-3 p-6 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
                                       <p className="text-[11px] font-medium text-slate-500">No gallery photos found</p>
                                       <button
                                          onClick={() => setActiveTab('settings')}
                                          className="mt-1 text-[11px] font-bold text-pink-500 hover:text-pink-600 transition-colors"
                                       >
                                          Upload Photos First
                                       </button>
                                    </div>
                                 );
                              }

                              return galleryPhotos.map((photo: any, idx: number) => {
                                 const isSelected = quoteData.selectedImages?.includes(photo.id);
                                 return (
                                    <button
                                       key={photo.id || idx}
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
                                       className={`aspect-square rounded-xl overflow-hidden border-2 transition-all relative group shadow-sm ${isSelected ? 'border-pink-500 ring-2 ring-pink-500/20 shadow-pink-500/10' : 'border-transparent hover:border-slate-300'
                                          }`}
                                    >
                                       <Image
                                          src={`https://sgp.cloud.appwrite.io/v1/storage/buckets/venues_photos/files/${photo.id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69ae84bc001ca4edf8c2'}`}
                                          alt="Gallery"
                                          fill
                                          className={`object-cover transition-all duration-500 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
                                       />
                                       {isSelected && (
                                          <div className="absolute inset-0 bg-pink-500/10 flex items-center justify-center">
                                             <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-pink-500 shadow-sm">
                                                <CheckCircle2 size={12} />
                                             </div>
                                          </div>
                                       )}
                                       {!isSelected && (
                                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <Plus size={10} />
                                          </div>
                                       )}
                                    </button>
                                 );
                              });
                           })()}
                        </div>
                        <p className="text-[10px] text-slate-400">Select up to 6 images to include in your proposal.</p>
                     </section>

                     <div className="h-px w-full bg-slate-200/60" />

                     {/* Section: Signatory Details */}
                     <section className="space-y-4">
                        <div>
                           <h3 className="text-sm font-bold text-slate-900 tracking-tight">Signatory Details</h3>
                           <p className="text-[11px] text-slate-500">Who is authorizing this proposal?</p>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[11px] font-semibold text-slate-600 ml-1">Authorized Signatory Name</label>
                           <input
                              type="text"
                              value={quoteData.signatory}
                              onChange={(e) => setQuoteData({ ...quoteData, signatory: e.target.value })}
                              className="w-full bg-white border border-slate-200/80 rounded-xl py-2.5 px-4 text-[13px] font-medium text-slate-900 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm placeholder:text-slate-400"
                              placeholder="e.g. John Doe, Manager"
                           />
                        </div>
                     </section>

                     {/* Final Accumulation Card */}
                     <div className="pt-2">
                        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-sm space-y-4">
                           <div className="space-y-2">
                              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500">
                                 <span>Subtotal</span>
                                 <span className="text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] font-semibold text-rose-500">
                                 <span>Discount</span>
                                 <span>-₹{discountAmt.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500">
                                 <span>GST ({quoteData.gstRate}%)</span>
                                 <span>+₹{gstAmt.toLocaleString('en-IN')}</span>
                              </div>
                           </div>
                           <div className="h-px bg-slate-100" />
                           <div className="flex justify-between items-end">
                              <span className="text-xs font-bold text-slate-900">Total Amount</span>
                              <div className="text-right">
                                 <span className="text-2xl font-bold font-heading text-pink-500 tracking-tight leading-none block">₹{total.toLocaleString('en-IN')}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* RIGHT: PREMIUM PREVIEW SECTION - SCROLLABLE */}
               <div className="flex-1 bg-slate-50/50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] p-8 lg:p-16 flex flex-col items-center printable-container min-h-[calc(100vh-80px)] overflow-y-auto">

                  {/* Floating Premium Controls */}
                  <div className="mb-8 flex items-center gap-2 bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-lg shadow-slate-200/50 border border-slate-200/60 no-print sticky top-8 z-20">
                     <button
                        onClick={handleWhatsAppShare}
                        disabled={isSharing}
                        className="px-4 py-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center gap-2 text-xs font-bold hover:bg-[#25D366] hover:text-white transition-all group disabled:opacity-50"
                     >
                        {isSharing ? (
                           <div className="w-4 h-4 border-2 border-[#25D366] border-t-transparent rounded-full animate-spin" />
                        ) : (
                           <MessageCircle size={16} />
                        )}
                        Share
                     </button>

                     <div className="w-px h-6 bg-slate-200 mx-1" />

                     <button
                        onClick={downloadAsPDF}
                        disabled={isGenerating}
                        className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center gap-2 text-xs font-bold transition-all group disabled:opacity-50"
                     >
                        {isGenerating ? (
                           <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                           <Download size={16} />
                        )}
                        PDF
                     </button>

                     <button
                        onClick={sendEmailToClient}
                        disabled={isSendingEmail}
                        className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center gap-2 text-xs font-bold transition-all group disabled:opacity-50"
                     >
                        {isSendingEmail ? (
                           <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                           <Send size={16} />
                        )}
                        Email
                     </button>
                  </div>

                  {/* PREVIEW DOCUMENT (Ultra-Professional Proposal & Quotation Format) */}
                  <motion.div
                     layout
                     ref={quotationRef}
                     id="quotation-preview-doc"
                     className="w-full bg-white shadow-2xl shadow-slate-200/80 rounded-2xl relative min-h-[1050px] flex flex-col overflow-hidden border border-slate-200/80 print:shadow-none print:rounded-none print-only"
                  >
                     {/* Top Premium Color Bar */}
                     <div className="h-2 w-full bg-linear-to-r from-pd-pink via-purple-600 to-slate-900" />

                     <div className="p-10 lg:p-14 flex-1 flex flex-col justify-between space-y-10">

                        {/* Header: Venue Brand & Quote Metadata */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-100">
                           <div className="flex items-start gap-4">
                              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200/70 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                                 {(() => {
                                    let photos: any[] = [];
                                    try {
                                       const rawPhotos = typeof venueProfile?.photos === "string" ? JSON.parse(venueProfile.photos) : venueProfile?.photos;
                                       if (Array.isArray(rawPhotos)) {
                                          photos = rawPhotos.map((p: any) => {
                                             if (typeof p === "string") {
                                                try {
                                                   const obj = JSON.parse(p);
                                                   if (obj && typeof obj === "object") return obj;
                                                } catch(e) {}
                                                return { id: p, category: "All Photos" };
                                             }
                                             return p;
                                          });
                                       }
                                    } catch (e) {}

                                    const avatar = photos.find((p: any) => p?.category === "Profile") || (photos.length > 0 ? photos[0] : null);
                                    const fallbackLogoSrc = typeof logo === "string" ? logo : (logo?.src || "/logo.jpg");

                                    if (avatar?.id) {
                                       return (
                                          <img
                                             crossOrigin="anonymous"
                                             src={`https://sgp.cloud.appwrite.io/v1/storage/buckets/venues_photos/files/${avatar.id}/view?project=69ae84bc001ca4edf8c2`}
                                             alt="Logo"
                                             className="object-cover w-full h-full"
                                             onError={(e) => {
                                                const target = e.currentTarget as HTMLImageElement;
                                                target.onerror = null;
                                                target.src = fallbackLogoSrc;
                                                target.className = "object-contain w-12 h-12 p-1";
                                             }}
                                          />
                                       );
                                    }
                                    return (
                                       <img
                                          crossOrigin="anonymous"
                                          src={fallbackLogoSrc}
                                          alt="Logo"
                                          className="object-contain w-12 h-12 p-1"
                                       />
                                    );
                                 })()}
                              </div>

                              <div>
                                 <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                    {venueProfile?.venueName || "Henry's Imperial Ballroom"}
                                 </h1>
                                 <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-slate-500 mt-1.5 text-xs">
                                    <span className="flex items-center gap-1 font-medium">
                                       <MapPin size={13} className="text-pd-pink shrink-0" />
                                       {venueProfile?.location || venueProfile?.city || "Nainital Road, Haldwani"}
                                    </span>
                                    {venueProfile?.phone && (
                                       <span className="flex items-center gap-1 font-medium text-slate-400">
                                          <span>•</span>
                                          <span>{venueProfile.phone}</span>
                                       </span>
                                    )}
                                 </div>
                              </div>
                           </div>

                           {/* Quote Metadata Badge */}
                           <div className="text-left sm:text-right bg-slate-50/80 border border-slate-200/60 rounded-xl px-4 py-3 min-w-[180px]">
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-pd-pink/10 text-pd-pink mb-1.5">
                                 Official Quotation
                              </span>
                              <p className="text-xs font-semibold text-slate-800">
                                 Quote #{quoteData.leadId ? quoteData.leadId.slice(-6).toUpperCase() : `PD-${Math.floor(100000 + Math.random() * 900000)}`}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                 Date: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                           </div>
                        </div>

                        {/* Client & Event Specifications (Executive Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {/* Client Details Box */}
                           <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border border-slate-200/70 shadow-xs">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                                 Prepared Exclusively For
                              </span>
                              <h3 className="text-base font-bold text-slate-900 mb-1">
                                 {quoteData.client || "Valued Client"}
                              </h3>
                              <div className="space-y-1 text-xs text-slate-600">
                                 {quoteData.contact && (
                                    <p className="flex items-center gap-2">
                                       <Phone size={12} className="text-slate-400 shrink-0" />
                                       <span>{quoteData.contact}</span>
                                    </p>
                                 )}
                                 {quoteData.email && (
                                    <p className="flex items-center gap-2">
                                       <Mail size={12} className="text-slate-400 shrink-0" />
                                       <span>{quoteData.email}</span>
                                    </p>
                                 )}
                                 {!quoteData.contact && !quoteData.email && (
                                    <p className="text-slate-400 italic">Contact details provided upon confirmation</p>
                                 )}
                              </div>
                           </div>

                           {/* Event Specifications Box */}
                           <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border border-slate-200/70 shadow-xs">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                                 Event Details & Schedule
                              </span>
                              <h3 className="text-base font-bold text-slate-900 mb-1">
                                 {quoteData.event || "Special Occasion / Function"}
                              </h3>
                              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
                                 <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date</span>
                                    <span className="font-semibold text-slate-700">
                                       {quoteData.eventDate ? new Date(quoteData.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "To be decided"}
                                    </span>
                                 </div>
                                 <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Guest Count</span>
                                    <span className="font-semibold text-slate-700">
                                       {quoteData.guestCount ? `${quoteData.guestCount} Guests` : "Flexible"}
                                    </span>
                                 </div>
                              </div>
                           </div>

                           {quoteData.specialRequests && (
                              <div className="md:col-span-2 bg-amber-50/60 rounded-xl p-4 border border-amber-200/60 text-xs">
                                 <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 block mb-1">
                                    Special Directives & Notes
                                 </span>
                                 <p className="text-amber-900 font-medium leading-relaxed italic">
                                    &ldquo;{quoteData.specialRequests}&rdquo;
                                 </p>
                              </div>
                           )}
                        </div>

                        {/* Amenities Included */}
                        <div className="space-y-3">
                           <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                 Complimentary Amenities & Facilities
                              </h4>
                           </div>
                           <div className="flex flex-wrap gap-2.5">
                              {(() => {
                                 const rawAmenities = typeof venueProfile?.amenities === "string" 
                                    ? JSON.parse(venueProfile.amenities) 
                                    : (Array.isArray(venueProfile?.amenities) ? venueProfile.amenities : []);
                                 
                                 if (rawAmenities.length === 0) {
                                    return <span className="text-xs text-slate-400 italic">Standard venue amenities included.</span>;
                                 }

                                 const formatAmenity = (name: string) => {
                                    return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                                 };

                                 return rawAmenities.map((amenity: string) => {
                                    const icon = AMENITY_ICONS[amenity] || AMENITY_ICONS["Garden"];
                                    return (
                                       <div
                                          key={amenity}
                                          className="flex items-center gap-2 bg-slate-50/80 px-3.5 py-2 rounded-lg border border-slate-200/60 text-slate-700"
                                       >
                                          <div className="text-pd-pink shrink-0">
                                             {icon}
                                          </div>
                                          <span className="text-xs font-semibold">
                                             {formatAmenity(amenity)}
                                          </span>
                                       </div>
                                    );
                                 });
                              })()}
                           </div>
                        </div>

                        {/* Venue Gallery Preview if selected */}
                        {(() => {
                           const rawPhotos = typeof venueProfile?.photos === "string" ? JSON.parse(venueProfile.photos) : venueProfile?.photos;
                           const photos = Array.isArray(rawPhotos) ? rawPhotos.map((p: any) => {
                               if (typeof p === "string") {
                                   try {
                                       const obj = JSON.parse(p);
                                       if (obj && typeof obj === "object") return obj;
                                   } catch(e) {}
                                   return { id: p, category: "All Photos" };
                               }
                               return p;
                           }) : [];
                           const gallery = photos.filter((p: any) => quoteData.selectedImages?.includes(p.id));

                           if (gallery.length === 0) return null;

                           return (
                              <div className="space-y-3 pt-2">
                                 <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Venue & Setup Preview</h4>
                                 <div className="grid grid-cols-3 gap-3">
                                    {gallery.map((photo: any, i) => (
                                       <div key={photo.id || i} className="aspect-4/3 rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200/80 shadow-xs">
                                          <img
                                             crossOrigin="anonymous"
                                             src={`https://sgp.cloud.appwrite.io/v1/storage/buckets/venues_photos/files/${photo.id}/view?project=69ae84bc001ca4edf8c2`}
                                             alt={`Venue View ${i}`}
                                             className="w-full h-full object-cover"
                                          />
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           );
                        })()}

                        {/* Financial Ledger / Investment Breakdown */}
                        <div className="space-y-4 pt-2">
                           <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                 Commercial Quotation Breakdown
                              </h4>
                           </div>
                           
                           <div className="overflow-hidden rounded-xl border border-slate-200/80 shadow-xs">
                              <table className="w-full border-collapse bg-white">
                                 <thead>
                                    <tr className="bg-slate-900 text-white">
                                       <th className="text-left text-[11px] font-bold uppercase tracking-wider py-3.5 px-5 w-12">#</th>
                                       <th className="text-left text-[11px] font-bold uppercase tracking-wider py-3.5 px-5">Service / Item Description</th>
                                       <th className="text-right text-[11px] font-bold uppercase tracking-wider py-3.5 px-5 w-44">Amount (₹)</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                    {quoteData.lineItems.map((item, i) => (
                                       <tr key={item.id || i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                          <td className="py-3.5 px-5 text-xs font-semibold text-slate-400">
                                             {String(i + 1).padStart(2, "0")}
                                          </td>
                                          <td className="py-3.5 px-5">
                                             <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                                          </td>
                                          <td className="py-3.5 px-5 text-right font-bold text-slate-800 text-sm">
                                             ₹{item.amount.toLocaleString("en-IN")}
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>

                           {/* Financial Summary & Total Breakdown Card */}
                           <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4">
                              <div className="text-xs text-slate-500 max-w-sm space-y-1.5">
                                 <p className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Payment & Terms Notice</p>
                                 <p className="text-[11px] leading-relaxed text-slate-500">
                                    This proposal is valid for 15 days from issuance. Booking confirmation is subject to advance deposit and hall availability on the requested event date.
                                 </p>
                              </div>

                              <div className="w-full sm:w-80 bg-slate-50/80 rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                                 <div className="flex justify-between items-center text-xs">
                                    <span className="font-medium text-slate-500">Subtotal Amount</span>
                                    <span className="font-bold text-slate-800">₹{subtotal.toLocaleString("en-IN")}</span>
                                 </div>

                                 {discountAmt > 0 && (
                                    <div className="flex justify-between items-center text-xs text-rose-600">
                                       <span className="font-medium">Special Discount</span>
                                       <span className="font-bold">-₹{discountAmt.toLocaleString("en-IN")}</span>
                                    </div>
                                 )}

                                 {quoteData.extraCharges > 0 && (
                                    <div className="flex justify-between items-center text-xs text-slate-600">
                                       <span className="font-medium">Additional Charges</span>
                                       <span className="font-bold">+₹{quoteData.extraCharges.toLocaleString("en-IN")}</span>
                                    </div>
                                 )}

                                 <div className="flex justify-between items-center text-xs">
                                    <span className="font-medium text-slate-500">Applicable Taxes (GST {quoteData.gstRate}%)</span>
                                    <span className="font-bold text-slate-800">₹{gstAmt.toLocaleString("en-IN")}</span>
                                 </div>

                                 <div className="h-px bg-slate-200/80 my-2" />

                                 <div className="flex justify-between items-baseline pt-1">
                                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">Net Payable</span>
                                    <span className="text-2xl font-black font-heading text-pd-pink">
                                       ₹{total.toLocaleString("en-IN")}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Signatures & Authorization */}
                        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-end gap-8">
                           <div className="text-left space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Acceptance</p>
                              <div className="w-48 h-10 border-b border-dashed border-slate-300 mt-6" />
                              <p className="text-[10px] text-slate-400 mt-1">Signature & Date</p>
                           </div>

                           <div className="text-right space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authorized Signatory</p>
                              <div className="w-48 h-10 border-b border-dashed border-slate-300 ml-auto mt-6" />
                              <p className="text-xs font-bold text-slate-900 mt-1.5">
                                 {quoteData.signatory || venueProfile?.venueName || "Henry's Imperial Ballroom"}
                              </p>
                              <p className="text-[10px] text-slate-400">Management Representative</p>
                           </div>
                        </div>

                        {/* Official Document Footer */}
                        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-2">
                           <p className="font-medium">
                              Confidential • Prepared exclusively for {quoteData.client || "Client"}
                           </p>
                           <p className="font-medium flex items-center gap-1">
                              <span>Verified Venue Partner</span>
                              <span>•</span>
                              <span className="font-semibold text-slate-600">PartyDial Network</span>
                           </p>
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
