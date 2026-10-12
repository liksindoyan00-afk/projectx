import type { Metadata } from 'next';
import { getDict } from '@/content';
import { localePath, PAGES, type Lang } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import PageShell from '@/components/page-shell';
import { Arc, Star } from '@/components/icons';

type Params = { params: Promise<{ lang: Lang }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return pageMetadata((await params).lang, 'services');
}

export default async function Services({ params }: Params) {
  const { lang } = await params;
  const t = getDict(lang);
  const s = t.services;
  const contact = localePath(lang, PAGES.contact);
  const pe = `${contact}?service=profile-evaluation#enquiry`;
  const fc = `${contact}?service=full-admission-consulting#enquiry`;

  const mark = (v: string) =>
    v === 'y' ? (
      <Star size={14} label={s.compare.included} />
    ) : v === 's' ? (
      <span className="scope">{s.compare.byScope}</span>
    ) : (
      <span aria-label={s.compare.notIncluded}>—</span>
    );

  return (
    <PageShell lang={lang} t={t} page="services">
      {/* INTRO */}
      <section className="bg-navy on-navy">
        <Arc viewBox="0 0 1200 500" d="M560 540 A 600 600 0 0 1 1150 110" opacity={0.35} star="translate(1138 96)" />
        <div className="container hero stack" style={{ gap: 56 }}>
          <div className="stack" style={{ gap: 24, maxWidth: 820 }}>
            <span className="eyebrow">{s.eyebrow}</span>
            <h1 className="display" style={{ lineHeight: 1.12 }}>
              {s.title} <span className="em">{s.titleEm}</span>
            </h1>
          </div>
          <div className="grid-auto jump-links">
            {s.jump.map((j, i) => (
              <a key={i} href={i === 0 ? '#profile-evaluation' : '#full-consulting'}>
                <span className="roman">{i === 0 ? 'I' : 'II'}</span>
                <span className="stack" style={{ gap: 6 }}>
                  <span className="t">{j.title}</span>
                  <span className="s">{j.sub}</span>
                </span>
                <span className="arrow" aria-hidden="true">
                  ↓
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE I */}
      <section id="profile-evaluation" className="bg-ivory">
        <div className="container section grid-auto split">
          <div className="sticky-col">
            <span className="big-roman" aria-hidden="true">
              I
            </span>
            <span className="eyebrow">{s.one.label}</span>
            <h2 className="h2">{s.one.title}</h2>
            <p className="lead">{s.one.lead}</p>
            <a href={pe} className="btn btn--primary">
              {s.button}
            </a>
          </div>
          <div className="stack">
            {s.one.steps.map((st, i) => (
              <div key={i} className="num-row">
                <span className="numeral">{'0' + (i + 1)}</span>
                <div>
                  <h3 className="h3">{st.title}</h3>
                  <p className="body">{st.body}</p>
                </div>
              </div>
            ))}
            <div className="answer-panel">
              <Arc viewBox="0 0 600 240" d="M300 280 A 300 300 0 0 1 580 40" opacity={0.35} star="translate(570 28) scale(0.8)" />
              <p className="on-navy">
                {s.one.answer} <span className="em">{s.one.answerEm}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE II */}
      <section id="full-consulting" className="bg-navy on-navy">
        <Arc viewBox="0 0 1200 800" aspect="xMinYMin slice" d="M-200 900 A 700 700 0 0 1 480 -20" opacity={0.14} />
        <div className="container section grid-auto split">
          <div className="sticky-col">
            <span className="big-roman" aria-hidden="true">
              II
            </span>
            <span className="eyebrow">{s.two.label}</span>
            <h2 className="h2">{s.two.title}</h2>
            <p className="lead">{s.two.lead}</p>
            <a href={fc} className="btn btn--primary">
              {s.button}
            </a>
          </div>
          <div className="stack" style={{ gap: 56 }}>
            <div className="stack" style={{ gap: 8 }}>
              <span className="eyebrow" style={{ paddingBottom: 16 }}>
                {s.two.includedLabel}
              </span>
              <div className="included-list">
                {s.two.included.map((it, i) => (
                  <div key={i}>
                    <span className="mono">{'0' + (i + 1)}</span>
                    <span className="stack" style={{ gap: 4 }}>
                      <span className="t">{it.title}</span>
                      {it.note && <span className="n">{it.note}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="scope-box">
              <div className="scope-box__head">
                <span className="eyebrow">{s.two.scopeLabel}</span>
                <span style={{ fontSize: 14, color: 'var(--slate)' }}>{s.two.scopeNote}</span>
              </div>
              <div className="grid-auto scope-grid">
                {s.two.scope.map((sc, i) => (
                  <div key={i}>
                    <Star size={10} />
                    <span>{sc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="bg-ivory">
        <div
          className="stack"
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: 'clamp(72px,9.70vw,128px) var(--gutter) clamp(76px,10.30vw,136px)',
            gap: 56,
          }}
        >
          <div className="head">
            <span className="eyebrow">{s.compare.eyebrow}</span>
            <h2 className="h2">{s.compare.title}</h2>
          </div>
          <div className="compare-wrap">
            <div className="compare" role="table" aria-label={s.compare.title}>
              <div className="compare__row compare__row--head" role="row">
                <span role="columnheader">{s.compare.col0}</span>
                <span role="columnheader">
                  <span className="r">I</span>
                  <span className="t">{s.jump[0].title}</span>
                </span>
                <span role="columnheader">
                  <span className="r">II</span>
                  <span className="t">{s.jump[1].title}</span>
                </span>
              </div>
              {s.compare.rows.map((r, i) => (
                <div key={i} role="rowgroup">
                  {r.group && (
                    <div className="compare__group" role="row">
                      <span role="rowheader">{r.group}</span>
                    </div>
                  )}
                  <div className="compare__row" role="row">
                    <span role="rowheader">{r.label}</span>
                    <span role="cell">{mark(r.p)}</span>
                    <span role="cell">{mark(r.f)}</span>
                  </div>
                </div>
              ))}
              <div className="compare__row compare__row--cta" role="row">
                <span role="cell" />
                <span role="cell">
                  <a href={pe} className="btn btn--ghost-dark">
                    {s.button}
                  </a>
                </span>
                <span role="cell">
                  <a href={fc} className="btn btn--ghost-dark">
                    {s.button}
                  </a>
                </span>
              </div>
            </div>
          </div>
          <div className="note-star">
            <Star size={10} />
            <p>{s.compare.fees}</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
