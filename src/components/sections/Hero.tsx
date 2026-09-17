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
              href="#booking"
              className="inline-flex items-center gap-2 bg-primary text-white text-sm md:text-base font-semibold px-6 py-3.5 rounded-full hover:bg-primary-dark transition-colors shadow"
            >
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
