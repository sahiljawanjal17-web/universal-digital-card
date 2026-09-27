# 02 — TECH STACK & OPEN-SOURCE SOURCES TO MERGE

> **CRITICAL RULE:** Scratch se mat likho. Pehle yahan dekho, component copy karo, phir adapt karo.
> Har entry ke saath license likha hai — MIT ke bahar kuch use karne se pehle owner se poocho.

---

## 1. Base Stack (locked)

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 15 (App Router, TypeScript)** | RSC, partial prerender, `next/og`, best Vercel DX |
| Styling | **Tailwind CSS v4** | CSS-first `@theme`, native CSS vars = perfect for role theming |
| Components | **shadcn/ui** (Radix + Tailwind) | Copy-paste, fully ownable, a11y built-in |
| Animation | **Motion (framer-motion v11+)** | Spring physics, layout animations, scroll-linked |
| Icons | **lucide-react** + **@tabler/icons-react** | Consistent, tree-shakeable |
| Forms | **react-hook-form + zod + @hookform/resolvers** | Type-safe, minimal re-renders |
| URL state | **nuqs** | Filter state in URL → shareable filtered links |
| Theme | **next-themes** | Dark/light without flash |
| Toasts | **sonner** | Premium feel, promise toasts |
| Dates | **date-fns** | Light, tree-shakeable |
| Charts | **recharts** | EMI / premium / tax charts |
| Carousel | **embla-carousel-react** (via shadcn carousel) | Touch-perfect on mobile |
| PWA | **@serwist/next** | Actively maintained (next-pwa is stale) |
| Analytics | **@vercel/analytics** + optional Plausible | Zero-config, privacy-friendly |

---

## 2. Component Libraries To Harvest (copy-paste, not npm-install)

| Source | URL | License | Kya uthana hai |
|--------|-----|---------|----------------|
| **shadcn/ui** | ui.shadcn.com | MIT | button, card, dialog, drawer, sheet, tabs, accordion, slider, form, input, select, calendar, badge, avatar, skeleton, carousel, sonner, tooltip, popover, progress, checkbox, radio-group, separator, scroll-area |
| **Magic UI** | magicui.design | MIT | `BlurFade`, `NumberTicker`, `Marquee`, `BorderBeam`, `ShimmerButton`, `Dock`, `AnimatedBeam`, `Meteors`, `Ripple`, `AnimatedGradientText`, `TextReveal`, `Confetti` |
| **Aceternity UI** | ui.aceternity.com | MIT | `Spotlight`, `3D Card Effect`, `Bento Grid`, `Infinite Moving Cards`, `Sparkles`, `Lamp`, `Hero Parallax`, `Compare` (before/after slider) |
| **Origin UI** | originui.com | MIT | Premium form inputs, sliders with tooltips, stepper, tag input |
| **Kokonut UI / Cult UI** | kokonutui.com / cult-ui.com | MIT | Pricing cards, feature grids, minimal dock |
| **motion-primitives** | motion-primitives.com | MIT | Scroll progress, text effects, morphing dialog |

---

## 3. GitHub Repos To Reference / Fork Pieces From

| Repo | License | Use karo iske liye |
|------|---------|--------------------|
| `shadcn-ui/ui` | MIT | Component source of truth + `apps/www` layout patterns |
| `magicuidesign/magicui` | MIT | Animation component source |
| `dillionverma/portfolio` | MIT | **Best starting shape** for a personal "card" landing page — hero, dock, blur-fade rhythm |
| `shadcn-ui/taxonomy` | MIT | App Router structure, metadata patterns, marketing sections |
| `steven-tey/precedent` | MIT | Provider setup, modal patterns, tailwind config hygiene |
| `sadmann7/skateshop` | MIT | **Faceted filter + URL state** — Real Estate property filter ka base |
| `Blazity/next-enterprise` | MIT | ESLint/boundaries, CI workflow, bundle analyzer setup |
| `igordanchenko/react-photo-album` | MIT | **Masonry gallery** — Photographer module |
| `igordanchenko/yet-another-react-lightbox` | MIT | Lightbox + video plugin + zoom + thumbnails |
| `vercel/satori` / `next/og` | MPL-2.0 / MIT | Dynamic OG images + **VIP Pass image** generation |
| `zpao/qrcode.react` | ISC | QR for vCard / VIP pass / share modal |
| `bvaughn/react-window` | MIT | Only if property list > 200 items |
| `darkroomengineering/lenis` | MIT | Smooth scroll (use sparingly, respect `prefers-reduced-motion`) |
| `emilkowalski/vaul` | MIT | Mobile bottom-sheet (shadcn drawer uses it) |
| `pacocoursey/cmdk` | MIT | Command palette (premium touch: ⌘K search across services) |
| `tremorlabs/tremor` | Apache-2.0 | Optional: KPI blocks for CA/Insurance dashboards |
| `ixartz/Next-js-Boilerplate` | MIT | Reference only: i18n + testing setup |

