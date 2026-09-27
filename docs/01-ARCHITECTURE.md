# 01 — ARCHITECTURE

## 1. Mental Model

```
src/config/site.config.json   ->  { "role": "doctor" }
        |
        v
  [ Config Engine ]  src/config/index.ts
        |   merges: role preset + theme tokens + data/roles/doctor.json
        v
  [ RoleProvider ]  resolved on server, hydrated on client
        |
        +--> [ Theme Layer ]      CSS vars on <html data-role="doctor">
        +--> [ Section Renderer ] sections[] array -> universal sections in order
        +--> [ Module Slot ]      lazy-loads src/modules/doctor/*
        +--> [ Core Layer ]       vCard, FAB, WhatsApp router, analytics (role-agnostic)
```

**Golden rule:** kisi bhi component me `if (role === 'doctor')` likhna **mana hai**
(sirf `SectionRenderer` aur `ModuleRegistry` exception hain). Sab kuch data-driven.

---

## 2. Directory Tree (final target)

```
ALL_IN_ONE/
├─ docs/                            # planning (yeh folder)
│  ├─ parts/                        # PART-00 .. PART-13 briefs
│  ├─ research/                     # market research notes per role
│  └─ adr/                          # architecture decision records
│
├─ public/
│  ├─ images/roles/<role>/          # per-role downloaded images
│  ├─ videos/                       # poster frames + short mp4 loops
│  ├─ icons/                        # PWA icons, favicons
│  ├─ brochures/                    # dummy PDF lead magnets
│  └─ fonts/                        # self-hosted variable fonts
│
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                 # html/body, theme boot, providers
│  │  ├─ page.tsx                   # resolves role -> <RoleLandingPage/>
│  │  ├─ (site)/                    # future: /preview/[role], /card/[slug]
│  │  └─ api/
│  │     ├─ vcard/route.ts          # GET -> text/vcard download
│  │     ├─ lead/route.ts           # POST -> log + return wa.me deeplink
│  │     ├─ og/route.ts             # dynamic OG image (next/og)
│  │     └─ pass/route.ts           # VIP pass image generation
│  │
│  ├─ config/
│  │  ├─ site.config.json           # THE SWITCH: { role, locale, flags }
│  │  ├─ roles/<role>.preset.ts     # section order, enabled modules, icon set
│  │  ├─ theme/<role>.theme.ts      # color/typography tokens per role
│  │  ├─ schema/                    # zod schemas for every JSON above
│  │  └─ index.ts                   # resolveConfig() — single entry point
│  │
│  ├─ core/                         # role-agnostic cross-cutting features
│  │  ├─ vcard/                     # vCard 3.0 builder + download hook + QR
│  │  ├─ whatsapp/                  # buildWhatsAppLink(), message templates
│  │  ├─ fab/                       # floating action dock
│  │  ├─ share/                     # Web Share API, copy link, QR modal
│  │  ├─ analytics/                 # event bus -> Vercel / Plausible / GA
│  │  ├─ seo/                       # metadata + JSON-LD builders
│  │  ├─ pwa/                       # manifest builder, install prompt
│  │  └─ i18n/                      # EN / HI string maps
│  │
│  ├─ components/
│  │  ├─ ui/                        # shadcn/ui primitives (DO NOT hand-edit)
│  │  ├─ motion/                    # BlurFade, Reveal, Marquee, NumberTicker
│  │  ├─ media/                     # SmartImage, VideoHero, BeforeAfterSlider
│  │  ├─ sections/                  # Hero, About, Services, Stats, Testimonials
│  │  ├─ layout/                    # Navbar, Footer, MobileDock, Container
│  │  └─ shared/                    # LeadForm, TrustBadges, CTABlock, EmptyState
│  │
│  ├─ modules/                      # ONE FOLDER PER ROLE. Fully isolated.
│  │  ├─ real-estate/
│  │  ├─ insurance/
│  │  ├─ doctor/
│  │  ├─ ca-tax/
│  │  ├─ photographer/
│  │  └─ fitness-tutor/
│  │       └─ { components/  lib/  data/  index.ts  types.ts }
│  │
│  ├─ data/
│  │  ├─ roles/<role>.json          # ALL dummy content for that role
│  │  ├─ media/                     # curated Unsplash/Pexels URL banks
│  │  └─ common/                    # cities, states, banks, boards, specialities
│  │
│  ├─ lib/  { utils/  hooks/  validators/  constants/ }
│  ├─ types/                        # global TS types
│  └─ styles/                       # globals.css, tokens.css, role-themes.css
│
└─ scripts/                         # role scaffolder, media prefetch, config validator
```

