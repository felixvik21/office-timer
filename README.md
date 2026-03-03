# Vors-countdown (ukeplan)

En liten, statisk nettside som teller ned til **Helga Singsaker Vors** (6.3.26), og viser en **ukesplan delt inn i dager** (nedtelling starter mandag 2.3.26).

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

## Endre event/ukeplan

Åpne `src/config.ts` og juster:

- `EVENT_START_ISO` (starttidspunkt for vors)
- `COUNTDOWN_START_ISO` (når nedtellingen/uka starter)
- `weekPlan` (seksjoner per dag)

Tips: `EVENT_START_ISO` bruker eksplisitt timezone-offset (f.eks. `+01:00`) for å være robust hvis skjermen står i feil timezone.

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
