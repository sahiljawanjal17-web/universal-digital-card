# PART-06 — ROLE MODULE: INSURANCE AGENT

**Status:** ⬜ Not started
**Est:** 1.5 days · **Blocked by:** PART-04 · **Parallel with:** PART-05, 07–10

---

## 1. Goal
`insurance` role ka module — Quick Premium Estimator (minimum) + HLV calculator,
80C/80D tax saving, claim-ratio comparison, renewal reminders (premium upgrades).

## 2. Read First
- `docs/09-FEATURE-MATRIX.md` **Section C** (I1–I13)
- `docs/03-CONFIG-SCHEMA.md` → `insurance` module block

## 3. Files To Create

```
src/modules/insurance/
├─ index.ts
├─ types.ts
├─ components/
│  ├─ PremiumEstimator.tsx        # I1, I2 — hero widget
│  ├─ ProductTabs.tsx             # Term / Health / Motor switch
│  ├─ HlvCalculator.tsx           # I3
│  ├─ TaxSavingCalculator.tsx     # I4
│  ├─ ClaimRatioTable.tsx         # I5
│  ├─ PlanComparison.tsx          # I6
│  ├─ RenewalReminder.tsx         # I7
│  ├─ GoalPlanner.tsx             # I8 (child education / retirement)
│  ├─ ClaimChecklist.tsx          # I9
│  ├─ IrdaiTrustBar.tsx           # I10
│  ├─ PaymentModeCompare.tsx      # I11
│  ├─ PolicyHealthCheck.tsx       # I12
│  └─ QuoteSummaryCard.tsx        # I13
├─ lib/
│  ├─ premium.ts                  # rate-table lookup + loadings
│  ├─ hlv.ts
│  ├─ tax-saving.ts
│  ├─ goal.ts                     # future value / inflation
│  ├─ ics.ts                      # renewal .ics builder
│  └─ wa-templates.ts
└─ data/
   └─ insurers.ts                 # logos + claim ratios (dummy)
```

## 4. Open-Source Sources
| Need | From |
|------|------|
| Slider with live value bubble | Origin UI / shadcn `slider` + custom label |
| Comparison table (sticky header) | shadcn `table` + Tremor patterns |
| Animated number | Magic UI `NumberTicker` |
| Charts | `recharts` (area for corpus growth, bar for premium split) |
| Calendar file | hand-rolled `.ics` (RFC 5545 minimal VEVENT) |

## 5. Implementation Steps

1. **`lib/premium.ts`** — pure function:
   ```ts
   estimatePremium({ product, age, cover, tenure, smoker, gender }): {
     annual: number; monthly: number; totalPaid: number; bandUsed: string;
   }
   ```
   - Rate table `module.estimator.rateTable` se (age-band → rate per ₹1 cover)
   - Loadings: smoker ×1.6, female ×0.9
   - GST 18% add karo, clearly line-item me dikhao
   - **Yeh dummy indicative rates hain** — `DisclaimerNote` mandatory
2. **`PremiumEstimator`** (I1, I2)
   - Product tabs: Term / Health / Motor (Motor: vehicle type + IDV)
   - Age slider 18–65 with live bubble
   - Cover: chip options (₹25L, ₹50L, ₹1Cr, ₹2.5Cr, ₹5Cr) + custom
   - Tenure slider
   - Smoker toggle, gender toggle
   - **Live result card** (desktop: sticky right; mobile: sticky bottom sheet)
     - Big monthly premium `NumberTicker`
     - "₹X/day" framing (powerful: "₹42/day for ₹1 Cr cover")
     - Annual / total paid breakdown
   - CTA: **"Get Exact Quote on WhatsApp"** → `premium_quote` template
3. **`HlvCalculator`** (I3) — income, age, retirement age, liabilities, existing cover
   → recommended cover. Result: "You need ₹X Cr, you have ₹Y Cr, **gap ₹Z Cr**".
   Gap ko red highlight karo — yeh conversion driver hai.
   CTA: "Cover my gap" → WhatsApp.
