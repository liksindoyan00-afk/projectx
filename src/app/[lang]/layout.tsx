import type { Viewport } from 'next';
import { notFound } from 'next/navigation';
import { getDict } from '@/content';
import { isLang, LOCALES } from '@/lib/i18n';
import { fontVars } from '../fonts';
import '../globals.css';

export const viewport: Viewport = { themeColor: '#14233A', width: 'device-width', initialScale: 1 };
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  return (
    <html lang={lang} className={fontVars}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {t.skip}
        </a>
        {children}
      </body>
    </html>
  );
}
