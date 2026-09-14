import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/sections/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import ChatBot from '@/components/ChatBot';
import ArticleView from '@/components/ArticleView';
import { articles, getArticle, getArticleFaq } from '@/lib/articles';

export function generateStaticParams() {
  return articles.map(article => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: article.he.title,
    description: article.he.metaDescription,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      title: article.he.title,
      description: article.he.metaDescription,
      url: `/articles/${article.slug}`,
      locale: 'he_IL',
      type: 'article',
      images: [{ url: '/assets/masseur-photo.jpg', width: 2000, height: 1125, alt: article.he.title }],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@position': 1, '@type': 'ListItem', name: 'בית', item: 'https://www.israel-massge.co.il/' },
      { '@position': 2, '@type': 'ListItem', name: 'מאמרים', item: 'https://www.israel-massge.co.il/#articles' },
      { '@position': 3, '@type': 'ListItem', name: article.he.title, item: `https://www.israel-massge.co.il/articles/${article.slug}` },
    ],
  };

  const faq = getArticleFaq(article);
  const faqJsonLd = faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  } : null;

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <Header />
      <ArticleView article={article} />
      <Footer />
      <WhatsAppFAB />
      <ChatBot />
    </main>
  );
}
