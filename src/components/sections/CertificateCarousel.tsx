'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n/LangContext';

const AUTOPLAY_MS = 4000;

export default function CertificateCarousel() {
  const { t } = useLang();
  const items = t.about.certificates.items;
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const next = () => setCurrent(i => (i === items.length - 1 ? 0 : i + 1));
  const prev = () => setCurrent(i => (i === 0 ? items.length - 1 : i - 1));

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => {
      setCurrent(i => (i === items.length - 1 ? 0 : i + 1));
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      delta > 0 ? prev() : next();
    }
    touchStartX.current = null;
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-[#111] mb-3">
        {t.about.certificates.title}
      </h3>

      <div className="relative w-full max-w-xs mx-auto md:mx-0">
        <div
          className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-white border border-black/5"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            dir="ltr"
            className="flex h-full transition-transform duration-500 ease-out"
            style={{
              width: `${items.length * 100}%`,
              transform: `translateX(-${current * (100 / items.length)}%)`,
            }}
          >
            {items.map((item, i) => (
              <img
                key={i}
                src={item.src}
                alt={item.alt}
                className="h-full flex-shrink-0 object-contain"
                style={{ width: `${100 / items.length}%` }}
              />
            ))}
          </div>

          {items.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute top-1/2 -translate-y-1/2 start-2 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center text-[#111] hover:bg-white transition-colors"
                aria-label="הקודם"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute top-1/2 -translate-y-1/2 end-2 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center text-[#111] hover:bg-white transition-colors"
                aria-label="הבא"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {items.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${i === current ? 'bg-primary w-5' : 'bg-primary/25 w-2'}`}
                aria-label={`תעודה ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
