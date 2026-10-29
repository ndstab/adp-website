'use client';

import {useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {useTranslations} from 'next-intl';
import {Bot, Grip, MessageSquareReply, Play, Radio, Save, UserCheck} from 'lucide-react';
import {cn} from '@/lib/cn';
import {SectionHeading} from '@/components/ui/SectionHeading';

type Step = {title: string; body: string};
type Node = {tag: string; title: string; body: string};

const nodeIcons = [Radio, Bot, UserCheck, MessageSquareReply];
// Which canvas node each step lights up: Listens, Understands, Acts, Human-in-the-loop, Learns.
const stepToNode = [0, 1, 1, 2, 3];
// Nodes are laid out clockwise: Trigger (top-start) → AI worker (top-end) → Approval (bottom-end) → Response (bottom-start).
const nodeOrder = ['order-1', 'order-2', 'order-4', 'order-3'];
const STEP_MS = 3200;

const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

export function AgentWorkflow() {
  const t = useTranslations('home.agents');
  const steps = t.raw('steps') as Step[];
  const nodes = t.raw('canvas.nodes') as Node[];
  const rows = t.raw('canvas.summary.rows') as string[];

  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const section = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const reduce = useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => true);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {threshold: 0.35});
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || manual || reduce) return;
    const id = window.setInterval(() => setActive((s) => (s + 1) % steps.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [inView, manual, reduce, steps.length]);

  const activeNode = stepToNode[active];
  const learning = active === steps.length - 1;

  return (
    <section
      ref={section}
      aria-labelledby="agents-title"
      className="on-dark relative overflow-hidden bg-[linear-gradient(160deg,var(--color-navy-700)_0%,var(--color-navy-500)_100%)] py-20 text-white sm:py-28"
    >
      <div aria-hidden className="absolute -top-40 end-[-10%] size-[36rem] rounded-full bg-blue-400/15 blur-3xl" />
      <div className="container-site relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <SectionHeading id="agents-title" tone="dark" chip={t('chip')} title1={t('title1')} title2={t('title2')} sub={t('intro')} />

          <ol className="mt-10 grid gap-1">
            {steps.map((step, i) => {
              const isActive = i === active;
              return (
                <li key={step.title}>
                  <button
                    type="button"
                    onClick={() => {
                      setManual(true);
                      setActive(i);
                    }}
                    aria-current={isActive ? 'step' : undefined}
                    className={cn(
                      'group w-full rounded-xl border-s-2 px-4 py-3 text-start transition-colors',
                      isActive ? 'border-gold-500 bg-white/[0.07]' : 'border-white/10 hover:bg-white/[0.04]'
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className={cn('text-[11px] font-semibold tabular-nums', isActive ? 'text-gold-300' : 'text-white/75')}>
                        0{i + 1}
                      </span>
                      <span className={cn('text-[15px] font-semibold', isActive ? 'text-white' : 'text-white/80')}>{step.title}</span>
                    </span>
                    <span
                      className={cn(
                        'grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-soft)]',
                        isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="block ps-8 pt-1.5 text-[13.5px] leading-relaxed text-white/75">{step.body}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Workflow canvas */}
        <div className="relative">
          <div className="absolute -top-12 end-4 z-10 hidden w-60 rounded-2xl bg-white p-3.5 text-ink-900 shadow-float sm:block">
            <p className="text-[12px] font-semibold text-navy-900">{t('canvas.summary.title')}</p>
            <ul className="mt-2 grid gap-1">
              {rows.map((row) => (
                <li key={row} className="flex items-center gap-2 rounded-md bg-sand-50 px-2 py-1.5 text-[11.5px] text-ink-700">
                  <span aria-hidden className="size-1.5 rounded-full bg-gold-500" />
                  {row}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] bg-sand-50 p-3 text-ink-900 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.45)] sm:p-4">
            <div className="relative grid grid-cols-2 gap-3 pt-3 sm:pt-28">
              {/* Connectors between the four nodes */}
              <svg
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-3 bottom-0 h-[calc(100%-0.75rem)] w-full sm:top-28 sm:h-[calc(100%-7rem)] rtl:-scale-x-100"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {[
                  {d: 'M 46 25 L 54 25', seg: 1},
                  {d: 'M 75 46 L 75 54', seg: 2},
                  {d: 'M 54 75 L 46 75', seg: 3}
                ].map(({d, seg}) => (
                  <path
                    key={seg}
                    d={d}
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    strokeWidth="2"
                    strokeDasharray="3 4"
                    strokeLinecap="round"
                    className={cn('transition-[stroke] duration-500', activeNode >= seg ? 'stroke-gold-500' : 'stroke-navy-900/15')}
                  />
                ))}
              </svg>

              {nodes.map((node, i) => {
                const Icon = nodeIcons[i];
                const isActive = activeNode === i;
                const done = activeNode > i || learning;
                const isComm = i === nodes.length - 1;
                return (
                  <div
                    key={node.title}
                    className={cn(
                      nodeOrder[i],
                      'relative flex min-h-40 flex-col justify-between rounded-2xl p-4 transition-[background-color,box-shadow,transform] duration-500 sm:min-h-44',
                      isActive
                        ? 'bg-white shadow-card ring-1 ring-blue-600/25 motion-safe:-translate-y-0.5'
                        : 'bg-sand-100/80 ring-1 ring-navy-900/[0.05]'
                    )}
                  >
                    <div>
                      <p className="flex items-center gap-2 text-[13px] font-semibold text-navy-900">
                        <Icon aria-hidden strokeWidth={1.5} className={cn('size-4', isActive ? 'text-blue-600' : 'text-ink-500')} />
                        {node.title}
                      </p>
                      <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-500">{node.body}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className={cn(
                          'label-caps rounded px-1.5 py-1 !text-[9.5px]',
                          isComm && (isActive || done) ? 'bg-gold-500 text-navy-900' : 'bg-white text-ink-500 ring-1 ring-navy-900/[0.06]'
                        )}
                      >
                        {node.tag}
                      </span>
                      {done && !isActive && <span aria-hidden className="size-1.5 rounded-full bg-success" />}
                      {isActive && <span aria-hidden className="size-1.5 rounded-full bg-blue-600 motion-safe:animate-pulse" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white p-2 ps-3 shadow-[0_1px_2px_rgb(14_35_71/0.05)]">
              <Grip aria-hidden strokeWidth={1.5} className="size-4 text-ink-500" />
              <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-navy-900">{t('canvas.workflow')}</span>
              <span className="label-caps hidden items-center gap-1.5 !text-[9.5px] text-success sm:flex">
                <span className="size-1.5 rounded-full bg-success motion-safe:animate-pulse-dot" />
                {t('canvas.live')}
              </span>
              <span aria-hidden className="label-caps inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 !text-[9.5px] text-ink-700 ring-1 ring-navy-900/10">
                <Save strokeWidth={1.5} className="size-3" />
                {t('canvas.save')}
              </span>
              <span aria-hidden className="label-caps inline-flex items-center gap-1 rounded-full bg-navy-700 px-2.5 py-1.5 !text-[9.5px] text-white">
                <Play strokeWidth={1.5} className="size-3 rtl:-scale-x-100" />
                {t('canvas.activate')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
