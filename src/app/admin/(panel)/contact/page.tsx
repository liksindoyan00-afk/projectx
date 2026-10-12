import { prisma } from '@/lib/db';
import { resolveContact } from '@/lib/contact';
import { saveContact } from '../../actions';
import { ActionForm, SubmitButton } from '../../ui';

const FIELDS = [
  { name: 'email', label: 'Email', hint: 'e.g. hello@bridgepath.am', type: 'email' },
  { name: 'phone', label: 'Mobile (calls)', hint: 'With country code, e.g. +374 91 123456', type: 'tel' },
  { name: 'whatsapp', label: 'WhatsApp number', hint: 'With country code. Used by every WhatsApp button on the site', type: 'tel' },
  { name: 'telegram', label: 'Telegram', hint: '@username or t.me link', type: 'text' },
  { name: 'instagram', label: 'Instagram', hint: '@handle or profile link', type: 'text' },
  { name: 'linkedin', label: 'LinkedIn', hint: 'Full profile or company page link', type: 'text' },
] as const;

export default async function ContactSettingsPage() {
  const row = await prisma.contactSettings.findUnique({ where: { id: 1 } });
  const v = row ?? { email: '', phone: '', telegram: '', whatsapp: '', instagram: '', linkedin: '', replyDays: '2' };
  const preview = row ? resolveContact(row) : null;
  return (
    <>
      <div className="a-top">
        <div>
          <h1>Contact details</h1>
          <p>Shown in the footer, on the Contact page, on WhatsApp buttons and in emails to families. Leave a field empty to hide it.</p>
        </div>
      </div>
      {!row && (
        <div className="msg err" style={{ marginBottom: 20 }}>
          Not set yet — the site is showing placeholders like [email] and [WhatsApp]. Fill in the details below and save.
        </div>
      )}
      <ActionForm action={saveContact}>
        <div className="detail">
          <div className="card">
            <h2>Channels</h2>
            <p className="hint">Type them the way you want them to appear; links are built automatically.</p>
            <div className="grid cols-2">
              {FIELDS.map((f) => (
                <label key={f.name} className="f">
                  <span>
                    {f.label} <small>· {f.hint}</small>
                  </span>
                  <input className="in" name={f.name} type={f.type} defaultValue={v[f.name]} autoComplete="off" />
                </label>
              ))}
            </div>
            <div className="grid cols-3" style={{ marginTop: 16 }}>
              <label className="f">
                <span>
                  Reply time, working days <small>· “We reply within … working days”</small>
                </span>
                <input className="in" name="replyDays" defaultValue={v.replyDays} required placeholder="2" />
              </label>
            </div>
          </div>
          <div style={{ position: 'sticky', top: 24 }}>
            <div className="card">
              <h2>On the site now</h2>
              {preview ? (
                <dl className="kv">
                  {(['email', 'phone', 'whatsapp', 'telegram', 'instagram', 'linkedin'] as const).map((k) => (
                    <div key={k} style={{ display: 'contents' }}>
                      <dt>{k[0].toUpperCase() + k.slice(1)}</dt>
                      <dd>
                        {preview[k] ? (
                          <a href={preview[k]!.href} target="_blank" rel="noopener">
                            {preview[k]!.label}
                          </a>
                        ) : (
                          <span style={{ color: 'var(--muted)' }}>hidden</span>
                        )}
                      </dd>
                    </div>
                  ))}
                  <dt>Reply time</dt>
                  <dd>{preview.replyDays} working days</dd>
                </dl>
              ) : (
                <p className="hint">Placeholders from the design.</p>
              )}
            </div>
            <div className="card">
              <div className="grid">
                <SubmitButton>Save and publish</SubmitButton>
              </div>
            </div>
          </div>
        </div>
      </ActionForm>
    </>
  );
}
