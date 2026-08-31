'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n/LangContext';
import type { Article } from '@/lib/articles';
import { articleToServiceSlug, getServicePage } from '@/lib/servicePages';
import ContentBlocks from './ContentBlocks';

export default function ArticleView({ article }: { article: Article }) {
  const { t, lang } = useLang();
  const content = article[lang];
  const relatedServiceSlug = articleToServiceSlug[article.slug];
  const relatedServicePage = relatedServiceSlug ? getServicePage(relatedServiceSlug) : undefined;

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
            {t.articlePage.pillarLink}
          </Link>
        )}

        <div className="mt-12 pt-8 border-t border-primary/10 text-center">
          <p className="text-primary-dark font-medium mb-4">
            {t.articlePage.ctaQuestion}
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center bg-primary text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-primary-dark transition-colors shadow"
          >
            {t.articlePage.ctaButton}
          </Link>
        </div>
      </div>
    </article>
  );
}
