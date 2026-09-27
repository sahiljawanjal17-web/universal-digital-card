# 10 — AI / DEVELOPER HANDOFF GUIDE

Kisi dusre AI (ya developer) ko ek PART ka kaam dena ho to **kaunsi files padhani hain**.

> ⚠️ **Saari docs mat do.** Context bhar jayega aur AI confuse hoga.
> Sirf neeche listed files do — har part ke liye 5–7 files kaafi hain.

---

## 1. THE CORE 3 (har part ke liye, hamesha)

| # | File | Kyun |
|---|------|------|
| 1 | `README.md` (root) | Product kya hai, rules kya hain — 2 min orientation |
| 2 | `docs/07-CONVENTIONS.md` | Hard rules: no role conditionals, no hardcoded content, WhatsApp standard, naming |
| 3 | `docs/parts/PART-XX-*.md` | **Actual kaam ka brief** — yahi main instruction hai |

Ye 3 na do to AI apne hisaab se code likhega aur architecture tod dega.

---

## 2. PART-WISE READING LIST

### PART-00 — Foundation & Scaffold
```
✅ CORE 3
+ docs/05-SETUP-COMMANDS.md          (ye part basically isko execute karta hai)
+ docs/02-TECH-STACK-AND-REPOS.md    (§6 package list, §2 components)
+ docs/01-ARCHITECTURE.md            (§2 folder tree — taaki merge sahi ho)
```

### PART-01 — Config Engine
```
✅ CORE 3
+ docs/03-CONFIG-SCHEMA.md           ← POORA. Yahi is part ka spec hai.
+ docs/01-ARCHITECTURE.md            (§1 mental model, §5 module contract, §7 isolation)
+ docs/assets/example-doctor.json    (real data shape ka sample)
+ src/config/README.md
```

### PART-02 — Design System & Theming
```
✅ CORE 3
+ docs/04-DESIGN-SYSTEM.md           ← POORA. Yahi spec hai.
+ docs/02-TECH-STACK-AND-REPOS.md    (§2 component libraries)
```

### PART-03 — Core Modules (vCard / WhatsApp / FAB)
```
✅ CORE 3
+ docs/00-MASTER-PLAN.md             (§4 core features C1–C5)
+ docs/01-ARCHITECTURE.md            (§4 lead data flow)
+ docs/04-DESIGN-SYSTEM.md           (§7 FAB spec)
+ src/core/README.md
```

### PART-04 — Universal Section Library
```
✅ CORE 3
+ docs/01-ARCHITECTURE.md            (§1, §5)
+ docs/03-CONFIG-SCHEMA.md           (common data block — sections isi se render honge)
+ docs/04-DESIGN-SYSTEM.md           (§6 layout patterns)
+ docs/09-FEATURE-MATRIX.md          (§A universal features)
+ src/components/README.md
```

### PART-05 … PART-10 — Role Modules
```
✅ CORE 3
+ docs/09-FEATURE-MATRIX.md          (sirf uska section — B/C/D/E/F/G)
+ docs/03-CONFIG-SCHEMA.md           (sirf uska `module` block + common block)
+ docs/02-TECH-STACK-AND-REPOS.md    (§4 feature→source mapping)
+ src/modules/<role>/README.md
+ docs/parts/PART-04-SECTION-LIBRARY.md  (§7 Handoff — kaunse shared components available hain)
```

| Part | Feature Matrix section | Module folder |
|------|----------------------|---------------|
| 05 | Section B (R1–R17) | `src/modules/real-estate/` |
| 06 | Section C (I1–I13) | `src/modules/insurance/` |
| 07 | Section D (D1–D15) | `src/modules/doctor/` |
| 08 | Section E (T1–T14) | `src/modules/ca-tax/` |
| 09 | Section F (P1–P14) | `src/modules/photographer/` |
| 10 | Section G (G1–G16) | `src/modules/fitness-tutor/` |

### PART-11 — Dummy Data & Media
```
✅ CORE 3
+ docs/03-CONFIG-SCHEMA.md           ← POORA
+ docs/02-TECH-STACK-AND-REPOS.md    (§5 media sources)
+ docs/assets/example-doctor.json
+ src/data/README.md
+ har role part ka "Data Requirement" section (PART-05…10 me §7)
```

### PART-12 — PWA / SEO / Perf / A11y
```
✅ CORE 3
+ docs/00-MASTER-PLAN.md             (§6 measurable premium targets)
+ docs/08-QA-CHECKLIST.md            (§9–12)
+ docs/04-DESIGN-SYSTEM.md           (§8 accessibility rules)
```

### PART-13 — Preview / QA / Deploy
```
✅ CORE 3
+ docs/08-QA-CHECKLIST.md            ← POORA
+ docs/00-MASTER-PLAN.md             (§9 success criteria)
+ docs/06-WORK-BREAKDOWN.md          (milestones)
```

