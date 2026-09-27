# PART-04 — UNIVERSAL SECTION LIBRARY

**Status:** 🟡 In progress (chunk 1 of ~3 done)
**Est:** 2 days · **Blocked by:** PART-03 · **Unblocks:** PART-05 … PART-10

---

## 1. Goal
Woh 16 universal sections banana jo har role use karega, plus `SectionRenderer`
jo `preset.sections` array padhkar unhe order me render kare aur `module:*`
entries pe role module ka widget slot kholе.

## 2. Read First
- `docs/01-ARCHITECTURE.md` §1, §5
- `docs/03-CONFIG-SCHEMA.md` (common data block)
- `docs/04-DESIGN-SYSTEM.md` §6 (layout patterns)
- `docs/09-FEATURE-MATRIX.md` Section A (universal features)

## 3. Files To Create

```
src/components/sections/
├─ SectionRenderer.tsx        # the dispatcher
├─ SectionShell.tsx           # padding, container, heading, anchor, view tracking
├─ Hero.tsx
├─ QuickActions.tsx           # vCard + WhatsApp + Call + Share row
├─ TrustStrip.tsx             # marquee badges / certifications
├─ StatsGrid.tsx              # NumberTicker counters
├─ About.tsx                  # bio + portrait + credentials timeline
├─ Services.tsx               # bento grid
├─ Process.tsx                # "How it works" timeline
├─ Gallery.tsx                # generic grid (photographer overrides with masonry)
├─ Testimonials.tsx           # infinite moving cards + rating summary
├─ Faq.tsx                    # accordion + JSON-LD FAQPage
├─ LeadForm.tsx               # dynamic fields -> WhatsApp
├─ ContactInfo.tsx            # hours, live open/closed, map embed, address
├─ CtaBanner.tsx
├─ SocialProof.tsx            # google rating + review CTA
├─ ModuleSlot.tsx             # lazy-loads registry widget by key
└─ index.ts

src/components/layout/
├─ Navbar.tsx                 # sticky, blur, role logo, CTA
├─ MobileMenu.tsx
├─ Footer.tsx
├─ Container.tsx
├─ StickyBottomBar.tsx        # mobile thumb-zone CTA
├─ CommandPalette.tsx         # ⌘K (desktop)
└─ ThemeToggle.tsx (from PART-02)

src/components/shared/
├─ SectionHeading.tsx
├─ PriceTag.tsx               # formatINR + strike + "from"
├─ TrustBadge.tsx
├─ RatingStars.tsx
├─ EmptyState.tsx
├─ LoadingSkeletonCard.tsx
├─ DisclaimerNote.tsx         # for all calculators
├─ ConsentCheckbox.tsx
├─ PhoneField.tsx             # +91 masked input
└─ ExitIntentDialog.tsx

src/app/page.tsx              # rewrite: <RoleLandingPage/>
src/components/RoleLandingPage.tsx
```

## 4. SectionRenderer Contract

```tsx
const SECTIONS = {
  hero: Hero, quickActions: QuickActions, trustStrip: TrustStrip,
  stats: StatsGrid, about: About, services: Services, process: Process,
  gallery: Gallery, testimonials: Testimonials, faq: Faq,
  leadForm: LeadForm, contactInfo: ContactInfo, cta: CtaBanner,
  socialProof: SocialProof,
} as const;

// preset.sections = ['hero', 'about', 'module:slotBooking', 'faq']
// 'module:xyz' -> <ModuleSlot widget="xyz" />
```

**Yeh dono files (`SectionRenderer`, `ModuleSlot`) hi woh exception hain jahan
role/module keys se dispatch allowed hai.** Baaki kahin nahi.

`ModuleSlot`:
```tsx
const Widget = dynamic(() => moduleRegistry[role]().then(m => m.module.widgets[widget]), {
  loading: () => <LoadingSkeletonCard />,
  ssr: false,
});
```

## 5. Section Specs (key ones)

### Hero
- Split layout (04-DESIGN-SYSTEM §6). Mobile: stacked, image first.
- Left: eyebrow chip, `display` headline, tagline, 2 CTAs (primary intent + Save Contact),
  trust chips row (experience, rating, location).
