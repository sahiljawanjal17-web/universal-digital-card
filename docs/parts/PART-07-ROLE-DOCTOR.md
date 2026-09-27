# PART-07 — ROLE MODULE: DOCTOR / DENTIST

**Status:** ✅ Done — chunk 1 (a1256c6), 2a (4d8b99e), 2b (8989d2b)
**Est:** 1.5 days · **Blocked by:** PART-04 · **Parallel with:** PART-05, 06, 08–10

> 💡 **Recommended as the FIRST role to complete** — sabse simple module,
> fastest path to a full demo-able site (Milestone M2).

---

## 1. Goal
`doctor` role ka module — Smart Slot Booking (minimum) + symptom router,
cost estimator, before/after slider, live clinic status, teleconsult (premium).

## 2. Read First
- `docs/09-FEATURE-MATRIX.md` **Section D** (D1–D15)
- `docs/03-CONFIG-SCHEMA.md` → `doctor` module block

## 3. Files To Create

```
src/modules/doctor/
├─ index.ts
├─ types.ts
├─ components/
│  ├─ SlotBooking.tsx             # D1 — hero widget
│  ├─ ClinicStatusBadge.tsx       # D2
│  ├─ SymptomRouter.tsx           # D3
│  ├─ CostEstimator.tsx           # D4
│  ├─ BeforeAfterGallery.tsx      # D5
│  ├─ PreAppointmentForm.tsx      # D6
│  ├─ TeleconsultCard.tsx         # D7
│  ├─ InsurancePanels.tsx         # D8
│  ├─ ReportUploadCta.tsx         # D10
│  ├─ ClinicSwitcher.tsx          # D11
│  ├─ HealthTipsGrid.tsx          # D12
│  ├─ CredentialsTimeline.tsx     # D13
│  └─ ReviewCta.tsx               # D15
├─ lib/
│  ├─ slots.ts                    # availability computation (IST)
│  ├─ clinic-hours.ts             # open/closed/closing-soon
│  ├─ ics.ts                      # appointment .ics
│  └─ wa-templates.ts
└─ data/
   └─ departments.ts
```

## 4. Open-Source Sources
| Need | From |
|------|------|
| Before/After slider | Aceternity `Compare` |
| Toggle group (day/period) | shadcn `toggle-group` |
| Calendar (extended booking) | shadcn `calendar` (react-day-picker) |
| Reels/tips grid | Aceternity `Bento Grid` |
| Timeline | custom + Magic UI `Reveal` |

## 5. Implementation Steps

1. **`lib/slots.ts`** (pure, IST-aware):
   ```ts
   getAvailableSlots(config: SlotConfig, now: Date): Array<{
     day: 'today'|'tomorrow'; date: Date; label: string;   // "Today, 20 Sep"
     period: 'morning'|'evening'; range: string;
     available: boolean; reason?: 'past'|'booked'|'closed';
   }>
   ```
   - **IST fixed** (`Asia/Kolkata`) — user ka device timezone ignore karo
   - Aaj ka morning slot agar already nikal chuka → `past`, disabled
   - `module.slots.unavailable` array se `booked`
   - Sunday/holiday closed → `closed`
2. **`SlotBooking`** (D1) — the money widget
   - Step 1: Day — 2 big cards `Today, 20 Sep` / `Tomorrow, 21 Sep`
     (disabled state clearly grey + "Fully booked" label)
   - Step 2: Period — `Morning 10AM–1PM` / `Evening 4PM–8PM` chips with
     slots-left indicator ("3 slots left" — scarcity, from dummy data)
   - Step 3: Details — Name, Phone, Reason (select from services), New/Existing patient
   - Confirm card: summary + **"Confirm on WhatsApp"**
   - Success state: green check + **"Add to Calendar (.ics)"** + "Save doctor's contact"
   - Progress indicator 1-2-3, back navigation
3. **`ClinicStatusBadge`** (D2) — live dot:
   - 🟢 `Open now · Closes at 8:00 PM`
   - 🟡 `Closing in 25 min`
   - 🔴 `Closed · Opens tomorrow 10:00 AM`
   - Break time handle karo (2–4 PM lunch)
   - Updates every 60s (`setInterval` + cleanup)
   - Navbar + ContactInfo dono me dikhao
