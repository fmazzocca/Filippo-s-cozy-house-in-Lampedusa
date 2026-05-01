# Filippo's Cozy House — Welcome Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (IT/EN) single-page static welcome site for Airbnb guests of "Filippo's Cozy House" in Lampedusa, deployable on GitHub Pages.

**Architecture:** One `index.html` + `styles.css` + `script.js`. Tailwind CSS via CDN for utilities, Google Fonts for typography, vanilla JS for language switching and scroll animations (Motion One). No build step. Mobile-first. Photos served from `assets/`.

**Tech Stack:** HTML5, Tailwind CSS (Play CDN), Google Fonts (Playfair Display + Inter), Motion One (already in `package.json`), Google Maps embed iframe, vanilla JS.

**Verification approach:** No automated test framework — overkill for a static site. Each task ends with: (1) start a local server `python3 -m http.server 8000`, (2) open `http://localhost:8000` in the browser, (3) visually confirm the section/feature looks right and the language switcher still works, (4) check the browser console for errors.

**Spec reference:** `docs/superpowers/specs/2026-05-01-airbnb-welcome-site-design.md`

---

## File Structure

After implementation:

```
/
├── index.html                  # All markup, single page
├── styles.css                  # CSS custom properties + small overrides
├── script.js                   # i18n switcher + Motion One animations + smooth scroll
├── .gitignore                  # node_modules, .DS_Store, etc
├── README.md                   # Local dev + deploy instructions
├── assets/
│   ├── house/                  # 11 .avif files copied from "foto casa/"
│   ├── beaches/                # ~6 stock CC0 photos for beaches
│   └── boat/                   # 2 stock photos (motorboat + tour)
├── examples layout/            # (existing, untouched)
├── foto casa/                  # (existing, untouched — copied to assets/house)
├── package.json                # (existing)
├── package-lock.json           # (existing)
└── docs/superpowers/           # specs + this plan
```

**Why this split:** A single page is small, but separating CSS (palette/typography) and JS (i18n + animations) makes each file focused and easy to scan. Tailwind utilities cover most styling; `styles.css` only holds custom properties and the few patterns Tailwind can't express cleanly.

---

## Task 1: Foundation — repo hygiene, base files, asset folder

**Files:**
- Create: `.gitignore`
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`
- Create: `assets/house/` (directory)
- Create: `assets/beaches/` (directory)
- Create: `assets/boat/` (directory)

- [ ] **Step 1: Write `.gitignore`**

```gitignore
# macOS
.DS_Store
**/.DS_Store

# Node
node_modules/

# Editor
.vscode/
.idea/

# Logs
*.log

# Local dev
.cache/
```

- [ ] **Step 2: Copy the 11 house photos into `assets/house/`**

```bash
cp "foto casa/"*.avif assets/house/
ls assets/house/ | wc -l
```
Expected: 11 files listed.

- [ ] **Step 3: Write the minimal `index.html` skeleton**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Filippo's Cozy House — Lampedusa</title>
  <meta name="description" content="Casa vacanze a Lampedusa, Via Trapani 1. Guida pratica per gli ospiti: dove siamo, come muoversi, spiagge, ristoranti." />

  <!-- Tailwind via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="styles.css" />
</head>
<body class="font-body bg-calce text-navy antialiased">
  <main class="min-h-screen flex items-center justify-center">
    <h1 class="font-serif text-4xl">Filippo's Cozy House</h1>
  </main>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 4: Write `styles.css` with palette tokens and Tailwind config**

```css
/* Palette tokens — Lampedusa-vibes */
:root {
  --calce: #FAFAF7;
  --navy: #0F2C3F;
  --turchese: #2BA8B0;
  --corallo: #E8825B;
  --sabbia: #EFE6D5;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.font-serif {
  font-family: 'Playfair Display', Georgia, serif;
}

/* Tailwind extends via CDN config in script tag — see index.html footer */
```

- [ ] **Step 5: Add Tailwind CDN config inline to `index.html`** (insert AFTER the `<script src="...tailwindcss.com">` line)

```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          calce:     '#FAFAF7',
          navy:      '#0F2C3F',
          turchese:  '#2BA8B0',
          corallo:   '#E8825B',
          sabbia:    '#EFE6D5',
        },
        fontFamily: {
          serif: ['"Playfair Display"', 'Georgia', 'serif'],
          body:  ['Inter', 'system-ui', 'sans-serif'],
        },
      },
    },
  };
</script>
```

- [ ] **Step 6: Write minimal `script.js`**

```js
// Filippo's Cozy House — site script
console.log("Filippo's Cozy House — site loaded");
```

- [ ] **Step 7: Start a local server and verify**

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in browser.
Expected: page shows "Filippo's Cozy House" centered in serif font, sandy white background, navy text. Console shows the loaded message. No errors.

Stop the server (Ctrl+C).

- [ ] **Step 8: Commit**

```bash
git add .gitignore index.html styles.css script.js assets/
git commit -m "feat: scaffold static site (HTML, Tailwind CDN, fonts, palette)"
```

---

## Task 2: i18n machinery (IT/EN switcher)

**Why:** Every text element added later must work with the switcher. Build the machinery before adding content.

**Files:**
- Modify: `script.js`
- Modify: `index.html` (test elements)

- [ ] **Step 1: Add the i18n logic to `script.js`** (replace entire file)

```js
// Filippo's Cozy House — site script

const SUPPORTED_LANGS = ['it', 'en'];
const STORAGE_KEY = 'fch-lang';

function getLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  // Default to IT
  return 'it';
}

function applyLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  document.documentElement.lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);

  // Update all elements with data-it / data-en attributes
  document.querySelectorAll('[data-it][data-en]').forEach((el) => {
    el.textContent = el.dataset[lang];
  });

  // Update aria-label on elements that have data-it-aria / data-en-aria
  document.querySelectorAll('[data-it-aria][data-en-aria]').forEach((el) => {
    el.setAttribute('aria-label', el.dataset[lang + 'Aria']);
  });

  // Update active state on language buttons
  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.classList.toggle('font-semibold', btn.dataset.langBtn === lang);
    btn.classList.toggle('text-corallo', btn.dataset.langBtn === lang);
  });
}

function initLangSwitcher() {
  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => applyLang(btn.dataset.langBtn));
  });
  applyLang(getLang());
}

document.addEventListener('DOMContentLoaded', () => {
  initLangSwitcher();
});
```

- [ ] **Step 2: Add a temporary test markup to `index.html`** (replace the `<main>` content)

```html
<main class="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
  <div class="flex gap-3 text-sm">
    <button data-lang-btn="it" class="px-3 py-1">IT</button>
    <span>·</span>
    <button data-lang-btn="en" class="px-3 py-1">EN</button>
  </div>
  <h1 class="font-serif text-4xl"
      data-it="Filippo's Cozy House"
      data-en="Filippo's Cozy House">Filippo's Cozy House</h1>
  <p class="text-lg"
     data-it="Benvenuti a Lampedusa"
     data-en="Welcome to Lampedusa">Benvenuti a Lampedusa</p>