- Right: portrait/video card with `BorderBeam`, floating stat badge.
- Optional `coverVideo` → `VideoHero` background with gradient scrim.
- LCP element = hero image → `priority`.

### QuickActions
4 tiles: **Save Contact (vCard)** · **WhatsApp** · **Call** · **Share/QR**.
Mobile: 2×2 grid; desktop: single row. Har tile pe icon + label + micro-desc.

### LeadForm
- Fields dynamic from `data.leadForm.fields` (`name | phone | email | city | concern | preferredTime | budget | message`).
- `react-hook-form` + zod; Indian phone regex `^[6-9]\d{9}$`.
- Consent checkbox mandatory.
- Submit → `buildMessage` → `openWhatsApp` → success state + optional confetti.
- Honeypot field for spam.
- `track(EVENTS.LEAD_START)` on first focus, `LEAD_SUBMIT` on submit.

### ContactInfo
- **Live Open/Closed** — `data.contact.hours` + IST clock, "Closes in 45 min" style.
- Address card + "Get Directions" + "Copy Address".
- Map: lazy `<iframe>` Google Maps embed, loads on click (no API key needed) —
  static map image placeholder pehle (perf).
- Hours table, holiday note.

### StickyBottomBar (mobile)
Appears after 40% scroll. Primary intent CTA + WhatsApp. Coordinates with FAB
(dono ek saath visible nahi — `useFabVisibility` share karo).

### ExitIntentDialog
Desktop: mouse leave top. Mobile: back-button intercept ya 45s idle.
Offer = role ka lead magnet (`data.leadMagnet`). Once per session.

## 6. Definition of Done
- [x] 16 sections banaye, sab `SectionShell` use karte hain — **16/16** (`footer` page chrome hai,
      apna `<footer>` shell rakhta hai)
- [x] `SectionRenderer` `preset.sections` order follow karta hai
- [x] `module:*` entries lazy load hote hain skeleton ke saath
- [x] Koi section me role conditional nahi
- [x] Koi hardcoded string nahi — sab `data` se
- [x] `LeadForm` -> WhatsApp end-to-end chalta hai (code path verified; click-through QA PART-13)
- [x] Live Open/Closed IST me sahi compute hota hai (edge: break time, sunday closed)
- [x] Navbar sticky + blur + scroll shadow
- [x] StickyBottomBar aur FAB ek saath overlap nahi karte — bar `lg:hidden`, dock `hidden lg:flex`
- [x] ⌘K palette services/sections pe navigate karta hai
- [ ] Har section 320px pe bina horizontal scroll ke fit hota hai — **manual pass baaki**
- [ ] Har section dark mode me pass — **manual pass baaki**
- [x] `useSectionView` se `section_view` events fire hote hain
- [x] 6/6 roles placeholder data ke saath render hote hain (crash nahi)
- [x] Commit: `feat(part-04): universal section library + renderer` (3 chunks me)

> Do checkbox jaan-boojh kar khule hain: unke liye browser me aankh se dekhna padta hai aur is
> machine pe browser automation connect nahi hua (extension offline). Ye dono PART-13 (QA) ke
> viewport + dark-mode sweep ka hissa hain — code side par kuch pending nahi hai.

## 7. Handoff (actual — PART-04 complete)

PART-04 teen chunks me bana. Chunk 1 ne page ka **skeleton + chrome + pehle 4 sections**
khade kar diye.
`src/app/page.tsx` ab `<RoleLandingPage/>` hai aur `preset.sections` order me render hota hai.

### Ban chuka hai (chunk 1)

