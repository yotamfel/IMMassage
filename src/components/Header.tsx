'use client';

import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n/LangContext';

export default function Header() {
  const { t, lang, toggleLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#services', label: t.nav.services },
    { href: '#about', label: t.nav.about },
    { href: '#testimonials', label: t.nav.testimonials },
    { href: '#pricing', label: t.nav.pricing },
    { href: '#booking', label: t.nav.bookNow },
    { href: '#review', label: t.nav.review },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream/96 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo — text shown by default, replaced by image once loaded */}
        <a href="#home" className="flex items-center shrink-0 h-10" aria-label="שחרור במגע">
          <span
            className="text-xl font-bold text-primary-dark"
            style={{ fontFamily: 'var(--font-frank-ruhl), serif', display: logoLoaded ? 'none' : 'block' }}
          >
            שחרור במגע
          </span>
          <img
            src="/assets/logo.png"
            alt=""
            className="h-10 w-auto"
            style={{ display: logoLoaded ? 'block' : 'none' }}
            onLoad={() => setLogoLoaded(true)}
            onError={() => setLogoLoaded(false)}
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-primary-dark hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="text-xs font-semibold text-primary-dark border border-primary/40 rounded-full px-3 py-1 hover:bg-primary hover:text-white transition-colors"
          >
            {lang === 'he' ? 'EN' : 'עב'}
          </button>

          <a
            href="#booking"
            className="hidden md:inline-flex items-center bg-primary text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-primary-dark transition-colors shadow"
          >
            {t.nav.bookNow}
          </a>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 text-primary-dark"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="תפריט"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream/98 backdrop-blur-md border-t border-primary/10 px-5 py-4">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-primary-dark font-medium border-b border-primary/10 last:border-0 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#booking"
            onClick={() => setMenuOpen(false)}
            className="mt-4 block text-center bg-primary text-white font-semibold py-3 rounded-full hover:bg-primary-dark transition-colors"
          >
            {t.nav.bookNow}
          </a>
        </div>
      )}
    </header>
  );
}
