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

  const isCouponsPage = pathname === '/billing/coupons';

  return (
    <div className={cn("space-y-8 animate-in fade-in duration-200", isCouponsPage && "space-y-0")}>
      

      <div className="min-h-[calc(100vh-280px)]">
         {children}
      </div>

    </div>
  );
}
