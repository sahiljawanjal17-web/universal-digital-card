# PARTS INDEX

Har file ek **self-contained work brief** hai. Ek part uthao, top-to-bottom follow karo,
Definition of Done tick karo, phir agla.

| Part | File | Blocked by | Est. |
|------|------|-----------|------|
| 00 | [Foundation & Scaffold](PART-00-FOUNDATION.md) | — | 0.5d |
| 01 | [Config Engine](PART-01-CONFIG-ENGINE.md) | 00 | 1d |
| 02 | [Design System & Theming](PART-02-DESIGN-SYSTEM.md) | 00 | 1d |
| 03 | [Core Modules](PART-03-CORE-MODULES.md) | 01, 02 | 1.5d |
| 04 | [Universal Section Library](PART-04-SECTION-LIBRARY.md) | 03 | 2d |
| 05 | [Role: Real Estate](PART-05-ROLE-REAL-ESTATE.md) | 04 | 2d |
| 06 | [Role: Insurance](PART-06-ROLE-INSURANCE.md) | 04 | 1.5d |
| 07 | [Role: Doctor / Dentist](PART-07-ROLE-DOCTOR.md) | 04 | 1.5d |
| 08 | [Role: CA / Tax](PART-08-ROLE-CA-TAX.md) | 04 | 1.5d |
| 09 | [Role: Photographer](PART-09-ROLE-PHOTOGRAPHER.md) | 04 | 2d |
| 10 | [Role: Gym Trainer / Tutor](PART-10-ROLE-FITNESS-TUTOR.md) | 04 | 2d |
| 11 | [Dummy Data & Media](PART-11-DATA-AND-MEDIA.md) | 01 | 2d |
| 12 | [PWA, SEO, Perf, A11y](PART-12-PWA-SEO-PERF-A11Y.md) | 04 | 1.5d |
| 13 | [Preview, QA, Deploy](PART-13-PREVIEW-QA-DEPLOY.md) | all | 1.5d |

## Recommended solo path
`00 → 01 → 02 → 03 → 04 → 07 + 11(doctor) → 05 → 09 → 06 → 08 → 10 → 12 → 13`

## Parallel path (2–3 devs)
- Dev A: `00 → 01 → 03 → 12`
- Dev B: `02 → 04 → 13`
- Dev C: `11` → role modules
- `05`–`10` fully parallel (alag folders, zero merge conflict)

## Kisi dusre AI / dev ko part dena ho?
👉 [`docs/10-AI-HANDOFF.md`](../10-AI-HANDOFF.md) — exact file list + copy-paste prompt template.

## Har part shuru karne se pehle
1. `docs/07-CONVENTIONS.md` ek baar dobara padho
2. Naya branch: `feat/part-XX-slug`
3. Part MD ka "Read First" section follow karo
4. `STATUS.md` me part ko 🟡 In Progress mark karo

## Har part khatam karne ke baad
1. Definition of Done 100% tick
2. `npm run typecheck && npm run lint && npm run validate:config`
3. Part MD ka "Handoff" section actual paths se update karo
4. `STATUS.md` me ✅ mark karo
5. PR raise karo, DoD checklist body me paste karo
