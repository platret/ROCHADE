# ROCHADE Website (statisch)

Landingpage und Prototyp von Francesco. Reines HTML, CSS und ES-Module, kein Build nötig.

```
python3 -m http.server 8765 --directory website
```

- `index.html` Landingpage: Hero mit der live laufenden Siedlung (Monats-Scrubber), gepinnter Abschnitt «So funktioniert es» (die drei Schritte steuern den Plan), Dashboard-Mockup mit echtem Planer und Mini-Gantt, Abschnitt für Bewohnende, Problem in Zahlen (dunkles Band), Rechtslage und Parteien, Vergleich Leerkündigung/Rochade, Zielgruppen, CTA, 16 Quellen
- `app.html` Prototyp: 24 Haushalte, 3 Etappen, Regel-Planer (`js/planner.js`), Tests mit `node --test tests/*.test.js`
- `assets/` Logo «König und Turm überkreuz» als SVG (farbig, weiss, auf Orange, Favicon, Lockup), App-Screenshots in 640 px als WebP und PNG
- `css/landing.css` und `js/landing.js` gehören nur zur Landingpage; `css/stage.css` und `js/stage.js` teilen sich Landingpage und Prototyp (Option `maxScale` nur für die Landingpage)
- Motion: Scroll-gesteuerte Animationen nur mit `@supports`, alles respektiert `prefers-reduced-motion`; keine Cookies, kein Tracking, keine Drittskripte

Farben und Typografie-Tokens in `css/tokens.css` entsprechen `packages/shared/src/tokens.ts`.
