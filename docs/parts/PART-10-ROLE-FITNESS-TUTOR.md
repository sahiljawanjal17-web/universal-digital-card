# PART-10 — ROLE MODULE: GYM TRAINER / TUTOR

**Status:** ⬜ Not started
**Est:** 2 days · **Blocked by:** PART-04 · **Parallel with:** PART-05–09

> Ek module, **do variants**: `module.variant = "gym" | "tutor"`.
> Shared engine (VIP Pass, timetable, programs), alag content + accent color.

---

## 1. Goal
`fitness-tutor` role ka module — Virtual 1-Day VIP Pass Generator (minimum)
+ BMI/BMR/TDEE, transformations, timetable, programs (gym) / demo class,
results, batches (tutor).

## 2. Read First
- `docs/09-FEATURE-MATRIX.md` **Section G** (G1–G16)
- `docs/03-CONFIG-SCHEMA.md` → `fitness-tutor` module block

## 3. Files To Create

```
src/modules/fitness-tutor/
├─ index.ts
├─ types.ts
├─ components/
│  ├─ VipPassGenerator.tsx        # G1, G2, G10 — hero widget
│  ├─ VipPassCard.tsx             # the visual pass
│  ├─ BodyCalculators.tsx         # G3 (bmi/bmr/tdee tabs)
│  ├─ TransformationSlider.tsx    # G4
│  ├─ ProgramCards.tsx            # G5 / G15 (fee structure)
│  ├─ Timetable.tsx               # G6 / G13 (batches + seats left)
│  ├─ DietPlanGate.tsx            # G7 / G14 (mock test download)
│  ├─ CertificationsRow.tsx       # G8
│  ├─ ProgressTeaser.tsx          # G9
│  ├─ BoardSubjectSelector.tsx    # G11 (tutor)
│  ├─ ResultsShowcase.tsx         # G12 (tutor)
│  └─ DoubtSolveCta.tsx           # G16 (tutor)
├─ lib/
│  ├─ pass.ts                     # pass id, expiry, QR payload, signature
│  ├─ body-metrics.ts             # BMI, BMR (Mifflin-St Jeor), TDEE
│  ├─ seats.ts                    # seats-left computation
│  └─ wa-templates.ts
└─ data/
   └─ activity-levels.ts

src/app/api/pass/route.ts          # OG-image style pass PNG (server)
src/app/(site)/pass/[id]/page.tsx  # shareable pass page (optional, flag)
```

## 4. Open-Source Sources
| Need | From |
|------|------|
| Pass image generation | `next/og` `ImageResponse` (server) — best quality |
| Client fallback download | `html-to-image` `toPng` |
| QR | `qrcode.react` |
| Before/After | Aceternity `Compare` (same as PART-07) |
| Gradient card + shine | Magic UI `BorderBeam` + `ShimmerButton` |
| Confetti on generate | Magic UI `Confetti` |
| Timetable grid | shadcn `table` + `tabs` |

## 5. Implementation Steps

### 5.1 VIP Pass Generator — the signature feature

**Flow:**
```
Step 1  Form: Name, Phone, Goal (Weight loss / Muscle gain / General fitness)
        [tutor variant: Name, Phone, Class, Board, Subject]
        + preferred date
Step 2  Generate -> animated reveal (flip/scale) + confetti
Step 3  Pass card displayed
Step 4  Actions: [Download as Image] [Share on WhatsApp] [Add to Calendar]
```

**Pass card design** (`VipPassCard.tsx`):
```
┌────────────────────────────────────────┐
│  ▍IRON FORGE GYM          1-DAY VIP    │  gradient header, logo
│                                        │
│  ROHIT DESHMUKH                        │  big display font
│  Goal: Muscle Gain                     │
│                                        │
│  Valid on   : 22 Sep 2026              │
│  Pass ID    : VIP-2K9F4A               │
│  Issued     : 20 Sep 2026              │
│                                        │
│  ✓ Full gym access                     │
│  ✓ 1 personal training session         │
│  ✓ Body composition scan               │
│                                        │
│  [QR]        Show this at the counter  │
│  ─────────────────────────────────────  │
│  ironforge.in · +91 98765 43210        │
└────────────────────────────────────────┘
```
- Aspect ratio **1.586:1** (credit-card) — feels real
- Gradient using role accent, subtle noise texture, `BorderBeam` shimmer
- Perforated edge / ticket notch detail (CSS mask)
- QR encodes pass verify URL or the pass payload

**`lib/pass.ts`:**
```ts
generatePass({ name, phone, goal, validDate }): {
  id: string;            // VIP-<6 char base36 from hash>
  issuedAt: Date;
  validOn: Date;
  expiresAt: Date;       // validOn end-of-day
  qrPayload: string;
}
```
- Deterministic id from `hash(phone + validDate)` → same person, same day = same id
- **No auth/crypto claim** — yeh simulated pass hai, clearly marked

**Download:**
- Primary: `GET /api/pass?name=..&id=..&date=..` → `ImageResponse` PNG (crisp, 1200×756)
- Fallback: `html-to-image` client-side
- Filename: `vip-pass-<id>.png`

**Share:** Web Share API with the image file if `navigator.canShare({ files })`,
warna WhatsApp text + link.

### 5.2 Body Calculators (G3)
```
BMI  = kg / m²                          → category + healthy range bar
BMR  = Mifflin-St Jeor
       male:   10w + 6.25h − 5a + 5
       female: 10w + 6.25h − 5a − 161
TDEE = BMR × activityFactor (1.2 / 1.375 / 1.55 / 1.725 / 1.9)
Goal calories: deficit −500 / surplus +400
Macros: protein 2g/kg, fat 25%, rest carbs
```
- Tabs: BMI / BMR-TDEE / Macros
- Visual: BMI gauge with colored zones, pointer animation
- CTA: "Get a personalised plan" → WhatsApp with computed numbers
- `DisclaimerNote`: "Estimates only. Consult a professional."

