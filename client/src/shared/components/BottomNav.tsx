'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { Home, MapPin, Grid, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const isApp = useSyncExternalStore(
    () => () => {},
    () => typeof navigator !== 'undefined' && navigator.userAgent.includes('PartyDialMobileApp'),
    () => false
  );

  if (!isApp) return null;

  const navItems = [
    { label: 'Home', href: '/', icon: <Home size={24} /> },
    { label: 'Venues', href: '/venues', icon: <MapPin size={24} /> },
    { label: 'Categories', href: '/categories', icon: <Grid size={24} /> },
    { label: 'Account', href: '/login', icon: <User size={24} /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[100] pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? 'text-pd-pink' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-pd-pink' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
