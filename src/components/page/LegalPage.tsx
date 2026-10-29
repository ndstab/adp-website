import {useTranslations} from 'next-intl';
import {AlertTriangle} from 'lucide-react';
import {Breadcrumbs} from './Breadcrumbs';
import {TagChip} from '@/components/ui/TagChip';
import {AddValue} from '@/components/ui/ReviewFlag';
import {CookieSettingsButton} from '@/components/layout/CookieConsent';

type Section = {h: string; p?: string[]; list?: string[]};
type Doc = 'privacy' | 'terms' | 'cookies';

const anchor = (i: number) => `section-${i + 1}`;

/** Shared layout for the legal documents: draft notice, contents and numbered sections. */
export function LegalPage({doc}: {doc: Doc}) {
  const t = useTranslations('legal');
  const tp = useTranslations('pages.breadcrumb');
  const sections = t.raw(`${doc}.sections`) as Section[];
  const table =
    doc === 'cookies'
      ? (t.raw('cookies.table') as {name: string; purpose: string; type: string; duration: string; rows: Array<Record<'name' | 'purpose' | 'type' | 'duration', string>>})
      : null;

  return (
    <article className="container-site pt-32 pb-20 sm:pt-36 sm:pb-28">
      <Breadcrumbs items={[{label: tp('home'), href: '/'}, {label: t(`${doc}.title`)}]} />
      <div className="mt-8 max-w-3xl">
        <TagChip>{t(`${doc}.chip`)}</TagChip>
        <h1 className="display mt-5 font-semibold text-navy-900">{t(`${doc}.title`)}</h1>
        <p className="mt-4 text-[13.5px] text-ink-500">
          {t('updated')}: <AddValue value={t('updatedValue')} tone="light" />
        </p>
        <p role="note" className="mt-6 flex items-start gap-2.5 rounded-2xl bg-gold-300/35 px-4 py-3 text-[13.5px] text-navy-900 ring-1 ring-gold-500/30">
          <AlertTriangle aria-hidden strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
          {t('draft')}
        </p>
        <p className="mt-8 text-[17px] leading-relaxed text-ink-700">{t(`${doc}.intro`)}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label={t('contents')} className="lg:sticky lg:top-28 lg:self-start">
          <p className="label-caps text-ink-500">{t('contents')}</p>
          <ol className="mt-3 grid gap-1.5 text-[13.5px]">
            {sections.map((s, i) => (
              <li key={s.h}>
                <a href={`#${anchor(i)}`} className="text-ink-700 hover:text-blue-600">
                  {i + 1}. {s.h}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-3xl">
          {sections.map((s, i) => (
            <section key={s.h} id={anchor(i)} className="scroll-mt-28 border-t border-navy-900/[0.08] py-8 first:border-t-0 first:pt-0">
              <h2 className="text-[20px] font-semibold text-navy-900">
                {i + 1}. {s.h}
              </h2>
              {s.p?.map((para) => (
                <p key={para.slice(0, 32)} className="mt-3 text-[15.5px] leading-[1.8] text-ink-700">
                  {para}
                </p>
              ))}
              {s.list && (
                <ul className="mt-3 grid list-disc gap-1.5 ps-6 text-[15.5px] leading-[1.8] text-ink-700 marker:text-gold-500">
                  {s.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {table && (
            <div className="mt-4 overflow-x-auto rounded-[var(--radius-card)] bg-white ring-1 ring-navy-900/[0.06]">
              <table className="w-full min-w-[34rem] text-start text-[14px]">
                <thead className="bg-sand-100 text-navy-900">
                  <tr>
                    {(['name', 'purpose', 'type', 'duration'] as const).map((k) => (
                      <th key={k} scope="col" className="px-4 py-3 text-start font-semibold">
                        {table[k]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i} className="border-t border-navy-900/[0.06]">
                      <td className="px-4 py-3 font-mono text-[13px] text-navy-900" dir="ltr">
                        <AddValue value={row.name} tone="light" />
                      </td>
                      <td className="px-4 py-3 text-ink-700">{row.purpose}</td>
                      <td className="px-4 py-3 text-ink-700">{row.type}</td>
                      <td className="px-4 py-3 text-ink-700">
                        <AddValue value={row.duration} tone="light" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {doc === 'cookies' && <CookieSettingsButton className="mt-8" />}
        </div>
      </div>
    </article>
  );
}
