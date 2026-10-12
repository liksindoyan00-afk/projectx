import { headers } from 'next/headers';
import { getDict } from '@/content';
import { isLang, localePath, PAGES, type Lang } from '@/lib/i18n';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { STAR_PATH } from '@/components/icons';
import { headerLabels } from '@/components/page-shell';

export default async function NotFound() {
  const h = await headers();
  const fromHeader = h.get('x-bp-lang');
  const lang: Lang = isLang(fromHeader) ? fromHeader : 'hy';
  const t = getDict(lang);
  return (
    <>
      <title>{t.meta.notFound.title}</title>
      <meta name="robots" content="noindex" />
      <SiteHeader lang={lang} labels={headerLabels(t)} />
      <main id="main">
        <section className="nf on-navy">
          <svg className="arc" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
            <path d="M-80 860 A 760 760 0 0 1 1040 120" fill="none" stroke="#B99A5A" strokeOpacity="0.35" strokeWidth="1" />
            <path d="M60 860 A 700 700 0 0 1 1180 260" fill="none" stroke="#A7B2C2" strokeOpacity="0.12" strokeWidth="1" />
            <path transform="translate(1060 60) scale(1.1)" d={STAR_PATH} fill="#B99A5A" />
          </svg>
          <div className="container stack" style={{ width: '100%', gap: 28, paddingTop: 'clamp(120px,14vw,184px)', paddingBottom: 'clamp(72px,10vw,128px)' }}>
            <span className="eyebrow">{t.notFound.eyebrow}</span>
            <h1 className="display" style={{ maxWidth: 760, fontSize: 'clamp(40px,5vw,68px)', lineHeight: 1.08 }}>
              {t.notFound.title}
            </h1>
            <p className="lead" style={{ maxWidth: 520 }}>
              {t.notFound.body}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, paddingTop: 8 }}>
              <a href={localePath(lang, '/')} className="btn btn--primary">
                {t.notFound.home}
              </a>
              <a href={localePath(lang, PAGES.contact)} className="btn btn--ghost-light">
                {t.notFound.contact}
              </a>
            </div>
            <nav className="nf__links">
              {(['services', 'process', 'results', 'faq'] as const).map((k) => (
                <a key={k} href={localePath(lang, PAGES[k])}>
                  {t.nav[k]}
                </a>
              ))}
            </nav>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} t={t} />
    </>
  );
}
