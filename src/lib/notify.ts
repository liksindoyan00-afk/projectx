import 'server-only';
import type { Enquiry } from '@prisma/client';
import { fmt, getDict } from '@/content';
import { SITE } from '@/content/site';
import { getContact } from './contact';
import { COUNTRIES, LEVELS, ROLES, SERVICES, YEARS, labelFor } from './enquiry-options';
import { isLang, type Lang } from './i18n';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Human-readable rows for an enquiry, labels in the given language. */
export function enquiryRows(e: Enquiry, lang: Lang): [string, string][] {
  const t = getDict(lang).form;
  return [
    [t.name, e.fullName],
    [t.role, labelFor(ROLES, e.role, lang)],
    [t.email, e.email],
    [t.phone, e.phone],
    [t.whatsapp, e.whatsapp || '—'],
    [t.telegram, e.telegram || '—'],
    [t.level, labelFor(LEVELS, e.level, lang)],
    [t.year, labelFor(YEARS, e.startYear, lang)],
    [t.unis, e.universities || '—'],
    [t.countries, e.countries.map((c) => labelFor(COUNTRIES, c, lang)).join(', ') || '—'],
    [t.service, labelFor(SERVICES, e.service, lang)],
    [t.message, e.message || '—'],
  ];
}

function table(rows: [string, string][]) {
  return `<table cellpadding="6" style="border-collapse:collapse;font:15px/1.5 Arial,sans-serif;color:#3B4656">${rows
    .map(([k, v]) => `<tr><td style="color:#5A6474;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="color:#1A2C46;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('')}</table>`;
}

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.EMAIL_FROM || 'BridgePath <onboarding@resend.dev>', to: [to], subject, html, reply_to: replyTo }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}`);
}

/** Team inbox + Telegram alert + auto-reply to the family. Failures are logged, never thrown. */
export async function notifyNewEnquiry(e: Enquiry) {
  const adminUrl = `${SITE.url}/admin/enquiries/${e.id}`;
  const jobs: Promise<unknown>[] = [];

  const team = process.env.TEAM_INBOX;
  if (team) {
    const html = `<p style="font:15px Arial,sans-serif">New enquiry from <b>${esc(e.fullName)}</b> (${e.lang.toUpperCase()}).</p>${table(
      enquiryRows(e, 'en'),
    )}<p style="font:14px Arial,sans-serif"><a href="${adminUrl}">Open in admin panel →</a></p>`;
    jobs.push(sendEmail(team, `New enquiry — ${e.fullName} · ${labelFor(SERVICES, e.service, 'en')}`, html, e.email));
  }

  jobs.push(
    sendTelegram(
      `🔔 New enquiry\n${e.fullName} (${labelFor(ROLES, e.role, 'en')})\n${labelFor(SERVICES, e.service, 'en')} · ${labelFor(LEVELS, e.level, 'en')} · ${labelFor(YEARS, e.startYear, 'en')}\n${e.email} · ${e.phone}\nLang: ${e.lang.toUpperCase()}\n${adminUrl}`,
    ),
  );

  if (process.env.SEND_AUTOREPLY !== 'false') {
    const { replyDays } = await getContact();
    const lang: Lang = isLang(e.lang) ? e.lang : 'hy';
    const a = getDict(lang).autoreply;
    const html = `<div style="font:15px/1.6 Arial,sans-serif;color:#3B4656;max-width:600px">
<p>${esc(fmt(a.greeting, { name: e.fullName }))}</p><p>${esc(fmt(a.body, { days: replyDays }))}</p>${table(enquiryRows(e, lang))}
<p style="color:#86672F;margin-top:24px">${esc(a.signoff)}</p></div>`;
    jobs.push(sendEmail(e.email, a.subject, html, team || undefined));
  }

  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === 'rejected' && console.error('[notify]', r.reason));
}
