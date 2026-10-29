import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {getPillars, getSolutions} from '@/content';
import {PageHero} from '@/components/page/PageHero';
import {Breadcrumbs} from '@/components/page/Breadcrumbs';
import {PillarBadge} from '@/components/ui/PillarBadge';
import {PillarIcon} from '@/components/ui/PillarIcon';
import {SolutionCard} from '@/components/ui/SolutionCard';
import {Reveal} from '@/components/ui/Reveal';
import {CtaBand} from '@/components/home/CtaBand';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'pages.solutionsHub.meta'});
  return pageMetadata({locale: locale as Locale, path: '/solutions', title: t('title'), description: t('description')});
}

export default async function SolutionsHubPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  return <SolutionsHub locale={locale} />;
}

function SolutionsHub({locale}: {locale: Locale}) {
  const t = useTranslations('pages');
  const pillars = getPillars(locale);
  const solutions = getSolutions(locale);

  return (
    <>
      <PageHero
        chip={t('solutionsHub.chip')}
        title1={t('solutionsHub.title1')}
        title2={t('solutionsHub.title2')}
        sub={t('solutionsHub.sub')}
        breadcrumbs={<Breadcrumbs items={[{label: t('breadcrumb.home'), href: '/'}, {label: t('breadcrumb.solutions')}]} />}
      >
        <nav aria-label={t('solutionsHub.jump')} className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {pillars.map((p) => (
              <li key={p.id}>
                <a
                  href={`#${p.id}`}
                  className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-medium text-ink-700 ring-1 ring-navy-900/10 transition-colors hover:ring-navy-900/25"
                >
                  <PillarIcon icon={p.icon} className="size-3.5 text-blue-600" />
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <div className="bg-white/50 pb-20 sm:pb-28">
        {pillars.map((pillar) => {
          const items = solutions.filter((s) => s.pillar === pillar.id);
          return (
            <section key={pillar.id} id={pillar.id} aria-labelledby={`${pillar.id}-title`} className="container-site scroll-mt-28 pt-16 sm:pt-20">
              <Reveal className="flex flex-col gap-5 border-t border-navy-900/10 pt-10 sm:flex-row sm:items-start">
                <PillarBadge icon={pillar.icon} className="size-14" />
                <div className="max-w-2xl">
                  <p className="label-caps text-ink-500 tabular-nums">0{pillar.order}</p>
                  <h2 id={`${pillar.id}-title`} className="mt-2 text-[26px] leading-tight font-semibold text-navy-900 sm:text-[30px]">
                    {pillar.name}
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-500">{pillar.short}</p>
                  <p className="mt-2 text-[12.5px] text-ink-500">{t('solutionsHub.count', {count: items.length})}</p>
                </div>
              </Reveal>
              <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((solution) => (
                  <li key={solution.slug}>
                    <SolutionCard solution={solution} pillar={pillar} cta={t('solutionsHub.explore')} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <CtaBand />
    </>
  );
}
