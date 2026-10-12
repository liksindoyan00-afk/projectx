'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/enquiries', label: 'Enquiries', badge: true },
  { href: '/admin/stats', label: 'Statistics' },
  { href: '/admin/universities', label: 'Universities' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/account', label: 'Account & team' },
];

export default function AdminNav({ newCount }: { newCount: number }) {
  const path = usePathname();
  return (
    <nav className="a-nav" aria-label="Admin">
      {ITEMS.map((it) => {
        const on = it.exact ? path === it.href : path.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} aria-current={on ? 'page' : undefined}>
            {it.label}
            {it.badge && newCount > 0 && <span className="count">{newCount}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
