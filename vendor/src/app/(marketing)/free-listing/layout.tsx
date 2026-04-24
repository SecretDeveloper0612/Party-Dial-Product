import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Venue Listing | Grow Your Event Business with PartyDial",
  description: "List your banquet hall, hotel, resort, or party lawn for free on PartyDial. Reach thousands of customers looking for event venues and get high-quality business leads.",
  keywords: [
    "free venue listing",
    "list my banquet hall",
    "wedding venue marketing",
    "party lawn registration",
    "venue booking platform",
    "event venue advertising",
    "grow venue business",
    "get event leads",
    "banquet hall marketing india",
    "PartyDial partner program"
  ],
  openGraph: {
    title: "Free Venue Listing | Grow Your Event Business with PartyDial",
    description: "List your venue for free and start receiving event leads from verified customers.",
    url: "https://partydial.com/free-listing",
    siteName: "PartyDial",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "PartyDial Venue Listing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Venue Listing | PartyDial",
    description: "Grow your banquet hall or party lawn business with our free listing plan.",
    images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80"],
  },
};

export default function FreeListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
