import {useLocale, useTranslations} from 'next-intl';
import {ChevronRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';
import {localePath, siteUrl} from '@/lib/seo';
import type {Locale} from '@/i18n/routing';
import {JsonLd} from '@/components/ui/JsonLd';

type Crumb = {label: string; href?: string};

export function Breadcrumbs({items, tone = 'light'}: {items: Crumb[]; tone?: 'light' | 'dark'}) {
  const t = useTranslations('pages.breadcrumb');
  const locale = useLocale() as Locale;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? {item: `${siteUrl}${localePath(locale, item.href)}`} : {})
    }))
  };
  const muted = tone === 'dark' ? 'text-white/80 hover:text-white' : 'text-ink-500 hover:text-navy-900';
  return (
    <nav aria-label={t('label')}>
      <JsonLd data={schema} />
      <ol className="flex flex-wrap items-center gap-1.5 text-[12.5px]">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight aria-hidden strokeWidth={1.5} className={cn('size-3.5 rtl:-scale-x-100', tone === 'dark' ? 'text-white/40' : 'text-ink-500/60')} />}
            {item.href ? (
              <Link href={item.href} className={cn('transition-colors', muted)}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={tone === 'dark' ? 'text-white' : 'text-navy-900'}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
