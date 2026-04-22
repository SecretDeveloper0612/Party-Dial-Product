import { Metadata, ResolvingMetadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5005/api';
    const baseUrlApi = serverUrl.endsWith('/api') ? serverUrl : `${serverUrl}/api`;
    
    const response = await fetch(`${baseUrlApi}/venues/${id}`, { cache: 'no-store' });
    const result = await response.json();
    
    if (result.status === 'success' && result.data) {
      const venue = result.data;
      const title = `${venue.venueName || 'Venue'} | PartyDial`;
      const description = venue.description 
        ? venue.description.substring(0, 160) 
        : `Check out ${venue.venueName} at ${venue.city}. Best ${venue.venueType || 'venue'} listed on PartyDial.`;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://www.partydial.com/venues/${id}`,
          siteName: 'PartyDial',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
        },
        alternates: {
          canonical: `https://www.partydial.com/venues/${id}`,
        },
      };
    }
  } catch (error) {
    console.error('Metadata fetch error:', error);
  }

  return {
    title: 'Venue Details | PartyDial',
    description: 'View venue details, photos, and contact information on PartyDial.',
  };
}

export default function VenueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