</main>
```

- [ ] **Step 3: Verify**

Run: `python3 -m http.server 8000`, open browser.
- Default loads IT, "Benvenuti a Lampedusa" visible
- Click EN → text becomes "Welcome to Lampedusa", `<html lang>` becomes `en`, EN button highlighted in corallo
- Click IT → reverts. Reload page → remembers last choice (localStorage).

Stop server.

- [ ] **Step 4: Commit**

```bash
git add script.js index.html
git commit -m "feat: add IT/EN language switcher infrastructure"
```

---

## Task 3: Header / nav

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace the test markup in `<body>` with the header**

```html
<header class="sticky top-0 z-50 backdrop-blur bg-calce/80 border-b border-sabbia">
  <nav class="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
    <a href="#hero" class="font-serif text-lg md:text-xl tracking-tight">Filippo's Cozy House</a>

    <ul class="hidden md:flex items-center gap-6 text-sm">
      <li><a href="#about"    class="hover:text-turchese transition" data-it="La casa"        data-en="The House">La casa</a></li>
      <li><a href="#location" class="hover:text-turchese transition" data-it="Dove siamo"     data-en="Find us">Dove siamo</a></li>
      <li><a href="#mobility" class="hover:text-turchese transition" data-it="Come muoversi"  data-en="Getting around">Come muoversi</a></li>
      <li><a href="#beaches"  class="hover:text-turchese transition" data-it="Spiagge"        data-en="Beaches">Spiagge</a></li>
      <li><a href="#boat"     class="hover:text-turchese transition" data-it="In barca"       data-en="By boat">In barca</a></li>
      <li><a href="#food"     class="hover:text-turchese transition" data-it="Ristoranti"     data-en="Food">Ristoranti</a></li>
    </ul>

    <div class="flex items-center gap-3">
      <div class="flex items-center gap-1 text-xs">
        <button data-lang-btn="it" class="px-2 py-1 rounded hover:bg-sabbia transition">IT</button>
        <span class="text-navy/40">·</span>
        <button data-lang-btn="en" class="px-2 py-1 rounded hover:bg-sabbia transition">EN</button>
      </div>
      <a href="https://www.airbnb.it/rooms/15082640" target="_blank" rel="noopener"
         class="hidden sm:inline-flex items-center gap-2 bg-navy text-calce text-xs md:text-sm px-3 md:px-4 py-2 rounded-full hover:bg-corallo transition"
         data-it="Prenota su Airbnb" data-en="Book on Airbnb">Prenota su Airbnb</a>
    </div>
  </nav>
</header>

<main>
  <section id="hero" class="min-h-[60vh] flex items-center justify-center">
    <p class="text-navy/60" data-it="(in costruzione)" data-en="(under construction)">(in costruzione)</p>
  </section>
</main>
```

- [ ] **Step 2: Verify**

Run server, open browser at desktop and mobile width (DevTools responsive mode):
- Desktop: logo left, nav links center, lang switcher + CTA right
- Mobile (< 768px): nav links hidden, logo + lang switcher + CTA visible
- Header sticky on scroll
- Anchor links scroll smoothly (will land on empty sections — that's expected)
- Switcher swaps "La casa" ↔ "The House" etc.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add sticky header with anchor nav and lang switcher"
```

---

## Task 4: Hero section

**Files:**
- Modify: `index.html`

**Pre-step:** Pick the most striking photo from `assets/house/` for the hero. Open the folder and choose visually. For this plan, use `01aa6046-9db9-45b5-aa8b-88266d564136.avif` as default — the implementer should swap if a better one is obvious.

- [ ] **Step 1: Replace the placeholder `#hero` section**

```html
<section id="hero" class="relative h-[88vh] min-h-[520px] w-full overflow-hidden">
  <img src="assets/house/01aa6046-9db9-45b5-aa8b-88266d564136.avif"
       alt=""
       class="absolute inset-0 w-full h-full object-cover" />
  <div class="absolute inset-0 bg-gradient-to-b from-navy/30 via-navy/10 to-navy/60"></div>

  <div class="relative h-full flex flex-col items-center justify-center text-center px-6 text-calce">
    <span class="inline-block bg-calce/90 text-navy text-[11px] md:text-xs tracking-[0.18em] uppercase px-4 py-2 rounded-full mb-6"
          data-it="Benvenuto in Lampedusa · Welcome"
          data-en="Welcome to Lampedusa · Benvenuto">Benvenuto in Lampedusa · Welcome</span>

    <h1 class="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-4">Filippo's Cozy House</h1>
    <p class="text-base md:text-lg opacity-90"
       data-it="Via Trapani 1 — Lampedusa"
       data-en="Via Trapani 1 — Lampedusa">Via Trapani 1 — Lampedusa</p>

    <a href="#about"
       class="mt-10 inline-flex items-center gap-2 bg-corallo text-calce text-sm font-medium px-6 py-3 rounded-full hover:bg-corallo/90 transition shadow-lg"
       data-it="Scopri la casa"
       data-en="Discover the house">Scopri la casa</a>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run server. Hero fills almost full viewport, photo full-bleed, dark gradient overlay, white serif title legible. CTA pill in corallo. Switcher updates "Discover the house" ↔ "Scopri la casa". Click CTA → smooth scroll down to (still empty) `#about`.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add hero section with full-bleed photo and CTA"
```

---

## Task 5: About section + reviews box

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the `#about` section after `#hero`**

```html
<section id="about" class="py-20 md:py-28 px-6">
  <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">

    <div>
      <span class="inline-block text-xs tracking-[0.2em] uppercase text-turchese mb-4"
            data-it="La casa"
            data-en="The House">La casa</span>

      <h2 class="font-serif text-4xl md:text-5xl mb-6 leading-tight"
          data-it="Una casa accogliente nel cuore di Lampedusa"
          data-en="A cozy home in the heart of Lampedusa">Una casa accogliente nel cuore di Lampedusa</h2>

      <p class="text-navy/80 leading-relaxed mb-4"
         data-it="A pochi passi dal porto e dal centro, la nostra casa è il punto di partenza ideale per scoprire l'isola. Spazi luminosi, comfort essenziali e quel tocco di mediterraneo che ti farà sentire subito a casa."
         data-en="A few steps from the port and the town center, our house is the ideal base to explore the island. Bright spaces, essential comforts, and that touch of Mediterranean warmth that will make you feel at home right away.">A pochi passi dal porto e dal centro, la nostra casa è il punto di partenza ideale per scoprire l'isola. Spazi luminosi, comfort essenziali e quel tocco di mediterraneo che ti farà sentire subito a casa.</p>

      <!-- Reviews box -->
      <a href="https://www.airbnb.it/rooms/15082640" target="_blank" rel="noopener"
         class="mt-8 inline-flex items-center gap-4 bg-sabbia/60 hover:bg-sabbia transition rounded-2xl px-5 py-4 group">
        <div class="text-3xl">⭐</div>
        <div class="text-left">
          <div class="font-semibold text-lg">4.92 · Superhost</div>
          <div class="text-sm text-navy/70 group-hover:text-turchese transition"
               data-it="Leggi le recensioni su Airbnb →"
               data-en="Read reviews on Airbnb →">Leggi le recensioni su Airbnb →</div>
        </div>
      </a>
    </div>

    <!-- Photo gallery (CSS-only carousel via scroll-snap) -->
    <div class="relative">
      <div class="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 -mx-6 px-6 md:mx-0 md:px-0 scroll-smooth">
        <!-- 11 house photos -->
        <img src="assets/house/01aa6046-9db9-45b5-aa8b-88266d564136.avif" class="snap-center shrink-0 w-[85%] md:w-full aspect-[4/3] object-cover rounded-2xl" alt="" />
        <img src="assets/house/33ce404c-f9f7-4f84-8bec-d8781d48d58e.avif" class="snap-center shrink-0 w-[85%] md:w-full aspect-[4/3] object-cover rounded-2xl" alt="" />
        <img src="assets/house/3e0c2ad4-929b-4c28-96db-29c255a52982.avif" class="snap-center shrink-0 w-[85%] md:w-full aspect-[4/3] object-cover rounded-2xl" alt="" />
        <img src="assets/house/4003ee6f-b3e6-4571-917f-e3c07ce8fa86.avif" class="snap-center shrink-0 w-[85%] md:w-full aspect-[4/3] object-cover rounded-2xl" alt="" />
        <img src="assets/house/4f34845e-8937-4817-8329-6c21b6d071cf.avif" class="snap-center shrink-0 w-[85%] md:w-full aspect-[4/3] object-cover rounded-2xl" alt="" />
        <img src="assets/house/56015653-0a9c-4ccf-b8da-21d2fb51a67a.avif" class="snap-center shrink-0 w-[85%] md:w-full aspect-[4/3] object-cover rounded-2xl" alt="" />
        <img src="assets/house/8926fd03-df6d-445d-bc0a-ff6abe183730.avif" class="snap-center shrink-0 w-[85%] md:w-full aspect-[4/3] object-cover rounded-2xl" alt="" />
        <img src="assets/house/a9218c89-fe62-4b2b-94c6-6d870a09ead7.avif" class="snap-center shrink-0 w-[85%] md:w-full aspect-[4/3] object-cover rounded-2xl" alt="" />
        <img src="assets/house/ac06d27b-fb80-4b82-b9c8-65841f90142a.avif" class="snap-center shrink-0 w-[85%] md:w-full aspect-[4/3] object-cover rounded-2xl" alt="" />
        <img src="assets/house/bb2ea701-1509-4d8c-b5d3-d0ce015e9336.avif" class="snap-center shrink-0 w-[85%] md:w-full aspect-[4/3] object-cover rounded-2xl" alt="" />
        <img src="assets/house/da5e2cb6-36df-4fb9-8a9a-de921006282f.avif" class="snap-center shrink-0 w-[85%] md:w-full aspect-[4/3] object-cover rounded-2xl" alt="" />
      </div>
      <p class="text-xs text-navy/50 text-center mt-2"
         data-it="Scorri per vedere altre foto →"
         data-en="Swipe to see more →">Scorri per vedere altre foto →</p>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Verify**

Run server. Section renders below hero:
- Desktop: text + reviews box left, scrollable photo gallery right
- Mobile: text on top, gallery below; photos snap horizontally on swipe
- Reviews box: stars, "4.92 · Superhost", clicks open Airbnb in new tab
- Switcher updates the heading and review CTA

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add about section with photo gallery and reviews box"
```

