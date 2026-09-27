# PART-13 — PREVIEW STUDIO · QA · DEPLOYMENT

**Status:** ⬜ Not started
**Est:** 1.5 days · **Blocked by:** all previous parts

---

## 1. Goal
Product ko **sellable** banana: ek demo page jahan client 6 roles live switch karke
dekh sake, poora QA pass, aur deployed URL jo WhatsApp pe bheja ja sake.

## 2. Read First
- `docs/08-QA-CHECKLIST.md` ← is part ka bada hissa yahi hai
- `docs/00-MASTER-PLAN.md` §9 (success criteria)

## 3. Files To Create

```
src/app/(site)/preview/page.tsx           # role gallery — the sales page
src/app/(site)/preview/[role]/page.tsx    # single role, full site
src/components/preview/
├─ RoleSwitcher.tsx                       # floating dev/demo switcher
├─ RoleGalleryCard.tsx
├─ DeviceFrame.tsx                        # phone mockup iframe
└─ FeatureTour.tsx                        # guided hotspots

src/app/(site)/_dev/
├─ theme/page.tsx                         # (from PART-02)
├─ components/page.tsx                    # component gallery
└─ templates/page.tsx                     # all WhatsApp messages preview

scripts/
├─ build-all-roles.ts                     # static export per role (optional)
└─ screenshot-all.ts                      # playwright screenshots for deck

docs/assets/
├─ lighthouse-report.md
├─ contrast-report.md
├─ screenshots/                           # 6 roles × 4 (mobile/desktop × light/dark)
└─ LICENSES.md

.github/workflows/deploy.yml
vercel.json
DEPLOYMENT.md
```

## 4. Preview Studio (`/preview`)

Yeh **sales asset** hai — client ko yahi link bhejoge.

```
┌──────────────────────────────────────────────┐
│  One Platform. Six Professions.              │
│  Change one line. Get a whole new website.   │
│                                              │
│  [Real Estate] [Insurance] [Doctor]          │
│  [CA/Tax]      [Photographer] [Gym/Tutor]    │
│                                              │
│  ┌─────────┐   Live preview in phone frame   │
│  │ ▓▓▓▓▓▓▓ │   + "Open full site" button     │
│  │ ▓▓▓▓▓▓▓ │   + feature bullets for role    │
│  └─────────┘                                 │
└──────────────────────────────────────────────┘
```

- 6 role cards with hero thumbnail + accent color + 3 headline features
- Click → phone frame iframe loads `/preview/<role>`
- "Open full site" → full-page
- Role switch = instant theme morph animation (yeh wow moment hai)
- Bottom: "Want this for your business?" → WhatsApp CTA

`/preview/[role]` — `resolveConfig(role)` override se full site render, same components.

## 5. Dev Pages (`/_dev/*`, production me blocked)
- `theme` — all tokens, both modes, all 6 roles
- `components` — every shared component with props variations
- `templates` — **har WhatsApp message ka rendered preview** with a
  "Copy" and "Open in WhatsApp" button. Ye QA ke liye bahut useful hai.

Guard: `if (process.env.NODE_ENV === 'production') notFound()` — ya
`NEXT_PUBLIC_ENABLE_DEV_PAGES` flag.

## 6. QA Execution

`docs/08-QA-CHECKLIST.md` ko **6 baar** chalao (ek per role).
Result sign-off table me bharo.

### Device matrix (minimum)
| Device | Browser |
|--------|---------|
| Android phone (real, mid-range) | Chrome |
| iPhone (real) | Safari |
| iPad / Android tablet | default |
| Windows desktop | Chrome, Edge, Firefox |
| macOS | Safari |

> Real device testing **mandatory** hai WhatsApp aur vCard ke liye —
> emulator me yeh flows properly test nahi hote.

### Bug log
`docs/assets/qa-log.md` — table: ID, role, severity, description, status, fix commit.
Sab P0/P1 close hone ke baad hi ship.

## 7. Screenshots (`scripts/screenshot-all.ts`)
Playwright se 6 roles × {mobile, desktop} × {light, dark} = 24 screenshots.
`docs/assets/screenshots/` me. Yeh sales deck aur README ke liye chahiye.

## 8. Deployment

### 8.1 Vercel (recommended)
```powershell
vercel link
vercel env add NEXT_PUBLIC_SITE_URL production
vercel --prod
```

`vercel.json`:
- Security headers (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- Cache headers for `/images/*`, `/videos/*` (1 year immutable)
- Redirect `/` → keep

### 8.2 Multi-role deployment options
| Option | How |
|--------|-----|
| A. One deploy, `/preview/<role>` | Simplest. Demo ke liye best. |
| B. Env var per deploy | `NEXT_PUBLIC_ROLE=doctor` → same repo, 6 Vercel projects |
| C. Per-client deploy | Fork data JSON + custom domain. **Yeh actual sale model hai.** |

Document all three in `DEPLOYMENT.md`.

### 8.3 Client handover checklist (`DEPLOYMENT.md`)
1. `src/data/roles/<role>.json` me client ka data bharo
2. `public/images/roles/<role>/` me client ke photos daalo
3. `npm run prefetch:media` / dimensions update
4. `npm run validate:config`
5. `npm run build` — clean hona chahiye
6. Custom domain connect
7. Google Business Profile me website link update
8. WhatsApp Business number verify
9. Client ko QR code PNG do (print ke liye)
10. 1-page usage guide (kaise leads aayenge)

### 8.4 Security headers
```
Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; media-src 'self';
  script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline'; frame-src https://www.google.com https://www.youtube.com;
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## 9. Definition of Done
- [ ] `/preview` page 6 roles ke saath live, phone frame kaam karta hai
- [ ] Role switch animation smooth (wow moment)
- [ ] `/preview/<role>` 6/6 full sites render karte hain
- [ ] Dev pages production me blocked hain
- [ ] `/_dev/templates` pe saare WhatsApp messages preview hote hain
- [ ] QA checklist 6/6 roles pe complete, sign-off table bhara
- [ ] Real Android + real iPhone pe test kiya (vCard + WhatsApp)
- [ ] `qa-log.md` me zero open P0/P1
- [ ] 24 screenshots captured
- [ ] `lighthouse-report.md` + `contrast-report.md` + `LICENSES.md` complete
- [ ] Vercel pe deployed, custom domain (ya vercel.app) live
- [ ] Security headers verified (securityheaders.com A grade)
- [ ] `DEPLOYMENT.md` + client handover checklist likha
- [ ] Root `README.md` update: status PLANNING → SHIPPED, live URL added
- [ ] Commit: `feat(part-13): preview studio, QA sign-off, deployment`

## 10. Post-Launch (Phase 2 backlog)
`docs/adr/` me ya ek `BACKLOG.md` me likho:
- Headless CMS (Sanity/Payload) so clients edit their own content
- Multi-tenant subdomains (`client.yourdomain.com`)
- Real lead DB + owner dashboard + daily WhatsApp digest
- WhatsApp Business API (template messages, auto-reply)
- Razorpay for booking advance / package payment
- Self-serve builder + subscription
- More roles: salon, lawyer, interior designer, travel agent, restaurant
