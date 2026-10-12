'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LANG_COOKIE, LOCALES, localePath, PAGES, type Lang, type PageKey } from '@/lib/i18n';
import { STAR_PATH } from './icons';

const NAV_KEYS = ['services', 'process', 'results', 'about', 'faq', 'contact'] as const;

type Props = {
  lang: Lang;
  page?: PageKey; // current page, for aria-current and the language switcher
  solid?: boolean; // navy background even when expanded (Contact)
  labels: {
    nav: Record<(typeof NAV_KEYS)[number], string>;
    home: string;
    enquire: string;
    menu: string;
    close: string;
    language: string;
    where: string;
  };
};

function rememberLang(l: Lang) {
  // Remember the choice only after an explicit click (no auto-redirects).
  document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
}

export default function SiteHeader({ lang, page, solid, labels }: Props) {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => menuBtn.current?.focus());
  }, []);

  // Modal behaviour: focus trap, Esc, scroll lock, close when resized to desktop.
  useEffect(() => {
    if (!open) return;
    const el = dialog.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = () =>
      Array.from(el?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []).filter((n) => n.offsetParent !== null);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'Tab') {
        const f = focusables();
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const mq = window.matchMedia(lang === 'hy' ? '(min-width: 1180px)' : '(min-width: 1100px)');
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open, close, lang]);

  const pagePath = page ? PAGES[page] : '/';
  const enquireHref = localePath(lang, PAGES.contact) + '#enquiry';
  const nav = NAV_KEYS.map((k, i) => ({
    key: k,
    label: labels.nav[k],
    href: localePath(lang, PAGES[k]),
    num: '0' + (i + 1),
    current: page === k,
  }));
  const langs = LOCALES.map((l) => ({ code: l, href: localePath(l, pagePath), on: l === lang }));

  const cls = ['site-header', 'on-navy', compact && 'is-compact', solid && 'is-solid', open && 'menu-open'].filter(Boolean).join(' ');

  return (
    <header className={cls}>
      <div className="site-header__bar">
        <a href={localePath(lang, '/')} className="logo-link" aria-label={labels.home}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo" src="/bridgepath-logo-reversed.svg" alt="BridgePath" width={121} height={64} />
        </a>
        <div className="desktop-only">
          <nav className="site-nav" aria-label="Main">
            {nav.map((n) => (
              <a key={n.key} href={n.href} aria-current={n.current ? 'page' : undefined}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="header-tools">
            <div className="lang-switch" role="group" aria-label={labels.language}>
              {langs.map((l) => (
                <a key={l.code} href={l.href} hrefLang={l.code} lang={l.code} aria-current={l.on ? 'true' : undefined} onClick={() => rememberLang(l.code)}>
                  {l.code.toUpperCase()}
                </a>
              ))}
            </div>
            <a href={enquireHref} className="header-enquire">
              {labels.enquire}
            </a>
          </div>
        </div>
        <button ref={menuBtn} type="button" className="menu-btn" aria-label={labels.menu} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div ref={dialog} id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label={labels.menu}>
          <svg className="arc" viewBox="0 0 400 800" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
            <path d="M-60 860 A 520 520 0 0 1 380 300" fill="none" stroke="#B99A5A" strokeOpacity="0.3" strokeWidth="1" />
            <path transform="translate(368 284) scale(0.8)" d={STAR_PATH} fill="#B99A5A" />
          </svg>
          <div className="mobile-menu__top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bridgepath-logo-reversed.svg" alt="BridgePath" style={{ height: 40, width: 'auto' }} />
            <button type="button" className="close-btn" aria-label={labels.close} onClick={close}>
              <span />
              <span />
            </button>
          </div>
          <nav aria-label="Main">
            {nav.map((n) => (
              <a key={n.key} href={n.href} aria-current={n.current ? 'page' : undefined} onClick={() => setOpen(false)}>
                <span className="mono">{n.num}</span>
                <span className="label">{n.label}</span>
              </a>
            ))}
          </nav>
          <div className="mobile-menu__foot">
            <div className="lang-chips" role="group" aria-label={labels.language}>
              {langs.map((l) => (
                <a key={l.code} href={l.href} hrefLang={l.code} lang={l.code} aria-current={l.on ? 'true' : undefined} onClick={() => rememberLang(l.code)}>
                  {l.code.toUpperCase()}
                </a>
              ))}
            </div>
            <a href={enquireHref} className="btn btn--primary on-dark" onClick={() => setOpen(false)}>
              {labels.enquire}
            </a>
            <span className="mobile-menu__where">{labels.where}</span>
          </div>
        </div>
      )}
    </header>
  );
}
