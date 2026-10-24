# ROCHADE

**Sanieren, ohne jemanden rauszuwerfen.**

When a housing cooperative renovates a building, residents move into temporary flats (Rochade-Wohnungen) for months. ROCHADE computes who moves where and when, rebuilds the plan when a construction phase shifts, and explains exactly what is missing when no plan fits. Residents see their own move on the phone and get a live update the moment the administration changes a date.

ZentralHack 2026, EntrepreneurSkills Challenge, SDG 11. Final pitch and MVP upload: Saturday 16:30.

## Stand (für Francesco)

Alles liegt auf `main`, jede Änderung ist gepusht. Alle Checks grün: `npm run typecheck`, `npm test` (23 Solver-Tests), Web-Build, iOS-Bundle.

- **Supabase**: Schema und Seed sind im gehosteten Projekt eingespielt (11 Haushalte, Etappe 3 = 01.09.–30.11.2027, Herr Brunner im Konflikt). Keys stehen bei Alex in `apps/mobile/.env` und `apps/web/.env` (nicht im Repo). `schema.sql` und `seed.sql` dürfen jederzeit neu eingespielt werden.
- **Shared** (`packages/shared`): Solver (`solve`, `replan`), Typen, Supabase-Queries, Design-Tokens, Demo-Fixture.
- **App** (`apps/mobile`): fertig und auf dem iOS-Simulator gegen die echte Datenbank verifiziert. Anmelden-Picker, Mein Umzug (Statuskarte, Ablauf, Live-Banner mit altem und neuem Datum, Haptik, Checkliste), Meine Wünsche (natives Formular-Sheet), Siedlung (Etappen, Umzugsplan-Timeline), Rochade-Wohnung-Sheet mit Kalenderexport und Teilen, Verwaltungs-Übersicht, Offline-Cache, Dark Mode, Dynamic Type.
- **Web** (`apps/web`): `/` ist die animierte Startseite (3D-Marke, Shader-Hintergrund, «Der Moment»-Animation, Live-Zahlen aus Supabase). `/verwaltung` ist das Dashboard-Skelett: Etappen mit −1/+1 Woche, Replan, Live-Tabelle der Zuteilungen. Dein Spielfeld ist `apps/web/src/verwaltung` und `apps/web/src/components`; Farben nur über die Tailwind-Tokens (`bg-paper`, `text-ink`, …), keine Hex-Werte.
- **Nächste Schritte Web**: Dashboard-Design, Haushalte und Wohnungen bearbeiten, Datumspicker für Etappen, Konfliktliste mit Vorschlägen.

## Demo-Ablauf (der Moment)

1. Laptop: `npm run web`, dann http://localhost:5173/verwaltung. Telefon: Expo Go, als **Herr Brunner** anmelden. Mein Umzug zeigt den Konflikt mit dem genauen Grund.
2. Laptop: bei Etappe 3 auf **+1 Woche**. Der Plan wird neu berechnet, Brunner bleibt im Konflikt (das Telefon zeigt das Banner mit dem neuen Datum).
3. Laptop: noch einmal **+1 Woche**. Innerhalb einer Sekunde: Banner «Dein Plan wurde aktualisiert», die Daten blinken kurz auf, Status **Zugeteilt**, Haptik.
4. Zurück mit **−1 Woche** zweimal, der Konflikt kommt zurück. Als **Verwaltung** angemeldet zeigt das Telefon die Übersicht mit Zählern und Liste, die ebenfalls live mitgeht.

Fallback bei schlechtem WLAN: Handy-Hotspot für Laptop und Telefon. Die App startet aus dem Cache und zeigt «Offline · Stand …», bis die Verbindung zurück ist.

## What is in the repo

```
apps/mobile        Expo SDK 58 app for residents (Expo Router, native tabs, realtime)
apps/web           Vite 8 + React 19 + Tailwind 4: landing page (/) and administration dashboard (/verwaltung)
packages/shared    Types, Supabase client and queries, solver, design tokens, demo data
supabase/          schema.sql, seed.sql, config.toml for a local stack
docs/              design-notes.md (Mobbin references per screen and for the landing page)
```

One Supabase database, one shared TypeScript package. Types, queries, colours and the solver live only in `packages/shared`; both apps import them.

## Prerequisites

- Node 24 LTS (Expo supports even Node versions only; 25 works with warnings) and npm 11
- Xcode 26 with an iPhone 17 simulator, or Expo Go 58 on an iPhone (iOS 16.4+)
- A Supabase project (URL and publishable key from Alex)
- Optional: Docker Desktop for a local Supabase stack

## Setup

### 1. Database

Open the Supabase dashboard, SQL Editor. Paste `supabase/schema.sql`, run it. Then paste `supabase/seed.sql`, run it.

`schema.sql` drops and recreates the five tables, enables Realtime on `phases`, `households` and `assignments`, skips no-op updates with a trigger, and adds demo-only Row Level Security policies that let the anon key read and write everything. Replace those policies before any real use.

`seed.sql` is generated from `packages/shared/src/demo/seed-data.ts` with `npm run seed:sql`. It contains Siedlung Sonnenhalde in Zürich: 3 phases, 11 households, 16 flats of which 5 are Rochade-Wohnungen, and the computed plan with exactly one conflict (Herr Brunner, Etappe 3).

### 2. Environment files

