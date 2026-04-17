# Eureka Packaging - Documentazione Tecnica Completa

## 1) Scopo di questo README

Questo documento e progettato per essere il **contesto tecnico persistente del progetto** tra una sessione e l'altra.

Obiettivi:

- descrivere in dettaglio come e strutturato e come funziona il sito;
- separare chiaramente **codice attivo** da **asset legacy/ereditati**;
- fornire regole operative per manutenzione, modifiche e deploy;
- ridurre il rischio di regressioni (soprattutto lato CSS e pagine duplicate).

---

## 2) Panoramica architetturale

Il progetto e un **sito statico multipagina** (no build system, no framework, no transpiler):

- pagine HTML statiche in root;
- un unico CSS custom condiviso: `assets/css/site.css`;
- JavaScript inline nelle singole pagine (nessun bundle/build JS condiviso attivo);
- molte directory di risorse (immagini/font) e cartelle legacy da export storico (Italiaonline/Duda).

### Stack effettivo

- HTML statico
- CSS statico (`site.css`, con molte stratificazioni di override)
- JavaScript vanilla
- Deploy GitHub Pages via GitHub Actions

---

## 3) Mappa repository (completa, con classificazione)

### 3.1 Root attivo (source principale)

- `index.htm` -> homepage principale (file canonico usato dalla navigazione)
- `index.html` -> copia quasi identica di `index.htm` (differenze minime di whitespace)
- `contatti.html` -> pagina contatti e form `mailto:`
- `sottovuoto.html` -> pagina categoria sottovuoto con iframe esterno
- `cottura.html` -> pagina categoria cottura con selettore prodotti + fallback iframe + gallery detergenze
- `refrigerazione.html` -> pagina categoria refrigerazione con selettore prodotti + iframe
- `gas.html` -> pagina categoria gas con iframe esterno
- `imballaggi-industriali.html` -> pagina categoria imballaggi con selettore + iframe
- `arredi-neutri.html` -> pagina categoria arredi/neutri con selector multiprodotto + fallback host bloccati
- `partners-references.html` -> pagina partner/referenze con marquee loghi + galleria clienti
- `usato.html` -> pagina macchine usate con carosello custom + popup immagini
- `privacy.html` -> informativa privacy
- `cookie.html` -> informativa cookie
- `assets/css/site.css` -> foglio stile principale condiviso (molto esteso, ~4268 linee)
- `.github/workflows/pages.yml` -> deploy GitHub Pages

### 3.2 Root di supporto/documentazione

- `README.md` -> questo documento
- `Leggimi_giorgio.txt` -> promemoria locale avvio server (`py -m http.server 8080`)
- `PROMEMORIA_LUNEDI_2026-04-13.md` -> promemoria operativo su interventi rapidi lato sito

### 3.3 Directory media/font (attive o potenzialmente attive)

- `gallery/` -> immagini homepage + detergenze + loghi partner/referenze (`img_loghi_partners`, `img_loghi_clienti`)
- `158cafef/dms3rep/multi/opt/` -> repository immagini aziendali/logo/hero e molte risorse storiche
- `fonts/` -> grande set font locali (inclusi `CalSans-Regular.woff2`, `LabelSansVF.woff2` usati da `site.css`)

### 3.4 Directory legacy/ereditate (non referenziate dalle pagine attive)

- nel working tree corrente queste directory legacy non risultano presenti;
- riferimento storico (export precedente): `_dm/`, `mnlt/`, `WIDGET_CSS/`, `runtime/`, `runtime-img/`, `Partners/`, `script/`, `df/`, `libs/`, `themes/`, `dudamobile-themes/`, `site-resources/`, `bfsImages/`.

---

## 4) Inventario quantitativo (stato attuale)

### 4.1 Tipi file principali

- immagini (`.jpg`, `.png`, `.gif`, `.webp`, `.jpeg`) -> componente dominante
- font (`.woff`, `.woff2`, `.ttf`, `.eot`, `.otf`, `.svg font`)
- codice testuale limitato (`.html`, `.htm`, `.css`, `.js`, `.md`, `.txt`, `.yml`)

### 4.2 Directory piu pesanti (dimensione indicativa)

- `158cafef/` ~ 21.56 MB
- `gallery/` ~ 9.18 MB
- `fonts/` ~ 6.29 MB

### 4.3 File singoli piu pesanti (top)