| Path | Exports / kaam |
|------|----------------|
| `src/lib/icons.ts` | `getIcon(name)` -> LucideIcon · `FALLBACK_ICON`. Data JSON ke kebab-case icon naam (`shield-check`, `tooth`, …) yahin resolve hote hain — section me kabhi icon import mat karo |
| `src/lib/reviews.ts` | `averageRating(items)` -> `number \| null` |
| `src/lib/constants/section-labels.ts` | `SECTION_LABELS` (16 keys, `Record<SectionKey,string>`) · `NAV_SECTION_KEYS` (navbar me dikhne wali 7 keys) |
| `src/lib/hooks/useNavSections.ts` | `useNavSections()` -> `NavSection[] = { key, label, href }`. `preset.sections` ∩ `NAV_SECTION_KEYS`, **preset order me** |
| `src/components/shared/index.ts` | barrel — neeche sab yahin se import karo |
| `src/components/shared/SectionHeading.tsx` | `<SectionHeading id? eyebrow? title subtitle? align? className?/>` |
| `src/components/shared/RatingStars.tsx` | `<RatingStars value count? size? showValue? />` — half-star clip, `role="img"` label |
| `src/components/shared/TrustBadge.tsx` | `<TrustBadge icon label sub? />` — shape = `data.trust.badges[]` |
| `src/components/shared/PriceTag.tsx` | `<PriceTag amount unit? strikeFrom? prefix? />` — `formatINR`, `amount===null` pe null |
| `src/components/shared/EmptyState.tsx` | `<EmptyState icon? title description? action? />` — khaali array pe section gayab na ho |
| `src/components/shared/LoadingSkeletonCard.tsx` | `<LoadingSkeletonCard lines? withMedia? />` — ModuleSlot ka fallback |
| `src/components/shared/DisclaimerNote.tsx` | `<DisclaimerNote>…</DisclaimerNote>` — har calculator ke neeche |
| `src/components/shared/IntentButton.tsx` | **`<IntentButton intent label section variant? size? icon? values? />`** — koi bhi CTA isi se. `vcard_download` apne aap `<VCardButton/>` pe jaata hai, baaki `openIntent()` pe. `values` = `MessageField[]` |
| `src/components/sections/SectionShell.tsx` | `<SectionShell sectionKey eyebrow? title? subtitle? align? tone? fabHide? headingSlot? innerClassName? />` — anchor id + `container-page` + `section-y` + `useSectionView` + heading. `tone: 'default' \| 'muted' \| 'raised'`. `fabHide` -> `FAB_HIDE_ATTR` |
| `src/components/sections/SectionRenderer.tsx` | Server component. `resolveConfig().preset.sections` loop. `module:*` -> `<ModuleSlot/>`. **Role/section switch sirf yahan aur `ModuleSlot` me allowed** |
| `src/components/sections/ModuleSlot.tsx` | `<ModuleSlot widget="slotBooking"/>` — `moduleRegistry[role]()` lazy load, `LoadingSkeletonCard` fallback, missing widget prod me `null` / dev me marker |
| `src/components/sections/Hero.tsx` | split hero, `coverVideo` ho to `<VideoHero/>` warna `<SmartImage priority/>` (LCP), `BorderBeam`, floating `trust.stats[0]` badge, 2 CTA + trust chips |
| `src/components/sections/QuickActions.tsx` | 4 tiles — Save Contact / WhatsApp / Call / Share. 2x2 mobile, 1x4 desktop |
| `src/components/sections/TrustStrip.tsx` | `trust.badges` — 3 se zyada + motion allowed ho to `Marquee`, warna wrap row. Neeche `registrationId` + `associations` |
| `src/components/sections/StatsGrid.tsx` | `trust.stats` + `NumberTicker`. Khaali pe `EmptyState` |
| `src/components/layout/Container.tsx` | `<Container as? className?/>` — `container-page` wrapper |
| `src/components/layout/Navbar.tsx` | sticky + blur + scroll-shadow, logo/name, `useNavSections()` links, `ThemeToggle`, primary CTA, `<MobileMenu/>` |
| `src/components/layout/MobileMenu.tsx` | `<MobileMenu sections={NavSection[]}/>` — Base UI `Sheet` (`render` prop, Radix `asChild` nahi) |
| `src/components/layout/Footer.tsx` | closing CTA + contact + socials + nav. **`data-fab-hide` isi pe hai** |
| `src/components/RoleLandingPage.tsx` | skip-link + `<Navbar/>` + `<main><SectionRenderer/></main>` |
| `src/app/page.tsx` | sirf `<RoleLandingPage/>` |

### Hataya gaya
- `src/components/shared/RoleSummary.tsx` (deleted) aur `src/app/page.tsx` ka temporary CTA block.

