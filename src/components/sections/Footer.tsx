'use client';

import { useState } from 'react';
import { useLang } from '@/lib/i18n/LangContext';

export default function Footer() {
  const { t } = useLang();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white py-10 px-5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo + brand */}
        <a href="#home" className="flex items-center gap-3" aria-label="שחרור במגע">
          <span
            className="text-lg font-bold text-white/80"
            style={{ fontFamily: 'var(--font-frank-ruhl), serif', display: logoLoaded ? 'none' : 'block' }}
          >
            שחרור במגע
          </span>
          <img
            src="/assets/logo.png"
            alt=""
            className="h-12 w-auto brightness-0 invert opacity-80"
            style={{ display: logoLoaded ? 'block' : 'none' }}
            onLoad={() => setLogoLoaded(true)}
            onError={() => setLogoLoaded(false)}
          />
        </a>

        {/* Middle */}
        <div className="text-center">
          <p className="text-white/50 text-sm">
            &copy; {year} שחרור במגע &bull; {t.footer.rights}
          </p>
          <p className="text-white/40 text-xs mt-1">
            {t.footer.country} &bull; 050-8838374 &bull;{' '}
            <a href="/admin" className="text-white/20 hover:text-white/40 transition-colors">·</a>
          </p>
        </div>

        {/* Back to top */}
        <a
          href="#home"
          className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          {t.footer.backToTop}
        </a>
      </div>
    </footer>
  );
}
