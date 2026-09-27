# Copy-paste prompt — PART-01 + 02 + 03 (ek saath)

Naye chat me ye paste karo. Working directory: `C:\Users\Admin\ALL_IN_ONE`

---

```
Project: C:\Users\Admin\ALL_IN_ONE

Ye ek "Universal Digital Business Card & Lead Generation Web App" hai — Next.js 15 +
Tailwind v4 + shadcn/ui. Single codebase, jisme ek JSON ka `role` field badalne se
poori UI, colors, sections aur tools badal jate hain. 6 roles: real-estate, insurance,
doctor, ca-tax, photographer, fitness-tutor.

Poora architecture + plan pehle se `docs/` me likha hua hai. Tumhe PART-01, PART-02
aur PART-03 teeno complete karne hain (isi order me).

## PEHLE YE FILES PADHO (isi order me)
1. README.md
2. docs/07-CONVENTIONS.md
3. docs/01-ARCHITECTURE.md
4. docs/parts/PART-01-CONFIG-ENGINE.md
5. docs/03-CONFIG-SCHEMA.md            (PART-01 ka spec)
6. docs/assets/example-doctor.json
7. docs/parts/PART-02-DESIGN-SYSTEM.md
8. docs/04-DESIGN-SYSTEM.md            (PART-02 ka spec)
9. docs/parts/PART-03-CORE-MODULES.md
10. docs/00-MASTER-PLAN.md             (sirf §4 aur §6)

## STEP 0 — pehle check karo
`package.json` exist karta hai?
- NAHI → PART-00 pehle karo: docs/parts/PART-00-FOUNDATION.md +
  docs/05-SETUP-COMMANDS.md follow karke scaffold khada karo, phir aage badho.
- HAAN → seedha PART-01 se shuru karo.

## KAAM
- PART-01: role config engine (zod schemas, 6 presets, resolveConfig, RoleProvider,
  validate-config + switch-role scripts, 6 placeholder data JSONs)
- PART-02: 6 role themes as OKLCH CSS vars + Tailwind v4 @theme binding, fonts,
  ThemeProvider, motion primitives (Reveal/StaggerGroup/NumberTicker...),
  media primitives (SmartImage/VideoHero/BeforeAfterSlider)
- PART-03: vCard builder + download, WhatsApp message engine + buildWhatsAppLink,
  Floating Action Dock (FAB), Share/QR, analytics event bus, /api/vcard + /api/lead

## HARD RULES (todna nahi)
- Scratch se mat likho. docs/02-TECH-STACK-AND-REPOS.md se shadcn / Magic UI /
  Aceternity components copy karke adapt karo. Har copied file ke top pe source+license comment.
- Kahin bhi `if (role === '...')` mat likho. Sirf SectionRenderer/ModuleRegistry exception hain.
- Koi hardcoded naam/number/price/image URL nahi — sab src/data/roles/*.json se.
  Dummy WhatsApp number sab jagah: +919876543210
- Raw Tailwind colors (bg-blue-600) banned — sirf semantic tokens (bg-brand, text-fg-muted).
- Har WhatsApp link core/whatsapp ke through banega, component khud URL na banaye.
- `any` banned. Types zod se infer karo, duplicate interface mat likho.
- Component 200 lines se bada na ho.

## KAISE KAAM KARO
- Ek part poora karke uska "Definition of Done" checklist tick karo, TAB agla part shuru karo.
- Har part ke baad: `npx tsc --noEmit` + `npm run lint` + `npm run validate:config` clean ho.
- Har part ke baad us PART file ka "Handoff" section actual file paths se update karo,
  aur STATUS.md me ✅ mark karo.
- Har part ka alag commit: `feat(part-01): ...`, `feat(part-02): ...`, `feat(part-03): ...`

## VERIFY (teeno khatam hone par)
1. `npm run role doctor` → theme teal ho jaye
2. `npm run role photographer` → theme dark/gold ho jaye, zero flash
3. vCard download → contact file sahi bane (iOS fallback route bhi)
4. FAB dikhe: WhatsApp + Call + Directions, scroll pe hide/show
5. WhatsApp button → pre-filled message ke saath wa.me link khule
6. Dark/light toggle dono me sab readable

Sirf PART-01, 02, 03 ka scope karo. PART-04 se aage kuch mat banao.
Koi cheez clear na ho to poocho, guess mat karo.
```
