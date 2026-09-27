# PART-05 — ROLE MODULE: REAL ESTATE AGENT

**Status:** 🟡 In progress — chunk 1 of 3 done
**Est:** 2 days · **Blocked by:** PART-04 · **Parallel with:** PART-06…10

---

## 1. Goal
`real-estate` role ka complete specialized module — Smart Property Filter (minimum)
+ EMI / stamp duty / rent-vs-buy calculators, compare, shortlist, RERA trust
(premium upgrades).

## 2. Read First
- `docs/09-FEATURE-MATRIX.md` **Section B** (R1–R17)
- `docs/03-CONFIG-SCHEMA.md` → `real-estate` module block
- `docs/07-CONVENTIONS.md` §6 (currency formatting), §7 (WhatsApp standard)

## 3. Files To Create

```
src/modules/real-estate/
├─ index.ts                       # RoleModule export
├─ types.ts                       # z.infer from schema
├─ components/
│  ├─ PropertyFilter.tsx          # R1, R3  — the hero widget
│  ├─ PropertyCard.tsx
│  ├─ PropertyGrid.tsx
│  ├─ PropertyDetailDrawer.tsx    # R12 floor plan + tour
│  ├─ EmiCalculator.tsx           # R4
│  ├─ StampDutyEstimator.tsx      # R5
│  ├─ RentVsBuy.tsx               # R6
│  ├─ LoanEligibility.tsx         # R7
│  ├─ CompareTray.tsx             # R8
│  ├─ ShortlistBar.tsx            # R9
│  ├─ ReraBadge.tsx               # R10
│  ├─ LocalityChips.tsx           # R11
│  ├─ SiteVisitScheduler.tsx      # R13
│  ├─ PriceTrend.tsx              # R14
│  ├─ BrochureGate.tsx            # R15
│  ├─ PossessionTimeline.tsx      # R16
│  └─ NriCorner.tsx               # R17
├─ lib/
│  ├─ filter.ts                   # pure filter/sort functions
│  ├─ emi.ts                      # EMI + amortization math
│  ├─ stamp-duty.ts               # state-wise rules
│  ├─ rent-vs-buy.ts
│  ├─ eligibility.ts
│  └─ wa-templates.ts             # property_enquiry, site_visit, shortlist_share
├─ hooks/
│  ├─ usePropertyFilter.ts        # nuqs URL state
│  ├─ useShortlist.ts             # localStorage
│  └─ useCompare.ts
└─ data/
   └─ localities.ts               # dropdown source (Pune sample)
```

## 4. Open-Source Sources
| Need | From |
|------|------|
| Faceted filter + URL state pattern | `sadmann7/skateshop` → `src/components/products-filter` |
| Range slider with tooltips | Origin UI slider variants |
| Charts (EMI split, price trend) | `recharts` + shadcn `chart` |
| Drawer / bottom-sheet | shadcn `drawer` (vaul) |
| Card hover 3D | Aceternity `3D Card Effect` (use sparingly — featured cards only) |
| Image carousel in card | `embla-carousel-react` |

## 5. Implementation Steps

1. **Types + schema** — `03-CONFIG-SCHEMA.md` ka property shape zod me. `z.infer` se types.
2. **`lib/filter.ts`** — pure functions, no React:
   ```ts
   filterProperties(all, { budget:[min,max], bhk:number[], type, locality, furnishing, possession, areaMin })
   sortProperties(list, 'price-asc'|'price-desc'|'area-desc'|'newest')
   ```
   Unit-testable. **Yahin se shuru karo** — UI baad me.
3. **`usePropertyFilter`** — `nuqs` se URL state. Result: filtered link WhatsApp pe
   share ho sakta hai → premium touch.
4. **`PropertyFilter` UI**
   - Budget: dual-range slider, labels `₹25 L` → `₹5 Cr` (`formatINRShort`)
   - BHK: toggle-group chips `1 2 3 4 5+`
   - Type / Locality / Furnishing / Possession: shadcn `select` / chips
   - Mobile: "Filters" button → bottom drawer with Apply/Reset + live result count
   - Desktop: sticky left sidebar
   - Active filters as removable chips
   - Result count live: "18 properties match"
