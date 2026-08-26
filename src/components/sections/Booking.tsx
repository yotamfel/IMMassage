'use client';
import { useEffect, useRef } from 'react';
import { useLang } from '@/lib/i18n/LangContext';
import { buildCalendlyUrl } from '@/data/chatbot-config';

export default function Booking() {
  const { t, lang } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    const url = buildCalendlyUrl(undefined, lang);

    function render() {
      if (cancelled || !container) return;
      if (window.Calendly) {
        container.innerHTML = '';
        window.Calendly.initInlineWidget({ url, parentElement: container });
      } else {
        setTimeout(render, 200);
      }
    }
    render();

    return () => {
      cancelled = true;
    };
  }, [lang]);

  return (
    <section id="booking" className="bg-cream-dark py-20 px-5">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2">
            {t.booking.title}
          </h2>
          <p className="text-primary text-base">{t.booking.subtitle}</p>
        </div>

        <div className="relative border-2 border-black rounded-2xl overflow-hidden" style={{ minHeight: 550 }}>
          <div className="absolute inset-0 flex items-center justify-center text-primary-dark text-sm">
            {t.booking.loading}
          </div>
          <div ref={containerRef} className="relative z-10" style={{ minWidth: 320, height: 550 }} />
        </div>
      </div>
    </section>
  );
}
