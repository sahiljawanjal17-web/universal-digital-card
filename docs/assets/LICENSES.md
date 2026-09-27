# THIRD-PARTY LICENSES & ATTRIBUTION

> PART-00 se onwards, har copied component / asset yahan list karo.
> Ye file commercial delivery ke liye zaroori hai.

## Copied Components

| Component | Source URL | License | Copied in |
|-----------|-----------|---------|-----------|
| _(fill during PART-00)_ | | | |

## NPM Dependencies (non-MIT flagged)

| Package | License | Note |
|---------|---------|------|
| `@vercel/og` / satori | MPL-2.0 | OK for use; no source modification planned |
| `tremor` (if used) | Apache-2.0 | OK |

**Rule:** koi GPL / AGPL dependency nahi.

## Media Credits

Per-role credits `public/images/roles/<role>/CREDITS.md` me generate hote hain
(`npm run prefetch:media`).

| Source | License | Attribution required |
|--------|---------|---------------------|
| Unsplash | Unsplash License | Not required, but we credit |
| Pexels | Pexels License | Not required, but we credit |
| Coverr | Coverr License | Not required |
| Mixkit | Mixkit License | Not required (no resale of asset itself) |
| pravatar.cc | — | Demo avatars only, replace for real clients |

## Fonts

| Font | License |
|------|---------|
| Inter, Plus Jakarta Sans, Fraunces, Instrument Serif, Bricolage Grotesque, Inter Tight, Noto Sans Devanagari | SIL Open Font License 1.1 |

## Copied Components (PART-00)

| Path | Source | License |
|------|--------|---------|
| `src/components/ui/*.tsx` (28 files) | shadcn/ui `base-nova` registry — ui.shadcn.com | MIT |
| `src/components/motion/*.tsx` (9 files) | Magic UI — magicui.design | MIT |

**Adaptations applied to every copied file:**
1. Registry alias imports rewritten: `"cn"` → `@/lib/utils`, `@/registry/base-nova/ui/*` → `@/components/ui/*`.
2. shadcn's build-time `<IconPlaceholder lucide="X" />` replaced with real `lucide-react` icons.
3. Source + license header comment added at the top of each file.

**Note:** the current shadcn default style (`base-nova`) is built on **Base UI**
(`@base-ui/react`), not Radix. Functionally equivalent and still official shadcn/ui.