### 5.3 Gym variant components
- **`TransformationSlider`** (G4) — before/after `Compare` + name, weeks, kg lost,
  quote. Carousel of 6 transformations.
- **`ProgramCards`** (G5) — 12-week / 6-month / PT packages, price, sessions,
  "EMI from ₹1,500/mo", includes list, WhatsApp CTA per program.
- **`Timetable`** (G6) — weekly grid (Mon–Sun × time slots), class name + trainer.
  Mobile: day tabs. "Today" highlighted.
- **`DietPlanGate`** (G7) — name+phone → 7-day diet plan PDF + WhatsApp lead.
- **`CertificationsRow`** (G8) — ACE / K11 / ISSA / Nutrition badges.

### 5.4 Tutor variant components
- **`BoardSubjectSelector`** (G11) — Board → Class → Subject cascade →
  matched batch card (timing, seats left, fee) → "Book Free Demo" → VIP Pass flow.
- **`ResultsShowcase`** (G12) — year tabs, topper cards with photo + score,
  aggregate stats ("94% students scored 90%+"). **Indian parents ka #1 decision factor.**
- **`Timetable`** as batch schedule with `seatsLeft` scarcity badge (G13).
- **`DietPlanGate`** reused as **mock test / sample paper download** (G14).
- **`DoubtSolveCta`** (G16) — "Stuck on a problem? Send a photo on WhatsApp."

### 5.5 Variant switching
`module.variant` reads from data. Preset sections array me dono ke sections
list kar do; component khud `variant` check karke render/null kare.
**Note:** yeh `role` conditional nahi hai, `data` conditional hai — allowed.

## 6. WhatsApp Templates

### `vip_pass` (gym)
```
*1-Day VIP Pass Generated* 🎟️

Name: Rohit Deshmukh
Pass ID: VIP-2K9F4A
Valid On: 22 Sep 2026
Goal: Muscle Gain

Includes:
✓ Full gym access
✓ 1 personal training session
✓ Body composition scan

I'd like to confirm my visit.

— via Iron Forge Gym website
```

### `vip_pass` (tutor — demo class)
```
*Free Demo Class Pass* 🎟️

Name: Aditi Joshi
Pass ID: DEMO-7X3B1C
Valid On: 22 Sep 2026
Class: 11th · CBSE
Subject: Physics

Batch: Mon/Wed/Fri · 6:00 PM – 7:30 PM
Seats Left: 4

Please confirm my demo class.

— via Pathshala Classes website
```

### `fitness_plan`
```
*Personalised Plan Request* 💪

Name: Rohit Deshmukh
Age: 28 · Male
Height: 175 cm · Weight: 82 kg
BMI: 26.8 (Overweight)
BMR: 1,806 kcal · TDEE: 2,800 kcal
Goal: Weight loss (target 2,300 kcal/day)

Please suggest a diet + workout plan.

— via Iron Forge Gym website
```

### `program_enquiry`
```
*Program Enquiry* 🏋️

Program: 12-Week Transformation
Sessions: 36
Price: ₹18,000 (EMI from ₹1,500/mo)

Name: Rohit Deshmukh
Phone: +91 98765 43210

Please share the schedule & next batch date.

— via Iron Forge Gym website
```

## 7. Data Requirement (PART-11)
**Gym:**
- 6 transformations (before/after pairs — Pexels `fitness transformation`, `indian gym`)
- 4 programs with pricing
- Weekly timetable, 6 classes × 7 days
- 5 certifications, 3 trainers
- Gym interior photos + 1 short workout video loop
- 1 diet plan PDF

**Tutor:**
- 3 boards × 4 classes × 4 subjects
- 8 batches with timings + seats left
- 3 years × 6 toppers with scores
- Classroom photos
- 1 sample paper PDF

Both: 10 testimonials, 12 FAQs.

## 8. Definition of Done
- [ ] VIP pass generate hota hai, animation smooth
- [ ] Pass card premium dikhta hai (screenshot lekar judge karo — "would I share this?")
- [ ] Same phone + same date → same pass ID (deterministic)
- [ ] `/api/pass` PNG crisp hai (1200×756, text sharp)
- [ ] Client fallback (`html-to-image`) bhi kaam karta hai
- [ ] Download filename correct
- [ ] Web Share API se image share hoti hai (Android Chrome)
- [ ] QR scan karne pe sahi payload/URL milta hai
- [ ] Confetti fire hota hai (reduced-motion pe nahi)
- [ ] BMI / BMR / TDEE / macros math verified against standard calculators
- [ ] BMI gauge pointer correct zone me
- [ ] Transformation slider smooth, 6 cases
- [ ] Timetable mobile pe day-tabs se usable
- [ ] **`variant: "gym"` aur `variant: "tutor"` dono fully render hote hain**
- [ ] Tutor cascade (board→class→subject) → correct batch
- [ ] Seats-left scarcity data se aata hai
- [ ] Results showcase year tabs kaam karte hain
- [ ] Saare 4 WhatsApp templates test kiye
- [ ] Commit: `feat(part-10): fitness/tutor module with VIP pass`

## 9. Handoff
`VipPassGenerator` engine **generic** hai (pass = name + id + validity + perks + QR).
Future roles (salon day-pass, restaurant voucher, event ticket) isko reuse kar sakte hain
→ agar zaroorat pade `src/core/pass/` me promote karo.
