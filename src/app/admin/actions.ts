'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { createSession, destroySession, requireAdmin } from '@/lib/auth';
import { CONTENT_TAG } from '@/lib/content';
import { STATUSES, TESTIMONIAL_LEVELS, keysOf } from '@/lib/enquiry-options';

export type FormState = { ok?: boolean; error?: string; message?: string } | undefined;

const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? '').trim().slice(0, max);
const int = (fd: FormData, k: string, min: number, max: number) => {
  const n = Math.round(Number(fd.get(k)));
  if (!Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, n));
};
const bool = (fd: FormData, k: string) => fd.get(k) === 'on' || fd.get(k) === 'true';

/** Public pages read stats/universities/testimonials through a tagged cache; bust it after edits. */
function refreshPublicSite() {
  revalidateTag(CONTENT_TAG);
  revalidatePath('/', 'layout');
}

// ─── Auth ──────────────────────────────────────────────────────────────

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, 'email', 254).toLowerCase();
  const password = String(fd.get('password') ?? '');
  const next = str(fd, 'next', 300);
  const user = email ? await prisma.adminUser.findUnique({ where: { email } }) : null;
  // Hash even when the user does not exist, so response time does not reveal valid emails.
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : (await bcrypt.hash(password, 10), false);
  if (!user || !ok) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return { error: 'Email or password is incorrect.' };
  }
  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession({ uid: user.id, email: user.email, name: user.name });
  redirect(next.startsWith('/admin') ? next : '/admin');
}

export async function logout() {
  await destroySession();
  redirect('/admin/login');
}

// ─── Enquiries ─────────────────────────────────────────────────────────

export async function setEnquiryStatus(fd: FormData) {
  await requireAdmin();
  const id = str(fd, 'id', 50);
  const status = str(fd, 'status', 20);
  if (!STATUSES.some((x) => x.key === status)) return;
  await prisma.enquiry.update({ where: { id }, data: { status: status as (typeof STATUSES)[number]['key'] } });
  revalidatePath('/admin', 'layout');
}

export async function addEnquiryNote(_: FormState, fd: FormData): Promise<FormState> {
  const s = await requireAdmin();
  const id = str(fd, 'id', 50);
  const body = str(fd, 'body', 5000);
  if (!body) return { error: 'Write a note first.' };
  await prisma.enquiryNote.create({ data: { enquiryId: id, body, author: s.name || s.email } });
  revalidatePath(`/admin/enquiries/${id}`);
  return { ok: true };
}

export async function deleteEnquiryNote(fd: FormData) {
  await requireAdmin();
  const id = str(fd, 'id', 50);
  const note = await prisma.enquiryNote.delete({ where: { id } });
  revalidatePath(`/admin/enquiries/${note.enquiryId}`);
}

export async function deleteEnquiry(fd: FormData) {
  await requireAdmin();
  const id = str(fd, 'id', 50);
  if (fd.get('confirm') !== 'on') return;
  await prisma.enquiry.delete({ where: { id } });
  revalidatePath('/admin', 'layout');
  redirect('/admin/enquiries');
}

// ─── Statistics ────────────────────────────────────────────────────────

export async function saveStats(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const admitted = int(fd, 'admittedCount', 0, 100);
  const total = int(fd, 'totalCount', 1, 100);
  const graduate = int(fd, 'graduateAdmissions', 0, 100);
  const fmin = int(fd, 'fundingMinPct', 0, 100);
  const fmax = int(fd, 'fundingMaxPct', 0, 100);
  if (admitted === null || total === null || graduate === null || fmin === null || fmax === null) return { error: 'All numbers are required.' };
  if (admitted > total) return { error: 'Admitted students cannot be more than the total.' };
  if (fmin >= fmax) return { error: 'The minimum award must be lower than the maximum.' };
  const data = {
    admittedCount: admitted,
    totalCount: total,
    graduateAdmissions: graduate,
    fundingMinPct: fmin,
    fundingMaxPct: fmax,
    practiceNoteHy: str(fd, 'practiceNoteHy', 600),
    practiceNoteRu: str(fd, 'practiceNoteRu', 600),
    practiceNoteEn: str(fd, 'practiceNoteEn', 600),
    fundingCaveatHy: str(fd, 'fundingCaveatHy', 600),
    fundingCaveatRu: str(fd, 'fundingCaveatRu', 600),
    fundingCaveatEn: str(fd, 'fundingCaveatEn', 600),
  };
  await prisma.siteStats.upsert({ where: { id: 1 }, create: { id: 1, ...data }, update: data });
  refreshPublicSite();
  revalidatePath('/admin/stats');
  return { ok: true, message: 'Saved. The website is updated.' };
}

// ─── Universities ──────────────────────────────────────────────────────

function uniData(fd: FormData) {
  return {
    name: str(fd, 'name', 120),
    countryHy: str(fd, 'countryHy', 80),
    countryRu: str(fd, 'countryRu', 80),
    countryEn: str(fd, 'countryEn', 80),
    sortOrder: int(fd, 'sortOrder', -999, 999) ?? 0,
    visible: bool(fd, 'visible'),
    showOnHome: bool(fd, 'showOnHome'),
  };
}

export async function saveUniversity(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, 'id', 50);
  const data = uniData(fd);
  if (!data.name || !data.countryEn) return { error: 'Name and country (EN) are required.' };
  data.countryHy ||= data.countryEn;
  data.countryRu ||= data.countryEn;
  if (id) await prisma.university.update({ where: { id }, data });
  else await prisma.university.create({ data });
  refreshPublicSite();
  revalidatePath('/admin/universities');
  return { ok: true, message: id ? 'Saved.' : 'Added.' };
}

