'use client';

import { useState } from 'react';
import type { Dict } from '@/content';

export default function FaqList({ f }: { f: Dict['faq'] }) {
  const allKeys = f.groups.flatMap((g) => g.items.map((_, i) => `${g.id}-${i}`));
  const [open, setOpen] = useState<Record<string, boolean>>({ [`${f.groups[0]?.id}-0`]: true });
  const allOpen = allKeys.every((k) => open[k]);

  return (
    <div className="side-layout">
      <nav className="side-nav" aria-label={f.topics}>
        <span className="eyebrow">{f.topics}</span>
        <div className="side-nav__list">
          {f.groups.map((g) => (
            <a key={g.id} href={`#${g.id}`}>
              <span>{g.name}</span>
              <span className="mono">{String(g.items.length).padStart(2, '0')}</span>
            </a>
          ))}
        </div>
        <button type="button" className="link-btn" onClick={() => setOpen(Object.fromEntries(allKeys.map((k) => [k, !allOpen])))}>
          {allOpen ? f.collapseAll : f.expandAll}
        </button>
      </nav>
      <div className="stack" style={{ gap: 72, minWidth: 0 }}>
        {f.groups.map((g, gi) => (
          <div key={g.id} id={g.id} className="stack" style={{ gap: 8, scrollMarginTop: 100 }}>
            <div className="faq-group-head">
              <span className="numeral">{'0' + (gi + 1)}</span>
              <h2>{g.name}</h2>
            </div>
            <div className="faq-items">
              {g.items.map((it, i) => {
                const key = `${g.id}-${i}`;
                const on = !!open[key];
                return (
                  <div key={key} className="faq-item">
                    <h3 style={{ margin: 0 }}>
                      <button
                        type="button"
                        className="faq-q"
                        aria-expanded={on}
                        aria-controls={`a-${key}`}
                        id={`q-${key}`}
                        onClick={() => setOpen((s) => ({ ...s, [key]: !s[key] }))}
                      >
                        <span>{it.q}</span>
                        <span className="pm" aria-hidden="true">
                          {on ? '−' : '+'}
                        </span>
                      </button>
                    </h3>
                    <div id={`a-${key}`} role="region" aria-labelledby={`q-${key}`} hidden={!on}>
                      <p className="faq-a">{it.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
