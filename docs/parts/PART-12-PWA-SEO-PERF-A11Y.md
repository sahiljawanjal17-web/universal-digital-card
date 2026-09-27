# PART-12 — PWA · SEO · PERFORMANCE · ACCESSIBILITY

**Status:** ⬜ Not started
**Est:** 1.5 days · **Blocked by:** PART-04 (ideally after a few role parts)

---

## 1. Goal
Product ko "premium" se "production-premium" banana — installable, findable,
fast, aur sabke liye usable.

## 2. Read First
- `docs/00-MASTER-PLAN.md` §6 (measurable premium targets)
- `docs/08-QA-CHECKLIST.md` §10–12
- `docs/04-DESIGN-SYSTEM.md` §8 (a11y rules)

## 3. Files To Create

```
src/core/seo/
├─ metadata.ts              # buildMetadata(role, data)
├─ json-ld.ts               # schema.org builders per role type
├─ og.ts                    # OG image params
└─ index.ts

src/core/pwa/
├─ manifest.ts              # role-aware manifest
├─ InstallPrompt.tsx        # custom install UI
├─ useInstallPrompt.ts
└─ index.ts

src/app/
├─ manifest.ts              # Next metadata route -> dynamic manifest
├─ robots.ts
├─ sitemap.ts
├─ opengraph-image.tsx      # or api/og/route.tsx
├─ offline/page.tsx
├─ not-found.tsx
└─ error.tsx

src/app/sw.ts               # serwist service worker
next.config.ts              # withSerwist wrapper

src/lib/hooks/
├─ useIsMobile.ts
└─ useMediaQuery.ts

scripts/lighthouse-all-roles.ts
.github/workflows/ci.yml
```

## 4. SEO

### 4.1 Metadata
`buildMetadata(role, data)` → Next `Metadata`:
- `title` from `data.seo.title`, `template: '%s | <business>'`
- `description`, `keywords`
- `openGraph`: type `website`, locale `en_IN`, images from `/api/og`
- `twitter`: `summary_large_image`
- `alternates.canonical`
- `robots`: index, follow
- `icons` per role

### 4.2 JSON-LD (role-mapped, from `preset.seo.schemaType`)
| Role | Schema type |
|------|------------|
| real-estate | `RealEstateAgent` |
| insurance | `InsuranceAgency` |
| doctor | `Dentist` / `Physician` |
| ca-tax | `AccountingService` |
| photographer | `ProfessionalService` (+ `ImageObject`) |
| fitness-tutor | `HealthAndBeautyBusiness` / `EducationalOrganization` |

Plus universal: `LocalBusiness` (address, geo, openingHoursSpecification,
aggregateRating, priceRange, telephone), `Person`, `FAQPage`, `BreadcrumbList`,
`WebSite` with `SearchAction`.

> Validate: Google Rich Results Test + schema.org validator. Zero errors chahiye.

### 4.3 OG Image (`/api/og`)
`next/og` `ImageResponse`, 1200×630:
- Role gradient background
- Portrait/logo, name, designation, tagline
- Trust chip row (rating, experience, city)
- Edge runtime, font loaded via `fetch` + `arrayBuffer`
- Cache: `revalidate` long

**Test:** link WhatsApp pe bhejke rich preview dekho — yahi sabse common share path hai.

### 4.4 robots + sitemap
- `robots.ts`: allow all, sitemap URL
- `sitemap.ts`: home + section anchors + (future) `/preview/<role>`

## 5. PWA

### 5.1 Manifest (`src/app/manifest.ts`)
Role ke hisaab se dynamic:
```ts
{
  name: `${data.profile.name} — ${data.profile.designation}`,
  short_name: businessShortName,
  description: data.seo.description,
  theme_color: theme.brand,
  background_color: theme.bg,
  display: 'standalone',
  orientation: 'portrait',
  start_url: '/?utm_source=pwa',
  icons: [192, 512, maskable-512],
  shortcuts: [
    { name: 'WhatsApp', url: '/?action=whatsapp' },
    { name: 'Call', url: '/?action=call' },
    { name: 'Save Contact', url: '/api/vcard' },
  ],
}
```

### 5.2 Service Worker (serwist)
Caching strategy:
| Asset | Strategy |
|-------|----------|
| HTML | NetworkFirst, 3s timeout, fallback `/offline` |
| JS/CSS | StaleWhileRevalidate |
| Images | CacheFirst, 30 days, max 120 entries |
| Fonts | CacheFirst, 1 year |
| `/api/*` | NetworkOnly |