---

## Task 6: Location section — address + map + contacts + check-in/out

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the `#location` section**

```html
<section id="location" class="py-20 md:py-28 px-6 bg-sabbia/30">
  <div class="max-w-6xl mx-auto">

    <div class="text-center mb-12">
      <span class="inline-block text-xs tracking-[0.2em] uppercase text-turchese mb-3"
            data-it="Dove siamo" data-en="Find us">Dove siamo</span>
      <h2 class="font-serif text-4xl md:text-5xl"
          data-it="Via Trapani 1, Lampedusa"
          data-en="Via Trapani 1, Lampedusa">Via Trapani 1, Lampedusa</h2>
    </div>

    <div class="grid md:grid-cols-2 gap-8 md:gap-12">
      <!-- Map -->
      <div class="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] md:aspect-auto md:min-h-[360px]">
        <iframe
          src="https://www.google.com/maps?q=Via+Trapani+1,+Lampedusa&output=embed"
          class="w-full h-full border-0"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Mappa: Via Trapani 1, Lampedusa">
        </iframe>
      </div>

      <!-- Contacts + check-in/out -->
      <div class="flex flex-col gap-6">

        <div>
          <h3 class="font-serif text-2xl mb-4"
              data-it="Contatti" data-en="Contacts">Contatti</h3>
          <div class="flex flex-col gap-3">
            <a href="tel:+393394480402"
               class="flex items-center gap-3 bg-calce hover:bg-white border border-sabbia rounded-xl px-4 py-3 transition">
              <span class="text-xl">📞</span>
              <div>
                <div class="font-medium">Daniela</div>
                <div class="text-sm text-navy/70">+39 339 448 0402</div>
              </div>
            </a>
            <a href="tel:+393929385325"
               class="flex items-center gap-3 bg-calce hover:bg-white border border-sabbia rounded-xl px-4 py-3 transition">
              <span class="text-xl">📞</span>
              <div>
                <div class="font-medium">Filippo</div>
                <div class="text-sm text-navy/70">+39 392 938 5325</div>
              </div>
            </a>
          </div>
        </div>

        <div>
          <h3 class="font-serif text-2xl mb-4"
              data-it="Check-in & Check-out" data-en="Check-in & Check-out">Check-in & Check-out</h3>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div class="bg-calce border border-sabbia rounded-xl px-4 py-3">
              <div class="text-xs uppercase tracking-wider text-navy/60"
                   data-it="Check-in" data-en="Check-in">Check-in</div>
              <div class="font-serif text-2xl"
                   data-it="dalle 13:00" data-en="from 1:00 PM">dalle 13:00</div>
            </div>
            <div class="bg-calce border border-sabbia rounded-xl px-4 py-3">
              <div class="text-xs uppercase tracking-wider text-navy/60"
                   data-it="Check-out" data-en="Check-out">Check-out</div>
              <div class="font-serif text-2xl"
                   data-it="entro le 10:00" data-en="by 10:00 AM">entro le 10:00</div>
            </div>
          </div>
          <p class="text-sm text-navy/70 leading-relaxed"
             data-it="È sempre possibile lasciare i bagagli prima del check-in o dopo il check-out. Cercheremo di lasciarvi la casa il più a lungo possibile, compatibilmente con arrivi e partenze degli altri ospiti."
             data-en="You can always leave your luggage before check-in or after check-out. We will try to give you the house as long as possible, depending on other guests' arrivals and departures.">È sempre possibile lasciare i bagagli prima del check-in o dopo il check-out. Cercheremo di lasciarvi la casa il più a lungo possibile, compatibilmente con arrivi e partenze degli altri ospiti.</p>
        </div>

      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run server.
- Map iframe loads showing Via Trapani 1, Lampedusa pinned
- Contact cards: clicking on phone numbers triggers tel: action (in mobile DevTools or actual phone)
- Check-in/out cards visible side by side, with note below
- Section background is light sabbia tone (alternating from white about section)

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add location section with map, contacts, check-in/out"
```

---

## Task 7: Mobility section — Scooter/Car rental + Bus

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the `#mobility` section**

