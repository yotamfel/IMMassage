'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n/LangContext';

const icons = [
  /* Certificate */
  <svg key="cert" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
    <circle cx="12" cy="8" r="5" />
    <path d="M8.5 12.5L7 21l5-2.5 5 2.5-1.5-8.5" />
  </svg>,
  /* Hands / personalized */
  <svg key="hands" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
    <path d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v0M14 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v2M10 10.5V6a2 2 0 00-2-2v0a2 2 0 00-2 2v8a6 6 0 006 6h2a6 6 0 004.9-2.54" />
    <path d="M18 11a2 2 0 114 0v3a6 6 0 01-6 6h-2" />
  </svg>,
  /* Grid / variety */
  <svg key="grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>,
  /* Home */
  <svg key="home" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
    <path d="M3 11l9-7 9 7" />
    <path d="M5 10v10h14V10" />
  </svg>,
];

export default function WhyUs() {
  const { t } = useLang();

  return (
    <section className="bg-white py-20 px-5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark text-center mb-12">
          {t.whyUs.title}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.whyUs.items.map((item, i) => {
            const isHomeVisit = i === 3;
            const card = (
              <div className={`bg-cream rounded-2xl p-6 text-center flex flex-col items-center gap-3 h-full ${isHomeVisit ? 'hover:shadow-md hover:bg-cream/60 transition-shadow' : ''}`}>
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {icons[i]}
                </div>
                <p className="font-bold text-primary-dark">{item.title}</p>
                <p className="text-sm text-[#666] leading-relaxed">{item.desc}</p>
              </div>
            );
            return isHomeVisit ? (
              <Link key={i} href="/home-massage-jerusalem">{card}</Link>
            ) : (
              <div key={i}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
