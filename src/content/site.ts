/**
 * Contact details and other site-wide settings.
 * Values in [brackets] are placeholders from the design handoff — replace before launch.
 */
export const SITE = {
  name: 'BridgePath',
  url: (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),

  email: '[email]',
  emailHref: 'mailto:hello@example.com',

  phone: '[mobile number]',
  phoneHref: 'tel:+37400000000',

  telegram: '[Telegram]',
  telegramHref: 'https://t.me/username',

  whatsapp: '[WhatsApp]',
  /** wa.me link, digits only, no "+" */
  whatsappHref: 'https://wa.me/37400000000',

  instagram: '[Instagram]',
  instagramHref: 'https://instagram.com/',

  linkedin: '[LinkedIn]',
  linkedinHref: 'https://www.linkedin.com/',

  /** Shown as "We reply within [X] working days". */
  replyDays: '[X]',

  /** Bump when the consent wording on the form changes; stored with every enquiry. */
  consentVersion: '2026-01',
};
