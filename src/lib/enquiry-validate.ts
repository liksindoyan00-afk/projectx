import { COUNTRIES, keysOf, LEVELS, ROLES, SERVICES, YEARS } from './enquiry-options';

export type EnquiryInput = {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  whatsapp: string;
  sameAsPhone: boolean;
  telegram: string;
  level: string;
  startYear: string;
  universities: string;
  countries: string[];
  service: string;
  message: string;
  consent: boolean;
};

export const EMPTY_ENQUIRY: EnquiryInput = {
  fullName: '',
  role: '',
  email: '',
  phone: '',
  whatsapp: '',
  sameAsPhone: false,
  telegram: '',
  level: '',
  startYear: '',
  universities: '',
  countries: [],
  service: '',
  message: '',
  consent: false,
};

/** Error key per field; keys map to dictionary strings in `form.errors`. Order = form order. */
export type FieldErrors = Partial<Record<'fullName' | 'role' | 'email' | 'phone' | 'level' | 'startYear' | 'service' | 'consent', string>>;

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function validateEnquiry(v: EnquiryInput): FieldErrors {
  const e: FieldErrors = {};
  if (!v.fullName.trim()) e.fullName = 'name';
  if (!keysOf(ROLES).includes(v.role)) e.role = 'role';
  if (!v.email.trim()) e.email = 'emailEmpty';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'email';
  if ((v.phone.match(/\d/g) || []).length < 7) e.phone = 'phone';
  if (!keysOf(LEVELS).includes(v.level)) e.level = 'level';
  if (!keysOf(YEARS).includes(v.startYear)) e.startYear = 'year';
  if (!keysOf(SERVICES).includes(v.service)) e.service = 'service';
  if (!v.consent) e.consent = 'consent';
  return e;
}

const str = (x: unknown, max: number) => (typeof x === 'string' ? x.trim().slice(0, max) : '');

/** Coerce an untrusted request body into EnquiryInput (lengths capped, unknown countries dropped). */
export function coerceEnquiry(body: Record<string, unknown>): EnquiryInput {
  const countryKeys = keysOf(COUNTRIES);
  return {
    fullName: str(body.fullName, 200),
    role: str(body.role, 20),
    email: str(body.email, 254),
    phone: str(body.phone, 40),
    whatsapp: str(body.whatsapp, 40),
    sameAsPhone: body.sameAsPhone === true,
    telegram: str(body.telegram, 64),
    level: str(body.level, 20),
    startYear: str(body.startYear, 10),
    universities: str(body.universities, 500),
    countries: Array.isArray(body.countries) ? body.countries.filter((c): c is string => typeof c === 'string' && countryKeys.includes(c)).slice(0, 20) : [],
    service: str(body.service, 40),
    message: str(body.message, 5000),
    consent: body.consent === true,
  };
}
