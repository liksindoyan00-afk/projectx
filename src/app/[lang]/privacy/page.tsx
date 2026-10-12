import type { Metadata } from 'next';
import { getDict } from '@/content';
import type { Lang } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import PageShell from '@/components/page-shell';
import { Star } from '@/components/icons';

type Params = { params: Promise<{ lang: Lang }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return pageMetadata((await params).lang, 'privacy');
}

export default async function Privacy({ params }: Params) {
  const { lang } = await params;
  const t = getDict(lang);
  const p = t.privacy;
  return (
    <PageShell lang={lang} t={t} page="privacy">
      <section className="bg-navy on-navy">
        <div className="container stack" style={{ gap: 20, paddingTop: 'clamp(120px,14vw,184px)', paddingBottom: 'clamp(56px,7vw,88px)' }}>
          <span className="eyebrow">{p.eyebrow}</span>
          <h1 className="h1-page">{p.title}</h1>
          <span style={{ fontSize: 14, color: 'var(--slate)' }}>{p.updated}</span>
        </div>
      </section>
      <section className="bg-ivory">
        <div className="container side-layout" style={{ paddingTop: 'clamp(56px,7vw,96px)', paddingBottom: 'clamp(72px,10vw,128px)' }}>
          <nav className="side-nav" aria-label={p.contents} style={{ gap: 16 }}>
            <span className="eyebrow">{p.contents}</span>
            <div className="side-nav__list">
              {p.sections.map((s, i) => (
                <a key={s.id} href={`#${s.id}`} style={{ justifyContent: 'flex-start', fontSize: 14, padding: '12px 0' }}>
                  <span className="mono" style={{ color: 'var(--gold-ink)', width: 18, paddingTop: 2 }}>
                    {'0' + (i + 1)}
                  </span>
                  {s.title}
                </a>
              ))}
            </div>
          </nav>
          <article className="stack" style={{ maxWidth: 720, gap: 56, minWidth: 0 }}>
            <div className="template-note">
              <Star size={12} style={{ marginTop: 6 }} />
              <p>{p.template}</p>
            </div>
            <p style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: 21, lineHeight: 1.55, color: 'var(--navy-700)' }}>{p.summary}</p>
            {p.sections.map((s, i) => (
              <div key={s.id} id={s.id} className="policy-sec">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <span className="numeral" style={{ fontSize: 18 }}>
                    {'0' + (i + 1)}
                  </span>
                  <h2>{s.title}</h2>
                </div>
                <p className="body" style={{ fontSize: 17, lineHeight: 1.75 }}>
                  {s.body}
                </p>
                {s.list.length > 0 && (
                  <ul>
                    {s.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </article>
        </div>
      </section>
    </PageShell>
  );
}
