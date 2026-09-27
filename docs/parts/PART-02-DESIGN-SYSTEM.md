# PART-02 — DESIGN SYSTEM & THEMING

**Status:** ✅ Done
**Est:** 1 day · **Blocked by:** PART-00 · **Unblocks:** PART-03, PART-04

---

## 1. Goal
6 role themes ko CSS variables me encode karna, Tailwind v4 se bind karna,
aur reusable motion/media primitives ready karna — taaki har section
`bg-brand` / `text-fg-muted` likhe aur role ke hisaab se automatically badal jaye.

## 2. Read First
- `docs/04-DESIGN-SYSTEM.md` ← **poora spec yahi hai**
- `docs/07-CONVENTIONS.md` Section 4 (styling rules)

## 3. Files To Create

```
src/styles/
├─ globals.css              # tailwind import + @theme inline mapping
├─ tokens.css               # base semantic tokens (light default)
├─ role-themes.css          # [data-role="x"] blocks + dark variants
└─ typography.css           # fluid type scale utilities

src/config/theme/
├─ estate-navy.theme.ts
├─ secure-indigo.theme.ts
├─ clinical-teal.theme.ts
├─ ledger-slate.theme.ts
├─ noir-gold.theme.ts
├─ kinetic-lime.theme.ts
└─ index.ts                 # themeId -> theme map + font pair map

src/components/providers/ThemeProvider.tsx   # next-themes wrapper
src/components/layout/ThemeToggle.tsx
src/lib/hooks/useReducedMotion.ts
src/lib/fonts.ts                             # next/font definitions

src/components/motion/
├─ BlurFade.tsx  NumberTicker.tsx  Marquee.tsx  BorderBeam.tsx
├─ ShimmerButton.tsx  Dock.tsx  Meteors.tsx  Confetti.tsx
├─ Reveal.tsx            # our wrapper: BlurFade + reduced-motion guard
├─ StaggerGroup.tsx
└─ MagneticButton.tsx

src/components/media/
├─ SmartImage.tsx         # next/image + blur + sizes + fallback
├─ VideoHero.tsx          # muted/playsInline/poster/lazy
├─ BeforeAfterSlider.tsx  # Aceternity Compare adapted
└─ AspectBox.tsx
```

## 4. Implementation Steps

1. **`tokens.css`** — `04-DESIGN-SYSTEM.md` Section 2 ka token contract, OKLCH values.
   ```css
   :root {
     --brand: oklch(0.42 0.09 240);
     --brand-fg: oklch(0.98 0 0);
     /* ...full list... */
     --radius-lg: 0.75rem;
   }
   ```
2. **`role-themes.css`** — 6 blocks + 6 dark blocks:
   ```css
   [data-role="doctor"] { --brand: oklch(0.52 0.10 180); --accent: oklch(0.75 0.13 230); }
   [data-role="doctor"][data-theme="dark"] { --bg: oklch(0.18 0.01 200); ... }
   ```
   Photographer default **dark-first** — uska light variant bhi banana hai.
3. **`globals.css`** — Tailwind v4 binding:
   ```css
   @import "tailwindcss";
   @import "./tokens.css";
   @import "./role-themes.css";

   @theme inline {
     --color-brand: var(--brand);
     --color-brand-fg: var(--brand-fg);
     --color-accent: var(--accent);
     --color-bg: var(--bg);
     --color-surface: var(--surface);
     --color-fg: var(--fg);
     --color-fg-muted: var(--fg-muted);
     --color-border: var(--border);
     /* ... */
   }
   ```
   Result: `bg-brand`, `text-fg-muted`, `border-border` utilities auto-generate.
4. **Contrast audit** — 12 combinations (6 roles × 2 modes). Koi bhi pair jo
   4.5:1 fail kare, lightness adjust karo. Result table `docs/assets/contrast-report.md` me.
