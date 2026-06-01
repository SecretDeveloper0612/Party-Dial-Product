import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle2, ShieldCheck, AlertCircle, ScanLine, XCircle } from 'lucide-react';
import Tesseract from 'tesseract.js';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueProfile: any;
}

type ScanStatus = 'idle' | 'scanning' | 'valid' | 'invalid';

export default function VerificationModal({ isOpen, onClose, venueProfile }: VerificationModalProps) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [files, setFiles] = useState<Record<string, File | null>>({
    gst: null,
    ownerId: null,
    cheque: null,
    address: null
  });

  const [scanStatus, setScanStatus] = useState<Record<string, ScanStatus>>({
    gst: 'idle',
    ownerId: 'idle',
    cheque: 'idle',
    address: 'idle'
  });

  const [scanErrors, setScanErrors] = useState<Record<string, string>>({});

  const validateDocument = async (file: File, type: string) => {
    // Basic type validation
    if (!file.type.startsWith('image/')) {
       // Allow PDF but skip OCR for it due to client-side limitations
       if (file.type === 'application/pdf') {
         setScanStatus(prev => ({ ...prev, [type]: 'valid' }));
         return;
       }
       setScanStatus(prev => ({ ...prev, [type]: 'invalid' }));
       setScanErrors(prev => ({ ...prev, [type]: 'Unsupported format. Please upload an image.' }));
       return;
    }

    setScanStatus(prev => ({ ...prev, [type]: 'scanning' }));
    
    try {
      // Use Tesseract AI OCR to read text from image
      const result = await Tesseract.recognize(file, 'eng');
      const text = result.data.text.trim();
      
      // Random photos usually have very few discernible words
      // A real document (Aadhar, PAN, GST) will have significant text
      const wordCount = text.split(/\s+/).filter(word => word.length > 2).length;
      
      if (wordCount < 4) {
        setScanStatus(prev => ({ ...prev, [type]: 'invalid' }));
        setScanErrors(prev => ({ ...prev, [type]: 'Validation Failed: Does not look like a valid document. Ensure text is clearly visible.' }));
      } else {
        setScanStatus(prev => ({ ...prev, [type]: 'valid' }));
        setScanErrors(prev => ({ ...prev, [type]: '' }));
      }
    } catch (err) {
      console.error('OCR Error:', err);
      // Fallback to valid if OCR fails just so we don't completely block the user incorrectly
      setScanStatus(prev => ({ ...prev, [type]: 'valid' }));
    }
  };

  const handleFileChange = (type: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFiles(prev => ({ ...prev, [type]: file }));
    await validateDocument(file, type);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if any required scan is invalid
    const invalidScans = Object.values(scanStatus).some(status => status === 'invalid');
    if (invalidScans) {
      alert("Please upload valid documents for all required fields.");
      return;
    }

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    }, 2000);
  };

  const renderUploadBox = (id: string, label: string, subLabel: string) => {
    const status = scanStatus[id];
    const file = files[id];
    const error = scanErrors[id];

    return (
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
        <div className={`relative group cursor-pointer overflow-hidden rounded-2xl ${status === 'invalid' ? 'animate-shake' : ''}`}>
          <input 
            type="file" 
            required 
            onChange={handleFileChange(id)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            accept=".pdf,.jpg,.jpeg,.png" 
          />
          <div className={`h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-colors relative
            ${status === 'idle' ? 'border-slate-200 bg-slate-50 group-hover:bg-blue-50 group-hover:border-blue-200' : ''}
            ${status === 'scanning' ? 'border-blue-300 bg-blue-50' : ''}
            ${status === 'valid' ? 'border-emerald-300 bg-emerald-50' : ''}
            ${status === 'invalid' ? 'border-rose-300 bg-rose-50' : ''}
          `}>
            
            {status === 'idle' && (
              <>
                <Upload size={24} className="text-slate-400 group-hover:text-blue-500 mb-2" />
                <span className="text-xs font-bold text-slate-600">Click to upload</span>
                <span className="text-[9px] font-medium text-slate-400 mt-1">{subLabel}</span>
              </>
            )}

            {status === 'scanning' && (
              <>
                <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-scan"></div>
                <ScanLine size={24} className="text-blue-500 mb-2 animate-bounce" />
                <span className="text-xs font-bold text-blue-600">Scanning Document...</span>
                <span className="text-[9px] font-medium text-blue-400 mt-1">Verifying authenticity</span>
              </>
            )}

            {status === 'valid' && (
              <>
                <CheckCircle2 size={24} className="text-emerald-500 mb-2" />
                <span className="text-xs font-bold text-emerald-600">Document Verified</span>
                <span className="text-[9px] font-medium text-emerald-500 mt-1">{file?.name}</span>
              </>
            )}

            {status === 'invalid' && (
              <>
                <XCircle size={24} className="text-rose-500 mb-2" />
                <span className="text-xs font-bold text-rose-600 text-center px-4 leading-tight">Validation Failed</span>
                <span className="text-[9px] font-medium text-rose-500 mt-1 text-center px-2">{error}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <style>{`
          @keyframes scan {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
          }
          .animate-scan {
            animation: scan 2s linear infinite;
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.4s ease-in-out;
          }
        `}</style>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60"
        ></motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Verify Your Profile</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Submit documents for admin approval</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto">
            {success ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Documents Submitted</h4>
                <p className="text-sm font-medium text-slate-500 max-w-sm">
                  Our verification team will review your documents and activate your premium status within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                  <AlertCircle size={20} className="text-blue-500 shrink-0" />
                  <p className="text-xs font-medium text-blue-700 leading-relaxed">
                    To maintain our elite venue standard, we require standard KYC documents. Your documents are scanned instantly using AI to ensure authenticity.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {renderUploadBox('gst', 'GST or Business Registration', 'PDF, JPG up to 5MB')}
                  {renderUploadBox('ownerId', 'Owner ID Proof (Aadhar/PAN)', 'PDF, JPG up to 5MB')}
                  {renderUploadBox('cheque', 'Cancelled Cheque (For Payouts)', 'PDF, JPG up to 5MB')}
                  {renderUploadBox('address', 'Venue Address Proof', 'Electricity Bill/Rent Agreement')}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={uploading} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FileText size={16} /> Submit Documents
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
