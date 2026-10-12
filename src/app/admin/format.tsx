import { STATUSES } from '@/lib/enquiry-options';

const TZ = 'Asia/Yerevan';

export function fmtDate(d: Date | string, withTime = true) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(new Date(d));
}

export function ago(d: Date | string) {
  const s = Math.round((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d ago`;
  return fmtDate(d, false);
}

export function statusMeta(key: string) {
  return STATUSES.find((s) => s.key === key) ?? { key, label: key, tone: 'muted' as const };
}

export function StatusPill({ status }: { status: string }) {
  const m = statusMeta(status);
  return <span className={`pill ${m.tone}`}>{m.label}</span>;
}