---

## 3. COPY-PASTE PROMPT TEMPLATE

Dusre AI ko ye bhejo (`XX` aur file list replace karke):

```
Tum ek Next.js 15 + Tailwind v4 + shadcn/ui expert ho.

Main ek "Universal Digital Business Card & Lead Generation Web App" bana raha hoon —
single codebase jisme ek JSON ka `role` field badalne se poori UI, colors, sections
aur specialized tools badal jate hain. 6 roles hain: real-estate, insurance, doctor,
ca-tax, photographer, fitness-tutor.

Tumhe PART-XX ka kaam karna hai.

PEHLE YE FILES PADHO (isi order me):
1. README.md
2. docs/07-CONVENTIONS.md
3. docs/parts/PART-XX-<name>.md          <- tumhara main brief
4. <part-specific file 1>
5. <part-specific file 2>

HARD RULES (todna nahi):
- Scratch se mat likho. docs/02-TECH-STACK-AND-REPOS.md se open-source
  components copy karke adapt karo.
- Kahin bhi `if (role === '...')` mat likho (sirf SectionRenderer/ModuleRegistry exception).
- Koi hardcoded naam/number/price/image URL nahi — sab src/data/roles/*.json se.
- Koi cross-module import nahi (modules/A kabhi modules/B se import nahi karega).
- Raw Tailwind colors (bg-blue-600) banned — sirf semantic tokens (bg-brand, text-fg-muted).
- Har WhatsApp link core/whatsapp ke through banega, khud mat banao.

KAAM KHATAM HONE PAR:
- PART-XX file ka "Definition of Done" checklist 100% tick karo
- `npm run typecheck && npm run lint && npm run validate:config` clean ho
- PART-XX ka "Handoff" section actual file paths se update karo
- STATUS.md me part ko ✅ mark karo

Sirf PART-XX ka scope karo. Dusre parts ko haath mat lagao.
Koi cheez clear na ho to poocho, guess mat karo.
```

---

## 4. KYA **NAHI** DENA

| File | Kyun nahi |
|------|-----------|
| Baaki 13 PART files | Scope creep — AI dusre parts ka kaam bhi karne lagega |
| `docs/06-WORK-BREAKDOWN.md` | Sirf planning ke liye hai, coding me use nahi |
| Poora `docs/09-FEATURE-MATRIX.md` | Sirf us role ka section do, poora nahi |
| `docs/assets/LICENSES.md` | Sirf fill karne ke liye hai, padhne ke liye nahi |
| `docs/research/*` | PART-11 ke alawa kisi ko nahi |

---

## 5. PARALLEL ME KAAM DENA HO (multiple AI)

Sabse safe combination — ye 6 parts ek saath de sakte ho, zero merge conflict
(kyunki sab alag folders me kaam karte hain):

```
AI-1 → PART-05  src/modules/real-estate/
AI-2 → PART-06  src/modules/insurance/
AI-3 → PART-07  src/modules/doctor/
AI-4 → PART-08  src/modules/ca-tax/
AI-5 → PART-09  src/modules/photographer/
AI-6 → PART-10  src/modules/fitness-tutor/
```

**Shart:** PART-00 se PART-04 pehle complete hone chahiye, warna sab ke sab
alag-alag button/card banayenge aur design phat jayega.

Har AI ko extra line do:
```
Tum SIRF src/modules/<role>/ folder me files banaoge.
Uske bahar koi file mat chhuo. Agar kisi shared component ki zaroorat lage
jo maujood nahi hai, to use banao mat — mujhe batao.
```

---

## 6. QUICK REFERENCE CARD

```
KOI BHI PART  →  README.md + docs/07-CONVENTIONS.md + docs/parts/PART-XX-*.md
     +
  00 → 05-SETUP-COMMANDS, 02-TECH-STACK
  01 → 03-CONFIG-SCHEMA, 01-ARCHITECTURE
  02 → 04-DESIGN-SYSTEM
  03 → 00-MASTER-PLAN §4, 01-ARCHITECTURE §4, 04-DESIGN-SYSTEM §7
  04 → 01-ARCHITECTURE, 03-CONFIG-SCHEMA, 04-DESIGN-SYSTEM §6, 09-FEATURE §A
05-10 → 09-FEATURE (uska section), 03-CONFIG-SCHEMA (uska module block), 02-TECH-STACK §4
  11 → 03-CONFIG-SCHEMA, 02-TECH-STACK §5, example-doctor.json
  12 → 00-MASTER-PLAN §6, 08-QA §9-12, 04-DESIGN-SYSTEM §8
  13 → 08-QA (poora), 00-MASTER-PLAN §9
```
