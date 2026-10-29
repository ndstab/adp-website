'use client';

import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';

/** Switches language while staying on the same page. */
export function LanguageToggle() {
  const locale = useLocale();
  const t = useTranslations('common.language');
  const pathname = usePathname();
  const other = locale === 'ar' ? 'en' : 'ar';

  return (
    <Link prefetch={false}
      href={pathname}
      locale={other}
      hrefLang={other}
      aria-label={t('switch')}
      className="grid h-11 min-w-11 place-items-center rounded-full bg-navy-700 px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-navy-900"
    >
      <span lang={other}>{t('label')}</span>
    </Link>
  );
}
