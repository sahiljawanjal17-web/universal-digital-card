# src/core — Cross-cutting, role-agnostic features

> Brief: [docs/parts/PART-03-CORE-MODULES.md](../../docs/parts/PART-03-CORE-MODULES.md)

| Folder | Owns |
|--------|------|
| vcard/ | vCard 3.0 builder, download hook, VCardButton |
| whatsapp/ | intents, message builders, buildWhatsAppLink, openWhatsApp |
| fab/ | Floating Action Dock (WhatsApp / Call / Directions) |
| share/ | Web Share API, copy link, QR modal |
| analytics/ | event constants + provider-agnostic track() |
| seo/ | metadata + JSON-LD builders |
| pwa/ | manifest, install prompt |
| i18n/ | EN / HI string maps |

**Rule:** `core/` kabhi `modules/` ya `components/sections/` se import nahi karega.
