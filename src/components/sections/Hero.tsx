'use client';

import { useState } from 'react';
import { useLang } from '@/lib/i18n/LangContext';

export default function Hero() {
  const { t } = useLang();
  const [logoError, setLogoError] = useState(false);

  return (
    <section id="home" className="relative min-h-screen bg-cream flex items-center overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 start-0 w-[600px] h-[600px] rounded-full bg-primary/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 end-0 w-[400px] h-[400px] rounded-full bg-gold/5 translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 pt-24 pb-16 w-full grid md:grid-cols-2 gap-10 items-center">

        {/* Text side */}
        <div className="text-center md:text-start order-2 md:order-1">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-dark mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-frank-ruhl), serif' }}
          >
            {t.hero.title}
          </h1>

          <p className="text-xl md:text-2xl text-primary mb-5">
            {t.hero.subtitle}
          </p>
          <p className="text-base md:text-lg text-[#555] mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
            {t.hero.description}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <a
              href={`https://wa.me/972508838374?text=${encodeURIComponent(t.contact.form.whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm md:text-base font-semibold px-6 py-3.5 rounded-full hover:bg-[#1ebe5c] transition-colors shadow"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t.hero.cta1}
            </a>
            <a
              href="#services"
              className="inline-flex items-center bg-white text-primary-dark text-sm md:text-base font-semibold px-6 py-3.5 rounded-full border border-primary/20 hover:bg-cream-dark transition-colors"
            >
              {t.hero.cta2}
            </a>
          </div>

        </div>

        {/* Logo circle */}
        <div className="flex justify-center order-1 md:order-2">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-[420px] md:h-[420px]">
            {/* Decorative rings */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 scale-110" />
            <div className="absolute inset-0 rounded-full border border-gold/20 scale-125" />

            {/* Circle background */}
            <div className="absolute inset-0 rounded-full bg-white shadow-xl overflow-hidden">
              {!logoError ? (
                <img
                  src="/assets/logo.png"
                  alt="שחרור במגע"
                  className="w-full h-full object-cover"
                  onError={() => setLogoError(true)}
                  fetchPriority="high"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="text-2xl font-bold text-primary-dark text-center"
                    style={{ fontFamily: 'var(--font-frank-ruhl), serif' }}
                  >
                    שחרור במגע
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,80 L0,80 Z" fill="#1F4A4A" />
        </svg>
      </div>
    </section>
  );
}
