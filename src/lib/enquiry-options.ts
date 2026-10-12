import type { Lang } from './i18n';

type Labels = Record<Lang, string>;
type Option = { key: string; label: Labels };

export const ROLES: Option[] = [
  { key: 'student', label: { hy: 'Ուսանող', ru: 'Студент', en: 'Student' } },
  { key: 'parent', label: { hy: 'Ծնող', ru: 'Родитель', en: 'Parent' } },
];

export const LEVELS: Option[] = [
  { key: 'bachelor', label: { hy: 'Բակալավրիատ', ru: 'Бакалавриат', en: 'Bachelor’s' } },
  { key: 'master', label: { hy: 'Մագիստրատուրա', ru: 'Магистратура', en: 'Master’s' } },
  { key: 'phd', label: { hy: 'PhD', ru: 'PhD', en: 'PhD' } },
];

/** Level labels as shown on testimonial cards. */
export const TESTIMONIAL_LEVELS: Option[] = [
  { key: 'bachelor', label: { hy: 'Բակալավրիատ', ru: 'Бакалавриат', en: 'Bachelor’s' } },
  { key: 'master', label: { hy: 'Մագիստրատուրա', ru: 'Магистратура', en: 'Master’s' } },
  { key: 'phd', label: { hy: 'Ֆինանսավորվող PhD', ru: 'PhD с финансированием', en: 'Funded PhD' } },
];

export const YEARS: Option[] = [
  { key: '2026', label: { hy: 'Աշուն 2026', ru: 'Осень 2026', en: 'Autumn 2026' } },
  { key: '2027', label: { hy: 'Աշուն 2027', ru: 'Осень 2027', en: 'Autumn 2027' } },
  { key: '2028', label: { hy: 'Աշուն 2028', ru: 'Осень 2028', en: 'Autumn 2028' } },
  { key: '2029', label: { hy: 'Աշուն 2029', ru: 'Осень 2029', en: 'Autumn 2029' } },
  { key: 'later', label: { hy: 'Ավելի ուշ', ru: 'Позже', en: 'Later' } },
];

export const COUNTRIES: Option[] = [
  { key: 'us', label: { hy: 'ԱՄՆ', ru: 'США', en: 'United States' } },
  { key: 'uk', label: { hy: 'Մեծ Բրիտանիա', ru: 'Великобритания', en: 'United Kingdom' } },
  { key: 'ca', label: { hy: 'Կանադա', ru: 'Канада', en: 'Canada' } },
  { key: 'de', label: { hy: 'Գերմանիա', ru: 'Германия', en: 'Germany' } },
  { key: 'nl', label: { hy: 'Նիդեռլանդներ', ru: 'Нидерланды', en: 'Netherlands' } },
  { key: 'fr', label: { hy: 'Ֆրանսիա', ru: 'Франция', en: 'France' } },
  { key: 'it', label: { hy: 'Իտալիա', ru: 'Италия', en: 'Italy' } },
  { key: 'ch', label: { hy: 'Շվեյցարիա', ru: 'Швейцария', en: 'Switzerland' } },
  { key: 'es', label: { hy: 'Իսպանիա', ru: 'Испания', en: 'Spain' } },
  { key: 'eu-other', label: { hy: 'Եվրոպայի այլ երկիր', ru: 'Другая страна Европы', en: 'Other in Europe' } },
  { key: 'asia', label: { hy: 'Ասիա', ru: 'Азия', en: 'Asia' } },
  { key: 'not-sure', label: { hy: 'Դեռ չգիտեմ', ru: 'Пока не знаю', en: 'Not sure yet' } },
];

export const SERVICES: Option[] = [
  { key: 'profile-evaluation', label: { hy: 'Պրոֆիլի գնահատում', ru: 'Оценка профиля', en: 'Profile Evaluation' } },
  {
    key: 'full-admission-consulting',
    label: { hy: 'Ընդունելության ամբողջական խորհրդատվություն', ru: 'Полное сопровождение поступления', en: 'Full Admission Consulting' },
  },
  { key: 'not-sure', label: { hy: 'Դեռ չեմ որոշել', ru: 'Пока не решил(а)', en: 'Not sure yet' } },
];

export const keysOf = (list: Option[]) => list.map((o) => o.key);

export function labelFor(list: Option[], key: string | null | undefined, lang: Lang = 'en'): string {
  if (!key) return '';
  return list.find((o) => o.key === key)?.label[lang] ?? key;
}

export const STATUSES = [
  { key: 'NEW', label: 'New', tone: 'gold' },
  { key: 'CONTACTED', label: 'Contacted', tone: 'navy' },
  { key: 'IN_PROGRESS', label: 'In progress', tone: 'navy' },
  { key: 'CLIENT', label: 'Became client', tone: 'green' },
  { key: 'CLOSED', label: 'Closed', tone: 'muted' },
  { key: 'SPAM', label: 'Spam', tone: 'red' },
] as const;
export type StatusKey = (typeof STATUSES)[number]['key'];
