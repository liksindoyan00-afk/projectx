import { SITE } from '@/content/site';
import type { Dict } from '@/content';
import { localePath, PAGES, type Lang } from '@/lib/i18n';
import { ChatIcon, InstagramIcon, MailIcon, StarRule, TelegramIcon } from './icons';
import FloatingContact from './FloatingContact';

const NAV_KEYS = ['services', 'process', 'results', 'about', 'faq', 'contact'] as const;

export default function SiteFooter({ lang, t, hideBar }: { lang: Lang; t: Dict; hideBar?: boolean }) {
  const enquireHref = localePath(lang, PAGES.contact) + '#enquiry';
  return (
    <footer className="site-footer on-navy">
      <svg className="arc" viewBox="0 0 1200 520" preserveAspectRatio="xMinYMax slice" aria-hidden="true">
        <path d="M-120 620 A 640 640 0 0 1 520 40" fill="none" stroke="#B99A5A" strokeOpacity="0.18" strokeWidth="1" />
      </svg>
      <div className="site-footer__grid">
        <div className="footer-col" style={{ gap: 20, minWidth: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="footer-logo" src="/bridgepath-logo-reversed.svg" alt="BridgePath" width={136} height={72} />
          <p className="footer-tagline">{t.footer.tagline}</p>
        </div>
        <div className="footer-col">
          <span className="eyebrow">{t.footer.pages}</span>
          <nav className="footer-pages" aria-label={t.footer.pages}>
            {NAV_KEYS.map((k) => (
              <a key={k} href={localePath(lang, PAGES[k])}>
                {t.nav[k]}
              </a>
            ))}
          </nav>
        </div>
        <div className="footer-col">
          <span className="eyebrow">{t.footer.contact}</span>
          <div className="footer-contacts">
            <a href={SITE.emailHref}>
              <MailIcon />
              {SITE.email}
            </a>
            <a href={SITE.telegramHref} target="_blank" rel="noopener">
              <TelegramIcon />
              {SITE.telegram}
            </a>
            <a href={SITE.whatsappHref} target="_blank" rel="noopener">
              <ChatIcon />
              {SITE.whatsapp}
            </a>
          </div>
          <span className="footer-where">{t.footer.where}</span>
          <div className="socials">
            <a href={SITE.instagramHref} target="_blank" rel="noopener" aria-label="Instagram">
              <InstagramIcon color="#E6E1D6" />
            </a>
            <a href={SITE.linkedinHref} target="_blank" rel="noopener" aria-label="LinkedIn">
              in
            </a>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">
        <StarRule />
        <div className="site-footer__legal">
          <span>© BridgePath {new Date().getFullYear()}</span>
          <a href={localePath(lang, PAGES.privacy)}>{t.footer.privacy}</a>
        </div>
      </div>
      <FloatingContact waHref={SITE.whatsappHref} waLabel={t.footer.wa} enquireHref={enquireHref} enquireLabel={t.footer.enquire} hideBar={hideBar} />
    </footer>
  );
}
