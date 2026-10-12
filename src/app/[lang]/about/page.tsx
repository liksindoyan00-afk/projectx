import type { Metadata } from 'next';
import { getDict } from '@/content';
import type { Lang } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import PageShell from '@/components/page-shell';
import { CtaBand, Photo } from '@/components/blocks';
import { Star, TopArc } from '@/components/icons';

type Params = { params: Promise<{ lang: Lang }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return pageMetadata((await params).lang, 'about');
}

export default async function About({ params }: Params) {
  const { lang } = await params;
  const t = getDict(lang);
  const a = t.about;
  return (
    <PageShell lang={lang} t={t} page="about">
      {/* WHO WE ARE */}
      <section className="bg-navy on-navy">
        <TopArc height={520} viewBox="0 0 1200 520" d="M640 540 A 560 560 0 0 1 1150 120" star="translate(1138 106)" />
        <div className="container grid-auto" style={{ ['--min' as string]: '460px', gap: '40px 80px', alignItems: 'end', paddingTop: 'var(--hero-top)' }}>
          <div className="stack" style={{ gap: 24 }}>
            <span className="eyebrow">{a.eyebrow}</span>
            <h1 className="display">{a.title}</h1>
          </div>
          <div className="stack" style={{ gap: 20, paddingBottom: 10 }}>
            <p className="lead" style={{ maxWidth: 500, fontSize: 18, lineHeight: 1.7 }}>
              {a.lead}
            </p>
            <div className="facts">
              {a.facts.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="container" style={{ paddingTop: 72 }}>
          <Photo ratio="21/8" alt={a.heroImageAlt} note="Editorial photograph — wide: a study, a reading room or Yerevan in early light. No people facing camera." />
        </div>
        <div style={{ height: 96 }} />
      </section>

      {/* FOUR THINGS */}
      <section className="bg-ivory">
        <div className="container section stack" style={{ gap: 64 }}>
          <div className="head">
            <span className="eyebrow">{a.four.eyebrow}</span>
            <h2 className="h2 h2--lg">{a.four.title}</h2>
          </div>
          <div className="grid-auto" style={{ ['--min' as string]: '480px', gap: '0 80px' }}>
            {a.four.items.map((f, i) => (
              <div key={i} className="num-row" style={{ padding: '40px 0', borderBottom: 0 }}>
                <span className="numeral" style={{ fontSize: 44 }}>
                  {'0' + (i + 1)}
                </span>
                <div style={{ gap: 12 }}>
                  <h3 className="h3" style={{ fontSize: 25, textWrap: 'balance' }}>
                    {f.title}
                  </h3>
                  <p className="body">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="bg-navy on-navy">
        <div className="container section grid-auto" style={{ ['--min' as string]: '420px', gap: '64px 88px', alignItems: 'start' }}>
          <div style={{ position: 'relative', maxWidth: 480, width: '100%' }}>
            <div className="photo-frame__rule" style={{ inset: '20px 20px -20px -20px' }} />
            <Photo ratio="4/5" alt={a.principles.imageAlt} note="Editorial photograph — vertical detail: annotated draft, books, a desk lamp" />
          </div>
          <div className="stack" style={{ gap: 40 }}>
            <div className="stack" style={{ gap: 18 }}>
              <span className="eyebrow">{a.principles.eyebrow}</span>
              <h2 className="h2" style={{ lineHeight: 1.18 }}>
                {a.principles.title}
              </h2>
            </div>
            <div className="stack" style={{ borderTop: '1px solid rgba(167,178,194,0.22)' }}>
              {a.principles.items.map((p, i) => (
                <div key={i} className="grid-auto principle-row">
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
            <div className="guarantee">
              <Star size={16} style={{ marginTop: 8 }} />
              <p>
                {a.principles.guarantee} <span className="em">{a.principles.guaranteeEm}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETS */}
      <section className="bg-ivory">
        <div className="container section grid-auto" style={{ ['--min' as string]: '380px', gap: '56px 88px', alignItems: 'start' }}>
          <div className="sticky-col" style={{ gap: 18 }}>
            <span className="eyebrow">{a.markets.eyebrow}</span>
            <h2 className="h2" style={{ lineHeight: 1.18 }}>
              {a.markets.title}
            </h2>
            <p className="body" style={{ maxWidth: 420 }}>
              {a.markets.body}
            </p>
          </div>
          <div className="stack" style={{ borderTop: '1px solid var(--navy-700)' }}>
            {a.markets.items.map((m, i) => (
              <div key={i} className="market-row">
                <span>
                  <span className="mono">{'0' + (i + 1)}</span>
                  <span className="name">{m.name}</span>
                  {m.home && <Star size={12} label={a.markets.homeBase} />}
                </span>
                {m.note && <span className="note">{m.note}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand lang={lang} t={t} />
    </PageShell>
  );
}
