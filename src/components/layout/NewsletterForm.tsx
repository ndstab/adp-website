'use client';

import {useActionState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {ArrowRight, Check} from 'lucide-react';
import {subscribeNewsletter, type FormState} from '@/actions/forms';

export function NewsletterForm() {
  const t = useTranslations('common');
  const locale = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(subscribeNewsletter, {status: 'idle'});

  if (state.status === 'success') {
    return (
      <p role="status" className="flex items-center gap-2 text-sm text-white">
        <Check aria-hidden strokeWidth={1.5} className="size-4 text-gold-500" />
        {t('footer.newsletter.success')}
      </p>
    );
  }

  const invalid = (field: string) => state.status === 'error' && state.fields?.includes(field);

  return (
    <form action={action} noValidate className="grid gap-2.5">
      <input type="hidden" name="locale" value={locale} />
      <div aria-hidden className="absolute -start-[9999px] size-px overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label htmlFor="newsletter-email" className="label-caps text-white/80">
        {t('footer.newsletter.email')}
      </label>
      <div className="flex gap-1.5 rounded-xl bg-white/10 p-1 ring-1 ring-white/15 focus-within:ring-gold-500">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          dir="ltr"
          placeholder={t('footer.newsletter.placeholder')}
          aria-invalid={invalid('email') || undefined}
          className="min-w-0 flex-1 bg-transparent px-2.5 text-sm text-white placeholder:text-white/60 focus:outline-none rtl:text-right"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label={t('footer.newsletter.submit')}
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold-500 text-navy-900 transition-colors hover:bg-gold-300 disabled:opacity-60"
        >
          <ArrowRight aria-hidden strokeWidth={1.75} className="size-4 rtl:-scale-x-100" />
        </button>
      </div>
      <label className="flex items-start gap-2 text-[12px] leading-snug text-white/80">
        <input
          type="checkbox"
          name="consent"
          required
          aria-invalid={invalid('consent') || undefined}
          className="mt-0.5 size-3.5 shrink-0 accent-gold-500"
        />
        {t('footer.newsletter.consent')}
      </label>
      <p role="alert" className="min-h-4 text-[12px] text-gold-300">
        {state.status === 'error' &&
          (state.error === 'rate'
            ? t('form.errorRate')
            : state.error === 'server'
              ? t('form.errorGeneric')
              : invalid('email')
                ? t('form.errorEmail')
                : t('form.errorConsent'))}
      </p>
    </form>
  );
}
