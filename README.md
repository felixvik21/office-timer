# Kontor-timer (kun for i dag)

En liten, statisk “one-day” nettside som viser hvor lenge Felix, Chriz og Viljen har vært på kontoret i dag, pluss en stor countdown til konsert.

## Kjør lokalt

```bash
npm install
npm run dev
```

## Deploy (GitHub Pages)

Prosjektet er satt opp for automatisk deploy til GitHub Pages via GitHub Actions.

- Workflow: `.github/workflows/deploy.yml`
- Trigger: push til `main`
- Output: `dist/` deployes til Pages

### Viktig: base-path (vanligste årsak til “white screen”)

Når appen hostes på GitHub Pages under `/<repo>/`, må Vite bygge med riktig `base`.

Dette prosjektet leser `VITE_BASE` i `vite.config.ts`:

- Lokalt: default `VITE_BASE="/"`
- GitHub Pages: `VITE_BASE="/<repo>/"`

Workflowen setter dette automatisk:

```yaml
VITE_BASE: /${{ github.event.repository.name }}/
```

Hvis du deployer manuelt eller repo-navnet er annerledes, sett `VITE_BASE` til riktig path.

## Endre starttider

Åpne `src/config.ts` og endre `people[].startTime` når folk kommer.

- `startTime: "08:00"` → personen har kommet
- `startTime: null` → personen har ikke kommet (viser “HH:MM”)

Konsert-tid er alltid `21:30` og kan også endres i samme fil (om du må).

## Notater

- Ingen backend, ingen eksterne dato-bibliotek.
- UI oppdaterer hvert sekund og rydder opp `setInterval` korrekt.
- Tid beregnes i Europe/Oslo via `Intl.DateTimeFormat`.

## Feilsøking (hvit skjerm)

1) Åpne DevTools → **Network**
	- Ser du 404 på `/<repo>/assets/*.js` eller `/assets/*.js`? Da er `base` feil.

2) Åpne DevTools → **Console**
	- Runtime-feil vises også på siden (ErrorBoundary), og logges med prefix `[Kontor-timer]`.

3) Sjekk at GitHub Pages bruker riktig source
	- Settings → Pages → “GitHub Actions”.
