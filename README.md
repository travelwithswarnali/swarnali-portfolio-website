# Roll No. 24 — Commercial Page

A faithful recreation of the Roll No. 24 photography portfolio commercial page.

## Quick Start

1. **Download the hero image** (the terminal can't reach the domain, so do this manually):
   - Open this URL in your browser:
     `https://id-preview--5f8b891e-cf12-4865-89f7-0bb48db632ee.lovable.app/assets/commercial-BkV7ADDd.jpg`
   - Right-click → **Save Image As** → save to `assets/commercial.jpg`
   - OR run `./download-assets.sh` (may work on your local machine)

2. **Open the site:**
   - Just double-click `index.html` in your browser
   - OR run a local server: `python3 -m http.server 8000` then visit `http://localhost:8000`

> **Note:** If the local image is missing, the page auto-falls back to the remote URL.

## Project Structure

```
swarnali-website/
├── index.html              ← Main page
├── assets/
│   ├── styles.css          ← All CSS (design system, animations, cursor effect)
│   ├── script.js           ← All JS (cursor, parallax, scroll reveals)
│   └── commercial.jpg      ← Hero image (download manually)
├── download-assets.sh      ← Asset download helper script
└── README.md               ← This file
```

## Features Recreated

- **Dark cinematic palette** — oklch warm browns, gold accents
- **Typography** — Cormorant Garamond (display), Inter (body), JetBrains Mono (labels)
- **Camera viewfinder HUD** — full Sony α7 IV overlay on page load with REC indicator
- **Cursor inversion circle** — `mix-blend-mode: difference` circle follows mouse, grows on hover
- **Hero parallax** — image shifts on scroll with subtle zoom
- **Film grain overlay** — SVG noise texture fixed across viewport
- **Staggered scroll reveals** — service cards animate in with delay
- **Infinite client marquee** — pauses on hover, edge-faded
- **Scroll progress bar** — thin gold line under header
- **Page loader** — "Loading reel..." intro

## Fonts (loaded via Google Fonts CDN)

- Cormorant Garamond (300, 400, 500, 600, italic 400)
- Inter (300, 400, 500, 600)
- JetBrains Mono (400, 500)
