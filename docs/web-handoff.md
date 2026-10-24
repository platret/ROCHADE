# Übergabe Web: Website und App verbinden

Für Francesco, Stand 24.10.2026. Hier steht, was die Website braucht, damit sie mit der App zusammenspielt. Drei Regeln, die nie brechen dürfen:

1. Die Website nutzt dasselbe Supabase-Projekt wie die App.
2. Eine Etappe wird nur mit `shiftPhase()` verschoben, danach folgt immer `replan()`.
3. Die Website zeigt bei jedem Haushalt den Zugangscode, damit die Verwaltung ihn auf den Brief drucken kann.

## 1. Was ist verbunden

- **Ein** gehostetes Supabase-Projekt: `https://vcbnhklyfrplcqimdxjj.supabase.co`. Schema, Seed und alle Daten liegen dort.
- Die App (`apps/mobile`) liest und schreibt dieses Projekt live über Realtime.
- Die Website muss **dasselbe Projekt** verwenden. Mit einem anderen Projekt oder einem lokalen Stack sieht sie andere Daten, und die Telefone reagieren nicht auf deine Klicks.
- So ist `apps/web` heute verdrahtet:
  - `src/lib/supabase.ts` erstellt den Client mit `createRochadeClient()` aus `@rochade/shared`. Fehlen die Variablen, ist der Client `null`, und `/verwaltung` zeigt «Supabase-Zugang fehlt».
  - `src/hooks/useProjectData.ts` lädt das erste Projekt mit `fetchProjectData()`, abonniert `subscribeToProject()` und lädt nach jeder Änderung neu (gebündelt, 150 ms).
  - `src/hooks/usePlan.ts`: «−1 Woche» und «+1 Woche» rufen `shiftPhase()` und dann `replan()` auf, «Plan neu berechnen» ruft nur `replan()` auf.
  - Die Startseite `/` zeigt Live-Zahlen aus demselben Projekt.

## 2. apps/web/.env

Genau diese zwei Zeilen:

```
VITE_SUPABASE_URL=https://vcbnhklyfrplcqimdxjj.supabase.co
VITE_SUPABASE_ANON_KEY=<Publishable key von Alex oder aus dem Supabase-Dashboard: Project Settings → API Keys → Publishable key (beginnt mit sb_publishable_)>
```

- Anlegen mit `cp apps/web/.env.example apps/web/.env`, dann die zwei Zeilen einsetzen und beim Key den Platzhalter durch den echten Wert ersetzen.
- Die Datei ist gitignored (`.env` und `.env.*`, nur `.env.example` liegt im Repo). Den echten Key nie in eine eingecheckte Datei, ein Ticket oder einen Prompt kopieren.
- Nach jeder Änderung `npm run dev` neu starten (aus dem Repo-Root: `npm run web`).
- Den Secret key (`sb_secret_…`, früher `service_role`) nie im Browser verwenden. Alles mit dem Präfix `VITE_` steht lesbar im ausgelieferten JavaScript. Der Publishable key ist dafür gemacht; was er darf, regeln die RLS-Policies. Der Name `…_ANON_KEY` ist historisch, der Publishable key ist der Nachfolger des anon key.
- Deployment auf Vercel: dieselben zwei Variablen in den Projekteinstellungen von Vercel setzen und neu deployen. `vercel.json` leitet alle Pfade auf `index.html` um, damit `/verwaltung` direkt aufrufbar ist.

## 3. Datenbank

Massgebend ist `supabase/schema.sql`. Dieselben Spalten stehen als TypeScript in `packages/shared/src/types.ts` (Zeilen) und `packages/shared/src/database.ts` (Insert- und Update-Typen). Das Demo-Projekt hat die ID `a0000000-0000-4000-8000-000000000001`.

