# PART-08 — ROLE MODULE: CA / TAX CONSULTANT

**Status:** ⬜ Not started
**Est:** 1.5 days · **Blocked by:** PART-04 · **Parallel with:** PART-05–07, 09, 10

---

## 1. Goal
`ca-tax` role ka module — Interactive Tax Document Checklist (minimum) +
old-vs-new regime calculator, GST tools, compliance calendar, service packages (premium).

## 2. Read First
- `docs/09-FEATURE-MATRIX.md` **Section E** (T1–T14)
- `docs/03-CONFIG-SCHEMA.md` → `ca-tax` module block

> ⚠️ **Compliance guardrail:** saare tax numbers **indicative dummy** hain.
> Har calculator pe visible disclaimer: *"Indicative only, based on FY 2025-26 assumptions.
> Please confirm with your CA before filing."* Koi bhi "guaranteed refund" type claim nahi.

## 3. Files To Create

```
src/modules/ca-tax/
├─ index.ts
├─ types.ts
├─ components/
│  ├─ DocumentChecklist.tsx       # T1, T2, T3 — hero widget
│  ├─ ChecklistTypeSelector.tsx
│  ├─ RegimeComparator.tsx        # T4
│  ├─ GstCalculator.tsx           # T5
│  ├─ GstinValidator.tsx          # T5
│  ├─ HraCalculator.tsx           # T6
│  ├─ AdvanceTaxEstimator.tsx     # T7
│  ├─ ComplianceCalendar.tsx      # T8
│  ├─ ServicePackages.tsx         # T9
│  ├─ EntityWizard.tsx            # T10
│  ├─ SecureUploadCta.tsx         # T11
│  ├─ FilingStatusTeaser.tsx      # T12
│  ├─ FirmCredentials.tsx         # T13
│  └─ GuideDownloadGate.tsx       # T14
├─ lib/
│  ├─ checklist.ts                # progress, grouping, completion
│  ├─ tax-regime.ts               # slab math, both regimes
│  ├─ gst.ts                      # inclusive/exclusive + GSTIN checksum
│  ├─ hra.ts
│  ├─ advance-tax.ts              # 234B/234C style interest (indicative)
│  ├─ due-dates.ts                # + .ics
│  └─ wa-templates.ts
└─ data/
   ├─ slabs.ts                    # FY 2025-26 dummy slabs
   └─ entity-types.ts             # Pvt Ltd / LLP / OPC / Proprietorship
```

## 4. Open-Source Sources
| Need | From |
|------|------|
| Checkbox + progress | shadcn `checkbox`, `progress` |
| Comparison result cards | Tremor KPI card pattern |
| Calendar view | shadcn `calendar` + custom month grid |
| Pricing tiers | Cult UI / Kokonut pricing cards |
| Stepper (entity wizard) | Origin UI stepper |
| Charts | `recharts` bar (regime comparison) |

## 5. Implementation Steps

1. **`lib/checklist.ts`** — pure:
   ```ts
   getChecklist(type: 'salaried'|'business'|'nri'|'capitalGains'): ChecklistGroup[]
   computeProgress(items, checkedIds): { done, total, pct, missingRequired }
   ```
2. **`DocumentChecklist`** (T1–T3) — hero widget
   - Type selector: 4 big cards (Salaried / Business / NRI / Capital Gains)
   - Grouped checklist (Identity · Income · Investments · Others)
   - Each item: checkbox + label + `?` tooltip hint + "Required" badge
   - **Progress ring** at top — "8 of 14 ready (57%)"
   - Persist in `localStorage` (type-scoped)
   - "Reset" + "Print checklist" + **"Send my checklist on WhatsApp"** (T2)
   - Missing-required warning banner
3. **`RegimeComparator`** (T4) — sabse high-traffic tool
   - Inputs: gross salary, 80C, 80D, HRA exemption, home loan interest, NPS, other deductions
   - Output: two cards side-by-side (Old vs New) with tax payable
   - Winner card highlighted + **"You save ₹X with the New Regime"**
   - Bar chart breakdown: slab-wise tax
   - Effective tax rate line
   - CTA: "File with us" → `tax_consult` WhatsApp
   - Slab data `data/slabs.ts` se, **FY label visible**
4. **`GstCalculator`** (T5) — amount + rate (0/5/12/18/28) + inclusive/exclusive toggle
   → base, CGST, SGST, IGST split, total. Copy-result button.
5. **`GstinValidator`** (T5) — 15-char format + state code + PAN embed + checksum
   (Mod-36). Result: valid/invalid + parsed state, entity type.
6. **`HraCalculator`** (T6) — basic, DA, HRA received, rent paid, metro toggle.
   Least-of-three rule, show all three legs.