- `gallery/home-imballaggi-default.png` (~2.39 MB)
- `gallery/cucina-professionale-default.png` (~2.32 MB)
- `gallery/home-refrigerazione-default.png` (~2.23 MB)
- diversi PNG hero in `158cafef/dms3rep/multi/opt/` (>1 MB ciascuno)

Impatto pratico: il peso pagina dipende soprattutto da asset immagini, non da JS.

---

## 5) Flusso runtime generale

Per ogni pagina attiva:

1. carica `assets/css/site.css?v=...` (version query usata per busting cache);
2. renderizza header/nav/footer e contenuto pagina;
3. esegue script inline locale (menu mobile + logica specifica pagina);
4. applica eventuale logica viewer/fallback/marquee inline, in base alla pagina.

---

## 6) Pagine HTML attive: comportamento dettagliato

### 6.1 Header/nav condivisi

Quasi tutte le pagine replicano lo stesso blocco:

- logo: `158cafef/dms3rep/multi/opt/Logo_EUREKA-080421-811x265-RossoNero.jpg`
- menu mobile con bottone `#menu-toggle`
- nav `#site-nav` con link a tutte le sezioni
- script inline IIFE che:
  - apre/chiude menu con classe `.open`;
  - aggiorna `aria-expanded`;
  - chiude menu al click su un link nav.

Questa logica e duplicata pagina per pagina (non centralizzata).

### 6.2 `index.htm` (homepage canonica)

Struttura:

- hero principale con CTA "Richiedi un consulto"
- sezione `#soluzioni` con 6 card:
  - Sottovuoto
  - Cottura industriale
  - Refrigerazione
  - Gas e impianti
  - Imballaggi industriali
  - Arredi/Neutri/Attrezzature
- sezione `#valore` (attivita/valori)
- contact strip finale

Dipendenze immagini principali:

- `gallery/home-sottovuoto-default.jpg`
- `gallery/cucina-professionale-default.png`
- `gallery/home-refrigerazione-default.png`
- `gallery/home-gas-default-v2.png`
- `gallery/home-imballaggi-default.png`
- `158cafef/.../ARREDI-NEUTRI-20260319.png`

### 6.3 `index.html`

- copia quasi identica di `index.htm`;
- mantiene canonical verso `index.htm`.

Regola operativa: trattare `index.htm` come sorgente primaria e poi sincronizzare `index.html`.

### 6.4 `contatti.html`

- hero contatti + 2 griglie card;
- dati azienda (telefono/email/indirizzo);
- form con `action="mailto:info@eureka-pack.it"` (no backend server-side);
- sezione orari e note.

Nota manutenzione: il form dipende dal client email locale dell'utente.

### 6.5 `sottovuoto.html`

- classe body: `sottovuoto-page frame-view-page`;
- hero con CTA;
- viewer con iframe esterno fisso verso Orved;
- nessuna logica selector multiprodotto.

### 6.6 `gas.html`

- classe body: `sottovuoto-page gas-page frame-view-page`;
- struttura simile a sottovuoto;
- iframe fisso verso Medicair.

### 6.7 `cottura.html`

Pagina piu articolata tra le categorie.

Funzioni:

- pulsanti `.cottura-product-link` con `data-label`;
- testo "Processo selezionato: ...";
- viewer a stati multipli:
  - default image locale (`gallery/cucina-professionale-default.png`);
  - iframe esterno;
  - fallback card se host bloccato in embed (`rational-online.com`);
  - gallery detergenze locale (marquee con loop on/off) su `gallery/img_detergenti/*.jpg`.

JS specifico:

- normalizzazione host + regola `blockedEmbedHosts`;
- show/hide frame/fallback/default/detergenze;
- reset focus selezione e scroll-to-top dopo click.

### 6.8 `refrigerazione.html`

- classe body: `refrigerazione-page cottura-page frame-view-page`;
- stesso pattern "selector + viewer" di cottura, ma senza fallback host custom e senza detergenze;
- default image `gallery/home-refrigerazione-default.png`.

### 6.9 `imballaggi-industriali.html`

- classe body: `refrigerazione-page cottura-page imballaggi-page frame-view-page`;
- stesso pattern selector/viewer;
- include reset esplicito viewer su `pageshow` (`resetViewerDefault`);
- default image `gallery/home-imballaggi-default.png`.

### 6.10 `arredi-neutri.html`

- struttura tecnica simile a imballaggi/cottura;
- selector prodotti aggiornato con:
  - `ARREDI/NEUTRI AGMA`
  - `ARREDI/NEUTRI VIRTUS`
  - `ATTREZZATURE SIRMAN`
  - `ATTREZZATURE ROBOT-COUPE`
