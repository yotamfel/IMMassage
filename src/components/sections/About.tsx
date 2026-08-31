'use client';

import { useLang } from '@/lib/i18n/LangContext';
import CertificateCarousel from './CertificateCarousel';

export default function About() {
  const { t } = useLang();

  return (
    <section id="about" className="bg-cream-dark py-20 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Photo */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-xs h-80 md:w-80 md:h-96 rounded-3xl overflow-hidden shadow-lg">
              <picture>
                <source srcSet="/assets/masseur-photo.webp" type="image/webp" />
                <img
                  src="/assets/masseur-photo.jpg"
                  alt="ישראל מתוסוב"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </picture>
            </div>
          </div>

          {/* Text */}
          <div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-light text-[#111] mb-2 tracking-wide"
            >
              {t.about.name}
            </h2>

            <p className="text-primary font-medium text-base mb-3">
              {t.about.credential}
            </p>

            <span className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full mb-6">
              {t.about.badge}
            </span>

            {t.about.bio.map((para, i) => (
              <p key={i} className="text-base text-[#555] leading-loose mb-4 last:mb-0">
                {para}
              </p>
            ))}
          </div>

        </div>

        <CertificateCarousel />
      </div>
    </section>
  );
}
