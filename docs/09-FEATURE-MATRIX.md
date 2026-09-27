# 09 — FEATURE MATRIX (Minimum + AI-Added Premium)

Owner ne minimum diya tha. Yeh file batati hai ki **uske upar kya add ho raha hai**
aur kyun — Indian market context ke saath.

Legend: 🟢 = Core (all roles) · 🔵 = Minimum (owner-specified) · 🟣 = Premium upgrade (added)

---

## A. Universal Features (har role me)

| # | Feature | Type | Why (India context) |
|---|---------|------|--------------------|
| U1 | 1-Click vCard download | 🟢 | Phone me number save = repeat business ka #1 driver |
| U2 | Floating WhatsApp + Call + Directions | 🟢 | WhatsApp = India ka default business channel |
| U3 | Dynamic pre-filled WhatsApp routing | 🟢 | Pro dikhta hai, aur lead ka context turant milta hai |
| U4 | QR code share modal | 🟣 | Offline → online bridge. Shop counter / visiting card pe print |
| U5 | Web Share API ("Share my card") | 🟣 | Referral loop — client khud forward karta hai |
| U6 | PWA install ("Add to Home Screen") | 🟣 | App jaisa feel, ₹0 app-store cost |
| U7 | EN ⇄ हिं language toggle | 🟣 | Tier-2/3 conversion me bada difference |
| U8 | Dark / Light mode | 🟣 | Premium expectation in 2026 |
| U9 | Exit-intent / scroll lead capture | 🟣 | Bounce traffic recover karta hai |
| U10 | Animated trust stats + badges | 🟣 | Trust = Indian service buying ka #1 factor |
| U11 | Google Reviews CTA + rating display | 🟣 | Social proof + SEO |
| U12 | Dynamic OG image per role | 🟣 | WhatsApp pe link bhejne pe rich preview = 3x CTR |
| U13 | Missed-call / "Call me back" scheduler | 🟣 | Busy professionals ke liye |
| U14 | Offline fallback page | 🟣 | Patchy network reality |
| U15 | UTM + source tracking on every lead | 🟣 | Owner ko pata chale kaun sa channel chala |
| U16 | Save-to-calendar (.ics) | 🟣 | Appointments / due dates / shoot dates |
| U17 | Sticky bottom CTA bar (mobile) | 🟣 | Thumb-zone conversion |
| U18 | ⌘K command palette (desktop) | 🟣 | Premium "app-like" signal |

---

## B. Role: Real Estate Agent (`real-estate`)

| # | Feature | Type | Notes |
|---|---------|------|-------|
| R1 | Smart Property Filter (Budget / BHK) | 🔵 | Slider + chips, URL-synced |
| R2 | Pre-filled WhatsApp property inquiry | 🔵 | Property ID + price + link |
| R3 | Extended filters: type, locality, furnishing, possession, area | 🟣 | Faceted, `nuqs` URL state |
| R4 | **EMI Calculator** + amortization chart | 🟣 | Har Indian buyer pehle EMI poochta hai |
| R5 | **Stamp Duty & Registration estimator** (state-wise, female rebate) | 🟣 | Hidden cost — trust builder |
| R6 | **Rent vs Buy calculator** | 🟣 | Fence-sitters ko convert karta hai |
| R7 | Loan eligibility checker (income → max loan) | 🟣 | Qualifies the lead automatically |
| R8 | Compare up to 3 properties side-by-side | 🟣 | Premium portal feature |
| R9 | Shortlist / wishlist (localStorage) + "Send shortlist on WhatsApp" | 🟣 | Multi-property lead in one message |
| R10 | RERA ID badge + official verify link | 🟣 | Legal trust signal, mandatory in India |
| R11 | Locality intelligence (school/metro/hospital distance chips) | 🟣 | Family buyers ka real decision factor |
| R12 | Floor plan lightbox + 360° / YouTube virtual tour | 🟣 | Reduces wasted site visits |
| R13 | Site visit scheduler (date + time slot) → WhatsApp | 🟣 | Direct booking |
| R14 | Price trend sparkline per locality | 🟣 | Investor angle |
| R15 | Brochure PDF download (name+phone gated) → WhatsApp lead | 🟣 | Classic lead magnet |
| R16 | Possession timeline / construction progress | 🟣 | Under-construction projects |
| R17 | NRI corner (FEMA, repatriation, POA notes) | 🟣 | High-ticket segment |

