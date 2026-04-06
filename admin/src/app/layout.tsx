"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import AuthGuard from "@/components/AuthGuard";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} custom-scrollbar`} suppressHydrationWarning>
        <AuthGuard>
           {isLoginPage ? (
             <div className="min-h-screen">
                {children}
             </div>
           ) : (
             <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 ml-[var(--sidebar-w)] transition-[margin] duration-300 min-h-screen">
                  <TopBar />
                  <div className="p-10 min-h-[calc(100vh-var(--header-h))]">
                    {children}
                  </div>
                </main>
             </div>
           )}
        </AuthGuard>
      </body>
    </html>
  );
}
