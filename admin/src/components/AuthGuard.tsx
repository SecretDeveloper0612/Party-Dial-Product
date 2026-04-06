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
    const session = localStorage.getItem("party_admin_session");
    
    if (!session && pathname !== "/login") {
      router.push("/login");
    } else {
      setAuthorized(true);
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
