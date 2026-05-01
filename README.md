# Filippo's Cozy House — Welcome Site

Bilingual (IT/EN) static website sent to Airbnb guests of "Filippo's Cozy House" in Lampedusa.

**Airbnb listing:** https://www.airbnb.it/rooms/15082640

## Local development

No build step needed — just serve the directory.

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Editing content

- All text in `index.html` uses `data-it` and `data-en` attributes — edit both languages for any text change
- House photos: `assets/house/` (.avif)
- Beach photos: `assets/beaches/` (.jpg — replace with real Lampedusa photos)
- Boat photos: `assets/boat/` (.jpg — replace with real photos)
- Colour palette tokens: `styles.css` `:root` block and the inline `tailwind.config` in `index.html`

## Deploy (GitHub Pages)

1. Push to `main`
2. Repo → Settings → Pages → Source: `main` / `/ (root)` → Save
3. Site goes live at `https://fmazzocca.github.io/Filippo-s-cozy-house-Lampedusa/`

## Stack

- HTML5 + Tailwind CSS (Play CDN) + vanilla JS
- Google Fonts: Playfair Display + Inter
- Motion One (scroll-reveal animations)
- Google Maps embed (no API key required)

## Legal

- CIR: 19084020C231965
- CIN: IT084020C2U9AQ8YR6
