'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n/LangContext';

const AUTOPLAY_MS = 4000;

export default function CertificateCarousel() {
  const { t } = useLang();
  const items = t.about.certificates.items;
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = () => setCurrent(i => (i === items.length - 1 ? 0 : i + 1));
  const prev = () => setCurrent(i => (i === 0 ? items.length - 1 : i - 1));

  useEffect(() => {
    if (items.length < 2 || lightboxOpen) return;
    const id = setInterval(() => {
      setCurrent(i => (i === items.length - 1 ? 0 : i + 1));
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [items.length, lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setCurrent(i => (i === 0 ? items.length - 1 : i - 1));
      if (e.key === 'ArrowRight') setCurrent(i => (i === items.length - 1 ? 0 : i + 1));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, items.length]);

  if (items.length === 0) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta > 0) prev(); else next();
    }
    touchStartX.current = null;
  };

  return (
    <div className="mt-10 text-center">
      <h3 className="text-lg font-medium text-[#111] mb-3">
        {t.about.certificates.title}
      </h3>

      <div className="relative w-40 mx-auto">
        <div
          className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-md bg-white border border-black/5 cursor-pointer"
          onClick={() => setLightboxOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={items[current].src}
            alt={items[current].alt}
            className="w-full h-full object-contain"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM11 8v6M8 11h6" />
            </svg>
          </div>

          {items.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute top-1/2 -translate-y-1/2 start-1 w-7 h-7 rounded-full bg-white/80 shadow flex items-center justify-center text-[#111] hover:bg-white transition-colors"
                aria-label="הקודם"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                className="absolute top-1/2 -translate-y-1/2 end-1 w-7 h-7 rounded-full bg-white/80 shadow flex items-center justify-center text-[#111] hover:bg-white transition-colors"
                aria-label="הבא"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {items.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'bg-primary w-4' : 'bg-primary/25 w-1.5'}`}
                aria-label={`תעודה ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-6"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="סגור"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img
            src={items[current].src}
            alt={items[current].alt}
            onClick={e => e.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />

          {items.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute top-1/2 -translate-y-1/2 start-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="הקודם"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                className="absolute top-1/2 -translate-y-1/2 end-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="הבא"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
