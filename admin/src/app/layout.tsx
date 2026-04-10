"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Script from "next/script";
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
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PLPQB8V7');
          `}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className={`${inter.className} custom-scrollbar`} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PLPQB8V7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
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
