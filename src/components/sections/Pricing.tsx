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

        {/* Gift voucher banner */}
        <a
          href={`https://wa.me/972508838374?text=${encodeURIComponent('היי, אשמח לקנות שובר מתנה')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-gold/15 border border-gold/40 text-primary-dark rounded-2xl px-6 py-4 mb-3 hover:bg-gold/25 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 shrink-0 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <p className="font-semibold text-base">לקניית שובר מתנה, ניתן ליצור קשר</p>
          <svg className="w-4 h-4 shrink-0 text-gold" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>

        {/* Men-only banner */}
        <div className="flex items-center justify-center gap-2 bg-primary-dark text-white rounded-xl px-4 py-3">
          <svg className="w-4 h-4 shrink-0 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="font-medium text-sm">{t.pricing.note}</p>
        </div>


      </div>
    </section>
  );
}
