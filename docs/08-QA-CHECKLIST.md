# 08 — QA CHECKLIST (ship gate)

Har role ke liye alag se ye checklist chalani hai. 6 roles × ye list.

---

## 1. Config Switch Test
- [ ] `npm run role <role>` → site fully transforms, zero console error
- [ ] `<html data-role>` correct set hai
- [ ] Sirf us role ke module chunks network tab me load ho rahe hain
- [ ] `npm run validate:config` pass

## 2. Core Features
- [ ] vCard download → Android Chrome me contact open hota hai
- [ ] vCard download → iOS Safari me contact open hota hai
- [ ] vCard me: name, phone, WhatsApp, email, org, title, address, website, photo
- [ ] FAB visible on load, scroll-down pe hide, scroll-up pe show
- [ ] FAB footer CTA ko overlap nahi karta
- [ ] FAB safe-area (iPhone notch/home-bar) respect karta hai
- [ ] WhatsApp button → correct number + correct pre-filled message
- [ ] Call button → `tel:` dialer open
- [ ] Directions → Google Maps correct coords

## 3. WhatsApp Lead Routing (har intent test karo)
- [ ] Har form submit pe message formatted + readable (WhatsApp me paste karke dekho)
- [ ] Message me user ke bhare hue saare fields hain
- [ ] Message 1800 chars se kam
- [ ] Emoji render ho rahe hain, `%` garbage nahi
- [ ] Line breaks preserve ho rahe hain
- [ ] Desktop pe `web.whatsapp.com`, mobile pe app open hota hai
- [ ] `analytics.track('lead_submit')` fire hota hai

## 4. Role Module
- [ ] Minimum feature (owner-specified) 100% working
- [ ] Har premium feature working ya explicitly deferred+documented
- [ ] Empty state handled (filter me kuch na mile to)
- [ ] Loading skeleton dikhta hai lazy module load pe
- [ ] Calculator outputs sane hain (edge: min, max, zero, negative)
- [ ] Sab calculated numbers pe disclaimer line hai

## 5. Content
- [ ] Zero "lorem ipsum" / "Your Name Here" / "xxx"
- [ ] Har image load hoti hai (404 nahi)
- [ ] Har image ka meaningful `alt`
- [ ] Sab ₹ amounts Indian format me (`₹1,25,00,000`)
- [ ] Phone numbers `+91 98765 43210` format
- [ ] Dates `14 Feb 2026` format
- [ ] Spelling/grammar pass (EN + HI dono)

## 6. Responsive
- [ ] 320px (small Android) — no horizontal scroll
- [ ] 375px (iPhone SE)
- [ ] 390px (iPhone 14)
- [ ] 768px (tablet)
- [ ] 1024px, 1440px, 1920px
- [ ] Landscape mobile
- [ ] Text kahin truncate/overflow nahi ho raha

## 7. Theme
- [ ] Light mode — sab readable, contrast pass
- [ ] Dark mode — sab readable, contrast pass
- [ ] Theme toggle pe koi flash (FOUC) nahi
- [ ] System preference respect hoti hai
- [ ] Images/logos dono themes me theek dikhte hain

## 8. Motion
- [ ] Scroll reveals smooth, janky nahi
- [ ] `prefers-reduced-motion: reduce` → animations off
- [ ] Koi layout shift animation ki wajah se nahi (CLS)
- [ ] Video autoplay muted + playsInline, mobile pe chalti hai

## 9. Accessibility
- [ ] Tab order logical
- [ ] Focus ring har interactive element pe visible
- [ ] Modal/drawer: focus trap + Esc + return focus
- [ ] axe DevTools — 0 critical, 0 serious
- [ ] Screen reader se hero → CTA → form flow samajh aata hai
- [ ] Form errors announce hote hain
- [ ] Touch targets ≥ 44×44px

## 10. Performance (Lighthouse mobile, throttled)
- [ ] Performance ≥ 90
- [ ] Accessibility ≥ 95
- [ ] Best Practices ≥ 95
- [ ] SEO = 100
- [ ] LCP < 2.0s
- [ ] CLS < 0.05
- [ ] INP < 200ms
- [ ] Initial JS < 200KB gzipped
- [ ] Koi image > 300KB nahi
- [ ] Koi video > 3MB nahi

## 11. SEO
- [ ] Unique `<title>` + `<meta description>` per role
- [ ] OG image render hota hai (WhatsApp pe link bhej ke test karo)
- [ ] JSON-LD valid (Google Rich Results Test)
- [ ] `robots.txt` + `sitemap.xml`
- [ ] Canonical URL set
- [ ] `lang` attribute correct

## 12. PWA
- [ ] Manifest valid, role-specific name/icon/theme_color
- [ ] Install prompt aata hai (Android Chrome)
- [ ] Offline pe fallback page dikhta hai
- [ ] Icons: 192, 512, maskable

## 13. Cross-Browser
- [ ] Chrome (Android + desktop)
- [ ] Safari (iOS + macOS)
- [ ] Firefox
- [ ] Samsung Internet
- [ ] Edge

## 14. Build Health
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run lint` clean
- [ ] `npm run build` clean, zero warning
- [ ] `npm run analyze` — koi unexpected bada dependency nahi
- [ ] Console me zero error/warning runtime pe

---

## Sign-off Table

| Role | Config | Core | WA | Module | Content | Resp | Theme | A11y | Perf | SEO | PWA | ✅ |
|------|--------|------|----|--------|---------|------|-------|------|------|-----|-----|---|
| real-estate | | | | | | | | | | | | |
| insurance | | | | | | | | | | | | |
| doctor | | | | | | | | | | | | |
| ca-tax | | | | | | | | | | | | |
| photographer | | | | | | | | | | | | |
| fitness-tutor | | | | | | | | | | | | |
