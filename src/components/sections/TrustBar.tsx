'use client';

import { useLang } from '@/lib/i18n/LangContext';

const icons = [
  /* Lotus / relaxation */
  <svg key="relax" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
    <path d="M12 22c0-5.5-4-9-4-9s1.5-3 4-3 4 3 4 3-4 3.5-4 9z" />
    <path d="M12 10C12 10 8 7 5 4c2 0 5 2 7 6z" />
    <path d="M12 10C12 10 16 7 19 4c-2 0-5 2-7 6z" />
  </svg>,
  /* Leaf / pain relief */
  <svg key="leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
    <path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21c6-7 8-8 14-9-1.5 2-4 5-7 6.5" />
    <path d="M5.71 21L3 23" />
  </svg>,
  /* Person / professional */
  <svg key="person" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a6.5 6.5 0 0113 0" />
  </svg>,
  /* Hands / personalized */
  <svg key="hands" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
    <path d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v0M14 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v2M10 10.5V6a2 2 0 00-2-2v0a2 2 0 00-2 2v8a6 6 0 006 6h2a6 6 0 004.9-2.54" />
    <path d="M18 11a2 2 0 114 0v3a6 6 0 01-6 6h-2" />
  </svg>,
];

export default function TrustBar() {
  const { t } = useLang();

  return (
    <section className="bg-primary-dark text-white py-12 px-5">
      <div className="max-w-5xl mx-auto">
        {/* Certification text */}
        <p
          className="text-center text-white/90 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: 'var(--font-frank-ruhl), serif' }}
        >
          {t.trust.cert}
        </p>

        {/* 4 values */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {t.trust.values.map((value, i) => (
            <div key={i} className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/90">
                {icons[i]}
              </div>
              <p className="text-sm text-white/85 leading-snug">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
