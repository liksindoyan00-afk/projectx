import type { Metadata } from 'next';
import { getDict } from '@/content';
import type { Lang } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import PageShell from '@/components/page-shell';
import { CtaBand } from '@/components/blocks';
import { TopArc } from '@/components/icons';
import FaqList from '@/components/FaqList';

type Params = { params: Promise<{ lang: Lang }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return pageMetadata((await params).lang, 'faq');
}

export default async function Faq({ params }: Params) {
  const { lang } = await params;
  const t = getDict(lang);
  const f = t.faq;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: f.groups.flatMap((g) => g.items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } }))),
  };
  return (
    <PageShell lang={lang} t={t} page="faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-navy on-navy">
        <TopArc height={440} viewBox="0 0 1200 440" d="M640 460 A 560 560 0 0 1 1150 120" star="translate(1138 106)" />
        <div className="container hero stack" style={{ gap: 24 }}>
          <span className="eyebrow">{f.eyebrow}</span>
          <h1 className="display" style={{ maxWidth: 760 }}>
            {f.title}
          </h1>
        </div>
      </section>
      <section className="bg-ivory">
        <div className="container" style={{ paddingTop: 'clamp(54px,7.27vw,96px)', paddingBottom: 'var(--section-y)' }}>
          <FaqList f={f} />
        </div>
      </section>
      <CtaBand lang={lang} t={t} title={f.still} />
    </PageShell>
  );
}
