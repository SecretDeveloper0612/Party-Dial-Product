"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check for existing session
    const sessionStr = localStorage.getItem("party_admin_session");
    
    if (!sessionStr) {
      if (pathname !== "/login") {
        router.push("/login");
      } else {
        setAuthorized(true);
      }
      return;
    }

    try {
      const session = JSON.parse(sessionStr);
      const user = session.user;
      
      if (!user && pathname !== "/login") {
        router.push("/login");
        return;
      }

      // Module Access Protection
      // Extract module from path (e.g., /billing -> Billing, /venues -> Venues)
      const pathParts = pathname.split('/').filter(Boolean);
      const currentModule = pathParts[0] ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1) : "Dashboard";
      
      // Some paths might be special or mapped differently
      const moduleMap: Record<string, string> = {
        "": "Dashboard",
        "users": "Users",
        "venues": "Venues",
        "crm": "Leads",
        "billing": "Billing",
        "approvals": "Approvals",
        "lead-distribution": "Leads",
        "team-tree": "Users"
      };

      const requiredModule = moduleMap[pathParts[0] || ""] || currentModule;
      let moduleAccess: string[] = [];
      try {
        moduleAccess = JSON.parse(user.prefs?.moduleAccess || "[]");
      } catch {
        moduleAccess = [];
      }

      // Explicit BDE Block for Lead Distribution
      if (user.prefs?.role === "BDE" && pathname === "/lead-distribution") {
        router.push("/");
        return;
      }

      // If Super Admin (not yet defined but maybe in future) or has specific module access
      const hasAccess = moduleAccess.includes(requiredModule) || user.prefs?.role === "Super Admin";

      if (!hasAccess && pathname !== "/" && pathname !== "/login") {
        // If no access to module but logged in, redirect to dashboard
        router.push("/");
      } else {
        setAuthorized(true);
      }

    } catch (e) {
      console.error("Auth Guard Error:", e);
      localStorage.removeItem("party_admin_session");
      router.push("/login");
    }
  }, [pathname, router]);

  if (!authorized && pathname !== "/login") {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
         <Loader2 className="animate-spin text-[#b66dff]" size={40} />
         <p className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Verifying Authorization...</p>
      </div>
    );
  }

  return <>{children}</>;
}