5. **`PropertyCard`** — image carousel, price (`formatINR` + `formatINRShort` badge),
   BHK · carpet area · floor, locality, RERA badge, amenity icons,
   3 actions: **Enquire on WhatsApp** · **Shortlist ♡** · **Compare ⇄**
6. **`EmiCalculator`** (R4)
   ```
   EMI = P × r × (1+r)^n / ((1+r)^n − 1)
   r = annualRate / 12 / 100,  n = tenureYears × 12
   ```
   - Inputs: loan amount (auto from property price − down payment), rate, tenure
   - Output: monthly EMI (big NumberTicker), total interest, total payable
   - Donut chart: principal vs interest
   - Amortization year-wise table (collapsible)
   - CTA: "Get pre-approved loan help" → WhatsApp with EMI summary
   - `DisclaimerNote` mandatory
7. **`StampDutyEstimator`** (R5)
   - `module.stampDuty` se state rules; female buyer rebate toggle
   - Output breakdown: stamp duty + registration + GST (under-construction) + total
   - "Total cost of ownership" line = price + these
8. **`RentVsBuy`** (R6) — 10-year projection line chart, breakeven year highlight.
9. **`LoanEligibility`** (R7) — monthly income, existing EMIs, age → max loan (FOIR 50%).
10. **`CompareTray`** (R8) — max 3, sticky bottom tray, side-by-side table in drawer.
11. **`useShortlist`** (R9) — localStorage, ♡ count in navbar,
    **"Send my shortlist on WhatsApp"** → multi-property formatted message.
12. **`SiteVisitScheduler`** (R13) — date (next 7 days) + time slot chips → WhatsApp.
13. **`BrochureGate`** (R15) — name + phone → unlock PDF + fire WhatsApp lead.
14. **`LocalityChips`** (R11) — `nearby` array se distance chips with icons.
15. **Register module** — `index.ts` me widgets + waTemplates export, registry me add.
16. **Preset** — `real-estate.preset.ts` ka sections array finalize.

## 6. WhatsApp Templates

### `property_enquiry`
```
*Property Enquiry* 🏠

Property: 3BHK in Baner High-Rise (ID: p-001)
Price: ₹1,25,00,000
Carpet Area: 1275 sq.ft.
Locality: Baner, Pune
RERA: P52100048291

I'd like to know more about this property.

— via Sharma Realty website
```

### `site_visit`
```
*Site Visit Request* 📍

Property: 3BHK in Baner High-Rise (ID: p-001)
Preferred Date: Sat, 27 Sep 2026
Preferred Time: 11:00 AM – 1:00 PM
Name: Rohit Deshmukh
Phone: +91 98765 43210

— via Sharma Realty website
```

### `shortlist_share`
```
*My Shortlist* ♡ (3 properties)

1. 3BHK Baner High-Rise — ₹1.25 Cr — 1275 sq.ft.
2. 2BHK Kharadi Greens — ₹82 L — 940 sq.ft.
3. 4BHK Villa Wakad — ₹2.4 Cr — 2850 sq.ft.

Please share details & arrange visits.

— via Sharma Realty website
```

### `emi_help`
```
*Home Loan Assistance* 🏦

Property Price: ₹1,25,00,000
Down Payment: ₹25,00,000
Loan Amount: ₹1,00,00,000
Tenure: 20 years @ 8.5%
Estimated EMI: ₹86,782/month

Need help with loan pre-approval.

— via Sharma Realty website
```

## 7. Data Requirement (PART-11 ko batao)
- **20–24 properties** minimum, variety: 1–4 BHK, ₹35L–₹4Cr, apartment/villa/plot/commercial
- 4–6 images per property (Unsplash: `indian apartment interior`, `modern flat living room`,
  `pune apartment building`)
- 6 localities, realistic per-sqft rates
- 3 floor plan images, 2 YouTube tour URLs
- 1 brochure PDF dummy

