'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Instagram, 
  Linkedin, 
  Facebook,
  MapPin,
  Phone,
  Mail,
  Plane,
  Sparkles,
  Building2
} from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isApp = useSyncExternalStore(
    () => () => {},
    () => typeof navigator !== 'undefined' && navigator.userAgent.includes('PartyDialMobileApp'),
    () => false
  );

  if (pathname?.startsWith('/venues')) return null;
  if (pathname === '/ai-search' || isApp) return null;

  return (
    <footer suppressHydrationWarning className="bg-[#F8F5F0] pt-20 pb-10 px-6 text-slate-900 relative overflow-hidden font-pd">
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* TOP CTA SECTION */}
        <div className="text-center flex flex-col items-center mb-24">
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-slate-900 mb-4">
            Your all-in-one Event App
          </h2>
          <p className="text-slate-600 max-w-lg mb-8 font-medium">
            Find banquet halls, resorts, farmhouses, and more in just a few taps.
            Get real-time quotes, vendor details, and event info.
          </p>
          
          <div className="flex items-center gap-4 mb-16">
            <Link href="#" className="hover:scale-105 transition-transform bg-black rounded-lg overflow-hidden flex items-center p-2 pr-4 h-[44px]">
               {/* Simulating Google Play Badge */}
               <svg className="w-8 h-8 ml-1" viewBox="30 336.7 120.9 129.2">
                 <path fill="#FFD400" d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"/>
                 <path fill="#FF3333" d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"/>
                 <path fill="#48FF48" d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"/>
                 <path fill="#3BCCFF" d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"/>
               </svg>
               <div className="text-white flex flex-col items-start leading-none ml-2">
                 <span className="text-[9px] uppercase tracking-wide">GET IT ON</span>
                 <span className="text-sm font-bold">Google Play</span>
               </div>
            </Link>
            <Link href="#" className="hover:scale-105 transition-transform bg-black rounded-lg overflow-hidden flex items-center p-2 pr-4 h-[44px]">
               {/* Simulating App Store Badge */}
               <svg className="w-6 h-6 ml-1" viewBox="0 0 384 512" fill="#fff">
                 <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
               </svg>
               <div className="text-white flex flex-col items-start leading-none ml-2">
                 <span className="text-[9px] uppercase tracking-wide">Download on the</span>
                 <span className="text-sm font-bold">App Store</span>
               </div>
            </Link>
          </div>

          {/* Graphic Section - Placeholder for phones */}
          <div className="relative w-full max-w-4xl h-[420px] flex justify-center items-end mt-4 mb-16">
            
            {/* Left Phone */}
            <div className="w-[140px] md:w-[160px] h-[280px] md:h-[320px] bg-white rounded-[24px] shadow-2xl absolute left-[5%] md:left-[15%] bottom-8 transform -rotate-12 border-[6px] border-white overflow-hidden flex flex-col items-center justify-center opacity-80 z-0">
               <div className="w-full h-full bg-pd-pink/10 flex flex-col items-center p-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-pd-pink mb-4 text-white flex items-center justify-center"><Sparkles size={16}/></div>
                  <span className="font-bold text-pd-pink text-xs md:text-base">Venues</span>
               </div>
            </div>
            
            {/* Right Phone */}
            <div className="w-[140px] md:w-[160px] h-[280px] md:h-[320px] bg-white rounded-[24px] shadow-2xl absolute right-[5%] md:right-[15%] bottom-8 transform rotate-12 border-[6px] border-white overflow-hidden flex flex-col items-center justify-center opacity-80 z-0">
               <div className="w-full h-full bg-pd-blue/10 flex flex-col items-center p-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-pd-blue mb-4 text-white flex items-center justify-center"><Building2 size={16}/></div>
                  <span className="font-bold text-pd-blue text-xs md:text-base">Locations</span>
               </div>
            </div>
            
            {/* Center Phone */}
            <div className="w-[200px] md:w-[220px] h-[360px] md:h-[400px] bg-white rounded-[32px] shadow-2xl z-10 border-[8px] border-white overflow-hidden relative mb-2">
               <div className="w-full h-full bg-gradient-to-br from-pd-pink to-pd-purple p-4 md:p-6 text-white flex flex-col">
                  <div className="flex justify-between items-center mb-6 md:mb-8">
                     <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-white/20"></div></div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Welcome to PartyDial</h3>
                  <div className="grid grid-cols-2 gap-2 md:gap-3 flex-1">
                     <div className="bg-white rounded-xl flex flex-col items-center justify-center text-pd-pink p-2 md:p-3 shadow-sm"><Plane size={20} className="mb-1 md:mb-2"/><span className="text-[9px] md:text-[10px] font-bold">Discover</span></div>
                     <div className="bg-white rounded-xl flex flex-col items-center justify-center text-pd-purple p-2 md:p-3 shadow-sm"><Building2 size={20} className="mb-1 md:mb-2"/><span className="text-[9px] md:text-[10px] font-bold">Venues</span></div>
                     <div className="bg-white rounded-xl flex flex-col items-center justify-center text-pd-red p-2 md:p-3 shadow-sm"><MapPin size={20} className="mb-1 md:mb-2"/><span className="text-[9px] md:text-[10px] font-bold">Locations</span></div>
                     <div className="bg-white rounded-xl flex flex-col items-center justify-center text-orange-500 p-2 md:p-3 shadow-sm"><Phone size={20} className="mb-1 md:mb-2"/><span className="text-[9px] md:text-[10px] font-bold">Contact</span></div>
                  </div>
               </div>
               {/* Home Indicator */}
               <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[40%] h-[4px] bg-black/20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* BOTTOM 4-COLUMN FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pt-16 border-t border-slate-200">
          
          {/* Brand Column (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-1 mb-6">
              <Image 
                src="/logo-nav.png" 
                alt="PartyDial"
                width={160}
                height={50}
                className="w-[140px] sm:w-[160px] h-auto object-contain drop-shadow-sm" 
              />
            </div>
            
            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
              Creating extraordinary event experiences since 2024. Your trusted partner in exploring perfect venues.
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                { Icon: Facebook, href: 'https://www.facebook.com/partydial', label: 'Facebook' },
                { Icon: () => (
                    <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-current" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                  ), href: '#', label: 'X' 
                },
                { Icon: Instagram, href: 'https://www.instagram.com/partydial_/', label: 'Instagram' },
                { Icon: Linkedin, href: '#', label: 'LinkedIn' }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href || '#'} 
                  target="_blank"
                  className="w-8 h-8 rounded-full bg-pd-pink/10 text-pd-pink hover:bg-pd-pink hover:text-white flex items-center justify-center transition-all"
                  title={social.label}
                >
                  <social.Icon size={14} className="" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Quick Links Column (Col Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Venues', href: '/venues' },
                { name: 'Contact', href: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-medium text-slate-600 hover:text-pd-pink transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column (Col Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-slate-900 mb-6">Support</h4>
            <ul className="space-y-4">
              {[
                { name: 'FAQs', href: '#' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Privacy Policy', href: '/privacy' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-medium text-slate-600 hover:text-pd-pink transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Column (Col Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-slate-900 mb-6">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex gap-3 text-slate-600">
                 <MapPin size={18} className="text-pd-pink shrink-0" />
                 <span className="text-sm font-medium">Near Krishna Hospital, Subhash Nagar,<br/>Bhotia Parao, Haldwani, Uttarakhand 263139</span>
              </li>
              <li className="flex gap-3 text-slate-600 items-center">
                 <Phone size={18} className="text-pd-pink shrink-0" />
                 <span className="text-sm font-medium">+91 8679933302</span>
              </li>
              <li className="flex gap-3 text-slate-600 items-center">
                 <Mail size={18} className="text-pd-pink shrink-0" />
                 <span className="text-sm font-medium">support@partydial.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-16 text-center text-xs font-medium text-slate-500 pb-6 border-t border-slate-200 pt-6">
           © 2026 PartyDial. All rights reserved. <br className="md:hidden" />
           <span className="hidden md:inline"> | </span> A Platform by Preet Tech OPC Private Limited
        </div>

      </div>
    </footer>
  );
}