5. **Fonts** — `src/lib/fonts.ts`, `next/font/google`, CSS var per font
   (`--font-display`, `--font-body`). Role preset ka `fontPair` batayega kaunsa class
   `<body>` pe lagega.
6. **`ThemeProvider`** — `next-themes` with `attribute="data-theme"`,
   plus `data-role` attribute set karna (server se render hone par FOUC nahi).
   Inline script in `<head>` for pre-paint theme read.
7. **`ThemeToggle`** — sun/moon, `preset.themeMode` respect kare, animated icon swap.
8. **`useReducedMotion`** — media query hook; har motion component isko consume kare.
9. **Motion components** — PART-00 me copy kiye gaye Magic UI files ko adapt karo:
   - Hardcoded colors hatao → tokens
   - `useReducedMotion` guard add karo
   - Props typed + documented
10. **`Reveal` + `StaggerGroup`** — hamare wrappers, taaki sections me
    raw `motion.div` na likhna pade.
11. **`SmartImage`** — `sizes` mandatory prop, `placeholder="blur"`,
    onError fallback to local placeholder, `AspectBox` se CLS zero.
12. **`VideoHero`** — IntersectionObserver se load, poster first, `preload="metadata"`,
    `prefers-reduced-motion` pe sirf poster dikhao.
13. **Theme preview page** — `src/app/(site)/_dev/theme/page.tsx`:
    saare tokens, buttons, cards, typography ek page pe. 6 roles switch karke verify.

## 5. Definition of Done
- [x] 6 themes × light/dark = 12 variants, sab contrast-pass (108/108 pairs — `npm run contrast`)
- [x] `bg-brand` / `text-fg` / `border-border` utilities kaam karte hain (build CSS me verified)
- [x] Role switch pe theme instantly badalta hai, zero flash (`data-role` SSR pe)
- [x] Dark mode toggle pe FOUC nahi (next-themes pre-paint script + `disableTransitionOnChange`)
- [x] Fluid type scale 320px → 1920px smooth (`clamp()` utilities)
- [x] `prefers-reduced-motion` pe saari animations off (CSS kill-switch + `useReducedMotion`)
- [x] `SmartImage` CLS zero deta hai (`AspectBox` + mandatory `sizes`) — Lighthouse run PART-12 me
- [x] `VideoHero` mobile Safari pe autoplay (`muted` + `playsInline` + poster-first)
- [x] Theme preview page 6/6 roles pe correct — `/dev/theme`
- [x] `docs/assets/contrast-report.md` bana (generated, hand-edit mat karna)
- [x] Commit: `feat(part-02): role-based theming + motion primitives`

> Note: brief me purane theme id the (`estate-navy` etc.). Asli source of truth
> presets hain — final ids: `estate-indigo`, `trust-blue`, `clinical-teal`,
> `ledger-emerald`, `noir-gold`, `energy-amber`.
> Route bhi `_dev/theme` se `/dev/theme` hua — Next me `_folder` private hota hai, route nahi banta.

---

## 6. Handoff (actual — PART-02 COMPLETE)

### Styles — `src/styles/` (entry: `globals.css`, layout se import hota hai)
| File | Kya deta hai |
|------|--------------|
| `tokens.css` | `:root` token contract — brand/accent/neutral/status, radius, shadow (brand-tinted), gradients, spacing, z-index (`--z-fab: 60`), motion durations, `--overlay`, aur shadcn bridge (`--primary`, `--muted`, ...) |
| `role-themes.css` | `[data-theme='dark']` baseline + 6 × `[data-role='x']` + 6 × `[data-role='x'][data-theme='dark']`. photographer block radius ko sharp kar deta hai |
| `typography.css` | `[data-font-pair='...']` → `--font-display` mapping, `.text-display/-h1/-h2/-h3/-body-lg/-body/-small/-caption` |
| `globals.css` | `@import 'tailwindcss'` + `@custom-variant dark` (data-theme based) + `@theme inline` mapping + `.container-page` / `.section-y` / `.surface-card` + reduced-motion kill-switch |

