import { prisma } from '@/lib/db';
import { deleteUniversity, saveUniversity } from '../../actions';
import { ActionForm, ConfirmButton, SubmitButton } from '../../ui';

type Uni = { id?: string; name: string; countryHy: string; countryRu: string; countryEn: string; sortOrder: number; visible: boolean; showOnHome: boolean };

function UniFields({ u }: { u: Uni }) {
  return (
    <div className="row-form">
      {u.id && <input type="hidden" name="id" value={u.id} />}
      <label className="f">
        <span>University name</span>
        <input className="in" name="name" defaultValue={u.name} required placeholder="e.g. Columbia" />
      </label>
      <label className="f">
        <span>
          <span className="lang-tag">EN</span>Country
        </span>
        <input className="in" name="countryEn" defaultValue={u.countryEn} required placeholder="United States" />
      </label>
      <label className="f">
        <span>
          <span className="lang-tag">RU</span>Country
        </span>
        <input className="in" name="countryRu" defaultValue={u.countryRu} placeholder="США" />
      </label>
      <label className="f">
        <span>
          <span className="lang-tag">HY</span>Country
        </span>
        <input className="in" name="countryHy" defaultValue={u.countryHy} placeholder="ԱՄՆ" />
      </label>
      <label className="f">
        <span>Order</span>
        <input className="in" type="number" name="sortOrder" defaultValue={u.sortOrder} />
      </label>
      <label className="chk">
        <input type="checkbox" name="visible" defaultChecked={u.visible} /> Visible
      </label>
      <label className="chk">
        <input type="checkbox" name="showOnHome" defaultChecked={u.showOnHome} /> On Home
      </label>
      <SubmitButton className={u.id ? 'b b-navy b-sm' : 'b b-primary'}>{u.id ? 'Save' : 'Add'}</SubmitButton>
    </div>
  );
}

export default async function Universities() {
  const list = await prisma.university.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  return (
    <>
      <div className="a-top">
        <div>
          <h1>Universities</h1>
          <p>“Where they went” on Results, and the list on Home (tick “On Home”). Names appear as plain text — never logos.</p>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <h2>Add a university</h2>
        <p className="hint">Country in English is required; Russian and Armenian fall back to English if left empty.</p>
        <ActionForm action={saveUniversity} resetOnSuccess className="grid">
          <UniFields u={{ name: '', countryEn: '', countryRu: '', countryHy: '', sortOrder: (list.at(-1)?.sortOrder ?? 0) + 1, visible: true, showOnHome: true }} />
        </ActionForm>
      </div>
      {list.length === 0 && <div className="empty">No universities yet. The site shows the default list until you add one.</div>}
      {list.map((u) => (
        <div key={u.id} className="list-item" style={{ opacity: u.visible ? 1 : 0.65 }}>
          <ActionForm action={saveUniversity} className="grid">
            <UniFields u={u} />
          </ActionForm>
          <form action={deleteUniversity} style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={u.id} />
            <ConfirmButton label="Remove" />
          </form>
        </div>
      ))}
    </>
  );
}
