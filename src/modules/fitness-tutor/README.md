# Module: Gym Trainer / Tutor

> ⛔ **Abhi code mat likho.** Pehle part brief padho.

**Work brief:** [`docs/parts/PART-10-ROLE-FITNESS-TUTOR.md`](../../../docs/parts/PART-10-ROLE-FITNESS-TUTOR.md)
**Feature list:** [`docs/09-FEATURE-MATRIX.md`]( ../../../docs/09-FEATURE-MATRIX.md ) → Section G (G1-G16)
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
