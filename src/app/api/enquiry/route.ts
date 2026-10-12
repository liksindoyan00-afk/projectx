import { createHash } from 'node:crypto';
import { after, NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { SITE } from '@/content/site';
import { isLang } from '@/lib/i18n';
import { coerceEnquiry, validateEnquiry } from '@/lib/enquiry-validate';
import { notifyNewEnquiry } from '@/lib/notify';

export const runtime = 'nodejs';

const RATE_WINDOW_MIN = 10;
const RATE_MAX = 5;

function clientIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  // Spam: honeypot filled or submitted faster than a human could → pretend success, store nothing.
  const elapsed = typeof body.elapsedMs === 'number' ? body.elapsedMs : 99999;
  if ((typeof body.website === 'string' && body.website.trim() !== '') || elapsed < 2500) {
    return NextResponse.json({ ok: true });
  }

  const input = coerceEnquiry(body);
  const errors = validateEnquiry(input);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const ipHash = createHash('sha256')
    .update(clientIp(req) + (process.env.IP_HASH_SALT || 'bp'))
    .digest('hex')
    .slice(0, 32);

  try {
    const since = new Date(Date.now() - RATE_WINDOW_MIN * 60_000);
    const recent = await prisma.enquiry.count({ where: { ipHash, createdAt: { gte: since } } });
    if (recent >= RATE_MAX) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });

    const lang = typeof body.lang === 'string' && isLang(body.lang) ? body.lang : 'hy';
    const s = (x: unknown, n: number) => (typeof x === 'string' && x.trim() ? x.trim().slice(0, n) : null);
    const enquiry = await prisma.enquiry.create({
      data: {
        fullName: input.fullName,
        role: input.role,
        email: input.email,
        phone: input.phone,
        whatsapp: input.sameAsPhone ? input.phone : input.whatsapp || null,
        telegram: input.telegram || null,
        level: input.level,
        startYear: input.startYear,
        universities: input.universities || null,
        countries: input.countries,
        service: input.service,
        message: input.message || null,
        lang,
        page: s(body.page, 200),
        referrer: s(body.referrer, 500),
        serviceParam: s(body.serviceParam, 60),
        consentVersion: SITE.consentVersion,
        consentAt: new Date(),
        ipHash,
        userAgent: req.headers.get('user-agent')?.slice(0, 300) ?? null,
      },
    });

    // Notifications run after the response is sent.
    after(() => notifyNewEnquiry(enquiry));

    return NextResponse.json({ ok: true, id: enquiry.id });
  } catch (err) {
    console.error('[enquiry] failed to save', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
