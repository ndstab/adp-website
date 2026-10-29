'use client';

import {useRef} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {ArrowLeft, ArrowRight, ArrowUpRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {Industry} from '@/content/schema';
import {SectionHeading} from '@/components/ui/SectionHeading';

export function IndustriesStrip({industries}: {industries: Industry[]}) {
  const t = useTranslations('home.industries');
  const track = useRef<HTMLUListElement>(null);

  // "Next" always means further along the reading direction, so it scrolls left in RTL.
  const scroll = (step: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === 'rtl';
    const card = el.querySelector('li')?.getBoundingClientRect().width ?? 320;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({left: (rtl ? -step : step) * (card + 16), behavior: reduce ? 'auto' : 'smooth'});
  };

  return (
    <section aria-labelledby="industries-title" className="py-20 sm:py-28">
      <div className="container-site flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading id="industries-title" chip={t('chip')} title1={t('title1')} title2={t('title2')} sub={t('sub')} />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={t('prev')}
            className="grid size-11 place-items-center rounded-full bg-white text-navy-900 shadow-pill ring-1 ring-navy-900/5 hover:bg-sand-100"
          >
            <ArrowLeft aria-hidden strokeWidth={1.5} className="size-4 rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={t('next')}
            className="grid size-11 place-items-center rounded-full bg-navy-700 text-white shadow-pill hover:bg-navy-900"
          >
            <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 rtl:-scale-x-100" />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:scroll-px-6 sm:px-6 lg:scroll-px-[max(2rem,calc((100vw-1240px)/2+2rem))] lg:px-[max(2rem,calc((100vw-1240px)/2+2rem))]"
      >
        {industries.map((industry) => (
          <li key={industry.slug} className="w-[78vw] max-w-[21rem] shrink-0 snap-start sm:w-[21rem]">
            <Link
              href={`/industries/${industry.slug}`}
              className="group relative flex h-[26rem] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] bg-navy-700 p-5 text-white"
            >
              <Image
                src={industry.image}
                alt={industry.imageAlt}
                fill
                sizes="(min-width: 640px) 336px, 78vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
              />
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(14_35_71/0)_30%,rgb(14_35_71/0.55)_58%,rgb(14_35_71/0.94)_100%)]" />
              <div className="relative">
                <h3 className="text-[18px] leading-snug font-semibold">{industry.name}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/80">{industry.summary}</p>
                <span className="label-caps mt-4 inline-flex items-center gap-1.5 text-gold-300">
                  {t('explore')}
                  <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
