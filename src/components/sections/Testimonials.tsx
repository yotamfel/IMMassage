'use client';

import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n/LangContext';

export default function Testimonials() {
  const { t } = useLang();
  const items = t.testimonials.items;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= items.length) setCurrent(0);
  }, [items.length, current]);

  const prev = () => setCurrent(i => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setCurrent(i => (i === items.length - 1 ? 0 : i + 1));

  const safeIndex = Math.min(current, items.length - 1);

  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="bg-primary-dark py-20 px-5">
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
          style={{ fontFamily: 'var(--font-frank-ruhl), serif' }}
        >
          {t.testimonials.title}
        </h2>

        {/* Card */}
        <div className="relative bg-white/10 border border-white/15 rounded-2xl p-8 md:p-10">
          <svg className="w-8 h-8 text-gold opacity-60 mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6 min-h-[4rem]">
            {items[safeIndex].quote}
          </p>
          <p className="text-gold font-semibold">{items[safeIndex].name}</p>
        </div>

        {/* Arrows + dots */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            aria-label="הקודם"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-gold w-5' : 'bg-white/30'}`}
                aria-label={`המלצה ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            aria-label="הבא"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