```
cp apps/mobile/.env.example apps/mobile/.env
cp apps/web/.env.example apps/web/.env
```

Fill in the project URL and the publishable key (`sb_publishable_…`, Supabase's new name for the anon key). Never put the secret key into either file. Expo and Vite reload the files automatically; the running app needs a reload afterwards.

### 3. Install

```
npm install
```

### 4. Tests and typecheck

```
npm test
npm run typecheck
```

The solver tests prove the demo: with the seeded dates there is exactly one conflict, shifting Etappe 3 by two weeks resolves it, shifting by one week does not.

### 5. Run the app

Expo Go:

```
npm run mobile
```

Press `i` for the iOS simulator. On a physical iPhone: Expo Go 58 from the App Store, signed in to the **same Expo account** as the CLI (`npx expo login`), same Wi-Fi, then "Enter URL manually" with the `exp://<LAN-IP>:8081` address that the CLI prints.

Development build on the simulator (no Apple login needed):

```
cd apps/mobile
npx expo run:ios
```

### 6. Run the website

```
npm run web
```

Opens http://localhost:5173 (landing page) and http://localhost:5173/verwaltung (dashboard).

## The app in detail

- **Anmelden als**: demo picker from the database, choice stored on the device (no accounts yet).
- **Mein Umzug**: status card (Zugeteilt / Konflikt / Offen with the exact reason), three-step journey (Auszug with countdown, Rochade-Wohnung, Rückkehr), live banner "Dein Plan wurde aktualisiert" with old and new values, orange-soft flash on changed values, haptics, checklist "Deine nächsten Schritte" with dates derived from the move (stored on the device).
- **Rochade-Wohnung sheet**: flat details, "In Kalender eintragen" (two all-day events via expo-calendar), "Plan teilen" (share sheet).
- **Meine Wünsche**: rooms (half rooms), step-free, school district, note; saved to `households` in a native form sheet.
- **Siedlung**: phases with dates and the Umzugsplan timeline of all households (short labels for privacy) with the fixed colour meanings: grey = in own flat, slate = Rochade-Wohnung, orange tick = Umzug day, orange outline = back in renovated flat, red outline = Konflikt.
- **Verwaltung (nur Ansicht)**: overview with counts, all households with status and reason, phases; updates live.
- **Resilience**: last plan cached on the device, 15 s timeout, automatic retries, offline strip with "Erneut laden", connection test in the error state.

## How the solver works

`solve(input)` in `packages/shared/src/solver` is pure TypeScript.

- A household is away from `start_date` to `end_date` of the phase that renovates its home building.
- Hard rules: enough rooms, step-free when needed, no two households in the same temporary flat with overlapping periods, a temporary flat is unavailable while its own building is renovated.
- Soft preferences: same school district as home, smallest flat that fits, keep step-free flats for those who need them.
- Backtracking search with branch and bound, households ordered most-constrained first. Fewest conflicts win; among equal plans the household that moves latest is left out first ("wer früher auszieht, hat Vorrang"). The output is deterministic.
- Every unplaced household gets a precise reason, for example "Für Herrn Brunner fehlt vom 01.09.2027 bis 30.11.2027 eine hindernisfreie 2-Zimmer-Wohnung."

`replan(client, projectId)` loads the project, runs `solve` and upserts only the assignment rows that changed, so Realtime only fires for real changes.

## Design system

Tokens are in `packages/shared/src/tokens.ts`. The mobile app reads them through `useTheme()`. The web app generates `src/styles/tokens.css` from them before every dev or build run, so Tailwind utilities like `bg-paper` or `text-ink` switch with the system colour scheme. Never write a hex colour in an app.

Manrope for all text, JetBrains Mono only for dates and flat numbers. Orange is the only accent and covers at most a tenth of a screen. See `docs/design-notes.md` for the Mobbin references used for each screen and for the landing page.

## TestFlight build with EAS (later)

`apps/mobile/eas.json` has the `development`, `preview` and `production` profiles.

```
cd apps/mobile
npx eas-cli@latest login
npx eas-cli@latest build --platform ios --profile preview
npx eas-cli@latest build --platform ios --profile production
npx eas-cli@latest submit --platform ios
```

The first build asks for the Apple account and creates the certificates.

## Local Supabase (optional)

With Docker running (`supabase/config.toml` applies `schema.sql` and `seed.sql` on start, API on port 55321):

```
npx supabase start
npx supabase status
```

Pass the printed values to a dev server explicitly instead of editing `.env`, for example `EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:55321 EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon> npx expo start`. `npx supabase stop` shuts it down.

## Troubleshooting

- "Project is incompatible with this version of Expo Go": update Expo Go to version 58.
- "Could not connect to the server" on the phone: the bundle points at a URL the phone cannot reach. Check `apps/mobile/.env`, restart `expo start --clear`, reload the app. The error card shows the server host and a connection test.
- Expo Go on a physical device needs the same Expo account in the CLI and in Expo Go.
- `expo start --localhost` on Node 25 binds IPv6 only; use the default LAN mode.

## Conventions

- TypeScript strict everywhere, no code comments, small files, clear names.
- All UI text in German with Swiss spelling (ss, never ß). Dates as 01.03.2027. Buttons start with a verb.
- Residents are "Bewohnende" or "Haushalte"; the app addresses them as "du".
- No user accounts yet: the app remembers the chosen household on the device.
