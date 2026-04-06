"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  FileText, 
  CreditCard, 
  Receipt,
  ChevronRight,
  TrendingUp,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { id: 'quotations', label: 'Quotations', icon: FileText, path: '/billing/quotations' },
    { id: 'invoices', label: 'Invoices', icon: Receipt, path: '/billing/invoices' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/billing/payments' },
    { id: 'overview', label: 'Overview', icon: TrendingUp, path: '/billing/overview' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Sub-Navigation Header */}
      <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-2 max-w-fit">
         {tabs.map((tab) => {
           const isActive = pathname === tab.path;
           return (
             <Link 
               key={tab.id} 
               href={tab.path}
               className={cn(
                 "flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                 isActive 
                   ? "grad-purple text-white shadow-lg shadow-purple-500/20" 
                   : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
               )}
             >
                <tab.icon size={16} />
                <span>{tab.label}</span>
                {isActive && <ChevronRight size={12} className="opacity-60" />}
             </Link>
           );
         })}
      </div>

      <div className="min-h-[calc(100vh-280px)]">
         {children}
      </div>

    </div>
  );
}