```html
<section id="mobility" class="py-20 md:py-28 px-6">
  <div class="max-w-6xl mx-auto">

    <div class="text-center mb-12">
      <span class="inline-block text-xs tracking-[0.2em] uppercase text-turchese mb-3"
            data-it="Come muoversi" data-en="Getting around">Come muoversi</span>
      <h2 class="font-serif text-4xl md:text-5xl mb-3"
          data-it="Lampedusa è piccola, ma ti serve un mezzo"
          data-en="Lampedusa is small, but you'll want a ride">Lampedusa è piccola, ma ti serve un mezzo</h2>
    </div>

    <div class="grid md:grid-cols-2 gap-8">

      <!-- Motorino / Macchina -->
      <article class="bg-calce border border-sabbia rounded-2xl p-6 md:p-8 flex flex-col">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">🛵</span>
          <h3 class="font-serif text-2xl"
              data-it="Motorino o macchina" data-en="Scooter or car">Motorino o macchina</h3>
          <span class="ml-auto text-[10px] tracking-widest uppercase bg-corallo text-calce px-2 py-1 rounded-full"
                data-it="Consigliato" data-en="Recommended">Consigliato</span>
        </div>
        <p class="text-navy/80 leading-relaxed mb-5"
           data-it="Consigliamo il motorino: ti permette di arrivare ovunque sull'isola senza problemi di parcheggio, soprattutto in alta stagione."
           data-en="We recommend a scooter: it lets you reach anywhere on the island without parking issues, especially in high season.">Consigliamo il motorino: ti permette di arrivare ovunque sull'isola senza problemi di parcheggio, soprattutto in alta stagione.</p>

        <div class="bg-sabbia/40 rounded-xl p-4 mb-4">
          <div class="text-xs uppercase tracking-wider text-navy/60 mb-1"
               data-it="Noleggio consigliato" data-en="Recommended rental">Noleggio consigliato</div>
          <div class="font-serif text-xl mb-2">Mikael</div>
          <a href="tel:+393289229672" class="block text-turchese hover:underline mb-1">📞 +39 328 922 9672</a>
          <a href="https://www.noleggioautolampedusa.com/chi-siamo/" target="_blank" rel="noopener"
             class="block text-turchese hover:underline text-sm">🌐 noleggioautolampedusa.com</a>
        </div>

        <div class="flex items-start gap-2 text-sm bg-turchese/10 text-navy rounded-lg px-3 py-2 mt-auto">
          <span>🚐</span>
          <span data-it="Navetta gratuita all'arrivo e alla partenza inclusa"
                data-en="Free shuttle on arrival and departure included">Navetta gratuita all'arrivo e alla partenza inclusa</span>
        </div>
      </article>

      <!-- Bus -->
      <article class="bg-calce border border-sabbia rounded-2xl p-6 md:p-8 flex flex-col">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">🚌</span>
          <h3 class="font-serif text-2xl"
              data-it="Autobus di linea" data-en="Public bus">Autobus di linea</h3>
        </div>
        <p class="text-navy/80 leading-relaxed mb-5"
           data-it="Lampedusa ha due linee bus che collegano le principali zone dell'isola. Economico e comodo per le spiagge più frequentate."
           data-en="Lampedusa has two bus lines connecting the main areas of the island. Cheap and handy for the busiest beaches.">Lampedusa ha due linee bus che collegano le principali zone dell'isola. Economico e comodo per le spiagge più frequentate.</p>

        <ul class="space-y-3">
          <li class="bg-sabbia/40 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-1">
              <span class="bg-corallo text-calce font-semibold px-2 py-0.5 rounded text-sm">Linea 1</span>
              <span class="text-sm text-navy/70"
                    data-it="Centro ↔ Spiaggia dei Conigli"
                    data-en="Town ↔ Rabbit Beach">Centro ↔ Spiaggia dei Conigli</span>
            </div>
            <p class="text-xs text-navy/60"
               data-it="Frequenza e tariffa: chiedi al conducente o all'edicola del porto."
               data-en="Frequency and fare: ask the driver or the port newsstand.">Frequenza e tariffa: chiedi al conducente o all'edicola del porto.</p>
          </li>
          <li class="bg-sabbia/40 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-1">
              <span class="bg-corallo text-calce font-semibold px-2 py-0.5 rounded text-sm">Linea 2</span>
              <span class="text-sm text-navy/70"
                    data-it="Centro ↔ Cala Pisana / aeroporto"
                    data-en="Town ↔ Cala Pisana / airport">Centro ↔ Cala Pisana / aeroporto</span>
            </div>
            <p class="text-xs text-navy/60"
               data-it="Frequenza e tariffa: chiedi al conducente o all'edicola del porto."
               data-en="Frequency and fare: ask the driver or the port newsstand.">Frequenza e tariffa: chiedi al conducente o all'edicola del porto.</p>
          </li>
        </ul>

        <p class="text-xs text-navy/50 mt-4 italic"
           data-it="ℹ️ Percorsi e orari possono variare: verifica sempre prima di partire."
           data-en="ℹ️ Routes and times may change: always check before leaving.">ℹ️ Percorsi e orari possono variare: verifica sempre prima di partire.</p>
      </article>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run server. Section renders:
- Two cards side by side on desktop, stacked on mobile
- Scooter card has "Recommended" badge in corallo
- Phone link is tappable
- Both bus lines listed with corallo number badges
- Switcher works on every text element

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add mobility section (scooter rental + bus lines)"
```

---

## Task 8: Beaches section + stock photos

**Files:**
- Modify: `index.html`
- Create: `assets/beaches/conigli.jpg`, `cala-pulcino.jpg`, `tabaccara.jpg`, `cala-croce.jpg`, `guitgia.jpg`, `cala-galera.jpg`

- [ ] **Step 1: Download 6 stock CC0/Unsplash photos for beaches**

Use Unsplash search ("Lampedusa beach", "turquoise sea Italy", "Mediterranean cove") and download images that fit each beach. Save them with these exact filenames:

```bash
# Manually pick from https://unsplash.com (free, license CC0)
# Save to assets/beaches/ with names:
#   conigli.jpg
#   cala-pulcino.jpg
#   tabaccara.jpg
#   cala-croce.jpg
#   guitgia.jpg
#   cala-galera.jpg
```

If exact-named photos for each beach are unavailable, use generic Mediterranean turquoise-beach images. Each ~1200px wide is enough.

Verify:

```bash
ls assets/beaches/
```
Expected: 6 files, all `.jpg`.

- [ ] **Step 2: Add the `#beaches` section**

