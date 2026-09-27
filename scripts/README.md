# scripts/

| Script | Command | Does |
|--------|---------|------|
| validate-config.ts | `npm run validate:config` | zod-validates site.config + all 6 role JSONs |
| switch-role.ts | `npm run role doctor` | rewrites site.config.json role field |
| prefetch-media.ts | `npm run prefetch:media` | downloads remote images -> public/, adds w/h/blur |
| image-dimensions.ts | (called by prefetch) | extracts width/height into JSON |
| build-all-roles.ts | `npm run build:all-roles` | builds each role variant |
| lighthouse-all-roles.ts | — | runs Lighthouse on 6 roles, writes report |
| screenshot-all.ts | — | Playwright screenshots for the sales deck |

Sab scripts `tsx` se chalte hain.
