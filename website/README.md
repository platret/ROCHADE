# ROCHADE Website (statisch)

Landingpage und Prototyp von Francesco. Reines HTML, CSS und ES-Module, kein Build nötig.

```
python3 -m http.server 8765 --directory website
```

- `index.html` Landingpage: Hero mit der live laufenden Siedlung (Monats-Scrubber), gepinnter Abschnitt «So funktioniert es» (die drei Schritte steuern den Plan), Dashboard-Mockup mit echtem Planer und Mini-Gantt, Abschnitt für Bewohnende, Problem in Zahlen (dunkles Band), Rechtslage und Parteien, Vergleich Leerkündigung/Rochade, Zielgruppen, CTA, 16 Quellen
- `app.html` Prototyp: Ansicht «Erfassen» (Liegenschaften mit Wohnungen, Haushalte mit Bedarf, externe Rochade-Wohnungen eingeben, `js/edit.js` + `js/views/input.js`), die Etappen werden aus den Liegenschaften automatisch geplant (`js/schedule.js`: Reihenfolge wie erfasst, Dauer nach Anzahl Wohnungen, Puffer) und der Plan wird bei jeder Änderung neu berechnet (`js/planner.js`); bei Konflikten lädt «Status» echte Inserate aus der öffentlichen Flatfox-API im Umkreis der Siedlung (`js/flatfox.js`, nur Gebiet, Kategorie und Zimmerzahl verlassen den Browser; `serve.py` leitet `/api/flatfox/` an flatfox.ch weiter, weil der Pin-Endpunkt keine CORS-Header sendet) und gleicht sie mit dem Bedarf ab (`js/listings.js`); Beispielsiedlung mit 24 Haushalten und 3 Etappen; Tests mit `npm test` (Planer und Erfassen)
- `assets/` Logo «König und Turm überkreuz» als SVG (farbig, weiss, auf Orange, Favicon, Lockup), App-Screenshots in 640 px als WebP und PNG
- `css/landing.css` und `js/landing.js` gehören nur zur Landingpage; `css/stage.css` und `js/stage.js` teilen sich Landingpage und Prototyp (Option `maxScale` nur für die Landingpage)
- Motion: Scroll-gesteuerte Animationen nur mit `@supports`, alles respektiert `prefers-reduced-motion`; keine Cookies, kein Tracking, keine Drittskripte

Farben und Typografie-Tokens in `css/tokens.css` entsprechen `packages/shared/src/tokens.ts`.

## Datenbank

Die Website kann ein Projekt aus Alex' Supabase-Datenbank laden (dieselbe wie die App). Die Verwaltung meldet sich mit dem sechsstelligen **Verwaltungscode** des Projekts an (Demo «Siedlung Sonnenhalde»: `V7Q3KD`, Testdaten «Siedlung Brunnenwiese»: `W4RK7N`); jeder Haushalt hat einen eigenen sechsstelligen **Einladungscode** für die App, den die Verwaltung auf den Brief druckt. Codes bestehen aus `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (ohne 0, O, 1, I, L), sind in der ganzen Tabelle eindeutig und nie gleich dem Verwaltungscode.

- `js/env.js` (nicht eingecheckt, `.gitignore`) exportiert `SUPABASE_URL` und `SUPABASE_KEY`. Der Schlüssel gehört nur in diese Datei: nie in andere Dateien, Tests, Fixtures, Logs oder Prompts. Ohne `env.js` läuft die Website mit den Demodaten weiter.
- `npm run seed` (Probelauf, offline): fasst die Testdaten «Siedlung Brunnenwiese» aus `js/data.js` zusammen und schreibt `supabase/seed_brunnenwiese.sql` (idempotentes `insert … on conflict (id) do nothing`, zum Einfügen im Supabase-SQL-Editor). `npm run seed -- --write` schreibt dieselben Zeilen per REST über `request()` aus `js/supabase.js` in die Datenbank, nur neue Zeilen, bestehende bleiben unverändert (Etappen verschiebt nur die App), und liest die Zeilenzahlen zurück; `--out <datei>` wählt den Pfad der SQL-Datei, `--help` zeigt die Optionen. Zeilen baut `js/seed-rows.js` (`buildSeedRows`, `inviteCodeFor`, `seedSql`), getestet in `tests/seed.test.js`.
- Regeln von Alex: Die Website schreibt nie in `assignments` (die Zuteilungen rechnet sein Solver in der App), verschiebt keine Etappen (nur `shiftPhase()` in der App) und löscht nichts. Jeder Einladungscode wird in der Verwaltung sichtbar (Mono-Schrift, Kopieren-Knopf); der Verwaltungscode erscheint nur für die angemeldete Verwaltung, nie auf einem Brief. Die Anfragen tragen nur den Header `apikey`, keinen `Authorization`-Header.
