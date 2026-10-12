import Link from 'next/link';
import { prisma } from '@/lib/db';
import { labelFor, SERVICES, STATUSES } from '@/lib/enquiry-options';
import { ago, StatusPill } from '../format';

export default async function Dashboard() {
  const now = Date.now();
  const d7 = new Date(now - 7 * 864e5);
  const d30 = new Date(now - 30 * 864e5);
  const [byStatus, last7, last30, total, latest, byService, byLang, stats] = await Promise.all([
    prisma.enquiry.groupBy({ by: ['status'], _count: true }),
    prisma.enquiry.count({ where: { createdAt: { gte: d7 }, status: { not: 'SPAM' } } }),
    prisma.enquiry.count({ where: { createdAt: { gte: d30 }, status: { not: 'SPAM' } } }),
    prisma.enquiry.count({ where: { status: { not: 'SPAM' } } }),
    prisma.enquiry.findMany({ where: { status: 'NEW' }, orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.enquiry.groupBy({ by: ['service'], _count: true, where: { createdAt: { gte: d30 }, status: { not: 'SPAM' } } }),
    prisma.enquiry.groupBy({ by: ['lang'], _count: true, where: { createdAt: { gte: d30 }, status: { not: 'SPAM' } } }),
    prisma.siteStats.findUnique({ where: { id: 1 } }),
  ]);
  const count = (k: string) => byStatus.find((b) => b.status === k)?._count ?? 0;

  return (
    <>
      <div className="a-top">
        <div>
          <h1>Dashboard</h1>
          <p>Enquiries from the website and the figures shown on it.</p>
        </div>
        <Link href="/admin/enquiries?status=NEW" className="b b-navy">
          Review new enquiries
        </Link>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <Link href="/admin/enquiries?status=NEW" className="kpi gold">
          <span className="k">New · waiting for reply</span>
          <span className="v">{count('NEW')}</span>
        </Link>
        <div className="kpi">
          <span className="k">Last 7 days</span>
          <span className="v">{last7}</span>
        </div>
        <div className="kpi">
          <span className="k">Last 30 days</span>
          <span className="v">{last30}</span>
        </div>
        <Link href="/admin/enquiries?status=CLIENT" className="kpi">
          <span className="k">Became clients</span>
          <span className="v">
            {count('CLIENT')}
            <small style={{ fontSize: 14, color: 'var(--muted)', marginLeft: 8 }}>of {total}</small>
          </span>
        </Link>
      </div>

      <div className="detail">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '20px 24px 8px' }}>
            <h2>New enquiries</h2>
          </div>
          {latest.length === 0 ? (
            <p className="hint" style={{ padding: '0 24px 16px' }}>
              Nothing waiting. New enquiries from the contact form appear here.
            </p>
          ) : (
            <table className="t">
              <tbody>
                {latest.map((e) => (
                  <tr key={e.id} className="is-new">
                    <td>
                      <Link className="name" href={`/admin/enquiries/${e.id}`}>
                        {e.fullName}
                      </Link>
                      <div className="sub">{labelFor(SERVICES, e.service, 'en')}</div>
                    </td>
                    <td className="sub">{e.lang.toUpperCase()}</td>
                    <td className="sub nowrap">{ago(e.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div>
          <div className="card">
            <h2>Pipeline</h2>
            <div className="stack" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {STATUSES.map((s) => (
                <Link key={s.key} href={`/admin/enquiries?status=${s.key}`} style={{ display: 'flex', justifyContent: 'space-between', textDecoration: 'none' }}>
                  <StatusPill status={s.key} />
                  <b>{count(s.key)}</b>
                </Link>
              ))}
            </div>
          </div>
          <div className="card">
            <h2>Last 30 days</h2>
            <p className="hint">By service and page language</p>
            {SERVICES.map((s) => (
              <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>{s.label.en}</span>
                <b>{byService.find((b) => b.service === s.key)?._count ?? 0}</b>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 16, marginTop: 10, color: 'var(--muted)', fontSize: 13 }}>
              {['hy', 'ru', 'en'].map((l) => (
                <span key={l}>
                  {l.toUpperCase()}: <b style={{ color: 'var(--navy-700)' }}>{byLang.find((b) => b.lang === l)?._count ?? 0}</b>
                </span>
              ))}
            </div>
          </div>
          <div className="card">
            <h2>On the website</h2>
            <p className="hint">Headline result: {stats ? `${stats.admittedCount} of ${stats.totalCount}` : '18 of 20 (default)'}</p>
            <Link href="/admin/stats" className="b b-ghost b-sm">
              Edit statistics
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
