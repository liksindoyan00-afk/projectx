import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';
import { LOCALES, localePath, PAGES } from '@/lib/i18n';

/** One sitemap with hreflang alternates for every page. */
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(PAGES).flatMap((path) => {
    const languages = Object.fromEntries(LOCALES.map((l) => [l, SITE.url + localePath(l, path)]));
    return LOCALES.map((l) => ({
      url: SITE.url + localePath(l, path),
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : path === '/contact' ? 0.9 : 0.7,
      alternates: { languages: { ...languages, 'x-default': SITE.url + localePath('hy', path) } },
    }));
  });
}
