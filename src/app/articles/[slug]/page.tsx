import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/sections/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import ChatBot from '@/components/ChatBot';
import ArticleView from '@/components/ArticleView';
import { articles, getArticle } from '@/lib/articles';

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
    title: `${article.he.title} | שחרור במגע`,
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

  return (
    <main>
      <Header />
      <ArticleView article={article} />
      <Footer />
      <WhatsAppFAB />
      <ChatBot />
    </main>
  );
}
