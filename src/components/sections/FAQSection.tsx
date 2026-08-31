'use client';

import { useState } from 'react';
import { useLang } from '@/lib/i18n/LangContext';

export default function FAQSection() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.homeFaq.items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <section id="faq" className="bg-cream py-20 px-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark text-center mb-12">
          {t.homeFaq.title}
        </h2>

        <div className="space-y-3">
          {t.homeFaq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="bg-white rounded-xl border border-primary/10 overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-start px-5 py-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-primary-dark">{item.q}</span>
                  <svg
                    className={`w-5 h-5 shrink-0 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <p className={`px-5 pb-4 text-[#555] leading-relaxed ${isOpen ? '' : 'hidden'}`}>
                  {item.a}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
