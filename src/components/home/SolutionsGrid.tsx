'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {AnimatePresence, MotionConfig, motion} from 'framer-motion';
import type {Pillar, PillarId, Solution} from '@/content/schema';
import {cn} from '@/lib/cn';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {PillarIcon} from '@/components/ui/PillarIcon';
import {SolutionCard} from '@/components/ui/SolutionCard';
import {ButtonLink} from '@/components/ui/Button';
import {PILLAR_EVENT} from './PillarOrbit';

/** Unfiltered, the homepage shows a sample and sends the rest to /solutions. */
const HOME_LIMIT = 6;

export function SolutionsGrid({pillars, solutions}: {pillars: Pillar[]; solutions: Solution[]}) {
  const t = useTranslations('home.solutions');
  const [filter, setFilter] = useState<PillarId | 'all'>('all');
  const section = useRef<HTMLElement>(null);
  const pillarById = Object.fromEntries(pillars.map((p) => [p.id, p])) as Record<PillarId, Pillar>;
  // A pillar's own set is small enough to show in full; only the unfiltered grid is cut back.
  const matching = filter === 'all' ? solutions : solutions.filter((s) => s.pillar === filter);
  const capped = filter === 'all' && matching.length > HOME_LIMIT;
  const visible = capped ? matching.slice(0, HOME_LIMIT) : matching;

  // A click on a hero badge filters the grid to that pillar and brings it into view.
  useEffect(() => {
    const onSelect = (e: Event) => {
      setFilter((e as CustomEvent<PillarId>).detail);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      section.current?.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'start'});
      section.current?.focus({preventScroll: true});
    };
    window.addEventListener(PILLAR_EVENT, onSelect);
    return () => window.removeEventListener(PILLAR_EVENT, onSelect);
  }, []);

  const chips: Array<{id: PillarId | 'all'; label: string}> = [{id: 'all', label: t('all')}, ...pillars.map((p) => ({id: p.id, label: p.name}))];

  // Framer Motion honours the OS reduced-motion setting inside this config.
  return (
    <MotionConfig reducedMotion="user">
    <section ref={section} id="solutions" tabIndex={-1} aria-labelledby="solutions-title" className="scroll-mt-24 bg-white/50 py-20 focus:outline-none sm:py-28">
      <div className="container-site">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="solutions-title" chip={t('chip')} title1={t('title1')} title2={t('title2')} />
          <p className="max-w-[26rem] text-[14.5px] leading-relaxed text-ink-500">{t('sub')}</p>
        </div>

        <div role="group" aria-label={t('filterLabel')} className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {chips.map((chip) => {
            const active = filter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(chip.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium whitespace-nowrap ring-1 transition-colors',
                  active ? 'bg-navy-700 text-white ring-navy-700' : 'bg-white text-ink-700 ring-navy-900/10 hover:ring-navy-900/25'
                )}
              >
                {chip.id !== 'all' && <PillarIcon icon={pillarById[chip.id].icon} className={cn('size-3.5', active ? 'text-gold-500' : 'text-blue-600')} />}
                {chip.label}
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="mt-4 text-[12.5px] text-ink-500">
          {capped ? '' : t('count', {count: visible.length})}
        </p>

        <motion.ul layout className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((solution) => {
              const pillar = pillarById[solution.pillar];
              return (
                <motion.li
                  key={solution.slug}
                  layout
                  initial={{opacity: 0, scale: 0.97}}
                  animate={{opacity: 1, scale: 1}}
                  exit={{opacity: 0, scale: 0.97}}
                  transition={{duration: 0.3, ease: [0.22, 1, 0.36, 1]}}
                >
                  <SolutionCard solution={solution} pillar={pillar} cta={t('explore')} />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>

        {capped && (
          <ButtonLink href="/solutions" variant="white" size="sm" className="mt-8">
            {t('viewAll', {count: matching.length})}
          </ButtonLink>
        )}
      </div>
    </section>
    </MotionConfig>
  );
}
