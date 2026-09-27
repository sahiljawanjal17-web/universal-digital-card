# PART-09 — ROLE MODULE: EVENT / WEDDING PHOTOGRAPHER

**Status:** ⬜ Not started
**Est:** 2 days · **Blocked by:** PART-04 · **Parallel with:** PART-05–08, 10

> 🎨 Yeh **portfolio piece** hai — visually sabse impressive role.
> Dark-first theme (`noir-gold`), editorial typography, cinematic motion.

---

## 1. Goal
`photographer` role ka module — Masonry Media Gallery + Date Availability (minimum)
+ package builder, moodboard picker, case studies, showreel (premium).

## 2. Read First
- `docs/09-FEATURE-MATRIX.md` **Section F** (P1–P14)
- `docs/04-DESIGN-SYSTEM.md` §2 (`noir-gold` theme — sharp radius, dark-first)
- `docs/03-CONFIG-SCHEMA.md` → `photographer` module block

## 3. Files To Create

```
src/modules/photographer/
├─ index.ts
├─ types.ts
├─ components/
│  ├─ MasonryGallery.tsx          # P1 — hero widget
│  ├─ GalleryFilterTabs.tsx       # Wedding / Pre-wedding / Engagement / Portrait
│  ├─ MediaLightbox.tsx           # P14
│  ├─ AvailabilityChecker.tsx     # P2
│  ├─ ShowreelHero.tsx            # P3
│  ├─ PackageBuilder.tsx          # P4
│  ├─ CaseStudyStory.tsx          # P5
│  ├─ MoodboardPicker.tsx         # P6
│  ├─ PrivateGalleryTeaser.tsx    # P7
│  ├─ InstagramGrid.tsx           # P8
│  ├─ TravelMap.tsx               # P9
│  ├─ TeamAndGear.tsx             # P10
│  ├─ AlbumDownloadGate.tsx       # P11
│  └─ DateScarcityBanner.tsx      # P12
├─ lib/
│  ├─ availability.ts             # booked/tentative/free + lead-time rules
│  ├─ pricing.ts                  # package + addons + season multiplier
│  ├─ gallery.ts                  # grouping, tag filtering, photo dimensions
│  └─ wa-templates.ts
└─ data/
   └─ gear.ts
```

## 4. Open-Source Sources
| Need | From |
|------|------|
| Masonry layout | `igordanchenko/react-photo-album` (`layout="masonry"`) |
| Lightbox | `igordanchenko/yet-another-react-lightbox` + plugins: `zoom`, `thumbnails`, `video`, `captions`, `fullscreen` |
| Date picker with modifiers | `react-day-picker` (via shadcn `calendar`) |
| Parallax hero | Aceternity `Hero Parallax` |
| Scroll-driven story | `motion` `useScroll` + `useTransform` |
| Infinite testimonials | Aceternity `Infinite Moving Cards` |
| Video hero | our `VideoHero` (PART-02) |

## 5. Implementation Steps

1. **`ShowreelHero`** (P3)
   - Full-bleed muted video loop (8–12s, < 3MB, webm + mp4)
   - Poster image first, video swaps in on `canplaythrough`
   - Gradient scrim bottom → text readable
   - Overlay: serif display name, tagline, 2 CTAs (Check Availability / WhatsApp)
   - Sound toggle button (starts muted — a11y)
   - `prefers-reduced-motion` → poster only
2. **`MasonryGallery`** (P1)
   - `react-photo-album` masonry, columns: 1 (mobile) / 2 (sm) / 3 (lg)
   - Photos need `width`/`height` in data → zero CLS (PART-11 ko batao)
   - Mixed photo + video items — video thumbnails with play icon overlay
   - Filter tabs by tag; `AnimatePresence` layout animation on filter change
   - Progressive load: first 12, then "Load more" / infinite scroll
   - Hover: subtle zoom + caption fade-in (desktop only)
3. **`MediaLightbox`** (P14) — YARL with zoom, thumbnails strip, captions,
   video plugin, keyboard arrows, swipe, counter "12 / 84", share button per image.
4. **`AvailabilityChecker`** (P2) — the lead engine
   - Calendar with modifiers from `module.availability`:
     - 🔴 `booked` — disabled, "Booked"
     - 🟡 `tentative` — selectable with warning
     - 🟢 free — selectable
     - grey — past dates / inside `leadDays` buffer
   - Select date → status card:
     - Available → "✨ This date is open! Block it now" + event type select + WhatsApp CTA
     - Tentative → "⚠️ Another enquiry is in progress — confirm fast"
     - Booked → "Booked. Here are 3 nearby available dates:" (suggest alternatives)
   - Multi-day select for 2–3 day weddings
5. **`PackageBuilder`** (P4) — self-qualifying lead machine
   - Step 1: Event type (Wedding / Pre-wedding / Engagement / Corporate / Birthday)
   - Step 2: Base package cards (Silver / Gold / Platinum) with includes list
   - Step 3: Add-ons checkboxes (Drone ₹25k, Same-day edit ₹35k, Extra album ₹18k,
     Live streaming ₹40k, Additional day ₹65k)
   - Step 4: Days count, city (travel charge auto-add for outstation)
   - **Live total** `NumberTicker`, sticky panel
   - CTA: "Send my custom quote on WhatsApp" → itemized message
