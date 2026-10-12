import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { COUNTRIES, labelFor, LEVELS, ROLES, SERVICES, STATUSES, YEARS } from '@/lib/enquiry-options';
import { enquiryWhere } from '../enquiry-query';

export const dynamic = 'force-dynamic';

const cell = (v: unknown) => {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@]/.test(s)) s = "'" + s; // avoid spreadsheet formula injection
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: 'unauthorised' }, { status: 401 });
  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const rows = await prisma.enquiry.findMany({ where: enquiryWhere(sp), orderBy: { createdAt: 'desc' }, take: 10000 });
  const head = ['Received (UTC)', 'Status', 'Full name', 'I am', 'Email', 'Phone', 'WhatsApp', 'Telegram', 'Applying for', 'Start year', 'Target universities', 'Target countries', 'Service', 'Message', 'Language', 'Page', 'Service param', 'Consent version', 'ID'];
  const lines = rows.map((e) =>
    [
      e.createdAt.toISOString(),
      STATUSES.find((s) => s.key === e.status)?.label ?? e.status,
      e.fullName,
      labelFor(ROLES, e.role),
      e.email,
      e.phone,
      e.whatsapp,
      e.telegram,
      labelFor(LEVELS, e.level),
      labelFor(YEARS, e.startYear),
      e.universities,
      e.countries.map((c) => labelFor(COUNTRIES, c)).join('; '),
      labelFor(SERVICES, e.service),
      e.message,
      e.lang,
      e.page,
      e.serviceParam,
      e.consentVersion,
      e.id,
    ]
      .map(cell)
      .join(','),
  );
  const csv = '﻿' + [head.join(','), ...lines].join('\r\n'); // BOM so Excel reads UTF-8 (Armenian/Russian)
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="bridgepath-enquiries-${date}.csv"` },
  });
}
