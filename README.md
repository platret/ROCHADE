# ROCHADE

**Sanieren, ohne jemanden rauszuwerfen.**

When a housing cooperative renovates a building, residents move into temporary flats (Rochade-Wohnungen) for months. ROCHADE computes who moves where and when, rebuilds the plan when a construction phase shifts, and explains exactly what is missing when no plan fits. Residents see their own move on the phone and get a live update the moment the administration changes a date.

ZentralHack 2026, EntrepreneurSkills Challenge, SDG 11. Final pitch and MVP upload: Saturday 16:30.

## What is in the repo

```
apps/mobile        Expo SDK 58 app for residents (Expo Router, native tabs, realtime)
apps/web           Vite + React + Tailwind v4 skeleton for the administration
packages/shared    Types, Supabase client and queries, solver, design tokens, demo data
supabase/          schema.sql and seed.sql for the Supabase SQL editor
docs/              design-notes.md (Mobbin references per screen)
```

One Supabase database, one shared TypeScript package. Types, queries, colours and the solver live only in `packages/shared`; both apps import them.

## Prerequisites

- Node 24 LTS (Expo supports even Node versions only) and npm 11
- Xcode 26 with an iPhone 17 simulator, or Expo Go 58 on an iPhone (iOS 16.4+)
- A Supabase project (URL and anon key from Alex)
- Optional: Docker Desktop for a local Supabase stack

## Setup

### 1. Database

Open the Supabase dashboard, SQL Editor. Paste `supabase/schema.sql`, run it. Then paste `supabase/seed.sql`, run it.

`schema.sql` drops and recreates the five tables, enables Realtime on `phases`, `households` and `assignments`, and adds demo-only Row Level Security policies that let the anon key read and write everything. Replace those policies before any real use.

`seed.sql` is generated from `packages/shared/src/demo/seed-data.ts` with `npm run seed:sql`. It contains Siedlung Sonnenhalde in Zürich: 3 phases, 11 households, 16 flats of which 5 are Rochade-Wohnungen, and the computed plan with exactly one conflict (Herr Brunner, Etappe 3).

### 2. Environment files

```
cp apps/mobile/.env.example apps/mobile/.env
cp apps/web/.env.example apps/web/.env
```

Fill in the project URL and the anon key. Never put the service_role key into either file. Restart the dev servers after changing them.

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

Press `i` for the iOS simulator or scan the QR code with Expo Go. On a physical iPhone you must be signed in to the same Expo account in the CLI (`npx expo login`) and in Expo Go.

Development build on the simulator (no Apple login needed):

```
cd apps/mobile
npx expo run:ios
```

### 6. Run the website

```
npm run web
```

Opens on http://localhost:5173. The page lists the phases with "−1 Woche / +1 Woche" controls, runs the solver after every shift and shows the live assignment table.

### 7. The demo moment

1. Phone: sign in as Herr Brunner. Mein Umzug shows the conflict with the exact reason.
2. Laptop: click "+1 Woche" on Etappe 3. Still a conflict.
3. Laptop: click "+1 Woche" again. The phone updates within a second: banner "Dein Plan wurde aktualisiert", flash on the changed dates, status Zugeteilt, haptic.

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

Manrope for all text, JetBrains Mono only for dates and flat numbers. Orange is the only accent and covers at most a tenth of a screen. Fixed timeline meanings: grey = in own flat, slate = Rochade-Wohnung, orange = Umzug day, orange outline = back in renovated flat, red outline = Konflikt.

See `docs/design-notes.md` for the Mobbin references used for each screen.

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

With Docker running:

```
npx supabase start
docker exec -i supabase_db_ROCHADE psql -U postgres -d postgres -v ON_ERROR_STOP=1 < supabase/schema.sql
docker exec -i supabase_db_ROCHADE psql -U postgres -d postgres -v ON_ERROR_STOP=1 < supabase/seed.sql
npx supabase status
```

Use the printed API URL and anon key in the `.env` files. `npx supabase stop` shuts it down.

## Conventions

- TypeScript strict everywhere, no code comments, small files, clear names.
- All UI text in German with Swiss spelling (ss, never ß). Dates as 01.03.2027. Buttons start with a verb.
- Residents are "Bewohnende" or "Haushalte".
- No user accounts yet: the app remembers the chosen household on the device.
