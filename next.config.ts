import type {NextConfig} from 'next';
import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
// Insights are .mdx files imported by slug, not routed as pages.
const withMDX = createMDX({});

// Pages are pre-rendered static HTML, so a nonce-based CSP is not possible; inline
// scripts (Next's bootstrap and JSON-LD) are allowed, everything else is same-origin.
const analyticsOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL ? new URL(process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL).origin : '';
  } catch {
    return '';
  }
})();

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${analyticsOrigin}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${analyticsOrigin}`.trim(),
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'"
].join('; ');

const securityHeaders = [
  {key: 'Content-Security-Policy', value: csp},
  {key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload'},
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'X-Frame-Options', value: 'DENY'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'}
];

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp']
  },
  async headers() {
    // Dev needs eval for fast refresh, so the policy applies to production builds only.
    if (process.env.NODE_ENV !== 'production') return [];
    return [{source: '/:path*', headers: securityHeaders}];
  }
};

export default withNextIntl(withMDX(nextConfig));
