import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Star, ChevronRight, Info, HelpCircle, IndianRupee } from 'lucide-react';
import { MOCK_VENUES } from '@/data/venues';
import { SEO_CITIES, SEO_CATEGORIES } from '@/config/seo-data';
import VenueCard from '@/components/VenueCard';
import { formatSlugToName } from '@/utils/seo-utils';

import { resolveLocation } from '@/services/location';

interface Props {
  params: Promise<{
    city: string;
    category: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, category: categorySlug } = await params;
  const location = await resolveLocation(city);
  const cityName = location ? location.name : formatSlugToName(city);
  const category = SEO_CATEGORIES.find(c => c.slug === categorySlug);
  
  if (!category) return {};

  const title = `Best ${category.title} in ${cityName} | ${location?.state || ''} Top Rated ${category.name}`;
  const description = `Find the best ${category.name} in ${cityName}, ${location?.district || ''}. Compare prices, ratings, and view photos. Book verified ${category.name.toLowerCase()} in ${cityName} on PartyDial.`;

  return {
    title,
    description,
    keywords: [
      `${category.name} in ${cityName}`,
      `best ${category.name.toLowerCase()} in ${cityName}`,
      `${category.name.toLowerCase()} near me`,
      `${category.name.toLowerCase()} in ${location?.district || cityName}`,
      `party venues in ${cityName}`
    ],
    openGraph: {
      title,
      description,
      type: 'website',
    },
    alternates: {
      canonical: `/${city}/${categorySlug}`,
    }
  };
}

export async function generateStaticParams() {
  const params: { city: string; category: string }[] = [];
  
  // Generate first 50 major cities for static builds to speed up deployment
  [...new Set(SEO_CITIES)].slice(0, 50).forEach(city => {
    SEO_CATEGORIES.forEach(cat => {
      params.push({
        city: city.toLowerCase(),
        category: cat.slug
      });
    });
  });

  return params;
}

