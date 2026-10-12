'use client';

import { useState } from 'react';
import type { Dict } from '@/content';

type P = Dict['process'];

export default function Timeline({ p }: { p: P }) {
  const [sel, setSel] = useState(0); // desktop: always one selected
  const [openM, setOpenM] = useState<number>(0); // mobile accordion (-1 = none)
  const cur = p.stages[sel] ?? p.stages[0];
  const num = (i: number) => '0' + (i + 1);

  return (
    <>
      {/* ≥900px: 14-week ruler */}
      <div className="timeline">
        <div className="ruler">
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} className="ruler__week" style={{ gridColumn: i + 1 }} aria-hidden="true">
              {p.weekShort}
              {i + 1}
            </span>
          ))}
          {p.stages.map((s, i) => {
            const right = s.from > 7;
            return (
              <button
                key={i}
                type="button"
                className={`stage-btn${s.optional ? ' optional' : ''}`}
                style={{ gridRow: i + 2 }}
                aria-pressed={sel === i}
                aria-controls="stage-panel"
                onClick={() => setSel(i)}
              >
                <span
                  className="stage-btn__label"
                  style={{ justifyContent: right ? 'flex-end' : 'flex-start', paddingLeft: right ? 0 : `${((s.from - 1) / 14) * 100}%` }}
                >
                  <span className="numeral">{num(i)}</span>
                  <span className="t">{s.title}</span>
                  <span className="w">{s.weeks}</span>
                  {s.optional && <span className="tag-opt">{p.optional}</span>}
                </span>
                <span className="band" style={{ width: `${((s.to - s.from + 1) / 14) * 100}%`, marginLeft: `${((s.from - 1) / 14) * 100}%` }} />
              </button>
            );
          })}
        </div>
        <div id="stage-panel" className="stage-panel" aria-live="polite">
          <div>
            <span className="eyebrow">
              {p.stage} {num(sel)} · {cur.weeks}
            </span>
            <h2>{cur.title}</h2>
            {cur.optional && <span className="tag-opt">{p.optionalScope}</span>}
          </div>
          <div>
            <span className="k">{p.happens}</span>
            <p className="body">{cur.happens}</p>
          </div>
          <div>
            <span className="k">{p.receives}</span>
            <p className="body">{cur.receives}</p>
          </div>
        </div>
      </div>

      {/* <900px: vertical list with gold rail */}
      <div className="timeline-v">
        {p.stages.map((s, i) => {
          const on = openM === i;
          return (
            <div key={i} className={`tl-item${s.optional ? ' optional' : ''}`}>
              <div className="tl-rail" aria-hidden="true">
                <span className="tl-dot" />
                <span className="tl-line" />
              </div>
              <div className="tl-body">
                <button type="button" className="tl-btn" aria-expanded={on} aria-controls={`tl-panel-${i}`} onClick={() => setOpenM(on ? -1 : i)}>
                  <span className="stack" style={{ gap: 6 }}>
                    <span className="w">
                      {s.weeks}
                      {s.optional ? ` · ${p.optional}` : ''}
                    </span>
                    <span className="t">{s.title}</span>
                  </span>
                  <span className="pm" aria-hidden="true">
                    {on ? '−' : '+'}
                  </span>
                </button>
                {on && (
                  <div id={`tl-panel-${i}`} className="tl-panel">
                    <div>
                      <span className="k">{p.happens}</span>
                      <p>{s.happens}</p>
                    </div>
                    <div>
                      <span className="k">{p.receives}</span>
                      <p className="recv">{s.receives}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
