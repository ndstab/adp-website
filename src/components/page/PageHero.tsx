import Image from 'next/image';
import type {ReactNode} from 'react';
import type {Pillar} from '@/content/schema';
import {TagChip} from '@/components/ui/TagChip';
import {ArcBand} from '@/components/ui/ArcBand';
import {PillarBadge} from '@/components/ui/PillarBadge';

type Base = {chip: string; title1: string; title2?: string; sub?: string; breadcrumbs?: ReactNode; children?: ReactNode};

/** Light inner-page hero with a static slice of the sunrise arc on the end side. */
export function PageHero({chip, title1, title2, sub, breadcrumbs, children, icon}: Base & {icon?: Pillar['icon']}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_12%_0%,#ffffff_0%,rgb(255_255_255/0)_70%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-[16rem] -bottom-[24rem] -z-10 hidden size-[46rem] [mask-image:linear-gradient(to_bottom,#000_35%,transparent_62%)] lg:block xl:-end-[10rem] rtl:-scale-x-100"
      >
        <ArcBand id="page-hero-arc" className="size-full" />
        {icon && <PillarBadge icon={icon} className="absolute top-0 left-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rtl:-scale-x-100" />}
      </div>
      <div className="container-site pt-32 pb-16 sm:pt-36 sm:pb-20 lg:min-h-[34rem]">
        {breadcrumbs}
        <div className="mt-8 max-w-[44rem]">
          <TagChip tone="hero">{chip}</TagChip>
          <h1 className="display mt-6 text-balance text-navy-900">
            <span className="block font-semibold">{title1}</span>
            {title2 && <span className="block font-normal">{title2}</span>}
          </h1>
          {sub && <p className="mt-6 max-w-[36rem] text-[16px] leading-relaxed text-ink-700 sm:text-[17px]">{sub}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

/**
 * Full-width photo band with a dark gradient on the start side (reference "About" style).
 * It starts below the floating navbar, so the navbar always sits on a light background.
 */
export function PhotoHero({chip, title1, title2, sub, breadcrumbs, children, image, alt}: Base & {image: string; alt: string}) {
  return (
    <section className="pt-28 sm:pt-32">
      <div className="container-site pb-5">{breadcrumbs}</div>
      <div className="on-dark relative overflow-hidden bg-navy-900 text-white">
        <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgb(14_35_71/0.94)_0%,rgb(14_35_71/0.78)_38%,rgb(14_35_71/0.15)_80%)] rtl:bg-[linear-gradient(270deg,rgb(14_35_71/0.94)_0%,rgb(14_35_71/0.78)_38%,rgb(14_35_71/0.15)_80%)]"
        />
        <div className="container-site relative flex min-h-[26rem] items-center py-16 sm:py-20 lg:min-h-[32rem]">
          <div className="max-w-[40rem]">
            <TagChip tone="dark">{chip}</TagChip>
            <h1 className="display mt-6 text-balance text-white">
              <span className="block font-semibold">{title1}</span>
              {title2 && <span className="block font-normal">{title2}</span>}
            </h1>
            {sub && <p className="mt-6 max-w-[34rem] text-[16px] leading-relaxed text-white/80 sm:text-[17px]">{sub}</p>}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