- fallback in-card "apertura in nuova scheda" per host che bloccano l'embed (`agma.it`, `robot-coupe.com`, `sirman.com`);
- viewer iniziale su immagine locale `gallery/Arredi-Neutri-home.png`.

### 6.11 `partners-references.html`

- pagina dedicata a partner e referenze, con 2 blocchi principali:
  - marquee loghi partner a scorrimento con controlli avanti/stop/indietro;
  - elenco clienti referenza con logo + micro-gallery immagini;
- i loghi partner sono gestiti via array JS locale (`partnersLogos`) e pescati da `gallery/img_loghi_partners/`;
- set loghi attuale nel marquee include anche:
  - `Logo-Minipac.png`
  - `Logo_Irinox.jpg`
  - `Logo_friulinox.jpg`
  - `Logo_Angelopo.jpg`

### 6.12 `usato.html`

Pagina altamente custom, distinta dalle altre:

- contiene **blocco CSS inline esteso** per card marquee e popup;
- contiene dataset JS inline `catalogItems` (molto grande) con:
  - thumbnail (`-300x300`) e viste multiple (`views`) remote;
  - descrizione e prezzo;
- render dinamico card nel marquee;
- popup modal con:
  - immagine principale;
  - thumbnails laterali cliccabili;
  - chiusura via bottone, backdrop, tasto `Esc`;
- toggle loop marquee (`data-loop` on/off).

Dipendenza esterna critica:

- molte immagini puntano a `https://www.macchinesottovuotousate.it/...`

Impatti:

- disponibilita e performance dipendono da dominio esterno;
- eventuali URL rotti impattano direttamente la UX.

---

## 7) CSS: architettura reale di `assets/css/site.css`

`site.css` e una stratificazione storica di regole:

- base iniziale (token, header nero, layout base);
- blocco "2026 CREATIVE REFRESH" con nuova identita visuale;
- serie di blocchi "2026 QUICK FIX N" che ridefiniscono layout/comportamenti.

### 7.1 Conseguenza principale

Nel progetto corrente il comportamento finale dipende fortemente da:

- ordine delle regole in fondo al file;
- uso diffuso di `!important`;
- override multipli dello stesso selettore.

Quindi: per cambiare stile in modo stabile, intervenire sulle regole finali pertinenti, non solo sulle prime definizioni.

### 7.2 Body class-based theming

Il CSS si appoggia a classi body per varianti pagina:

- `home-page`
- `contatti-page`
- `sottovuoto-page`
- `gas-page`
- `cottura-page`
- `refrigerazione-page`
- `imballaggi-page`
- `frame-view-page`

### 7.3 Frame view layout

Le pagine con `frame-view-page` hanno una gestione desktop specifica:

- viewport spesso "full-height" con `overflow: hidden` su desktop;
- hero compatto + viewer centralizzato;
- altezze forzate viewer/fallback (es. 520px desktop in quick-fix finali);
- su mobile rientra in flusso standard con altezze ridotte.

### 7.4 Nota di qualita codice CSS

