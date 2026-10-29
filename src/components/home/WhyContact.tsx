import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Check} from 'lucide-react';
import type {Locale} from '@/i18n/routing';
import {getPillars, site} from '@/content';
import {TagChip} from '@/components/ui/TagChip';
import {ContactForm} from './ContactForm';

export function WhyContact({locale}: {locale: Locale}) {
  const t = useTranslations('home.contact');
  const points = t.raw('why.points') as string[];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="on-dark scroll-mt-24 bg-[linear-gradient(180deg,var(--color-navy-700)_0%,var(--color-navy-500)_100%)] py-16 sm:py-24"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 gap-3 rounded-[1.75rem] bg-navy-900/45 p-3 ring-1 ring-white/10 lg:grid-cols-2">
          <div className="relative flex min-h-[30rem] flex-col justify-end overflow-hidden rounded-[1.4rem] p-6 sm:p-8">
            <Image
              src="/images/home/business-handshake.jpg"
              alt={t('why.alt')}
              fill
              sizes="(min-width: 1024px) 600px, 95vw"
              className="object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(14_35_71/0.15)_0%,rgb(14_35_71/0.65)_45%,rgb(14_35_71/0.95)_100%)]" />
            <div className="relative text-white">
              <TagChip tone="dark">{t('why.chip')}</TagChip>
              <h2 className="mt-4 text-[22px] leading-snug font-semibold sm:text-[26px]">{t('why.title')}</h2>
              <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-[13.5px] leading-snug text-white/85">
                    <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-gold-500 text-navy-900">
                      <Check aria-hidden strokeWidth={2.25} className="size-3" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative rounded-[1.4rem] p-5 text-white sm:p-8 lg:p-10">
            <TagChip tone="dark">{t('chip')}</TagChip>
            <h2 id="contact-title" className="title mt-4 text-white">
              <span className="block font-semibold">{t('title1')}</span>
              <span className="block font-normal">{t('title2')}</span>
            </h2>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/80">{t('body')}</p>
            <div className="mt-8">
              <ContactForm pillars={getPillars(locale)} whatsapp={site.phone.whatsapp} phoneDisplay={site.phone.display} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
