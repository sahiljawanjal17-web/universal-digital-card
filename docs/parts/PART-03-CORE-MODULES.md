# PART-03 — CORE MODULES (vCard · WhatsApp · FAB · Share · Analytics)

**Status:** ✅ Done
**Est:** 1.5 days · **Blocked by:** PART-01, PART-02 · **Unblocks:** PART-04

---

## 1. Goal
Teen non-negotiable core features (C1, C2, C3) ko role-agnostic, reusable
engine ke roop me banana — taaki har role module inhe bas call kare.

## 2. Read First
- `docs/00-MASTER-PLAN.md` Section 4 (C1–C5)
- `docs/01-ARCHITECTURE.md` Section 4 (lead data flow) + Section 7 (isolation)
- `docs/04-DESIGN-SYSTEM.md` Section 7 (FAB spec)
- `docs/07-CONVENTIONS.md` Sections 7, 8

## 3. Files To Create

```
src/core/whatsapp/
├─ intents.ts              # LeadIntent union (01-ARCHITECTURE §4 ki list)
├─ build-link.ts           # buildWhatsAppLink(phone, message, opts)
├─ format.ts               # message formatting helpers (bold, bullet, section)
├─ templates/
│  ├─ base.ts              # header + footer + attribution wrapper
│  ├─ general.ts           # general_enquiry, callback_request, brochure_request
│  └─ index.ts             # intent -> builder map (role modules register here)
├─ open.ts                 # openWhatsApp(link) — device-aware
└─ index.ts

src/core/vcard/
├─ build-vcard.ts          # vCard 3.0 string builder
├─ download.ts             # blob download + iOS fallback to /api/vcard
├─ useVCard.ts             # hook: { download, isDownloading, href }
├─ VCardButton.tsx
└─ index.ts

src/core/fab/
├─ FloatingActionDock.tsx  # the FAB
├─ FabAction.tsx
├─ useScrollDirection.ts
├─ useFabVisibility.ts     # hides near footer CTA
└─ index.ts

src/core/share/
├─ ShareButton.tsx         # Web Share API + fallback
├─ QrModal.tsx             # qrcode.react + download PNG
├─ useShare.ts
└─ index.ts

src/core/analytics/
├─ events.ts               # event name constants (as const)
├─ track.ts                # provider-agnostic dispatcher
├─ AnalyticsProvider.tsx
├─ useSectionView.ts       # IntersectionObserver -> section_view
└─ index.ts

src/app/api/vcard/route.ts
src/app/api/lead/route.ts

src/lib/utils/format.ts    # formatINR, formatINRShort, formatPhone, formatDate
src/lib/utils/phone.ts     # toE164, toWaNumber, toTelHref
src/lib/utils/maps.ts      # buildDirectionsUrl
```

## 4. Implementation Details

### 4.1 vCard (C1)
Format: **vCard 3.0** (widest compatibility — iOS, Android, Outlook).

```
BEGIN:VCARD
VERSION:3.0
N:Sharma;Ananya;;Dr.;
FN:Dr. Ananya Sharma
ORG:Smile Studio Dental Care
TITLE:MDS, Cosmetic & Implant Dentist
TEL;TYPE=CELL,VOICE:+919876543210
TEL;TYPE=WORK,VOICE:+912041234567
EMAIL;TYPE=INTERNET,WORK:hello@smilestudio.in
URL:https://smilestudio.in
ADR;TYPE=WORK:;;2nd Floor, Kumar Prestige, FC Road;Pune;Maharashtra;411005;India
NOTE:Cosmetic & implant dentistry. Book on WhatsApp: wa.me/919876543210
PHOTO;ENCODING=b;TYPE=JPEG:<base64>
REV:2026-09-20T00:00:00Z
END:VCARD
```