E presente almeno una anomalia testuale (`` `n.card p ``) nelle prime sezioni del file: non blocca il sito ma indica accumulo da patch iterative.

---

## 8) JavaScript: mappa completa

### 8.1 JS condiviso

- al momento non e presente un JS condiviso attivo in `assets/js/`;
- la logica runtime e principalmente inline nelle singole pagine.

### 8.2 JS inline ripetuto

Ogni pagina include almeno il menu-toggle script (duplicazione volontaria ma ridondante).

### 8.3 JS inline specializzato

- `cottura.html`: viewer state machine + fallback host + detergenze marquee
- `refrigerazione.html` / `imballaggi-industriali.html`: selector -> iframe
- `arredi-neutri.html`: selector -> iframe + fallback host bloccati (`agma.it`, `robot-coupe.com`, `sirman.com`)
- `partners-references.html`: rendering marquee loghi + rendering lista referenze con gallerie locali
- `usato.html`: rendering catalogo + popup gallery + loop marquee

---

## 9) Dipendenze esterne (runtime)

### 9.1 Domini esterni caricati/collegati

- `orved.it`
- `rational-online.com`
- `unox.com`
- `angelopo.com`
- `robot-coupe.com`
- `irinoxprofessional.com`
- `friulinox.com`
- `medicairindustry.com`
- `minipack-torre.it`
- `poolindustriale.it`
- `agma.it`
- `virtusnet.de`
- `sirman.com`
- `macchinesottovuotousate.it` (molte immagini usato)

### 9.2 Cookie platform

- sono presenti pagine informative dedicate (`cookie.html`, `privacy.html`);
- non risulta al momento un runtime di auto-consenso cookie attivo nel frontend statico corrente.

---

## 10) Deploy e pubblicazione

Workflow: `.github/workflows/pages.yml`

- trigger: `push` su `main` o `master`, e `workflow_dispatch`;
- checkout repository;
- `actions/configure-pages@v5`;
- upload artifact con `path: .` (intera root);
- deploy con `actions/deploy-pages@v4`.

Non esiste build step: cio che e nel repository viene pubblicato cosi com'e.

---

## 11) Avvio in locale

Da root progetto:

```powershell
py -m http.server 8080
```

URL principali:

- `http://localhost:8080/index.htm` (homepage canonica)
- `http://localhost:8080/contatti.html`
- `http://localhost:8080/cottura.html`

Stop server: `Ctrl + C`

---

## 12) Regole operative di manutenzione

### 12.1 Source of truth pagine

- homepage primaria: `index.htm`
- `index.html` va mantenuto sincronizzato quando richiesto

### 12.2 Quando tocchi una pagina categoria

Verifica sempre:

1. CTA hero (`Contattaci`, `Torna alle soluzioni`)
2. label `Processo selezionato`
3. comportamento frame/default/fallback
4. stato mobile menu
5. caricamento immagini locali/esterne

### 12.3 Quando tocchi CSS

- cerca prima le regole finali "QUICK FIX" correlate;
- evita di modificare solo blocchi iniziali se poi vengono sovrascritti;
- controlla desktop e mobile (breakpoint 1100/900/640);
- attenzione a `frame-view-page` (layout full-height desktop).

### 12.4 Quando tocchi `usato.html`

- dataset `catalogItems` e embedded in pagina;
- ogni item deve avere almeno `image`, `description`, `price`, `views`;
- immagini esterne: verificare disponibilita URL.

---

## 13) Debito tecnico e rischi noti

1. forte duplicazione HTML/JS tra pagine (header/nav/menu script ripetuti)
2. CSS molto stratificato con override multipli e `!important`
3. molte dipendenze esterne non controllate (iframe e immagini usato)
4. pagine categoria con fallback host-specific richiedono manutenzione continua (liste `blockedEmbedHosts`)
5. presenza estesa di asset legacy non piu usati direttamente dalle pagine attive

---

## 14) Checklist rapida prima di chiudere una modifica

1. aprire `index.htm` + pagina toccata + `contatti.html`
2. test menu mobile (apri/chiudi + click link)
3. test viewer iframe/default/fallback (se categoria)
4. verificare assenza 404 su asset locali principali
5. verificare leggibilita home (6 card + sezione Attivita + contact strip)
6. verificare deploy workflow (se modifica su `main`/`master`)

---

## 15) Sintesi finale

Questo repository contiene un sito statico attivo relativamente semplice a livello di runtime, ma con una base CSS/asset storicamente stratificata.

La manutenzione efficace richiede:

- trattare `index.htm` come homepage di riferimento;
- considerare `assets/css/site.css` come file critico (ordine override);
- distinguere sempre tra cartelle attive e cartelle legacy;
- validare con test manuale pagina per pagina dopo ogni modifica.

---

## 16) Aggiornamenti recenti (Aprile 2026)

- pagina `partners-references.html` aggiornata con nuovi loghi nel marquee partner:
  - `Logo-Minipac.png` (sostituzione mini-pack precedente)
  - `Logo_Irinox.jpg`
  - `Logo_friulinox.jpg`
  - `Logo_Angelopo.jpg`
- in `arredi-neutri.html` inseriti i nuovi pulsanti:
  - `ATTREZZATURE SIRMAN` -> `https://www.sirman.com/it-IT`
  - `ARREDI/NEUTRI VIRTUS` -> `https://www.virtusnet.de/it/default.aspx`
- `ATTREZZATURE SIRMAN` allineato al comportamento di fallback di `ARREDI/NEUTRI AGMA`:
  - niente embed in iframe;
  - avviso interno "apertura in nuova scheda" con link esterno.
- stile pulsanti `Partners & References` e `Usato Garantito` portato in grigio chiaro con testo bianco;
- versione query CSS allineata a `site.css?v=50`.
