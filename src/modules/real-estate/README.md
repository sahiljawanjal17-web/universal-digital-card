# Module: Real Estate Agent

> ⛔ **Abhi code mat likho.** Pehle part brief padho.

**Work brief:** [`docs/parts/PART-05-ROLE-REAL-ESTATE.md`](../../../docs/parts/PART-05-ROLE-REAL-ESTATE.md)
**Feature list:** [`docs/09-FEATURE-MATRIX.md`]( ../../../docs/09-FEATURE-MATRIX.md ) → Section B (R1-R17)
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
