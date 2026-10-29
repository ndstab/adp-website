import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Languages, Mail, MessageSquare, Mic, Type} from 'lucide-react';
import type {Locale} from '@/i18n/routing';
import {getPillars} from '@/content';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {PillarIcon} from '@/components/ui/PillarIcon';
import {Reveal} from '@/components/ui/Reveal';

const channelIcons = [Languages, Type, Mic, MessageSquare, Mail];

export function Capabilities({locale}: {locale: Locale}) {
  const t = useTranslations('home.capabilities');
  const pillars = getPillars(locale);
  const channels = t.raw('bilingual.items') as string[];

  return (
    <section aria-labelledby="capabilities-title" className="container-site py-20 sm:py-28">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading id="capabilities-title" chip={t('chip')} title1={t('title1')} title2={t('title2')} />
        <p className="max-w-[26rem] text-[14.5px] leading-relaxed text-ink-500">{t('intro')}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* (a) light card: icon grid of the five pillars */}
        <Reveal className="flex min-h-[27rem] flex-col justify-between rounded-[var(--radius-card)] bg-white/75 p-5 ring-1 ring-navy-900/[0.06]">
          <div>
            <p className="text-[13px] font-semibold text-navy-900">{t('layers.label')}</p>
            <ul className="mt-4 grid grid-cols-3 gap-2">
              {pillars.map((p) => (
                <li key={p.id} className="flex flex-col items-center gap-1.5 rounded-xl bg-sand-50 px-1 py-3 text-center ring-1 ring-navy-900/[0.04]">
                  <span className="grid size-9 place-items-center rounded-full bg-navy-700 text-white ring-[1.5px] ring-gold-500">
                    <PillarIcon icon={p.icon} className="size-4" />
                  </span>
                  <span title={p.name} className="text-[10.5px] leading-tight text-ink-500">
                    {p.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8">
            <h3 className="text-[17px] leading-snug font-semibold text-navy-900">{t('layers.title')}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{t('layers.body')}</p>
          </div>
        </Reveal>

        {/* (b) photo card with navy overlay */}
        <Reveal delay={0.08} className="relative min-h-[27rem] overflow-hidden rounded-[var(--radius-card)] bg-navy-700">
          <Image
            src="/images/home/data-centre-aisle.jpg"
            alt={t('sovereign.alt')}
            fill
            sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 92vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(14_35_71/0.92)_0%,rgb(20_48_94/0.62)_42%,rgb(20_48_94/0.25)_100%)]" />
          <div className="relative p-5 text-white">
            <h3 className="text-[17px] leading-snug font-semibold">{t('sovereign.title')}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/80">{t('sovereign.body')}</p>
          </div>
        </Reveal>

        {/* (c) light card with a mini channel list */}
        <Reveal delay={0.16} className="flex min-h-[27rem] flex-col justify-between rounded-[var(--radius-card)] bg-sand-100 p-5 ring-1 ring-navy-900/[0.05]">
          <div>
            <p className="text-[13px] font-semibold text-navy-900">{t('bilingual.label')}</p>
            <ul className="mt-4 grid gap-1.5">
              {channels.map((item, i) => {
                const Icon = channelIcons[i] ?? MessageSquare;
                return (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 rounded-lg bg-white px-3 py-2 text-[12.5px] text-navy-900 shadow-[0_1px_2px_rgb(14_35_71/0.05)]"
                    style={{opacity: [1, 1, 1, 0.85, 0.7][i] ?? 0.7}}
                  >
                    <Icon aria-hidden strokeWidth={1.5} className="size-3.5 text-blue-600" />
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-8">
            <h3 className="text-[17px] leading-snug font-semibold text-navy-900">{t('bilingual.title')}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{t('bilingual.body')}</p>
          </div>
        </Reveal>

        {/* (d) photo card with a warm gold tint */}
        <Reveal delay={0.24} className="relative min-h-[27rem] overflow-hidden rounded-[var(--radius-card)] bg-navy-700">
          <Image
            src="/images/home/riyadh-kingdom-centre-sunset.jpg"
            alt={t('vision.alt')}
            fill
            sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 92vw"
            className="object-cover object-[50%_60%]"
          />
          <div aria-hidden className="absolute inset-0 bg-gold-500/20 mix-blend-multiply" />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(14_35_71/0.88)_0%,rgb(14_35_71/0.5)_40%,rgb(14_35_71/0)_70%)]" />
          <div className="relative p-5 text-white">
            <h3 className="text-[17px] leading-snug font-semibold">{t('vision.title')}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/85">{t('vision.body')}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
