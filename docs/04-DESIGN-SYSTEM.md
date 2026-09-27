# 04 — DESIGN SYSTEM

> Owner ne kaha: "Do not ask me for color schemes." Yeh file **final decision** hai.
> Isse deviate mat karo bina ADR likhe.

---

## 1. Design Philosophy
**"Confident Indian Professional"** — premium but not flashy, trustworthy but not boring.

Rules:
1. **One accent, many neutrals.** Har role ka ek signature color, baaki sab neutral scale.
2. **Depth via layering, not borders.** Soft shadows + subtle gradients + glass.
3. **Motion means something.** Har animation ek state change communicate kare.
4. **Mobile is the product.** 70%+ traffic WhatsApp link se mobile pe aayega.
5. **Thumb-zone CTA.** Primary action hamesha bottom 30% screen me reachable.

---

## 2. Role Themes (final palettes)

| Role | Theme ID | Brand | Accent | Surface mood | Feeling |
|------|----------|-------|--------|--------------|---------|
| `real-estate` | `estate-navy` | `#0B2B4A` deep navy | `#D4A24C` warm gold | cool grey + ivory | Premium, established, high-ticket |
| `insurance` | `secure-indigo` | `#1E3A8A` indigo | `#10B981` emerald | clean white + slate | Safe, reliable, calm |
| `doctor` | `clinical-teal` | `#0F766E` teal | `#38BDF8` sky | near-white + mint tint | Clean, calm, hygienic |
| `ca-tax` | `ledger-slate` | `#1F2937` graphite | `#F59E0B` amber | paper-white + warm grey | Precise, serious, trustworthy |
| `photographer` | `noir-gold` | `#0A0A0A` near-black | `#E8B04B` champagne | true dark-first | Cinematic, editorial, luxe |
| `fitness-tutor` | `kinetic-lime` | `#111827` charcoal | `#84CC16` lime (gym) / `#6366F1` indigo (tutor) | charcoal + electric | Energetic, bold, motivating |

### Token contract (`src/styles/tokens.css`)
```
--brand            --brand-fg          --brand-muted
--accent           --accent-fg
--bg               --surface           --surface-2      --surface-elevated
--fg               --fg-muted          --fg-subtle
--border           --border-strong
--success  --warning  --danger  --info
--ring
--radius-sm/md/lg/xl/2xl
--shadow-sm/md/lg/glow
--gradient-hero    --gradient-card
```

Har role block `src/styles/role-themes.css` me:
```css
[data-role="doctor"] { --brand: oklch(...); --accent: oklch(...); /* ... */ }
[data-role="doctor"][data-theme="dark"] { --bg: oklch(...); /* ... */ }
```

> **Colors OKLCH me likho**, hex me nahi — Tailwind v4 native hai aur dark mode
> me perceptual lightness consistent rehti hai.

---

## 3. Typography

| Role | Display font | Body font |
|------|-------------|-----------|
| real-estate | **Fraunces** (serif, optical) | Inter |
| insurance | **Plus Jakarta Sans** | Inter |
| doctor | **Plus Jakarta Sans** | Inter |
| ca-tax | **Inter Tight** | Inter |
| photographer | **Instrument Serif** | Geist / Inter |
| fitness-tutor | **Bricolage Grotesque** | Inter |

Self-host via `next/font/google` (subset `latin`, `display: swap`).
Devanagari support ke liye: **Noto Sans Devanagari** as fallback when `locale=hi-IN`.

### Type scale (fluid, `clamp()`)
```
display   clamp(2.5rem, 6vw, 4.5rem)   / 1.05 / -0.03em
h1        clamp(2rem, 4.5vw, 3.25rem)  / 1.1  / -0.02em
h2        clamp(1.5rem, 3vw, 2.25rem)  / 1.2  / -0.015em
h3        1.375rem / 1.3
body-lg   1.125rem / 1.65
body      1rem / 1.65
small     0.875rem / 1.5
caption   0.75rem / 1.4 / 0.02em uppercase
```

---

## 4. Spacing, Radius, Elevation
- Spacing scale: 4pt base → `4 8 12 16 24 32 48 64 96 128`
- Section vertical rhythm: mobile `py-16`, desktop `py-28`
- Container: `max-w-[1200px]`, gutter `px-5 md:px-8`
- Radius: cards `--radius-xl` (16px), buttons `--radius-lg` (12px), pills `9999px`
  - Exception: `photographer` theme = sharp (`4px`) for editorial feel
