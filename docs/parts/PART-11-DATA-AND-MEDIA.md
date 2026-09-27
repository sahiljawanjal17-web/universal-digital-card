# PART-11 — DUMMY DATA & MEDIA PIPELINE

**Status:** ⬜ Not started
**Est:** 2 days · **Blocked by:** PART-01 · **Can run in parallel with role parts**

---

## 1. Goal
6 role JSONs ko **believable, rich, Indian-context** content se bharna, aur media
(photos/videos) ka pipeline banana taaki hotlinking pe depend na karein.

> Yeh part hi "₹20,000 premium" feel ko make ya break karta hai.
> Generic western stock photos + lorem ipsum = product sasta lagta hai.

## 2. Read First
- `docs/03-CONFIG-SCHEMA.md` (poora)
- `docs/02-TECH-STACK-AND-REPOS.md` §5 (media sources)
- Har role part ka "Data Requirement" section

## 3. Files To Create

```
src/data/roles/
├─ real-estate.json
├─ insurance.json
├─ doctor.json
├─ ca-tax.json
├─ photographer.json
└─ fitness-tutor.json

src/data/media/
├─ unsplash-bank.ts        # curated URL collections by theme
└─ video-bank.ts

src/data/common/
├─ cities.ts               # Indian cities + states
├─ localities.ts           # Pune/Mumbai/Bangalore localities
├─ insurers.ts
├─ boards.ts               # CBSE/ICSE/State
└─ specialities.ts

scripts/
├─ prefetch-media.ts       # download URLs -> public/images/roles/<role>/
├─ image-dimensions.ts     # extract w/h, write back to JSON
├─ generate-blur.ts        # blurDataURL generation
└─ validate-config.ts      # (from PART-01, extend with content lint)

docs/research/
├─ real-estate-notes.md
├─ insurance-notes.md
├─ doctor-notes.md
├─ ca-tax-notes.md
├─ photographer-notes.md
└─ fitness-tutor-notes.md

public/brochures/*.pdf     # 6 dummy lead-magnet PDFs
```

## 4. Content Rules

### 4.1 Names & Businesses (believable Indian)
| Role | Person | Business |
|------|--------|----------|
| real-estate | Vikram Sharma | Sharma Realty & Associates, Pune |
| insurance | Priya Verma | Verma Insurance Advisory, Mumbai |
| doctor | Dr. Ananya Sharma | Smile Studio Dental Care, Pune |
| ca-tax | CA Rohan Agarwal | Agarwal & Associates, Delhi |
| photographer | Aarav Mehta | Aarav Studios, Udaipur |
| fitness-tutor | Karan Singh | Iron Forge Gym, Bangalore |

> Contact number **sab me same dummy**: `+919876543210`

