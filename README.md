# GTA Cheat Codes

Astro + React fan site for GTA cheat codes: per-game cheat databases, interactive tools and 37 long-form pages.

## Structure
- `src/data/cheats-*.ts`: the cheat database (single source of truth). Store PlayStation sequences only; Xbox/Switch are derived in `src/lib/buttons.ts`.
- `src/content/pages/*.md`: all long-form pages. `kind` decides the URL: `hub` → `/{slug}/`, `guide` → `/guides/{slug}/`, `tool` → `/tools/{slug}/`. Schema: `src/content.config.ts`.
- `src/components/react/`: CheatExplorer (tables + finder), CheatTrainer (keyboard / on-screen pad / Gamepad API), CheatRoulette.
- `src/pages/sitemap.xml.ts`, `robots.txt.ts`, `llms.txt.ts`, `llms-full.txt.ts`: SEO and AI-crawler endpoints.

## Before deploying
Set `site` in `astro.config.mjs` to the real domain (canonicals, OG tags, sitemap and llms.txt use it).

## Commands
`pnpm dev` · `pnpm build` · `pnpm preview`
