# Launch checklist

Everything that must be supplied, confirmed or verified before adpway.com goes live. Item-by-item locations in the content files are in `REVIEW-ITEMS.md`, which is not in version control; generate it with `npm run review -- --write`. Tick items off here as they close.

## 1. Information ADP must supply [ADD]

- [ ] Commercial Registration (CR) number: `content/site.json` → `cr`
- [ ] VAT registration number: `content/site.json` → `vat`
- [ ] National Address: `content/site.json` → `nationalAddress`
- [ ] Social profile URLs (LinkedIn, X, Instagram): `content/site.json` → `socials` (links appear automatically, and schema.org `sameAs` updates)
- [ ] Leadership names, roles and photos (`about.leadership.members`; add photos to `public/images/about/` and wire them into the About page)
- [ ] Legal pages: "last updated" date (`legal.updatedValue`), retention periods for enquiries and applicants (Privacy §7), analytics cookie name and duration (Cookie table)
- [ ] Final photography: every file listed in `public/images/README.md`, with model releases for any people shown
- [ ] Vector (SVG) logo, then run `npm run generate:og` and replace `src/app/icon.png` / `apple-icon.png`
- [ ] Form delivery credentials: `RESEND_API_KEY` or SMTP settings, plus a verified sender address

## 2. Assumptions to confirm [CONFIRM]

- [ ] Official Arabic legal name. Draft: «حلول المسار الرقمي المتقدم»
- [ ] Brand inside Arabic sentences stays Latin ("ADP Solutions")
- [ ] Arabic hero headline adaptation (see `content/ar/home.json` → `hero.title1` / `title2`)
- [ ] Business hours: Sunday–Thursday, 09:00–18:00 AST
- [ ] +966 55 358 4835 is also the WhatsApp number
- [ ] Form recipient (site now shows sales@adpway.com; `CONTACT_TO_EMAIL` still defaults to info@adpway.com); careers applications also go there until a careers inbox exists
- [ ] Newsletter provider (sign-ups currently e-mail the same inbox)
- [ ] Analytics provider (nothing loads until configured and consented)
- [ ] Hosting and e-mail providers and where they store data (Privacy Policy §5)
- [ ] Contact person for PDPL data-subject requests (Privacy Policy §10)
- [ ] Whether ADP holds an LCGPA local-content certificate (the site says only that ADP *supports* local-content commitments)
- [ ] The four lead offers on the About page (Sovereign AI Platform, Agentic AI Platform, IoT & Edge Intelligence, Cybersecurity Consultation & Compliance)
- [ ] Design decisions made for accessibility and speed:
  - [ ] `ink-500` grey darkened from #6B7280 to #616874 to pass WCAG AA on the warm sand backgrounds
  - [ ] Arabic text uses IBM Plex Sans Arabic Regular and SemiBold only (Medium renders as Regular)

## 3. Claims to verify against a current source (VERIFY)

All site copy now follows the two ADP decks (Portfolio Summary Partner Briefing v3, Solutions Portfolio v1.2). Anything below came from those decks and still needs a source check before launch.

Market statistics, all footnoted and stored in `content/sources.json` (add a `url` to each once verified):

- [ ] Saudi AI market USD 2.1B (2025) → USD 16.9B (2032), 34.3% CAGR (MarketsandMarkets)
- [ ] Cybersecurity USD 2.9B (2025) → USD 7.5B (2034), 11.3% CAGR (IMARC Group)
- [ ] Internet of Things USD 10.7B (2025) → USD 30.3B (2034), 12.3% CAGR (IMARC Group)
- [ ] Conversational AI 29.8% CAGR to 2034, from USD 159M in 2025 (IMARC Group)
- [ ] Blockchain USD 381M (2025) → USD 38.1B (2034), 64.8% CAGR (IMARC Group)

Partner and platform-vendor figures (shown with a VERIFY marker; the site says they are vendor figures reported as averages):

