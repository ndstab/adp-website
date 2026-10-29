import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Clock, Mail, MapPin, MessageCircle, Phone} from 'lucide-react';
import type {Locale} from '@/i18n/routing';
import {getPillars, site} from '@/content';
import {PageHero} from '@/components/page/PageHero';
import {Breadcrumbs} from '@/components/page/Breadcrumbs';
import {AddValue} from '@/components/ui/ReviewFlag';
import {ContactForm} from '@/components/home/ContactForm';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'company.contact.meta'});
  return pageMetadata({locale: locale as Locale, path: '/contact', title: t('title'), description: t('description')});
}

export default async function ContactPage({params}: Params) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  return <Contact locale={locale} />;
}

function Contact({locale}: {locale: Locale}) {
  const t = useTranslations('company.contact');
  const tf = useTranslations('common.footer');
  const tp = useTranslations('pages.breadcrumb');

  const rows = [
    {icon: Phone, label: tf('phone'), value: site.phone.display, href: `tel:${site.phone.e164}`, ltr: true},
    {icon: MessageCircle, label: tf('whatsapp'), value: site.phone.display, href: `https://wa.me/${site.phone.whatsapp}`, ltr: true, external: true},
    {icon: Mail, label: tf('email'), value: site.email, href: `mailto:${site.email}`, ltr: true},
    {icon: Clock, label: tf('hours'), value: site.hours[locale]},
    {icon: MapPin, label: t('details.hq'), value: site.city[locale]}
  ];

  return (
    <>
      <PageHero
        chip={t('hero.chip')}
        title1={t('hero.title1')}
        title2={t('hero.title2')}
        sub={t('hero.sub')}
        breadcrumbs={<Breadcrumbs items={[{label: tp('home'), href: '/'}, {label: t('hero.chip')}]} />}
      />

      <section aria-label={t('hero.chip')} className="container-site pb-20 sm:pb-28">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <div className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06] sm:p-8">
            <h2 className="text-[20px] font-semibold text-navy-900">{t('details.title')}</h2>
            <ul className="mt-6 grid gap-5">
              {rows.map(({icon: Icon, label, value, href, ltr, external}) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-navy-700 text-white ring-[1.5px] ring-gold-500">
                    <Icon aria-hidden strokeWidth={1.5} className="size-4" />
                  </span>
                  <div>
                    <p className="text-[12.5px] text-ink-500">{label}</p>
                    <p className="mt-0.5 text-[15px] font-medium text-navy-900">
                      {href ? (
                        <a href={href} dir={ltr ? 'ltr' : undefined} className="hover:text-blue-600" {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </p>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand-100 text-navy-900">
                  <MapPin aria-hidden strokeWidth={1.5} className="size-4" />
                </span>
                <div>
                  <p className="text-[12.5px] text-ink-500">{t('details.address')}</p>
                  <p className="mt-0.5 text-[15px] font-medium">
                    <AddValue value={site.nationalAddress} tone="light" />
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="on-dark rounded-[var(--radius-card)] bg-[linear-gradient(160deg,var(--color-navy-700),var(--color-navy-500))] p-5 text-white sm:p-8 lg:p-10">
            <ContactForm pillars={getPillars(locale)} whatsapp={site.phone.whatsapp} phoneDisplay={site.phone.display} />
          </div>
        </div>
      </section>
    </>
  );
}