| Tabelle | Spalten, die zählen | Wer schreibt |
| --- | --- | --- |
| `projects` | `id`, `name`, `city`, `admin_code` (neu, `text unique`, Verwaltungscode) | Seed |
| `phases` | `project_id`, `name`, `building`, `start_date`, `end_date` (`date`, Ende nie vor Start), `sort_order` | Website, nur über `shiftPhase()` |
| `flats` | `label`, `building`, `floor`, `rooms` (halbe Zimmer möglich), `step_free`, `is_temporary` (`true` = Rochade-Wohnung), `school_district` | Website |
| `households` | `name`, `members`, `home_flat_id` → `flats`, `needs_rooms`, `needs_step_free`, `school_district`, `note`, `invite_code` (neu, `text unique`, Zugangscode) | Website (Stammdaten), App (Wünsche) |
| `assignments` | `household_id` (unique, eine Zeile pro Haushalt), `temp_flat_id` → `flats`, `move_out`, `move_back`, `status` (`ok`, `conflict`, `open`), `conflict_reason`, `updated_at` | nur `replan()` |

Seed: Siedlung Sonnenhalde in Zürich, 3 Etappen (Haus A, B, C), 16 Wohnungen, davon 5 Rochade-Wohnungen (Haus D und E), 11 Haushalte und genau ein Konflikt: Herr Brunner in Etappe 3 (01.09.–30.11.2027). Die Anzeigetexte für `status` liefert `statusLabels`: Zugeteilt, Konflikt, Offen.

**RLS (nur Demo):** Auf allen fünf Tabellen aktiv. Die Policies erlauben dem Publishable key `select`, `insert` und `update` auf jede Zeile, also kann jeder mit dem Key auch alle Codes lesen. Für die Demo ist das in Ordnung, vor echtem Einsatz müssen die Policies ersetzt werden. Eine `delete`-Policy gibt es nicht: `delete()` meldet keinen Fehler, löscht aber nichts.

**Realtime:** `phases`, `households` und `assignments` sind in der Publication `supabase_realtime`, mit `replica identity full`. Jedes Event enthält also die alte und die neue Zeile, deshalb kann die App «alt → neu» zeigen. Ein Trigger verwirft Updates ohne echte Änderung, damit nur echte Änderungen Events auslösen. `projects` und `flats` sind nicht live, nach Änderungen dort selbst neu laden.

**Migration** `supabase/migrations/20261024_invite_codes.sql`: Sie fügt `projects.admin_code` und `households.invite_code` hinzu (`add column if not exists`), setzt die Demo-Codes über die festen Seed-IDs und endet mit einer Kontrollabfrage. Sie ist idempotent und darf beliebig oft laufen. Ob sie im gehosteten Projekt schon drin ist, zeigt eine Abfrage im SQL Editor:

```sql
select name, invite_code from public.households order by name;
```

- 11 Zeilen mit Codes: Die Migration ist drin, nichts zu tun.
- Fehler `column "invite_code" does not exist` oder leere Codes: die Migration im SQL Editor ausführen und die Abfrage wiederholen.

Ein frisch eingespieltes `schema.sql` mit `seed.sql` enthält die Codes bereits. Achtung: `schema.sql` löscht alle Tabellen und legt sie neu an, also nur als bewussten Demo-Reset verwenden.

## 4. Was die Website tun muss

Darauf verlässt sich die App:

1. **Etappe nur mit `shiftPhase()` verschieben, danach immer `replan()`.**

   ```ts
   import { replan, shiftPhase } from '@rochade/shared'

   await shiftPhase(client, phase, 7)
   const { changed, result } = await replan(client, projectId)
   ```

   `shiftPhase()` verschiebt `start_date` und `end_date` um die angegebenen Tage. `replan()` lädt das Projekt, rechnet mit dem Solver alle Zuteilungen neu und schreibt nur die geänderten Zeilen in `assignments`. Genau diese Änderungen kommen per Realtime auf die Telefone (Banner «Dein Plan wurde aktualisiert»). Ohne `replan()` passen Etappen und Zuteilungen nicht mehr zusammen, und die Telefone zeigen einen veralteten Plan. `usePlan` macht das schon richtig, bitte wiederverwenden. Für einen Datumspicker: `shiftPhase(client, phase, daysBetween(phase.start_date, neuerStart))`. Die Dauer einer Etappe kann `shiftPhase()` nicht ändern, dafür zuerst mit Alex eine Funktion in `packages/shared` absprechen.
