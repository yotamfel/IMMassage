import type { MetadataRoute } from 'next';
import { articles } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://israel-massge.co.il',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...articles.map(article => ({
      url: `https://israel-massge.co.il/articles/${article.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
