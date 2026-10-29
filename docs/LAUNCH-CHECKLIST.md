# Launch checklist

Everything that must be supplied, confirmed or verified before adpway.com goes live. Item-by-item locations in the content files are in `REVIEW-ITEMS.md`, which is not in version control; generate it with `npm run review -- --write`. Tick items off here as they close.

## 1. Information ADP must supply [ADD]

- [ ] Commercial Registration (CR) number: `content/site.json` → `cr`
- [ ] VAT registration number: `content/site.json` → `vat`
- [ ] National Address: `content/site.json` → `nationalAddress`
- [ ] Social profile URLs (LinkedIn, X, Instagram): `content/site.json` → `socials` (links appear automatically, and schema.org `sameAs` updates)
- [ ] About page stats: founded year, team size, projects delivered (`content/{ar,en}/company.json` → `about.stats`)
- [ ] Leadership names, roles and photos (`about.leadership.members`; add photos to `public/images/about/` and wire them into the About page)
- [ ] Legal pages: "last updated" date (`legal.updatedValue`), retention periods for enquiries and applicants (Privacy §7), analytics cookie name and duration (Cookie table)
- [ ] Final photography: every file listed in `public/images/README.md`, with model releases for any people shown
- [ ] Vector (SVG) logo, then run `npm run generate:og` and replace `src/app/icon.png` / `apple-icon.png`
- [ ] Form delivery credentials: `RESEND_API_KEY` or SMTP settings, plus a verified sender address

## 2. Assumptions to confirm [CONFIRM]

- [ ] Official Arabic legal name. Draft: «حلول المسار الرقمي المتقدم»
- [ ] Brand inside Arabic sentences stays Latin ("ADP Solutions")
- [ ] Arabic hero headline adaptation: «تقنيات ذكية. / مصمَّمة لطموح المملكة.»
- [ ] Business hours: Sunday–Thursday, 09:00–18:00 AST
- [ ] +966 55 358 4835 is also the WhatsApp number
- [ ] Form recipient info@adpway.com; careers applications also go there until a careers inbox exists
- [ ] Newsletter provider (sign-ups currently e-mail the same inbox)
- [ ] Analytics provider (nothing loads until configured and consented)
- [ ] Hosting and e-mail providers and where they store data (Privacy Policy §5)
- [ ] Contact person for PDPL data-subject requests (Privacy Policy §10)
- [ ] Whether ADP holds an LCGPA local-content certificate (the site says only that ADP *supports* local-content commitments)
- [ ] Expansion order (Riyadh → Eastern Province & Jeddah → GCC), the four lead offers and the six priority sectors
- [ ] Design decisions made for accessibility and speed:
  - [ ] `ink-500` grey darkened from #6B7280 to #616874 to pass WCAG AA on the warm sand backgrounds
  - [ ] Arabic text uses IBM Plex Sans Arabic Regular and SemiBold only (Medium renders as Regular)

## 3. Claims to verify against a current source (VERIFY)

Market statistics, all footnoted and stored in `content/sources.json` (add a `url` to each once verified):

- [ ] 2026 declared Saudi Arabia's Year of AI (SDAIA)
- [ ] Saudi AI market ≈ USD 976M (2026) → ≈ USD 5.1B (2031), 26.6% CAGR (MarketsandMarkets)
- [ ] NSDAI 2030 targets: SAR 75B investment, 40% workforce basic skills, 20,000 specialists, 300+ startups, top 15 globally
- [ ] Digital economy ≈ SAR 495B (2024), ≈ 15% of GDP (publisher to confirm)
- [ ] Cybersecurity market ≈ USD 2.4B (2026) → ≈ USD 4.0B (2031) (publisher to confirm)
- [ ] PDPL enforcement from 14 September 2024; NCA control set names; Cloud First policy owner
- [ ] LCGPA 30% minimum for certain government IT/consulting tenders; RHQ programme 750+
- [ ] ≈ 90% of urban water from desalination by 2030

Typical outcomes (always labelled "typical" on the site):

- [ ] Homepage: 20%+ software cost reduction, 90%+ alarm noise suppressed, < 90 s network fault remediation, ~6 months payback
- [ ] Hero badge tags: 24/7 in Arabic; every copy traceable; 20%+ IT savings; < 90 s fault fix; live water & energy
- [ ] IT Cost Optimization: 20%+, 5× faster audit response, 75% less unbudgeted spend, ~6 months payback
- [ ] Smart Network Management: 90%+ alarm suppression, < 90 s fault storms, proven at tier-1 telecom scale
- [ ] Agentic AI: 24/7 coverage, lower cost per request, higher conversion, ~6 months payback
- [ ] Data-Leak Protection: every copy traceable; every blocked capture attempt logged

Regulatory references:

- [ ] NCA Data Cybersecurity Controls items on the Data-Leak Protection page (meetings, screen capture, watermarking) and the ECC data-labelling item. Clause numbers are deliberately **not** shown; add them only after checking current NCA texts
- [ ] "Frameworks we align to" lists (Cybersecurity, Data-Leak Protection, industry pages), including the NCA OT controls name on Energy & Utilities
- [ ] GACA rules for drone operations (Drone page, Giga-projects page)
- [ ] Vision Realization Program mapping on every solution and industry page and on the Vision 2030 page
- [ ] VERIFY points inside the four insight articles

## 4. Reviews

- [ ] Native Saudi business-Arabic review of **all** Arabic copy (`content/ar/**`, `content/insights/ar/**`)
- [ ] Qualified Saudi counsel reviews Privacy, Terms and Cookie Policy; then remove the "draft" notice (`legal.draft`)
- [ ] Approve the four insight drafts; remove the "Draft" badges
- [ ] Brand check: no partner names, product names, logos or screenshots anywhere (last sweep: clean)

## 5. Technical go-live

- [ ] Set `NEXT_PUBLIC_SITE_URL=https://adpway.com` and **`NEXT_PUBLIC_REVIEW_MODE=false`** (this hides VERIFY markers and allows indexing). Rebuild.
- [ ] Configure Resend or SMTP; submit each form (contact, newsletter, alliance) once and confirm delivery
- [ ] Build the Docker image once in CI or on the target host (not built locally; Docker is not installed on the development Mac)
- [ ] DNS and TLS for adpway.com (and redirect www → apex or the reverse)
- [ ] Submit `https://adpway.com/sitemap.xml` to Google Search Console and Bing Webmaster Tools
- [ ] If analytics is added: set `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL`, add its origin to the CSP in `next.config.ts`, and update the Cookie Policy table
- [ ] With more than one server instance, move the form rate limiter to a shared store (`src/lib/rate-limit.ts`)
- [ ] Re-run Lighthouse on the live domain (last local run: Accessibility, Best Practices and SEO 100; Performance 91–97 on mobile)
