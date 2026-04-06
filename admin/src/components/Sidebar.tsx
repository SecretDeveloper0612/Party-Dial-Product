"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  Settings, 
  LayoutDashboard,
  Target,
  Users,
  ChevronDown,
  Layout,
  Table,
  Map,
  PieChart,
  FileText,
  AlertCircle,
  Bell,
  CheckCircle,
  FolderOpen,
  Zap,
  GitGraph,
  CheckSquare,
  LogOut,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

const Activity = ({ size, className }: { size?: number, className?: string }) => <PieChart size={size} className={className} />;

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Target, label: "CRM", path: "/crm" },
  { icon: CreditCard, label: "Billing", path: "/billing" },
  { icon: Building2, label: "Venue Management", path: "/venues" },
  { icon: CheckSquare, label: "Approve Listings", path: "/approvals" },
  { icon: Users, label: "User & Role Management", path: "/users" },
  { icon: GitGraph, label: "Team Structure", path: "/team-tree" },
];

export default function Sidebar() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[var(--sidebar-w)] bg-white flex flex-col z-[60] border-r border-slate-100 shadow-sm overflow-hidden group">
      {/* Brand */}
      <div className="h-[var(--header-h)] flex items-center justify-center px-6 shrink-0 border-b border-slate-50">
        <Link href="/" className="flex items-center no-underline">
           <img 
             src="/logo.jpg" 
             alt="PartyDial Logo" 
             className="h-10 w-auto rounded-lg object-contain shadow-sm hover:scale-105 transition-transform"
           />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin py-4">
        {/* Profile Card */}
        <div className="px-6 mb-8">
           <div className="flex items-center gap-4 group/profile">
              <div className="relative">
                 <img 
                   src="https://secure.gravatar.com/avatar/60783ae419e75df676450686411cdb0e?s=128" 
                   alt="Profile" 
                   className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                 />
                 <div className="absolute -right-0.5 bottom-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                 <h4 className="text-sm font-bold text-slate-700 m-0 truncate">David Grey. H</h4>
                 <p className="text-[11px] text-slate-400 font-medium m-0 truncate mt-0.5">Project Manager</p>
              </div>
              <div className="text-emerald-400">
                <CheckCircle size={14} />
              </div>
           </div>
        </div>

        {/* Dynamic Nav Items */}
        <nav className="space-y-0.5">
          {menuItems.map((item, idx) => {
            const isActive = item.path === "/" 
              ? pathname === "/" 
              : pathname.startsWith(item.path);
            return (
              <div key={idx}>
                <Link
                  href={item.path}
                   className={cn(
                    "sidebar-nav-link",
                    isActive && "active bg-slate-50 border-l-4 border-[#b66dff] pl-[20px]"
                  )}
                >
                  <span className={cn(
                    "flex-1 flex items-center gap-4",
                    isActive ? "text-[#b66dff]" : "text-slate-500"
                  )}>
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="font-semibold text-sm">{item.label}</span>
                  </span>
                  
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#b66dff]" />}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
      
      {/* Help Link */}
      <div className="p-6 space-y-4">
        <div className="p-4 rounded-xl shadow-lg bg-slate-900 text-white relative overflow-hidden group/upgrade cursor-pointer border border-slate-700">
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Ecosystem Status</p>
              <h5 className="text-xs font-bold leading-tight">Aegis Core Active</h5>
           </div>
           <div className="absolute -right-2 -bottom-2 opacity-20 scale-150 rotate-12 group-hover/upgrade:rotate-0 transition-transform duration-500">
              <ShieldCheck size={40} />
           </div>
        </div>

        <button 
          onClick={() => {
            localStorage.removeItem("party_admin_session");
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 p-4 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 group/logout"
        >
           <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover/logout:bg-rose-100 transition-colors">
              <LogOut size={16} />
           </div>
           <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>
        </button>
      </div>
    </aside>
  );
}
