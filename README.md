# ALL_IN_ONE — Universal Digital Business Card & Lead Generation Web App

> **STATUS: PLANNING ONLY. NO CODE WRITTEN YET.**
> Yeh repo abhi sirf *architecture skeleton + documentation* hai.
> Coding tab shuru hogi jab owner explicitly bole: "PART-XX start karo".

Ek single Next.js codebase jo ek JSON config ka `role` field badalne par
poori UI, colors, sections aur specialized tools badal deta hai.

```jsonc
// src/config/site.config.json
{ "role": "doctor" }   // -> change to "real-estate" | "insurance" | "ca-tax" | "photographer" | "fitness-tutor"
```

---

## 📚 Read This In Order

| # | File | Kya milega |
|---|------|-----------|
| 0 | [docs/00-MASTER-PLAN.md](docs/00-MASTER-PLAN.md) | Product vision, scope, success criteria |
| 1 | [docs/01-ARCHITECTURE.md](docs/01-ARCHITECTURE.md) | Folder tree, data flow, rendering strategy |
| 2 | [docs/02-TECH-STACK-AND-REPOS.md](docs/02-TECH-STACK-AND-REPOS.md) | Har open-source repo / component jo merge karna hai |
| 3 | [docs/03-CONFIG-SCHEMA.md](docs/03-CONFIG-SCHEMA.md) | Master JSON schema + example config |
| 4 | [docs/04-DESIGN-SYSTEM.md](docs/04-DESIGN-SYSTEM.md) | Role-wise color tokens, type scale, motion rules |
| 5 | [docs/05-SETUP-COMMANDS.md](docs/05-SETUP-COMMANDS.md) | Copy-paste terminal commands (Part 0) |
| 6 | [docs/06-WORK-BREAKDOWN.md](docs/06-WORK-BREAKDOWN.md) | 14 parts, dependency graph, kaun pehle |
| 7 | [docs/07-CONVENTIONS.md](docs/07-CONVENTIONS.md) | Naming, file rules, git, PR rules |
| 8 | [docs/08-QA-CHECKLIST.md](docs/08-QA-CHECKLIST.md) | Ship-ready checklist |
| 9 | [docs/09-FEATURE-MATRIX.md](docs/09-FEATURE-MATRIX.md) | Minimum vs Premium features, role x feature grid |
| 10 | [docs/10-AI-HANDOFF.md](docs/10-AI-HANDOFF.md) | **Kisi dusre AI/dev ko part dena ho to kaunsi files padhani hain** |

## 🧩 Part Files (har part ek self-contained brief hai)

`docs/parts/` me 14 files hain — **PART-00 se PART-13**.
Koi bhi developer (ya AI agent) sirf ek part file padhkar kaam shuru kar sakta hai.

```
PART-00  Foundation & Scaffold
PART-01  Config Engine (role -> everything)
PART-02  Design System & Theming
PART-03  Core Modules (vCard, WhatsApp Router, FAB, Share, Analytics)
PART-04  Universal Section Library
PART-05  Role: Real Estate Agent
PART-06  Role: Insurance Agent
PART-07  Role: Doctor / Dentist
PART-08  Role: CA / Tax Consultant
PART-09  Role: Photographer
PART-10  Role: Gym Trainer / Tutor
PART-11  Dummy Data & Media Pipeline
PART-12  PWA, SEO, Performance, Accessibility
PART-13  Preview Studio, QA & Deployment
```

## 🚦 Rules For Anyone Working Here

1. Ek time par **ek hi PART** uthao. Uska MD top-to-bottom follow karo.
2. Part ke "Definition of Done" tick kiye bina next part mat kholo.
3. **Scratch se mat likho** — pehle `docs/02-TECH-STACK-AND-REPOS.md` dekho, wahan se component uthao.
4. Har naya role module `src/modules/<role>/` ke bahar kuch nahi chhuyega.
5. Hardcoded text/number/phone allowed nahi — sab `src/data/roles/*.json` se aayega.
