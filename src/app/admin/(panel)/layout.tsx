import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logout } from '../actions';
import AdminNav from './nav';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const s = await requireAdmin();
  const newCount = await prisma.enquiry.count({ where: { status: 'NEW' } }).catch(() => 0);
  return (
    <div className="a-shell">
      <aside className="a-side">
        <div className="a-side__logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bridgepath-logo-reversed.svg" alt="BridgePath" />
          <span>Admin</span>
        </div>
        <AdminNav newCount={newCount} />
        <div className="a-side__foot">
          <span>{s.name || s.email}</span>
          <a href="/" target="_blank" rel="noopener">
            View website ↗
          </a>
          <form action={logout}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="a-main">{children}</main>
    </div>
  );
}