Rules:
- Line ending **CRLF** (`\r\n`) — warna iOS parse nahi karta
- 75-octet line folding implement karo (long PHOTO line ke liye)
- Escape `,` `;` `\` in values
- Filename: `<slugified-name>.vcf`
- Client path: `Blob` + `URL.createObjectURL` + `<a download>`
- **iOS Safari fallback:** blob download reliably nahi chalta → agar iOS detect ho
  to `/api/vcard?role=<role>` pe navigate karo (server sets
  `Content-Type: text/vcard; charset=utf-8` + `Content-Disposition: attachment`)
- Photo optional (`preset.vcard.includePhoto`) — base64 size 100KB se kam rakho

### 4.2 WhatsApp Router (C3)

```ts
buildWhatsAppLink({
  phone: '+919876543210',
  message: string,
  source?: string,            // UTM-ish tag
}): string
// -> https://wa.me/919876543210?text=<encoded>
```

Message builder contract (`templates/base.ts`):
```ts
buildMessage({
  title: string,              // "Property Enquiry"
  fields: Array<[label: string, value: string]>,
  note?: string,
  business: string,
}): string
```
Output `07-CONVENTIONS.md` §7 ka standard follow karega.

`openWhatsApp(link)`:
- mobile (UA check + `navigator.maxTouchPoints`) → `window.location.href = link`
- desktop → `window.open(link, '_blank', 'noopener')`
- dono me `track(EVENTS.LEAD_WHATSAPP_OPEN, {...})` pehle

**Intent registry:** role modules apne templates
`registerTemplate(intent, builder)` se add karenge — core me role names nahi aayenge.

### 4.3 FAB (C2)
`04-DESIGN-SYSTEM.md` §7 ka spec exactly implement karo.

Actions come from `preset.fab` + `data.contact`:
| Action | Href |
|--------|------|
| whatsapp | `buildWhatsAppLink({ phone: contact.whatsapp, message: generalEnquiry })` |
| call | `tel:+919876543210` |
| directions | `contact.address.googleMapsUrl` (ya lat/lng se build) |
| emergency | `tel:<module.emergency.number>` (doctor only, preset-gated) |

Behavior:
- `useScrollDirection` — down: translateY(120%), up: 0. Threshold 12px, throttled.
- `useFabVisibility` — footer CTA `IntersectionObserver` se overlap detect, fade out.
- Mobile: bottom-center pill; Desktop: bottom-right vertical dock (Magic UI `Dock`).
- `env(safe-area-inset-bottom)` padding.
- Idle pulse ring on WhatsApp after 8s, once per session (`sessionStorage`).
- `z-index: 60`. Modals 100.
- Full keyboard support + `aria-label` on each action.

### 4.4 Share + QR
- `useShare()` → `navigator.share` available ho to native sheet, warna copy-link toast.
- `QrModal` → `qrcode.react` SVG, brand color, center logo, "Download PNG" button.
- QR content = `NEXT_PUBLIC_SITE_URL` (ya vCard data URI — flag se choose).

### 4.5 Analytics
```ts
export const EVENTS = { PAGE_VIEW: 'page_view', CTA_CLICK: 'cta_click', ... } as const;
track(EVENTS.CTA_CLICK, { label, section, role });
```
Dispatcher: Vercel Analytics `track()` + optional Plausible + `console.debug` in dev.
No PII (phone/email) analytics me kabhi nahi.

### 4.6 `/api/lead`
Phase 1: validate body (zod) → log → return `{ waLink }`. No DB.
Rate-limit note as `TODO(part-13)`.

## 5. Definition of Done
- [x] vCard Android Chrome pe contact open karta hai — *blob path code-verified; asli handset test PART-13*
- [x] `/api/vcard` fallback route verified (`content-type: text/vcard`, `content-disposition: attachment`) — *asli iPhone test PART-13*
- [x] vCard me saare fields sahi — `Rohit, Sharma & Co.` / `MDS, Cosmetic & Implant Dentist` escape + 75-octet fold verified
- [x] `buildWhatsAppLink` 6 sample intents pe correct formatted message deta hai
- [x] Message markup `*bold*` + blank-line blocks correct (script output me verify kiya)
- [x] Message 1800 chars cap enforce hota hai
- [x] FAB: scroll hide/show — down pe `translateY(344px)`, up pe `0` (browser me measure kiya)
- [x] FAB footer-CTA overlap guard bana (`data-fab-hide` + IntersectionObserver) — *asli footer PART-04 me aayega, tab end-to-end test*
- [x] FAB `env(safe-area-inset-bottom)` padding lagata hai — *asli iPhone test PART-13*
- [x] FAB keyboard operable — har action `<a>`/`<button>` + `aria-label` + `focus-visible` ring
- [x] Share: desktop pe clipboard + toast verified; native sheet branch code-verified — *mobile test PART-13*
- [x] QR brand-color + center-logo render hota hai, value = site origin — *asli camera scan PART-13*
- [x] Sab events `EVENTS` constants se fire hote hain, koi raw string nahi
- [x] `core/` me koi `modules/` import nahi (lint verify)
- [x] Commit: `feat(part-03): vcard, whatsapp router, FAB, share, analytics`

## 6. Handoff (actual — PART-03 COMPLETE)

PART-04 sab kuch **barrel** se import kare: `@/core/whatsapp`, `@/core/vcard`,
`@/core/fab`, `@/core/share`, `@/core/analytics`, `@/lib/utils`.

### `src/lib/utils/` (barrel: `index.ts`)
| File | Exports |
|------|---------|
| `format.ts` | `formatINR` (`₹1,25,00,000`) · `formatINRShort` (`₹1.25 Cr` / `₹45 L` / `₹4.5 K`) · `formatDate(value, pattern?)` (`14 Feb 2026`, date-fns) · re-exports `formatPhone` |
| `phone.ts` | `toE164` · `isE164` · `toWaNumber` (digits only, wa.me ke liye) · `toTelHref` · `formatPhone` (`+91 98765 43210`) |
| `maps.ts` | `buildDirectionsUrl(address)` (data ka `googleMapsUrl` pehle, warna lat/lng) · `buildMapUrl` · `formatAddress` |

### `src/core/whatsapp/` — C3 lead router
| File | Exports |
|------|---------|
| `intents.ts` | `INTENT_KEYS` / `IntentKey` — sirf `@/lib/constants/intents` ka re-export |
| `format.ts` | `bold` `italic` `bullet` `field` `section` `tidy` `truncate` · `MAX_MESSAGE_LENGTH = 1800` |
| `build-link.ts` | `buildWhatsAppLink({ phone, message, source? })` · `buildWhatsAppChatLink(phone)`. **`encodeURIComponent` sirf yahin hota hai** |
| `templates/base.ts` | `buildMessage({ title, fields, note, business, emoji? })` · `INTENT_TITLES` (17 intents) · `type MessageField = [label, value]` · `TemplateInput` / `TemplateBuilder` |
| `templates/general.ts` | `genericTemplate` (fallback) + `generalEnquiry` / `callbackRequest` / `brochureRequest` / `directions` / `vcard` templates |
| `templates/index.ts` | `registerTemplate(intent, builder)` (last wins) · `getTemplate` · `hasTemplate` · `buildIntentMessage(input)` |
| `open.ts` | `openWhatsApp(link, meta?)` — handheld pe `location.href`, desktop pe new tab, dono se pehle `track(EVENTS.LEAD_WHATSAPP_OPEN)` · **`openIntent({ phone, intent, business, values?, note?, source?, section? })`** ← sections ke liye one-call path, link return karta hai |

Message shape (07-CONVENTIONS §7) verified:
```
*Appointment Request*

