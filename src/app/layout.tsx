import type { Metadata } from 'next';
import { Frank_Ruhl_Libre, Assistant, Heebo } from 'next/font/google';
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
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'שחרור במגע | עיסוי מקצועי לגברים בירושלים',
    description: 'עיסוי מקצועי לגברים בירושלים. עיסוי רפואי, שוודי, כוסות רוח, אבנים חמות.',
    locale: 'he_IL',
    type: 'website',
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
      <body className="min-h-full">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
