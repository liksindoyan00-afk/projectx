import type { Metadata } from 'next';
import { fmt, getDict } from '@/content';
import { getSiteContent, type PublicTestimonial } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { labelFor, TESTIMONIAL_LEVELS } from '@/lib/enquiry-options';
import PageShell from '@/components/page-shell';
import { CtaBand, Dots, StatFigure } from '@/components/blocks';
import { Star, TopArc } from '@/components/icons';

type Params = { params: Promise<{ lang: Lang }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return pageMetadata((await params).lang, 'results');
}

/** 6-column grid spans per number of cards (handoff: 5 = 3+3 / 2+2+2, 4 = 2×2, 3 = one row). */
function spans(n: number): number[] {
  if (n === 1) return [6];
  if (n === 2) return [3, 3];
  if (n === 3) return [2, 2, 2];
  if (n === 4) return [3, 3, 3, 3];
  if (n === 5) return [3, 3, 2, 2, 2];
  // 6+: rows of three
  return Array.from({ length: n }, () => 2);
}

export default async function Results({ params }: Params) {
  const { lang } = await params;
  const t = getDict(lang);
  const r = t.results;
  const { stats, universities, testimonials } = await getSiteContent(lang);
  const label = fmt(t.home.results.dotsLabel, { a: stats.admitted, t: stats.total });

  // Featured testimonial first; placeholders until real testimonials are added in the admin.
  const real: (PublicTestimonial | null)[] = [...testimonials].sort((a, b) => Number(b.featured) - Number(a.featured));
  const cards = real.length ? real : [null, null, null, null, null];
  const sp = spans(cards.length);
  const range = Math.max(1, stats.fundingMax - stats.fundingMin);
  const ticks = [0, 1 / 3, 2 / 3, 1].map((f) => Math.round(stats.fundingMin + f * range));

  return (
    <PageShell lang={lang} t={t} page="results">
      {/* HEADLINE */}
      <section className="bg-navy on-navy">
        <TopArc height={520} viewBox="0 0 1200 520" d="M640 540 A 560 560 0 0 1 1150 120" star="translate(1138 106)" />
        <div
          className="container grid-auto"
          style={{ ['--min' as string]: '480px', gap: '64px 80px', alignItems: 'end', paddingTop: 'var(--hero-top)', paddingBottom: 'var(--section-y)' }}
        >
          <div className="stack" style={{ gap: 24 }}>
            <span className="eyebrow">{r.eyebrow}</span>
            <StatFigure a={stats.admitted} total={stats.total} t={t} xl />
            <h1 style={{ margin: 0, maxWidth: 560, fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(26px,2.6vw,34px)', lineHeight: 1.3, color: 'var(--mist)', textWrap: 'balance' }}>
              <span className="sr-only">{label}: </span>
              {r.title}
            </h1>
          </div>
          <div className="stack" style={{ gap: 36 }}>
            <Dots a={stats.admitted} total={stats.total} label={label} large />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 13, color: 'var(--slate)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold-500)' }} />
                {r.legendYes}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid rgba(167,178,194,0.6)' }} />
                {r.legendNo}
              </span>
            </div>
            {stats.practiceNote && (
              <p className="body" style={{ maxWidth: 480, paddingTop: 24, borderTop: '1px solid rgba(167,178,194,0.22)', fontSize: 17 }}>
                {stats.practiceNote}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* WHERE THEY WENT */}
      <section className="bg-ivory">
        <div className="container section stack" style={{ gap: 56 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px 48px' }}>
            <div className="stack" style={{ gap: 18 }}>
              <span className="eyebrow">{r.admissions}</span>
              <h2 className="h2 h2--lg">{r.whereTitle}</h2>
            </div>
            {stats.graduate > 0 && <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--ink-muted)' }}>{fmt(r.graduateNote, { n: stats.graduate })}</p>}
          </div>
          <div className="uni-grid">
            {universities.map((u, i) => (
              <div key={u.id}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <div className="stack" style={{ gap: 12 }}>
                  <span className="name">{u.name}</span>
                  <span className="rule" />
                  <span className="country">{u.country}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FUNDING */}
      <section className="bg-navy on-navy">
        <div className="container section grid-auto" style={{ ['--min' as string]: '440px', gap: '64px 80px', alignItems: 'center' }}>
          <div className="stack" style={{ gap: 20 }}>
            <span className="eyebrow">{r.funding.eyebrow}</span>
            <h2 className="h2" style={{ fontSize: 'clamp(32px,3.4vw,46px)', lineHeight: 1.18 }}>
              {r.funding.title}
            </h2>
          </div>
          <div className="stack" style={{ gap: 28 }}>
            <div className="funding-ends">
              <span>
                <span className="v">{stats.fundingMin}%</span>
                <span className="k">{r.funding.partial}</span>
              </span>
              <span className="max">
                <span className="v">{stats.fundingMax}%</span>
                <span className="k">{r.funding.full}</span>
              </span>
            </div>
            <div className="funding-bar" aria-hidden="true">
              <span className="tick" style={{ left: '33.33%' }} />
              <span className="tick" style={{ left: '66.66%' }} />
              <Star size={18} />
            </div>
            <div className="funding-scale" aria-hidden="true">
              {ticks.map((v, i) => (
                <span key={i}>{v}</span>
              ))}
            </div>
            {stats.fundingCaveat && <p className="caveat">{stats.fundingCaveat}</p>}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-ivory">
        <div className="container section stack" style={{ gap: 56 }}>
          <div className="head">
            <span className="eyebrow">{r.testimonials.eyebrow}</span>
            <h2 className="h2 h2--lg">{r.testimonials.title}</h2>
          </div>
          <div className="t-grid">
            {cards.map((q, i) => {
              const span = sp[i] ?? 2;
              const featured = i === 0 && span === 3 && (q ? q.featured || real.length === 5 : true);
              const wide = span >= 3;
              const text = q ? q.quote : featured ? r.testimonialPlaceholder.featured : r.testimonialPlaceholder.quote;
              const levelKeys = ['bachelor', 'master', 'bachelor', 'phd', 'bachelor'];
              const meta = q
                ? `${q.university} · ${labelFor(TESTIMONIAL_LEVELS, q.level, lang)}`
                : `${r.testimonialPlaceholder.university} · ${labelFor(TESTIMONIAL_LEVELS, levelKeys[i % 5], lang)}`;
              return (
                <figure key={q?.id ?? i} className={`t-card${featured ? ' featured' : ''}${wide ? ' wide' : ''}`} style={{ gridColumn: `span ${span}` }}>
                  <span className="q" aria-hidden="true">
                    “
                  </span>
                  <blockquote>{text}</blockquote>
                  <figcaption>
                    <strong>{q ? q.author : r.testimonialPlaceholder.author}</strong>
                    <span className="meta">{meta}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand lang={lang} t={t} />
    </PageShell>
  );
}
