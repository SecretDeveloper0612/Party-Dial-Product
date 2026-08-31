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
                        <div className="grid grid-cols-2 gap-4 bg-[#0F172A] p-5 rounded-2xl text-white shadow-lg">
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
                        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
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
                                 <span className="text-2xl font-black text-pink-500 tracking-tight leading-none block">₹{total.toLocaleString('en-IN')}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* RIGHT: PREMIUM PREVIEW SECTION - SCROLLABLE */}
               <div className="flex-1 bg-slate-50/50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] p-8 lg:p-16 flex flex-col items-center printable-container min-h-[calc(100vh-80px)] overflow-y-auto">

                  {/* Floating Premium Controls */}
                  <div className="mb-8 flex items-center gap-2 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 no-print sticky top-8 z-20">
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

                  {/* PREVIEW DOCUMENT (Visual-First Proposal Format) */}
                  <motion.div
                     layout
                     ref={quotationRef}
                     id="quotation-preview-doc"
                     className="w-full max-w-[212.5rem] bg-white shadow-2xl shadow-slate-200 rounded-2xl relative min-h-264 flex flex-col overflow-hidden border border-slate-200 print:shadow-none print:rounded-none print-only"
                  >
                     <div className="p-12 lg:p-14 space-y-12">

                        {/* Header: Venue Identity */}
                        <div className="flex justify-between items-start">
                           <div className="space-y-1">
                              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">{venueProfile?.venueName || "Henry's Imperial Ballroom"}</h1>
                              <div className="flex items-center gap-1.5 text-slate-400 mt-2">
                                 <MapPin size={14} className="text-pink-500" />
                                 <p className="text-xs font-medium uppercase tracking-wider">{venueProfile?.location || "Nainital Road, Haldwani"}</p>
                              </div>
                           </div>
                           <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden">
                              {(() => {
                                 const rawPhotos = typeof venueProfile?.photos === 'string' ? JSON.parse(venueProfile.photos) : venueProfile?.photos;
                                 const photos = Array.isArray(rawPhotos) ? rawPhotos.map((p: any) => typeof p === 'string' ? { id: p, category: 'All Photos' } : p) : [];
                                 const avatar = photos.find((p: any) => p.category === 'Profile');
                                 if (avatar) {
                                    return (
                                       /* eslint-disable-next-line @next/next/no-img-element */
                                       <img
                                          crossOrigin="anonymous"
                                          src={`https://sgp.cloud.appwrite.io/v1/storage/buckets/venues_photos/files/${avatar.id}/view?project=69ae84bc001ca4edf8c2`}
                                          alt="Logo"
                                          className="object-cover w-full h-full"
                                       />
                                    );
                                 }
                                 return /* eslint-disable-next-line @next/next/no-img-element */
                                 <img crossOrigin="anonymous" src={typeof logo === 'string' ? logo : logo.src} alt="Logo" className="object-contain w-10 h-10 opacity-50" />;
                              })()}
                           </div>
                        </div>

                        {/* Personalized Intro & Overview */}
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Proposal for {quoteData.client || 'Client'}</h3>
                              <p className="text-base text-slate-500 leading-relaxed">
                                 Hi {quoteData.client ? quoteData.client.split(' ')[0] : ''}, based on your requirements, here is our customized proposal for your upcoming event.
                              </p>
                           </div>

                           <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                              <div className="space-y-3">
                                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Details</h4>
                                 <div>
                                    <p className="text-sm font-bold text-slate-800">{quoteData.client || 'N/A'}</p>
                                    {quoteData.contact && <p className="text-xs text-slate-500 mt-1">{quoteData.contact}</p>}
                                    {quoteData.email && <p className="text-xs text-slate-500 mt-0.5">{quoteData.email}</p>}
                                 </div>
                              </div>
                              <div className="space-y-3">
                                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event Specifications</h4>
                                 <div>
                                    <p className="text-sm font-bold text-slate-800">{quoteData.event || 'N/A'}</p>
                                    <p className="text-xs text-slate-500 mt-1">Date: {quoteData.eventDate ? new Date(quoteData.eventDate).toLocaleDateString() : 'TBD'}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Guests: {quoteData.guestCount || 0} Pax</p>
                                 </div>
                              </div>
                              {quoteData.specialRequests && (
                                 <div className="col-span-2 pt-4 border-t border-slate-200 mt-2">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Special Directives</h4>
                                    <p className="text-xs text-slate-600 ">&quot;{quoteData.specialRequests}&quot;</p>
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* About Our Venue */}
                        <div className="space-y-4">
                           <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amenities Included</h4>
                           <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                              <div className="flex flex-wrap gap-4">
                                 {(() => {
                                    const rawAmenities = typeof venueProfile?.amenities === 'string' 
                                       ? JSON.parse(venueProfile.amenities) 
                                       : (Array.isArray(venueProfile?.amenities) ? venueProfile.amenities : []);
                                    
                                    if (rawAmenities.length === 0) {
                                       return <span className="text-sm text-slate-400">No amenities listed.</span>;
                                    }

                                    return rawAmenities.map((amenity: string) => {
                                       const icon = AMENITY_ICONS[amenity] || AMENITY_ICONS['Garden'];
                                       return (
                                          <div key={amenity} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                             <div className="text-slate-500 scale-90">
                                                {icon}
                                             </div>
                                             <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">{amenity}</span>
                                          </div>
                                       );
                                    });
                                 })()}
                              </div>
                           </div>
                        </div>

                        {/* Venue Gallery */}
                        {(() => {
                           const rawPhotos = typeof venueProfile?.photos === 'string' ? JSON.parse(venueProfile.photos) : venueProfile?.photos;
                           const photos = Array.isArray(rawPhotos) ? rawPhotos.map((p: any) => typeof p === 'string' ? { id: p, category: 'All Photos' } : p) : [];
                           const gallery = photos.filter((p: any) => quoteData.selectedImages?.includes(p.id));

                           if (gallery.length === 0) return null;

                           return (
                              <div className="space-y-4">
                                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Venue Preview</h4>
                                 <div className="grid grid-cols-3 gap-3">
                                    {gallery.map((photo: any, i) => (
                                       <div key={photo.id || i} className="aspect-4/3 rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200">
                                          /* eslint-disable-next-line @next/next/no-img-element */
                                       <img
                                             crossOrigin="anonymous"
                                             src={`https://sgp.cloud.appwrite.io/v1/storage/buckets/venues_photos/files/${photo.id}/view?project=69ae84bc001ca4edf8c2`}
                                             alt={`View ${i}`}
                                             className="absolute inset-0 w-full h-full object-cover"
                                          />
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           );
                        })()}

                        {/* Financial Ledger Table */}
                        <div className="pt-6">
                           <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Investment Summary</h4>
                           <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                              <table className="w-full border-collapse bg-white">
                                 <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                       <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider p-4 w-2/3">Item Description</th>
                                       <th className="text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider p-4 w-1/3">Amount (₹)</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                    {quoteData.lineItems.map((item, i) => (
                                       <tr key={item.id || i} className="hover:bg-slate-50 transition-colors">
                                          <td className="p-4">
                                             <p className="text-[13px] font-semibold text-slate-800">{item.label}</p>
                                          </td>
                                          <td className="p-4 text-right">
                                             <p className="text-[13px] font-medium text-slate-600">₹{item.amount.toLocaleString('en-IN')}</p>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>

                           {/* Totals Floating Card */}
                           <div className="flex justify-end pt-6">
                              <div className="w-full max-w-[320px] bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                                 <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-500">Subtotal</span>
                                    <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                 </div>
                                 {discountAmt > 0 && (
                                    <div className="flex justify-between items-center text-sm text-rose-500">
                                       <span className="font-medium">Discount</span>
                                       <span className="font-semibold">-₹{discountAmt.toLocaleString('en-IN')}</span>
                                    </div>
                                 )}
                                 <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-500">GST ({quoteData.gstRate}%)</span>
                                    <span className="font-semibold text-slate-900">₹{gstAmt.toLocaleString('en-IN')}</span>
                                 </div>
                                 <div className="h-px bg-slate-200 my-3" />
                                 <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-slate-900">Total</span>
                                    <span className="text-2xl font-black text-pink-500 tracking-tight">₹{total.toLocaleString('en-IN')}</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Signature Section */}
                        <div className="flex justify-end pt-8">
                           <div className="text-right space-y-3">
                              <div className="w-40 h-px bg-slate-300 ml-auto" />
                              <div>
                                 <p className="text-[11px] font-bold text-slate-900 tracking-wider">{quoteData.signatory || venueProfile?.venueName || "Henry's Imperial Ballroom"}</p>
                                 <p className="text-[10px] text-slate-500 mt-0.5">Authorized Signatory</p>
                              </div>
                           </div>
                        </div>

                        {/* Visual-First Footer */}
                        <div className="mt-auto pt-10">
                           <div className="border-t border-slate-100 pt-6 text-center">
                              <p className="text-[10px] font-medium text-slate-400 flex items-center justify-center gap-1.5">
                                 <span className="text-pink-500">✧</span> Generated seamlessly via PartyDial Quotation Maker
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
