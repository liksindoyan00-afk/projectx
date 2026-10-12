import type { Metadata } from 'next';
import { getDict } from '@/content';
import { SITE } from '@/content/site';
import { LOCALES, localePath, PAGES, type Lang, type PageKey } from './i18n';

const OG_LOCALE: Record<Lang, string> = { hy: 'hy_AM', ru: 'ru_RU', en: 'en_US' };

export function pageMetadata(lang: Lang, page: PageKey | 'notFound'): Metadata {
  const t = getDict(lang);
  const m = t.meta[page === 'notFound' ? 'notFound' : page];
  const path = page === 'notFound' ? null : PAGES[page];
  const languages: Record<string, string> = {};
  if (path) {
    for (const l of LOCALES) languages[l] = SITE.url + localePath(l, path);
    languages['x-default'] = SITE.url + localePath('hy', path);
  }
  return {
    title: m.title,
    description: m.description,
    metadataBase: new URL(SITE.url),
    alternates: path ? { canonical: SITE.url + localePath(lang, path), languages } : undefined,
    robots: page === 'notFound' ? { index: false } : undefined,
    openGraph: {
      title: m.title,
      description: m.description,
      siteName: 'BridgePath',
      locale: OG_LOCALE[lang],
      type: 'website',
      url: path ? SITE.url + localePath(lang, path) : undefined,
    },
  };
}
