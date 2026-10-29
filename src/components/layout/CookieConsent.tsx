'use client';

import {useEffect, useState, useSyncExternalStore} from 'react';
import Script from 'next/script';
import {useTranslations} from 'next-intl';
import {Cookie} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {buttonClass} from '@/components/ui/Button';
import {cn} from '@/lib/cn';

type Consent = 'analytics' | 'necessary';

const COOKIE = 'adp_consent';
const OPEN_EVENT = 'adp:open-consent';
const CHANGE_EVENT = 'adp:consent-change';
const SIX_MONTHS = 60 * 60 * 24 * 182;

function readConsent(): Consent | null {
  const match = document.cookie.match(/(?:^|;\s*)adp_consent=(analytics|necessary)/);
  return (match?.[1] as Consent) ?? null;
}

function writeConsent(value: Consent) {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE}=${value}; Max-Age=${SIX_MONTHS}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

const noopSubscribe = () => () => {};

/** Current consent; null on the server and until the visitor chooses. */
function useConsent() {
  return useSyncExternalStore(subscribe, readConsent, () => null);
}

/**
 * PDPL-style consent: nothing beyond necessary cookies until the visitor opts in.
 * Analytics loads only after "Accept analytics" and only when a script URL is configured.
 */
export function CookieConsent() {
  const t = useTranslations('legal.consent');
  const consent = useConsent();
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const reopen = () => setReopened(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  // Rendered only on the client, so returning visitors never see a flash of the banner.
  const open = hydrated && (consent === null || reopened);

  const choose = (value: Consent) => {
    writeConsent(value);
    setReopened(false);
  };

  const analyticsSrc = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL;

  return (
    <>
      {consent === 'analytics' && analyticsSrc && (
        <Script src={analyticsSrc} data-domain={process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN} strategy="afterInteractive" />
      )}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl bg-white p-5 shadow-float ring-1 ring-navy-900/10 sm:inset-x-auto sm:start-5 sm:bottom-5"
        >
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-700 text-gold-500">
              <Cookie aria-hidden strokeWidth={1.5} className="size-4" />
            </span>
            <div>
              <p id="consent-title" className="text-[15px] font-semibold text-navy-900">
                {t('title')}
              </p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink-500">
                {t('body')}{' '}
                <Link prefetch={false} href="/cookies" className="text-blue-600 underline underline-offset-2">
                  {t('policy')}
                </Link>
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => choose('necessary')} className={buttonClass('navy', undefined, 'sm')}>
              {t('reject')}
            </button>
            <button type="button" onClick={() => choose('analytics')} className={buttonClass('gold', undefined, 'sm')}>
              {t('accept')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Reopens the consent dialog; used in the footer and on the Cookie Policy page. */
export function CookieSettingsButton({className, tone = 'light'}: {className?: string; tone?: 'light' | 'dark'}) {
  const t = useTranslations('legal.consent');
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className={cn(tone === 'dark' ? 'hover:text-white' : buttonClass('navy', undefined, 'sm'), className)}
    >
      {t('settings')}
    </button>
  );
}