Utilities jo ab available hain: `bg-brand` `text-brand-fg` `bg-brand-muted` `bg-accent` `text-accent-fg`
`bg-bg` `bg-surface` `bg-surface-2` `bg-surface-elevated` `text-fg` `text-fg-muted` `text-fg-subtle`
`border-border` `border-border-strong` `text-success/warning/danger/info` `ring-ring`
`shadow-sm/md/lg/glow` `rounded-sm/md/lg/xl/2xl` `font-display` `font-body`.

### Theme layer — `src/config/theme/`
```
ids.ts        THEME_IDS / ThemeId · FONT_PAIR_IDS / FontPairId · THEME_MODES / ThemeMode
types.ts      interface RoleTheme { id, label, defaultMode, themeColor{light,dark}, corners }
<id>.theme.ts x6  estate-indigo · trust-blue · clinical-teal · ledger-emerald · noir-gold · energy-amber
index.ts      themes (Record<ThemeId, RoleTheme>) · getTheme(id) · re-exports
```
- `PresetSchema.themeId` ab `z.enum(THEME_IDS)`, `fontPair` `z.enum(FONT_PAIR_IDS)` — galat id build time pe pakdi jayegi.
- `SiteSchema.theme.override` bhi `z.enum(THEME_IDS).nullable()` — role ka theme override karne ke liye.
- `resolveConfig().theme` ab poora `RoleTheme` object hai. **`RoleThemeRef` delete ho chuka hai.**

### Providers / layout
| File | Note |
|------|------|
| `src/app/layout.tsx` | `<html lang data-role data-font-pair class={fontClassNames(...)}>` — sab SSR pe. `generateViewport()` theme-color deta hai. `ThemeProvider` > `RoleProvider` > children |
| `src/components/providers/ThemeProvider.tsx` | next-themes, `attribute="data-theme"`, `enableSystem` sirf tab jab `site.theme.mode === 'system'` |
| `src/components/layout/ThemeToggle.tsx` | `site.theme.allowToggle: false` pe kuch render nahi karta; mounted-guard se hydration mismatch nahi |
| `src/lib/fonts.ts` | `fontClassNames(pair, withDevanagari)` — sirf active pair ke font variables lagte hain |
| `src/lib/hooks/useReducedMotion.ts` | har JS animation isko padhti hai |

### Motion — `src/components/motion/` (barrel: `index.ts`)
`Reveal` (y16→0 + blur 6px→0, 0.5s) · `StaggerGroup` (0.08s step) · `MagneticButton`
(spring 400/25, touch + reduced motion pe plain) · plus adapted Magic UI:
`BlurFade` `NumberTicker` `Marquee` `BorderBeam` `ShimmerButton` `Dock`/`DockIcon`
`Meteors` `Confetti`/`ConfettiButton` `AnimatedGradientText`.
Sab raw Tailwind colors tokens se replace ho chuke hain.

### Media — `src/components/media/` (barrel: `index.ts`)
`AspectBox({ratio})` · `SmartImage({src, alt, sizes*})` (`sizes` mandatory, fallback
`/images/placeholder.svg`) · `VideoHero({src, poster})` (IntersectionObserver + poster-first)
· `BeforeAfterSlider({beforeSrc, afterSrc})` (Aceternity Compare adapted — keyboard + tokens).

### Scripts
- `npm run contrast` → `scripts/contrast-report.ts` → `docs/assets/contrast-report.md`.
  CSS se hi padhta hai, palette change karo to dobara chalao (fail pe exit 1).

### PART-03 / PART-04 ke liye ready
`Reveal` `StaggerGroup` `NumberTicker` `Marquee` `Dock` `SmartImage` `VideoHero`
`BeforeAfterSlider` `useReducedMotion` + saare token utilities + `/dev/theme` preview page.
