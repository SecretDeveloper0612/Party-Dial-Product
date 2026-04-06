"use client";

import { usePathname } from "next/navigation";
import { 
  Bell, 
  Search, 
  Settings, 
  Mail,
  Power,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TopBar() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <header className="h-[var(--header-h)] border-b border-slate-100 bg-white flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-6">
        <button className="p-2 text-slate-500 hover:bg-slate-50 transition-colors bg-transparent border-none cursor-pointer">
          <Menu size={20} />
        </button>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#b66dff] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search projects" 
            className="bg-transparent border-none py-2 pl-10 pr-4 text-sm focus:outline-none w-64 text-slate-600 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* User Info */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <img 
            src="https://secure.gravatar.com/avatar/60783ae419e75df676450686411cdb0e?s=128" 
            alt="David" 
            className="w-9 h-9 rounded-full border border-slate-200"
          />
          <span className="text-sm font-bold text-slate-700 group-hover:text-[#b66dff] transition-colors">David Greymaax</span>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-slate-400">
          <button className="relative p-1 hover:text-[#b66dff] transition-colors bg-transparent border-none cursor-pointer group">
             <Mail size={18} />
             <div className="absolute -top-1 -right-1 w-3.5 h-3.5 grad-purple rounded-full border-2 border-white flex items-center justify-center text-[7px] text-white font-black group-hover:scale-110 transition-transform tracking-tighter leading-none">!</div>
          </button>
          
          <button className="relative p-1 hover:text-[#b66dff] transition-colors bg-transparent border-none cursor-pointer group">
             <Bell size={18} />
             <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#fe7096] rounded-full border-2 border-white group-hover:scale-110 transition-transform" />
          </button>
          
          <button className="p-1 hover:text-[#b66dff] transition-colors bg-transparent border-none cursor-pointer">
             <Power size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
