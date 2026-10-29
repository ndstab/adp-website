import Image from 'next/image';
import {useTranslations} from 'next-intl';
import type {Locale} from '@/i18n/routing';
import {getPillars} from '@/content';
import {TagChip} from '@/components/ui/TagChip';
import {ButtonLink} from '@/components/ui/Button';
import {Footnote} from '@/components/ui/Footnote';
import {PillarOrbit} from './PillarOrbit';

type Stat = {value: string; unit?: string; label: string; source: string};

export function Hero({locale, footnotes}: {locale: Locale; footnotes: Record<string, number>}) {
  const t = useTranslations('home.hero');
  const tc = useTranslations('common.a11y');
  const pillars = [...getPillars(locale)].sort((a, b) => a.orbitOrder - b.orbitOrder);
  const stats = t.raw('stats') as Stat[];
  const agentChips = t.raw('agent.chips') as string[];
  const ghosts = t.raw('ghosts') as string[];

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* The Riyadh skyline sits behind the sand gradient. The photo is dimmed and the gradient
          above it keeps its own tint, so the headline holds its contrast on every viewport. */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-sand-50">
        <Image
          src="/images/home/hero-riyadh-skyline.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_62%]"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_12%_8%,rgb(255_255_255/0.95)_0%,rgb(255_255_255/0)_70%),linear-gradient(180deg,rgb(244_242_238/0.36)_0%,rgb(244_242_238/0.46)_34%,rgb(241_238_233/0.82)_62%,rgb(239_236_230/0.94)_100%)]"
      />

      <div className="container-site relative pt-32 sm:pt-36 lg:flex lg:min-h-[clamp(780px,100svh,940px)] lg:flex-col lg:pb-14">
        <div className="relative z-10 max-w-[36rem] lg:max-w-[58%]">
          <TagChip tone="hero">{t('chip')}</TagChip>
          <h1 id="hero-title" className="display mt-6 text-balance text-navy-900">
            <span className="block font-semibold">{t('title1')}</span>
            <span className="block font-normal">{t('title2')}</span>
          </h1>
          <p className="mt-6 max-w-[31rem] text-[16px] leading-relaxed text-ink-700 sm:text-[17px]">{t('sub')}</p>
          <ButtonLink href="/contact" className="mt-8">
            {t('cta')}
          </ButtonLink>
        </div>

        {/* Floating agent card with faint rotated chips behind it */}
        <div className="relative z-10 mt-auto hidden pt-12 lg:block">
          <p className="label-caps mb-3 text-ink-500">{t('agentLabel')}</p>
          <div className="relative w-[17.5rem]">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {ghosts.map((ghost, i) => (
                <span
                  key={ghost}
                  className="label-caps absolute flex h-full w-full items-start rounded-2xl bg-white/45 p-4 text-ink-500/50 ring-1 ring-navy-900/[0.04] blur-[0.4px] [rotate:var(--tilt)] rtl:[rotate:calc(var(--tilt)*-1)]"
                  style={
                    {
                      insetInlineStart: `${-26 - i * 22}px`,
                      top: `${10 + i * 12}px`,
                      '--tilt': `${-7 - i * 6}deg`,
                      zIndex: -1 - i
                    } as React.CSSProperties
                  }
                >
                  {ghost}
                </span>
              ))}
            </div>
            <div className="relative rounded-2xl bg-white p-5 shadow-float ring-1 ring-navy-900/[0.05] motion-safe:animate-float">
              <div className="flex items-center justify-between">
                <p className="label-caps text-navy-900">{t('agent.eyebrow')}</p>
                <span className="flex items-center gap-1.5 text-[11px] text-success">
                  <span className="size-1.5 rounded-full bg-success motion-safe:animate-pulse-dot" />
                  {t('agent.status')}
                </span>
              </div>
              <p className="mt-3 text-[15px] font-semibold text-navy-900">{t('agent.title')}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-500">{t('agent.body')}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {agentChips.map((chip) => (
                  <li key={chip} className="label-caps rounded-md bg-sand-100 px-2 py-1.5 !text-[10px] text-navy-700">
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <PillarOrbit pillars={pillars} />

      <dl className="container-site relative z-10 grid grid-cols-3 gap-4 pt-6 pb-12 lg:absolute lg:end-[max(1.5rem,calc((100vw-1240px)/2+1rem))] lg:bottom-[13%] lg:w-auto lg:max-w-[13.5rem] lg:grid-cols-1 lg:gap-7 lg:p-0">
        {stats.map((stat) => (
          <div key={stat.source} className="flex flex-col-reverse gap-1">
            <dt className="text-[12px] leading-snug text-ink-500 sm:text-[13px]">
              {stat.label}
              <Footnote n={footnotes[stat.source]} id={stat.source} label={tc('source', {n: footnotes[stat.source]})} />
            </dt>
            <dd className="text-[26px] leading-none font-medium tracking-tight text-navy-900 sm:text-[30px] lg:text-[32px] rtl:tracking-normal">
              <bdi dir="ltr">{stat.value}</bdi>
              {stat.unit && <span className="ms-1.5 text-[0.55em] font-semibold">{stat.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
