import { prisma } from '@/lib/db';
import { TESTIMONIAL_LEVELS } from '@/lib/enquiry-options';
import { deleteTestimonial, saveTestimonial } from '../../actions';
import { ActionForm, ConfirmButton, SubmitButton } from '../../ui';

type T = {
  id?: string;
  quoteHy: string;
  quoteRu: string;
  quoteEn: string;
  authorHy: string;
  authorRu: string;
  authorEn: string;
  university: string;
  level: string;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
};

function Fields({ t }: { t: T }) {
  return (
    <div className="grid">
      {t.id && <input type="hidden" name="id" value={t.id} />}
      <div className="grid cols-3">
        {(['Hy', 'Ru', 'En'] as const).map((l) => (
          <label key={l} className="f">
            <span>
              <span className="lang-tag">{l.toUpperCase()}</span>Quote
            </span>
            <textarea className="in" name={`quote${l}`} rows={5} defaultValue={t[`quote${l}`]} />
          </label>
        ))}
      </div>
      <div className="grid cols-3">
        {(['Hy', 'Ru', 'En'] as const).map((l) => (
          <label key={l} className="f">
            <span>
              <span className="lang-tag">{l.toUpperCase()}</span>First name
            </span>
            <input className="in" name={`author${l}`} defaultValue={t[`author${l}`]} />
          </label>
        ))}
      </div>
      <div className="grid cols-4" style={{ alignItems: 'end' }}>
        <label className="f">
          <span>University</span>
          <input className="in" name="university" defaultValue={t.university} required />
        </label>
        <label className="f">
          <span>Level</span>
          <select className="in" name="level" defaultValue={t.level}>
            {TESTIMONIAL_LEVELS.map((x) => (
              <option key={x.key} value={x.key}>
                {x.label.en}
              </option>
            ))}
          </select>
        </label>
        <label className="f">
          <span>Order</span>
          <input className="in" type="number" name="sortOrder" defaultValue={t.sortOrder} />
        </label>
        <div className="grid" style={{ gap: 6 }}>
          <label className="chk">
            <input type="checkbox" name="visible" defaultChecked={t.visible} /> Visible on site
          </label>
          <label className="chk">
            <input type="checkbox" name="featured" defaultChecked={t.featured} /> Featured
          </label>
        </div>
      </div>
      <div>
        <SubmitButton className={t.id ? 'b b-navy' : 'b b-primary'}>{t.id ? 'Save changes' : 'Add testimonial'}</SubmitButton>
      </div>
    </div>
  );
}

export default async function Testimonials() {
  const list = await prisma.testimonial.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  const visible = list.filter((t) => t.visible).length;
  return (
    <>
      <div className="a-top">
        <div>
          <h1>Testimonials</h1>
          <p>
            Shown on Results (“In their words”). The <b>featured</b> one is also the quote on Home and gets the navy card. {visible} visible.
          </p>
        </div>
      </div>
      <div className="msg ok" style={{ marginBottom: 20, background: '#fff', color: 'var(--ink)', borderColor: 'var(--rule)' }}>
        Publish only with the family’s written consent. Best layout: 3, 4 or 5 visible testimonials. Until one is added, the site shows design placeholders.
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <details className="edit">
          <summary>
            <h2 style={{ display: 'inline' }}>+ Add a testimonial</h2>
          </summary>
          <div style={{ marginTop: 16 }}>
            <ActionForm action={saveTestimonial} resetOnSuccess className="grid">
              <Fields
                t={{ quoteHy: '', quoteRu: '', quoteEn: '', authorHy: '', authorRu: '', authorEn: '', university: '', level: 'bachelor', featured: list.length === 0, visible: true, sortOrder: list.length + 1 }}
              />
            </ActionForm>
          </div>
        </details>
      </div>
      {list.map((t) => (
        <div key={t.id} className="list-item" style={{ opacity: t.visible ? 1 : 0.65 }}>
          <details className="edit">
            <summary style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <span>
                <b style={{ color: 'var(--navy-700)' }}>{t.authorEn}</b> · {t.university}
                {t.featured && <span className="pill gold" style={{ marginLeft: 8 }}>Featured</span>}
                {!t.visible && <span className="pill muted" style={{ marginLeft: 8 }}>Hidden</span>}
                <div style={{ color: 'var(--muted)', marginTop: 4, fontStyle: 'italic' }}>“{t.quoteEn.slice(0, 140)}{t.quoteEn.length > 140 ? '…' : ''}”</div>
              </span>
              <span className="b b-ghost b-sm">Edit</span>
            </summary>
            <div style={{ marginTop: 16 }}>
              <ActionForm action={saveTestimonial} className="grid">
                <Fields t={t} />
              </ActionForm>
              <form action={deleteTestimonial} style={{ marginTop: 10 }}>
                <input type="hidden" name="id" value={t.id} />
                <ConfirmButton label="Delete testimonial" />
              </form>
            </div>
          </details>
        </div>
      ))}
    </>
  );
}