2. **`assignments` nie von Hand bearbeiten.** Kein `insert`, `update` oder `upsert` aus der Website, auch nicht für die Demo. Die Tabelle gehört dem Solver. `replan()` rechnet deterministisch und schreibt nur Unterschiede, mehrfaches Aufrufen schadet also nicht.
3. **Zugangscode jedes Haushalts zeigen** (`households.invite_code`): bei jedem Haushalt in `/verwaltung`, in `font-mono`, mit Kopierknopf und am besten mit einer Druckansicht für den Brief. Prüfe, ob das schon da ist, sonst ist es deine erste Aufgabe. Die App erwartet genau 6 Zeichen aus Grossbuchstaben und Ziffern, gespeichert in Grossbuchstaben. Die Demo-Codes verzichten auf verwechselbare Zeichen (0, O, 1, I, L), neue Codes bitte genauso. Neue Codes müssen eindeutig sein und dürfen nie dem Verwaltungscode entsprechen, denn die App sucht zuerst bei den Haushalten.
4. **Verwaltungscode zeigen** (`projects.admin_code`, Demo `V7Q3KD`): Er öffnet in der App die Übersicht «Verwaltung (nur Ansicht)». Er gehört gut sichtbar in den Kopf von `/verwaltung`, aber nie auf einen Brief an Haushalte.
5. **Wünsche anzeigen und danach neu rechnen.** Die App schreibt mit `updateHouseholdNeeds()` die Felder `needs_rooms`, `needs_step_free`, `school_district` und `note` in `households`, rechnet aber nicht neu. Die Website zeigt alle vier Werte (die Tabelle zeigt bisher nur Zimmer und hindernisfrei) und ruft nach einer Änderung `replan()` auf: automatisch, sobald ein Realtime-Event auf `households` eintrifft (kurz bündeln), oder mit dem Hinweis «Wünsche geändert» und dem Knopf «Plan neu berechnen». Dasselbe gilt, wenn die Website selbst Haushalte oder Wohnungen ändert.
6. **Live bleiben** mit `subscribeToProject(client, projectId, (table, change) => …)`. Der Rückgabewert meldet das Abo ab und gehört in den Cleanup von `useEffect`. Nach einem Event neu laden wie `useProjectData`, statt Events von Hand in den State zu mischen.

## 5. Wie die App funktioniert

- **Intro**: vier kurze Seiten beim ersten Start («Sanieren, ohne jemanden rauszuwerfen.», «Dein Umzug auf einen Blick», «Live informiert», «Dein Code, dein Plan»), überspringbar.
- **Zugangscode**: sechs Zeichen aus dem Brief, kein Konto, kein Passwort, Gross- und Kleinschreibung egal. Die App sucht zuerst `households.invite_code`, dann `projects.admin_code`, und merkt sich die Anmeldung auf dem Gerät. «Demo-Haushalt wählen» öffnet die Liste aller Demo-Haushalte.
- **Willkommen-Bestätigung**: Nach einem gültigen Code bestätigt die App, wer angemeldet ist, und öffnet dann den Plan. Ein falscher Code zeigt «Dieser Code ist nicht gültig. Prüfe die sechs Zeichen im Brief.»
- **Mein Umzug**: Statuskarte (Zugeteilt, Konflikt mit genauem Grund, Offen), Ablauf Auszug → Rochade-Wohnung → Rückkehr, Checkliste. Ändert sich die Zuteilung, erscheint innerhalb einer Sekunde das Live-Banner «Dein Plan wurde aktualisiert» mit altem und neuem Datum, dazu Haptik.
- **Meine Wünsche**: Zimmer (in halben Schritten), hindernisfrei, Schulkreis und Notiz, direkt in `households` gespeichert.
- **Siedlung**: Etappen mit Daten und die Umzugsplan-Timeline aller Haushalte, live.

Mit dem Verwaltungscode zeigt die App die **Verwaltung (nur Ansicht)**: Zähler, alle Haushalte mit Status und Grund, Etappen, alles live. Bearbeitet wird nur auf der Website, darauf weist schon der Code-Bildschirm hin: «Verwaltung? Der Plan wird im Web geführt.»

## 6. Demo-Codes