---

## 4. Feature → Source Mapping (quick lookup)

| Feature | Build from |
|---------|-----------|
| Hero with video bg | Aceternity `Spotlight` + custom `VideoHero` + Coverr/Mixkit mp4 |
| Trust badge row | Magic UI `Marquee` + shadcn `badge` |
| Animated stat counters | Magic UI `NumberTicker` + `BlurFade` |
| Services grid | Aceternity `Bento Grid` |
| Testimonials | Aceternity `Infinite Moving Cards` |
| Floating action dock | Magic UI `Dock` + Radix `Tooltip` + custom expand logic |
| Property filter | `skateshop` faceted pattern + `nuqs` + shadcn `slider`/`select` |
| Masonry gallery | `react-photo-album` + `yet-another-react-lightbox` |
| Before/After slider | Aceternity `Compare` |
| EMI / Premium chart | `recharts` AreaChart + shadcn `chart` wrapper |
| Slot booking grid | shadcn `toggle-group` + `calendar` |
| Doc checklist | shadcn `checkbox` + `progress` + localStorage hook |
| VIP Pass | `next/og` (server) OR `html-to-image` (client) + `qrcode.react` |
| Date availability | shadcn `calendar` + `react-day-picker` modifiers from JSON |
| Package builder | shadcn `checkbox` + `NumberTicker` live total |
| Install PWA prompt | `@serwist/next` + custom `beforeinstallprompt` hook |

---

## 5. Media Sources (free, commercial-use OK)

| Type | Source | Note |
|------|--------|------|
| Photos | **Unsplash** (unsplash.com/license) | Hotlink for dev, then prefetch to `public/` |
| Photos | **Pexels** | Better for Indian faces/context — search "indian doctor", "indian family" |
| Video | **Coverr**, **Mixkit**, **Pexels Video** | 5–12s loops, < 3MB, muted, `playsInline` |
| Illustrations | **unDraw**, **Storyset** | Empty states, onboarding |
| Avatars | **pravatar.cc**, **randomuser.me** | Testimonial faces |
| Icons | **lucide**, **tabler** | Consistent stroke width |

> **Indian context zaroori hai.** Generic western stock photos premium feel kill kar dete hain.
> Search terms: `indian doctor clinic`, `indian wedding photography`, `mumbai apartment interior`,
> `indian family insurance`, `indian gym trainer`, `indian office accountant`.

---

## 6. Package Install List (Part-00 me run hoga)

```
# core
next react react-dom typescript tailwindcss

# ui + motion
class-variance-authority clsx tailwind-merge tailwindcss-animate
lucide-react @tabler/icons-react motion next-themes sonner

# forms + validation
react-hook-form zod @hookform/resolvers

# state + utils
nuqs date-fns usehooks-ts

# feature-specific
embla-carousel-react recharts react-day-picker
react-photo-album yet-another-react-lightbox
qrcode.react html-to-image
@serwist/next serwist
@vercel/analytics @vercel/speed-insights

# dev
eslint prettier prettier-plugin-tailwindcss @next/bundle-analyzer
eslint-plugin-boundaries tsx
```

---

## 7. Attribution & License Hygiene
- `docs/assets/LICENSES.md` banao — har copied component ka source URL + license note.
- shadcn/Magic UI/Aceternity = copy-paste MIT → attribution optional but rakho.
- Unsplash/Pexels photos → license file me photographer credit list rakho.
- Koi bhi GPL/AGPL dependency **nahi** (commercial product hai).
