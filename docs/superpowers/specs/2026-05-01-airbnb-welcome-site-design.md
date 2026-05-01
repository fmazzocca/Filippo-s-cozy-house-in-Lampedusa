# Filippo's Cozy House — Airbnb Welcome Site

**Data:** 2026-05-01
**Tipo:** Sito vetrina statico bilingue per ospiti Airbnb
**Repo:** `Filippo-s-cozy-house-Lampedusa`

---

## 1. Obiettivo

Creare un sito statico, single-page, bilingue (IT/EN), che il proprietario invia via link a ogni
ospite dopo la prenotazione. Il sito raccoglie tutte le informazioni utili per il soggiorno:
casa, posizione, mobilità, spiagge, escursioni in barca, ristoranti.

### Audience
Ospiti italiani e stranieri che hanno appena prenotato la casa "Filippo's Cozy House" su Airbnb
(Via Trapani 1, Lampedusa). La maggior parte aprirà il link **da smartphone** prima o durante il
viaggio — il design deve essere **mobile-first**.

### Success criteria
- L'ospite trova ogni informazione utile senza dover scrivere a Filippo/Daniela
- Si carica in <2s su rete mobile italiana
- Funziona offline-friendly (immagini ottimizzate, no dipendenze critiche da CDN)
- Estetica curata coerente con l'isola (non un blocco di testo grezzo)
- Zero manutenzione: nessuna build, nessun deploy complesso

---

## 2. Stack tecnologico

- **HTML/CSS/JS statico**, un singolo `index.html` + `styles.css` + `script.js`
- **Tailwind CSS via CDN** (Play CDN) per lo styling — zero build step
- **Google Fonts**: Playfair Display (titoli) + Inter (corpo)
- **Motion One** (già in `package.json`) per animazioni leggere on-scroll
- **Mappa**: Google Maps embed gratuito via iframe (no API key necessaria)
- **Hosting**: GitHub Pages (gratuito, repo già su GitHub)
- **Foto**: le 11 .avif esistenti in `foto casa/`. Per spiagge/motoscafo userò immagini
  open-source/CC0 (Unsplash) salvate localmente in `assets/`

### Out of scope
- Backend, database, API custom
- Sistema di prenotazione (delegato ad Airbnb)
- CMS o admin panel
- Tracking analytics complessi (eventualmente Plausible o niente)

---

## 3. Design system

### Palette "Lampedusa-vibes"
| Token | Hex | Uso |
|-------|-----|-----|
| `bianco-calce` | `#FAFAF7` | sfondo principale |
| `blu-navy` | `#0F2C3F` | testo principale, nav |
| `turchese-mare` | `#2BA8B0` | accenti, link, hover |
| `corallo` | `#E8825B` | CTA, prezzi, badge |
| `sabbia` | `#EFE6D5` | box/sezioni alternate |

### Tipografia
- **Playfair Display** (700) — H1, H2, brand
- **Inter** (400, 500, 600) — corpo, nav, CTA

### Componenti riutilizzabili
- **Card spiaggia/ristorante**: foto + titolo + 1 riga descrittiva + meta (distanza, prezzo)
- **Contact pill**: icona + nome + telefono cliccabile (tel: link)
- **Section heading**: pill di categoria + titolo grande serif + sottotitolo opzionale

### Responsive breakpoints (Tailwind default)
- Mobile (< 768px): single column, card stack
- Tablet (768-1024): 2 colonne dove applicabile
- Desktop (> 1024px): 2-3 colonne nelle griglie

---

## 4. Architettura del sito

### Single-page con scroll fluido
- Tutte le sezioni in un solo `index.html`
- Nav fissa in alto con anchor link (`#about`, `#location`, `#mobility`, `#beaches`,
  `#boat`, `#food`)
- Scroll smooth nativo (`scroll-behavior: smooth`)

