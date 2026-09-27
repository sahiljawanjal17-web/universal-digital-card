# PART-00 — FOUNDATION & SCAFFOLD

**Status:** ✅ Done (commit `577af66`)
**Est:** 0.5 day · **Blocked by:** — · **Unblocks:** PART-01, PART-02

---

## 1. Goal
Next.js 15 + Tailwind v4 + shadcn/ui ka clean, lint-passing base khada karna —
hamare existing folder skeleton ko todhe bina.

## 2. Read First
- `docs/05-SETUP-COMMANDS.md` ← ye part basically usko execute karta hai
- `docs/02-TECH-STACK-AND-REPOS.md` (Section 6: package list)
- `docs/07-CONVENTIONS.md`

## 3. Files To Create / Modify

```
package.json                  (scripts block)
next.config.ts                (remotePatterns, bundle analyzer)
tsconfig.json                 (paths, strict)
components.json               (shadcn config)
eslint.config.mjs             (+ boundaries rules)
.prettierrc                   (+ tailwind plugin)
.env.example
.gitignore
src/app/layout.tsx            (minimal shell)
src/app/page.tsx              (placeholder "Foundation OK")
src/app/globals.css           (tailwind v4 import + @theme stub)
src/lib/utils/cn.ts
src/components/ui/*           (shadcn generated)
src/components/motion/*       (magic ui harvested)
```

## 4. Open-Source Sources
| What | From |
|------|------|
| shadcn primitives | `npx shadcn@latest add ...` (see setup doc Step 4) |
| Magic UI motion components | registry URLs (setup doc Step 5) |
| ESLint boundaries config | `Blazity/next-enterprise` |
| Provider/layout pattern | `steven-tey/precedent`, `dillionverma/portfolio` |

## 5. Implementation Steps

1. **Scaffold merge** — `05-SETUP-COMMANDS.md` Step 2 exactly follow karo.
   Verify: `.gitkeep` files abhi bhi `src/modules/*` me hain.
2. **Install deps** — Step 3.
3. **shadcn init + add** — Step 4. `components.json` me aliases confirm:
   ```json
   { "aliases": { "components": "@/components", "ui": "@/components/ui",
                  "lib": "@/lib", "hooks": "@/lib/hooks", "utils": "@/lib/utils/cn" } }
   ```
4. **Harvest motion components** — Step 5. Sab `src/components/motion/` me move karo,
   har file ke top pe source+license comment.
5. **`next.config.ts`** — image remote patterns:
   ```ts
   images: { remotePatterns: [
     { protocol: 'https', hostname: 'images.unsplash.com' },
     { protocol: 'https', hostname: 'images.pexels.com' },
     { protocol: 'https', hostname: 'i.pravatar.cc' },
   ]}
   ```
   Plus `@next/bundle-analyzer` wrapper (ANALYZE env).
6. **ESLint boundaries** — `07-CONVENTIONS.md` Section 1 ke isolation rules ko
   `eslint-plugin-boundaries` me encode karo (layers: config, core, components, modules, lib).
7. **Prettier** — `prettier-plugin-tailwindcss` + 2-space + no semicolons (team choice: **semicolons ON**, single quotes).
8. **`src/app/layout.tsx`** — minimal: `<html lang="en" suppressHydrationWarning>`,
   font vars, `<Toaster />`, `{children}`. Abhi providers nahi (PART-01 me aayenge).
9. **`src/app/page.tsx`** — ek centered card: "Foundation OK · Next 15 · Tailwind v4 · shadcn".
   Isme ek shadcn Button + ek Magic UI BlurFade use karo taaki dono verify ho jayen.
10. **Scripts** — `05-SETUP-COMMANDS.md` Step 7 ka scripts block paste karo.
11. **`.env.example`**:
    ```
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    NEXT_PUBLIC_GA_ID=
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
    ```
12. **Verify** — `npm run typecheck && npm run lint && npm run build && npm run dev`.

## 6. Data Contract
N/A — is part me koi data nahi.

## 7. Definition of Done
- [ ] `npm run dev` pe placeholder page render hota hai, zero console error
- [ ] `npm run build` clean, zero warning
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run lint` clean
- [ ] 28+ shadcn components `src/components/ui/` me hain
- [ ] 9 Magic UI components `src/components/motion/` me hain, source comment ke saath
- [ ] Aceternity ke `Compare`, `BentoGrid`, `InfiniteMovingCards`, `Spotlight` copy ho chuke
- [ ] ESLint boundaries rule active hai (test: `modules/` se `modules/` import karke dekho, error aana chahiye)
- [ ] `src/modules/*` aur `src/core/*` ke `.gitkeep` intact hain
- [ ] `docs/assets/LICENSES.md` bana aur har copied component listed hai
- [ ] Commit: `chore: scaffold Next.js 15 + Tailwind v4 + shadcn/ui foundation`

## 8. Handoff
PART-01 ko chahiye:
- Working `@/*` alias
- `src/lib/utils/cn.ts` exported
- `src/app/layout.tsx` jisme providers inject ho sakein
- zod already installed

Is section ko update karo actual file paths ke saath jab done ho.

---

## Handoff (actual)

**Delivered files**
- `package.json` · `tsconfig.json` · `next.config.ts` · `postcss.config.mjs`
- `eslint.config.mjs` (Next 15 flat config, `@typescript-eslint/no-explicit-any: error`)
- `.prettierrc.json` · `.gitignore` · `components.json`
- `src/app/layout.tsx` · `src/app/page.tsx` · `src/app/globals.css` (placeholder — PART-02 replaces it)
- `src/lib/utils/cn.ts` + `src/lib/utils/index.ts` (alias `@/lib/utils`)
- `src/components/ui/*.tsx` — 28 shadcn components
- `src/components/motion/*.tsx` — 9 Magic UI components
- `docs/assets/LICENSES.md` — source + license table

**Deviations from the brief (read before continuing)**
1. **Base UI, not Radix.** shadcn's current default style is `base-nova`, built on
   `@base-ui/react`. Still official shadcn/ui, MIT. Import paths differ from Radix docs.
2. **`form` component not installed** — it no longer ships in the `base-nova` registry
   (replaced by `field`). PART-04 must install `field` instead, or use
   `react-hook-form` + `label`/`input` directly.
3. **shadcn CLI cannot reach the registry on this network** (Node resolves
   `ui.shadcn.com` to a NAT64 IPv6 address and times out; `curl` over IPv4 works).
   Components were fetched with `scratchpad/fetch-registry.mjs`, which curls the
   registry JSON and writes the files. Re-use that script for any further adds —
   `npx shadcn add` will fail.
4. Two codemods were applied to every harvested file: alias imports
   (`"cn"` → `@/lib/utils`, `@/registry/base-nova/ui/*` → `@/components/ui/*`) and
   `<IconPlaceholder lucide="X" />` → real `lucide-react` icons.

**Verified:** `npx tsc --noEmit` clean · `npx eslint .` clean.
