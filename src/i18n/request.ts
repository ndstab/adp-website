import {hasLocale} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const [common, home, pages, company, legal] = await Promise.all([
    import(`../../content/${locale}/common.json`),
    import(`../../content/${locale}/home.json`),
    import(`../../content/${locale}/pages.json`),
    import(`../../content/${locale}/company.json`),
    import(`../../content/${locale}/legal.json`)
  ]);

  return {
    locale,
    timeZone: 'Asia/Riyadh',
    messages: {common: common.default, home: home.default, pages: pages.default, company: company.default, legal: legal.default}
  };
});
