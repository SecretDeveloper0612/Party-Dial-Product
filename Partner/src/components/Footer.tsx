import Link from 'next/link';
import { Target, MessageSquare, ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-20 pb-10 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-6">
            <div className="text-2xl font-black italic">
              PartyDial <span className="text-pd-red text-sm uppercase tracking-widest not-italic">Partner</span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Empowering venues and event partners with high-quality leads and smart management tools.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-pd-red mb-8">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="#benefits" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Benefits</Link></li>
              <li><Link href="#plans" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Subscription Plans</Link></li>
              <li><Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Merchant App</Link></li>
              <li><Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Lead Manager</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-pd-red mb-8">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Partner FAQ</Link></li>
              <li><Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Success Stories</Link></li>
              <li><Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Community</Link></li>
              <li><Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-pd-red mb-8">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">© 2026 PartyDial Technologies Pvt Ltd.</p>
          <div className="flex gap-8">
            <Zap size={18} className="text-white/20" />
            <Target size={18} className="text-white/20" />
            <ShieldCheck size={18} className="text-white/20" />
            <MessageSquare size={18} className="text-white/20" />
          </div>
        </div>
      </div>
    </footer>
  );
}
