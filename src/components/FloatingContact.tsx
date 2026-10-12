'use client';

import { useEffect, useState } from 'react';
import { ChatIcon } from './icons';

/** Desktop/tablet: floating WhatsApp pill. Mobile (<768px): sticky Enquire + WhatsApp bar after 480px scroll. */
export default function FloatingContact({
  waHref,
  waLabel,
  enquireHref,
  enquireLabel,
  hideBar,
}: {
  waHref: string;
  waLabel: string;
  enquireHref: string;
  enquireLabel: string;
  hideBar?: boolean;
}) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a className="wa-float on-navy" href={waHref} target="_blank" rel="noopener" aria-label={waLabel}>
        <ChatIcon size={22} color="#C9AB6E" />
        <span className="wa-float__label">{waLabel}</span>
      </a>
      {!hideBar && (
        <>
          <div className="sticky-spacer enabled" />
          <div className={`sticky-bar on-navy${hideBar ? '' : ' enabled'}${shown ? ' shown' : ''}`} role="region" aria-label={enquireLabel}>
            <a href={enquireHref} className="btn btn--primary on-dark" tabIndex={shown ? 0 : -1}>
              {enquireLabel}
            </a>
            <a href={waHref} target="_blank" rel="noopener" className="sticky-bar__wa" aria-label={waLabel} tabIndex={shown ? 0 : -1}>
              <ChatIcon size={22} color="#C9AB6E" />
            </a>
          </div>
        </>
      )}
    </>
  );
}
