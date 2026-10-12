import type { Metadata } from 'next';
import { fmt, getDict } from '@/content';
import { getSiteContent } from '@/lib/content';
import { localePath, PAGES, type Lang } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { labelFor, TESTIMONIAL_LEVELS } from '@/lib/enquiry-options';
import PageShell from '@/components/page-shell';
import { CtaBand, Dots, Photo, StatFigure } from '@/components/blocks';
import { Arc, STAR_PATH, StarRule } from '@/components/icons';

type Params = { params: Promise<{ lang: Lang }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return pageMetadata((await params).lang, 'home');
}

export default async function Home({ params }: Params) {
  const { lang } = await params;
  const t = getDict(lang);
  const h = t.home;
  const { stats, universities, testimonials } = await getSiteContent(lang);
  const homeUnis = universities.filter((u) => u.showOnHome);
  const featured = testimonials.find((x) => x.featured) ?? testimonials[0];
  const contact = localePath(lang, PAGES.contact);

  return (
    <PageShell lang={lang} t={t} page="home">
      {/* 1 HERO */}
      <section className="bg-navy on-navy" aria-labelledby="hero-title">
        <div
          className="container grid-auto"
          style={{
            ['--min' as string]: '440px',
            gap: 72,
            alignItems: 'center',
            paddingTop: 'clamp(99px,13.33vw,176px)',
            paddingBottom: 'clamp(63px,8.48vw,112px)',
          }}
        >
          <div className="stack" style={{ gap: 28, position: 'relative', zIndex: 1 }}>
            <span className="eyebrow">{h.eyebrow}</span>
            <h1 id="hero-title" className="display">
              {h.title}
            </h1>
            <span style={{ width: 56, height: 1, background: 'var(--gold-500)' }} />
            <p className="lead" style={{ maxWidth: 520 }}>
              {h.lead}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, paddingTop: 8 }}>
              <a href={contact + '#enquiry'} className="btn btn--primary">
                {h.primary}
              </a>
              <a href={localePath(lang, PAGES.process)} className="btn btn--ghost-light">
                {h.secondary}
              </a>
            </div>
          </div>
          <div style={{ position: 'relative', justifySelf: 'end', width: '100%', maxWidth: 540 }}>
            <div className="photo-frame__rule" style={{ inset: '24px -24px -24px 24px' }} />
            <Photo src="/images/home-hero" priority ratio="4/5" alt={h.heroImageAlt} note="Campus or library photograph — vertical, quiet, natural light" />
            <svg
              viewBox="0 0 1000 1000"
              style={{ position: 'absolute', left: '-58%', top: '-14%', width: '170%', height: '128%', maxWidth: 'none', pointerEvents: 'none', overflow: 'visible' }}
              aria-hidden="true"
            >
              <path d="M0 1000 A 900 900 0 0 1 880 90" fill="none" stroke="#B99A5A" strokeOpacity="0.7" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
              <path d="M120 1000 A 860 860 0 0 1 960 200" fill="none" stroke="#F7F3EA" strokeOpacity="0.18" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <path transform="translate(866 58) scale(1.3)" d={STAR_PATH} fill="#B99A5A" />
            </svg>
          </div>
        </div>
      </section>

      {/* 2 WHY THIS IS HARD */}
      <section className="bg-ivory">
        <div className="container section stack" style={{ gap: 64 }}>
          <div className="head">
            <span className="eyebrow">{h.hard.eyebrow}</span>
            <h2 className="h2">{h.hard.title}</h2>
          </div>
          <div className="grid-auto steps-3">
            {h.hard.items.map((it, i) => (
              <div key={i}>
                <span className="numeral">{'0' + (i + 1)}</span>
                <h3 className="h3">{it.title}</h3>
                <p className="body">{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 WHO WE WORK WITH */}
      <section className="bg-navy on-navy">
        <Arc viewBox="0 0 1200 600" aspect="xMaxYMin slice" d="M760 -40 A 560 560 0 0 0 1260 520" opacity={0.16} />
        <div className="container section stack" style={{ gap: 64 }}>
          <div className="head">
            <span className="eyebrow">{h.who.eyebrow}</span>
            <h2 className="h2">{h.who.title}</h2>
          </div>
          <div className="grid-auto" style={{ ['--min' as string]: '300px', gap: 20 }}>
            {h.who.items.map((it, i) => (
              <div key={i} className="card-navy">
                <span className="tag">{it.tag}</span>
                <h3 className="h3">{it.title}</h3>
                <p className="body">{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 TWO WAYS TO BEGIN */}
      <section className="bg-ivory">
        <div className="container section stack" style={{ gap: 64 }}>
          <div className="head">
            <span className="eyebrow">{h.ways.eyebrow}</span>
            <h2 className="h2">{h.ways.title}</h2>
          </div>
          <div className="grid-auto" style={{ ['--min' as string]: '420px', gap: 24 }}>
            {h.ways.items.map((it, i) => (
              <div key={i} className="card-white way-card">
                <span className="numeral" style={{ fontSize: 20 }}>
                  {'0' + (i + 1)}
                </span>
                <h3 className="h3">{it.title}</h3>
                <p className="body">{it.body}</p>
                <a
                  href={`${contact}?service=${i === 0 ? 'profile-evaluation' : 'full-admission-consulting'}#enquiry`}
                  className="btn btn--ghost-dark"
                >
                  {h.ways.button}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 RESULTS */}
      <section className="bg-navy on-navy">
        <div className="container section grid-auto" style={{ ['--min' as string]: '460px', gap: 72, alignItems: 'start' }}>
          <div className="stack" style={{ gap: 28 }}>
            <span className="eyebrow">{h.results.eyebrow}</span>
            <div className="stack" style={{ gap: 16 }}>
              <StatFigure a={stats.admitted} total={stats.total} t={t} />
              <span style={{ fontFamily: 'var(--serif)', fontSize: 24, lineHeight: 1.35, color: 'var(--mist)', maxWidth: 420 }}>
                <span className="sr-only">{fmt(h.results.dotsLabel, { a: stats.admitted, t: stats.total })}. </span>
                {h.results.caption}
              </span>
            </div>
            <Dots a={stats.admitted} total={stats.total} label={fmt(h.results.dotsLabel, { a: stats.admitted, t: stats.total })} />
          </div>
          <div className="stack" style={{ gap: 28, paddingTop: 6 }}>
            <span className="eyebrow">{h.results.where}</span>
            <div className="uni-list">
              {homeUnis.map((u) => (
                <span key={u.id}>{u.name}</span>
              ))}
            </div>
            <a href={localePath(lang, PAGES.results)} className="text-link">
              {h.results.all} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6 TESTIMONIAL */}
      <section className="bg-ivory">
        <figure className="quote-block">
          <StarRule size={14} />
          <blockquote>“{featured ? featured.quote : h.testimonialPlaceholder.quote}”</blockquote>
          <figcaption>
            <strong>{featured ? featured.author : h.testimonialPlaceholder.author}</strong>
            <span>
              {featured
                ? `${featured.university} · ${labelFor(TESTIMONIAL_LEVELS, featured.level, lang)}`
                : h.testimonialPlaceholder.university}
            </span>
          </figcaption>
        </figure>
      </section>

      {/* 7 CLOSING CTA */}
      <CtaBand lang={lang} t={t} />
    </PageShell>
  );
}
