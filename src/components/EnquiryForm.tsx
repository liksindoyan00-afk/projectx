'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dict } from '@/content';
import type { Lang } from '@/lib/i18n';
import { COUNTRIES, LEVELS, ROLES, SERVICES, YEARS } from '@/lib/enquiry-options';
import { EMPTY_ENQUIRY, validateEnquiry, type EnquiryInput, type FieldErrors } from '@/lib/enquiry-validate';
import { ChatIcon, STAR_PATH } from './icons';

type Status = 'idle' | 'loading' | 'success' | 'failed' | 'rate';

const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export default function EnquiryForm({
  lang,
  f,
  replyDays,
  replyNote,
  whatsappHref,
  privacyHref,
}: {
  lang: Lang;
  f: Dict['form'];
  replyDays: string;
  replyNote: string;
  whatsappHref: string;
  privacyHref: string;
}) {
  const [v, setV] = useState<EnquiryInput>(EMPTY_ENQUIRY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serviceParam, setServiceParam] = useState<string>('');
  const [sentTo, setSentTo] = useState('');
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef<number>(Date.now());
  const hpRef = useRef<HTMLInputElement>(null);

  // ?service=profile-evaluation | full-admission-consulting pre-selects the service.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('service') || '';
    if (p === 'profile-evaluation' || p === 'full-admission-consulting') {
      setServiceParam(p);
      setV((s) => ({ ...s, service: s.service || p }));
    }
  }, []);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
    if (status === 'failed' || status === 'rate') alertRef.current?.focus();
  }, [status]);

  const set = <K extends keyof EnquiryInput>(k: K, val: EnquiryInput[K]) => {
    setV((s) => ({ ...s, [k]: val }));
    setErrors((e) => {
      const errKey = k === 'sameAsPhone' ? null : k;
      if (!errKey || !(errKey in e)) return e;
      const n = { ...e };
      delete n[errKey as keyof FieldErrors];
      return n;
    });
  };

  const loading = status === 'loading';
  const errCount = Object.keys(errors).length;
  const err = (k: keyof FieldErrors) => (errors[k] ? f.errors[errors[k] as keyof Dict['form']['errors']] : '');
  const inv = (k: keyof FieldErrors) => (errors[k] ? true : undefined);
  const desc = (k: keyof FieldErrors) => (errors[k] ? `err-${k}` : undefined);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    const errs = validateEnquiry(v);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setStatus('idle');
      requestAnimationFrame(() => {
        alertRef.current?.focus();
        alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }
    setErrors({});
    setStatus('loading');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...v,
          whatsapp: v.sameAsPhone ? v.phone : v.whatsapp,
          lang,
          page: window.location.pathname,
          referrer: document.referrer || '',
          serviceParam,
          website: hpRef.current?.value || '', // honeypot
          elapsedMs: Date.now() - startedAt.current,
        }),
      });
      if (res.status === 429) {
        setStatus('rate');
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setSentTo(v.email.trim());
      setStatus('success');
      requestAnimationFrame(() => successRef.current?.closest('.form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch {
      setStatus('failed');
    }
  }

  function reset() {
    setV(EMPTY_ENQUIRY);
    setErrors({});
    setStatus('idle');
    setSentTo('');
    startedAt.current = Date.now();
  }

  if (status === 'success') {
    return (
      <div className="success" role="status">
        <svg className="arc" viewBox="0 0 600 400" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
          <path d="M260 440 A 340 340 0 0 1 580 90" fill="none" stroke="#B99A5A" strokeOpacity="0.35" strokeWidth="1" />
        </svg>
        <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
          <path d={STAR_PATH} fill="#B99A5A" />
        </svg>
        <span className="eyebrow">{f.success.eyebrow}</span>
        <h2 ref={successRef} tabIndex={-1}>
          {fill(f.success.title, { days: replyDays })}
        </h2>
        <p>
          {f.success.body.split('{email}')[0]}
          <strong>{sentTo}</strong>
          {f.success.body.split('{email}')[1]}
        </p>
        <div className="success__actions">
          <a className="wa-pill" href={whatsappHref} target="_blank" rel="noopener">
            <ChatIcon size={20} color="#C9AB6E" />
            {f.success.wa}
          </a>
          <button type="button" className="link-btn" onClick={reset}>
            {f.success.again}
          </button>
        </div>
      </div>
    );
  }

  const radioGroup = (name: 'role' | 'level' | 'service', label: string, list: typeof ROLES, cols: string) => (
    <fieldset className="field field--full" aria-describedby={desc(name)}>
      <legend className="field__label" style={{ marginBottom: 8 }}>
        {label} *
      </legend>
      <div className={`options ${cols}${errors[name] ? ' invalid' : ''}`}>
        {list.map((o) => (
          <label key={o.key} className="option">
            <input type="radio" name={name} value={o.key} checked={v[name] === o.key} onChange={() => set(name, o.key)} required aria-invalid={inv(name)} />
            <span>{o.label[lang]}</span>
          </label>
        ))}
      </div>
      {errors[name] && (
        <span id={`err-${name}`} className="field__error">
          {err(name)}
        </span>
      )}
    </fieldset>
  );

  const banner =
    errCount > 0 ? (errCount === 1 ? f.errors.summaryOne : fill(f.errors.summaryMany, { n: errCount })) : status === 'failed' ? f.errors.failed : status === 'rate' ? f.errors.rateLimited : '';

  return (
    <form className="enq-form" onSubmit={onSubmit} noValidate aria-busy={loading} aria-labelledby="enq-title">
      <div className="enq-form__head">
        <span className="eyebrow">{f.eyebrow}</span>
        <h2 id="enq-title">{f.title}</h2>
        <span className="muted">{f.intro}</span>
      </div>

      <div ref={alertRef} tabIndex={-1} role="alert" className={banner ? 'alert' : undefined} hidden={!banner}>
        {banner && (
          <>
            <span className="alert__icon" aria-hidden="true">
              !
            </span>
            <span className="alert__text">
              {status === 'failed' || status === 'rate' ? (
                <>
                  {banner}{' '}
                  <a href={whatsappHref} target="_blank" rel="noopener">
                    WhatsApp →
                  </a>
                </>
              ) : (
                banner
              )}
            </span>
          </>
        )}
      </div>

      {/* Honeypot: hidden from people, tempting for bots */}
      <div className="hp" aria-hidden="true">
        <label>
          {f.honeypot}
          <input ref={hpRef} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* 01 ABOUT YOU */}
      <fieldset className="fs" disabled={loading}>
        <legend className="fs__legend">
          <span className="n">01</span>
          <span className="t">{f.s1}</span>
        </legend>
        <div className="fs__grid">
          <div className="field field--full">
            <label className="field__label" htmlFor="f-name">
              {f.name} *
            </label>
            <input id="f-name" className="input" type="text" autoComplete="name" required value={v.fullName} onChange={(e) => set('fullName', e.target.value)} aria-invalid={inv('fullName')} aria-describedby={desc('fullName')} placeholder={f.namePh} />
            {errors.fullName && (
              <span id="err-fullName" className="field__error">
                {err('fullName')}
              </span>
            )}
          </div>
          {radioGroup('role', f.role, ROLES, 'options--2')}
          <div className="field">
            <label className="field__label" htmlFor="f-email">
              {f.email} *
            </label>
            <input id="f-email" className="input" type="email" autoComplete="email" inputMode="email" required value={v.email} onChange={(e) => set('email', e.target.value)} aria-invalid={inv('email')} aria-describedby={desc('email')} placeholder="name@example.com" />
            {errors.email && (
              <span id="err-email" className="field__error">
                {err('email')}
              </span>
            )}
          </div>
          <div className="field">
            <label className="field__label" htmlFor="f-phone">
              {f.phone} *
            </label>
            <input id="f-phone" className="input" type="tel" autoComplete="tel" required value={v.phone} onChange={(e) => set('phone', e.target.value)} aria-invalid={inv('phone')} aria-describedby={desc('phone')} placeholder="+374 …" />
            {errors.phone && (
              <span id="err-phone" className="field__error">
                {err('phone')}
              </span>
            )}
          </div>
          <div className="field">
            <label className="field__label" htmlFor="f-wa">
              {f.whatsapp}
            </label>
            <input id="f-wa" className="input" type="tel" value={v.sameAsPhone ? v.phone : v.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} disabled={v.sameAsPhone || loading} placeholder="+374 …" />
            <label className="check check--inline">
              <input type="checkbox" checked={v.sameAsPhone} onChange={(e) => set('sameAsPhone', e.target.checked)} />
              <span className="box" aria-hidden="true" />
              {f.sameAsPhone}
            </label>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="f-tg">
              {f.telegram} <span className="opt">· {f.optional}</span>
            </label>
            <input id="f-tg" className="input" type="text" value={v.telegram} onChange={(e) => set('telegram', e.target.value)} placeholder="@username" />
          </div>
        </div>
      </fieldset>

      {/* 02 YOUR PLANS */}
      <fieldset className="fs" disabled={loading}>
        <legend className="fs__legend">
          <span className="n">02</span>
          <span className="t">{f.s2}</span>
        </legend>
        <div className="fs__grid">
          {radioGroup('level', f.level, LEVELS, 'options--3')}
          <div className="field">
            <label className="field__label" htmlFor="f-year">
              {f.year} *
            </label>
            <span className="select-wrap">
              <select id="f-year" className={`input${v.startYear ? '' : ' empty'}`} required value={v.startYear} onChange={(e) => set('startYear', e.target.value)} aria-invalid={inv('startYear')} aria-describedby={desc('startYear')}>
                <option value="">{f.yearPh}</option>
                {YEARS.map((y) => (
                  <option key={y.key} value={y.key}>
                    {y.label[lang]}
                  </option>
                ))}
              </select>
            </span>
            {errors.startYear && (
              <span id="err-startYear" className="field__error">
                {err('startYear')}
              </span>
            )}
          </div>
          <div className="field">
            <label className="field__label" htmlFor="f-unis">
              {f.unis} <span className="opt">· {f.unisHint}</span>
            </label>
            <input id="f-unis" className="input" type="text" value={v.universities} onChange={(e) => set('universities', e.target.value)} placeholder={f.unisPh} />
          </div>
          <fieldset className="field field--full">
            <legend className="field__label" style={{ marginBottom: 10 }}>
              {f.countries} <span className="opt">· {f.countriesHint}</span>
            </legend>
            <div className="chips">
              {COUNTRIES.map((c) => {
                const on = v.countries.includes(c.key);
                return (
                  <label key={c.key} className="chip">
                    <input type="checkbox" checked={on} onChange={() => set('countries', on ? v.countries.filter((x) => x !== c.key) : [...v.countries, c.key])} />
                    <span>{c.label[lang]}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          {radioGroup('service', f.service, SERVICES, 'options--auto')}
        </div>
      </fieldset>

      {/* 03 MESSAGE */}
      <fieldset className="fs" disabled={loading} style={{ paddingBottom: 32 }}>
        <legend className="fs__legend">
          <span className="n">03</span>
          <span className="t">{f.s3}</span>
        </legend>
        <div className="stack" style={{ gap: 22 }}>
          <div className="field">
            <label className="field__label" htmlFor="f-msg">
              {f.message} <span className="opt">· {f.optional}</span>
            </label>
            <textarea id="f-msg" className="input" rows={4} value={v.message} onChange={(e) => set('message', e.target.value)} placeholder={f.messagePh} />
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <label className="check">
              <input type="checkbox" required checked={v.consent} onChange={(e) => set('consent', e.target.checked)} aria-invalid={inv('consent')} aria-describedby={desc('consent')} />
              <span className="box" aria-hidden="true" />
              <span>
                {f.consentBefore}{' '}
                <a href={privacyHref} target="_blank" rel="noopener">
                  {f.consentLink}
                </a>
                {f.consentAfter} *
              </span>
            </label>
            {errors.consent && (
              <span id="err-consent" className="field__error" style={{ paddingLeft: 32 }}>
                {err('consent')}
              </span>
            )}
          </div>
        </div>
      </fieldset>

      <div className="form-foot">
        <span className="muted">{replyNote}</span>
        <button type="submit" className="btn btn--primary submit-btn" disabled={loading}>
          {loading && <span className="spinner" aria-hidden="true" />}
          <span>{loading ? f.sending : f.submit}</span>
        </button>
      </div>
    </form>
  );
}