---

## C. Role: Insurance Agent (`insurance`)

| # | Feature | Type | Notes |
|---|---------|------|-------|
| I1 | Quick Premium Estimator (Age + Cover slider) | 🔵 | Instant number = instant engagement |
| I2 | Multi-product estimator: Term / Health / Motor | 🟣 | One agent sells all |
| I3 | **Human Life Value calculator** | 🟣 | "Aapko kitna cover chahiye" — consultative sell |
| I4 | **80C + 80D tax saving calculator** | 🟣 | Jan–Mar me sabse bada demand driver |
| I5 | Claim Settlement Ratio comparison table | 🟣 | #1 objection handler in India |
| I6 | Plan comparison matrix (3 insurers) | 🟣 | Positions agent as advisor, not seller |
| I7 | Policy renewal reminder → .ics + WhatsApp | 🟣 | Retention engine |
| I8 | Child education / retirement goal calculator | 🟣 | Emotional trigger, ULIP/endowment upsell |
| I9 | Claim assistance document checklist | 🟣 | Post-sale service = referrals |
| I10 | IRDAI license badge + families-served counter | 🟣 | Regulatory trust |
| I11 | Premium payment mode comparison (annual vs monthly savings) | 🟣 | |
| I12 | "Policy health check" upload CTA → WhatsApp | 🟣 | Converts existing-policy holders |
| I13 | Structured quote summary → WhatsApp | 🟣 | Agent ko ready-to-quote lead |

---

## D. Role: Doctor / Dentist (`doctor`)

| # | Feature | Type | Notes |
|---|---------|------|-------|
| D1 | Smart Slot Booking (Today/Tomorrow × Morning/Evening) | 🔵 | Zero-friction booking |
| D2 | Live "Open Now / Closed" clinic status | 🟣 | Computed from hours JSON + IST clock |
| D3 | **Symptom → department router** | 🟣 | Patient ko sahi jagah bhejta hai |
| D4 | Treatment cost estimator (range + EMI) | 🟣 | Cost transparency = trust |
| D5 | **Before/After comparison slider** | 🟣 | Dental/cosmetic ka sabse strong proof |
| D6 | Pre-appointment digital form (age, symptom, duration) → WhatsApp | 🟣 | Doctor ka time bachta hai |
| D7 | Video consultation CTA + fee | 🟣 | Post-COVID normal |
| D8 | Cashless insurance panel list | 🟣 | Big filter for patients |
| D9 | Emergency call FAB slot | 🟣 | Life-safety + trust |
| D10 | Report / prescription upload via WhatsApp | 🟣 | Follow-up channel |
| D11 | Multi-location clinic switcher | 🟣 | Growing practices |
| D12 | Health tips / reels grid | 🟣 | SEO + authority |
| D13 | Doctor credentials timeline (degrees, fellowships, papers) | 🟣 | Authority signal |
| D14 | Appointment .ics download | 🟣 | |
| D15 | Google review CTA after visit | 🟣 | Local SEO flywheel |

---

## E. Role: CA / Tax Consultant (`ca-tax`)

| # | Feature | Type | Notes |
|---|---------|------|-------|
| T1 | Tax Document Checklist (Salaried / Business) | 🔵 | Interactive, progress bar |
| T2 | Checklist → "Send my checklist on WhatsApp" | 🟣 | Client ko list milti hai, CA ko lead |
| T3 | Extended checklists: NRI, Capital Gains, Freelancer | 🟣 | Covers real client mix |
| T4 | **Old vs New Regime tax calculator (FY 2025-26)** | 🟣 | Har salaried ka #1 sawaal |
| T5 | **GST calculator + GSTIN format validator** | 🟣 | Business clients ke liye |
| T6 | HRA exemption calculator | 🟣 | Metro/non-metro logic |
| T7 | Advance tax / 234B-C interest estimator | 🟣 | Penalty fear = urgency |
| T8 | **Compliance due-date calendar** + .ics reminders | 🟣 | Sticky, year-round value |
| T9 | Transparent service packages with pricing | 🟣 | ITR ₹1,499 type — removes haggling |
| T10 | Business registration wizard (Pvt Ltd / LLP / OPC compare) | 🟣 | High-value service funnel |
| T11 | Secure document upload CTA (WhatsApp / Drive) | 🟣 | |
| T12 | Filing status tracker teaser | 🟣 | Phase-2 hook |
| T13 | ICAI membership badge + firm credentials | 🟣 | Authority |
| T14 | Downloadable tax-saving guide PDF (lead magnet) | 🟣 | |

