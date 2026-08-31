import type { Metadata } from 'next';
import { Frank_Ruhl_Libre, Assistant, Heebo } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { LangProvider } from '@/lib/i18n/LangContext';

const frankRuhl = Frank_Ruhl_Libre({
  variable: '--font-frank-ruhl',
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700', '900'],
});

const assistant = Assistant({
  variable: '--font-assistant',
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const heebo = Heebo({
  variable: '--font-heebo',
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500'],
});

const SITE_URL = 'https://www.israel-massge.co.il';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'שחרור במגע | עיסוי מקצועי לגברים בירושלים',
    template: '%s | שחרור במגע',
  },
  description:
    'עיסוי מקצועי לגברים בירושלים – עיסוי רפואי, שוודי, כוסות רוח ואבנים חמות. בוגר מכללת רידמן. 050-8838374',
  keywords: 'עיסוי, עיסוי רפואי, עיסוי שוודי, כוסות רוח, אבנים חמות, ירושלים, מעסה',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'שחרור במגע | עיסוי מקצועי לגברים בירושלים',
    description: 'עיסוי מקצועי לגברים בירושלים. עיסוי רפואי, שוודי, כוסות רוח, אבנים חמות.',
    url: SITE_URL,
    siteName: 'שחרור במגע',
    locale: 'he_IL',
    type: 'website',
  },

  verification: {
    google: 'bG1AUQMw4XX8EW-T1idI0AD4Al51qxXjFkU86j3pnyc',
  },
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'שחרור במגע',
  description: 'עיסוי מקצועי לגברים בירושלים – עיסוי רפואי, שוודי, כוסות רוח ואבנים חמות.',
  url: SITE_URL,
  telephone: '+972508838374',
  priceRange: '₪₪',
  areaServed: {
    '@type': 'City',
    name: 'ירושלים',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'בן בבא 1',
    addressLocality: 'ירושלים',
    addressCountry: 'IL',
  },
  employee: {
    '@type': 'Person',
    name: 'ישראל מתוסוב',
    jobTitle: 'מטפל מוסמך בעיסוי שוודי ואינטגרטיבי',
    alumniOf: 'מכללת רידמן',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    opens: '09:00',
    closes: '21:00',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'שחרור במגע',
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${frankRuhl.variable} ${assistant.variable} ${heebo.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
<body className="min-h-full">
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YW8K99BW11"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YW8K99BW11');`}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1067955009028101');
          fbq('track', 'PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1067955009028101&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
