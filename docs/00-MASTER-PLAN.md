# 00 — MASTER PLAN

## 1. Product One-Liner
Ek **"Universal Digital Business Card + Lead Generation Web App"** — single codebase,
jisme JSON ka `role` field badalte hi poori UI, colors, copy, sections, calculators
aur CTAs us profession ke liye transform ho jate hain.

## 2. Target Buyer (India)
Solo professionals & small firms jo ₹15,000–25,000 ek "premium digital presence" ke liye
dete hain: property dealers, LIC/health insurance advisors, clinics & dental labs,
CA firms, wedding photographers, gym trainers & private tutors.

## 3. Business Model Context (kyun yeh architecture)
- Ek baar build → 6 alag verticals me bech sakte ho.
- Naya client = naya JSON file + naye photos. **Zero code change.**
- Naya vertical = naya `src/modules/<role>/` folder. Baaki app untouched.

## 4. Non-Negotiable Core (har role me hona hi chahiye)

| # | Feature | Detail |
|---|---------|--------|
| C1 | 1-Click vCard Download | `.vcf` file, phone me contact turant save |
| C2 | Persistent FAB | WhatsApp + Call + Google Maps directions, hamesha screen par |
| C3 | Dynamic WhatsApp Lead Routing | Har form/button `wa.me` par pre-filled contextual message bhejta hai |
| C4 | Rich Dummy Data | Believable Hindi/English copy, Unsplash/Pexels media, dummy WhatsApp number |
| C5 | Role-Driven UI | Colors, fonts, section order, icons — sab JSON se |

## 5. Six Roles & Their Minimum Module

| Role key | Profession | Minimum specialised module |
|----------|-----------|---------------------------|
| `real-estate` | Real Estate Agent | Smart Property Filter (Budget/BHK) + pre-filled WA inquiry |
| `insurance` | Insurance Agent | Quick Premium Estimator (Age/Cover slider) |
| `doctor` | Doctor / Dentist | Smart Slot Booking (Today/Tomorrow × Morning/Evening) → WA |
| `ca-tax` | CA / Tax Consultant | Tax Document Checklist (Salaried / Business) |
| `photographer` | Event/Wedding Photographer | Masonry Gallery + "Check Date Availability" |
| `fitness-tutor` | Gym Trainer / Tutor | Virtual 1-Day VIP Pass Generator |

> Minimum = floor, ceiling nahi. Premium upgrades `09-FEATURE-MATRIX.md` me listed hain
> aur har role ke PART file me detail se likhe hain.

## 6. What "₹20,000 Premium" Means Here (measurable)
- Lighthouse mobile: Performance ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO 100
- LCP < 2.0s on simulated 4G, CLS < 0.05, INP < 200ms
- Har interaction par micro-feedback (spring animation, toast, state change)
- Zero "lorem ipsum" — har line believable Indian business copy
- Zero broken/grey placeholder image — sab curated Unsplash/Pexels
- Full PWA: install prompt, offline fallback page, maskable app icon
- Dark + Light mode dono polished (dono me contrast pass)
- Har lead ka WhatsApp message structured & professional (emoji + line breaks + summary)

## 7. Out Of Scope (Phase 1)
- Real database / auth / payments
- Real admin CMS (Phase 2 — Sanity/Payload)
- Real SMS/Email OTP
- Actual calendar sync (sirf `.ics` download + simulated availability JSON)
- Real property/insurance API integration

## 8. Phase Map
- **Phase 1 (yeh plan):** Static + client-side, JSON-driven, WhatsApp-only backend.
- **Phase 2:** Headless CMS + multi-tenant subdomains + real lead DB + dashboard.
- **Phase 3:** Self-serve builder + subscription billing.

## 9. Success Criteria (Phase 1 done kab mana jayega)
1. `site.config.json` me `role` badalne par 6 alag websites — bina kisi code change ke.
2. Har role ka specialized module working + WhatsApp par correct pre-filled message.
3. vCard 6/6 roles me download hota hai aur Android + iOS dono me contact open karta hai.
4. Mobile pe FAB kabhi content ya footer CTA block nahi karta.
5. Lighthouse targets (Sec. 6) 6/6 roles pe pass.
6. `npm run validate:config` — saare 6 role JSONs zod schema pass karte hain.

## 10. Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| Role-specific `if` conditions code me ghus jayen | Lint rule + PR review checklist (`07-CONVENTIONS.md`) |
| Unsplash hotlink rate-limit / dead URLs | `scripts/prefetch-media.ts` se local `public/images/roles/` me download |
| Bundle bloat (6 modules ek saath) | Har module `next/dynamic` se lazy, role ke hisaab se hi load |
| WhatsApp URL length limit (~2000 chars) | Message builder me truncate + summary strategy |
| iOS Safari vCard download quirks | Server route `/api/vcard` fallback with proper Content-Disposition |