- [ ] IoT & Edge Intelligence: 30,000+ IoT devices deployed in live operation by the partner
- [ ] Agentic AI Platform: 100M+ interactions, 50+ customers in production, 250% average ROI, 90% of clients at payback inside six months
- [ ] Predictive DC Operations: 92% fewer critical incidents, 168h predictive lead time, 65% of routine O&M automated; power chain 40–55% and cooling 15–25% of outages
- [ ] IT Asset Intelligence: 20% minimum average software cost reduction, 5x faster audit response, 75% less unbudgeted spend, 6-month payback
- [ ] AI Security & Observability: 13 critical attack classes complete with zero alerts

Regulatory references:

- [ ] NCA clause numbers on the Data Watermarking page (DCC 1-3-1-3, 2-2-1-4, 2-4-1-1; ECC 2-7-3-2) and "NCA ECC (2-1)" on IT Asset Intelligence: shown as in the deck, check against current NCA texts
- [ ] Framework table on the Compliance page (who each framework applies to, what we deliver)
- [ ] Water mandates on IoT & Edge pages: MEWA electronic-metering mandate, National Water Strategy 2030, Treated Wastewater Reuse Policy, NWC smart-meter program, SWA · WERA reporting standards
- [ ] Blockchain "Saudi market signals": REGA / Real Estate Registry tokenization infrastructure (November 2025), SFDA food-tracing pilot, Saudi Customs FASAH pilot, SAMA Project Aber and mBridge
- [ ] "Aligned with" chips on every solution and sector page and on the Vision 2030 page
- [ ] VERIFY points inside the four insight articles (the articles pre-date the decks and were not rewritten)

Decisions taken while applying the decks, to confirm:

- [ ] Partner and product names from the Solutions deck are **not** shown; the site uses the generic names from the Partner Briefing (Agentic AI Platform, Data Watermarking, AI Security & Observability, "our AIoT partner")
- [ ] Contact e-mail changed to sales@adpway.com (as in the decks); the legal pages and `.env.example` still say info@adpway.com
- [ ] Mission and vision statements on the About page were kept from the previous site (the decks do not contain them)
- [ ] Deployment options (cloud / in-Kingdom / on-premise) on Data Watermarking and IT Asset Intelligence are not stated in the decks

## 4. Reviews

- [ ] Native Saudi business-Arabic review of **all** Arabic copy (`content/ar/**`, `content/insights/ar/**`)
- [ ] Qualified Saudi counsel reviews Privacy, Terms and Cookie Policy; then remove the "draft" notice (`legal.draft`)
- [ ] Approve the four insight drafts; remove the "Draft" badges
- [ ] Brand check: no partner names, product names, logos or screenshots anywhere (last sweep: clean)

## 5. Technical go-live

- [ ] Set `NEXT_PUBLIC_SITE_URL=https://adpway.com` and **`NEXT_PUBLIC_REVIEW_MODE=false`** (this allows indexing), and leave `NEXT_PUBLIC_REVIEW_MARKERS` unset so VERIFY markers stay hidden. Rebuild.
- [ ] Configure Resend or SMTP; submit each form (contact, newsletter, alliance) once and confirm delivery
- [ ] Build the Docker image once in CI or on the target host (not built locally; Docker is not installed on the development Mac)
- [ ] DNS and TLS for adpway.com (and redirect www → apex or the reverse)
- [ ] Submit `https://adpway.com/sitemap.xml` to Google Search Console and Bing Webmaster Tools
- [ ] If analytics is added: set `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL`, add its origin to the CSP in `next.config.ts`, and update the Cookie Policy table
- [ ] With more than one server instance, move the form rate limiter to a shared store (`src/lib/rate-limit.ts`)
- [ ] Re-run Lighthouse on the live domain (last local run: Accessibility, Best Practices and SEO 100; Performance 91–97 on mobile)
