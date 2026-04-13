import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inquiry Form | Party Dial - Plan Your Perfect Event",
  description: "Ready to throw the party of a lifetime? Fill out our inquiry form and let our experts help you find the perfect venue and vendors for your next celebration.",
  keywords: "party planning, event venues, inquiry form, party dial, banquet halls, resorts",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