## 8. Definition of Done
- [ ] Filter 8 dimensions pe kaam karta hai, URL me reflect hota hai
- [ ] Filtered URL share karne pe wahi result khulta hai
- [ ] Empty state: "No match — reset filters" CTA ke saath
- [ ] EMI math verified against a bank EMI calculator (±₹1)
- [ ] Stamp duty math Maharashtra rules ke hisaab se correct
- [ ] Rent vs Buy breakeven sensible
- [ ] Loan eligibility FOIR logic sahi
- [ ] Compare max 3 enforce, mobile pe scrollable table
- [ ] Shortlist localStorage me persist, reload pe survive
- [ ] Shortlist WhatsApp message 1800 chars se kam (10 properties pe bhi)
- [ ] Har calculator pe `DisclaimerNote`
- [ ] Saare 4 WhatsApp templates test kiye
- [ ] Mobile filter drawer smooth, Apply/Reset kaam karte hain
- [ ] 24 properties pe scroll performance smooth (60fps)
- [ ] `lib/*.ts` pure functions hain (React import nahi)
- [ ] Commit: `feat(part-05): real estate module`

## 9. Handoff (actual — chunk 1 done)

Commit: `48954bc` · role module wired, filter + EMI engines verified.

### Built in chunk 1

```
src/config/schema/modules/real-estate.schema.ts   PropertySchema + RealEstateModuleSchema
                                                  (already existed from PART-01 — unchanged)
src/data/roles/real-estate.json                   module.properties: 10 listings
                                                  (1-5 BHK, ₹32K/mo rent → ₹4.1 Cr sale,
                                                   apartment/villa/plot/commercial,
                                                   4 localities, budgetRange now [30L, 4.5Cr])

src/modules/real-estate/
├─ index.ts            widgets = { propertyFilter: PropertyBrowser }
│                     + waTemplates (= registerRealEstateTemplates), moduleId, export * from types
├─ types.ts            Property · RealEstateModule · PropertyType · ListingFor · Furnishing
│                     · PropertyStatus · NearbyPlace · RealEstateFilters · EmiDefaults
│                     · StampDutyRules   (all z.infer — no hand-written duplicates)
├─ lib/
│  ├─ filter.ts        FilterCriteria (8 facets) · EMPTY_CRITERIA · SORT_KEYS/SORT_LABELS
│  │                  · isSortKey · matchesCriteria · filterProperties · sortProperties
│  │                  · filterAndSort · countMatches · hasActiveFilters · possessionOptions
│  │                  · expandBhkSelection   ← "5+" chip ko open-ended banata hai;
│  │                    baaki BHK values EXACT match hain (3 ka matlab 3+ nahi)
│  ├─ emi.ts           EmiInput/EmiSummary/AmortizationYear · monthlyRate · calculateEmi
│  │                  · emiSummary · buildAmortization · downPaymentFromPct · loanAmount
│  └─ wa-templates.ts  registerRealEstateTemplates() — property_inquiry 🏠 / site_visit_book 📍
│                     / brochure_request     + propertyFields(p) -> MessageField[]
│                     + propertySummaryLine(p) ("title — ₹1.25 Cr — 1275 sq.ft.")
├─ hooks/
│  └─ usePropertyFilter.ts   nuqs URL state -> PropertyFilterState
│                           { all, results, criteria, sort, isFiltered, facets, possessions,
│                             setFilter(patch), toggleInList('bhk'|'type'|'locality', v), reset }
└─ components/
   ├─ PropertyBrowser.tsx   THE widget (`module:propertyFilter`) — SectionShell +
   │                       desktop sticky sidebar / mobile Drawer + live count +
   │                       active chips + sort <select> + grid
   ├─ PropertyFilter.tsx    facet panel (same markup desktop + drawer) + possessionLabel()
   ├─ PropertyGrid.tsx      grid + EmptyState("Reset filters"), stagger capped at 5 steps
   ├─ PropertyCard.tsx      embla carousel + price + specs + amenities + RERA + 3 actions
   ├─ PropertySpecs.tsx     BHK · bath · carpet · floor · locality (plot pe BHK hide)
   ├─ ReraBadge.tsx         R10
   ├─ BudgetSlider.tsx      dual-range, commit-on-release (drag pe URL nahi likhta)
   └─ FilterChips.tsx       FilterChip · ChipGroup · ActiveFilterChips
```

### URL contract (shareable filtered link)

`/?listingFor=&budgetMin=&budgetMax=&bhk=1,2&type=villa&locality=Baner&furnishing=&possession=&areaMin=&sort=`
— `history: 'replace'`, `shallow: true`. Default (`sort=relevance`, sab khaali) par param URL se hat jaata hai.
Verified live: `/?bhk=3&locality=Kharadi` → chips pre-selected + "1 of 10 property matches".

