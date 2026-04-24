'use client';

import Image from 'next/image';
import Link from 'next/link';
import { 
  Instagram, 
  Linkedin, 
  Youtube,
  AtSign,
  ArrowRight,
  Mail,
  ChevronRight,
  Facebook
} from 'lucide-react';

export default function Footer() {
  return (
    <footer suppressHydrationWarning className="bg-[#0B1121] pt-24 pb-12 px-6 text-white relative overflow-hidden font-pd">
      {/* Background Ornaments */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] bg-pd-pink/10 rounded-full blur-[120px] pointer-events-none opacity-20"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-10 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-1">
              <Image 
                src="/logo-gradient.png" 
                alt="PartyDial" 
                width={160} 
                height={45} 
                className="h-10 w-auto object-contain" 
              />
            </div>
            
            <p className="max-w-sm text-slate-400 text-base font-medium leading-relaxed">
              India's most sophisticated event discovery ecosystem. We curate extraordinary venues and seamless experiences to elevate every milestone.
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {[
                { 
                  Icon: Facebook, 
                  color: 'hover:bg-blue-600', 
                  href: 'https://www.facebook.com/partydial',
                  label: 'Facebook'
                },
                { 
                  Icon: Instagram, 
                  color: 'hover:bg-pink-600', 
                  href: 'https://www.instagram.com/partydial_/',
                  label: 'Instagram'
                },
                { 
                  Icon: () => (
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                  ), 
                  color: 'hover:bg-black', 
                  href: '#',
                  label: 'X' 
                },
                { Icon: Linkedin, color: 'hover:bg-blue-700', href: '#', label: 'LinkedIn' },
                { Icon: AtSign, color: 'hover:bg-white hover:text-black', href: '#', label: 'Threads' },
                { Icon: Youtube, color: 'hover:bg-red-600', href: '#', label: 'YouTube' }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href || '#'} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-11 h-11 rounded-[16px] bg-white/5 border border-white/5 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color} group`}
                  title={social.label}
                >
                  <social.Icon size={18} className="group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Navigation Columns */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-pd-pink mb-10 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-pd-pink"></div> Ecosystem
            </h4>
            <ul className="space-y-5">
              {[
                { name: 'Explore Venues', href: '/categories' },
                { name: 'Event Services', href: '#' },
                { name: 'About Us', href: '/about' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-all duration-300">
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-pd-pink" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-pd-pink mb-10 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-pd-pink"></div> Legal
            </h4>
            <ul className="space-y-5">
              {[
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Terms of Service', href: '/terms-of-service' },
                { name: 'Refund / Return Policy', href: '/refund-policy' },
                { name: 'Contact Us', href: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-all duration-300">
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-pd-pink" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA Column */}
          <div className="lg:col-span-4">
             <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pd-pink/5 rounded-full blur-3xl"></div>
                
                <h4 className="text-sm font-black italic uppercase tracking-widest mb-4">Event Insights</h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8 leading-relaxed">Join 1,000+ users receiving weekly event discovery tips and venue alerts.</p>
                
                <div className="relative">
                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input 
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-14 text-sm font-bold focus:border-pd-pink focus:bg-white/10 transition-all outline-none" 
                      placeholder="Email Address" 
                   />
                   <button className="absolute right-2 top-2 w-10 h-10 bg-white text-slate-900 rounded-xl flex items-center justify-center hover:bg-pd-pink hover:text-white transition-all duration-300">
                      <ArrowRight size={18} />
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col xl:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">© 2026 PARTYDIAL</p>
            <div className="hidden md:block w-[1px] h-4 bg-white/10"></div>
            <p className="text-[10px] font-black text-pd-pink uppercase tracking-[0.2em]">A Platform by Preet Tech</p>
            <div className="hidden md:block w-[1px] h-4 bg-white/10"></div>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] italic">All billing and operations managed exclusively by Preet Tech</p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
