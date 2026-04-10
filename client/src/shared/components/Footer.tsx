'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
   return (
      <footer className="py-20 lg:py-32 bg-[#0F172A] text-white border-t border-white/5 relative overflow-hidden">
         {/* Subtle Glow Effect */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-pd-pink/5 blur-[120px] rounded-full pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
               
               {/* Brand Section */}
               <div className="space-y-8">
                  <Link href="/" className="inline-block">
                     <Image 
                        src="/logo-gradient.png" 
                        alt="PartyDial" 
                        width={220} 
                        height={70} 
                        className="opacity-90 hover:opacity-100 transition-opacity drop-shadow-sm" 
                     />
                  </Link>
                  <p className="text-slate-400 font-medium leading-loose text-sm max-w-sm">
                     India's most sophisticated event discovery ecosystem. We curate extraordinary venues and seamless experiences to elevate every milestone.
                  </p>
                  <div className="flex items-center gap-5">
                     {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                        <button key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-pd-pink hover:border-pd-pink hover:bg-pd-pink/5 transition-all">
                           <Icon size={18} />
                        </button>
                     ))}
                  </div>
               </div>

               {/* Quick Navigation */}
               <div className="space-y-8">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic">Navigation</h4>
                  <ul className="grid grid-cols-1 gap-5">
                     {[
                        { label: 'Explore Venues', href: '/categories' },
                        { label: 'Event Services', href: '#' },
                        { label: 'The Experience', href: '/about' },
                        { label: 'Partner Program', href: '/contact' },
                     ].map((link, i) => (
                        <li key={i}>
                           <Link 
                              href={link.href} 
                              className="text-[13px] font-black uppercase tracking-widest text-slate-300 hover:text-pd-pink transition-colors group flex items-center gap-3"
                           >
                              <span className="w-0 h-[2px] bg-pd-pink transition-all group-hover:w-4" />
                              {link.label}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Contact Intelligence */}
               <div className="space-y-8">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic">Inquiries</h4>
                  <div className="space-y-6">
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-pd-pink shrink-0">
                           <Mail size={18} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Corporate Email</p>
                           <p className="text-sm font-black italic text-slate-200">support@partydial.com</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-pd-pink shrink-0">
                           <Phone size={18} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">24/7 Helpline</p>
                           <p className="text-sm font-black italic text-slate-200">+91 90589 88455</p>
                        </div>
                     </div>
                  </div>
               </div>

            </div>

            {/* Bottom Bar */}
            <div className="mt-20 lg:mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] space-y-2 text-center md:text-left">
                  <p>© 2026 PARTYDIAL</p>
                  <p className="opacity-70">A Platform by Preet Tech</p>
                  <p className="opacity-50">All billing and operations managed exclusively by Preet Tech</p>
               </div>
               <div className="flex items-center gap-8">
                  <Link href="/privacy-policy" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-white transition-colors">Privacy Policy</Link>
                  <Link href="/terms-of-service" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-white transition-colors">Terms of Service</Link>
                  <Link href="/refund-policy" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-white transition-colors">Refund / Return Policy</Link>
               </div>
            </div>
         </div>
      </footer>
   );
}
