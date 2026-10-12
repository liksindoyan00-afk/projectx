import 'server-only';
import { unstable_cache } from 'next/cache';
import { prisma } from './db';
import type { Lang } from './i18n';
import { DEFAULT_STATS, DEFAULT_UNIVERSITIES } from './defaults';

export const CONTENT_TAG = 'site-content';

export type PublicStats = {
  admitted: number;
  total: number;
  graduate: number;
  fundingMin: number;
  fundingMax: number;
  practiceNote: string;
  fundingCaveat: string;
};
export type PublicUniversity = { id: string; name: string; country: string; showOnHome: boolean };
export type PublicTestimonial = {
  id: string;
  quote: string;
  author: string;
  university: string;
  level: string;
  featured: boolean;
};

const pick = <T extends Record<string, unknown>>(row: T, base: string, lang: Lang): string => {
  const key = base + lang.charAt(0).toUpperCase() + lang.slice(1);
  return String(row[key] ?? '');
};

/** Everything the public pages read from the database, cached and invalidated from the admin panel. */
const loadAll = unstable_cache(
  async () => {
    // Errors are thrown (not cached) so a temporary outage never gets stored as "empty".
    const [stats, universities, testimonials] = await Promise.all([
      prisma.siteStats.findUnique({ where: { id: 1 } }),
      prisma.university.findMany({ where: { visible: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }),
      prisma.testimonial.findMany({ where: { visible: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }),
    ]);
    return { stats, universities, testimonials };
  },
  ['site-content-v1'],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

export async function getSiteContent(lang: Lang) {
  let data: Awaited<ReturnType<typeof loadAll>> | { stats: null; universities: null; testimonials: null };
  try {
    data = await loadAll();
  } catch (err) {
    console.error('[content] database unavailable, using defaults:', (err as Error).message);
    data = { stats: null, universities: null, testimonials: null };
  }
  const s = data.stats ?? DEFAULT_STATS;
  const stats: PublicStats = {
    admitted: s.admittedCount,
    total: s.totalCount,
    graduate: s.graduateAdmissions,
    fundingMin: s.fundingMinPct,
    fundingMax: s.fundingMaxPct,
    practiceNote: pick(s, 'practiceNote', lang),
    fundingCaveat: pick(s, 'fundingCaveat', lang),
  };
  const uniRows = data.universities ?? DEFAULT_UNIVERSITIES.map((u, i) => ({ ...u, id: `default-${i}` }));
  const universities: PublicUniversity[] = uniRows.map((u) => ({
    id: u.id,
    name: u.name,
    country: pick(u, 'country', lang),
    showOnHome: u.showOnHome,
  }));
  const testimonials: PublicTestimonial[] = (data.testimonials ?? []).map((t) => ({
    id: t.id,
    quote: pick(t, 'quote', lang),
    author: pick(t, 'author', lang),
    university: t.university,
    level: t.level,
    featured: t.featured,
  }));
  return { stats, universities, testimonials };
}
