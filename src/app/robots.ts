import type {MetadataRoute} from 'next';
import {reviewMode} from '@/lib/review';
import {siteUrl} from '@/lib/seo';

// While NEXT_PUBLIC_REVIEW_MODE is on, the whole site stays out of search engines.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: reviewMode ? {userAgent: '*', disallow: '/'} : {userAgent: '*', allow: '/'},
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