export default async function SEORoute({ params }: Props) {
  const { city, category: categorySlug } = await params;
  const location = await resolveLocation(city);
  const cityName = location ? location.name : formatSlugToName(city);
  const category = SEO_CATEGORIES.find(c => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  // Filter venues by city or district
  const filteredVenues = MOCK_VENUES.filter(v => 
    v.city.toLowerCase().includes(city.toLowerCase()) || 
    (location && v.city.toLowerCase().includes(location.district.toLowerCase()))
  );

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": filteredVenues.map((v, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://partydial.com/venues/${v.id}`,
      "item": {
        "@type": "LocalBusiness",
        "name": v.name,
        "image": v.img,
        "priceRange": `₹${v.price}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": v.location,
          "addressRegion": cityName,
          "addressCountry": "IN"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": v.rating,
          "reviewCount": v.reviews
        }
      }
    }))
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "/" },
      { "@type": "ListItem", "position": 2, "name": cityName, "item": `/${city}` },
      { "@type": "ListItem", "position": 3, "name": category.name, "item": `/${city}/${categorySlug}` }
    ]
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What are the best ${category.name} in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Some of the top rated ${category.name} in ${cityName} are ${filteredVenues.slice(0, 3).map(v => v.name).join(', ')}.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the average price of ${category.name} in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The price for ${category.name} in ${cityName} typically ranges from ₹500 to ₹5000 per plate/service depending on the venue and amenities.`
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Schema injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">
          <Link href="/" className="hover:text-pd-red transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-slate-900">{cityName}</span>
          <ChevronRight size={10} />
          <span className="text-pd-red">{category.name}</span>
        </nav>

        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 italic tracking-tight">
            Top {category.name} in <span className="text-pd-red">{cityName}</span>
          </h1>
          <p className="max-w-3xl text-slate-500 font-medium leading-relaxed">
            PartyDial helps you find and book the best {category.name.toLowerCase()} in {cityName}. 
            Whether you're planning a grand wedding, a corporate event, or a simple birthday party, 
            discover top-rated venues with verified reviews, detailed pricing, and HD photos. 
            Choose the perfect setting and get instant quotes today.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Listings */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredVenues.length > 0 ? (
                filteredVenues.map((v, i) => (
                  <VenueCard key={v.id} venue={v} index={i} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-slate-100 shadow-pd-soft">
                  <Info className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No listings found in this category yet</p>
                </div>
              )}
            </div>

            {/* Price-based Recommendations for SEO */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-pd-soft">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Star className="text-pd-red" size={16} /> Luxury {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Looking for premium {category.name.toLowerCase()} in {cityName}? Discover high-end venues with world-class amenities, premium catering, and grand decor. Perfect for luxury weddings and grand corporate galas in {cityName}.
                  </p>
               </div>
               <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-pd-soft">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <IndianRupee className="text-pd-purple" size={16} /> Budget Friendly Options
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Find affordable {category.name.toLowerCase()} in {cityName} without compromising on quality. Compare cheap {category.name.toLowerCase()} with prices, guest capacity, and inclusive packages for birthday parties and small gatherings.
                  </p>
               </div>
            </div>

            {/* FAQs Section */}
            <section className="mt-20">
              <h2 className="text-2xl font-black text-slate-900 mb-8 italic flex items-center gap-3">
                <HelpCircle className="text-pd-red" /> Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  { q: `What are the best ${category.name} in ${cityName}?`, a: `Some of the highest-rated options in ${cityName} include ${filteredVenues.length > 0 ? filteredVenues.map(v => v.name).join(', ') : 'multiple premium venues'} that offer great services.` },
                  { q: `How can I find cheap ${category.name} in ${cityName}?`, a: `You can compare prices directly on PartyDial. Filter by price per plate or budget range to find the most affordable options that fit your requirements.` },
                  { q: `Do these ${category.name.toLowerCase()} provide catering?`, a: `Most venues listed on PartyDial offer in-house catering, but many also allow external caterers. Verified details for each venue can be found on their specific profile pages.` }
                ].map((faq, idx) => (
                  <div key={idx} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-pd-soft">
                    <h3 className="text-base md:text-lg font-black text-slate-900 mb-2">{faq.q}</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Internal Linking */}
          <aside className="w-full lg:w-80 shrink-0 space-y-10">
            {/* Same City, Other Categories */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-pd-soft">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-50 pb-4">Other Services in {cityName}</h3>
              <div className="grid grid-cols-1 gap-2">
                {SEO_CATEGORIES.filter(c => c.slug !== categorySlug).slice(0, 8).map(cat => (
                  <Link 
                    key={cat.slug} 
                    href={`/${city}/${cat.slug}`}
                    className="text-[11px] font-black text-slate-600 hover:text-pd-red transition-colors py-2 flex items-center gap-2 group"
                  >
                    <ChevronRight size={12} className="text-slate-300 group-hover:text-pd-red" /> {cat.name} in {cityName}
                  </Link>
                ))}
              </div>
            </div>

            {/* Same Category, Other Cities */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-pd-soft">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-50 pb-4">{category.name} in Top Cities</h3>
              <div className="grid grid-cols-1 gap-2">
                {/* Randomly slice 8 cities to ensure diverse internal linking across the site */}
                {SEO_CITIES
                  .filter(c => c.toLowerCase() !== city.toLowerCase())
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 8)
                  .map(cityItem => (
                  <Link 
                    key={cityItem} 
                    href={`/${cityItem.toLowerCase().replace(/\s+/g, '-')}/${categorySlug}`}
                    className="text-[11px] font-black text-slate-600 hover:text-pd-red transition-colors py-2 flex items-center gap-2 group"
                  >
                    <ChevronRight size={12} className="text-slate-300 group-hover:text-pd-red" /> {category.name} in {cityItem}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Global Cities Directory (Mention All) */}
        <section className="mt-20 pt-20 border-t border-slate-200">
           <h2 className="text-xl font-black text-slate-900 mb-10 italic">Cities we Serve for {category.name}</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-4">
              {[...new Set(SEO_CITIES)].map(cityItem => (
                <Link 
                  key={cityItem} 
                  href={`/${cityItem.toLowerCase()}/${categorySlug}`}
                  className="text-[10px] font-bold text-slate-400 hover:text-pd-red transition-colors uppercase tracking-widest truncate"
                >
                  {category.name} in {cityItem}
                </Link>
              ))}
           </div>
           <div className="mt-12 p-6 bg-slate-100 rounded-3xl text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Don't see your city? Use our <Link href="/venues" className="text-pd-red underline">Search Tool</Link> powered by India Post to find venues in any pincode across India.
              </p>
           </div>
        </section>
      </div>
    </div>
  );
}
