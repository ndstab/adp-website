import {useTranslations} from 'next-intl';
import type {Locale} from '@/i18n/routing';
import {getSources} from '@/content';
import {VerifyFlag} from '@/components/ui/ReviewFlag';

/** Numbered source list that the page's footnote markers link to. */
export function Sources({ids, locale}: {ids: string[]; locale: Locale}) {
  const t = useTranslations('home.sources');
  const sources = getSources(ids);

  return (
    <aside aria-labelledby="sources-title" className="container-site pb-16">
      <div className="border-t border-navy-900/10 pt-6">
        <h2 id="sources-title" className="label-caps text-ink-500">
          {t('title')}
        </h2>
        <ol className="mt-3 grid gap-1.5 text-[12px] leading-relaxed text-ink-500 md:grid-cols-2 md:gap-x-10">
          {sources.map((s, i) => (
            <li key={s.id} id={`source-${s.id}`} className="flex scroll-mt-28 gap-2">
              <span className="font-semibold text-navy-900 tabular-nums">{i + 1}.</span>
              <span>
                {s.label[locale]} <span className="text-ink-500">{s.publisher}</span>
                {s.url && (
                  <>
                    {' '}
                    <a href={s.url} className="text-blue-600 underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                      {s.title}
                    </a>
                  </>
                )}{' '}
                {s.verify && <VerifyFlag />}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[12px] text-ink-500">{t('note')}</p>
      </div>
    </aside>
  );
}
