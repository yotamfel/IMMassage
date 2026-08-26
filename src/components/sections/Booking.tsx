'use client';
import Script from 'next/script';
import { useLang } from '@/lib/i18n/LangContext';

const CALENDLY_URL =
  'https://calendly.com/matusov19961?background_color=ede3d5&text_color=2b2b2b&primary_color=2f6b6b';

export default function Booking() {
  const { t } = useLang();

  return (
    <section id="booking" className="bg-cream-dark py-20 px-5">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2">
            {t.booking.title}
          </h2>
          <p className="text-primary text-base">{t.booking.subtitle}</p>
        </div>

        <div className="border-2 border-black rounded-2xl overflow-hidden">
          <div
            className="calendly-inline-widget"
            data-url={CALENDLY_URL}
            style={{ minWidth: 320, height: 700 }}
          />
        </div>
        <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      </div>
    </section>
  );
}
