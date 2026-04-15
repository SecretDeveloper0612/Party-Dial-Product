"use client";

import { useState, useEffect } from "react";
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
  CreditCard,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: CreditCard, label: "Billing", path: "/billing" },
  { icon: Building2, label: "Venue Management", path: "/venues" },
  { icon: CheckSquare, label: "Approve Listings", path: "/approvals" },
  { icon: Target, label: "Lead Distribution", path: "/lead-distribution" },
  { icon: Target, label: "Lead Dist. (Venues)", path: "/lead-distribution-venues" },
  { icon: Table, label: "Lead Matrix", path: "/crm/leads" },
  { icon: FileText, label: "Price Leads", path: "/price-leads" },
  { icon: CheckCircle, label: "Venue Leads Check", path: "/venue-leads" },
  { icon: Zap, label: "Plan Management", path: "/plans" },
  { icon: Users, label: "User & Role Management", path: "/users" },
  { icon: GitGraph, label: "Team Structure", path: "/team-tree" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem("party_admin_session");
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setUser(session.user);
      } catch (e) {
        console.error("Sidebar user parse error", e);
      }
    }
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose();
  }, [pathname]);

  if (pathname === "/login") return null;

  // Module Access Filtering
  let moduleAccess: string[] = [];
  try {
    moduleAccess = JSON.parse(user?.prefs?.moduleAccess || "[]");
  } catch {}

  const filteredMenuItems = menuItems.filter(item => {
    const role = user?.prefs?.role;
    if (role === "Super Admin") return true;
    if (item.label === "Dashboard") return true;
    if (role === "BDE" && item.label === "Lead Distribution") return false;

    const moduleMap: Record<string, string> = {
       "Billing": "Billing",
       "Venue Management": "Venues",
       "Approve Listings": "Approvals",
       "Lead Distribution": "Leads",
       "Lead Dist. (Venues)": "Leads",
       "Lead Matrix": "Leads",
       "Price Leads": "Leads",
       "Venue Leads Check": "Leads",
       "Plan Management": "Settings",
       "User & Role Management": "Users",
       "Team Structure": "Users"
    };
    
    const requiredModule = moduleMap[item.label];
    return moduleAccess.includes(requiredModule);
  });

  const initials = user?.name 
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() 
    : "PD";

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[59] lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-[var(--sidebar-w)] bg-white flex flex-col z-[60] border-r border-slate-100 shadow-sm overflow-hidden transition-transform duration-300",
        // Mobile: off-screen by default, slide in when open
        "translate-x-[-100%] lg:translate-x-0",
        isOpen && "translate-x-0"
      )}>
        {/* Brand */}
        <div className="h-[var(--header-h)] flex items-center justify-between px-6 shrink-0 border-b border-slate-50">
          <Link href="/" className="flex items-center no-underline" onClick={onClose}>
             <img 
               src="/logo.jpg" 
               alt="PartyDial Logo" 
               className="h-10 w-auto rounded-lg object-contain shadow-sm hover:scale-105 transition-transform"
             />
          </Link>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-all"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin py-4">
          {/* Profile Card */}
          <div className="px-6 mb-6">
             <div className="flex items-center gap-3 group/profile">
                <div className="relative shrink-0">
                   <div className="w-11 h-11 rounded-full grad-brand text-white flex items-center justify-center font-black text-sm shadow-md">
                      {initials}
                   </div>
                   <div className="absolute -right-0.5 bottom-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-sm font-bold text-slate-700 m-0 truncate">{user?.name || "Loading..."}</h4>
                   <p className="text-[11px] text-slate-400 font-medium m-0 truncate mt-0.5">{user?.prefs?.role || "System User"}</p>
                </div>
                <div className="text-emerald-400 shrink-0">
                  <CheckCircle size={14} />
                </div>
             </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-0.5">
            {filteredMenuItems.map((item, idx) => {
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
        
        {/* Footer */}
        <div className="p-5 space-y-3">
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
            className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 group/logout"
          >
             <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover/logout:bg-rose-100 transition-colors shrink-0">
                <LogOut size={16} />
             </div>
             <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