### 4.2 Copy Guidelines
- Headlines: number-backed benefit. *"₹40 Cr worth property closed in 2025"*
- Bio: 3 paragraphs — origin, expertise, philosophy
- Services: 1-line benefit description, not feature list
- Testimonials: Indian names + locality + specific detail
  (❌ "Great service!" ✅ "Vikram found us a 3BHK in Baner within our ₹1.2 Cr
  budget in 3 weeks. He handled the entire loan paperwork.")
- FAQs: real objections, not softballs
- **Dates**: 2025–2027 range (product "current" lage)

### 4.3 Numbers Must Be Internally Consistent
- Testimonial count ≈ review count in trust stats
- "15 years experience" ⇒ started 2011 ⇒ credentials timeline match kare
- Property per-sqft × area ≈ listed price (±5%)
- Package price = sum of what's included (roughly)
- Seats left ≤ batch capacity

## 5. Media Pipeline

### 5.1 Curation
Har role ke liye Unsplash/Pexels pe search karo, **Indian context** keywords:

| Role | Search terms |
|------|-------------|
| real-estate | `pune apartment building`, `indian apartment interior`, `modern flat living room india`, `villa india`, `real estate agent india` |
| insurance | `indian family happy`, `family protection`, `indian couple home`, `financial planning desk` |
| doctor | `indian dentist clinic`, `dental chair modern`, `doctor consultation india`, `clinic reception` |
| ca-tax | `indian office accountant`, `financial documents desk`, `calculator paperwork`, `business meeting india` |
| photographer | `indian wedding photography`, `haldi ceremony`, `mehendi`, `indian bride portrait`, `baraat`, `sangeet night`, `pre wedding couple india` |
| fitness-tutor | `indian gym workout`, `fitness trainer india`, `indian classroom students`, `tuition class india` |

### 5.2 `scripts/prefetch-media.ts`
```
1. Read all src/data/roles/*.json
2. Collect every remote image URL
3. Download to public/images/roles/<role>/<hash>.jpg
4. Convert to WebP (sharp), max width 1600, quality 80
5. Extract width/height
6. Generate blurDataURL (10px base64)
7. Rewrite JSON: url -> local path, + width, height, blurDataURL
8. Write public/images/roles/<role>/CREDITS.md (photographer attribution)
```

Run: `npm run prefetch:media` (ya `npm run prefetch:media -- --role=photographer`)

### 5.3 Video
- Max 3MB per file, 8–12s loop
- Both `.webm` (VP9) + `.mp4` (H.264) — `<source>` fallback
- Poster JPG extracted from frame 0
- `ffmpeg` commands `docs/research/media-notes.md` me document karo

### 5.4 Budget
| Asset type | Max size | Count per role |
|-----------|----------|----------------|
| Hero image | 250KB | 1 |
| Card images | 120KB | 20–30 |
| Gallery images | 180KB | up to 90 (photographer) |
| Avatars | 20KB | 10 |
| Video | 3MB | 1–2 |
| **Total per role** | **~12MB** | |

## 6. Per-Role Work Order

| Order | Role | Why this order |
|-------|------|----------------|
| 1 | `doctor` | Simplest, unblocks M2 demo |
| 2 | `real-estate` | Biggest data volume, highest sale value |
| 3 | `photographer` | Heaviest media, start early |
| 4 | `ca-tax` | Text-heavy, less media |
| 5 | `insurance` | Text-heavy |
| 6 | `fitness-tutor` | Two variants = double content |

## 7. Research Notes (`docs/research/*.md`)
Har role ke liye likho:
- Top 5 questions us profession ke customers puchte hain
- Top 3 objections
- Pricing ranges (real market se)
- Competitor websites jo achhe hain (URLs)
- Regulatory/compliance points (RERA, IRDAI, MDC, ICAI)
- Seasonal patterns (tax season, wedding season, Jan gym rush)

> Yeh notes copy likhne me help karenge aur future Phase-2 ke liye asset hain.

## 8. Definition of Done
- [ ] 6/6 role JSONs `npm run validate:config` pass karte hain
- [ ] Har role me ≥ 8 services/products
- [ ] Har role me ≥ 10 testimonials
- [ ] Har role me ≥ 12 FAQs
- [ ] Zero lorem ipsum, zero "Your text here", zero `xxx`
- [ ] Sab numbers internally consistent (spot-check 10 items)
- [ ] `npm run prefetch:media` chal chuka, sab images local hain
- [ ] Har image ka `width`, `height`, `blurDataURL` JSON me hai
- [ ] Koi image > budget size nahi
- [ ] `CREDITS.md` har role folder me
- [ ] Videos webm + mp4 + poster, < 3MB
- [ ] 6 brochure PDFs `public/brochures/` me
- [ ] 6 research notes likhe
- [ ] Har role 320px mobile pe khol ke padha gaya (text overflow check)
- [ ] Spelling/grammar pass (EN)
- [ ] Commit: `feat(part-11): rich dummy data + media pipeline`

## 9. Handoff
Sab role modules (PART-05…10) is data pe depend karte hain.
Agar koi module ko naya field chahiye → **pehle schema update karo** (PART-01),
phir 6/6 JSONs me add karo, phir module me use karo.
