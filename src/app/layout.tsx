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

export const metadata: Metadata = {
  title: 'שחרור במגע | עיסוי מקצועי לגברים בירושלים',
  description:
    'עיסוי מקצועי לגברים בירושלים – עיסוי רפואי, שוודי, כוסות רוח ואבנים חמות. בוגר מכללת רידמן. 050-8838374',
  keywords: 'עיסוי, עיסוי רפואי, עיסוי שוודי, כוסות רוח, אבנים חמות, ירושלים, מעסה',

  openGraph: {
    title: 'שחרור במגע | עיסוי מקצועי לגברים בירושלים',
    description: 'עיסוי מקצועי לגברים בירושלים. עיסוי רפואי, שוודי, כוסות רוח, אבנים חמות.',
    locale: 'he_IL',
    type: 'website',
  },

  verification: {
    google: 'bG1AUQMw4XX8EW-T1idI0AD4Al51qxXjFkU86j3pnyc',
  },
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
        <link rel="preconnect" href="https://calendly.com" />
        <link rel="preconnect" href="https://assets.calendly.com" />
        <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
      </head>
<body className="min-h-full">
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />
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
