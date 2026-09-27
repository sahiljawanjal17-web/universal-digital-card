# PART-01 — CONFIG ENGINE

**Status:** ✅ Done (commit `2779b7b`)
**Est:** 1 day · **Blocked by:** PART-00 · **Unblocks:** PART-03, PART-11

---

## 1. Goal
Woh engine banana jo `site.config.json` ka ek `role` field padhkar poore app ko
resolved, type-safe config de — aur galat JSON pe build hi fail kar de.

## 2. Read First
- `docs/03-CONFIG-SCHEMA.md` ← **poora padho, yahi is part ka spec hai**
- `docs/01-ARCHITECTURE.md` Sections 1, 5, 7

## 3. Files To Create

```
src/config/
├─ site.config.json
├─ index.ts                       # resolveConfig(), getRole(), getRoleData()
├─ roles/
│  ├─ real-estate.preset.ts
│  ├─ insurance.preset.ts
│  ├─ doctor.preset.ts
│  ├─ ca-tax.preset.ts
│  ├─ photographer.preset.ts
│  ├─ fitness-tutor.preset.ts
│  └─ index.ts                    # presets map
└─ schema/
   ├─ site.schema.ts
   ├─ preset.schema.ts
   ├─ common.schema.ts
   └─ modules/<role>.schema.ts    x6

src/types/
├─ role.ts                        # RoleKey union, RolePreset, RoleModule
├─ config.ts                      # ResolvedConfig
└─ index.ts

src/modules/registry.ts           # lazy module map (stubs abhi)
src/components/providers/RoleProvider.tsx
src/lib/hooks/useRole.ts
scripts/validate-config.ts
scripts/switch-role.ts
```

## 4. Implementation Steps

1. **`RoleKey` union** — `src/types/role.ts`:
   ```ts
   export const ROLE_KEYS = ['real-estate','insurance','doctor','ca-tax','photographer','fitness-tutor'] as const;
   export type RoleKey = (typeof ROLE_KEYS)[number];
   ```
2. **Zod schemas** — `03-CONFIG-SCHEMA.md` ke shapes ko literally encode karo.
   - `common.schema.ts`: profile, contact, trust, services, gallery, testimonials, faq, cta, leadForm, seo
   - `modules/*.schema.ts`: har role ka `module` block
   - Final per-role data schema = `CommonSchema.extend({ module: <RoleModuleSchema> })`
   - **Types zod se infer karo**, alag interface mat likho.
3. **`site.schema.ts`** — Level 1 shape (role, locale, theme, flags, debug) + defaults.
4. **`preset.schema.ts`** — Level 2 shape (sections array, modules, fab, vcard, seo.schemaType).
5. **6 preset files** — `03-CONFIG-SCHEMA.md` ka `doctor.preset.ts` example follow karke
   baaki 5 bhi likho. Section arrays `09-FEATURE-MATRIX.md` se derive karo.
6. **`resolveConfig()`** — `src/config/index.ts`:
   ```ts
   export function resolveConfig(overrideRole?: RoleKey): ResolvedConfig {
     const site   = SiteSchema.parse(siteConfigJson);
     const role   = overrideRole ?? site.role;
     const preset = presets[role];
     const data   = dataSchemas[role].parse(roleDataJson[role]);
     return { site, role, preset, data, theme: themes[preset.themeId] };
   }
   ```
   - Server par cached (`React.cache`).
   - Dev me parse error → readable message with JSON path.
7. **`RoleProvider`** — client context jo resolved config ko subtree me deta hai.
   Server component se serialized props aate hain.
   `useRole()` hook → `{ role, preset, data, theme }`.
8. **`src/modules/registry.ts`** — lazy map (abhi sab stub return karenge):
   ```ts
   export const moduleRegistry: Record<RoleKey, () => Promise<{ module: RoleModule }>> = {
     'doctor': () => import('@/modules/doctor'),
     // ...
   };
   ```
9. **`scripts/validate-config.ts`** — saare 6 role JSONs + site.config parse karo,
   fail pe `process.exit(1)` + pretty error (zod `prettifyError` ya `zod-validation-error`).
10. **`scripts/switch-role.ts`** — `npm run role doctor` → site.config.json rewrite + validate.
11. **Placeholder data** — 6 minimal `src/data/roles/<role>.json` banao jo schema pass karein
    (rich data PART-11 me aayega). Har ek me dummy WhatsApp number `+919876543210`.
12. **Wire up** — `src/app/page.tsx` me role name + profile.name render karo,
    `npm run role insurance` chalao, page badalna chahiye.

## 5. Error UX (dev)
```
❌ Config error in src/data/roles/doctor.json
   at module.slots.periods[1].range
   Expected string, received undefined
```

## 6. Definition of Done
- [x] `resolveConfig()` 6/6 roles ke liye type-safe object return karta hai
- [x] Galat JSON par `npm run validate:config` exact path ke saath fail karta hai
- [x] `npm run role <key>` 6/6 roles pe kaam karta hai (switch ke baad auto-validate bhi)
- [x] `useRole()` client component me kaam karta hai (`RoleSummary.tsx`)
- [x] Zero `any` config layer me
- [x] `ROLE_KEYS` hi single source of truth hai
- [x] "Naya role kaise add karein" neeche Section 8 me documented hai
- [x] `npm run typecheck` + `lint` + `validate:config` + `next build` clean
- [x] Commit: `feat(part-01): zod schemas, presets, resolveConfig and role data`

