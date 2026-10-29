'use client';

import {useId, useRef, useState, type KeyboardEvent} from 'react';
import {useTranslations} from 'next-intl';
import {AnimatePresence, MotionConfig, motion} from 'framer-motion';
import {Plus} from 'lucide-react';
import type {FaqGroup} from '@/content/schema';
import {cn} from '@/lib/cn';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {ButtonLink} from '@/components/ui/Button';

export function Faq({groups}: {groups: FaqGroup[]}) {
  const t = useTranslations('home.faq');
  const uid = useId();
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const group = groups[tab];

  const selectTab = (i: number) => {
    setTab(i);
    setOpen(0);
  };

  // Arrow keys move between tabs (vertical on desktop, so both axes are accepted).
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const rtl = document.documentElement.dir === 'rtl';
    const next = {ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1} as Record<string, number>;
    let target: number | null = null;
    if (e.key in next) target = (i + next[e.key] + groups.length) % groups.length;
    if (e.key === 'Home') target = 0;
    if (e.key === 'End') target = groups.length - 1;
    if (target === null) return;
    e.preventDefault();
    selectTab(target);
    tabs.current[target]?.focus();
  };

  // Framer Motion honours the OS reduced-motion setting inside this config.
  return (
    <MotionConfig reducedMotion="user">
    <section aria-labelledby="faq-title" className="container-site py-20 sm:py-28">
      <SectionHeading id="faq-title" align="center" chip={t('chip')} title1={t('title')} sub={t('sub')} />

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
        <div className="flex flex-col justify-between gap-8">
          <div
            role="tablist"
            aria-label={t('tabsLabel')}
            aria-orientation="vertical"
            className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:border-s lg:border-navy-900/10 lg:px-0"
          >
            {groups.map((g, i) => {
              const active = i === tab;
              return (
                <button
                  key={g.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`${uid}-tab-${g.id}`}
                  aria-selected={active}
                  aria-controls={`${uid}-panel`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectTab(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    'relative shrink-0 rounded-full px-4 py-2.5 text-start text-[14px] transition-colors lg:-ms-px lg:rounded-none lg:border-s-2 lg:py-3 lg:ps-5',
                    active
                      ? 'bg-navy-700 font-semibold text-white lg:border-navy-700 lg:bg-transparent lg:text-navy-900'
                      : 'bg-white text-ink-500 ring-1 ring-navy-900/10 hover:text-navy-900 lg:border-transparent lg:bg-transparent lg:ring-0'
                  )}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
          <div className="hidden lg:block">
            <p className="text-[13px] text-ink-500">{t('more')}</p>
            <ButtonLink href="/contact" variant="navy" size="sm" className="mt-3">
              {t('contact')}
            </ButtonLink>
          </div>
        </div>

        <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${group.id}`} className="grid gap-2">
          {group.items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${uid}-${group.id}-${i}`;
            return (
              <div key={item.q} className={cn('rounded-2xl transition-colors', isOpen ? 'bg-sand-100' : 'bg-transparent')}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 border-b border-navy-900/[0.08] px-5 py-4 text-start text-[15px] font-medium text-navy-900 data-[open=true]:border-transparent"
                    data-open={isOpen}
                  >
                    {item.q}
                    <Plus
                      aria-hidden
                      strokeWidth={1.5}
                      className={cn('size-4 shrink-0 text-ink-500 transition-transform duration-300', isOpen && 'rotate-45 text-navy-900')}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      initial={{height: 0, opacity: 0}}
                      animate={{height: 'auto', opacity: 1}}
                      exit={{height: 0, opacity: 0}}
                      transition={{duration: 0.3, ease: [0.22, 1, 0.36, 1]}}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-[14px] leading-relaxed text-ink-500">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <div className="mt-6 flex items-center gap-3 lg:hidden">
            <p className="text-[13px] text-ink-500">{t('more')}</p>
            <ButtonLink href="/contact" variant="navy" size="sm">
              {t('contact')}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
    </MotionConfig>
  );
}
