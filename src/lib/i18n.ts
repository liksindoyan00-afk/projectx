export const LOCALES = ['hy', 'ru', 'en'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = 'hy';

export function isLang(v: string | undefined | null): v is Lang {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

/** Page keys and their (language-independent) paths. Armenian lives at the root. */
export const PAGES = {
  home: '/',
  services: '/services',
  process: '/process',
  results: '/results',
  about: '/about',
  faq: '/faq',
  contact: '/contact',
  privacy: '/privacy',
} as const;
export type PageKey = keyof typeof PAGES;

/** Build a public URL path for a page path in a given language. */
export function localePath(lang: Lang, path: string): string {
  const clean = path === '/' ? '' : path;
  if (lang === DEFAULT_LANG) return clean || '/';
  return `/${lang}${clean}`;
}

export function pageHref(lang: Lang, page: PageKey, suffix = ''): string {
  return localePath(lang, PAGES[page]) + suffix;
}

export const LANG_COOKIE = 'bp_lang';