| Haushalt | Wohnung | Etappe | Zugangscode | Stand im Seed |
| --- | --- | --- | --- | --- |
| Familie Keller | Whg. A.21 | 1 | `7KW4PD` | Zugeteilt |
| Frau Schmid | Whg. A.01 | 1 | `3HTX9M` | Zugeteilt |
| Familie Bianchi | Whg. A.22 | 1 | `Q8RZ2N` | Zugeteilt |
| Herr Zimmermann | Whg. A.12 | 1 | `5MPC7E` | Zugeteilt |
| Familie Kaya | Whg. A.31 | 1 | `R2V6KX` | Zugeteilt |
| Frau Meier | Whg. B.01 | 2 | `9DQ3TW` | Zugeteilt |
| Herr und Frau Aeschbacher | Whg. B.02 | 2 | `X6N8HB` | Zugeteilt |
| Familie Oliveira | Whg. B.21 | 2 | `4PWY7C` | Zugeteilt |
| **Herr Brunner** | Whg. C.01 | 3 | `B3H7QK` | **Konflikt** (Demo-Haushalt) |
| Frau Gerber | Whg. C.11 | 3 | `6ZTR4M` | Zugeteilt |
| Familie Steiner | Whg. C.22 | 3 | `P7XK2D` | Zugeteilt |
| **Verwaltung** (Siedlung Sonnenhalde) | – | – | `V7Q3KD` | Übersicht, nur Ansicht |

## 7. Prompt für deinen Coding-Assistenten

In Claude oder Cursor einfügen, bevor du an der Website arbeitest:

```text
Du hilfst mir an der Website von ROCHADE (ZentralHack 2026). ROCHADE plant, wer bei einer Sanierung wann in welche Rochade-Wohnung zieht, und zeigt den Bewohnenden ihren Umzug live in einer App.

Repo (npm workspaces):
- apps/web: Vite 8, React 19, Tailwind 4, react-router. Mein Bereich: src/verwaltung, src/components, src/hooks, src/lib. Routen: / (Startseite) und /verwaltung (Dashboard der Verwaltung).
- apps/mobile: Expo-App für die Bewohnenden. Nicht ändern.
- packages/shared: Paket @rochade/shared mit Typen, Supabase-Client und Queries, Solver, Design-Tokens und Demo-Daten. Nicht ändern; wenn etwas fehlt, frag mich.
- supabase: schema.sql, seed.sql, migrations. Ein einziges gehostetes Supabase-Projekt, das auch die App live nutzt.

Setup: apps/web/.env enthält VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY (Publishable key, beginnt mit sb_publishable_). Den Secret key nie verwenden, Keys nie in Code, Commits oder Logs. Keinen eigenen Client erstellen, sondern supabase aus src/lib/supabase.ts nehmen; der ist null, wenn die Variablen fehlen, dann zeigt die Seite SetupNotice. Nach Änderungen an .env den Dev-Server neu starten.

Shared-Paket: alles aus '@rochade/shared' importieren, nichts duplizieren. Typen: Project, Phase, Flat, Household, Assignment, ProjectData. Lesen: fetchProjects, fetchProjectData. Schreiben: shiftPhase, replan, updateHouseholdNeeds. Live: subscribeToProject. Texte und Formate: statusLabels, formatDate, formatPeriod, daysBetween. Vorhandene Hooks wiederverwenden: useProjectData (laden und live halten) und usePlan (verschieben und neu rechnen).

Vertrag mit der App, nie brechen:
1. Eine Etappe nur mit shiftPhase(client, phase, tage) verschieben und danach immer await replan(client, projectId). Für einen Datumspicker: tage = daysBetween(phase.start_date, neuerStart).
2. Die Tabelle assignments nie direkt schreiben. Nur replan() schreibt sie: Es rechnet alles neu und schreibt nur Unterschiede. Die Telefone reagieren auf genau diese Änderungen.
3. Nach jeder Änderung an households oder flats ebenfalls replan() aufrufen. Die App schreibt die Wünsche (needs_rooms, needs_step_free, school_district, note), ohne neu zu rechnen; die Website zeigt sie an und rechnet nach einem households-Event neu.
4. Bei jedem Haushalt den Zugangscode households.invite_code zeigen (font-mono, Kopierknopf, druckbar für den Brief der Verwaltung). Den Verwaltungscode projects.admin_code nur für die Verwaltung zeigen.
5. Löschen ist mit dem Publishable key nicht möglich (keine RLS-Policy), also keine Löschfunktion bauen.

Realtime: const stop = subscribeToProject(client, projectId, (table, change) => { ... }) meldet Änderungen an phases, households und assignments. stop() im Cleanup von useEffect aufrufen. Nach einem Event gebündelt neu laden wie useProjectData, nicht von Hand in den State mischen. projects und flats sind nicht live.

Styling: nur Tailwind-Utilities aus den Tokens. Quelle ist packages/shared/src/tokens.ts; apps/web/scripts/tokens-css.ts erzeugt daraus bei dev, build und typecheck die Datei src/styles/tokens.css (generiert, nicht von Hand ändern). Farbnamen für bg-, text-, border-, ring- und so weiter: paper, surface, surface-sunken, line, line-strong, ink, ink-muted, orange, orange-strong, on-orange, orange-soft, slate, slate-soft, success, success-soft, danger, danger-soft. Schriftgrössen: text-display, text-h1, text-h2, text-h3, text-body, text-body-sm, text-label, text-caption. font-sans (Manrope) für Text, font-mono (JetBrains Mono) nur für Daten, Wohnungsnummern und Codes. Radien: rounded-sm, rounded-md, rounded-lg. Die Standardfarben von Tailwind sind abgeschaltet (kein bg-white, kein text-gray-500). Nie Hex-, rgb- oder hsl-Werte, auch nicht inline. Dark Mode kommt automatisch über die Tokens, keine dark:-Varianten für Farben. Orange ist der einzige Akzent und deckt höchstens zehn Prozent der Fläche. Vorhandene Komponenten nutzen: Page, Section, Card, Button, Badge, StatusBadge.

Sprache: alle UI-Texte auf Deutsch mit Schweizer Rechtschreibung, also immer ss und nie Eszett ("gross", "heisst", "Strasse"). Daten als 01.09.2027. Knöpfe beginnen mit einem Verb ("Code kopieren", "Plan neu berechnen"). Die Menschen heissen "Haushalte" oder "Bewohnende".

Code: TypeScript strict, keine Kommentare, kleine Dateien, klare Namen. Vor jedem Commit im Repo-Root npm run typecheck und npm test ausführen, dazu npm run build -w apps/web.

Demo-Moment, muss immer funktionieren: In /verwaltung bei Etappe 3 zweimal "+1 Woche" klicken. Ausgangslage: Etappe 3 läuft vom 01.09. bis 30.11.2027. Herr Brunner braucht eine hindernisfreie 2-Zimmer-Wohnung und steht im Konflikt, weil Etappe 2 beide hindernisfreien Rochade-Wohnungen bis 12.09.2027 belegt. Nach dem ersten Klick (Start 08.09.) bleibt der Konflikt, nach dem zweiten (Start 15.09.) bekommt er Whg. D.01, und sein Telefon zeigt innerhalb einer Sekunde "Dein Plan wurde aktualisiert" und den Status Zugeteilt. Zweimal "−1 Woche" stellt den Ausgangszustand wieder her. Teste jede Änderung an /verwaltung mit diesem Ablauf.
```

