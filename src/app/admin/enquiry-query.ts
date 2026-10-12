import type { Prisma } from '@prisma/client';
import { STATUSES } from '@/lib/enquiry-options';

export type EnquiryFilters = { status?: string; q?: string; service?: string; lang?: string; from?: string; to?: string };

/** Shared by the list page and the CSV export. "ALL" excludes spam unless status=SPAM. */
export function enquiryWhere(f: EnquiryFilters): Prisma.EnquiryWhereInput {
  const where: Prisma.EnquiryWhereInput = {};
  if (f.status && STATUSES.some((s) => s.key === f.status)) where.status = f.status as Prisma.EnquiryWhereInput['status'];
  else where.status = { not: 'SPAM' };
  if (f.service) where.service = f.service;
  if (f.lang && ['hy', 'ru', 'en'].includes(f.lang)) where.lang = f.lang;
  if (f.from || f.to) {
    where.createdAt = {};
    if (f.from) where.createdAt.gte = new Date(f.from + 'T00:00:00+04:00');
    if (f.to) where.createdAt.lte = new Date(f.to + 'T23:59:59+04:00');
  }
  const q = f.q?.trim();
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q } },
      { universities: { contains: q, mode: 'insensitive' } },
      { message: { contains: q, mode: 'insensitive' } },
    ];
  }
  return where;
}
