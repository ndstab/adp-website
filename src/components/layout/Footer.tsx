import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {ArrowUpRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {site} from '@/content';
import {isPlaceholder} from '@/lib/review';
import {AddValue} from '@/components/ui/ReviewFlag';
import {NewsletterForm} from './NewsletterForm';
import {FooterWordmark} from './FooterWordmark';
import {CookieSettingsButton} from './CookieConsent';

const menu = [
  {href: '/', key: 'home'},
  {href: '/about', key: 'about'},
  {href: '/our-model', key: 'model'},
  {href: '/solutions', key: 'solutions'},
  {href: '/industries', key: 'industries'},
  {href: '/vision-2030', key: 'vision'},
  {href: '/compliance', key: 'compliance'},
  {href: '/insights', key: 'insights'},
  {href: '/alliance', key: 'alliance'},
  {href: '/careers', key: 'careers'},
  {href: '/contact', key: 'contact'}
] as const;

const card = 'rounded-[var(--radius-card)] bg-white/[0.07] p-5 ring-1 ring-white/10 backdrop-blur-sm';

export function Footer() {
  const t = useTranslations('common');
  const locale = useLocale() as Locale;
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark relative overflow-hidden bg-[linear-gradient(180deg,var(--color-navy-500)_0%,var(--color-navy-700)_55%,var(--color-navy-900)_100%)] text-white">
      <div className="container-site pt-10 sm:pt-14">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <section aria-labelledby="footer-newsletter" className={`${card} relative flex flex-col justify-between gap-6`}>
            <div>
              <Image src="/brand/adp-logo-white.png" alt="ADP Solutions" width={967} height={269} sizes="130px" className="h-9 w-auto" />
              <h2 id="footer-newsletter" className="mt-5 text-[15px] font-semibold">
                {t('footer.newsletter.title')}
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/80">{t('footer.newsletter.body')}</p>
            </div>
            <NewsletterForm />
          </section>

          <nav aria-labelledby="footer-menu" className={card}>
            <h2 id="footer-menu" className="text-[15px] font-semibold">
              {t('footer.menu')}
            </h2>
            <ul className="mt-4 grid gap-x-4 gap-y-2.5 text-sm text-white/75 sm:grid-cols-1 xl:grid-cols-1">
              {menu.map(({href, key}) => (
                <li key={key} className="flex items-center gap-2">
                  <span aria-hidden className="size-1 rounded-full bg-gold-500" />
                  <Link href={href} className="hover:text-white">
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-connect" className={card}>
            <h2 id="footer-connect" className="text-[15px] font-semibold">
              {t('footer.connect')}
            </h2>
            <ul className="mt-4 grid gap-2.5 text-sm text-white/75">
              {(['linkedin', 'x', 'instagram'] as const).map((key) => (
                <li key={key} className="flex items-center gap-2">
                  <span aria-hidden className="size-1 rounded-full bg-gold-500" />
                  {isPlaceholder(site.socials[key]) ? (
                    <span>
                      {t(`footer.social.${key}`)} <AddValue value={site.socials[key]} className="text-xs" />
                    </span>
                  ) : (
                    <a href={site.socials[key]} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      {t(`footer.social.${key}`)}
                      <span className="sr-only"> ({t('a11y.newTab')})</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <dl className="mt-5 grid gap-2 border-t border-white/10 pt-4 text-[13px]">
              <div className="flex flex-wrap justify-between gap-x-3">
                <dt className="text-white/80">{t('footer.phone')}</dt>
                <dd>
                  <a href={`tel:${site.phone.e164}`} dir="ltr" className="hover:text-gold-300">
                    {site.phone.display}
                  </a>
                </dd>
              </div>
              <div className="flex flex-wrap justify-between gap-x-3">
                <dt className="text-white/80">{t('footer.whatsapp')}</dt>
                <dd>
                  <a href={`https://wa.me/${site.phone.whatsapp}`} target="_blank" rel="noopener noreferrer" dir="ltr" className="hover:text-gold-300">
                    {site.phone.display}
                    <span className="sr-only"> ({t('a11y.newTab')})</span>
                  </a>
                </dd>
              </div>
              <div className="flex flex-wrap justify-between gap-x-3">
                <dt className="text-white/80">{t('footer.email')}</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="hover:text-gold-300">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="grid gap-0.5">
                <dt className="text-white/80">{t('footer.hours')}</dt>
                <dd className="text-white/80">{site.hours[locale]}</dd>
              </div>
            </dl>
          </section>

          <Link href="/insights" className={`${card} group flex flex-col !p-2.5 transition-colors hover:bg-white/[0.1]`}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image
                src="/images/home/riyadh-night-skyline.jpg"
                alt={t('footer.insight.alt')}
                fill
                sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 92vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex flex-1 flex-col p-2.5 pt-4">
              <p className="label-caps text-gold-300">{t('footer.insight.label')}</p>
              <h2 className="mt-2 flex items-start justify-between gap-2 text-[15px] leading-snug font-semibold">
                {t('footer.insight.title')}
                <ArrowUpRight aria-hidden strokeWidth={1.5} className="mt-0.5 size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/80">{t('footer.insight.excerpt')}</p>
            </div>
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 text-xs text-white/80 lg:flex-row lg:items-center lg:justify-between">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>
              © {year} {site.brand}. {t('footer.rights')}
            </span>
            <span aria-hidden className="text-white/30">|</span>
            <span>{site.legalName[locale]}</span>
            <span aria-hidden className="text-white/30">|</span>
            <span>
              {t('footer.cr')}: <AddValue value={site.cr} />
            </span>
            <span aria-hidden className="text-white/30">·</span>
            <span>
              {t('footer.vat')}: <AddValue value={site.vat} />
            </span>
            <span aria-hidden className="text-white/30">·</span>
            <span>
              {t('footer.address')}: <AddValue value={site.nationalAddress} />
            </span>
          </p>
          <ul className="flex gap-4">
            {(['privacy', 'cookies', 'terms'] as const).map((key) => (
              <li key={key}>
                <Link href={`/${key}`} className="hover:text-white">
                  {t(`footer.${key}`)}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton tone="dark" />
            </li>
          </ul>
        </div>
      </div>

      <FooterWordmark />
    </footer>
  );
}