```html
<section id="beaches" class="py-20 md:py-28 px-6 bg-sabbia/30">
  <div class="max-w-6xl mx-auto">

    <div class="text-center mb-12">
      <span class="inline-block text-xs tracking-[0.2em] uppercase text-turchese mb-3"
            data-it="Spiagge" data-en="Beaches">Spiagge</span>
      <h2 class="font-serif text-4xl md:text-5xl mb-3"
          data-it="Le spiagge da non perdere"
          data-en="Beaches you can't miss">Le spiagge da non perdere</h2>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

      <!-- Spiaggia dei Conigli -->
      <article class="bg-calce rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
        <img src="assets/beaches/conigli.jpg" class="aspect-[4/3] w-full object-cover" alt="" loading="lazy" />
        <div class="p-5 flex-1 flex flex-col">
          <h3 class="font-serif text-xl mb-2"
              data-it="Spiaggia dei Conigli" data-en="Rabbit Beach">Spiaggia dei Conigli</h3>
          <p class="text-sm text-navy/70 mb-4 flex-1"
             data-it="Una delle spiagge più belle del mondo: sabbia bianca finissima e mare turchese trasparente."
             data-en="One of the most beautiful beaches in the world: fine white sand and crystal-clear turquoise sea.">Una delle spiagge più belle del mondo: sabbia bianca finissima e mare turchese trasparente.</p>
          <div class="text-xs text-navy/60"
               data-it="🛵 12 min in motorino + 15 min a piedi"
               data-en="🛵 12 min by scooter + 15 min walk">🛵 12 min in motorino + 15 min a piedi</div>
        </div>
      </article>

      <!-- Cala Pulcino -->
      <article class="bg-calce rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
        <img src="assets/beaches/cala-pulcino.jpg" class="aspect-[4/3] w-full object-cover" alt="" loading="lazy" />
        <div class="p-5 flex-1 flex flex-col">
          <h3 class="font-serif text-xl mb-2">Cala Pulcino</h3>
          <p class="text-sm text-navy/70 mb-4 flex-1"
             data-it="Cala selvaggia raggiungibile con una bella camminata: pochi turisti e acqua spettacolare."
             data-en="Wild cove reached after a nice walk: few tourists and stunning water.">Cala selvaggia raggiungibile con una bella camminata: pochi turisti e acqua spettacolare.</p>
          <div class="text-xs text-navy/60"
               data-it="🛵 15 min + 25 min trekking"
               data-en="🛵 15 min + 25 min hike">🛵 15 min + 25 min trekking</div>
        </div>
      </article>

      <!-- Tabaccara -->
      <article class="bg-calce rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
        <img src="assets/beaches/tabaccara.jpg" class="aspect-[4/3] w-full object-cover" alt="" loading="lazy" />
        <div class="p-5 flex-1 flex flex-col">
          <h3 class="font-serif text-xl mb-2">Cala Tabaccara</h3>
          <p class="text-sm text-navy/70 mb-4 flex-1"
             data-it="Acqua color smeraldo, raggiungibile solo dal mare: tappa imperdibile dei tour in barca."
             data-en="Emerald water, reachable only from the sea: a must-stop on boat tours.">Acqua color smeraldo, raggiungibile solo dal mare: tappa imperdibile dei tour in barca.</p>
          <div class="text-xs text-navy/60"
               data-it="⛵ Solo via mare"
               data-en="⛵ By boat only">⛵ Solo via mare</div>
        </div>
      </article>

      <!-- Cala Croce -->
      <article class="bg-calce rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
        <img src="assets/beaches/cala-croce.jpg" class="aspect-[4/3] w-full object-cover" alt="" loading="lazy" />
        <div class="p-5 flex-1 flex flex-col">
          <h3 class="font-serif text-xl mb-2">Cala Croce</h3>
          <p class="text-sm text-navy/70 mb-4 flex-1"
             data-it="Spiaggetta tranquilla a pochi minuti dal centro: perfetta per un bagno veloce."
             data-en="Quiet little beach a few minutes from town: perfect for a quick swim.">Spiaggetta tranquilla a pochi minuti dal centro: perfetta per un bagno veloce.</p>
          <div class="text-xs text-navy/60"
               data-it="🛵 5 min in motorino"
               data-en="🛵 5 min by scooter">🛵 5 min in motorino</div>
        </div>
      </article>

      <!-- Guitgia -->
      <article class="bg-calce rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
        <img src="assets/beaches/guitgia.jpg" class="aspect-[4/3] w-full object-cover" alt="" loading="lazy" />
        <div class="p-5 flex-1 flex flex-col">
          <h3 class="font-serif text-xl mb-2"
              data-it="Spiaggia della Guitgia" data-en="Guitgia Beach">Spiaggia della Guitgia</h3>
          <p class="text-sm text-navy/70 mb-4 flex-1"
             data-it="Spiaggia urbana attrezzata, comoda e con bar e ristoranti vicini."
             data-en="Equipped town beach, easy access with bars and restaurants nearby.">Spiaggia urbana attrezzata, comoda e con bar e ristoranti vicini.</p>
          <div class="text-xs text-navy/60"
               data-it="🚶 10 min a piedi"
               data-en="🚶 10 min walk">🚶 10 min a piedi</div>
        </div>
      </article>

      <!-- Cala Galera -->
      <article class="bg-calce rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
        <img src="assets/beaches/cala-galera.jpg" class="aspect-[4/3] w-full object-cover" alt="" loading="lazy" />
        <div class="p-5 flex-1 flex flex-col">
          <h3 class="font-serif text-xl mb-2">Cala Galera</h3>
          <p class="text-sm text-navy/70 mb-4 flex-1"
             data-it="Piccola cala rocciosa con scogli e fondali ricchi: ideale per snorkeling."
             data-en="Small rocky cove with rich seabed: great for snorkeling.">Piccola cala rocciosa con scogli e fondali ricchi: ideale per snorkeling.</p>
          <div class="text-xs text-navy/60"
               data-it="🛵 10 min in motorino"
               data-en="🛵 10 min by scooter">🛵 10 min in motorino</div>
        </div>
      </article>

    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify**

Run server.
- 3-column grid on desktop, 2 on tablet, 1 on mobile
- All 6 cards render with their photos (no broken images)
- Hover state lifts shadow
- Switcher updates names like "Rabbit Beach" / "Spiaggia dei Conigli"

- [ ] **Step 4: Commit**

```bash
git add index.html assets/beaches/
git commit -m "feat: add beaches section with 6 cards and stock photos"
```

---

## Task 9: Boat section — Tour + Motorboat rental

**Files:**
- Modify: `index.html`
- Create: `assets/boat/giuseppina.jpg`, `assets/boat/motoscafo.jpg`

- [ ] **Step 1: Download 2 stock photos**

```bash
# Save in assets/boat/:
#   giuseppina.jpg     (a tour boat / fishing boat in Mediterranean)
#   motoscafo.jpg      (a small motorboat without flybridge)
```
Verify:
```bash
ls assets/boat/
```
Expected: `giuseppina.jpg`, `motoscafo.jpg`.

- [ ] **Step 2: Add the `#boat` section**

```html
<section id="boat" class="py-20 md:py-28 px-6">
  <div class="max-w-6xl mx-auto">

    <div class="text-center mb-12">
      <span class="inline-block text-xs tracking-[0.2em] uppercase text-turchese mb-3"
            data-it="In barca" data-en="By boat">In barca</span>
      <h2 class="font-serif text-4xl md:text-5xl mb-3"
          data-it="Vivi Lampedusa dal mare"
          data-en="Experience Lampedusa from the sea">Vivi Lampedusa dal mare</h2>
      <p class="text-navy/70 max-w-2xl mx-auto"
         data-it="Le cale più belle si raggiungono solo via mare. Due opzioni a seconda di quanto vuoi essere coccolato — o libero."
         data-en="The most beautiful coves are reachable only by sea. Two options, depending on how much you want to be pampered — or free.">Le cale più belle si raggiungono solo via mare. Due opzioni a seconda di quanto vuoi essere coccolato — o libero.</p>
    </div>

    <div class="grid md:grid-cols-2 gap-8">

      <!-- Tour organizzato Giuseppina Madre -->
      <article class="bg-calce border border-sabbia rounded-2xl overflow-hidden flex flex-col">
        <img src="assets/boat/giuseppina.jpg" class="aspect-[16/10] w-full object-cover" alt="" loading="lazy" />
        <div class="p-6 flex-1 flex flex-col">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl">⚓</span>
            <h3 class="font-serif text-2xl">Giuseppina Madre</h3>
          </div>
          <p class="text-navy/80 leading-relaxed mb-4"
             data-it="Tour giornaliero organizzato con guida: giro dell'isola, soste per bagno nelle cale più belle, pranzo a bordo."
             data-en="Guided full-day tour: island circumnavigation, swim stops at the best coves, lunch on board.">Tour giornaliero organizzato con guida: giro dell'isola, soste per bagno nelle cale più belle, pranzo a bordo.</p>

          <div class="space-y-2 mt-auto">
            <a href="tel:+393347248436" class="block text-turchese hover:underline">📞 +39 334 724 8436</a>
            <a href="https://giuseppinamadreescursioniinbarcalampedusa.it/" target="_blank" rel="noopener"
               class="block text-turchese hover:underline text-sm">🌐 giuseppinamadreescursioniinbarcalampedusa.it</a>
            <a href="https://www.instagram.com/giuseppina_madre_lampedusa/" target="_blank" rel="noopener"
               class="block text-turchese hover:underline text-sm">📷 @giuseppina_madre_lampedusa</a>
          </div>
        </div>
      </article>

      <!-- Noleggio motoscafo 50cv -->
      <article class="bg-calce border border-sabbia rounded-2xl overflow-hidden flex flex-col">
        <img src="assets/boat/motoscafo.jpg" class="aspect-[16/10] w-full object-cover" alt="" loading="lazy" />
        <div class="p-6 flex-1 flex flex-col">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl">🚤</span>
            <h3 class="font-serif text-2xl"
                data-it="Noleggio motoscafo 50cv" data-en="50hp motorboat rental">Noleggio motoscafo 50cv</h3>
          </div>
          <p class="text-navy/80 leading-relaxed mb-4"
             data-it="Motoscafo 50cv guidabile senza patente nautica. Esplora le cale al tuo ritmo, in piena libertà."
             data-en="50hp motorboat that does not require a boat license. Explore the coves at your own pace, free as a fish.">Motoscafo 50cv guidabile senza patente nautica. Esplora le cale al tuo ritmo, in piena libertà.</p>

          <div class="bg-turchese/10 rounded-lg px-3 py-2 mb-4 text-sm flex items-center gap-2">
            <span>ℹ️</span>
            <span data-it="Senza patente nautica"
                  data-en="No boat license required">Senza patente nautica</span>
          </div>

          <div class="space-y-2 mt-auto">
            <a href="tel:+393382927320" class="block text-turchese hover:underline">📞 +39 338 292 7320</a>
            <a href="tel:+393398297583" class="block text-turchese hover:underline">📞 +39 339 829 7583</a>
          </div>
        </div>
      </article>

    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify**

Run server. Section shows two cards with images. All phone links tappable, external links open in new tab.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/boat/
git commit -m "feat: add boat section (organized tour + motorboat rental)"
```

