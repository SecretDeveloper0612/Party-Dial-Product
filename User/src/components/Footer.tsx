'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-20 bg-[#0F172A] text-white">
       <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
             <div className="col-span-1 md:col-span-1">
                <Image src="/logo.jpg" alt="PartyDial" width={160} height={50} className="mb-8 opacity-90" />
                <p className="text-slate-400 font-medium leading-relaxed">India's most trusted event venue discovery platform. Dialing up the energy of every celebration.</p>
             </div>
             <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-white underline decoration-pd-pink decoration-2 underline-offset-8">Quick Links</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-500 italic">
                  <li className="hover:text-pd-red cursor-pointer">About Us</li>
                  <li className="hover:text-pd-red cursor-pointer"><Link href="/categories">Venues</Link></li>
                  <li className="hover:text-pd-red cursor-pointer">Services</li>
                  <li className="hover:text-pd-red cursor-pointer">Contact</li>
                </ul>
             </div>
             <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-white underline decoration-pd-purple decoration-2 underline-offset-8">Support</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-500 italic">
                  <li className="hover:text-pd-blue cursor-pointer">Help Center</li>
                  <li className="hover:text-pd-blue cursor-pointer">Terms of Service</li>
                  <li className="hover:text-pd-blue cursor-pointer">Privacy Policy</li>
                </ul>
             </div>
             <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-white underline decoration-pd-red decoration-2 underline-offset-8">Contact</h4>
                <p className="text-slate-400 font-medium mb-4 italic">hello@partydial.com</p>
                <p className="text-slate-400 font-medium italic underline">+91 98765 43210</p>
             </div>
          </div>
          <div className="pt-12 border-t border-slate-800 text-center">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">© 2026 PARTYDIAL LTD • POWERED BY CELEBRATION TECHNOLOGY</p>
          </div>
       </div>
    </footer>
  );
}
