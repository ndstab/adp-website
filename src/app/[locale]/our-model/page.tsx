import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Check} from 'lucide-react';
import type {Locale} from '@/i18n/routing';
import {PageHero} from '@/components/page/PageHero';
import {Breadcrumbs} from '@/components/page/Breadcrumbs';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {Reveal} from '@/components/ui/Reveal';
import {CtaBand} from '@/components/home/CtaBand';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'company.model.meta'});
  return pageMetadata({locale: locale as Locale, path: '/our-model', title: t('title'), description: t('description')});
}

export default async function ModelPage({params}: Params) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  return <Model />;
}

function Model() {
  const t = useTranslations('company.model');
  const tp = useTranslations('pages.breadcrumb');
  const steps = t.raw('steps') as Array<{title: string; body: string; points: string[]}>;
  const commitments = t.raw('commitments.items') as string[];
  const pilot = t.raw('pilot.steps') as Array<{title: string; body: string}>;

  return (
    <>
      <PageHero
        chip={t('hero.chip')}
        title1={t('hero.title1')}
        title2={t('hero.title2')}
        sub={t('hero.sub')}
        breadcrumbs={<Breadcrumbs items={[{label: tp('home'), href: '/'}, {label: t('hero.chip')}]} />}
      />

      {/* The four stages */}
      <section aria-label={t('hero.chip')} className="container-site pb-20 sm:pb-28">
        <ol className="relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden className="absolute inset-x-[12%] top-[2.1rem] hidden h-px bg-[linear-gradient(90deg,transparent,var(--color-gold-500),transparent)] lg:block" />
          {steps.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 0.08} className="relative flex h-full flex-col rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06]">
                <span className="relative grid size-11 place-items-center rounded-full bg-navy-700 text-[14px] font-semibold text-white ring-[1.5px] ring-gold-500 tabular-nums">
                  0{i + 1}
                </span>
                <h2 className="mt-6 text-[20px] font-semibold text-navy-900">{step.title}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{step.body}</p>
                <ul className="mt-5 grid gap-2 border-t border-navy-900/[0.08] pt-5">
                  {step.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[13px] text-ink-700">
                      <Check aria-hidden strokeWidth={2} className="mt-0.5 size-3.5 shrink-0 text-blue-600" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Six commitments */}
      <section aria-labelledby="commitments-title" className="on-dark bg-[linear-gradient(160deg,var(--color-navy-700),var(--color-navy-500))] py-20 text-white sm:py-28">
        <div className="container-site">
          <SectionHeading id="commitments-title" tone="dark" chip={t('commitments.chip')} title1={t('commitments.title')} />
          <ol className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {commitments.map((c, i) => (
              <li key={c} className="rounded-[var(--radius-card)] bg-white/[0.07] p-6 ring-1 ring-white/10">
                <span className="text-[13px] font-semibold text-gold-300 tabular-nums">0{i + 1}</span>
                <p className="mt-3 text-[15px] leading-relaxed text-white/90">{c}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Proof of value */}
      <section aria-labelledby="pilot-title" className="container-site py-20 sm:py-28">
        <SectionHeading id="pilot-title" chip={t('pilot.chip')} title1={t('pilot.title1')} title2={t('pilot.title2')} />
        <ol className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3">
          {pilot.map((s, i) => (
            <li key={s.title} className="rounded-[var(--radius-card)] bg-sand-100 p-6 ring-1 ring-navy-900/[0.04]">
              <span className="text-[12px] font-semibold text-navy-700 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-[17px] font-semibold text-navy-900">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand />
    </>
  );
}