## 8. Checkliste vor der Demo

- [ ] `apps/web/.env` zeigt auf `https://vcbnhklyfrplcqimdxjj.supabase.co` mit dem Publishable key, der Dev-Server ist neu gestartet, und `/verwaltung` lädt Etappen und Tabelle ohne «Supabase-Zugang fehlt».
- [ ] Die Kontrollabfrage im SQL Editor liefert 11 Haushalte mit Zugangscode (sonst die Migration ausführen), und `/verwaltung` zeigt die Zugangscodes und den Verwaltungscode.
- [ ] Ausgangszustand stimmt: Etappe 3 = 01.09.–30.11.2027, genau ein Konflikt (Herr Brunner). Sonst mit «−1 Woche» oder «+1 Woche» zurückstellen oder als Reset `schema.sql` und danach `seed.sql` neu einspielen.
- [ ] Das Telefon ist mit `B3H7QK` als Herr Brunner angemeldet, Mein Umzug zeigt den Konflikt mit Grund. Ein zweites Gerät oder der Simulator ist mit `V7Q3KD` in der Verwaltungs-Übersicht.
- [ ] Generalprobe: Etappe 3 zweimal «+1 Woche», das Telefon zeigt das Banner und «Zugeteilt». Dann zweimal «−1 Woche», der Konflikt ist zurück.
- [ ] Laptop und Telefon sind im selben stabilen WLAN, der Handy-Hotspot ist als Fallback bereit.