> ⚠️ Tax slabs/rates **dummy + clearly labelled** rakhne hain, with a disclaimer:
> *"Indicative only. Verify with your CA."* Real compliance advice claim mat karo.

---

## F. Role: Event / Wedding Photographer (`photographer`)

| # | Feature | Type | Notes |
|---|---------|------|-------|
| P1 | Masonry media gallery (photo + video) | 🔵 | `react-photo-album` + lightbox |
| P2 | "Check Date Availability" (simulated) | 🔵 | Calendar with booked/tentative/free |
| P3 | Cinematic showreel hero video | 🟣 | 8s loop, poster, muted |
| P4 | **Package builder** (base + add-ons → live total) → WhatsApp | 🟣 | Self-qualifying lead with budget |
| P5 | Story-style case studies ("Aarav × Meera, Udaipur") | 🟣 | Emotional selling |
| P6 | Moodboard / style picker (Candid, Cinematic, Traditional) | 🟣 | Brief milta hai pehle hi |
| P7 | Private client gallery teaser (password field) | 🟣 | Premium service signal |
| P8 | Instagram feed grid | 🟣 | Social proof |
| P9 | Destination coverage map + travel terms | 🟣 | Destination weddings = high ticket |
| P10 | Team & gear section | 🟣 | Justifies pricing |
| P11 | Sample album PDF download (gated) | 🟣 | Lead magnet |
| P12 | Booking advance / date-block CTA | 🟣 | Urgency ("only 3 dates left in Feb") |
| P13 | Couple testimonials with names + dates | 🟣 | |
| P14 | Lightbox with zoom, thumbnails, video plugin, keyboard nav | 🟣 | Polish |

---

## G. Role: Gym Trainer / Tutor (`fitness-tutor`)

Ek module, do variants — `variant: "gym" | "tutor"`.

### Gym variant
| # | Feature | Type | Notes |
|---|---------|------|-------|
| G1 | **Virtual 1-Day VIP Pass generator** | 🔵 | Name/phone → digital pass screen |
| G2 | VIP Pass: QR code + gradient card + "Download as image" + WhatsApp share | 🟣 | Shareable = viral loop |
| G3 | BMI / BMR / TDEE calculator | 🟣 | Engagement hook |
| G4 | Transformation before/after slider + weeks/kg lost | 🟣 | Strongest proof |
| G5 | Program cards (12-week etc.) with pricing & EMI | 🟣 | |
| G6 | Class timetable (weekly grid) | 🟣 | |
| G7 | Free diet plan PDF (gated) | 🟣 | Lead magnet |
| G8 | Trainer certifications (ACE/K11/ISSA) | 🟣 | Credibility |
| G9 | Progress-tracker teaser | 🟣 | Phase-2 hook |

### Tutor variant
| # | Feature | Type | Notes |
|---|---------|------|-------|
| G10 | **Free Demo Class pass** (same pass engine) | 🔵→🟣 | VIP pass reused |
| G11 | Board / Class / Subject selector → matched batch | 🟣 | CBSE/ICSE/State |
| G12 | Results showcase (toppers, % scores) | 🟣 | Indian parents ka #1 factor |
| G13 | Batch timetable + seats-left indicator | 🟣 | Scarcity |
| G14 | Free mock test / sample paper download | 🟣 | Lead magnet |
| G15 | Fee structure + installment plan | 🟣 | |
| G16 | Doubt-solving WhatsApp CTA | 🟣 | Daily touchpoint |

---

## H. Feature Count Summary

| Role | Minimum (owner) | Premium added | Total role-specific |
|------|----------------|---------------|---------------------|
| Real Estate | 2 | 15 | 17 |
| Insurance | 1 | 12 | 13 |
| Doctor | 1 | 14 | 15 |
| CA / Tax | 1 | 13 | 14 |
| Photographer | 2 | 12 | 14 |
| Fitness / Tutor | 2 | 14 | 16 |
| **Universal** | 3 | 15 | 18 |

**Total: ~107 features** across the product.
