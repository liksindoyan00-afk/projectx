import type { Dict } from '@/content';
import type { Lang, PageKey } from '@/lib/i18n';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export function headerLabels(t: Dict) {
  return { nav: t.nav, ...t.header };
}

/** Header + main + footer around a page. */
export default function PageShell({
  lang,
  t,
  page,
  solidHeader,
  hideBar,
  children,
}: {
  lang: Lang;
  t: Dict;
  page?: PageKey;
  solidHeader?: boolean;
  hideBar?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader lang={lang} page={page} solid={solidHeader} labels={headerLabels(t)} />
      <main id="main">{children}</main>
      <SiteFooter lang={lang} t={t} hideBar={hideBar} />
    </>
  );
}
