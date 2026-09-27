# 06 — WORK BREAKDOWN (14 PARTS)

Har part `docs/parts/PART-XX-*.md` me detail me likha hai.
Ek part = ek branch = ek PR.

---

## Dependency Graph

```
PART-00 Foundation
   |
   +--> PART-01 Config Engine ----+
   |                              |
   +--> PART-02 Design System ----+--> PART-03 Core Modules
                                            |
                                            v
                                     PART-04 Section Library
                                            |
              +----------+----------+-------+-------+----------+----------+
              |          |          |               |          |          |
           PART-05    PART-06    PART-07        PART-08    PART-09    PART-10
         RealEstate  Insurance   Doctor          CA/Tax   Photographer Fitness
              |          |          |               |          |          |
              +----------+----------+-------+-------+----------+----------+
                                            |
                                     PART-11 Data & Media
                                            |
                                     PART-12 PWA/SEO/Perf/A11y
                                            |
                                     PART-13 Preview Studio, QA, Deploy
```

PART-05 → PART-10 **parallel** chal sakte hain (alag folders, zero conflict).
PART-11 ko har role part ke saath incrementally bhi kar sakte ho.

---

## Part Summary Table

| Part | Name | Blocked by | Est. | Primary output folder |
|------|------|-----------|------|----------------------|
| 00 | Foundation & Scaffold | — | 0.5d | root, `src/app`, `src/components/ui` |
| 01 | Config Engine | 00 | 1d | `src/config`, `src/types` |
| 02 | Design System & Theming | 00 | 1d | `src/styles`, `src/components/motion` |
| 03 | Core Modules | 01, 02 | 1.5d | `src/core` |
| 04 | Universal Section Library | 03 | 2d | `src/components/sections`, `layout`, `shared` |
| 05 | Real Estate Module | 04 | 2d | `src/modules/real-estate` |
| 06 | Insurance Module | 04 | 1.5d | `src/modules/insurance` |
| 07 | Doctor Module | 04 | 1.5d | `src/modules/doctor` |
| 08 | CA / Tax Module | 04 | 1.5d | `src/modules/ca-tax` |
| 09 | Photographer Module | 04 | 2d | `src/modules/photographer` |
| 10 | Fitness / Tutor Module | 04 | 2d | `src/modules/fitness-tutor` |
| 11 | Dummy Data & Media Pipeline | 01 | 2d | `src/data`, `public`, `scripts` |
| 12 | PWA, SEO, Perf, A11y | 04 | 1.5d | `src/core/pwa`, `seo`, `app` |
| 13 | Preview Studio, QA & Deploy | all | 1.5d | `src/app/(site)`, `.github` |

**Total ≈ 21 dev-days** sequential; parallel karke ~12 days.

---

## Milestones

| Milestone | Parts | "Done" ka matlab |
|-----------|-------|------------------|
| **M1 — Skeleton Walks** | 00–03 | `role` badalne par theme + FAB + vCard + WhatsApp chalte hain, sections abhi placeholder |
| **M2 — One Role Ships** | 04, 07, 11(doctor) | Doctor ka poora site production-quality, demo-able |
| **M3 — All Six Ship** | 05, 06, 08, 09, 10, 11 | 6/6 roles complete with rich data |
| **M4 — Premium Polish** | 12, 13 | Lighthouse targets, PWA, preview studio, deployed |

---

## Suggested Order (solo dev)
1. `00 → 01 → 02 → 03` (foundation, sequential — skip mat karo)
2. `04` (sections — sabse zyada leverage)
3. `07 Doctor` + `11 doctor data` → **pehla complete demo** (M2)
4. `05 Real Estate` (sabse feature-heavy, high sale value)
5. `09 Photographer` (visually sabse impressive, portfolio piece)
6. `06 Insurance` → `08 CA/Tax` → `10 Fitness`
7. `12 → 13`

## Suggested Order (2–3 devs)
- Dev A: `00 → 01 → 03 → 12`
- Dev B: `02 → 04 → 13`
- Dev C: `11` (data/media) → phir role modules
- Role modules (05–10) ek-ek karke distribute, sab parallel.

---

## Branch & PR Naming

```
feat/part-00-foundation
feat/part-05-real-estate
```
PR title: `PART-05: Real Estate module — smart filter, EMI, shortlist`
PR body me part MD ka "Definition of Done" checklist paste karke tick karo.

---

## Part File Template (har PART-XX MD ka structure)

```
1. Goal (ek line)
2. Prerequisites (kaunse parts done hone chahiye)
3. Read First (kaunse docs)
4. Files To Create (exact paths)
5. Open-Source Sources (kya copy karna hai, kahan se)
6. Implementation Steps (numbered)
7. Data Contract (JSON shape)
8. WhatsApp Message Templates (agar applicable)
9. Definition of Done (checkbox list)
10. Handoff (agla part kya expect karta hai)
```
