'use client';

import {useEffect, useId, useRef, useState, type CSSProperties} from 'react';
import {useTranslations} from 'next-intl';
import {ArrowRight, Pause, Play} from 'lucide-react';
import type {Pillar} from '@/content/schema';
import {ArcBand} from '@/components/ui/ArcBand';
import {PillarIcon} from '@/components/ui/PillarIcon';
import {VerifyFlag} from '@/components/ui/ReviewFlag';
import {cn} from '@/lib/cn';
import styles from './PillarOrbit.module.css';

export const PILLAR_EVENT = 'adp:select-pillar';

const DURATION = 40; // seconds for one badge to travel 150° → 330°
const SPAN = 180;
const SPACING = SPAN / 5;
// Resting angles for reduced motion, spread across the visible part of the arc.
const REST = [192, 216, 240, 264, 288];

/** Delay that places the n-th badge (0-based) so badge 0 is at the apex label on load. */
function delayFor(n: number) {
  const start = (((108 - n * SPACING) % SPAN) + SPAN) % SPAN; // degrees past 150°
  return `${(-start / SPAN) * DURATION}s`;
}

export function PillarOrbit({pillars}: {pillars: Pillar[]}) {
  const t = useTranslations('home.hero.orbit');
  const uid = useId().replace(/:/g, '');
  const stage = useRef<HTMLDivElement>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const select = (id: Pillar['id']) => {
    window.dispatchEvent(new CustomEvent(PILLAR_EVENT, {detail: id}));
  };

  return (
    <div
      ref={stage}
      role="group"
      aria-label={t('label')}
      className={styles.stage}
      data-paused={userPaused || offscreen ? 'true' : 'false'}
    >
      <div className={styles.box}>
        <ArcBand id={uid} className={styles.band} />

        <ul className="absolute inset-0">
          {pillars.map((pillar, n) => {
            const rest = REST[n];
            const rad = (rest * Math.PI) / 180;
            const style = {
              '--delay': delayFor(n),
              '--rest': `${rest}deg`,
              '--rest-ux': (-Math.cos(rad)).toFixed(3),
              '--rest-uy': (-Math.sin(rad)).toFixed(3)
            } as CSSProperties;
            const tipId = `${uid}-tip-${pillar.id}`;
            return (
              <li key={pillar.id} className={styles.arm} style={style}>
                <div className={styles.offset}>
                  <div aria-hidden className={styles.trail} />
                  <div className={styles.upright}>
                    <div className={cn(styles.unmirror, 'absolute top-0 left-0 size-0')}>
                      <button
                        type="button"
                        className={styles.badge}
                        aria-label={pillar.name}
                        aria-describedby={tipId}
                        onClick={() => select(pillar.id)}
                      >
                        <PillarIcon icon={pillar.icon} />
                      </button>

                      <span
                        aria-hidden
                        className={cn(
                          styles.pill,
                          'flex w-max max-w-[min(80vw,340px)] items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-[12px] leading-tight shadow-pill ring-1 ring-navy-900/5 backdrop-blur'
                        )}
                      >
                        <span className={cn(styles.full, 'font-semibold text-navy-900')}>{pillar.name}</span>
                        <span className={cn(styles.compact, 'font-semibold text-navy-900')}>{pillar.label}</span>
                        <span className={cn(styles.full, 'flex items-center gap-2 text-ink-500')}>
                          {pillar.outcome.label}
                          {pillar.outcome.verify && <VerifyFlag />}
                        </span>
                      </span>

                      <div
                        id={tipId}
                        role="tooltip"
                        className={cn(styles.tooltip, 'w-64 rounded-2xl bg-white p-4 text-start shadow-float ring-1 ring-navy-900/5')}
                      >
                        <p className="text-[13px] font-semibold text-navy-900">{pillar.name}</p>
                        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-500">{pillar.short}</p>
                        <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px] text-blue-600">
                          {pillar.outcome.label}
                          {pillar.outcome.verify && <VerifyFlag />}
                        </p>
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => select(pillar.id)}
                          className="label-caps mt-3 inline-flex items-center gap-1.5 text-navy-900 hover:text-blue-600"
                        >
                          {t('view')}
                          <ArrowRight aria-hidden strokeWidth={1.5} className="size-3.5 rtl:-scale-x-100" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Reduced motion on small screens: labels as a list under the arc. */}
      <ul className={cn(styles.legend, 'absolute inset-x-0 bottom-0 gap-1.5 px-1')}>
        {pillars.map((pillar) => (
          <li key={pillar.id} className="flex items-center gap-2 text-[12.5px] text-ink-700">
            <span className="size-1.5 rounded-full bg-gold-500" />
            <span className="font-semibold text-navy-900">{pillar.name}</span>
            <span className="text-ink-500">{pillar.outcome.label}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        data-pause-control
        onClick={() => setUserPaused((p) => !p)}
        aria-pressed={userPaused}
        aria-label={userPaused ? t('play') : t('pause')}
        className="pointer-events-auto absolute end-3 bottom-3 grid size-9 place-items-center rounded-full bg-white/80 text-navy-900 shadow-pill ring-1 ring-navy-900/5 backdrop-blur transition-colors hover:bg-white lg:end-6 lg:bottom-6"
      >
        {userPaused ? <Play aria-hidden strokeWidth={1.5} className="size-4" /> : <Pause aria-hidden strokeWidth={1.5} className="size-4" />}
      </button>
    </div>
  );
}
