'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/i18n/LangContext';

const serviceImages: Record<string, string> = {
  cupping: '/assets/service-cupping.jpg',
  'hot-stones': '/assets/service-hot-stones.jpg',
  medical: '/assets/service-medical.jpg',
  swedish: '/assets/service-swedish.jpg',
  'face-neck': '/assets/service-face-neck.jpg',
};

const servicePlaceholderColors: Record<string, string> = {
  cupping: 'from-amber-700/30 to-amber-500/10',
  'hot-stones': 'from-stone-600/30 to-stone-400/10',
  medical: 'from-primary/30 to-primary/5',
  swedish: 'from-teal-600/30 to-teal-300/10',
  'face-neck': 'from-rose-400/20 to-rose-200/10',
};

const serviceIcons: Record<string, React.ReactNode> = {
  cupping: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M9 3h6M8 3c0 3-2 4-2 7a6 6 0 0012 0c0-3-2-4-2-7M6 16h12" />
    </svg>
  ),
  'hot-stones': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <ellipse cx="12" cy="18" rx="7" ry="3" />
      <ellipse cx="12" cy="13" rx="5" ry="2.5" />
      <ellipse cx="12" cy="9" rx="3" ry="2" />
    </svg>
  ),
  medical: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="12" cy="7" r="4" />
      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M12 14v3M10.5 15.5h3" />
    </svg>
  ),
  swedish: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M18 11V6a2 2 0 00-4 0M14 10V4a2 2 0 00-4 0M10 10V6a2 2 0 00-4 0v6l.5 2" />
      <path d="M6 14l.5 2A5 5 0 0011 20h2a5 5 0 005-5v-4a2 2 0 00-4 0" />
    </svg>
  ),
  'face-neck': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="12" cy="8" r="5" />
      <path d="M9.5 8.5C9.5 8.5 10.5 10 12 10s2.5-1.5 2.5-1.5" />
      <path d="M10 7h.01M14 7h.01" />
      <path d="M8 13v1a4 4 0 008 0v-1" />
    </svg>
  ),
};

const serviceSlugs: Record<string, string> = {
  cupping: 'cupping-jerusalem',
  'hot-stones': 'hot-stone-massage-jerusalem',
  medical: 'medical-massage-jerusalem',
  swedish: 'swedish-massage-jerusalem',
  'face-neck': 'face-neck-massage-jerusalem',
};

function ServiceCard({ id, title, description }: { id: string; title: string; description: string }) {
  const [imgError, setImgError] = useState(false);
  const { t } = useLang();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {!imgError ? (
          <picture>
            <source srcSet={serviceImages[id].replace('.jpg', '.webp')} type="image/webp" />
            <img
              src={serviceImages[id]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          </picture>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${servicePlaceholderColors[id]} flex items-center justify-center`}>
            <div className="text-primary/30">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16">
                <rect x="8" y="8" width="32" height="32" rx="4" />
                <circle cx="18" cy="20" r="4" />
                <path d="M8 36l10-10 6 6 6-8 10 12" />
              </svg>
            </div>
          </div>
        )}
        {/* Icon badge */}
        <div className="absolute top-3 end-3 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow">
          {serviceIcons[id]}
        </div>
      </div>

      {/* Text */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-primary-dark mb-2">
          {title}
        </h3>
        <p className="text-sm text-[#555] leading-relaxed mb-3">{description}</p>
        {serviceSlugs[id] && (
          <Link
            href={`/${serviceSlugs[id]}`}
            className="inline-block text-sm text-primary hover:text-primary-dark font-medium transition-colors"
          >
            {t.services.learnMore} &larr;
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Services() {
  const { t } = useLang();

  return (
    <section id="services" className="bg-cream py-20 px-5">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-primary-dark text-center mb-12"
        >
          {t.services.title}
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {t.services.items.map(item => (
            <div key={item.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <ServiceCard id={item.id} title={item.title} description={item.description} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