4. **`SymptomRouter`** (D3) — chips of common symptoms → matched department card
   + urgency badge + suggested action. High urgency → emergency call CTA prominent.
5. **`CostEstimator`** (D4) — treatment select → price range bar (`₹4,500 – ₹9,000`),
   sessions, duration, "EMI from ₹750/mo" (3/6/9 month no-cost EMI).
   CTA: "Get exact quote after consultation" → WhatsApp.
6. **`BeforeAfterGallery`** (D5) — Aceternity `Compare` slider, multiple cases,
   case label + treatment + duration. **Consent disclaimer**: "Shared with patient consent.
   Results vary by individual."
7. **`PreAppointmentForm`** (D6) — age, gender, symptom, duration, existing conditions,
   current medication. Optional, collapsible. → WhatsApp structured summary.
8. **`TeleconsultCard`** (D7) — fee, how-it-works 3 steps, "Book Video Consult" → WhatsApp.
9. **`InsurancePanels`** (D8) — logo grid of cashless panels + "Check my insurance" CTA.
10. **`ReportUploadCta`** (D10) — "Send your X-ray/report on WhatsApp for a quick opinion".
11. **`ClinicSwitcher`** (D11) — multi-location: tabs, each with address/hours/map/FAB
    directions update. (Agar `data.contact.locations` array ho.)
12. **`CredentialsTimeline`** (D13) — BDS → MDS → Fellowship → Papers, vertical timeline.
13. **`HealthTipsGrid`** (D12) — bento grid of tips/reels with thumbnails.
14. **Emergency FAB slot** (D9) — `preset.fab.emergency = true` → red FAB action.

## 6. WhatsApp Templates

### `appointment_book`
```
*Appointment Request* 🦷

Date: Today, 20 Sep 2026
Time: Evening (4:00 PM – 8:00 PM)
Name: Rohit Deshmukh
Phone: +91 98765 43210
Patient Type: New
Reason: Tooth pain / Root canal

Please confirm my slot.

— via Smile Studio Dental Care website
```

### `pre_appointment_details`
```
*Patient Details* 📋

Name: Rohit Deshmukh
Age: 34 · Male
Symptom: Sensitivity in lower left molar
Duration: 2 weeks
Existing Conditions: None
Current Medication: None

Appointment: Tomorrow, Morning

— via Smile Studio Dental Care website
```

### `teleconsult`
```
*Video Consultation Request* 💻

Name: Rohit Deshmukh
Preferred Time: Tomorrow, Evening
Concern: Second opinion on root canal
Consultation Fee: ₹300

Please share the meeting link.

— via Smile Studio Dental Care website
```

### `cost_enquiry`
```
*Treatment Cost Enquiry* 💰

Treatment: Dental Implant
Estimated Range: ₹18,000 – ₹35,000 per tooth
Teeth Count: 2

Please share exact cost & EMI options.

— via Smile Studio Dental Care website
```

## 7. Data Requirement (PART-11)
- 10–12 treatments with price ranges, durations, session counts
- 6 before/after image pairs (Unsplash: `dental smile`, `teeth whitening`)
- 12 symptoms → department mapping
- Clinic hours incl. lunch break + Sunday closed
- 8 cashless insurance panel logos
- 10 testimonials (patient names, localities)
- 12 FAQs (pain, cost, EMI, insurance, timing, emergency)
- Clinic interior photos + 1 short clinic tour video

## 8. Definition of Done
- [x] Slot booking 3-step flow smooth, back navigation kaam karti hai
- [x] Past slots automatically disabled (test: 6 PM pe morning slot disabled ho) — `slots.test.ts`
- [x] `unavailable` slots grey + "Fully booked"
- [x] IST hardcoded — `business-hours.ts` sirf `Asia/Kolkata` padhta hai, device TZ kabhi nahi
- [x] Live clinic status 3 states correct (open / closing-soon / closed)
- [x] Break time (1–4 PM) pe "On break · Resumes 4:00 PM"
- [x] Sunday pe "Closed · Opens Mon 10:00 AM"
- [x] `.ics` download — UTC `DTSTART`, RFC 5545 escaping, 2h reminder
- [x] Symptom router 12 symptoms map karta hai
- [x] High-urgency symptom pe emergency CTA prominent (`tel:` + destructive variant)
- [x] Before/After slider touch pe smooth, consent disclaimer visible — `BeforeAfterGallery.tsx` (chunk 2)
- [x] Cost estimator EMI math correct (no-cost EMI = principal / longest tenure)
- [x] Emergency FAB action red + `tel:` open karta hai (PART-03 ka `preset.fab.emergency`)
- [x] `appointment_book`, `teleconsult`* aur `cost_enquiry` templates registered
      (*teleconsult card chunk 2 me ban gaya — `TeleconsultCard.tsx`)
