import type { Metadata } from 'next';
import { getDict } from '@/content';
import type { Lang } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import PageShell from '@/components/page-shell';
import { CtaBand } from '@/components/blocks';
import { TopArc } from '@/components/icons';
import Timeline from '@/components/Timeline';

type Params = { params: Promise<{ lang: Lang }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return pageMetadata((await params).lang, 'process');
}

export default async function Process({ params }: Params) {
  const { lang } = await params;
  const t = getDict(lang);
  const p = t.process;
  return (
    <PageShell lang={lang} t={t} page="process">
      <section className="bg-navy on-navy">
        <TopArc height={440} viewBox="0 0 1200 440" d="M640 440 A 560 560 0 0 1 1150 120" star="translate(1138 106)" />
        <div className="container stack" style={{ gap: 72, paddingTop: 'var(--hero-top)', paddingBottom: 'var(--section-y)' }}>
          <div className="stack" style={{ gap: 24, maxWidth: 760 }}>
            <span className="eyebrow">{p.eyebrow}</span>
            <h1 className="display" style={{ fontSize: 'clamp(44px,5.4vw,72px)', lineHeight: 1.05 }}>
              {p.title}
            </h1>
            <div className="legend">
              <span>
                <span className="core" aria-hidden="true" />
                {p.legendCore}
              </span>
              <span>
                <span className="opt" aria-hidden="true" />
                {p.legendOptional}
              </span>
              <span>{p.hint}</span>
            </div>
          </div>
          <Timeline p={p} />
        </div>
      </section>

      <section className="bg-ivory">
        <div className="container section grid-auto" style={{ ['--min' as string]: '420px', gap: '48px 72px', alignItems: 'start' }}>
          <div className="head">
            <span className="eyebrow">{p.when.eyebrow}</span>
            <h2 className="h2" style={{ fontSize: 'clamp(34px,3.8vw,52px)', lineHeight: 1.12 }}>
              {p.when.title}
            </h2>
          </div>
          <div className="stack" style={{ gap: 24, borderTop: '1px solid var(--gold-500)', paddingTop: 28 }}>
            <p className="when-quote">
              {p.when.quote} <span className="em">{p.when.quoteEm}</span>
            </p>
            <p className="body" style={{ fontSize: 17 }}>
              {p.when.body}
            </p>
          </div>
        </div>
      </section>

      <CtaBand lang={lang} t={t} />
    </PageShell>
  );
}