7. **`AdvanceTaxEstimator`** (T7) — quarterly installments (15%/45%/75%/100%),
   shortfall interest estimate. Urgency banner if a due date is near.
8. **`ComplianceCalendar`** (T8)
   - Month grid with due-date markers, colored by category (ITR / GST / TDS / ROC)
   - Filter by client type (salaried / business / company)
   - Each date → detail popover + **"Add to Calendar (.ics)"** + WhatsApp reminder
   - "Next 3 due dates" summary card at top (most-used view)
9. **`ServicePackages`** (T9) — 3–4 tiers: ITR Salaried ₹1,499 / ITR Business ₹4,999 /
   GST Monthly ₹2,499 / Company Registration ₹12,999.
   Each: turnaround, includes list, "Popular" badge, WhatsApp CTA per package.
10. **`EntityWizard`** (T10) — 4 questions (owners, funding plan, liability, compliance
    appetite) → recommended entity + comparison table (cost, compliance, tax).
11. **`GuideDownloadGate`** (T14) — name+phone → "Tax Saving Guide FY 2025-26" PDF
    + WhatsApp lead.
12. **`FirmCredentials`** (T13) — ICAI membership, firm reg no, years, clients served,
    team photos.

## 6. WhatsApp Templates

### `doc_checklist`
```
*My Document Checklist* 📄

Type: Salaried Individual
Ready: 8 of 14 documents (57%)

✅ Ready:
• Form 16 (Part A & B)
• PAN Card
• Aadhaar Card
• Bank Statements
• 80C Investment Proofs

⏳ Pending:
• Form 26AS
• AIS / TIS
• Home Loan Interest Certificate
• Rent Receipts

Please guide me on the pending ones.

— via Agarwal & Associates website
```

### `tax_consult`
```
*Tax Regime Consultation* 📊

FY: 2025-26
Gross Income: ₹18,00,000
Deductions Claimed: ₹2,75,000

Old Regime Tax: ₹2,96,400
New Regime Tax: ₹2,49,600
Recommended: *New Regime* (saves ₹46,800)

Please help me file my ITR.

— via Agarwal & Associates website
```

### `package_enquiry`
```
*Service Package Enquiry* 💼

Package: ITR Filing — Business/Professional
Price: ₹4,999
Turnaround: 48 hours

Name: Rohit Deshmukh
Phone: +91 98765 43210

Please share the next steps.

— via Agarwal & Associates website
```

### `due_date_reminder`
```
*Compliance Reminder Request* 🔔

Due Date: 31 Jul 2026
Compliance: ITR Filing (Non-Audit Cases)
Client Type: Salaried

Please remind me 7 days before.

— via Agarwal & Associates website
```

## 7. Data Requirement (PART-11)
- 4 checklists × 12–16 items each, with hints
- FY 2025-26 slabs (old + new), std deduction, cess — clearly marked dummy
- 20+ compliance due dates across the year, categorized
- 4–6 service packages with realistic Indian pricing
- 4 entity types with cost/compliance comparison
- 8 testimonials (business owners, salaried professionals)
- 12 FAQs (regime choice, ITR-1 vs ITR-2, GST registration threshold, late fee)
- 1 tax-saving guide PDF dummy

## 8. Definition of Done
- [ ] 4 checklist types, progress ring accurate
- [ ] Checklist localStorage me persist (type-scoped), reload pe survive
- [ ] "Send checklist" WhatsApp message ready/pending split ke saath
- [ ] Message 1800 chars cap (16 items pe bhi)
- [ ] Regime comparator math verified against Income Tax dept calculator (indicative)
- [ ] Winner + savings clearly highlighted
- [ ] GST calculator inclusive + exclusive dono correct
- [ ] GSTIN validator checksum sahi (5 valid + 5 invalid samples test)
- [ ] HRA least-of-three correct, metro/non-metro toggle kaam karta hai
- [ ] Compliance calendar mobile pe usable
- [ ] `.ics` Google Calendar + Outlook me import hoti hai
- [ ] Entity wizard 4 questions → sensible recommendation
- [ ] **Har calculator pe FY label + disclaimer visible**
- [ ] Saare 4 WhatsApp templates test kiye
- [ ] Commit: `feat(part-08): ca-tax module`

## 9. Handoff
`lib/due-dates.ts` ka `.ics` builder — PART-06/07 ke saath coordinate karke
`src/lib/utils/ics.ts` me single implementation rakho.
`DocumentChecklist` ka pattern PART-06 ke `ClaimChecklist` jaisa hai —
agar duplicate lage to `src/components/shared/InteractiveChecklist.tsx` me promote karo.
