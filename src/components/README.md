# src/components — Shared UI

> Brief: [docs/parts/PART-04-SECTION-LIBRARY.md](../../docs/parts/PART-04-SECTION-LIBRARY.md)
> Design spec: [docs/04-DESIGN-SYSTEM.md](../../docs/04-DESIGN-SYSTEM.md)

| Folder | Owns |
|--------|------|
| ui/ | shadcn/ui generated primitives - DO NOT hand-edit |
| motion/ | Magic UI / Aceternity animation components (adapted) |
| media/ | SmartImage, VideoHero, BeforeAfterSlider, AspectBox |
| sections/ | Hero, About, Services, Testimonials, FAQ, LeadForm ... + SectionRenderer |
| layout/ | Navbar, Footer, MobileMenu, StickyBottomBar, CommandPalette |
| shared/ | SectionHeading, PriceTag, EmptyState, DisclaimerNote, PhoneField ... |

**Rule:** `components/` kabhi `modules/` se import nahi karega.
Exception: `sections/ModuleSlot.tsx` jo registry se lazy load karta hai.