- [x] Commit: `feat(part-07): doctor module chunk 1`

## 9. Handoff

### Chunk 1 — DONE · commit `a1256c6` (npm run verify GREEN, npm run build GREEN)

`lib/clinic-hours.ts` alag file nahi bani: uska open/closed logic **universal** tha, isliye
seedha `src/lib/utils/business-hours.ts` me promote kiya gaya (brief ne yahi maanga tha).
PART-09 (studio) aur PART-10 (gym timings) isi ko reuse karenge — role ka koi naam nahi hai usme.

| File | Kya hai |
|------|---------|
| `src/lib/utils/business-hours.ts` | **Universal.** IST clock (`istClock`/`istDate`/`istInstant`), `parseTime`, `formatTime`, `formatDayLabel`, `getDayWindow`, `getHoursStatus` (open / closing-soon / break / closed). Pure — `now` caller deta hai. |
| `src/lib/utils/index.ts` | Upar wale saare exports barrel me add kiye. |
| `src/config/schema/modules/doctor.schema.ts` | Extended: `slots.periods[].capacity`, `slots.booked[]` (scarcity data se, random se nahi), `symptomRouter[].advice`, `treatments[].duration/unit`, `emiTenures[]`. Sab defaults ke saath — baaki 5 roles pe koi asar nahi. |
| `src/modules/doctor/types.ts` | Zod se inferred types (`DoctorModule`, `SlotConfig`, `Symptom`, `Treatment`, ...). |
| `src/modules/doctor/lib/slots.ts` | `getAvailableSlots(config, hours, now)` → `SlotDay[]`. Reason precedence: `closed` → `past` → `booked`. `parseRange`, `reasonLabel`, `slotStart`, `slotEnd`. |
| `src/modules/doctor/lib/cost.ts` | `estimateCost`, `noCostEmi` (no-cost EMI = principal / longest tenure). |
| `src/modules/doctor/lib/ics.ts` | `buildAppointmentIcs` (UTC `DTSTART`, escaping, `VALARM` -2h) + `downloadIcs`. |
| `src/modules/doctor/lib/wa-templates.ts` | `appointment_book`, `teleconsult_book`, `quote_request` register karta hai. `pre_appointment_details` alag intent nahi hai — uski lines `appointment_book` body me jaati hain (ek hi chat thread). |
| `src/modules/doctor/lib/slots.test.ts` | 21 tests — IST, break, Sunday, past slot, capacity, Saturday evening closed, ics stamps, EMI math. |
| `src/modules/doctor/hooks/useDoctorModule.ts` | Widget ka single config entry point (module + hours + services + address). |
| `src/modules/doctor/components/SlotBooking.tsx` | **D1** — 3-step (Day → Time → Details) + back + success state (.ics + vCard). |
| `src/modules/doctor/components/ClinicStatusBadge.tsx` | **D2** — mount ke baad resolve hota hai, har 60s refresh (SSR pe clock bake nahi hoti). |
| `src/modules/doctor/components/SymptomRouter.tsx` | **D3** — 12 chips → department + urgency + advice; high urgency pe `tel:` emergency CTA. |
| `src/modules/doctor/components/CostEstimator.tsx` | **D4** — treatment + quantity → range bar + no-cost EMI + `quote_request`. |
| `src/modules/doctor/index.ts` | `widgets = { slotBooking, symptomRouter, costEstimator }`. |
| `src/data/roles/doctor.json` | 12 symptoms, 12 treatments, 6 before/after pairs, 8 insurance panels, clinic hours with 1–4 PM break + Sunday closed, slot capacity/booked counts. |

### Chunk 2a — DONE · commit `4d8b99e` (npm run verify GREEN, 39 tests; npm run build GREEN)

