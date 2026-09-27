# 03 — CONFIG & DATA SCHEMA

Teen level ka configuration hai. Kabhi inhe mix mat karo.

```
LEVEL 1  src/config/site.config.json      -> THE SWITCH (role, locale, flags)
LEVEL 2  src/config/roles/<role>.preset.ts -> structure (sections order, modules, theme id)
LEVEL 3  src/data/roles/<role>.json        -> content (naam, number, photos, listings...)
```

Client badalna ho → sirf **LEVEL 3** chhuo.
Role badalna ho → sirf **LEVEL 1** chhuo.
Naya vertical → **LEVEL 2 + 3** naya banao.

---

## LEVEL 1 — `src/config/site.config.json`

```jsonc
{
  "$schema": "./schema/site.schema.json",
  "role": "doctor",
  "locale": "en-IN",
  "secondaryLocale": "hi-IN",
  "theme": {
    "mode": "system",            // "light" | "dark" | "system"
    "allowToggle": true,
    "override": null             // null = role default theme; ya "emerald-pro"
  },
  "flags": {
    "pwa": true,
    "installPrompt": true,
    "analytics": true,
    "i18nToggle": true,
    "exitIntentLead": true,
    "qrShare": true,
    "smoothScroll": true,
    "confettiOnLead": true,
    "devRoleSwitcher": true      // dev-only floating role switcher
  },
  "debug": { "showSectionOutlines": false }
}
```

---

## LEVEL 2 — `src/config/roles/doctor.preset.ts`

```ts
export const doctorPreset: RolePreset = {
  key: 'doctor',
  label: 'Doctor / Dentist',
  themeId: 'clinical-teal',
  fontPair: 'plus-jakarta+inter',
  iconSet: 'medical',

  // section order = page order. Renderer isi array ko map karega.
  sections: [
    'hero',
    'quickActions',
    'trustStrip',
    'about',
    'services',
    'module:slotBooking',
    'module:symptomRouter',
    'beforeAfter',
    'module:costEstimator',
    'clinicInfo',
    'testimonials',
    'faq',
    'leadForm',
    'footer',
  ],

  modules: ['slotBooking', 'symptomRouter', 'costEstimator', 'healthTips'],

  fab: { whatsapp: true, call: true, directions: true, emergency: true },

  vcard: { includePhoto: true, includeLogo: true, titleField: 'designation' },

  seo: { schemaType: 'Physician' },   // JSON-LD type
}
```

---

## LEVEL 3 — `src/data/roles/<role>.json` (COMMON BLOCK)

Yeh block **saare 6 roles** me identical shape ka hoga:

```jsonc
{
  "profile": {
    "name": "Dr. Ananya Sharma",
    "designation": "MDS, Cosmetic & Implant Dentist",
    "tagline": "15,000+ smiles designed in Pune since 2011",
    "shortBio": "...",
    "longBio": "...",
    "experienceYears": 14,
    "languages": ["English", "Hindi", "Marathi"],
    "avatar": "https://images.unsplash.com/...",
    "coverImage": "https://images.unsplash.com/...",
    "coverVideo": "/videos/clinic-loop.mp4",
    "logo": "/images/roles/doctor/logo.svg"
  },

  "contact": {
    "whatsapp": "+919876543210",        // DUMMY TEST NUMBER — sab roles me same
    "phone": "+919876543210",
    "altPhone": "+912041234567",
    "email": "hello@smilestudio.in",
    "website": "https://smilestudio.in",
    "address": {
      "line1": "Smile Studio Dental Care",
      "line2": "2nd Floor, Kumar Prestige, FC Road",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411005",
      "country": "India",
      "lat": 18.5204,
      "lng": 73.8567,
      "googleMapsUrl": "https://maps.google.com/?q=18.5204,73.8567",
      "plusCode": ""
    },
    "hours": [
      { "day": "mon-sat", "open": "10:00", "close": "20:00", "breakStart": "14:00", "breakEnd": "16:00" },
      { "day": "sun", "open": null, "close": null }
    ],
    "socials": {
      "instagram": "https://instagram.com/...",
      "facebook": "", "linkedin": "", "youtube": "", "x": "", "justdial": "", "googleBusiness": ""
    }
  },

  "trust": {
    "badges": [
      { "icon": "shield-check", "label": "MDS Certified", "sub": "Maharashtra Dental Council" },
      { "icon": "star", "label": "4.9 / 5", "sub": "482 Google Reviews" }
    ],
    "stats": [
      { "value": 15000, "suffix": "+", "label": "Happy Patients" },
      { "value": 14, "suffix": " yrs", "label": "Experience" }
    ],
    "registrationId": "MDC/2011/48291",
    "associations": ["Indian Dental Association", "AO Implant Academy"]
  },

  "services": [
    {
      "id": "implants",
      "title": "Dental Implants",
      "description": "Single-day basal implants with 10-year warranty.",
      "icon": "tooth",
      "image": "https://...",
      "priceFrom": 18000,
      "priceUnit": "per tooth",
      "duration": "60–90 min",
      "highlights": ["Painless", "Same-day crown", "EMI available"],
      "ctaIntent": "appointment_book"
    }
  ],

  "gallery": [
    { "type": "image", "src": "https://...", "alt": "...", "width": 1600, "height": 1067, "tags": ["clinic"] },
    { "type": "video", "src": "/videos/...", "poster": "https://...", "alt": "..." }
  ],

  "testimonials": [
    {
      "name": "Rohit Deshmukh",
      "role": "Patient · Kothrud",
      "avatar": "https://i.pravatar.cc/150?img=12",
      "rating": 5,
      "text": "...",
      "date": "2025-11-14",
      "source": "google"
    }
  ],

  "faq": [
    { "q": "Do you accept insurance?", "a": "..." }
  ],

  "cta": {
    "primary":   { "label": "Book Appointment", "intent": "appointment_book" },
    "secondary": { "label": "Save My Contact",  "intent": "vcard_download" }
  },

  "leadForm": {
    "title": "Request a callback",
    "subtitle": "We reply on WhatsApp within 10 minutes.",
    "fields": ["name", "phone", "concern", "preferredTime"],
    "intent": "callback_request",
    "consentText": "I agree to be contacted on WhatsApp."
  },

  "seo": {
    "title": "Dr. Ananya Sharma — Cosmetic & Implant Dentist, Pune",
    "description": "...",
    "keywords": ["dentist in pune", "dental implants pune"],
    "ogImage": "auto"
  },

  "module": { /* ROLE-SPECIFIC BLOCK — niche dekho */ }
}
```

