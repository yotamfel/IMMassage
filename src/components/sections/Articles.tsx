'use client';

import { articles } from '@/lib/articles';

export default function Articles() {
  return (
    <section id="articles" className="bg-cream-dark py-20 px-5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark text-center mb-12">
          מאמרים
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {articles.map(article => (
            <a
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-[#F6F1EA] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <h3 className="text-lg font-bold text-primary-dark mb-2">
                {article.title}
              </h3>
              <p className="text-sm text-[#555] leading-relaxed mb-4 flex-1">
                {article.excerpt}
              </p>
              <span className="text-sm font-medium text-primary group-hover:text-primary-dark">
                לקריאת המאמר המלא &larr;
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
