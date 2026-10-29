'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {ArrowUpRight, Menu, X} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {cn} from '@/lib/cn';
import {buttonClass} from '@/components/ui/Button';
import {LanguageToggle} from './LanguageToggle';

// Navigation links hold their prefetch until the browser is idle after first load: prefetching
// straight away competed with the hero for bandwidth on mobile, but leaving it off made every
// nav click wait for the route payload. Once idle, the four pages are already in the cache.
const links = [
  {href: '/about', key: 'about'},
  {href: '/solutions', key: 'solutions'},
  {href: '/industries', key: 'industries'},
  {href: '/insights', key: 'insights'}
] as const;

export function Header() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [prefetch, setPrefetch] = useState<undefined | false>(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    const hasIdle = typeof requestIdleCallback === 'function';
    let idle = 0;
    const enable = () => setPrefetch(undefined);
    const schedule = () => {
      idle = hasIdle ? requestIdleCallback(enable, {timeout: 2500}) : (setTimeout(enable, 1500) as unknown as number);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, {once: true});
    return () => {
      window.removeEventListener('load', schedule);
      if (hasIdle) cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the sheet on Escape and lock page scroll while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:pt-4">
      <a
        href="#main"
        className="label-caps pointer-events-auto absolute start-4 top-4 -translate-y-24 rounded-full bg-navy-700 px-4 py-3 text-white focus:translate-y-0"
      >
        {t('a11y.skip')}
      </a>
      <nav
        aria-label={t('a11y.mainNav')}
        className={cn(
          'pointer-events-auto mx-auto flex max-w-[1180px] items-center gap-2 rounded-full py-2 ps-2 pe-2 transition-[background-color,box-shadow,backdrop-filter] duration-300',
          scrolled || open
            ? 'bg-sand-50/80 shadow-[0_10px_30px_-18px_rgb(14_35_71/0.45)] ring-1 ring-navy-900/[0.06] backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        <Link prefetch={prefetch}
          href="/"
          aria-label={t('a11y.home')}
          className="flex h-11 shrink-0 items-center rounded-full bg-white px-3.5 shadow-pill"
        >
          <Image src="/brand/adp-mark.png" alt="" width={427} height={248} priority sizes="40px" className="h-[22px] w-auto" />
        </Link>

        <ul className="ms-3 hidden items-center lg:flex">
          {links.map(({href, key}) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={key}>
                <Link prefetch={prefetch}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'label-caps rounded-full px-3.5 py-2.5 transition-colors hover:text-blue-600',
                    active ? 'text-blue-600' : 'text-ink-900'
                  )}
                >
                  {t(`nav.${key}`)}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ms-auto flex items-center gap-2">
          <Link prefetch={prefetch}
            href="/vision-2030"
            className="group hidden items-center gap-2.5 rounded-full px-3 py-2 xl:flex"
          >
            <span className="label-caps rounded-md bg-gold-300/60 px-1.5 py-1 !text-[10px] text-navy-900">{t('nav.newsBadge')}</span>
            <span className="label-caps text-ink-900 transition-colors group-hover:text-blue-600">{t('nav.news')}</span>
            <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-3.5 text-ink-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
          </Link>
          <span className="hidden sm:contents">
            <Link prefetch={prefetch} href="/contact" className={buttonClass('white', 'h-11')}>
              {t('nav.cta')}
            </Link>
          </span>
          <LanguageToggle />
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
            className="grid size-11 place-items-center rounded-full bg-white text-navy-900 shadow-pill lg:hidden"
          >
            {open ? <X aria-hidden strokeWidth={1.5} className="size-5" /> : <Menu aria-hidden strokeWidth={1.5} className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
          <div
            id="mobile-menu"
            className="animate-sheet-in pointer-events-auto mx-auto mt-2 max-w-[1180px] rounded-3xl bg-sand-50/95 p-3 shadow-float ring-1 ring-navy-900/[0.06] backdrop-blur-xl lg:hidden"
          >
            <ul className="grid gap-1">
              {[{href: '/', key: 'home'} as const, ...links, {href: '/contact', key: 'contact'} as const].map(({href, key}) => (
                <li key={key}>
                  <Link prefetch={prefetch}
                    href={href}
                    onClick={close}
                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-medium text-navy-900 hover:bg-white"
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
            <Link prefetch={prefetch} href="/vision-2030" onClick={close} className="mt-2 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3.5">
              <span className="label-caps rounded-md bg-gold-300/60 px-1.5 py-1 !text-[10px] text-navy-900">{t('nav.newsBadge')}</span>
              <span className="text-sm font-medium text-ink-900">{t('nav.news')}</span>
            </Link>
            <Link prefetch={prefetch} href="/contact" onClick={close} className={buttonClass('gold', 'mt-2 w-full sm:hidden')}>
              {t('nav.cta')}
            </Link>
          </div>
      )}
    </header>
  );
}
