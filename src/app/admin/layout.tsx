import type { Metadata } from 'next';
import { fontVars } from '../fonts';
import './admin.css';

export const metadata: Metadata = { title: 'BridgePath Admin', robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