---

## Task 10: Restaurants section — Filippo's picks + top-rated

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the `#food` section with Filippo's 5 picks first, then 4 top-rated**

```html
<section id="food" class="py-20 md:py-28 px-6 bg-sabbia/30">
  <div class="max-w-6xl mx-auto">

    <div class="text-center mb-12">
      <span class="inline-block text-xs tracking-[0.2em] uppercase text-turchese mb-3"
            data-it="Ristoranti & locali" data-en="Restaurants & spots">Ristoranti & locali</span>
      <h2 class="font-serif text-4xl md:text-5xl mb-3"
          data-it="Dove mangiare a Lampedusa"
          data-en="Where to eat in Lampedusa">Dove mangiare a Lampedusa</h2>
      <p class="text-navy/70 max-w-2xl mx-auto"
         data-it="I nostri preferiti di sempre, più qualche perla suggerita dalle recensioni."
         data-en="Our long-time favorites, plus a few gems from reviews.">I nostri preferiti di sempre, più qualche perla suggerita dalle recensioni.</p>
    </div>

    <!-- Filippo's picks -->
    <h3 class="font-serif text-2xl mb-6 flex items-center gap-2">
      <span class="bg-corallo text-calce text-xs px-2 py-1 rounded-full"
            data-it="I preferiti di Filippo" data-en="Filippo's picks">I preferiti di Filippo</span>
    </h3>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">

      <!-- Nautic -->
      <article class="bg-calce rounded-2xl p-5 border border-sabbia flex flex-col">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h4 class="font-serif text-xl">Nautic</h4>
          <span class="text-corallo font-semibold">€€</span>
        </div>
        <p class="text-sm text-navy/70 mb-3"
           data-it="Ristorante · pesce fresco e cucina marinara"
           data-en="Restaurant · fresh fish and seafood">Ristorante · pesce fresco e cucina marinara</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Nautic+Lampedusa" target="_blank" rel="noopener"
           class="text-xs text-turchese hover:underline mt-auto"
           data-it="📍 Apri in Maps" data-en="📍 Open in Maps">📍 Apri in Maps</a>
      </article>

      <!-- Gastronomia Martorana -->
      <article class="bg-calce rounded-2xl p-5 border border-sabbia flex flex-col">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h4 class="font-serif text-xl">Gastronomia Martorana</h4>
          <span class="text-corallo font-semibold">€</span>
        </div>
        <p class="text-sm text-navy/70 mb-3"
           data-it="Gastronomia · take-away di pesce e piatti pronti"
           data-en="Deli · take-away seafood and ready meals">Gastronomia · take-away di pesce e piatti pronti</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Gastronomia+Martorana+Lampedusa" target="_blank" rel="noopener"
           class="text-xs text-turchese hover:underline mt-auto"
           data-it="📍 Apri in Maps" data-en="📍 Open in Maps">📍 Apri in Maps</a>
      </article>

      <!-- Bar Isola delle Rose -->
      <article class="bg-calce rounded-2xl p-5 border border-sabbia flex flex-col">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h4 class="font-serif text-xl">Bar Isola delle Rose</h4>
          <span class="text-corallo font-semibold">€</span>
        </div>
        <p class="text-sm text-navy/70 mb-3"
           data-it="Bar · la nostra colazione preferita"
           data-en="Café · our favorite breakfast">Bar · la nostra colazione preferita</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Bar+Isola+delle+Rose+Lampedusa" target="_blank" rel="noopener"
           class="text-xs text-turchese hover:underline mt-auto"
           data-it="📍 Apri in Maps" data-en="📍 Open in Maps">📍 Apri in Maps</a>
      </article>

      <!-- Gelateria Oscia -->
      <article class="bg-calce rounded-2xl p-5 border border-sabbia flex flex-col">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h4 class="font-serif text-xl">Gelateria Oscia</h4>
          <span class="text-corallo font-semibold">€</span>
        </div>
        <p class="text-sm text-navy/70 mb-3"
           data-it="Gelateria · gelato artigianale"
           data-en="Gelato · artisanal ice cream">Gelateria · gelato artigianale</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Gelateria+Oscia+Lampedusa" target="_blank" rel="noopener"
           class="text-xs text-turchese hover:underline mt-auto"
           data-it="📍 Apri in Maps" data-en="📍 Open in Maps">📍 Apri in Maps</a>
      </article>

      <!-- Bar dell'Amicizia -->
      <article class="bg-calce rounded-2xl p-5 border border-sabbia flex flex-col">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h4 class="font-serif text-xl">Bar dell'Amicizia</h4>
          <span class="text-corallo font-semibold">€</span>
        </div>
        <p class="text-sm text-navy/70 mb-3"
           data-it="Gelateria & bar · gelato classico, ottima granita"
           data-en="Gelato & bar · classic ice cream, great granita">Gelateria & bar · gelato classico, ottima granita</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Bar+dell%27Amicizia+Lampedusa" target="_blank" rel="noopener"
           class="text-xs text-turchese hover:underline mt-auto"
           data-it="📍 Apri in Maps" data-en="📍 Open in Maps">📍 Apri in Maps</a>
      </article>

    </div>

    <!-- Top-rated da Google / TripAdvisor -->
    <h3 class="font-serif text-2xl mb-6 flex items-center gap-2">
      <span class="bg-turchese text-calce text-xs px-2 py-1 rounded-full"
            data-it="Top-rated su Google & TripAdvisor"
            data-en="Top-rated on Google & TripAdvisor">Top-rated su Google & TripAdvisor</span>
    </h3>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

      <!-- Cavalluccio Marino -->
      <article class="bg-calce rounded-2xl p-5 border border-sabbia flex flex-col">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h4 class="font-serif text-lg">Cavalluccio Marino</h4>
          <span class="text-corallo font-semibold">€€€</span>
        </div>
        <p class="text-sm text-navy/70 mb-3"
           data-it="Ristorante gourmet · pesce e creatività"
           data-en="Gourmet · creative seafood">Ristorante gourmet · pesce e creatività</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Cavalluccio+Marino+Lampedusa" target="_blank" rel="noopener"
           class="text-xs text-turchese hover:underline mt-auto"
           data-it="📍 Apri in Maps" data-en="📍 Open in Maps">📍 Apri in Maps</a>
      </article>

      <!-- Ristorante Lipadusa -->
      <article class="bg-calce rounded-2xl p-5 border border-sabbia flex flex-col">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h4 class="font-serif text-lg">Lipadusa</h4>
          <span class="text-corallo font-semibold">€€</span>
        </div>
        <p class="text-sm text-navy/70 mb-3"
           data-it="Ristorante · cucina locale tradizionale"
           data-en="Restaurant · traditional local cuisine">Ristorante · cucina locale tradizionale</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Lipadusa+Lampedusa" target="_blank" rel="noopener"
           class="text-xs text-turchese hover:underline mt-auto"
           data-it="📍 Apri in Maps" data-en="📍 Open in Maps">📍 Apri in Maps</a>
      </article>

      <!-- Trattoria Terrazza Marabù -->
      <article class="bg-calce rounded-2xl p-5 border border-sabbia flex flex-col">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h4 class="font-serif text-lg">Terrazza Marabù</h4>
          <span class="text-corallo font-semibold">€€</span>
        </div>
        <p class="text-sm text-navy/70 mb-3"
           data-it="Ristorante · pesce con vista sul porto"
           data-en="Restaurant · seafood with port view">Ristorante · pesce con vista sul porto</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Terrazza+Marab%C3%B9+Lampedusa" target="_blank" rel="noopener"
           class="text-xs text-turchese hover:underline mt-auto"
           data-it="📍 Apri in Maps" data-en="📍 Open in Maps">📍 Apri in Maps</a>
      </article>

      <!-- Pasticceria Sciali -->
      <article class="bg-calce rounded-2xl p-5 border border-sabbia flex flex-col">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h4 class="font-serif text-lg">Pasticceria Sciali</h4>
          <span class="text-corallo font-semibold">€</span>
        </div>
        <p class="text-sm text-navy/70 mb-3"
           data-it="Pasticceria · cannoli e dolci siciliani"
           data-en="Pastry · cannoli and Sicilian sweets">Pasticceria · cannoli e dolci siciliani</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Pasticceria+Sciali+Lampedusa" target="_blank" rel="noopener"
           class="text-xs text-turchese hover:underline mt-auto"
           data-it="📍 Apri in Maps" data-en="📍 Open in Maps">📍 Apri in Maps</a>
      </article>

    </div>
  </div>
</section>
```

