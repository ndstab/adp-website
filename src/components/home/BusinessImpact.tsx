import {useTranslations} from 'next-intl';
import {BellOff, Timer, TrendingDown, Wallet} from 'lucide-react';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {VerifyFlag} from '@/components/ui/ReviewFlag';
import {Reveal} from '@/components/ui/Reveal';

type Stat = {value: string; unit: string; label: string; icon: keyof typeof icons};

const icons = {'trending-down': TrendingDown, 'bell-off': BellOff, timer: Timer, wallet: Wallet};

// Each card sits lower than the one before it, so the row reads as a descending staircase.
const steps = ['lg:mt-0', 'lg:mt-14', 'lg:mt-28', 'lg:mt-42'];

export function BusinessImpact() {
  const t = useTranslations('home.impact');
  const stats = t.raw('stats') as Stat[];

  return (
    <section aria-labelledby="impact-title" className="container-site pb-24 sm:pb-32">
      <SectionHeading id="impact-title" align="center" chip={t('chip')} title1={t('title1')} title2={t('title2')} sub={t('sub')} />

      <ol className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:items-start">
        {stats.map((stat, i) => {
          const Icon = icons[stat.icon];
          return (
            <li key={stat.label} className={steps[i]}>
              <Reveal delay={i * 0.08} className="flex h-full min-h-44 flex-col justify-between gap-10 rounded-[var(--radius-card)] bg-sand-100 p-5 ring-1 ring-navy-900/[0.04] sm:min-h-52 sm:p-6">
                <p className="flex items-baseline gap-1.5 text-navy-900">
                  <bdi dir="ltr" className="text-[34px] leading-none font-medium tracking-tight sm:text-[44px]">
                    {stat.value}
                  </bdi>
                  {stat.unit && <span className="text-[15px] font-semibold sm:text-[17px]">{stat.unit}</span>}
                </p>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[12.5px] font-medium text-ink-700">
                  <Icon aria-hidden strokeWidth={1.5} className="size-4 text-blue-600" />
                  {stat.label}
                  <VerifyFlag />
                </p>
              </Reveal>
            </li>
          );
        })}
      </ol>

      <p className="mt-10 text-center text-[13px] text-ink-500 lg:mt-14">{t('caption')}</p>
    </section>
  );
}
