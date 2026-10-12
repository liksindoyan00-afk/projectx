import 'server-only';
import { unstable_cache } from 'next/cache';
import { prisma } from './db';
import { CONTENT_TAG } from './content';
import { SITE } from '@/content/site';

/** One contact channel: what to show and where it links. `null` = hidden on the site. */
export type Channel = { label: string; href: string } | null;

export type ContactInfo = {
  email: Channel;
  phone: Channel;
  telegram: Channel;
  whatsapp: Channel;
  instagram: Channel;
  linkedin: Channel;
  replyDays: string;
  /** Always a usable link for WhatsApp buttons (falls back to the placeholder link). */
  whatsappHref: string;
};

export type ContactRaw = {
  email: string;
  phone: string;
  telegram: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  replyDays: string;
};

const digits = (s: string) => s.replace(/\D/g, '');
const handleFrom = (s: string, host: RegExp) =>
  s
    .trim()
    .replace(host, '')
    .replace(/^@/, '')
    .replace(/[/?#].*$/, '');

/** Turn what the admin typed into display text + link. Exported for the admin preview. */
export function resolveContact(r: ContactRaw): ContactInfo {
  const email = r.email.trim();
  const phone = r.phone.trim();
  const tg = handleFrom(r.telegram, /^(https?:\/\/)?(www\.)?(t\.me|telegram\.me)\//i);
  const wa = r.whatsapp.trim();
  const ig = handleFrom(r.instagram, /^(https?:\/\/)?(www\.)?instagram\.com\//i);
  const li = r.linkedin.trim();
  const liHref = li ? (/^https?:\/\//i.test(li) ? li : `https://${li}`) : '';
  const whatsapp: Channel = wa && digits(wa).length >= 7 ? { label: wa, href: `https://wa.me/${digits(wa)}` } : null;
  return {
    email: email ? { label: email, href: `mailto:${email}` } : null,
    phone: phone && digits(phone).length >= 7 ? { label: phone, href: `tel:+${digits(phone)}` } : null,
    telegram: tg ? { label: `@${tg}`, href: `https://t.me/${tg}` } : null,
    whatsapp,
    instagram: ig ? { label: `@${ig}`, href: `https://instagram.com/${ig}` } : null,
    linkedin: liHref ? { label: liHref.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, ''), href: liHref } : null,
    replyDays: r.replyDays.trim() || SITE.replyDays,
    whatsappHref: whatsapp?.href ?? SITE.whatsappHref,
  };
}

/** Placeholders from the design handoff, used until contact details are saved in the admin. */
const PLACEHOLDER: ContactInfo = {
  email: { label: SITE.email, href: SITE.emailHref },
  phone: { label: SITE.phone, href: SITE.phoneHref },
  telegram: { label: SITE.telegram, href: SITE.telegramHref },
  whatsapp: { label: SITE.whatsapp, href: SITE.whatsappHref },
  instagram: { label: SITE.instagram, href: SITE.instagramHref },
  linkedin: { label: SITE.linkedin, href: SITE.linkedinHref },
  replyDays: SITE.replyDays,
  whatsappHref: SITE.whatsappHref,
};

const load = unstable_cache(() => prisma.contactSettings.findUnique({ where: { id: 1 } }), ['contact-settings-v1'], {
  tags: [CONTENT_TAG],
  revalidate: 3600,
});

export async function getContact(): Promise<ContactInfo> {
  try {
    const row = await load();
    return row ? resolveContact(row) : PLACEHOLDER;
  } catch (err) {
    console.error('[contact] database unavailable, using placeholders:', (err as Error).message);
    return PLACEHOLDER;
  }
}