### Decisions taken (agle chunk me inhe follow karo)

1. **`module:propertyGrid` preset se hata diya.** Filter aur grid ek hi section hain, warna
   desktop sticky sidebar grid ke bagal me baith hi nahi sakta. `preset.modules[]` me
   `propertyGrid` naam abhi bhi hai (capability list), lekin koi widget us naam se nahi hai.
2. **Sort ke liye native `<select>`** — Base UI `Select` ka `SelectValue` label-rendering API
   confirm nahi kiya gaya; native select mobile pe better hai aur zero risk hai.
3. **Chips = plain `<button aria-pressed>`**, Base UI `ToggleGroup` nahi.
4. **`NuqsAdapter` ab `src/app/layout.tsx` me mounted hai** (ThemeProvider > RoleProvider >
   NuqsAdapter > AnalyticsProvider). Koi bhi doosra role ab nuqs use kar sakta hai.
5. `PropertyCard` ke `onShortlist`/`onCompare` props **optional** hain — chunk 2 me
   `useShortlist`/`useCompare` inhe `PropertyBrowser` se pass karenge, card badalna nahi padega.

### Verified

- `npx tsc --noEmit` · `npx eslint .` · `npm run validate:config` (6 roles) · `npm run contrast` 108/108
- `npm run build` clean **saare 6 roles** pe (koi role crash nahi karta)
- `filter.ts` + `emi.ts` 29 assertions `npx tsx` se pass (scratch file chala kar delete kar diya):
  - **EMI 1 Cr @ 8.5% / 20y = ₹86,782** — bank calculator se exact match (DoD ±₹1 ✅)
  - 50L @ 9% / 15y = ₹50,713 · zero-rate loan · zero principal
  - amortization: 20 rows, closing balance 0, principal repaid == loan
    (aakhri instalment rounding remainder absorb karta hai)
  - 8/8 facets + 5 sort keys + immutability + `expandBhkSelection`
- Live browser (localhost prod): module client-side mount hota hai, **console clean**
  (sirf Vercel Analytics ka local warning), cards/carousel/RERA/chips/count sab render

### ⚠️ Gotchas agle chunk ke liye

- **`ModuleSlot` client-only hai** (`useEffect` + lazy import) — module ka content SSR HTML me
  **kabhi nahi aayega**. `curl`/regex se verify mat karna, wo hamesha "nahi mila" dega.
  Browser extension is machine pe **connect hai** (`list_connected_browsers` ok), lekin click
  coordinates flaky hain; URL me query params daal kar verify karna sabse reliable hai.
- `data.module` `useRole()` se `unknown`-ish aata hai — `as RealEstateModule` cast module ke
  andar allowed hai (role wahan already fix hai).
- ESLint rule: hook ke andar variable ka naam **`module`** mat rakhna
  (`@next/next/no-assign-module-variable`) — `realEstate` use kiya hai.
- `StaggerGroup` ka delay unbounded hai; badi list me `Reveal delay={Math.min(i, 5) * 0.08}`
  pattern use karo (`PropertyGrid.tsx` dekho).
- Base UI `Slider` ka track 4px `bg-muted` hai — muted section pe dikhta hi nahi.
  `BudgetSlider.tsx` me `[&_[data-slot=slider-track]]:` arbitrary variants se fix kiya hai;
  naye sliders (LoanEligibility, RentVsBuy) me wahi pattern copy karo.
- `EMI ka core math (lib/emi.ts) already role-agnostic hai` — PART-07/PART-10 ko chahiye to
  `src/lib/finance/emi.ts` me move kar dena, import path ke alawa kuch nahi badlega.

### Baaki kaam (chunk 2 + 3)

**Chunk 2:** `EmiCalculator` (R4, recharts donut + amortization table + `DisclaimerNote`) ·
`StampDutyEstimator` (R5) · `RentVsBuy` (R6) · `LoanEligibility` (R7, FOIR 50%) —
in sab ka `lib/*.ts` pehle likho, `npx tsx` se test karo, phir UI.
Preset me `module:emiCalculator` / `module:stampDuty` / `module:rentVsBuy` **already** hain,
widgets nahi hain — abhi dev me placeholder dikhate hain, prod me null.

