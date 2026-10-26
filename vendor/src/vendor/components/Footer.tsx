'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    <footer suppressHydrationWarning className="bg-[#080d19] pt-16 sm:pt-20 pb-10 px-5 sm:px-8 text-white relative overflow-hidden font-poppins">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-pd-blue/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-12 -right-24 w-80 h-80 bg-pd-pink/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-12 sm:mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5 text-left">
            <div className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="PartyDial" 
                width={140} 
                height={40} 
                className="h-9 w-auto object-contain brightness-110" 
              />
              <div className="h-4 w-[1px] bg-white/20 mx-1"></div>
              <span className="text-pd-pink text-[10px] font-semibold font-poppins uppercase tracking-[0.25em]">Partner</span>
            </div>
            
            <p className="max-w-sm text-slate-400 text-xs sm:text-sm font-normal font-poppins leading-relaxed">
              Empowering venues and event partners with high-quality leads and the most advanced booking &amp; management engine in India.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {[
                { 
                  Icon: Facebook, 
                  color: 'hover:bg-blue-600 hover:border-blue-500', 
                  href: 'https://www.facebook.com/partydial',
                  label: 'Facebook'
                },
                { 
                  Icon: Instagram, 
                  color: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-600 hover:to-purple-600 hover:border-transparent', 
                  href: 'https://www.instagram.com/partydial_/',
                  label: 'Instagram'
                },
                { 
                  Icon: () => (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                  ), 
                  color: 'hover:bg-white/20 hover:border-white/30', 
                  href: '#',
                  label: 'X' 
                },
                { Icon: Linkedin, color: 'hover:bg-blue-700 hover:border-blue-600', href: '#', label: 'LinkedIn' },
                { Icon: AtSign, color: 'hover:bg-white hover:text-slate-900 hover:border-white', href: '#', label: 'Threads' },
                { Icon: Youtube, color: 'hover:bg-red-600 hover:border-red-500', href: '#', label: 'YouTube' }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href || '#'} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg text-slate-300 hover:text-white ${social.color} group`}
                  title={social.label}
                >
                  <social.Icon size={16} className="group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Navigation Links: 2-Columns on Mobile, Individual on Desktop */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6 sm:gap-8 text-left">
            <div>
              <h4 className="text-xs font-semibold font-poppins uppercase tracking-[0.2em] text-white/90 mb-4 sm:mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pd-pink"></span> Platform
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {[
                  { name: 'About Us', href: '/about' },
                  { name: 'How it Works', href: '/process' },
                  { name: 'Pricing Plans', href: '/pricing' },
                  { name: 'Merchant App', href: '/login' },
                  { name: 'Lead Manager', href: '/dashboard' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="group relative inline-block text-xs sm:text-sm font-normal font-poppins text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1"
                    >
                      <span>{link.name}</span>
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-full mt-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold font-poppins uppercase tracking-[0.2em] text-white/90 mb-4 sm:mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pd-blue"></span> Resources
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {[
                  { name: 'Privacy Policy', href: '/privacy-policy' },
                  { name: 'Terms of Service', href: '/terms-of-service' },
                  { name: 'Refund Policy', href: '/refund-policy' },
                  { name: 'Contact Us', href: '/contact' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="group relative inline-block text-xs sm:text-sm font-normal font-poppins text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1"
                    >
                      <span>{link.name}</span>
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-full mt-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4 text-left">
             <div className="p-5 sm:p-7 bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 w-36 h-36 bg-pd-pink/10 rounded-full blur-2xl pointer-events-none"></div>
                
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-semibold font-poppins text-white uppercase tracking-wider mb-2.5">
                   Growth Insights
                </span>
                <p className="text-xs font-normal font-poppins text-slate-400 mb-4 leading-relaxed">
                   Join 500+ venues receiving weekly market trends, high-conversion strategies, and lead tips.
                </p>
                
                <form onSubmit={(e) => e.preventDefault()} className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input 
                      type="email"
                      suppressHydrationWarning
                      className="w-full h-11 sm:h-12 bg-white/[0.05] border border-white/15 rounded-xl pl-11 pr-12 text-xs sm:text-sm font-normal font-poppins text-white placeholder:text-slate-400 focus:border-pd-pink focus:bg-white/[0.08] focus:ring-2 focus:ring-pd-pink/20 transition-all outline-none" 
                      placeholder="Enter your email" 
                   />
                   <button 
                      type="submit"
                      aria-label="Subscribe to Growth Insights"
                      className="absolute right-1.5 top-1.5 w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
                   >
                      <ArrowRight size={15} />
                   </button>
                </form>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs font-normal font-poppins text-slate-400 tracking-wider">
            © 2026 PartyDial. All rights reserved.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-normal font-poppins text-slate-400">
            <span className="text-slate-300 font-semibold font-poppins">
              A Platform by Preet Tech OPC Private Limited
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-[11px] text-slate-400">
              All billing & operations managed exclusively by Preet Tech OPC Private Limited
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}