---

## 3. Rendering Strategy
- Landing page = **Server Component** (config + data server pe resolve hote hain).
- Interactive modules = **Client Components**, `next/dynamic` se lazy + skeleton.
- Heavy widgets (lightbox, charts, map) = `ssr: false` + IntersectionObserver mount.
- Koi runtime DB call nahi → poora page statically prerenderable (`force-static`).

---

## 4. Data Flow For A Lead

```
User action (form submit / button click)
   |
   v   buildLeadPayload({ intent, fields, role })
   |
   v   core/whatsapp/templates/<intent>.ts     -> formatted message string
   |
   v   buildWhatsAppLink(phone, message)       -> https://wa.me/91XXXXXXXXXX?text=...
   |
   +-->  analytics.track('lead_submit', { intent, role, ...meta })
   |
   v   openWhatsApp(link)                       (mobile: same tab, desktop: new tab)
```

`POST /api/lead` optional hai — Phase 1 me sirf edge-log; Phase 2 me DB + notification.

### Lead intents (fixed enum — `src/core/whatsapp/intents.ts`)
`general_enquiry` · `callback_request` · `property_enquiry` · `site_visit` ·
`premium_quote` · `policy_renewal` · `appointment_book` · `report_upload` ·
`doc_checklist` · `tax_consult` · `date_availability` · `package_enquiry` ·
`vip_pass` · `trial_class` · `brochure_request` · `shortlist_share`

---

## 5. Module Contract

Har role module yeh shape export karega — `src/modules/<role>/index.ts`:

```ts
export const module: RoleModule = {
  key: 'doctor',
  widgets: {
    slotBooking:    dynamic(() => import('./components/SlotBooking')),
    costEstimator:  dynamic(() => import('./components/CostEstimator')),
  },
  waTemplates: { appointment_book: buildAppointmentMessage },
  schema: DoctorDataSchema,        // zod schema for data/roles/doctor.json
  sectionDefaults: ['hero', 'trust', 'services', 'slotBooking', 'testimonials', 'faq'],
}
```

`ModuleRegistry` (`src/modules/registry.ts`) sirf ek lazy map rakhega:
```ts
export const registry = {
  'doctor': () => import('./doctor'),
  ...
}
```

---

## 6. Theming Mechanism
- `src/styles/tokens.css` — semantic CSS vars (`--brand`, `--surface`, `--accent`, ...).
- `src/styles/role-themes.css` — `[data-role="doctor"] { --brand: ...; }`.
- Tailwind v4 `@theme inline` in `globals.css` maps vars → utility classes.
- Dark mode = `[data-theme="dark"]` nested inside each role block.
- **Result:** role switch = ek attribute change, zero JS re-render cost.

---

## 7. Isolation Rules (PR review me enforce hoga)

| Layer | Import kar sakta hai | Import NAHI kar sakta |
|-------|---------------------|----------------------|
| `config/` | `types/` | sab kuch aur |
| `core/` | `lib/`, `types/`, `config/` | `modules/`, `components/sections/` |
| `components/` | `core/`, `lib/`, `components/ui/` | `modules/` |
| `modules/<r>/` | `core/`, `components/`, `lib/` | dusra `modules/<x>/` |

Enforcement: `eslint-plugin-boundaries` ya `import/no-restricted-paths`.

---

## 8. ADRs to write (docs/adr/)
- **ADR-001** Single codebase + JSON switch (vs 6 separate repos)
- **ADR-002** WhatsApp-only lead backend in Phase 1
- **ADR-003** Tailwind v4 CSS-vars theming (vs multiple Tailwind configs)
- **ADR-004** Client-side vCard generation + server route fallback
- **ADR-005** Lazy module registry vs static imports