export async function deleteUniversity(fd: FormData) {
  await requireAdmin();
  await prisma.university.delete({ where: { id: str(fd, 'id', 50) } });
  refreshPublicSite();
  revalidatePath('/admin/universities');
}

// ─── Testimonials ──────────────────────────────────────────────────────

export async function saveTestimonial(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, 'id', 50);
  const level = str(fd, 'level', 20);
  const data = {
    quoteHy: str(fd, 'quoteHy', 1200),
    quoteRu: str(fd, 'quoteRu', 1200),
    quoteEn: str(fd, 'quoteEn', 1200),
    authorHy: str(fd, 'authorHy', 80),
    authorRu: str(fd, 'authorRu', 80),
    authorEn: str(fd, 'authorEn', 80),
    university: str(fd, 'university', 120),
    level: keysOf(TESTIMONIAL_LEVELS).includes(level) ? level : 'bachelor',
    featured: bool(fd, 'featured'),
    visible: bool(fd, 'visible'),
    sortOrder: int(fd, 'sortOrder', -999, 999) ?? 0,
  };
  const anyQuote = data.quoteHy || data.quoteRu || data.quoteEn;
  const anyAuthor = data.authorHy || data.authorRu || data.authorEn;
  if (!anyQuote || !anyAuthor || !data.university) return { error: 'Quote, first name and university are required.' };
  // Fill missing languages from whichever is present, so no page shows an empty card.
  const fb = (a: string, b: string, c: string) => a || b || c;
  data.quoteHy = fb(data.quoteHy, data.quoteRu, data.quoteEn);
  data.quoteRu = fb(data.quoteRu, data.quoteEn, data.quoteHy);
  data.quoteEn = fb(data.quoteEn, data.quoteRu, data.quoteHy);
  data.authorHy = fb(data.authorHy, data.authorEn, data.authorRu);
  data.authorRu = fb(data.authorRu, data.authorEn, data.authorHy);
  data.authorEn = fb(data.authorEn, data.authorRu, data.authorHy);

  await prisma.$transaction(async (tx) => {
    // Only one featured testimonial at a time.
    if (data.featured) await tx.testimonial.updateMany({ where: id ? { NOT: { id } } : {}, data: { featured: false } });
    if (id) await tx.testimonial.update({ where: { id }, data });
    else await tx.testimonial.create({ data });
  });
  refreshPublicSite();
  revalidatePath('/admin/testimonials');
  return { ok: true, message: id ? 'Saved.' : 'Added.' };
}

export async function deleteTestimonial(fd: FormData) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id: str(fd, 'id', 50) } });
  refreshPublicSite();
  revalidatePath('/admin/testimonials');
}

// ─── Account ───────────────────────────────────────────────────────────

export async function changePassword(_: FormState, fd: FormData): Promise<FormState> {
  const s = await requireAdmin();
  const current = String(fd.get('current') ?? '');
  const next = String(fd.get('next') ?? '');
  if (next.length < 10) return { error: 'Use at least 10 characters for the new password.' };
  const user = await prisma.adminUser.findUnique({ where: { id: s.uid } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { error: 'Current password is incorrect.' };
  await prisma.adminUser.update({ where: { id: s.uid }, data: { passwordHash: await bcrypt.hash(next, 12) } });
  return { ok: true, message: 'Password changed.' };
}

export async function addAdmin(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const email = str(fd, 'email', 254).toLowerCase();
  const name = str(fd, 'name', 80);
  const password = String(fd.get('password') ?? '');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !name) return { error: 'Enter a name and a valid email.' };
  if (password.length < 10) return { error: 'Use at least 10 characters for the password.' };
  if (await prisma.adminUser.findUnique({ where: { email } })) return { error: 'That email already has access.' };
  await prisma.adminUser.create({ data: { email, name, passwordHash: await bcrypt.hash(password, 12) } });
  revalidatePath('/admin/account');
  return { ok: true, message: `${name} can now sign in.` };
}

export async function removeAdmin(fd: FormData) {
  const s = await requireAdmin();
  const id = str(fd, 'id', 50);
  if (id === s.uid) return; // cannot remove yourself
  await prisma.adminUser.delete({ where: { id } });
  revalidatePath('/admin/account');
}

// ─── Contact details ───────────────────────────────────────────────────

export async function saveContact(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const data = {
    email: str(fd, 'email', 254),
    phone: str(fd, 'phone', 40),
    telegram: str(fd, 'telegram', 120),
    whatsapp: str(fd, 'whatsapp', 40),
    instagram: str(fd, 'instagram', 200),
    linkedin: str(fd, 'linkedin', 300),
    replyDays: str(fd, 'replyDays', 20),
  };
  if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) return { error: 'The email address does not look complete.' };
  const digits = (s: string) => s.replace(/\D/g, '').length;
  if (data.phone && digits(data.phone) < 7) return { error: 'Enter the phone number with country code, e.g. +374 91 123456.' };
  if (data.whatsapp && digits(data.whatsapp) < 7) return { error: 'Enter the WhatsApp number with country code, e.g. +374 91 123456.' };
  if (!data.replyDays) return { error: 'Fill in the reply time (e.g. 2 or 1–2).' };
  await prisma.contactSettings.upsert({ where: { id: 1 }, create: { id: 1, ...data }, update: data });
  refreshPublicSite();
  revalidatePath('/admin/contact');
  return { ok: true, message: 'Saved. The footer and Contact page are updated.' };
}