**Chunk 3:** `useShortlist` (localStorage) + `ShortlistBar` (R9) · `useCompare` + `CompareTray`
(R8, max 3) · `SiteVisitScheduler` (R13) · `BrochureGate` (R15) · `PropertyDetailDrawer` (R12)
· `LocalityChips` (R11) · `PriceTrend` (R14) · `PossessionTimeline` (R16) · `NriCorner` (R17)
· `lib/stamp-duty.ts` state rules · `data/localities.ts`.

## 10. Handoff (actual — chunk 2 done)

Commit: `fdce4f5` · chaar calculators live, `npm run verify` green.

Chunk 2 = the four calculators (R4–R7). Math pehle, UI baad me — har `lib/*.ts` pure hai
aur `npm run test` me covered hai.

### Built in chunk 2

```
src/config/roles/real-estate.preset.ts    sections[] me `module:loanEligibility` ADD kiya
                                          (R7 preset me tha hi nahi — sirf modules[] me tha)

src/modules/real-estate/
├─ index.ts            widgets ab 5: propertyFilter · emiCalculator · stampDuty
│                     · rentVsBuy · loanEligibility
├─ lib/
│  ├─ stamp-duty.ts    calculateStampDuty · effectiveDutyPct · registrationFee · gstPctFor
│  │                  · isAffordable · REGISTRATION_CAP (30k) · GST_PCT · AFFORDABLE_LIMITS
│  │                  StampDutyBreakdown: stampDuty/registration/gst/charges/totalCost
│  │                  /chargesPct/rebateSaved/registrationCapped
│  ├─ eligibility.ts   calculateEligibility · loanForEmi (EMI ka inverse — annuity PV)
│  │                  · maxTenureFor · RETIREMENT_AGE(60) · MAX_TENURE_YEARS(30)
│  │                  · DEFAULT_FOIR_PCT(50)
│  ├─ rent-vs-buy.ts   projectRentVsBuy · outstandingAfter (closed form, simulation nahi)
│  │                  · DEFAULT_HORIZON_YEARS(10) · ProjectionYear rows
│  ├─ wa-templates.ts  + `quote_request` -> "Home Loan Assistance" 🏦 (PART-05 §6 emi_help)
│  └─ calculators.test.ts   9 tests: duty/rebate/GST slabs, FOIR + EMI round-trip,
│                     age cap, outstanding balance, 10-row monotonicity, breakeven verdict
├─ hooks/
│  ├─ useCalculatorProperty.ts   sale + available listings, selected/select (rent listings
│  │                             pe EMI/duty ka koi matlab nahi)
│  └─ useToolUse.ts              EVENTS.TOOL_USE sirf PEHLI interaction pe (slider drag
│                                warna 50 events bhej deta)
└─ components/
   ├─ CalcControls.tsx      CalcSlider · CalcNumber · ResultStat · ResultRow
   │                       (SLIDER_CLASS me wahi track-fix jo BudgetSlider me hai)
   ├─ PropertyPicker.tsx    native <select>, teeno property-based calculators isi se
   ├─ EmiCalculator.tsx     R4 — down%/rate/tenure sliders, NumberTicker EMI, donut,
   │                       amortization, quote_request CTA, DisclaimerNote
   ├─ EmiDonut.tsx          recharts PieChart, fill = var(--brand)/var(--accent)
   ├─ AmortizationTable.tsx collapsed by default, ui/table, max-h-80 scroll
   ├─ StampDutyEstimator.tsx R5 — female buyer + under-construction checkboxes,
   │                       ResultRow breakdown, "Total cost of ownership"
   ├─ RentVsBuy.tsx         R6 — 5 sliders, breakeven verdict line, 3 stat tiles
   ├─ RentVsBuyChart.tsx    recharts LineChart + ReferenceLine (breakeven), CSS var colors
   └─ LoanEligibility.tsx   R7 — income/EMIs/age/tenure -> eligible loan + property budget
                           + "X of Y listings fall inside that budget"
```

### Math decisions (badalna ho to yahin dekho)

