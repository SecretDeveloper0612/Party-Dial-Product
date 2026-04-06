"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2, 
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      // Specified Credentials
      if (username === "ADMIN" && password === "admin123") {
        localStorage.setItem("party_admin_session", "authenticated_" + Date.now());
        router.push("/");
      } else {
        setError("Invalid Administrative Credentials");
        setLoading(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Abstract Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#b66dff]/10 rounded-full blur-3xl animate-pulse" />
         <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-10 lg:p-14 relative z-10 border border-white"
      >
        <div className="text-center mb-12">
           <div className="w-20 h-20 grad-brand rounded-[2rem] mx-auto flex items-center justify-center text-white shadow-2xl shadow-purple-500/30 mb-8 transform hover:rotate-12 transition-transform cursor-pointer">
              <ShieldCheck size={40} />
           </div>
           <h1 className="text-3xl font-black text-slate-800 tracking-tight">Super Admin</h1>
           <p className="text-sm text-slate-400 font-medium mt-2">Aegis Management Protocol 2.0</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Administrative ID</label>
              <div className="relative group">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#b66dff] transition-colors">
                    <User size={18} />
                 </div>
                 <input 
                   required
                   type="text" 
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-[#b66dff] transition-all bg-white"
                   placeholder="Enter System User ID"
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Access Password</label>
              <div className="relative group">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#b66dff] transition-colors">
                    <Lock size={18} />
                 </div>
                 <input 
                   required
                   type={showPassword ? "text" : "password"}
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-[#b66dff] transition-all bg-white"
                   placeholder="••••••••"
                 />
                 <button 
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                 >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
              </div>
           </div>

           {error && (
             <motion.div 
               initial={{ opacity: 0, x: -10 }} 
               animate={{ opacity: 1, x: 0 }}
               className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-500 text-xs font-bold"
             >
                <ShieldAlert size={16} />
                {error}
             </motion.div>
           )}

           <button 
             type="submit" 
             disabled={loading}
             className="w-full py-5 grad-brand text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:scale-100"
           >
              {loading ? (
                 <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Verifying...</span>
                 </>
              ) : (
                 <>
                    <span>Initialize Access</span>
                    <ChevronRight size={18} />
                 </>
              )}
           </button>
        </form>

        <div className="mt-12 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Authorized Personnel Only</p>
           <p className="text-[10px] font-black text-slate-300 mt-1 uppercase">PartyDial Internal Assets © 2024</p>
        </div>

      </motion.div>

    </div>
  );
}