4. **`TaxSavingCalculator`** (I4) — 80C (₹1.5L) + 80D (₹25k / ₹50k senior parents).
   Input: current 80C usage, tax slab. Output: "You can still save ₹X in tax".
   Seasonal banner Jan–Mar (date-based, flag).
5. **`ClaimRatioTable`** (I5) — `data/insurers.ts` se, sortable, top-3 highlighted,
   source-year footnote.
6. **`PlanComparison`** (I6) — 3 plans side-by-side, "Popular" column highlighted,
   feature ✓/✗ matrix, per-plan WhatsApp CTA.
7. **`RenewalReminder`** (I7) — policy type + renewal date input →
   - `.ics` download (30-day + 7-day alarm)
   - WhatsApp reminder request
8. **`GoalPlanner`** (I8) — child's current age / target age / today's cost / inflation %
   → required corpus + monthly SIP. Area chart showing growth.
9. **`ClaimChecklist`** (I9) — claim type (death / health / motor) → document list,
   checkbox progress, "Send checklist on WhatsApp".
10. **`PolicyHealthCheck`** (I12) — simple CTA card: "Share your existing policy PDF on
    WhatsApp, get a free review in 24 hrs" → `policy_review` intent.
11. **`IrdaiTrustBar`** (I10) — license number, years, families served (NumberTicker),
    insurer logo marquee.

## 6. WhatsApp Templates

### `premium_quote`
```
*Insurance Quote Request* 🛡️

Product: Term Life
Age: 32 years
Cover: ₹1,00,00,000
Tenure: 30 years
Smoker: No
Estimated Premium: ₹1,284/month (₹15,410/year incl. GST)

Please share exact quotes from top insurers.

— via Verma Insurance Advisory website
```

### `hlv_gap`
```
*Cover Gap Analysis* 📊

Annual Income: ₹18,00,000
Age: 32 · Retirement: 60
Liabilities: ₹45,00,000
Existing Cover: ₹50,00,000

Recommended Cover: ₹2,20,00,000
*Cover Gap: ₹1,70,00,000*

Please suggest a plan to close this gap.

— via Verma Insurance Advisory website
```

### `renewal_reminder`
```
*Renewal Reminder Setup* 🔔

Policy Type: Health Insurance
Insurer: Star Health
Renewal Date: 14 Mar 2027
Name: Rohit Deshmukh

Please remind me 15 days before.

— via Verma Insurance Advisory website
```

### `tax_saving`
```
*Tax Saving Enquiry* 💰

Tax Slab: 30%
80C Used: ₹80,000 of ₹1,50,000
80D Used: ₹0 of ₹25,000

Potential Additional Saving: ₹28,500

Please suggest tax-saving insurance plans.

— via Verma Insurance Advisory website
```

## 7. Data Requirement (PART-11)
- 6–8 insurer entries with logo, claim ratio, USPs
- Rate table for 4 age bands × 3 products
- 6 plan cards (2 term, 2 health, 2 motor)
- 8 testimonials (families, claim experiences)
- 10 FAQs (claim process, medical test, waiting period, portability)

## 8. Definition of Done
- [ ] Estimator 3 products pe kaam karta hai
- [ ] Sliders touch-friendly, live value bubble
- [ ] Premium math rate table se consistent, GST line-item alag
- [ ] "₹X/day" framing correct
- [ ] HLV gap calculation sahi, gap prominently highlighted
- [ ] Tax saving 80C + 80D limits correctly capped
- [ ] Goal planner inflation math verified
- [ ] `.ics` file Google Calendar + Outlook dono me import hoti hai
- [ ] Claim ratio table sortable + mobile pe horizontally scrollable
- [ ] Plan comparison mobile pe usable (swipe cards)
- [ ] Har calculator pe `DisclaimerNote` ("Indicative only. Actual premium subject to underwriting.")
- [ ] Saare 4 WhatsApp templates test kiye
- [ ] Sticky result panel mobile pe content block nahi karta
- [ ] Commit: `feat(part-06): insurance module`

