'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n/LangContext';
import type { Article } from '@/lib/articles';
import { articleToServiceSlug, getServicePage } from '@/lib/servicePages';
import ContentBlocks from './ContentBlocks';

// Articles with no single matching service page all fall back to linking
// the pillar page - varying the anchor text per article avoids every one
// of them repeating the exact same link text site-wide.
const PILLAR_LINK_TEXT: Record<string, { he: string; en: string }> = {
  'jerusalem-massage': { he: 'לכל סוגי הטיפולים לגברים בירושלים ←', en: 'See all treatment types for men in Jerusalem ←' },
  faq: { he: 'עוד על הטיפולים לגברים בירושלים ←', en: 'More about treatments for men in Jerusalem ←' },
  stretching: { he: 'טיפולי עיסוי לגברים בירושלים ←', en: 'Massage treatments for men in Jerusalem ←' },
  'swedish-vs-medical': { he: 'השוואת כל הטיפולים באתר ←', en: 'Compare all treatments on the site ←' },
  'man-to-man-massage': { he: 'כל הטיפולים בשחרור במגע ←', en: 'All treatments at Shichrur BeMaga ←' },
};

export default function ArticleView({ article }: { article: Article }) {
  const { t, lang } = useLang();
  const content = article[lang];
  const relatedServiceSlug = articleToServiceSlug[article.slug];
  const relatedServicePage = relatedServiceSlug ? getServicePage(relatedServiceSlug) : undefined;
  const pillarLinkText = PILLAR_LINK_TEXT[article.slug]?.[lang] ?? t.articlePage.pillarLink;

  return (
    <article className="pt-32 pb-20 px-5">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/#articles"
          className="inline-block text-sm text-primary hover:text-primary-dark mb-6 transition-colors"
        >
          &rarr; {t.articlePage.backToArticles}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8 leading-snug">
          {content.title}
        </h1>

        <ContentBlocks blocks={content.blocks} />

        {relatedServicePage ? (
          <Link
            href={`/${relatedServicePage.slug}`}
            className="inline-block mt-6 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
          >
            {t.articlePage.serviceLinkPrefix} {relatedServicePage.breadcrumbLabel} &larr;
          </Link>
        ) : (
          <Link
            href="/massage-for-men-jerusalem"
            className="inline-block mt-6 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
          >
            {pillarLinkText}
          </Link>
        )}

        <div className="mt-12 pt-8 border-t border-primary/10 text-center">
          <p className="text-primary-dark font-medium mb-4">
            {t.articlePage.ctaQuestion}
          </p>
          <Link
            href="/#booking"
            className="inline-flex items-center bg-primary text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-primary-dark transition-colors shadow"
          >
            {t.articlePage.ctaButton}
          </Link>
        </div>
      </div>
    </article>
  );
}
