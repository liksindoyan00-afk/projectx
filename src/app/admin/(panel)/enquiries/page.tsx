import Link from 'next/link';
import { prisma } from '@/lib/db';
import { COUNTRIES, labelFor, LEVELS, ROLES, SERVICES, STATUSES, YEARS } from '@/lib/enquiry-options';
import { enquiryWhere, type EnquiryFilters } from '../../enquiry-query';
import { ago, fmtDate, StatusPill } from '../../format';

const PER_PAGE = 25;

export default async function Enquiries({ searchParams }: { searchParams: Promise<EnquiryFilters & { page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const where = enquiryWhere(sp);
  const [rows, total, counts] = await Promise.all([
    prisma.enquiry.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * PER_PAGE, take: PER_PAGE, include: { _count: { select: { notes: true } } } }),
    prisma.enquiry.count({ where }),
    prisma.enquiry.groupBy({ by: ['status'], _count: true }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const qs = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { ...sp, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, String(v));
    const s = p.toString();
    return s ? `?${s}` : '';
  };
  const allCount = counts.filter((c) => c.status !== 'SPAM').reduce((a, c) => a + c._count, 0);
  const exportQs = qs({ page: undefined });

  return (
    <>
      <div className="a-top">
        <div>
          <h1>Enquiries</h1>
          <p>Everything sent through the contact form, newest first.</p>
        </div>
        <a href={`/admin/enquiries-export${exportQs}`} className="b b-ghost">
          Export CSV
        </a>
      </div>

      <nav className="tabs" aria-label="Status">
        <Link href={`/admin/enquiries${qs({ status: undefined, page: undefined })}`} aria-current={!sp.status ? 'true' : undefined}>
          All<span className="n">{allCount}</span>
        </Link>
        {STATUSES.map((s) => (
          <Link key={s.key} href={`/admin/enquiries${qs({ status: s.key, page: undefined })}`} aria-current={sp.status === s.key ? 'true' : undefined}>
            {s.label}
            <span className="n">{counts.find((c) => c.status === s.key)?._count ?? 0}</span>
          </Link>
        ))}
      </nav>

      <form className="filters" method="get">
        {sp.status && <input type="hidden" name="status" value={sp.status} />}
        <label className="f">
          <span>Search</span>
          <input className="in" type="search" name="q" defaultValue={sp.q} placeholder="Name, email, phone, university…" style={{ minWidth: 260 }} />
        </label>
        <label className="f">
          <span>Service</span>
          <select className="in" name="service" defaultValue={sp.service ?? ''}>
            <option value="">Any</option>
            {SERVICES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label.en}
              </option>
            ))}
          </select>
        </label>
        <label className="f">
          <span>Language</span>
          <select className="in" name="lang" defaultValue={sp.lang ?? ''}>
            <option value="">Any</option>
            <option value="hy">Armenian</option>
            <option value="ru">Russian</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="f">
          <span>From</span>
          <input className="in" type="date" name="from" defaultValue={sp.from} />
        </label>
        <label className="f">
          <span>To</span>
          <input className="in" type="date" name="to" defaultValue={sp.to} />
        </label>
        <button className="b b-navy" type="submit">
          Filter
        </button>
        {(sp.q || sp.service || sp.lang || sp.from || sp.to) && (
          <Link className="b b-ghost" href={`/admin/enquiries${sp.status ? `?status=${sp.status}` : ''}`}>
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <div className="empty">No enquiries match these filters.</div>
      ) : (
        <div className="table-wrap">
          <table className="t">
            <thead>
              <tr>
                <th>Received</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Plans</th>
                <th>Service</th>
                <th>Lang</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className={e.status === 'NEW' ? 'is-new' : undefined}>
                  <td className="nowrap">
                    <div>{ago(e.createdAt)}</div>
                    <div className="sub">{fmtDate(e.createdAt)}</div>
                  </td>
                  <td>
                    <Link className="name" href={`/admin/enquiries/${e.id}`}>
                      {e.fullName}
                    </Link>
                    <div className="sub">
                      {labelFor(ROLES, e.role)}
                      {e._count.notes > 0 && ` · ${e._count.notes} note${e._count.notes > 1 ? 's' : ''}`}
                    </div>
                  </td>
                  <td>
                    <div>
                      <a href={`mailto:${e.email}`}>{e.email}</a>
                    </div>
                    <div className="sub">{e.phone}</div>
                  </td>
                  <td>
                    <div>
                      {labelFor(LEVELS, e.level)} · {labelFor(YEARS, e.startYear)}
                    </div>
                    <div className="sub">{e.countries.map((c) => labelFor(COUNTRIES, c)).join(', ')}</div>
                  </td>
                  <td>{labelFor(SERVICES, e.service)}</td>
                  <td>{e.lang.toUpperCase()}</td>
                  <td>
                    <StatusPill status={e.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pager">
        <span>
          {total} enquir{total === 1 ? 'y' : 'ies'} · page {page} of {pages}
        </span>
        <span className="actions">
          {page > 1 && (
            <Link className="b b-ghost b-sm" href={`/admin/enquiries${qs({ page: String(page - 1) })}`}>
              ← Newer
            </Link>
          )}
          {page < pages && (
            <Link className="b b-ghost b-sm" href={`/admin/enquiries${qs({ page: String(page + 1) })}`}>
              Older →
            </Link>
          )}
        </span>
      </div>
    </>
  );
}
