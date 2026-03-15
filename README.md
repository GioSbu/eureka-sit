# Eureka Packaging

Questo repository contiene il sito web statico di **Eureka Packaging**.

## Struttura

- `index.htm` — Homepage rinnovata
- `contatti.html` — Pagina contatti
- `sottovuoto.html`, `cottura.html`, `refrigerazione.html`, `gas.html`, `imballaggi-industriali.html`, `usato.html` — pagine servizio
- `assets/css/site.css` — stile condiviso tra le pagine
- `README.md` — documentazione del progetto
- `.github/workflows/pages.yml` — pipeline GitHub Pages

## Deploy su GitHub Pages

1. Carica il repository su GitHub (o verifica che sia già stato pushato su `origin`).
2. Vai su `Settings > Pages`.
3. Scegli `Source: GitHub Actions`.
4. Al push su `main` o `master`, parte automaticamente il workflow:
   - `.github/workflows/pages.yml`
5. L’URL standard del sito sarà:
   - `https://<username>.github.io/eureka-sit/`

> Nota: finché lavori su GitHub Pages, usi solo questa URL.
> In seguito, quando sarai pronto per Aruba, basterà esportare i file del repository nel tuo hosting Aruba.
