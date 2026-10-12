import type { Metadata } from 'next';
import { fmt, getDict } from '@/content';
import { getContact } from '@/lib/contact';
import { localePath, PAGES, type Lang } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import PageShell from '@/components/page-shell';
import EnquiryForm from '@/components/EnquiryForm';
import { ChatIcon, InstagramIcon, MailIcon, PhoneIcon, Star, STAR_PATH, TelegramIcon } from '@/components/icons';

type Params = { params: Promise<{ lang: Lang }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return pageMetadata((await params).lang, 'contact');
}

export default async function Contact({ params }: Params) {
  const { lang } = await params;
  const t = getDict(lang);
  const c = t.contact;
  const info = await getContact();
  const reply = fmt(c.reply, { days: info.replyDays });
  return (
    <PageShell lang={lang} t={t} page="contact" solidHeader hideBar>
      <section id="enquiry" className="bg-ivory" style={{ overflow: 'hidden', scrollMarginTop: 0 }}>
        <div style={{ position: 'absolute', top: 104, left: 0, width: '60%', height: 620, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden="true">
          <svg viewBox="0 0 700 620" preserveAspectRatio="xMinYMin slice" style={{ width: '100%', height: '100%' }}>
            <path d="M-120 700 A 560 560 0 0 1 400 70" fill="none" stroke="#B99A5A" strokeOpacity="0.4" strokeWidth="1" />
            <path transform="translate(388 56)" d={STAR_PATH} fill="#B99A5A" />
          </svg>
        </div>
        <div className="container contact-grid">
          <div className="contact-top">
            <span className="eyebrow">{c.eyebrow}</span>
            <h1>{c.title}</h1>
            <p className="lead" style={{ fontSize: 18 }}>
              {reply}
            </p>
          </div>

          <div className="form-card">
            <EnquiryForm
              lang={lang}
              f={t.form}
              replyDays={info.replyDays}
              replyNote={reply}
              whatsappHref={info.whatsappHref}
              privacyHref={localePath(lang, PAGES.privacy)}
            />
          </div>

          <div className="contact-list">
            {info.email && (
              <a href={info.email.href}>
                <MailIcon />
                <span className="k">{c.labels.email}</span>
                {info.email.label}
              </a>
            )}
            {info.phone && (
              <a href={info.phone.href}>
                <PhoneIcon />
                <span className="k">{c.labels.mobile}</span>
                <span>
                  {info.phone.label}
                  <span className="sub">{c.calls}</span>
                </span>
              </a>
            )}
            {info.telegram && (
              <a href={info.telegram.href} target="_blank" rel="noopener">
                <TelegramIcon />
                <span className="k">{c.labels.telegram}</span>
                {info.telegram.label}
              </a>
            )}
            {info.whatsapp && (
              <a href={info.whatsapp.href} target="_blank" rel="noopener">
                <ChatIcon />
                <span className="k">{c.labels.whatsapp}</span>
                {info.whatsapp.label}
              </a>
            )}
            {info.instagram && (
              <a href={info.instagram.href} target="_blank" rel="noopener">
                <InstagramIcon />
                <span className="k">{c.labels.instagram}</span>
                {info.instagram.label}
              </a>
            )}
            {info.linkedin && (
              <a href={info.linkedin.href} target="_blank" rel="noopener">
                <span className="li-box" aria-hidden="true">
                  in
                </span>
                <span className="k">{c.labels.linkedin}</span>
                {info.linkedin.label}
              </a>
            )}
          </div>

          <div className="contact-visit">
            <Star size={14} style={{ marginTop: 5 }} />
            <div className="stack" style={{ gap: 4 }}>
              <span className="t">{c.visit}</span>
              <span className="s">{c.visitSub}</span>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
