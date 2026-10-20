# Detergino

Catalog en-gros pentru **Gabis Fortuna SRL** (Brașov), pe domeniul detergino.ro. Site static (Next.js 16, export HTML), fără prețuri: fiecare produs are buton „Cere ofertă pe WhatsApp” (+40 723 767 435) și există o „Listă de ofertă” care trimite mai multe produse într-un singur mesaj.

## Comenzi

```bash
npm install        # o singură dată
npm run dev        # server de dezvoltare, http://localhost:3000
npm run build      # export static în folderul out/
npm run lint       # ESLint
```

## Publicare

`npm run build` produce folderul `out/` cu HTML, CSS, JS și imagini. Se poate urca pe orice hosting:

- **cPanel / FTP:** copiază conținutul lui `out/` în `public_html/`. Rutele au slash la final (`/produse/<slug>/index.html`). Fișierul `.htaccess` inclus setează pagina 404 personalizată (`ErrorDocument 404 /404.html`).
- **Vercel / Netlify:** conectezi repo-ul; build command `npm run build`, output directory `out`.

## Unde se modifică ce

| Ce | Unde |
|---|---|
| Număr WhatsApp, email, adresă, nume firmă | `src/lib/site.ts` |
| Produse (nume, variantă, ambalaj, cod de bare, imagini) | `src/data/catalog.json` |
| Imagini produse | `public/products/<slug>.png` (pătrate, PNG cu fundal transparent, decupate automat din pozele PDF; pune o poză mai bună cu același nume ca să o înlocuiești) |
| Categorii și grupuri din meniu | secțiunile `groups` și `categories` din `src/data/catalog.json` |
| Slide-urile din hero, bannerul, tab-urile de branduri | `src/app/page.tsx` |
| Texte legale (termeni, confidențialitate, cookies) | `src/app/termeni`, `src/app/confidentialitate`, `src/app/cookies` (marcate `[DE COMPLETAT]`) |
| Culori, fonturi, butoane | `src/app/globals.css` |

## Materiale de la client: unde se pun

| Material | Unde | Apoi |
|---|---|---|
| Fotografii de produs | Denumite după codul de bare sau slug (lista în `docs/lista-poze.csv`), într-un folder; rulezi `python3 scripts/import-poze.py <folder>` (cu `--cutout` elimină și fundalul) | `npm run build` |
| Fișe tehnice, declarații de conformitate (PDF) | `public/documente/<slug>-fisa-tehnica.pdf`, `<slug>-declaratie-conformitate.pdf`, `<slug>-fisa-securitate.pdf` (vezi `public/documente/CITESTE.txt`) | `npm run build`; apar automat în acordeonul „Documente” |
| Logo-uri de brand | `public/branduri/<slug-brand>.svg` sau `.png` | `npm run build` |
| Descriere și site de brand | `src/data/brands.json` | `npm run build` |
| CUI, Nr. Reg. Com., program | `src/lib/site.ts` (`cui`, `regCom`, `schedule`) | apar în footer, contact și paginile legale |
| Texte legale | `src/app/termeni`, `confidentialitate`, `cookies` conțin texte propuse, marcate „Text propus”; se verifică de client | se scoate `<LegalNotice />` după validare |
| Statistici (Plausible, fără cookie-uri) | `.env` cu `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=detergino.ro` (vezi `.env.example`); evenimente: „Cere oferta”, „Adauga in lista”, „Lista: trimite”, „Cautare”, „Distribuie” | `npm run build` |
| Imagini Open Graph (previzualizări pe WhatsApp/Facebook) | generate în `public/og/` de `python3 scripts/og-images.py`; se regenerează după schimbarea pozelor sau a catalogului | `npm run build` |

## Cum a fost generat catalogul

Produsele au fost extrase din cele două liste de preț PDF ale distribuitorului (detergenți, 13 pagini; dulciuri, 2 pagini) cu un script Python (pymupdf). Prețurile nu au fost preluate. Pozele de produs (`public/products/<slug>.webp`, WebP cu transparență, maximum 1200 px) provin din trei surse, toate cu fundalul eliminat automat (rembg) și centrate pe canvas pătrat:

- 47 de poze de pe site-ul anterior detergino.ro (biblioteca media WordPress a clientului): Ultra&Free 2/4/5 L, JO 4/5 L, balsam Free 1/4 L, detergent de vase Free toate mărimile, detergent praf Free, capsule Free 25, cele 10 săpunuri.
- 25 de poze de pe geolaila.ro (aceeași fotografie de producător, la 1000 px, identificată după codul EAN și verificată prin potrivire de trăsături) și 12 de pe site-uri de producători și magazine: Mon Mio (monmio.fr, cele 4 umpluturi de croissant), Lagoda (lagoda.com.ua), Golf Ocean 260 ml (hepsiburada.com), Golf Fruit Bomb 300 ml (dankr.cz), Golf White Soap (prom.ua), Super Wash WC Lemon și Ocean 1 x 50 g (pravaliadecuratenie.ro), Fibril Lavandă (cleber.md), Fibril Mango. Clientul a confirmat că pozele pot fi folosite.
- restul (61 de poze) sunt din PDF, mărite de 3 ori cu super-rezoluție (FSRCNN). Cele mai slabe rămân biscuiții Colibri (producătorul, ALIG SRL din Iași, colibri.ro, publică doar poze de 360 px și un ambalaj diferit) și praful Free 4 kg (896 px, randare curată păstrată în locul unei fotografii șifonate de 1600 px). Dacă vin poze de la producători, se importă cu .

Pozele compuse de pe prima pagină (hero, bannere, selectorul „Cum ceri o ofertă”) sunt în `public/banner/` și se generează cu `scripts/studio-photo.py` dintr-unul sau mai multe decupaje: cicloramă în culoarea slide-ului (`--palette bleu|albastru|bleumarin`), umbră de contact și reflexie. Exemplu: `python3 scripts/studio-photo.py --palette albastru --horizon 0.80 public/banner/hero-rufe.webp 2100 900 public/products/<slug>.webp@0.76@0.69`. Hero-ul are câte o variantă lată (2100 × 900) și una pătrată pentru telefon (`-m`).

Observații din verificarea datelor față de PDF:

- Codul de bare tipărit în PDF pentru „Balsam de rufe Free Pink Dream 1 L” (4820496011613) nu trece verificarea EAN-13; probabil corect este 4820196011613. Pe site apare valoarea din PDF.
- „Odorizant de cameră spray Golf Fruit Bomb 300 ml” nu are poză în PDF; pe site apare un marcaj „Imagine în curs de adăugare”.
- La biscuiții Colibri, PDF-ul tipărește „9 buc/palet”, valoare preluată ca atare.

## Publicare pe Hostico și gestiune produse

Site-ul este export static Next.js (`npm run build` → folderul `out/`) cu un admin în PHP.

**Publicare**: încarci prin FTP/File Manager **conținutul** folderului `out/` în `public_html/`. Nu șterge și nu suprascrie:

- `gestiune-ip98mac08m/data/` (produsele adăugate din gestiune și parola schimbată),
- `uploads/` (pozele produselor adăugate din gestiune).

Cerințe pe server: PHP 8+ cu extensia GD (cu suport WebP, standard pe Hostico) și `.htaccess` activ (Apache).

**Gestiune produse**: `https://detergino.ro/gestiune-ip98mac08m/` (adresa nu este legată din site și nu apare în robots.txt sau sitemap; nu există `/admin`). Intrarea se face în doi pași: utilizatorul `gestionar` și parola, apoi un cod de securitate de 4 cifre (în pagină apare ca 10 căsuțe, dar cel real are 4 cifre). Datele de acces inițiale se transmit separat, nu sunt în cod. (login cu utilizator și parolă; parola și codul se schimbă din meniul „Parola”). Din gestiune se adaugă, se modifică, se ascund și se șterg produse, cu poze (redimensionate automat la 1200 px, WebP comprimat). Produsele noi apar în câteva secunde în catalog, căutare, mărci și lista de ofertă, iar pagina lor este `/produs/?s=<slug>` (afișată în browser din `/api/catalog.php`).

Securitate: sesiune cu cookie HttpOnly, token CSRF pe fiecare formular, blocare după 5 încercări greșite în 15 minute, validare și re-codare a imaginilor, `gestiune-ip98mac08m/data/` blocat din `.htaccess`.

Limite cunoscute: produsele din gestiune nu intră în `sitemap.xml` și nu sunt indexate separat (pagina `/produs/` are `noindex`); produsele din catalogul inițial (136) se modifică în continuare în `src/data/catalog.json`.

**Notă de securitate**: numele folderului admin este chiar adresa lui, deci depozitul de pe GitHub trebuie să fie **privat**. Dacă depozitul devine public sau adresa se știe, redenumește folderul `public/gestiune-ip98mac08m/` cu un alt nume la întâmplare și actualizează aceeași adresă în `public/api/catalog.php` și în `scripts/export-categorii.mjs`, apoi rulează un build nou.