**Note for implementer:** The 4 "top-rated" entries above are reasonable Lampedusa picks based on common knowledge but should be verified by quickly checking Google Maps / TripAdvisor at implementation time. Replace with current top-rated if any of them have closed or dropped in rating.

- [ ] **Step 2: Verify**

Run server.
- 5 cards in "Filippo's picks" with corallo badge
- 4 cards in "Top-rated" with turchese badge
- Each card has price (€/€€/€€€), description, and Google Maps link
- Switcher works on every translatable string

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add restaurants section with Filippo's picks and top-rated"
```

---

## Task 11: Footer with legal codes

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the footer just before `</body>` (after `</main>`)**

```html
<footer class="bg-navy text-calce/80 py-12 px-6">
  <div class="max-w-6xl mx-auto">

    <div class="grid md:grid-cols-3 gap-8 mb-8">

      <div>
        <div class="font-serif text-xl text-calce mb-2">Filippo's Cozy House</div>
        <p class="text-sm leading-relaxed">Via Trapani 1, 92010 Lampedusa (AG), Italia</p>
      </div>

      <div>
        <h4 class="text-xs uppercase tracking-wider text-calce/60 mb-3"
            data-it="Codici legali" data-en="Legal codes">Codici legali</h4>
        <p class="text-sm font-mono mb-1">CIR: 19084020C231965</p>
        <p class="text-sm font-mono">CIN: IT084020C2U9AQ8YR6</p>
      </div>

      <div>
        <h4 class="text-xs uppercase tracking-wider text-calce/60 mb-3"
            data-it="Prenota" data-en="Book">Prenota</h4>
        <a href="https://www.airbnb.it/rooms/15082640" target="_blank" rel="noopener"
           class="inline-flex items-center gap-2 bg-corallo text-calce text-sm px-4 py-2 rounded-full hover:bg-corallo/90 transition"
           data-it="Prenota su Airbnb →" data-en="Book on Airbnb →">Prenota su Airbnb →</a>
      </div>

    </div>

    <div class="border-t border-calce/10 pt-6 text-xs text-calce/50 flex flex-col md:flex-row justify-between gap-2">
      <p data-it="Made with ❤️ in Lampedusa" data-en="Made with ❤️ in Lampedusa">Made with ❤️ in Lampedusa</p>
      <p>© 2026 Filippo's Cozy House</p>
    </div>

  </div>
</footer>
```

- [ ] **Step 2: Verify**

Run server. Footer renders dark navy with white-ish text. CIR and CIN visible in monospace. Airbnb CTA in corallo. Switcher updates "Codici legali" / "Legal codes".

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add footer with CIR/CIN legal codes and Airbnb CTA"
```

---

## Task 12: Scroll animations with Motion One

**Files:**
- Modify: `script.js`
- Modify: `index.html`

- [ ] **Step 1: Replace `script.js` to add reveal-on-scroll animations**

```js
// Filippo's Cozy House — site script

const SUPPORTED_LANGS = ['it', 'en'];
const STORAGE_KEY = 'fch-lang';

function getLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  return 'it';
}

function applyLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  document.documentElement.lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);

  document.querySelectorAll('[data-it][data-en]').forEach((el) => {
    el.textContent = el.dataset[lang];
  });

  document.querySelectorAll('[data-it-aria][data-en-aria]').forEach((el) => {
    el.setAttribute('aria-label', el.dataset[lang + 'Aria']);
  });

  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.classList.toggle('font-semibold', btn.dataset.langBtn === lang);
    btn.classList.toggle('text-corallo', btn.dataset.langBtn === lang);
  });
}

function initLangSwitcher() {
  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => applyLang(btn.dataset.langBtn));
  });
  applyLang(getLang());
}

function initScrollReveal() {
  // Skip animations if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Use IntersectionObserver — Motion One via CDN is added in index.html
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length || !window.Motion) return;

  const { animate, inView } = window.Motion;

  els.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    inView(el, () => {
      animate(el, { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0)'] }, { duration: 0.8, easing: 'ease-out' });
    }, { margin: '-10% 0px -10% 0px' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLangSwitcher();
  initScrollReveal();
});
```

- [ ] **Step 2: Add Motion One CDN script to `index.html`** (insert just before `<script src="script.js"></script>`)

```html
<!-- Motion One via CDN -->
<script src="https://cdn.jsdelivr.net/npm/motion@10/dist/motion.min.js"></script>
```

- [ ] **Step 3: Add `data-reveal` to key elements** (the `<h2>` and main grids of each section)

In `index.html`, add `data-reveal` attribute to:
- The `<h2>` of each section (about, location, mobility, beaches, boat, food)
- The grid container or article elements you want to fade in

Example for the about section's heading:
```html
<h2 class="font-serif text-4xl md:text-5xl mb-6 leading-tight" data-reveal
    data-it="Una casa accogliente nel cuore di Lampedusa"
    data-en="A cozy home in the heart of Lampedusa">...</h2>
```

Example for the beaches grid container:
```html
<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-reveal>
  ...
</div>
```