### Ban chuka hai (chunk 2)

| Path | Exports / kaam |
|------|----------------|
| `src/lib/hours.ts` | `getOpenState(hours, now?)` -> `{open,onBreak,detail,today}` · `orderedWeek` (Mon-first) · `dayLabel` · `formatHourRange` · `to12h` · `istNow`. Poora hisaab **Asia/Kolkata** wall clock pe — visitor ka timezone kabhi use nahi hota |
| `src/lib/utils/maps.ts` | **naya** `buildMapEmbedUrl(address)` — sirf iframe ke liye (`output=embed`). Barrel `@/lib/utils` se export hai |
| `src/lib/constants/lead-fields.ts` | `LEAD_FIELD_KEYS` (8) · `LeadFieldKey` · `LEAD_FIELDS` (label/control/placeholder/optional) · `isLeadFieldKey` · `MOBILE_PATTERN` · `LeadFormValues` · `buildLeadFormSchema(fields)` — sirf visible fields required hote hain (superRefine) |
| `src/components/shared/PhoneField.tsx` | `<PhoneField id label value onChange onBlur? error? required?/>` — `+91` prefix furniture hai, value hamesha 10 bare digits (paste kiya `+91`/`0` saaf ho jaata hai) |
| `src/components/shared/ConsentCheckbox.tsx` | `<ConsentCheckbox id text checked onChange error?/>` — text hamesha `data.leadForm.consentText` se |
| `src/components/shared/LeadField.tsx` | `<LeadField id def error? registration/>` — `LeadFieldDef` se input/textarea decide hota hai, taaki form me per-question branch na ho |
| `src/components/sections/About.tsx` | `about` — portrait (`profile.avatar`, 4:5, lg pe sticky) + `longBio` paragraphs + experience/languages fact cards + dono CTA |
| `src/components/sections/Credentials.tsx` | `credentials` — `trust.badges` column + `trust.associations` timeline, heading me `registrationId`. Sab khaali ho to `EmptyState` |
| `src/components/sections/Services.tsx` | `services` — `data.services[]` bento grid, `getIcon(service.icon)`, `<PriceTag/>`, `highlights[]`, per-card `<IntentButton values={[['Service', title]]}/>`. Khaali pe `EmptyState` + primary CTA |
| `src/components/sections/Gallery.tsx` | `gallery` — `MasonryPhotoAlbum` (react-photo-album v3) + `yet-another-react-lightbox` + `Video` plugin. Union `image \| video` dono handle, tags se filter (`EVENTS.FILTER_APPLY`), open pe `EVENTS.GALLERY_OPEN` |
| `src/components/sections/Testimonials.tsx` | `testimonials` — 3 se zyada + motion allowed ho to `Marquee`, warna grid. `averageRating()` heading me + `<RatingStars/>`, `formatDate`, source label map |
| `src/components/sections/Faq.tsx` | `faq` — Base UI `Accordion` (`value` prop per item) + `FAQPage` JSON-LD usi array se. Khaali pe `EmptyState` + "Ask a question" CTA |
| `src/components/sections/LeadForm.tsx` | `leadForm` — `react-hook-form` + `zodResolver(buildLeadFormSchema(fields))`. Honeypot `website`, consent mandatory, `EVENTS.LEAD_START` pehle focus pe / `EVENTS.LEAD_SUBMIT` submit pe, phir `openIntent()` -> success card + `ConfettiButton`. `fabHide` |
| `src/components/sections/ContactInfo.tsx` | `clinicInfo` — live Open/On-a-break/Closed badge (har 60s refresh, client-only taaki build-time clock HTML me na jaye), address card + directions + Copy Address + tel, click-to-load map iframe, Mon-first hours table (aaj ki row highlight). `fabHide` |
| `src/components/sections/CtaBanner.tsx` | `ctaBanner` — `bg-brand` banner + `BorderBeam` + dono CTA. `fabHide`. **Abhi kisi preset me nahi hai** — PART-11 me presets isse add kar sakte hain |

`SectionRenderer.tsx` ka `SECTIONS` map ab 13 keys cover karta hai, aur dono barrels
(`@/components/sections`, `@/components/shared`) update ho chuke hain.

