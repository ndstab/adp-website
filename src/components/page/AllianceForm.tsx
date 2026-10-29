'use client';

import {useActionState, useId} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {CheckCircle2, ChevronDown} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {Pillar} from '@/content/schema';
import {submitAlliance, type FormState} from '@/actions/forms';
import {cn} from '@/lib/cn';
import {buttonClass} from '@/components/ui/Button';
import {darkInput} from '@/components/ui/formStyles';

export function AllianceForm({pillars}: {pillars: Pillar[]}) {
  const t = useTranslations('company.alliance.form');
  const tf = useTranslations('common.form');
  const locale = useLocale();
  const uid = useId();
  const [state, action, pending] = useActionState<FormState, FormData>(submitAlliance, {status: 'idle'});

  if (state.status === 'success') {
    return (
      <div role="status" className="flex min-h-[20rem] flex-col items-center justify-center gap-4 text-center">
        <CheckCircle2 aria-hidden strokeWidth={1.25} className="size-12 text-gold-500" />
        <p className="max-w-sm text-[16px] leading-relaxed text-white">{t('success')}</p>
      </div>
    );
  }

  const invalid = (f: string) => state.status === 'error' && state.error === 'validation' && !!state.fields?.includes(f);
  const field = (name: string, label: string, opts: {required?: boolean; type?: string; ltr?: boolean; auto?: string} = {}) => {
    const {required = true, type = 'text', ltr, auto} = opts;
    const id = `${uid}-${name}`;
    return (
      <div>
        <label htmlFor={id} className="label-caps mb-2 block text-white/80">
          {label}
          {required && <span aria-hidden className="text-gold-500"> *</span>}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={auto}
          dir={ltr ? 'ltr' : undefined}
          aria-invalid={invalid(name) || undefined}
          aria-describedby={invalid(name) ? `${id}-error` : undefined}
          className={cn(darkInput, ltr && 'rtl:text-right')}
        />
        {invalid(name) && (
          <p id={`${id}-error`} className="mt-1.5 text-[12px] text-gold-300">
            {name === 'email' ? tf('errorEmail') : name === 'phone' ? tf('errorPhone') : tf('errorRequired')}
          </p>
        )}
      </div>
    );
  };

  return (
    <form action={action} noValidate className="grid grid-cols-1 gap-5">
      <input type="hidden" name="locale" value={locale} />
      <div aria-hidden className="absolute -start-[9999px] size-px overflow-hidden">
        <label>
          Fax <input type="text" name="fax" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {field('company', t('company'), {auto: 'organization'})}
        {field('website', t('website'), {required: false, type: 'url', ltr: true, auto: 'url'})}
        {field('name', t('name'), {auto: 'name'})}
        {field('email', t('email'), {type: 'email', ltr: true, auto: 'email'})}
        {field('phone', t('phone'), {required: false, type: 'tel', ltr: true, auto: 'tel'})}
        {field('country', t('country'), {auto: 'country-name'})}
      </div>
      <div>
        <label htmlFor={`${uid}-category`} className="label-caps mb-2 block text-white/80">
          {t('category')}
          <span aria-hidden className="text-gold-500"> *</span>
        </label>
        <div className="relative">
          <select id={`${uid}-category`} name="category" required defaultValue="" aria-invalid={invalid('category') || undefined} className={cn(darkInput, 'appearance-none pe-10 [&>option]:text-ink-900')}>
            <option value="" disabled>
              {t('categoryPlaceholder')}
            </option>
            {pillars.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="other">{t('other')}</option>
          </select>
          <ChevronDown aria-hidden strokeWidth={1.5} className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-white/80" />
        </div>
      </div>
      <div>
        <label htmlFor={`${uid}-message`} className="label-caps mb-2 block text-white/80">
          {t('message')}
          <span aria-hidden className="text-gold-500"> *</span>
        </label>
        <textarea id={`${uid}-message`} name="message" required rows={5} placeholder={t('messagePlaceholder')} aria-invalid={invalid('message') || undefined} className={cn(darkInput, 'resize-y')} />
      </div>
      <label className="flex items-start gap-3 text-[13px] leading-relaxed text-white/75">
        <input type="checkbox" name="consent" required aria-invalid={invalid('consent') || undefined} className="mt-1 size-4 shrink-0 accent-gold-500" />
        <span>
          {t('consent')}{' '}
          <Link href="/privacy" className="text-gold-300 underline underline-offset-2 hover:text-white">
            {t('privacy')}
          </Link>
          .
        </span>
      </label>
      {invalid('consent') && <p className="-mt-3 text-[12px] text-gold-300">{tf('errorConsent')}</p>}
      <button type="submit" disabled={pending} className={buttonClass('gold', 'justify-self-start sm:min-w-44')}>
        {pending ? tf('sending') : t('submit')}
      </button>
      <p role="alert" className="text-[13px] text-gold-300 empty:hidden">
        {state.status === 'error' && state.error === 'rate' ? tf('errorRate') : state.status === 'error' && state.error === 'server' ? tf('errorGeneric') : ''}
      </p>
    </form>
  );
}
