# 07 — CONVENTIONS & RULES

---

## 1. The Five Hard Rules

1. **No role conditionals.** `if (role === 'doctor')` sirf `SectionRenderer` aur
   `ModuleRegistry` me allowed. Baaki jagah = PR rejected.
2. **No hardcoded content.** Koi naam, number, price, city, image URL code me nahi —
   sab `src/data/roles/*.json` se.
3. **No cross-module imports.** `modules/doctor` kabhi `modules/insurance` se import nahi karega.
4. **No scratch-building.** Pehle `02-TECH-STACK-AND-REPOS.md` check karo.
5. **Every lead goes through `core/whatsapp`.** Koi bhi component apna `wa.me` URL
   khud nahi banayega.

---

## 2. File & Folder Naming

| Thing | Convention | Example |
|-------|-----------|---------|
| React component file | `PascalCase.tsx` | `PropertyFilter.tsx` |
| Hook | `useCamelCase.ts` | `useVCardDownload.ts` |
| Util / lib | `kebab-case.ts` | `format-currency.ts` |
| Type file | `types.ts` or `*.types.ts` | `real-estate.types.ts` |
| Data JSON | `kebab-case.json` | `real-estate.json` |
| Zod schema | `*.schema.ts` | `doctor.schema.ts` |
| Folder | `kebab-case` | `fitness-tutor/` |
| CSS | `kebab-case.css` | `role-themes.css` |

Har module folder me `index.ts` barrel export hoga. Bahar se sirf barrel import karo.

---

## 3. Component Rules

```tsx
// ✅ Server Component by default. 'use client' tabhi jab zaroorat ho.
// ✅ Props interface named <Component>Props, exported.
// ✅ Data props me, fetching parent me.
// ✅ cn() for class merging. Inline style sirf CSS-var set karne ke liye.
// ❌ default export sirf page/layout/route files me. Baaki named exports.
```

Component size limit: **200 lines**. Usse bada → split karo.

---

## 4. Styling Rules
- Tailwind utility classes only. Arbitrary values (`w-[137px]`) avoid karo —
  spacing scale use karo.
- Colors **hamesha** semantic tokens se: `bg-brand`, `text-fg-muted`.
  Raw Tailwind palette (`bg-blue-600`) **banned** — theming tod deta hai.
- Responsive: mobile-first. `md:` = 768px, `lg:` = 1024px.
- Class order: prettier-plugin-tailwindcss handle karega, manually mat sort karo.

---

## 5. TypeScript
- `strict: true`. `any` banned — `unknown` + narrow karo.
- Data types **zod se infer** karo: `type Doctor = z.infer<typeof DoctorSchema>`.
  Duplicate interface mat likho.
- Public functions pe explicit return type.
- Enum ki jagah `as const` objects + union types.

---

## 6. Currency, Dates, Numbers (India)

```ts
formatINR(12500000)        // "₹1,25,00,000"
formatINRShort(12500000)   // "₹1.25 Cr"
formatINRShort(4500000)    // "₹45 L"
formatPhone('+919876543210') // "+91 98765 43210"
formatDate(d)              // "14 Feb 2026"
```
Sab `src/lib/utils/format.ts` me. Kahin aur `toLocaleString` mat likho.

---

## 7. WhatsApp Message Standard

Har message ka shape:
```
*<Intent Title>*

<field label>: <value>
<field label>: <value>

<optional summary line>

— via <business name> website
```

Rules:
- `encodeURIComponent` sirf final link banate waqt, `buildWhatsAppLink` ke andar.
- Max length 1800 chars (buffer for 2000 limit). Overflow → truncate + "…(details on call)".
- Phone number E.164 without `+` in `wa.me` URL: `wa.me/919876543210`.
- Har message ke end me source attribution line.
- Emoji: max 2 per message, header aur CTA pe. Overuse cheap lagta hai.

---

## 8. Analytics Events (fixed names)

```
page_view · section_view · cta_click · fab_open · fab_action
vcard_download · qr_open · share_click
lead_start · lead_submit · lead_whatsapp_open
tool_use (props: tool, role)
filter_apply · gallery_open · pass_generate · install_prompt
```
`src/core/analytics/events.ts` me `as const` list. String literal kahin aur mat likho.

---

## 9. Git

```
feat(part-05): add property filter with URL state
fix(core): vcard download on iOS Safari
chore(deps): bump motion to 11.15
docs(part-09): add availability data contract
refactor(sections): extract StatsGrid
perf(media): convert hero video to webm
```

- Branch: `feat/part-XX-slug`
- Har PR me part MD ka DoD checklist paste + tick.
- Direct `main` push nahi.

---

## 10. PR Review Checklist

- [ ] Koi role conditional nahi (except allowed files)
- [ ] Koi hardcoded string/number/URL nahi
- [ ] Koi cross-module import nahi
- [ ] Raw Tailwind color classes nahi
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run lint` clean
- [ ] `npm run validate:config` pass
- [ ] Mobile 375px pe test kiya
- [ ] Dark mode me test kiya
- [ ] `prefers-reduced-motion` honor hota hai
- [ ] Keyboard navigation kaam karti hai
- [ ] Naye interactive elements ke liye analytics event add kiya
- [ ] Copied code ke upar source + license comment hai

---

## 11. Comment Policy
- **Why** likho, **what** nahi. Code khud batata hai kya ho raha hai.
- Business logic (tax slabs, EMI formula, premium rates) pe source link comment mandatory.
- `TODO(part-XX):` format use karo taaki grep kar sako.

---

## 12. Definition of "Done" (universal)
Ek part done tabhi hai jab:
1. Uske MD ka DoD checklist 100% tick hai
2. `typecheck` + `lint` + `validate:config` pass
3. Mobile + desktop, light + dark — chaaron me screenshot liya
4. Part MD ke "Handoff" section me actual exports/paths update kiye