### Struttura DOM ad alto livello
```
<header>      → Nav (logo, anchor links, language switcher, CTA Airbnb)
<main>
  <section id="hero">       Hero full-screen con foto della casa
  <section id="about">      La casa + box recensioni
  <section id="location">   Dove siamo, mappa, contatti, check-in/out
  <section id="mobility">   Come muoversi (Motorino/Macchina + Bus)
  <section id="beaches">    Griglia spiagge
  <section id="boat">       In barca (Tour + Noleggio motoscafo)
  <section id="food">       Ristoranti & locali
</main>
<footer>      → Codici CIR/CIN, link Airbnb, credits
```

### Switch lingua IT/EN
- Pulsante in nav: `IT | EN`
- Implementazione: ogni elemento testuale ha attributi `data-it="..."` e `data-en="..."`
- `script.js` legge `localStorage` (default IT), aggiorna tutti gli elementi al click,
  aggiorna `<html lang>`
- Niente i18n library — overkill per ~2 lingue e ~50 stringhe

---

## 5. Contenuto delle sezioni

### 5.1 Hero
- Foto full-bleed (la più suggestiva tra le 11 di `foto casa/`)
- Pill in alto: `BENVENUTO IN LAMPEDUSA · WELCOME`
- H1 serif: **"Filippo's Cozy House"**
- Sottotitolo: "Via Trapani 1 — Lampedusa"
- CTA: "Scopri la casa" (scroll fluido a `#about`)

### 5.2 La casa (About)
- Layout 2 colonne (su desktop): testo a sinistra, **carousel/galleria foto** a destra
- Testo: descrizione calda di 4-5 righe (la genero io, tu correggi)
- **Box recensioni**:
  ```
  ⭐ 4.92 · Superhost · X recensioni
  → Leggi tutte le recensioni su Airbnb
  ```
  Link diretto al listing Airbnb fornito dall'utente.

### 5.3 Dove siamo (Location)
- Indirizzo grande: **Via Trapani 1, Lampedusa (AG)**
- Google Maps embed (iframe responsive)
- Card contatti:
  - 📞 **Daniela** — +39 339 448 0402 (tel: link)
  - 📞 **Filippo** — +39 392 938 5325 (tel: link)
- Check-in / Check-out:
  - Check-in: **dalle 13:00**
  - Check-out: **entro le 10:00**
  - Nota: "Possibile lasciare i bagagli prima/dopo. Cercheremo sempre di lasciarvi
    la casa il più a lungo possibile compatibilmente con arrivi/partenze degli altri ospiti."

### 5.4 Come muoversi (Mobility)
Due sotto-blocchi side-by-side (su desktop) o stacked (mobile):

#### Motorino o Macchina (raccomandato)
- Heading: "Consigliamo il motorino"
- Motivo: "Lampedusa è piccola, il motorino ti permette di arrivare ovunque
  senza problemi di parcheggio."