- Shadows: **never pure black** — use `oklch(from var(--brand) l c h / 0.12)`

---

## 5. Motion Language (Motion / framer-motion)

| Interaction | Spec |
|-------------|------|
| Section reveal | `BlurFade` — y: 16 → 0, blur 6px → 0, 0.5s, stagger 0.08s |
| Card hover | scale 1.02, shadow-lg, 200ms `ease-out` |
| Button press | scale 0.97, spring `{ stiffness: 400, damping: 25 }` |
| Number counters | `NumberTicker`, 1.2s, triggers on 30% in-view |
| Page/tab switch | `AnimatePresence` fade + y 8px, 180ms |
| FAB expand | spring dock, stagger 40ms per item |
| Modal / drawer | Vaul default spring; backdrop blur 8px |
| Success state | subtle confetti burst (flag-gated) + haptic `navigator.vibrate(12)` |

**Mandatory:** har animation `prefers-reduced-motion: reduce` par `duration: 0` ho jaye.
Ek shared hook: `src/lib/hooks/useReducedMotion.ts`.

---

## 6. Layout Patterns (reusable)

| Pattern | Use |
|---------|-----|
| **Split Hero** | Left: headline + dual CTA + trust chips. Right: portrait/video card with BorderBeam |
| **Bento Grid** | Services / USPs — 1 large + 4 small tiles |
| **Sticky Tool Panel** | Calculators — inputs sticky left, live result right (desktop); bottom-sheet result (mobile) |
| **Horizontal Scroll Rail** | Properties / packages / albums on mobile, grid on desktop |
| **Marquee Trust Strip** | Logos, certifications, insurer names |
| **Timeline** | Process steps ("How it works" 4 steps) |
| **Comparison Table** | Plans / packages — sticky header row, highlighted "popular" column |
| **Floating Dock (FAB)** | Bottom-right desktop, bottom-center pill on mobile |

---

## 7. FAB Specification (core C2)

```
Collapsed (mobile):  bottom-center pill, 56px height, safe-area aware
                     [ WhatsApp icon ] [ Call ] [ Directions ]  + expand chevron
Expanded:            vertical stack with labels, backdrop scrim 40%
Desktop:             bottom-right vertical dock, labels on hover tooltip
Behavior:            - hide on scroll-down, show on scroll-up (threshold 12px)
                     - never overlap footer CTA (IntersectionObserver)
                     - z-index 60, below modals (100)
                     - respects env(safe-area-inset-bottom)
                     - pulse ring on WhatsApp after 8s idle (once per session)
```

Extra FAB slots (role-gated via preset): `emergency` (doctor), `brochure` (real-estate),
`showreel` (photographer).

---

## 8. Accessibility (non-negotiable)
- Contrast: body text ≥ 4.5:1, large text ≥ 3:1 — **dono themes me**
- Har interactive element ≥ 44×44px touch target
- Visible focus ring: `outline: 2px solid var(--ring); outline-offset: 2px`
- Har image pe meaningful `alt`; decorative pe `alt=""`
- Form errors: `aria-describedby` + `role="alert"`
- Modals: focus trap + `Esc` close + return focus
- Carousels: keyboard arrows + pause control
- Video: `muted playsInline` autoplay loops only; koi audio autoplay nahi

---

## 9. Imagery Rules
- Aspect ratios: hero `16:9` / `4:5` mobile; cards `4:3`; avatars `1:1`; gallery natural
- Har `<Image>` pe `sizes` prop mandatory
- Blur placeholder: `placeholder="blur"` + generated `blurDataURL`
- LCP image pe `priority`, baaki sab lazy
- Video: `preload="metadata"`, poster mandatory, max 3MB

---

## 10. Copy Tone
- Headlines: benefit-first, number-backed. *"15,000+ smiles designed in Pune"*
- CTA labels: first-person action. *"Book My Slot"*, *"Get My Quote"*, *"Save Contact"*
- ₹ amounts Indian format: `₹1,25,00,000` (use `Intl.NumberFormat('en-IN')`)
- Microcopy trust line har form ke neeche: *"We reply on WhatsApp within 10 minutes."*
- Hinglish allowed in secondary locale, English primary.