1. **Stamp duty** — registration 1% **but capped at ₹30,000** (`REGISTRATION_CAP`);
   GST sirf under-construction pe (affordable 1% / standard 5%, affordable =
   carpet ≤ 645 sq.ft. **aur** price ≤ ₹45 L); female rebate = `dutyPct − femaleRebatePct`.
   `rules` prop se aate hain (`module.stampDuty`) — doosra state = data change, code nahi.
2. **Eligibility** — `affordableEmi = income × FOIR(50%) − existingEmis`,
   tenure `min(asked, 60 − age, 30)`, `maxLoan = loanForEmi(...)` jo `calculateEmi` ka
   exact inverse hai (test me round-trip check hai), `maxPropertyValue = maxLoan / (1 − minDownPct/100)`.
3. **Rent vs buy** — dono side **net cost** = jo paisa gaya − jo asset bacha.
   Buy: down + charges + EMI + upkeep − (market value − outstanding).
   Rent: cumulative rent − investment gains, jahan renter down payment + charges
   **aur** har saal ka (EMI+upkeep − rent) surplus invest karta hai. Ye assumption na ho
   to comparison buying ke favour me jhooth bolta hai.
   Default assumptions UI me: 3% rental yield se suggested rent, 0.75% upkeep,
   7% rent hike, 6% appreciation, 9% investment return — sab slider se badalte hain.
4. **`quote_request`** ab real-estate me override hai ("Home Loan Assistance" 🏦) —
   chaaron calculators ka CTA isi intent pe jaata hai, values me on-screen numbers.

### Verified

- `npm run verify` **green** — tsc · eslint · validate:config (6 roles) · contrast 108/108
  · lint:tokens · **15 tests pass** (6 purane + 9 naye)
- `npm run build` clean `real-estate` aur `doctor` dono pe; role wapas **doctor** pe set hai
- Lazy module chunk me chaaron calculators maujood hain (built chunk me
  "Monthly EMI" / "Total cost of ownership" / "Eligible loan amount" / "Does buying beat renting")
- **SSR smoke render**: chaaron components `renderToStaticMarkup` se bina throw kiye render
  hue aur apne markers print kiye (scratch file chala kar delete kar diya).
  Isse Base UI Slider/Checkbox + recharts ka mount-time error pakda jaata hai.
- ⚠️ **Live browser verification is session me NAHI ho paayi** — `list_connected_browsers`
  ne `[]` diya (Chrome extension connect nahi tha). Agle session me sabse pehle
  `npm run role real-estate && npm run build && npm run start` karke browser me
  calculators dekh lena: khaas taur pe **recharts donut/line chart React 19 pe
  render ho rahe hain ya nahi**, aur console clean hai ya nahi.

### ⚠️ Gotchas agle chunk ke liye

- **`src/components/ui/switch.tsx` exist nahi karta** — registry se aaya hi nahi tha.
  Toggle chahiye to `Checkbox` use karo (StampDutyEstimator me pattern hai) ya
  `fetch-registry.mjs` se switch le aao.
- `@/components/sections` barrel **Gallery → react-photo-album ka CSS** import karta hai,
  isliye `npx tsx` se koi bhi calculator seedha import nahi hota. Scratch smoke test me
  `-r <stub.cjs>` (jo `require.extensions['.css'] = () => {}` set karta hai) aur ek
  `tsconfig` jisme `"jsx": "react-jsx"` ho — dono chahiye, warna "React is not defined".
- **recharts me colors CSS variables se do** (`var(--brand)`, `var(--accent)`, `var(--border)`) —
  Tailwind class chart ke andar kaam nahi karti aur raw hex `lint:tokens` ki wajah se banned hai.
  `isAnimationActive={false}` rakha hai taaki har slider move pe chart dobara na naache.
- `NumberTicker` `en-US` grouping karta hai (12,500,000), Indian nahi. EMI/loan ke liye
  theek hai; crore-level number dikhana ho to `formatINRShort` use karo.
- PART-11 ne data badal diya hai: ab **24 properties, sab `apartment`, sab `possession: ready`,
  localities me Balewadi/Aundh bhi hain jo `filters.localities` (4) me nahi hain**, aur kuch
  `listingFor: 'rent'` listings ke price crore me hain. Calculators ne sale+available filter
  kar liya hai, lekin **chunk 3 se pehle ye data mismatch theek karna chahiye**.
