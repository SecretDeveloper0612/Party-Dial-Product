import type { Metadata } from "next";
import { Suspense } from "react";
import "./main.css";
import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";
import PopupInquiry from "@/shared/components/PopupInquiry";

export const metadata: Metadata = {
  title: "PartyDial | Dial Up Your Next Event",
  description: "The ultimate platform for planning and managing your perfect party. Dial up the excitement with PartyDial.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Header />
        {children}
        <Suspense fallback={null}>
          <PopupInquiry />
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}
