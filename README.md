# PathFinders

Landing page for PathFinders — "Where Dreams Meet Direction."

## Stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS** for styling, with a custom color/type token system
- **Framer Motion** for the compass needle, hero entrance, and scroll reveals
- **lucide-react** for icons

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Folder structure

```
pathfinders-next/
├── app/
│   ├── layout.js       # fonts, metadata, root HTML shell
│   ├── page.js         # assembles all sections
│   └── globals.css     # Tailwind directives + base styles
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── CompassRose.jsx # animated SVG compass (client component)
│   ├── Starfield.jsx   # canvas starfield (client component)
│   ├── StatsStrip.jsx
│   ├── Journey.jsx      # 4-step process, scroll-reveal animated
│   ├── Features.jsx
│   ├── Audience.jsx     # students vs. professionals
│   ├── Quote.jsx
│   ├── CTA.jsx
│   └── Footer.jsx
├── public/
├── tailwind.config.js   # custom colors: ink, brass, trail, parchment, fog...
├── postcss.config.js
├── next.config.js
└── jsconfig.json        # "@/*" import alias
```

## Design tokens

Colors and fonts are defined in `tailwind.config.js`:

- `ink` / `ink-deep` — deep navy backgrounds (night sky)
- `parchment` / `parchment-dim` — warm cream surfaces
- `brass` / `brass-bright` — gold accent (direction / compass)
- `trail` / `trail-light` — muted sage green accent (growth / path)
- Fonts: **Fraunces** (display), **Inter** (body), **IBM Plex Mono** (labels/data), loaded via `next/font/google` in `app/layout.js`

## Notes

- The stats in `StatsStrip.jsx` (73%, 4 in 10) are placeholder figures — swap in real, sourced data before shipping.
- All components are mobile-responsive down to small phone widths.
- `prefers-reduced-motion` is respected globally in `globals.css`.
