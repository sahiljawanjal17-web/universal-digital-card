# 05 — SETUP COMMANDS (PART-00 ke liye)

> ⚠️ **Yeh commands abhi RUN NAHI karni hain.** Yeh PART-00 ka script hai.
> Owner ke "PART-00 start karo" bolne ke baad hi chalana.

Shell: **PowerShell 7 (Windows 11)**. Working dir: `C:\Users\Admin\ALL_IN_ONE`

---

## Step 0 — Prerequisites check

```powershell
node -v        # >= 20.11 chahiye (22 LTS recommended)
npm -v         # >= 10
git --version
```

Agar Node purana hai:
```powershell
winget install OpenJS.NodeJS.LTS
```

---

## Step 1 — Git init

```powershell
git init
git branch -M main
```

---

## Step 2 — Next.js scaffold (merge strategy)

Hamare paas already `docs/` + `src/` skeleton hai, isliye `create-next-app`
seedha root me nahi chalega. Temp folder me scaffold karke merge karenge.

```powershell
npx create-next-app@latest _scaffold `
  --typescript --tailwind --eslint --app --src-dir `
  --import-alias "@/*" --use-npm --turbopack --no-git

# merge without overwriting our skeleton (.gitkeep files safe rehte hain)
robocopy _scaffold . /E /XC /XN /XO
Remove-Item _scaffold -Recurse -Force
```

> `robocopy` exit code 1–7 = success. 8+ = real error. PowerShell me `$LASTEXITCODE` check karo.

---

## Step 3 — Install dependencies

```powershell
# UI + motion
npm i class-variance-authority clsx tailwind-merge tw-animate-css `
      lucide-react @tabler/icons-react motion next-themes sonner

# forms + validation
npm i react-hook-form zod @hookform/resolvers

# state + utils
npm i nuqs date-fns usehooks-ts

# feature-specific
npm i embla-carousel-react recharts react-day-picker `
      react-photo-album yet-another-react-lightbox `
      qrcode.react html-to-image

# pwa + analytics
npm i @serwist/next serwist @vercel/analytics @vercel/speed-insights

# dev
npm i -D prettier prettier-plugin-tailwindcss @next/bundle-analyzer `
         eslint-plugin-boundaries tsx cross-env
```

---

## Step 4 — shadcn/ui init + components

```powershell
npx shadcn@latest init -d

npx shadcn@latest add button card badge avatar separator skeleton `
  input textarea label form select checkbox radio-group switch `
  slider toggle toggle-group tabs accordion dialog drawer sheet `
  popover tooltip progress calendar carousel scroll-area sonner `
  alert alert-dialog table chart command
```

---

## Step 5 — Harvest animation components

Magic UI (MIT) — ye sab `src/components/motion/` me jayenge:
```powershell
npx shadcn@latest add "https://magicui.design/r/blur-fade.json"
npx shadcn@latest add "https://magicui.design/r/number-ticker.json"
npx shadcn@latest add "https://magicui.design/r/marquee.json"
npx shadcn@latest add "https://magicui.design/r/border-beam.json"
npx shadcn@latest add "https://magicui.design/r/shimmer-button.json"
npx shadcn@latest add "https://magicui.design/r/dock.json"
npx shadcn@latest add "https://magicui.design/r/animated-gradient-text.json"
npx shadcn@latest add "https://magicui.design/r/meteors.json"
npx shadcn@latest add "https://magicui.design/r/confetti.json"
```

Aceternity UI components manually copy karo (site pe "Copy code" button):
`Spotlight`, `Bento Grid`, `Infinite Moving Cards`, `Compare`, `3D Card`.
→ paste into `src/components/motion/` aur `src/components/media/`.

> Har copied file ke top pe comment daalo:
> `// Source: https://ui.aceternity.com/components/compare — MIT`

---

## Step 6 — Folder + placeholder verification

```powershell
npm run lint
npx tsc --noEmit
npm run dev     # http://localhost:3000
```

---

## Step 7 — package.json scripts (add karo)

```jsonc
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "validate:config": "tsx scripts/validate-config.ts",
    "role": "tsx scripts/switch-role.ts",
    "prefetch:media": "tsx scripts/prefetch-media.ts",
    "analyze": "cross-env ANALYZE=true next build",
    "build:all-roles": "tsx scripts/build-all-roles.ts"
  }
}
```

---

## Step 8 — Quick role switch (daily driver)

```powershell
npm run role doctor
npm run role real-estate
npm run role photographer
```
`scripts/switch-role.ts` bas `src/config/site.config.json` ka `role` field
rewrite karta hai + zod validate karta hai.

---

## Step 9 — First commit

```powershell
git add -A
git commit -m "chore: scaffold Next.js 15 + Tailwind v4 + shadcn/ui foundation"
```

---

## Step 10 — (Optional) Deploy preview

```powershell
npm i -g vercel
vercel link
vercel --prod=false
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `robocopy` exit code 8+ | `_scaffold` manually copy karo, `src/app` merge dekh lo |
| shadcn init `components.json` path galat | `aliases.components = "@/components"`, `aliases.ui = "@/components/ui"` |
| Tailwind v4 me `@apply` fail | v4 me `@utility` use karo ya plain CSS |
| `motion` import error | v11+ me `import { motion } from "motion/react"` (not `framer-motion`) |
| Unsplash images block | `next.config.ts` → `images.remotePatterns` me `images.unsplash.com`, `images.pexels.com` add karo |
