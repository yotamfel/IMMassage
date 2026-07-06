'use client';

import { useLang } from '@/lib/i18n/LangContext';

const treatmentIcons: Record<string, React.ReactNode> = {
  'עיסוי שוודי': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M18 11V6a2 2 0 00-4 0M14 10V4a2 2 0 00-4 0M10 10V6a2 2 0 00-4 0v6l.5 2" />
      <path d="M6 14l.5 2A5 5 0 0011 20h2a5 5 0 005-5v-4a2 2 0 00-4 0" />
    </svg>
  ),
  'Swedish Massage': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M18 11V6a2 2 0 00-4 0M14 10V4a2 2 0 00-4 0M10 10V6a2 2 0 00-4 0v6l.5 2" />
      <path d="M6 14l.5 2A5 5 0 0011 20h2a5 5 0 005-5v-4a2 2 0 00-4 0" />
    </svg>
  ),
  'עיסוי רפואי': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="7" r="4" />
      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  ),
  'Medical Massage': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="7" r="4" />
      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  ),
  'כוסות רוח': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M7 3h10M6 3c0 4 2 5 2 9a4 4 0 008 0c0-4 2-5 2-9M8 17h8" />
    </svg>
  ),
  'Cupping Therapy': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M7 3h10M6 3c0 4 2 5 2 9a4 4 0 008 0c0-4 2-5 2-9M8 17h8" />
    </svg>
  ),
  'אבנים חמות': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <ellipse cx="12" cy="18" rx="7" ry="3" />
      <ellipse cx="12" cy="13" rx="5" ry="2.5" />
      <ellipse cx="12" cy="9"  rx="3" ry="2" />
    </svg>
  ),
  'Hot Stone Massage': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <ellipse cx="12" cy="18" rx="7" ry="3" />
      <ellipse cx="12" cy="13" rx="5" ry="2.5" />
      <ellipse cx="12" cy="9"  rx="3" ry="2" />
    </svg>
  ),
  'עיסוי פנים וצוואר': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="8" r="5" />
      <path d="M9.5 8.5C9.5 8.5 10.5 10 12 10s2.5-1.5 2.5-1.5" />
      <path d="M10 7h.01M14 7h.01" />
      <path d="M8 13v1a4 4 0 008 0v-1" />
    </svg>
  ),
  'Face & Neck Massage': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="8" r="5" />
      <path d="M8 13v1a4 4 0 008 0v-1" />
    </svg>
  ),
};

function getIcon(name: string) {
  return treatmentIcons[name] ?? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export default function Pricing() {
  const { t } = useLang();

  return (
    <section id="pricing" className="bg-cream py-20 px-5">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold text-primary-dark mb-2"
            style={{ fontFamily: 'var(--font-frank-ruhl), serif' }}
          >
            {t.pricing.title}
          </h2>
          <p className="text-primary text-base" style={{ fontFamily: 'var(--font-frank-ruhl), serif' }}>
            {t.pricing.subtitle}
          </p>
        </div>

        {/* Styled pricing rows */}
        <div className="rounded-2xl overflow-hidden shadow-md mb-6 border border-primary/10">
          {t.pricing.items.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                i % 2 === 0 ? 'bg-white' : 'bg-cream/60'
              } ${i < t.pricing.items.length - 1 ? 'border-b border-primary/8' : ''}`}
            >
              {/* Icon */}
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {getIcon(item.name)}
              </div>

              {/* Name */}
              <span className="flex-1 font-semibold text-primary-dark text-sm">
                {item.name}
              </span>

              {/* Variants */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-primary-dark font-semibold text-xs bg-cream-dark rounded-full px-3 py-1.5 hidden sm:inline-block">
                  {item.variants.map(v => v.duration).join(' / ')}
                </span>
                <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full text-center shadow-sm whitespace-nowrap">
                  {item.variants.map(v => v.price).join(' / ')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Men-only banner */}
        <div className="flex items-center justify-center gap-3 bg-primary-dark text-white rounded-2xl px-6 py-4 mb-6">
          <svg className="w-5 h-5 shrink-0 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="font-semibold text-base">{t.pricing.note}</p>
        </div>


      </div>
    </section>
  );
}