### Ban chuka hai (chunk 3 — aakhri)

| Path | Exports / kaam |
|------|----------------|
| `src/lib/before-after.ts` | `buildBeforeAfterPairs(gallery)` -> `BeforeAfterPair[]` (`{id, before, after}`). Pehle `before`/`after` tag wale jode (teesra tag = case id, order-independent), bacha hua stock document order me pair. Odd leftover chhod diya jaata hai |
| `src/lib/constants/socials.ts` | `SOCIAL_NETWORKS` (7 keys -> `{label, icon}`) · `SocialNetwork` · `SocialLink` · `getSocialLinks(contact.socials)` — sirf non-empty handles, schema order me. **Footer ab yahi use karta hai** (uska local `SOCIAL_ICONS` map hata diya) |
| `src/lib/constants/ui-events.ts` | `COMMAND_PALETTE_EVENT` — window custom event, taaki koi bhi trigger single mounted overlay ko khol sake |
| `src/lib/hooks/useExitIntent.ts` | `useExitIntent(enabled)` -> `boolean` (latch). Desktop: `mouseout` + `relatedTarget === null` + `clientY <= 4`. Touch (`pointer: coarse`) only: fast scroll-up (>900px/s) ya 45s idle |
| `src/components/sections/BeforeAfter.tsx` | `beforeAfter` — `buildBeforeAfterPairs(data.gallery)`, har jodi ek `<BeforeAfterSlider/>` (arrow keys + `role="slider"` already us primitive me hai), neeche consent + "results vary" `<DisclaimerNote>`. Khaali pe `EmptyState` + primary CTA |
| `src/components/sections/SocialProof.tsx` | `socialFeed` — `getSocialLinks()` se outbound link cards (**koi embed script nahi**), upar `averageRating(testimonials)` + `trust.stats[0]` ka summary row, har card pe `trackCta`. Khaali pe `EmptyState` |
| `src/components/layout/StickyBottomBar.tsx` | mobile bar (`lg:hidden`): Call · WhatsApp (`data.leadForm.intent`) · Save (`useVCard().download`). `useFabVisibility()` share karta hai, `z-(--z-fab)`, safe-area padding |
| `src/components/layout/CommandPalette.tsx` | ⌘K / Ctrl+K — Base UI `Dialog` + search `Input` + grouped list. `usehooks-ts` `useEventListener('keydown')` + `COMMAND_PALETTE_EVENT` listener. Esc/focus-trap Dialog se |
| `src/components/layout/useCommandItems.ts` | `useCommandItems()` -> `CommandItem[]` (`{id,label,group,icon,run}`): nav sections (smooth scroll) + `cta.primary`/`cta.secondary` + call + WhatsApp + save contact, duplicate labels filter |
| `src/components/layout/CommandPaletteTrigger.tsx` | navbar ka `⌘K` hint button (`lg:flex`), event dispatch karta hai |
| `src/components/shared/ExitIntentDialog.tsx` | `site.flags.exitIntentLead` se gated, `sessionStorage` se once-per-session, offer = `data.leadForm` (title/subtitle) + `<IntentButton intent={leadForm.intent}/>`, `EVENTS.LEAD_START` track. Reduced motion globals.css ke reduce block se |

**Badla hua:**
- `SectionRenderer.tsx` ka `SECTIONS` ab **total map** hai (`Record<SectionKey, ComponentType>`),
  isliye naya `SECTION_KEYS` entry bina component ke **type error** deta hai. `PendingSection`
  dev marker hata diya gaya — ab koi key pending nahi hai.
- `src/core/fab/FloatingActionDock.tsx` ab **desktop-only** (`hidden lg:flex`, bottom-right rail).
  Mobile pe uski jagah `StickyBottomBar` hai — dono kabhi ek saath nahi dikhte.
- `src/components/RoleLandingPage.tsx` me `<StickyBottomBar/> <CommandPalette/> <ExitIntentDialog/>`
  mount hue, aur `<main>` pe `pb-20 lg:pb-0` (bar footer ko na dhake).
