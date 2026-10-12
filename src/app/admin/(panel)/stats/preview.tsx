'use client';

import { useEffect, useState } from 'react';

/** Live preview that follows the two number inputs in the surrounding form. */
export default function StatsPreview({ initialA, initialT }: { initialA: number; initialT: number }) {
  const [a, setA] = useState(initialA);
  const [t, setT] = useState(initialT);
  useEffect(() => {
    const ai = document.querySelector<HTMLInputElement>('input[name="admittedCount"]');
    const ti = document.querySelector<HTMLInputElement>('input[name="totalCount"]');
    const on = () => {
      setA(Number(ai?.value) || 0);
      setT(Number(ti?.value) || 0);
    };
    ai?.addEventListener('input', on);
    ti?.addEventListener('input', on);
    return () => {
      ai?.removeEventListener('input', on);
      ti?.removeEventListener('input', on);
    };
  }, []);
  const n = Math.min(100, Math.max(0, t));
  return (
    <div className="preview">
      <span className="stat">
        {a} <i>of</i> {t}
      </span>
      <span style={{ fontFamily: 'var(--serif)', color: '#e6e1d6' }}>students admitted to at least one target university</span>
      <div className="dots" aria-hidden="true">
        {Array.from({ length: n }, (_, i) => (
          <span key={i} className={i < a ? 'on' : undefined} />
        ))}
      </div>
      {a > t && <span style={{ color: '#f2b8b0', fontSize: 13 }}>Admitted is larger than total.</span>}
    </div>
  );
}
