'use client';

import {useActionState, useId} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {CheckCircle2, ChevronDown, MessageCircle} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {Pillar} from '@/content/schema';
import {submitContact, type FormState} from '@/actions/forms';
import {cn} from '@/lib/cn';
import {buttonClass} from '@/components/ui/Button';
import {darkInput} from '@/components/ui/formStyles';

type Props = {pillars: Pillar[]; whatsapp: string; phoneDisplay: string};

const input = darkInput;

export function ContactForm({pillars, whatsapp, phoneDisplay}: Props) {
  const t = useTranslations('home.contact');
  const tf = useTranslations('common.form');
  const locale = useLocale();
  const uid = useId();
  const [state, action, pending] = useActionState<FormState, FormData>(submitContact, {status: 'idle'});

  if (state.status === 'success') {
    return (
      <div role="status" className="flex min-h-[24rem] flex-col items-center justify-center gap-4 text-center">
        <CheckCircle2 aria-hidden strokeWidth={1.25} className="size-12 text-gold-500" />
        <p className="max-w-sm text-[16px] leading-relaxed text-white">{t('success')}</p>
      </div>
    );
  }

  const invalid = (field: string) => state.status === 'error' && state.error === 'validation' && !!state.fields?.includes(field);
  const id = (field: string) => `${uid}-${field}`;
  const err = (field: string, message: string) =>
    invalid(field) ? (
      <p id={id(`${field}-error`)} className="mt-1.5 text-[12px] text-gold-300">
        {message}
      </p>
    ) : null;

  const label = (field: string, text: string, required = true) => (
    <label htmlFor={id(field)} className="label-caps mb-2 block text-white/80">
      {text}
      {required && <span aria-hidden className="text-gold-500"> *</span>}
    </label>
  );
  const a11y = (field: string) => ({
    id: id(field),
    name: field,
    'aria-invalid': invalid(field) || undefined,
    'aria-describedby': invalid(field) ? id(`${field}-error`) : undefined
  });

  return (
    <form action={action} noValidate className="grid grid-cols-1 gap-5">
      <input type="hidden" name="locale" value={locale} />
      <div aria-hidden className="absolute -start-[9999px] size-px overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          {label('name', t('fields.name'))}
          <input {...a11y('name')} type="text" required autoComplete="name" className={input} />
          {err('name', tf('errorRequired'))}
        </div>
        <div>
          {label('email', t('fields.email'))}
          <input {...a11y('email')} type="email" required autoComplete="email" dir="ltr" placeholder="name@company.sa" className={cn(input, 'rtl:text-right')} />
          {err('email', tf('errorEmail'))}
        </div>
        <div>
          {label('company', t('fields.company'))}
          <input {...a11y('company')} type="text" required autoComplete="organization" className={input} />
          {err('company', tf('errorRequired'))}
        </div>
        <div>
          {label('phone', t('fields.phone'), false)}
          <input
            {...a11y('phone')}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            placeholder={t('fields.phonePlaceholder')}
            className={cn(input, 'rtl:text-right')}
          />
          {err('phone', tf('errorPhone'))}
        </div>
      </div>

      <div>
        {label('interest', t('fields.interest'))}
        <div className="relative">
          <select {...a11y('interest')} required defaultValue="" className={cn(input, 'appearance-none pe-10 [&>option]:text-ink-900')}>
            <option value="" disabled>
              {t('fields.interestPlaceholder')}
            </option>
            {pillars.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="other">{t('fields.interestOther')}</option>
          </select>
          <ChevronDown aria-hidden strokeWidth={1.5} className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-white/80" />
        </div>
        {err('interest', tf('errorRequired'))}
      </div>

      <div>
        {label('message', t('fields.message'))}
        <textarea {...a11y('message')} required rows={4} placeholder={t('fields.messagePlaceholder')} className={cn(input, 'resize-y')} />
        {err('message', tf('errorRequired'))}
      </div>

      <div>
        <label className="flex items-start gap-3 text-[13px] leading-relaxed text-white/75">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={invalid('consent') || undefined}
            className="mt-1 size-4 shrink-0 accent-gold-500"
          />
          <span>
            {t('fields.consent')}{' '}
            <Link href="/privacy" className="text-gold-300 underline underline-offset-2 hover:text-white">
              {t('fields.privacy')}
            </Link>
            .
          </span>
        </label>
        {err('consent', tf('errorConsent'))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={pending} className={buttonClass('gold', 'sm:min-w-40')}>
          {pending ? tf('sending') : t('fields.submit')}
        </button>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[13px] text-white/75 hover:text-white"
        >
          <MessageCircle aria-hidden strokeWidth={1.5} className="size-4 text-gold-500" />
          {t('whatsapp')}{' '}
          <span dir="ltr" className="font-semibold text-white">
            {phoneDisplay}
          </span>
        </a>
      </div>

      <p role="alert" className="text-[13px] text-gold-300 empty:hidden">
        {state.status === 'error' && state.error === 'rate' ? tf('errorRate') : state.status === 'error' && state.error === 'server' ? tf('errorGeneric') : ''}
      </p>
    </form>
  );
}
