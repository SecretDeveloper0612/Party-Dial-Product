'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  User,
  Mail, 
  Lock, 
  Phone,
  Eye, 
  EyeOff, 
  ArrowRight, 
  Chrome,
  CheckCircle2,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const passwordStrength = useMemo(() => {
    const pass = formData.password;
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-100' };
    let score = 0;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    if (score < 2) return { score, label: 'Weak', color: 'bg-red-400' };
    if (score < 4) return { score, label: 'Medium', color: 'bg-yellow-400' };
    return { score, label: 'Strong', color: 'bg-green-400' };
  }, [formData.password]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!isPhoneVerified) {
      alert("Please verify your phone number first");
      return;
    }
    setIsLoading(true);
    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      alert("Account created successfully!");
    }, 2000);
  };

  const validatePhone = (phone: string) => {
    // Basic Indian phone validation
    const regex = /^[6-9]\d{9}$/;
    if (!phone) return "Phone number is required";
    if (!regex.test(phone)) return "Please enter a valid 10-digit Indian phone number";
    return "";
  };

  const handleSendOtp = () => {
    const error = validatePhone(formData.phone);
    if (error) {
      setPhoneError(error);
      return;
    }
    setPhoneError("");
    setIsVerifying(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsVerifying(false);
      setShowOtpField(true);
      alert("OTP sent to your mobile number (Mock: 123456)");
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp === "123456") {
      setIsPhoneVerified(true);
      setShowOtpField(false);
      alert("Phone number verified successfully!");
    } else {
      alert("Invalid OTP. Try 123456");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { account } = await import('@/lib/appwrite');
      const { OAuthProvider } = await import('appwrite');
      
      const currentUrl = window.location.origin;
      
      await account.createOAuth2Session(
        OAuthProvider.Google,
        `${currentUrl}/`,
        `${currentUrl}/signup`
      );
    } catch (error) {
      console.error('Google signup failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      
      {/* LEFT SIDE: VISUAL BANNER */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-[40%] relative bg-slate-900 border-r border-slate-100"
      >
        <Image 
          src="/categories/wedding.png"
          alt="Event Celebration"
          fill
          className="object-cover opacity-60 scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-pd-purple/20 to-transparent"></div>
        
        <div className="relative z-10 w-full p-16 flex flex-col justify-between text-white">
          <Link href="/" className="flex items-center gap-2 group text-white/80 hover:text-white transition-colors">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest italic">Partydial</span>
          </Link>

          <div>
             <h1 className="text-5xl font-black mb-6 leading-tight italic">
               Create Your Account <br/>
               <span className="text-pd-red not-italic">& Find The Perfect</span><br/>
               Venue Today.
             </h1>
             <p className="text-white/60 font-semibold text-lg max-w-sm">Join 50,000+ planners who use PartyDial for seamless event discovery.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <ShieldCheck size={20} className="text-pd-pink" />
               </div>
               <p className="text-xs font-black uppercase tracking-widest">Secure Payments & Escrow</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE: SIGNUP FORM */}
      <div className="flex-1 flex flex-col justify-start px-6 md:px-12 lg:px-24 py-16 overflow-y-auto no-scrollbar">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Join PartyDial</h2>
            <p className="text-slate-400 font-semibold">Start your journey to a perfect event.</p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-black text-slate-700 text-[10px] uppercase tracking-[0.2em] mb-8 active:scale-95"
          >
             <Chrome size={20} className="text-pd-purple" />
             Continue with Google
          </button>

          <form onSubmit={handleSignup} className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-red transition-colors">
                   <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe" 
                  className="w-full h-14 pl-14 pr-6 bg-slate-100/50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-pd-red transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email</label>
                 <div className="relative group">
                   <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-red transition-colors">
                      <Mail size={18} />
                   </div>
                   <input 
                     type="email" 
                     value={formData.email}
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                     placeholder="email@work.com" 
                     className="w-full h-14 pl-14 bg-slate-100/50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-pd-red transition-all"
                     required
                   />
                 </div>
               </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    {isPhoneVerified && (
                      <span className="text-[9px] font-black text-green-500 uppercase flex items-center gap-1">
                        <CheckCircle2 size={10} /> Verified
                      </span>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-red transition-colors">
                       <Phone size={18} />
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                          type="tel" 
                          disabled={isPhoneVerified || showOtpField}
                          value={formData.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setFormData({...formData, phone: val});
                            if (phoneError) setPhoneError("");
                          }}
                          placeholder="10-digit Mobile Number" 
                          className={cn(
                            "w-full h-14 pl-14 bg-slate-100/50 border rounded-2xl text-xs font-bold outline-none transition-all",
                            phoneError ? "border-red-400 focus:border-red-500" : "border-slate-100 focus:bg-white focus:border-pd-red",
                            isPhoneVerified && "bg-green-50 border-green-100 text-green-700"
                          )}
                          required
                        />
                        <span className="absolute left-9 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">+91</span>
                      </div>
                      {!isPhoneVerified && !showOtpField && (
                        <button 
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isVerifying || !formData.phone}
                          className="px-4 h-14 bg-pd-red text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-pd-red/90 transition-all disabled:opacity-50 shrink-0 shadow-lg shadow-pd-red/20"
                        >
                          {isVerifying ? "..." : "Verify"}
                        </button>
                      )}
                    </div>
                    {phoneError && <p className="text-[9px] font-bold text-red-500 mt-1 ml-2 italic">{phoneError}</p>}
                  </div>

                  {showOtpField && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3"
                    >
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enter 6-Digit OTP</p>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={otp}
                          maxLength={6}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••••"
                          className="flex-1 h-12 px-4 bg-white border border-slate-200 rounded-xl text-center tracking-[0.5em] font-black text-lg outline-none focus:border-pd-red transition-all"
                        />
                        <button 
                          type="button"
                          onClick={handleVerifyOtp}
                          className="px-6 h-12 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                        >
                          Verify
                        </button>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setShowOtpField(false)}
                        className="text-[9px] font-bold text-slate-400 uppercase hover:text-pd-red transition-colors px-1"
                      >
                        Change Number
                      </button>
                    </motion.div>
                  )}
                </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Create Password</label>
                 {formData.password && (
                   <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${passwordStrength.color} text-white`}>{passwordStrength.label}</span>
                 )}
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-red transition-colors">
                   <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="At least 8 chars" 
                  className="w-full h-14 pl-14 pr-14 bg-slate-100/50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-pd-red transition-all"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirm Password</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pd-red transition-colors">
                   <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="Repeat password" 
                  className="w-full h-14 pl-14 bg-slate-100/50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-pd-red transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-3 ml-2">
               <input 
                type="checkbox" 
                id="terms" 
                required
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                className="mt-1 w-4 h-4 rounded border-slate-200 text-pd-red focus:ring-pd-red" 
               />
               <label htmlFor="terms" className="text-xs font-semibold text-slate-400 leading-normal">
                 I agree to the <Link href="/terms" className="text-pd-purple underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-pd-purple underline">Privacy Policy</Link>.
               </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
            >
               {isLoading ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 <>Create Account <ArrowRight size={18} /></>
               )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-semibold text-slate-400">
            Already have an account? {' '}
            <Link href="/login" className="text-pd-purple font-black uppercase tracking-widest text-[11px] ml-2 hover:underline">Sign In Now</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
