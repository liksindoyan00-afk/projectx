import type { Lang } from '@/lib/i18n';
import en, { type Dict } from './en';
import ru from './ru';
import hy from './hy';

const DICTS: Record<Lang, Dict> = { hy, ru, en };

export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}

/** Replace {key} placeholders. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export type { Dict };
