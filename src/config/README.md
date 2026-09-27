# src/config — The Role Switch

> Brief: [docs/parts/PART-01-CONFIG-ENGINE.md](../../docs/parts/PART-01-CONFIG-ENGINE.md)
> Schema: [docs/03-CONFIG-SCHEMA.md](../../docs/03-CONFIG-SCHEMA.md)

```
site.config.json    LEVEL 1 - { role, locale, theme, flags }   <- ONLY THIS to switch role
roles/*.preset.ts   LEVEL 2 - section order, modules, fab, seo type
theme/*.theme.ts    LEVEL 2 - color + font tokens
schema/*            zod schemas for every JSON in the app
index.ts            resolveConfig() - single entry point
```

Client content LEVEL 3 me hai: `src/data/roles/<role>.json`.
