import type { Dict } from '@/content';
import { localePath, PAGES, type Lang } from '@/lib/i18n';
import { Arc } from './icons';

export function CtaBand({ lang, t, title }: { lang: Lang; t: Dict; title?: string }) {
  return (
    <section className="bg-navy-700 cta-band on-navy" aria-label={title ?? t.cta.title}>
      <Arc viewBox="0 0 1200 400" aspect="xMaxYMid slice" d="M640 440 A 520 520 0 0 1 1150 70" opacity={0.4} star="translate(1138 56)" />
      <div className="container cta-band__inner">
        <h2 className="h2">{title ?? t.cta.title}</h2>
        <a href={localePath(lang, PAGES.contact) + '#enquiry'} className="btn btn--primary btn--lg on-dark">
          {t.cta.button}
        </a>
      </div>
    </section>
  );
}

/** "18 of 20" — italic gold "of" (EN/RU), upright "/" for Armenian. */
export function StatFigure({ a, total, t, xl }: { a: number; total: number; t: Dict; xl?: boolean }) {
  return (
    <span className={`stat${xl ? ' stat--xl' : ''}`} aria-hidden="true">
      {a} <span className={`stat__of${t.stat.ofItalic ? ' italic' : ''}`}>{t.stat.of}</span> {total}
    </span>
  );
}

export function Dots({ a, total, label, large }: { a: number; total: number; label: string; large?: boolean }) {
  const n = Math.max(0, Math.min(total, 100));
  return (
    <div className={`dots${large ? ' dots--lg' : ''}`} role="img" aria-label={label}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className={i < a ? 'on' : undefined} />
      ))}
    </div>
  );
}

/**
 * Photo slot. `src` is a base path without size/extension: files `${src}-720` and `${src}-1080`
 * must exist as .webp and .jpg in /public. Without `src` a quiet placeholder is shown.
 */
export function Photo({ src, alt, ratio, note, priority }: { src?: string; alt: string; ratio: string; note: string; priority?: boolean }) {
  const sizes = '(max-width: 900px) 100vw, 540px';
  return (
    <div className="photo" style={{ aspectRatio: ratio }}>
      {src ? (
        <picture>
          <source type="image/webp" srcSet={`${src}-720.webp 720w, ${src}-1080.webp 1080w`} sizes={sizes} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${src}-1080.jpg`}
            srcSet={`${src}-720.jpg 720w, ${src}-1080.jpg 1080w`}
            sizes={sizes}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
          />
        </picture>
      ) : (
        <span className="photo__placeholder" role="img" aria-label={alt}>
          {note}
        </span>
      )}
    </div>
  );
}