- Card noleggio:
  - **Mikael** — +39 328 922 9672
  - 🌐 [noleggioautolampedusa.com](https://www.noleggioautolampedusa.com/chi-siamo/)
  - 🚐 **Navetta gratuita all'arrivo e alla partenza inclusa**

#### Bus (linee Lampedusa)
- 2 card per le 2 linee bus dell'isola (Linea 1 e Linea 2)
- Per ogni linea: percorso principale, fermata vicina alla casa, frequenza, tariffa
- ⚠️ **NOTA**: il contenuto specifico (percorsi, frequenze, tariffe) deve essere
  verificato dall'utente prima del go-live. Bozza basata su info pubbliche.

### 5.5 Spiagge
Griglia 2-3 colonne con card per ogni spiaggia. Per ognuna:
- Foto (stock CC0 da Unsplash, salvata in `assets/beaches/`)
- Nome (es. "Spiaggia dei Conigli")
- 1 riga descrittiva (es. "Una delle spiagge più belle del mondo, sabbia bianca e mare cristallino")
- Distanza/come arrivare da Via Trapani 1 (es. "🛵 12 min in motorino + 15 min a piedi")

Spiagge incluse:
1. Spiaggia dei Conigli
2. Cala Pulcino
3. Cala Tabaccara (raggiungibile solo da mare)
4. Cala Croce
5. Spiaggia della Guitgia
6. Cala Galera

### 5.6 In barca (NUOVA sezione)
Due opzioni in card affiancate:

#### Tour giornaliero "Giuseppina Madre"
- Foto rappresentativa
- "Giro dell'isola con guida, soste per bagno nelle cale più belle, pranzo a bordo."
- 📞 **+39 334 724 8436**
- 🌐 [giuseppinamadreescursioniinbarcalampedusa.it](https://giuseppinamadreescursioniinbarcalampedusa.it/)
- 📷 [@giuseppina_madre_lampedusa](https://www.instagram.com/giuseppina_madre_lampedusa/)

#### Noleggio motoscafo 50cv
- Foto esplicativa di un motoscafo 50cv (stock)
- "Motoscafo 50cv guidabile **senza patente nautica**. Esplora le cale a tuo ritmo."
- 📞 **+39 338 292 7320**
- 📞 **+39 339 829 7583**

### 5.7 Ristoranti & Locali
Griglia 2-3 colonne. Ogni card:
- Nome del locale
- 1 riga: tipologia/cucina (es. "Pesce fresco · Cucina marinara")
- Prezzo: € / €€ / €€€ (icona)
- 📍 Distanza da Via Trapani 1 (es. "5 min a piedi")
- Link Google Maps (apri in app)

#### Consigliati da Filippo (badge "Filippo's pick" in corallo)
1. **Nautic** — Ristorante / pesce fresco
2. **Gastronomia Martorana** — Gastronomia / take-away pesce
3. **Bar Isola delle Rose** — Colazione
4. **Gelateria Oscia** — Gelato artigianale
5. **Bar dell'Amicizia** — Gelato

#### Top-rated da Google/TripAdvisor (4-5)
Selezionati tra le top-rated di Lampedusa al momento della scrittura.
*Nota: contenuto specifico da finalizzare in fase implementazione cercando le top-rated correnti.*

### 5.8 Footer
- "Made with ❤️ in Lampedusa"
- Link grande **"Prenota su Airbnb"** → URL listing fornito
- **Codici legali** (richiesti per legge):
  - CIR: **19084020C231965**
  - CIN: **IT084020C2U9AQ8YR6**
- © 2026 Filippo's Cozy House

---

## 6. File structure

```
/
├── index.html                  # Tutto il markup
├── styles.css                  # Override Tailwind + custom (poco)
├── script.js                   # Lingua switch, carousel, scroll smooth
├── assets/
│   ├── house/                  # le foto della casa (copiate/symlink da "foto casa/")
│   ├── beaches/                # foto spiagge stock CC0
│   └── boat/                   # foto motoscafo stock CC0
├── docs/superpowers/specs/     # questo design doc
├── package.json                # già esistente, motion installato
└── README.md                   # istruzioni deploy
```

---

## 7. Considerazioni di accessibilità & SEO

- `<html lang>` aggiornato dinamicamente al cambio lingua
- Alt text su tutte le immagini (in entrambe le lingue)
- Contrasto WCAG AA: blu navy su bianco-calce supera AAA
- Tap target ≥ 44px su mobile (link telefono, CTA)
- Meta tag base: title, description, OG image (per anteprima quando l'ospite condivide il link)

---

## 8. Deploy

- **GitHub Pages** dal branch `main`, root del repo
- Custom domain opzionale (es. `filipposcozyhouse.it` o sottodominio)
- Per ora URL: `https://fmazzocca.github.io/Filippo-s-cozy-house-Lampedusa/`

---

## 9. Decisioni esplicite (non-goals)

- **No dark mode** — il sito vive di luce mediterranea
- **No prenotazione integrata** — delegato ad Airbnb
- **No multi-page** — single-page è l'esperienza giusta per un welcome guide
- **No backend / no DB** — contenuto raramente cambia, modificare HTML è ok
- **No PWA / offline** — non vale la complessità per un sito vetrina

---

## 10. Aperti / da verificare in implementazione

- Numero esatto delle recensioni Airbnb (4.92 stelle è esempio — leggere dal listing)
- Contenuto **specifico** delle 2 linee bus (percorsi, frequenze, tariffe)
- Selezione foto hero (scelgo io tra le 11 ma l'utente conferma)
- Lista finale top-rated ristoranti aggiuntivi (Google/TripAdvisor) da affiancare ai consigliati
