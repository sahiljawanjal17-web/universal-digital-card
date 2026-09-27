# Next chat prompt - direct copy-paste karo

Project: `C:\Users\Admin\ALL_IN_ONE` - role-driven Universal Digital Business Card
(Next.js 15 + Tailwind v4 + shadcn/ui). Ek JSON ka `role` field badalne se poori UI badalti hai.
6 roles: real-estate, insurance, doctor, ca-tax, photographer, fitness-tutor.

---

## 🛑 SABSE PEHLE - SESSION RULE (ye sab se upar hai)

- **Under 60K token pe rukna hai.** Zaroorat ho to max 70K, usse aage bilkul nahi.
- Ek session me **~30% kaam** karo - ya jo bhi sabse achha natural stopping point ho.
- Token khatam hone ka **intezaar mat karo**. ~45-50K pe hi wrap-up shuru kar do taaki limit cross na ho.
- **RUKNE KA RULE**: Limit par touch hone se pehle khud ruk jao, agle assistant ko batana hai ki kahan rukna hai. Time aur limit ko strictly follow karo taaki bich me kaam na ruke!
- Rukne se pehle **ye 4 cheezein zaroor** karo:
  1. **`npm run verify` green karo** (tsc + eslint + validate:config + contrast + lint:tokens + test - sab ek command me)
  2. Jis PART pe kaam kiya uska `docs/parts/PART-XX-*.md` me **Handoff section** asli file paths se update karo
  3. `STATUS.md` me status mark karo (🟡 / ✅ + commit hash)
  4. Alag commit karo: `feat(part-0X): ...`
- **Phir `docs/assets/NEXT-CHAT-PROMPT.md` ko poora dobara likho** (ye file) - agle session ke liye, isi format me.
- End me user ko chat me bata do: kya bana, kahan ruke, aur agli chat me kya likhna hai. (3-4 line ka prompt bhi dena).

---

## Progress abhi tak

- PART-00 to PART-05 (Real Estate) ✅, **PART-07 (Doctor) ✅ — M2 ✅.**
- **PART-06 (Insurance) 🟡 — Chunk 1 ✅ (`02ff38b`).** Bana: `lib/premium.ts` (`estimatePremium`, GST line-item,
  smoker/female loadings) + `lib/hlv.ts` (`calculateHlv`) + 10 tests, **I1/I2 `PremiumEstimator`** (widget
  `premiumEstimator`), **I3 `HlvCalculator`** (widget `humanLifeValue`), intents `premium_quote` + `hlv_gap`.
  Schema me `estimator.gstRate` + `hlv {...}` defaults ke saath. `CalcControls` (`CalcSlider`, `CalcNumber`,
  `ResultStat`, `ResultRow`) ab `@/components/shared` me hai. `npm run verify` GREEN (49 tests), build GREEN (insurance role).
- Poora detail: `docs/parts/PART-06-ROLE-INSURANCE.md` → §9 Handoff → "Chunk 1".

---

## 🛠 KAAM (PART-06: Insurance Role - Chunk 2)

1. Pehle `npm run verify` chala kar confirm karo sab green hai.
2. `docs/parts/PART-06-ROLE-INSURANCE.md` §5 (steps 4–11), §6 (`renewal_reminder`, `tax_saving` templates), §8 DoD
   aur §9 Handoff padho. Pattern: `src/modules/insurance/` (chunk 1) — hook `useInsuranceModule`, pure `lib/*` + `insurance.test.ts`.
3. Chunk 2 scope (priority order):
   - **I4 `TaxSavingCalculator`** (widget key `taxSaving`) + `lib/tax-saving.ts` (80C `module.taxSaving.s80c`, 80D / senior
     parents `s80dSenior`, capped) + tests. Jan–Mar seasonal banner IST se (`istDate` from `@/lib/utils`).
     Intent `tax_saving` naya hai → `INTENT_KEYS` + `INTENT_TITLES` + `lib/wa-templates.ts` me register.
   - **I5 `ClaimRatioTable`** (`claimRatio`) — sortable, top-3 highlight, mobile pe horizontal scroll, source-year footnote.
   - **I6 `PlanComparison`** (`planCompare`) — `module.plans` se, ✓/✗ matrix, per-plan WhatsApp CTA.
   - I5/I6 ke liye `src/data/roles/insurance.json` me `plans` abhi sirf 1 placeholder hai → 3–6 dummy plans add karo
     (zaroorat ho to schema me `popular` / `features` fields defaults ke saath).
   - Time bache to **I7 `RenewalReminder`** (`renewalReminder`, `lib/ics.ts` — doctor ka `src/modules/doctor/lib/ics.ts` pattern,
     30-day + 7-day alarm; intent `renewal_reminder`).
4. Local check: `src/config/site.config.json` me `"role"` ko `insurance` karo, kaam khatam hone pe wapas **`doctor`** karo.

### Reuse karo (dobara mat likhna)
- `@/components/shared`: `CalcSlider`, `CalcNumber`, `ResultStat`, `ResultRow`, `IntentButton`, `DisclaimerNote`, `PriceTag`;
  `SectionShell` from `@/components/sections`; `NumberTicker` from `@/components/motion`.
- Insurance ka `Segmented` pill control abhi `PremiumEstimator.tsx` ke andar local hai — dobara chahiye to
  `src/modules/insurance/components/Segmented.tsx` me nikaal lo.
- `@/components/ui/table` (sticky header) claim ratio / plan compare ke liye.
- Links ko button jaisa: `buttonVariants` + `cn()` (dekho `src/modules/doctor/components/ReviewCta.tsx`).

---

## HARD RULES
- No hardcoded data - sab JSON data se. (Scarcity/counts bhi data se — random number mat banana,
  SSR aur client pe alag aayega.)
- Color tokens semantic rakho (`bg-brand`, `text-success`, `text-danger` etc), raw tailwind colors mat use karna.
  `npm run lint:tokens` isko pakad leta hai.
- WhatsApp intents ke liye `@/core/whatsapp` ke module functions/components hi use karna.
  Koi bhi component khud `wa.me` link mat banaye.
- `if (role === 'doctor')` jaise checks allowed nahi hain. Module injection mechanism ka use karo.
- `src/components/ui/button.tsx` me `asChild` **nahi** hai — link ko button jaisa dikhana ho to
  `buttonVariants({ ... })` + `cn()` use karo.
- Time/date ka kaam ho to hamesha IST (`Asia/Kolkata`), device timezone kabhi nahi.