---

## LEVEL 3 — `module` block per role (shape summary)

### `real-estate`
```jsonc
"module": {
  "properties": [
    {
      "id": "p-001", "title": "3BHK in Baner High-Rise", "type": "apartment",
      "listingFor": "sale", "bhk": 3, "bathrooms": 3, "price": 12500000,
      "pricePerSqft": 9800, "carpetArea": 1275, "superBuiltUp": 1580,
      "furnishing": "semi", "floor": 12, "totalFloors": 22, "facing": "east",
      "ageYears": 2, "possession": "ready", "reraId": "P52100048291",
      "locality": "Baner", "city": "Pune",
      "amenities": ["gym", "pool", "clubhouse", "power-backup"],
      "nearby": [{ "type": "school", "name": "VIBGYOR High", "km": 1.2 }],
      "images": ["https://..."], "floorPlan": "https://...",
      "tourUrl": "https://youtube.com/...", "featured": true,
      "status": "available"
    }
  ],
  "filters": {
    "budgetRange": [2500000, 50000000], "budgetStep": 500000,
    "bhkOptions": [1, 2, 3, 4, 5],
    "typeOptions": ["apartment", "villa", "plot", "commercial"],
    "localities": ["Baner", "Kharadi", "Wakad", "Hinjewadi"]
  },
  "emi": { "defaultRate": 8.5, "defaultTenure": 20, "minDownPct": 10 },
  "stampDuty": { "state": "Maharashtra", "dutyPct": 6, "regPct": 1, "femaleRebatePct": 1 }
}
```

### `insurance`
```jsonc
"module": {
  "products": ["term", "health", "motor", "child", "retirement"],
  "estimator": {
    "ageRange": [18, 65], "coverOptions": [2500000, 5000000, 10000000, 25000000, 50000000],
    "tenureRange": [5, 40],
    "rateTable": { "term": { "18-30": 0.00042, "31-40": 0.00068, "41-50": 0.00125, "51-65": 0.00260 } },
    "loadings": { "smoker": 1.6, "female": 0.9 }
  },
  "plans": [
    { "id": "t1", "insurer": "HDFC Life", "name": "Click 2 Protect Super",
      "claimRatio": 99.4, "usp": ["Return of premium", "Terminal illness"], "logo": "..." }
  ],
  "taxSaving": { "s80c": 150000, "s80d": 25000, "s80dSenior": 50000 },
  "irdaiLicense": "IRDAI/AGT/2014/0092831"
}
```

