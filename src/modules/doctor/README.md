# Module: Doctor / Dentist

> 🟡 **Chunk 1 done** — slot booking, clinic status, symptom router, cost estimator.
> Chunk 2 ka scope PART-07 §9 ke Handoff table me hai.

## Widgets (preset ke `module:<name>` se resolve hote hain)
| Widget | Feature | File |
|--------|---------|------|
| `slotBooking` | D1 | `components/SlotBooking.tsx` |
| `symptomRouter` | D3 | `components/SymptomRouter.tsx` |
| `costEstimator` | D4 | `components/CostEstimator.tsx` |

`ClinicStatusBadge` (D2) widget nahi hai — SlotBooking ke heading slot me baithta hai.
Uska open/closed logic role-blind hai aur `@/lib/utils/business-hours` me rehta hai.

**Work brief:** [`docs/parts/PART-07-ROLE-DOCTOR.md`](../../../docs/parts/PART-07-ROLE-DOCTOR.md)
**Feature list:** [`docs/09-FEATURE-MATRIX.md`]( ../../../docs/09-FEATURE-MATRIX.md ) → Section D (D1-D15)
**Data shape:** [`docs/03-CONFIG-SCHEMA.md`](../../../docs/03-CONFIG-SCHEMA.md)

## Folder contract
```
components/   role-specific React components (client)
lib/          pure functions: math, filters, WhatsApp templates
data/         static lookup tables (not client content — that lives in src/data/roles/)
index.ts      RoleModule export -> widgets, waTemplates, schema
types.ts      z.infer types from the module schema
```

## Isolation rule
Yeh folder **kabhi** kisi dusre `src/modules/*` se import nahi karega.
Allowed imports: `@/core/*`, `@/components/*`, `@/lib/*`, `@/types`.