6. **`CaseStudyStory`** (P5) — scroll-driven story per album:
   cover parallax → 3–4 photo beats with couple's story text → testimonial → CTA.
   2–3 stories enough.
7. **`MoodboardPicker`** (P6) — 4 style cards with sample image
   (Candid / Traditional / Cinematic / Documentary), multi-select →
   feeds into the enquiry message. Premium consultative touch.
8. **`DateScarcityBanner`** (P12) — computed from availability:
   "Only 4 dates left in Feb 2027" — genuine scarcity from data, fake nahi.
9. **`TravelMap`** (P9) — simple India SVG/illustration with city pins from
   `module.travelCities` + travel policy note.
10. **`TeamAndGear`** (P10) — team avatars with roles; gear list (cameras, lenses, drones)
    as badges. Justifies pricing.
11. **`PrivateGalleryTeaser`** (P7) — password field (simulated), "Client gallery access"
    card. Wrong password → "Contact us for access" → WhatsApp.
12. **`InstagramGrid`** (P8) — static 9-image grid from data + "Follow" CTA
    (no API — dummy data).
13. **`AlbumDownloadGate`** (P11) — name+phone → sample album PDF + WhatsApp lead.

## 6. WhatsApp Templates

### `date_availability`
```
*Date Availability Enquiry* 📸

Event Date: 14 Feb 2027 (Sunday)
Event Type: Wedding
City: Udaipur, Rajasthan
Status shown: Available ✨

Name: Rohit Deshmukh
Phone: +91 98765 43210

Please confirm and share package details.

— via Aarav Studios website
```

### `package_enquiry`
```
*Custom Package Quote* 💍

Event: Wedding (2 days)
Base Package: Gold — ₹1,85,000

Add-ons:
• Drone Coverage — ₹25,000
• Same-Day Edit — ₹35,000

Location: Udaipur (outstation +₹40,000)
*Estimated Total: ₹2,85,000*

Preferred Style: Cinematic, Candid
Date: 14 Feb 2027

Please confirm availability & final quote.

— via Aarav Studios website
```

### `moodboard_share`
```
*My Shoot Preferences* 🎨

Style: Cinematic + Candid
Event: Pre-Wedding
Preferred Location: Udaipur / Goa
Tentative Month: Dec 2026
Budget Range: ₹1,00,000 – ₹1,50,000

Let's discuss.

— via Aarav Studios website
```

## 7. Data Requirement (PART-11) — **heaviest role**
- **60–90 photos** with `width`/`height` metadata, tagged by category
  - Unsplash/Pexels: `indian wedding photography`, `haldi ceremony`, `mehendi`,
    `indian bride portrait`, `baraat`, `pre wedding couple india`, `sangeet`
- 4–6 short video clips (Coverr/Pexels) + 1 showreel (12s)
- 3 case-study albums with 8–10 photos each + story text
- 3 packages + 6 add-ons with realistic Indian wedding pricing
- Availability JSON: ~20 booked, ~8 tentative dates spread over 12 months
- 4 style sample images
- 6 team members, 12 gear items
- 10 couple testimonials with names + wedding dates + cities
- 1 sample album PDF

> **Photo dimensions mandatory hain** masonry ke liye. `scripts/prefetch-media.ts`
> ko dimensions extract karke JSON me likhna chahiye.

## 8. Definition of Done
- [ ] Masonry 1/2/3 columns pe correctly reflow hoti hai
- [ ] Zero CLS on gallery load (dimensions se)
- [ ] Filter tabs smooth layout animation
- [ ] Lightbox: zoom, swipe, keyboard, thumbnails, video — sab kaam karte hain
- [ ] 80+ images pe scroll 60fps (lazy + progressive load verify)
- [ ] Showreel mobile Safari pe autoplay hoti hai, sound toggle kaam karta hai
- [ ] `prefers-reduced-motion` pe video off, poster only
- [ ] Availability calendar 3 states correct, past dates disabled
- [ ] Booked date pe 3 alternative dates suggest hote hain
- [ ] Multi-day selection kaam karti hai
- [ ] Package builder live total correct (base + addons + travel + days)
- [ ] Itemized WhatsApp quote message readable
- [ ] Scarcity banner real data se compute hota hai
- [ ] Dark theme (`noir-gold`) polished — yeh role ka default
- [ ] Light variant bhi acceptable dikhta hai
- [ ] Saare 3 WhatsApp templates test kiye
- [ ] Commit: `feat(part-09): photographer module`

## 9. Handoff
`MasonryGallery` + `MediaLightbox` **generic** hain →
`src/components/media/` me promote karo. PART-05 (property images) aur
PART-10 (transformation gallery) reuse kar sakte hain.
