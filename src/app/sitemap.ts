import type { MetadataRoute } from 'next';
import { articles } from '@/lib/articles';
import { servicePages } from '@/lib/servicePages';

const SITE_URL = 'https://www.israel-massge.co.il';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...servicePages.map(page => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: page.slug === 'massage-for-men-jerusalem' ? 0.9 : 0.8,
    })),
    ...articles.map(article => ({
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
