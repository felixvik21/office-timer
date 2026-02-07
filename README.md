# Kontor-timer (kun for i dag)

En liten, statisk “one-day” nettside som viser hvor lenge Felix, Chriz og Viljen har vært på kontoret i dag, pluss en stor countdown til konsert.

## Kjør lokalt

```bash
npm install
npm run dev
```

## Endre starttider

Åpne `src/config.ts` og endre `people[].startTime` når folk kommer.

- `startTime: "08:00"` → personen har kommet
- `startTime: null` → personen har ikke kommet (viser “HH:MM”)

Konsert-tid er alltid `21:30` og kan også endres i samme fil (om du må).

## Notater

- Ingen backend, ingen eksterne dato-bibliotek.
- UI oppdaterer hvert sekund og rydder opp `setInterval` korrekt.
- Tid beregnes i Europe/Oslo via `Intl.DateTimeFormat`.