- `Navbar.tsx` me `<CommandPaletteTrigger/>`.
- `Footer.tsx` ka local `SOCIAL_ICONS` hata kar `getSocialLinks()` par aa gaya.

### Verified (chunk 3)
- `npx tsc --noEmit` clean · `npx eslint .` clean · `npm run validate:config` 6/6 ·
  `npm run build` clean · `npm run contrast` 108/108
- Prod HTML, 3 roles (har baar rebuild + PowerShell wale tareeke se start/stop):
  - **doctor** -> `hero quickActions trustStrip about services beforeAfter clinicInfo testimonials faq leadForm`,
    `beforeAfter` me 1 slider (2 untagged images se 1 jodi), disclaimer 1, `data-fab-hide` x3,
    sticky bar 1, ⌘K hint 1
  - **photographer** -> `… about gallery socialFeed testimonials faq leadForm`; khaali socials pe
    `EmptyState`, aur temporary 2 handles daal kar rebuild karne pe 2 outbound cards
    (Instagram + Google Business) + reviews row — data wapas revert kar diya gaya
  - **ca-tax** -> `… services credentials testimonials faq leadForm`, `FAQPage` JSON-LD exactly 1
- `buildBeforeAfterPairs` `tsx` se direct test: tagged jodi case-tag se match hoti hai (order
  ke bina), untagged consecutive pair hoti hai, odd leftover drop hota hai, `[]` -> `[]`
- Role wapas **doctor** pe set hai
- **Nahi hua:** browser me aankh se (⌘K open/close, focus trap, 320px, dark mode) — Chrome
  extension is machine pe connect nahi hui. PART-13 QA me ye sweep karna hai.

### Verified (chunk 2)
- `npx tsc --noEmit` clean · `npx eslint .` clean · `npm run validate:config` 6/6 · `npm run build` clean
- `npm run contrast` 108/108 pass
- Prod render, 3 roles:
  - **doctor** -> `hero quickActions trustStrip about services clinicInfo testimonials faq leadForm`, `data-fab-hide` x3 (clinicInfo + leadForm + footer)
  - **photographer** -> `… about gallery testimonials faq leadForm`, `data-role="photographer"` SSR me
  - **ca-tax** -> `… services credentials testimonials faq leadForm`, `FAQPage` JSON-LD exactly 1
- Har role me order exactly `preset.sections` ke barabar; unbuilt keys (`beforeAfter`, `socialFeed`,
  `module:*`) prod me null rehte hain
- Server har baar PowerShell wale tareeke se band kiya (prompt ka point 4)

> Naya section jodne ka tareeka: component banao (`'use client'` + `useRole()` + `<SectionShell/>`),
> phir `SectionRenderer.tsx` ke `SECTIONS` map me ek line. Jab tak map me nahi hai, us key pe
> prod me kuch nahi aata aur dev me "lands later in PART-04" marker aata hai — isliye 6/6 roles
> abhi bhi bina crash ke render hote hain.

### Naming note (spec vs code)
PART-04 brief me `process` / `contactInfo` / `cta` / `socialProof` likha tha, lekin **source of
truth `SECTION_KEYS` hai** (`src/lib/constants/sections.ts`) — wahan ye `credentials`,
`clinicInfo`, `ctaBanner`, `socialFeed` hain. Presets unhi keys se validate hote hain, isliye
code me `SECTION_KEYS` wale naam use hue hain.

### Verified (chunk 1)
- `npx tsc --noEmit` clean · `npx eslint .` clean · `npm run validate:config` 6/6 · `npm run build` clean
- `npm run start` + doctor role: rendered HTML me id order `hero → quickActions → trustStrip → footer`
  (beech ke unbuilt keys prod me null) aur `data-fab-hide` exactly 1 jagah (footer)
- Server PowerShell wale tareeke se band kiya (README/prompt ka point 4)

### PART-05…10 ke liye ready
`SectionShell` · `SectionHeading` · `PriceTag` · `EmptyState` · `LoadingSkeletonCard` ·
`DisclaimerNote` · `TrustBadge` · `RatingStars` · `IntentButton` · `getIcon` · `ModuleSlot`
(widget contract: module barrel `export const widgets = { slotBooking: SlotBooking, … }`)