### `doctor`
```jsonc
"module": {
  "slots": {
    "days": ["today", "tomorrow"],
    "periods": [
      { "key": "morning", "label": "Morning", "range": "10:00 AM – 1:00 PM" },
      { "key": "evening", "label": "Evening", "range": "4:00 PM – 8:00 PM" }
    ],
    "unavailable": [{ "day": "tomorrow", "period": "morning" }]
  },
  "symptomRouter": [
    { "symptom": "Tooth pain", "department": "Endodontics", "urgency": "high" }
  ],
  "treatments": [{ "name": "Root Canal", "min": 4500, "max": 9000, "sessions": "1–2" }],
  "beforeAfter": [{ "before": "https://...", "after": "https://...", "label": "Smile Makeover" }],
  "insurancePanels": ["Star Health", "HDFC Ergo", "CGHS"],
  "emergency": { "enabled": true, "number": "+919876543210" },
  "teleconsult": { "enabled": true, "fee": 300, "platform": "Google Meet" }
}
```

### `ca-tax`
```jsonc
"module": {
  "checklists": {
    "salaried":  [{ "id": "form16", "label": "Form 16 (Part A & B)", "required": true, "hint": "..." }],
    "business":  [{ "id": "pl", "label": "Profit & Loss Statement", "required": true }],
    "nri":       [],
    "capitalGains": []
  },
  "regimeCalc": { "fy": "2025-26", "slabsOld": [...], "slabsNew": [...], "stdDeduction": 75000, "cessPct": 4 },
  "gst": { "slabs": [0, 5, 12, 18, 28] },
  "dueDates": [{ "date": "2026-07-31", "title": "ITR Filing (non-audit)", "for": "salaried" }],
  "packages": [{ "name": "ITR — Salaried", "price": 1499, "turnaround": "24 hrs", "includes": [...] }],
  "membershipNo": "ICAI 148291"
}
```

### `photographer`
```jsonc
"module": {
  "availability": { "booked": ["2026-02-14", "2026-02-21"], "tentative": ["2026-03-05"], "leadDays": 7 },
  "packages": [
    { "id": "wed-gold", "name": "Wedding Gold", "price": 185000, "days": 2,
      "includes": ["2 photographers", "1 cinematographer", "30-page album"], "popular": true }
  ],
  "addons": [{ "id": "drone", "name": "Drone Coverage", "price": 25000 }],
  "styles": ["Candid", "Traditional", "Cinematic", "Documentary"],
  "albums": [{ "title": "Aarav × Meera, Udaipur", "cover": "https://...", "photos": [...] }],
  "showreel": { "url": "/videos/showreel.mp4", "poster": "https://..." },
  "travelCities": ["Udaipur", "Goa", "Jaipur", "Kerala"]
}
```

### `fitness-tutor`
```jsonc
"module": {
  "variant": "gym",                  // "gym" | "tutor"
  "vipPass": {
    "validityDays": 1, "perks": ["Full gym access", "1 PT session", "Body composition scan"],
    "terms": "Valid once per person. Carry a photo ID."
  },
  "programs": [{ "name": "12-Week Transformation", "price": 18000, "sessions": 36, "level": "all" }],
  "timetable": [{ "day": "mon", "slots": [{ "time": "06:00", "class": "HIIT", "trainer": "Rahul" }] }],
  "transformations": [{ "name": "Karan", "weeks": 16, "before": "https://...", "after": "https://...", "lost": "18 kg" }],
  "calculators": ["bmi", "bmr", "tdee"],
  "tutor": {
    "boards": ["CBSE", "ICSE", "State"], "classes": ["9", "10", "11", "12"],
    "subjects": ["Physics", "Chemistry", "Maths"],
    "results": [{ "year": 2025, "topper": "Aditi J.", "score": "98.4%" }]
  }
}
```

---

## Zod Schema Files (Part-01 me banenge)

```
src/config/schema/
├─ site.schema.ts           # Level 1
├─ preset.schema.ts         # Level 2
├─ common.schema.ts         # profile/contact/trust/services/gallery/testimonials/faq/cta/seo
└─ modules/
   ├─ real-estate.schema.ts
   ├─ insurance.schema.ts
   ├─ doctor.schema.ts
   ├─ ca-tax.schema.ts
   ├─ photographer.schema.ts
   └─ fitness-tutor.schema.ts
```

`npm run validate:config` → `scripts/validate-config.ts` saare 6 JSONs ko parse karega,
fail hone par exact path + error print karega. CI me bhi chalega.

---

## Dummy Test Constants (sab jagah same)

```ts
// src/lib/constants/dummy.ts
export const DUMMY_WHATSAPP = '+919876543210'
export const DUMMY_PHONE    = '+919876543210'
export const DUMMY_EMAIL    = 'hello@example.in'
export const DUMMY_MAPS     = 'https://maps.google.com/?q=18.5204,73.8567'
```
