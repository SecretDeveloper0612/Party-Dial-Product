"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Target, 
  Building2, 
  Users, 
  Briefcase,
  ChevronRight,
  LayoutDashboard,
  TrendingUp,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { id: 'leads', label: 'Leads', icon: Target, path: '/crm/leads' },
    { id: 'pipeline', label: 'Pipeline', icon: LayoutDashboard, path: '/crm/pipeline' },
    { id: 'followups', label: 'Follow-ups', icon: Clock, path: '/crm/followups' },
    { id: 'accounts', label: 'Accounts', icon: Building2, path: '/crm/accounts' },
    { id: 'contacts', label: 'Contacts', icon: Users, path: '/crm/contacts' },
    { id: 'opportunities', label: 'Performance', icon: TrendingUp, path: '/crm/performance' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Dynamic Sub-Navigation Header */}
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