## 9. Handoff
`lib/ics.ts` reusable hai → PART-07 (appointment) aur PART-08 (due dates) me
`src/lib/utils/ics.ts` me promote karna pad sakta hai. Coordinate karo.

### Chunk 1 — done (commit `02ff38b`)
**Bana:**
- `src/modules/insurance/types.ts` — schema se inferred types (`InsuranceModule`, `EstimatorConfig`, `HlvConfig`, `Plan`).
- `src/modules/insurance/hooks/useInsuranceModule.ts` — `{ module, business }`; widgets config sirf yahin se padhte hain.
- `src/modules/insurance/lib/premium.ts` — `estimatePremium(input, estimator)` → `{ base, gst, annual, monthly, perDay, totalPaid, bandUsed, loadingsApplied }` ya `null`
  (rate table nahi / age band ke bahar). Loadings `estimator.loadings` ke `smoker` / `female` keys se. `pricedProducts()` sirf rate-table wale products deta hai.
- `src/modules/insurance/lib/hlv.ts` — `calculateHlv(input, module.hlv)` income-replacement method (PV annuity), lakh me round-up, gap kabhi negative nahi.
- `src/modules/insurance/lib/wa-templates.ts` — `premium_quote`, `hlv_gap` register; `premiumFields()`, `hlvFields()`, `productLabel()`.
- `src/modules/insurance/lib/insurance.test.ts` — 10 tests (bands, GST, loadings, null cases, HLV §6 example ≈ ₹2.2 Cr, templates).
- `components/PremiumEstimator.tsx` (I1/I2, widget key `premiumEstimator`) — product pills (sirf >1 priced product ho tab), age/tenure sliders,
  cover chips + Custom, smoker/gender toggles, result card (NumberTicker monthly, ₹/day, GST line-item, total), desktop sticky + mobile sticky bar.
- `components/HlvCalculator.tsx` (I3, widget key `humanLifeValue`) — need/have stats, gap `border-danger text-danger` card, "Cover my gap" CTA.
- `index.ts` — `widgets = { premiumEstimator, humanLifeValue }`, templates import pe register.

**Shared changes:**
- `CalcControls` (`CalcSlider`, `CalcNumber`, `ResultStat`, `ResultRow`) real-estate se `src/components/shared/CalcControls.tsx` me promote kiya,
  `@/components/shared` se export. Real-estate ke 4 calculators ke imports update.
- `src/lib/constants/intents.ts` + `core/whatsapp/templates/base.ts` `INTENT_TITLES`: `premium_quote`, `hlv_gap` add.
- `insurance.schema.ts`: `estimator.gstRate` (default 0.18) + `hlv { selfExpenseRatio 0.3, discountRate 0.06, retirementAge 60 }` (`.prefault({})`, JSON me optional).

**Active role:** `src/config/site.config.json` → `"role"` abhi `doctor` hi hai. Local check ke liye `insurance` karo, kaam ke baad wapas `doctor`
(ya jo user bole). Chunk 1 me `npm run build` insurance role pe GREEN tha.

**Chunk 2 pending (priority):**
1. I4 `TaxSavingCalculator` (+ `lib/tax-saving.ts`, `tax_saving` intent, Jan–Mar banner via IST `istDate`).
2. I5 `ClaimRatioTable` + `data/insurers.ts` / I6 `PlanComparison` (preset keys `claimRatio`, `planCompare`) — `module.plans` abhi sirf 1 placeholder hai.
3. I7 `RenewalReminder` (`lib/ics.ts`, doctor ka `ics.ts` pattern; `renewal_reminder` intent), I8 `GoalPlanner`, I9 `ClaimChecklist`, I10–I13.
4. Health/Motor ke rate tables data me nahi hain → abhi sirf Term priced hai; Motor ko IDV input chahiye (PART-11 data ke saath).
