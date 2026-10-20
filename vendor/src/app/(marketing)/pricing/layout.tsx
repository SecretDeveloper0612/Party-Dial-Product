import type { Metadata } from 'next';
import PricingPage from './page';

export const metadata: Metadata = {
  title: 'Pricing & Membership Plans for Venues | PartyDial Partner',
  description:
    'Join PartyDial with zero booking commission. Compare Monthly, Half-Yearly, and Annual membership plans starting from ₹3,000/month. Unlimited verified event customer inquiries delivered instantly to your inbox.',
  keywords: [
    'PartyDial pricing',
    'venue partner plans',
    'banquet hall lead generation',
    'wedding venue promotion',
    'party hall listing subscription',
    'zero commission venue platform',
    'event leads India'
  ],
  openGraph: {
    title: 'PartyDial Partner Pricing — Zero Commission Venue Lead Platform',
    description:
      'Unlimited verified customer leads for banquet halls, farmhouses, and party venues. Plans starting at ₹3,000/mo.',
    url: 'https://partydial.com/pricing',
    siteName: 'PartyDial',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PartyDial Partner Pricing | Zero Commission Venue Leads',
    description:
      'Boost venue bookings with verified customer inquiries delivered to your inbox. Compare flexible subscription plans.',
  },
  alternates: {
    canonical: 'https://partydial.com/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
