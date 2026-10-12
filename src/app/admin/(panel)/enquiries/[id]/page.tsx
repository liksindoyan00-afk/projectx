import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { STATUSES } from '@/lib/enquiry-options';
import { enquiryRows } from '@/lib/notify';
import { addEnquiryNote, deleteEnquiry, deleteEnquiryNote, setEnquiryStatus } from '../../../actions';
import { ActionForm, AutoSubmitSelect, ConfirmButton, SubmitButton } from '../../../ui';
import { fmtDate, StatusPill } from '../../../format';

export default async function EnquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = await prisma.enquiry.findUnique({ where: { id }, include: { notes: { orderBy: { createdAt: 'desc' } } } });
  if (!e) notFound();

  // Opening a new enquiry does not change its status automatically — staff set it explicitly.
  const digits = (s: string) => s.replace(/[^\d]/g, '');
  const wa = e.whatsapp || e.phone;
  const tg = e.telegram?.replace(/^@/, '');

  return (
    <>
      <Link href="/admin/enquiries" className="a-crumb">
        ← All enquiries
      </Link>
      <div className="a-top">
        <div>
          <h1>{e.fullName}</h1>
          <p>
            Received {fmtDate(e.createdAt)} · <StatusPill status={e.status} />
          </p>
        </div>
        <div className="actions">
          <a className="b b-primary" href={`mailto:${e.email}?subject=${encodeURIComponent('BridgePath — your enquiry')}`}>
            Email
          </a>
          {wa && (
            <a className="b b-ghost" href={`https://wa.me/${digits(wa)}`} target="_blank" rel="noopener">
              WhatsApp
            </a>
          )}
          {tg && (
            <a className="b b-ghost" href={`https://t.me/${tg}`} target="_blank" rel="noopener">
              Telegram
            </a>
          )}
          <a className="b b-ghost" href={`tel:${e.phone.replace(/\s/g, '')}`}>
            Call
          </a>
        </div>
      </div>

      <div className="detail">
        <div>
          <div className="card">
            <h2>Enquiry</h2>
            <p className="hint">As submitted, in English. The family wrote in {({ hy: 'Armenian', ru: 'Russian', en: 'English' } as Record<string, string>)[e.lang] ?? e.lang}.</p>
            <dl className="kv">
              {enquiryRows(e, 'en').map(([k, v]) => (
                <div key={k} style={{ display: 'contents' }}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="card">
            <h2>Context</h2>
            <dl className="kv">
              <dt>Page language</dt>
              <dd>{e.lang.toUpperCase()}</dd>
              <dt>Submitted from</dt>
              <dd>{e.page || '—'}</dd>
              <dt>Referrer</dt>
              <dd>{e.referrer || '—'}</dd>
              <dt>Arrived via</dt>
              <dd>{e.serviceParam ? `?service=${e.serviceParam}` : '—'}</dd>
              <dt>Consent</dt>
              <dd>
                Version {e.consentVersion}, {fmtDate(e.consentAt)}
              </dd>
            </dl>
          </div>
        </div>

        <div>
          <div className="card">
            <h2>Status</h2>
            <form action={setEnquiryStatus} className="actions" style={{ marginTop: 12 }}>
              <input type="hidden" name="id" value={e.id} />
              <AutoSubmitSelect key={e.status} className="in" name="status" defaultValue={e.status} aria-label="Status">
                {STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </AutoSubmitSelect>
              <noscript>
                <button className="b b-navy b-sm">Save</button>
              </noscript>
            </form>
          </div>

          <div className="card">
            <h2>Notes</h2>
            <p className="hint">Internal only — never shown to the family.</p>
            <ActionForm action={addEnquiryNote} resetOnSuccess className="grid">
              <input type="hidden" name="id" value={e.id} />
              <textarea className="in" name="body" rows={3} placeholder="e.g. Called the parent, consultation booked for Thursday." aria-label="New note" />
              <div>
                <SubmitButton className="b b-navy b-sm">Add note</SubmitButton>
              </div>
            </ActionForm>
            <div style={{ marginTop: 8 }}>
              {e.notes.map((n) => (
                <div key={n.id} className="note">
                  <div className="meta">
                    <span>
                      {n.author} · {fmtDate(n.createdAt)}
                    </span>
                    <form action={deleteEnquiryNote}>
                      <input type="hidden" name="id" value={n.id} />
                      <ConfirmButton label="Delete" confirmLabel="Confirm" className="b b-danger b-sm" />
                    </form>
                  </div>
                  <p>{n.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card danger-zone">
            <h2>Delete enquiry</h2>
            <p className="hint">Use for privacy requests. This permanently removes the enquiry and its notes.</p>
            <form action={deleteEnquiry} className="grid">
              <input type="hidden" name="id" value={e.id} />
              <label className="chk">
                <input type="checkbox" name="confirm" required /> I understand this cannot be undone
              </label>
              <div>
                <button type="submit" className="b b-danger">
                  Delete permanently
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