Apply `data-reveal` to: each section heading (h2) and each grid wrapper. Don't apply to the hero (it's above the fold).

- [ ] **Step 4: Verify**

Run server. Scroll down the page slowly:
- Each section heading and grid should fade up smoothly when entering viewport
- Hero animates instantly on load
- No janky behavior, no missing elements
- Test with DevTools "prefers-reduced-motion: reduce" emulation → animations disabled, content still visible

- [ ] **Step 5: Commit**

```bash
git add index.html script.js
git commit -m "feat: add scroll-reveal animations via Motion One"
```

---

## Task 13: Polish — meta tags, OG image, favicon, README

**Files:**
- Modify: `index.html`
- Create: `README.md`

- [ ] **Step 1: Pick the best house photo for OG image**

Choose one wide horizontal photo from `assets/house/` (e.g., the same as hero). Note its filename.

- [ ] **Step 2: Update `<head>` in `index.html` with full meta tags** (replace existing `<title>` and `<meta description>` block)

```html
<title data-it="Filippo's Cozy House — Lampedusa" data-en="Filippo's Cozy House — Lampedusa">Filippo's Cozy House — Lampedusa</title>
<meta name="description" content="Casa vacanze a Lampedusa, Via Trapani 1. Guida pratica per ospiti: dove siamo, come muoversi, spiagge, ristoranti, escursioni in barca." />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Filippo's Cozy House — Lampedusa" />
<meta property="og:description" content="La tua guida pratica per Lampedusa: dove siamo, come muoversi, spiagge, ristoranti, escursioni in barca." />
<meta property="og:image" content="assets/house/01aa6046-9db9-45b5-aa8b-88266d564136.avif" />
<meta property="og:locale" content="it_IT" />
<meta property="og:locale:alternate" content="en_US" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Filippo's Cozy House — Lampedusa" />
<meta name="twitter:description" content="La tua guida pratica per Lampedusa." />
<meta name="twitter:image" content="assets/house/01aa6046-9db9-45b5-aa8b-88266d564136.avif" />

<!-- Favicon (emoji-based, no asset needed) -->
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🏖️%3C/text%3E%3C/svg%3E" />
```

- [ ] **Step 3: Write `README.md`**

```markdown
# Filippo's Cozy House — Welcome Site

Bilingual (IT/EN) static website sent to Airbnb guests of "Filippo's Cozy House" in Lampedusa.

**Live site:** https://fmazzocca.github.io/Filippo-s-cozy-house-Lampedusa/
**Airbnb listing:** https://www.airbnb.it/rooms/15082640

## Local development

No build step — just serve the directory.

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Editing content

- All text in `index.html` uses `data-it` and `data-en` attributes — edit both for any change
- Photos: `assets/house/` (house), `assets/beaches/`, `assets/boat/`
- Palette tokens: `styles.css` `:root` and Tailwind config inline in `index.html`

## Deploy

GitHub Pages from `main` branch, root.

1. Push to `main`
2. Repo → Settings → Pages → Source: `main` / `/ (root)` → Save
3. Site goes live at `https://<user>.github.io/<repo>/`

## Stack

- HTML5 + Tailwind CSS (Play CDN) + vanilla JS
- Google Fonts: Playfair Display + Inter
- Motion One for scroll-reveal
- Google Maps embed (no API key)

## Spec & Plan

See `docs/superpowers/specs/` and `docs/superpowers/plans/` for the full spec and implementation plan.
```

- [ ] **Step 4: Verify**

Run server. Open browser. Inspect:
- `<title>` correct
- `<meta property="og:image">` resolves (paste URL into address bar, image loads)
- Favicon shows beach emoji in tab
- View → Page Source: meta tags all present

Optional: paste the page URL into a Twitter/Facebook debugger to confirm OG renders. (Skipping in dev — works in prod.)

- [ ] **Step 5: Commit**

```bash
git add index.html README.md
git commit -m "feat: add meta tags, OG image, favicon, README"
```

---

## Task 14: Mobile QA pass + final fixes

**Files:**
- Modify: `index.html` and/or `styles.css` as needed

- [ ] **Step 1: Open the site in DevTools mobile emulation**

Run server. Test in DevTools at:
- iPhone SE (375 × 667)
- iPhone 14 Pro (393 × 852)
- iPad (768 × 1024)
- Desktop (1440 × 900)

For each viewport, scroll the entire page and check:
- [ ] Header doesn't overlap content; hamburger / lang switcher / CTA visible
- [ ] Hero is readable, CTA tappable
- [ ] About: text and gallery stack correctly on mobile, side-by-side on desktop
- [ ] Location map fills width; phone numbers tappable
- [ ] Mobility cards stack on mobile
- [ ] Beach grid: 1 col mobile, 2 col tablet, 3 col desktop
- [ ] Boat cards stack on mobile
- [ ] Restaurant grid: 1/2/3/4 cols correctly
- [ ] Footer: 3 columns on desktop, stacks on mobile
- [ ] No horizontal scroll on any viewport

- [ ] **Step 2: Fix any issues found**

Common fixes:
- Add `text-balance` or shorter strings if titles wrap awkwardly
- Adjust `aspect-[*/*]` if photos look bad at certain sizes
- Add `min-w-0` on flex children if overflow happens
- If horizontal scroll appears, find the offender via DevTools and constrain

- [ ] **Step 3: Lighthouse check**

In Chrome DevTools → Lighthouse tab → Mobile → Run (Performance, Accessibility, Best Practices, SEO).
Target:
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

If accessibility flags missing alt text or contrast — fix and re-run.

- [ ] **Step 4: Commit any fixes**

```bash
git add -p   # review and stage fixes
git commit -m "fix: mobile responsive polish + accessibility"
```

If no fixes needed, skip this commit.

---

## Task 15: Deploy to GitHub Pages

**Files:** none (GitHub config)

- [ ] **Step 1: Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 2: Enable GitHub Pages**

Manual step on github.com:
1. Go to repo → Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main` / `/ (root)`
4. Save

Wait ~1 minute for first build.

- [ ] **Step 3: Verify**

Visit `https://fmazzocca.github.io/Filippo-s-cozy-house-Lampedusa/`. Confirm:
- Page loads
- Photos render
- Map embed works
- Lang switcher works
- All anchor links work

- [ ] **Step 4: Done**

Share the URL with the user. Plan complete.

---

## Self-Review Checklist (run BEFORE handoff)

Spec coverage:
- [x] Bilingual IT/EN — Task 2
- [x] Hero with full-bleed photo — Task 4
- [x] About + reviews box — Task 5
- [x] Dove siamo (address, map, contacts, check-in/out with note) — Task 6
- [x] Mobility (Mikael scooter rental + 2 bus lines) — Task 7
- [x] Beaches (6 cards) — Task 8
- [x] In barca (Giuseppina Madre + motoscafo 50cv) — Task 9
- [x] Restaurants (Filippo's 5 picks + 4 top-rated) — Task 10
- [x] Footer with CIR/CIN — Task 11
- [x] Scroll animations — Task 12
- [x] Meta tags / OG / favicon — Task 13
- [x] Mobile QA — Task 14
- [x] Deploy to GitHub Pages — Task 15

Open items intentionally deferred to implementation (per spec section 10):
- Exact Airbnb review count (4.92 is example) — verify when implementing Task 5
- Bus line specifics (frequency, fare) — Task 7 uses placeholder text directing user to ask; that's acceptable for v1
- Hero photo selection — Task 4 picks one as default, can swap
- Top-rated restaurants final list — Task 10 has 4 reasonable defaults to verify
