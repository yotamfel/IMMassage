import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/sections/Footer';
import TrustBar from '@/components/sections/TrustBar';
import Articles from '@/components/sections/Articles';
import Booking from '@/components/sections/Booking';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import ChatBot from '@/components/ChatBot';
import ContentBlocks from '@/components/ContentBlocks';
import { servicePages, getServicePage } from '@/lib/servicePages';
import he from '@/locales/he.json';

const SERVICE_ID_TO_PRICING_NAME: Record<string, string> = {
  medical: 'עיסוי רפואי',
  swedish: 'עיסוי שוודי',
  'hot-stones': 'אבנים חמות',
  cupping: 'כוסות רוח',
  'face-neck': 'עיסוי פנים וצוואר',
};

const WA_NUMBER = '972508838374';

export function generateStaticParams() {
  return servicePages.map(page => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: `/${page.slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: `/${page.slug}`,
      locale: 'he_IL',
      type: 'website',
      images: [{ url: '/assets/masseur-photo.jpg', width: 2000, height: 1125, alt: page.title }],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  const pricingItem = page.serviceId
    ? he.pricing.items.find(item => item.name === SERVICE_ID_TO_PRICING_NAME[page.serviceId!])
    : undefined;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { position: 1, '@type': 'ListItem', name: 'בית', item: 'https://www.israel-massge.co.il/' },
      { position: 2, '@type': 'ListItem', name: page.breadcrumbLabel, item: `https://www.israel-massge.co.il/${page.slug}` },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const otherServicePages = servicePages.filter(p => p.serviceId && p.serviceId !== page.serviceId);

  // Only for the 5 real, individually-priced treatments - not the pillar or
  // home-visit pages, which don't have one single price to declare.
  const serviceJsonLd = page.serviceId && pricingItem ? {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.h1,
    description: page.metaDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: 'שחרור במגע',
      url: 'https://www.israel-massge.co.il',
    },
    areaServed: { '@type': 'City', name: 'ירושלים' },
    offers: pricingItem.variants.map(v => ({
      '@type': 'Offer',
      price: v.price.replace(/[^\d]/g, ''),
      priceCurrency: 'ILS',
      description: v.duration,
    })),
  } : null;

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {serviceJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      )}

      <Header />

      <article className="pt-32 pb-20 px-5">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-primary/70 mb-6" aria-label="breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">בית</Link>
            {' / '}
            {!page.serviceId ? (
              <span className="text-primary-dark">{page.breadcrumbLabel}</span>
            ) : (
              <>
                <Link href="/massage-for-men-jerusalem" className="hover:text-primary transition-colors">עיסוי לגברים בירושלים</Link>
                {' / '}
                <span className="text-primary-dark">{page.breadcrumbLabel}</span>
              </>
            )}
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8 leading-snug">
            {page.h1}
          </h1>

          <ContentBlocks blocks={page.intro} />

          {/* Pillar page: service grid */}
          {page.showServiceGrid && (
            <div className="grid sm:grid-cols-2 gap-4 my-8">
              {servicePages
                .filter(p => p.slug !== page.slug)
                .map(p => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="block bg-white rounded-xl border border-primary/10 p-4 hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    <p className="font-bold text-primary-dark mb-1">{p.breadcrumbLabel}</p>
                    <p className="text-sm text-[#666]">
                      {p.serviceId
                        ? he.services.items.find(s => s.id === p.serviceId)?.description
                        : 'כל הטיפולים זמינים גם בביתכם, בהתאם לאזור השירות'}
                    </p>
                  </Link>
                ))}
            </div>
          )}

          <ContentBlocks blocks={page.body} />

          {/* Pricing snippet for real services */}
          {pricingItem && (
            <div className="mt-8 bg-cream rounded-2xl border border-primary/10 p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-3">מחיר ומשך טיפול</h2>
              <ul className="space-y-1 text-[#555]">
                {pricingItem.variants.map((v, i) => (
                  <li key={i}>{v.duration} - {v.price}</li>
                ))}
              </ul>
              <Link
                href="/#pricing"
                className="inline-block mt-3 text-sm text-primary hover:text-primary-dark transition-colors"
              >
                למחירון המלא &larr;
              </Link>
            </div>
          )}

          {/* Locations */}
          <div className="mt-8 bg-cream rounded-2xl border border-primary/10 p-6">
            <h2 className="text-lg font-bold text-primary-dark mb-3">מיקומים</h2>
            <ul className="space-y-1 text-[#555]">
              {he.contact.locations.map((loc, i) => (
                <li key={i}>{loc}</li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div className="mt-10">
            <h2 className="text-xl md:text-2xl font-bold text-primary-dark mb-4">שאלות נפוצות</h2>
            <div className="space-y-4">
              {page.faq.map((item, i) => (
                <div key={i} className="border-b border-primary/10 pb-4 last:border-0">
                  <p className="font-semibold text-primary-dark mb-1">{item.q}</p>
                  <p className="text-[#555] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials (pillar only) */}
          {page.showTestimonials && (
            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {he.testimonials.items.slice(0, 3).map((t, i) => (
                <div key={i} className="bg-white rounded-xl border border-primary/10 p-4">
                  <p className="text-sm text-[#555] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                </div>
              ))}
            </div>
          )}

          {/* Related service links (service pages only) */}
          {page.serviceId && otherServicePages.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-bold text-primary-dark mb-3">טיפולים נוספים</h2>
              <div className="flex flex-wrap gap-2">
                {otherServicePages.map(p => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="text-sm bg-cream hover:bg-cream-dark text-primary-dark px-4 py-2 rounded-full transition-colors"
                  >
                    {p.breadcrumbLabel}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 pt-8 border-t border-primary/10 text-center">
            <p className="text-primary-dark font-medium mb-4">
              רוצים לקבוע תור או שיש לכם שאלה?
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`היי, אשמח לקבוע תור ל${page.breadcrumbLabel}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-primary text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-primary-dark transition-colors shadow"
            >
              קביעת תור בוואטסאפ
            </a>
          </div>
        </div>
      </article>

      <TrustBar />
      <Articles />
      <Booking />
      <Footer />
      <WhatsAppFAB />
      <ChatBot />
    </main>
  );
}