- Calculator sections ab 4 hain — page lamba ho gaya hai. Chunk 3 me ShortlistBar/CompareTray
  add karte waqt mobile pe StickyBottomBar ke saath overlap dobara check kar lena.

## 11. Handoff (actual — chunk 3 done)

Commit: `9cfbf75` · shortlist, compare, site visit, detail drawer, brochure gate, locality chips — sab live.

### Built in chunk 3

```
src/data/roles/real-estate.json   DATA FIX: 24 listings with real variety:
                                  types: apartment/villa/plot/commercial (was sab apartment)
                                  possession: ready + 2026-12/2027-03/2027-06/2027-12 (was sab ready)
                                  rent listings: monthly price ₹16K–₹85K (was crore-level — bug)
                                  localities: Baner/Kharadi/Wakad/Hinjewadi only (was Balewadi/Aundh bhi)
                                  validate:config 6/6 OK

src/modules/real-estate/
├─ hooks/
│  ├─ useShortlist.ts   R9 — localStorage (usehooks-ts), ids[] + items[], toggle/clear,
│  │                    sendOnWhatsApp: multi-property message <1800 chars,
│  │                    trimmed from end if over budget
│  └─ useCompare.ts     R8 — in-memory max-3 tray, toggle/remove/clear, canAdd flag
└─ components/
   ├─ ShortlistBar.tsx          shows when count>0: count + "Send on WhatsApp" + clear
   ├─ CompareTray.tsx           shows when count>0: sticky bar + Drawer with side-by-side table
   │                            11 comparison rows (price/sqft/BHK/floor/furnishing/RERA/etc)
   ├─ LocalityChips.tsx         R11 — nearby[] chips: getIcon(place.type) + name + km
   ├─ PropertyDetailPanel.tsx   R12 inner content: image carousel + price + specs + RERA
   │                            + details grid + possession badge + amenities + nearby +
   │                            floor plan image + virtual tour link
   ├─ PropertyDetailDrawer.tsx  R12 shell: right-swipe Drawer wrapper + PropertyDetailPanel
   │                            + SiteVisitScheduler + BrochureGate (scrollable body)
   │                            + sticky CTA footer (3 IntentButtons)
   ├─ SiteVisitScheduler.tsx    R13 — next 7 days chips + 4 time slot chips
   │                            → site_visit_book intent on WhatsApp
   └─ BrochureGate.tsx          R15 — name+phone form → brochure_request intent
                                submitted state shows success msg
```

### Wired up

- `PropertyBrowser.tsx`: `useShortlist()` + `useCompare()` called here; `ShortlistBar` and `CompareTray` rendered above the results grid; callbacks passed to `PropertyGrid`
- `PropertyGrid.tsx`: each `PropertyCard` wrapped in `PropertyDetailDrawer` — clicking anywhere on a card opens the detail drawer

### Verify result

- `npm run verify` **green** — tsc · eslint · validate:config 6/6 · contrast 108/108 · lint:tokens · 15 tests pass
- `npm run build` clean on real-estate role (134 kB page, no errors)
- validate:config confirms data JSON has correct schema (no raw booleans, totalFloors ≥ 1)

### ⚠️ Gotchas next session

- **Live browser verification nahi ho paayi** — server start permission blocked at wrap-up time. Next session me sabse pehle `npm run role real-estate && npm run build && npm run start` karke browser me verify karo:
  - Shortlist ♡ click → ShortlistBar appear hota hai?
  - PropertyCard click → PropertyDetailDrawer khulta hai?
  - Compare button → max 3 enforce hota hai? Drawer me table dikh rahi hai?
  - SiteVisitScheduler: date+slot select → WhatsApp khulta hai?
  - BrochureGate: name+phone submit → success state + WhatsApp?
- **PriceTrend (R14) · PossessionTimeline (R16) · NriCorner (R17)** — time nahi mila, optional features hain. PART-07 (Doctor) ke baad aayenge.
- **PART-07 Doctor** — M2 milestone yahan atka hai. Agle session me seedha PART-07 shuru karo.

### Next steps

1. PART-07 — Doctor role module (M2 milestone)
2. Wahi khatam hote hi browser verification dono roles pe kar lena
3. Phir PART-06 (Insurance) ya PART-08 (CA-Tax)