### 5.3 Install Prompt
- Capture `beforeinstallprompt`
- Show custom card after 30s or 60% scroll (whichever first), **once per 7 days**
  (`localStorage` timestamp)
- iOS: no event → show "Add to Home Screen" instructions sheet with Share-icon hint
- Dismiss → don't nag

### 5.4 Offline page
Branded, shows phone number + WhatsApp link (cached), "Retry" button.

## 6. Performance

### 6.1 Checklist
- [ ] Hero image `priority`, everything else lazy
- [ ] `sizes` prop on every `Image`
- [ ] Fonts: `display: swap`, preload only display font, subset `latin`
- [ ] Third-party scripts: `next/script` `strategy="lazyOnload"`
- [ ] Role modules dynamic-imported, `ssr:false` for heavy widgets
- [ ] Charts (`recharts`) lazy — 100KB+ library
- [ ] Lightbox lazy — only on first image click
- [ ] Map iframe click-to-load (static image placeholder first)
- [ ] `content-visibility: auto` on below-fold sections
- [ ] No layout shift from animations (transform/opacity only)
- [ ] Reserve space for all async content (`AspectBox`)

### 6.2 Bundle budget
| Metric | Target |
|--------|--------|
| First Load JS (shared) | < 120KB gzip |
| Route JS | < 200KB gzip |
| Largest single chunk | < 80KB gzip |

`npm run analyze` se verify. Koi bhi unexpected library > 50KB → justify ya replace.

### 6.3 `scripts/lighthouse-all-roles.ts`
6 roles pe loop, headless Lighthouse, mobile preset, results
`docs/assets/lighthouse-report.md` me table ke roop me.

## 7. Accessibility

### 7.1 Audit tools
- `axe DevTools` browser extension — 0 critical, 0 serious
- `eslint-plugin-jsx-a11y` (ESLint me enable karo)
- Keyboard-only walkthrough (mouse unplug karke)
- VoiceOver (iOS) / TalkBack (Android) spot-check on hero → CTA → form

### 7.2 Fix list (common)
- [ ] Har icon-only button pe `aria-label`
- [ ] Sliders: `aria-valuenow`, `aria-valuetext` (e.g. "₹1.25 crore")
- [ ] Toggle groups: `role="radiogroup"` semantics
- [ ] Calendar: `aria-disabled` + reason for booked dates
- [ ] Modals: focus trap, `aria-modal`, Esc, focus return
- [ ] Carousels: prev/next labels, pause, `aria-live="polite"` on slide change
- [ ] Form errors: `aria-invalid` + `aria-describedby` + `role="alert"`
- [ ] Progress indicators: `role="progressbar"` with values
- [ ] Skip-to-content link
- [ ] `lang="en-IN"` (+ `lang="hi"` on Hindi strings)
- [ ] Live clinic status: `aria-live="polite"`
- [ ] Color never the only signal (booked dates get text too)

## 8. CI (`.github/workflows/ci.yml`)
```
on: [push, pull_request]
jobs:
  - typecheck (tsc --noEmit)
  - lint (next lint)
  - validate-config (all 6 roles)
  - build
  - (optional) lighthouse-ci on preview URL
```

## 9. Definition of Done
- [ ] Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO 100 — **6/6 roles**
- [ ] LCP < 2.0s, CLS < 0.05, INP < 200ms — 6/6 roles
- [ ] `docs/assets/lighthouse-report.md` me table bhara hua
- [ ] JSON-LD Google Rich Results Test pass — 6/6 roles
- [ ] OG image WhatsApp pe rich preview deta hai (actually bhejke test karo)
- [ ] PWA installable (Android Chrome), custom prompt kaam karta hai
- [ ] iOS instructions sheet dikhti hai
- [ ] Offline page dikhti hai (DevTools offline mode)
- [ ] Manifest shortcuts kaam karte hain
- [ ] axe: 0 critical, 0 serious — 6/6 roles
- [ ] Keyboard-only se poora site navigate ho sakta hai
- [ ] `npm run analyze` — budgets ke andar
- [ ] CI workflow green
- [ ] Commit: `feat(part-12): pwa, seo, performance, accessibility`

## 10. Handoff
PART-13 ko chahiye: passing CI, Lighthouse report, deploy-ready build.
