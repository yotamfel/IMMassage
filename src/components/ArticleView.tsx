'use client';

import { useLang } from '@/lib/i18n/LangContext';
import type { Article } from '@/lib/articles';

export default function ArticleView({ article }: { article: Article }) {
  const { t, lang } = useLang();
  const content = article[lang];

  return (
    <article className="pt-32 pb-20 px-5">
      <div className="max-w-3xl mx-auto">
        <a
          href="/#articles"
          className="inline-block text-sm text-primary hover:text-primary-dark mb-6 transition-colors"
        >
          &rarr; {t.articlePage.backToArticles}
        </a>

        <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8 leading-snug">
          {content.title}
        </h1>

        <div className="space-y-5">
          {content.blocks.map((block, i) => {
            if (block.type === 'h2') {
              return (
                <h2 key={i} className="text-xl md:text-2xl font-bold text-primary-dark pt-4">
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'ul') {
              return (
                <ul key={i} className="list-disc pe-5 space-y-2 text-[#555]">
                  {block.items.map((item, j) => (
                    <li key={j} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="text-base text-[#555] leading-loose">
                {block.text}
              </p>
            );
          })}
        </div>

        <div className="mt-12 pt-8 border-t border-primary/10 text-center">
          <p className="text-primary-dark font-medium mb-4">
            {t.articlePage.ctaQuestion}
          </p>
          <a
            href="/#booking"
            className="inline-flex items-center bg-primary text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-primary-dark transition-colors shadow"
          >
            {t.articlePage.ctaButton}
          </a>
        </div>
      </div>
    </article>
  );
}
