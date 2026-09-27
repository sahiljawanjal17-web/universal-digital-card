# src/data — All client content

> Brief: [docs/parts/PART-11-DATA-AND-MEDIA.md](../../docs/parts/PART-11-DATA-AND-MEDIA.md)
> Schema: [docs/03-CONFIG-SCHEMA.md](../../docs/03-CONFIG-SCHEMA.md)

```
roles/<role>.json   ALL content for that role (profile, contact, services, module block)
media/              curated Unsplash / Pexels URL banks
common/             cities, localities, insurers, boards, specialities
```

Naya client = naya `roles/*.json` + naye photos. **Zero code change.**

Har JSON `npm run validate:config` se pass hona chahiye.