| File | Kya hai |
|------|---------|
| `src/modules/doctor/components/TeleconsultCard.tsx` | **D7** — fee + platform `module.teleconsult` se, preferred time chips `module.slots.days × periods` se, `teleconsult_book` intent. `enabled: false` pe render nahi hota. |
| `src/modules/doctor/components/InsurancePanels.tsx` | **D8** — `module.insurancePanels` chips; select karne pe "Check my <insurer> cover" → `general_inquiry` (Enquiry + Insurer lines). |
| `src/modules/doctor/components/BeforeAfterGallery.tsx` | **D5** — `module.beforeAfter` ke 6 explicit pairs, universal `BeforeAfterSlider` reuse (drag + arrow keys), disclaimer "Shared with patient consent. Results vary by individual." **Decision:** universal `beforeAfter` section `data.gallery` ko position se pair karta hai (doctor pe clinic-interior vs dental-chair compare hota) — isliye doctor preset me `beforeAfter` → `module:beforeAfterGallery` replace kiya. |
| `src/modules/doctor/lib/pre-appointment.ts` (+ `.test.ts`, 3 tests) | `preAppointmentFields()` — PART-07 §6 `pre_appointment_details` lines (Age · Gender, Symptom, Duration, Conditions, Medication), khaali fields drop, 0–120 ke bahar age drop. |
| `src/modules/doctor/components/PreAppointmentForm.tsx` | **D6** — collapsible `<details>` form, controlled. `SlotBooking.tsx` step 3 me purani "Anything we should know?" line ki jagah; lines `appointment_book` message me hi jaati hain (naya intent nahi). |
| `src/modules/doctor/index.ts` | `widgets` me `beforeAfterGallery`, `insurancePanels`, `teleconsult` add. |
| `src/config/roles/doctor.preset.ts` | sections: `module:beforeAfterGallery`, `module:costEstimator`, `module:insurancePanels`, `module:teleconsult`. **D12 decision:** `healthTips` `modules` array se hata diya — schema me koi health-tips data hai hi nahi; `modules` array kahin read bhi nahi hota. |

### Chunk 2b — DONE · commit `8989d2b` (npm run verify GREEN, 39 tests; npm run build GREEN) — **PART-07 ✅**

| File | Kya hai |
|------|---------|
| `src/modules/doctor/components/ReportUploadCta.tsx` | **D10** — 3-step explainer + optional treatment chips (`data.services` se) → `general_inquiry` (Enquiry: "Report review", Treatment). File chat me hi jaati hai, site pe kuch store nahi. |
| `src/modules/doctor/components/CredentialsTimeline.tsx` | **D13** — `module.credentials` ka dated timeline (oldest-first), kind → icon + label. Khaali array pe render nahi hota. |
| `src/modules/doctor/components/ReviewCta.tsx` | **D15** — `contact.socials.googleBusiness` link (new tab, `trackCta`). Link khaali ho to section hi nahi dikhta. Rating number jaan-boojh kar nahi dikhaya — `trust` badge ("4.9 / 5 · 482") se contradict hota. |
| `src/config/schema/modules/doctor.schema.ts` | `credentials[]` add (`year`, `title`, `institution`, `kind` enum) — **doctor-only**, default `[]`. `trust` me sirf flat badges the, dates nahi, isliye universal schema nahi chheda. |
| `src/modules/doctor/types.ts` | `Credential`, `CredentialKind`. |
| `src/modules/doctor/hooks/useDoctorModule.ts` | `reviewUrl` field add. |
| `src/modules/doctor/index.ts` · `src/config/roles/doctor.preset.ts` | `reportUpload`, `credentials`, `reviewCta` register. Order: `about` → `module:credentials`; `module:teleconsult` → `module:reportUpload`; `testimonials` → `module:reviewCta`. |
| `src/data/roles/doctor.json` | **PART-11 data**: testimonials 6 → 10, FAQs 5 → 12 (pain, cost, EMI, insurance, timing, emergency, teleconsult, kids, hygiene, walk-in, whitening), 6 credentials, placeholder `googleBusiness` review URL. FAQ timings/fees data se match (Sat 10–5, break 1–4, teleconsult ₹300). |

**Final skips:** D11 `ClinicSwitcher` (schema me `locations` nahi — universal change chahiye), D12 `healthTips` (koi data nahi).
Module widgets client pe lazy-load hote hain, isliye static HTML me nahi dikhte (chunk 2a jaisa hi behaviour).