Name: Rohit, Sharma & Co.
Preferred slot: Tue 4:30 PM

— via Dr. Ananya Sharma website
```

**Role module ka kaam:** apne module barrel me `registerTemplate('quote_request', builder)`
call karo. `core/` me kabhi koi role naam nahi aayega.

### `src/core/vcard/` — C1
| File | Exports |
|------|---------|
| `build-vcard.ts` | `buildVCard({ profile, contact, preset, baseUrl? }) -> { content, filename }` · `splitName` · `slugifyName` · `absoluteUrl` · `VCARD_MIME`. `vcard-creator` (MIT) CRLF + 75-octet folding + escaping deta hai — apna builder mat likhna |
| `download.ts` | `downloadVCard({ content, filename, role })` -> `'blob' \| 'route'` · `isIOS()` · `vcardRouteHref(role?)` |
| `useVCard.ts` | `{ download, isDownloading, href, filename }` — config `useRole()` se aati hai |
| `VCardButton.tsx` | `<VCardButton label? variant? size? className? />` |

- `preset.vcard.titleField` respect hota hai (`designation` vs `tagline` — photographer `tagline` use karta hai)
- `includePhoto` / `includeLogo` **URI** ke roop me jaate hain (`PHOTO;VALUE=uri:`), base64 nahi — har download 100KB+ bhari na ho
- `TODO(part-11)`: `ORG` tabhi aayega jab data schema me alag business name hoga

### `src/core/fab/` — C2
| File | Exports |
|------|---------|
| `useScrollDirection.ts` | `useScrollDirection(threshold = 12)` -> `'up' \| 'down'`, rAF-throttled |
| `useFabVisibility.ts` | `useFabVisibility()` -> `boolean` · **`FAB_HIDE_ATTR = 'data-fab-hide'`** |
| `FabAction.tsx` | `<FabAction action withTooltip? pulsing? />` · `type FabActionItem = { key, label, icon, tone, href?, onClick? }` · `FabTone = 'brand' \| 'accent' \| 'danger'` |
| `FloatingActionDock.tsx` | `<FloatingActionDock />` — `src/app/layout.tsx` me **already mounted**, PART-04 dobara mount na kare |

> **PART-04 ke liye action item:** footer CTA section pe `data-fab-hide` attribute lagao —
> FAB usko dekhte hi fade out ho jaata hai.

- Actions `preset.fab` se aate hain: whatsapp (brand) · call (accent) · directions (accent) ·
  emergency (danger). Emergency `data.module.emergency.{enabled,number}` ko **structurally**
  padha jaata hai — koi role conditional nahi.
- Magic UI `Dock` + `DockIcon` base, `disableMagnification` (desktop pe vertical rail hai,
  magnification math horizontal maanti hai). Mobile: bottom-center pill, desktop: bottom-right rail.
- `zIndex: var(--z-fab)` (60) + `env(safe-area-inset-bottom)` padding
- 8s idle pulse ring WhatsApp pe, `sessionStorage['fab-pulse-shown']` se once-per-session,
  `prefers-reduced-motion` pe bilkul nahi

### `src/core/share/` — C4
| File | Exports |
|------|---------|
| `useShare.ts` | `useShare()` -> `{ share, canNativeShare, url }` · `useShareUrl()` (env `NEXT_PUBLIC_SITE_URL`, warna `location.origin`) |
| `ShareButton.tsx` | `<ShareButton label? variant? size? showQr? />` — QR button `site.flags.qrShare` se gated |
| `QrModal.tsx` | `<QrModal open onOpenChange />` — `qrcode.react` canvas, brand color live DOM token se, center logo excavate, "Download PNG" |

### `src/core/analytics/` — C5
| File | Exports |
|------|---------|
| `events.ts` | `EVENTS` (16 names, `as const`) · `EventName` · `EventProps` |
| `track.ts` | `track(event, props?)` · `trackCta(label, section, props?)` · `configureAnalytics({ enabled, context, debug })` · `isAnalyticsEnabled()`. Vercel Analytics + optional `window.plausible`, dev me `console.debug` |
| `AnalyticsProvider.tsx` | `<AnalyticsProvider>` — `site.flags.analytics` se gated, `layout.tsx` me **already mounted** |
| `useSectionView.ts` | `useSectionView(section)` -> ref. SectionRenderer har section wrapper pe lagaye |

PII guard: `phone` `email` `name` `address` `message` jaise keys props se **automatically drop**
ho jaate hain (`track.ts` ka `BLOCKED_PROP_KEYS`).

### API routes
| Route | Behaviour |
|-------|-----------|
| `src/app/api/vcard/route.ts` | `GET /api/vcard?role=<key>` -> `text/vcard; charset=utf-8` + `Content-Disposition: attachment; filename="<slug>.vcf"`. iOS fallback ka target |
| `src/app/api/lead/route.ts` | `POST /api/lead` -> zod validate -> `console.info('[lead]', …)` -> `{ ok: true, waLink }`. Invalid body pe 422 + issues. `TODO(part-13)`: rate limit |

| Validator | |
|---|---|
| `src/lib/validators/lead.schema.ts` | `LeadPayloadSchema` / `LeadPayload` — `{ intent, role?, name, phone, email?, message?, extras, consent, source? }`. PART-04 ka lead form isi ko resolver banaye |

### Jo files chhui gayi (existing)
- `src/app/layout.tsx` — `<AnalyticsProvider>` + `<FloatingActionDock/>` + `<Toaster/>` mount
- `src/app/page.tsx` — temporary CTA row (`VCardButton` + `ShareButton`); **PART-04 isko replace karega**
- `src/components/ui/{dialog,sheet,drawer,popover,dropdown-menu,select}.tsx` — `z-50` ki jagah
  `z-(--z-modal)` (100), warna FAB (60) modal scrim ke upar dikhta tha. Header comment me note hai
- `src/lib/utils/index.ts` — naye barrel exports

### Verified
- `npx tsc --noEmit` clean · `npx eslint .` clean · `npm run validate:config` 13/13 · `npm run build` clean
- 6 intent samples ka message output manually padha — bold, blank lines, attribution sahi
- `truncate()` 2500-char input pe exactly 1800 deta hai, tail `…(details on call)`
- vCard raw output: `\r\n` line endings, 75-octet folding (`Maharasht\r\n ra`), `,`/`&` escape safe
- `GET /api/vcard?role=photographer` -> `aditya-rane.vcf`, sahi headers, `titleField: 'tagline'` respect
- `POST /api/lead` valid -> `{ ok, waLink }`; invalid -> 422
- Browser: FAB ke 4 actions doctor preset pe render, scroll-down pe `translateY(344px)`,
  scroll-up pe `0`; QR modal light + dark dono me brand color ke saath; modal z=100 > FAB z=60

### PART-04 ke liye ready
`<VCardButton/>` · `<ShareButton/>` · `<FloatingActionDock/>` (already mounted) ·
`buildWhatsAppLink` · `buildMessage` · `buildIntentMessage` · `openIntent` · `registerTemplate` ·
`track` · `EVENTS` · `useSectionView` · `formatINR` · `formatINRShort` · `formatPhone` ·
`formatDate` · `buildDirectionsUrl` · `LeadPayloadSchema` · `FAB_HIDE_ATTR`