## 7. Handoff
PART-02 ko chahiye: `preset.themeId` (theme mapping ke liye).
PART-03 ko chahiye: `data.contact` (WhatsApp/phone/address), `preset.fab`, `preset.vcard`.
PART-04 ko chahiye: `preset.sections` array + `data.*` content blocks.

## 8. "Naya role kaise add karein" (future reference)
1. `ROLE_KEYS` me key add karo (`src/types/role.ts`)
2. `src/config/schema/modules/<role>.schema.ts` banao
3. `src/config/schema/index.ts` me `<Role>DataSchema` + `dataSchemas` entry add karo
4. `src/config/roles/<role>.preset.ts` + `src/config/roles/index.ts` entry
5. `src/config/theme/<role>.theme.ts` + `role-themes.css` block (PART-02)
6. `src/modules/<role>/` folder + `src/modules/registry.ts` entry
7. `src/data/roles/<role>.json` + `src/data/roles/index.ts` entry
8. `npm run validate:config`

---

## Handoff (actual — PART-01 COMPLETE)

### Level 1 — the switch
| File | What it is |
|------|------------|
| `src/config/site.config.json` | `role`, `locale`, `secondaryLocale`, `theme{mode,allowToggle,override}`, 9 `flags`, `debug` |
| `src/config/schema/site.schema.ts` | `SiteSchema`, `type SiteConfig`. Sirf `role` required, baaki sab defaulted |

### Level 2 — structure
| File | Exports |
|------|---------|
| `src/config/schema/preset.schema.ts` | `PresetSchema`, `SectionKeySchema`, `type RolePreset` |
| `src/lib/constants/sections.ts` | `SECTION_KEYS` (16 universal sections), `SectionKey`, `PresetSectionKey`. Role-specific sections `module:<name>` likhe jaate hain |
| `src/config/roles/<role>.preset.ts` x6 | `realEstatePreset`, `insurancePreset`, `doctorPreset`, `caTaxPreset`, `photographerPreset`, `fitnessTutorPreset` |
| `src/config/roles/index.ts` | `presets` (Record<RoleKey, RolePreset>), `getPreset(role)` |

themeIds jo PART-02 ko banane hain: `estate-indigo`, `trust-blue`, `clinical-teal`,
`ledger-emerald`, `noir-gold`, `energy-amber`.

### Level 3 — content
| File | Exports |
|------|---------|
| `src/config/schema/common.schema.ts` | `CommonDataSchema` + `PhoneSchema`, `TimeSchema`, `MediaRefSchema`, `IntentSchema`, `ProfileSchema`, `ContactSchema`, `AddressSchema`, `TrustSchema`, `ServiceSchema`, `GalleryItemSchema`, `TestimonialSchema`, `FaqSchema`, `CtaActionSchema`, `LeadFormSchema`, `SeoSchema` |
| `src/config/schema/modules/<role>.schema.ts` x6 | `RealEstateModuleSchema`, `InsuranceModuleSchema`, `DoctorModuleSchema`, `CaTaxModuleSchema`, `PhotographerModuleSchema`, `FitnessTutorModuleSchema` |
| `src/config/schema/index.ts` | `dataSchemas` (Record<RoleKey, schema>), `type RoleData`, per-role `<Role>DataSchema`, re-exports site/preset/common |
| `src/data/roles/<role>.json` x6 | Placeholder content. WhatsApp+phone sab jagah `+919876543210`. Rich data PART-11 me |
| `src/data/roles/index.ts` | `rawRoleData` — **sirf `src/config/index.ts` ise padhe** |
| `src/lib/constants/intents.ts` | `INTENT_KEYS` (17 intents), `type IntentKey`. PART-03 ka `core/whatsapp` isi se re-export karega |
| `src/lib/constants/dummy.ts` | `DUMMY_WHATSAPP`, `DUMMY_PHONE`, `DUMMY_EMAIL`, `DUMMY_MAPS` |

### Engine
| File | Exports |
|------|---------|
| `src/config/index.ts` | `resolveConfig(overrideRole?)` (React `cache`), `getRole()`, `getRoleData()`, re-exports `presets`/`getPreset`/`ConfigError` |
| `src/config/errors.ts` | `ConfigError`, `formatConfigError()`, `issuePath()` |
| `src/types/config.ts` | `ResolvedConfig<K extends RoleKey>` — poori tarah zod-inferred. `RoleThemeRef` PART-02 ke real theme object se replace hoga |
| `scripts/validate-config.ts` | `npm run validate:config` — site + 6 presets + 6 data files, fail pe exact path + exit 1 |
| `scripts/switch-role.ts` | `npm run role <key>` — switch ke baad validator khud chalta hai |
| `src/app/page.tsx` | `resolveConfig()` -> `<RoleProvider>` -> name/tagline + `<RoleSummary/>` |
| `src/components/shared/RoleSummary.tsx` | client component, `useRole()` proof. **PART-04 me delete karna** |

### Verified
- `npx tsc --noEmit` clean · `npx eslint .` clean · `npm run build` clean
- `npm run validate:config` -> 13/13 ok
- `doctor.json` se `module.slots.periods[1].range` hataake test kiya:
  `at module.slots.periods[1].range / Invalid input: expected string, received undefined`, exit 1
- `npm run role insurance` -> `npm run role doctor` dono pass

### PART-02 ke liye known gap
`ResolvedConfig.theme` abhi `{ id: string }` hai (`RoleThemeRef`). PART-02 me
`src/config/theme/index.ts` banake `resolveConfig()` me `theme: themes[preset.themeId]`
karo aur `RoleThemeRef` ko hata do — dono ek saath mat rakhna.
